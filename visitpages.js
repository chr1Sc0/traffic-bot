const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const data = require('./data.json')

const sleep = async msec => new Promise(resolve => setTimeout(resolve, msec))

//launch puppeteer, do everything in .then() handler
console.log('Puppeteer starting');

puppeteer.use(StealthPlugin());

if (data.debug) 
  browseropts = JSON.stringify(data.browserOptions.debug)

else 
  browseropts = JSON.stringify(data.browserOptions.headless)


browseropts = browseropts.substring(1,browseropts.length-1)
console.log(browseropts)

puppeteer.launch({ browseropts, executablePath: require('puppeteer').executablePath() }).then(async function (browser) {


  //create a load_page function that returns a promise which resolves when page is ready
  async function load_page(u) {
    const url = u;
    return new Promise(async function (resolve, reject) {
      const page = await browser.newPage();
      console.log('Opened page');
      await page.setViewport({
        width: 1280,
        height: 800,
        isMobile: false
      });

      await Promise.all([
        page.goto(url, {
          "waitUntil": ["load", "networkidle2"]
        }),
      ]);
      console.log('Page loaded');
      await sleep(500);
      await page.close();
      console.log('Page closed');
      resolve();
    })
  }

  //step through the list of urls, calling the above load_page()
  async function stepThru() {
    if (Array.isArray(data.urls))
      for (var i = 0; i < data.urls.length; i++) {
        await load_page(data.urls[i]);
      }
    await browser.close();
    console.log('Browser closed');
  }

  await stepThru();
})