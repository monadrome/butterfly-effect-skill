# Butterfly Effect

[![CI](https://github.com/HuaTalk/butterfly-effect-skill/actions/workflows/test.yml/badge.svg)](https://github.com/HuaTalk/butterfly-effect-skill/actions/workflows/test.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Chinese](https://img.shields.io/badge/lang-Chinese-blue.svg)](README-zh.md)

**Turn the corrections that happened later into a better prompt at the beginning.**

Butterfly Effect reads an existing AI-assisted conversation, identifies the human corrections that materially changed the work, and returns a copy-ready prompt for restarting the same task with hindsight. It needs no advance tracker or correction tagging, and the prompt never pretends that facts discovered later were known at the start.

## Quickstart

Install the Skill from GitHub:

```bash
npx skills add HuaTalk/butterfly-effect-skill
```

After a correction-heavy session, ask:

```text
Use $butterfly-effect to turn the corrections in this session into a better initial prompt.
```

Paste the returned blockquote into a fresh session to restart the task.

## Example

Suppose a coding session accumulated these corrections:

- Inspect and explain before editing.
- Work in the named worktree.
- Preserve V2 and add a gated V3.
- Run existing tests, but do not add tests unless requested.

Butterfly Effect returns the restart prompt first:

> First inspect the named worktree and explain the existing behavior, call chain, and cause without editing. Wait for confirmation before implementation. Preserve V2, add V3 behind a default-off flag, keep configuration reads at the entry and core matching logic pure, run existing tests without adding new ones unless requested, and verify the worktree diff before committing and pushing.

The accepted constraints become direct instructions. A root cause discovered only after reading the code would instead become an instruction to inspect or reproduce the behavior first.

## Installation

### Agent Skills

Use this for Codex, Cursor, Windsurf, Gemini CLI, GitHub Copilot, Cline, and other environments supported by the Agent Skills ecosystem:

```bash
npx skills add HuaTalk/butterfly-effect-skill
```

Install location and compatibility depend on the installer and the host agent's Skill implementation.

### Claude Code

Register the repository as a plugin marketplace:

```text
/plugin marketplace add https://github.com/HuaTalk/butterfly-effect-skill.git
```

Install the plugin in a separate prompt:

```text
/plugin install butterfly-effect@butterfly-effect
```

Restart Claude Code after installation. The native plugin command is `/butterfly-effect:butterfly-effect`; the shorter `/butterfly-effect` also works when no other command uses that name.

## Usage

The current conversation is the default source. Local history is searched only when the request names an older or missing session.

| Goal | Example request | Source behavior |
|---|---|---|
| Restart the current task | `Use $butterfly-effect on this session.` | Uses the visible conversation only |
| Analyze a named local session | `Use $butterfly-effect on Codex session "checkout-refactor".` | Resolves and reads that session |
| Analyze an exported record | `Use $butterfly-effect on /path/to/transcript.md.` | Reads the supplied transcript or handoff in order |
| Include supporting analysis | `Use $butterfly-effect --detailed on this session.` | Returns the prompt first, then corrections and exclusions |
| Compare several sessions | `Use $butterfly-effect on these three session exports.` | Analyzes each independently before retaining repeated rules |

For an issue discussion or review thread, provide a locally accessible export or path. The Skill does not fetch remote discussions implicitly. See [more examples](docs/en/examples.md).

## How It Works

1. Reconstruct the original objective and information available at the start.
2. Extract turns where the user materially corrected the agent's approach.
3. Separate stable preferences, task-specific requirements, and one-off decisions.
4. Turn later discoveries into inspection or verification steps.
5. Compose the restart prompt in execution order.
6. Check that it covers every high-confidence correction without adding unsupported rules.

## Design Principles

- **Zero preparation:** analyze records that already exist; no initialization, hooks, or correction tagging are required beforehand.
- **Prompt-first:** return the artifact needed for a fresh session instead of making the user translate a retrospective report.
- **Counterfactual restart:** reconstruct what should have been said initially while staying honest about what was knowable then.

Read the [design notes](docs/en/design.md) for the evidence model, non-goals, and failure modes.

## Privacy and Scope

- Without an explicit source, only the visible conversation is used.
- When a session or path is named, read only the requested history needed for the task.
- Credentials, secrets, private identifiers, and irrelevant personal content are omitted from output.
- Missing history and ambiguous evidence are reported briefly; corrections are never invented.
- Generated summaries are secondary evidence when raw chronological messages are available.

## Validation and Limitations

Repository CI checks version consistency, release tags, Skill contract anchors, local references, plugin manifests, bilingual README structure, English-document language boundaries, and npm package contents. It does not yet measure runtime extraction accuracy.

Correction classification depends on model judgment. A result may miss an implicit preference, overfit a one-off reaction, or soften a contradiction incorrectly. Review important restart prompts before using them, especially when the source spans several sessions or contains sensitive material.

## Updating

Agent Skills:

```bash
npx skills add HuaTalk/butterfly-effect-skill
```

Claude Code:

```text
/plugin update butterfly-effect@butterfly-effect
```

Restart Claude Code after updating. See the [changelog](CHANGELOG.md) for release details.

## Development

```bash
npm test
npm run check:package
```

`npm test` runs the release-tag regression tests and all repository, Skill, documentation, and package checks. Contributions are welcome; read [CONTRIBUTING.md](CONTRIBUTING.md) before changing behavior or release metadata. Report defects through [GitHub Issues](https://github.com/HuaTalk/butterfly-effect-skill/issues).

## License

[MIT](LICENSE)
