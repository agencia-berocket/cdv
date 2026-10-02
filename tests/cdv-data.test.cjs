const { test } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { createDataService, rangeFor, validateGeo, ratio, DataError } = require('../lib/cdv-data.cjs');
const range = { startDate: '2026-09-24', endDate: '2026-09-30' };
test('datas reais: sete dias inclusivos, mês anterior, ano bissexto e validação', () => {
  const now = new Date('2026-10-02T12:00:00Z');
  assert.deepEqual(rangeFor({ period:'7d' }, now), { startDate:'2026-09-26',endDate:'2026-10-02' });
  assert.deepEqual(rangeFor({ period:'previous' }, now), { startDate:'2026-09-01',endDate:'2026-09-30' });
  assert.deepEqual(rangeFor({ period:'previous' }, new Date('2024-03-01T12:00Z')), { startDate:'2024-02-01',endDate:'2024-02-29' });
  for (const q of [{period:'custom',start:'2026-02-30',end:'2026-03-03'}, {period:'custom',start:'2026-10-03',end:'2026-10-02'}, {period:'custom',start:'2026-10-01',end:'2026-10-03'}, {period:'invalid'}]) assert.throws(() => rangeFor(q, now), /Período|datas/);
});
test('zero é preservado; denominador zero não produz CPL ou ROAS fictício', () => {
  assert.equal(ratio(0, 20), 0); assert.equal(ratio(100,0), null);
});
test('falha preserva última coleta e data; nenhum fallback sintético', async () => {
  let clock = new Date('2026-10-02T12:00:00Z'), fail = false, calls = 0;
  const service = createDataService({persist:false,now:()=>clock,collectors:{ga4:async()=>{calls++; if(fail)throw new Error('segredo não pode aparecer');return {sessions:0,users:0};}}});
  const first = await service.collect('ga4', range); assert.equal(first.status,'ok');
  await service.collect('ga4', range); assert.equal(calls,1);
  fail = true; clock = new Date('2026-10-02T12:06:00Z');
  const second = await service.collect('ga4',range);
  assert.equal(second.status,'stale'); assert.equal(second.data.sessions,0);assert.equal(second.updatedAt,first.updatedAt);assert.notEqual(second.attemptedAt,first.attemptedAt);assert(!JSON.stringify(second).includes('segredo'));
  const another = await service.collect('ga4',{startDate:'2026-09-01',endDate:'2026-09-10'});
  assert.equal(another.status,'error');assert.equal(another.data,null);
});
test('requisições concorrentes do mesmo período compartilham a consulta', async () => {
  let calls=0;const service=createDataService({persist:false,collectors:{ga4:async()=>{calls++; await new Promise(r=>setTimeout(r,10));return {sessions:1};}}});
  await Promise.all([service.collect('ga4',range),service.collect('ga4',range)]);assert.equal(calls,1);
});
test('cache sobrevive ao reinício; arquivos ficam em volume privado', async () => {
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'cdv-test-'));
  try {
    const clock=()=>new Date('2026-10-02T12:00Z');
    const one=createDataService({runtimeDir:dir,now:clock,collectors:{ga4:async()=>({sessions:9})}});
    await one.collect('ga4',range);
    const two=createDataService({runtimeDir:dir,now:clock,collectors:{ga4:async()=>{throw Error('não consultar');}}});
    assert.equal((await two.collect('ga4',range)).data.sessions,9);
    assert(fs.readdirSync(dir).some(f=>f.endsWith('.jsonl')));
  } finally { fs.rmSync(dir,{recursive:true,force:true}); }
});
const keys=crypto.generateKeyPairSync('rsa',{modulusLength:2048});
const env={CDV_GOOGLE_SERVICE_ACCOUNT_JSON:JSON.stringify({client_email:'test@example.invalid',private_key:keys.privateKey.export({type:'pkcs8',format:'pem'})}),CDV_GSC_SITE_URL:'sc-domain:example.invalid'};
const response = body => ({ok:true,status:200,json:async()=>body});
test('GA4 usa total deduplicado, sessões reais e datas escolhidas', async () => {
  const requests=[];
  const service=createDataService({env,persist:false,fetchImpl:async(url,options)=>{
    if(url.includes('oauth2'))return response({access_token:'test-token'});
    const body=JSON.parse(options.body);requests.push(body);
    if(!body.dimensions.length)return response({rows:[{metricValues:[{value:'3'},{value:'7'},{value:'20'},{value:'0.5'},{value:'45'}]}],metadata:{timeZone:'America/Sao_Paulo'}});
    return response({rows:[{dimensionValues:[{value:body.dimensions[0].name==='date'?'20260924':'Organic Search'}],metricValues:[{value:'7'},{value:'3'}]}]});
  }});
  const value=await service.collect('ga4',range);
  assert.equal(value.status,'ok');assert.equal(value.data.users,3);assert.equal(value.data.sessions,7);
  assert(requests.every(r=>JSON.stringify(r.dateRanges)==JSON.stringify([range])));
  assert.equal(value.data.engagementRate,.5);
});
test('Search Console mantém totais independentes das consultas limitadas', async()=>{
  const requests=[];
  const service=createDataService({env,persist:false,fetchImpl:async(url,options)=>{
    if(url.includes('oauth2'))return response({access_token:'test-token'});
    const body=JSON.parse(options.body);requests.push(body);
    return response({rows:body.dimensions.length?[{keys:[body.dimensions[0]==='date'?'2026-09-30':'produtora'],clicks:2,impressions:5,ctr:.4,position:2}]:[{clicks:10,impressions:100,ctr:.1,position:4}]});
  }});
  const r=await service.collect('gsc',range);assert.equal(r.data.impressions,100);assert.equal(r.data.queries[0].impressions,5);assert(requests.every(r=>r.dataState==='final'&&r.startDate===range.startDate));
});
test('Google Ads usa API própria e preserva conversões fracionárias',async()=>{
  let query;
  const adsEnv={CDV_ADS_CUSTOMER_ID:'123-456-7890',CDV_ADS_DEVELOPER_TOKEN:'test',CDV_ADS_CLIENT_ID:'test',CDV_ADS_CLIENT_SECRET:'test',CDV_ADS_REFRESH_TOKEN:'test'};
  const service=createDataService({env:adsEnv,persist:false,fetchImpl:async(url,options)=>{
    if(url.includes('oauth2'))return response({access_token:'test-token'});
    query=JSON.parse(options.body).query;assert(url.includes('/v23/customers/1234567890/'));
    return response([{results:[{customer:{currencyCode:'BRL',timeZone:'America/Sao_Paulo'},campaign:{id:'1',name:'Real',status:'ENABLED',advertisingChannelType:'SEARCH'},segments:{date:'2026-09-25'},metrics:{costMicros:'10000000',clicks:'2',impressions:'100',conversions:'0.5',conversionsValue:'30'}}]}]);
  }});
  const r=await service.collect('ads',range);assert.equal(r.data.cost,10);assert.equal(r.data.conversions,.5);assert.equal(r.data.costPerConversion,20);assert.equal(r.data.roas,3);assert(query.includes("BETWEEN '2026-09-24' AND '2026-09-30'"));
});
test('permissão negada não grava zeros nem expõe corpo do erro Google',async()=>{
  const service=createDataService({env,persist:false,fetchImpl:async()=>({ok:false,status:403,json:async()=>({private_key:'secret'})})});
  const r=await service.collect('ga4',range);assert.equal(r.status,'error');assert.equal(r.data,null);assert.equal(r.error.code,'permission_denied');assert(!JSON.stringify(r).includes('secret'));
});
test('GEO calcula score e taxa de respostas, rejeitando números sem provas',()=>{
  const prompt={id:'1',provider:'test',model:'test',prompt:'Pergunta',response:'Resposta',evidence:'ref-1',cited:true};
  const round={id:'r1',measuredAt:'2026-09-24T12:00:00Z',prompts:[prompt,{...prompt,id:'2',cited:false}],methodology:'v1',pillars:[{points:8,max:10,evidence:'ref-2'}]};
  const [r]=validateGeo({rounds:[round]});assert.equal(r.score,80);assert.equal(r.share,.5);assert.equal(r.tested,2);
  assert.throws(()=>validateGeo({rounds:[{...round,prompts:[]}]}));
  assert.throws(()=>validateGeo({rounds:[{...round,pillars:[{points:84,max:100}]}]}));
});

test('HTTP 200 com corpo inválido não vira uma medição zerada', async () => {
  const service = createDataService({env,persist:false,fetchImpl:async()=>({ok:true,status:200,json:async()=>{throw Error('invalid JSON');}})});
  const result = await service.collect('ga4',range);
  assert.equal(result.status,'error'); assert.equal(result.data,null); assert.equal(result.error.code,'invalid_data');
});

test('Search Console usa credencial própria sem substituir a identidade do GA4', async () => {
  const identities = [];
  const gscKey = JSON.parse(env.CDV_GOOGLE_SERVICE_ACCOUNT_JSON);
  gscKey.client_email = 'gsc@example.invalid';
  const service = createDataService({ env: { ...env, CDV_GSC_SERVICE_ACCOUNT_JSON: JSON.stringify(gscKey) }, persist: false, fetchImpl: async (url, options) => {
    if (url.includes('oauth2')) {
      const claim = JSON.parse(Buffer.from(options.body.get('assertion').split('.')[1], 'base64url'));
      identities.push({ email: claim.iss, scope: claim.scope });
      return response({ access_token: 'test-token' });
    }
    return response({ rows: [] });
  }});
  assert.equal((await service.collect('gsc', range)).status, 'ok');
  assert.equal((await service.collect('ga4', range)).status, 'ok');
  assert(identities.some(i => i.email === 'gsc@example.invalid' && i.scope.endsWith('/webmasters.readonly')));
  assert(identities.some(i => i.email === 'test@example.invalid' && i.scope.endsWith('/analytics.readonly')));
  assert(!identities.some(i => i.email === 'gsc@example.invalid' && i.scope.endsWith('/analytics.readonly')));
});
