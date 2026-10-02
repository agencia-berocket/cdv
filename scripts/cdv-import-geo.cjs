require('dotenv').config({ path: '.env.local', quiet: true });
const fs = require('node:fs');
const path = require('node:path');
const { validateGeo, SOURCE } = require('../lib/cdv-data.cjs');
const file = process.argv[2];
if (!file) { console.error('Uso: node scripts/cdv-import-geo.cjs /caminho/rodada.json'); process.exit(1); }
try {
  const target = process.env.CDV_GEO_ROUNDS_FILE || path.join(SOURCE, 'GEO', 'rodadas_verificadas.json');
  const current = fs.existsSync(target) ? JSON.parse(fs.readFileSync(target)) : { version: 1, rounds: [] };
  const input = JSON.parse(fs.readFileSync(file));
  const additions = input.rounds || [input];
  const combined = { version: 1, rounds: [...current.rounds, ...additions] };
  const validated = validateGeo(combined);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target + '.tmp', JSON.stringify(combined, null, 2) + '\n', { mode: 0o600 });
  fs.renameSync(target + '.tmp', target);
  console.log(`GEO: ${validated.length} rodadas verificadas. O painel atualizará na próxima consulta, em até 60 segundos.`);
} catch (e) { console.error('Não foi possível importar: ' + e.message); process.exitCode = 1; }
