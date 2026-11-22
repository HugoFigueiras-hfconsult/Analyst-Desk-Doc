"use strict";
const $ = (s, r = document) => r.querySelector(s);
function h(tag, props, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (v == null || v === false) continue;
    if (k === "class") e.className = v;
    else if (k === "style") e.style.cssText = v;
    else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v === true ? "" : v);
  }
  for (const kid of kids.flat(4)) {
    if (kid == null || kid === false) continue;
    e.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
  }
  return e;
}
const put = (el, ...kids) => (typeof el === "string" ? $(el) : el).replaceChildren(...kids.flat(4).filter(k => k != null && k !== false));
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const ST = {
  bull: { l: "Bullisch", g: "▲", c: "var(--buy)" }, neut: { l: "Neutral", g: "■", c: "var(--neut)" },
  warn: { l: "Warnung", g: "◆", c: "var(--warn)" }, bear: { l: "Bärisch", g: "▼", c: "var(--sell)" }
};
const ORDER = ["bull", "neut", "warn", "bear"];
const AC = { neu: { l: "Neu", buy: 1 }, plus: { l: "Aufgestockt", buy: 1 }, minus: { l: "Reduziert", buy: 0 }, exit: { l: "Verkauft", buy: 0 }, short: { l: "Short / Put", buy: 0 } };
const NAV = [
  ["Überblick", [["lage", "Lage"], ["rotation", "Money Rotation"], ["stories", "Hot Stories"], ["level", "Level-Radar"]]],
  ["Markt", [["wirkung", "Wirkung"], ["kompass", "Themen-Kompass"], ["instrumente", "Instrumente"], ["szenarien", "Szenarien"], ["kalender", "Kalender"]]],
  ["Stimmen", [["aussagen", "Aussagen"], ["wechsel", "Meinungswechsel"], ["calls", "Call-Tracker"], ["sagen-tun", "Sagen & Tun"]]],
  ["Wissen", [["wissen", "Wissensbank"], ["sweep", "Sweep & Agent"]]],
  ["Werkzeug", [["cfd", "CFD-Brücke"], ["fragen", "Desk fragen"]]]
];
const PARENT = { p: "wissen", t: "instrumente", s: "stories", x: "kompass", th: "aussagen", a: "aussagen" };
const MON = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];
const D = {}, P = {}, KB = {};
const state = { q: "", stance: "all", grp: "all", onlyNew: false, story: "nvda", lv: "nvda", scope: "Standard", kb: "star", mvf: "all", rot: "ueber", rg: "sek", rs: "r1", ig: "all", is: "n", srt: "d", flow: null, cell: null, fokus: "" };
const slugMap = { t: {}, th: {} };
let sample = null, sampleChecked = false, uid = 0;

const nf = (n, d = 0) => n.toLocaleString("de-DE", { minimumFractionDigits: d, maximumFractionDigits: d });
const fmtD = d => d ? d.slice(8, 10) + "." + d.slice(5, 7) + "." + d.slice(0, 4) : "";
const fmtS = d => d ? d.slice(8, 10) + "." + d.slice(5, 7) + "." : "";
const sign = (n, d = 2) => (n > 0 ? "+" : n < 0 ? "−" : "±") + Math.abs(n).toLocaleString("de-DE", { minimumFractionDigits: d === 1 ? 1 : 0, maximumFractionDigits: d });
const slug = s => s.toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss").replace(/&/g, "und").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const whoName = s => s.p && P[s.p] ? P[s.p].n : (s.who || s.org || "Quelle");
const whoFirm = s => s.p && P[s.p] ? P[s.p].f : (s.who && s.org && s.who !== s.org ? s.org : "");
const href = (type, key) => "#" + (key == null ? type : type + "-" + (type === "t" || type === "th" ? slug(key) : key));
const go = (type, key) => { location.hash = href(type, key); };
const byDate = (a, b) => (a.d < b.d ? 1 : a.d > b.d ? -1 : 0);
const fv = (v, u) => u === "%" ? nf(v, 2) + " %" : nf(v, Math.abs(v) < 1000 ? 2 : (u === "Pkt" ? 2 : 0)) + (u && u !== "Pkt" ? " " + u : "");
const maxSw = () => Math.max(...D.statements.map(s => s.sw || 1));

/* prices */
function ser(sym) {
  const s = D.prices.s[sym];
  if (!s) return null;
  if (!s._t) { const cal = D.prices.cal[s.cal]; s._t = cal.slice(cal.length - s.c.length); }
  return s;
}
const cser = sym => ser(D.desk.chartFor[sym] || sym);
function pxAt(sym, date) { const s = ser(sym); if (!s) return null; let v = null; for (let i = 0; i < s._t.length; i++) { if (s._t[i] <= date) v = s.c[i]; else break; } return v; }
function last(sym) { const s = ser(sym); if (!s) return null; const n = s.c.length; return { v: s.c[n - 1], p: n > 1 ? s.c[n - 2] : null, d: s._t[n - 1], s }; }
function perf(sym, days) { const s = ser(sym); if (!s || s.c.length <= days) return null; const n = s.c.length; return (s.c[n - 1] / s.c[n - 1 - days] - 1) * 100; }

function srcLink(key, short) {
  const s = key && D.desk.sources[key];
  if (!s) return null;
  return h("a", { href: s.u, target: "_blank", rel: "noopener noreferrer" }, (short ? s.n.split(",")[0] : s.n) + " ↗");
}
function tkChip(tk) {
  if (!tk || tk === "—") return null;
  if (tk.includes("·")) return h("span", { class: "chip tk" }, tk);
  return h("a", { class: "chip tk", href: href("t", tk), title: D.desk.assets[tk] || tk }, tk);
}
const thChip = t => h("a", { class: "chip", href: href("th", t) }, t);
const pill = s => h("span", { class: "pill" }, h("b", { style: "color:" + ST[s].c }, ST[s].g), ST[s].l);
const tag = (txt, color) => h("span", { class: "pill" }, color ? h("b", { style: "color:" + color }, "●") : null, txt);
const who = id => P[id] ? h("a", { class: "lk", href: href("p", id) }, P[id].n) : null;
function avatar(p, big) {
  const parts = p.n.replace(/[^A-Za-zÀ-ÿ .-]/g, "").split(/[ -]+/).filter(Boolean);
  return h("span", { class: "av" + (p.star ? " star" : "") + (big ? " lg-av" : ""), "aria-hidden": "true" }, (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase());
}
function panel(cls, micro, title, note, ...body) {
  return h("section", { class: "panel " + cls }, h("div", { class: "ph" }, h("div", {}, h("div", { class: "micro" }, micro), h("h2", {}, title)), note ? h("div", { class: "ph-note" }, note) : null), body);
}

/* tooltip */
const tip = $("#tip");
function showTip(ev, nodes) {
  tip.replaceChildren(...nodes.flat(3).filter(k => k != null && k !== false));
  tip.style.opacity = 1;
  const r = ev.currentTarget.getBoundingClientRect();
  const x = ev.clientX || r.left + r.width / 2, y = ev.clientY || r.bottom;
  tip.style.left = Math.max(8, Math.min(innerWidth - tip.offsetWidth - 8, x + 14)) + "px";
  tip.style.top = Math.max(8, Math.min(innerHeight - tip.offsetHeight - 8, y + 14)) + "px";
}
const hideTip = () => { tip.style.opacity = 0; };
function withTip(el, build) {
  el.addEventListener("pointermove", ev => showTip(ev, build()));
  el.addEventListener("focus", ev => showTip(ev, build()));
  el.addEventListener("pointerleave", hideTip);
  el.addEventListener("blur", hideTip);
  return el;
}

/* stance */
function stanceCounts(list) { const c = { bull: 0, neut: 0, warn: 0, bear: 0 }; list.forEach(s => { c[s.s]++; }); return c; }
const headKey = s => s.p || s.who || s.org || s.id;
function heads(list) { const m = new Map(); list.slice().sort(byDate).forEach(s => { if (!m.has(headKey(s))) m.set(headKey(s), s); }); return [...m.values()]; }
function spread(list) { const seen = new Set(), a = [], b = []; list.slice().sort(byDate).forEach(s => { if (seen.has(headKey(s))) b.push(s); else { seen.add(headKey(s)); a.push(s); } }); return a.concat(b); }
function stanceBar(list, small, raw) {
  if (!raw) list = heads(list);
  const c = stanceCounts(list), n = list.length;
  const bar = h("span", { class: "sbar" + (small ? " sm" : ""), role: "img", "aria-label": ORDER.map(k => ST[k].l + " " + c[k]).join(", ") });
  if (!n) { bar.append(h("span", { style: "flex:1;background:rgba(255,255,255,.06)" })); return bar; }
  ORDER.forEach(k => {
    if (!c[k]) return;
    const seg = h("span", { style: "flex:" + c[k] + ";background:" + ST[k].c, tabindex: small ? null : "0" });
    if (!small) withTip(seg, () => [h("b", {}, ST[k].l), h("span", { class: "mono" }, c[k] + " von " + n + (raw ? " Aussagen" : " Köpfen, je Kopf zählt die jüngste Aussage"))]);
    bar.append(seg);
  });
  return bar;
}