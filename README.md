# Butterfly Effect

[![CI](https://github.com/HuaTalk/butterfly-effect-skill/actions/workflows/test.yml/badge.svg)](https://github.com/HuaTalk/butterfly-effect-skill/actions/workflows/test.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Chinese](https://img.shields.io/badge/lang-Chinese-blue.svg)](README-zh.md)

<img src="docs/assets/butterfly-effect-trajectory.png" alt="Butterfly Effect trajectory drift illustration" width="427">

**Butterfly Effect is a time machine for AI sessions: take what you learned later back to the point where the conversation started going off course.**

One assumption or decision can produce code, a document, a design, or another task artifact that later has to be reworked because it missed the expected outcome. Butterfly Effect traces that artifact rework back to the earliest supported turning point, then returns a rewind recommendation and a copy-ready updated prompt for taking a better path from there. Added requests alone do not establish drift: requirements introduced before an artifact version exists, normal evolution after an accepted artifact, and repeated explanations without artifact rework are no-op. It works across AI-assisted tasks with no advance tracker or artifact-version tagging.

## Quickstart

Install the Skill from npm:

```bash
npm install -D @huatalk/butterfly-effect-skill
npx skills-npm setup
```

After a task artifact has been reworked, ask:

```text
Use /butterfly-effect on this session. Determine whether a produced task artifact was reworked because it missed the expected outcome. If so, find the earliest causal point and return a rewind recommendation plus an updated prompt for continuing from there.
```

Use the `Updated prompt` blockquote when continuing from the recommended history point. The rewind recommendation explains where the original trajectory first drifted. If the session does not support a reliable drift diagnosis, the Skill returns the no-reliable result instead of manufacturing a prompt.

When no produced task artifact was reworked because it missed the expected outcome, the result is `No reliable drift or rewind point detected`.

## Example

### Debugging an Intermittent Payment Failure

The original request was:

> Fix the intermittent duplicate charges in checkout.

The Agent first patched only the frontend button. That code artifact was then reworked through these requirements:

- Do not patch only the frontend button.
- Trace payment callbacks and retry paths.
- Prove the cause before changing code.
- Preserve compatibility with the existing payment API.

Butterfly Effect returns:

**Rewind recommendation**

- **Rewind to:** before the Agent treated the frontend button as the only payment entry point.
- **Why:** that assumption explains the later requests to trace callbacks, retries, and idempotency across the full path.
- **Keep:** reproduce before editing, preserve the existing payment API, and verify the confirmed failure path.

**Updated prompt**

> First reproduce the duplicate charge and trace the full path through user submission, server-side order creation, payment callbacks, and retry jobs. Inspect whether every entry point applies the same idempotency checks, and distinguish repeated user actions, callback retries, and concurrency. Explain the evidence and root cause before editing. Preserve the existing payment API, then add regression coverage for the confirmed failure path.

The recommendation identifies the earlier drift, while the prompt uses what the session learned without claiming that the eventual root cause was known from the start.

### Rewriting Open-Source Copy

The original request was:

> Write an introduction for this open-source project.

The Agent first produced a generic promotional introduction. That document artifact was then reworked through these requirements:

- Lead with the problem instead of a slogan.
- Write for developers, not a generic audience.
- Remove hype and unsupported claims.
- Show one concrete use case and the current limits.

Butterfly Effect returns:

**Rewind recommendation**

- **Rewind to:** before the Agent framed the introduction as generic promotional copy.
- **Why:** the artifact was reworked to restore the intended audience, evidence standard, concrete use, and capability limits.
- **Keep:** write for developers and ground claims in the repository.

**Updated prompt**

> Write a concise introduction for this open-source project aimed at developers. Start with the problem it solves, its input, and its output, then use one concrete scenario to show its value. Use restrained, natural language without slogans, vague benefits, or unverified claims. State the current capability boundaries, and ensure every feature claim is supported by the repository.

The result is ready to use when continuing from the recommended history point, without turning a one-off wording reaction into a broad personality preference.

### Researching a Decision

The original request was:

> Help choose a tool for this team.

The Agent first recommended a popular tool without defining the team's criteria. That decision artifact was then reworked through these requirements:

- Define the team's constraints before choosing a popular option.
- Separate sourced evidence from assumptions and unknowns.
- Compare operating cost, migration risk, and reversibility.
- Make a conditional recommendation instead of declaring a universal winner.

Butterfly Effect returns:

**Rewind recommendation**

- **Rewind to:** before the Agent selected a popular tool without first defining the team's decision criteria.
- **Why:** the shared gap across the corrections was an ungrounded comparison, not the choice of one specific vendor.
- **Keep:** separate evidence from assumptions, compare reversibility and cost, and make the recommendation conditional.

**Updated prompt**

> First establish the decision criteria, affected users, constraints, and time horizon before comparing options. Separate sourced evidence, assumptions, and missing information; verify time-sensitive claims against current sources. Compare trade-offs including operating cost, migration risk, and reversibility, then give a recommendation with the conditions under which it changes and a short validation plan.

## Installation

Installation depends on how your AI agent loads Skills.

### npm

For environments using `skills-npm`:

```bash
npm install -D @huatalk/butterfly-effect-skill
npx skills-npm setup
```

### Agent Skills

Use this for Codex, Cursor, Windsurf, Gemini CLI, GitHub Copilot, Cline, and other environments supported by the Agent Skills ecosystem:

```bash
npx skills add HuaTalk/butterfly-effect-skill
```

Install location and compatibility depend on the installer and the host agent's Skill implementation.

### Claude Code

Register the repository as a plugin marketplace:

```text
/plugin marketplace add https://github.com/HuaTalk/butterfly-effect-skill.git
```

Install the plugin in a separate prompt:

```text
/plugin install butterfly-effect@butterfly-effect
```

Restart Claude Code after installation. The native plugin command is `/butterfly-effect:butterfly-effect`; the shorter `/butterfly-effect` also works when no other command uses that name.

## Usage

The current conversation is the default source. If its visible history is truncated, the Skill may recover only the identifiable current session; it searches other local history only when the request names another session.

| Goal | Example request | Source behavior |
|---|---|---|
| Diagnose artifact drift | `Use /butterfly-effect on this session.` | Uses visible history, recovering only the same current session when early turns are truncated |
| Analyze a named local session | `Use /butterfly-effect on Codex session "launch-plan".` | Resolves and reads that session |
| Analyze an exported record | `Use /butterfly-effect on /path/to/transcript.md.` | Reads the supplied transcript or handoff in order |
| Return only the prompt | `Use /butterfly-effect --prompt-only on this session.` | Explicitly omits the rewind recommendation |
| Include supporting analysis | `Use /butterfly-effect --detailed on this session.` | Returns the rewind recommendation and prompt first, then absorbed requirements and exclusions |
| Compare several sessions | `Use /butterfly-effect on these three session exports.` | Analyzes each independently before retaining repeated rules |

For research notes, a document review, an issue discussion, or another external record, provide a locally accessible export or path. The Skill does not fetch remote content implicitly. See [more examples](docs/en/examples.md).

`--prompt-only` is an explicit output mode. It is never inferred from prior usage and never replaces the default rewind-plus-prompt contract.

## Design Principles

- **Zero preparation:** analyze records that already exist; no initialization, hooks, or artifact-version tagging are required beforehand.
- **Artifact-first:** establish that a produced task artifact was reworked because it missed the expected outcome; added requests alone do not prove drift.
- **Diagnosis before reconstruction:** establish that a supported drift boundary exists before generating an updated prompt.
- **Rewind-first:** explain the earliest supported drift boundary, then return the artifact needed to continue from that point instead of making the user translate a retrospective report.
- **Counterfactual branch:** construct a better continuation from the selected history point while respecting what was knowable there.

Read the [design notes](docs/en/design.md) for the evidence model, non-goals, and failure modes.

## Privacy and Scope

- Without an explicit source, only the current session is used; unrelated sessions are never searched as substitutes for truncated history.
- When a session or path is named, read only the requested history needed for the task.
- Credentials, secrets, private identifiers, and irrelevant personal content are omitted from output.
- Missing history and ambiguous evidence are reported briefly; artifact versions and rework are never invented.
- Independent artifact drifts are not collapsed into a synthetic common cause or falsely precise single rewind point.
- Generated summaries are secondary evidence when raw chronological messages are available.

## Validation and Limitations

**Important:** Identifying artifact versions, deciding whether rework proves drift, and selecting a causal boundary still depend on model judgment. Repository checks validate version consistency, release tags, Skill contract anchors, local references, plugin manifests, bilingual README structure, English-document language boundaries, and npm package contents, but these static checks cannot prove runtime diagnostic accuracy. A result may miss a drift, infer causality too strongly, overfit a one-off reaction, or soften a contradiction incorrectly. Review important recommendations and updated prompts before using them, especially when the source spans several sessions or contains sensitive material.

## Updating

Agent Skills:

```bash
npx skills add HuaTalk/butterfly-effect-skill
```

Claude Code:

```text
/plugin update butterfly-effect@butterfly-effect
```

Restart Claude Code after updating. See the [changelog](CHANGELOG.md) for release details.

## Development

```bash
npm test
npm run check:package
```

`npm test` runs the release-tag regression tests and all repository, Skill, documentation, and package checks. Contributions are welcome; read [CONTRIBUTING.md](CONTRIBUTING.md) before changing behavior or release metadata. Report defects through [GitHub Issues](https://github.com/HuaTalk/butterfly-effect-skill/issues).

## License

[MIT](LICENSE)
