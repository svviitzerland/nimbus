<div align="center">

# Nimbus

**Learn the technology behind the internet by playing.**

From what is inside a laptop to running your own router, shipping a website, and building with AI.
Starting from absolute zero, in Bahasa Indonesia and English.

### [Play Nimbus](https://nimbus.farhanaulianda.my.id)

<p>
  <img alt="SvelteKit" src="https://img.shields.io/badge/SvelteKit-FF3E00?style=flat&logo=svelte&logoColor=white" />
  <img alt="Svelte 5" src="https://img.shields.io/badge/Svelte_5-FF3E00?style=flat&logo=svelte&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white" />
  <img alt="Bun" src="https://img.shields.io/badge/Bun-000000?style=flat&logo=bun&logoColor=white" />
  <img alt="License MIT" src="https://img.shields.io/badge/License-MIT-3A9C64?style=flat" />
  <img alt="Bilingual" src="https://img.shields.io/badge/Bahasa-ID_%26_EN-DD9E36?style=flat" />
</p>

</div>

## What it is

Nimbus is a free, open source website that teaches tech the way a good game teaches its rules. No
sign up, no wall of text. **Nim**, a little cloud in a hard hat, walks next to you the whole way. Nim
floats, blinks, follows your pointer, talks word by word, and reacts to what you do.

Every lesson is a short story with a picture that moves by itself. You watch a laptop get opened up
and see the CPU, RAM, and battery where they really sit, follow a packet from your phone across
undersea cables, see a database jam at checkout until an analytics warehouse takes the big
questions, or watch a typo in a discount turn a test red before any shopper sees it. When you feel
like it, you can poke the picture yourself. Progress is saved in your browser.

## Pick a track

Right after Nim says hi, you choose where to go. You can switch any time from the menu, and a lesson
finished in one track counts in every other track that has it.

| Track              | What you learn                                                                                   | Lessons |
| ------------------ | ------------------------------------------------------------------------------------------------ | ------: |
| **Dari Nol**       | Everything below in one story, from the computer itself to the crossroads where you pick a track |    175+ |
| **Jaringan**       | IP, DNS, routing, Wi Fi, VPN, and a router lab on MikroTik or Cisco                              |      39 |
| **Web**            | HTTP, HTML, CSS, JavaScript, frameworks, backends and APIs, databases, Git, going live           |      55 |
| **Cloud & DevOps** | Servers, Linux, regions, scaling, containers, CI/CD, monitoring, and the AWS, GCP, Azure branch  |      59 |
| **Keamanan**       | How attackers think, passwords and keys, TLS, common attacks, detection, ethical hacking         |      33 |
| **AI & ML**        | Data and training, neural networks, LLMs, embeddings and RAG, agents, using AI safely            |      27 |

The full roadmap, lesson by lesson, lives in [CURRICULUM.md](./CURRICULUM.md).

## How a lesson feels

- **Watch first, play if you like.** The picture follows Nim's lines, so nothing is locked behind a
  puzzle. A few lessons add one optional thing to try, like swapping two lines of a recipe to watch
  the computer follow the wrong order anyway.
- **Explained from zero.** Every word is introduced before it is used, with everyday comparisons
  (RAM is the desk, storage is the cupboard).
- **Biar nempel.** Every lesson has a memory trick, marked with a green tag.
- **Cross links, not detours.** When a lesson touches another subject, Nim shows a chip you can tap.
  Jump there and Nim brings you back to the exact line you left.
- **Real people, real stories.** Babbage, Ada Lovelace, Turing, Grace Hopper, the moth in the logbook,
  and real incidents, with public domain photos.

## Run it locally

You need [bun](https://bun.sh).

```sh
bun install
bun run dev
```

| Script           | What it does                                     |
| ---------------- | ------------------------------------------------ |
| `bun run dev`    | Start the dev server                             |
| `bun run check`  | Typecheck, kept at zero errors and zero warnings |
| `bun run build`  | Production build                                 |
| `bun run lint`   | Prettier and ESLint                              |
| `bun run format` | Format with Prettier                             |

## How the code is organised

```
src/lib/chapters/     the content, one folder per lesson
  <chapter>/<lesson>/
    index.ts          structure only (which stage, Nim's mood per line)
    id.ts, en.ts      all the words, one file per language
src/lib/components/   shared UI (Nim, the dialogue dock, Guide, phone, laptop, server)
  stages/             one interactive picture per lesson
src/lib/modules.ts    topics, each an ordered list of lessons
src/lib/tracks.ts     tracks built from modules, plus the Dari Nol story order
src/routes/           thin pages around it all
```

Words never live in the engine, so adding a lesson, a chapter, or a language does not touch it.
[AGENTS.md](./AGENTS.md) explains the architecture and the design rules (no dashes or colons in
copy, nimbus.com as the only example domain, calm and minimal visuals).

## Contributing

Contributions are very welcome, from a typo to a whole lesson.

1. Branch off `main`, for example `feat/new-lesson`.
2. Keep `bun run check` at zero errors and zero warnings.
3. Write [Conventional Commits](https://www.conventionalcommits.org) (`feat`, `fix`, `docs`).
4. Open a pull request. CI checks it, and releases plus the changelog are generated from the commits.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full guide, [REFERENCES.md](./REFERENCES.md) for the
sources behind each lesson, and [CHANGELOG.md](./CHANGELOG.md) for the release history.

## Credits

- World map and region boundaries from [Natural Earth](https://www.naturalearthdata.com/) (public
  domain), generated with `bun scripts/generate-worldmap.mjs` and
  `bun scripts/generate-region-shapes.mjs`.
- Undersea cables and landing stations from the
  [TeleGeography Submarine Cable Map](https://www.submarinecablemap.com/), generated with
  `bun scripts/generate-cables.mjs` and credited in the Cable lesson.
- Photos of people and machines are public domain, listed in
  [static/images/people/CREDITS.md](./static/images/people/CREDITS.md).
- Provider logos are trademarks of their owners (Amazon Web Services, Microsoft Azure, Google Cloud)
  and appear only to identify each provider.

## License

MIT for the code. Bundled map data and photos keep the license of their source, listed above.
