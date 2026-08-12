#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const failures = [];
const requiredHumanPairs = [
  "README.md",
  "QUICKSTART.md",
  "FAQ.md",
  "DOCUMENTATION.md",
  "LIVE-DEMO.md",
  "GITLEARNOS.md",
  "AGENTS.md",
  "CLAUDE.md",
  "AGENT-RUNTIME.md",
  "START-HERE.md",
  "templates/AGENTS.md",
  "templates/CLAUDE.md",
  "templates/project-instructions.md",
  "templates/native-memory-pointer.md",
  "templates/learning-policy.md",
  "adapters/agents/README.md",
  "adapters/git/README.md",
  "docs/acesat-build-for-impact.md",
  "docs/runtime-self-adaptation.md",
  "docs/adaptive-rules.md",
  "docs/native-ai-platform-deployment.md",
  "docs/why-github.md",
  "docs/skill-and-memory-runtime.md",
  "docs/platform-agent-configuration.md",
  "docs/getting-started.md",
  "docs/customer-clarity-checklist.md",
  "docs/first-experiment-guide.md",
  "docs/source-and-learner-state.md",
  "docs/local-runtime-note.md",
  "docs/adaptive-memory-and-learner-profile.md",
  "docs/deployment-guide.md",
  "docs/ai-runtime-support.md",
  "docs/rag-anything.md",
  "evals/README.md",
  "evals/scenarios/09-implicit-learning-event.md",
  "evals/scenarios/10-github-teaching-collaboration.md",
  "evals/scenarios/11-no-skill-continuity.md",
  "evals/scenarios/12-cross-agent-skill-install.md",
  "evals/scenarios/13-rag-anything.md",
  "website/public-page-copy.md",
];
const localizedOnly = [
  "zh-CN/ALIGNMENT.md",
  "zh-CN/examples/demo-zhongkao-lite/",
];

function walk(relative = "") {
  const directory = path.join(root, relative);
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const child = path.posix.join(relative, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === ".git") return [];
      return walk(child);
    }
    return [child];
  });
}

function exists(relative) {
  return fs.existsSync(path.join(root, relative));
}

function read(relative) {
  return fs.readFileSync(path.join(root, relative), "utf8");
}

function fail(message) {
  failures.push(message);
}

function frontmatterName(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const name = match[1].match(/^name:\s*(.+?)\s*$/m);
  return name?.[1] ?? null;
}

function withoutFencedCode(text) {
  return text.replace(/```[\s\S]*?```/g, "");
}

function headingLevels(text) {
  return withoutFencedCode(text)
    .split(/\r?\n/)
    .filter((line) => /^#{1,6}\s/.test(line))
    .map((line) => line.match(/^#+/)[0].length);
}

function fenceCount(text) {
  return (text.match(/^```/gm) ?? []).length;
}

function markdownTargets(text) {
  const targets = [];
  const source = withoutFencedCode(text);

  for (let index = 0; index < source.length - 1; index += 1) {
    if (source[index] !== "]" || source[index + 1] !== "(") continue;

    let cursor = index + 2;
    while (/\s/.test(source[cursor] ?? "")) cursor += 1;

    let target = "";
    if (source[cursor] === "<") {
      cursor += 1;
      while (cursor < source.length && source[cursor] !== ">") {
        if (source[cursor] === "\\" && cursor + 1 < source.length) {
          cursor += 1;
        }
        target += source[cursor];
        cursor += 1;
      }
      if (source[cursor] !== ">") continue;
    } else {
      let nestedParentheses = 0;
      while (cursor < source.length) {
        const character = source[cursor];
        if (character === "\\" && cursor + 1 < source.length) {
          target += source[cursor + 1];
          cursor += 2;
          continue;
        }
        if (character === "(") {
          nestedParentheses += 1;
        } else if (character === ")") {
          if (nestedParentheses === 0) break;
          nestedParentheses -= 1;
        } else if (/\s/.test(character) && nestedParentheses === 0) {
          break;
        }
        target += character;
        cursor += 1;
      }
      if (nestedParentheses !== 0) continue;
    }

    targets.push(target);
  }

  return targets;
}

const files = walk();

const parserCases = [
  ['[x](docs/target.md "Target")', ["docs/target.md"]],
  ["[x](docs/a(b).md)", ["docs/a(b).md"]],
  ['[x](<docs/a b.md> "Target")', ["docs/a b.md"]],
];
for (const [markdown, expected] of parserCases) {
  if (JSON.stringify(markdownTargets(markdown)) !== JSON.stringify(expected)) {
    fail(`Markdown destination parser failed its self-check: ${markdown}`);
  }
}

for (const file of files) {
  if (
    (file.includes("zh-CN") && !file.startsWith("zh-CN/")) ||
    file.includes(".zh-CN.")
  ) {
    fail(`Chinese-localized path must live under zh-CN/: ${file}`);
  }
}

for (const english of requiredHumanPairs) {
  const chinese = `zh-CN/${english}`;
  if (!exists(english)) fail(`Missing required English entry: ${english}`);
  if (!exists(chinese)) fail(`Missing required Chinese entry: ${chinese}`);
}

const englishSkills = files.filter(
  (file) => file.startsWith("skills/") && file.endsWith(".md"),
);
const chineseSkills = files.filter(
  (file) => file.startsWith("zh-CN/skills/") && file.endsWith(".md"),
);

for (const english of englishSkills) {
  const chinese = `zh-CN/${english}`;
  if (!exists(chinese)) {
    fail(`Skill has no Chinese mirror: ${english}`);
    continue;
  }

  const englishText = read(english);
  const chineseText = read(chinese);
  const englishName = frontmatterName(englishText);
  const chineseName = frontmatterName(chineseText);

  if (english.endsWith("/SKILL.md") && englishName !== chineseName) {
    fail(
      `Skill name differs: ${english} (${englishName}) vs ${chinese} (${chineseName})`,
    );
  }
  if (
    JSON.stringify(headingLevels(englishText)) !==
    JSON.stringify(headingLevels(chineseText))
  ) {
    fail(`Heading structure differs: ${english} vs ${chinese}`);
  }
  if (fenceCount(englishText) !== fenceCount(chineseText)) {
    fail(`Fenced example count differs: ${english} vs ${chinese}`);
  }
  if ((chineseText.match(/[\u3400-\u9fff]/g) ?? []).length < 20) {
    fail(`Chinese Skill does not contain enough translated text: ${chinese}`);
  }
  if (!chineseText.includes("GITLEARNOS.md") && english.endsWith("/SKILL.md")) {
    fail(`Chinese Skill does not name the canonical protocol: ${chinese}`);
  }

  const relativeEnglishLink = path.posix.relative(
    path.posix.dirname(chinese),
    english,
  );
  if (!markdownTargets(chineseText).includes(relativeEnglishLink)) {
    fail(`Chinese Skill does not link its English source: ${chinese}`);
  }
}

for (const chinese of chineseSkills) {
  const english = chinese.slice("zh-CN/".length);
  if (!exists(english)) fail(`Chinese Skill has no English source: ${chinese}`);
}

const skillEntrypoints = files.filter(
  (file) => file.startsWith("skills/") && file.endsWith("/SKILL.md"),
);
if (
  JSON.stringify(skillEntrypoints) !==
  JSON.stringify(["skills/gitlearnos/SKILL.md"])
) {
  fail(
    `Expected one installable Skill entrypoint, found: ${skillEntrypoints.join(", ")}`,
  );
}

const requiredSkillBundleFiles = [
  "skills/gitlearnos/SKILL.md",
  "skills/gitlearnos/agents/openai.yaml",
  "skills/gitlearnos/references/core-contract.md",
  "skills/gitlearnos/references/setup.md",
  "skills/gitlearnos/references/organize.md",
  "skills/gitlearnos/references/question.md",
  "skills/gitlearnos/references/review.md",
  "skills/gitlearnos/references/session.md",
  "skills/gitlearnos/references/source.md",
  "skills/gitlearnos/references/rag.md",
  "skills/gitlearnos/references/model.md",
  "skills/gitlearnos/references/maintenance.md",
  "skills/gitlearnos/references/subjects/README.md",
  "skills/gitlearnos/references/subjects/math.md",
  "skills/gitlearnos/references/subjects/language.md",
  "skills/gitlearnos/references/subjects/programming.md",
];
for (const file of requiredSkillBundleFiles) {
  if (!exists(file)) fail(`Incomplete installable Skill bundle: ${file}`);
}

const openaiSkillMetadata = read("skills/gitlearnos/agents/openai.yaml");
const defaultPrompt = openaiSkillMetadata.match(
  /^\s*default_prompt:\s*"([^"]+)"\s*$/m,
)?.[1];
if (!defaultPrompt?.startsWith("Use $gitlearnos ")) {
  fail("OpenAI default prompt must start with the exact $gitlearnos token");
}

const skillBundleRoot = path.resolve(root, "skills/gitlearnos");
for (const file of files.filter(
  (item) => item.startsWith("skills/gitlearnos/") && item.endsWith(".md"),
)) {
  for (const rawTarget of markdownTargets(read(file))) {
    const target = rawTarget.split("#", 1)[0].split("?", 1)[0];
    if (
      !target ||
      target.startsWith("#") ||
      /^[a-z][a-z0-9+.-]*:/i.test(target)
    ) {
      continue;
    }
    const resolved = path.resolve(root, path.dirname(file), target);
    if (
      resolved !== skillBundleRoot &&
      !resolved.startsWith(`${skillBundleRoot}${path.sep}`)
    ) {
      fail(`Installable Skill link escapes its bundle in ${file}: ${rawTarget}`);
    }
  }
}

const agentAdapter = read("adapters/agents/README.md");
for (const requiredPath of [
  ".agents/skills/gitlearnos/",
  ".claude/skills/gitlearnos/",
  ".opencode/skills/gitlearnos/",
]) {
  if (!agentAdapter.includes(requiredPath)) {
    fail(`Agent adapter omits documented Skill location: ${requiredPath}`);
  }
}

for (const claudeEntry of ["CLAUDE.md", "templates/CLAUDE.md"]) {
  if (!read(claudeEntry).includes("@AGENTS.md")) {
    fail(`Claude Code entry does not import AGENTS.md: ${claudeEntry}`);
  }
}

for (const chinese of files.filter((file) => file.startsWith("zh-CN/"))) {
  if (localizedOnly.some((allowed) => chinese === allowed || chinese.startsWith(allowed))) {
    continue;
  }
  const english = chinese.slice("zh-CN/".length);
  if (!exists(english)) fail(`Chinese file has no same-path English source: ${chinese}`);
}

if (!exists("GITLEARNOS.md")) {
  fail("Missing canonical GITLEARNOS.md");
}
if (
  !exists("zh-CN/GITLEARNOS.md") ||
  !read("zh-CN/GITLEARNOS.md").includes("../GITLEARNOS.md")
) {
  fail("Chinese protocol guide must link canonical ../GITLEARNOS.md");
}

for (const file of files.filter((item) => item.endsWith(".md"))) {
  for (const rawTarget of markdownTargets(read(file))) {
    const target = rawTarget.split("#", 1)[0].split("?", 1)[0];
    if (
      !target ||
      target.startsWith("#") ||
      /^[a-z][a-z0-9+.-]*:/i.test(target) ||
      target.includes("<") ||
      target.includes(">")
    ) {
      continue;
    }
    let decoded;
    try {
      decoded = decodeURIComponent(target);
    } catch {
      fail(`Invalid encoded Markdown link in ${file}: ${rawTarget}`);
      continue;
    }
    const resolved = path.resolve(root, path.dirname(file), decoded);
    if (!resolved.startsWith(`${root}${path.sep}`) && resolved !== root) {
      fail(`Markdown link escapes the repository in ${file}: ${rawTarget}`);
    } else if (!fs.existsSync(resolved)) {
      fail(`Broken Markdown link in ${file}: ${rawTarget}`);
    }
  }
}

if (failures.length) {
  console.error(`Language alignment failed (${failures.length} issue(s)):\n`);
  for (const message of failures) console.error(`- ${message}`);
  process.exit(1);
}

console.log(
  `Language alignment passed: ${englishSkills.length} Skill files and ${requiredHumanPairs.length} required human-facing pairs.`,
);
