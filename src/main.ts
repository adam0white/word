import { createLab, PRIVACY_URL, sendFeedbackLabel } from '@adam0white/lab-client';
import { act, createGame, exportRun, hashState, replayRun, view } from './game';
import './style.css';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('The reading surface is missing.');
const root = app;
const lab = createLab({ game: 'word' });
const isLab = new URLSearchParams(location.search).get('lab') === '1';
const saveKey = 'his-word-save-v1';
const noticeKey = 'his-word-notice-v1';
function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function write(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* Play remains available without storage. */
  }
}
function freshSeed(): number {
  return crypto.getRandomValues(new Uint32Array(1))[0] ?? 1;
}
let state = createGame(freshSeed());
const saved = read(saveKey);
if (saved) {
  try {
    state = replayRun(JSON.parse(saved));
  } catch {
    /* An older save must not prevent a new run. */
  }
}
type Surface = 'play' | 'menu' | 'notebook' | 'feedback' | 'new' | 'notice' | 'lab';
let surface: Surface = read(noticeKey) ? 'play' : 'notice';
let status = '';
let feedbackBusy = false;
lab.trackRun(() => exportRun(state), { runKey: () => state.seed });

function element<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  text = '',
  className = '',
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
}
function button(text: string, action: () => void, className = ''): HTMLButtonElement {
  const node = element('button', text, className);
  node.type = 'button';
  if (className === 'choice') {
    const arrow = element('span', '↗', 'choice-arrow');
    arrow.setAttribute('aria-hidden', 'true');
    node.append(arrow);
  }
  node.addEventListener('click', action);
  return node;
}
function change(next: Surface): void {
  surface = next;
  status = '';
  render();
}
function heading(text: string): HTMLHeadingElement {
  const node = element('h1', text);
  node.tabIndex = -1;
  return node;
}
function paragraph(text: string): HTMLParagraphElement {
  return element('p', text);
}
function recording(): HTMLElement {
  const row = element('label', '', 'recording');
  const input = element('input');
  input.type = 'checkbox';
  input.checked = lab.telemetryOn;
  input.addEventListener('change', () => lab.setTelemetryOff(!input.checked));
  row.append(input, element('span', 'Record my play for the lab'));
  return row;
}
function download(): void {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(exportRun(state), null, 2)], { type: 'application/json' }),
  );
  const link = element('a');
  link.href = url;
  link.download = 'his-word-playtest.json';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  status = 'Playtest export downloaded.';
  render(false);
}
function persist(): void {
  write(saveKey, JSON.stringify(exportRun(state)));
}
function menu(leaf: HTMLElement): void {
  leaf.append(
    heading('Set the notebook down'),
    paragraph('Your place is kept in this browser when storage is available.'),
  );
  const options = element('div', '', 'menu-options');
  options.append(
    button('Resume', () => change('play')),
    button('Notebook', () => change('notebook')),
    button('Feedback', () => change('feedback')),
    button('Export playtest', download),
    button('New game', () => change('new')),
  );
  if (document.fullscreenEnabled)
    options.append(
      button(document.fullscreenElement ? 'Leave fullscreen' : 'Fullscreen', () => {
        const request = document.fullscreenElement
          ? document.exitFullscreen()
          : document.documentElement.requestFullscreen();
        void request
          .then(() => render(false))
          .catch(() => {
            status = 'Fullscreen is unavailable here.';
            render(false);
          });
      }),
    );
  const all = element('a', 'All games');
  all.href = 'https://human.adamwhite.work/games/';
  options.append(all);
  if (isLab) options.append(button('Lab tools', () => change('lab')));
  leaf.append(options, recording());
  const privacy = element('a', 'Recording and privacy');
  privacy.href = PRIVACY_URL;
  privacy.target = '_blank';
  privacy.rel = 'noopener';
  leaf.append(privacy);
}
function render(focus = true): void {
  root.replaceChildren();
  document.body.dataset.surface = surface;
  const top = element('header', '', 'masthead');
  const brand = element('span', 'His Word', 'brand');
  top.append(brand, element('span', 'A tailor’s notebook', 'masthead-note'));
  if (surface !== 'notice')
    top.append(
      button(
        surface === 'play' ? 'Menu' : 'Back',
        () => change(surface === 'play' ? 'menu' : 'play'),
        'small-button',
      ),
    );
  const leaf = element('main', '', 'leaf');
  leaf.id = 'reading';
  if (surface === 'play') {
    const scene = view(state);
    lab.screen(scene.title);
    leaf.append(
      element(
        'p',
        scene.ending
          ? 'One month later'
          : `${state.remaining} ${state.remaining === 1 ? 'minute' : 'minutes'} before Osman leaves`,
        'eyebrow',
      ),
      heading(scene.title),
    );
    const prose = element('div', '', 'prose');
    for (const line of scene.prose) prose.append(paragraph(line));
    if (scene.speech) {
      const quote = element('blockquote');
      if (scene.speaker) quote.append(element('cite', scene.speaker));
      quote.append(paragraph(scene.speech));
      leaf.append(quote);
    }
    leaf.append(prose);
    const choices = element('div', '', 'choices');
    choices.setAttribute('aria-label', 'Your next decision');
    for (const choice of scene.choices) {
      const option = button(
        choice.text,
        () => {
          act(state, { choice: choice.id });
          persist();
          render();
        },
        'choice',
      );
      if (state.page === 'offer' && choice.text.includes('(2 minutes)')) {
        const split = choice.text.indexOf('(2 minutes)') + '(2 minutes)'.length;
        if (option.firstChild) option.firstChild.textContent = choice.text.slice(0, split);
        const preview = element('span', choice.text.slice(split).trim(), 'agreement-preview');
        option.insertBefore(preview, option.querySelector('.choice-arrow'));
      }
      option.dataset.choice = choice.id;
      choices.append(option);
    }
    if (scene.ending) {
      leaf.append(element('p', scene.ending === 'win' ? 'AGREED' : 'NO AGREEMENT', `seal ${scene.ending}`));
      lab.milestone(`ending:${scene.ending}`);
      choices.append(
        button('Read the notebook', () => change('notebook'), 'choice'),
        button('Begin again', () => change('new'), 'choice'),
      );
    }
    leaf.append(choices);
    const foot = element('footer');
    foot.append(button('Open notebook', () => change('notebook'), 'text-button'));
    leaf.append(foot);
  } else if (surface === 'menu') menu(leaf);
  else if (surface === 'notebook') {
    leaf.append(element('p', 'What was said here', 'eyebrow'), heading('The notebook'));
    if (!state.log.length)
      leaf.append(paragraph('No words from this meeting yet. Nuri’s letter is still at the depot.'));
    const list = element('ol', '', 'entries');
    for (const entry of state.log) {
      const item = element('li');
      item.append(element('span', `${entry.at} min`, 'entry-time'), paragraph(entry.text));
      list.append(item);
    }
    leaf.append(
      list,
      button('Back to the table', () => change('play'), 'choice'),
    );
  } else if (surface === 'notice') {
    leaf.append(
      element('p', 'Before you sit down', 'eyebrow'),
      heading('A note about recording'),
      paragraph(
        'The lab records your decisions and where you stop. A browser ID can link your play across lab games. This helps us find confusing choices. You can turn recording off here or in the menu.',
      ),
      paragraph(
        'Your browser’s privacy signal is respected. Feedback you choose to send still works when recording is off.',
      ),
      recording(),
    );
    const privacy = element('a', 'Read the privacy notice');
    privacy.href = PRIVACY_URL;
    privacy.target = '_blank';
    privacy.rel = 'noopener';
    leaf.append(
      privacy,
      button(
        'Take a seat',
        () => {
          write(noticeKey, '1');
          change('play');
        },
        'choice',
      ),
    );
  } else if (surface === 'new') {
    leaf.append(
      heading('Start another meeting?'),
      paragraph('This replaces your current place. Export your playtest first if you want to keep it.'),
      button('Keep this meeting', () => change('play'), 'choice'),
      button(
        'Start new game',
        () => {
          state = createGame(freshSeed());
          persist();
          change('play');
        },
        'choice',
      ),
    );
  } else if (surface === 'feedback') {
    leaf.append(
      heading('Leave a note'),
      paragraph('Choose a note to send to the lab. With recording off, it is sent without your linked play.'),
    );
    const send = async (label: 'stopping' | 'confused') => {
      if (feedbackBusy) return;
      feedbackBusy = true;
      status = 'Sending your note…';
      render(false);
      try {
        await sendFeedbackLabel(lab, label);
        status = 'Your note reached the lab. Thank you.';
      } catch {
        status = 'Your note did not reach the lab. Please try again.';
      } finally {
        feedbackBusy = false;
        render(false);
      }
    };
    for (const [label, text] of [
      ['stopping', "I'm stopping"],
      ['confused', "I'm confused"],
    ] as const) {
      const option = button(
        text,
        () => {
          void send(label);
        },
        'choice',
      );
      option.disabled = feedbackBusy;
      leaf.append(option);
    }
    leaf.append(button('Return to the table', () => change('play'), 'text-button'));
  } else if (surface === 'lab') {
    leaf.append(
      heading('Lab tools'),
      paragraph(`Seed: ${state.seed}`),
      paragraph(`Final state hash: ${hashState(state)}`),
    );
    const label = element('label', 'Import a playtest export', 'import-label');
    const input = element('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.addEventListener('change', () => {
      const file = input.files?.[0];
      if (!file) return;
      void file
        .text()
        .then((text) => {
          state = replayRun(JSON.parse(text));
          persist();
          status = `Replay verified. Final hash: ${hashState(state)}`;
          render(false);
        })
        .catch(() => {
          status = 'This export could not be replayed. Your current meeting is kept.';
          render(false);
        });
    });
    label.append(input);
    leaf.append(
      label,
      button('Export playtest', download, 'choice'),
      button('Resume replay', () => change('play'), 'choice'),
    );
  }
  if (status) {
    const message = element('p', status, 'status');
    message.setAttribute('role', 'status');
    leaf.append(message);
  }
  root.append(top, leaf, element('div', 'Nuri’s promises. Your words.', 'cloth-note'));
  if (focus) {
    leaf.querySelector('h1')?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }
}
render(false);
