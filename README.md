# His Word

[Play His Word](https://word.adamwhite.work).

Your uncle Nuri, an Istanbul tailor, died last week. He promised Halil morning
repair work and Rıza cart storage on the same floor. Ferda must decide whether
to reopen the shop. Osman owns the room and leaves in twenty-four minutes.
Get all four to sign one workable agreement on work, storage and rent.
Your ₺100 journey fund can help pay for it, at a cost to your trip home.
Without agreement, the shop stays shut and Osman rents it to someone else.

## How to play

Tap or click a choice. With a keyboard, use Tab to focus it and Enter or Space
to choose it. Read the reply and the minutes left before choosing again.

- Choose **Hear what someone needs**, then ask a person. Each conversation
  takes two minutes. Ask to learn both their needs and what they can change:
  a paid break, cart storage in Rıza’s yard, a trial lease or a smaller service.
- **Fetch Nuri's letter** takes six minutes. It supplies evidence that the
  clothing order can fund late work. Ask which changes people will accept.
- **Speak to someone in private** offers conflicting promises. Each takes two
  minutes and can save a guarantee fee. Halil and Rıza can compare your accounts
  when both are present. Being caught cancels the unfinished agreement and
  requires a deposit. You can also withdraw the promises openly.
- **Write an agreement** offers practical arrangements. Writing takes two
  minutes. Read the terms and your contribution. A refusal tells you what is
  missing. Ask about it, then write a new agreement with the needed concessions.
- **Ask the next person to sign** takes one minute. All four must sign the same
  agreement. Changing it clears every signature. Rıza’s delivery round can delay
  his signature; use **Wait for Rıza to return** when offered. Halil can leave
  with his signed copy. Calling him back for changed terms takes two minutes.
- Decisions advance the clock; reading does not. Choices show their minute cost.
  The signing page includes the time still needed, including a delivery wait.
  The last signature can use the last minute. Running out before completion,
  or choosing **End the meeting**, ends without agreement.

The ending shows the arrangement and relationships one month later.
**Open notebook** reviews what was said. **Menu** has **Resume**, **Notebook**,
**Feedback**, **Export playtest**, **New game**, **All games** and, where supported,
**Fullscreen**. **Back** returns to play. New game asks before replacing your
current place. Browser storage keeps your place when available.

## What Human Framework supplies

[Human Framework](https://human.adamwhite.work) is pinned to **3.2.0**.
This game demonstrates testimony with sources, learned beliefs, changes in trust
in a source, and relationships. Conversations use current HF beliefs and trust.
The letter changes Ferda’s belief about the order. Contradictions and confession
supply HF evidence; conversations, discovered deceit and signing affect HF
relationships. The later greetings read source trust and relationship state.

The host authors the practical arrangements, concessions, presence, money,
deadline, signature rules and month-later work and rent outcomes. Consent means
meeting those authored conditions and signing the exact agreement; it is not
an HF persuasion prediction. This is a bounded authored negotiation, not a
general autonomous simulation. It starts fresh people, with no imported saves.

## Replay, recording and Feedback

**Export playtest** downloads the seed, input log, complete state, edition and
HF pin. Open `?lab=1`, then **Menu → Lab tools → Import a playtest export** to
reconstruct a run and check its state and hash. **Resume replay** returns to play.
Only the current `word-4` edition with HF 3.2.0 is accepted.

The client is pinned to **@adam0white/lab-client 0.4.15**, the vendored artifact
`vendor/adam0white-lab-client-0.4.15.tgz` (SHA-256
`a317b83fdbf9239a9fea729d9ec7a95cf5b2c54d87d70d780148720a7e2a2eb7`).
Recording attempts uploads of decisions, run snapshots and event/error logs.
Use **Record my play for the lab** on first visit or in Menu to change it.
Browser privacy signals default recording to off. **Feedback** offers
**I'm stopping** and **I'm confused**; selecting one attempts to send that note.
With recording off, the note is unlinked. Feedback success requires a stored-note
receipt; queued automatic records and upload attempts do not prove storage.

His Word registration is in central source commit `5fb4d98`. The live central
service remains at `00d`, held for coordinator deployment after Voice.
This does not establish a production receipt, lab panel or owner acceptance.
Cross-game recording linkage needs the same browser and shared identity, subject
to frame access, storage and origin rules. A blocked frame or different origin
can leave separate identities. Fictional-person continuity is separate and is
not guaranteed by recording linkage; this game does not import continuing people.
See the [recording and privacy notice](https://human.adamwhite.work/lab/privacy/).

## Develop

Use Node **26.12.0** and pnpm **12.14.0**.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

`src/story.ink` is the authored story. `pnpm story` compiles it to generated
`src/story.json`. Ink external functions only read state; Ink may call them more than once.
Run `pnpm check:lane` and `pnpm build`. Browser checks use
`pnpm exec playwright install chromium webkit`, then `pnpm e2e`.
The four projects cover Chromium and WebKit at 360×690 and 1280×800.

## Release

Commit and push. Wait for green GitHub CI on the exact commit. From a clean tree,
run `pnpm build`, then `npx wrangler deploy`. Verify the play URL and
`/release.json`; the release must name that commit and show `dirty: false`.
Code is MIT licensed. See [docs/design.md](docs/design.md) for scope and design.


The cold policy in `test/support/cold-policy.ts` reads only the displayed text,
choice labels and its own prior choices. It cannot read the seed, actor state,
agreement fields or exported run. It tries asking before offering and recovering
from a full-shop refusal. Both approaches are checked over 32 seeds with exact
replay, then driven through DOM text in all four browser/viewport projects.
This is a scripted discoverability check; it does not replace a human playtest.
