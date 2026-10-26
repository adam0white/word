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
  seedBelief,
  seedSourceTrust,
  trustOf,
} from '@adam0white/human-framework';
import { Story } from 'inkjs';
import content from './story.json';

const EDITION = 'word-1';
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
    spent: 0,
    proposal: null,
    nextProposal: 1,
    speaker: '',
    speech: '',
    note: '',
  };
}

function flag(s: GameState, key: string): boolean {
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
            `Your contribution was £${s.spent}. ${s.spent === 100 ? 'You took the overnight coach home instead of your train.' : 'You kept enough for the train home.'}`,
            'Nobody has proved what Nuri meant. The agreement holds because they chose these terms.',
          ]
        : [
            'Osman rented the room to someone else. Ferda returned the keys.',
            'Halil went back to his own rented workshop. The extra job did not begin. Rıza still brings his cart home each day.',
            'No one signed terms they could not keep. You can try the meeting again.',
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
    offer: 'One set of terms',
    private: 'Your word',
    signing: 'Read it together',
    ending: 'One month later',
  };
  return {
    title: titles[s.page],
    prose: [s.note, ...prose].filter(Boolean),
    ...(s.speaker ? { speaker: s.speaker, speech: s.speech } : {}),
    choices: story.currentChoices.map((c) => ({ id: String(c.index), text: c.text })),
  };
}

function record(s: GameState, text: string) {
  s.log.push({ at: 24 - s.remaining, text });
}
function spendTime(s: GameState, minutes: number) {
  s.remaining = Math.max(0, s.remaining - minutes);
  for (const p of Object.values(s.people)) p.now = 24 - s.remaining;
  if (s.remaining === 0) {
    s.result = 'loss';
    s.page = 'ending';
    s.note = 'The appointment time came before the last signature. Osman left.';
    record(s, s.note);
  }
}
const needs: Record<Who, string> = {
  halil:
    'Halil needs a clear floor and paid work. He still rents his own workshop from Osman; this is an extra job. He can work late if there is a steady order.',
  riza: 'Rıza needs cart space until four. He can take it home then. Outside space is available for £40, but he cannot pay for it.',
  osman:
    'Osman needs the new rent covered. He will accept Ferda as tenant if the first month is funded. Halil’s existing rent account stays separate.',
  ferda:
    'Ferda needs a viable opening month. Morning work leaves a £60 rent gap. The clothing order may pay that gap, but its collection hours are in the letter at the depot.',
};
const phrases: Record<string, string> = {
  'nuri.promised-morning-work':
    'Nuri told me I could do the repairs every morning. I came because I believed him.',
  'nuri.promised-day-storage':
    'Nuri told me the cart could stay on that floor all day. I cannot unload it in the street.',
  'lease.needs-rent': 'I own this room. I can offer a new lease, but I need the rent covered.',
  'order.supports-late-service': 'I have not seen a confirmed order that will pay for late work.',
};
function talk(s: GameState, who: Who) {
  const actor = s.people[who];
  const result = converse(actor, s.people.nephew, {
    at: actor.now,
    maxClaims: 1,
    provenance: true,
    phrase: (claim, fallback) => {
      if (!('value' in claim)) return fallback;
      if (claim.prop === 'order.supports-late-service' && claim.value)
        return 'The order pays for late work. I can take the lease if we cover the first collection.';
      return phrases[claim.prop] ?? fallback;
    },
  });
  perceive(s.people.nephew, result.told);
  s.speaker = actor.name;
  s.speech = result.told.map((p) => p.summary).join(' ');
  s.note =
    who === 'ferda' && s.letter
      ? 'Ferda has read the letter. The paid clothing order covers late work and rent. She needs £40 for the first collection.'
      : needs[who];
  s.asked.push(who);
  record(s, `${actor.name}: ${s.speech} ${s.note}`);
}

function compare(s: GameState): boolean {
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
    record(
      s,
      'Halil and Rıza compared your accounts. You had promised the same floor for morning work and for storage. HF recorded both opposite accounts with you as the source.',
    );
  }
  return a.applied || b.applied;
}

function propose(s: GameState, kind: 'morning' | 'late' | 'shared') {
  s.proposal = null;
  if (kind === 'shared') {
    if (s.told.halil !== undefined && s.told.riza !== undefined && !s.caught) {
      s.proposal = {
        id: s.nextProposal++,
        kind: 'shared',
        cost: 0,
        terms:
          'Morning repairs and inside storage, with no contribution from you. Each listener is relying on your private assurance about priority.',
        consents: [],
      };
      s.page = 'signing';
      s.note =
        'Your private assurances unlock a no-cash draft. Halil and Rıza have each given provisional support. Before signing, they must compare the priority you promised each of them.';
    } else
      s.note =
        'The cart blocks the repair floor. Halil needs clear space; Rıza needs storage until four. Move the cart outside or move the work later.';
    record(s, s.note);
    return;
  }
  const found = compare(s);
  if (kind === 'late' && !s.letter) {
    s.note =
      'Ferda cannot fund late work without the order details. Fetch the letter from the depot, or fund morning work yourself.';
    record(s, s.note);
    return;
  }
  const deposit = s.caught || ORDER.some((id) => trustOf(s.people[id], 'nephew') < 0.7) ? 40 : 0;
  const cost = (kind === 'morning' ? 100 : 40) + deposit;
  if (cost > 100) {
    s.note = `This needs £${cost}, including the deposit. Your travel fund has only £100. The late service costs less if you fetch the letter.`;
    record(s, s.note);
    return;
  }
  const terms =
    kind === 'morning'
      ? 'Halil works from eight to two. Rıza stores the cart outside in a rented space. Ferda takes the new lease. You cover the £60 rent gap and £40 storage cost.'
      : 'Halil works from five to nine on the clothing order. Rıza stores the cart inside until four, then takes it home. Ferda takes the new lease. You cover £40 for the first collection.';
  s.proposal = {
    id: s.nextProposal++,
    kind,
    cost,
    terms: `${terms}${deposit ? ' You also pay a £40 deposit today.' : ''}`,
    consents: [],
  };
  s.page = 'signing';
  s.note = `${found ? 'They compare your conflicting accounts and require a deposit. ' : ''}${s.proposal.terms} Total from your fund: £${cost}. Read the terms together before anyone signs.`;
  record(s, `Proposal ${s.proposal.id}: ${s.proposal.terms}`);
}

export function act(s: GameState, input: Input): void {
  if (s.result !== 'playing') throw new Error('This meeting has ended. Start a new game.');
  if (!input || typeof input.choice !== 'string') throw new Error('Choose an available action.');
  const { story } = ink(s);
  const choice = story.currentChoices.find((c) => String(c.index) === input.choice);
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
    if (command === 'offer') s.proposal = null;
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
    spendTime(s, 3);
    if (s.result === 'playing') talk(s, command.slice(4) as Who);
    return;
  }
  if (command === 'letter') {
    spendTime(s, 6);
    if (s.result !== 'playing') return;
    s.letter = true;
    s.note =
      'You brought back the letter. The supplier offers paid repairs collected after nine each evening. Halil can work after Rıza takes the cart home at four. Ferda can cover the rent from the order. Your first collection still costs £40. The letter settles none of Nuri’s intentions.';
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
      ? 'Halil provisionally supports morning work with no outside storage cost, based on your assurance. He will read the terms with Rıza before signing.'
      : 'Rıza provisionally supports free storage inside, based on your assurance that there will be no morning work. He will read the terms with Halil before signing.';
    record(
      s,
      `You told ${s.people[who].name}: ${value ? 'The floor is reserved for morning work.' : 'The floor is not reserved for morning work.'} ${s.note}`,
    );
    return;
  }
  if (command === 'disclose') {
    spendTime(s, 2);
    if (s.result !== 'playing') return;
    compare(s);
    s.caught = true;
    s.note =
      'You withdraw your private assurances where everyone can hear. They will consider practical terms, with a £40 deposit paid today.';
    record(s, s.note);
    return;
  }
  if (command === 'sign') {
    const p = s.proposal;
    if (!p) throw new Error('Write a proposal first.');
    spendTime(s, 1);
    if (s.result !== 'playing') return;
    if (p.kind === 'shared') {
      compare(s);
      s.proposal = null;
      s.page = 'table';
      s.note =
        'Halil and Rıza compare what you told them. You promised opposite priorities for the same floor. They withdraw support for the free draft. A new agreement needs a £40 deposit paid today. You can still fetch the letter and offer late work.';
      record(s, s.note);
      return;
    }
    const who = ORDER[p.consents.length];
    if (!who) return;
    p.consents.push(who);
    s.note = `${s.people[who].name} signs proposal ${p.id}. ${p.terms}`;
    record(s, s.note);
    s.page = 'signing';
    if (p.consents.length === ORDER.length) {
      s.spent = p.cost;
      s.result = 'win';
      s.page = 'ending';
      s.note = 'All four signed the same terms before Osman left. You paid your contribution.';
      record(s, s.note);
    }
    return;
  }
  spendTime(s, 2);
  if (s.result !== 'playing') return;
  if (command === 'morning' || command === 'late' || command === 'shared') propose(s, command);
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
