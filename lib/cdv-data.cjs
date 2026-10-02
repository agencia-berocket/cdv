'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const ROOT = path.resolve(__dirname, '..');
// macOS e Git/Linux podem representar o acento com normalizações Unicode distintas (NFC vs NFD).
const clientsDir = path.join(ROOT, 'Clientes');
let SOURCE = null;
if (fs.existsSync(clientsDir)) {
  const clientFolder = fs.readdirSync(clientsDir).find(name => {
    const norm = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    return norm.includes('casa') && norm.includes('video');
  });
  if (clientFolder) SOURCE = path.join(clientsDir, clientFolder, 'Mkt');
}
if (!SOURCE || !fs.existsSync(SOURCE)) {
  if (fs.existsSync(path.join(ROOT, 'public', 'mkt'))) SOURCE = path.join(ROOT, 'public', 'mkt');
  else if (fs.existsSync(path.join(ROOT, 'mkt'))) SOURCE = path.join(ROOT, 'mkt');
  else if (fs.existsSync(path.join(ROOT, 'public'))) SOURCE = path.join(ROOT, 'public');
  else throw new Error('Pasta fonte da Casa de Vídeo não encontrada.');
}
const TTL = { ga4: 300000, realtime: 60000, gsc: 3600000, ads: 900000, geo: 60000, cwv: 86400000 };
class DataError extends Error {
  constructor(code, message) { super(message); this.code = code; }
}
const missing = message => { throw new DataError('not_configured', message); };
const num = value => Number(value || 0);
const ratio = (a, b) => b > 0 ? a / b : null;
function today(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}
function shift(date, days) { return new Date(Date.parse(date + 'T12:00:00Z') + days * 86400000).toISOString().slice(0, 10); }
function rangeFor(query = {}, now = new Date()) {
  const end = today(now);
  let startDate, endDate = end;
  const period = query.period || '7d';
  if (['7d', '14d', '30d'].includes(period)) startDate = shift(end, 1 - parseInt(period));
  else if (period === 'month') startDate = end.slice(0, 7) + '-01';
  else if (period === 'previous') { endDate = shift(end.slice(0, 7) + '-01', -1); startDate = endDate.slice(0, 7) + '-01'; }
  else if (period === 'custom') { startDate = query.start; endDate = query.end; }
  else throw new DataError('invalid_range', 'Período inválido.');
  const valid = d => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d) && Number.isFinite(Date.parse(d)) && new Date(d).toISOString().slice(0, 10) === d;
  if (!valid(startDate) || !valid(endDate) || startDate > endDate || endDate > end || Date.parse(endDate) - Date.parse(startDate) > 365 * 86400000) throw new DataError('invalid_range', 'Informe datas válidas, sem datas futuras, em um intervalo de até 366 dias.');
  return { startDate, endDate };
}
function validateGeo(input) {
  if (!Array.isArray(input.rounds)) throw new DataError('invalid_data', 'Arquivo GEO sem rodadas.');
  const ids = new Set();
  return input.rounds.map(round => {
    if (!round.id || ids.has(round.id) || !Number.isFinite(Date.parse(round.measuredAt)) || Date.parse(round.measuredAt) > Date.now() || !Array.isArray(round.prompts) || !round.prompts.length) throw new DataError('invalid_data', 'Rodada GEO inválida ou sem evidências.');
    ids.add(round.id);
    const prompts = new Set();
    for (const p of round.prompts) {
      if (!p.id || !p.provider || !p.model || !p.prompt || !p.response || !p.evidence || typeof p.cited !== 'boolean' || prompts.has(`${p.provider}:${p.id}`)) throw new DataError('invalid_data', 'Cada resposta GEO exige provedor, modelo, prompt, resposta, evidência e resultado.');
      prompts.add(`${p.provider}:${p.id}`);
    }
    const providers = [...new Set(round.prompts.map(p => p.provider))].map(provider => {
      const rows = round.prompts.filter(p => p.provider === provider);
      return { provider, tested: rows.length, cited: rows.filter(p => p.cited).length, share: rows.filter(p => p.cited).length / rows.length };
    });
    let score = null;
    if (round.pillars?.length) {
      if (!round.methodology || round.pillars.some(p => !p.evidence || !Number.isFinite(p.points) || !Number.isFinite(p.max) || p.max <= 0 || p.points < 0 || p.points > p.max)) throw new DataError('invalid_data', 'Score GEO exige metodologia e pilares comprovados.');
      score = 100 * round.pillars.reduce((s, p) => s + p.points, 0) / round.pillars.reduce((s, p) => s + p.max, 0);
    }
    return { id: round.id, measuredAt: round.measuredAt, score, tested: round.prompts.length, share: round.prompts.filter(p => p.cited).length / round.prompts.length, providers, prompts: round.prompts, methodology: round.methodology || null };
  }).sort((a, b) => a.measuredAt.localeCompare(b.measuredAt));
}
function createDataService({ env = process.env, fetchImpl = fetch, now = () => new Date(), runtimeDir = path.join(ROOT, '.runtime', 'cdv'), persist = true, collectors = {} } = {}) {
  runtimeDir = env.CDV_DATA_DIR || runtimeDir;
  const cache = new Map(), pending = new Map(), tokens = new Map();
  let timer;
  const cacheFile = path.join(runtimeDir, 'snapshot.json');
  if (persist) {
    try { const saved = JSON.parse(fs.readFileSync(cacheFile)); for (const [key, value] of Object.entries(saved)) if (value?.attemptedAt) cache.set(key, value); } catch (e) { if (e.code !== 'ENOENT') console.warn('CDV: cache anterior inválido; nova coleta será feita.'); }
  }
  async function request(url, options = {}) {
    let res;
    try { res = await fetchImpl(url, { ...options, signal: AbortSignal.timeout(20000) }); } catch { throw new DataError('network_error', 'Não foi possível consultar a fonte. A última coleta válida foi preservada.'); }
    const body = await res.json().catch(() => { if (res.ok) throw new DataError('invalid_data', 'A fonte não retornou JSON válido. A última coleta foi preservada.'); return {}; });
    if (!res.ok) {
      const code = res.status === 401 || res.status === 403 ? 'permission_denied' : res.status === 429 ? 'quota_exceeded' : 'upstream_error';
      const reason = body.error?.details?.find(d => typeof d.reason === 'string')?.reason;
      const advice = reason === 'SERVICE_DISABLED' ? 'Habilite a API correspondente no projeto Google Cloud da conta de serviço.' : reason === 'ACCESS_TOKEN_SCOPE_INSUFFICIENT' ? 'A autorização não possui o escopo de leitura exigido pela API.' : 'Verifique permissões, configuração e quota.';
      throw new DataError(code, `A fonte retornou HTTP ${res.status}. ${advice}`);
    }
    return body;
  }
  function account(scope) {
    const separateGsc = scope === 'https://www.googleapis.com/auth/webmasters.readonly' && (env.CDV_GSC_CREDENTIALS || env.CDV_GSC_SERVICE_ACCOUNT_JSON);
    const file = separateGsc ? env.CDV_GSC_CREDENTIALS : env.CDV_GOOGLE_CREDENTIALS || path.join(ROOT, '.private', 'cdv', 'google-service-account.json');
    const json = separateGsc ? env.CDV_GSC_SERVICE_ACCOUNT_JSON : env.CDV_GOOGLE_SERVICE_ACCOUNT_JSON;
    try { return JSON.parse(json || fs.readFileSync(file, 'utf8')); }
    catch { return missing('Configure a conta de serviço Google no servidor.'); }
  }
  const pendingTokens = new Map();
  async function token(scope) {
    const cached = tokens.get(scope);
    if (cached && cached.expires > Date.now()) return cached.value;
    if (pendingTokens.has(scope)) return pendingTokens.get(scope);
    const work = (async () => {
      const key = account(scope);
      if (!key.client_email || !key.private_key) return missing('Conta de serviço incompleta.');
      const iat = Math.floor(Date.now() / 1000);
      const enc = o => Buffer.from(JSON.stringify(o)).toString('base64url');
      const unsigned = `${enc({ alg: 'RS256', typ: 'JWT' })}.${enc({ iss: key.client_email, scope, aud: 'https://oauth2.googleapis.com/token', iat, exp: iat + 3600 })}`;
      const assertion = `${unsigned}.${crypto.sign('RSA-SHA256', Buffer.from(unsigned), key.private_key).toString('base64url')}`;
      const result = await request('https://oauth2.googleapis.com/token', { method: 'POST', body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion }) });
      if (!result.access_token) throw new DataError('invalid_data', 'Google não retornou um token válido.');
      tokens.set(scope, { value: result.access_token, expires: Date.now() + 3300000 });
      return result.access_token;
    })();
    pendingTokens.set(scope, work);
    try { return await work; } finally { pendingTokens.delete(scope); }
  }
  async function google(url, body, scope = 'https://www.googleapis.com/auth/analytics.readonly') {
    return request(url, { method: 'POST', headers: { Authorization: `Bearer ${await token(scope)}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  }
  function property() { const id = env.CDV_GA4_PROPERTY_ID || '555545561'; if (!/^\d+$/.test(id)) return missing('Use o ID numérico da propriedade GA4, não o ID G- da tag.'); return id; }
  const rows = data => (data.rows || []).map(r => ({ keys: (r.dimensionValues || []).map(d => d.value), values: r.metricValues.map(m => num(m.value)) }));
  async function ga4(range) {
    const url = `https://analyticsdata.googleapis.com/v1beta/properties/${property()}:runReport`;
    const report = (metrics, dimensions = [], extra = {}) => google(url, { dateRanges: [range], metrics: metrics.map(name => ({ name })), dimensions: dimensions.map(name => ({ name })), ...extra });
    const metrics = ['activeUsers', 'sessions', 'eventCount', 'engagementRate', 'averageSessionDuration'];
    const [summary, daily, channels] = await Promise.all([report(metrics), report(['sessions', 'activeUsers'], ['date'], { orderBys: [{ dimension: { dimensionName: 'date' } }] }), report(['sessions'], ['sessionDefaultChannelGroup'])]);
    const values = rows(summary)[0]?.values || metrics.map(() => 0);
    return { users: values[0], sessions: values[1], events: values[2], engagementRate: values[3], averageSessionDuration: values[4], timezone: summary.metadata?.timeZone || null,
      daily: rows(daily).map(r => ({ date: r.keys[0], sessions: r.values[0], users: r.values[1] })), channels: rows(channels).map(r => ({ channel: r.keys[0], sessions: r.values[0] })) };
  }
  async function realtime() {
    const result = await google(`https://analyticsdata.googleapis.com/v1beta/properties/${property()}:runRealtimeReport`, { metrics: [{ name: 'activeUsers' }], minuteRanges: [{ startMinutesAgo: 29, endMinutesAgo: 0 }] });
    return { activeUsers: rows(result)[0]?.values[0] || 0, windowMinutes: 30 };
  }
  async function gsc(range) {
    let site = env.CDV_GSC_SITE_URL;
    if (!site) {
      const sites = await request('https://www.googleapis.com/webmasters/v3/sites', { headers: { Authorization: `Bearer ${await token('https://www.googleapis.com/auth/webmasters.readonly')}` } });
      const candidates = ['sc-domain:casadevideo.com.br', 'https://casadevideo.com.br/', 'https://www.casadevideo.com.br/'];
      site = candidates.find(url => (sites.siteEntry || []).some(entry => entry.siteUrl === url && entry.permissionLevel !== 'siteUnverifiedUser'));
      if (!site) return missing('A conta de serviço não tem uma propriedade Casa de Vídeo acessível no Search Console. Conceda acesso ou configure a propriedade exata.');
    }
    const maxEnd = shift(today(now()), -3);
    const gscRange = { ...range, endDate: range.endDate > maxEnd ? maxEnd : range.endDate };
    if (gscRange.startDate > gscRange.endDate) gscRange.startDate = gscRange.endDate;
    const query = dimensions => google(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`, { ...gscRange, dimensions, dataState: 'final', type: 'web', rowLimit: 25000 }, 'https://www.googleapis.com/auth/webmasters.readonly');
    const [summary, daily, queries] = await Promise.all([query([]), query(['date']), query(['query'])]);
    const total = summary.rows?.[0];
    return { property: site, clicks: total?.clicks ?? 0, impressions: total?.impressions ?? 0, ctr: total?.ctr ?? null, position: total?.position ?? null, daily: (daily.rows || []).map(r => ({ date: r.keys[0], clicks: r.clicks, impressions: r.impressions })), queries: (queries.rows || []).map(r => ({ query: r.keys[0], clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position })), lastDataDate: daily.rows?.at(-1)?.keys[0] || null, queryCoverage: 'Principais consultas retornadas pelo Google; consultas anonimizadas e limites da API podem reduzir a cobertura.' };
  }
  async function ads(range) {
    for (const name of ['CDV_ADS_CUSTOMER_ID', 'CDV_ADS_CLIENT_ID', 'CDV_ADS_CLIENT_SECRET', 'CDV_ADS_REFRESH_TOKEN']) if (!env[name]) return missing('Configure Customer ID e OAuth do Google Ads no servidor.');
    const customer = env.CDV_ADS_CUSTOMER_ID.replace(/-/g, '');
    if (!/^\d{10}$/.test(customer)) return missing('Customer ID Google Ads deve ter dez dígitos; não use a tag AW-.');
    let auth = tokens.get('ads');
    if (!auth || auth.expires <= Date.now()) {
      const result = await request('https://oauth2.googleapis.com/token', { method: 'POST', body: new URLSearchParams({ grant_type: 'refresh_token', client_id: env.CDV_ADS_CLIENT_ID, client_secret: env.CDV_ADS_CLIENT_SECRET, refresh_token: env.CDV_ADS_REFRESH_TOKEN }) });
      if (!result.access_token) throw new DataError('invalid_data', 'OAuth Google Ads sem token.');
      auth = { value: result.access_token, expires: Date.now() + 3300000 }; tokens.set('ads', auth);
    }
    const headers = { Authorization: `Bearer ${auth.value}`, 'Content-Type': 'application/json' };
    if (env.CDV_ADS_DEVELOPER_TOKEN) headers['developer-token'] = env.CDV_ADS_DEVELOPER_TOKEN;
    if (env.CDV_ADS_LOGIN_CUSTOMER_ID) headers['login-customer-id'] = env.CDV_ADS_LOGIN_CUSTOMER_ID.replace(/-/g, '');
    const version = env.CDV_ADS_API_VERSION || 'v23';
    if (!/^v\d+$/.test(version)) return missing('Versão da API Google Ads inválida.');
    const result = await request(`https://googleads.googleapis.com/${version}/customers/${customer}/googleAds:searchStream`, { method: 'POST', headers, body: JSON.stringify({ query: `SELECT customer.currency_code, customer.time_zone, campaign.id, campaign.name, campaign.status, campaign.advertising_channel_type, segments.date, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions, metrics.conversions_value FROM campaign WHERE segments.date BETWEEN '${range.startDate}' AND '${range.endDate}'` }) });
    if (!Array.isArray(result)) throw new DataError('invalid_data', 'Resposta de campanhas inválida.');
    const campaigns = new Map(), days = new Map();
    const total = { cost: 0, clicks: 0, impressions: 0, conversions: 0, conversionValue: 0 };
    let currency = null, timezone = null;
    for (const row of result.flatMap(batch => batch.results || [])) {
      currency = row.customer.currencyCode; timezone = row.customer.timeZone;
      const c = row.campaign, m = row.metrics;
      const value = { cost: num(m.costMicros) / 1e6, clicks: num(m.clicks), impressions: num(m.impressions), conversions: num(m.conversions), conversionValue: num(m.conversionsValue) };
      if (!campaigns.has(c.id)) campaigns.set(c.id, { id: c.id, name: c.name, status: c.status, type: c.advertisingChannelType, cost: 0, clicks: 0, impressions: 0, conversions: 0, conversionValue: 0 });
      if (!days.has(row.segments.date)) days.set(row.segments.date, { date: row.segments.date, cost: 0, clicks: 0, impressions: 0, conversions: 0, conversionValue: 0 });
      for (const key of Object.keys(value)) { total[key] += value[key]; campaigns.get(c.id)[key] += value[key]; days.get(row.segments.date)[key] += value[key]; }
    }
    const derived = r => ({ ...r, ctr: ratio(r.clicks, r.impressions), cpc: ratio(r.cost, r.clicks), costPerConversion: ratio(r.cost, r.conversions), conversionRate: ratio(r.conversions, r.clicks), roas: ratio(r.conversionValue, r.cost) });
    return { ...derived(total), currency, timezone, campaigns: [...campaigns.values()].map(derived), daily: [...days.values()].sort((a,b) => a.date.localeCompare(b.date)), conversionNote: 'Conversões atribuídas pelo Google Ads; não equivalem automaticamente a leads qualificados. Valores podem ser fracionários.' };
  }
  async function geo() {
    const file = env.CDV_GEO_ROUNDS_FILE || path.join(SOURCE, 'GEO', 'rodadas_verificadas.json');
    const rounds = validateGeo(JSON.parse(fs.readFileSync(file, 'utf8')));
    if (!rounds.length) return missing('Nenhuma rodada GEO com evidências registrada.');
    return { latest: rounds.at(-1), history: rounds.map(({ id, measuredAt, score, share, tested }) => ({ id, measuredAt, score, share, tested })) };
  }
  async function cwv() {
    if (!env.CDV_CRUX_API_KEY) return missing('Configure a chave da Chrome UX Report API para métricas de campo.');
    const data = await request(`https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=${encodeURIComponent(env.CDV_CRUX_API_KEY)}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ origin: 'https://casadevideo.com.br', formFactor: 'PHONE', metrics: ['largest_contentful_paint', 'interaction_to_next_paint', 'cumulative_layout_shift'] }) });
    if (!data.record?.metrics) throw new DataError('invalid_data', 'CrUX não retornou métricas para esta origem.');
    return { metrics: data.record.metrics, collectionPeriod: data.record.collectionPeriod, formFactor: 'PHONE', origin: 'https://casadevideo.com.br' };
  }
  const sources = { ga4, realtime, gsc, ads, geo, cwv, ...collectors };
  function save(key, entry) {
    cache.set(key, entry);
    while (cache.size > 160) cache.delete(cache.keys().next().value);
    if (!persist) return;
    try {
      fs.mkdirSync(runtimeDir, { recursive: true, mode: 0o700 });
      fs.writeFileSync(cacheFile + '.tmp', JSON.stringify(Object.fromEntries(cache)), { mode: 0o600 }); fs.renameSync(cacheFile + '.tmp', cacheFile);
      fs.appendFileSync(path.join(runtimeDir, `history-${now().toISOString().slice(0,10)}.jsonl`), JSON.stringify({ key, ...entry }) + '\n', { mode: 0o600 });
    } catch { console.error('CDV: falha ao persistir cache; verifique o volume de dados.'); }
  }
  async function collect(name, range) {
    const isGlobal = ['realtime', 'geo', 'cwv'].includes(name);
    const key = isGlobal ? name : `${name}:${range.startDate}:${range.endDate}`;
    const old = cache.get(key);
    if (pending.has(key)) return pending.get(key);
    const age = now().getTime() - Date.parse(old?.attemptedAt || 0);
    if (old && age < TTL[name]) return old;
    const work = (async () => {
      let entry;
      const attemptedAt = now().toISOString();
      try { entry = { source: name, range: isGlobal ? null : range, status: 'ok', attemptedAt, updatedAt: attemptedAt, data: await sources[name](range), error: null }; }
      catch (error) { entry = { source: name, range: isGlobal ? null : range, status: old?.data ? 'stale' : error.code === 'not_configured' ? 'not_configured' : 'error', attemptedAt, updatedAt: old?.updatedAt || null, data: old?.data || null, error: { code: error.code || 'invalid_data', message: error instanceof DataError ? error.message : 'Dados da fonte inválidos. Verifique a configuração e as evidências.' } }; }
      if (entry.status === 'ok') entry.updatedAt = now().toISOString();
      save(key, entry); return entry;
    })();
    pending.set(key, work);
    try { return await work; } finally { pending.delete(key); }
  }
  async function snapshot(range = rangeFor({}, now())) {
    if (!range?.startDate || !range?.endDate) range = rangeFor(range, now());
    const results = await Promise.all(Object.keys(sources).map(async name => [name, await collect(name, range)]));
    return { version: 1, generatedAt: now().toISOString(), range, reportingTimezone: 'America/Sao_Paulo', refreshSeconds: 60, sources: Object.fromEntries(results) };
  }
  function start() {
    if (timer) return;
    const refresh = () => snapshot(rangeFor({}, now())).catch(() => console.error('CDV: ciclo de coleta interrompido.'));
    refresh(); timer = setInterval(refresh, 60000); timer.unref();
  }
  function stop() { clearInterval(timer); timer = null; }
  return { snapshot, collect, start, stop };
}
function mountPortal(app, express, options = {}) {
  app.set('trust proxy', true);
  const service = createDataService(options);
  app.get('/api/cdv/metrics', async (req, res) => {
    res.set('Cache-Control', 'no-store');
    try { res.json(await service.snapshot(rangeFor(req.query))); }
    catch (e) { res.status(e.code === 'invalid_range' ? 400 : 503).json({ error: e.code === 'invalid_range' ? e.message : 'Coleta temporariamente indisponível.' }); }
  });
  // Somente artefatos aprovados pelo build são servidos; nunca a pasta fonte ou credenciais.
  const publicDir = path.join(ROOT, 'public', 'mkt');
  const staticMiddleware = express.static(publicDir, { dotfiles: 'deny', etag: false, maxAge: 0 });
  app.use('/mkt', staticMiddleware);
  app.use(staticMiddleware);
  service.start(); return service;
}
module.exports = { createDataService, rangeFor, validateGeo, ratio, DataError, mountPortal, SOURCE };
