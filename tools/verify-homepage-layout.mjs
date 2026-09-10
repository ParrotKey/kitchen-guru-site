import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.KITCHEN_GURU_PLAYWRIGHT || 'playwright');
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const output = await mkdtemp(path.join(tmpdir(), 'kg-homepage-layout-'));
try {
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }, { width: 320, height: 740 }]) {
    const page = await browser.newPage({ viewport, reducedMotion: 'reduce' });
    const failures = [];
    page.on('pageerror', (error) => failures.push(error.message));
    await page.goto(new URL('../index.html', import.meta.url).href);
    await page.locator('.nav a[href="#features"]').click();
    await page.locator('.product-copy').first().waitFor({ state: 'visible' });
    const geometry = await page.evaluate(() => {
      const rect = (element) => {
        const box = element.getBoundingClientRect();
        return { x: box.x, y: box.y, right: box.right, bottom: box.bottom, width: box.width, height: box.height };
      };
      const rows = [...document.querySelectorAll('.product-row')];
      return {
        width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
        rows: rows.map(rect),
        framed: rows.some((row) => getComputedStyle(row).backgroundColor !== 'rgba(0, 0, 0, 0)'),
        textOverflow: rows.some((row) => [...row.querySelectorAll('h3,p,.customer-proof')].some((text) => {
          const a = rect(row), b = rect(text);
          return b.x < a.x - 1 || b.right > a.right + 1 || b.bottom > a.bottom + 1 || text.scrollWidth > text.clientWidth + 1;
        })),
        brokenAnchors: [...document.querySelectorAll('a[href^="#"]')].filter((a) => !document.getElementById(a.hash.slice(1))).map((a) => a.hash),
        archived: [...document.images].some((image) => image.src.includes('app-screens')),
        anchorVisible: document.querySelector('.product-copy h3').getBoundingClientRect().top >= document.querySelector('.topbar').getBoundingClientRect().bottom,
      };
    });
    assert.equal(geometry.archived, false);
    assert.equal(geometry.anchorVisible, true);
    assert.equal(geometry.framed, false);
    assert.equal(geometry.textOverflow, false);
    assert.ok(geometry.scrollWidth <= viewport.width + 1, JSON.stringify(geometry));
    assert.deepEqual(geometry.brokenAnchors, []);
    assert.equal(geometry.rows.length, 3);
    for (let i = 1; i < geometry.rows.length; i++) {
      const previous = geometry.rows[i - 1], current = geometry.rows[i];
      if (viewport.width > 760) assert.ok(current.x >= previous.right);
      else assert.ok(current.y >= previous.bottom);
    }
    await page.screenshot({ path: path.join(output, `features-${viewport.width}.png`) });
    await page.evaluate(() => scrollTo(0, 0));
    await page.locator('.hero-poster img').evaluate((img) => img.decode());
    await page.screenshot({ path: path.join(output, `hero-${viewport.width}.png`) });
    await page.screenshot({ path: path.join(output, `full-${viewport.width}.png`), fullPage: true });
    assert.deepEqual(failures, []);
    console.log(`PASS ${viewport.width}x${viewport.height}: unframed features, no overflow, intact hero, valid anchors`);
    await page.close();
  }
  console.log(`Verification screenshots: ${output}`);
} finally {
  await browser.close();
}
