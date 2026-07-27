# Output Contract

## Default

Return only one copy-ready blockquote:

```markdown
> First inspect ... Then ...
```

Do not preface it with a session summary. Do not end with an offer to do more.

## Detailed mode

Put the prompt first, then use at most two short sections:

```markdown
## Restart prompt

> ...

## Corrections absorbed

- ...

## Not included

- ...
```

## Prompt shape

- Prefer one paragraph for a focused task and two to four short paragraphs for a complex task.
- Keep concrete names, paths, versions, flags, and invariants when they are known at the start.
- Use semicolons to combine closely related constraints, not to compress unrelated stages.
- State negative constraints directly.
- Avoid commentary such as "based on our previous conversation"; the restarted agent does not have that conversation.
- Avoid explaining why each rule exists inside the prompt unless the rationale changes execution.

## Multiple cases

When producing several prompts, save or present each independently with a descriptive title. Each prompt must stand alone and must not refer to another case document.
