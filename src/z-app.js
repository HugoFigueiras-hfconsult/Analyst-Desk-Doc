/* ---------- routing ---------- */
const NAVL = {}; NAV.forEach(([g, items]) => items.forEach(([k, l]) => { NAVL[k] = l; }));
const trail = [];
function route(keep) {
  const hash = decodeURIComponent(location.hash.slice(1)) || "lage";
  let name = hash, res = null, detail = false;
  SW.paint.clear();
  try {
    if (VIEWS[hash]) res = VIEWS[hash]();
    else { const i = hash.indexOf("-"), type = hash.slice(0, i); if (i > 0 && DETAIL[type]) { res = DETAIL[type](hash.slice(i + 1)); name = PARENT[type]; detail = true; } }
  } catch (e) {
    console.error(e); name = ""; detail = false;
    res = { title: "Diese Ansicht hat einen Fehler", crumb: "Analyst Desk", body: [h("p", { class: "empty" }, "Die Ansicht konnte nicht aufgebaut werden. Die übrigen Seiten funktionieren weiter. Technischer Hinweis: " + (e && e.message ? e.message : String(e)))] };
  }
  if (!res) { name = ""; detail = false; res = { title: "Nicht gefunden", crumb: "Analyst Desk", body: [h("p", { class: "empty" }, "Diese Ansicht gibt es nicht. Links im Menü geht es weiter.")] }; }
  const y = scrollY;
  put("#view", res.body);
  $("#title").textContent = res.title;
  put("#crumb", detail && NAVL[name] ? [h("a", { class: "back", href: "#" + name }, "← " + NAVL[name]), h("span", {}, " · ")] : null, res.crumb || "Analyst Desk");
  $("#back").hidden = !(detail && trail.length > 1);
  document.querySelectorAll("#nav a").forEach(a => { if (a.getAttribute("href") === "#" + name) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
  document.body.classList.remove("nav-open");
  hideTip();
  scrollTo(0, keep === true ? y : 0);
  layoutCharts();
}
function buildNav() {
  const cov = coverage(), n = { aussagen: D.statements.length, wissen: D.people.length, stories: D.stories.length, calls: D.calls.length, instrumente: Object.keys(D.prices.s).length, wechsel: D.statements.filter(s => s.chg).length, szenarien: D.scenarios.length, kalender: D.calendar.filter(e => (e.e || e.d) >= TODAY).length };
  put("#nav", NAV.map(([g, items]) => [h("div", { class: "micro nav-g" }, g), items.map(([k, l]) => h("a", { href: "#" + k }, l, n[k] != null ? h("em", {}, n[k]) : null))]));
  put("#side-f", "Datenstand " + fmtD(D.desk.asOf), h("br"), "Kurse bis " + fmtD(D.desk.pxAsOf), h("br"), "Lauf " + D.desk.sweep.n + " · " + cov.size + " von " + D.people.length + " Köpfen");
  put("#foot",
    h("p", {}, "Keine Anlageberatung. Aussagen sind sinngemäß zusammengefasst und mit Datum und Quelle belegt; ein vorangestelltes ≈ kennzeichnet ein aus dem Bericht abgeleitetes Datum. 13F-Meldungen zeigen nur US-Long-Positionen zum " + fmtD(D.desk.f13.asOf) + " und keine Gründe für einen Handel."),
    h("p", {}, "Kurse: " + D.prices.src + ", jeweils mit Basis gekennzeichnet. Kassa, Spot und Future werden nicht vermischt. Kursbewegungen nach Aussagen zeigen einen zeitlichen Zusammenhang, keine Ursache. Relative Stärke misst Kurse, keine Mittelflüsse."));
  put("#swtop", swButton(false, true));
}
async function boot() {
  const files = ["people", "statements", "moves", "stories", "scenarios", "desk", "prices", "kb", "calls", "calendar", "agent"];
  try {
    const data = await Promise.all(files.map(f => fetch("data/" + f + ".json").then(r => { if (!r.ok) throw new Error(f); return r.json(); })));
    files.forEach((f, i) => { D[f] = data[i]; });
  } catch (e) { put("#view", h("p", { class: "empty" }, "Die Datendateien konnten nicht geladen werden. Seite neu laden.")); return; }
  try {
    const dk = D.desk;
    dk.f13 = dk.f13 || { asOf: "2026-09-30", q: "3. Quartal 2026" }; dk.direkt = dk.direkt || {}; dk.areaPx = dk.areaPx || {}; dk.rot = dk.rot || { bench: "SPX", groups: {}, items: [], pairs: [] }; dk.chartFor = dk.chartFor || {};
    dk.sweep = dk.sweep || {}; if (typeof dk.sweep.n !== "number") dk.sweep.n = maxSw();
    D.people.forEach(p => { P[p.id] = p; });
    D.kb.forEach(k => { KB[k.id] = k; });
    D.statements.forEach(s => { (s.a || []).forEach(a => { slugMap.t[slug(a)] = a; }); (s.th || []).forEach(t => { slugMap.th[slug(t)] = t; }); });
    D.moves.forEach(m => m.tk.split("·").forEach(t => { if (t !== "—") slugMap.t[slug(t)] = t; }));
    Object.keys(D.prices.s).concat(Object.keys(dk.assets)).forEach(k => { slugMap.t[slug(k)] = k; });
    D.stories.forEach(s => { if (!slugMap.t[slug(s.tk)]) slugMap.t[slug(s.tk)] = s.tk; });
    dk.fileRun = dk.sweep.n;
    normStories();
    buildNav();
  } catch (e) { console.error(e); put("#view", h("p", { class: "empty" }, "Die Daten sind unvollständig und konnten nicht aufbereitet werden: " + (e && e.message ? e.message : e))); return; }
  trail.push(location.hash);
  route();
}

$("#q").addEventListener("input", e => { state.q = e.target.value.trim().toLowerCase(); if (D.desk && ["aussagen", "wissen", "instrumente", "suche"].includes(location.hash.slice(1))) route(true); });
$("#q").addEventListener("keydown", e => {
  if (e.key !== "Enter" || !state.q || !D.people) return;
  if (slugMap.t[slug(state.q)]) return go("t", slugMap.t[slug(state.q)]);
  if (location.hash === "#suche") route(); else location.hash = "#suche";
});
$("#menu").addEventListener("click", () => document.body.classList.toggle("nav-open"));
$("#back").addEventListener("click", () => { if (trail.length > 1) history.back(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") document.body.classList.remove("nav-open"); });
window.addEventListener("hashchange", () => {
  if (trail.length > 1 && trail[trail.length - 2] === location.hash) trail.pop(); else trail.push(location.hash);
  if (D.desk) route();
});
window.addEventListener("scroll", hideTip, { passive: true });
window.addEventListener("beforeunload", e => { if (RUN.on) { e.preventDefault(); e.returnValue = ""; } });
let rz; window.addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(layoutCharts, 150); });

const booted = boot();
(async () => {
  const use = async n => { try { return window.claude && window.claude.use ? await window.claude.use(n) : null; } catch (e) { return null; } };
  use("sample").then(v => { sample = v; sampleChecked = true; if (D.desk && location.hash === "#fragen") route(true); });
  use("mcp").then(v => { SW.mcp = v; swPaint(); });
  SW.db = await use("db"); SW.tried = true;
  if (SW.db) {
    try { SW.db.doc("sweep/status").onSnapshot(snap => { SW.live = true; SW.st = snap.exists ? snap.data() : null; swPaint(); }, () => { SW.live = false; swPaint(); }); }
    catch (e) { /* ohne Live-Status */ }
  }
  await booted;
  if (D.desk && await loadDb()) { buildNav(); route(true); }
  swPaint();
})();
