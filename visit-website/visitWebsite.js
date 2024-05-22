const puppeteer = require('puppeteer');
const { setTimeout } = require('timers/promises'); // 引入 setTimeout
const websites = require('./websites.json');  // 使用 require 读取 JSON 文件

// 创建一个函数来处理网站访问和等待
async function visitWebsite(page, url) {
  await page.goto(url).catch(e => console.error(`Failed to visit ${url}: ${e.message}`));
  await setTimeout(60000); // 使用 setTimeout 替代 page.waitForTimeout

  // 尝试点击 Home 键
  try {
    await page.evaluate(() => {
      const homeLink = Array.from(document.querySelectorAll('a')).find(el => el.textContent === 'Home');
      if (homeLink) {
        homeLink.click();
      }
    });
  } catch (e) {
    console.error(`Failed to click Home link on ${url}: ${e.message}`);
  }
}

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // 使用 forEach 循环来访问每个网站
  for (const website of websites) {
    await visitWebsite(page, website);
  }

  await browser.close();
})();
