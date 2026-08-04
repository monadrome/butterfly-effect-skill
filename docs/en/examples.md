# Examples

These examples show task-artifact versions, later rework, rewind recommendations, and updated prompts across coding, product work, research, and creative tasks. The wording is illustrative; the actual result must stay grounded in the selected session.

## Current Conversation

Request:

```text
Use /butterfly-effect on this session.
```

Produced artifact: the Agent edited immediately in the default worktree, replaced V2 with V3, and added new tests.

Rework requirements:

- Analyze before editing.
- Work in the named worktree.
- Preserve V2 and add a gated V3.
- Do not add tests unless requested.

Rewind recommendation:

- Rewind to: before the Agent chose the implementation path.
- Why: the artifact rework restored the required scope, compatibility path, and testing boundary.
- Keep: the original V2 objective.

Updated prompt:

```text
First inspect the named worktree and explain the existing behavior, call chain, and cause without editing. Wait for confirmation before implementation. Preserve V2, add V3 behind a default-off flag, keep configuration reads at the entry and core matching logic pure, run existing tests without adding new ones unless requested, and verify the worktree diff before committing and pushing.
```

No local session lookup is needed when the visible conversation contains the opening request and the causal Agent action. If those early turns were truncated, resolve only the current session when it is identifiable and accessible. Without that action, describe the supported boundary without inventing a turn identifier; if the remaining history cannot support causality, return the no-reliable fallback.

## No-op Without Artifact Drift

These histories return `No reliable drift or rewind point detected` and no updated prompt:

- While an answer is still being produced, the user adds "format the result as a Markdown document." The requirement changes the current target before an artifact version exists.
- The user asks for several explanations of the same code. No independently evaluable task artifact is reworked.
- After accepting a document, the user asks for a new appendix. This is normal evolution unless the history shows that the accepted version missed the expected outcome.

## Optional Evidence Hints

Use ordinary language; the labels are examples, not parsed command flags:

```text
Use /butterfly-effect on this session.
What's wrong: the implementation replaced the supported V2 path.
What's right: the public API and the reproduced failure should be preserved.
```

The Skill verifies both hints against the artifact versions and rework before using them. Their treatment does not depend on supplying both:

| Input | Treatment |
|---|---|
| What's wrong only | Focus comparison on the named outcome, region, assumption, or behavior; still require artifact rework and causal evidence. |
| What's right only | Look for accepted work, constraints, findings, or eliminated options worth preserving; still diagnose drift independently. |
| Both hints conflict with history | Follow the explicit current instruction for the desired continuation, state the mismatch only when material, and do not rewrite what happened. |
| Either hint without artifact drift | Return the no-reliable result unless the user explicitly requests reconstruction from limited evidence. |

## Salvaging Later Evidence

A payment session first produced a frontend-only fix. Later rework established that the public API and monitoring fields were accepted, exposed callback and retry paths that needed investigation, and showed that a database uniqueness constraint should not be adopted as the sole fix without proving a stable key across those paths.

Rewind recommendation:

- Rewind to: before the Agent assumed the frontend action was the only payment entry point.
- Why: that assumption caused the artifact to omit callback and retry behavior.
- Keep: the accepted public API and monitoring fields; retain the uniqueness-constraint finding as a decision gate, and translate the later path discovery into investigation work.

Updated prompt:

> Reproduce the duplicate charge, then trace user submission, server-side order creation, payment callbacks, and retry jobs before editing. Preserve the existing public API and accepted monitoring fields. Identify the stable business identity available on every confirmed path and do not use a database uniqueness constraint as the sole fix unless the evidence shows that the same key covers them all. Explain the root cause and trade-offs, implement the smallest cross-path correction, and add regression coverage for the confirmed failure path.

The prompt keeps accepted partial work without carrying forward the frontend-only assumption. It also preserves the eliminated option as a verification gate rather than claiming that a later-only root cause was known at the rewind point.

## Product or Positioning Task

A product-positioning session first produced a release-template-based proposal. That document was reworked through these requirements:

- Start from the product's first principles instead of a popular template.
- Treat release as a scenario, not a prerequisite.
- Ask for approval before changing high-impact discovery text.

Rewind recommendation:

- Rewind to: before the Agent treated a popular release template as the product definition.
- Why: the rework restored the product's first principles and approval boundary.
- Keep: release as a supported scenario and the accepted cross-file consistency requirement.

Updated prompt:

```text
First establish the product's core outcome, user motivation, trigger boundary, and invariants; do not begin from a popular template. Treat release workflows as common scenarios rather than prerequisites. Present positioning and discovery-description candidates for explicit selection before editing, then keep the Skill, README, package, and marketplace wording consistent.
```

## Research or Decision Task

A tool-selection session first produced a recommendation based on popularity. That decision artifact was reworked through these requirements:

- Do not choose the most popular option before defining the constraints.
- Separate sourced evidence from assumptions and unknowns.
- Compare operating cost, migration risk, and reversibility.
- Give a conditional recommendation instead of declaring a universal winner.

Rewind recommendation:

- Rewind to: before the Agent selected a popular option without defining the team's decision criteria.
- Why: the later evidence and trade-off requests all repair that ungrounded comparison.
- Keep: the original tool-selection objective.

Updated prompt:

```text
First establish the decision criteria, affected users, constraints, and time horizon before comparing options. Separate sourced evidence, assumptions, and missing information; verify time-sensitive claims against current sources. Compare trade-offs including operating cost, migration risk, and reversibility, then give a recommendation with the conditions under which it changes and a short validation plan.
```

## Creative or Design Task

A visual identity session first produced one polished direction without grounding it in the audience or constraints. That design artifact was reworked through these requirements:

- Define the audience and intended response before polishing the visuals.
- Present a small set of distinct directions before selecting one.
- Preserve existing accessibility and brand constraints.
- Ask for approval before changing high-impact public-facing assets.

Rewind recommendation:

- Rewind to: before the Agent polished a single visual direction without grounding it in audience and constraints.
- Why: the rework restored the missing decision stage, alternatives, accessibility checks, and approval gate.
- Keep: the existing brand constraints and requested public surfaces.

Updated prompt:

```text
First establish the audience, intended response, existing brand constraints, and accessibility requirements. Present two or three clearly distinct directions with their trade-offs before producing the final assets. Keep the selected direction consistent across the requested surfaces, verify contrast and content fit, and ask for approval before changing high-impact public-facing material.
```

## Named Local Session

Request:

```text
Use /butterfly-effect on the Codex session "launch-plan".
```

The Skill resolves that exact local session, extracts human and assistant messages in timestamp order, and excludes tool payloads unless they explain an artifact version or its rework. A Claude Code session can be named in the same way. If several sessions have similar names, the strongest exact match is used and the assumption is stated only when it affects the result.

## Transcript or Handoff

Request:

```text
Use /butterfly-effect on /work/exports/research-review.md.
```

A direct path is read as supplied. Message order and speaker attribution are preserved. For research notes, a document review, an issue discussion, or another external record, export it or provide a locally readable path; the Skill does not fetch remote content implicitly.

## Prompt-only Mode

Request:

```text
Use /butterfly-effect --prompt-only on this session.
```

This explicit mode returns only the updated prompt as a fenced `text` block after artifact drift has been diagnosed. It does not become the default from prior usage. If the source cannot show a reworked artifact and causal boundary, the result is still `No reliable drift or rewind point detected`; the mode does not force prompt generation.

## Detailed Mode

Request:

```text
Use /butterfly-effect --detailed on this session.
```

Output shape:

````markdown
## Rewind recommendation

- Rewind to: before the Agent assumed the work was only a code change.
- Why: the produced artifact was reworked to restore the audience, evidence, and delivery boundary.
- Keep: the original outcome and accepted constraints.

## Updated prompt

```text
First inspect ...
```

## Requirements absorbed

- Analysis gate -> inspect and explain before editing.
- Compatibility -> preserve the old path and gate the new path.

## Not included

- The exact root cause was discovered later, so it became an inspection step.
- An isolated tone reaction was too weak to treat as a stable preference.
````

The rewind recommendation and updated prompt remain first. Detailed mode explains the mapping; it does not replace either artifact with a retrospective.

## Multiple Artifact Drifts

When one session contains independent artifact drifts, do not force unrelated objectives into one boundary or one prompt. State that no single rewind point exists, report each supported boundary, and keep separate prompts when combining them would change the task.

Example:

- Artifact A: rewind before the Agent chose an unsupported data source; keep the user's target audience and decision criteria.
- Artifact B: rewind before the Agent committed to a visual direction without approval; keep the later accessibility requirement.

Return two recommendations and two standalone prompts unless one updated prompt can cover both artifacts without conflating their objectives. State explicitly that no single rewind point exists; each drift may still use a precise boundary when its own action and rework are visible.

## Multiple Sessions

Request:

```text
Use /butterfly-effect on these three session exports and produce one rewind recommendation plus one updated prompt per representative case.
```

Analyze each source independently before comparing them. Each output prompt must stand alone under a descriptive title. A rule becomes cross-session guidance only when it repeats or the user explicitly asks to retain it; unrelated one-off decisions stay with their original case.

## Later Discovery

Suppose the session eventually discovers that a survey includes only active customers. Do not state that as prior knowledge:

```text
The survey includes only active customers.
```

Convert it into discovery work:

> Before drawing conclusions, inspect the survey's sampling criteria, recruitment channels, dates, and missing groups; distinguish what the evidence supports from what requires broader sampling or another source.

## Stable Preference and One-off Decision

Evidence:

- The user says "analyze before acting" in several sessions and explicitly asks the agent to remember it.
- In one session, the user temporarily requests no stakeholder review because the reviewers are unavailable.

Treatment:

- Include an analysis gate as a stable collaboration preference when it applies.
- Keep the temporary review restriction only in that task's updated prompt. Do not generalize it into "the user never wants review."

## Missing History and Privacy

If a named session cannot be read, state the missing source in one sentence and use only evidence that remains visible. Do not fabricate an artifact version, its rework, or a precise rewind boundary. Visible artifact evidence may support a descriptive boundary, but not a guessed turn or timestamp.

If no reworked task artifact is supported, return:

```text
No reliable drift or rewind point detected
The available history does not show a task artifact that was reworked because it missed the expected outcome.
```

Do not add an updated prompt merely to fill the normal output shape. Reconstruct one from limited evidence only when the user explicitly requests it.

If a transcript contains a token, customer identifier, or unrelated personal detail, omit it from the output. Preserve the operational requirement in redacted form when it matters, such as "authenticate with the configured service account," without reproducing the value or identity.
