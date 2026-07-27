# Butterfly Effect

Turn the corrections that happened later into a better prompt at the beginning.

Butterfly Effect reads an AI-assisted session, identifies the human corrections that changed its direction, and produces a copy-ready prompt for restarting the task with hindsight.

[Chinese documentation](README-zh.md)

## Quickstart

Install for supported coding agents:

```bash
npx skills add HuaTalk/butterfly-effect-skill
```

Then ask:

```text
Use $butterfly-effect to turn the corrections in this session into a better initial prompt.
```

Claude Code native plugin:

```text
/plugin marketplace add HuaTalk/butterfly-effect-skill
/plugin install butterfly-effect@butterfly-effect
/butterfly-effect
```

## What It Produces

By default, the Skill returns only a compact restart prompt:

> First inspect the existing implementation and explain the current behavior, call chain, and cause before editing. Wait for confirmation before implementation. Preserve the old path, gate the new path behind a default-off flag, keep core logic pure with explicit inputs, run existing tests without adding new tests unless requested, and verify the correct worktree and review diff before committing and pushing.

Pass `--detailed` when you also want the correction themes and exclusions behind the prompt.

## How It Works

1. Reconstruct the original objective and information available at the start.
2. Extract material correction events from the session.
3. Separate stable preferences from task-specific and one-off decisions.
4. Convert later discoveries into required checks instead of fake prior knowledge.
5. Compose the prompt in execution order.
6. Check whether it would have prevented every high-confidence correction.

See [examples](docs/en/examples.md) and [design notes](docs/en/design.md).

## Sources

The current conversation is the default source. The Skill can also analyze a named Codex or Claude Code session, a transcript, a handoff, an issue discussion, or a review thread when the source is available locally.

## Philosophy

The name comes from changing a small condition at the beginning to alter the entire downstream path. The Skill does not merely summarize what went wrong. It rewrites the starting instruction so a fresh agent can avoid the same rework while still discovering facts that were not initially knowable.

## Development

```bash
npm test
npm pack --dry-run
```

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT
