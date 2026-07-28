# Butterfly Effect

[![CI](https://github.com/HuaTalk/butterfly-effect-skill/actions/workflows/test.yml/badge.svg)](https://github.com/HuaTalk/butterfly-effect-skill/actions/workflows/test.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Chinese](https://img.shields.io/badge/lang-Chinese-blue.svg)](README-zh.md)

**Butterfly Effect is a time machine for AI sessions: take what you learned later back to the point where the conversation started going off course.**

One assumption or decision can make every later LLM response drift further from what you wanted. The corrections that appear later in the session reveal what should have happened at that earlier point. Butterfly Effect traces those corrections back to the earliest supported turning point, then returns a rewind recommendation and a copy-ready updated prompt for taking a better path from there. It works with coding, research, writing, design, planning, operations, and other AI-assisted work, with no advance tracker or correction tagging. When the history does not support a turning point, it returns `No reliable drift or rewind point detected` instead of inventing one.

## Quickstart

Install the Skill from npm:

```bash
npm install -D @huatalk/butterfly-effect-skill
npx skills-npm setup
```

After a correction-heavy session, ask:

```text
Use /butterfly-effect on this session. Find where the conversation started going off course, then use what we learned later to return a rewind recommendation and an updated prompt for a better path from that point.
```

Copy the `Updated prompt` blockquote into a fresh session. Use the rewind recommendation to understand where the original trajectory first drifted. If the session does not support a reliable drift diagnosis, the Skill returns the no-reliable result instead of manufacturing a prompt.

## Example

### Debugging an Intermittent Payment Failure

The original request was:

> Fix the intermittent duplicate charges in checkout.

The session then accumulated these corrections:

- Do not patch only the frontend button.
- Trace payment callbacks and retry paths.
- Prove the cause before changing code.
- Preserve compatibility with the existing payment API.

Butterfly Effect returns:

**Rewind recommendation**

- **Rewind to:** before the Agent treated the frontend button as the only payment entry point.
- **Why:** that assumption explains the later requests to trace callbacks, retries, and idempotency across the full path.
- **Keep:** reproduce before editing, preserve the existing payment API, and verify the confirmed failure path.
- **Confidence:** high.

**Updated prompt**

> First reproduce the duplicate charge and trace the full path through user submission, server-side order creation, payment callbacks, and retry jobs. Inspect whether every entry point applies the same idempotency checks, and distinguish repeated user actions, callback retries, and concurrency. Explain the evidence and root cause before editing. Preserve the existing payment API, then add regression coverage for the confirmed failure path.

The recommendation identifies the earlier drift, while the prompt uses what the session learned without claiming that the eventual root cause was known from the start.

### Rewriting Open-Source Copy

The original request was:

> Write an introduction for this open-source project.

The session then accumulated these corrections:

- Lead with the problem instead of a slogan.
- Write for developers, not a generic audience.
- Remove hype and unsupported claims.
- Show one concrete use case and the current limits.

Butterfly Effect returns:

**Rewind recommendation**

- **Rewind to:** before the Agent framed the introduction as generic promotional copy.
- **Why:** that framing caused the later corrections about audience, evidence, concrete use, and capability limits.
- **Keep:** write for developers and ground claims in the repository.
- **Confidence:** high.

**Updated prompt**

> Write a concise introduction for this open-source project aimed at developers. Start with the problem it solves, its input, and its output, then use one concrete scenario to show its value. Use restrained, natural language without slogans, vague benefits, or unverified claims. State the current capability boundaries, and ensure every feature claim is supported by the repository.

The result is ready to reuse in a new session without turning a one-off wording reaction into a broad personality preference.

### Researching a Decision

The original request was:

> Help choose a tool for this team.

The session then accumulated these corrections:

- Define the team's constraints before choosing a popular option.
- Separate sourced evidence from assumptions and unknowns.
- Compare operating cost, migration risk, and reversibility.
- Make a conditional recommendation instead of declaring a universal winner.

Butterfly Effect returns:

**Rewind recommendation**

- **Rewind to:** before the Agent selected a popular tool without first defining the team's decision criteria.
- **Why:** the shared gap across the corrections was an ungrounded comparison, not the choice of one specific vendor.
- **Keep:** separate evidence from assumptions, compare reversibility and cost, and make the recommendation conditional.
- **Confidence:** high.

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
| Restart the current task | `Use /butterfly-effect on this session.` | Uses visible history, recovering only the same current session when early turns are truncated |
| Analyze a named local session | `Use /butterfly-effect on Codex session "launch-plan".` | Resolves and reads that session |
| Analyze an exported record | `Use /butterfly-effect on /path/to/transcript.md.` | Reads the supplied transcript or handoff in order |
| Return only the prompt | `Use /butterfly-effect --prompt-only on this session.` | Explicitly omits the rewind recommendation |
| Include supporting analysis | `Use /butterfly-effect --detailed on this session.` | Returns the rewind recommendation and prompt first, then timeline, corrections, and exclusions |
| Compare several sessions | `Use /butterfly-effect on these three session exports.` | Analyzes each independently before retaining repeated rules |

For research notes, a document review, an issue discussion, or another external record, provide a locally accessible export or path. The Skill does not fetch remote content implicitly. See [more examples](docs/en/examples.md).

`--prompt-only` is an explicit output mode. It is never inferred from prior usage and never replaces the default rewind-plus-prompt contract.

## How It Works

1. Reconstruct the original objective, audience, requested artifact, and information available at the start.
2. Build a chronological timeline of Agent assumptions, actions, user corrections, accepted decisions, and later discoveries.
3. Link related corrections into chains only when the timeline supports causality, then trace each chain back to the earliest defensible Agent drift point.
4. Keep independent chains separate; lower confidence for missing history or weak causal evidence, and stop with the no-reliable result when no usable boundary exists.
5. Separate stable preferences, task-specific requirements, and one-off decisions.
6. Turn later discoveries into inspection or verification steps, then compose the updated prompt in execution order.
7. Check that it covers every high-strength correction without adding unsupported rules.

## Design Principles

- **Zero preparation:** analyze records that already exist; no initialization, hooks, or correction tagging are required beforehand.
- **Diagnosis before reconstruction:** establish that a supported drift boundary exists before generating an updated prompt.
- **Rewind-first:** explain the earliest supported drift boundary, then return the artifact needed for a fresh session instead of making the user translate a retrospective report.
- **Counterfactual restart:** reconstruct what should have been said initially while staying honest about what was knowable then.

Read the [design notes](docs/en/design.md) for the evidence model, non-goals, and failure modes.

## Privacy and Scope

- Without an explicit source, only the current session is used; unrelated sessions are never searched as substitutes for truncated history.
- When a session or path is named, read only the requested history needed for the task.
- Credentials, secrets, private identifiers, and irrelevant personal content are omitted from output.
- Missing history and ambiguous evidence are reported briefly; corrections are never invented.
- Independent correction chains are not collapsed into a synthetic common cause or falsely precise single rewind point.
- Generated summaries are secondary evidence when raw chronological messages are available.

## Validation and Limitations

**Important:** Correction extraction, chain linkage, and rewind confidence still depend on model judgment. Repository checks validate version consistency, release tags, Skill contract anchors, local references, plugin manifests, bilingual README structure, English-document language boundaries, and npm package contents, but these static checks cannot prove runtime diagnostic accuracy. A result may miss a drift, infer causality too strongly, overfit a one-off reaction, or soften a contradiction incorrectly. Review important recommendations and updated prompts before using them, especially when the source spans several sessions or contains sensitive material.

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
