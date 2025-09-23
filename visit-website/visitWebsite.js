const { chromium } = require('playwright');
const { setTimeout } = require('timers/promises');
const websites = require('./websites.json');

// 随机整数 [min, max]
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 打乱数组顺序
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// 访问单个网站
async function visitWebsite(page, url) {
  try {
    console.log(`Visiting ${url}`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

    // 停留 30–60 秒
    const staySeconds = getRandomInt(30, 60);
    console.log(`Staying on ${url} for ${staySeconds} seconds...`);
    await setTimeout(staySeconds * 1000);

    // 尝试点击页面上的“Home”链接
    try {
      const homeLink = await page.locator('a:has-text("Home")').first();
      if (await homeLink.count() > 0) {
        await homeLink.click();
        console.log(`Clicked Home link on ${url}`);
        await setTimeout(5000); // 再停留 5 秒
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

  // 访问数量：3–5 个（如果网站不足 3 个，则访问所有）
  const visitCount = websites.length < 3 ? websites.length : getRandomInt(3, 5);
  console.log(`This session will visit ${visitCount} websites.`);

  // 打乱网站顺序，挑选前 visitCount 个
  const selectedWebsites = shuffle([...websites]).slice(0, visitCount);

  for (let i = 0; i < selectedWebsites.length; i++) {
    const site = selectedWebsites[i];
    await visitWebsite(page, site);

    // 如果不是最后一个，间隔 30–90 秒
    if (i < selectedWebsites.length - 1) {
      const delaySeconds = getRandomInt(30, 90);
      console.log(`Waiting ${delaySeconds} seconds before next website...`);
      await setTimeout(delaySeconds * 1000);
    }
  }

  await browser.close();
})();
