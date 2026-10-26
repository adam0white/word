import { trustOf } from '@adam0white/human-framework';
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
  for (let i = 0; i < 4 && s.result === 'playing'; i++) choose(s, 'next person');
}

describe('complete negotiation', () => {
  it('settles honestly without exhaustive questions and replays the complete state', () => {
    const s = start();
    choose(s, 'Write a proposal');
    choose(s, 'Rent an outside');
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
    choose(s, 'Fetch Nuri');
    expect(s.remaining).toBe(18);
    choose(s, 'Write a proposal');
    choose(s, 'Use the clothing');
    sign(s);
    expect(s.result).toBe('win');
    expect(s.spent).toBe(40);
    expect(view(s).prose.join(' ')).toContain('late');
  });
  it('catches the player as the source, gives a recoverable refusal, and can still settle', () => {
    const s = start();
    choose(s, 'in private');
    choose(s, 'Tell Halil');
    choose(s, 'in private');
    choose(s, 'Tell Rıza');
    choose(s, 'Write a proposal');
    choose(s, 'cart inside');
    expect(s.proposal?.cost).toBe(0);
    choose(s, 'next person');
    expect(s.caught).toBe(true);
    expect(trustOf(s.people.halil, 'nephew')).toBeLessThan(0.8);
    expect(trustOf(s.people.riza, 'nephew')).toBeLessThan(0.8);
    expect(s.result).toBe('playing');
    choose(s, 'Fetch Nuri');
    choose(s, 'Write a proposal');
    choose(s, 'Use the clothing');
    sign(s);
    expect(s.result).toBe('win');
    expect(s.spent).toBe(80);
    expect(replayRun(exportRun(s))).toEqual(s);
  });
  it('clears signatures on a counterproposal and ends a failed meeting', () => {
    const s = start();
    choose(s, 'Write a proposal');
    choose(s, 'Rent an outside');
    choose(s, 'next person');
    const oldId = s.proposal?.id;
    choose(s, 'Change the proposal');
    choose(s, 'Rent an outside');
    expect(s.proposal?.id).not.toBe(oldId);
    expect(s.proposal?.consents).toEqual([]);
    choose(s, 'End the meeting');
    expect(s.result).toBe('loss');
    expect(replayRun(exportRun(s))).toEqual(s);
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
  it('asking every question and fetching the letter leaves too little time to sign', () => {
    const s = start();
    for (const name of ['Halil', 'Rıza', 'Osman', 'Ferda']) {
      choose(s, 'Hear what');
      choose(s, `Ask ${name}`);
    }
    choose(s, 'Fetch Nuri');
    choose(s, 'Write a proposal');
    choose(s, 'Use the clothing');
    sign(s);
    expect(s.result).toBe('loss');
    expect(replayRun(exportRun(s))).toEqual(s);
  });
});
