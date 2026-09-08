#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.join(__dirname, '..');
const failures = [];

function fail(message) {
  failures.push(message);
}

function walkFiles(directory, predicate) {
  const files = [];
  if (!fs.existsSync(directory)) return files;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walkFiles(entryPath, predicate));
    else if (entry.isFile() && predicate(entryPath)) files.push(entryPath);
  }
  return files;
}

for (const relative of ['package.json', '.claude-plugin/plugin.json', '.claude-plugin/marketplace.json']) {
  try {
    JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
  } catch (error) {
    fail(`${relative}: invalid JSON: ${error.message}`);
  }
}

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (packageJson.packageManager !== 'npm@11.6.2') {
  fail('package.json must pin the npm release client through packageManager.');
}
if (packageJson.scripts?.prepublishOnly !== 'npm test') {
  fail('package.json must run the full test suite before publication.');
}
if (!/npm publish --dry-run/.test(packageJson.scripts?.['release:check'] || '')) {
  fail('package.json must provide a release:check dry run.');
}

const englishFiles = [
  'README.md',
  'AGENTS.md',
  'CHANGELOG.md',
  'CLAUDE.md',
  'CONTRIBUTING.md',
].map((relative) => path.join(root, relative));
englishFiles.push(...walkFiles(path.join(root, 'docs', 'en'), (filePath) => filePath.endsWith('.md')));

for (const filePath of englishFiles) {
  const content = fs.readFileSync(filePath, 'utf8');
  if (/\p{Script=Han}/u.test(content)) {
    fail(`${path.relative(root, filePath)} must not contain Chinese characters.`);
  }
}

function headingLevels(relative) {
  return fs.readFileSync(path.join(root, relative), 'utf8')
    .split(/\r?\n/)
    .filter((line) => /^#{1,6}\s+/.test(line))
    .map((line) => line.match(/^#+/)[0].length);
}

function codeFenceCount(relative) {
  return (fs.readFileSync(path.join(root, relative), 'utf8').match(/```/g) || []).length;
}

for (const [english, chinese] of [
  ['README.md', 'README-zh.md'],
  ['docs/en/design.md', 'docs/zh/design.md'],
  ['docs/en/examples.md', 'docs/zh/examples.md'],
]) {
  if (JSON.stringify(headingLevels(english)) !== JSON.stringify(headingLevels(chinese))) {
    fail(`${english} and ${chinese} must have equivalent heading structure.`);
  }
  if (codeFenceCount(english) !== codeFenceCount(chinese)) {
    fail(`${english} and ${chinese} must have equivalent code-example structure.`);
  }
}

for (const relative of ['README.md', 'README-zh.md']) {
  const content = fs.readFileSync(path.join(root, relative), 'utf8');
  for (const [label, pattern] of [
    ['Agent Skills installation', /npx skills add monadrome\/butterfly-effect-skill/],
    ['slash Skill invocation', /\/butterfly-effect/],
    ['Claude marketplace installation', /https:\/\/github\.com\/monadrome\/butterfly-effect-skill\.git/],
    ['explicit prompt-only mode', /--prompt-only/],
    ['detailed output mode', /--detailed/],
    ['no-reliable fallback', /No reliable drift or rewind point detected/],
    ['contribution link', /CONTRIBUTING\.md/],
    ['changelog link', /CHANGELOG\.md/],
    ['license link', /LICENSE/],
  ]) {
    if (!pattern.test(content)) fail(`${relative} is missing the ${label} contract.`);
  }
}

for (const relative of ['README.md', 'README-zh.md']) {
  const content = fs.readFileSync(path.join(root, relative), 'utf8');
  const installNames = [...content.matchAll(/npm install -D (@[^@\s/]+\/[^\s]+)/g)].map(([, name]) => name);
  if (installNames.length === 0 || installNames.some((name) => name !== packageJson.name)) {
    fail(`${relative} npm install command must reference the package name ${packageJson.name}.`);
  }
}

const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
const readmeZh = fs.readFileSync(path.join(root, 'README-zh.md'), 'utf8');
if (!/--detailed[^\n]+absorbed requirements and exclusions/.test(readme)) {
  fail('README.md must describe the bounded detailed-mode additions.');
}
if (!/--detailed[^\n]+已吸收的要求和未纳入项/.test(readmeZh)) {
  fail('README-zh.md must describe the bounded detailed-mode additions.');
}

const openAiAgent = fs.readFileSync(path.join(root, 'skills', 'butterfly-effect', 'agents', 'openai.yaml'), 'utf8');
if (!/short_description:\s*["']Recommend\b/.test(openAiAgent) || /short_description:\s*["']Continue\b/.test(openAiAgent)) {
  fail('OpenAI agent metadata must describe a recommendation, not imply that the Skill performs continuation.');
}

const workflowFiles = [
  path.join(root, '.github', 'workflows', 'test.yml'),
  path.join(root, '.github', 'workflows', 'publish.yml'),
];
for (const workflowPath of workflowFiles) {
  const workflow = fs.readFileSync(workflowPath, 'utf8');
  if (!/actions\/checkout@[0-9a-f]{40}/.test(workflow) || !/actions\/setup-node@[0-9a-f]{40}/.test(workflow)) {
    fail(`${path.relative(root, workflowPath)} must pin checkout and setup-node to immutable SHAs.`);
  }
  if (!/package-manager-cache:\s*false/.test(workflow)) {
    fail(`${path.relative(root, workflowPath)} must disable package-manager caching while the package has no lockfile.`);
  }
}

const publishWorkflow = fs.readFileSync(path.join(root, '.github', 'workflows', 'publish.yml'), 'utf8');
for (const [label, pattern] of [
  ['OIDC permission', /id-token:\s*write/],
  ['npm registry configuration', /registry-url:\s*['"]https:\/\/registry\.npmjs\.org['"]/],
  ['pinned npm client', /npm install --global npm@11\.6\.2/],
  ['explicit publication mode', /NPM_TRUSTED_PUBLISHER/],
  ['provenance publication', /npm publish --provenance/],
  ['provenance verification', /dist\.attestations\.provenance/],
  ['release dry run', /npm run release:check/],
]) {
  if (!pattern.test(publishWorkflow)) fail(`publish.yml is missing the ${label} contract.`);
}
if (/\n    env:\n      NPM_TOKEN:/.test(publishWorkflow)) {
  fail('publish.yml must not expose NPM_TOKEN at job scope.');
}

if (failures.length > 0) {
  for (const failure of failures) console.error(failure);
  process.exit(1);
}

for (const script of ['check-versions.js', 'check-skill-contract.js', 'check-package.js', 'check-install.js']) {
  const result = spawnSync(process.execPath, [path.join(__dirname, script)], {
    cwd: root,
    encoding: 'utf8',
  });
  process.stdout.write(result.stdout);
  process.stderr.write(result.stderr);
  if (result.status !== 0) process.exit(result.status || 1);
}

console.log(`Repository JSON, language boundaries, and bilingual README structure: valid.`);
