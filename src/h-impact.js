/* ---------- time, reaction, rotation ---------- */
const MKC = { bull: "#1c9fc4", neut: "#5d6a82", warn: "#ab9016", bear: "#e5477d" };
const ARS = { semis: "Halbleiter", aiinfra: "KI-Infrastruktur", ailab: "KI-Labore", soft: "Software", mega: "Plattformen", fin: "Finanzen", health: "Gesundheit", ind: "Industrie", cons: "Konsum", gold: "Gold", space: "Raumfahrt", us: "US-Markt", eu: "Europa", oil: "Energie", krypto: "Krypto", zins: "Zinsen" };
const WD = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
const QD = { lead: ["Führt", "stark und zuletzt weiter stark"], impr: ["Holt auf", "über drei Monate schwach, zuletzt stark"], weak: ["Lässt nach", "über drei Monate stark, zuletzt schwach"], lag: ["Bleibt zurück", "schwach und zuletzt weiter schwach"] };
const QC = { lead: "#1c9fc4", impr: "#1c9fc4", weak: "#e5477d", lag: "#e5477d" };
const addD = (iso, n) => new Date(Date.parse(iso + "T00:00:00Z") + n * 864e5).toISOString().slice(0, 10);
const dayDiff = (a, b) => Math.round((Date.parse(a) - Date.parse(b)) / 864e5);
const short = (t, n) => t.length > n ? t.slice(0, n - 1).replace(/\s+\S*$/, "") + "…" : t;
const arLabel = k => ARS[k] || D.desk.areas[k] || k;
const arrow = v => h("span", { class: v > 0 ? "up" : v < 0 ? "dn" : "", "aria-hidden": "true" }, v > 0 ? "▲ " : v < 0 ? "▼ " : "■ ");
const qTag = q => h("span", { class: "pill" }, h("b", { style: "color:" + QC[q] }, q === "lead" || q === "lag" ? "●" : "○"), QD[q][0]);
function idxOn(t, date) { let lo = 0, hi = t.length; while (lo < hi) { const m = (lo + hi) >> 1; if (t[m] < date) lo = m + 1; else hi = m; } return lo; }
const delta = (s, a, b) => s.u === "%" ? (b - a) * 100 : (b / a - 1) * 100;
const dU = s => s.u === "%" ? " Bp" : " %";

const rxCache = new Map();
function react(sym, date) {
  const key = sym + "|" + date;
  if (rxCache.has(key)) return rxCache.get(key);
  let out = null;
  const s = cser(sym);
  if (s && s.c.length >= 25) {
    const i = idxOn(s._t, date), c = s.c, n = c.length;
    if (i >= 1 && i < n && dayDiff(s._t[i], date) <= 4) {
      let sum = 0, sq = 0, k = 0;
      for (let j = Math.max(1, i - 60); j < i; j++) { const r = delta(s, c[j - 1], c[j]); sum += r; sq += r * r; k++; }
      const sd = k > 10 ? Math.sqrt(Math.max(0, sq / k - (sum / k) ** 2)) : null, day = delta(s, c[i - 1], c[i]);
      out = { sym, d: s._t[i], day, since: delta(s, c[i - 1], c[n - 1]), wk: i + 4 < n ? delta(s, c[i - 1], c[i + 4]) : null, z: sd ? day / sd : null, big: !!sd && Math.abs(day) >= 2 * sd, u: dU(s), last: i === n - 1 };
    }
  }
  rxCache.set(key, out);
  return out;
}
function rxTip(r) {
  return [h("b", {}, (D.desk.assets[r.sym] || r.sym) + " am " + fmtD(r.d)),
    h("div", {}, "Schluss gegen Vortag: ", h("span", { class: "mono" }, sign(r.day, 2) + r.u)),
    r.z != null ? h("div", {}, "Das ", h("span", { class: "mono" }, nf(Math.abs(r.z), 1) + "-Fache"), " der üblichen Tagesschwankung.") : null,
    r.wk != null ? h("div", {}, "Fünf Handelstage später: ", h("span", { class: "mono" }, sign(r.wk, 2) + r.u)) : null,
    h("div", {}, "Bis zum letzten Schluss: ", h("span", { class: "mono" }, sign(r.since, 2) + r.u)),
    h("div", { style: "color:var(--ink-3);margin-top:3px" }, "Zeitlicher Zusammenhang, keine belegte Ursache.")];
}
const rxChip = r => withTip(h("a", { class: "chip rx" + (r.big ? " big" : ""), href: href("t", r.sym) }, h("b", {}, r.sym), h("span", {}, arrow(r.day), sign(r.day, 1) + r.u), h("em", {}, r.last ? "am Tag" : "am Tag · seither " + sign(r.since, 1) + r.u)), () => rxTip(r));
function bestRx(s) { return stmRx(s, 4).filter(r => r.z != null).sort((a, b) => Math.abs(b.z) - Math.abs(a.z))[0] || null; }
function chgRx(s) {
  let a = s.chg.a;
  if (!a) { const w = s.chg.w.toLowerCase(); a = (s.a || []).find(t => w.includes(t.toLowerCase()) || (D.desk.assets[t] && w.includes(D.desk.assets[t].toLowerCase()))); }
  const r = a ? react(a, s.d) : null;
  return r ? rxChip(r) : null;
}
function stmRx(s, max = 2) { const out = []; for (const a of s.a || []) { const r = react(a, s.d); if (r) out.push(r); if (out.length >= max) break; } return out; }

function marksFor(sym, st) {
  const m = {}, add = (d, o) => { (m[d] = m[d] || []).push(o); };
  D.statements.forEach(s => { if ((sym && (s.a || []).includes(sym)) || (st && (s.st || []).includes(st.id))) add(s.d, { k: "s", s }); });
  if (st) st.tl.forEach(e => add(e.d, { k: "e", t: e.t }));
  if (sym) D.moves.forEach(x => { if (x.d && x.tk.split("·").includes(sym)) add(x.d, { k: "m", m: x }); });
  return m;
}
function markLine(m) {
  if (m.k === "s") return h("div", { class: "tip-l" }, h("span", { style: "color:" + MKC[m.s.s] }, ST[m.s.s].g + " "), h("b", { style: "display:inline" }, whoName(m.s)), ": " + short(m.s.t, 90));
  if (m.k === "m") return h("div", { class: "tip-l" }, h("span", { style: "color:" + (AC[m.m.ac].buy ? MKC.bull : MKC.bear) }, "◆ "), h("b", { style: "display:inline" }, P[m.m.p] ? P[m.m.p].n : ""), " " + AC[m.m.ac].l + ": " + m.m.nm);
  return h("div", { class: "tip-l" }, h("span", { style: "color:#ff8a2a" }, "◆ "), short(m.t, 110));
}

/* statements, scenarios, calendar */
function stmCard(s) {
  const name = whoName(s), firm = whoFirm(s), rx = stmRx(s);
  return h("article", { class: "stm" },
    h("div", { class: "stm-h" },
      h("time", { class: "stm-d", datetime: s.d, title: s.da ? "Datum näherungsweise aus dem Bericht" : null }, (s.da ? "≈ " : "") + fmtD(s.d)),
      s.p && P[s.p] ? h("a", { class: "stm-w", href: href("p", s.p) }, name) : h("span", { class: "stm-w" }, name),
      firm ? h("span", { class: "stm-f" }, firm) : null, pill(s.s), (s.sw || 1) === maxSw() ? h("span", { class: "new" }, "NEU") : null,
      h("a", { class: "stm-o", href: href("a", s.id), "aria-label": "Aussage von " + name + " vom " + fmtD(s.d) + " öffnen" }, "Wirkung und Umfeld →")),
    h("p", { class: "stm-t" }, s.t),
    s.lv ? h("p", { class: "stm-lv" }, s.lv) : null,
    s.fx ? h("p", { class: "stm-fx" }, h("span", { class: "micro" }, "Belegte Wirkung "), s.fx.t + " ", srcLink(s.fx.src, true)) : null,
    rx.length ? h("div", { class: "stm-rx" }, h("span", { class: "micro" }, "Kurs danach"), rx.map(rxChip)) : null,
    h("div", { class: "stm-foot" }, h("span", { class: "chips" }, (s.a || []).map(tkChip), (s.th || []).map(thChip)), h("span", {}, s.k + " · ", srcLink(s.src))));
}
function scenEl(sc, rich) {
  const list = D.statements.filter(s => (s.st || []).includes(sc.st)).sort(byDate), aff = sc.aff || [];
  const mv = D.moves.filter(m => m.tk.split("·").some(t => aff.includes(t))), buys = mv.filter(m => AC[m.ac].buy).length;
  const out = h("div", { class: "ans", role: "status", "aria-live": "polite" });
  return h("div", { class: "sc" },
    h("h3", {}, sc.t),
    h("div", { class: "sc-m" }, sc.type + " · " + sc.basis + " · Stand " + fmtD(sc.asOf)),
    sc.items.map(i => i.p == null ? h("p", { class: "sc-txt" }, i.l)
      : h("div", { class: "sc-i" }, h("span", {}, i.l), h("span", { class: "mono", style: "text-align:right;color:var(--ink)" }, nf(i.p, i.p % 1 ? 1 : 0) + " %"), h("div", { class: "sc-b" }, h("span", { style: "width:" + i.p + "%" })))),
    h("p", { class: "note" }, sc.note ? sc.note + " " : "", srcLink(sc.src)),
    aff.length ? h("div", { class: "stm-rx" }, h("span", { class: "micro" }, "Wirkt auf"), aff.map(tkChip)) : null,
    rich ? [
      h("div", { class: "sub-h" }, "Stimmen dazu · " + list.length),
      list.length ? [stanceBar(list, true), h("p", { class: "note" }, list.slice(0, 6).map((s, i) => [i ? " · " : "", h("a", { href: href("a", s.id) }, whoName(s)), " " + ST[s.s].g + " " + fmtS(s.d)]))] : h("p", { class: "empty" }, "Noch keine Aussagen verknüpft."),
      mv.length ? [h("div", { class: "sub-h" }, "So sind die Köpfe in diesen Werten positioniert"),
        h("p", { class: "note" }, h("span", { class: "mono", style: "color:var(--ink)" }, buys + " Käufe · " + (mv.length - buys) + " Verkäufe oder Shorts"), " · ",
          mv.filter(m => m.per).concat(mv.filter(m => !m.per)).slice(0, 5).map((m, i) => [i ? " · " : "", who(m.p), " " + AC[m.ac].l.toLowerCase() + " " + (m.tk === "—" ? m.nm : m.tk)]))] : null,
      h("div", { class: "row" },
        h("a", { class: "btn btn-s", href: href("s", sc.st) }, "Zur Story"),
        h("button", { class: "btn btn-s", type: "button", onclick: ev => askDesk("Schätze für das Szenario »" + sc.t + "« eine Eintrittswahrscheinlichkeit als Spanne. Begründe sie aus den Daten, nenne die wichtigsten Stimmen dafür und dagegen mit Datum, und sage, wie sich die Manager dafür positioniert haben. Kennzeichne die Zahl klar als Modell-Schätzung.", out, ev.currentTarget) }, "Desk-Einschätzung")),
      out] : null);
}
function storyChart(st, hh) {
  const fut = /Future/.test((cser(st.sym) || {}).b || ""), lv = st.lv && !fut ? lvFor(st) : [];
  return [priceChart(st.sym, { h: hh || (lv.length ? 330 : 230), levels: lv, marks: marksFor(st.px || st.sym, st) }),
    st.lv && fut ? h("p", { class: "note" }, "Die Marken dieser Story beziehen sich auf den Spotpreis und sind deshalb nicht in den Future-Chart eingezeichnet.") : null];
}
function changeRows(max) {
  const list = D.statements.filter(s => s.chg).sort(byDate);
  return h("div", { class: "tw" }, h("table", { class: "tbl" },
    h("thead", {}, h("tr", {}, h("th", {}, "Datum"), h("th", {}, "Wer"), h("th", {}, "Was"), h("th", {}, "Vorher → Nachher"), max ? null : h("th", {}, "Kurs danach"), max ? null : h("th", {}, "Quelle"))),
    h("tbody", {}, (max ? list.slice(0, max) : list).map(s => h("tr", {},
      h("td", { class: "mono" }, (s.da ? "≈ " : "") + fmtS(s.d)),
      h("td", {}, s.p && P[s.p] ? who(s.p) : h("b", {}, whoName(s))),
      h("td", {}, h("a", { href: href("a", s.id) }, s.chg.w), s.chg.a ? [" ", tkChip(s.chg.a)] : null),
      h("td", {}, h("span", { class: s.chg.dir > 0 ? "up" : "dn", "aria-hidden": "true" }, s.chg.dir > 0 ? "▲ " : "▼ "), s.chg.f, h("span", { class: "arrow" }, "→"), h("b", {}, s.chg.t)),
      max ? null : h("td", {}, chgRx(s)),
      max ? null : h("td", {}, srcLink(s.src)))))));
}
const cfdFor = aff => D.desk.cfd.filter(c => (aff || []).some(a => c.as.includes(a) || c.ref === a)).map(c => c.k);
function calItem(e) {
  const past = (e.e || e.d) < TODAY, dd = dayDiff(e.d, TODAY), cf = cfdFor(e.aff);
  const rx = past ? (e.aff || []).map(a => react(a, e.d)).filter(Boolean).slice(0, 3) : [];
  return h("li", { class: "cal" + (past ? " past" : "") },
    h("time", { datetime: e.d }, h("b", {}, WD[new Date(e.d + "T00:00:00Z").getUTCDay()] + " " + fmtS(e.d) + (e.e ? "–" + fmtS(e.e) : "")), h("small", {}, past ? "vorbei" : dd === 0 ? "heute" : dd === 1 ? "morgen" : "in " + dd + " Tagen")),
    h("div", {},
      h("div", {}, tag(e.k), " ", e.t, e.tm ? h("span", { class: "mono", style: "color:var(--ink-3)" }, " · " + e.tm) : null),
      (e.aff || []).length || e.st ? h("div", { class: "stm-rx" },
        (e.aff || []).length ? [h("span", { class: "micro" }, past && rx.length ? "Kurs am Tag" : "Wirkt auf"), past && rx.length ? rx.map(rxChip) : e.aff.map(tkChip)] : null,
        cf.length ? h("span", { class: "chip cf" }, "Deine CFDs: " + cf.join(", ")) : null,
        e.st ? h("a", { class: "chip", href: href("s", e.st) }, "Story") : null) : null,
      e.src ? h("div", { class: "srow-f", style: "margin-top:4px" }, srcLink(e.src, true)) : null));
}
function calRows(max, upcomingOnly) {
  let list = D.calendar.slice().sort((a, b) => a.d < b.d ? -1 : 1);
  if (upcomingOnly) list = list.filter(e => (e.e || e.d) >= TODAY);
  return list.length ? h("ul", { class: "list" }, (max ? list.slice(0, max) : list).map(calItem)) : h("p", { class: "empty" }, "Keine Termine erfasst.");
}
function normStories() {
  D.stories.forEach(st => {
    const l = st.px && last(st.px); if (!l) return;
    const s = l.s, hi = Math.max(...s.c), d1 = l.p ? delta(s, l.p, l.v) : null;
    st.kpi = fv(l.v, s.u);
    st.sub = (d1 == null ? "" : sign(d1, 1) + dU(s) + " am " + fmtS(l.d) + " · ") + (s.c.length < 25 ? "erst " + s.c.length + " Handelstage" : l.v >= hi ? "auf dem Hoch der letzten sechs Monate" : nf((1 - l.v / hi) * 100, 1) + " % unter dem Sechsmonatshoch vom " + fmtS(s._t[s.c.indexOf(hi)]));
    if (st.lv) { st.lv.now = l.v; st.lv.nowL = "Schluss " + fmtS(l.d); }
  });
  D.stories.sort((a, b) => (a.ruht || 0) - (b.ruht || 0));
}

/* rotation */
function perfD(sym, days, asOf) { asOf = asOf || D.desk.pxAsOf; const e = pxAt(sym, asOf), b = pxAt(sym, addD(asOf, -days)); return e != null && b != null ? (e / b - 1) * 100 : null; }
function rel(sym, days, asOf) { const a = perfD(sym, days, asOf), b = perfD(D.desk.rot.bench, days, asOf); return a == null || b == null ? null : a - b; }
function rotStats() {
  if (rotStats.c) return rotStats.c;
  const A = areaStats(), wk = addD(D.desk.pxAsOf, -7);
  return rotStats.c = D.desk.rot.items.filter(i => ser(i.k)).map(i => {
    const r1 = rel(i.k, 30), r3 = rel(i.k, 91);
    if (r1 == null || r3 == null) return null;
    return { ...i, r1, r3, w1: rel(i.k, 7), p1: rel(i.k, 30, wk), p3: rel(i.k, 91, wk), abs1: perfD(i.k, 30), q: r3 >= 0 ? (r1 >= 0 ? "lead" : "weak") : (r1 >= 0 ? "impr" : "lag"), area: i.ar ? A.find(a => a.k === i.ar) : null };
  }).filter(Boolean);
}
function pairStats() {
  if (pairStats.c) return pairStats.c;
  return pairStats.c = D.desk.rot.pairs.map(p => {
    const A = ser(p.a), B = ser(p.b); if (!A || !B) return null;
    const mb = new Map(B._t.map((d, i) => [d, B.c[i]])), r = [];
    A._t.forEach((d, i) => { const v = mb.get(d); if (v) r.push([d, A.c[i] / v]); });
    const s = r.slice(-66), n = s.length; if (n < 25) return null;
    const v = s[n - 1][1], base = s[0][1];
    return { ...p, pts: s.map(x => [x[0], x[1] / base * 100]), m1: (v / s[Math.max(0, n - 22)][1] - 1) * 100, w1: (v / s[n - 6][1] - 1) * 100, m3: (v / base - 1) * 100, na: A.n, nb: B.n };
  }).filter(Boolean);
}
const pairRead = p => p.m1 > 0.5 ? p.up : p.m1 < -0.5 ? p.dn : "Im letzten Monat kaum Bewegung";
function depotFlows() {
  if (depotFlows.c) return depotFlows.c;
  const by = {}, links = {};
  D.moves.filter(m => !m.per).forEach(m => { const o = by[m.p] || (by[m.p] = {}), a = o[m.sec] || (o[m.sec] = { b: 0, s: 0, mv: [] }); if (AC[m.ac].buy) a.b++; else a.s++; a.mv.push(m); });
  Object.keys(by).forEach(p => {
    const src = [], dst = [];
    Object.keys(by[p]).forEach(k => { const n = by[p][k].b - by[p][k].s; if (n < 0) src.push(k); else if (n > 0) dst.push(k); });
    src.forEach(a => dst.forEach(b => { (links[a + ">" + b] = links[a + ">" + b] || []).push(p); }));
  });
  return depotFlows.c = { by, links };
}
function consensus() {
  const t = {};
  D.moves.filter(m => !m.per).forEach(m => m.tk.split("·").forEach(k => { if (k === "—") return; const o = t[k] || (t[k] = { k, nm: m.tk.includes("·") ? (D.desk.assets[k] || k) : m.nm, b: new Set(), s: new Set() }); (AC[m.ac].buy ? o.b : o.s).add(m.p); }));
  const L = Object.values(t);
  return { buy: L.filter(o => o.b.size).sort((a, b) => b.b.size - a.b.size || a.s.size - b.s.size).slice(0, 8), sell: L.filter(o => o.s.size).sort((a, b) => b.s.size - a.s.size || a.b.size - b.b.size).slice(0, 8) };
}
function rotRead(R, A) {
  const s = R.filter(r => r.g === "sek" || r.g === "the").sort((a, b) => b.r1 - a.r1), nm = l => l.map(r => r.l + " (" + sign(r.r1, 1) + ")").join(", ");
  if (s.length < 6) return "Für eine Lesart liegen noch zu wenige Kursreihen vor.";
  let t = "Im letzten Monat liefen " + nm(s.slice(0, 3)) + " am stärksten gegen den S&P 500, am schwächsten " + nm(s.slice(-3).reverse()) + " (Abstand in Prozentpunkten).";
  const gap = R.filter(r => r.area && r.area.money != null && ((r.area.money > 0 && r.r1 < -2) || (r.area.money < 0 && r.r1 > 2)));
  const up = gap.filter(r => r.area.money < 0).map(r => r.l), dn = gap.filter(r => r.area.money > 0).map(r => r.l);
  if (up.length) t += " Seither stark, obwohl in den Depots vom " + fmtS(D.desk.f13.asOf) + " netto verkauft: " + up.join(", ") + ".";
  if (dn.length) t += " Seither schwach, obwohl damals netto gekauft: " + dn.join(", ") + ".";
  return t;
}
function rotTip(r) {
  return [h("b", {}, r.l + " · " + r.k), h("div", {}, "Gegen S&P 500: ", h("span", { class: "mono" }, "1 W " + (r.w1 == null ? "–" : sign(r.w1, 1)) + " · 1 M " + sign(r.r1, 1) + " · 3 M " + sign(r.r3, 1) + " Pp.")),
    h("div", {}, "Kurs 1 Monat: ", h("span", { class: "mono" }, sign(r.abs1, 1) + " %")), h("div", {}, QD[r.q][0] + ": " + QD[r.q][1]),
    r.area ? h("div", {}, "Depots " + fmtS(D.desk.f13.asOf) + ": ", h("span", { class: "mono" }, r.area.money == null ? "keine Daten" : r.area.buy.length + " Käufe, " + r.area.sell.length + " Verkäufe"), " · Stimmen-Saldo ", h("span", { class: "mono" }, sign(r.area.talk))) : null];
}
function sparkArr(vals, w, hh) {
  const lo = Math.min(...vals), hi = Math.max(...vals), n = vals.length, Y = v => (3 + (hh - 6) * (1 - (v - lo) / ((hi - lo) || 1))).toFixed(1);
  const e = h("span", { class: "spark", "aria-hidden": "true" });
  e.innerHTML = `<svg width="${w}" height="${hh}"><line x1="2" x2="${w - 3}" y1="${Y(vals[0])}" y2="${Y(vals[0])}" stroke="#2b384d" stroke-dasharray="2 3"/><polyline points="${vals.map((v, i) => (2 + (w - 7) * i / (n - 1)).toFixed(1) + "," + Y(v)).join(" ")}" fill="none" stroke="#a9b4c6" stroke-width="1.25" stroke-linejoin="round"/><circle cx="${w - 5}" cy="${Y(vals[n - 1])}" r="2.6" fill="#ff8a2a"/></svg>`;
  return e;
}
function miniLine(pts, H, label) {
  const box = h("div", { class: "chart" });
  box._draw = (el, W) => {
    const pL = 38, pR = 8, pT = 8, pB = 18, ys = pts.map(p => p[1]), n = ys.length;
    let lo = Math.min(...ys), hi = Math.max(...ys); const pad = (hi - lo) * 0.1 || 1; lo -= pad; hi += pad;
    const X = i => pL + (W - pL - pR) * i / (n - 1), Y = v => pT + (H - pT - pB) * (1 - (v - lo) / (hi - lo)), tk = ticks(lo, hi, 3);
    let g = "";
    tk.out.forEach(t => { g += `<line x1="${pL}" x2="${W - pR}" y1="${Y(t).toFixed(1)}" y2="${Y(t).toFixed(1)}" class="g"/><text x="${pL - 6}" y="${(Y(t) + 3.5).toFixed(1)}" class="ax" text-anchor="end">${esc(nf(t, tk.dec))}</text>`; });
    g += `<line x1="${pL}" x2="${W - pR}" y1="${Y(100).toFixed(1)}" y2="${Y(100).toFixed(1)}" stroke="#7483a0" stroke-dasharray="3 4"/><text x="${pL + 2}" y="${H - 4}" class="ax">${esc(fmtS(pts[0][0]))}</text><text x="${W - pR}" y="${H - 4}" class="ax" text-anchor="end">${esc(fmtS(pts[n - 1][0]))}</text>`;
    el.innerHTML = `<svg width="${W}" height="${H}" role="img" aria-label="${esc(label)}">${g}<polyline points="${ys.map((v, i) => X(i).toFixed(1) + "," + Y(v).toFixed(1)).join(" ")}" fill="none" stroke="#8f6bf0" stroke-width="2" stroke-linejoin="round"/><circle cx="${X(n - 1).toFixed(1)}" cy="${Y(ys[n - 1]).toFixed(1)}" r="4" fill="#8f6bf0" stroke="#0c111b" stroke-width="2"/><line class="cur" y1="${pT}" y2="${H - pB}" stroke="#7483a0" visibility="hidden"/></svg>`;
    const svg = el.firstChild, cur = $(".cur", svg);
    svg.addEventListener("pointermove", ev => {
      const r = svg.getBoundingClientRect(), i = Math.max(0, Math.min(n - 1, Math.round((ev.clientX - r.left - pL) / (W - pL - pR) * (n - 1))));
      cur.setAttribute("x1", X(i)); cur.setAttribute("x2", X(i)); cur.setAttribute("visibility", "visible");
      showTip(ev, [h("b", {}, fmtD(pts[i][0])), h("span", { class: "mono" }, nf(ys[i], 1) + " (Start = 100)")]);
    });
    svg.addEventListener("pointerleave", () => { hideTip(); cur.setAttribute("visibility", "hidden"); });
  };
  return box;
}
