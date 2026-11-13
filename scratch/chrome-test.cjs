const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const delay = ms => new Promise(r => setTimeout(r, ms));

async function testWithChrome() {
  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  if (!fs.existsSync(chromePath)) {
    console.error('Chrome não encontrado em:', chromePath);
    process.exit(1);
  }

  console.log('🚀 Capturando evidências visuais no Google Chrome real...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const artifactDir = '/Users/guilhermerossi/.gemini/antigravity-ide/brain/ffaf528c-00b8-4293-9a06-8374c36bb1b3';

  // 1. Login
  await page.goto('https://cdv.berocket.com.br/login.html', { waitUntil: 'networkidle0' });
  await page.type('#usuario', 'casadevideo');
  await page.type('#senha', 'cdv2026@rocket');
  await page.click('button[type="submit"]');
  await delay(2500);

  console.log('1. Capturando Hub Central (05/10/2026)...');
  await page.screenshot({ path: path.join(artifactDir, 'chrome_live_0510_hub.png') });

  // 2. SEO
  console.log('2. Capturando Módulo SEO (05/10/2026)...');
  await page.goto('https://cdv.berocket.com.br/SEO/index.html', { waitUntil: 'networkidle0' });
  await delay(2500);
  await page.screenshot({ path: path.join(artifactDir, 'chrome_live_0510_seo.png') });

  // 3. GEO
  console.log('3. Capturando Módulo GEO (05/10/2026)...');
  await page.goto('https://cdv.berocket.com.br/GEO/index.html', { waitUntil: 'networkidle0' });
  await delay(2500);
  await page.screenshot({ path: path.join(artifactDir, 'chrome_live_0510_geo.png') });

  // 4. Ads
  console.log('4. Capturando Módulo Google Ads (05/10/2026)...');
  await page.goto('https://cdv.berocket.com.br/Google_Ads/index.html', { waitUntil: 'networkidle0' });
  await delay(2500);
  await page.screenshot({ path: path.join(artifactDir, 'chrome_live_0510_ads.png') });

  await browser.close();
  console.log('🎉 FOTOS DE EVIDÊNCIA CAPTURADAS COM SUCESSO!');
}

testWithChrome().catch(err => console.error(err));
