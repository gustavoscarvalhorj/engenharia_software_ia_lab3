import { expect, test } from '@playwright/test';

function localIso(offsetDays: number): string {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

test('busca para hoje e abre o checkout', async ({ page }) => {
  await page.goto('/hotels');
  await page.getByLabel('Destino').selectOption('RIO');
  await page.getByLabel('Entrada').fill(localIso(0));
  await page.getByLabel('Saída').fill(localIso(2));
  await page.getByLabel('Adultos').fill('2');
  await page.getByLabel('Crianças').fill('0');
  await page.getByRole('button', { name: 'Buscar hotéis' }).click();

  await expect(page.getByText('2 hotéis encontrados')).toBeVisible();
  await page.getByRole('button', { name: 'Escolher' }).first().click();

  await expect(page).toHaveURL(/\/checkout/);
  await expect(page.getByRole('heading', { name: 'Resumo da estadia' })).toBeVisible();
  await expect(page.getByText('Total estimado')).toBeVisible();
  await expect(page.getByText('Nenhuma reserva será efetivada.')).toBeVisible();
});

test('rejeita data de entrada no passado', async ({ page }) => {
  await page.goto('/hotels');
  await page.getByLabel('Destino').selectOption('BSB');
  await page.getByLabel('Entrada').fill(localIso(-1));
  await page.getByLabel('Saída').fill(localIso(1));
  await page.getByRole('button', { name: 'Buscar hotéis' }).click();

  await expect(page.getByText('Informe hoje ou uma data futura.')).toBeVisible();
  await expect(page.getByText(/hotéis encontrados/)).not.toBeVisible();
});
