import { expect, it } from 'vitest';
import { act, createGame, exportRun, replayRun, view } from '../src/game';
import { carelessPolicy } from './support/careless-policy';

it('uninformed drafting and refusal retries retain a real loss across 64 seeds', () => {
  let losses = 0;
  for (let seed = 0; seed < 64; seed++) {
    const state = createGame(seed);
    const decide = carelessPolicy(seed);
    for (let step = 0; step < 100 && state.result === 'playing'; step++) {
      const screen = view(state);
      act(state, { choice: decide({ text: screen.prose.join('\n'), choices: screen.choices }) });
    }
    expect(state.result).toBe('loss');
    expect(state.remaining).toBe(0);
    losses++;
    expect(replayRun(JSON.parse(JSON.stringify(exportRun(state))))).toEqual(state);
  }
  expect(losses).toBe(64);
}, 20000);
