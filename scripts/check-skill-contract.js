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
  if (description.length < 100 || !/蝴蝶效应/.test(description) || !/corrections/i.test(description)) {
    fail('Description must explain correction-to-restart behavior and retain bilingual discovery terms.');
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
  ['copy-ready restart prompt', /Produce a copy-ready restart prompt/],
  ['current conversation default', /current conversation as the default source/],
  ['stable versus task-specific rules', /Separate stable collaboration preferences from task-specific requirements/],
  ['later discoveries become checks', /Convert them into instructions to inspect, verify, or compare first/],
  ['original objective preserved', /Preserve the user's original objective/],
  ['counterfactual validation', /Run the Counterfactual Check/],
  ['default prompt-only output', /Default output: one blockquote containing only the restart prompt/],
  ['secret redaction', /Do not reproduce secrets, credentials/],
];

for (const [label, pattern] of requiredContracts) {
  if (!pattern.test(skill)) fail(`Missing core contract: ${label}`);
}

if (failures.length > 0) {
  for (const failure of failures) console.error(failure);
  process.exit(1);
}

console.log(`Butterfly Effect skill contract and ${referenceFiles.length} reference file(s): valid.`);
