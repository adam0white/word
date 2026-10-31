# His Word

You hold the notebook of your uncle Nuri, an Istanbul tailor who died last week. He promised Halil steady morning repair work. He also promised Rıza that the same floor would hold his delivery cart all day. Neither promise grants property or a job. Ferda wants to rent the empty shop from Osman and keep it open. The four living people must agree to a workable arrangement before Osman leaves to meet another tenant.

## Done and acceptance

This increment ends with a complete public run at word.adamwhite.work: an honest win, a loss, deterministic export and replay, phone and desktop checks in Chromium and WebKit, one independent Codex review, exact green CI, and a verified clean release. Central listing is prepared for the coordinator, who deploys it after the Voice hold. The owner accepts readiness after the lab panel and retest; this slice queues round 1 and does not claim that acceptance.

## What you win and lose

Win an explicit agreement on work hours, cart storage, and rent that still works a month later. Lose when the meeting ends without agreement. Your own travel fund can cover a rent gap, at a personal cost. Each conversation, letter trip and agreement uses the time before Osman's appointment. The clock advances with decisions; this is a deliberate first-slice pacing choice so reading speed does not decide the result.

Asking is how the player learns what an agreement needs. Each conversation takes two minutes. Halil needs paid work on a clear floor and offers late hours with a paid break. Rıza needs storage until four and offers his own yard for a morning service. Osman needs the first month funded and offers a one-month trial instead of a year lease. Ferda refuses the full shop and admits she would prefer a smaller business. These conditions and concessions change which agreements work. A refusal gives the missing condition and a way to change it. The opening gives the conflict, deadline and early mention of the depot letter, without the solution.

Fetching the letter takes six minutes. It confirms the paid order and changes what people believe. Four conversations, the letter trip, a two-minute agreement and four one-minute signatures fit within the twenty-four-minute meeting. A careless player can spend the remaining time on refused agreements or an unnecessary wait. Every gameplay choice names its minute cost, including zero-cost navigation. Signing shows the total minutes still needed, including a wait for Rıza when necessary. The complete agreement remains visible after each signature. A successful final signature may use the last minute; a refusal at the deadline loses.

Private assurances can reduce the player's cash contribution. They also give Halil and Rıza opposing accounts with the player as source. Rıza goes on a delivery round for a visible part of the appointment. Halil can leave for his workshop with his signed copy before Rıza returns. They compare only when both are present. Timing can preserve the saving and avoid detection. Being caught withdraws the unfinished agreement, lowers HF source trust and relationships, and requires a deposit on the replacement agreement. Confession also reaches both actors as explicit HF evidence, including a written correction delivered during the round. All four still sign the same workable agreement. A signed agreement is not revoked by a surprise letter or hidden ending test.

## Iteration 2 design decisions

Apply Claude's five fixes in their ranked order: useful asks and conditional consent; a saving and avoidable catch for lying; visible minute costs; plain English; HF-driven replies and aftermath. Keep the original stack. The completed technology spike now recommends Ink for this kind of narrative and verified its read-only HF bridge at both viewport sizes. Its results do not establish this game's quality; direct self-play and the lab panel do that.

The new bargaining and delivery-round timing are host-authored rules. They do not add framework psychology. Consent is never a random persuasion roll. Source trust and relationships remain separate HF stores. The month-later scene reads the store that the preceding events actually changed.

## Iteration 3 discoverability correction

Smaller service and trial lease offers are visible from the first agreement menu. The late service still requires the clothing-order letter. Ferda’s refusal points to those offers and tells the player to ask Osman about rent. Osman must explicitly offer the trial lease in conversation before it can receive his signature. Each agreement records the concessions already discussed; after a new conversation the player must write a new agreement and collect every signature again. The agreement menu and Osman’s refusal explain that step. A screen-only cold policy tests asking first and recovering after the full-shop refusal. It receives displayed prose, choice labels and its own choice history, without actor or agreement state. Both approaches must win across 32 seeds and replay exactly, with the same policy also driven from browser text. It is a scripted discoverability check, not evidence that every human will discover the solution. Content edition `word-3` rejected older replay inputs because the visible choice list changed; the current edition is `word-5` (see Human Framework 4.0 below).

## Iteration 4 agreement preview

Each agreement choice shows the exact hours, cart location, lease, fund contribution and two-minute writing cost before selection. A single pure draft calculation supplies both the preview and the agreement that people sign. Asking Halil changes the preview from no paid break to a paid break; asking Rıza changes the cart arrangement. Unasked acceptance is explicitly unknown. Conversations and earlier refusals establish known conditions. A known refusal or an unaffordable contribution appears before writing. Choosing a warned draft still costs two minutes; reading previews costs nothing. The clock, money and consent rules remain unchanged. Careless retries without interviews must still lose. Cold-policy wins measure discoverability of a solution, not human difficulty. The word-3 choice indices were kept, but the current `word-5` edition accepts no earlier export.

## Technology and boundaries

Ink through inkjs authors framing and one set of choices at a time. Strict TypeScript holds the host state and one published HF 4.0.0 run. No React, panels, canvas, server or database. Ink external functions only read cached host projections. Input handlers apply each command once, outside Ink evaluation. Ink never calls HF `step` or a host reducer. Replay reconstructs the initial actors from a seed and replays the input log, including Ink choice paths. Export pins content edition, HF pin, cast data, complete state and final hash. No Ink randomness is used.

HF owns actors, testimony, belief sources and trust changes. The host authors practical consent conditions and an immutable agreement protocol. Consent is an explicit host assumption, not an HF persuasion prediction: requirements must be met, comparisons depend on presence, and each living signatory consents to the exact agreement id. Changing the agreement clears consents. Duplicate signing is a no-op. No home-grown memory drift, trust formula or actor psychology enters the host. Replies use the actor's current HF belief values and trust rather than a fixed line for each person. Retelling drift and audience-tuned telling are not part of this game; they are HF 4.1 work.

## Review decisions

Apply both reviews: practical bargaining, conflicting real promises, a letter known from the start, costly access, actionable refusal reasons, and player-source deception. Drop property transfers, tools, debts owed by Nuri, bequests, shares and legal determinations entirely. These are agreements for future work and a new tenancy between living people. The game makes no religious or legal ruling.

The original twelve-day death watch is replaced by one bounded meeting after the death. This follows Astra's practical table and Opus's objection that the first slice would otherwise depend on unavailable drift. The month-later page reads HF beliefs, source trust and relationships to show the chosen lease and who still welcomes the player. It verifies the practical agreement without computing a moral verdict. Halil still rents his own workshop from Osman and still owes his existing rent; the proposed job is additional paid repair work. That workshop is never threatened here. Nuri is never introduced beside Nuran; Nuran is not a story device in this game.

## Cast and setting

Istanbul, in a shuttered garment shop near a delivery depot. Osman visits as landlord and trader. Rıza is here for his delivery round. Halil has travelled for a short repair contract; he has not moved his established workshop. Their complete canonical opening profiles use the registry baseline plus its overrides. This is a fresh authored branch, with no claim of imported or continued saves.

Ferda, 50, is Nuri's daughter and the prospective tenant. She has managed clothing orders for years and needs a viable opening month. She hid her doubt about taking the lease because everyone treated reopening as loyalty to her father. Her hidden relief is that a smaller late service could be her own business. Outcomes: a viable lease she chooses, a costly morning service, or declining a bad lease and returning the keys. Nuri, 79 at death, is a remembered person only. He sincerely made incompatible work and storage promises because he avoided choosing between two friends. Nobody can prove his final intention. Player: his nephew, no foreground biography. Ferda and the Nuri reference are recorded in the canonical registry before delivery.

## Phone layout and visual identity

At 360×690, the game is a tailor's work surface: charcoal cloth, a cream ledger leaf with a red ruled margin, large serif text, chalk-white action lines and a vermilion seal on an agreement. The current speaker and claim appear before choices. One decision surface appears at a time. Every action shows its minute cost; the agreement also shows the minutes needed for the remaining signatures. The notebook is a separate view with a Back control. No dashboard, grid of statistics or plain document page. At desktop the ledger lies across the cloth with generous margins; the reading measure remains narrow. System serif and monospace fonts avoid a network font dependency. Keyboard focus and reduced-motion behavior remain visible.

Feedback includes “I'm stopping” and “I'm confused” using the lab client transport. First visit states what recording does and offers one off switch. Replay import, seed, state hash and export sit in one collapsed Debug item beside Recording and privacy. Every player can open it. Menu also offers Open a file at `/file`, which continues a complete current export without replacing the browser save. Ordinary play has notebook, menu, feedback and new game.

## Human Framework 4.0 (2026-10-27)

HF is pinned to exactly 4.0.0 from 2026-10-27, content edition `word-5`. HF 3.x
exports and saves are refused before any state changes, with a start-fresh
message. They are not migrated.

- **Run.** One HF run holds Halil, Rıza, Osman, Ferda and the nephew. Their
  starting beliefs come from Nuri, the ledger and Ferda’s opening budget. The
  host clock is the appointment clock: 10:00 with 24 minutes, one minute per
  minute spent. HF time advances only to the host time already reached.
- **Asking.** Each ask is a `conversation.requested` input. The host answers
  each world-required communication request exactly once. Every item is
  delivered, and the nephew hears it at full attention. Each heard claim is
  turned into speech once. HF 4.0 exposes no action request this game can
  resolve; an action request stops the run with an error.
- **Letters and private words.** These are observation inputs carrying their
  source and attention: Ferda reads the supplier’s letter as `saw`, with source
  `supplier-letter`. Halil and Rıza are `told` by the nephew. No belief is
  written into a person after the run starts.
- **Comparison and confession.** When Halil and Rıza compare, each receives a
  contradiction naming the other as reporter. A confession reaches each man
  told as a contradiction with no reporter. The game does not infer who passed
  it on. Discovered deceit and signing are social inputs.
- **Host-owned.** Agreements, consent conditions, cash, presence, timing and
  the month-later outcome stay in the host. HF never decides who signs.
- **Reading.** Speech uses the claims HF chose. The ending reads relationships
  through `inspect`. Source trust and applied contradictions are read from the
  run export, because 4.0.0 `inspect` does not expose source trust.
- **Not in 4.0.** Retelling drift and audience tuning are 4.1 work. 4.0 does
  not deliver them here.

Before writing an agreement, the preview states what is known and what is not.

| Known before writing                                         | Unknown before writing                                   |
| ------------------------------------------------------------ | -------------------------------------------------------- |
| The exact terms: hours, cart place, lease and fee waivers    | Whether someone not yet asked will accept                |
| The total from the ₺100 fund, with any deposit               | Any person’s private belief, trust or relationship value |
| That writing costs 2 minutes, even if someone refuses        |                                                          |
| Rıza’s delivery round, from 18 to 10 minutes left            |                                                          |
| Every condition learned by asking, and every earlier refusal |                                                          |

## Iteration 5 clarity (2026-10-31, light playtest)

Mechanism, reproduced in `test/game.test.ts`: late-work and Rıza-yard terms are built from the questions already asked (`agreementDraft`). The same option title therefore prints different terms after you ask Halil or Rıza. Each such option now ends its terms with “Terms follow your questions”, naming which of Halil and Rıza you have asked, and the agreement page says once, in general terms, that terms can change after you ask people. It names no unasked requirement. This reveals no unasked acceptance and changes no rule, clock, cash, consent or signature.

Ferda’s “The letter may tell us whether late work pays” is a fixed host line, not saved speech, and it is stored unchanged in the run’s `note` and `log`. Changing stored text would make every word-5 export made at 349 fail replay, whose check compares the archive, hash and whole state. So the correction is presentation only: after the letter the screen adds “This is her standing need, worded as before the letter. It is not a reply to the letter.” The stored line, log, state and hash are untouched, and no new Ferda speech is invented. `test/fixtures/base349-fetchletter-askferda.json.gz` is a full export produced by the unmodified 349 game (fetch the letter, ask Ferda); `test/game.test.ts` replays it strictly and compares the re-export byte for byte.

This is a wording change on a five-person panel cohort, not evidence about all players. It does not make the game longer, harder or more varied.

## Deferred

- 2026-11-03: owner acceptance after lab round 1 and retest. Coordinator owns panel scheduling and central site deployment.
- 2026-11-15: audience-tuned retelling and rehearsal confidence are HF 4.1 work; HF 4.0 does not deliver them. Adopt them after that release and the named headless control. Request in V3-COORDINATION.md.
- 2026-11-03: consider continuous event time after reading-speed feedback. First slice advances the appointment through costly choices.
- 2026-11-15: cross-game actor continuation needs a receiving contract for this tenancy and work arrangement. First slice is explicitly fresh, not an imported continuation.
- 2026-11-03: unresolved clarity or reproduction, not changed by the 2026-10-31 candidate. Sources are the light-2026-10-30 Word reports at `docs/lab/reviews/light-2026-10-30/word/<first>/report.md` in the Human Framework packet: F2441 Mei, show what a rewrite plus signatures costs against minutes left (`mei`); F2446 Diego, shorter agreement rows (`diego`; the 2026-10-31 terms note adds length, so recheck); F2447 Diego, desktop controls run below one 800 px screen (`diego`; not reproduced here); F2450 Mina, name the private-word choice before opening it (`mina`).
- 2026-11-10: preferences needing an owner decision on length, difficulty or variety; none was changed. F2431–F2435 return rows (all five); F2436 Maya, longer runs (`maya`); F2437 Maya, earlier reactions to a private word on every path (`maya`); F2439 Mei, harder or different meetings (`mei`); F2442 Samir, a cost on the honest route (`samir`); F2443 Samir, earlier private choices (`samir`); F2444 Samir, more questions than needs (`samir`); F2445 Diego, risk before the agreement stage (`diego`); F2449 Mina, endings that differ more by road (`mina`). Short model-driven sessions are not proof of human reading speed.
