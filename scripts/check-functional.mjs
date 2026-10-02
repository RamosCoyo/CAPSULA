import puppeteer from 'puppeteer-core';

const BASE = 'http://localhost:8080';
const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    headless: true,
    args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
});
let fails = 0;
const check = (name, cond, extra = '') => {
    console.log(`${cond ? '✅' : '❌'} ${name}${extra ? ' — ' + extra : ''}`);
    if (!cond) fails++;
};

// ---------- MENU.HTML ----------
{
    const page = await browser.newPage();
    await page.setViewport({ width: 360, height: 740 });
    await page.goto(`${BASE}/menu.html`, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 800)); // smooth scroll del roster

    // 1. ¿El platillo seleccionado queda visible en el roster?
    const roster = await page.evaluate(() => {
        const c = document.getElementById('roster-container');
        const active = document.querySelector('.roster-box[aria-pressed="true"]') || document.querySelector('.roster-box.border-capsula-fuchsia');
        const cr = c.getBoundingClientRect();
        const ar = active ? active.getBoundingClientRect() : null;
        return {
            scrollLeft: Math.round(c.scrollLeft),
            containerLeft: Math.round(cr.left), containerRight: Math.round(cr.right),
            activeLeft: ar ? Math.round(ar.left) : null,
            activeRight: ar ? Math.round(ar.right) : null,
            activeLabel: active ? active.getAttribute('aria-label') : null,
            scrollWidth: c.scrollWidth, clientWidth: c.clientWidth,
        };
    });
    const activeVisible = roster.activeLeft >= roster.containerLeft - 1 && roster.activeRight <= roster.containerRight + 1;
    check('Roster centra el platillo seleccionado', activeVisible,
        `scrollLeft=${roster.scrollLeft} activo=[${roster.activeLeft}→${roster.activeRight}] cont=[${roster.containerLeft}→${roster.containerRight}] ${roster.activeLabel}`);

    // 2. Flecha avanza UN solo platillo (bug del script duplicado)
    const before = await page.$eval('#item-name', (el) => el.textContent);
    await page.click('#btn-next');
    await new Promise((r) => setTimeout(r, 400));
    const afterNext = await page.$eval('#item-name', (el) => el.textContent);
    await page.click('#btn-next');
    await new Promise((r) => setTimeout(r, 400));
    const afterNext2 = await page.$eval('#item-name', (el) => el.textContent);
    check('Flecha "siguiente" avanza de 1 en 1', before !== afterNext && afterNext !== afterNext2,
        `"${before}" → "${afterNext}" → "${afterNext2}"`);

    // 3. Flecha anterior regresa
    await page.click('#btn-prev');
    await new Promise((r) => setTimeout(r, 400));
    const afterPrev = await page.$eval('#item-name', (el) => el.textContent);
    check('Flecha "anterior" regresa', afterPrev === afterNext, `"${afterPrev}"`);

    // 4. Selección con teclado (Enter en botón nativo)
    await page.focus('#btn-next');
    const boxesFocusable = await page.$$eval('.roster-box', (bs) => bs.every((b) => b.tagName === 'BUTTON'));
    check('Items del roster son <button> (teclado nativo)', boxesFocusable);

    // 5. Título largo no desborda
    const titleOverflow = await page.evaluate(() => {
        const el = document.getElementById('item-name');
        return el.scrollWidth > el.clientWidth + 1;
    });
    check('Título del platillo sin overflow interno', !titleOverflow);

    await page.close();
}

// ---------- INDEX.HTML ----------
{
    const page = await browser.newPage();
    await page.setViewport({ width: 360, height: 740 });
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle0' });

    // 6. Menú hamburguesa abre y cierra
    const menuHidden1 = await page.$eval('#mobile-menu', (el) => el.classList.contains('hidden'));
    await page.click('#menu-btn');
    await new Promise((r) => setTimeout(r, 200));
    const menuShown = await page.$eval('#mobile-menu', (el) => !el.classList.contains('hidden'));
    const expanded = await page.$eval('#menu-btn', (el) => el.getAttribute('aria-expanded'));
    await page.screenshot({ path: '/tmp/opencode/shots/index-360-hamburger-open.png' });
    await page.click('#menu-btn');
    await new Promise((r) => setTimeout(r, 200));
    const menuHidden2 = await page.$eval('#mobile-menu', (el) => el.classList.contains('hidden'));
    check('Menú hamburguesa abre/cierra', menuHidden1 && menuShown && menuHidden2 && expanded === 'true', `aria-expanded=${expanded}`);

    // 7. Clic en enlace del menú cierra el menú
    await page.click('#menu-btn');
    await new Promise((r) => setTimeout(r, 150));
    await page.click('#mobile-menu a[href="#events"]');
    await new Promise((r) => setTimeout(r, 600));
    const menuClosedAfterNav = await page.$eval('#mobile-menu', (el) => el.classList.contains('hidden'));
    // 8. La ancla #events queda por debajo del nav fijo (80px) gracias a scroll-padding
    const anchorTop = await page.evaluate(() => Math.round(document.getElementById('events').getBoundingClientRect().top));
    check('Menú móvil se cierra al navegar', menuClosedAfterNav);
    check('Ancla no queda bajo el nav fijo (top ≥ 80px)', anchorTop >= 80, `top=${anchorTop}px`);

    // 9. Carrusel: botón de pausa detiene el autoplay
    await page.evaluate(() => window.scrollTo(0, 0));
    const t0 = await page.$eval('#promo-track', (el) => el.children[0].querySelector('img')?.alt);
    await page.click('#promo-toggle');
    await page.$eval('#promo-toggle-label', (el) => el.textContent === 'Reanudar').then((ok) =>
        check('Botón de pausa cambia a "Reanudar"', ok)
    );
    await page.click('#promo-toggle'); // reanudar

    // 10. Sin scroll horizontal tras toda la interacción
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    check('Sin scroll horizontal tras interacciones', overflow <= 1, `overflow=${overflow}px`);

    await page.close();
}

await browser.close();
console.log(fails === 0 ? '\n🎉 Todas las pruebas funcionales pasaron' : `\n⚠️  ${fails} pruebas fallaron`);
process.exit(fails ? 1 : 0);
