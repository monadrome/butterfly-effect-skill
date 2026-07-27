# Source Resolution

Use the least invasive source that contains the requested interaction history.

## Current conversation

Use the visible conversation directly. Do not search local logs unless the user names an older or missing session.

## Codex

Common local locations:

```text
~/.codex/session_index.jsonl
~/.codex/history.jsonl
~/.codex/sessions/YYYY/MM/DD/*.jsonl
~/.codex/archived_sessions/*.jsonl
```

Resolve a named session through `session_index.jsonl`, locate the matching session id with `rg`, then extract user and assistant messages in timestamp order. Prefer `jq` over ad hoc parsing. Exclude system instructions and tool payloads unless they explain a correction.

## Claude Code

Common local location:

```text
~/.claude/projects/**/<session-id>.jsonl
```

Exclude `subagents/` by default. Include a sub-agent transcript only when the user's correction directly concerns delegated work. Extract human-readable user and assistant text; ignore tool results and local command caveats unless they changed the task.

## Other agents or exported transcripts

Use the user-provided path, export, handoff, chat log, issue discussion, or review thread. Preserve chronology and distinguish human messages from generated summaries.

## Safety and evidence

- Read only the requested session scope.
- Never expose raw credentials or irrelevant private data in the result.
- Treat generated summaries as secondary evidence when raw turns are available.
- If session names are ambiguous, choose the strongest exact match and state the assumption only when it affects the result.
