// Uma única origem; lista explícita de arquivos públicos. Nenhum segredo ou script de coleta é copiado.
const fs = require('node:fs');
const path = require('node:path');
const { SOURCE, createDataService } = require('../lib/cdv-data.cjs');
const ROOT = path.resolve(__dirname, '..');

const files = [
  'index.html', 'login.html', 'Hub_Central_Marketing.html', 'js/session-guard.js', 'js/portal.js', 'js/hub-ui.js', 'js/SEO-ui.js', 'js/GEO-ui.js', 'js/Google_Ads-ui.js',
  'data/operacao.json', 'PLANO_IMPLANTACAO_DADOS_REAIS.md', 'INSTRUCOES_TI_CASA_DE_VIDEO.md',
  'GEO/Relatorio_GEO_Auditoria_23092026.html', 'GEO/Relatorio_GEO_Auditoria_https___casadevideo_com_br___no_rag_-_small_.html',
  'SEO/index.html', 'SEO/Dashboard_SEO.html', 'SEO/Passo_a_Passo_SEO.html', 'SEO/schema_graph.json', 'SEO/checklist_onpage.json', 'SEO/plano_silos.json', 'SEO/palavras_chave_alvo.json',
  'GEO/index.html', 'GEO/Dashboard_GEO.html', 'GEO/Passo_a_Passo_GEO.html', 'GEO/llms.txt', 'GEO/schemas_json_ld.json', 'GEO/relatorio_citabilidade.json',
  'Google_Ads/index.html', 'Google_Ads/Dashboard_Google_Ads.html', 'Google_Ads/Passo_a_Passo_Google_Ads.html', 'Google_Ads/termos_negativos.txt', 'Google_Ads/estrutura_campanhas_stag.json', 'Google_Ads/plano_gtm_tagging.json',
];

async function build() {
  let snapshotData = null;
  try {
    const service = createDataService();
    snapshotData = await service.snapshot();
    console.log('Snapshot de dados reais gerado com sucesso para o build.');
  } catch (err) {
    console.warn('Aviso: Não foi possível gerar snapshot dinâmico no build:', err.message);
  }

  const folders = ['.', 'public', 'public/mkt', 'mkt', 'dist/mkt', 'dist'];
  for (const folder of folders) {
    const dest = path.join(ROOT, folder);
    if (folder !== 'dist' && folder !== 'public' && folder !== '.') fs.rmSync(dest, { recursive: true, force: true });
    for (const file of files) {
      if (folder === '.' && file === 'index.html') continue; // Não sobrescrever o index.html da raiz
      const output = path.join(dest, file);
      fs.mkdirSync(path.dirname(output), { recursive: true });
      fs.copyFileSync(path.join(SOURCE, file), output);
    }
    if (snapshotData) {
      const snapStr = JSON.stringify(snapshotData, null, 2);
      const snapPath = path.join(dest, 'data', 'snapshot.json');
      fs.mkdirSync(path.dirname(snapPath), { recursive: true });
      fs.writeFileSync(snapPath, snapStr, 'utf8');

      const apiMetricsPath = path.join(dest, 'api', 'cdv', 'metrics');
      fs.mkdirSync(path.dirname(apiMetricsPath), { recursive: true });
      fs.writeFileSync(apiMetricsPath, snapStr, 'utf8');
    }
  }
  console.log(`Portal CDV: ${files.length} arquivos públicos e snapshot estático gerados.`);
}

if (require.main === module) {
  build().catch(err => {
    console.error('Erro na execução do build CDV:', err);
    process.exit(1);
  });
}

module.exports = { files, build };
