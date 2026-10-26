import { expect, it } from 'vitest';
import { act, createGame, exportRun, hashState, replayRun, view } from '../src/game';
import { coldPolicy } from './support/cold-policy';

for (const approach of ['ask-first', 'repair-refusal'] as const) {
  it(`the screen-only ${approach} policy wins and replays across 32 seeds`, () => {
    const outcomes = [];
    for (let seed = 0; seed < 32; seed++) {
      const state = createGame(seed);
      const decide = coldPolicy(approach);
      for (let step = 0; step < 80 && state.result === 'playing'; step++) {
        const screen = view(state);
        const choice = decide({
          text: [
            `${state.remaining} minutes before Osman leaves`,
            screen.title,
            ...screen.prose,
            screen.speech ?? '',
          ].join('\n'),
          choices: screen.choices,
        });
        act(state, { choice });
      }
      expect(state.result, `seed ${seed}`).toBe('win');
      const replay = replayRun(JSON.parse(JSON.stringify(exportRun(state))));
      expect(replay).toEqual(state);
      expect(hashState(replay)).toBe(hashState(state));
      outcomes.push({ seed, result: state.result, remaining: state.remaining });
    }
    expect(outcomes).toHaveLength(32);
  });
}
