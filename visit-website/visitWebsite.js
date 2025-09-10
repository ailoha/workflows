const { chromium } = require('playwright');
const { setTimeout } = require('timers/promises');
const websites = require('./websites.json');

async function visitWebsite(page, url) {
  try {
    console.log(`Visiting ${url}`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

    // 停留 60 秒，模拟用户停留
    await setTimeout(60000);

    // 尝试点击页面上的“Home”链接
    try {
      const homeLink = await page.locator('a:has-text("Home")').first();
      if (await homeLink.count() > 0) {
        await homeLink.click();
        console.log(`Clicked Home link on ${url}`);
        await setTimeout(5000); // 停留 5 秒
      }
    } catch (err) {
      console.error(`Failed to click Home link on ${url}: ${err.message}`);
    }

  } catch (err) {
    console.error(`Failed to visit ${url}: ${err.message}`);
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36"
  });
  const page = await context.newPage();

  for (const website of websites) {
    await visitWebsite(page, website);
  }

  await browser.close();
})();
