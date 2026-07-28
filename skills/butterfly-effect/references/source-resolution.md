# Source Resolution

Use the least invasive source that contains the requested interaction history, regardless of whether the work was coding, research, writing, design, planning, or operations.

## Current conversation

Use the visible conversation directly when it contains the opening request and the Agent actions needed to explain the correction chain. Treat the history as truncated when the first visible turn refers to omitted work, starts after the suspected drift, or is presented as a summary without the underlying turns.

When the current session is identifiable and its local log is accessible, resolve only that session to recover the missing early turns. Do not search unrelated sessions or use a different session as a proxy. If the current session cannot be identified or read, use the visible evidence, lower rewind confidence, and avoid precise turn or timestamp claims.

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

Use the user-provided path, export, handoff, chat log, issue discussion, review thread, document, notes, or research log. Preserve chronology and distinguish human messages from generated summaries.

## Safety and evidence

- Read only the requested session scope.
- Never expose raw credentials or irrelevant private data in the result.
- Treat generated summaries as secondary evidence when raw turns are available.
- If session names are ambiguous, choose the strongest exact match and state the assumption only when it affects the result.
- Preserve chronological order and distinguish Agent assumptions/actions from user corrections; a correction is evidence for an earlier drift point, not the drift point itself.
