const {chromium,firefox,webkit}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
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
 let options = { headless: true, timeout: 20000 };
 if (process.env.WEBKIT_EXECUTABLE) options.executablePath = process.env.WEBKIT_EXECUTABLE;
 if (process.env.CHROMIUM_EXECUTABLE) options = {...options, executablePath:process.env.CHROMIUM_EXECUTABLE, args:['--no-sandbox','--no-zygote','--single-process','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']};

 const browser = await ({chromium, firefox, webkit}[engine]).launch(options);
 const context = await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:engine !== 'firefox',reducedMotion:'reduce'});
 const page=await context.newPage();
 page.setDefaultTimeout(15000);
 const screenshots=path.join(process.cwd(),'test-results');fs.mkdirSync(screenshots,{recursive:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(testUrl,{waitUntil:'domcontentloaded'});
 await page.locator('.team-photo').evaluate(img=>img.decode());
 for(const lang of ['ru','en','it','uk']) {
  await page.locator('.language-trigger').click(); await page.locator('[data-language=\"' + lang + '\"]').click();
  assert.equal(await page.locator('html').getAttribute('lang'),lang);
  if(lang==='en'||lang==='it') assert.equal(await page.locator('main').evaluate(el => /[А-Яа-яІіЇїЄє]/.test([...el.querySelectorAll('h1,h2,h3,p,.footer-nav,.stat-caption,.level-req')].map(x=>x.textContent).join(''))), false);
 }
 await page.locator('.language-trigger').click(); await page.locator('[data-language=\"' + 'it' + '\"]').click();
 await page.reload({waitUntil:'domcontentloaded'});
 assert.equal(await page.locator('html').getAttribute('lang'),'it');
 await page.locator('.language-trigger').click(); await page.locator('[data-language=\"' + 'uk' + '\"]').click();
 await page.screenshot({path:path.join(screenshots,`${engine}-hero.png`),timeout:30000});
 await page.locator('.team-image-viewport').scrollIntoViewIfNeeded();
 await page.screenshot({path:path.join(screenshots,`${engine}-team.png`),timeout:30000});
 if(engine==='chromium') {
  const cdp=await context.newCDPSession(page);
  const box=await page.locator('.team-image-viewport').boundingBox();
  const cx=box.x+box.width/2, cy=box.y+box.height/2;
  const points=d=>[{x:cx-d,y:cy,id:0},{x:cx+d,y:cy,id:1}];
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:points(25)});
  for(const d of [35,45,55,65]) await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:points(d)});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  await page.locator('.team-reset').waitFor();
  const scale=await page.locator('.team-photo').evaluate(el=>new DOMMatrix(getComputedStyle(el).transform).a);
  assert.ok(scale>1.5,`pinch scale ${scale}`);
  assert.equal(await page.evaluate(()=>visualViewport.scale),1,'Pinch should zoom the image, not the page');
  await page.locator('.team-reset').click();
  assert.equal(await page.locator('.team-photo').evaluate(el=>new DOMMatrix(getComputedStyle(el).transform).a),1);
  await page.locator('.burger').click();
  await page.locator('#mobile-navigation a[href="#cta"]').click();
  await page.locator('.rail-item--active[href="#cta"]').waitFor({state:'attached'});
 }
 assert.deepEqual(errors,[]);
 await browser.close();server.close();console.log(JSON.stringify({engine,languageSwitch:true,persistence:true,translationCoverage:true,pinchAndBurgerNavigation:engine==='chromium'?'passed':'not run',pageErrors:errors}));

})().catch(e=>{console.error(e);process.exit(1)});
