# Contributing to Nimbus

Thanks for helping make Nimbus better. It is an open, game-like course that teaches cloud computing
from zero. Contributions of every size are welcome, from fixing a typo to adding a whole lesson.

## Ways to contribute

- Fix or improve a lesson (clearer wording, better visuals, bug fixes).
- Add a lesson or chapter (see the roadmap in [CURRICULUM.md](./CURRICULUM.md)).
- Improve a translation (every lesson ships in Indonesian and English).
- Improve the engine, the docs, or the tooling.

If you are planning something larger than a small fix, open an issue first so we can agree on the
shape before you build it.

## Local setup

The package manager is [bun](https://bun.sh).

```sh
bun install
bun run dev
```

Useful scripts:

- `bun run check` typecheck and Svelte checks, kept at zero errors and zero warnings.
- `bun run build` production build.
- `bun run format` format with Prettier.
- `bun run lint` Prettier check plus ESLint.

## Project layout

Content is plain data per chapter under `src/lib/chapters/`, with language separated from content
per lesson (`index.ts` for config, `id.ts` and `en.ts` for text). Shared UI lives in
`src/lib/components/`. Adding a lesson, chapter, or language never touches the engine. The full
architecture, the design rules (for example, how Nim talks), and step-by-step recipes are in
[AGENTS.md](./AGENTS.md). Read it together with [NIMBUS_EDITING_GUIDE.md](./NIMBUS_EDITING_GUIDE.md)
before adding content. Write repository documentation in English, preserving Indonesian only as
quoted UI labels or copy examples.

Every lesson is backed by an authoritative source, mapped in [REFERENCES.md](./REFERENCES.md). Keep
that mapping accurate when you add or change a lesson, so the material stays accountable.

## Branches

Branch off `main` and name the branch `type/short-topic`, matching the commit type. For example:

- `feat/cdn-lesson`
- `fix/menu-overflow`
- `docs/contributing-guide`

## Commit messages

We use [Conventional Commits](https://www.conventionalcommits.org). Each message is
`type: short summary` in the present tense, for example `feat: add CDN lesson`. This is what drives
the automated releases and changelog, so it matters.

| Type       | Use for                                        | Version effect (pre 1.0) |
| ---------- | ---------------------------------------------- | ------------------------ |
| `feat`     | a new lesson, stage, or capability             | patch                    |
| `fix`      | a bug fix                                      | patch                    |
| `docs`     | documentation only                             | none                     |
| `refactor` | a code change that is neither a fix nor a feat | none                     |
| `style`    | formatting only, no logic change               | none                     |
| `chore`    | tooling, config, dependencies                  | none                     |

A breaking change (add `!`, for example `feat!: ...`) bumps the minor version while we are still
pre 1.0.

## Before you open a pull request

1. `bun run check` shows zero errors and zero warnings.
2. `bun run build` succeeds.
3. `bun run format` has been run so the diff is clean.
4. For lesson or UI text, copy follows the design rules in AGENTS.md (Nim talks like a friendly
   character, no colons or dashes in lesson copy, the example domain is always `nimbus.com`).

Then open a pull request against `main` and fill in the template. CI runs the checks above on every
pull request.

## Releases

Releases are automated, you do not edit the version or the changelog by hand. When commits land on
`main`, a release pull request is opened and kept up to date. Merging it bumps the version in
`package.json`, updates [CHANGELOG.md](./CHANGELOG.md), and publishes a GitHub release and tag. The
version follows the commit types in the table above, starting from `0.0.1`.
