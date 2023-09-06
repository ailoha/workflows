const puppeteer = require('puppeteer');
const websites = require('./websites.json');  // 使用 require 读取 JSON 文件

// 创建一个函数来处理网站访问和等待
async function visitWebsite(page, url) {
  await page.goto(url).catch(e => console.error(`Failed to visit ${url}: ${e.message}`));
  await page.waitForTimeout(60000); // 等待 60 秒
}

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // 使用 forEach 循环来访问每个网站
  for (const website of websites) {
    await visitWebsite(page, website);
  }

  await browser.close();
})();
