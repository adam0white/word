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

## Technology and boundaries

Ink through inkjs authors framing and one set of choices at a time. Strict TypeScript holds the host state and the published HF 3.2.0 actors. No React, panels, canvas, server or database. Ink external functions only read cached host projections. Input handlers apply each command once, outside Ink evaluation. Ink never calls converse, perceive, contradicted or a host reducer. Replay reconstructs the initial actors from a seed and replays the input log, including Ink choice paths. Export pins content edition, HF pin, cast data, complete state and final hash. No Ink randomness is used.

HF owns actors, testimony, belief sources and trust changes. The host authors practical consent conditions and an immutable agreement protocol. Consent is an explicit host assumption, not an HF persuasion prediction: requirements must be met, comparisons depend on presence, and each living signatory consents to the exact agreement id. Changing the agreement clears consents. Duplicate signing is a no-op. No home-grown memory drift, trust formula or actor psychology enters the host. Replies use the actor's current HF belief values and trust rather than a fixed line for each person. No enableRetellingDrift in this slice.

## Review decisions

Apply both reviews: practical bargaining, conflicting real promises, a letter known from the start, costly access, actionable refusal reasons, and player-source deception. Drop property transfers, tools, debts owed by Nuri, bequests, shares and legal determinations entirely. These are agreements for future work and a new tenancy between living people. The game makes no religious or legal ruling.

The original twelve-day death watch is replaced by one bounded meeting after the death. This follows Astra's practical table and Opus's objection that the first slice would otherwise depend on unavailable drift. The month-later page reads HF beliefs, source trust and relationships to show the chosen lease and who still welcomes the player. It verifies the practical agreement without computing a moral verdict. Halil still rents his own workshop from Osman and still owes his existing rent; the proposed job is additional paid repair work. That workshop is never threatened here. Nuri is never introduced beside Nuran; Nuran is not a story device in this game.

## Cast and setting

Istanbul, in a shuttered garment shop near a delivery depot. Osman visits as landlord and trader. Rıza is here for his delivery round. Halil has travelled for a short repair contract; he has not moved his established workshop. Their complete canonical opening profiles use the registry baseline plus its overrides. This is a fresh authored branch, with no claim of imported or continued saves.

Ferda, 50, is Nuri's daughter and the prospective tenant. She has managed clothing orders for years and needs a viable opening month. She hid her doubt about taking the lease because everyone treated reopening as loyalty to her father. Her hidden relief is that a smaller late service could be her own business. Outcomes: a viable lease she chooses, a costly morning service, or declining a bad lease and returning the keys. Nuri, 79 at death, is a remembered person only. He sincerely made incompatible work and storage promises because he avoided choosing between two friends. Nobody can prove his final intention. Player: his nephew, no foreground biography. Ferda and the Nuri reference are recorded in the canonical registry before delivery.

## Phone layout and visual identity

At 360×690, the game is a tailor's work surface: charcoal cloth, a cream ledger leaf with a red ruled margin, large serif text, chalk-white action lines and a vermilion seal on an agreement. The current speaker and claim appear before choices. One decision surface appears at a time. Every action shows its minute cost; the agreement also shows the minutes needed for the remaining signatures. The notebook is a separate view with a Back control. No dashboard, grid of statistics or plain document page. At desktop the ledger lies across the cloth with generous margins; the reading measure remains narrow. System serif and monospace fonts avoid a network font dependency. Keyboard focus and reduced-motion behavior remain visible.

Feedback includes “I'm stopping” and “I'm confused” using the lab client transport. First visit states what recording does and offers one off switch. Replay import, seed and state tools appear only with ?lab=1. Ordinary play has notebook, menu, feedback and new game.

## Deferred

- 2026-11-03: owner acceptance after lab round 1 and retest. Coordinator owns panel scheduling and central site deployment.
- 2026-11-15: audience-tuned retelling and rehearsal confidence, only after an opt-in HF release and the named headless control. Request in V3-COORDINATION.md.
- 2026-11-03: consider continuous event time after reading-speed feedback. First slice advances the appointment through costly choices.
- 2026-11-15: cross-game actor continuation needs a receiving contract for this tenancy and work arrangement. First slice is explicitly fresh, not an imported continuation.
