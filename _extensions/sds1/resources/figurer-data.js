/* =====================================================================
   Begrebsfigurer: maskinlæring, databaser, markup og sprogmodeller
   ---------------------------------------------------------------------
   Samme regler som figurer.js og figurer-it.js. Hver figur er beskrevet
   lige over sin funktion. Tallene i figurerne regnes ud i browseren ud
   fra de værdier, figuren får som attributter.
   ===================================================================== */
(function () {
  'use strict';
  if (!window.sds1 || !window.sds1.fig) return;
  const { s, h, tal, rolig, attr, trin } = window.sds1.fig;
  const F = window.sds1.figurer;
  const liste = (boks, n, std) => attr(boks, n, std || '').split(';').map(x => x.trim()).filter(Boolean);
  const f2 = x => x.toLocaleString('da-DK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const pct = x => (x * 100).toLocaleString('da-DK', { maximumFractionDigits: 1 }) + ' %';
  const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const id = p => p + '-' + Math.random().toString(36).slice(2, 7);

  /* ============================================================ maskinlæring */

  /* Regler: klassisk programmering over for maskinlæring */
  F.regler = boks => {
    const svg = s('svg', { viewBox: '0 0 700 275', role: 'img', 'aria-label': 'Klassisk programmering: et menneske skriver reglerne, og regler plus data giver svar. Maskinlæring: data og kendte svar går ind, og en lærealgoritme finder reglerne, som kaldes en model.' });
    const b = (x, y, w, t, kl) => { const g = s('g'); g.append(s('rect', { x, y, width: w, height: 46, rx: 8, class: kl || 'kasse' }), s('text', { x: x + w / 2, y: y + 29, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 700, class: kl ? 'accent-tekst' : '' }, t)); return g; };
    const a = (x1, y, x2) => s('path', { d: `M ${x1} ${y} H ${x2} m -10 -7 l 10 7 l -10 7`, 'stroke-width': 2.5, class: 'streg' });
    const g1 = s('g'), g2 = s('g'); svg.append(g1, g2);
    g1.append(s('text', { x: 10, y: 22, 'font-size': 17, 'font-weight': 700 }, 'Klassisk programmering'), b(10, 36, 190, 'Regler (skrevet af os)', 'kasse-accent'), b(10, 68 + 20, 190, 'Data'), a(206, 80, 270), b(276, 56, 150, 'Program'), a(432, 80, 496), b(502, 56, 180, 'Svar'));
    g2.append(s('text', { x: 10, y: 158, 'font-size': 17, 'font-weight': 700 }, 'Maskinlæring'), b(10, 170, 190, 'Data'), b(10, 222, 190, 'Svar (eksempler)'), a(206, 219, 270), b(276, 196, 150, 'Lærealgoritme'), a(432, 219, 496), b(502, 196, 180, 'Regler (en model)', 'kasse-accent'));
    boks.append(svg);
    trin(boks, 2, n => { g2.style.opacity = n >= 1 ? 1 : 0.1; }, ['Lektion 1: I skrev reglen. Programmet brugte den på data og gav et svar.', 'Maskinlæring vender det om: eksempler med kendte svar går ind, og reglen kommer ud.']);
  };

  /* Cirkler: begreber, der ligger inden i hinanden.  lag="Kunstig intelligens (AI)|alt, hvor maskiner ...;Maskinlæring (ML)|..." */
  F.cirkler = boks => {
    const L = liste(boks, 'lag').map(x => x.split('|').map(y => y.trim())), n = L.length, B = 620, H = 60 + n * 56;
    const svg = s('svg', { viewBox: `0 0 ${B} ${H}`, role: 'img', 'aria-label': 'Begreberne ligger inden i hinanden: ' + L.map(l => l[0]).join(' indeholder ') + '.' });
    const G = L.map((l, i) => { const g = s('g'), x = 8 + i * 34, y = 8 + i * 44; g.append(s('rect', { x, y, width: B - 2 * x, height: H - y - 8 - i * 12, rx: 22, class: i === n - 1 ? 'kasse-accent' : 'kasse' }), s('text', { x: x + 22, y: y + 29, 'font-size': 16, 'font-weight': 700, class: i === n - 1 ? 'accent-tekst' : '' }, l[0])); svg.append(g); return g; });
    boks.append(svg);
    trin(boks, n, k => G.forEach((g, i) => (g.style.opacity = i <= k ? 1 : 0)), L.map(l => `${l[0]}: ${l[1] || ''}`));
  };

  /* Pixels: et billede er en tabel af tal. Skyderen sætter grænsen for "lys".
     data="10,15,20;15,80,120;..." (rækker adskilt af semikolon)  graense="150" */
  F.pixels = boks => {
    const D = liste(boks, 'data').map(r => r.split(',').map(Number)), R = D.length, K = D[0].length, c = Math.floor(300 / K);
    const sid = id('px'), ind = h('input', { type: 'range', id: sid, min: 0, max: 255, step: 5, value: attr(boks, 'graense', 150) }), ud = h('output', { for: sid });
    const st = h('div', { class: 'styring' }); st.append(h('label', { for: sid }, 'graense ='), ind, ud);
    const svg = s('svg', { viewBox: `0 0 ${K * c * 2 + 40} ${R * c}`, role: 'img' });
    const A = [], Bn = [];
    D.forEach((r, i) => r.forEach((v, k) => {
      svg.append(s('rect', { x: k * c, y: i * c, width: c - 1, height: c - 1, fill: `rgb(${v},${v},${v})` }), s('text', { x: k * c + c / 2, y: i * c + c / 2 + 4, 'text-anchor': 'middle', 'font-size': 11, class: 'mono', style: `fill: ${v > 120 ? '#16132E' : '#fff'}` }, v));
      const q = s('rect', { x: K * c + 40 + k * c, y: i * c, width: c - 1, height: c - 1 }); svg.append(q); A.push([q, v]);
    }));
    const tekst = h('p', { class: 'figur-resultat', 'aria-live': 'polite' });
    const vis = () => { const g = +ind.value; ud.textContent = g; let n = 0; A.forEach(([q, v]) => { const lys = v > g; n += lys; q.setAttribute('class', lys ? 'accent-fyld' : 'kasse'); }); tekst.innerHTML = `<code>pixel &gt; ${g}</code> er sand for <strong>${n}</strong> af ${R * K} pixels. Til venstre: tallene. Til højre: de pixels, reglen kalder "lyse".`; svg.setAttribute('aria-label', `Et gråtonebillede på ${R} gange ${K} pixels vist som tal, og ved siden af de ${n} pixels, der er lysere end ${g}.`); };
    ind.addEventListener('input', vis); boks.append(st, svg, tekst); vis();
  };

  /* Bayes: gang sandsynlighederne sammen, ét ord ad gangen, og normalisér til sidst.
     klasser="positiv,negativ" prior="0.6,0.4" ord="fantastisk:0.08:0.01;film:0.15:0.12;elsker:0.09:0.02" */
  F.bayes = boks => {
    const K = attr(boks, 'klasser', 'positiv,negativ').split(','), prior = attr(boks, 'prior', '0.6,0.4').split(',').map(Number), O = liste(boks, 'ord').map(x => { const d = x.split(':'); return [d[0], +d[1], +d[2]]; });
    const tabel = h('table', { class: 'mini' }), res = h('p', { class: 'figur-resultat', 'aria-live': 'polite' });
    const wrap = h('div', { role: 'img', 'aria-label': 'Naive Bayes regnet trin for trin: start med andelen af hver slags anmeldelse, gang med sandsynligheden for hvert ord, og del til sidst med summen.' }); wrap.append(tabel); boks.append(wrap, res);
    const fmt = x => x.toLocaleString('da-DK', { maximumSignificantDigits: 3 });
    trin(boks, O.length + 2, n => {
      let p = prior.slice(), rk = [`<tr><th>start: andel af alle</th>${p.map(v => `<td>${fmt(v)}</td>`).join('')}</tr>`];
      O.slice(0, Math.min(n, O.length)).forEach((o, i) => { p = [p[0] * o[1], p[1] * o[2]]; rk.push(`<tr class="${i === n - 1 ? 'nu' : ''}"><th>× "${o[0]}" (${fmt(o[1])} og ${fmt(o[2])})</th>${p.map(v => `<td>${fmt(v)}</td>`).join('')}</tr>`); });
      if (n === O.length + 1) rk.push(`<tr class="nu"><th>÷ summen (${fmt(p[0] + p[1])})</th>${p.map(v => `<td><strong>${pct(v / (p[0] + p[1]))}</strong></td>`).join('')}</tr>`);
      tabel.innerHTML = `<thead><tr><th></th>${K.map(k => `<th>${k}</th>`).join('')}</tr></thead><tbody>${rk.join('')}</tbody>`;
      res.innerHTML = n === O.length + 1 ? `Den ${K[0]}e forklaring er ${fmt(p[0] / p[1])} gange så sandsynlig som den ${K[1]}e.` : '';
    }, ['Før vi har set et eneste ord: hvor almindelig er hver slags anmeldelse?'].concat(O.map(o => `Gang med, hvor ofte "${o[0]}" står i hver slags anmeldelse.`), ['Normalisér: del begge tal med deres sum, så de giver 100 % tilsammen.']));
  };

  /* Befolkning: en model, der altid svarer "rask", har en høj træfsikkerhed.  n="1000" syge="5" */
  F.befolkning = boks => {
    const n = +attr(boks, 'n', 1000), syge = +attr(boks, 'syge', 5), K = 50, R = Math.ceil(n / K), c = 14;
    const svg = s('svg', { viewBox: `0 0 ${K * c} ${R * c}`, role: 'img', 'aria-label': `${n} personer vist som prikker. ${syge} af dem er syge. En model, der kalder alle raske, har ret i ${n - syge} tilfælde, men finder ingen af de syge.` });
    let fr = 17; const valgt = new Set(); while (valgt.size < syge) { fr = (fr * 16807) % 2147483647; valgt.add(fr % n); }
    const P = []; for (let i = 0; i < n; i++) { const q = s('circle', { cx: (i % K) * c + c / 2, cy: Math.floor(i / K) * c + c / 2, r: 4.2, style: 'transition: fill 0.4s, r 0.4s' }); svg.append(q); P.push(q); }
    const res = h('p', { class: 'figur-resultat', 'aria-live': 'polite' }); boks.append(svg, res);
    trin(boks, 4, k => {
      P.forEach((q, i) => { const syg = valgt.has(i); q.style.fill = k === 0 ? 'var(--tekst-svag)' : syg ? '#B3261E' : (k >= 2 ? 'var(--ok)' : 'var(--tekst-svag)'); q.setAttribute('r', syg && k >= 1 ? 6.5 : 4.2); q.style.opacity = k === 3 && !syg ? 0.25 : 1; });
      res.innerHTML = ['', `${syge} af ${tal(n)} er syge: <strong>${pct(syge / n)}</strong>.`, `Rigtige svar: ${tal(n - syge)} af ${tal(n)} = <strong>${pct((n - syge) / n)}</strong> træfsikkerhed.`, `Fundne syge: <strong>0 af ${syge}</strong>. Alle ${syge} er falske negative.`][k];
    }, [`${tal(n)} personer. Hver prik er et menneske.`, 'De røde er syge. Dem skal modellen finde.', 'Modellen svarer "rask" om alle. Den har ret hver gang, prikken er grøn.', 'Men den fandt ikke en eneste af dem, den skulle finde.']);
  };

  /* Tidslinje: perioder side om side, med begivenhederne i hver.
     perioder="1945–1969|Håb|1956 Navnet AI/1958 Perceptronen|Trintekst;..." */
  F.tidslinje = boks => {
    const P = liste(boks, 'perioder').map(x => x.split('|').map(y => y.trim())), n = P.length, B = 800, w = B / n, maks = Math.max(...P.map(p => (p[2] || '').split('/').length));
    const H = 92 + maks * 27, svg = s('svg', { viewBox: `0 0 ${B} ${H}`, role: 'img', 'aria-label': 'Tidslinje: ' + P.map(p => `${p[0]}, ${p[1]}: ${(p[2] || '').split('/').join(', ')}`).join('. ') + '.' });
    svg.append(s('line', { x1: 4, x2: B - 4, y1: 70, y2: 70, 'stroke-width': 3, class: 'streg' }));
    const G = P.map((p, i) => {
      const x = i * w, g = s('g'), r = s('rect', { x: x + 4, y: 8, width: w - 8, height: H - 14, rx: 10, class: 'kasse' });
      g.append(r, s('text', { x: x + 13, y: 32, 'font-size': 13, class: 'mono svag' }, p[0]), s('text', { x: x + 13, y: 54, 'font-size': 16, 'font-weight': 700 }, p[1]), s('circle', { cx: x + w / 2, cy: 70, r: 6, class: 'accent-fyld' }));
      (p[2] || '').split('/').filter(Boolean).forEach((ev, j) => {
        const m = ev.match(/^(\S+)\s+(.*)$/) || ['', '', ev];
        const t = s('text', { x: x + 13, y: 100 + j * 27, 'font-size': 13 }); t.append(s('tspan', { 'font-weight': 700, class: 'accent-tekst' }, m[1] + ' '), s('tspan', {}, m[2])); g.append(t);
      });
      svg.append(g); g.r = r; return g;
    });
    boks.append(svg);
    trin(boks, n, k => G.forEach((g, i) => { g.style.opacity = i <= k ? 1 : 0.15; g.r.setAttribute('class', i === k ? 'kasse-accent' : 'kasse'); }), P.map(p => `${p[0]}, ${p[1]}: ${p[3] || ''}`));
  };

  /* ============================================================ databaser */

  /* Tabeldele: tabel, række, kolonne, nøgle og relation, vist på to små tabeller */
  F.tabeldele = boks => {
    const t1 = h('table', { class: 'mini' }), t2 = h('table', { class: 'mini' });
    t1.innerHTML = '<caption>brancher</caption><thead><tr><th class="noegle">branche_id</th><th>branche</th></tr></thead><tbody><tr><td class="nk0">3</td><td>Handel</td></tr><tr><td class="nk1">4</td><td>Industri</td></tr></tbody>';
    t2.innerHTML = '<caption>grupper</caption><thead><tr><th>gruppe_id</th><th class="noegle">branche_id</th><th>aar</th></tr></thead><tbody><tr><td>33</td><td class="nk0">3</td><td>2012</td></tr><tr><td>47</td><td class="nk1">4</td><td>2012</td></tr><tr><td>139</td><td class="nk0">3</td><td>2022</td></tr></tbody>';
    const wrap = h('div', { class: 'figur-tabeller dele', role: 'img', 'aria-label': 'To tabeller, brancher og grupper. Hver række er én ting, hver kolonne er én egenskab, og kolonnen branche_id forbinder de to tabeller.' });
    wrap.append(t1, h('span', { class: 'figur-pil', 'aria-hidden': 'true' }, '⟷'), t2); boks.append(wrap);
    trin(boks, 5, n => { wrap.dataset.trin = n; }, ['Tabeller: én skuffe til hver slags ting. Her brancher og grupper.', 'Rækker: hver række er én sag, fx branchen Handel.', 'Kolonner: felterne på hver sag. Alle rækker har de samme.', 'Nøgle: en kolonne med et entydigt id, som man kan slå op på.', 'Relation: grupper peger på en branche ved hjælp af dens id.']);
  };

  /* SQL: en forespørgsel udført led for led på en lille tabel.
     tabel="medianer" kol="branche,aar,p50" raekker="Handel,2012,0.409;Handel,2022,0.454;..."
     hvor="aar=2022" vaelg="branche,p50" sorter="p50 desc" graense="3" */
  F.sql = boks => {
    const navn = attr(boks, 'tabel', 'tabel'), kol = attr(boks, 'kol', '').split(',').map(x => x.trim()), rk = liste(boks, 'raekker').map(x => x.split(',').map(y => y.trim()));
    const hv = attr(boks, 'hvor', '').match(/^(\w+)\s*(=|>|<)\s*(.+)$/), vaelg = attr(boks, 'vaelg', '*').split(',').map(x => x.trim()), so = attr(boks, 'sorter', '').split(/\s+/), lim = +attr(boks, 'graense', 0);
    const led = [['FROM', `FROM ${navn}`, 'Start med hele tabellen.']];
    if (hv) led.push(['WHERE', `WHERE ${hv[1]} ${hv[2]} ${hv[3]}`, `WHERE vælger RÆKKER: kun dem, hvor ${hv[1]} ${hv[2]} ${hv[3]}.`]);
    if (so[0]) led.push(['ORDER', `ORDER BY ${so[0]}${so[1] ? ' ' + so[1].toUpperCase() : ''}`, `ORDER BY sorterer rækkerne efter ${so[0]}${/desc/i.test(so[1] || '') ? ', størst først' : ''}.`]);
    if (lim) led.push(['LIMIT', `LIMIT ${lim}`, `LIMIT beholder de første ${lim} rækker.`]);
    led.push(['SELECT', `SELECT ${vaelg.join(', ')}`, 'SELECT vælger KOLONNER: kun dem, vi har bedt om.']);
    const skrevet = ['SELECT', 'FROM', 'WHERE', 'ORDER', 'LIMIT'].map(k => led.find(l => l[0] === k)).filter(Boolean);
    const kode = h('pre', { class: 'sql-kode' }), tabel = h('table', { class: 'mini' });
    const wrap = h('div', { class: 'figur-tabeller', role: 'img', 'aria-label': 'En SQL-forespørgsel udført led for led: ' + skrevet.map(l => l[1]).join(' ') + '.' }); wrap.append(kode, tabel); boks.append(wrap);
    const test = r => { if (!hv) return true; const a = r[kol.indexOf(hv[1])], b = hv[3].replace(/^'|'$/g, ''); return hv[2] === '=' ? a == b : hv[2] === '>' ? +a > +b : +a < +b; };
    trin(boks, led.length, n => {
      const aktive = led.slice(0, n + 1).map(l => l[0]); let rr = rk.map((r, i) => ({ r, i, ude: false }));
      if (aktive.includes('WHERE')) rr.forEach(x => (x.ude = !test(x.r)));
      if (aktive.includes('ORDER')) { const ki = kol.indexOf(so[0]), d = /desc/i.test(so[1] || '') ? -1 : 1; rr = rr.filter(x => !x.ude).sort((a, b) => (isNaN(a.r[ki]) ? a.r[ki].localeCompare(b.r[ki]) : a.r[ki] - b.r[ki]) * d); }
      if (aktive.includes('LIMIT')) rr = rr.slice(0, lim);
      const vis = aktive.includes('SELECT') && vaelg[0] !== '*' ? vaelg : kol;
      kode.innerHTML = skrevet.map(l => `<span class="${l[0] === led[n][0] ? 'nu' : aktive.includes(l[0]) ? 'set' : ''}">${esc(l[1])}</span>`).join('\n');
      tabel.innerHTML = `<caption>${rr.filter(x => !x.ude).length} rækker · ${vis.length} kolonner</caption><thead><tr>${vis.map(k => `<th>${k}</th>`).join('')}</tr></thead><tbody>${rr.map(x => `<tr class="${x.ude ? 'ude' : ''}">${vis.map(k => `<td>${x.r[kol.indexOf(k)]}</td>`).join('')}</tr>`).join('')}</tbody>`;
    }, led.map(l => l[2]));
  };

  /* ============================================================ markup */

  /* Markup: skriv Markdown, og se både den HTML, maskinen får, og det, browseren viser */
  F.markup = boks => {
    const tid = id('md'), ta = h('textarea', { id: tid, rows: 7, spellcheck: 'false', class: 'md-ind' });
    ta.value = attr(boks, 'tekst', '## Opslag\\n\\nBarometeret viser **tre** tal og *aldrig* bare ét.\\n\\n- Handel\\n- Industri\\n\\n[Om barometeret](om.qmd)').replace(/\\n/g, '\n');
    const html = h('pre', { class: 'md-html' }), vis = h('div', { class: 'md-vis' });
    const kol = (t, e) => { const d = h('div'); d.append(h('p', { class: 'md-titel' }, t), e); return d; };
    const lab = h('label', { for: tid, class: 'md-titel' }, '1 · Markdown (det, I skriver)'); const d1 = h('div'); d1.append(lab, ta);
    const wrap = h('div', { class: 'md-figur' }); wrap.append(d1, kol('2 · HTML (det, maskinen får)', html), kol('3 · Det, browseren viser', vis)); boks.append(wrap);
    const inline = t => esc(t).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>').replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>');
    const oversaet = md => {
      const ud = []; let li = false;
      md.split('\n').forEach(l => {
        const pkt = l.match(/^[-*] (.*)$/); if (li && !pkt) { ud.push('</ul>'); li = false; }
        const ov = l.match(/^(#{1,3}) (.*)$/);
        if (ov) ud.push(`<h${ov[1].length}>${inline(ov[2])}</h${ov[1].length}>`);
        else if (pkt) { if (!li) { ud.push('<ul>'); li = true; } ud.push(`  <li>${inline(pkt[1])}</li>`); }
        else if (l.trim()) ud.push(`<p>${inline(l)}</p>`);
      });
      if (li) ud.push('</ul>'); return ud.join('\n');
    };
    const opd = () => { const o = oversaet(ta.value); html.textContent = o; vis.innerHTML = o.replace(/<a href="[^"]*">/g, '<a href="#" onclick="return false">'); };
    ta.addEventListener('input', opd); ['keydown', 'keyup', 'keypress'].forEach(ev => ta.addEventListener(ev, e => e.stopPropagation())); opd();
  };

  /* Kæde: en proces i led, ét led ad gangen.  led=".qmd|Markdown + Python|Jupyter kører koden;.md|Markdown + resultater|pandoc oversætter;.html|" */
  F.kaede = boks => {
    const L = liste(boks, 'led').map(x => x.split('|').map(y => y.trim())), n = L.length, B = 760, w = Math.min(170, (B - 20) / n - 50), gap = (B - n * w) / (n - 1 || 1);
    const svg = s('svg', { viewBox: `0 0 ${B} 130`, role: 'img', 'aria-label': 'En kæde af trin: ' + L.map((l, i) => l[0] + (l[2] && i < n - 1 ? ', derefter ' + l[2] : '')).join(', ') + '.' });
    const G = L.map((l, i) => {
      const x = i * (w + gap), g = s('g'), r = s('rect', { x, y: 44, width: w, height: 66, rx: 10, class: 'kasse' });
      g.append(r, s('text', { x: x + w / 2, y: 72, 'text-anchor': 'middle', class: 'mono', 'font-size': 17, 'font-weight': 700 }, l[0]), s('text', { x: x + w / 2, y: 94, 'text-anchor': 'middle', class: 'svag', 'font-size': 12.5 }, l[1] || ''));
      if (i < n - 1) g.append(s('path', { d: `M ${x + w + 6} 77 H ${x + w + gap - 6} m -9 -6 l 9 6 l -9 6`, 'stroke-width': 2.5, class: 'accent-streg' }), s('text', { x: x + w + gap / 2, y: 30, 'text-anchor': 'middle', 'font-size': 12.5, class: 'accent-tekst', 'font-weight': 700 }, l[2] || ''));
      svg.append(g); g.r = r; return g;
    });
    boks.append(svg);
    trin(boks, n, k => G.forEach((g, i) => { g.style.opacity = i <= k ? 1 : 0.18; g.r.setAttribute('class', i === k ? 'kasse-accent' : 'kasse'); }), L.map((l, i) => i === 0 ? `${l[0]}: ${l[1]}. ${l[3] || ''}` : `${L[i - 1][2] || 'Næste trin'} → ${l[0]}: ${l[1]}. ${l[3] || ''}`));
  };

  /* ============================================================ sprogmodeller */

  /* Vektorer: ord som punkter. Vælg to ord, og se afstanden.  ord="film:0.9:0.8;serie:0.8:0.9"  par="film,se" */
  F.vektorer = boks => {
    const O = liste(boks, 'ord').map(x => { const d = x.split(':'); return { o: d[0], x: +d[1], y: +d[2] }; }), B = 420, H = 330, X = v => 50 + v * 330, Y = v => H - 40 - v * 270;
    const svg = s('svg', { viewBox: `0 0 ${B} ${H}`, role: 'img' });
    svg.append(s('line', { x1: 50, x2: B - 20, y1: H - 40, y2: H - 40, class: 'streg' }), s('line', { x1: 50, x2: 50, y1: 14, y2: H - 40, class: 'streg' }), s('text', { x: B - 20, y: H - 14, 'text-anchor': 'end', class: 'svag', 'font-size': 13 }, 'første tal'), s('text', { x: 14, y: 20, class: 'svag', 'font-size': 13 }, 'andet tal'));
    const lin = s('line', { 'stroke-width': 3, 'stroke-dasharray': '6 5', class: 'accent-streg' }); svg.append(lin);
    let valgt = attr(boks, 'par', O[0].o + ',' + O[1].o).split(',').map(x => O.findIndex(o => o.o === x.trim()));
    const P = O.map((o, i) => { const g = s('g', { tabindex: 0, role: 'button', style: 'cursor: pointer' }); const c = s('circle', { cx: X(o.x), cy: Y(o.y), r: 9 }); g.append(c, s('text', { x: X(o.x) + 13, y: Y(o.y) + 5, 'font-size': 16, 'font-weight': 600 }, o.o)); svg.append(g); const v = e => { e.stopPropagation(); valgt = [valgt[1], i]; vis(); }; g.addEventListener('click', v); g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); v(e); } }); g.c = c; return g; });
    const res = h('p', { class: 'figur-resultat', 'aria-live': 'polite' });
    const vis = () => {
      const [a, b] = valgt.map(i => O[i]), d = Math.hypot(a.x - b.x, a.y - b.y);
      P.forEach((g, i) => { g.c.setAttribute('class', valgt.includes(i) ? 'accent-fyld' : ''); g.c.style.fill = valgt.includes(i) ? '' : 'var(--tekst-svag)'; g.setAttribute('aria-label', `${O[i].o}: (${O[i].x}, ${O[i].y})`); });
      lin.setAttribute('x1', X(a.x)); lin.setAttribute('y1', Y(a.y)); lin.setAttribute('x2', X(b.x)); lin.setAttribute('y2', Y(b.y));
      res.innerHTML = `Afstand <code>${a.o}</code> – <code>${b.o}</code>: <strong>${f2(d)}</strong>. Klik på et ord for at sammenligne med et andet.`;
      svg.setAttribute('aria-label', 'Ord tegnet som punkter: ' + O.map(o => `${o.o} i (${o.x}, ${o.y})`).join(', ') + `. Afstanden mellem ${a.o} og ${b.o} er ${f2(d)}.`);
    };
    boks.append(svg, res); vis();
  };

  /* Analogi: konge − mand + kvinde ≈ dronning, tegnet som pile. Samme tal som i koden.
     ord="mand:0:0;kvinde:0:1;konge:1:0;dronning:1:1;prins:0.7:0.1;æble:0.1:0.4"  regn="konge,mand,kvinde" */
  F.analogi = boks => {
    const O = {}; liste(boks, 'ord').forEach(x => { const d = x.split(':'); O[d[0]] = [+d[1], +d[2]]; });
    const [a, mi, pl] = attr(boks, 'regn', 'konge,mand,kvinde').split(',').map(x => x.trim()), B = 420, H = 330, X = v => 70 + v * 270, Y = v => H - 50 - v * 230;
    const mellem = [O[a][0] - O[mi][0], O[a][1] - O[mi][1]], slut = [mellem[0] + O[pl][0], mellem[1] + O[pl][1]];
    const kand = Object.keys(O).filter(o => ![a, mi, pl].includes(o)), naer = kand.reduce((m, o) => Math.hypot(O[o][0] - slut[0], O[o][1] - slut[1]) < Math.hypot(O[m][0] - slut[0], O[m][1] - slut[1]) ? o : m);
    const svg = s('svg', { viewBox: `0 0 ${B} ${H}`, role: 'img', 'aria-label': `Ordene tegnet som punkter. Starter man i ${a}, trækker ${mi} fra og lægger ${pl} til, lander man i (${slut[0]}, ${slut[1]}). Det nærmeste ord er ${naer}.` });
    const P = {}; Object.entries(O).forEach(([o, [x, y]]) => { const c = s('circle', { cx: X(x), cy: Y(y), r: 8, style: 'fill: var(--tekst-svag); transition: fill 0.3s, r 0.3s' }); svg.append(c, s('text', { x: X(x) + 12, y: Y(y) - 8, 'font-size': 15, 'font-weight': 600 }, o)); P[o] = c; });
    const pilL = (p, q, t) => { const g = s('g'); const ang = Math.atan2(Y(q[1]) - Y(p[1]), X(q[0]) - X(p[0])), L = 11, x2 = X(q[0]), y2 = Y(q[1]); g.append(s('path', { d: `M ${X(p[0])} ${Y(p[1])} L ${x2} ${y2} M ${x2 - L * Math.cos(ang - 0.45)} ${y2 - L * Math.sin(ang - 0.45)} L ${x2} ${y2} L ${x2 - L * Math.cos(ang + 0.45)} ${y2 - L * Math.sin(ang + 0.45)}`, 'stroke-width': 3.5, class: 'accent-streg' }), s('text', { x: (X(p[0]) + x2) / 2 + 8, y: (Y(p[1]) + y2) / 2 + 18, 'font-size': 14, 'font-weight': 700, class: 'accent-tekst' }, t)); svg.append(g); return g; };
    const p1 = pilL(O[a], mellem, `− ${mi}`), p2 = pilL(mellem, slut, `+ ${pl}`);
    const res = h('p', { class: 'figur-resultat', 'aria-live': 'polite' }); boks.append(svg, res);
    trin(boks, 4, n => {
      Object.values(P).forEach(c => { c.style.fill = 'var(--tekst-svag)'; c.setAttribute('r', 8); }); P[a].style.fill = 'var(--accent-dyb)';
      p1.style.opacity = n >= 1 ? 1 : 0; p2.style.opacity = n >= 2 ? 1 : 0; if (n >= 3) { P[naer].style.fill = 'var(--accent-dyb)'; P[naer].setAttribute('r', 12); }
      res.innerHTML = [`<code>${a} = [${O[a].join(', ')}]</code>`, `<code>${a} − ${mi} = [${mellem.join(', ')}]</code>`, `<code>${a} − ${mi} + ${pl} = [${slut.join(', ')}]</code>`, `Nærmeste ord (når ${a}, ${mi} og ${pl} er udelukket): <strong>${naer}</strong>`][n];
    }, [`Start i ${a}.`, `Træk ${mi} fra: det, der er tilbage, er "det kongelige".` + (mellem[0] === O[a][0] && mellem[1] === O[a][1] ? ` (${mi} er [0, 0] her, så punktet bliver stående.)` : ''), `Læg ${pl} til: flyt i retningen fra mand til kvinde.`, 'Hvilket ord ligger nærmest det sted, vi landede?']);
  };

  /* Markov: tæl, hvad der kommer efter hvert ord, og generér ét ord ad gangen. Samme tekst som i koden.  start="barometeret" */
  F.markov = boks => {
    const ordene = attr(boks, 'tekst', '').split(/\s+/).filter(Boolean), efter = {};
    ordene.forEach((o, i) => { if (i < ordene.length - 1) { efter[o] = efter[o] || {}; efter[o][ordene[i + 1]] = (efter[o][ordene[i + 1]] || 0) + 1; } });
    const start = attr(boks, 'start', ordene[0]); let saet;
    const linje = h('p', { class: 'figur-ord' }), tabel = h('table', { class: 'mini' }), res = h('p', { class: 'figur-resultat', 'aria-live': 'polite' });
    const b1 = h('button', { type: 'button' }, 'Vælg det hyppigste'), b2 = h('button', { type: 'button' }, 'Vælg tilfældigt'), b3 = h('button', { type: 'button', class: 'sek' }, 'Forfra');
    const vis = () => {
      const nu = saet[saet.length - 1], f = efter[nu] || {}, sum = Object.values(f).reduce((a, b) => a + b, 0);
      linje.innerHTML = ''; saet.forEach((o, i) => linje.append(h('span', { class: i === saet.length - 1 ? 'nu' : 'set' }, o), ' '));
      tabel.innerHTML = `<caption>efter["${nu}"]</caption><thead><tr><th>næste ord</th><th>antal</th><th>chance</th></tr></thead><tbody>${Object.entries(f).sort((a, b) => b[1] - a[1]).map(([o, c]) => `<tr><td>${o}</td><td>${c}</td><td>${pct(c / sum)}</td></tr>`).join('') || '<tr><td colspan="3">intet: ordet stod sidst i teksten</td></tr>'}</tbody>`;
      const gentaget = saet.length > 6 && saet.slice(0, -1).includes(nu) && saet.join(' ').includes(saet.slice(-4).join(' ')) && saet.join(' ').indexOf(saet.slice(-4).join(' ')) < saet.join(' ').lastIndexOf(saet.slice(-4).join(' '));
      res.textContent = gentaget ? 'Kæden kører i ring: den ser kun ét ord tilbage og ved ikke, at den har sagt det før.' : `Modellen ser kun ordet "${nu}". Alt før det er glemt.`;
      b1.disabled = b2.disabled = !sum || saet.length > 24;
    };
    const vaelg = tilf => { const f = efter[saet[saet.length - 1]]; if (!f) return; let o; if (tilf) { const pool = []; Object.entries(f).forEach(([k, c]) => { for (let i = 0; i < c; i++) pool.push(k); }); o = pool[Math.floor(Math.random() * pool.length)]; } else o = Object.entries(f).reduce((m, x) => (x[1] > m[1] ? x : m))[0]; saet.push(o); vis(); };
    b1.addEventListener('click', e => { e.stopPropagation(); vaelg(false); }); b2.addEventListener('click', e => { e.stopPropagation(); vaelg(true); }); b3.addEventListener('click', e => { e.stopPropagation(); saet = [start]; vis(); });
    const rk = h('div', { class: 'figur-knapper' }); rk.append(b1, b2, b3);
    const wrap = h('div', { class: 'figur-tabeller' }); const v = h('div', { style: 'flex: 1 1 300px' }); v.append(linje, rk, res); wrap.append(v, tabel); boks.append(wrap); saet = [start]; vis();
  };

  /* Softmax: fra scorer til sandsynligheder. Skyderen er temperaturen.  scorer="måtten:3.0;stolen:2.0;taget:1.5;pizzaen:-1.0" */
  F.softmax = boks => {
    const S = liste(boks, 'scorer').map(x => { const d = x.split(':'); return [d[0], +d[1]]; }), sid = id('sm');
    const ind = h('input', { type: 'range', id: sid, min: 0.1, max: 3, step: 0.1, value: attr(boks, 'temperatur', 1) }), ud = h('output', { for: sid });
    const st = h('div', { class: 'styring' }); st.append(h('label', { for: sid }, 'temperatur ='), ind, ud);
    const rh = 40, svg = s('svg', { viewBox: `0 0 560 ${S.length * rh + 6}`, role: 'img' });
    const R = S.map(([o, sc], i) => { const y = 4 + i * rh; svg.append(s('text', { x: 108, y: y + 22, 'text-anchor': 'end', 'font-size': 16, 'font-weight': 600 }, o), s('text', { x: 118, y: y + 22, class: 'mono svag', 'font-size': 13 }, `score ${sc}`)); const r = s('rect', { x: 200, y: y + 4, height: 26, rx: 4, class: 'accent-fyld', style: 'transition: width 0.25s' }), t = s('text', { y: y + 23, class: 'mono', 'font-size': 14 }); svg.append(r, t); return [r, t]; });
    const res = h('p', { class: 'figur-resultat', 'aria-live': 'polite' });
    const vis = () => {
      const T = +ind.value, e = S.map(x => Math.exp(x[1] / T)), sum = e.reduce((a, b) => a + b, 0), p = e.map(x => x / sum); ud.textContent = T.toLocaleString('da-DK', { minimumFractionDigits: 1 });
      R.forEach(([r, t], i) => { const w = Math.max(1, p[i] * 290); r.setAttribute('width', w); t.setAttribute('x', 206 + w); t.textContent = pct(p[i]); });
      res.textContent = T <= 0.4 ? 'Lav temperatur: næsten altid det mest sandsynlige ord. Forudsigeligt.' : T >= 2 ? 'Høj temperatur: ordene bliver næsten lige sandsynlige. Mere tilfældigt og "kreativt".' : 'Sandsynlighederne giver altid 100 % tilsammen.';
      svg.setAttribute('aria-label', `Sandsynligheder ved temperatur ${T}: ` + S.map((x, i) => `${x[0]} ${pct(p[i])}`).join(', ') + '.');
    };
    ind.addEventListener('input', vis); boks.append(st, svg, res); vis();
  };

  /* Attention: hvor meget lytter ét ord til de andre? Samme tal som i koden.
     saetning="Dyret krydsede ikke vejen , fordi det var for træt ."  fra="det"  noegler="dyret:0.9:0.8;vejen:0.1:0.9;træt:0.6:0.3"  query="1.0:0.4"  skala="3" */
  F.attention = boks => {
    const ord = attr(boks, 'saetning', '').split(/\s+/).filter(Boolean), fra = attr(boks, 'fra', 'det'), q = attr(boks, 'query', '1:0').split(':').map(Number), sk = +attr(boks, 'skala', 1);
    const K = liste(boks, 'noegler').map(x => { const d = x.split(':'); return { o: d[0], k: [+d[1], +d[2]] }; });
    K.forEach(k => { k.prik = k.k[0] * q[0] + k.k[1] * q[1]; k.score = k.prik * sk; }); const sum = K.reduce((a, k) => a + Math.exp(k.score), 0); K.forEach(k => (k.w = Math.exp(k.score) / sum));
    const B = 760, w = B / ord.length, svg = s('svg', { viewBox: `0 0 ${B} 190`, role: 'img', 'aria-label': `Ordet ${fra} fordeler sin opmærksomhed: ` + K.map(k => `${k.o} ${pct(k.w)}`).join(', ') + '.' });
    const fi = ord.findIndex(o => o.toLowerCase() === fra), X = i => i * w + w / 2;
    const buer = K.map(k => { const i = ord.findIndex(o => o.toLowerCase() === k.o), x1 = X(fi), x2 = X(i), hh = 40 + Math.abs(x1 - x2) * 0.22; const p = s('path', { d: `M ${x1} 128 Q ${(x1 + x2) / 2} ${128 - hh * 1.6} ${x2} 128`, 'stroke-width': 2 + k.w * 22, class: 'accent-streg', style: 'opacity: 0.75' }); const t = s('text', { x: x2, y: 176, 'text-anchor': 'middle', class: 'mono accent-tekst', 'font-size': 15, 'font-weight': 700 }, pct(k.w)); svg.append(p, t); return [p, t]; });
    ord.forEach((o, i) => svg.append(s('text', { x: X(i), y: 152, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': i === fi || K.some(k => k.o === o.toLowerCase()) ? 700 : 400, class: i === fi ? 'accent-tekst' : '' }, o)));
    const tabel = h('table', { class: 'mini' }); boks.append(svg, tabel);
    trin(boks, 4, n => {
      buer.forEach(([p, t]) => { p.style.opacity = n >= 3 ? 0.75 : 0; t.style.opacity = n >= 3 ? 1 : 0; });
      tabel.innerHTML = `<thead><tr><th>ord</th><th>key</th>${n >= 1 ? '<th>prikprodukt med query</th>' : ''}${n >= 2 ? `<th>× ${sk}</th>` : ''}${n >= 3 ? '<th>softmax</th>' : ''}</tr></thead><tbody>${K.map(k => `<tr><td>${k.o}</td><td>[${k.k.join(', ')}]</td>${n >= 1 ? `<td>${q[0]}·${k.k[0]} + ${q[1]}·${k.k[1]} = ${f2(k.prik)}</td>` : ''}${n >= 2 ? `<td>${f2(k.score)}</td>` : ''}${n >= 3 ? `<td><strong>${pct(k.w)}</strong></td>` : ''}</tr>`).join('')}</tbody>`;
    }, [`"${fra}" har en query: [${q.join(', ')}]. Hvert af de andre ord har en key.`, 'Prikproduktet måler, hvor godt query og key passer sammen: gang parvis, og læg sammen.', `Scorerne skaleres (her gange ${sk}).`, `Softmax gør scorerne til vægte, der giver 100 % tilsammen. "${fra}" lytter mest til "${K.reduce((m, k) => (k.w > m.w ? k : m)).o}".`]);
  };

  window.sds1.figurStart();
})();
