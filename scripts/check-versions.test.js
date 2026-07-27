#!/usr/bin/env node

const assert = require('node:assert/strict');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const root = path.join(__dirname, '..');
const script = path.join(__dirname, 'check-versions.js');
const packageVersion = require('../package.json').version;

function run(refType, refName) {
  const env = { ...process.env };
  delete env.GITHUB_REF_TYPE;
  delete env.GITHUB_REF_NAME;
  if (refType !== undefined) env.GITHUB_REF_TYPE = refType;
  if (refName !== undefined) env.GITHUB_REF_NAME = refName;

  return spawnSync(process.execPath, [script], {
    cwd: root,
    encoding: 'utf8',
    env,
  });
}

test('accepts local and branch checks without a release tag', () => {
  assert.equal(run().status, 0);
  assert.equal(run('branch', 'main').status, 0);
});

test('accepts only the exact versioned release tag', () => {
  assert.equal(run('tag', `v${packageVersion}`).status, 0);

  const [major, minor, patch] = packageVersion.split('.').map(Number);
  const mismatchedVersion = `v${major}.${minor}.${patch + 1}`;

  for (const tag of [mismatchedVersion, `v${major}.${minor}`, 'vbogus', packageVersion, '']) {
    const result = run('tag', tag);
    assert.notEqual(result.status, 0, `${JSON.stringify(tag)} should fail`);
    assert.match(result.stderr, /must exactly match/);
  }
});
