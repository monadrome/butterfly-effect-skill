---
name: butterfly-effect
description: "Detect whether a task artifact drifted and was reworked, recommend the earliest supported history point to continue from, then produce a revised prompt for a better trajectory. Use for session time travel, turning-point analysis, or hindsight-guided continuation; Chinese triggers: 月光宝盒, 蝴蝶效应."
metadata:
  author: HuaTalk
  version: "0.6.1"
  category: prompt-engineering
---

# /butterfly-effect

Use artifact rework to recommend a session rewind point and revised prompt for continuing from there. This is advice; never imply that rewind has been performed.

## Decision Contract

- Use the current conversation by default. Read [Source resolution](references/source-resolution.md) only for named, ambiguous, truncated, or undiscovered history. Analyze multiple sessions independently.
- Identify the task artifact and its produced versions. Exclude status or context messages, unfinished responses, and ordinary conversation unless the response itself is the requested deliverable.
- Treat optional user descriptions of what's wrong or what's right as evidence hints. Use them to focus artifact comparison and, only after drift is established, evidence selection. Never let them establish drift or the rewind point without artifact history. If a hint conflicts with visible history, follow the explicit current instruction for the desired result without fabricating a historical claim; mention the mismatch only when it affects the recommendation.
- Drift requires a version reworked because it missed the expected outcome or applicable constraints. Requirements added before a version exists, normal evolution after acceptance, and repeated explanations without artifact rework are no-op.
- Once drift is established, retain later requirements that define the desired artifact even when they do not prove drift. Rewind to the earliest Agent action whose replacement would have prevented the rework. Keep unrelated artifact drifts separate; use a precise turn or timestamp only when the causal action is visible, otherwise describe the boundary without false precision.
- Treat history at and after the rewind point as mixed evidence. Reject failed assumptions, invalid decisions, and artifact states that depend on the drift. Retain relevant accepted constraints, separable valid work, and supported eliminated options. Preserve accepted partial work by its valid outcomes or interfaces, not by the assumption that produced it.
- Preserve the original objective and accepted decisions. Include relevant repeated or explicit preferences; omit isolated style reactions, personality inferences, and incidental details. State an eliminated option as a direct constraint only when its rejection is an accepted decision or current instruction applicable at the rewind point; otherwise turn the evidence into a decision or verification step.
- Convert facts discovered later into instructions to inspect, reproduce, decide, or verify. Do not present hindsight as information known at the rewind point.
- Redact secrets, private identifiers, and irrelevant personal content.

## Result

If the history does not show a reworked artifact or cannot support its causal boundary, return `No reliable drift or rewind point detected` plus one sentence naming the evidence gap. This is the no-op result. Do not generate a revised prompt unless the user explicitly requests reconstruction from limited evidence.

Otherwise return:

- **Rewind recommendation:** `Rewind to`, `Why`, and `Keep`; use `Keep` to summarize relevant evidence retained or translated from later history.
- **Updated prompt:** one copy-ready fenced `text` code block supported by artifact evidence, continuation constraints, or authoritative context and usable without the retrospective. Do not use Markdown blockquote syntax because copied prompts must not contain leading `>` characters.

For explicit `--prompt-only`, return only the fenced prompt block. For explicit `--detailed`, append at most `Requirements absorbed` and `Not included`. When independent artifact drifts have different boundaries, state that no single rewind point exists and provide separate recommendations; use one prompt only when it covers them without conflating objectives.
