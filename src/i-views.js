/* ---------- impact lists ---------- */
function eventsOn(sym, d) {
  const s = cser(sym), i = idxOn(s._t, d), from = i > 0 ? s._t[i - 1] : d, inWin = x => x > from && x <= d, ev = [];
  D.stories.forEach(st => { if ((st.px || st.sym) === sym || st.tk === sym) st.tl.forEach(e => { if (inWin(e.d)) ev.push({ k: "e", t: e.t, st }); }); });
  D.statements.forEach(x => { if (inWin(x.d) && (x.a || []).includes(sym)) ev.push({ k: "s", s: x }); });
  D.moves.forEach(m => { if (m.d && inWin(m.d) && m.tk.split("·").includes(sym)) ev.push({ k: "m", m }); });
  D.calendar.forEach(c => { if (inWin(c.d) && (c.aff || []).includes(sym)) ev.push({ k: "c", t: c.t }); });
  return ev;
}
function bigMoves() {
  if (bigMoves.c) return bigMoves.c;
  const syms = [...new Set(D.desk.rail.concat(D.stories.map(s => s.px || s.sym).filter(Boolean), D.desk.cfd.map(c => c.ref).filter(Boolean)))], out = [];
  syms.forEach(sym => {
    const s = ser(sym); if (!s || s.c.length < 40) return;
    for (let i = Math.max(1, s.c.length - 30); i < s.c.length; i++) { const r = react(sym, s._t[i]); if (r && r.big) out.push({ ...r, ev: eventsOn(sym, r.d) }); }
  });
  return bigMoves.c = out.sort((a, b) => a.d < b.d ? 1 : a.d > b.d ? -1 : Math.abs(b.z) - Math.abs(a.z));
}
function evLine(e) {
  if (e.k === "s") return h("div", { class: "bd-e" }, h("span", { style: "color:" + MKC[e.s.s] }, ST[e.s.s].g + " "), h("a", { href: href("a", e.s.id) }, whoName(e.s)), ": " + short(e.s.t, 120));
  if (e.k === "m") return h("div", { class: "bd-e" }, h("span", { style: "color:" + (AC[e.m.ac].buy ? MKC.bull : MKC.bear) }, "◆ "), who(e.m.p), " · " + AC[e.m.ac].l + " " + e.m.nm + ": " + e.m.det);
  if (e.k === "c") return h("div", { class: "bd-e" }, h("span", { style: "color:var(--ink-3)" }, "◇ Termin: "), e.t);
  return h("div", { class: "bd-e" }, h("span", { style: "color:#ff8a2a" }, "◆ "), h("a", { href: href("s", e.st.id) }, e.st.t), ": " + short(e.t, 150));
}
function bigDays(max, full) {
  const L = bigMoves();
  if (!L.length) return h("p", { class: "empty" }, "Kein Tag mit ungewöhnlich großer Bewegung in den letzten 30 Handelstagen.");
  return h("ul", { class: "list bd" }, (max ? L.slice(0, max) : L).map(r => h("li", {}, h("time", { datetime: r.d }, fmtS(r.d)),
    h("div", {},
      h("div", { class: "bd-h" }, tkChip(r.sym), h("span", { class: "mono", style: "color:var(--ink)" }, arrow(r.day), sign(r.day, 1) + r.u), h("span", { class: "srow-f" }, nf(Math.abs(r.z), 1) + "-fache Tagesschwankung")),
      r.ev.length ? [r.ev.slice(0, full ? 6 : 2).map(evLine), r.ev.length > (full ? 6 : 2) ? h("div", { class: "srow-f" }, "und " + (r.ev.length - (full ? 6 : 2)) + " weitere") : null] : h("div", { class: "srow-f" }, "Kein erfasstes Ereignis an diesem Tag.")))));
}

/* ---------- rotation pieces ---------- */
function rankRows(list) {
  const max = Math.max(1, ...list.map(r => Math.abs(r.r1)));
  return [h("div", { class: "rk rk-h" }, h("span", {}, "Korb"), h("span", { class: "rk-ax" }, h("span", {}, "← schwächer"), h("span", {}, "stärker →")), h("span", {}, "1 M"), h("span", {}, "3 M")),
    list.slice().sort((a, b) => b.r1 - a.r1).map(r => withTip(h("a", { class: "rk", href: href("t", r.k), "aria-label": r.l + ": " + sign(r.r1, 1) + " Prozentpunkte gegen den S&P 500 in einem Monat" },
      h("span", { class: "rk-l" }, r.l, r.area && r.area.money != null ? h("em", {}, "13F " + sign(r.area.money)) : null),
      h("span", { class: "rk-t" }, h("i", { class: r.r1 >= 0 ? "pos" : "neg", style: (r.r1 >= 0 ? "left:50%;" : "right:50%;") + "width:" + (Math.abs(r.r1) / max * 50).toFixed(1) + "%" }),
        r.p1 != null ? h("u", { style: "left:" + (50 + Math.max(-50, Math.min(50, r.p1 / max * 50))).toFixed(1) + "%" }) : null),
      h("span", { class: "rk-v" }, sign(r.r1, 1)), h("span", { class: "rk-v dim" }, sign(r.r3, 1))), () => rotTip(r)))];
}
const grpChips = () => h("div", { class: "filters" }, Object.entries(D.desk.rot.groups).concat([["all", "Alle"]]).map(([k, l]) => h("button", { class: "chip", type: "button", "aria-pressed": String(state.rg === k), onclick: () => { state.rg = k; route(true); } }, l)));
function rotMap(list) {
  const box = h("div", { class: "chart" });
  box._draw = (el, W) => {
    const H = W < 560 ? 340 : 440, pL = 44, pR = 14, pT = 26, pB = 36;
    const xm = Math.max(4, ...list.map(r => Math.max(Math.abs(r.r3), Math.abs(r.p3 || 0)))) * 1.14, ym = Math.max(3, ...list.map(r => Math.max(Math.abs(r.r1), Math.abs(r.p1 || 0)))) * 1.16;
    const X = v => pL + (W - pL - pR) * (v + xm) / (2 * xm), Y = v => pT + (H - pT - pB) * (1 - (v + ym) / (2 * ym));
    let g = `<rect x="${pL}" y="${pT}" width="${W - pL - pR}" height="${H - pT - pB}" fill="rgba(255,255,255,.012)" stroke="#1a2434"/>`;
    ticks(-xm, xm, W < 560 ? 4 : 8).out.forEach(t => { g += `<line x1="${X(t).toFixed(1)}" x2="${X(t).toFixed(1)}" y1="${pT}" y2="${H - pB}" stroke="${t === 0 ? "#2b384d" : "#141c2a"}"/><text x="${X(t).toFixed(1)}" y="${H - pB + 14}" class="ax" text-anchor="middle">${esc(sign(t, 0))}</text>`; });
    ticks(-ym, ym, 6).out.forEach(t => { g += `<line x1="${pL}" x2="${W - pR}" y1="${Y(t).toFixed(1)}" y2="${Y(t).toFixed(1)}" stroke="${t === 0 ? "#2b384d" : "#141c2a"}"/><text x="${pL - 7}" y="${(Y(t) + 3.5).toFixed(1)}" class="ax" text-anchor="end">${esc(sign(t, 0))}</text>`; });
    g += `<text x="${W - pR - 8}" y="${pT + 16}" class="q" text-anchor="end">Führt</text><text x="${pL + 8}" y="${pT + 16}" class="q">Holt auf</text><text x="${W - pR - 8}" y="${H - pB - 9}" class="q" text-anchor="end">Lässt nach</text><text x="${pL + 8}" y="${H - pB - 9}" class="q">Bleibt zurück</text>` +
      `<text x="${(pL + W - pR) / 2}" y="${H - 5}" class="ax" text-anchor="middle">Trend: drei Monate gegen den S&amp;P 500, Prozentpunkte →</text><text x="${pL}" y="14" class="ax">↑ Schwung: letzter Monat gegen den S&amp;P 500</text>`;
    const pts = list.map(r => ({ r, x: X(r.r3), y: Y(r.r1), rad: 6 }));
    const boxes = pts.map(p => ({ x: p.x - 8, y: p.y - 8, w: 16, h: 16, o: p }));
    const free = (b, p) => !boxes.some(o => o.o !== p && b.x < o.x + o.w && o.x < b.x + b.w && b.y < o.y + o.h && o.y < b.y + b.h);
    pts.forEach(p => {
      const w = p.r.l.length * 6.1, cand = [{ x: p.x + 11, y: p.y + 4, an: "start", bx: p.x + 11 }, { x: p.x - 11, y: p.y + 4, an: "end", bx: p.x - 11 - w }, { x: p.x, y: p.y - 12, an: "middle", bx: p.x - w / 2 }, { x: p.x, y: p.y + 20, an: "middle", bx: p.x - w / 2 }, { x: p.x + 11, y: p.y + 17, an: "start", bx: p.x + 11 }, { x: p.x - 11, y: p.y - 9, an: "end", bx: p.x - 11 - w }];
      const k = cand.find(k => k.bx > pL + 2 && k.bx + w < W - pR - 2 && k.y > pT + 12 && k.y < H - pB - 4 && free({ x: k.bx, y: k.y - 10, w, h: 13 }, p)) || cand[0];
      p.lab = k; boxes.push({ x: k.bx, y: k.y - 10, w, h: 13, o: p });
    });
    pts.forEach(p => {
      const c = QC[p.r.q], solid = p.r.q === "lead" || p.r.q === "lag";
      if (p.r.p1 != null && p.r.p3 != null) g += `<line x1="${X(p.r.p3).toFixed(1)}" y1="${Y(p.r.p1).toFixed(1)}" x2="${p.x.toFixed(1)}" y2="${p.y.toFixed(1)}" stroke="${c}" stroke-width="1.5" opacity=".5"/><circle cx="${X(p.r.p3).toFixed(1)}" cy="${Y(p.r.p1).toFixed(1)}" r="2" fill="${c}" opacity=".6"/>`;
      g += `<g data-k="${p.r.k}" tabindex="0" role="link" aria-label="${esc(p.r.l + ": " + QD[p.r.q][0])}"><circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${p.rad}" fill="${solid ? c : "#0c111b"}" stroke="${solid ? "#0c111b" : c}" stroke-width="2"/><text x="${p.lab.x.toFixed(1)}" y="${p.lab.y.toFixed(1)}" class="lb" style="fill:#e9eef6" text-anchor="${p.lab.an}">${esc(p.r.l)}</text></g>`;
    });
    el.innerHTML = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Rotations-Karte: Trend über drei Monate gegen Schwung im letzten Monat, jeweils relativ zum S&amp;P 500">${g}</svg>`;
    el.querySelectorAll("[data-k]").forEach(n => {
      const r = list.find(x => x.k === n.getAttribute("data-k"));
      n.addEventListener("click", () => go("t", r.k));
      n.addEventListener("keydown", ev => { if (ev.key === "Enter") go("t", r.k); });
      withTip(n, () => rotTip(r));
    });
  };
  return box;
}
function pairRow(p) {
  return withTip(h("div", { class: "pr", tabindex: "0" }, h("div", {}, h("b", {}, p.l), h("small", {}, pairRead(p))), sparkArr(p.pts.map(x => x[1]), 110, 32), h("span", { class: "rk-v" }, arrow(p.m1), sign(p.m1, 1) + " %")),
    () => [h("b", {}, p.na + " geteilt durch " + p.nb), h("div", {}, "Verhältnis: ", h("span", { class: "mono" }, "1 W " + sign(p.w1, 1) + " % · 1 M " + sign(p.m1, 1) + " % · 3 M " + sign(p.m3, 1) + " %")), h("div", {}, pairRead(p))]);
}
function flowChart(F, pick) {
  const L = Object.entries(F.links).map(([k, ps]) => { const [a, b] = k.split(">"); return { k, a, b, ps, w: ps.length }; });
  if (!L.length) return h("p", { class: "empty" }, "Aus den Meldungen lässt sich noch keine Umschichtung zwischen Gebieten ableiten.");
  const box = h("div", { class: "chart" });
  box._draw = (el, W) => {
    if (W < 540) { put(el, h("p", { class: "note" }, "Das Flussbild braucht mehr Breite. Die Matrix darunter zeigt dieselben Daten.")); return; }
    const tot = side => { const o = {}; L.forEach(l => { o[l[side]] = (o[l[side]] || 0) + l.w; }); return Object.entries(o).sort((x, y) => y[1] - x[1]); };
    const src = tot("a"), dst = tot("b"), sum = L.reduce((s, l) => s + l.w, 0), gap = 9, n = Math.max(src.length, dst.length);
    const H = Math.max(320, n * 38 + 40), pT = 28, pB = 8, pS = 158, bw = 10, unit = (H - pT - pB - gap * (n - 1)) / sum;
    const place = arr => { let y = pT + (H - pT - pB - (arr.reduce((s, x) => s + x[1], 0) * unit + gap * (arr.length - 1))) / 2; const o = {}; arr.forEach(([k, v]) => { o[k] = { y, h: v * unit, v, off: 0 }; y += v * unit + gap; }); return o; };
    const S = place(src), T = place(dst), id = "f" + (uid++), x0 = pS + bw, x1 = W - pS - bw, xm = (x0 + x1) / 2;
    L.slice().sort((p, q) => S[p.a].y - S[q.a].y || T[p.b].y - T[q.b].y).forEach(l => { l.y0 = S[l.a].y + S[l.a].off; S[l.a].off += l.w * unit; });
    L.slice().sort((p, q) => T[p.b].y - T[q.b].y || S[p.a].y - S[q.a].y).forEach(l => { l.y1 = T[l.b].y + T[l.b].off; T[l.b].off += l.w * unit; });
    let g = `<defs><linearGradient id="${id}" x1="0" x2="1"><stop offset="0" stop-color="#e5477d"/><stop offset="1" stop-color="#1c9fc4"/></linearGradient></defs><text x="${pS + bw}" y="15" class="ax" text-anchor="end">netto abgebaut</text><text x="${W - pS - bw}" y="15" class="ax">netto aufgebaut</text>`;
    L.forEach(l => { const hh = l.w * unit - 1.5; g += `<path data-k="${l.k}" tabindex="0" role="button" aria-label="${esc(arLabel(l.a) + " nach " + arLabel(l.b) + ": " + l.w + " Manager")}" d="M${x0} ${l.y0.toFixed(1)} C${xm} ${l.y0.toFixed(1)} ${xm} ${l.y1.toFixed(1)} ${x1} ${l.y1.toFixed(1)} L${x1} ${(l.y1 + hh).toFixed(1)} C${xm} ${(l.y1 + hh).toFixed(1)} ${xm} ${(l.y0 + hh).toFixed(1)} ${x0} ${(l.y0 + hh).toFixed(1)} Z" fill="url(#${id})" opacity="${state.flow === l.k ? ".9" : ".34"}"/>`; });
    const node = (o, k, left) => `<g data-n="${k}" tabindex="0" role="link" aria-label="${esc(arLabel(k))}"><rect x="${left ? pS : W - pS - bw}" y="${o.y.toFixed(1)}" width="${bw}" height="${Math.max(2, o.h - 1.5).toFixed(1)}" rx="2" fill="${left ? "#e5477d" : "#1c9fc4"}"/><text x="${left ? pS - 9 : W - pS + 9}" y="${(o.y + o.h / 2 + 4).toFixed(1)}" class="lb" style="fill:#e9eef6" text-anchor="${left ? "end" : "start"}">${esc(arLabel(k))}</text><text x="${left ? pS - 9 - arLabel(k).length * 6.2 - 8 : W - pS + 9 + arLabel(k).length * 6.2 + 8}" y="${(o.y + o.h / 2 + 4).toFixed(1)}" class="ax" text-anchor="${left ? "end" : "start"}">${o.v}</text></g>`;
    Object.keys(S).forEach(k => { g += node(S[k], k, true); }); Object.keys(T).forEach(k => { g += node(T[k], k, false); });
    el.innerHTML = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Umschichtungen zwischen Gebieten laut 13F-Meldungen">${g}</svg>`;
    el.querySelectorAll("[data-k]").forEach(p => {
      const l = L.find(x => x.k === p.getAttribute("data-k")), act = () => { state.flow = l.k; el.querySelectorAll("[data-k]").forEach(q => q.setAttribute("opacity", q === p ? ".9" : ".34")); pick(l); };
      p.addEventListener("click", act); p.addEventListener("keydown", ev => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); act(); } });
      withTip(p, () => [h("b", {}, arLabel(l.a) + " → " + arLabel(l.b)), h("div", {}, h("span", { class: "mono" }, l.w + " Manager: "), l.ps.map(id => P[id].n).join(", ")), h("div", { style: "color:var(--ink-3)" }, "Anklicken für die Einzelwerte")]);
    });
    el.querySelectorAll("[data-n]").forEach(nn => { const k = nn.getAttribute("data-n"); nn.addEventListener("click", () => go("x", k)); nn.addEventListener("keydown", ev => { if (ev.key === "Enter") go("x", k); }); });
  };
  return box;
}
function depotMatrix(F, show) {
  const areas = Object.keys(D.desk.areas).filter(k => Object.values(F.by).some(o => o[k]));
  const cnt = p => Object.values(F.by[p]).reduce((s, o) => s + o.b + o.s, 0), ppl = Object.keys(F.by).sort((a, b) => cnt(b) - cnt(a));
  const col = n => n > 0 ? "28,159,196" : n < 0 ? "229,71,125" : "116,131,160";
  return h("div", { class: "tw" }, h("table", { class: "tbl mxt" },
    h("thead", {}, h("tr", {}, h("th", {}, "Manager"), areas.map(k => h("th", { class: "mxh" }, h("a", { href: href("x", k) }, arLabel(k)))))),
    h("tbody", {}, ppl.map(p => h("tr", {}, h("th", { class: "mxp" }, who(p)), areas.map(k => {
      const o = F.by[p][k]; if (!o) return h("td", { class: "mx" });
      const n = o.b - o.s;
      return h("td", { class: "mx" }, h("button", { type: "button", class: "mxb", style: "background:rgba(" + col(n) + "," + Math.min(.55, .2 + .12 * Math.abs(n)) + ")", "aria-label": P[p].n + ", " + arLabel(k) + ": " + o.b + " Käufe, " + o.s + " Verkäufe", onclick: () => { state.cell = p + "|" + k; show(); } }, n === 0 ? "±0" : sign(n)));
    })))),
    h("tfoot", {}, h("tr", {}, h("th", { class: "mxp" }, "Saldo"), areas.map(k => { const n = ppl.reduce((s, p) => s + (F.by[p][k] ? F.by[p][k].b - F.by[p][k].s : 0), 0); return h("td", { class: "mx mono" }, n === 0 ? "±0" : sign(n)); })))));
}
function consList(list, buy) {
  if (!list.length) return h("p", { class: "empty" }, "Keine Daten.");
  const max = Math.max(...list.map(o => (buy ? o.b : o.s).size));
  return list.map(o => { const set = buy ? o.b : o.s, oth = buy ? o.s : o.b;
    return withTip(h("a", { class: "cn", href: href("t", o.k) }, h("span", { class: "chip tk", style: "border:0;padding:0" }, o.k), h("span", { class: "cn-n" }, o.nm),
      h("span", { class: "cn-t" }, h("i", { style: "width:" + (set.size / max * 100).toFixed(0) + "%;background:var(--" + (buy ? "buy" : "sell") + ")" })), h("span", { class: "rk-v" }, set.size)),
      () => [h("b", {}, o.nm), h("div", {}, (buy ? "Gekauft von: " : "Verkauft von: ") + [...set].map(id => P[id].n).join(", ")), oth.size ? h("div", {}, (buy ? "Verkauft von: " : "Gekauft von: ") + [...oth].map(id => P[id].n).join(", ")) : null]); });
}
function rotUeber(R) {
  const list = R.filter(r => state.rg === "all" || r.g === state.rg), sek = R.filter(r => r.g === "sek").sort((a, b) => b.r1 - a.r1), Pp = pairStats();
  const A = areaStats().filter(a => a.money != null).sort((a, b) => b.money - a.money), risk = Pp.find(p => p.a === "XLY"), br = Pp.find(p => p.a === "RSP");
  const kv = (m, v, sub, to) => h(to ? "a" : "div", { href: to || null, class: "kvx" }, h("span", { class: "micro" }, m), h("b", {}, v), sub ? h("small", {}, sub) : null);
  const dir = (p, up, dn) => p.m1 > 0.5 ? up : p.m1 < -0.5 ? dn : "unverändert";
  return h("div", { class: "grid" },
    panel("c12 hero", "Lesart", "Wohin das Geld dreht", "Gemessen an der Kursentwicklung gegenüber dem S&P 500 bis " + fmtD(D.desk.pxAsOf) + ". Die Depots zeigen dagegen den Stand vom " + fmtD(D.desk.f13.asOf) + ".",
      h("div", { class: "kv kv-l" },
        sek.length ? kv("Stärkster Sektor", sek[0].l, sign(sek[0].r1, 1) + " Pp. zum S&P 500 in 1 Monat", href("t", sek[0].k)) : null,
        sek.length ? kv("Schwächster Sektor", sek[sek.length - 1].l, sign(sek[sek.length - 1].r1, 1) + " Pp. zum S&P 500 in 1 Monat", href("t", sek[sek.length - 1].k)) : null,
        risk ? kv("Risikoappetit", dir(risk, "steigt", "sinkt"), "Zykliker gegen Defensive " + sign(risk.m1, 1) + " % in 1 Monat") : null,
        br ? kv("Marktbreite", dir(br, "nimmt zu", "nimmt ab"), "Gleichgewichtet gegen Index " + sign(br.m1, 1) + " %") : null,
        A.length ? kv("Depots: meistgekauft", arLabel(A[0].k), A[0].buy.length + " Käufe, " + A[0].sell.length + " Verkäufe", href("x", A[0].k)) : null,
        A.length ? kv("Depots: meistverkauft", arLabel(A[A.length - 1].k), A[A.length - 1].buy.length + " Käufe, " + A[A.length - 1].sell.length + " Verkäufe", href("x", A[A.length - 1].k)) : null),
      h("p", { class: "lead", style: "margin-top:12px" }, rotRead(R, A)),
      h("div", { class: "sub-h" }, "Rotations-Karte"), grpChips(),
      h("div", { class: "lg" }, h("span", {}, h("i", { class: "dotk", style: "background:var(--buy)" }), "Führt"), h("span", {}, h("i", { class: "ring", style: "border-color:var(--buy)" }), "Holt auf"),
        h("span", {}, h("i", { class: "ring", style: "border-color:var(--sell)" }), "Lässt nach"), h("span", {}, h("i", { class: "dotk", style: "background:var(--sell)" }), "Bleibt zurück"), h("span", {}, "Strich: Weg seit einer Woche")),
      list.length ? rotMap(list) : h("p", { class: "empty" }, "Für diese Gruppe liegen keine Kursreihen vor.")),
    panel("c7", "Rangliste", "Rein und raus im letzten Monat", "Abstand zum S&P 500 in Prozentpunkten. Die helle Marke zeigt den Stand vor einer Woche.", list.length ? rankRows(list) : null),
    panel("c5", "Rotations-Paare", "Wer gegen wen gewinnt", "Verhältnis zweier Körbe über drei Monate. Steigt die Linie, gewinnt der erstgenannte.", Pp.map(pairRow),
      h("p", { class: "note" }, h("a", { class: "more", href: "#rotation", onclick: () => { state.rot = "kurs"; } }, "Alle Körbe und Verläufe"))));
}
function rotKurs(R) {
  const key = state.rs, list = R.filter(r => state.rg === "all" || r.g === state.rg).sort((a, b) => (b[key] == null ? -99 : b[key]) - (a[key] == null ? -99 : a[key]));
  const th = (k, l) => h("th", { class: "num" }, h("button", { class: "thb", type: "button", "aria-pressed": String(key === k), onclick: () => { state.rs = k; route(true); } }, l + (key === k ? " ▾" : "")));
  const num = v => h("td", { class: "num" }, v == null ? "–" : [arrow(v), sign(v, 1)]);
  return h("div", { class: "grid" },
    panel("c12", "Relative Stärke", "Alle Körbe gegen den S&P 500", "Abstand der Kursentwicklung zum S&P 500 in Prozentpunkten, Schlusskurse bis " + fmtD(D.desk.pxAsOf) + ". Spaltenkopf anklicken zum Sortieren.",
      grpChips(),
      h("div", { class: "tw" }, h("table", { class: "tbl" },
        h("thead", {}, h("tr", {}, h("th", {}, "Korb"), h("th", {}, "Gruppe"), h("th", { class: "num" }, "Kurs 1 M"), th("w1", "1 W"), th("r1", "1 M"), th("r3", "3 M"), h("th", {}, "Lage"), h("th", {}, "Depots " + fmtS(D.desk.f13.asOf)), h("th", {}, "Verlauf"))),
        h("tbody", {}, list.map(r => h("tr", {},
          h("td", {}, h("a", { class: "lk", href: href("t", r.k) }, r.l), h("span", { class: "srow-f" }, " " + r.k)), h("td", {}, D.desk.rot.groups[r.g]),
          h("td", { class: "num" }, sign(r.abs1, 1) + " %"), num(r.w1), num(r.r1), num(r.r3), h("td", {}, qTag(r.q)),
          h("td", {}, r.area && r.area.money != null ? h("a", { href: href("x", r.area.k) }, r.area.buy.length + " Käufe / " + r.area.sell.length + " Verkäufe") : "–"),
          h("td", {}, spark(r.k, 96, 24)))))))),
    panel("c12", "Rotations-Paare", "Verhältnis-Verläufe über drei Monate", "Start = 100. Steigt die Linie, läuft der erstgenannte Korb besser als der zweite.",
      h("div", { class: "cards2" }, pairStats().map(p => h("div", { class: "sc" }, h("h3", {}, p.l), h("div", { class: "sc-m" }, p.a + " geteilt durch " + p.b + " · 1 W " + sign(p.w1, 1) + " % · 1 M " + sign(p.m1, 1) + " % · 3 M " + sign(p.m3, 1) + " %"),
        miniLine(p.pts, 150, p.l), h("p", { class: "note", style: "margin-bottom:0" }, pairRead(p) + "."))))));
}
function rotDepot() {
  const F = depotFlows(), A = areaStats().filter(a => a.money != null).sort((a, b) => b.money - a.money || b.buy.length - a.buy.length), C = consensus();
  const max = Math.max(1, ...A.map(r => Math.max(r.buy.length, r.sell.length))), names = l => l.map(m => m.tk === "—" ? m.nm : m.tk).join(", ");
  const f = state.mvf, mv = D.moves.filter(m => f === "all" || (f === "buy" && AC[m.ac].buy && !m.per) || (f === "sell" && !AC[m.ac].buy && !m.per) || (f === "day" && m.per));
  const fd = h("div", { class: "pick" }), cd = h("div", { class: "pick" });
  const pick = l => put(fd, h("div", { class: "sub-h" }, arLabel(l.a) + " → " + arLabel(l.b) + " · " + l.w + " Manager"), l.ps.map(p => h("div", { class: "pk" }, h("div", {}, who(p), h("span", { class: "srow-f" }, " " + P[p].f)),
    h("div", { class: "note", style: "margin:2px 0" }, h("span", { class: "dn" }, "▼ "), "Abgebaut in " + arLabel(l.a) + ": " + names(F.by[p][l.a].mv.filter(m => !AC[m.ac].buy))),
    h("div", { class: "note", style: "margin:2px 0" }, h("span", { class: "up" }, "▲ "), "Aufgebaut in " + arLabel(l.b) + ": " + names(F.by[p][l.b].mv.filter(m => AC[m.ac].buy))))));
  const show = () => { const [p, k] = (state.cell || "|").split("|"); if (F.by[p] && F.by[p][k]) put(cd, h("div", { class: "sub-h" }, P[p].n + " · " + arLabel(k)), mvBlock(F.by[p][k].mv, false)); };
  const fl = state.flow && Object.entries(F.links).find(([k]) => k === state.flow);
  if (fl) pick({ k: fl[0], a: fl[0].split(">")[0], b: fl[0].split(">")[1], ps: fl[1], w: fl[1].length }); else put(fd, h("p", { class: "note" }, "Ein Band anklicken, um zu sehen, wer so umgeschichtet hat und mit welchen Werten."));
  show();
  return h("div", { class: "grid" },
    panel("c12 hero", "13F-Meldungen · " + D.desk.f13.q, "Aus welchen Gebieten in welche umgeschichtet wurde", Object.keys(F.by).length + " Manager, Stand " + fmtD(D.desk.f13.asOf) + ". Ein Band verbindet ein Gebiet, das ein Manager netto abgebaut hat, mit einem, das er netto aufgebaut hat. Breite: Zahl der Manager.", flowChart(F, pick), fd),
    panel("c12", "Matrix", "Wer wo gekauft und verkauft hat", "Saldo der Positionsänderungen je Manager und Gebiet. Feld anklicken für die Einzelwerte.",
      h("div", { class: "lg" }, h("span", {}, h("i", { style: "background:rgba(28,159,196,.5)" }), "mehr Käufe"), h("span", {}, h("i", { style: "background:rgba(229,71,125,.5)" }), "mehr Verkäufe"), h("span", {}, h("i", { style: "background:rgba(116,131,160,.4)" }), "ausgeglichen")), depotMatrix(F, show), cd),
    panel("c6", "Konsens", "Von den meisten gekauft", "Zahl der Manager je Wert", consList(C.buy, true)),
    panel("c6", "Konsens", "Von den meisten verkauft", "Zahl der Manager je Wert", consList(C.sell, false)),
    panel("c12", "Je Gebiet", "Käufe und Verkäufe im Überblick", "Zahl der Positionsänderungen je Gebiet.",
      h("div", { class: "lg" }, h("span", {}, h("i", { style: "background:var(--buy)" }), "Neu oder aufgestockt"), h("span", {}, h("i", { style: "background:var(--sell)" }), "Reduziert oder verkauft"), h("span", {}, "Rechts: Saldo")),
      h("div", { class: "rot-ax" }, h("span", {}, "Gebiet"), h("div", {}, h("span", {}, "← Verkäufe"), h("span", {}, "Käufe →")), h("span", {})),
      A.map(r => withTip(h("a", { class: "rot-row", href: href("x", r.k), style: "border-bottom:0", "aria-label": r.l + ": " + r.buy.length + " Käufe, " + r.sell.length + " Verkäufe" },
        h("span", { class: "rot-l" }, r.l),
        h("span", { class: "rot-t" },
          h("span", { class: "rot-h neg" }, h("span", { class: "rot-n" }, r.sell.length || ""), r.sell.length ? h("span", { class: "rot-b", style: "flex:0 0 calc((100% - 26px) * " + (r.sell.length / max) + ")" }) : null),
          h("span", { class: "rot-h pos" }, r.buy.length ? h("span", { class: "rot-b", style: "flex:0 0 calc((100% - 26px) * " + (r.buy.length / max) + ")" }) : null, h("span", { class: "rot-n" }, r.buy.length || ""))),
        h("span", { class: "rot-net" }, arrow(r.money), sign(r.money))),
        () => [h("b", {}, r.l), h("div", {}, h("span", { class: "mono" }, r.buy.length + " Käufe"), r.buy.length ? ": " + names(r.buy) : ""), h("div", {}, h("span", { class: "mono" }, r.sell.length + " Verkäufe"), r.sell.length ? ": " + names(r.sell) : "")]))),
    panel("c12", "Einzelwerte", "Alle Positionsänderungen", mv.length + " Einträge",
      h("div", { class: "filters" }, [["all", "Alle"], ["buy", "13F-Käufe"], ["sell", "13F-Verkäufe"], ["day", "Handel seit dem Stichtag"]].map(([k, l]) => h("button", { class: "chip", type: "button", "aria-pressed": String(f === k), onclick: () => { state.mvf = k; route(true); } }, l))),
      mv.map(m => moveRow(m, true))));
}
function rotFluss() {
  const dated = D.moves.filter(m => m.per).sort((a, b) => (a.d || "") < (b.d || "") ? 1 : -1);
  const st = D.statements.filter(s => (s.st || []).includes("rot") || (s.th || []).some(t => /Rotation|Positionierung|Flüsse/i.test(t))).sort(byDate);
  return h("div", { class: "grid" },
    panel("c7", "Gemeldete Flüsse", "Fondsflüsse, Umfragen, Auswertungen", "Neueste zuerst.", h("ul", { class: "list" }, D.desk.flows.map(x => h("li", {}, h("time", { datetime: x.d }, fmtS(x.d)), h("span", {}, x.t + " ", srcLink(x.src)))))),
    panel("c5", "Seit dem Stichtag", "Aktuelle Käufe und Verkäufe", "Handel nach dem " + fmtD(D.desk.f13.asOf) + ", soweit gemeldet.", dated.length ? dated.map(m => moveRow(m, true)) : h("p", { class: "empty" }, "Keine Meldungen.")),
    panel("c12", "Stimmen", "Was zu Rotation und Positionierung gesagt wird", st.length + " Aussagen", st.length ? stanceBar(st) : null, stmList(st, 12)));
}

/* ---------- views ---------- */
Object.assign(VIEWS, {
  lage() {
    const sw = maxSw(), fresh = D.statements.filter(s => (s.sw || 1) === sw), R = rotStats().filter(r => r.g === "sek");
    return { title: "Lage", crumb: "Überblick · Datenstand " + fmtD(D.desk.asOf), body: [swBox(false), rail(), h("div", { class: "grid" },
      panel("c12 hero", "Hot Stories", "Was den Markt gerade bewegt", "Story rechts wählen. Linien sind genannte Kursziele und Marken, Rauten markieren Tage mit Aussagen und Ereignissen.", heroStory()),
      panel("c7", "Money Rotation", "Wohin das Geld dreht", h("a", { class: "more", href: "#rotation" }, "Ganze Rotation"),
        R.length ? [h("p", { class: "note", style: "margin-top:0" }, "US-Sektoren gegen den S&P 500 im letzten Monat, in Prozentpunkten. Kurse bis " + fmtD(D.desk.pxAsOf) + "."), rankRows(R)] : h("p", { class: "empty" }, "Noch keine Sektor-Kursreihen.")),
      panel("c5", "Wirkung", "Ungewöhnlich starke Tage", h("a", { class: "more", href: "#wirkung" }, "Alle Tage"), bigDays(5)),
      panel("c7", "Neu im letzten Sweep", "Frische Stimmen", fresh.length + " Aussagen aus Lauf " + sw + ".", stmList(spread(fresh), 5, true), h("p", { class: "note" }, h("a", { class: "more", href: "#aussagen" }, "Alle Aussagen"))),
      moodPanel("c5"),
      panel("c7", "Meinungswechsel", "Wer seine Sicht geändert hat", null, changeRows(6), h("p", { class: "note" }, h("a", { class: "more", href: "#wechsel" }, "Alle Wechsel"))),
      panel("c5", "Kalender", "Was als Nächstes ansteht", null, calRows(6, true), h("p", { class: "note" }, h("a", { class: "more", href: "#kalender" }, "Ganzer Kalender"))))] };
  },
  stories() {
    return { title: "Hot Stories", crumb: "Überblick · " + D.stories.length + " Stories", body: [h("div", { class: "stories" }, D.stories.map(st => {
      const list = D.statements.filter(s => (s.st || []).includes(st.id)).sort(byDate);
      return h("a", { class: "story" + (st.ruht ? " off" : ""), href: href("s", st.id) },
        h("div", { class: "story-top" }, h("div", {}, h("div", { class: "micro" }, st.tk + (st.ruht ? " · ruht" : "")), h("div", { class: "story-t" }, st.t)), st.sym ? spark(st.sym, 120, 36) : null),
        h("div", { class: "story-k" }, st.kpi), h("div", { class: "story-s" }, st.sub), h("div", { class: "story-x" }, st.sum),
        stanceBar(list, true), h("div", { class: "story-f" }, (list.length ? list.length + " Aussagen · zuletzt " + fmtS(list[0].d) + " · " + whoName(list[0]) : "noch keine Aussagen") + (st.tl.length ? " · " + st.tl.length + " Ereignisse" : "")));
    }))] };
  },
  level() {
    const withLv = D.stories.filter(s => s.lv), st = withLv.find(s => s.id === state.lv) || withLv[0];
    if (!st) return { title: "Level-Radar", crumb: "Überblick", body: [h("p", { class: "empty" }, "Noch keine Story mit Marken.")] };
    const lvS = D.statements.filter(s => s.lv && (s.a || []).includes(st.tk)).sort(byDate), it = st.lv.items.filter(i => i.k !== "ref"), now = st.lv.now;
    const up = it.filter(i => i.v > now).sort((a, b) => a.v - b.v)[0], dn = it.filter(i => i.v < now).sort((a, b) => b.v - a.v)[0], kz = it.filter(i => i.k === "kz"), avg = kz.length ? kz.reduce((s, i) => s + i.v, 0) / kz.length : null;
    const f = v => nf(v, v % 1 ? 2 : 0) + (st.lv.u === "$" ? " $" : ""), pc = v => sign((v / now - 1) * 100, 1) + " %";
    const kv = (m, v, sub) => h("div", {}, h("span", { class: "micro" }, m), h("b", {}, v), sub ? h("small", {}, sub) : null);
    return { title: "Level-Radar", crumb: "Überblick", body: [
      h("div", { class: "tabs" }, withLv.map(s => h("button", { class: "tab", type: "button", "aria-pressed": String(s.id === st.id), onclick: () => { state.lv = s.id; route(); } }, s.tk + " · " + s.t))),
      h("div", { class: "grid" },
        panel("c12 hero", st.tk, "Auf welche Marken geschaut wird", "Gestrichelte Linien: genannte Kursziele und Marken. Abstand jeweils zum aktuellen Stand.",
          h("div", { class: "kv" }, kv("Aktuell", f(now), st.lv.nowL), kv("Nächste Marke darüber", up ? f(up.v) : "–", up ? up.l + " · " + pc(up.v) : "keine genannt"), kv("Nächste Marke darunter", dn ? f(dn.v) : "–", dn ? dn.l + " · " + pc(dn.v) : "keine genannt"), kv("Mittel der Kursziele", avg ? f(avg) : "–", avg ? kz.length + " Ziele · " + pc(avg) : "keine Ziele")),
          st.sym ? storyChart(st, 400) : null, h("p", { class: "note" }, h("a", { class: "more", href: href("s", st.id) }, "Zur Story: " + st.t))),
        panel("c7", "Leiter", "Alle Marken im Überblick", null, ladder(st)),
        panel("c5", "Aus den Aussagen", "Wer welche Marke nennt", null, lvS.length ? h("ul", { class: "list" }, lvS.map(s => h("li", {}, h("time", { datetime: s.d }, fmtS(s.d)), h("span", {}, h("a", { class: "lk", href: href("a", s.id) }, whoName(s)), ": " + s.lv)))) : h("p", { class: "empty" }, "Keine Aussage mit Marke zu diesem Wert.")))] };
  },
  rotation() {
    const tabs = [["ueber", "Überblick"], ["kurs", "Kurse"], ["depot", "Depots"], ["fluss", "Flüsse & Stimmen"]], R = rotStats();
    return { title: "Money Rotation", crumb: "Überblick · Kurse bis " + fmtD(D.desk.pxAsOf) + " · Depots Stand " + fmtD(D.desk.f13.asOf), body: [
      h("div", { class: "tabs" }, tabs.map(([k, l]) => h("button", { class: "tab", type: "button", "aria-pressed": String(state.rot === k), onclick: () => { state.rot = k; route(); } }, l))),
      state.rot === "kurs" ? rotKurs(R) : state.rot === "depot" ? rotDepot() : state.rot === "fluss" ? rotFluss() : rotUeber(R)] };
  },
  wirkung() {
    const top = D.statements.map(s => ({ s, r: bestRx(s) })).filter(x => x.r).sort((a, b) => Math.abs(b.r.z) - Math.abs(a.r.z)).slice(0, 12), fx = D.statements.filter(s => s.fx).sort(byDate);
    return { title: "Wirkung", crumb: "Markt · Kurse bis " + fmtD(D.desk.pxAsOf), body: [
      h("p", { class: "lead" }, "Was hat was bewegt? Der Desk legt Aussagen, Handelsmeldungen und Termine neben die Kursbewegung desselben Tages. Das zeigt einen zeitlichen Zusammenhang. Eine Ursache steht nur dort, wo eine Quelle sie belegt."),
      h("div", { class: "grid" },
        panel("c7", "Vom Kurs zum Anlass", "Auffällige Tage und was an ihnen geschah", "Tage der letzten 30 Handelstage, an denen ein beobachteter Wert mindestens das Doppelte seiner üblichen Tagesschwankung bewegte.", bigDays(0, true)),
        panel("c5", "Von der Aussage zum Kurs", "Aussagen mit der stärksten Tagesbewegung", "Unter den in der Aussage genannten Werten der mit der stärksten Bewegung am Tag, gemessen an seiner üblichen Schwankung.",
          top.length ? top.map(({ s, r }) => h("div", { class: "lrow wl" }, h("time", { datetime: s.d }, fmtS(s.d)), h("div", {}, h("a", { class: "lk", href: href("a", s.id) }, whoName(s)), " ", pill(s.s), h("div", { class: "note", style: "margin:3px 0 6px" }, short(s.t, 130)), rxChip(r)))) : h("p", { class: "empty" }, "Noch keine messbare Reaktion.")),
        panel("c12", "Belegte Wirkung", "Wo eine Quelle die Bewegung zuordnet", null, fx.length ? fx.map(stmCard) : h("p", { class: "empty" }, "Noch keine Aussage, bei der eine Quelle die Kursbewegung ausdrücklich zuordnet. Der Sweep trägt solche Belege ein, sobald er sie findet.")))] };
  },
  instrumente() {
    const cnt = {}; D.statements.forEach(s => (s.a || []).forEach(a => { cnt[a] = (cnt[a] || 0) + 1; }));
    const cls = s => /ETF/.test(s.b) ? "etf" : /Index/.test(s.b) ? "idx" : /Aktie/.test(s.b) ? "akt" : "roh";
    const rows = Object.keys(D.prices.s).map(k => { const l = last(k); return { k, l, n: cnt[k] || 0, d1: l.p ? delta(l.s, l.p, l.v) : null, m1: perfD(k, 30, l.d), c: cls(l.s) }; })
      .filter(r => (state.ig === "all" || r.c === state.ig) && (!state.q || (r.k + " " + r.l.s.n).toLowerCase().includes(state.q)));
    const key = state.is; rows.sort((a, b) => key === "n" ? b.n - a.n : (b[key] == null ? -999 : b[key]) - (a[key] == null ? -999 : a[key]));
    const chip = (st, k, l) => h("button", { class: "chip", type: "button", "aria-pressed": String(state[st] === k), onclick: () => { state[st] = k; route(true); } }, l);
    return { title: "Instrumente", crumb: "Markt · Schlusskurse bis " + fmtD(D.desk.pxAsOf), body: [
      h("p", { class: "lead" }, "Grobe Verläufe der erwähnten Werte und der Rotations-Körbe aus Tagesschlusskursen. Für genaue Daten führt jede Detailseite zu TradingView."),
      h("div", { class: "filters" }, [["all", "Alle"], ["idx", "Indizes"], ["akt", "Aktien"], ["etf", "Sektoren & Themen"], ["roh", "Rohstoffe, Zinsen, Krypto"]].map(([k, l]) => chip("ig", k, l)),
        h("span", { class: "micro", style: "margin-left:8px" }, "Sortiert nach"), [["n", "Aussagen"], ["d1", "1 Tag"], ["m1", "1 Monat"]].map(([k, l]) => chip("is", k, l))),
      rows.length ? h("div", { class: "inst" }, rows.map(r => h("a", { class: "ic", href: href("t", r.k) },
        h("span", {}, h("span", { class: "chip tk", style: "border:0;padding:0" }, r.k), h("span", { class: "ic-n" }, " " + r.l.s.n)), spark(r.k, 96, 28),
        h("span", { class: "ic-v" }, fv(r.l.v, r.l.s.u)),
        h("span", { class: "ic-c" }, r.d1 == null ? "" : sign(r.d1, 1) + dU(r.l.s) + " · ", r.m1 == null ? "" : "1 M " + sign(r.m1, 1) + " %"),
        h("span", { class: "srow-f", style: "grid-column:1/-1" }, r.l.s.b + " · " + fmtS(r.l.d) + " · " + r.n + " Aussagen")))) : h("p", { class: "empty" }, "Kein Instrument passt zu Filter und Suche.")] };
  },
  szenarien() {
    return { title: "Szenarien", crumb: "Markt · " + D.scenarios.length + " Szenarien", body: [
      h("p", { class: "lead" }, "Belegte Wahrscheinlichkeiten aus Marktpreisen, Umfragen und Einzelschätzungen, dazu die betroffenen Werte und die Positionen der Köpfe darin. Die Desk-Einschätzung ist eine Modell-Schätzung aus den gespeicherten Daten und klar davon getrennt."),
      h("div", { class: "cards2" }, D.scenarios.map(sc => scenEl(sc, true)))] };
  },
  kalender() {
    const wd = (new Date(TODAY + "T00:00:00Z").getUTCDay() + 6) % 7, wkEnd = addD(TODAY, 6 - wd), nxEnd = addD(wkEnd, 7);
    const L = D.calendar.slice().sort((a, b) => a.d < b.d ? -1 : 1), up = L.filter(e => (e.e || e.d) >= TODAY);
    const G = [["Diese Woche", up.filter(e => e.d <= wkEnd)], ["Nächste Woche", up.filter(e => e.d > wkEnd && e.d <= nxEnd)], ["Später", up.filter(e => e.d > nxEnd)], ["Vergangen", L.filter(e => (e.e || e.d) < TODAY).reverse()]];
    return { title: "Kalender", crumb: "Markt · " + up.length + " anstehende Termine", body: [
      h("p", { class: "lead" }, "Termine, die Aussagen und Kurse bewegen, mit den Werten, auf die sie üblicherweise wirken. Zeiten in MEZ. Bei vergangenen Terminen steht die Kursbewegung des Tages."),
      h("div", { class: "grid" }, G.filter(g => g[1].length).map(([l, list]) => panel("c12", l, list.length + (list.length === 1 ? " Termin" : " Termine"), null, h("ul", { class: "list" }, list.map(calItem)))),
        up.length ? null : h("p", { class: "empty c12" }, "Keine anstehenden Termine erfasst. Der nächste Sweep ergänzt sie."))] };
  },
  aussagen() {
    const count = get => { const c = {}; D.statements.forEach(s => get(s).forEach(k => { c[k] = (c[k] || 0) + 1; })); return Object.entries(c).sort((a, b) => b[1] - a[1]); };
    const tk = count(s => s.a || []).slice(0, 16), th = count(s => s.th || []).slice(0, 16), sw = maxSw();
    const list = D.statements.filter(s => (state.stance === "all" || s.s === state.stance) && (!state.onlyNew || (s.sw || 1) === sw) &&
      (state.grp === "all" || (state.grp === "org" ? !s.p : s.p && P[s.p] && P[s.p].g === state.grp)) && matchQ(s));
    const z = s => { const r = bestRx(s); return r ? Math.abs(r.z) : -1; };
    if (state.srt === "z") list.sort((a, b) => z(b) - z(a)); else list.sort(byDate);
    const chip = (on, l, fn, g) => h("button", { class: "chip", type: "button", "aria-pressed": String(on), onclick: () => { fn(); route(true); } }, g || null, l);
    return { title: "Aussagen", crumb: "Stimmen", body: [h("div", { class: "grid" }, panel("c12", "Feed", "Wer was wann gesagt hat", list.length + " von " + D.statements.length + " Aussagen. Jede Karte führt zu Wirkung und Umfeld der Aussage.",
      h("div", { class: "idx" },
        h("div", { class: "idx-r" }, h("span", { class: "micro" }, "Werte"), h("div", { class: "chips" }, tk.map(([k, n]) => h("a", { class: "chip tk", href: href("t", k) }, k, h("em", {}, n))))),
        h("div", { class: "idx-r" }, h("span", { class: "micro" }, "Themen"), h("div", { class: "chips" }, th.map(([k, n]) => h("a", { class: "chip", href: href("th", k) }, k, h("em", {}, n)))))),
      h("div", { class: "filters" },
        [["all", "Alle"]].concat(ORDER.map(k => [k, ST[k].l])).map(([k, l]) => chip(state.stance === k, l, () => { state.stance = k; }, k === "all" ? null : h("b", { style: "font-size:9px;color:" + ST[k].c }, ST[k].g))),
        chip(state.onlyNew, "Nur neu", () => { state.onlyNew = !state.onlyNew; }),
        h("label", {}, h("span", { class: "sr" }, "Gruppe"), (() => { const s = h("select", { class: "sel", onchange: ev => { state.grp = ev.target.value; route(true); } },
          [["all", "Alle Gruppen"]].concat(Object.entries(D.desk.groups), [["org", "Häuser, Umfragen, Daten"]]).map(([k, l]) => h("option", { value: k }, l))); s.value = state.grp; return s; })()),
        h("span", { class: "micro", style: "margin-left:8px" }, "Sortiert nach"), chip(state.srt === "d", "Datum", () => { state.srt = "d"; }), chip(state.srt === "z", "Kursreaktion", () => { state.srt = "z"; })),
      list.length ? list.map(stmCard) : h("p", { class: "empty" }, "Keine Aussage passt zu Filter und Suche.")))] };
  },
  sweep() {
    const cov = coverage(), A = D.agent, ver = D.people.filter(p => p.v).length, order = h("textarea", { rows: "6", readonly: true, "aria-label": "Auftrag für den Chat" }), cstat = h("span", { class: "srow-f", role: "status" });
    const nT = k => sweepTargets(k).length, scopes = [["Kurz", "Aktive Stories und alle Leitfiguren: " + nT("Kurz") + " Ziele, rund 10 Minuten."], ["Standard", "Dazu alle Köpfe mit Daten oder hinterlegten Kanälen: " + nT("Standard") + " Ziele, rund 25 Minuten."], ["Voll", "Das ganze Roster: " + nT("Voll") + " Ziele, eine Stunde und mehr."], ["Selbsttest", "Eine Suche und eine Auswertung zur Probe, speichert nichts."]];
    const bal = (() => { const c = {}; D.statements.forEach(s => { if (s.p) c[s.p] = (c[s.p] || 0) + 1; }); const L = Object.entries(c).sort((a, b) => b[1] - a[1]), tot = L.reduce((s, x) => s + x[1], 0); return { L, tot }; })();
    const scopeEl = h("div", { class: "scopes" });
    const paint = () => {
      order.value = "Sweep Analyst Desk, Lauf " + (D.desk.sweep.n + 1) + "\nUmfang: " + state.scope + (state.fokus.trim() ? "\nFokus: " + state.fokus.trim() : "") + "\n\nLies im Artefakt »Analyst Desk« (slug " + ((D.desk.direkt || {}).slug || "siehe Chat") + ") die Datei agent/auftrag.md mit read_file und führe den Lauf genau danach aus: Datendateien laden, Kurse ziehen, recherchieren, eintragen, mit agent/check.py prüfen, nur die Datendateien veröffentlichen, Protokoll fortschreiben.";
      put(scopeEl, scopes.map(([k, d]) => h("button", { class: "scope", type: "button", "aria-pressed": String(state.scope === k), onclick: () => { state.scope = k; paint(); swPaint(); } }, h("b", {}, k), h("span", {}, d))));
    };
    paint();
    return { title: "Sweep & Agent", crumb: "Wissen · Lauf " + D.desk.sweep.n + " vom " + fmtD(D.desk.sweep.last), body: [h("div", { class: "grid" },
      panel("c7 hero", "Sweep", "Roster und Markt neu abfragen", "Suche über Parallel Search, Auswertung durch Claude, Prüfung und Ablage direkt in dieser Seite.",
        swBox(true),
        h("div", { class: "sub-h" }, "Umfang"), scopeEl,
        h("label", { style: "display:block;margin-top:10px" }, h("span", { class: "sr" }, "Fokus"), h("input", { class: "inp", type: "text", placeholder: "Optionaler Fokus, zum Beispiel: Nvidia-Zahlen, Fed-Sitzung", value: state.fokus, oninput: e => { state.fokus = e.target.value; paint(); } })),
        h("div", { class: "row", style: "margin-top:12px" }, swButton(false), swStop(), h("span", { class: "srow-f" }, "Zwei Klicks: starten, dann bestätigen. Der Lauf arbeitet in dieser Seite: Tab offen lassen, im Desk weiterlesen ist möglich.")),
        swLog(),
        h("details", { class: "det" }, h("summary", {}, "Großer Lauf im Chat: Kurse, 13F, Kalender"),
          h("p", { class: "note" }, "Der Sweep in der Seite holt neue Aussagen und Story-Ereignisse. Kurse, 13F-Positionen, Szenarien und Kalender aktualisiert der große Lauf: als geplante Aufgabe oder mit diesem Auftrag im Chat."), order,
          h("div", { class: "row", style: "margin-top:8px" }, h("button", { class: "btn btn-s", type: "button", onclick: async () => {
            try { await navigator.clipboard.writeText(order.value); cstat.textContent = "Auftrag kopiert."; }
            catch (e) { order.focus(); order.select(); cstat.textContent = "Kopieren wurde blockiert. Der Text ist markiert: mit Strg+C oder Cmd+C kopieren."; }
          } }, "Auftrag kopieren"), cstat))),
      panel("c5", "Stand", "Was im Desk liegt", "Datenstand " + fmtD(D.desk.asOf) + " · Kurse bis " + fmtD(D.desk.pxAsOf),
        h("div", { class: "kv" },
          h("div", {}, h("span", { class: "micro" }, "Roster"), h("b", {}, D.people.length)), h("div", {}, h("span", { class: "micro" }, "Mit Daten"), h("b", {}, cov.size)),
          h("div", {}, h("span", { class: "micro" }, "Rolle bestätigt"), h("b", {}, ver)), h("div", {}, h("span", { class: "micro" }, "Aussagen"), h("b", {}, D.statements.length)),
          h("div", {}, h("span", { class: "micro" }, "Positionen"), h("b", {}, D.moves.length)), h("div", {}, h("span", { class: "micro" }, "Kursreihen"), h("b", {}, Object.keys(D.prices.s).length))),
        h("div", { class: "sub-h" }, "Bisherige Läufe"),
        h("ul", { class: "list" }, A.log.slice().reverse().map(l => h("li", {}, h("time", { datetime: l.d }, fmtS(l.d)), h("span", {}, h("b", { style: "color:var(--ink)" }, "Lauf " + l.n + ". "), l.t))))),
      panel("c5", "Gedächtnis des Agenten", "Was der Sweep noch klären muss", A.zweck,
        h("div", { class: "sub-h" }, "Offene Punkte"), h("ul", { class: "ul" }, A.offen.map(t => h("li", {}, t))),
        h("div", { class: "sub-h" }, "Regeln"), h("ul", { class: "ul" }, A.regeln.map(t => h("li", {}, t)))),
      panel("c7", "Ablauf", "So arbeitet ein Lauf", null, h("ol", { class: "ul" }, A.ablauf.map(t => h("li", {}, t))),
        h("div", { class: "sub-h" }, "Ausgewogenheit: wer wie oft zu Wort kommt"),
        h("p", { class: "note", style: "margin-top:0" }, bal.L.length + " Köpfe mit Aussagen. Die drei häufigsten stellen " + nf(bal.L.slice(0, 3).reduce((s, x) => s + x[1], 0) / (bal.tot || 1) * 100) + " % der Personen-Aussagen. Stimmungsbilder zählen je Kopf nur die jüngste Aussage; ein Lauf nimmt höchstens zwei neue Aussagen je Kopf auf und beginnt bei den Köpfen mit den wenigsten."),
        bal.L.slice(0, 8).map(([id, n]) => h("a", { class: "cn", href: href("p", id) }, h("span", { class: "rk-v", style: "text-align:left" }, n), h("span", { class: "cn-n", style: "color:var(--ink)" }, P[id] ? P[id].n : id), h("span", { class: "cn-t" }, h("i", { style: "width:" + (n / bal.L[0][1] * 100).toFixed(0) + "%;background:var(--prob)" })), h("span", { class: "rk-v dim" }, nf(n / bal.tot * 100) + " %")))))] };
  },
  suche() {
    const q = state.q;
    if (!q) return { title: "Suche", crumb: "Analyst Desk", body: [h("p", { class: "empty" }, "Oben einen Ticker, ein Thema oder einen Namen eingeben.")] };
    const w = q.split(/\s+/), has = t => { t = t.toLowerCase(); return w.every(x => t.includes(x)); };
    const inst = [...new Set(Object.values(slugMap.t))].filter(k => has(k + " " + (D.desk.assets[k] || "") + " " + ((D.prices.s[k] || {}).n || ""))).slice(0, 14);
    const ppl = D.people.filter(p => has(p.n + " " + p.f + " " + p.r)).slice(0, 14), sto = D.stories.filter(s => has(s.t + " " + s.tk + " " + s.sum));
    const th = Object.values(slugMap.th).filter(has).slice(0, 14), ar = Object.keys(D.desk.areas).filter(k => has(D.desk.areas[k])), stm = D.statements.filter(matchQ).sort(byDate);
    const n = inst.length + ppl.length + sto.length + th.length + ar.length + stm.length;
    return { title: "Suche: " + q, crumb: n + " Treffer", body: [n ? h("div", { class: "grid" },
      inst.length ? panel("c6", "Instrumente", inst.length + " Treffer", null, h("div", { class: "chips" }, inst.map(k => h("a", { class: "chip tk", href: href("t", k) }, k, h("em", {}, D.desk.assets[k] || ""))))) : null,
      ppl.length ? panel("c6", "Köpfe", ppl.length + " Treffer", null, h("div", { class: "chips" }, ppl.map(p => h("a", { class: "chip", href: href("p", p.id) }, p.n, h("em", {}, p.f))))) : null,
      sto.length || th.length || ar.length ? panel("c12", "Stories, Themen, Gebiete", (sto.length + th.length + ar.length) + " Treffer", null, h("div", { class: "chips" },
        sto.map(s => h("a", { class: "chip", href: href("s", s.id) }, s.t, h("em", {}, "Story"))), th.map(t => h("a", { class: "chip", href: href("th", t) }, t, h("em", {}, "Thema"))), ar.map(k => h("a", { class: "chip", href: href("x", k) }, D.desk.areas[k], h("em", {}, "Gebiet"))))) : null,
      stm.length ? panel("c12", "Aussagen", stm.length + " Treffer", stm.length > 30 ? "Die 30 neuesten." : null, stmList(stm, 30)) : null)
      : h("p", { class: "empty" }, "Nichts gefunden. Die Suche durchsucht Werte, Köpfe, Stories, Themen und den Text aller Aussagen.")] };
  }
});
