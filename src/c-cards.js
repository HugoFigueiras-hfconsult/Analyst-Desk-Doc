function stmList(list, max, keep) {
  list = keep ? list : list.slice().sort(byDate);
  if (!list.length) return h("p", { class: "empty" }, "Noch keine Aussagen erfasst. Der nächste Sweep füllt diese Lücke.");
  return (max ? list.slice(0, max) : list).map(stmCard);
}
function moveRow(m, showWho) {
  const a = AC[m.ac], p = P[m.p];
  return h("div", { class: "mv" },
    h("div", { class: "mv-a" }, h("i", { style: "background:" + (a.buy ? "var(--buy)" : "var(--sell)") }), a.l),
    h("div", {}, h("span", {}, m.nm + " "), tkChip(m.tk),
      h("small", {}, showWho && p ? [who(m.p), ", " + p.f + " · "] : null, m.det + " · " + (m.per || "13F Q3 2026, Stand 30.09.") + " · ", srcLink(m.src || "tr"))));
}
function mvBlock(list, showWho) {
  if (!list.length) return h("p", { class: "empty" }, "Keine Positionsänderungen erfasst.");
  const buys = list.filter(m => AC[m.ac].buy), sells = list.filter(m => !AC[m.ac].buy);
  return [h("p", { class: "note" }, buys.length + " Käufe, " + sells.length + " Verkäufe oder Shorts"), buys.concat(sells).map(m => moveRow(m, showWho))];
}

/* ladder */
function ladder(st) {
  const lv = st.lv, vals = lv.items.map(i => i.v).concat(lv.now);
  const lo = Math.min(...vals), hi = Math.max(...vals), pad = (hi - lo) * 0.06 || 1;
  const pos = v => ((v - (lo - pad)) / (hi - lo + 2 * pad) * 100).toFixed(2) + "%";
  const rows = lv.items.map(i => ({ ...i })).concat({ v: lv.now, l: lv.nowL, k: "now" }).sort((a, b) => b.v - a.v);
  return h("div", {},
    h("div", { class: "lg" },
      h("span", {}, h("i", { class: "dotk", style: "background:var(--buy)" }), "Kursziel"),
      h("span", {}, h("i", { class: "dotk", style: "background:var(--warn)" }), "Unterstützung oder Untergrenze"),
      h("span", {}, h("i", { class: "ring" }), "Referenz"),
      h("span", {}, h("i", { style: "background:var(--accent);transform:rotate(45deg)" }), "aktueller Stand")),
    rows.map(r => h("div", { class: "lv-row" + (r.k === "now" ? " now" : "") },
      h("div", {}, r.l, r.d ? h("small", {}, fmtD(r.d)) : null),
      h("div", { class: "lv-v" }, nf(r.v, r.v % 1 ? 2 : 0) + (lv.u === "$" ? " $" : "")),
      h("div", { class: "lv-t" }, h("span", { class: "lv-now", style: "left:" + pos(lv.now) }), h("span", { class: "lv-dot " + r.k, style: "left:" + pos(r.v) })),
      h("div", { class: "lv-d" }, r.k === "now" ? "" : sign(Math.round((r.v / lv.now - 1) * 1000) / 10) + " %"))),
    h("p", { class: "note" }, "Quellen: ", (st.src || []).map((k, i) => [i ? " · " : "", srcLink(k)])));
}
const lvFor = st => st.lv ? st.lv.items.concat({ v: st.lv.now, l: "aktuell", k: "now" }) : [];