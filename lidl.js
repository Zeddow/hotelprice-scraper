const puppeteer = require("puppeteer");
const userAgent = require("user-agents");

const EXTENSIONS = [
  __dirname + "/extensions/fihnjjcciajhdojfnbdddfaoknhalnja/3.4.3_0", // I don't care about cookies
];

let browser = "";

(async () => {
  if (browser == "") {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: {
        width: 1280,
        height: 720,
      },
      ignoreDefaultArgs: ["--enable-automation"],
      args: [`--disable-extensions-except=${EXTENSIONS.toString()}`],
    });
  }

  //visit https://www.topcashback.de/anmelden/?PageRequested=/home/
  const page = await browser.newPage();
  await page.setUserAgent(userAgent.random().toString());
  await page.goto("https://www.topcashback.de/anmelden/?PageRequested=/home/");
  await page.waitForTimeout(6000);

  await page.type("#txtEmail", "anfrage.@gmail.com", { delay: 30 });
  await page.waitForTimeout(2000);

  await page.type("#loginPasswordInput", '!"§4', { delay: 35 });
  await page.waitForTimeout(2000);

  //click button witf type submit
  await page.click("button[type='submit']");

  //wait for selector gecko-search-bar
  await page.waitForSelector("#gecko-search-bar");

  //visit https://www.topcashback.de/lidl/
  await page.goto("https://www.topcashback.de/lidl/");

  // click gecko-btn-cashback
  await page.click("#gecko-btn-cashback");

  await browser.close();
})();
