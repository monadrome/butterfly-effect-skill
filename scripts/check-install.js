#!/usr/bin/env node

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.join(__dirname, '..');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'butterfly-effect-install-'));

function run(args, cwd = root) {
  const result = spawnSync(npm, args, {
    cwd,
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
  });

  if (result.status !== 0) {
    process.stdout.write(result.stdout || '');
    process.stderr.write(result.stderr || '');
    throw new Error(`npm ${args.join(' ')} failed with status ${result.status}`);
  }

  return result.stdout;
}

try {
  const packOutput = run([
    'pack',
    '--json',
    '--ignore-scripts',
    '--pack-destination',
    temporaryRoot,
  ]);
  const packed = JSON.parse(packOutput);
  if (!Array.isArray(packed) || packed.length !== 1 || !packed[0].filename) {
    throw new Error('npm pack did not return exactly one archive');
  }

  fs.writeFileSync(
    path.join(temporaryRoot, 'package.json'),
    `${JSON.stringify({ name: 'butterfly-effect-install-smoke', private: true }, null, 2)}\n`,
  );

  const archivePath = path.join(temporaryRoot, packed[0].filename);
  run([
    'install',
    '--ignore-scripts',
    '--no-audit',
    '--no-fund',
    '--package-lock=false',
    archivePath,
  ], temporaryRoot);

  const installedRoot = path.join(
    temporaryRoot,
    'node_modules',
    '@huatalk',
    'butterfly-effect-skill',
  );
  const sourcePackage = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const installedPackage = JSON.parse(fs.readFileSync(path.join(installedRoot, 'package.json'), 'utf8'));

  if (installedPackage.name !== sourcePackage.name || installedPackage.version !== sourcePackage.version) {
    throw new Error('installed package name or version differs from the source manifest');
  }

  for (const relative of [
    'README.md',
    'README-zh.md',
    'skills/butterfly-effect/SKILL.md',
    'skills/butterfly-effect/references/rewind-analysis.md',
  ]) {
    const installedPath = path.join(installedRoot, relative);
    if (!fs.existsSync(installedPath) || !fs.lstatSync(installedPath).isFile()) {
      throw new Error(`installed package is missing ${relative}`);
    }
  }

  for (const relative of ['.github', 'task_plan.md', 'findings.md', 'progress.md']) {
    if (fs.existsSync(path.join(installedRoot, relative))) {
      throw new Error(`installed package contains repository-only path ${relative}`);
    }
  }

  console.log(`Clean install smoke test passed for ${installedPackage.name}@${installedPackage.version}.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  fs.rmSync(temporaryRoot, { recursive: true, force: true });
}
