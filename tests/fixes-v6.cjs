const {chromium,firefox,webkit}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
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

 const results=[];
 for(const width of (process.env.TEST_WIDTHS ? process.env.TEST_WIDTHS.split(',').map(Number) : [240,320,390,440,844,1024,1440,1920])) {
 const context=await browser.newContext({viewport:{width,height:width===844?390:900},hasTouch:width<1200,isMobile:engine!=='firefox'&&width<1200,reducedMotion:'reduce'});
 const page=await context.newPage();page.setDefaultTimeout(15000);
 await page.route('**/presentation/',async route=>{const response=await route.fetch();const html=(await response.text()).replace(/<script>[\s\S]*?<\/script>/,'');await route.fulfill({response,body:html});});
 await page.goto(testUrl,{waitUntil:'domcontentloaded'});
 for(const theme of ['light','dark']) {
 if(await page.locator('html').getAttribute('data-theme')!==theme) await page.locator('.theme-toggle').click();
 assert.equal(await page.locator('html').getAttribute('data-theme'),theme);
 if(theme==='light') assert.equal(await page.locator('.header-brand .tile').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(255, 255, 255)');
 await page.reload({waitUntil:'domcontentloaded'});
 assert.equal(await page.locator('html').getAttribute('data-theme'),theme);
 if(theme==='light' && width<=720) assert.equal(await page.locator('.team-quote').evaluate(el=>getComputedStyle(el).color),'rgb(12, 20, 34)');
 await page.evaluate(()=>window.scrollTo(0,0));
 const sizes=await page.locator('.hero-actions .btn').evaluateAll(els=>els.map(el=>({w:el.getBoundingClientRect().width,h:el.getBoundingClientRect().height})));
 assert.equal(sizes[0].w,sizes[1].w);assert.equal(sizes[0].h,sizes[1].h);
 if(width<1200) await page.touchscreen.tap(200,180); else await page.mouse.move(200,180);
 await page.waitForFunction(()=>document.querySelector('.cell[data-on="1"]'));
 await page.locator('.hero-actions .btn--ghost').hover();
 await page.waitForFunction(light=>getComputedStyle(document.querySelector('.hero-actions .btn--ghost')).backgroundColor===(light?'rgb(213, 230, 255)':'rgb(18, 61, 113)'),theme==='light');
 assert.equal(await page.locator('.hero-actions .btn--ghost').evaluate(el=>getComputedStyle(el).backgroundColor),theme==='light'?'rgb(213, 230, 255)':'rgb(18, 61, 113)');
 await page.locator('.cta-secondary').hover();
 await page.waitForFunction(light=>getComputedStyle(document.querySelector('.cta-secondary')).backgroundColor===(light?'rgb(213, 230, 255)':'rgb(18, 61, 113)'),theme==='light');
 await page.evaluate(()=>window.scrollTo(0,0));
 for(const lang of ['uk','ru','en','it']) {
  await page.locator('.language-trigger').click();
  assert.equal(await page.locator('select').count(),0);
  assert.equal(await page.locator('.chevron').textContent(),'');
  const bounds=await page.locator('.language-options').boundingBox();assert.ok(bounds.x>=0&&bounds.x+bounds.width<=width+1);
  assert.equal(await page.locator('.language-trigger').evaluate(el=>getComputedStyle(el).outlineStyle),'none');
  await page.locator(`[data-language="${lang}"]`).click();
  assert.equal(await page.locator('html').getAttribute('lang'),lang);
  assert.equal(await page.locator('.language-options').count(),0);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  const overflow=await page.locator('.header-inner').evaluate(el=>el.scrollWidth>el.clientWidth);assert.equal(overflow,false);
 }
 assert.ok(await page.locator('.cell-grid').evaluate(el=>el.getBoundingClientRect().right>=innerWidth));
 if(theme==='light' && (width===440||width===1440)) { fs.mkdirSync('test-results',{recursive:true}); await page.screenshot({path:`test-results/${engine}-${width}-light-v4.png`,fullPage:false}); }
 }
 if(width>=1200) {
 assert.equal(await page.locator('.header-brand').isVisible(),false);
 assert.equal(await page.locator('.footer').isVisible(),false);
 assert.equal(await page.locator('.landing-header').evaluate(el=>getComputedStyle(el).backgroundColor),'rgba(0, 0, 0, 0)');
 await page.locator('#mission').evaluate(el=>el.scrollIntoView());
 assert.equal(await page.locator('.rail').evaluate(el=>getComputedStyle(el).backgroundColor),'rgba(0, 0, 0, 0)');
}
await page.emulateMedia({reducedMotion:'no-preference'});
assert.equal(await page.locator('.hero-claim').evaluate(el=>getComputedStyle(el).animationName),'claimFlow');
await page.emulateMedia({reducedMotion:'reduce'});
await page.locator('.language-trigger').focus();
 await page.keyboard.press('ArrowDown');
 assert.equal(await page.evaluate(()=>document.activeElement.getAttribute('role')),'menuitemradio');
 await page.keyboard.press('Escape');
 assert.equal(await page.locator('.language-options').count(),0);
 if(width<1200) {
  await page.locator('.burger').click();assert.equal(await page.locator('#mobile-navigation a').count(),7);assert.equal(await page.locator('.nav-number').count(),0);
  assert.equal(await page.locator('.rail').isVisible(),false);
  await page.locator('#mobile-navigation a[href="#mission"]').click();
  assert.equal(await page.locator('#mobile-navigation').count(),0);
  await page.waitForFunction(()=>Math.abs(document.querySelector('#mission').getBoundingClientRect().top-84)<3);
  assert.equal(await page.locator('.landing-header').evaluate(el=>Math.round(el.getBoundingClientRect().top)),0);
  await page.locator('.burger').click();await page.locator('.language-trigger').click();assert.equal(await page.locator('#mobile-navigation').count(),0);
  await page.keyboard.press('Escape');
 }
 await page.evaluate(()=>window.scrollTo(0,0));
 if(width===390||width===1440){
  fs.mkdirSync('test-results',{recursive:true});
  await page.locator('.language-trigger').click();
  await page.screenshot({path:`test-results/${engine}-${width}-languages-v4.png`});
  await page.keyboard.press('Escape');
  if(width===390){await page.locator('.burger').click();await page.screenshot({path:`test-results/${engine}-${width}-navigation-v4.png`});await page.keyboard.press('Escape');}
 }
 await page.reload({waitUntil:'domcontentloaded'});assert.equal(await page.locator('html').getAttribute('lang'),'it');
 results.push({width,passed:true});await context.close();
 }
 await browser.close();server.close();console.log(JSON.stringify({engine,results,languages:4,themes:2},null,2));

})().catch(e=>{console.error(e);process.exit(1)});
