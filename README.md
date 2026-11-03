<div align="center">

# ☁️ Nimbus

<p align="center">
  <img alt="SvelteKit" src="https://img.shields.io/badge/SvelteKit-FF3E00?style=flat&logo=svelte&logoColor=white" />
  <img alt="Svelte 5" src="https://img.shields.io/badge/Svelte_5-FF3E00?style=flat&logo=svelte&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white" />
  <img alt="Bun" src="https://img.shields.io/badge/Bun-000000?style=flat&logo=bun&logoColor=white" />
</p>

**Learn the technology behind the internet by playing.**

Networks, the web, cloud and DevOps, security, and AI, from absolute zero.

Nimbus starts you from absolute zero, like a game. Nim, a friendly little mascot, will be right
there with you, explaining every idea in plain words and cheering you on. You will not just read
about a concept, you will try it yourself on a live stage and watch what happens.

It is bilingual (Indonesian and English), needs no sign up, and runs on your phone or your laptop.

### [▶ Play Nimbus](https://nimbus.farhanaulianda.my.id)

<p align="center">
  <img alt="License MIT" src="https://img.shields.io/badge/License-MIT-3A9C64?style=flat" />
  <img alt="Bilingual" src="https://img.shields.io/badge/Bahasa-ID_%26_EN-DD9E36?style=flat" />
</p>

</div>

## How it works

Right after Nim says hi, you pick a track. **Dari Nol** (From Zero) walks every topic in one
blended path and ends at a crossroads where you branch into the one you want to go deeper in. Or
jump straight into **Network** (all the way to a MikroTik router lab), **Web**, **Cloud & DevOps**,
**Security**, or **AI & ML**. When a lesson touches another subject, Nim drops a link you can jump
to, and brings you right back afterwards.

Every lesson opens with a few short lines from Nim, then hands you an interactive stage you
actually play with. You place a server on a spinnable globe and watch the latency change, ride a
data packet along real undersea cables, knock out a data center and see the site survive or fall,
trim a cloud bill, build a web page, crack a tiny RSA key, tune a neural network, configure a
router in a terminal, and more. Your progress is saved in your browser as you go.

See the full lesson roadmap in [CURRICULUM.md](./CURRICULUM.md).

## Run locally

The package manager is [bun](https://bun.sh).

```sh
bun install
bun run dev
```

Then open the printed URL. Other handy scripts are `bun run check` (typecheck, kept at zero errors
and warnings), `bun run build`, and `bun run format`.

## Contributing

Contributions are welcome. In short, branch off `main` (named like `feat/new-lesson`), keep
`bun run check` clean, write [Conventional Commits](https://www.conventionalcommits.org) such as
`feat`, `fix`, and `docs`, then open a pull request. CI checks every pull request, and releases plus
the changelog are generated automatically from those commit messages.

The content lives as plain data per chapter in `src/lib/chapters/`, with language kept separate from
content per lesson, so adding a lesson, chapter, or language never touches the engine. See
[CONTRIBUTING.md](./CONTRIBUTING.md) for the full guide, [AGENTS.md](./AGENTS.md) for the
architecture and design rules, [REFERENCES.md](./REFERENCES.md) for the sources behind each lesson,
and [CHANGELOG.md](./CHANGELOG.md) for the release history.

## Credits

- World map from [Natural Earth](https://www.naturalearthdata.com/) (public domain), generated with
  `bun scripts/generate-worldmap.mjs`.
- Region boundaries (Availability Zone lesson) from [Natural Earth](https://www.naturalearthdata.com/)
  (public domain), generated with `bun scripts/generate-region-shapes.mjs`.
- Undersea cables and landing stations from the
  [TeleGeography Submarine Cable Map](https://www.submarinecablemap.com/), generated with
  `bun scripts/generate-cables.mjs` and shown with attribution in the Cable lesson.
- Provider logos are trademarks of their owners (Amazon Web Services, Microsoft Azure, Google Cloud)
  and appear only to identify each provider.

## License

MIT for the code. The bundled map data keeps the license of its source, listed under Credits.
