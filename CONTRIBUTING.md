# Contributing to butterfly-effect-skill

Thanks for improving `/butterfly-effect`.

## Repository layout

| Change | Files |
|---|---|
| Core behavior | `skills/butterfly-effect/SKILL.md` and direct references |
| User-facing behavior | `README.md`, `README-zh.md`, and matching docs |
| Distribution metadata | `package.json` and `.claude-plugin/` |
| Contract checks | `scripts/` and `.github/workflows/test.yml` |

## Rules

1. Keep the default output focused on the restart prompt.
2. Add workflow detail to direct references instead of bloating SKILL.md.
3. Keep English and Chinese READMEs structurally equivalent.
4. Keep maintainer-facing content in English and bilingual trigger phrases in Skill frontmatter.
5. Bump all three version declarations together.
6. Run `npm test` and `npm pack --dry-run` before release.

## Evaluation

Test with raw correction-heavy transcripts. Do not give the evaluator the intended prompt. A successful result should absorb high-confidence corrections, exclude unsupported personality claims, and translate later discoveries into investigation instructions.
