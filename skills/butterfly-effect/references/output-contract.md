# Output Contract

## Default

Return two compact artifacts in this order:

```markdown
## Rewind recommendation

- Rewind to: before the Agent assumed ...
- Why: ...
- Keep: ...
- Confidence: high

## Updated prompt

> First establish ... Then ...
```

Keep the recommendation actionable rather than retrospective. Do not preface it with a session summary or end with an offer to do more.

When no reliable drift boundary exists, say `No reliable drift or rewind point detected` and explain the evidence gap in one sentence. Do not invent a turn, timestamp, or causal chain.

When several independent chains exist, list each rewind boundary briefly and provide separate prompts only when one prompt cannot cover them without conflating their objectives.

## Prompt-only mode

When the user explicitly requests `--prompt-only`, return only the updated prompt blockquote. This is an explicit output mode, not the default.

## Detailed mode

Put the rewind recommendation and updated prompt first, then use at most two short evidence sections:

```markdown
## Rewind recommendation

- ...

## Updated prompt

> ...

## Corrections absorbed

- ...

## Not included

- ...
```

## Prompt shape

- Prefer one paragraph for a focused updated prompt and two to four short paragraphs for a complex task.
- Keep concrete names, sources, audiences, channels, paths, versions, constraints, and invariants when they are known at the start.
- Use semicolons to combine closely related constraints, not to compress unrelated stages.
- State negative constraints directly.
- Use the domain's own verbs and artifacts (for example, draft, plan, compare, design, implement, or publish) instead of forcing every task into a coding workflow.
- Avoid commentary such as "based on our previous conversation"; the restarted agent does not have that conversation.
- Avoid explaining why each rule exists inside the prompt unless the rationale changes execution.

## Multiple cases

When producing several prompts, save or present each independently with a descriptive title. Each prompt must stand alone and must not refer to another case document.
