# CLAUDE.md

Read **[AGENTS.md](./AGENTS.md)**. It is the single source of truth for this project
(architecture, folder layout, how to add chapters/lessons/languages, and the design rules).
Also read [NIMBUS_EDITING_GUIDE.md](./NIMBUS_EDITING_GUIDE.md) before changing lessons, copy, or UI.
Write repository documentation in English, retaining Indonesian only as quoted product text.

Quick reminders for Claude:

- Package manager is **bun**. Verify changes with `bun run check` (must be 0 errors, 0 warnings).
- Do **not** auto-start the dev server. The maintainer runs `bun run dev` themselves.
- **Never use dashes or colons in copy.** No dashed lines or borders, no em dash or middle-dot
  separators, and no colons in sentences. Write like a human (commas, full sentences,
  parentheses), and avoid "AI guide" phrasing. Nim talks like a friendly character.
- Content and language are **separated per lesson**: `<lesson>/index.ts` is config,
  `<lesson>/id.ts` and `<lesson>/en.ts` are text. Shared UI lives in `src/lib/components/`.
- Nim's dialogue is **reactive**: stages call `onstate(token)`; text comes from
  `lesson.text[lang].dialog[token]`. No "Di dunia nyata" toggle.
