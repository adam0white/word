import { relationshipWith, trustOf } from '@adam0white/human-framework';
import { describe, expect, it } from 'vitest';
import { act, createGame, exportRun, hashState, replayRun, view } from '../src/game';

function choose(s: ReturnType<typeof createGame>, text: string) {
  const c = view(s).choices.find((x) => x.text.includes(text));
  if (!c) throw new Error(`Missing choice: ${text}`);
  act(s, { choice: c.id });
}
function start(seed = 42) {
  const s = createGame(seed);
  choose(s, 'Put the notebook');
  return s;
}
function sign(s: ReturnType<typeof createGame>) {
  for (let i = 0; i < 5 && s.result === 'playing'; i++) {
    const waiting = view(s).choices.some((c) => c.text.includes('Wait for Rıza'));
    choose(s, waiting ? 'Wait for Rıza' : 'next person');
  }
}

function askAll(s: ReturnType<typeof createGame>) {
  for (const name of ['Halil', 'Rıza', 'Osman', 'Ferda']) {
    choose(s, 'Hear what');
    choose(s, `Ask ${name}`);
  }
}

describe('iteration two bargaining', () => {
  it('refuses the unexplored full lease rather than handing out signatures', () => {
    const s = start();
    choose(s, 'Write an agreement');
    choose(s, 'Rent an outside');
    sign(s);
    expect(s.result).toBe('playing');
    expect(s.proposal?.consents).not.toContain('ferda');
    expect(s.note).toContain('smaller');
  });
  it('lets all four conversations and the letter produce an affordable agreement in time', () => {
    const s = start();
    askAll(s);
    choose(s, 'Fetch Nuri');
    choose(s, 'Write an agreement');
    choose(s, 'smaller late service');
    expect(view(s).prose.join(' ')).toContain('4 minutes');
    sign(s);
    expect(s.result).toBe('win');
    expect(s.spent).toBe(40);
    expect(s.remaining).toBe(4);
    expect(replayRun(exportRun(s))).toEqual(s);
  });
});

describe('complete negotiation', () => {
  it('settles honestly without exhaustive questions and replays the complete state', () => {
    const s = start();
    for (const name of ['Osman', 'Ferda']) {
      choose(s, 'Hear what');
      choose(s, `Ask ${name}`);
    }
    choose(s, 'Write an agreement');
    choose(s, 'Morning work. Smaller');
    sign(s);
    expect(s.result).toBe('win');
    expect(s.proposal?.consents).toHaveLength(4);
    expect(s.spent).toBe(100);
    const run = exportRun(s);
    expect(hashState(replayRun(JSON.parse(JSON.stringify(run))))).toBe(hashState(s));
    expect(replayRun(run)).toEqual(s);
  });
  it('offers a costly letter route with a cheaper late service and no surprise reversal', () => {
    const s = start(7);
    askAll(s);
    choose(s, 'Fetch Nuri');
    expect(s.remaining).toBe(10);
    choose(s, 'Write an agreement');
    choose(s, 'smaller late service');
    sign(s);
    expect(s.result).toBe('win');
    expect(s.spent).toBe(40);
    expect(view(s).prose.join(' ')).toContain('late');
  });
  it('catches the player as the source, gives a recoverable refusal, and can still settle', () => {
    const s = start();
    choose(s, 'in private');
    choose(s, 'Tell Rıza');
    askAll(s);
    choose(s, 'in private');
    choose(s, 'Tell Halil');
    choose(s, 'Write an agreement');
    choose(s, 'cart inside. Smaller');
    expect(s.proposal?.cost).toBe(0);
    choose(s, 'next person');
    expect(s.caught).toBe(true);
    expect(trustOf(s.people.halil, 'nephew')).toBeLessThan(0.8);
    expect(trustOf(s.people.riza, 'nephew')).toBeLessThan(0.8);
    expect(s.result).toBe('playing');
    choose(s, 'Write an agreement');
    choose(s, 'Morning work. Smaller');
    sign(s);
    expect(s.result).toBe('win');
    expect(s.spent).toBe(100);
    expect(replayRun(exportRun(s))).toEqual(s);
  });
  it('clears signatures on a counterproposal and ends a failed meeting', () => {
    const s = start();
    choose(s, 'Write an agreement');
    choose(s, 'Rent an outside');
    choose(s, 'next person');
    const oldId = s.proposal?.id;
    choose(s, 'Change the agreement');
    choose(s, 'Rent an outside');
    expect(s.proposal?.id).not.toBe(oldId);
    expect(s.proposal?.consents).toEqual([]);
    choose(s, 'End the meeting');
    expect(s.result).toBe('loss');
    expect(replayRun(exportRun(s))).toEqual(s);
  });
  it('cancels an incomplete shared agreement after late comparison and lets the player recover', () => {
    const s = start();
    choose(s, 'in private');
    choose(s, 'Tell Halil');
    choose(s, 'in private');
    choose(s, 'Tell Rıza');
    for (const name of ['Osman', 'Ferda']) {
      choose(s, 'Hear what');
      choose(s, `Ask ${name}`);
    }
    choose(s, 'Write an agreement');
    choose(s, 'cart inside. Smaller');
    expect(view(s).prose.join(' ')).toContain('delivery round');
    choose(s, 'next person');
    expect(s.proposal?.consents).toEqual(['halil']);
    expect(s.caught).toBe(false);
    choose(s, 'next person');
    choose(s, 'next person');
    choose(s, 'Wait for Rıza');
    const oldAgreement = structuredClone(s.proposal);
    choose(s, 'next person');
    expect(s.caught).toBe(true);
    expect(s.proposal).toBeNull();
    expect(oldAgreement?.consents).toEqual(['halil', 'osman', 'ferda']);
    choose(s, 'Hear what');
    choose(s, 'Ask Rıza');
    choose(s, 'Write an agreement');
    choose(s, 'Morning work. Smaller');
    sign(s);
    expect(s.result).toBe('win');
    expect(s.spent).toBe(100);
    expect(s.remaining).toBe(1);
    expect(view(s).prose.join(' ')).toContain('check every detail');
    expect(replayRun(exportRun(s))).toEqual(s);
  });
  it('also replaces an incomplete honest agreement when comparison reveals the earlier lies', () => {
    const s = start();
    choose(s, 'in private');
    choose(s, 'Tell Halil');
    choose(s, 'in private');
    choose(s, 'Tell Rıza');
    for (const name of ['Osman', 'Ferda']) {
      choose(s, 'Hear what');
      choose(s, `Ask ${name}`);
    }
    choose(s, 'Write an agreement');
    choose(s, 'Morning work. Smaller');
    choose(s, 'next person');
    choose(s, 'next person');
    choose(s, 'next person');
    choose(s, 'Wait for Rıza');
    choose(s, 'next person');
    expect(s.caught).toBe(true);
    expect(s.proposal).toBeNull();
    expect(s.result).toBe('playing');
    expect(s.note).toContain('₺40 deposit');
  });
  it('ends the meeting when a final-minute comparison cancels the unsigned agreement', () => {
    const s = start();
    choose(s, 'in private');
    choose(s, 'Tell Halil');
    choose(s, 'in private');
    choose(s, 'Tell Rıza');
    for (const name of ['Osman', 'Ferda']) {
      choose(s, 'Hear what');
      choose(s, `Ask ${name}`);
    }
    choose(s, 'Write an agreement');
    choose(s, 'cart inside. Smaller');
    choose(s, 'next person');
    choose(s, 'next person');
    choose(s, 'next person');
    choose(s, 'Wait for Rıza');
    // Boundary fixture: the same pending signature with only its displayed minute left.
    s.remaining = 1;
    choose(s, 'next person');
    expect(s.proposal).toBeNull();
    expect(s.remaining).toBe(0);
    expect(s.result).toBe('loss');
    expect(view(s).choices).toEqual([]);
  });
  it('records a confession during the delivery round in actual HF trust and relationships', () => {
    const s = start();
    choose(s, 'in private');
    choose(s, 'Tell Halil');
    choose(s, 'in private');
    choose(s, 'Tell Rıza');
    choose(s, 'Hear what');
    choose(s, 'Ask Osman');
    expect(s.remaining).toBe(18);
    choose(s, 'in private');
    choose(s, 'Withdraw your');
    for (const who of ['halil', 'riza'] as const) {
      expect(trustOf(s.people[who], 'nephew')).toBeLessThan(0.8);
      expect(relationshipWith(s.people[who], 'nephew').trust).toBeLessThan(0.5);
    }
    choose(s, 'Let Osman leave');
    expect(view(s).prose.join(' ')).toContain('check every detail');
    expect(replayRun(exportRun(s))).toEqual(s);
  });
  it('can avoid comparison by releasing Halil after his signed fee waiver', () => {
    const s = start();
    choose(s, 'in private');
    choose(s, 'Tell Halil');
    choose(s, 'in private');
    choose(s, 'Tell Rıza');
    for (const name of ['Osman', 'Ferda']) {
      choose(s, 'Hear what');
      choose(s, `Ask ${name}`);
    }
    choose(s, 'Write an agreement');
    choose(s, 'cart inside. Smaller');
    choose(s, 'next person');
    choose(s, 'Let Halil return');
    sign(s);
    expect(s.result).toBe('win');
    expect(s.spent).toBe(0);
    expect(s.caught).toBe(false);
    expect(trustOf(s.people.halil, 'nephew')).toBe(0.8);
    expect(replayRun(exportRun(s))).toEqual(s);
  });
  it('does not turn all questions into automatic consent to unsuitable terms', () => {
    const s = start();
    askAll(s);
    choose(s, 'Fetch Nuri');
    choose(s, 'Write an agreement');
    choose(s, 'Full shop lease');
    sign(s);
    expect(s.result).toBe('playing');
    expect(s.proposal?.consents).not.toContain('ferda');
    choose(s, 'End the meeting');
    expect(s.result).toBe('loss');
  });
  it('accepts a successful final signature at the displayed deadline', () => {
    const s = start();
    askAll(s);
    choose(s, 'Fetch Nuri');
    for (let i = 0; i < 2; i++) {
      choose(s, 'Hear what');
      choose(s, 'Ask Halil');
    }
    choose(s, 'Write an agreement');
    choose(s, 'smaller late service');
    sign(s);
    expect(s.result).toBe('win');
    expect(s.remaining).toBe(0);
    expect(replayRun(exportRun(s))).toEqual(s);
  });
  it('ends a refused final signature at the deadline', () => {
    const s = start();
    askAll(s);
    choose(s, 'Fetch Nuri');
    for (let i = 0; i < 2; i++) {
      choose(s, 'Hear what');
      choose(s, 'Ask Halil');
    }
    choose(s, 'Write an agreement');
    choose(s, 'Late work. Use');
    sign(s);
    expect(s.result).toBe('loss');
    expect(s.remaining).toBe(0);
  });
  it('rejects tampered exports and invalid inputs without mutating a run', () => {
    const s = start();
    const before = hashState(s);
    expect(() => act(s, { choice: '999' })).toThrow();
    expect(hashState(s)).toBe(before);
    const run = exportRun(s);
    run.state.remaining = 999;
    expect(() => replayRun(run)).toThrow();
  });
  it('reading Ink twice changes no HF or host state', () => {
    const s = start();
    const before = hashState(s);
    expect(view(s)).toEqual(view(s));
    expect(hashState(s)).toBe(before);
  });
  it('a duplicate signature input is a no-op on the exact proposal', () => {
    const s = start();
    choose(s, 'Write an agreement');
    choose(s, 'Rent an outside');
    const input = { choice: view(s).choices[0]?.id ?? '' };
    act(s, input);
    const signed = hashState(s);
    act(s, input);
    expect(hashState(s)).toBe(signed);
    expect(s.proposal?.consents).toEqual(['halil']);
  });
  it('keeps a long valid navigation log replayable', () => {
    const s = start();
    for (let i = 0; i < 101; i++) {
      choose(s, 'Hear what');
      choose(s, 'Return to the table');
    }
    expect(replayRun(exportRun(s))).toEqual(s);
  });
  it('Ferda acknowledges the order after the letter arrives', () => {
    const s = start();
    choose(s, 'Fetch Nuri');
    choose(s, 'Hear what');
    choose(s, 'Ask Ferda');
    expect(view(s).speech).toContain('order pays');
    expect(view(s).prose.join(' ')).not.toContain('at the depot');
  });
  it('asking every question and fetching the letter leaves four visible minutes after signing', () => {
    const s = start();
    for (const name of ['Halil', 'Rıza', 'Osman', 'Ferda']) {
      choose(s, 'Hear what');
      choose(s, `Ask ${name}`);
    }
    choose(s, 'Fetch Nuri');
    choose(s, 'Write an agreement');
    choose(s, 'smaller late service');
    sign(s);
    expect(s.result).toBe('win');
    expect(s.remaining).toBe(4);
    expect(replayRun(exportRun(s))).toEqual(s);
  });
});

it('rendering an immediate loss leaves the exported state unchanged', () => {
  const s = start();
  choose(s, 'Let Osman leave');
  const before = hashState(s);
  view(s);
  expect(hashState(s)).toBe(before);
});

it('keeps the complete agreement visible after a signature', () => {
  const s = start();
  choose(s, 'Write an agreement');
  choose(s, 'Rent an outside');
  const agreement = s.proposal?.terms;
  choose(s, 'next person');
  expect(view(s).prose.join(' ')).toContain(agreement);
});

it('includes a delivery round that will begin before Rıza can finish signing', () => {
  const s = start();
  choose(s, 'Hear what');
  choose(s, 'Ask Halil');
  choose(s, 'Write an agreement');
  choose(s, 'Rent an outside');
  expect(s.remaining).toBe(20);
  expect(view(s).prose.join(' ')).toContain('11 minutes needed');
});
