const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const data = require('./data.json')

// sleep function
const sleep = async msec => new Promise(resolve => setTimeout(resolve, msec))

if (data.logging) console.log('Puppeteer starting');

// Load Stealth Plugin from data file
if (data.stealth) puppeteer.use(StealthPlugin());

//launch puppeteer, do everything in .then() handler
puppeteer.launch(data.debug ? data.browserOptions.debug : data.browserOptions.headless)
    .then(async function (browser) {

  //create a load_page function that returns a promise which resolves when page is ready
  async function load_page(url) {
    return new Promise(async function (resolve, reject) {
      // Stealth plugin needs to be opened in a new page 
      const page = await browser.newPage();
      if (data.logging) console.log(`Opening url ${url}`);
   
      //wait for the promise to resolve after networkidle2 fires
      await Promise.all([
        page.goto(url, {
          "waitUntil": ["load", "networkidle2"]
        }),
      ]);
      if (data.logging) console.log('Page loaded');
      //extra sleep to allow mPulse beacons to fire
      await sleep(data.waitTimems);
      await page.close();
      if (data.logging) console.log('Page closed');
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
    if (data.logging) console.log('Browser closed');
  }

  await stepThru();
})