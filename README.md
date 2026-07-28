# Butterfly Effect

[![CI](https://github.com/HuaTalk/butterfly-effect-skill/actions/workflows/test.yml/badge.svg)](https://github.com/HuaTalk/butterfly-effect-skill/actions/workflows/test.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Chinese](https://img.shields.io/badge/lang-Chinese-blue.svg)](README-zh.md)

**Turn a correction-heavy AI session into a better restart.**

When you have repeatedly told an AI agent to change direction, Butterfly Effect finds the earliest supported assumption that sent the work off course. It gives you two things: a short recommendation for where to rewind and an updated prompt you can paste into a fresh session.

No setup is needed before the original session. Use the conversation you already have.

## See It in 30 Seconds

You started with:

> Fix the intermittent duplicate charges in checkout.

The session then needed several corrections: inspect more than the frontend button, trace callbacks and retries, prove the cause before editing, and preserve the existing payment API.

Run:

```text
Use /butterfly-effect on this session.
```

You get:

**Rewind recommendation**

> Rewind to before the Agent treated the frontend button as the only payment entry point. That assumption led to the later corrections about callbacks, retries, and idempotency.

**Updated prompt**

> First reproduce the duplicate charge and trace the full path through user submission, server-side order creation, payment callbacks, and retry jobs. Explain the evidence and root cause before editing. Preserve the existing payment API, then add regression coverage for the confirmed failure path.

Paste the updated prompt into a new session and restart the same task with the useful corrections already included.

## When to Use It

Use Butterfly Effect when:

- the agent kept solving the wrong version of the problem;
- several corrections were needed before the work became acceptable;
- you want to restart without repeating the same guidance;
- you need to understand which earlier assumption caused the rework.

It works with coding, research, writing, design, planning, operations, and other AI-assisted work.

It may return `No reliable drift or rewind point detected` when the conversation does not show a defensible cause. That is preferable to inventing a prompt from unrelated follow-up requests.

## Install

### Agent Skills

For Codex, Cursor, Windsurf, Gemini CLI, GitHub Copilot, Cline, and other compatible agents:

```bash
npx skills add HuaTalk/butterfly-effect-skill
```

### Claude Code

Register the marketplace, then install the plugin:

```text
/plugin marketplace add https://github.com/HuaTalk/butterfly-effect-skill.git
/plugin install butterfly-effect@butterfly-effect
```

Restart Claude Code after installation. The native command is `/butterfly-effect:butterfly-effect`; `/butterfly-effect` also works when no other command uses that name.

### npm

For environments using `skills-npm`:

```bash
npm install -D @huatalk/butterfly-effect-skill
npx skills-npm setup
```

## Use It

### Current Conversation

The current conversation is the default source:

```text
Use /butterfly-effect on this session.
```

If the visible conversation is truncated, the Skill may recover only the identifiable current session. It does not search unrelated sessions as a substitute.

### Transcript or Named Session

You can point it to an exported transcript or a named local session:

```text
Use /butterfly-effect on /path/to/transcript.md.
Use /butterfly-effect on Codex session "launch-plan".
```

For several sessions, ask it to analyze each one independently. More examples are available in [docs/en/examples.md](docs/en/examples.md).

### Output Modes

| Request | Result |
|---|---|
| `Use /butterfly-effect on this session.` | Rewind recommendation and updated prompt |
| `Use /butterfly-effect --prompt-only on this session.` | Updated prompt only |
| `Use /butterfly-effect --detailed on this session.` | Default result followed by supporting corrections and exclusions |

`--prompt-only` must be requested explicitly.

## What It Reads

- Without a named source, only the current session is used.
- With a session or path, only the requested history needed for the task is read.
- Credentials, secrets, private identifiers, and irrelevant personal content are omitted from output.
- Facts discovered later are turned into instructions to inspect or verify, rather than presented as if they were known at the start.

## Limitations

Correction detection and causal linkage depend on model judgment. Missing history, independent changes of direction, or ambiguous user feedback can prevent a reliable rewind recommendation. Review important prompts before reuse, especially when a transcript spans multiple sessions or contains sensitive material.

For the evidence model and failure cases, see the [design notes](docs/en/design.md).

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

Read [CONTRIBUTING.md](CONTRIBUTING.md) before changing behavior or release metadata. Report defects through [GitHub Issues](https://github.com/HuaTalk/butterfly-effect-skill/issues).

## License

[MIT](LICENSE)
