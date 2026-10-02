/**
 * Verificación de diseño responsive en viewports móviles.
 *
 * Para cada viewport comprueba:
 *  - No hay scroll horizontal global (scrollWidth > clientWidth)
 *  - Ningún elemento visible desborda el viewport
 *  - Guarda capturas en /tmp/opencode/shots para revisión visual
 *
 * Uso: npm run check:responsive   (requiere: npm start en otra terminal)
 */
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';

const BASE = process.env.URL || 'http://localhost:8080';
const SHOTS = '/tmp/opencode/shots';
const EXECUTABLE = process.env.CHROME_PATH || '/usr/bin/chromium';

const PAGES = [
    { name: 'index', url: '/' },
    { name: 'menu', url: '/menu.html' },
];

const VIEWPORTS = [
    { name: '320xs', width: 320, height: 640 },
    { name: '360', width: 360, height: 740 },
    { name: '390', width: 390, height: 844 },
    { name: '768tablet', width: 768, height: 1024 },
    { name: '1280desktop', width: 1280, height: 800 },
];

// Capturas visuales solo en los viewports móviles representativos
const SHOT_VIEWPORTS = new Set(['320xs', '360']);
const SHOT_SECTIONS = ['#main-content', '#promo', '#menu', '#events', '#location'];

fs.mkdirSync(SHOTS, { recursive: true });

const browser = await puppeteer.launch({
    executablePath: EXECUTABLE,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
});

let failures = 0;

for (const p of PAGES) {
    for (const vp of VIEWPORTS) {
        const page = await browser.newPage();
        await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 2 });
        await page.goto(BASE + p.url, { waitUntil: 'networkidle0', timeout: 30000 });
        await new Promise((r) => setTimeout(r, 400));

        const result = await page.evaluate(() => {
            const doc = document.documentElement;
            const vw = doc.clientWidth;
            const offenders = [];

            const insideClippedAncestor = (el) => {
                for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
                    const ox = getComputedStyle(a).overflowX;
                    if (ox === 'hidden' || ox === 'clip' || ox === 'auto' || ox === 'scroll') return true;
                }
                return false;
            };

            for (const el of document.querySelectorAll('body *')) {
                const cs = getComputedStyle(el);
                if (cs.position === 'absolute') continue;          // blobs decorativos
                if (cs.display === 'none' || cs.visibility === 'hidden') continue;
                if (insideClippedAncestor(el)) continue;           // carrusel/roster con overflow propio
                const r = el.getBoundingClientRect();
                if (r.width === 0 && r.height === 0) continue;
                if (r.right > vw + 1 || r.left < -1) {
                    offenders.push({
                        tag: el.tagName.toLowerCase(),
                        cls: String(el.className).slice(0, 90),
                        left: Math.round(r.left),
                        right: Math.round(r.right),
                    });
                }
            }

            return {
                scrollWidth: doc.scrollWidth,
                clientWidth: doc.clientWidth,
                overflowPx: doc.scrollWidth - doc.clientWidth,
                offenders: offenders.slice(0, 12),
            };
        });

        const pageIssues = result.offenders.length > 0;
        const globalOverflow = result.overflowPx > 1;
        const ok = !pageIssues && !globalOverflow;
        if (!ok) failures++;

        const label = `${p.name} @ ${vp.width}px`;
        console.log(
            `${ok ? '✅' : '❌'} ${label.padEnd(24)} scrollX=${result.overflowPx}px, elementos fuera=${result.offenders.length}`
        );
        if (globalOverflow) {
            console.log(`     ↳ scroll horizontal global: ${result.scrollWidth} > ${result.clientWidth}`);
        }
        for (const o of result.offenders) {
            console.log(`     ↳ <${o.tag} class="${o.cls}"> [${o.left} → ${o.right}] (vw=${vp.width})`);
        }

        // Capturas
        if (SHOT_VIEWPORTS.has(vp.name)) {
            const base = `${SHOTS}/${p.name}-${vp.width}`;
            if (p.name === 'index') {
                for (const sel of SHOT_SECTIONS) {
                    const el = await page.$(sel);
                    if (el) {
                        await el.scrollIntoView();
                        await new Promise((r) => setTimeout(r, 500));
                        await page.screenshot({ path: `${base}-${sel.replace('#', '')}.png` });
                    }
                }
            } else {
                await page.screenshot({ path: `${base}-full.png`, fullPage: true });
            }
            // Siempre: viewport inicial a tamaño completo
            await page.evaluate(() => window.scrollTo(0, 0));
            await new Promise((r) => setTimeout(r, 300));
            await page.screenshot({ path: `${base}-viewport.png` });
        }

        await page.close();
    }
}

await browser.close();

console.log(failures === 0 ? '\n🎉 Responsive OK en todos los viewports' : `\n⚠️  ${failures} combinaciones con problemas`);
process.exit(failures === 0 ? 0 : 1);
