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
  if (description.length < 100 || description.length > 400 || !/月光宝盒|蝴蝶效应/.test(description) || !/Rewind AI sessions/.test(description) || !/later corrections/i.test(description)) {
    fail('Description must use the time-machine leading word, explain correction-to-restart behavior, retain bilingual discovery terms, and stay under 400 characters.');
  }
  if (!/^metadata:\s*\n(?: {2}[^\n]+\n)* {2}version:\s*["']?[^"'\s]+["']?\s*$/m.test(frontmatter)) {
    fail('metadata.version is missing or malformed.');
  }
}

const lines = skill.length === 0 ? 0 : skill.split('\n').length - Number(skill.endsWith('\n'));
if (lines > 500) fail(`SKILL.md exceeds 500 lines (${lines}).`);

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
  ['diagnosis before prompt reconstruction', /Diagnose trajectory drift before reconstructing a prompt/],
  ['rewind and updated prompt output', /rewind recommendation and a copy-ready updated prompt/],
  ['current conversation default', /current conversation as the default source/],
  ['stable versus task-specific rules', /Separate stable collaboration preferences from task-specific requirements/],
  ['later discoveries become checks', /Convert later discoveries into instructions to inspect, verify, or compare first/],
  ['original objective preserved', /Preserve the user's original objective/],
  ['domain-neutral task handling', /source task's audience, artifact, evidence standard, and acceptance criteria/],
  ['general correction dimensions', /method, content, evidence, quality bar, output, or delivery/],
  ['rewind point detection', /Locate the Rewind Point/],
  ['independent-chain separation', /Keep independent correction chains separate/],
  ['no reliable fallback', /No reliable drift or rewind point detected/],
  ['counterfactual validation', /Run the counterfactual check/],
  ['supported-drift default output', /For one supported chain, return exactly these two artifacts first/],
  ['explicit prompt-only route', /explicit `--prompt-only`/],
  ['secret redaction', /Redact secrets, credentials/],
  ['evidence-strength axis', /`Evidence strength` measures the correction itself/],
  ['boundary-confidence axis', /Assign `boundary confidence` separately/],
];

for (const [label, pattern] of requiredContracts) {
  if (!pattern.test(skill)) fail(`Missing core contract: ${label}`);
}

const completionCriteria = skill.match(/\*\*Complete when:\*\*/g) || [];
if (completionCriteria.length !== 7) {
  fail(`Workflow must define exactly seven completion criteria (${completionCriteria.length} found).`);
}

const taxonomy = readRegularFile(path.join(referencesDir, 'correction-taxonomy.md'));
for (const [label, pattern] of [
  ['general task scope', /Wrong audience, channel, source, locale/],
  ['domain methods', /structure, tone, sequence, medium, architecture, or algorithm/],
  ['non-coding validation', /fact checks, examples, visual review, or stakeholder approval/],
  ['evidence-strength naming', /## Evidence Strength/],
  ['confidence-axis separation', /not the causal confidence of a rewind boundary/],
]) {
  if (!pattern.test(taxonomy)) fail(`Correction taxonomy is missing ${label}.`);
}

const outputContract = readRegularFile(path.join(referencesDir, 'output-contract.md'));
for (const [label, pattern] of [
  ['non-default scope', /# Non-default Output Contract/],
  ['explicit prompt-only mode', /## Prompt-only Mode/],
  ['detailed mode', /## Detailed Mode/],
  ['independent-chain output', /no single rewind point exists/],
  ['exact no-reliable fallback', /No reliable drift or rewind point detected/],
  ['completion criterion', /## Completion Criterion/],
]) {
  if (!pattern.test(outputContract)) fail(`Output contract is missing ${label}.`);
}
if (/## Outcome Decision|## Default/.test(outputContract)) {
  fail('Output contract must not duplicate the normal outcome or default format from SKILL.md.');
}

const rewindAnalysis = readRegularFile(path.join(referencesDir, 'rewind-analysis.md'));
for (const [label, pattern] of [
  ['exceptional scope', /# Exceptional Rewind Analysis/],
  ['independent chains', /## Independent Chains/],
  ['conflicting boundaries', /## Conflicting Candidate Boundaries/],
  ['missing early actions', /## Missing Early Actions/],
  ['boundary confidence', /boundary confidence/],
  ['no reliable boundary fallback', /No reliable drift or rewind point detected/],
  ['completion criterion', /## Completion Criterion/],
]) {
  if (!pattern.test(rewindAnalysis)) fail(`Rewind analysis is missing ${label}.`);
}

const sourceResolution = readRegularFile(path.join(referencesDir, 'source-resolution.md'));
for (const [label, pattern] of [
  ['truncated current-session recovery', /history as truncated/],
  ['same-session restriction', /only that session/],
  ['no false precision', /precise turn or timestamp/],
]) {
  if (!pattern.test(sourceResolution)) fail(`Source resolution is missing ${label}.`);
}

if (failures.length > 0) {
  for (const failure of failures) console.error(failure);
  process.exit(1);
}

console.log(`Butterfly Effect skill contract and ${referenceFiles.length} reference file(s): valid.`);
