# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-07-27

### Added

- Added the `/butterfly-effect` Skill for converting repeated human corrections into a copy-ready restart prompt.
- Added source resolution for current conversations, Codex sessions, Claude Code sessions, and exported transcripts.
- Added correction classification, hindsight-leak prevention, and counterfactual prompt validation.
- Added npm and Claude Code plugin distribution metadata, bilingual documentation, CI, and static contract checks.
- Added release-tag regression tests, package-content and local-link validation, bilingual README structure checks, and progressive-loading maintainer guidance.

### Changed

- Reduced the always-loaded Skill instructions while preserving its discovery metadata, direct reference routes, and behavior contract.
- Reorganized both READMEs around a complete install, invoke, and restart path; expanded bilingual design, usage, privacy, limitation, and example documentation.
- Hardened GitHub Actions with immutable action pins, Dependabot updates, explicit concurrency and permissions, a pinned npm client, explicit token or OIDC publication modes, and registry provenance verification.

### Fixed

- Reject malformed or mismatched `v*` release tags before publication.
- Reject missing, nested, non-regular, or indirectly linked Skill references.
