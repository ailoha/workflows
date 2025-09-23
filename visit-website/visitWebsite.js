const { chromium } = require('playwright');
const { setTimeout } = require('timers/promises');
const websites = require('./websites.json');

// 访问单个网站
async function visitWebsite(page, url) {
  try {
    console.log(`Visiting ${url}`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

    // 停留 60 秒
    await setTimeout(60000);

    // 尝试点击页面上的“Home”链接
    try {
      const homeLink = await page.locator('a:has-text("Home")').first();
      if (await homeLink.count() > 0) {
        await homeLink.click();
        console.log(`Clicked Home link on ${url}`);
        await setTimeout(5000);
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

  // 随机运行 2~3 次
  const runTimes = Math.floor(Math.random() * 2) + 2; // 2 or 3
  console.log(`This session will run ${runTimes} rounds.`);

  for (let i = 0; i < runTimes; i++) {
    console.log(`\n--- Round ${i + 1} ---`);
    for (const website of websites) {
      await visitWebsite(page, website);
    }

    // 如果不是最后一轮，等待 1~1.5 小时
    if (i < runTimes - 1) {
      const delayMinutes = 60 + Math.floor(Math.random() * 31); // 60-90 min
      const delayMs = delayMinutes * 60 * 1000;
      console.log(`Waiting ${delayMinutes} minutes before next round...`);
      await setTimeout(delayMs);
    }
  }

  await browser.close();
})();
