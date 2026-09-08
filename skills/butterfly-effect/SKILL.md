---
name: butterfly-effect
description: "Detect whether a task artifact drifted and was reworked, recommend the earliest supported history point to continue from, then produce a revised prompt for a better trajectory. Use for session time travel, turning-point analysis, or hindsight-guided continuation; Chinese triggers: 月光宝盒, 蝴蝶效应."
metadata:
  author: monadrome
  version: "0.7.0"
  category: prompt-engineering
---

# /butterfly-effect

Use artifact rework to recommend a session rewind point and revised prompt for continuing from there. This is advice; never imply that rewind has been performed.

## Decision Contract

- Use the current conversation by default. Read [Source resolution](references/source-resolution.md) only for named, ambiguous, truncated, or undiscovered history. Analyze multiple sessions independently.
- Identify the task artifact and its produced versions. Exclude status or context messages, unfinished responses, and ordinary conversation unless the response itself is the requested deliverable.
- Drift requires a version reworked because it missed the expected outcome or applicable constraints. Requirements added before a version exists, normal evolution after acceptance, and repeated explanations without artifact rework are no-op.
- Once drift is established, retain later requirements that define the desired artifact even when they do not prove drift. Rewind to the earliest Agent action whose replacement would have prevented the rework. Keep unrelated artifact drifts separate; use a precise turn or timestamp only when the causal action is visible, otherwise describe the boundary without false precision.
- Preserve the original objective and accepted decisions. Include relevant repeated or explicit preferences; omit isolated style reactions, personality inferences, and incidental details.
- Convert facts discovered later into instructions to inspect, reproduce, or verify. Do not present hindsight as information known at the rewind point.
- Redact secrets, private identifiers, and irrelevant personal content.

## Result

If the history does not show a reworked artifact or cannot support its causal boundary, return `No reliable drift or rewind point detected` plus one sentence naming the evidence gap. This is the no-op result. Do not generate a revised prompt unless the user explicitly requests reconstruction from limited evidence.

Otherwise return:

- **Rewind recommendation:** `Rewind to`, `Why`, and `Keep`.
- **Updated prompt:** one copy-ready fenced `text` code block supported by artifact evidence, continuation constraints, or authoritative context and usable without the retrospective. Do not use Markdown blockquote syntax because copied prompts must not contain leading `>` characters.

For explicit `--prompt-only`, return only the fenced prompt block. For explicit `--detailed`, append at most `Requirements absorbed` and `Not included`. When independent artifact drifts have different boundaries, state that no single rewind point exists and provide separate recommendations; use one prompt only when it covers them without conflating objectives.
