const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const randomUseragent = require('random-useragent')
const data = require(./data.json)

//a list of sites to navigate
const pages =
{
  url1: "https://www.christianscotti.com/",
  url2: "https://www.christianscotti.com/responsive-images/not-responsive.html",
  url3: "https://www.christianscotti.com/responsive-images/responsive.html"
};

//launch puppeteer, do everything in .then() handler
console.log('Puppeteer starting');

//puppeteer.use(StealthPlugin())
puppeteer.launch({devtools:true, headless:true, product: 'chrome', args: ['--start-maximized'], defaultViewport :{width: 1700, height: 800}, 
                  slowMo:250, executablePath: require('puppeteer').executablePath()}).then(async function(browser){

  //create a load_page function that returns a promise which resolves when page is ready
  async function load_page(u){
    const url = pages[u];
    return new Promise(async function(resolve, reject){
      const page = await browser.newPage();
      console.log('Opened page');
      await page.setViewport({width:1280, height: 800, isMobile: false});

      // Replace headeless chrome from user-agent header
      const headlessUserAgent = await page.evaluate(() => navigator.userAgent)
      const chromeUserAgent = headlessUserAgent.replace('HeadlessChrome', 'Chrome')
      await page.setUserAgent(chromeUserAgent)
    
      // Set standard headers sent
      await page.setExtraHTTPHeaders({
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'en-US,en;q=0.8,es-ES;q=0.5,es;q=0.3',
      'referer'        : 'https://www.google.com/',
      'upgrade-insecure-requests': '1'
      });



      await Promise.all([
        page.goto(url, {"waitUntil":["load", "networkidle2"]}),
      ]);
      console.log('Page loaded');
      await page.close();
      console.log('Page closed');
      resolve();
    })
  }

  //step through the list of urls, calling the above load_page()
  async function stepThru(){
    for(var p in pages){
      if(pages.hasOwnProperty(p)){
        //wait to load page before loading next page
        await load_page(p);
      }
    }

    await browser.close();
    console.log('Browser closed');
  }

  await stepThru();
})