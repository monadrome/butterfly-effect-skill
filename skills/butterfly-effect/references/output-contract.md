# Non-default Output Contract

Use this reference only for an explicit output mode, multiple independent cases, or genuine uncertainty about how to format a diagnosed outcome.

## Prompt-only Mode

When the user explicitly requests `--prompt-only`, return only the updated prompt blockquote. This mode is never inferred. If the evidence cannot support an updated prompt, return `No reliable drift or rewind point detected` instead.

## Detailed Mode

Put the rewind recommendation and updated prompt first, then add at most two evidence sections:

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

## Independent Chains

State that no single rewind point exists, then list each supported boundary and its boundary confidence. Use one updated prompt only when it can cover all chains without conflating objectives; otherwise provide one standalone prompt per chain.

## Multiple Cases

Present or save each case independently with a descriptive title. Every prompt must stand alone and must not refer to another case document or the retrospective.

## Completion Criterion

Non-default formatting is complete when the requested mode is explicit, each diagnosed outcome has a matching artifact, and every prompt remains independently usable.
