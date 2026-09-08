# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.7.0] - 2026-09-08

### Changed

- Moved the npm package from `@huatalk/butterfly-effect-skill` to `@monadrome/butterfly-effect-skill` after the GitHub organization rename. The old package name stays published and is deprecated with a pointer to the new scope, so existing lockfiles keep resolving while new installs use `@monadrome`.
- Clarified the Skill contract: reply in the user's language, treat `--prompt-only` and `--detailed` as explicit only when passed in the invocation, name the artifact a rewind recommendation applies to, and state what `Keep` carries into the new trajectory.
- Added Claude Code project-directory resolution to the source-resolution reference: the encoded project directory name and how to identify the current session among several transcripts.

### Fixed

- Accept both the npm 11 array and the npm 12 object form of `npm pack --json` output in the package and install checks.
- Derive the installed package path in the install smoke test from the manifest name instead of a hard-coded scope.
- Check that the README install commands reference the manifest package name.

## [0.6.0] - 2026-08-02

### Changed

- Return updated prompts in fenced `text` code blocks so copied prompts do not contain Markdown blockquote markers.

### Fixed

- Quoted the Skill frontmatter description so YAML parsers do not interpret `Chinese triggers:` as a nested mapping and reject package installation.

## [0.5.0] - 2026-07-28

### Changed

- Aligned Skill discovery and user documentation around the session time-machine model while preserving the existing README examples and structure.
- Described the output as guidance for continuing from a selected history point.
- Adopted artifact-first drift diagnosis: only rework of a produced task artifact establishes drift, while pre-version requirements, accepted-artifact evolution, and repeated explanations are no-op.
- Added the project glossary and ADR explaining why later requests become continuation constraints only after artifact drift is established.
- Replaced the generated reasoning workflow with a minimal decision contract that relies on the Agent's native analysis ability.
- Removed uncalibrated reliability labels; visible evidence now determines an exact boundary, a descriptive boundary, or the no-reliable fallback.
- Retained only the environment-specific source-resolution reference and inlined the small set of product decisions that affect output.
- Reduced runtime Skill content from about 1,600 words to about 700 while preserving hindsight handling, output modes, and the existing README examples.

## [0.4.1] - 2026-07-28

### Changed

- Clarified the README introduction with the session time-machine model: use later corrections to return to the point where LLM output began to diverge, while preserving the existing examples and documentation structure.

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

- Added the `/butterfly-effect` Skill for converting repeated human corrections into a copy-ready continuation prompt from an earlier history point.
- Added source resolution for current conversations, Codex sessions, Claude Code sessions, and exported transcripts.
- Added correction classification, hindsight-leak prevention, and counterfactual prompt validation.
- Added npm and Claude Code plugin distribution metadata, bilingual documentation, CI, and static contract checks.
- Added release-tag regression tests, package-content and local-link validation, bilingual README structure checks, and progressive-loading maintainer guidance.

### Changed

- Reduced the always-loaded Skill instructions while preserving its discovery metadata, direct reference routes, and behavior contract.
- Reorganized both READMEs around a complete install, invoke, and history-point continuation path; expanded bilingual design, usage, privacy, limitation, and example documentation.
- Hardened GitHub Actions with immutable action pins, Dependabot updates, explicit concurrency and permissions, a pinned npm client, explicit token or OIDC publication modes, and registry provenance verification.

### Fixed

- Reject malformed or mismatched `v*` release tags before publication.
- Reject missing, nested, non-regular, or indirectly linked Skill references.
