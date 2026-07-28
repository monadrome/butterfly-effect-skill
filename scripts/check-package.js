#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.join(__dirname, '..');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const failures = [];

function fail(message) {
  failures.push(message);
}

const packed = spawnSync(npm, ['pack', '--dry-run', '--json', '--ignore-scripts'], {
  cwd: root,
  encoding: 'utf8',
});

if (packed.status !== 0) {
  process.stderr.write(packed.stderr || packed.stdout);
  process.exit(packed.status || 1);
}

let archive;
try {
  const parsed = JSON.parse(packed.stdout);
  if (!Array.isArray(parsed) || parsed.length !== 1) throw new Error('expected one package result');
  [archive] = parsed;
} catch (error) {
  console.error(`Unable to parse npm pack output: ${error.message}`);
  process.exit(1);
}

const packedPaths = new Set(archive.files.map(({ path: filePath }) => filePath));
const requiredPaths = [
  '.claude-plugin/marketplace.json',
  '.claude-plugin/plugin.json',
  'LICENSE',
  'README.md',
  'README-zh.md',
  'package.json',
  'scripts/check-install.js',
  'skills/butterfly-effect/SKILL.md',
  'skills/butterfly-effect/agents/openai.yaml',
];

for (const required of requiredPaths) {
  if (!packedPaths.has(required)) fail(`Package is missing required file: ${required}`);
}

for (const filePath of packedPaths) {
  if (filePath.startsWith('.github/') || /(^|\/)(?:task_plan|findings|progress)\.md$/.test(filePath)) {
    fail(`Package includes repository-only file: ${filePath}`);
  }
}

const markdownFiles = [...packedPaths]
  .filter((filePath) => filePath.endsWith('.md'))
  .map((filePath) => path.join(root, filePath));
const markdownLink = /!?\[[^\]]*\]\(([^)\s]+)(?:\s+["'][^)]*["'])?\)/g;

for (const sourcePath of markdownFiles) {
  const source = fs.readFileSync(sourcePath, 'utf8');
  let match;
  while ((match = markdownLink.exec(source)) !== null) {
    const rawTarget = match[1];
    if (/^(?:[a-z]+:|#)/i.test(rawTarget)) continue;
    const targetWithoutAnchor = rawTarget.split('#')[0].split('?')[0];
    if (!targetWithoutAnchor) continue;

    let decodedTarget;
    try {
      decodedTarget = decodeURIComponent(targetWithoutAnchor);
    } catch {
      fail(`${path.relative(root, sourcePath)} has an invalid encoded link: ${rawTarget}`);
      continue;
    }

    const resolved = path.resolve(path.dirname(sourcePath), decodedTarget);
    const relative = path.relative(root, resolved).split(path.sep).join('/');
    if (relative.startsWith('../') || path.isAbsolute(relative)) {
      fail(`${path.relative(root, sourcePath)} links outside the package: ${rawTarget}`);
    } else if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) {
      fail(`${path.relative(root, sourcePath)} has a missing local link: ${rawTarget}`);
    } else if (!packedPaths.has(relative)) {
      fail(`${path.relative(root, sourcePath)} links to a file excluded from the package: ${relative}`);
    }
  }
}

if (failures.length > 0) {
  for (const failure of failures) console.error(failure);
  process.exit(1);
}

console.log(`Package archive contains ${packedPaths.size} files and all packaged Markdown links resolve.`);
