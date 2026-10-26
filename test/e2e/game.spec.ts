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

test('an honest agreement and a failed meeting both reach an ending', async ({ page }) => {
  await takeSeat(page);
  await page.getByRole('button', { name: 'Put the notebook on the table.' }).click();
  await page.getByRole('button', { name: 'Write a proposal.' }).click();
  await page
    .getByRole('button', { name: 'Morning work. Rent an outside cart space. You cover £100.' })
    .click();
  for (let person = 0; person < 4; person++) {
    await page.getByRole('button', { name: 'Ask the next person to sign. Takes one minute.' }).click();
  }
  await expect(page.getByText('AGREED', { exact: true })).toBeVisible();
  await expect(page.locator('main')).toContainText('month');
  await page.getByRole('button', { name: 'Begin again', exact: true }).click();
  await page.getByRole('button', { name: 'Start new game', exact: true }).click();
  await page.getByRole('button', { name: 'Put the notebook on the table.' }).click();
  await page.getByRole('button', { name: 'Let Osman leave. End the meeting.' }).click();
  await expect(page.getByText('NO AGREEMENT', { exact: true })).toBeVisible();
});
