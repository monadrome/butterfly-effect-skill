#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const skillDir = path.join(root, 'skills', 'butterfly-effect');
const skillPath = path.join(skillDir, 'SKILL.md');
const referencesDir = path.join(skillDir, 'references');
const failures = [];

function fail(message) {
  failures.push(message);
}

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');
}

function readRegularFile(filePath) {
  try {
    return fs.lstatSync(filePath).isFile() ? read(filePath) : '';
  } catch {
    return '';
  }
}

function walkMarkdown(directory) {
  const files = [];
  if (!fs.existsSync(directory) || !fs.lstatSync(directory).isDirectory()) return files;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walkMarkdown(entryPath));
    else if (entry.isFile() && entry.name.endsWith('.md')) files.push(entryPath);
  }
  return files.sort();
}

function frontmatterValue(frontmatter, key) {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(?:"([^"]*)"|'([^']*)'|(.*))$`, 'm'));
  return match ? (match[1] ?? match[2] ?? match[3]).trim() : null;
}

const skill = read(skillPath);
const frontmatterMatch = skill.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);
if (!frontmatterMatch) {
  fail('SKILL.md frontmatter is missing or malformed.');
} else {
  const frontmatter = frontmatterMatch[1];
  if (frontmatterValue(frontmatter, 'name') !== 'butterfly-effect') fail('Skill name must be butterfly-effect.');
  const description = frontmatterValue(frontmatter, 'description') || '';
  if (description.length < 100 || description.length > 400 || !/月光宝盒|蝴蝶效应/.test(description) || !/task artifact.*drifted.*reworked/i.test(description) || !/recommend.*history point.*continue/i.test(description)) {
    fail('Description must explain artifact-drift-to-continuation behavior, retain bilingual discovery terms, and stay under 400 characters.');
  }
  if (!/^metadata:\s*\n(?: {2}[^\n]+\n)* {2}version:\s*["']?[^"'\s]+["']?\s*$/m.test(frontmatter)) {
    fail('metadata.version is missing or malformed.');
  }
}

const lines = skill.length === 0 ? 0 : skill.split('\n').length - Number(skill.endsWith('\n'));
if (lines > 80) fail(`SKILL.md exceeds the 80-line decision-contract limit (${lines}).`);

const localLinkPattern = /\[[^\]]+\]\(([^)]+\.md(?:#[^)]+)?)\)/g;
const linked = new Set();
let match;
while ((match = localLinkPattern.exec(skill)) !== null) {
  const link = match[1].split('#')[0];
  if (/^[a-z]+:\/\//i.test(link)) continue;
  const normalized = path.posix.normalize(link);
  if (!/^references\/[^/]+\.md$/.test(normalized)) {
    fail(`Reference must be one level below SKILL.md: ${link}`);
    continue;
  }
  const resolved = path.resolve(skillDir, normalized);
  const referencesRoot = path.resolve(referencesDir);
  if (!resolved.startsWith(`${referencesRoot}${path.sep}`) || !fs.existsSync(resolved) || !fs.lstatSync(resolved).isFile()) {
    fail(`Reference is missing, outside references/, or not a regular file: ${link}`);
  } else linked.add(resolved);
}

const referenceFiles = walkMarkdown(referencesDir);
if (referenceFiles.length !== 1 || path.basename(referenceFiles[0] || '') !== 'source-resolution.md') {
  fail('Runtime references must contain only source-resolution.md.');
}

for (const reference of referenceFiles) {
  if (!linked.has(reference)) fail(`Reference is not directly linked: ${path.basename(reference)}`);
  const content = readRegularFile(reference);
  if (!content) {
    fail(`Reference is not a readable regular file: ${path.relative(skillDir, reference)}`);
    continue;
  }
  localLinkPattern.lastIndex = 0;
  while ((match = localLinkPattern.exec(content)) !== null) {
    if (!/^[a-z]+:\/\//i.test(match[1])) fail(`Reference-to-reference link is not allowed: ${path.basename(reference)}`);
  }
}

const requiredContracts = [
  ['recommendation is advisory', /This is advice; never imply that rewind has been performed/],
  ['current conversation default', /current conversation by default/],
  ['artifact identification', /Identify the task artifact and its produced versions/],
  ['non-artifact exclusion', /Exclude status or context messages, unfinished responses, and ordinary conversation/],
  ['optional evidence hints', /optional user descriptions of what's wrong or what's right as evidence hints/],
  ['hints guide salvage only after drift', /only after drift is established, evidence selection/],
  ['hints do not establish drift', /Never let them establish drift or the rewind point without artifact history/],
  ['conflicting hints do not rewrite history', /follow the explicit current instruction for the desired result without fabricating a historical claim; mention the mismatch only when it affects the recommendation/],
  ['artifact-rework gate', /Drift requires a version reworked/],
  ['pre-version requirement no-op', /Requirements added before a version exists/],
  ['accepted-evolution no-op', /normal evolution after acceptance/],
  ['repeated-explanation no-op', /repeated explanations without artifact rework are no-op/],
  ['continuation constraints', /retain later requirements that define the desired artifact even when they do not prove drift/],
  ['earliest causal boundary', /earliest Agent action whose replacement would have prevented the rework/],
  ['independent-drift separation', /Keep unrelated artifact drifts separate/],
  ['false-precision prevention', /without false precision/],
  ['post-rewind mixed evidence', /history at and after the rewind point as mixed evidence/],
  ['drift-dependent evidence rejection', /Reject failed assumptions, invalid decisions, and artifact states that depend on the drift/],
  ['accepted partial work salvage', /Preserve accepted partial work by its valid outcomes or interfaces/],
  ['eliminated-option handling', /eliminated option as a direct constraint only when its rejection is an accepted decision or current instruction applicable at the rewind point; otherwise turn the evidence into a decision or verification step/],
  ['original objective preserved', /Preserve the original objective and accepted decisions/],
  ['later discoveries become checks', /Convert facts discovered later into instructions to inspect, reproduce, decide, or verify/],
  ['secret redaction', /Redact secrets, private identifiers/],
  ['no reliable fallback', /No reliable drift or rewind point detected/],
  ['fallback is no-op', /This is the no-op result/],
  ['no unsupported prompt', /Do not generate a revised prompt unless the user explicitly requests reconstruction from limited evidence/],
  ['rewind recommendation fields', /`Rewind to`, `Why`, and `Keep`/],
  ['keep summarizes salvage', /use `Keep` to summarize relevant evidence retained or translated from later history/],
  ['copy-ready prompt', /one copy-ready fenced `text` code block/],
  ['blockquote-free prompt', /Do not use Markdown blockquote syntax because copied prompts must not contain leading `>` characters/],
  ['explicit prompt-only mode', /For explicit `--prompt-only`, return only the fenced prompt block/],
  ['explicit detailed mode', /For explicit `--detailed`/],
  ['multiple-boundary output', /no single rewind point exists/],
];

for (const [label, pattern] of requiredContracts) {
  if (!pattern.test(skill)) fail(`Missing core contract: ${label}`);
}

if (/^## Workflow|^### \d+\.|Complete when:|Completion Check|confidence|evidence strength|correction chain|Corrections absorbed|new objective, ordinary follow-up|\brestart(?:ed|ing|s)?\b|\bfresh session\b|\bnew session\b/im.test(skill)) {
  fail('SKILL.md must remain an artifact-first decision contract without request-label gates, workflow scaffolding, subjective scoring, or restart semantics.');
}

const sourceResolution = readRegularFile(path.join(referencesDir, 'source-resolution.md'));
for (const [label, pattern] of [
  ['truncated current-session recovery', /history as truncated/],
  ['same-session restriction', /only that session/],
  ['no false precision', /without a turn or timestamp/],
]) {
  if (!pattern.test(sourceResolution)) fail(`Source resolution is missing ${label}.`);
}

if (failures.length > 0) {
  for (const failure of failures) console.error(failure);
  process.exit(1);
}

console.log(`Butterfly Effect skill contract and ${referenceFiles.length} reference file(s): valid.`);
