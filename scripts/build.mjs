import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const target = resolve(root, 'dist');
const appUrl = process.env.LANDING_WEB_APP_URL || 'https://bepsi.click';
const playUrl = process.env.LANDING_PLAY_STORE_URL || '';
function validHttps(value) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password && !url.hash && !url.search;
  } catch { return false; }
}
if (!validHttps(appUrl) || !validHttps(playUrl) || !appUrl) {
  throw new Error('LANDING_WEB_APP_URL and LANDING_PLAY_STORE_URL must be valid HTTPS URLs');
}
await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });
await cp(resolve(root, 'src'), target, { recursive: true });
await cp(resolve(root, 'public'), target, { recursive: true });
const htmlPath = resolve(target, 'index.html');
let html = await readFile(htmlPath, 'utf8');
const configJson = JSON.stringify({ appUrl, playUrl }).replaceAll('<', '\\u003c');
html = html.replace('/*__LANDING_CONFIG__*/', `window.LANDING_CONFIG = ${configJson};`);
await writeFile(htmlPath, html);
console.log('Built static landing:', { appUrl, playConfigured: Boolean(playUrl) });
