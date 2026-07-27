# Examples

These examples show the source request, the observed corrections, and the restart artifact. The wording is illustrative; the actual prompt must stay grounded in the selected session.

## Current Conversation

Request:

```text
Use $butterfly-effect on this session.
```

Observed corrections:

- Analyze before editing.
- Work in the named worktree.
- Preserve V2 and add a gated V3.
- Do not add tests unless requested.

Restart prompt:

> First inspect the named worktree and explain the existing behavior, call chain, and cause without editing. Wait for confirmation before implementation. Preserve V2, add V3 behind a default-off flag, keep configuration reads at the entry and core matching logic pure, run existing tests without adding new ones unless requested, and verify the worktree diff before committing and pushing.

No local session lookup is needed because the visible conversation is the default source.

## Non-coding Task

Observed corrections from a product-positioning session:

- Start from the product's first principles instead of a popular template.
- Treat release as a scenario, not a prerequisite.
- Ask for approval before changing high-impact discovery text.

Restart prompt:

> First establish the product's core outcome, user motivation, trigger boundary, and invariants; do not begin from a popular template. Treat release workflows as common scenarios rather than prerequisites. Present positioning and discovery-description candidates for explicit selection before editing, then keep the Skill, README, package, and marketplace wording consistent.

## Named Local Session

Request:

```text
Use $butterfly-effect on the Codex session "checkout-refactor".
```

The Skill resolves that exact local session, extracts human and assistant messages in timestamp order, and excludes tool payloads unless they explain a correction. A Claude Code session can be named in the same way. If several sessions have similar names, the strongest exact match is used and the assumption is stated only when it affects the result.

## Transcript or Handoff

Request:

```text
Use $butterfly-effect on /work/exports/checkout-review.md.
```

A direct path is read as supplied. Message order and speaker attribution are preserved. For an issue discussion or review thread, export it or provide a locally readable path; the Skill does not fetch remote content implicitly.

## Detailed Mode

Request:

```text
Use $butterfly-effect --detailed on this session.
```

Output shape:

```markdown
## Restart prompt

> First inspect ...

## Corrections absorbed

- Analysis gate -> inspect and explain before editing.
- Compatibility -> preserve the old path and gate the new path.

## Not included

- The exact root cause was discovered later, so it became an inspection step.
- An isolated tone reaction was too weak to treat as a stable preference.
```

The restart prompt remains first. Detailed mode explains the mapping; it does not replace the prompt with a retrospective.

## Multiple Sessions

Request:

```text
Use $butterfly-effect on these three session exports and produce one restart prompt per representative case.
```

Analyze each source independently before comparing them. Each output prompt must stand alone under a descriptive title. A rule becomes cross-session guidance only when it repeats or the user explicitly asks to retain it; unrelated one-off decisions stay with their original case.

## Later Discovery

Suppose the session eventually discovers that production configuration is only partially applied. Do not state that as prior knowledge:

```text
The production configuration is only partially applied.
```

Convert it into discovery work:

> Pull all related production configuration values before proposing changes, distinguish missing values from empty values and code defaults, and trace how each value affects routing, storage, filtering, and final output.

## Stable Preference and One-off Decision

Evidence:

- The user says "analyze before editing" in several sessions and explicitly asks the agent to remember it.
- In one session, the user temporarily requests no tests because a staging environment is unavailable.

Treatment:

- Include an analysis gate as a stable collaboration preference when it applies.
- Keep the temporary test restriction only in that task's restart prompt. Do not generalize it into "the user never wants tests."

## Missing History and Privacy

If a named session cannot be read, state the missing source in one sentence and use only evidence that remains visible. Do not fabricate the lost corrections.

If a transcript contains a token, customer identifier, or unrelated personal detail, omit it from the output. Preserve the operational requirement in redacted form when it matters, such as "authenticate with the configured service account," without reproducing the value or identity.
