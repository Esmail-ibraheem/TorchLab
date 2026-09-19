// Headless render of every scene (or a subset) to output/rlhf/<scene>/NNNNNN.png.
//
// Usage:
//   node scripts/render.mjs                 # all scenes
//   node scripts/render.mjs 01-rl-loop 09-rm-loss
//
// Drives the Motion Canvas editor the same way the project's own e2e test does:
// click #render, then wait until data-rendering is cleared.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';
import {createServer} from 'vite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDir = path.join(root, 'output', 'rlhf');
const only = process.argv.slice(2);

if (only.length) {
  process.env.VITE_SCENES = only.join(',');
  for (const name of only) fs.rmSync(path.join(outputDir, name), {recursive: true, force: true});
} else {
  fs.rmSync(outputDir, {recursive: true, force: true});
}

const server = await createServer({
  root,
  configFile: path.join(root, 'vite.config.ts'),
  logLevel: 'warn',
  server: {port: 9123, strictPort: true},
});
await server.listen();
const url = `http://localhost:${server.config.server.port}/`;

const browser = await chromium.launch({headless: true});
const page = await browser.newPage({viewport: {width: 1600, height: 1000}});
const errors = [];
page.on('console', msg => {
  if (msg.type() === 'error') errors.push(msg.text());
});
page.on('pageerror', e => errors.push(String(e)));

console.log(`[render] opening ${url}${only.length ? ' scenes=' + only.join(',') : ''}`);
await page.goto(url);
await page.waitForSelector('main');
await page.waitForSelector('#render');
await page.waitForTimeout(1500); // let fonts + MathJax settle

const started = Date.now();
await page.click('#render');
await page.waitForSelector('#render[data-rendering="true"]', {timeout: 30_000});

// Poll instead of one long waitForSelector so progress is visible in the log.
let last = -1;
for (;;) {
  const rendering = await page.$('#render[data-rendering="true"]');
  const count = countFrames();
  if (count !== last) {
    process.stdout.write(`\r[render] frames written: ${count}   `);
    last = count;
  }
  if (!rendering) break;
  await page.waitForTimeout(1000);
}
process.stdout.write('\n');

await browser.close();
await server.close();

const secs = ((Date.now() - started) / 1000).toFixed(0);
const scenes = fs.existsSync(outputDir) ? fs.readdirSync(outputDir).filter(d => fs.statSync(path.join(outputDir, d)).isDirectory()) : [];
console.log(`[render] done in ${secs}s`);
for (const s of scenes) {
  const n = fs.readdirSync(path.join(outputDir, s)).filter(f => f.endsWith('.png')).length;
  console.log(`  ${s.padEnd(28)} ${n} frames  (${(n / 30).toFixed(1)}s)`);
}
if (errors.length) {
  console.log('[render] browser errors:');
  for (const e of errors) console.log('  ' + e);
}
const expected = only.length ? only : null;
const missing = expected ? expected.filter(s => !scenes.includes(s)) : [];
if (missing.length || scenes.length === 0) {
  console.error(`[render] FAILED: no frames for ${missing.length ? missing.join(', ') : 'any scene'}`);
  process.exit(1);
}

function countFrames() {
  if (!fs.existsSync(outputDir)) return 0;
  let n = 0;
  for (const d of fs.readdirSync(outputDir)) {
    const p = path.join(outputDir, d);
    if (fs.statSync(p).isDirectory()) n += fs.readdirSync(p).length;
  }
  return n;
}
