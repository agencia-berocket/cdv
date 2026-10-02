const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const {SOURCE}=require('../lib/cdv-data.cjs');
const baseline=require('./cdv-original-layout.json');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
test('identidade visual: CSS das quatro páginas permanece idêntico ao original',()=>{
 for(const [file,expected] of Object.entries(baseline)){
  if(file==='anamnese')continue;
  const html=fs.readFileSync(path.join(SOURCE,file),'utf8');
  const style=[...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)].map(x=>x[1]).join('');
  assert.equal(hash(style),expected,file);
  assert(!html.includes('css/portal.css'),'não reintroduzir o redesign');
 }
});
test('Anamnese preserva integralmente os campos, conteúdo, ordem e botões originais',()=>{
 const html=fs.readFileSync(path.join(SOURCE,'Google_Ads/index.html'),'utf8');
 const section=html.slice(html.indexOf('    <div id="tab-conteudo-anamnese"'),html.indexOf('  </main>'));
 assert.equal(hash(section),baseline.anamnese);
});
