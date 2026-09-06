#!/usr/bin/env python3
"""Traceable, authorization-gated RAG-Anything lifecycle adapter.

The adapter keeps credentials in process memory, stores generated index data
outside learner Git, publishes only auditable receipts into the repository,
and refuses to ingest material outside explicit boundaries.
"""

from __future__ import annotations

import argparse
import asyncio
import dataclasses
import datetime as dt
import getpass
import hashlib
import importlib.metadata
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import tempfile
from typing import Any, Iterable
from urllib.parse import parse_qsl, urlsplit


ADAPTER_VERSION = "1"
REQUIRED_PACKAGES = {"raganything": "1.3.1", "lightrag-hku": "1.5.6"}
DEFAULT_BASE_URL = ""
DEFAULT_MODEL = ""
DEFAULT_EMBEDDING_DIM = 0
DENIED_PATH_PARTS = {".git", "example", "examples", "template", "templates"}
DENIED_FILENAMES = {".env", ".env.local", "credentials.json", "id_rsa", "id_ed25519"}
DENIED_SUFFIXES = {".key", ".p12", ".pfx", ".pem"}
TRACE_ID_PATTERN = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._/-]{0,255}$")
ENV_NAME_PATTERN = re.compile(r"^[A-Za-z_][A-Za-z0-9_]*$")
SENSITIVE_VALUES: set[str] = set()


class AdapterError(RuntimeError):
    """A safe, user-actionable adapter failure."""


@dataclasses.dataclass(frozen=True)
class Settings:
    learner_root: Path
    working_dir: Path
    base_url: str
    chat_model: str
    embedding_model: str
    embedding_dim: int
    embedding_base_url: str = ""
    chat_api_key_env: str = "GITLEARNOS_RAG_API_KEY"
    embedding_api_key_env: str = "GITLEARNOS_RAG_EMBEDDING_API_KEY"

    @property
    def receipts_dir(self) -> Path:
        return self.working_dir / "receipts"

    @property
    def published_receipts_dir(self) -> Path:
        return self.learner_root / ".gitlearnos" / "receipts"


@dataclasses.dataclass(frozen=True)
class PreparedIngest:
    source_id: str
    doc_id: str
    knowledge_ids: list[str]
    source: Path
    source_record: Path
    authorized_roots: list[Path]
    allow_paths: list[Path]
    inserted_text: str
    receipt: dict[str, Any]


def utc_now() -> str:
    return dt.datetime.now(dt.timezone.utc).isoformat()


def resolve_path(value: str | Path) -> Path:
    return Path(value).expanduser().resolve(strict=False)


def is_within(path: Path, boundary: Path) -> bool:
    try:
        resolve_path(path).relative_to(resolve_path(boundary))
        return True
    except ValueError:
        return False


def validate_trace_id(label: str, value: str) -> str:
    segments = value.split("/")
    if not TRACE_ID_PATTERN.fullmatch(value) or any(
        segment in {"", ".", ".."} for segment in segments
    ):
        raise AdapterError(
            f"{label} must be a stable relative identifier with safe path-like segments"
        )
    return value


def validate_base_url(value: str) -> str:
    parsed = urlsplit(value)
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        raise AdapterError("base URL must be an absolute http(s) URL")
    if parsed.username or parsed.password:
        raise AdapterError("base URL must not contain credentials")
    sensitive_names = {"api_key", "apikey", "key", "token", "access_token"}
    if any(name.lower() in sensitive_names for name, _ in parse_qsl(parsed.query)):
        raise AdapterError("base URL must not contain credential query parameters")
    return value.rstrip("/")


def mapping_value(value: Any, label: str) -> dict[str, Any]:
    if value is None:
        return {}
    if not isinstance(value, dict):
        raise AdapterError(f"{label} must be a mapping")
    return value


def configured_env_name(value: Any, *, label: str, default: str) -> str:
    name = value if value is not None else default
    if not isinstance(name, str) or not ENV_NAME_PATTERN.fullmatch(name):
        raise AdapterError(f"{label} must be a valid environment variable name")
    return name


def optional_base_url(value: Any, *, label: str) -> str:
    if value is None or value == "":
        return ""
    if not isinstance(value, str):
        raise AdapterError(f"{label} must be a string")
    return validate_base_url(value)


def optional_text(value: Any, *, label: str) -> str:
    if value is None or value == "":
        return ""
    if not isinstance(value, str):
        raise AdapterError(f"{label} must be a string")
    return value


def yaml_scalar(value: str) -> Any:
    value = value.strip()
    if value in {"", "null", "Null", "NULL", "~"}:
        return None
    if value in {"true", "True", "TRUE"}:
        return True
    if value in {"false", "False", "FALSE"}:
        return False
    if re.fullmatch(r"[+-]?\d+", value):
        return int(value)
    if len(value) >= 2 and value[0] == value[-1] and value[0] in {"'", '"'}:
        return value[1:-1]
    return value


def strip_yaml_comment(value: str) -> str:
    quote = ""
    for index, character in enumerate(value):
        if character in {"'", '"'}:
            quote = "" if quote == character else (character if not quote else quote)
        elif character == "#" and not quote and (index == 0 or value[index - 1].isspace()):
            return value[:index].rstrip()
    return value.rstrip()


def minimal_yaml_mapping(text: str) -> dict[str, Any]:
    """Parse the simple mapping-only GitLearnOS configuration without PyYAML.

    This fallback intentionally accepts the documented scalar/mapping layout and
    rejects constructs it cannot interpret, rather than guessing a provider
    configuration or silently ignoring a credential reference.
    """
    root: dict[str, Any] = {}
    stack: list[tuple[int, dict[str, Any]]] = [(-1, root)]
    for line_number, raw_line in enumerate(text.splitlines(), start=1):
        if not raw_line.strip() or raw_line.lstrip().startswith("#"):
            continue
        if "\t" in raw_line:
            raise AdapterError(f"gitlearnos.yml line {line_number}: tabs are not supported")
        indent = len(raw_line) - len(raw_line.lstrip(" "))
        content = strip_yaml_comment(raw_line.strip())
        if not content:
            continue
        match = re.fullmatch(r"([^:#][^:]*):(?:\s*(.*))?", content)
        if not match:
            raise AdapterError(
                f"gitlearnos.yml line {line_number}: install PyYAML for this YAML construct"
            )
        key, raw_value = match.groups()
        key = key.strip()
        while stack and indent <= stack[-1][0]:
            stack.pop()
        if not stack:
            raise AdapterError(f"gitlearnos.yml line {line_number}: invalid indentation")
        parent = stack[-1][1]
        if raw_value is None or raw_value == "":
            child: dict[str, Any] = {}
            parent[key] = child
            stack.append((indent, child))
        else:
            parent[key] = yaml_scalar(raw_value)
    return root


def load_configuration(config_path: Path) -> dict[str, Any]:
    try:
        text = config_path.read_text(encoding="utf-8")
    except OSError as exc:
        raise AdapterError("cannot read gitlearnos.yml") from exc
    try:
        import yaml
    except ImportError:
        config = minimal_yaml_mapping(text)
    else:
        config = yaml.safe_load(text) or {}
    if not isinstance(config, dict):
        raise AdapterError("gitlearnos.yml must be a mapping")
    return config


def public_template_root(path: Path) -> bool:
    package = path / "package.json"
    if not (package.is_file() and (path / "GITLEARNOS.md").is_file()):
        return False
    try:
        package_data = json.loads(package.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return False
    return (
        package_data.get("name") == "gitlearnos"
        and (path / "skills" / "gitlearnos" / "SKILL.md").is_file()
        and not (path / "gitlearnos.yml").is_file()
    )


def containing_public_template(path: Path) -> Path | None:
    for candidate in (path, *path.parents):
        if public_template_root(candidate):
            return candidate
    return None


def check_path_name(path: Path) -> None:
    lowered_parts = {part.lower() for part in path.parts}
    if lowered_parts & DENIED_PATH_PARTS:
        denied = sorted(lowered_parts & DENIED_PATH_PARTS)[0]
        raise AdapterError(f"refusing prohibited path segment: {denied}")
    if path.name.lower() in DENIED_FILENAMES or path.suffix.lower() in DENIED_SUFFIXES:
        raise AdapterError(f"refusing secret-bearing file type or name: {path.name}")


def validate_ingest_paths(
    *,
    learner_root: Path,
    source: Path,
    source_record: Path,
    authorized_roots: Iterable[Path],
    allow_paths: Iterable[Path],
) -> tuple[list[Path], list[Path]]:
    learner_root = learner_root.resolve(strict=True)
    source = source.resolve(strict=True)
    source_record = source_record.resolve(strict=True)
    roots = [item.resolve(strict=True) for item in authorized_roots]
    allowlist = [item.resolve(strict=True) for item in allow_paths]

    if public_template_root(learner_root):
        raise AdapterError("the public GitLearnOS template cannot be a learner repository")
    if not roots:
        raise AdapterError("at least one --authorized-root is required")
    unsafe_roots = {Path("/").resolve(), Path.home().resolve()}
    if any(root in unsafe_roots for root in roots):
        raise AdapterError("authorized roots must be narrower than the filesystem root or home")
    if not source.is_file():
        raise AdapterError("source must be a regular file")
    if not source_record.is_file():
        raise AdapterError("source record must be an existing regular file")
    if not is_within(source_record, learner_root):
        raise AdapterError("source record must be inside the learner Git repository")
    if not any(is_within(source, root) for root in roots):
        raise AdapterError("source is outside every authorized root")
    if allowlist and not any(is_within(source, item) or source == item for item in allowlist):
        raise AdapterError("source is outside the explicit allowlist")
    if containing_public_template(source):
        raise AdapterError("refusing to index material from a public GitLearnOS template")
    check_path_name(source)

    for root in roots:
        if public_template_root(root):
            raise AdapterError("the public GitLearnOS template cannot be an authorized root")
    verify_git_source_record(learner_root, source_record)
    return roots, allowlist


def git_output(learner_root: Path, *args: str) -> str:
    result = subprocess.run(
        ["git", "-C", str(learner_root), *args],
        check=False,
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        raise AdapterError("learner root must be a readable Git repository")
    return result.stdout.strip()


def verify_git_source_record(learner_root: Path, source_record: Path) -> str:
    top = resolve_path(git_output(learner_root, "rev-parse", "--show-toplevel"))
    if top != learner_root.resolve():
        raise AdapterError("--learner-root must be the Git repository root")
    relative = source_record.relative_to(learner_root).as_posix()
    result = subprocess.run(
        ["git", "-C", str(learner_root), "ls-files", "--error-unmatch", "--", relative],
        check=False,
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        raise AdapterError("source record must already be tracked by Git")
    dirty = subprocess.run(
        ["git", "-C", str(learner_root), "status", "--porcelain", "--", relative],
        check=False,
        capture_output=True,
        text=True,
    )
    if dirty.returncode != 0 or dirty.stdout.strip():
        raise AdapterError("source record must be committed before ingestion")
    return relative


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def contains_probable_secret(text: str) -> bool:
    patterns = (
        r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----",
        r"(?i)\b(?:api[_-]?key|access[_-]?token|client[_-]?secret)\s*[:=]\s*['\"]?[A-Za-z0-9_-]{20,}",
        r"\bsk-[A-Za-z0-9_-]{20,}\b",
    )
    return any(re.search(pattern, text) for pattern in patterns)


def build_insert_text(
    *,
    source_text: str,
    source_record_relative: str,
    source_id: str,
    knowledge_ids: list[str],
    doc_id: str,
    source_sha256: str,
) -> str:
    metadata = {
        "doc_id": doc_id,
        "source_id": source_id,
        "knowledge_ids": knowledge_ids,
        "git_source_record": source_record_relative,
        "source_sha256": source_sha256,
    }
    marker = json.dumps(metadata, ensure_ascii=False, sort_keys=True)
    return f"GitLearnOS provenance: {marker}\n\n{source_text}\n\nGitLearnOS provenance: {marker}\n"


def atomic_write_json(path: Path, value: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    payload = json.dumps(value, ensure_ascii=False, indent=2, sort_keys=True, default=str) + "\n"
    descriptor, temporary = tempfile.mkstemp(prefix=f".{path.name}.", dir=path.parent)
    try:
        os.fchmod(descriptor, 0o600)
        with os.fdopen(descriptor, "w", encoding="utf-8") as handle:
            handle.write(payload)
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(temporary, path)
    except BaseException:
        try:
            os.unlink(temporary)
        except FileNotFoundError:
            pass
        raise


def receipt_path(settings: Settings, doc_id: str) -> Path:
    validate_trace_id("doc_id", doc_id)
    filename = hashlib.sha256(doc_id.encode("utf-8")).hexdigest() + ".json"
    return settings.receipts_dir / filename


def published_receipt_path(settings: Settings, doc_id: str) -> Path:
    validate_trace_id("doc_id", doc_id)
    filename = "rag-" + hashlib.sha256(doc_id.encode("utf-8")).hexdigest() + ".json"
    return settings.published_receipts_dir / filename


def write_receipt(settings: Settings, doc_id: str, value: dict[str, Any]) -> None:
    """Atomically update adapter state and the Git-visible external receipt."""
    atomic_write_json(receipt_path(settings, doc_id), value)
    atomic_write_json(published_receipt_path(settings, doc_id), value)


def load_receipt(settings: Settings, doc_id: str) -> dict[str, Any]:
    path = receipt_path(settings, doc_id)
    try:
        value = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise AdapterError(f"no adapter receipt exists for doc_id {doc_id}") from exc
    except json.JSONDecodeError as exc:
        raise AdapterError(f"receipt for doc_id {doc_id} is invalid JSON") from exc
    if not isinstance(value, dict) or value.get("doc_id") != doc_id:
        raise AdapterError(f"receipt identity mismatch for doc_id {doc_id}")
    return value


def installed_versions() -> dict[str, str | None]:
    versions: dict[str, str | None] = {}
    for package in REQUIRED_PACKAGES:
        try:
            versions[package] = importlib.metadata.version(package)
        except importlib.metadata.PackageNotFoundError:
            versions[package] = None
    return versions


def require_runtime_versions() -> dict[str, str]:
    versions = installed_versions()
    mismatches = [
        f"{package}={versions[package] or 'missing'} (required {required})"
        for package, required in REQUIRED_PACKAGES.items()
        if versions[package] != required
    ]
    if mismatches:
        raise AdapterError("incompatible RAG runtime: " + ", ".join(mismatches))
    return {name: version for name, version in versions.items() if version is not None}


def jsonable(value: Any) -> Any:
    if value is None or isinstance(value, (str, int, float, bool)):
        return value
    if isinstance(value, dict):
        return {str(key): jsonable(item) for key, item in value.items()}
    if isinstance(value, (list, tuple, set)):
        return [jsonable(item) for item in value]
    if dataclasses.is_dataclass(value):
        return jsonable(dataclasses.asdict(value))
    if hasattr(value, "model_dump"):
        return jsonable(value.model_dump())
    if hasattr(value, "__dict__"):
        return jsonable(vars(value))
    return str(value)


def redact(value: Any, secrets: Iterable[str] = ()) -> Any:
    secret_values = sorted({item for item in secrets if item}, key=len, reverse=True)

    def clean(text: str) -> str:
        for secret in secret_values:
            text = text.replace(secret, "[REDACTED]")
        text = re.sub(r"(?i)(authorization\s*[:=]\s*bearer\s+)[^\s,;}]+", r"\1[REDACTED]", text)
        text = re.sub(r"\bsk-[A-Za-z0-9_-]{10,}\b", "[REDACTED]", text)
        text = re.sub(
            r"(?i)((?:api[_-]?key|access[_-]?token|client[_-]?secret)\s*[:=]\s*)[^\s,;}]+",
            r"\1[REDACTED]",
            text,
        )
        return text

    if isinstance(value, str):
        return clean(value)
    if isinstance(value, dict):
        return {clean(str(key)): redact(item, secret_values) for key, item in value.items()}
    if isinstance(value, (list, tuple, set)):
        return [redact(item, secret_values) for item in value]
    return value


def normalize_status(value: Any) -> dict[str, Any]:
    converted = jsonable(value)
    return converted if isinstance(converted, dict) else {"value": converted}


def verified_retrieval_chunks(
    query_data: Any, *, doc_id: str, source_id: str
) -> list[dict[str, Any]]:
    """Return chunks whose provider ID and embedded provenance both match."""
    if not isinstance(query_data, dict) or query_data.get("status") != "success":
        return []
    data = query_data.get("data")
    chunks = data.get("chunks") if isinstance(data, dict) else None
    if not isinstance(chunks, list):
        return []
    doc_marker = f'"doc_id": {json.dumps(doc_id, ensure_ascii=False)}'
    source_marker = f'"source_id": {json.dumps(source_id, ensure_ascii=False)}'
    return [
        chunk
        for chunk in chunks
        if isinstance(chunk, dict)
        and isinstance(chunk.get("chunk_id"), str)
        and chunk["chunk_id"].startswith(f"{doc_id}-chunk-")
        and isinstance(chunk.get("content"), str)
        and doc_marker in chunk["content"]
        and source_marker in chunk["content"]
    ]


def get_api_key(prompt: bool, env_name: str = "GITLEARNOS_RAG_API_KEY") -> str:
    key = os.environ.get(env_name, "")
    if not key and prompt:
        key = getpass.getpass(f"RAG provider API key for {env_name} (hidden): ")
    if not key:
        raise AdapterError(
            f"set {env_name} or pass --prompt-api-key; the key is never stored"
        )
    SENSITIVE_VALUES.add(key)
    return key


class Runtime:
    def __init__(self, settings: Settings, api_key: str):
        require_runtime_versions()
        try:
            import numpy as np
            from lightrag.utils import EmbeddingFunc
            from openai import AsyncOpenAI
            from raganything import RAGAnything, RAGAnythingConfig
        except ImportError as exc:
            raise AdapterError(f"RAG runtime import failed: {type(exc).__name__}") from exc

        if (
            not settings.base_url
            or not settings.embedding_base_url
            or not settings.chat_model
            or not settings.embedding_model
            or settings.embedding_dim <= 0
        ):
            raise AdapterError("complete rag.chat and rag.embedding configuration during setup")
        self.settings = settings
        self.observed_embedding_response_models: set[str] = set()
        self.successful_llm_calls = 0
        embedding_key = os.environ.get(settings.embedding_api_key_env, "")
        if not embedding_key:
            raise AdapterError("set the configured embedding credential environment variable")
        SENSITIVE_VALUES.add(embedding_key)
        self.client = AsyncOpenAI(
            api_key=api_key,
            base_url=settings.base_url,
            timeout=120,
            max_retries=1,
        )
        self.embedding_client = AsyncOpenAI(
            api_key=embedding_key,
            base_url=settings.embedding_base_url,
            timeout=120,
            max_retries=1,
        )

        async def llm(
            prompt: str,
            system_prompt: str | None = None,
            history_messages: list[dict[str, Any]] | None = None,
            **_: Any,
        ) -> str:
            messages = []
            if system_prompt:
                messages.append({"role": "system", "content": system_prompt})
            messages.extend(history_messages or [])
            messages.append({"role": "user", "content": prompt})
            result = await self.client.chat.completions.create(
                model=settings.chat_model,
                messages=messages,
                max_tokens=int(os.environ.get("GITLEARNOS_RAG_MAX_TOKENS", "8192")),
            )
            choice = result.choices[0]
            if choice.finish_reason == "length":
                raise AdapterError("LLM response was truncated")
            if not choice.message.content:
                raise AdapterError("LLM returned no answer content")
            self.successful_llm_calls += 1
            return choice.message.content

        async def embed(texts: list[str], **_: Any):
            result = await self.embedding_client.embeddings.create(
                model=settings.embedding_model,
                input=texts,
                encoding_format="float",
            )
            if result.model:
                self.observed_embedding_response_models.add(result.model)
            ordered = [item.embedding for item in sorted(result.data, key=lambda item: item.index)]
            array = np.array(ordered)
            if array.shape != (len(texts), settings.embedding_dim) or not np.isfinite(array).all():
                raise AdapterError(
                    f"embedding shape {array.shape} does not match configured "
                    f"({len(texts)}, {settings.embedding_dim}) or contains non-finite values"
                )
            return array

        path_dir = Path(sys.executable).parent
        os.environ["PATH"] = str(path_dir) + os.pathsep + os.environ.get("PATH", "")
        self.rag = RAGAnything(
            config=RAGAnythingConfig(
                working_dir=str(settings.working_dir),
                enable_image_processing=False,
                enable_table_processing=False,
                enable_equation_processing=False,
            ),
            llm_model_func=llm,
            embedding_func=EmbeddingFunc(
                embedding_dim=settings.embedding_dim,
                func=embed,
                model_name=settings.embedding_model,
            ),
            lightrag_kwargs={
                "entity_extract_max_gleaning": 0,
                "llm_model_max_async": 1,
                "embedding_func_max_async": 1,
                "llm_model_name": settings.chat_model,
            },
        )

    async def initialize(self) -> None:
        result = await self.rag._ensure_lightrag_initialized()
        if not result.get("success"):
            raise AdapterError(f"RAG-Anything initialization failed: {jsonable(result)}")

    async def close(self) -> None:
        if self.rag.lightrag:
            await self.rag.lightrag.finalize_storages()
        await self.client.close()
        await self.embedding_client.close()


def make_settings(args: argparse.Namespace) -> Settings:
    learner_value = args.learner_root or os.environ.get("GITLEARNOS_REPO")
    if not learner_value:
        raise AdapterError("pass --learner-root or set GITLEARNOS_REPO")
    learner_root = resolve_path(learner_value)
    if not learner_root.is_dir():
        raise AdapterError("learner root does not exist")
    config_path = learner_root / "gitlearnos.yml"
    config = {}
    if config_path.exists():
        config = load_configuration(config_path)
    rag_config = mapping_value(config.get("rag"), "rag")
    chat = mapping_value(rag_config.get("chat"), "rag.chat")
    embedding = mapping_value(rag_config.get("embedding"), "rag.embedding")
    working_value = args.working_dir or os.environ.get("GITLEARNOS_RAG_WORKING_DIR")
    if working_value:
        working_dir = resolve_path(working_value)
    elif rag_config.get("working_dir"):
        if not isinstance(rag_config["working_dir"], str):
            raise AdapterError("rag.working_dir must be a string")
        configured_working_dir = Path(rag_config["working_dir"]).expanduser()
        working_dir = resolve_path(
            configured_working_dir
            if configured_working_dir.is_absolute()
            else learner_root / configured_working_dir
        )
    else:
        data_home = resolve_path(
            os.environ.get("XDG_DATA_HOME", Path.home() / ".local" / "share")
        )
        repository_key = hashlib.sha256(str(learner_root).encode("utf-8")).hexdigest()[:16]
        working_dir = data_home / "gitlearnos" / "rag-anything" / repository_key
    if working_dir in {Path("/").resolve(), Path.home().resolve(), learner_root}:
        raise AdapterError("working directory must be a dedicated subdirectory")
    if is_within(working_dir, learner_root):
        relative = working_dir.relative_to(learner_root).as_posix()
        ignored = subprocess.run(["git", "-C", str(learner_root), "check-ignore", "-q", "--", relative + "/"], capture_output=True)
        tracked = git_output(learner_root, "ls-files", "--", relative)
        if ignored.returncode != 0 or tracked:
            raise AdapterError("index must be outside the learner Git repository or ignored and untracked")
    if is_within(working_dir, Path(__file__).resolve().parents[3]) and public_template_root(
        Path(__file__).resolve().parents[3]
    ):
        raise AdapterError("refusing to place a learner index inside the public template")
    try:
        embedding_dim = int(
            args.embedding_dim
            if args.embedding_dim is not None
            else os.environ.get("GITLEARNOS_RAG_EMBEDDING_DIM")
            if os.environ.get("GITLEARNOS_RAG_EMBEDDING_DIM") is not None
            else embedding.get("dimensions", DEFAULT_EMBEDDING_DIM)
        )
    except (TypeError, ValueError) as exc:
        raise AdapterError("embedding dimension must be an integer") from exc
    if embedding_dim < 0:
        raise AdapterError("embedding dimension must be positive")
    return Settings(
        learner_root=learner_root,
        working_dir=working_dir,
        base_url=optional_base_url(
            args.base_url
            if args.base_url is not None
            else os.environ.get("GITLEARNOS_RAG_BASE_URL")
            if os.environ.get("GITLEARNOS_RAG_BASE_URL") is not None
            else chat.get("base_url", DEFAULT_BASE_URL),
            label="rag.chat.base_url",
        ),
        chat_model=optional_text(
            args.chat_model
            if args.chat_model is not None
            else os.environ.get("GITLEARNOS_RAG_CHAT_MODEL")
            if os.environ.get("GITLEARNOS_RAG_CHAT_MODEL") is not None
            else chat.get("model", DEFAULT_MODEL),
            label="rag.chat.model",
        ),
        embedding_model=optional_text(
            args.embedding_model
            if args.embedding_model is not None
            else os.environ.get("GITLEARNOS_RAG_EMBEDDING_MODEL")
            if os.environ.get("GITLEARNOS_RAG_EMBEDDING_MODEL") is not None
            else embedding.get("model", DEFAULT_MODEL),
            label="rag.embedding.model",
        ),
        embedding_dim=embedding_dim,
        embedding_base_url=optional_base_url(
            getattr(args, "embedding_base_url", None)
            if getattr(args, "embedding_base_url", None) is not None
            else os.environ.get("GITLEARNOS_RAG_EMBEDDING_BASE_URL")
            if os.environ.get("GITLEARNOS_RAG_EMBEDDING_BASE_URL") is not None
            else embedding.get("base_url", ""),
            label="rag.embedding.base_url",
        ),
        chat_api_key_env=configured_env_name(
            chat.get("api_key_env"),
            label="rag.chat.api_key_env",
            default="GITLEARNOS_RAG_API_KEY",
        ),
        embedding_api_key_env=configured_env_name(
            embedding.get("api_key_env"),
            label="rag.embedding.api_key_env",
            default="GITLEARNOS_RAG_EMBEDDING_API_KEY",
        ),
    )


def base_receipt(
    settings: Settings,
    *,
    source: Path,
    source_record: Path,
    source_id: str,
    knowledge_ids: list[str],
    doc_id: str,
    authorized_roots: list[Path],
    allow_paths: list[Path],
) -> dict[str, Any]:
    relative_record = source_record.resolve().relative_to(settings.learner_root.resolve()).as_posix()
    observed_at = utc_now()
    return {
        "schema": "gitlearnos.external-receipt/v1",
        "kind": "rag",
        "provider": "rag-anything",
        "schema_version": 1,
        "adapter_version": ADAPTER_VERSION,
        "status": "pending",
        "doc_id": doc_id,
        "source_id": source_id,
        "knowledge_ids": knowledge_ids,
        "source_path": str(source),
        "source_sha256": file_sha256(source),
        "git_source_record": {
            "path": relative_record,
            "base_revision": git_output(settings.learner_root, "rev-parse", "HEAD"),
            "content_sha256": file_sha256(source_record),
        },
        "source_boundary": {
            "roots": [str(item) for item in authorized_roots],
            "allowlist": [str(item) for item in allow_paths],
            "evidence": "source resolved inside an inspected authorized root"
            + (" and explicit allowlist" if allow_paths else ""),
        },
        "authorized_roots": [str(item) for item in authorized_roots],
        "allow_paths": [str(item) for item in allow_paths],
        "working_dir": str(settings.working_dir),
        "observed_at": observed_at,
        "ingested_at": observed_at,
        "ingest": {
            "status": "available",
            "evidence": "structured UTF-8 insertion is configured but not yet observed",
        },
        "query": {
            "status": "available",
            "evidence": "known-fact verification has not yet observed source-specific retrieval",
        },
        "rebuild": {
            "status": "available",
            "evidence": "receipt contains the authorized source locator and delete-then-insert boundary",
        },
        "delete": {
            "status": "available",
            "evidence": "deletion is restricted to this receipt-owned doc_id",
        },
        "runtime": {
            "packages": require_runtime_versions(),
            "chat_base_url": settings.base_url,
            "chat_model": settings.chat_model,
            "chat_api_key_env": settings.chat_api_key_env,
            "embedding_base_url": settings.embedding_base_url,
            "embedding_request_model": settings.embedding_model,
            "embedding_api_key_env": settings.embedding_api_key_env,
            "embedding_dimension": settings.embedding_dim,
            "index_embedding_fingerprint": embedding_fingerprint(settings),
        },
        "query_verification": {"status": "not-run"},
        "synchronization": {
            "status": "pending",
            "evidence": "committed Git source record was verified before external index synchronization",
        },
        "deletion_boundary": {
            "doc_id": doc_id,
            "adapter_receipt": str(receipt_path(settings, doc_id)),
            "git_receipt": published_receipt_path(settings, doc_id)
            .relative_to(settings.learner_root)
            .as_posix(),
            "index": str(settings.working_dir),
        },
    }


def embedding_fingerprint(settings: Settings) -> dict[str, Any]:
    """The embedding identity that determines whether an index can be reused."""
    return {
        "base_url": settings.embedding_base_url,
        "model": settings.embedding_model,
        "dimensions": settings.embedding_dim,
    }


def require_matching_embedding_fingerprint(
    settings: Settings, receipt: dict[str, Any], *, doc_id: str
) -> None:
    runtime = receipt.get("runtime")
    recorded = runtime.get("index_embedding_fingerprint") if isinstance(runtime, dict) else None
    if not isinstance(recorded, dict):
        # Older receipts did not record enough information to safely decide if
        # their vectors can be reused. Treat them as a required replay, not as
        # a compatible default.
        raise AdapterError(
            f"receipt {doc_id} lacks an embedding index fingerprint; choose a new index and replay sources"
        )
    if recorded != embedding_fingerprint(settings):
        raise AdapterError(
            f"receipt {doc_id} uses a different embedding endpoint, model, or dimension; choose a new index and replay sources"
        )


def receipt_staleness_reason(settings: Settings, receipt: dict[str, Any]) -> str:
    record_meta = receipt.get("git_source_record")
    source_path = receipt.get("source_path")
    if not isinstance(record_meta, dict) or not isinstance(source_path, str):
        return "receipt is missing traceable Git/source metadata"
    record_path = settings.learner_root / str(record_meta.get("path", ""))
    if (
        not is_within(record_path.resolve(), settings.learner_root.resolve())
        or not record_path.is_file()
        or file_sha256(record_path) != record_meta.get("content_sha256")
    ):
        return "Git source record is missing or differs from the recorded hash"
    source = Path(source_path)
    if not source.is_file() or file_sha256(source) != receipt.get("source_sha256"):
        return "source is missing or differs from the recorded hash"
    return ""


def prepare_ingest(args: argparse.Namespace, settings: Settings) -> PreparedIngest:
    source_id = validate_trace_id("source_id", args.source_id)
    doc_id = validate_trace_id("doc_id", args.doc_id)
    knowledge_ids = list(
        dict.fromkeys(validate_trace_id("knowledge_id", item) for item in args.knowledge_id)
    )
    if not knowledge_ids:
        raise AdapterError("at least one --knowledge-id is required")
    source = resolve_path(args.source)
    source_record = resolve_path(args.source_record)
    roots, allowlist = validate_ingest_paths(
        learner_root=settings.learner_root,
        source=source,
        source_record=source_record,
        authorized_roots=[resolve_path(item) for item in args.authorized_root],
        allow_paths=[resolve_path(item) for item in args.allow_path],
    )
    if is_within(source, settings.working_dir):
        raise AdapterError("the source cannot come from the generated index/receipt directory")
    try:
        source_text = source.read_text(encoding="utf-8")
    except UnicodeDecodeError as exc:
        raise AdapterError(
            "this release accepts UTF-8 text/Markdown through verified structured insertion"
        ) from exc
    if not source_text.strip():
        raise AdapterError("refusing to ingest an empty source")
    if contains_probable_secret(source_text):
        raise AdapterError("source appears to contain a credential or private key")
    receipt = base_receipt(
        settings,
        source=source,
        source_record=source_record,
        source_id=source_id,
        knowledge_ids=knowledge_ids,
        doc_id=doc_id,
        authorized_roots=roots,
        allow_paths=allowlist,
    )
    inserted_text = build_insert_text(
        source_text=source_text,
        source_record_relative=receipt["git_source_record"]["path"],
        source_id=source_id,
        knowledge_ids=knowledge_ids,
        doc_id=doc_id,
        source_sha256=receipt["source_sha256"],
    )
    return PreparedIngest(
        source_id=source_id,
        doc_id=doc_id,
        knowledge_ids=knowledge_ids,
        source=source,
        source_record=source_record,
        authorized_roots=roots,
        allow_paths=allowlist,
        inserted_text=inserted_text,
        receipt=receipt,
    )


async def ingest(
    args: argparse.Namespace,
    settings: Settings,
    *,
    rebuilding: bool = False,
    prepared: PreparedIngest | None = None,
    api_key_override: str | None = None,
) -> dict[str, Any]:
    prepared = prepared or prepare_ingest(args, settings)
    existing_path = receipt_path(settings, prepared.doc_id)
    if existing_path.exists() and not rebuilding:
        existing = load_receipt(settings, prepared.doc_id)
        if existing.get("status") != "deleted":
            raise AdapterError("active doc_id already exists; use rebuild to replace it")

    receipt = prepared.receipt
    # Persist the recoverable pending boundary before any provider call. The
    # adapter never commits this receipt; callers commit it when authorized.
    receipt["deployment_status"] = "incomplete"
    receipt["deployment_reason"] = "external index synchronization is pending"
    write_receipt(settings, prepared.doc_id, redact(receipt))
    api_key = api_key_override or get_api_key(args.prompt_api_key, settings.chat_api_key_env)
    runtime: Runtime | None = None
    runtime_closed = False
    try:
        runtime = Runtime(settings, api_key)
        await runtime.initialize()
        await runtime.rag.insert_content_list(
            [{"type": "text", "text": prepared.inserted_text, "page_idx": 0}],
            file_path=str(prepared.source),
            doc_id=prepared.doc_id,
        )
        doc_status_raw = await runtime.rag.lightrag.doc_status.get_by_id(prepared.doc_id)
        doc_status = normalize_status(doc_status_raw)
        chunks = int(doc_status.get("chunks_count", 0) or 0)
        processed = doc_status.get("status") == "processed"
        await runtime.close()
        runtime_closed = True
        if (
            not processed
            or chunks <= 0
            or not runtime.observed_embedding_response_models
        ):
            raise AdapterError(
                "ingestion did not produce a processed document with nonzero chunks "
                "and an observed successful embedding call after storage finalization"
            )
        receipt["ingest_evidence"] = {
            "status": doc_status.get("status"),
            "chunks_count": chunks,
            "inserted_text_length": len(prepared.inserted_text),
            "successful_llm_calls": runtime.successful_llm_calls,
            "observed_embedding_response_models": sorted(
                runtime.observed_embedding_response_models
            ),
        }
        receipt["ingest"] = {
            **receipt["ingest_evidence"],
            "status": "completed",
            "run_id": f"ingest-{prepared.doc_id}-{receipt['ingested_at']}",
            "evidence": f"provider reported processed with {chunks} nonzero chunks",
            "document_status": receipt["ingest_evidence"]["status"],
        }
        receipt["deployment_status"] = "incomplete"
        receipt["deployment_reason"] = "source-specific query has not been verified"
        receipt["synchronization"] = {
            "status": "synchronized",
            "evidence": "provider reported a processed receipt-owned document with nonzero chunks",
        }
        write_receipt(settings, prepared.doc_id, redact(receipt, [api_key]))
        return receipt
    except Exception as exc:
        receipt["status"] = "ingest-failed"
        receipt["observed_at"] = utc_now()
        receipt["ingest"] = {
            "status": "failed",
            "evidence": f"ingestion failed with {type(exc).__name__}; provider state requires explicit inspection or deletion",
        }
        receipt["deployment_status"] = "incomplete"
        receipt["deployment_reason"] = "ingestion did not complete with verified nonzero chunks"
        receipt["synchronization"] = {
            "status": "failed",
            "evidence": "the pending Git evidence remains recoverable; inspect or delete the provider document before retrying",
        }
        write_receipt(settings, prepared.doc_id, redact(receipt, [api_key]))
        raise
    finally:
        if runtime is not None and not runtime_closed:
            await runtime.close()


async def delete_document(
    args: argparse.Namespace,
    settings: Settings,
    *,
    for_rebuild: bool = False,
    api_key_override: str | None = None,
) -> dict[str, Any]:
    doc_id = validate_trace_id("doc_id", args.doc_id)
    source_id = validate_trace_id("source_id", args.source_id)
    receipt = load_receipt(settings, doc_id)
    if receipt.get("source_id") != source_id:
        raise AdapterError("source_id does not match the existing receipt")
    if receipt.get("status") not in {"ingested", "ingest-failed"}:
        raise AdapterError("receipt is not active; there is nothing in its deletion boundary")
    api_key = api_key_override or get_api_key(args.prompt_api_key, settings.chat_api_key_env)
    runtime = Runtime(settings, api_key)
    try:
        await runtime.initialize()
        deletion = await runtime.rag.lightrag.adelete_by_doc_id(
            doc_id,
            delete_llm_cache=False,
        )
        status = await runtime.rag.lightrag.doc_status.get_by_id(doc_id)
        full_doc = await runtime.rag.lightrag.full_docs.get_by_id(doc_id)
        if status is not None or full_doc is not None:
            raise AdapterError("document remains in one or more stores after deletion")
        result = {
            "doc_id": doc_id,
            "source_id": source_id,
            "deleted": True,
            "deletion": jsonable(deletion),
            "boundary": receipt["deletion_boundary"],
        }
        receipt["status"] = "rebuilding-deleted" if for_rebuild else "deleted"
        receipt["deleted_at"] = utc_now()
        receipt["delete_evidence"] = result
        receipt["delete"] = {
            "status": "completed",
            "run_id": f"delete-{doc_id}-{receipt['deleted_at']}",
            "evidence": "doc_status and full_docs no longer contain the receipt-owned doc_id",
        }
        receipt["observed_at"] = receipt["deleted_at"]
        receipt["deployment_status"] = "incomplete"
        receipt["deployment_reason"] = (
            "old document was deleted and replacement is pending"
            if for_rebuild
            else "document was deleted"
        )
        write_receipt(settings, doc_id, redact(receipt, [api_key]))
        return result
    finally:
        await runtime.close()


async def verify(args: argparse.Namespace, settings: Settings) -> dict[str, Any]:
    doc_id = validate_trace_id("doc_id", args.doc_id)
    source_id = validate_trace_id("source_id", args.source_id)
    receipt = load_receipt(settings, doc_id)
    if receipt.get("status") != "ingested" or receipt.get("source_id") != source_id:
        raise AdapterError("query identifiers do not match an active adapter receipt")
    constrained_question = (
        f"Use the source whose GitLearnOS provenance has doc_id={doc_id} and "
        f"source_id={source_id}. Cite that provenance.\n\nQuestion: {args.question}"
    )
    api_key = get_api_key(args.prompt_api_key, settings.chat_api_key_env)
    runtime = Runtime(settings, api_key)
    try:
        await runtime.initialize()
        from lightrag import QueryParam

        query_data = await runtime.rag.lightrag.aquery_data(
            constrained_question,
            param=QueryParam(mode=args.mode, enable_rerank=False),
        )
        matched_chunks = verified_retrieval_chunks(
            query_data, doc_id=doc_id, source_id=source_id
        )
        context_text = "\n\n".join(chunk["content"] for chunk in matched_chunks)
        doc_id_matched = bool(matched_chunks)
        source_id_matched = bool(matched_chunks)
        provenance_matched = bool(matched_chunks)
        # Deployment acceptance is a retrieval check. Do not treat a generated
        # response as proof that the known fact is present in source evidence.
        combined_retrieval = context_text
        expected_matches = {item: item in combined_retrieval for item in args.expect}
        matched = provenance_matched and all(expected_matches.values())
        receipt["query_verification"] = {
            "status": "verified" if matched else "incomplete",
            "queried_at": utc_now(),
            "mode": args.mode,
            "doc_id_matched": doc_id_matched,
            "source_id_matched": source_id_matched,
            "matched_chunk_ids": [chunk["chunk_id"] for chunk in matched_chunks],
            "expected_matches": expected_matches,
            "context_sha256": hashlib.sha256(context_text.encode()).hexdigest(),
        }
        receipt["query"] = {
            **receipt["query_verification"],
            "status": "completed" if matched else "failed",
            "run_id": f"query-{doc_id}-{receipt['query_verification']['queried_at']}",
            "evidence": (
                "retrieval contained exact provenance markers and every expected source fact"
                if matched
                else "retrieval missed an exact provenance marker or expected source fact"
            ),
            "verification_status": receipt["query_verification"]["status"],
        }
        receipt["observed_at"] = receipt["query_verification"]["queried_at"]
        receipt["deployment_status"] = "enabled" if matched else "incomplete"
        receipt["deployment_reason"] = (
            "real ingest and source-specific fact query verified"
            if matched
            else "retrieval did not contain provenance identifiers and every expected fact"
        )
        write_receipt(settings, doc_id, redact(receipt, [api_key]))
        result = {
            "doc_id": doc_id,
            "source_id": source_id,
            "source_specific": matched,
            "deployment_status": receipt["deployment_status"],
            "evidence": [
                {
                    "chunk_id": chunk["chunk_id"],
                    "text": chunk["content"],
                    "source_id": source_id,
                    "doc_id": doc_id,
                    "locator": receipt["source_path"],
                    "source_sha256": receipt["source_sha256"],
                    "git_source_record": receipt["git_source_record"],
                }
                for chunk in matched_chunks
            ],
        }
        if not matched:
            raise AdapterError(
                "source-specific query was incomplete: provenance or expected facts were not retrieved"
            )
        return result
    except Exception as exc:
        if (receipt.get("query") or {}).get("status") != "failed":
            receipt["query"] = {
                "status": "failed",
                "evidence": f"source-specific query failed with {type(exc).__name__}",
            }
            receipt["query_verification"] = {"status": "incomplete"}
        receipt["deployment_status"] = "incomplete"
        receipt["deployment_reason"] = "the latest source-specific query did not verify retrieval"
        receipt["observed_at"] = utc_now()
        write_receipt(settings, doc_id, redact(receipt, [api_key]))
        raise
    finally:
        await runtime.close()


async def rebuild(args: argparse.Namespace, settings: Settings) -> dict[str, Any]:
    prepared = prepare_ingest(args, settings)
    existing = load_receipt(settings, prepared.doc_id)
    same_boundary = (
        existing.get("source_id") == prepared.source_id
        and existing.get("source_path") == str(prepared.source)
        and (existing.get("git_source_record") or {}).get("path")
        == prepared.receipt["git_source_record"]["path"]
        and existing.get("knowledge_ids") == prepared.knowledge_ids
    )
    if not same_boundary or existing.get("status") != "ingested":
        raise AdapterError("rebuild requires a matching active receipt")
    api_key = get_api_key(args.prompt_api_key, settings.chat_api_key_env)
    deletion = await delete_document(
        args,
        settings,
        for_rebuild=True,
        api_key_override=api_key,
    )
    # Keep the completed deletion boundary in every replacement outcome. If
    # reinsertion fails, the pending/failed receipt still tells the caller what
    # happened and how to recover from the committed source record.
    prepared.receipt["rebuild"] = {
        "status": "available",
        "run_id": f"rebuild-{prepared.doc_id}-{utc_now()}",
        "evidence": "the receipt-owned prior document was deleted before replacement insertion",
        "delete_evidence": deletion,
    }
    ingestion = await ingest(
        args,
        settings,
        rebuilding=True,
        prepared=prepared,
        api_key_override=api_key,
    )
    ingestion["rebuild_evidence"] = {"deleted_before_insert": deletion["deleted"]}
    ingestion["rebuild"] = {
        "status": "completed",
        "run_id": f"rebuild-{prepared.doc_id}-{utc_now()}",
        "evidence": "the receipt-owned prior document was deleted before structured reinsertion",
        **ingestion["rebuild_evidence"],
    }
    ingestion["observed_at"] = utc_now()
    write_receipt(settings, args.doc_id, ingestion)
    return ingestion


def active_receipts_for_query(
    settings: Settings, knowledge_ids: list[str]
) -> tuple[list[dict[str, Any]], list[dict[str, str]]]:
    """Return current receipt evidence before provider retrieval.

    A receipt is not live service health, but its source and Git record hashes
    are enough to prevent stale material from being presented as current.
    """
    active: list[dict[str, Any]] = []
    stale: list[dict[str, str]] = []
    if not settings.receipts_dir.is_dir():
        return active, stale
    for path in sorted(settings.receipts_dir.glob("*.json")):
        try:
            receipt = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as exc:
            raise AdapterError(f"cannot inspect adapter receipt {path.name}: {type(exc).__name__}") from exc
        if not isinstance(receipt, dict) or receipt.get("status") != "ingested":
            continue
        if knowledge_ids and not set(knowledge_ids).intersection(receipt.get("knowledge_ids", [])):
            continue
        doc_id = receipt.get("doc_id")
        source_id = receipt.get("source_id")
        record_meta = receipt.get("git_source_record")
        source_path = receipt.get("source_path")
        if not isinstance(doc_id, str) or not isinstance(source_id, str) or not isinstance(record_meta, dict) or not isinstance(source_path, str):
            raise AdapterError(f"active receipt {path.name} is missing traceable source identity")
        stale_reason = receipt_staleness_reason(settings, receipt)
        if stale_reason:
            stale.append({"doc_id": doc_id, "source_id": source_id, "reason": stale_reason})
            continue
        active.append(receipt)
    return active, stale


async def search(args: argparse.Namespace, settings: Settings) -> dict[str, Any]:
    """Read-only cross-source retrieval; never change deployment acceptance."""
    knowledge_ids = [validate_trace_id("knowledge_id", item) for item in args.knowledge_id]
    active, stale = active_receipts_for_query(settings, knowledge_ids)
    if not active:
        return {
            "status": "stale" if stale else "no-hit",
            "evidence": [],
            "stale_documents": stale,
        }
    from lightrag import QueryParam
    runtime: Runtime | None = None
    try:
        runtime = Runtime(settings, get_api_key(False, settings.chat_api_key_env))
        await runtime.initialize()
        data = await runtime.rag.lightrag.aquery_data(
            args.question, param=QueryParam(mode=args.mode, enable_rerank=False))
        if not isinstance(data, dict) or data.get("status") != "success":
            if isinstance(data, dict) and data.get("status") == "failure":
                raise AdapterError("retrieval provider returned failure; this is not a no-hit result")
            raise AdapterError("unexpected retrieval response")
        evidence: list[dict[str, Any]] = []
        for receipt in active:
            for chunk in verified_retrieval_chunks(data, doc_id=receipt["doc_id"], source_id=receipt["source_id"]):
                evidence.append(
                    {
                        "text": chunk["content"],
                        "chunk_id": chunk["chunk_id"],
                        "source_id": receipt["source_id"],
                        "doc_id": receipt["doc_id"],
                        "knowledge_ids": receipt["knowledge_ids"],
                        "locator": receipt["source_path"],
                        "source_sha256": receipt["source_sha256"],
                        "git_source_record": receipt["git_source_record"],
                    }
                )
        return {
            "status": "ok" if evidence else ("stale" if stale else "no-hit"),
            "evidence": evidence,
            "stale_documents": stale,
        }
    finally:
        if runtime is not None:
            await runtime.close()


def status(settings: Settings) -> dict[str, Any]:
    versions = installed_versions()
    compatible = all(versions[name] == required for name, required in REQUIRED_PACKAGES.items())
    receipts = []
    if settings.receipts_dir.is_dir():
        for path in sorted(settings.receipts_dir.glob("*.json")):
            try:
                item = json.loads(path.read_text(encoding="utf-8"))
                ingest_evidence = item.get("ingest") or {}
                query_evidence = item.get("query") or {}
                verified = (
                    item.get("status") == "ingested"
                    and ingest_evidence.get("status") == "completed"
                    and int(ingest_evidence.get("chunks_count", 0) or 0) > 0
                    and query_evidence.get("status") == "completed"
                    and query_evidence.get("doc_id_matched") is True
                    and query_evidence.get("source_id_matched") is True
                    and bool(query_evidence.get("expected_matches"))
                    and all(query_evidence["expected_matches"].values())
                )
                receipts.append(
                    {
                        "doc_id": item.get("doc_id"),
                        "source_id": item.get("source_id"),
                        "status": item.get("status"),
                        "deployment_status": "enabled" if verified else "incomplete",
                        "recorded_deployment_status": item.get(
                            "deployment_status", "incomplete"
                        ),
                        "verified_deployment": verified,
                    }
                )
            except (OSError, json.JSONDecodeError, TypeError, ValueError):
                receipts.append({"receipt": path.name, "status": "invalid"})
    any_enabled = any(item.get("verified_deployment") is True for item in receipts)
    rag_status = "enabled" if compatible and any_enabled else ("incomplete" if compatible else "unavailable")
    return {
        "rag_anything": rag_status,
        "deployment_status": "enabled" if compatible and any_enabled else "incomplete",
        "runtime_compatible": compatible,
        "packages": versions,
        "required_packages": REQUIRED_PACKAGES,
        "working_dir": str(settings.working_dir),
        "index_exists": settings.working_dir.is_dir(),
        "receipts": receipts,
        "compatibility_note": (
            "1024 dimensions and response model bge_m3_embed were observed with the Kimi Code "
            "OpenAI-compatible API; this is not an upstream stable contract"
        ),
    }


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--learner-root", help="learner Git root; or set GITLEARNOS_REPO")
    parser.add_argument("--working-dir", help="local index/receipt directory")
    parser.add_argument("--base-url", help=f"OpenAI-compatible base URL (default: {DEFAULT_BASE_URL})")
    parser.add_argument("--embedding-base-url", help="independent embedding endpoint")
    parser.add_argument("--chat-model", help=f"chat model (default: {DEFAULT_MODEL})")
    parser.add_argument("--embedding-model", help=f"embedding request model (default: {DEFAULT_MODEL})")
    parser.add_argument("--embedding-dim", type=int, help=f"embedding dimensions (default: {DEFAULT_EMBEDDING_DIM})")
    parser.add_argument(
        "--prompt-api-key",
        action="store_true",
        help="read the provider key from a hidden prompt instead of chat or disk",
    )
    subparsers = parser.add_subparsers(dest="command", required=True)
    subparsers.add_parser("status", help="inspect local runtime and verified receipts without API calls")

    def add_identity(subparser: argparse.ArgumentParser) -> None:
        subparser.add_argument("--doc-id", required=True)
        subparser.add_argument("--source-id", required=True)

    def add_ingest(subparser: argparse.ArgumentParser) -> None:
        add_identity(subparser)
        subparser.add_argument("--knowledge-id", action="append", required=True)
        subparser.add_argument("--source", required=True, help="authorized UTF-8 source file")
        subparser.add_argument("--source-record", required=True, help="tracked Git source record path")
        subparser.add_argument("--authorized-root", action="append", required=True)
        subparser.add_argument(
            "--allow-path",
            action="append",
            default=[],
            help="optional explicit path allowlist that narrows authorized roots",
        )

    ingest_parser = subparsers.add_parser("ingest", help="insert one authorized source and write a receipt")
    add_ingest(ingest_parser)
    query_parser = subparsers.add_parser("verify", help="setup acceptance: source-specific known-fact check")
    add_identity(query_parser)
    query_parser.add_argument("--question", required=True)
    query_parser.add_argument(
        "--expect",
        action="append",
        required=True,
        help="source-specific fact that must appear in retrieved context or answer; repeatable",
    )
    query_parser.add_argument("--mode", default="naive", choices=["naive", "local", "global", "hybrid", "mix"])
    search_parser = subparsers.add_parser("query", help="retrieve evidence for an unknown learning question")
    search_parser.add_argument("--question", required=True)
    search_parser.add_argument("--knowledge-id", action="append", default=[])
    search_parser.add_argument("--mode", default="naive", choices=["naive", "local", "global", "hybrid", "mix"])
    delete_parser = subparsers.add_parser("delete", help="delete only one receipt-owned document boundary")
    add_identity(delete_parser)
    rebuild_parser = subparsers.add_parser("rebuild", help="delete then reinsert one receipt-owned document")
    add_ingest(rebuild_parser)
    return parser


async def run(args: argparse.Namespace) -> dict[str, Any]:
    settings = make_settings(args)
    if args.command == "status":
        return status(settings)
    if args.command == "ingest":
        return await ingest(args, settings)
    if args.command == "verify":
        return await verify(args, settings)
    if args.command == "query":
        return await search(args, settings)
    if args.command == "delete":
        return await delete_document(args, settings)
    if args.command == "rebuild":
        return await rebuild(args, settings)
    raise AdapterError(f"unsupported command: {args.command}")


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)
    secrets = [os.environ.get("GITLEARNOS_RAG_API_KEY", "")]
    try:
        result = asyncio.run(run(args))
        print(
            json.dumps(
                redact(jsonable(result), [*secrets, *SENSITIVE_VALUES]),
                ensure_ascii=False,
                indent=2,
            )
        )
        return 0
    except (AdapterError, OSError, ValueError) as exc:
        error = {
            "ok": False,
            "error": redact(f"{type(exc).__name__}: {exc}", [*secrets, *SENSITIVE_VALUES]),
        }
        print(json.dumps(error, ensure_ascii=False), file=sys.stderr)
        return 2
    except Exception as exc:  # Keep provider/runtime errors key-safe without hiding the failure class.
        error = {
            "ok": False,
            "error": redact(f"{type(exc).__name__}: {exc}", [*secrets, *SENSITIVE_VALUES]),
        }
        print(json.dumps(error, ensure_ascii=False), file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
