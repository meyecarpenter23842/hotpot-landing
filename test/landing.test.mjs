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

test('iPhone CTA uses familiar wording without technical PWA jargon', async () => {
  const html = await readFile(resolve(root, 'src/index.html'), 'utf8');
  assert.match(html, /<strong>Cài app trên iPhone<\/strong>/);
  assert.doesNotMatch(html, /<strong>Cài PWA<\/strong>/);
});

test('social preview is a complete public Open Graph card for the canonical landing domain', async () => {
  const html = await readFile(resolve(root, 'src/index.html'), 'utf8');
  const build = await readFile(resolve(root, 'scripts/build.mjs'), 'utf8');
  for (const field of ['og:url','og:image','og:image:width','og:image:height','twitter:card','twitter:image']) {
    assert.match(html, new RegExp('(?:property|name)="' + field + '"'));
  }
  assert.match(html, /content="https:\/\/app\.bepsi\.click\/og-sichuan-hotpot\.png"/);
  assert.match(html, /name="twitter:card" content="summary_large_image"/);
  assert.match(build, /og-sichuan-hotpot\.png/);
  const image = await readFile(resolve(root, 'Ảnh ChatGPT 21_47_59 16 thg 10, 2026.png'));
  assert.equal(image.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
});

test('downloadable QR is a real PNG image, not a visual mockup', async () => {
  const html = await readFile(resolve(root, 'src/index.html'), 'utf8');
  const image = await readFile(resolve(root, 'public/qr-app-bepsi.png'));
  assert.match(html, /href="\/qr-app-bepsi\.png"/);
  assert.equal(image.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
});

test('platform download buttons show branded vector icons and remain side by side on narrow phones', async () => {
  const html = await readFile(resolve(root, 'src/index.html'), 'utf8');
  const css = await readFile(resolve(root, 'src/style.css'), 'utf8');
  assert.match(html, /class="platform-icon play-icon"/);
  assert.match(html, /class="platform-icon apple-icon"/);
  assert.match(html, /#27C9FF/);
  assert.match(html, /#36D484/);
  assert.match(html, /#FFD54B/);
  assert.match(html, /#FF6262/);
  assert.doesNotMatch(html, /class="play-mark"|class="globe-mark"/);
  assert.match(css, /\.actions\{gap:8px;grid-template-columns:repeat\(2,minmax\(0,1fr\)\)\}/);
  assert.match(css, /@media\(max-width:340px\)[^\n]*\.actions\{grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.doesNotMatch(css, /\.actions\{grid-template-columns:1fr\}/);
  assert.match(css, /\.action:active:not\(\[aria-disabled=true\]\)/);
});

test('production workflow binds the dedicated environment secret before reading Vercel credentials', async () => {
  const workflow = await readFile(resolve(root, '.github/workflows/landing-deploy.yml'), 'utf8');
  assert.match(workflow, /jobs:\s*\n\s*release:\s*\n[\s\S]*?environment: hotpot-landing/);
  assert.match(workflow, /VERCEL_TOKEN: \$\{\{ secrets\.VERCEL_TOKEN \}\}/);
  assert.match(workflow, /github\.event\.comment\.body == '\/deploy-hotpot-landing'/);
});
