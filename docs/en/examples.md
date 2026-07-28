# Examples

These examples show the source request, observed corrections, rewind recommendation, and updated prompt across coding, product work, research, and creative tasks. The wording is illustrative; the actual result must stay grounded in the selected session.

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

Rewind recommendation:

- Rewind to: before the Agent chose the implementation path.
- Why: the later scope, compatibility, and testing corrections all repair that first assumption.
- Keep: the original V2 objective.
- Confidence: high.

Updated prompt:

> First inspect the named worktree and explain the existing behavior, call chain, and cause without editing. Wait for confirmation before implementation. Preserve V2, add V3 behind a default-off flag, keep configuration reads at the entry and core matching logic pure, run existing tests without adding new ones unless requested, and verify the worktree diff before committing and pushing.

No local session lookup is needed when the visible conversation contains the opening request and the causal Agent action. If those early turns were truncated, resolve only the current session when it is identifiable and accessible.

## Product or Positioning Task

Observed corrections from a product-positioning session:

- Start from the product's first principles instead of a popular template.
- Treat release as a scenario, not a prerequisite.
- Ask for approval before changing high-impact discovery text.

Rewind recommendation:

- Rewind to: before the Agent treated a popular release template as the product definition.
- Why: the downstream corrections all restore the product's first principles and approval boundary.
- Keep: release as a supported scenario and the accepted cross-file consistency requirement.
- Confidence: high.

Updated prompt:

> First establish the product's core outcome, user motivation, trigger boundary, and invariants; do not begin from a popular template. Treat release workflows as common scenarios rather than prerequisites. Present positioning and discovery-description candidates for explicit selection before editing, then keep the Skill, README, package, and marketplace wording consistent.

## Research or Decision Task

Observed corrections from a tool-selection session:

- Do not choose the most popular option before defining the constraints.
- Separate sourced evidence from assumptions and unknowns.
- Compare operating cost, migration risk, and reversibility.
- Give a conditional recommendation instead of declaring a universal winner.

Rewind recommendation:

- Rewind to: before the Agent selected a popular option without defining the team's decision criteria.
- Why: the later evidence and trade-off requests all repair that ungrounded comparison.
- Keep: the original tool-selection objective.
- Confidence: high.

Updated prompt:

> First establish the decision criteria, affected users, constraints, and time horizon before comparing options. Separate sourced evidence, assumptions, and missing information; verify time-sensitive claims against current sources. Compare trade-offs including operating cost, migration risk, and reversibility, then give a recommendation with the conditions under which it changes and a short validation plan.

## Creative or Design Task

Observed corrections from a visual identity session:

- Define the audience and intended response before polishing the visuals.
- Present a small set of distinct directions before selecting one.
- Preserve existing accessibility and brand constraints.
- Ask for approval before changing high-impact public-facing assets.

Rewind recommendation:

- Rewind to: before the Agent polished a single visual direction without grounding it in audience and constraints.
- Why: the later corrections restore the missing decision stage, alternatives, accessibility checks, and approval gate.
- Keep: the existing brand constraints and requested public surfaces.
- Confidence: high.

Updated prompt:

> First establish the audience, intended response, existing brand constraints, and accessibility requirements. Present two or three clearly distinct directions with their trade-offs before producing the final assets. Keep the selected direction consistent across the requested surfaces, verify contrast and content fit, and ask for approval before changing high-impact public-facing material.

## Named Local Session

Request:

```text
Use $butterfly-effect on the Codex session "launch-plan".
```

The Skill resolves that exact local session, extracts human and assistant messages in timestamp order, and excludes tool payloads unless they explain a correction. A Claude Code session can be named in the same way. If several sessions have similar names, the strongest exact match is used and the assumption is stated only when it affects the result.

## Transcript or Handoff

Request:

```text
Use $butterfly-effect on /work/exports/research-review.md.
```

A direct path is read as supplied. Message order and speaker attribution are preserved. For research notes, a document review, an issue discussion, or another external record, export it or provide a locally readable path; the Skill does not fetch remote content implicitly.

## Detailed Mode

Request:

```text
Use $butterfly-effect --detailed on this session.
```

Output shape:

```markdown
## Rewind recommendation

- Rewind to: before the Agent assumed the work was only a code change.
- Why: later corrections changed the audience, evidence, and delivery boundary.
- Keep: the original outcome and accepted constraints.
- Confidence: medium.

## Updated prompt

> First inspect ...

## Corrections absorbed

- Analysis gate -> inspect and explain before editing.
- Compatibility -> preserve the old path and gate the new path.

## Not included

- The exact root cause was discovered later, so it became an inspection step.
- An isolated tone reaction was too weak to treat as a stable preference.
```

The rewind recommendation and updated prompt remain first. Detailed mode explains the mapping; it does not replace either artifact with a retrospective.

## Multiple Correction Chains

When one session contains independent drift, do not force unrelated objectives into one boundary or one prompt. Report each supported boundary and keep separate prompts when combining them would change the task.

Example:

- Chain A: rewind before the Agent chose an unsupported data source; keep the user's target audience and decision criteria.
- Chain B: rewind before the Agent committed to a visual direction without approval; keep the later accessibility requirement.

Return two recommendations and two standalone prompts unless one updated prompt can cover both chains without conflating their objectives.

## Multiple Sessions

Request:

```text
Use $butterfly-effect on these three session exports and produce one rewind recommendation plus one updated prompt per representative case.
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
- Keep the temporary review restriction only in that task's restart prompt. Do not generalize it into "the user never wants review."

## Missing History and Privacy

If a named session cannot be read, state the missing source in one sentence and use only evidence that remains visible. Do not fabricate the lost corrections or a precise rewind boundary.

If no material correction chain is supported, return `No reliable drift or rewind point detected` and use the original objective as the basis for the updated prompt.

If a transcript contains a token, customer identifier, or unrelated personal detail, omit it from the output. Preserve the operational requirement in redacted form when it matters, such as "authenticate with the configured service account," without reproducing the value or identity.
