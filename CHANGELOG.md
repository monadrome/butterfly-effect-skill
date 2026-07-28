# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.1] - 2026-07-28

### Changed

- Rewrote both READMEs around the Skill's time-machine model: use later corrections as hindsight, return to the session node where outputs began to diverge, and revise the prompt at that point.
- Moved diagnostic terminology, historical design context, and maintainer-facing detail out of the primary explanation so first-time users can understand the value without learning the internal model.
- Simplified npm, Agent, and Claude plugin discovery descriptions to state the user-visible outcome.

## [0.4.0] - 2026-07-28

### Changed

- Made trajectory-drift diagnosis an explicit gate before prompt reconstruction, so the Skill no longer assumes every session contains a rewindable failure.
- Unified single-chain, independent-chain, missing-history, weak-causality, and no-material-drift outcomes in one evidence-first output decision.
- Changed the no-reliable fallback to avoid generating an unsupported updated prompt unless reconstruction is explicitly requested from limited evidence.
- Strengthened bilingual documentation, examples, maintainer guidance, plugin metadata, and static checks around explicit-only `--prompt-only`, confidence, and false-precision prevention.
- Added a prepublish test guard, npm publication dry run, pinned release client metadata, clean tarball installation smoke test, and lockfile-free CI configuration.

## [0.3.0] - 2026-07-28

### Changed

- Repositioned the Skill as AI trajectory-drift correction: it links repeated corrections into causal chains and locates the earliest supported Agent assumption or action behind each chain.
- Changed the default output from a prompt alone to a concise rewind recommendation followed by a copy-ready updated prompt; prompt-only output now requires an explicit request.
- Added explicit handling for multiple independent chains, missing or truncated current-session history, uncertain rewind boundaries, and sessions with no material drift.
- Updated bilingual documentation, examples, metadata, source routing, and static contract checks for the rewind-first behavior.

## [0.2.0] - 2026-07-27

### Changed

- Generalized correction extraction, classification, prompt composition, and examples for coding, research, writing, design, planning, operations, and other AI-assisted work.
- Added domain-neutral handling for audiences, artifacts, evidence standards, quality bars, acceptance criteria, and delivery workflows.
- Expanded bilingual examples for research decisions and creative work while preserving coding support.

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
