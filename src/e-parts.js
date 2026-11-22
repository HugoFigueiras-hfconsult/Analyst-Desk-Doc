/* ---------- views ---------- */
function rail() {
  const tiles = D.desk.rail.map(k => {
    const l = last(k); if (!l) return null;
    const c = l.p ? (l.v / l.p - 1) * 100 : null;
    return h("a", { class: "tick", href: href("t", k) },
      h("div", { class: "micro" }, l.s.n),
      h("div", { class: "tick-v" }, fv(l.v, l.s.u)),
      h("div", { class: "tick-c" }, c == null ? "" : [h("span", { class: c > 0 ? "up" : "dn", "aria-hidden": "true" }, c > 0 ? "▲" : "▼"), sign(c) + " %"]),
      h("div", { class: "tick-m" }, l.s.b + " · " + fmtS(l.d)));
  });
  const extra = D.desk.snapshot.map(x => h("div", { class: "tick" },
    h("div", { class: "micro" }, x.l), h("div", { class: "tick-v" }, x.v), h("div", { class: "tick-c" }, x.x || ""),
    h("div", { class: "tick-m" }, x.b + " · " + x.ts + " · ", srcLink(x.src, true))));
  return h("section", { class: "rail", "aria-label": "Marktstand" }, tiles, extra);
}
function heroStory(box) {
  box = box || h("div", {});
  const st = D.stories.find(s => s.id === state.story) || D.stories[0];
  const list = D.statements.filter(s => (s.st || []).includes(st.id)).sort(byDate);
  put(box,
    h("div", { class: "hero-g" },
      h("div", {},
        h("div", { class: "micro" }, st.tk), h("p", { class: "hero-t" }, st.t),
        h("div", { class: "hero-k" }, st.kpi), h("p", { class: "note", style: "margin-top:0" }, st.sub),
        st.sym ? storyChart(st) : h("p", { class: "lead" }, st.sum),
        h("div", { class: "row", style: "margin-top:12px" },
          h("a", { class: "btn btn-p btn-s", href: href("s", st.id) }, "Story öffnen"),
          st.lv ? h("a", { class: "btn btn-s", href: "#level", onclick: () => { state.lv = st.id; } }, "Level-Radar") : null)),
      h("div", {},
        h("div", { class: "slist" }, D.stories.map(x => {
          const n = D.statements.filter(s => (s.st || []).includes(x.id)).length;
          return h("button", { class: "srow", type: "button", "aria-pressed": String(x.id === st.id), onclick: () => { state.story = x.id; heroStory(box); layoutCharts(); } },
            h("span", { class: "srow-t" }, x.t), h("span", { class: "srow-k" }, x.kpi),
            h("span", { class: "srow-f" }, x.tk + " · " + n + " Aussagen"), x.sym ? spark(x.sym, 84, 22) : h("span", {}));
        })))),
    h("div", { class: "sub-h" }, "Stimmen zur Story · " + list.length), stanceBar(list), stmList(spread(list), 2, true));
  return box;
}
function moodPanel(cls) {
  const { iso, list: all } = recent(45), list = heads(all), c = stanceCounts(list), n = list.length;
  const groups = Object.keys(D.desk.groups).map(g => ({ l: D.desk.groups[g], list: list.filter(s => s.p && P[s.p] && P[s.p].g === g) }));
  groups.push({ l: "Häuser, Umfragen, Daten", list: list.filter(s => !s.p) });
  return panel(cls, "Stimmungsbild", "Bullen, Mahner, Bären", n + " Köpfe und Häuser seit " + fmtD(iso) + ". Je Kopf zählt nur die jüngste Aussage.",
    stanceBar(list),
    h("div", { class: "mood-rows" }, ORDER.map(k => h("div", { class: "mood-r" }, pill(k),
      h("div", { class: "sbar sm" }, h("span", { style: "flex:0 0 " + (n ? c[k] / n * 100 : 0) + "%;background:" + ST[k].c + ";border-radius:0 3px 3px 0" })),
      h("span", { class: "mono" }, c[k] + " · " + nf(n ? c[k] / n * 100 : 0) + " %")))),
    h("div", { class: "sub-h" }, "Nach Gruppe"),
    groups.filter(g => g.list.length).map(g => h("div", { class: "grp-r" }, h("span", {}, g.l), stanceBar(g.list, true), h("span", { class: "mono", style: "text-align:right" }, g.list.length))),
    D.desk.read ? h("p", { class: "note" }, D.desk.read) : null);
}