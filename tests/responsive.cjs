// Run with PLAYWRIGHT_MODULE pointing to an installed playwright package.
const { chromium, firefox, webkit, devices } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
(async () => {
 const http = require('node:http'), fs = require('node:fs'), path = require('node:path');
 const server = http.createServer((req,res) => {
  const file = path.join(process.cwd(), 'dist', req.url.replace(/^\/presentation\//, '').split('?')[0] || 'index.html');
  const mime = {'.html':'text/html','.js':'application/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2'};
  fs.readFile(file, (err,data) => { if(err) {res.writeHead(404);res.end();return;}res.setHeader('Content-Type',mime[path.extname(file)] || 'application/octet-stream');res.end(data); });
 });
 await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
 const testUrl = `http://127.0.0.1:${server.address().port}/presentation/`;
 const engine = process.env.BROWSER || 'chromium';
 let options = { headless: true, timeout: 20000, ignoreDefaultArgs: ['--hide-scrollbars'] };
 if (process.env.WEBKIT_EXECUTABLE) options.executablePath = process.env.WEBKIT_EXECUTABLE;
 if (process.env.CHROMIUM_EXECUTABLE) options = {...options, executablePath:process.env.CHROMIUM_EXECUTABLE, args:['--no-sandbox','--no-zygote','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']};
 const browser = await ({chromium, firefox, webkit}[engine]).launch(options);
 const profiles = require('./chrome-devtools-profiles.json').map(([name,config])=>[name,{...config}]);
 if(engine === 'webkit') profiles.splice(0, profiles.length, ...profiles.filter(([name]) => /^(iPhone SE|iPhone 14 Pro Max|iPad Mini|iPad Pro 13) (vertical|horizontal)$/.test(name)));
 if(engine === 'firefox') profiles.splice(0, profiles.length, ...[320,375,390,768,1024,1440].map(width=>[`Firefox ${width}`,{viewport:{width,height:900}}]));
 profiles.push(['Desktop 1920', { viewport: {width:1920,height:1080} }], ['Narrow 320', {viewport:{width:320,height:640},hasTouch:true}]);
 const failures = [];
 const recheck = process.env.RECHECK_FILE ? JSON.parse(fs.readFileSync(process.env.RECHECK_FILE)).failures.map(item=>item.name) : null;
 const selected = profiles.filter(([name]) => (!process.env.PROFILE || name === process.env.PROFILE) && (!recheck || recheck.includes(name)));
 async function checkProfile([name, config]) {
  const {defaultBrowserType, ...device} = config;
  const context = await browser.newContext({...device, reducedMotion:'reduce'});
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  try {
   await page.goto(process.env.TEST_URL || testUrl, {waitUntil:'domcontentloaded',timeout:30000});
   await page.locator('.team-photo').evaluate(img => img.decode());
   for (const lang of ['uk','ru','en','it']) {
   await page.locator('.language-trigger').click();
   await page.locator(`[data-language="${lang}"]`).click();
   const layout = await page.evaluate(() => ({lang:document.documentElement.lang,viewport:innerWidth,width:document.documentElement.scrollWidth,
     overflow:[...document.querySelectorAll('.card,.badge,.btn,.body-text,h1,h2,h3')].filter(el => el.getBoundingClientRect().right > innerWidth + 1 || el.scrollWidth > el.clientWidth + 2).map(el=>el.className)}));
   assert.ok(layout.width <= layout.viewport, JSON.stringify(layout));
   assert.equal(layout.overflow.length, 0, JSON.stringify(layout));
   }
   await page.locator('#team').evaluate(el => el.scrollIntoView({block:'start',behavior:'instant'}));
   if(device.viewport.width >= 1200) await page.waitForFunction(() => getComputedStyle(document.querySelector('.rail')).visibility === 'visible');
   if (device.viewport.width <= 720) {
    const ratio = await page.locator('.team-photo').evaluate(img => ({actual:img.clientWidth/img.clientHeight, natural:img.naturalWidth/img.naturalHeight}));
    assert.ok(Math.abs(ratio.actual-ratio.natural)<.02, 'team image is cropped');
   }
   if(device.viewport.width < 1200) { await page.locator('.burger').click(); await page.locator('#mobile-navigation a[href="#mission"]').click(); }
   else await page.locator('.rail-item[href="#mission"]').click();
   await page.locator('.rail-item--active[href="#mission"]').waitFor({state:'attached'});
   assert.equal(await page.locator('.rail-item--active').getAttribute('href'), '#mission');
  } catch(error) { failures.push({name,error:error.message}); console.error(name,error.message); }
  if(process.env.SCREENSHOT) await page.screenshot({path:process.env.SCREENSHOT,fullPage:false,timeout:30000});
  console.error('Checked',name);
  await context.close();
 }
 for(let i=0;i<selected.length;i+=2) await Promise.all(selected.slice(i,i+2).map(checkProfile));
 console.log(JSON.stringify({engine, profiles:selected.length, languages:['uk','ru','en','it'], failures},null,2));
 await browser.close();
 server.close();
 if(failures.length) process.exitCode=1;
})().catch(error => { console.error(error); process.exit(1); });
