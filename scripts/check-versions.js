#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const pinnedSemver = /^\d+\.\d+\.\d+$/;
const versions = [];
let failed = false;

for (const relPath of ['.claude-plugin/plugin.json', 'package.json']) {
  try {
    const version = JSON.parse(fs.readFileSync(path.join(root, relPath), 'utf8')).version;
    versions.push([relPath, version]);
    if (typeof version !== 'string' || !pinnedSemver.test(version)) {
      console.error(`${relPath}: version must be pinned X.Y.Z semver`);
      failed = true;
    }
  } catch (error) {
    console.error(`${relPath}: ${error.message}`);
    failed = true;
  }
}

try {
  const skillPath = 'skills/butterfly-effect/SKILL.md';
  const skill = fs.readFileSync(path.join(root, skillPath), 'utf8');
  const match = skill.match(/version:\s*["']?([^"'\s]+)["']?/);
  if (!match) throw new Error('metadata.version not found');
  versions.push([skillPath, match[1]]);
  if (!pinnedSemver.test(match[1])) {
    console.error(`${skillPath}: version must be pinned X.Y.Z semver`);
    failed = true;
  }
} catch (error) {
  console.error(`skills/butterfly-effect/SKILL.md: ${error.message}`);
  failed = true;
}

const distinct = [...new Set(versions.map(([, version]) => version))];
if (distinct.length !== 1) {
  console.error('Version mismatch:');
  for (const [file, version] of versions) console.error(`  ${version}\t${file}`);
  failed = true;
}

const shared = distinct.length === 1 ? distinct[0] : null;
if (shared && process.env.GITHUB_REF_TYPE === 'tag') {
  const tagVersion = (process.env.GITHUB_REF_NAME || '').replace(/^v/, '');
  if (pinnedSemver.test(tagVersion) && tagVersion !== shared) {
    console.error(`release tag ${process.env.GITHUB_REF_NAME} does not match ${shared}`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log(`All ${versions.length} version files pinned at ${shared}.`);
