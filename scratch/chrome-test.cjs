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

  console.log('🚀 Iniciando Navegador Google Chrome real...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const consoleLogs = [];
  page.on('console', msg => consoleLogs.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => consoleLogs.push(`[PAGE_ERROR] ${err.message}`));

  const artifactDir = '/Users/guilhermerossi/.gemini/antigravity-ide/brain/ffaf528c-00b8-4293-9a06-8374c36bb1b3';

  // 1. Testar Login em Navegador Real
  console.log('1. Acessando https://cdv.berocket.com.br/login.html no Chrome...');
  await page.goto('https://cdv.berocket.com.br/login.html', { waitUntil: 'networkidle0' });
  const title1 = await page.title();
  console.log('   Título da página:', title1);
  await page.screenshot({ path: path.join(artifactDir, 'chrome_test_1_login.png') });

  // Preencher formulário de Login
  console.log('2. Digitando usuário e senha corporativos...');
  await page.type('#usuario', 'casadevideo');
  await page.type('#senha', 'cdv2026@rocket');
  await page.click('button[type="submit"]');
  await delay(2000);
  console.log('   Pós-Login URL:', page.url());
  await page.screenshot({ path: path.join(artifactDir, 'chrome_test_2_hub.png') });

  // 3. Testar Página SEO
  console.log('3. Acessando Módulo SEO On-Page...');
  await page.goto('https://cdv.berocket.com.br/SEO/index.html', { waitUntil: 'networkidle0' });
  await delay(2000);
  const seoTitle = await page.title();
  console.log('   Título SEO:', seoTitle);
  const kpiImpressoes = await page.$eval('#kpiImpressoes', el => el.textContent);
  console.log('   Métrica no DOM (#kpiImpressoes):', kpiImpressoes);
  await page.screenshot({ path: path.join(artifactDir, 'chrome_test_3_seo.png') });

  // 4. Testar Página GEO
  console.log('4. Acessando Módulo GEO (Generative Engine)...');
  await page.goto('https://cdv.berocket.com.br/GEO/index.html', { waitUntil: 'networkidle0' });
  await delay(2000);
  const geoTitle = await page.title();
  console.log('   Título GEO:', geoTitle);
  const geoScore = await page.$eval('#geoCurrent', el => el.textContent);
  console.log('   Métrica no DOM (#geoCurrent):', geoScore);
  await page.screenshot({ path: path.join(artifactDir, 'chrome_test_4_geo.png') });

  // 5. Testar Página Google Ads
  console.log('5. Acessando Módulo Google Ads...');
  await page.goto('https://cdv.berocket.com.br/Google_Ads/index.html', { waitUntil: 'networkidle0' });
  await delay(2000);
  const adsTitle = await page.title();
  console.log('   Título Google Ads:', adsTitle);
  await page.screenshot({ path: path.join(artifactDir, 'chrome_test_5_ads.png') });

  console.log('\n--- LOGS DO CONSOLE DO CHROME ---');
  consoleLogs.forEach(l => console.log(l));

  await browser.close();
  console.log('\n🎉 TESTE COMPLETO NO GOOGLE CHROME REALIZADO COM SUCESSO!');
}

testWithChrome().catch(err => {
  console.error('Erro durante o teste de navegador:', err);
  process.exit(1);
});
