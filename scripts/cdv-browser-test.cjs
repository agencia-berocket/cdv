const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const express = require('express');
const puppeteer = require('puppeteer-core');
const { mountPortal } = require('../lib/cdv-data.cjs');
(async () => {
  const app = express();
  const requests = [];
  app.use((req, _res, next) => { if (req.path === '/api/cdv/metrics') requests.push(req.query); next(); });
  const service = mountPortal(app, express, { persist: false, collectors: {
    ga4: async range => ({ users: 23, sessions: range.startDate === '2026-09-01' ? 88 : 39, events: 100, engagementRate: .5, averageSessionDuration: 40, timezone: 'America/Sao_Paulo', daily: [{date:'20260930',sessions:39,users:23}], channels:[{channel:'Organic Search',sessions:25},{channel:'Direct',sessions:14}] }),
    realtime: async () => ({activeUsers:0,windowMinutes:30}),
    gsc: async () => ({clicks:10,impressions:200,ctr:.05,position:5,queries:[{query:'produtora audiovisual',clicks:10,impressions:200,ctr:.05,position:5}],lastDataDate:'2026-09-30',queryCoverage:'Dados de teste'}),
    ads: async range => ({cost:range.startDate === '2026-09-01' ? 88 : 10,currency:'BRL',conversions:.5,impressions:100,clicks:2,ctr:.02,cpc:5,costPerConversion:20,roas:3,campaigns:[{name:'Campanha de teste',type:'SEARCH',status:'ENABLED',cost:10,impressions:100,clicks:2,conversions:.5,costPerConversion:20}],daily:[],timezone:'America/Sao_Paulo'}),
    geo: async () => { throw Error('Sem evidências'); }, cwv: async () => { throw Error('Sem amostra'); }
  } });
  const server = await new Promise(resolve => { const s = app.listen(0,'127.0.0.1',()=>resolve(s)); });
  let browser;
  try {
    const base = `http://127.0.0.1:${server.address().port}`;
    browser = await puppeteer.launch({ executablePath: process.env.CHROME_BIN || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
    const page = await browser.newPage(), errors=[];
    page.on('dialog', dialog => dialog.accept());
    page.on('pageerror', error => errors.push(error.message));
    const output = path.resolve('.runtime/cdv/screenshots'); fs.mkdirSync(output,{recursive:true});
    for (const [name,file] of [['hub','Hub_Central_Marketing.html'],['seo','SEO/index.html'],['geo','GEO/index.html'],['ads','Google_Ads/index.html']]) {
      await page.setViewport({width:1440,height:1000});
      await page.goto(`${base}/mkt/${file}`,{waitUntil:'networkidle0'});
      await page.waitForFunction(()=>document.getElementById('cdv-live-status')?.dataset.state === 'loaded');
      assert(await page.evaluate(()=>typeof Chart === 'function'), 'Chart.js original deve carregar');
      await page.screenshot({path:path.join(output,`${name}-desktop.png`),fullPage:true});
      await page.setViewport({width:390,height:844});
      await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
      if(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth)) console.log(await page.evaluate(()=>[...document.querySelectorAll('body *')].filter(e=>{const r=e.getBoundingClientRect();return r.right>innerWidth+2&&r.width>0;}).slice(0,12).map(e=>({tag:e.tagName,id:e.id,classes:e.className,right:e.getBoundingClientRect().right,text:e.textContent.slice(0,50)}))));
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth),false,`${name}: overflow mobile`);
      await page.screenshot({path:path.join(output,`${name}-mobile.png`),fullPage:true});
    }
    await page.click('#btn-tab-anamnese');
    await page.type('#an_nomeEmpresa',' revisão');
    const editedCompany = await page.$eval('#an_nomeEmpresa',e=>e.value);
    assert(editedCompany.includes('revisão'));
    assert.equal(await page.$$eval('#formAnamnese input[id^="an_"], #formAnamnese textarea[id^="an_"]',e=>e.length),28);
    await page.reload({waitUntil:'networkidle0'});
    assert.equal(await page.$eval('#an_nomeEmpresa',e=>e.value),editedCompany);
    assert(await page.$eval('#tab-conteudo-anamnese',e=>!e.classList.contains('hidden')));
    await page.evaluate(()=>{
      const create=URL.createObjectURL.bind(URL);
      URL.createObjectURL=blob=>{window.__downloadBlob=blob;return create(blob);};
      HTMLAnchorElement.prototype.click=function(){window.__downloadName=this.download;};
    });
    await page.evaluate(()=>baixarAnamneseMD());
    assert((await page.evaluate(()=>window.__downloadBlob.text())).includes('revisão'));
    assert((await page.evaluate(()=>window.__downloadName)).endsWith('.md'));
    await page.click('#btn-tab-dashboard');
    await page.evaluate(()=>abrirModalGoogleAds());
    assert(await page.$eval('#conteudoCampanhaModal',e=>e.textContent.includes('revisão')));
    await page.evaluate(()=>fecharModalGoogleAds());
    await page.select('#seletorPeriodo','custom');
    await page.$eval('#dataInicio',e=>e.value='2026-09-01');await page.$eval('#dataFim',e=>e.value='2026-09-03');
    await page.evaluate(()=>aplicarDataPersonalizada());
    await page.waitForFunction(()=>document.getElementById('kpiInvestimento').textContent.includes('88'));
    assert(requests.some(q=>q.start==='2026-09-01'&&q.end==='2026-09-03'));
    await page.goto(`${base}/mkt/SEO/index.html`,{waitUntil:'networkidle0'});
    await page.waitForFunction(()=>document.getElementById('ga4Sessoes').textContent==='39');
    await page.click('#btnGa4Realtime');
    await page.waitForFunction(()=>document.getElementById('ga4Usuarios').textContent==='0');
    assert.equal(await page.$eval('#ga4Sessoes',e=>e.textContent),'—');
    await page.click('#btnGa430d');
    await page.waitForFunction(()=>document.getElementById('ga4Sessoes').textContent==='39');
    await page.goto(`${base}/mkt/GEO/index.html`,{waitUntil:'networkidle0'});
    await page.click('#btn-tab-auditoria-llm');
    assert(await page.$eval('#pane-auditoria-llm',e=>e.classList.contains('active-pane')));
    await page.type('#inputBusca56Prompts','zzzz-sem-resultado');
    assert.equal(await page.$eval('#countPromptsVisiveis',e=>e.textContent),'0');
    const bad = await fetch(base+'/api/cdv/metrics?period=custom&start=2026-09-03&end=2026-09-01');assert.equal(bad.status,400);
    for(const url of ['/mkt/data/google_service_account_key.json','/mkt/scripts/conectar_apis_google_live.py','/mkt/PLANO_EXECUCAO_PRODUCAO.md']) assert.equal((await fetch(base+url)).status,404);
    assert.deepEqual(errors,[]);
    console.log('PASS: quatro páginas desktop/mobile, zero erros JS, datas reais, 28 campos e download MD originais, rascunho persistente, modal de campanhas, filtros e abas originais, APIs e artefatos privados bloqueados. Screenshots em .runtime/cdv/screenshots.');
  } finally { if(browser)await browser.close();service.stop();await new Promise(resolve=>server.close(resolve)); }
})().catch(e=>{console.error(e);process.exitCode=1;});
