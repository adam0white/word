/** Host-owned appointment, practical terms and exact input protocol.
 * HF owns testimony, belief provenance and source trust. Consent below is an
 * authored contract between living people, not a psychological prediction.
 * Ink externals read this state; commands run once, outside Ink evaluation.
 */
import {
  believe,
  contradicted,
  converse,
  createPerson,
  type Person,
  perceive,
  relationshipWith,
  seedBelief,
  seedSourceTrust,
  socialEvent,
  trustOf,
} from '@adam0white/human-framework';
import { Story } from 'inkjs';
import content from './story.json';

const EDITION = 'word-3';
const HF = '3.2.0';
const PROP = 'floor-reserved-for-morning-repairs';
const ORDER = ['halil', 'riza', 'osman', 'ferda'] as const;
type Who = (typeof ORDER)[number];
type Page = 'opening' | 'table' | 'hear' | 'offer' | 'private' | 'signing' | 'ending';
export type Input = { choice: string };
export type Proposal = {
  id: number;
  kind: 'morning' | 'late' | 'shared';
  cost: number;
  terms: string;
  consents: Who[];
  smaller: boolean;
  concessions: Who[];
};
export type GameState = {
  edition: typeof EDITION;
  framework: typeof HF;
  seed: number;
  inputs: Input[];
  people: Record<Who | 'nephew', Person>;
  page: Page;
  remaining: number;
  result: 'playing' | 'win' | 'loss';
  log: { at: number; text: string }[];
  asked: Who[];
  letter: boolean;
  told: Partial<Record<'halil' | 'riza', boolean>>;
  caught: boolean;
  halilLeft: boolean;
  spent: number;
  proposal: Proposal | null;
  nextProposal: number;
  speaker: string;
  speech: string;
  note: string;
};

const baselineTraits = {
  openness: 0.5,
  conscientiousness: 0.5,
  extraversion: 0.5,
  agreeableness: 0.5,
  emotionality: 0.5,
  honesty: 0.5,
};
const baselineValues = {
  selfDirection: 0.5,
  stimulation: 0.5,
  hedonism: 0.5,
  achievement: 0.5,
  power: 0.5,
  security: 0.5,
  conformity: 0.5,
  tradition: 0.5,
  benevolence: 0.5,
  universalism: 0.5,
};

export function createGame(seed: number): GameState {
  if (!Number.isInteger(seed) || seed < 0 || seed > 0xffffffff) throw new Error('Choose a valid seed.');
  const person = (id: string, name: string, age: number, sex: 'male' | 'female', traits = {}) =>
    createPerson({
      id,
      name,
      bornAt: -age * 365 * 1440,
      now: 0,
      sex,
      seed,
      traits: { ...baselineTraits, ...traits },
      values: { ...baselineValues },
      voices: [
        { voiceId: 'nephew', trust: 0.8 },
        { voiceId: 'nuri', trust: 0.8 },
      ],
    });
  const people = {
    halil: person('halil', 'Halil', 61, 'male', {
      conscientiousness: 0.6,
      extraversion: 0.35,
      agreeableness: 0.6,
      emotionality: 0.5,
      honesty: 0.7,
    }),
    riza: person('riza', 'Rıza', 63, 'male', {
      extraversion: 0.7,
      agreeableness: 0.7,
      honesty: 0.65,
      conscientiousness: 0.45,
    }),
    osman: person('osman', 'Osman', 55, 'male', {
      conscientiousness: 0.75,
      agreeableness: 0.35,
      honesty: 0.6,
      extraversion: 0.5,
    }),
    ferda: person('ferda', 'Ferda', 50, 'female', {
      conscientiousness: 0.75,
      honesty: 0.75,
      extraversion: 0.4,
    }),
    nephew: person('nephew', 'You', 30, 'male'),
  };
  for (const who of ORDER) seedSourceTrust(people[who], 'nephew', 0.8);
  seedBelief(people.halil, 'nuri.promised-morning-work', { value: true, credence: 0.97, source: 'nuri' });
  seedBelief(people.riza, 'nuri.promised-day-storage', { value: true, credence: 0.97, source: 'nuri' });
  seedBelief(people.osman, 'lease.needs-rent', { value: true, credence: 0.97, source: 'ledger' });
  seedBelief(people.ferda, 'order.supports-late-service', {
    value: false,
    credence: 0.97,
    source: 'opening-budget',
  });
  seedSourceTrust(people.halil, 'riza', 0.9);
  seedSourceTrust(people.riza, 'halil', 0.9);
  return {
    edition: EDITION,
    framework: HF,
    seed,
    inputs: [],
    people,
    page: 'opening',
    remaining: 24,
    result: 'playing',
    log: [],
    asked: [],
    letter: false,
    told: {},
    caught: false,
    halilLeft: false,
    spent: 0,
    proposal: null,
    nextProposal: 1,
    speaker: '',
    speech: '',
    note: '',
  };
}

function flag(s: GameState, key: string): boolean {
  if (key === 'halil_left') return s.halilLeft;
  if (key === 'can_leave') return !!s.proposal?.consents.includes('halil') && !s.halilLeft;
  if (key === 'waiting')
    return (
      !!s.proposal &&
      s.proposal.consents.length === 3 &&
      !s.proposal.consents.includes('riza') &&
      s.remaining <= 19 &&
      s.remaining > 10
    );
  if (key === 'away') return away(s);
  if (key === 'letter') return s.letter;
  if (key === 'caught') return s.caught;
  if (key === 'told_halil') return s.told.halil !== undefined;
  if (key === 'told_riza') return s.told.riza !== undefined;
  return s.asked.includes(key as Who);
}

/** Fresh Ink VM every projection; functions are pure even in Ink lookahead. */
function ink(s: GameState) {
  const story = new Story(content);
  story.BindExternalFunction('remaining', () => s.remaining, true);
  story.BindExternalFunction('flag', (key: string) => flag(s, key), true);
  story.ChoosePathString(s.page);
  const prose: string[] = [];
  while (story.canContinue) {
    const line = story.Continue()?.trim();
    if (line) prose.push(line);
  }
  return { story, prose };
}

function relationshipEnding(s: GameState): string[] {
  const wary: string[] = [];
  const warm: string[] = [];
  for (const who of ORDER) {
    const actor = s.people[who];
    const tie = relationshipWith(actor, 'nephew');
    if (trustOf(actor, 'nephew') < 0.7 || tie.trust < 0.45) wary.push(actor.name);
    else if (tie.familiarity > 0) warm.push(actor.name);
  }
  return [
    ...(warm.length
      ? [
          `${warm.join(', ')} ${warm.length === 1 ? 'greets' : 'greet'} you and ${warm.length === 1 ? 'asks' : 'ask'} you to sit.`,
        ]
      : []),
    ...(wary.length
      ? [
          `${wary.join(', ')} ${wary.length === 1 ? 'checks' : 'check'} every detail with you. Any future agreement must be in writing.`,
        ]
      : []),
  ];
}

export function view(s: GameState): {
  title: string;
  prose: string[];
  speaker?: string;
  speech?: string;
  choices: { id: string; text: string }[];
  ending?: 'win' | 'loss';
} {
  const { story, prose } = ink(s);
  if (s.result !== 'playing') {
    const terms = s.proposal?.terms ?? '';
    const after =
      s.result === 'win'
        ? [
            `The shop is open. ${terms}`,
            `Ferda paid the agreed rent. Halil completed the ${s.proposal?.kind === 'late' ? 'late' : 'morning'} shifts. Rıza kept the agreed storage hours.`,
            `Your contribution was ₺${s.spent}. ${s.spent === 100 ? 'You took the overnight coach home instead of your train.' : 'You kept enough for the train home.'}`,
            ...relationshipEnding(s),
            s.proposal?.kind === 'late' &&
            s.people.ferda.memory.beliefs.some(
              (b) => b.prop === 'order.supports-late-service' && b.logOdds > 0,
            )
              ? 'Ferda calls the smaller late service her own choice.'
              : 'Ferda chooses to keep the service small.',
          ]
        : [
            'Osman rented the room to someone else. Ferda returned the keys.',
            'Halil went back to his own rented workshop. The extra job did not begin. Rıza still brings his cart home each day.',
            'No one signed an agreement they could not keep. You can try the meeting again.',
            ...relationshipEnding(s),
          ];
    return {
      title: s.result === 'win' ? 'They kept their word.' : 'The shop stayed shut.',
      prose: [s.note, ...prose, ...after].filter(Boolean),
      choices: [],
      ending: s.result,
    };
  }
  const titles: Record<Page, string> = {
    opening: 'His Word',
    table: 'At the cutting table',
    hear: 'What they need',
    offer: 'One agreement',
    private: 'Your word',
    signing: 'Read it together',
    ending: 'One month later',
  };
  const deliveryWait =
    !!s.proposal &&
    !s.proposal.consents.includes('riza') &&
    s.remaining > 10 &&
    s.remaining - (s.proposal.consents.includes('halil') ? 0 : 1) - 1 <= 18;
  const signingMinutes = s.proposal
    ? Math.max(4 - s.proposal.consents.length, deliveryWait ? s.remaining - 10 + 1 : 0)
    : 0;
  return {
    title: titles[s.page],
    prose: [
      ...(s.page === 'signing' && s.proposal
        ? [
            `${signingMinutes} ${signingMinutes === 1 ? 'minute' : 'minutes'} needed for the remaining signatures${deliveryWait ? ' including the delivery wait' : ''}. ${s.remaining} ${s.remaining === 1 ? 'minute remains' : 'minutes remain'}.`,
          ]
        : []),
      s.note,
      ...(s.page === 'signing' && s.proposal && !s.note.includes(s.proposal.terms)
        ? [`${s.proposal.terms} Total from your fund: ₺${s.proposal.cost}.`]
        : []),
      ...prose,
      s.halilLeft
        ? 'Halil has left with his signed copy. Rıza cannot compare accounts with him here.'
        : away(s)
          ? 'Rıza is on his delivery round. He returns with 10 minutes left. Halil is here.'
          : s.remaining <= 10
            ? 'Rıza has returned from his delivery round. Halil and Rıza are both at the table.'
            : 'Halil and Rıza are both at the table. Rıza leaves on his delivery round with 18 minutes left and returns with 10.',
    ].filter(Boolean),
    ...(s.speaker ? { speaker: s.speaker, speech: s.speech } : {}),
    choices: story.currentChoices.map((c) => ({ id: `${s.inputs.length}.${c.index}`, text: c.text })),
  };
}

function away(s: GameState) {
  return s.remaining <= 18 && s.remaining > 10;
}
function record(s: GameState, text: string) {
  s.log.push({ at: 24 - s.remaining, text });
}
function spendTime(s: GameState, minutes: number, finalSignature = false) {
  s.remaining = Math.max(0, s.remaining - minutes);
  for (const p of Object.values(s.people)) p.now = 24 - s.remaining;
  if (s.remaining === 0 && minutes > 0 && !finalSignature) {
    s.result = 'loss';
    s.page = 'ending';
    s.note = 'The appointment time came before the last signature. Osman left.';
    record(s, s.note);
  }
}
const needs: Record<Who, string> = {
  halil:
    '“I need paid work on a clear floor. I can work late if the order includes a paid break. Put that in the agreement.”',
  riza: '“I need storage until four. I can take the cart home then. For morning work I can lend my yard instead of renting outside space.”',
  osman:
    '“I need the first month funded. I can offer a one-month trial instead of a full lease, if Ferda chooses it.”',
  ferda:
    '“I cannot run the whole shop. I would choose a smaller service on a trial lease. The letter may tell us whether late work pays.”',
};
function talk(s: GameState, who: Who) {
  const actor = s.people[who];
  const result = converse(actor, s.people.nephew, {
    at: actor.now,
    maxClaims: 4,
    provenance: true,
    phrase: (claim, fallback) => {
      if (!('value' in claim)) return fallback;
      if (claim.prop === PROP)
        return claim.value
          ? 'You told me the floor was reserved for morning repairs.'
          : 'You told me the floor was not reserved for morning repairs.';
      if (claim.prop === 'order.supports-late-service')
        return claim.value
          ? 'The order pays for late work. I can choose the smaller service.'
          : 'I have not seen an order that pays for late work.';
      if (claim.prop === 'nuri.promised-morning-work') return 'Nuri promised me morning repairs.';
      if (claim.prop === 'nuri.promised-day-storage') return 'Nuri promised me cart storage.';
      if (claim.prop === 'lease.needs-rent') return 'The first month must be paid.';
      return fallback;
    },
  });
  perceive(s.people.nephew, result.told);
  socialEvent(actor, { at: actor.now, kind: 'chat', otherId: 'nephew', byMe: false, magnitude: 0.4 });
  s.speaker = actor.name;
  s.speech = result.told.map((p) => p.summary).join(' ');
  const wary = trustOf(actor, 'nephew') < 0.7 || relationshipWith(actor, 'nephew').trust < 0.45;
  s.note = `${needs[who]}${wary ? ' “This time I will rely on what is written, not your word.”' : ''}`;
  if (!s.asked.includes(who)) s.asked.push(who);
  record(s, `${actor.name}: ${s.speech} ${s.note}`);
}

function compare(s: GameState): boolean {
  if (away(s) || s.halilLeft || s.caught) return false;
  if (s.told.halil === undefined || s.told.riza === undefined || s.told.halil === s.told.riza) return false;
  const a = contradicted(s.people.halil, {
    sourceId: 'nephew',
    prop: PROP,
    value: s.told.riza,
    reporterId: 'riza',
    at: s.people.halil.now,
  });
  const b = contradicted(s.people.riza, {
    sourceId: 'nephew',
    prop: PROP,
    value: s.told.halil,
    reporterId: 'halil',
    at: s.people.riza.now,
  });
  if (a.applied || b.applied) {
    s.caught = true;
    for (const who of ['halil', 'riza'] as const)
      socialEvent(s.people[who], {
        at: s.people[who].now,
        kind: 'deceit-discovered',
        otherId: 'nephew',
        byMe: false,
        magnitude: 0.8,
      });
    record(
      s,
      'Halil and Rıza compared your accounts. You had promised the same floor for morning work and for storage. Both know the conflicting accounts came from you.',
    );
  }
  return a.applied || b.applied;
}

function propose(s: GameState, kind: 'morning' | 'late' | 'shared', smaller = false) {
  s.proposal = null;
  if (kind === 'late' && !s.letter) {
    s.note = 'Ferda needs the clothing order before she can fund late work. Fetch the letter.';
    record(s, s.note);
    return;
  }
  if (kind === 'shared' && (s.told.halil === undefined || s.told.riza === undefined || s.caught)) {
    s.note =
      'Halil wants a ₺40 guarantee before he will accept a smaller repair space. Speak to both men or choose another agreement.';
    record(s, s.note);
    return;
  }
  const deposit = s.caught ? 40 : 0;
  const cost =
    (kind === 'morning' ? (smaller && s.asked.includes('riza') ? 60 : 100) : kind === 'late' ? 40 : 0) +
    deposit;
  if (cost > 100) {
    s.note = `This costs ₺${cost}, including the deposit. You have ₺100. The smaller late service costs less.`;
    return;
  }
  const concessions = [...s.asked];
  const terms =
    kind === 'shared'
      ? 'Halil does small repairs on the marked bench. Rıza keeps his cart in the marked bay. Ferda runs the agreed service. Both men waive their ₺40 guarantees. The smaller service covers rent. You pay nothing.'
      : kind === 'morning'
        ? `Halil works mornings on a clear floor. Rıza stores his cart ${smaller && concessions.includes('riza') ? 'in his own yard' : 'in rented outside space'}. You cover the rent gap${smaller && concessions.includes('riza') ? '' : ' and storage'}.`
        : `Halil works five to nine on the clothing order${concessions.includes('halil') ? ', with a paid break' : ', without a paid break'}. Rıza ${concessions.includes('riza') ? 'takes his cart home at four' : 'keeps his cart inside overnight'}. You pay ₺40 for the first collection.`;
  s.proposal = {
    id: s.nextProposal++,
    kind,
    cost,
    smaller,
    concessions,
    terms: `${terms} ${smaller ? 'Ferda takes a smaller service on a one-month trial lease.' : 'Ferda takes the full shop on a year lease.'}${deposit ? ' You also pay a ₺40 deposit.' : ''}`,
    consents: [],
  };
  s.page = 'signing';
  s.note = `${s.proposal.terms} Total from your fund: ₺${cost}.`;
  record(s, `Agreement ${s.proposal.id}: ${s.proposal.terms}`);
}
function refusal(p: Proposal, who: Who): string | null {
  if (who === 'halil' && p.kind === 'late' && !p.concessions.includes('halil'))
    return 'Halil refuses: late work needs a paid break. Ask him about a change.';
  if (who === 'riza' && p.kind === 'late' && !p.concessions.includes('riza'))
    return 'Rıza refuses: he can take the cart home at four, but that must be written down. Ask him.';
  if (who === 'osman' && p.smaller && !p.concessions.includes('osman'))
    return 'Osman refuses: a trial lease needs his agreement. Ask him about rent, then write a new agreement with the trial lease.';
  if (who === 'ferda' && !p.smaller)
    return 'Ferda refuses: she needs a smaller service and a trial lease. Choose a smaller service when you change the agreement. Ask Osman about rent before writing the trial lease.';
  return null;
}

export function act(s: GameState, input: Input): void {
  if (input && s.inputs.some((prior) => prior.choice === input.choice)) return;
  if (s.result !== 'playing') throw new Error('This meeting has ended. Start a new game.');
  if (!input || typeof input.choice !== 'string') throw new Error('Choose an available action.');
  const { story } = ink(s);
  const choice = story.currentChoices.find((c) => `${s.inputs.length}.${c.index}` === input.choice);
  if (!choice) throw new Error('Choose an available action.');
  story.ChooseChoiceIndex(choice.index);
  let command = '';
  while (story.canContinue) {
    const line = story.Continue()?.trim() ?? '';
    if (line.startsWith('@')) command = line.slice(1);
  }
  if (!command) throw new Error('The chosen action has no command.');
  s.inputs.push({ choice: input.choice });
  s.note = '';
  s.speaker = '';
  s.speech = '';
  s.page = 'table';
  if (command === 'start') {
    record(
      s,
      'You opened the notebook. Nuri made conflicting promises about work and storage. The letter is at the depot.',
    );
    return;
  }
  if (command === 'hear' || command === 'private' || command === 'offer') {
    if (command === 'offer') {
      if (s.halilLeft) {
        spendTime(s, 2);
        if (s.result !== 'playing') return;
        s.halilLeft = false;
        s.note = 'You call Halil back from the street. He must read and sign a changed agreement again.';
      }
      s.proposal = null;
    }
    s.page = command;
    return;
  }
  if (command === 'back') return;
  if (command === 'leave') {
    s.result = 'loss';
    s.page = 'ending';
    s.note = 'You ended the meeting without an agreement.';
    record(s, s.note);
    return;
  }
  if (command.startsWith('ask_')) {
    spendTime(s, 2);
    if (s.result === 'playing') talk(s, command.slice(4) as Who);
    return;
  }
  if (command === 'letter') {
    spendTime(s, 6);
    if (s.result !== 'playing') return;
    s.letter = true;
    s.note =
      'You brought back the letter. The supplier offers paid repairs collected after nine each evening. The order can cover rent for a smaller late service. The first collection costs ₺40. Ask them which changes they can accept.';
    seedBelief(s.people.ferda, 'order.supports-late-service', {
      value: true,
      credence: 0.97,
      source: 'supplier-letter',
      at: s.people.ferda.now,
    });
    record(s, s.note);
    return;
  }
  if (command === 'tell_halil' || command === 'tell_riza') {
    spendTime(s, 2);
    if (s.result !== 'playing') return;
    const who = command === 'tell_halil' ? 'halil' : 'riza';
    const value = who === 'halil';
    s.told[who] = value;
    believe(s.people[who], PROP, value, 0.95, 'nephew', s.people[who].now);
    s.note = value
      ? 'Halil agrees to waive his ₺40 guarantee because of what you told him. He will read the marked spaces in the agreement before signing.'
      : 'Rıza agrees to waive his ₺40 guarantee because of what you told him. He will read the marked spaces in the agreement before signing.';
    record(
      s,
      `You told ${s.people[who].name}: ${value ? 'The floor is reserved for morning work.' : 'The floor is not reserved for morning work.'} ${s.note}`,
    );
    return;
  }
  if (command === 'disclose') {
    spendTime(s, 2);
    if (s.result !== 'playing') return;
    // The written confession is direct evidence of our own conflicting account,
    // including for a recipient who receives it while out on the delivery round.
    for (const who of ['halil', 'riza'] as const) {
      const account = s.told[who];
      if (account === undefined) continue;
      contradicted(s.people[who], { sourceId: 'nephew', prop: PROP, value: !account, at: s.people[who].now });
      socialEvent(s.people[who], {
        at: s.people[who].now,
        kind: 'deceit-discovered',
        otherId: 'nephew',
        byMe: false,
        magnitude: 0.8,
      });
    }
    s.caught = true;
    s.proposal = null;
    s.note =
      'You write a correction for each man: your private promises were false. Rıza receives his on his delivery round. They will consider a new agreement with a ₺40 deposit.';
    record(s, s.note);
    return;
  }
  if (command === 'release_halil') {
    s.halilLeft = true;
    s.page = 'signing';
    s.note =
      'Halil takes a copy of the agreement and leaves for his workshop. His signature stays on this agreement. He and Rıza cannot compare accounts here after he leaves.';
    record(s, s.note);
    return;
  }
  if (command === 'wait') {
    spendTime(s, Math.max(1, s.remaining - 10));
    if (s.result === 'playing') {
      s.page = 'signing';
      s.note = 'Rıza returns from his delivery round. He can read and sign the agreement now.';
      record(s, s.note);
    }
    return;
  }
  if (command === 'sign') {
    const p = s.proposal;
    if (!p) throw new Error('Write an agreement first.');
    const next = ORDER.find((id) => !p.consents.includes(id) && (id !== 'riza' || !away(s)));
    const finalReady = p.consents.length === 3 && !!next && !refusal(p, next);
    spendTime(s, 1, finalReady);
    if (s.result !== 'playing') return;
    const compared = compare(s);
    if (compared) {
      s.proposal = null;
      s.page = 'table';
      s.note =
        'Halil and Rıza compare what you told them. You promised each man the whole floor. They withdraw their fee waivers. A new agreement needs a ₺40 deposit paid today. Choose a new agreement. A smaller morning service with Rıza’s yard can fit your fund; the letter also supports late work.';
      if (s.remaining === 0) {
        s.result = 'loss';
        s.page = 'ending';
        s.note = 'The comparison left no complete agreement at the appointment time. Osman left.';
      }
      record(s, s.note);
      return;
    }
    const who = ORDER.find((id) => !p.consents.includes(id) && (id !== 'riza' || !away(s)));
    if (!who) {
      s.page = 'signing';
      s.note = 'Rıza is still delivering. His signature must wait until he returns with 10 minutes left.';
      return;
    }
    const reason = refusal(p, who);
    if (reason) {
      s.note = reason;
      s.page = 'signing';
      record(s, reason);
      return;
    }
    p.consents.push(who);
    socialEvent(s.people[who], {
      at: s.people[who].now,
      kind: 'shared-work',
      otherId: 'nephew',
      byMe: false,
      magnitude: 0.7,
    });
    const reasons: Record<Who, string> = {
      halil: 'The agreed shift gives him paid work on a clear floor.',
      riza: 'The cart has a place for the hours he needs.',
      osman: 'The first month of the new rent is funded.',
      ferda: 'The work can pay. She chooses to take the new lease.',
    };
    s.note = `${compared ? 'Halil and Rıza compared your conflicting accounts. They now check everything in the agreement. ' : ''}${s.people[who].name} signs agreement ${p.id}. ${reasons[who]}`;
    record(s, s.note);
    if (p.kind === 'shared' && p.consents.includes('halil'))
      s.note += ' Halil has read the marked spaces and signed. Rıza must still agree to his own fee waiver.';
    s.page = 'signing';
    if (p.consents.length === ORDER.length) {
      s.spent = p.cost;
      s.result = 'win';
      s.page = 'ending';
      s.note = 'All four signed the same agreement before Osman left. You paid your contribution.';
      record(s, s.note);
    }
    return;
  }
  spendTime(s, 2);
  if (s.result !== 'playing') return;
  if (command === 'shared_small') propose(s, 'shared', true);
  else if (command === 'morning_small') propose(s, 'morning', true);
  else if (command === 'late_small') propose(s, 'late', true);
  else if (command === 'morning' || command === 'late' || command === 'shared') propose(s, command);
  else if (command === 'late_unproved') propose(s, 'late');
  else throw new Error('Unknown story command.');
}

/** Stable, non-security checksum. Replay verifies complete reconstructed JSON too. */
export function hashState(state: GameState): string {
  const text = JSON.stringify(state);
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) hash = Math.imul(hash ^ text.charCodeAt(i), 0x01000193) >>> 0;
  return hash.toString(16).padStart(8, '0');
}
export function exportRun(s: GameState) {
  return {
    game: 'word' as const,
    edition: EDITION,
    framework: HF,
    seed: s.seed,
    inputs: structuredClone(s.inputs),
    state: structuredClone(s),
    hash: hashState(s),
  };
}
export function replayRun(value: unknown): GameState {
  if (!value || typeof value !== 'object') throw new Error('This is not a His Word run.');
  const x = value as ReturnType<typeof exportRun>;
  if (x.game !== 'word' || x.edition !== EDITION || x.framework !== HF)
    throw new Error('This run is from another version. Start a fresh game.');
  if (!Array.isArray(x.inputs) || typeof x.hash !== 'string')
    throw new Error('This run has an invalid input log.');
  const s = createGame(x.seed);
  for (const input of x.inputs) act(s, input);
  if (hashState(s) !== x.hash || JSON.stringify(s) !== JSON.stringify(x.state))
    throw new Error('This run does not match its replay.');
  return s;
}
