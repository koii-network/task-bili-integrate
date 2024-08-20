const PCR = require('puppeteer-chromium-resolver');
const path = require('path');
let mainBrowser = null;

/**
 * negotiateSession
 * @returns {Promise<void>}
 * @description
 * 1. Get the path to the Chromium executable
 * 2. Launch a new browser instance
 * 3. Open a new page
 * 4. Set the viewport size
 * 5. Queue twitterLogin()
 */
negotiateSession = async () => {
  try {
    const options = {};
    const userDataDir = path.join(__dirname, 'puppeteer_cache_bilibili');
    const stats = await PCR(options);
    console.log(
      '*****************************************CALLED PURCHROMIUM RESOLVER*****************************************',
    );
    mainBrowser = await stats.puppeteer.launch({
      executablePath: stats.executablePath,
      userDataDir: userDataDir,
      headless: false,
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      args: [],
    });
    console.log('Step: Open Bilibili page');
    let mainPage = await mainBrowser.newPage();
    await mainPage.setViewport({ width: 1920, height: 1080 });
    await BilibiliCheckLogin(mainPage);
    return true;
  } catch (e) {
    console.log('Error negotiating session', e);
    return false;
  }
};

BilibiliCheckLogin = async mainPage => {
  try {
    await mainPage.goto('https://space.bilibili.com/');
    console.log('Step: Check login status 检测登录状态');
    await mainPage.waitForTimeout(10000);
    // Check if current url contain '/passport/login'
    console.log('Current URL: ', mainPage.url());
    const loginStatus = mainPage.url().includes('/passport/login');
    if (loginStatus) {
      console.log('请手动登陆 Please login manually');
      // await BilibiliLogin(mainPage);
    } else {
      console.log('已登录 Already logged in');
    }
  } catch (e) {
    console.log('Error checking login status', e);
  }
};

async function main() {
  await negotiateSession();
}

main();
