# Traffic Bot

A small bot to generate artificial traffic to a set of predefined URLs

:warning: **Disclaimer**: Use of this bot is neither legal nor illegal. Be sure to check the laws in your country first. You are responsible for you own actions and should never blame maintainers/contributors.

## How-to

You need to have NodeJs installed. You can install it [here](https://nodejs.org/es/download/)
It's also recommended to install a standalone version of Chromium (See Puppeteer on Linux)

Open the console and type

```console
cd [directory of the project, e.g /usr/app/ or C://app]
```

Then install the node modules with the command

```console
npm install
```

on the project folder. You need to edit the URL list in the data.json file in the root directory.

```javascript
{
    "urls": [
        "https://www.example.com/",
        "https://www.example.com/?test=1",
        "https://www.example.com/?user=jdoe&password=abc123"
    ]
}
```
and adapt these settings according to your needs in the config.json file:

```json
"logging": true,      # Enable logging output 
"debug": false,       # Enable debug mode to run in non headlesss mode
"waitTime": 500,    # Wait milliseconds after page loaded event
"stealth": true      # Run stealth mode plugin to mask bots
```

Finally run `npm start` and let it work

## Known errors

### Puppeteer on Linux

If you are working with the bot on ARM architecture you possibly won't be able to work with the chromium build provided by puppeteer itself. To solve it you will need to install Chromium from an external source. You can do it with the default package manager on your Linux flavour. By default, on Ubuntu/Debin you can do it like this:

```
sudo apt install chromium-browser
```

Once you have Chromium installed you will need to tell the bot where is it. You can check out the path of the installation with this command (on Ubuntu/Debian):

```
which chromium-browser
```

Once you've got Chromium's path (by default it's /usr/bin/chromium-browser), you need to add it in the headless section behind browserOptions on the file data.json. It looks like this:

```json
{
  "browserOptions": {
    "headless": {
      "headless": true,
      "defaultViewport": null,
      "executablePath": "/usr/bin/chromium-browser" // path
    },
    "debug": {
      "headless": false,
      "args": ["--start-maximized"],
      "defaultViewport": null
    }
  }
}
```

The bot should now work properly.
