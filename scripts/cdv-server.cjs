const path = require('node:path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local'), override: true, quiet: true });
const express = require('express');
const { mountPortal } = require('../lib/cdv-data.cjs');
const app = express();
const service = mountPortal(app, express);
app.get('/', (_req, res) => res.redirect('/mkt/'));
const server = app.listen(Number(process.env.CDV_PORT || 3100), '127.0.0.1', () => console.log('Portal CDV: http://localhost:3100/mkt/'));
for (const signal of ['SIGTERM', 'SIGINT']) process.on(signal, () => { service.stop(); server.close(); });
