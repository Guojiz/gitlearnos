#!/usr/bin/env python3
"""Offline boundary tests for the publishable RAG-Anything adapter."""

from __future__ import annotations

import argparse
import asyncio
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from unittest import mock

sys.dont_write_bytecode = True


REPO_ROOT = Path(__file__).resolve().parents[1]
ADAPTER_PATH = REPO_ROOT / "skills" / "gitlearnos" / "scripts" / "rag-anything-adapter.py"
SPEC = importlib.util.spec_from_file_location("gitlearnos_rag_adapter", ADAPTER_PATH)
assert SPEC and SPEC.loader
adapter = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = adapter
SPEC.loader.exec_module(adapter)


class RagAnythingAdapterTests(unittest.TestCase):
    def make_git_repo(self, root: Path) -> tuple[Path, Path]:
        learner = root / "learner"
        source_dir = root / "authorized-materials"
        record = learner / "subjects" / "math" / "sources" / "book.md"
        source = source_dir / "book-notes.md"
        record.parent.mkdir(parents=True)
        source_dir.mkdir(parents=True)
        record.write_text("# Source record\n", encoding="utf-8")
        source.write_text("The stable fact is 7392.\n", encoding="utf-8")
        subprocess.run(["git", "init", "-q", str(learner)], check=True)
        subprocess.run(["git", "-C", str(learner), "config", "user.email", "test@example.invalid"], check=True)
        subprocess.run(["git", "-C", str(learner), "config", "user.name", "Test"], check=True)
        subprocess.run(["git", "-C", str(learner), "add", record.relative_to(learner).as_posix()], check=True)
        subprocess.run(["git", "-C", str(learner), "commit", "-qm", "add source record"], check=True)
        return source, record

    def test_authorized_root_allowlist_and_git_record_are_enforced(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            source, record = self.make_git_repo(root)
            learner = root / "learner"
            roots, allowlist = adapter.validate_ingest_paths(
                learner_root=learner,
                source=source,
                source_record=record,
                authorized_roots=[source.parent],
                allow_paths=[source],
            )
            self.assertEqual(roots, [source.parent.resolve()])
            self.assertEqual(allowlist, [source.resolve()])

            with self.assertRaisesRegex(adapter.AdapterError, "narrower"):
                adapter.validate_ingest_paths(
                    learner_root=learner,
                    source=source,
                    source_record=record,
                    authorized_roots=[Path("/")],
                    allow_paths=[source],
                )

            outside = root / "outside.md"
            outside.write_text("not authorized\n", encoding="utf-8")
            with self.assertRaisesRegex(adapter.AdapterError, "outside every authorized root"):
                adapter.validate_ingest_paths(
                    learner_root=learner,
                    source=outside,
                    source_record=record,
                    authorized_roots=[source.parent],
                    allow_paths=[],
                )

            narrower = source.parent / "other.md"
            narrower.write_text("authorized root but not allowlisted\n", encoding="utf-8")
            with self.assertRaisesRegex(adapter.AdapterError, "outside the explicit allowlist"):
                adapter.validate_ingest_paths(
                    learner_root=learner,
                    source=narrower,
                    source_record=record,
                    authorized_roots=[source.parent],
                    allow_paths=[source],
                )

    def test_examples_secrets_and_untracked_records_are_refused(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            source, record = self.make_git_repo(root)
            learner = root / "learner"
            example = source.parent / "examples" / "fixture.md"
            example.parent.mkdir()
            example.write_text("fixture\n", encoding="utf-8")
            with self.assertRaisesRegex(adapter.AdapterError, "prohibited path segment"):
                adapter.validate_ingest_paths(
                    learner_root=learner,
                    source=example,
                    source_record=record,
                    authorized_roots=[source.parent],
                    allow_paths=[],
                )

            secret_file = source.parent / ".env"
            secret_file.write_text("TOKEN=value\n", encoding="utf-8")
            with self.assertRaisesRegex(adapter.AdapterError, "secret-bearing"):
                adapter.validate_ingest_paths(
                    learner_root=learner,
                    source=secret_file,
                    source_record=record,
                    authorized_roots=[source.parent],
                    allow_paths=[],
                )

            untracked = learner / "subjects" / "math" / "sources" / "draft.md"
            untracked.write_text("not committed\n", encoding="utf-8")
            with self.assertRaisesRegex(adapter.AdapterError, "tracked by Git"):
                adapter.validate_ingest_paths(
                    learner_root=learner,
                    source=source,
                    source_record=untracked,
                    authorized_roots=[source.parent],
                    allow_paths=[],
                )

    def test_public_template_is_refused(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            (root / "skills" / "gitlearnos").mkdir(parents=True)
            (root / "package.json").write_text('{"name":"gitlearnos"}', encoding="utf-8")
            (root / "GITLEARNOS.md").write_text("protocol\n", encoding="utf-8")
            (root / "skills" / "gitlearnos" / "SKILL.md").write_text("router\n", encoding="utf-8")
            self.assertTrue(adapter.public_template_root(root))
            source = root / "README.md"
            source.write_text("public template material\n", encoding="utf-8")
            self.assertEqual(adapter.containing_public_template(source), root)
            (root / "gitlearnos.yml").write_text("identity:\n  kind: learner-repository\n", encoding="utf-8")
            self.assertFalse(adapter.public_template_root(root))

    def test_provenance_is_inserted_and_receipt_is_atomic(self):
        inserted = adapter.build_insert_text(
            source_text="durable knowledge",
            source_record_relative="subjects/math/sources/book.md",
            source_id="book-source",
            knowledge_ids=["quadratic-model", "vertex-method"],
            doc_id="book-v1",
            source_sha256="abc123",
        )
        for expected in (
            '"doc_id": "book-v1"',
            '"source_id": "book-source"',
            '"knowledge_ids": ["quadratic-model", "vertex-method"]',
            '"git_source_record": "subjects/math/sources/book.md"',
            "durable knowledge",
        ):
            self.assertIn(expected, inserted)

        with tempfile.TemporaryDirectory() as temporary:
            path = Path(temporary) / "receipts" / "book-v1.json"
            adapter.atomic_write_json(path, {"doc_id": "book-v1", "status": "ingested"})
            self.assertEqual(json.loads(path.read_text())["doc_id"], "book-v1")
            self.assertEqual(path.stat().st_mode & 0o777, 0o600)
            self.assertEqual(list(path.parent.glob(".book-v1.json.*")), [])

    def test_secret_detection_and_redaction(self):
        key = "sk-" + "test-secret-value-123456789"
        self.assertTrue(adapter.contains_probable_secret(f"api_key={key}"))
        value = adapter.redact(
            {
                "error": f"request failed Authorization: Bearer {key}",
                "nested": [f"client_secret={key}"],
            },
            [key],
        )
        serialized = json.dumps(value)
        self.assertNotIn(key, serialized)
        self.assertIn("[REDACTED]", serialized)
        self.assertEqual(
            adapter.validate_trace_id("knowledge_id", "math/quadratics/vertex-form"),
            "math/quadratics/vertex-form",
        )
        with self.assertRaises(adapter.AdapterError):
            adapter.validate_trace_id("knowledge_id", "math/../secrets")
        with self.assertRaisesRegex(adapter.AdapterError, "must not contain credentials"):
            adapter.validate_base_url("https://user:secret@example.invalid/v1")

    def test_retrieval_requires_provider_chunk_identity_and_embedded_provenance(self):
        content = (
            'GitLearnOS provenance: {"doc_id": "book-v1", '
            '"source_id": "math/book"}\n\nFact 7392'
        )
        data = {
            "status": "success",
            "data": {"chunks": [{"chunk_id": "book-v1-chunk-000", "content": content}]},
        }
        self.assertEqual(
            len(adapter.verified_retrieval_chunks(data, doc_id="book-v1", source_id="math/book")),
            1,
        )
        data["data"]["chunks"][0]["chunk_id"] = "other-v1-chunk-000"
        self.assertEqual(
            adapter.verified_retrieval_chunks(data, doc_id="book-v1", source_id="math/book"),
            [],
        )

    def test_default_working_dir_is_external_and_repository_specific(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            learner = root / "learner"
            elsewhere = root / "elsewhere"
            learner.mkdir()
            elsewhere.mkdir()
            args = argparse.Namespace(
                learner_root=str(learner),
                working_dir=None,
                base_url=None,
                chat_model=None,
                embedding_model=None,
                embedding_dim=None,
            )
            original_cwd = Path.cwd()
            try:
                os.chdir(elsewhere)
                settings = adapter.make_settings(args)
            finally:
                os.chdir(original_cwd)
            repository_key = adapter.hashlib.sha256(
                str(learner.resolve()).encode("utf-8")
            ).hexdigest()[:16]
            self.assertEqual(
                settings.working_dir,
                adapter.resolve_path(
                    os.environ.get("XDG_DATA_HOME", Path.home() / ".local" / "share")
                )
                / "gitlearnos"
                / "rag-anything"
                / repository_key,
            )
            self.assertEqual(settings.base_url, adapter.DEFAULT_BASE_URL)
            self.assertEqual(settings.embedding_dim, 1024)

            args.working_dir = str(learner / ".gitlearnos" / "rag-anything")
            with self.assertRaisesRegex(adapter.AdapterError, "outside the learner Git"):
                adapter.make_settings(args)

    def test_receipt_identity_defends_delete_boundary(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            learner = root / "learner"
            learner.mkdir()
            settings = adapter.Settings(
                learner_root=learner,
                working_dir=root / "index",
                base_url=adapter.DEFAULT_BASE_URL,
                chat_model=adapter.DEFAULT_MODEL,
                embedding_model=adapter.DEFAULT_MODEL,
                embedding_dim=1024,
            )
            path = adapter.receipt_path(settings, "expected-doc")
            adapter.atomic_write_json(path, {"doc_id": "different-doc"})
            with self.assertRaisesRegex(adapter.AdapterError, "identity mismatch"):
                adapter.load_receipt(settings, "expected-doc")
            self.assertEqual(
                adapter.validate_trace_id("doc_id", "course/algebra.pdf"),
                "course/algebra.pdf",
            )
            self.assertNotIn("/", adapter.receipt_path(settings, "course/algebra.pdf").name)
            with self.assertRaisesRegex(adapter.AdapterError, "safe path-like"):
                adapter.receipt_path(settings, "../../escape")

            adapter.write_receipt(settings, "expected-doc", {"doc_id": "expected-doc"})
            self.assertTrue(adapter.receipt_path(settings, "expected-doc").is_file())
            self.assertTrue(adapter.published_receipt_path(settings, "expected-doc").is_file())

    def test_status_derives_deployment_from_evidence(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            learner = root / "learner"
            learner.mkdir()
            settings = adapter.Settings(
                learner_root=learner,
                working_dir=root / "index",
                base_url=adapter.DEFAULT_BASE_URL,
                chat_model=adapter.DEFAULT_MODEL,
                embedding_model=adapter.DEFAULT_MODEL,
                embedding_dim=1024,
            )
            valid = {
                "doc_id": "verified-doc",
                "source_id": "math/source",
                "status": "ingested",
                "deployment_status": "enabled",
                "ingest": {"status": "completed", "chunks_count": 2},
                "query": {
                    "status": "completed",
                    "doc_id_matched": True,
                    "source_id_matched": True,
                    "expected_matches": {"fact-7392": True},
                },
            }
            adapter.atomic_write_json(adapter.receipt_path(settings, "verified-doc"), valid)
            result = adapter.status(settings)
            self.assertTrue(result["receipts"][0]["verified_deployment"])

            valid["query"]["expected_matches"]["fact-7392"] = False
            adapter.atomic_write_json(adapter.receipt_path(settings, "verified-doc"), valid)
            result = adapter.status(settings)
            self.assertFalse(result["receipts"][0]["verified_deployment"])
            self.assertEqual(result["receipts"][0]["deployment_status"], "incomplete")
            self.assertEqual(result["deployment_status"], "incomplete")

    def test_generated_receipt_matches_external_receipt_checker(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            source, record = self.make_git_repo(root)
            learner = root / "learner"
            settings = adapter.Settings(
                learner_root=learner,
                working_dir=root / "index",
                base_url=adapter.DEFAULT_BASE_URL,
                chat_model=adapter.DEFAULT_MODEL,
                embedding_model=adapter.DEFAULT_MODEL,
                embedding_dim=1024,
            )
            with mock.patch.object(
                adapter,
                "require_runtime_versions",
                return_value={"raganything": "1.3.1", "lightrag-hku": "1.5.6"},
            ):
                receipt = adapter.base_receipt(
                    settings,
                    source=source,
                    source_record=record,
                    source_id="math/algebra-course",
                    knowledge_ids=["math/algebra/quadratic-functions"],
                    doc_id="algebra-course-v1",
                    authorized_roots=[source.parent],
                    allow_paths=[source],
                )
            receipt["ingest"] = {
                "status": "completed",
                "evidence": "processed with two chunks",
                "run_id": "ingest-test",
            }
            receipt["query"] = {
                "status": "completed",
                "evidence": "retrieved source-specific fact 7392",
                "run_id": "query-test",
            }
            receipt_path = root / "receipt.json"
            adapter.atomic_write_json(receipt_path, receipt)
            checked = subprocess.run(
                [
                    "node",
                    str(REPO_ROOT / "scripts" / "check-external-receipts.mjs"),
                    str(receipt_path),
                ],
                check=False,
                capture_output=True,
                text=True,
            )
            self.assertEqual(checked.returncode, 0, checked.stderr)
            self.assertEqual(receipt["git_source_record"]["path"], "subjects/math/sources/book.md")

    def test_ingest_refuses_processed_status_when_embedding_did_not_succeed(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            source, record = self.make_git_repo(root)
            learner = root / "learner"
            settings = adapter.Settings(
                learner_root=learner,
                working_dir=root / "index",
                base_url=adapter.DEFAULT_BASE_URL,
                chat_model=adapter.DEFAULT_MODEL,
                embedding_model=adapter.DEFAULT_MODEL,
                embedding_dim=1024,
            )
            args = argparse.Namespace(
                source_id="math/algebra-course",
                doc_id="course/algebra.pdf",
                knowledge_id=["math/algebra/quadratic-functions"],
                source=str(source),
                source_record=str(record),
                authorized_root=[str(source.parent)],
                allow_path=[str(source)],
                prompt_api_key=False,
            )

            class FalsePositiveStatus:
                async def get_by_id(self, _doc_id):
                    return {"status": "processed", "chunks_count": 1}

            class FalsePositiveLightRag:
                doc_status = FalsePositiveStatus()

            class FalsePositiveRag:
                lightrag = FalsePositiveLightRag()

                async def insert_content_list(self, *_args, **_kwargs):
                    return None

            class FalsePositiveRuntime:
                def __init__(self, _settings, _api_key):
                    self.rag = FalsePositiveRag()
                    self.observed_embedding_response_models = set()
                    self.successful_llm_calls = 0

                async def initialize(self):
                    return None

                async def close(self):
                    return None

            with (
                mock.patch.object(adapter, "Runtime", FalsePositiveRuntime),
                mock.patch.object(
                    adapter,
                    "require_runtime_versions",
                    return_value={"raganything": "1.3.1", "lightrag-hku": "1.5.6"},
                ),
                mock.patch.dict(os.environ, {"GITLEARNOS_RAG_API_KEY": "test-only-secret"}),
            ):
                with self.assertRaisesRegex(adapter.AdapterError, "successful embedding"):
                    asyncio.run(adapter.ingest(args, settings))

            receipt = adapter.load_receipt(settings, "course/algebra.pdf")
            self.assertEqual(receipt["status"], "ingest-failed")
            self.assertEqual(receipt["deployment_status"], "incomplete")


class RagAnythingAdapterFailureTests(unittest.TestCase):
    def test_failed_ingest_writes_deletable_key_safe_receipt(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            helper = RagAnythingAdapterTests()
            source, record = helper.make_git_repo(root)
            learner = root / "learner"
            settings = adapter.Settings(
                learner_root=learner,
                working_dir=root / "index",
                base_url=adapter.DEFAULT_BASE_URL,
                chat_model=adapter.DEFAULT_MODEL,
                embedding_model=adapter.DEFAULT_MODEL,
                embedding_dim=1024,
            )
            args = argparse.Namespace(
                source_id="math/algebra-course",
                doc_id="course/algebra.pdf",
                knowledge_id=["math/algebra/quadratic-functions"],
                source=str(source),
                source_record=str(record),
                authorized_root=[str(source.parent)],
                allow_path=[str(source)],
                prompt_api_key=False,
            )

            class FailingRag:
                async def insert_content_list(self, *_args, **_kwargs):
                    raise RuntimeError("provider failed with " + "sk-" + "test-secret-value-123456789")

            class FailingRuntime:
                def __init__(self, _settings, _api_key):
                    self.rag = FailingRag()
                    self.observed_embedding_response_models = set()

                async def initialize(self):
                    return None

                async def close(self):
                    return None

            secret = "sk-" + "test-secret-value-123456789"
            with (
                mock.patch.object(
                    adapter,
                    "require_runtime_versions",
                    return_value={"raganything": "1.3.1", "lightrag-hku": "1.5.6"},
                ),
                mock.patch.object(adapter, "Runtime", FailingRuntime),
                mock.patch.dict(os.environ, {"GITLEARNOS_RAG_API_KEY": secret}),
            ):
                with self.assertRaises(RuntimeError):
                    asyncio.run(adapter.ingest(args, settings))

            receipt = adapter.load_receipt(settings, "course/algebra.pdf")
            self.assertEqual(receipt["status"], "ingest-failed")
            self.assertEqual(receipt["ingest"]["status"], "failed")
            self.assertNotIn(secret, json.dumps(receipt))


if __name__ == "__main__":
    unittest.main()
