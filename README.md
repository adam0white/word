# His Word

A complete short negotiation game. Nuri left contradictory practical promises about a tailor’s work, storage and rent. You need an agreement before the workshop closes. What you tell each listener can be compared at the table.

## Develop

Use Node 26.12.0 and pnpm 12.14.0.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

`src/story.ink` is the authored story. `pnpm story` compiles it to generated `src/story.json`. Ink external functions must only read state because Ink may call them more than once.

```sh
pnpm check
pnpm build
pnpm exec playwright install chromium webkit
pnpm e2e
```

The four browser projects cover Chromium and WebKit at 360×690 and 1280×800. Feedback and optional lab controls are in the game. `?lab=1` enables lab controls. Playtest exports contain the seed, inputs and final state for deterministic replay.

## Release

Commit and push. Wait for green GitHub CI on the exact commit. From a clean tree, run `pnpm build`, then `npx wrangler deploy`. Verify `https://word.adamwhite.work` and `/release.json`; the release must name that commit and show `dirty: false`.

Code is MIT licensed. See [docs/design.md](docs/design.md) for the game’s scope and design.
