# Examples

## Coding workflow

Observed corrections:

- Analyze before editing.
- Work in the named worktree.
- Preserve V2 and add a gated V3.
- Do not add tests unless requested.

Restart prompt:

> First inspect the named worktree and explain the existing behavior, call chain, and cause without editing. Wait for confirmation before implementation. Preserve V2, add V3 behind a default-off flag, keep configuration reads at the entry and core matching logic pure, run existing tests without adding new ones unless requested, and verify the worktree diff before committing and pushing.

## Product wording

Observed corrections:

- Start from the product's first principles rather than popular templates.
- Treat release as a scenario, not a prerequisite.
- Ask for decision approval before changing high-impact discovery text.

Restart prompt:

> First establish the product's core outcome, user motivation, trigger boundary, and invariants; do not begin from a popular template. Treat release workflows as common scenarios rather than prerequisites. Present positioning and description candidates for explicit selection before editing discovery metadata, then keep the Skill, README, package, and marketplace wording consistent.

## Later discovery

If a session later discovers that production configuration is only partially applied, do not write that fact as if it were known initially. Use:

> Pull all related production configuration values before proposing changes, distinguish missing values from empty values and code defaults, and trace how each value affects routing, storage, filtering, and final output.
