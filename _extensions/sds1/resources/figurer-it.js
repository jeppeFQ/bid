/* =====================================================================
   Begrebsfigurer til IT-kurser: maskinen, Git, design, databaser, markup og sprogmodeller
   ---------------------------------------------------------------------
   Bruges som de øvrige figurer:

     ::: {.figur figur="git" fil="analyse.ipynb"}
     :::

   Hver figur er beskrevet lige over sin funktion: hvad den viser, og hvilke
   attributter den tager. Figurerne regner selv på de tal, de får, og følger
   de samme regler som figurer.js: tekstbeskrivelse til skærmlæsere, knapper
   der kan bruges med tastatur, og ingen animation ved "reducer bevægelse".
   ===================================================================== */
(function () {
  'use strict';
  if (!window.sds1 || !window.sds1.fig) return;
  const { s, h, tal, rolig, attr, trin } = window.sds1.fig;
  const F = window.sds1.figurer;
  const liste = (boks, n, std) => attr(boks, n, std || '').split(';').map(x => x.trim()).filter(Boolean);
  const pil = (x1, y1, x2, y2, kl) => {                     // linje med pilespids
    const a = Math.atan2(y2 - y1, x2 - x1), L = 10;
    return s('path', { d: `M ${x1} ${y1} L ${x2} ${y2} M ${x2 - L * Math.cos(a - 0.45)} ${y2 - L * Math.sin(a - 0.45)} L ${x2} ${y2} L ${x2 - L * Math.cos(a + 0.45)} ${y2 - L * Math.sin(a + 0.45)}`, 'stroke-width': 2.5, class: kl || 'streg' });
  };
  const kasse = (svg, x, y, w, hh, tekst, o) => {             // boks med centreret tekst
    o = o || {}; const g = s('g');
    const r = s('rect', { x, y, width: w, height: hh, rx: o.rx === undefined ? 8 : o.rx, class: o.kl || 'kasse' });
    g.append(r);
    String(tekst).split('\n').forEach((l, i, a) => g.append(s('text', { x: x + w / 2, y: y + hh / 2 + 6 + (i - (a.length - 1) / 2) * 19, 'text-anchor': 'middle', 'font-size': o.fs || 16, 'font-weight': o.fed ? 700 : 400, class: (o.mono ? 'mono ' : '') + (o.tkl || '') }, l)));
    svg.append(g); g.r = r; return g;
  };
  const f2 = x => x.toLocaleString('da-DK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  /* ============================================================ maskinen */

  /* Arkitektur: CPU, RAM, disk og bus.  fokus="cpu" | "ram" | "disk" | "bus" | "alle" */
  F.arkitektur = boks => {
    const fokus = attr(boks, 'fokus', 'alle');
    const svg = s('svg', { viewBox: '0 0 520 330', role: 'img', 'aria-label': 'Von Neumann-arkitekturen: en processor (CPU) med regneenhed og kontrolenhed, den primære hukommelse (RAM), den sekundære hukommelse (disken) og ind- og udenheder, forbundet af en bus.' });
    const dele = {};
    const bus = s('g'); bus.append(s('rect', { x: 20, y: 150, width: 480, height: 30, rx: 15, class: 'kasse-accent' }), s('text', { x: 260, y: 170, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 700, class: 'accent-tekst' }, 'Bus: adresser · data · kontrolsignaler'));
    [[110, 120], [390, 120], [130, 180], [390, 180]].forEach(([x, y]) => bus.append(s('line', { x1: x, x2: x, y1: y, y2: y + 30, 'stroke-width': 3, class: 'accent-streg' })));
    svg.append(bus); dele.bus = bus;
    const cpu = s('g'); svg.append(cpu);
    cpu.append(s('rect', { x: 20, y: 20, width: 190, height: 100, rx: 10, class: 'kasse' }), s('text', { x: 115, y: 44, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 700 }, 'CPU (processoren)'));
    kasse(cpu, 32, 58, 78, 48, 'ALU\nregner', { fs: 13 }); kasse(cpu, 120, 58, 78, 48, 'Kontrol\nstyrer', { fs: 13 }); dele.cpu = cpu;
    dele.ram = kasse(svg, 290, 20, 200, 100, 'RAM\nprimær hukommelse\nvæk, når der slukkes', { fs: 14 });
    dele.disk = kasse(svg, 40, 210, 190, 100, 'Disk (SSD / harddisk)\nsekundær hukommelse\nbliver, når der slukkes', { fs: 14 });
    kasse(svg, 300, 210, 190, 100, 'Ind og ud\ntastatur, skærm, net', { fs: 14 });
    Object.entries(dele).forEach(([k, g]) => { if (fokus !== 'alle') g.style.opacity = k === fokus ? 1 : 0.3; if (k === fokus && g.r) g.r.setAttribute('class', 'kasse-accent'); });
    if (fokus === 'cpu') cpu.querySelector('rect').setAttribute('class', 'kasse-accent');
    boks.append(svg);
  };

  /* CPU: hent, afkod, udfør. Samme program og hukommelse som i lektionens kode.
     program="LOAD:8192;ADD:8196;STORE:8200;HALT:"  hukommelse="8192:2;8196:2;8200:0" */
  F.cpu = boks => {
    const prog = liste(boks, 'program', 'LOAD:8192;ADD:8196;STORE:8200;HALT:').map(x => x.split(':'));
    const mem0 = {}; liste(boks, 'hukommelse', '8192:2;8196:2;8200:0').forEach(x => { const [a, v] = x.split(':'); mem0[a] = +v; });
    const adr = Object.keys(mem0), H = 60 + Math.max(prog.length, adr.length) * 44;
    const svg = s('svg', { viewBox: `0 0 560 ${H}`, role: 'img', 'aria-label': 'En lille CPU kører et program på fire instruktioner: hent et tal fra hukommelsen, læg et tal til, gem resultatet og stop.' });
    svg.append(s('text', { x: 20, y: 22, 'font-size': 14, class: 'svag' }, 'program'), s('text', { x: 235, y: 22, 'font-size': 14, class: 'svag' }, 'CPU'), s('text', { x: 400, y: 22, 'font-size': 14, class: 'svag' }, 'hukommelse (adresse: tal)'));
    const pr = prog.map((p, i) => kasse(svg, 20, 34 + i * 44, 160, 36, `${i}  ${p[0]} ${p[1] || ''}`, { mono: true, fs: 15 }));
    kasse(svg, 225, 34, 130, 36, 'tæller', { fs: 13, tkl: 'svag' }); const tv = s('text', { x: 340, y: 58, 'text-anchor': 'end', class: 'mono accent-tekst', 'font-size': 18, 'font-weight': 700 }); svg.append(tv);
    kasse(svg, 225, 78, 130, 36, 'register', { fs: 13, tkl: 'svag' }); const rv = s('text', { x: 340, y: 102, 'text-anchor': 'end', class: 'mono accent-tekst', 'font-size': 18, 'font-weight': 700 }); svg.append(rv);
    svg.querySelectorAll('g').forEach(g => { const t = g.querySelector('text'); if (t && (t.textContent === 'tæller' || t.textContent === 'register')) { t.setAttribute('x', 237); t.setAttribute('text-anchor', 'start'); } });
    const mr = adr.map((a, i) => { const g = kasse(svg, 400, 34 + i * 44, 140, 36, '', { mono: true }); const t = s('text', { x: 470, y: 58 + i * 44, 'text-anchor': 'middle', class: 'mono', 'font-size': 15 }); svg.append(t); return { g, t }; });
    boks.append(svg);
    const tilst = [{ pc: 0, reg: 0, mem: Object.assign({}, mem0), akt: -1, m: -1, tx: 'Før start: registeret er 0, og tælleren peger på instruktion 0.' }];
    let reg = 0, mem = Object.assign({}, mem0);
    for (let pc = 0; pc < prog.length; pc++) {
      const [ins, a] = prog[pc]; let tx;
      if (ins === 'LOAD') { reg = mem[a]; tx = `LOAD: hent tallet på adresse ${a} ind i registeret. Register = ${reg}.`; }
      else if (ins === 'ADD') { const gl = reg; reg += mem[a]; tx = `ADD: læg tallet på adresse ${a} til. ${gl} + ${mem[a]} = ${reg}.`; }
      else if (ins === 'STORE') { mem = Object.assign({}, mem, { [a]: reg }); tx = `STORE: gem registerets tal på adresse ${a}.`; }
      else tx = 'HALT: stop. Resultatet står i hukommelsen.';
      tilst.push({ pc, reg, mem, akt: pc, m: adr.indexOf(a), tx: `Tik ${pc}. ` + tx });
    }
    trin(boks, tilst.length, n => {
      const t = tilst[n];
      pr.forEach((g, i) => g.r.setAttribute('class', i === t.akt ? 'kasse-accent' : 'kasse'));
      mr.forEach((m, i) => { m.g.r.setAttribute('class', i === t.m ? 'kasse-accent' : 'kasse'); m.t.textContent = `${adr[i]}: ${t.mem[adr[i]]}`; });
      tv.textContent = t.pc; rv.textContent = t.reg;
    }, tilst.map(t => t.tx));
  };

  /* Bits: otte kontakter. Klik på en bit for at tænde eller slukke den.  tal="90" */
  F.bits = boks => {
    let v = Math.max(0, Math.min(255, +attr(boks, 'tal', 90)));
    const pv = [128, 64, 32, 16, 8, 4, 2, 1];
    const rk = h('div', { class: 'bit-raekke', role: 'group', 'aria-label': 'Otte bits. Tryk på en bit for at skifte mellem 0 og 1.' });
    const ud = h('p', { class: 'figur-resultat', 'aria-live': 'polite' });
    const kn = pv.map(p => { const b = h('button', { type: 'button', class: 'bit' }); b.append(h('span', { class: 'ciffer' }), h('span', { class: 'plads' }, String(p))); b.addEventListener('click', e => { e.stopPropagation(); v ^= p; vis(); }); rk.append(b); return b; });
    const vis = () => {
      kn.forEach((b, i) => { const on = (v & pv[i]) > 0; b.classList.toggle('taendt', on); b.firstChild.textContent = on ? '1' : '0'; b.setAttribute('aria-pressed', String(on)); b.setAttribute('aria-label', `Bit med pladsværdi ${pv[i]}: ${on ? 1 : 0}`); });
      const led = pv.filter(p => v & p);
      ud.innerHTML = `<code>${v.toString(2).padStart(8, '0')}</code> = ${led.length ? led.join(' + ') : '0'} = <strong>${v}</strong>` + (v === 255 ? ' &nbsp;·&nbsp; alle otte er tændt: større tal kræver en byte mere' : '');
    };
    boks.append(rk, ud); vis();
  };

  /* Slange: spillebrættet er en tabel, slangen en liste af koordinater. Samme start som i koden. */
  F.slange = boks => {
    const N = 12, c = 26;
    let slange, aeble, retning, doed;
    const svg = s('svg', { viewBox: `0 0 ${N * c + 2} ${N * c + 2}`, role: 'img', style: 'max-width: 330px' });
    const felt = []; for (let r = 0; r < N; r++) for (let k = 0; k < N; k++) { const q = s('rect', { x: 1 + k * c, y: 1 + r * c, width: c - 2, height: c - 2, rx: 4, class: 'kasse' }); svg.append(q); felt.push(q); }
    const tekst = h('p', { class: 'figur-resultat', 'aria-live': 'polite' });
    const skridt = h('button', { type: 'button' }, 'Ét skridt'), forfra = h('button', { type: 'button', class: 'sek' }, 'Forfra');
    const ret = [['↑', [-1, 0]], ['←', [0, -1]], ['→', [0, 1]], ['↓', [1, 0]]].map(([t, d]) => { const b = h('button', { type: 'button', class: 'sek', 'aria-label': 'Retning ' + t }, t); b.addEventListener('click', e => { e.stopPropagation(); retning = d; vis(); }); return b; });
    const vis = () => {
      felt.forEach(q => { q.setAttribute('class', 'kasse'); q.style.fill = ''; });
      slange.forEach(([r, k], i) => { felt[r * N + k].style.fill = i === slange.length - 1 ? 'var(--accent-dyb)' : 'var(--accent)'; });
      felt[aeble[0] * N + aeble[1]].style.fill = '#B3261E';
      tekst.innerHTML = `<code>slange = [${slange.map(p => `(${p[0]}, ${p[1]})`).join(', ')}]</code><br><code>retning = (${retning[0]}, ${retning[1]})</code> &nbsp;·&nbsp; længde ${slange.length}` + (doed ? ' &nbsp;·&nbsp; <strong>væggen: spillet er slut</strong>' : '');
      svg.setAttribute('aria-label', `Et spillebræt på ${N} gange ${N} felter. Slangen ligger på ${slange.length} felter, og æblet ligger i række ${aeble[0]}, kolonne ${aeble[1]}.`);
    };
    const start = () => { slange = [[6, 3], [6, 4], [6, 5]]; aeble = [6, 8]; retning = [0, 1]; doed = false; vis(); };
    skridt.addEventListener('click', e => {
      e.stopPropagation(); if (doed) return;
      const ho = [slange[slange.length - 1][0] + retning[0], slange[slange.length - 1][1] + retning[1]];
      if (ho[0] < 0 || ho[1] < 0 || ho[0] >= N || ho[1] >= N) { doed = true; return vis(); }
      slange.push(ho);
      if (ho[0] === aeble[0] && ho[1] === aeble[1]) aeble = [2, 8]; else slange.shift();
      vis();
    });
    forfra.addEventListener('click', e => { e.stopPropagation(); start(); });
    const rk = h('div', { class: 'figur-knapper' }); rk.append(skridt, ...ret, forfra);
    boks.append(svg, rk, tekst); start();
  };

  /* Retur: print() sender til skærmen, return sender en værdi tilbage til koden.  tal="4,8,15,16,23,42" */
  F.retur = boks => {
    const v = attr(boks, 'tal', '4,8,15,16,23,42').split(',').map(Number), gns = v.reduce((a, b) => a + b, 0) / v.length;
    const svg = s('svg', { viewBox: '0 0 560 250', role: 'img', 'aria-label': 'En funktion med to udgange: print sender teksten til skærmen, hvor et menneske kan læse den, og koden får None tilbage. return sender værdien tilbage til koden, som kan regne videre på den.' });
    kasse(svg, 20, 95, 120, 54, `[${v.slice(0, 3).join(', ')}, …]`, { mono: true, fs: 13 });
    svg.append(pil(146, 122, 196, 122));
    const fn = kasse(svg, 200, 80, 150, 84, '', { kl: 'kasse-accent' }); const fnT = s('text', { x: 275, y: 128, 'text-anchor': 'middle', class: 'mono accent-tekst', 'font-size': 16, 'font-weight': 700 }); svg.append(fnT);
    const skaerm = kasse(svg, 400, 20, 150, 70, '', {}); svg.append(s('text', { x: 475, y: 14, 'text-anchor': 'middle', class: 'svag', 'font-size': 13 }, 'skærmen: til mennesket'));
    const kode = kasse(svg, 400, 160, 150, 70, '', {}); svg.append(s('text', { x: 475, y: 248, 'text-anchor': 'middle', class: 'svag', 'font-size': 13 }, 'koden: kan bruges videre'));
    const st = s('text', { x: 475, y: 60, 'text-anchor': 'middle', class: 'mono', 'font-size': 14 }), kt = s('text', { x: 475, y: 200, 'text-anchor': 'middle', class: 'mono', 'font-size': 15, 'font-weight': 700 });
    const p1 = pil(354, 105, 396, 62), p2 = pil(354, 140, 396, 190); svg.append(st, kt, p1, p2); boks.append(svg);
    const tekst = h('span', { 'aria-live': 'polite' });
    const b1 = h('button', { type: 'button' }, 'beskriv(tal): med print'), b2 = h('button', { type: 'button' }, 'gennemsnit(tal): med return');
    const vis = m => {
      fnT.textContent = m ? 'gennemsnit()' : 'beskriv()';
      st.textContent = m ? '' : `Gennemsnit: ${gns}`; kt.textContent = m ? String(gns) : 'None';
      p1.style.opacity = m ? 0.15 : 1; skaerm.r.setAttribute('class', m ? 'kasse' : 'kasse-accent'); kode.r.setAttribute('class', m ? 'kasse-accent' : 'kasse');
      tekst.textContent = m ? `return: værdien ${gns} kommer tilbage og kan gemmes, afrundes eller sammenlignes.` : 'print: tallet står på skærmen, men koden får None ("ingenting") tilbage.';
    };
    b1.addEventListener('click', e => { e.stopPropagation(); vis(0); }); b2.addEventListener('click', e => { e.stopPropagation(); vis(1); });
    const rk = h('div', { class: 'figur-knapper' }); rk.append(b1, b2); boks.append(rk, h('p', { class: 'figur-resultat' })); boks.lastChild.append(tekst); vis(0);
  };

  /* Gren: if / elif / else. Skyderen vælger værdien, og figuren viser, hvilken gren der kører.
     navn="salg" graenser="10000,5000" svar="Højt salg,Middel,Lavt" vaerdi="12400" max="20000" */
  F.gren = boks => {
    const navn = attr(boks, 'navn', 'salg'), gr = attr(boks, 'graenser', '10000,5000').split(',').map(Number), svar = attr(boks, 'svar', 'Højt,Middel,Lavt').split(',');
    const id = 'gren-' + Math.random().toString(36).slice(2, 7), max = +attr(boks, 'max', 20000);
    const ind = h('input', { type: 'range', id, min: 0, max, step: +attr(boks, 'trin', max / 100), value: attr(boks, 'vaerdi', 12400) }), ud = h('output', { for: id });
    const st = h('div', { class: 'styring' }); st.append(h('label', { for: id }, navn + ' ='), ind, ud);
    const H = 44 + svar.length * 58, svg = s('svg', { viewBox: `0 0 540 ${H}`, role: 'img' });
    const rk = svar.map((sv, i) => {
      const y = 12 + i * 58, bet = i < gr.length ? `${i ? 'elif' : 'if'} ${navn} > ${gr[i]}:` : 'else:';
      const b = kasse(svg, 10, y, 230, 44, bet, { mono: true, fs: 15 }), t = s('text', { x: 262, y: y + 28, 'font-size': 15, 'font-weight': 700 }), r = kasse(svg, 350, y, 180, 44, `print("${sv}")`, { mono: true, fs: 14 });
      svg.append(t); return { b, t, r };
    });
    const tekst = h('p', { class: 'figur-resultat', 'aria-live': 'polite' });
    const vis = () => {
      const v = +ind.value; ud.textContent = v.toLocaleString('da-DK'); let valgt = -1;
      rk.forEach((x, i) => {
        const sand = i < gr.length ? v > gr[i] : true;
        if (valgt >= 0) { x.t.textContent = 'springes over'; x.t.setAttribute('class', 'svag'); x.b.style.opacity = x.r.style.opacity = 0.35; x.b.r.setAttribute('class', 'kasse'); x.r.r.setAttribute('class', 'kasse'); return; }
        x.b.style.opacity = 1; x.t.textContent = i < gr.length ? (sand ? 'True →' : 'False ↓') : '→'; x.t.setAttribute('class', sand ? 'accent-tekst' : '');
        if (sand) { valgt = i; x.r.style.opacity = 1; x.b.r.setAttribute('class', 'kasse-accent'); x.r.r.setAttribute('class', 'kasse-accent'); } else { x.r.style.opacity = 0.35; x.b.r.setAttribute('class', 'kasse'); x.r.r.setAttribute('class', 'kasse'); }
      });
      tekst.textContent = `Python tjekker oppefra og ned. Den første betingelse, der er sand, vinder: "${svar[valgt]}".`;
      svg.setAttribute('aria-label', `Betingelserne tjekkes oppefra og ned for ${navn} lig ${v}. Grenen ${svar[valgt]} kører.`);
    };
    ind.addEventListener('input', vis); boks.append(st, svg, tekst); vis();
  };

  /* ============================================================ filer og Git */

  /* Filtræ: klik på en fil eller mappe, og se den absolutte og den relative sti.
     staar="Users/jeppe/Documents/1-bid" (den mappe, man står i) */
  F.filtrae = boks => {
    const stier = liste(boks, 'stier', 'Users;Users/jeppe;Users/jeppe/Desktop;Users/jeppe/Documents;Users/jeppe/Documents/1-bid;Users/jeppe/Documents/1-bid/01-variable.ipynb;Users/jeppe/Documents/1-bid/data;Users/jeppe/Documents/1-bid/data/salg.csv;Users/jeppe/Downloads');
    const staar = attr(boks, 'staar', 'Users/jeppe/Documents/1-bid');
    const trae = h('div', { class: 'filtrae', role: 'group', 'aria-label': 'Et filtræ. Vælg en fil eller mappe for at se dens sti.' });
    const ud = h('p', { class: 'figur-resultat', 'aria-live': 'polite' });
    const rod = h('button', { type: 'button', class: 'node' }, '/  (roden)'); trae.append(rod);
    const kn = stier.map(p => { const d = p.split('/'), b = h('button', { type: 'button', class: 'node' + (p === staar ? ' her' : '') }, (d[d.length - 1].includes('.') ? '📄 ' : '📁 ') + d[d.length - 1] + (p === staar ? '   ← her står I' : '')); b.style.marginLeft = d.length * 22 + 'px'; trae.append(b); return [b, p]; });
    const vis = p => {
      kn.forEach(([b, q]) => b.classList.toggle('valgt', q === p)); rod.classList.toggle('valgt', p === '');
      let rel; if (p === staar) rel = '.'; else if (p.startsWith(staar + '/')) rel = p.slice(staar.length + 1); else { const a = staar.split('/'), b = p ? p.split('/') : []; let i = 0; while (i < a.length && i < b.length && a[i] === b[i]) i++; rel = Array(a.length - i).fill('..').concat(b.slice(i)).join('/'); }
      ud.innerHTML = `<strong>Absolut</strong> (macOS): <code>/${p}</code><br><strong>Absolut</strong> (Windows): <code>C:\\${p.replace(/\//g, '\\')}</code><br><strong>Relativ</strong> fra <code>${staar.split('/').pop()}</code>: <code>${rel}</code>`;
    };
    kn.forEach(([b, p]) => b.addEventListener('click', e => { e.stopPropagation(); vis(p); })); rod.addEventListener('click', e => { e.stopPropagation(); vis(''); });
    boks.append(trae, ud); vis(attr(boks, 'valgt', staar + '/data/salg.csv'));
  };

  /* Terminalen: et mappetræ og en terminal side om side.
     trae="Users/jeppe/Desktop/;Users/jeppe/Documents/;Users/jeppe/Downloads/"  start="/Users/jeppe"  mkdir="1-bid" */
  F.terminal = boks => {
    const rod = { navn: '/', mapper: {}, filer: [] };
    attr(boks, 'trae', 'Users/jeppe/Desktop/;Users/jeppe/Documents/;Users/jeppe/Downloads/').split(';').map(x => x.trim()).filter(Boolean).forEach(sti => {
      const dele = sti.split('/').filter(Boolean); let n = rod;
      dele.forEach((d, i) => {
        const sidste = i === dele.length - 1;
        if (sidste && !sti.endsWith('/') && d.includes('.')) n.filer.push(d);
        else { n.mapper[d] = n.mapper[d] || { navn: d, mapper: {}, filer: [], far: n }; n = n.mapper[d]; }
      });
    });
    const find = sti => sti.split('/').filter(Boolean).reduce((n, d) => n && n.mapper[d], rod);
    let nu = find(attr(boks, 'start', '/Users/jeppe')) || rod;
    const nyMappe = attr(boks, 'mkdir', '');
    const stiTil = n => { const d = []; while (n && n !== rod) { d.unshift(n.navn); n = n.far; } return '/' + d.join('/'); };
    const traeEl = h('div', { class: 'term-trae', 'aria-hidden': 'true' });
    const skaerm = h('div', { class: 'term-skaerm', role: 'log', 'aria-live': 'polite', 'aria-label': 'Terminal' });
    const knapper = h('div', { class: 'figur-knapper term-knapper' });
    const wrap = h('div', { class: 'term' }); wrap.append(traeEl, skaerm); boks.append(wrap, knapper);
    const tegnTrae = () => {
      traeEl.innerHTML = '';
      const ul = (n, dybde) => {
        const l = h('ul');
        Object.values(n.mapper).forEach(m => {
          const li = h('li', { class: m === nu ? 'nu' : '' }); li.append(h('span', { class: 'mappe' }, m.navn + '/'));
          if (Object.keys(m.mapper).length || m.filer.length) li.append(ul(m, dybde + 1));
          l.append(li);
        });
        n.filer.forEach(f => l.append(h('li', {}, h('span', { class: 'fil' }, f))));
        return l;
      };
      const top = h('ul'); const li = h('li', { class: nu === rod ? 'nu' : '' }); li.append(h('span', { class: 'mappe' }, '/'), ul(rod, 1)); top.append(li); traeEl.append(top);
    };
    const skriv = (kmd, svar, fejl) => {
      const p = h('div', { class: 'term-linje' }); p.append(h('span', { class: 'term-prompt' }, '$ '), document.createTextNode(kmd)); skaerm.append(p);
      if (svar) skaerm.append(h('div', { class: 'term-svar' + (fejl ? ' fejl' : '') }, svar));
      while (skaerm.children.length > 14) skaerm.removeChild(skaerm.firstChild);
      skaerm.scrollTop = skaerm.scrollHeight;
    };
    const knap = (t, f) => { const b = h('button', { type: 'button', class: 'sek' }, t); b.addEventListener('click', e => { e.stopPropagation(); f(); tegn(); }); knapper.append(b); };
    const tegn = () => {
      tegnTrae(); knapper.innerHTML = '';
      knap('pwd', () => skriv('pwd', stiTil(nu)));
      knap('ls', () => skriv('ls', Object.keys(nu.mapper).concat(nu.filer).join('   ') || '(tom mappe)'));
      Object.keys(nu.mapper).forEach(m => knap('cd ' + m, () => { nu = nu.mapper[m]; skriv('cd ' + m); }));
      if (nu !== rod) knap('cd ..', () => { nu = nu.far; skriv('cd ..'); });
      if (nyMappe && !nu.mapper[nyMappe] && stiTil(nu) === attr(boks, 'start', '/Users/jeppe')) knap('mkdir ' + nyMappe, () => { nu.mapper[nyMappe] = { navn: nyMappe, mapper: {}, filer: [], far: nu }; skriv('mkdir ' + nyMappe); });
    };
    skriv('pwd', stiTil(nu)); tegn();
  };

  /* VCS: tre måder at holde styr på versioner: lokal, central og distribueret */
  F.vcs = boks => {
    const svg = s('svg', { viewBox: '0 0 760 250', role: 'img', 'aria-label': 'Tre modeller for versionskontrol. Lokal: historikken ligger kun på én computer. Central: én server har historikken, og alle henter derfra. Distribueret: serveren og hver eneste computer har hele historikken.' });
    const hist = (g, x, y) => { [0, 1, 2].forEach(i => g.append(s('circle', { cx: x + i * 16, cy: y, r: 5, class: 'accent-fyld' }))); g.append(s('line', { x1: x, x2: x + 32, y1: y, y2: y, 'stroke-width': 2, class: 'accent-streg' })); };
    const pc = (g, x, y, t, medHist) => { kasse(g, x, y, 100, 56, t, { fs: 13 }); if (medHist) hist(g, x + 34, y + 44); };
    const g1 = s('g'), g2 = s('g'), g3 = s('g'); svg.append(g1, g2, g3);
    g1.append(s('text', { x: 110, y: 22, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 700 }, 'Lokal')); pc(g1, 60, 110, 'din computer', true);
    g2.append(s('text', { x: 380, y: 22, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 700 }, 'Central')); pc(g2, 330, 40, 'server', true); pc(g2, 270, 170, 'computer A'); pc(g2, 390, 170, 'computer B'); g2.append(pil(320, 168, 362, 100), pil(440, 168, 398, 100));
    g3.append(s('text', { x: 640, y: 22, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 700 }, 'Distribueret (Git)')); pc(g3, 590, 40, 'server', true); pc(g3, 530, 170, 'computer A', true); pc(g3, 650, 170, 'computer B', true); g3.append(pil(580, 168, 622, 100), pil(700, 168, 658, 100), pil(622, 100, 580, 168), pil(658, 100, 700, 168));
    boks.append(svg);
    trin(boks, 3, n => [g1, g2, g3].forEach((g, i) => (g.style.opacity = i <= n ? 1 : 0.12)), ['Lokal: historikken (de tre prikker) ligger kun hos dig. Dør disken, dør historikken.', 'Central: én server har historikken. Nemt at samarbejde, indtil serveren går ned.', 'Distribueret: alle har en fuld kopi af hele historikken. Sådan virker Git.']);
  };

  /* Git: de tre stadier, og hvordan en ændring flytter sig.  fil="analyse.ipynb"  remote="ja" viser også GitHub */
  F.git = boks => {
    const fil = attr(boks, 'fil', 'analyse.ipynb'), rem = attr(boks, 'remote', 'ja') === 'ja';
    const kol = ['Working directory\nmappen, I arbejder i', 'Staging area\npakkelisten', 'Repository\nhistorikken (.git)'].concat(rem ? ['GitHub\nden delte kopi'] : []);
    const w = 760 / kol.length, svg = s('svg', { viewBox: '0 0 760 230', role: 'img', 'aria-label': 'En ændring flytter sig gennem Git: fra working directory til staging area med git add, videre til repository med git commit, og til GitHub med git push.' });
    kol.forEach((k, i) => { svg.append(s('rect', { x: i * w + 6, y: 10, width: w - 12, height: 210, rx: 10, class: 'kasse' })); k.split('\n').forEach((l, j) => svg.append(s('text', { x: i * w + w / 2, y: 34 + j * 18, 'text-anchor': 'middle', 'font-size': j ? 13 : 16, 'font-weight': j ? 400 : 700, class: j ? 'svag' : '' }, l))); });
    const chip = s('g', { style: 'transition: transform 0.6s' }); chip.append(s('rect', { x: 0, y: 0, width: w - 44, height: 38, rx: 19, class: 'kasse-accent' })); const ct = s('text', { x: (w - 44) / 2, y: 24, 'text-anchor': 'middle', class: 'mono accent-tekst', 'font-size': 13, 'font-weight': 700 }); chip.append(ct); svg.append(chip);
    const commit = i => { const g = s('g'); g.append(s('circle', { cx: i * w + w / 2 - 40, cy: 175, r: 10, class: 'accent-fyld' }), s('text', { x: i * w + w / 2 - 22, y: 180, class: 'mono', 'font-size': 13 }, 'a3f9c1e')); svg.append(g); return g; };
    const cRepo = commit(2), cHub = rem ? commit(3) : null;
    const kom = h('code', { class: 'figur-kode' }); const p = h('p', { class: 'figur-resultat' }); p.append(kom); boks.append(svg, p);
    const T = [
      { x: 0, t: fil, k: '(I gemmer filen i VS Code)', tx: 'Filen er ændret. Git kan se det, men gemmer ikke noget af sig selv.', vis: 1 },
      { x: 1, t: fil, k: `git add ${fil}`, tx: 'git add lægger ændringen på pakkelisten: det, der skal med i næste commit.', vis: 1 },
      { x: 2, t: fil, k: 'git commit -m "Tilføj analyse"', tx: 'git commit gemmer et øjebliksbillede i historikken, med et fingeraftryk. Stadig kun på jeres computer.', vis: 0, c: 1 }
    ].concat(rem ? [{ x: 3, t: '', k: 'git push', tx: 'git push sender de nye commits op til GitHub, så andre kan hente dem med git pull.', vis: 0, c: 2 }] : []);
    trin(boks, T.length, n => {
      const t = T[n]; chip.style.transform = `translate(${t.x * w + 22}px, 100px)`; chip.setAttribute('transform', rolig() ? `translate(${t.x * w + 22} 100)` : ''); chip.style.opacity = t.vis; ct.textContent = t.t + (n === 0 ? ' •' : '');
      cRepo.style.opacity = (t.c || 0) >= 1 ? 1 : 0; if (cHub) cHub.style.opacity = (t.c || 0) >= 2 ? 1 : 0; kom.textContent = t.k;
    }, T.map(t => t.tx));
  };

  /* Fork: fra andres repository til jeres egen kopi og tilbage med en pull request.  original="jeppeFQ" */
  F.fork = boks => {
    const org = attr(boks, 'original', 'jeppeFQ'), repo = attr(boks, 'repo', 'BID-workshop-projekt');
    const svg = s('svg', { viewBox: '0 0 760 260', role: 'img', 'aria-label': 'Fork-arbejdsgangen: lav en fork på GitHub, klon den til din computer, commit og push til din fork, og åbn en pull request til det oprindelige repository.' });
    svg.append(s('rect', { x: 6, y: 6, width: 748, height: 118, rx: 12, class: 'kasse', style: 'fill: none; stroke-dasharray: 6 5' }), s('text', { x: 20, y: 28, class: 'svag', 'font-size': 14 }, 'GitHub'), s('rect', { x: 6, y: 138, width: 748, height: 116, rx: 12, class: 'kasse', style: 'fill: none; stroke-dasharray: 6 5' }), s('text', { x: 20, y: 160, class: 'svag', 'font-size': 14 }, 'jeres computer'));
    kasse(svg, 60, 44, 260, 60, `${org}/${repo}\noriginalen`, { fs: 14 }); const fork = kasse(svg, 440, 44, 260, 60, `jeres-navn/${repo}\njeres fork`, { fs: 14 }); const lokal = kasse(svg, 440, 176, 260, 60, 'en lokal kopi\ni VS Code', { fs: 14 });
    const mk = (el, x, y, t) => { const g = s('g'); g.append(el, s('text', { x, y, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 700, class: 'accent-tekst' }, t)); svg.append(g); return g; };
    const P = [mk(pil(324, 62, 436, 62, 'accent-streg'), 380, 54, '1 · fork'), mk(pil(520, 108, 520, 172, 'accent-streg'), 478, 146, '2 · clone'), mk(s('path', { d: 'M 704 196 q 36 10 0 26', 'stroke-width': 2.5, class: 'accent-streg' }), 716, 172, '3 · commit'), mk(pil(620, 172, 620, 108, 'accent-streg'), 664, 146, '4 · push'), mk(pil(436, 88, 324, 88, 'accent-streg'), 380, 110, '5 · pull request')];
    boks.append(svg);
    trin(boks, 6, n => { P.forEach((g, i) => (g.style.opacity = i < n ? 1 : 0)); fork.style.opacity = n >= 1 ? 1 : 0.2; lokal.style.opacity = n >= 2 ? 1 : 0.2; },
      ['I må ikke skrive i originalen. Den tilhører en anden.', '1. Fork: GitHub laver jeres egen kopi under jeres konto.', '2. Clone: hent JERES fork (ikke originalen) ned på computeren.', '3. Commit: arbejd, og gem ændringerne i historikken, lokalt.', '4. Push: send jeres commits op til jeres fork.', '5. Pull request: bed ejeren om at trække jeres ændringer ind i originalen.']);
  };

  /* Branch: en parallel udviklingslinje, der flettes ind igen */
  F.branch = boks => {
    const svg = s('svg', { viewBox: '0 0 700 190', role: 'img', 'aria-label': 'En branch forgrener sig fra main, får to commits og flettes ind i main igen med et merge.' });
    svg.append(s('text', { x: 10, y: 54, 'font-size': 15, 'font-weight': 700 }, 'main'), s('text', { x: 10, y: 144, 'font-size': 15, 'font-weight': 700, class: 'accent-tekst' }, 'ny-figur'));
    const D = [];
    const lin = (x1, y1, x2, y2, kl) => { const l = s('line', { x1, y1, x2, y2, 'stroke-width': 4, class: kl }); svg.append(l); return l; };
    const pr = (x, y, kl) => { const c = s('circle', { cx: x, cy: y, r: 11, class: kl }); svg.append(c); return c; };
    D.push([lin(100, 50, 220, 50, 'streg'), pr(100, 50, 'kasse'), pr(220, 50, 'kasse')]);
    D.push([lin(220, 50, 300, 140, 'accent-streg')]);
    D.push([pr(300, 140, 'accent-fyld'), lin(300, 140, 420, 140, 'accent-streg'), pr(420, 140, 'accent-fyld')]);
    D.push([lin(220, 50, 400, 50, 'streg'), pr(400, 50, 'kasse')]);
    D.push([lin(400, 50, 560, 50, 'streg'), lin(420, 140, 560, 50, 'accent-streg'), pr(560, 50, 'accent-fyld')]);
    svg.querySelectorAll('circle.kasse').forEach(c => c.setAttribute('stroke-width', 3));
    const kom = h('code', { class: 'figur-kode' }); const p = h('p', { class: 'figur-resultat' }); p.append(kom); boks.append(svg, p);
    const K = ['git log --oneline', 'git checkout -b ny-figur', 'git add …   git commit -m "…"   (to gange)', '(imens: en anden committer på main)', 'git checkout main   git merge ny-figur'];
    trin(boks, 5, n => { D.forEach((d, i) => d.forEach(e => (e.style.opacity = i <= n ? 1 : 0))); kom.textContent = K[n]; },
      ['main: hovedlinjen med to commits.', 'En branch er en parallel linje. Her kan I eksperimentere uden at røre main.', 'Arbejdet committes på branchen. main er uændret.', 'main kan godt bevæge sig videre imens.', 'Merge fletter branchens ændringer ind i main.']);
  };

  /* .gitignore: hvilke filer Git ser bort fra, mønster for mønster */
  F.gitignore = boks => {
    const filer = ['README.md', 'analyse.ipynb', 'noter.txt', 'important.txt', 'temp/mellemregning.csv', 'src/temp/cache.csv', 'data/raa/stor.csv'];
    const T = [
      { l: [], ign: [], tx: 'Ingen .gitignore: Git holder øje med alle filer i mappen.' },
      { l: ['*.txt'], ign: [2, 3], ny: 0, tx: '*.txt: alle filer, der ender på .txt, uanset hvor de ligger.' },
      { l: ['*.txt', 'temp/'], ign: [2, 3, 4, 5], ny: 1, tx: 'temp/: alle mapper, der hedder temp, og alt i dem. Også src/temp.' },
      { l: ['*.txt', 'temp/', '!important.txt'], ign: [2, 4, 5], ny: 2, tx: '!important.txt: undtagelsen. Den fil skal Git alligevel holde øje med.' },
      { l: ['*.txt', '/temp/', '!important.txt'], ign: [2, 4], ny: 1, tx: '/temp/: skråstregen foran betyder kun mappen temp i roden. src/temp er med igen.' },
      { l: ['*.txt', '/temp/', '!important.txt', 'data/**/*.csv'], ign: [2, 4, 6], ny: 3, tx: '**: mapper på alle niveauer. Alle .csv-filer et sted under data/.' }
    ];
    const svg = s('svg', { viewBox: '0 0 760 280', role: 'img', 'aria-label': 'En .gitignore-fil til venstre og projektets filer til højre. For hvert nyt mønster i .gitignore bliver nogle filer streget over: dem ser Git bort fra.' });
    svg.append(s('rect', { x: 6, y: 10, width: 300, height: 262, rx: 10, class: 'kasse' }), s('text', { x: 22, y: 36, 'font-size': 15, 'font-weight': 700, class: 'mono' }, '.gitignore'));
    const linjer = [0, 1, 2, 3].map(i => { const t = s('text', { x: 26, y: 76 + i * 34, 'font-size': 17, class: 'mono' }); svg.append(t); return t; });
    svg.append(s('text', { x: 336, y: 36, 'font-size': 15, 'font-weight': 700 }, 'Filerne i projektmappen'));
    const rk = filer.map((f, i) => {
      const y = 50 + i * 31, g = s('g');
      const t = s('text', { x: 336, y: y + 20, 'font-size': 16, class: 'mono' }, f), m = s('text', { x: 744, y: y + 20, 'font-size': 13, 'text-anchor': 'end', class: 'svag' }, '');
      const streg = s('line', { x1: 332, x2: 340 + f.length * 9.8, y1: y + 14, y2: y + 14, 'stroke-width': 2, class: 'accent-streg' });
      g.append(t, streg, m); svg.append(g); g.t = t; g.m = m; g.streg = streg; return g;
    });
    const res = h('p', { class: 'figur-resultat', 'aria-live': 'polite' }); boks.append(svg, res);
    trin(boks, T.length, n => {
      const t = T[n];
      linjer.forEach((el, i) => { el.textContent = t.l[i] || ''; el.setAttribute('class', 'mono' + (i === t.ny ? ' accent-tekst' : '')); el.setAttribute('font-weight', i === t.ny ? 700 : 400); });
      rk.forEach((g, i) => { const ig = t.ign.includes(i); g.t.style.opacity = ig ? 0.45 : 1; g.streg.style.opacity = ig ? 1 : 0; g.m.textContent = ig ? 'ignoreret' : ''; });
      const ign = t.ign.length; res.textContent = ign ? `Git ser bort fra ${ign} af ${filer.length} filer.` : `Git holder øje med alle ${filer.length} filer.`;
    }, T.map(t => t.tx));
  };

  /* fetch, pull og push: hvad flytter sig hvorhen? */
  F.synk = boks => {
    const svg = s('svg', { viewBox: '0 0 760 260', role: 'img', 'aria-label': 'Tre rækker af commits: GitHub, det Git har hentet, og jeres egen branch. git fetch henter en ny commit uden at røre jeres filer, git merge fletter den ind, og git push sender jeres egen commit op til GitHub.' });
    const ry = [50, 130, 210], navne = [['GitHub', 'den delte kopi'], ['Hentet', 'men ikke flettet ind'], ['Jeres branch', 'filerne i mappen']];
    navne.forEach((nv, i) => { svg.append(s('rect', { x: 6, y: ry[i] - 30, width: 748, height: 60, rx: 10, class: 'kasse', style: 'fill: none' }), s('text', { x: 22, y: ry[i] - 3, 'font-size': 16, 'font-weight': 700 }, nv[0]), s('text', { x: 22, y: ry[i] + 16, 'font-size': 13, class: 'svag' }, nv[1])); });
    const X = [230, 320, 410, 500, 590], navn = ['A', 'B', 'C', 'D', 'E'];
    const prik = (k, r) => { const g = s('g'); if (k) g.append(s('line', { x1: X[k - 1] + 13, x2: X[k] - 13, y1: ry[r], y2: ry[r], 'stroke-width': 3, class: 'streg' })); g.append(s('circle', { cx: X[k], cy: ry[r], r: 13, class: k >= 3 ? 'accent-fyld' : 'kasse' }), s('text', { x: X[k], y: ry[r] + 5, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 700, class: k >= 3 ? 'paa-accent' : '' }, navn[k])); svg.append(g); return g; };
    [0, 1, 2].forEach(k => [0, 1, 2].forEach(r => prik(k, r)));
    const D = [prik(3, 0), prik(3, 1), prik(3, 2)], E = [prik(4, 2), prik(4, 1), prik(4, 0)];
    const fetchP = pil(X[3], ry[0] + 16, X[3], ry[1] - 16, 'accent-streg'), mergeP = pil(X[3], ry[1] + 16, X[3], ry[2] - 16, 'accent-streg'), pushP = pil(X[4] + 24, ry[2] - 8, X[4] + 24, ry[0] + 8, 'accent-streg');
    svg.append(fetchP, mergeP, pushP);
    const kom = h('code', { class: 'figur-kode' }); const p = h('p', { class: 'figur-resultat' }); p.append(kom); boks.append(svg, p);
    const T = [
      { d: 1, e: 0, k: '', tx: 'En gruppekammerat har pushet commit D til GitHub. Jeres computer kender den ikke endnu.' },
      { d: 2, e: 0, f: 1, k: 'git fetch', tx: 'git fetch henter D, men lægger den til side. Jeres filer er de samme som før.' },
      { d: 3, e: 0, m: 1, k: 'git merge', tx: 'git merge fletter D ind i jeres branch. Nu er filerne opdateret. git pull gør begge dele i ét hug.' },
      { d: 3, e: 1, k: 'git commit -m "…"', tx: 'I arbejder og committer E. Den findes kun på jeres computer.' },
      { d: 3, e: 3, u: 1, k: 'git push', tx: 'git push sender E op til GitHub, så de andre kan hente den.' }
    ];
    trin(boks, T.length, n => {
      const t = T[n]; D.forEach((g, i) => (g.style.opacity = i < t.d ? 1 : 0)); E.forEach((g, i) => (g.style.opacity = i < t.e ? 1 : 0));
      fetchP.style.opacity = t.f ? 1 : 0; mergeP.style.opacity = t.m ? 1 : 0; pushP.style.opacity = t.u ? 1 : 0; kom.textContent = t.k;
    }, T.map(t => t.tx));
  };

  /* ============================================================ lag, design og objekter */

  /* Lag: en forespørgsel rejser ned gennem lagene og tilbage.  lag="Terminalen|viser tekst;Skallen|finder programmet"  retur="ja" */
  F.lag = boks => {
    const L = liste(boks, 'lag').map(x => x.split('|').map(y => y.trim())), retur = attr(boks, 'retur', 'ja') === 'ja', lh = Math.min(46, 300 / L.length);
    const H = 16 + L.length * lh, svg = s('svg', { viewBox: `0 0 560 ${H}`, role: 'img', 'aria-label': 'Lag oven på hinanden: ' + L.map(l => l[0]).join(', ') + '. Hvert lag taler kun med laget lige under.' });
    const rk = L.map((l, i) => { const y = 8 + i * lh, g = s('g'); const r = s('rect', { x: 60, y, width: 440, height: lh - 8, rx: 8, class: 'kasse' }); g.append(r, s('text', { x: 280, y: y + (lh - 8) / 2 + 6, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 700 }, l[0])); svg.append(g); g.r = r; return g; });
    const ned = s('text', { x: 30, y: 0, 'text-anchor': 'middle', 'font-size': 26, class: 'accent-tekst', style: 'transition: y 0.4s' }, '↓'); svg.append(ned); boks.append(svg);
    const T = [{ i: -1, tx: attr(boks, 'start', 'Forespørgslen starter øverst.') }].concat(L.map((l, i) => ({ i, tx: `${i + 1}. ${l[0]}: ${l[1] || ''}` })));
    if (retur) T.push({ i: -2, tx: attr(boks, 'slut', 'Svaret kommer tilbage gennem de samme lag, i omvendt rækkefølge.') });
    trin(boks, T.length, n => {
      const t = T[n]; rk.forEach((g, i) => { g.r.setAttribute('class', i === t.i ? 'kasse-accent' : 'kasse'); g.style.opacity = t.i === -1 || t.i === -2 || i <= t.i ? 1 : 0.35; });
      ned.textContent = t.i === -2 ? '↑' : '↓'; ned.setAttribute('y', t.i < 0 ? (t.i === -2 ? 34 : -20) : 8 + t.i * lh + lh / 2 + 4); ned.style.opacity = t.i === -1 ? 0 : 1;
    }, T.map(t => t.tx));
  };

  /* Percentil: hvor ligger en andel i fordelingen?  p25="0.30" p50="0.45" p75="0.60" andel="0.42" navn="andel" */
  F.percentil = boks => {
    const p25 = +attr(boks, 'p25', 0.30), p50 = +attr(boks, 'p50', 0.45), p75 = +attr(boks, 'p75', 0.60), navn = attr(boks, 'navn', 'andel');
    const id = 'pct-' + Math.random().toString(36).slice(2, 7);
    const ind = h('input', { type: 'range', id, min: 0, max: 1, step: 0.01, value: attr(boks, 'andel', 0.42) }), ud = h('output', { for: id });
    const st = h('div', { class: 'styring' }); st.append(h('label', { for: id }, navn + ' ='), ind, ud);
    const X = v => 30 + v * 500, svg = s('svg', { viewBox: '0 0 560 130', role: 'img' });
    const zoner = [[0, p25, 'lav'], [p25, p75, 'middel'], [p75, 1, 'hoej']].map(([a, b, t]) => { const r = s('rect', { x: X(a), y: 40, width: X(b) - X(a), height: 36, class: 'kasse' }); svg.append(r, s('text', { x: (X(a) + X(b)) / 2, y: 64, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 700 }, `"${t}"`)); return r; });
    [[p25, 'p25'], [p50, 'p50'], [p75, 'p75']].forEach(([v, t]) => svg.append(s('line', { x1: X(v), x2: X(v), y1: 34, y2: 82, 'stroke-width': t === 'p50' ? 1.5 : 3, 'stroke-dasharray': t === 'p50' ? '4 4' : '', class: 'streg' }), s('text', { x: X(v), y: 100, 'text-anchor': 'middle', class: 'mono svag', 'font-size': 13 }, `${t} = ${f2(v)}`)));
    svg.querySelectorAll('text.mono.svag')[1].setAttribute('y', 120);
    const mk = s('path', { d: 'M 0 0 l -10 -16 h 20 z', class: 'accent-fyld' }); svg.append(mk);
    const tekst = h('p', { class: 'figur-resultat', 'aria-live': 'polite' });
    const vis = () => {
      const v = +ind.value, z = v < p25 ? 0 : v < p75 ? 1 : 2; ud.textContent = f2(v); mk.setAttribute('transform', `translate(${X(v)} 38)`);
      zoner.forEach((r, i) => r.setAttribute('class', i === z ? 'kasse-accent' : 'kasse'));
      tekst.innerHTML = [`<code>${f2(v)} &lt; ${f2(p25)}</code> er sand: <strong>"lav"</strong>`, `<code>${f2(v)} &lt; ${f2(p25)}</code> er falsk, <code>${f2(v)} &lt; ${f2(p75)}</code> er sand: <strong>"middel"</strong>`, `ingen af betingelserne er sande: <code>else</code> giver <strong>"hoej"</strong>`][z];
      svg.setAttribute('aria-label', `En tallinje fra 0 til 1 delt i lav, middel og høj ved ${p25} og ${p75}. Andelen ${v} ligger i ${['lav', 'middel', 'høj'][z]}.`);
    };
    ind.addEventListener('input', vis); boks.append(st, svg, tekst); vis();
  };

  /* Klasse: en skabelon, der bliver til objekter.
     navn="Arbejdsplads" ved="navn,ansatte,kvinder" kan="andel_kvinder()" objekter="Skolen,120,84;Værket,240,31;Rådhuset,95,58" */
  F.klasse = boks => {
    const navn = attr(boks, 'navn', 'Klasse'), ved = attr(boks, 'ved', '').split(','), kan = attr(boks, 'kan', '').split(','), obj = liste(boks, 'objekter').map(x => x.split(','));
    const wrap = h('div', { class: 'klasse-figur', role: 'img', 'aria-label': `Klassen ${navn} er en skabelon med attributterne ${ved.join(', ')} og metoderne ${kan.join(', ')}. Ud fra den laves objekterne ${obj.map(o => o[0]).join(', ')}, som hver har sine egne værdier.` });
    const kort = (titel, linjer, kl) => { const d = h('div', { class: 'kort ' + (kl || '') }); d.append(h('strong', {}, titel)); linjer.forEach(l => d.append(h('code', {}, l))); return d; };
    const skab = kort('class ' + navn, ved.map(v => 'self.' + v.trim()).concat(kan.map(k => 'def ' + k.trim())), 'skabelon');
    const ob = obj.map(o => kort(o[0].toLowerCase() + ' (et objekt)', ved.map((v, i) => `${v.trim()} = ${isNaN(o[i]) ? `"${o[i]}"` : o[i]}`)));
    const res = h('p', { class: 'figur-resultat', 'aria-live': 'polite' });
    const hoejre = h('div', { class: 'objekter' }); ob.forEach(o => hoejre.append(o)); wrap.append(skab, h('span', { class: 'figur-pil', 'aria-hidden': 'true' }, '→'), hoejre); boks.append(wrap, res);
    const andel = o => { const a = +o[ved.length - 1] / +o[ved.length - 2]; return isFinite(a) ? Math.round(a * 100) + ' %' : ''; };
    trin(boks, obj.length + 2, n => {
      ob.forEach((o, i) => { o.style.opacity = i < n ? 1 : 0; o.classList.toggle('aktiv', n === obj.length + 1 && i === 0); });
      res.innerHTML = n === obj.length + 1 && obj.length ? `<code>${obj[0][0].toLowerCase()}.${kan[0].trim()}</code> regner på <em>sine egne</em> tal: ${obj[0][ved.length - 1]} / ${obj[0][ved.length - 2]} = <strong>${andel(obj[0])}</strong>` : '';
    }, [`Klassen er en skabelon: det, en ${navn} VED (attributter), og det, den KAN (metoder).`].concat(obj.map(o => `${o[0].toLowerCase()} = ${navn}("${o[0]}", ${o.slice(1).join(', ')}): et nyt objekt med sine egne værdier.`), ['Samme metode, forskellige objekter: hvert objekt svarer ud fra sine egne tal.']));
  };

  /* Sekvens: hvem spørger hvem, i hvilken rækkefølge.
     aktoerer="Bruger,app.py,Barometer"  beskeder="0>1:taster tal ind;1>2:vurder(arbejdsplads);2>1!:et Resultat"   (! = svar, stiplet) */
  F.sekvens = boks => {
    const A = attr(boks, 'aktoerer', '').split(',').map(x => x.trim()), M = liste(boks, 'beskeder').map(x => { const m = x.match(/^(\d+)>(\d+)(!?):(.*)$/); return { fra: +m[1], til: +m[2], svar: !!m[3], t: m[4].trim() }; });
    const B = 760, w = B / A.length, H = 70 + M.length * 34, X = i => i * w + w / 2;
    const svg = s('svg', { viewBox: `0 0 ${B} ${H}`, role: 'img', 'aria-label': 'Et sekvensdiagram: ' + M.map(m => `${A[m.fra]} ${m.svar ? 'svarer' : 'spørger'} ${A[m.til]}: ${m.t}`).join('. ') + '.' });
    A.forEach((a, i) => { kasse(svg, X(i) - Math.min(70, w / 2 - 6), 6, Math.min(140, w - 12), 34, a, { fs: 14, fed: true }); svg.append(s('line', { x1: X(i), x2: X(i), y1: 40, y2: H - 6, 'stroke-dasharray': '4 5', class: 'streg', style: 'opacity: 0.5' })); });
    const G = M.map((m, k) => { const y = 66 + k * 34, g = s('g'), p = pil(X(m.fra) + (m.til > m.fra ? 4 : -4), y, X(m.til) + (m.til > m.fra ? -4 : 4), y, 'accent-streg'); if (m.svar) p.setAttribute('stroke-dasharray', '6 5'); g.append(p, s('text', { x: (X(m.fra) + X(m.til)) / 2, y: y - 7, 'text-anchor': 'middle', class: 'mono', 'font-size': 13 }, m.t)); svg.append(g); return g; });
    boks.append(svg);
    trin(boks, M.length + 1, n => G.forEach((g, i) => (g.style.opacity = i < n ? (i === n - 1 ? 1 : 0.45) : 0)), ['Læs oppefra og ned: tiden går nedad.'].concat(M.map((m, i) => `${i + 1}. ${A[m.fra]} ${m.svar ? 'svarer' : '→'} ${A[m.til]}: ${m.t}`)));
  };

  /* Sætning: fra kundens sætning til klasser, metoder og betingelser.
     tekst="En [arbejdsplads|k] med [mindst 50|b] [ansatte|k] skal kunne [se|m] ..."   k = klasse, m = metode, b = betingelse */
  F.saetning = boks => {
    const raa = attr(boks, 'tekst', ''), navne = { k: 'klasser (navneord)', m: 'metoder (udsagnsord)', b: 'betingelser (tal og regler)' };
    const p = h('p', { class: 'saetning' }); let sidste = 0; const re = /\[([^\]|]+)\|([kmb])\]/g; let m; const fundet = { k: [], m: [], b: [] };
    while ((m = re.exec(raa))) { p.append(raa.slice(sidste, m.index)); const sp = h('span', { class: 'led led-' + m[2] }, m[1]); p.append(sp); fundet[m[2]].push(m[1]); sidste = re.lastIndex; }
    p.append(raa.slice(sidste));
    const wrap = h('div', { role: 'img', 'aria-label': 'Kundens sætning med markeringer. Kandidater til klasser: ' + fundet.k.join(', ') + '. Kandidater til metoder: ' + fundet.m.join(', ') + '. Betingelser: ' + fundet.b.join(', ') + '.' }); wrap.append(p);
    const res = h('p', { class: 'figur-resultat', 'aria-live': 'polite' }); boks.append(wrap, res);
    const R = ['', 'k', 'm', 'b'];
    trin(boks, 4, n => { p.dataset.vis = R.slice(1, n + 1).join(''); res.innerHTML = n ? `<strong>${navne[R[n]]}:</strong> ${fundet[R[n]].join(', ')}` : ''; },
      ['Kundens sætning, som den blev sagt.', 'Navneordene er kandidater til klasser.', 'Udsagnsordene er kandidater til metoder.', 'Tal og regler bliver til betingelser.']);
  };

  window.sds1.figurStart();
})();
