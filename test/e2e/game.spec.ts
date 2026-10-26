import { expect, test } from '@playwright/test';

async function takeSeat(page: import('@playwright/test').Page) {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'A note about recording' })).toBeVisible();
  await page.getByRole('checkbox', { name: 'Record my play for the lab' }).uncheck();
  await page.getByRole('button', { name: 'Take a seat' }).click();
}

test('the table, notebook and menu work without exposing lab tools', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await takeSeat(page);
  await expect(page.locator('main h1')).toBeVisible();
  await expect(page.locator('[data-choice]').first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Open notebook', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'The notebook' })).toBeVisible();
  await page.getByRole('button', { name: 'Back to the table' }).click();
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Lab tools' })).toHaveCount(0);
  await expect(page.getByRole('checkbox', { name: 'Record my play for the lab' })).not.toBeChecked();
  await page.getByRole('button', { name: 'Feedback', exact: true }).click();
  await expect(page.getByRole('button', { name: "I'm stopping", exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: "I'm confused", exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Return to the table' }).click();
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  const downloaded = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export playtest', exact: true }).click();
  await expect((await downloaded).suggestedFilename()).toBe('his-word-playtest.json');
  await page.getByRole('button', { name: 'New game', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Start another meeting?' })).toBeVisible();
  await page.getByRole('button', { name: 'Keep this meeting' }).click();
  expect(errors).toEqual([]);
});

test('lab replay rejects malformed imports and retains the current meeting', async ({ page }) => {
  await takeSeat(page);
  const title = await page.locator('main h1').textContent();
  await page.goto('/?lab=1');
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page.getByRole('button', { name: 'Lab tools', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Lab tools' })).toBeVisible();
  await page
    .getByLabel('Import a playtest export')
    .setInputFiles({ name: 'bad.json', mimeType: 'application/json', buffer: Buffer.from('{}') });
  await expect(page.getByRole('status')).toContainText('could not be replayed');
  await page.getByRole('button', { name: 'Resume replay' }).click();
  await expect(page.locator('main h1')).toHaveText(title ?? '');
});

async function choice(page: import('@playwright/test').Page, text: string) {
  await page.locator('[data-choice]').filter({ hasText: text }).click();
}

async function ask(page: import('@playwright/test').Page, name: string) {
  await choice(page, 'Hear what');
  await choice(page, `Ask ${name}`);
}

async function signatures(page: import('@playwright/test').Page) {
  for (let person = 0; person < 4; person++) await choice(page, 'next person');
}

test('careful asking and the letter reach an agreement, while ending the meeting loses', async ({ page }) => {
  await takeSeat(page);
  await choice(page, 'Put the notebook');
  for (const name of ['Halil', 'Rıza', 'Osman', 'Ferda']) await ask(page, name);
  await choice(page, 'Fetch Nuri');
  await choice(page, 'Write an agreement');
  await choice(page, 'Use the clothing order for a smaller late service');
  await expect(page.locator('main')).toContainText('4 minutes needed');
  await signatures(page);
  await expect(page.getByText('AGREED', { exact: true })).toBeVisible();
  await expect(page.locator('main')).toContainText('month');
  await expect(page.locator('main')).toContainText('₺40');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Begin again', exact: true }).click();
  await page.getByRole('button', { name: 'Start new game', exact: true }).click();
  await choice(page, 'Put the notebook');
  await choice(page, 'Let Osman leave');
  await expect(page.getByText('NO AGREEMENT', { exact: true })).toBeVisible();
});

test('an uninformed agreement receives an actionable refusal and all actions show time', async ({ page }) => {
  await takeSeat(page);
  await choice(page, 'Put the notebook');
  await choice(page, 'Write an agreement');
  await choice(page, 'Morning work. Rent an outside');
  for (let person = 0; person < 4; person++) {
    const before = await page.locator('.eyebrow').textContent();
    await choice(page, 'next person');
    if ((await page.locator('main').textContent())?.includes('refuses')) {
      expect(await page.locator('.eyebrow').textContent()).not.toBe(before);
      break;
    }
  }
  await expect(page.locator('main')).toContainText('Ferda refuses:');
  await expect(page.getByText('AGREED', { exact: true })).toHaveCount(0);
  const labels = await page.locator('[data-choice]').allTextContents();
  expect(labels.every((label) => /\(\d+ minutes?\)/.test(label))).toBe(true);
});

test('private assurances have a cash payoff during the delivery round', async ({ page }) => {
  await takeSeat(page);
  await choice(page, 'Put the notebook');
  await choice(page, 'in private');
  await choice(page, 'Tell Halil');
  await choice(page, 'in private');
  await choice(page, 'Tell Rıza');
  await ask(page, 'Osman');
  await ask(page, 'Ferda');
  await choice(page, 'Write an agreement');
  await choice(page, 'Small repairs and cart inside. Smaller service');
  await expect(page.locator('main')).toContainText('delivery round');
  await choice(page, 'next person');
  await choice(page, 'Let Halil return');
  for (let n = 0; n < 2; n++) await choice(page, 'next person');
  await expect(page.locator('main')).toContainText('2 minutes needed');
  await choice(page, 'Wait for Rıza');
  await choice(page, 'next person');
  await expect(page.getByText('AGREED', { exact: true })).toBeVisible();
  await expect(page.locator('main')).toContainText('₺0');
});

// The same policy is driven from DOM text here; it gets no state or export.
for (const approach of ['ask-first', 'repair-refusal'] as const) {
  test(`screen-only policy wins in the browser: ${approach}`, async ({ page }) => {
    const { coldPolicy } = await import('../support/cold-policy');
    const decide = coldPolicy(approach);
    await takeSeat(page);
    for (let step = 0; step < 80; step++) {
      if (await page.getByText('AGREED', { exact: true }).count()) break;
      const text = (await page.locator('main').textContent()) ?? '';
      const choices = await page.locator('[data-choice]').evaluateAll((nodes) =>
        nodes.map((node) => ({
          id: (node as HTMLElement).dataset.choice ?? '',
          text: node.textContent ?? '',
        })),
      );
      const id = decide({ text, choices });
      await page.locator(`[data-choice="${id}"]`).click();
    }
    await expect(page.getByText('AGREED', { exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}
