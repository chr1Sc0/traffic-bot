const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const data = require('./data.json')
const config = require('./config.json')

// sleep function
const sleep = async msec => new Promise(resolve => setTimeout(resolve, msec))

module.exports = class Bot {

  async run() {
    // Load Stealth Plugin setting from config file
    if (config.stealth) puppeteer.use(StealthPlugin());

    //launch puppeteer, do everything in .then() handler
    if (config.logging) console.log('Puppeteer starting');
    puppeteer.launch(config.debug ? config.browserOptions.debug : config.browserOptions.headless)
      .then(async function (browser) {

        //create a load_page function that returns a promise which resolves when page is ready
        async function load_page(url) {
          return new Promise(async function (resolve, reject) {
            // Stealth plugin needs to be opened in a new page 
            const page = await browser.newPage();
            if (config.logging) console.log(`Opening url ${url}`);

            //wait for the promise to resolve after networkidle2 fires
            await Promise.all([
              page.goto(url, {
                "waitUntil": ["load", "networkidle2"]
              }),
            ]);
            if (config.logging) console.log('Page loaded');

            //Scroll to the bottom of the page for GA to fire
            let prevHeight = -1;
            let maxScrolls = 100;
            let scrollCount = 0;

            while (scrollCount < maxScrolls) {
              // Scroll to the bottom of the page
              await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
              // Wait for page load
              //await page.waitForTimeout(1000);
              // Calculate new scroll height and compare
              let newHeight = await page.evaluate('document.body.scrollHeight');
              if (newHeight == prevHeight) {
                break;
              }
              prevHeight = newHeight;
              scrollCount += 1;
            }

            //extra sleep to allow mPulse beacons to fire
            await sleep(config.waitTime);
            await page.close();
            if (config.logging) console.log('Page closed');
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
          if (config.logging) console.log('Browser closed');
        }

        await stepThru();
      })
  }
}