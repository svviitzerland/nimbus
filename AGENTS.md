# Nimbus: agent & contributor guide

Nimbus is an open-source, game-like website for learning technology from zero (networks, the web,
cloud and DevOps, security, and AI),
interactively. A cloud mascot named **Nim** guides the learner (Clash-of-Clans vibe).
Every game metaphor is tied to reality through Nim's reactions.

Live at <https://nimbus.farhanaulianda.my.id>. For what Nimbus is, see **README.md**; for the
lesson roadmap, see **CURRICULUM.md**. This file is the architecture and contributor guide.

## Commands (use **bun**)

```bash
bun run dev       # dev server (the maintainer usually runs this; don't auto-start it)
bun run check     # svelte-check typecheck; run this to verify changes
bun run build     # production build
bun run lint      # prettier + eslint
bun run format    # prettier --write
```

After editing, run `bun run check`. It must report **0 errors, 0 warnings**.

## Stack

SvelteKit, Svelte 5 (runes mode), TypeScript, Tailwind CSS v4, adapter-auto.

## Architecture: three layers

1. **Content** (`src/lib/chapters/`): the curriculum. Pure data plus which stage to use.
2. **Components** (`src/lib/components/`): reusable UI. Call these; don't duplicate.
3. **Routes** (`src/routes/`): thin glue. URL changes per lesson; the shell stays.

### Content layer: one folder per chapter, one folder per lesson

```
src/lib/chapters/
  types.ts                  # shared types (Lesson, Chapter, *Text interfaces)
  index.ts                  # registry: chapters[] + getChapter()
  foundations/              # a chapter
    index.ts                # chapter meta: number, title {id,en}, lessons[], summary {id,en}
    server/                 # a lesson (one folder)
      index.ts              #   CONTENT/config: id, mood, stage component, ties text together
      id.ts                 #   LANGUAGE: Bahasa Indonesia strings
      en.ts                 #   LANGUAGE: English strings
    request-journey/ { index.ts, id.ts, en.ts }
    virtual-machine/ { index.ts, id.ts, en.ts }
  cloud/                    # the next chapter, its own folder
    cloud/  cable/  region/ # each a lesson folder of { index.ts, id.ts, en.ts }
```

**Language is separated from content.** A lesson's `index.ts` holds structure only
(id, mood, which `*Stage.svelte`). All text lives in `id.ts` and `en.ts`, each exporting
an object of the same shape (typed by a `*Text` interface in `types.ts`).

### Routes

```
src/routes/
  +layout.svelte               # global: imports layout.css (theme + fonts)
  +page.ts                     # redirect "/" to the first chapter's first lesson
  [chapter]/
    +layout.svelte             # the SHELL: background, header, language toggle, progress
    +page.ts                   # redirect "/<chapter>" to its first lesson
    [lesson]/
      +page.ts                 # validate params, return {chapterId, lessonId, index, total}
      +page.svelte             # the player: title HUD, stage, Nim bubble, nav (goto)
    done/
      +page.ts                 # validate chapter
      +page.svelte             # chapter completion summary
```

`load` returns only serializable data (ids/indices), never the stage component.
The `+page.svelte` imports the registry (`getChapter`) to resolve the component and text.

## Dialogue & flow

The landing page (`src/routes/+page.svelte`) is Nim's intro: paged welcome lines, then Nim
glides toward the corner and routes into the first lesson.

Inside a lesson, Nim's text has two parts in `lesson.text[lang]`:

- **`intro: string[]`** holds the narrative beats. The **Next** button paginates them one at a
  time so text never gets too long. On the last beat, Next advances the lesson (or to `/done`).
  Don't write "click Next" inside the copy.
- **`reactions: Record<token,string>`** are shown when the user acts on the stage; a reaction
  temporarily overrides the current beat. Stages emit tokens via `onstate(token)`:
  - `ServerStage` -> `served`; `CloudStage` -> `home`/`cloud` (first click) then `both`;
    `RegionStage` -> `near`/`mid`/`far` (by latency).

Next is disabled only on the last beat until the stage's interaction is complete
(`oncomplete`). Teaching is woven into the beats/reactions; there is intentionally **no
"Di dunia nyata" toggle**. Tone: detailed but compact, storytelling.

Any beat or reaction string may start with the marker **`[fyi]`** to render as a "by the way"
aside: the bubble looks the same but leads with a small amber **FYI** tag (handled in
`SpeechBubble.svelte`, the marker is stripped from the shown text). Use it for optional, fun
side facts that are not required to follow the lesson.

## Modules, tracks (jalur), and cross links

Two layers sit on top of the chapters, and CURRICULUM.md describes every lesson in them.

- **Modules** (`src/lib/modules.ts`) are topics, each an ordered list of lessons. An item is a
  shipped lesson as `'<chapter>/<lesson>'` or a planned one as `soon('<id>', '<id text>', '<en
text>')`. Soon ids are unique across all modules. `basecamp` modules are shared foundations
  (How a Computer Works, How a Computer Understands Code, Client and Server, Developer Tools,
  Network Essentials).
- **Tracks** (`src/lib/tracks.ts`) line modules up for one goal, Basecamp first. Today there are
  General (`Dari Nol`), Network, Web, Cloud & DevOps, Security, and AI & ML. A lesson is written
  once and can sit in many modules and tracks. Progress is keyed by `chapter/lesson`, so finishing
  it anywhere counts everywhere.
- **Dari Nol** (`general`) blends every lesson of every track into one path of chapters (Bab),
  listed by key in `GENERAL` in `tracks.ts`, and ends at the **Crossroads** (`capstone/crossroads`)
  where the learner branches into one track. Every module item must appear there exactly once,
  except `branch` modules (the cloud providers, which only close the Cloud & DevOps track);
  the order must read like a story from zero (nothing used before it is taught), and a lesson
  that refers back to another stays after it. A track with `soon: true` shows in the picker but
  cannot be started yet.
- **Guided lessons.** Lessons are watch first, play optional. The stage follows Nim's `beat`, is
  shown from the first beat (`onshow(true)`), never locks Next (`oncomplete()` on mount), and uses
  `src/lib/components/Guide.svelte` (a visual that moves by itself plus a side panel). At most one
  simple optional interaction; typed labs keep their terminal but demo the commands first.
- **Memory tricks.** Every lesson has at least one beat starting with `[ingat]`, an easy way to
  remember the idea, shown with a green "Cara ingat" tag (`SpeechBubble.svelte`).
- **Real photos.** Public domain photos live in `static/images/people/` with `CREDITS.md`.
- **Choices.** A module can be one option of a learner choice (`variant: { choice, option }`, e.g.
  the network lab on MikroTik or Cisco). Tracks play only the picked option (the first one until
  the learner picks), the menu marks the others as the other option, and opening one of their
  lessons switches to it (`path.choices`, `path.choose`, `path.adoptVariant`).
- **Same word, different world.** If a concept also exists elsewhere (logical versus physical
  ports, cloud VPC versus an on premise network), add an `[fyi]` beat with a cross link.
- The landing page ends with the **track picker**. The chosen track and any detour live in
  `src/lib/path.svelte.ts`. In every track, Next and Back walk the track's playlist, and the last
  lesson leads to `/<chapter>/done?track=<id>`.

**Cross links.** In any beat or reaction, write `[[label|target]]` to render a tappable chip:

- `[[locked|networking/encryption]]` points at a shipped lesson. The card names the track that owns
  it and offers **jump there** or **later**. Jumping starts a detour: a "back to ..." pill appears,
  and finishing the detour lesson returns the learner to the exact beat they left.
- `[[HTTPS|security:tls]]` points at a planned lesson by its `soon` id (the part before the colon
  is the track to credit, a hint only), shown as coming soon.
- `[[sniffing|security]]` points at a whole track.

To ship a planned lesson, build it in a chapter as usual, then replace its `soon(...)` item in
`modules.ts` with `'<chapter>/<lesson>'`. Every `[[...|track:soonId]]` link to it can then be updated to
the real lesson path.

## Stage component contract

A stage lives in `src/lib/components/stages/*Stage.svelte` and accepts:

```ts
let {
	text,
	oncomplete,
	onstate
}: {
	text: LessonText; // cast to your specific type: const tx = $derived(text as ServerText)
	oncomplete?: () => void; // call once the step is satisfied (unlocks "Next")
	onstate?: (s: string) => void; // call with a dialog token on each meaningful action
} = $props();
```

## Recipes

**Add a lesson to a chapter**

1. `mkdir src/lib/chapters/<chapter>/<lesson>` with `index.ts`, `id.ts`, `en.ts`.
2. Reuse a stage or add one in `src/lib/components/stages/`. Add its `*Text` interface in `types.ts`.
3. Append the lesson to the chapter's `lessons[]` in `<chapter>/index.ts`. It gets a URL automatically.

**Add a chapter**

1. `mkdir src/lib/chapters/<chapter>/` with `index.ts` (Chapter meta) plus lesson folders.
2. Register it in `src/lib/chapters/index.ts` (the `chapters` array, in order).

**Add a language**

1. Add the code to `Lang` and the `ui` dict in `src/lib/i18n.ts`.
2. Add `<lang>.ts` to every lesson folder and a key in every chapter's `title` and `summary`.

## Maps

The Region stage has two views with a toggle (`src/lib/components/stages/RegionStage.svelte`):

- **Flat (default)**: the generated `WorldMap.svelte` (Natural Earth 110m, equirectangular,
  960 x 373.33 viewBox). Pins use hand-tuned `fx/fy` + `labelPos`. Regenerate the map with
  `bun scripts/generate-worldmap.mjs`.
- **Globe**: a draggable orthographic globe via `d3-geo` using `src/lib/data/land-110m.json`.
  Drag spins it (`rotate`); far-side points are hidden via `geoDistance`; the latency line is a
  great-circle `LineString`.

Each region stores both `lon/lat` (globe) and `fx/fy/labelPos` (flat). Pins have no focus
outline (`outline: none`).

## Design rules (non-negotiable)

- **No dashes anywhere.** That means no dashed lines/borders, and no em dash or middle-dot
  separators in copy. **No colons in copy either** (rewrite as full sentences). Write like a
  human: use commas, full sentences, or parentheses. Avoid assistant or "AI guide" phrasing;
  Nim talks like a friendly character, not a product.
- **Example domain is always `nimbus.com`** (the learner's own site). Never use placeholder
  domains like example.com, situsku.com, or mysite.com. Reuse it for every sample address.
- **Reuse the Foundation actors.** Stages should be built from the recognisable, labelled
  objects Chapters 1 and 2 use (the phone/browser for "you", the server rack for a server),
  not abstract dots or pills. Lay stages out vertically and centred so they fit a phone with no
  horizontal overflow, and keep the action (buttons) up top, clear of Nim in the corner.
- Minimalist, clean, calm. **Not "AI-looking"**: no purple gradients, no emoji spam.
- Full-screen and responsive (mobile stacks: title, then stage, then Nim).
- **Nim is a separate character** at bottom-left with a **cloud-shaped speech bubble**.
- The **lesson title is a HUD element** (top-center), OUTSIDE the bubble.
- Palette and fonts are tokens in `src/routes/layout.css` (`@theme`): accent `brand`, plus
  `grass` / `amber` / `danger`. Fonts: Fraunces (display) and Inter (sans).
- Start every topic from absolute zero; assume the learner knows nothing.
