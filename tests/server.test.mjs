import test from 'node:test';
import assert from 'node:assert';
import http from 'node:http';
import { spawn } from 'node:child_process';

test('server.js starts up and serves index.html and static assets', async (t) => {
  const TEST_PORT = 3999;
  const child = spawn(process.execPath, ['server.js'], {
    env: { ...process.env, PORT: String(TEST_PORT) },
    stdio: 'pipe'
  });

  t.after(() => {
    child.kill();
  });

  // Wait for server to listen
  await new Promise((resolve) => {
    child.stdout.on('data', (d) => {
      if (d.toString().includes('FinBrilliant server running')) {
        resolve();
      }
    });
  });

  // Test root GET / -> 200 text/html
  const htmlRes = await new Promise((resolve, reject) => {
    http.get(`http://localhost:${TEST_PORT}/`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });

  assert.strictEqual(htmlRes.status, 200);
  assert.ok(htmlRes.headers['content-type'].includes('text/html'));
  assert.ok(htmlRes.body.includes('FinBrilliant'));

  // Test static JS asset GET /src/app.js -> 200 application/javascript
  const jsRes = await new Promise((resolve, reject) => {
    http.get(`http://localhost:${TEST_PORT}/src/app.js`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });

  assert.strictEqual(jsRes.status, 200);
  assert.ok(jsRes.headers['content-type'].includes('javascript'));
  assert.ok(jsRes.body.includes('class App'));

  // Test SPA fallback routing for /grill-me and /boost -> 200 text/html
  const spaRes = await new Promise((resolve, reject) => {
    http.get(`http://localhost:${TEST_PORT}/grill-me`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });

  assert.strictEqual(spaRes.status, 200);
  assert.ok(spaRes.headers['content-type'].includes('text/html'));
  assert.ok(spaRes.body.includes('FinBrilliant'));
});

