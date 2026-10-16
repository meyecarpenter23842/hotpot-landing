import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import test from 'node:test';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname, '..');
test('landing entry has Vietnamese metadata, functional CTA hooks and accessibility', async () => {
  const html = await readFile(resolve(root, 'src/index.html'), 'utf8');
  assert.match(html, /lang="vi"/);
  assert.match(html, /name="viewport"/);
  assert.match(html, /data-cta="web"/);
  assert.match(html, /data-cta="play"/);
  assert.match(html, /\/main\.js/);
});
test('build inserts a safe config placeholder and never hardcodes an Android store app', async () => {
  const build = await readFile(resolve(root, 'scripts/build.mjs'), 'utf8');
  assert.match(build, /LANDING_PLAY_STORE_URL/);
  assert.match(build, /validHttps/);
  assert.match(build, /LANDING_CONFIG/);
  assert.doesNotMatch(build, /readFile\([^)]*\.env/);
});
