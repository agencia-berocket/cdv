require('dotenv').config({ path: '.env.local', quiet: true });
const { createDataService, rangeFor } = require('../lib/cdv-data.cjs');
(async () => {
  const service = createDataService({ persist: false });
  const data = await service.snapshot(rangeFor());
  for (const [name, source] of Object.entries(data.sources)) {
    console.log(JSON.stringify({ source: name, status: source.status, updatedAt: source.updatedAt, error: source.error, metrics: name === 'ga4' && source.data ? { users: source.data.users, sessions: source.data.sessions } : name === 'realtime' ? source.data : undefined }));
  }
})();
