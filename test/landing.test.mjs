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
  assert.match(html, /id="huong-dan"/);
  assert.match(html, /<details>/);
});
test('build inserts a safe config placeholder and never hardcodes an Android store app', async () => {
  const build = await readFile(resolve(root, 'scripts/build.mjs'), 'utf8');
  assert.match(build, /LANDING_PLAY_STORE_URL/);
  assert.match(build, /validHttps/);
  assert.match(build, /LANDING_CONFIG/);
  assert.doesNotMatch(build, /readFile\([^)]*\.env/);
});

test('all landing photographic backgrounds use configured optimized asset', async () => {
  const css = await readFile(resolve(root, 'src/style.css'), 'utf8');
  const vercel = JSON.parse(await readFile(resolve(root, 'vercel.json'), 'utf8'));
  assert.doesNotMatch(css, /url\('\/reference\.png'\)/);
  assert.match(css, /_vercel\/image\?url=%2Freference\.png&w=1080&q=60/);
  assert.ok(vercel.images.sizes.includes(1080));
  assert.ok(vercel.images.qualities.includes(60));
  assert.equal(vercel.git.deploymentEnabled, false);
});
