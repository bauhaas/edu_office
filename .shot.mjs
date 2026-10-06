import { chromium } from 'playwright'

const [, , url = 'http://localhost:3002/metiers/hotellerie', ...actions] = process.argv
const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2 })
await page.goto(url)
await page.waitForTimeout(1500)
const height = await page.evaluate(() => document.body.scrollHeight)
for (let y = 0; y < height; y += 300) {
  await page.evaluate((v) => window.scrollTo(0, v), y)
  await page.waitForTimeout(120)
}
await page.waitForTimeout(1200)
for (const label of ['Conseils', 'Collage & secrets']) {
  await page.locator(`section[aria-label="${label}"]`).screenshot({ path: `/tmp/sec-${label.split(' ')[0]}.png`, animations: 'disabled' })
}
await page.evaluate(() => window.scrollTo(0, 700))
await page.waitForTimeout(300)
await page.screenshot({ path: '/tmp/separators.png' })
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
await page.waitForTimeout(500)
await page.screenshot({ path: '/tmp/bottom.png' })
if (actions.includes('secret')) {
  await page.getByRole('button', { name: /Tanya/ }).click()
  await page.waitForTimeout(900)
  await page.screenshot({ path: '/tmp/secret.png' })
  await page.keyboard.press('Escape')
  await page.waitForTimeout(500)
  console.log('overlay after escape:', await page.locator('[role=dialog]').count())
}
if (actions.includes('next')) {
  await page.getByRole('button', { name: 'Conseil suivant' }).click()
  await page.waitForTimeout(700)
  await page.locator('section[aria-label="Conseils"]').screenshot({ path: '/tmp/sec-next.png' })
}
await browser.close()
