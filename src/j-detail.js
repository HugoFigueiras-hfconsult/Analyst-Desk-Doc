/* ---------- detail pages ---------- */
function chgD(sym, days) { const s = cser(sym); if (!s) return "–"; const n = s.c.length, t = addD(s._t[n - 1], -days); let b = null; for (let i = 0; i < n; i++) { if (s._t[i] <= t) b = s.c[i]; else break; } return b == null ? "–" : sign(delta(s, b, s.c[n - 1]), 1) + dU(s); }
const kvB = (m, v, sub) => h("div", {}, h("span", { class: "micro" }, m), h("b", {}, v), sub ? h("small", {}, sub) : null);
const linkRow = (l, kids) => kids && kids.length ? h("div", { class: "idx-r" }, h("span", { class: "micro" }, l), h("div", { class: "chips" }, kids)) : null;
Object.assign(DETAIL, {
  a(key) {
    const s = D.statements.find(x => x.id === key); if (!s) return null;
    const name = whoName(s), A = s.a || [], rx = stmRx(s, 4), syms = A.filter(a => cser(a) && cser(a).c.length > 24).slice(0, 2);
    const same = s.p ? D.statements.filter(x => x.p === s.p && x.id !== s.id && ((x.a || []).some(a => A.includes(a)) || (x.st || []).some(k => (s.st || []).includes(k)))).sort(byDate) : [];
    const others = D.statements.filter(x => x.id !== s.id && !(s.p && x.p === s.p) && Math.abs(dayDiff(x.d, s.d)) <= 4 && (x.a || []).some(a => A.includes(a))).sort(byDate).slice(0, 8);
    const mv = s.p ? D.moves.filter(m => m.p === s.p && m.tk.split("·").some(t => A.includes(t))) : [];
    const calls = D.calls.filter(c => c.stm === s.id), sc = D.scenarios.filter(x => (s.st || []).includes(x.st)), cf = cfdFor(A);
    const side = v => v === "bull" ? 1 : v === "neut" ? 0 : -1, contra = others.filter(x => side(x.s) * side(s.s) < 0).length;
    return { title: name + " · " + fmtD(s.d), crumb: "Aussage · " + s.k, body: [h("div", { class: "grid" },
      panel("c12 hero", whoFirm(s) || s.k, name, h("span", {}, pill(s.s), (s.sw || 1) === maxSw() ? [" ", h("span", { class: "new" }, "NEU")] : null),
        h("p", { class: "stm-big" }, s.t),
        s.lv ? h("p", { class: "stm-lv" }, s.lv) : null,
        s.chg ? h("p", { class: "note" }, "Meinungswechsel bei " + s.chg.w + ": " + s.chg.f, h("span", { class: "arrow" }, "→"), h("b", { style: "color:var(--ink)" }, s.chg.t)) : null,
        s.fx ? h("p", { class: "stm-fx" }, h("span", { class: "micro" }, "Belegte Wirkung "), s.fx.t + " ", srcLink(s.fx.src, true)) : null,
        h("p", { class: "note" }, fmtD(s.d) + (s.da ? " (Datum näherungsweise aus dem Bericht)" : "") + " · Quelle: ", srcLink(s.src), s.p && P[s.p] ? [" · ", h("a", { href: href("p", s.p) }, "Alles von " + name)] : null)),
      h("div", { class: "c5 stack" }, panel("", "Worauf es wirkt", "Betroffene Werte, Stories und Gebiete", null,
        h("div", { class: "idx wide" },
          linkRow("Werte", A.map(tkChip)),
          linkRow("Stories", (s.st || []).map(id => { const st = D.stories.find(x => x.id === id); return st ? h("a", { class: "chip", href: href("s", id) }, st.t) : null; })),
          linkRow("Gebiete", (s.ar || []).map(k => h("a", { class: "chip", href: href("x", k) }, arLabel(k)))),
          linkRow("Themen", (s.th || []).map(thChip)),
          linkRow("Szenarien", sc.map(x => h("a", { class: "chip", href: "#szenarien" }, short(x.t, 44)))),
          linkRow("CFDs", cf.map(k => h("a", { class: "chip cf", href: "#cfd" }, k)))),
        calls.length ? [h("div", { class: "sub-h" }, "Daraus abgeleitete Calls"), calls.map(c => { const e = callEval(c); return h("div", { class: "lrow" }, h("span", {}, tkChip(c.a)), h("span", {}, c.t + " ", tag(e.st, VC[e.cls]), e.mv != null ? h("span", { class: "mono" }, " " + sign(e.mv, 1) + " %") : null)); })] : null),
        mv.length ? panel("", "Sagen und Tun", "Was " + name + " in diesen Werten getan hat", null, mvBlock(mv, false)) : null,
        same.length ? panel("", "Verlauf", "Was " + name + " dazu sonst gesagt hat", same.length + " weitere Aussagen", stmList(same, 4)) : null),
      h("div", { class: "c7 stack" }, panel("", "Kurs danach", rx.length ? "Wie sich die Werte seither bewegt haben" : "Noch keine Kursbewegung messbar", "Zeitlicher Zusammenhang, keine belegte Ursache.",
        rx.length ? h("div", { class: "tw" }, h("table", { class: "tbl" },
          h("thead", {}, h("tr", {}, h("th", {}, "Wert"), h("th", { class: "num" }, "Am Tag"), h("th", { class: "num" }, "5 Handelstage"), h("th", { class: "num" }, "Bis heute"), h("th", {}, "Einordnung"))),
          h("tbody", {}, rx.map(r => h("tr", {}, h("td", {}, tkChip(r.sym), h("span", { class: "srow-f" }, " " + fmtS(r.d))), h("td", { class: "num" }, arrow(r.day), sign(r.day, 1) + r.u), h("td", { class: "num" }, r.wk == null ? "–" : sign(r.wk, 1) + r.u),
            h("td", { class: "num" }, sign(r.since, 1) + r.u), h("td", {}, r.z == null ? "–" : r.big ? tag(nf(Math.abs(r.z), 1) + "-fache Tagesschwankung", "var(--accent)") : "im üblichen Rahmen")))))) : h("p", { class: "empty" }, "Für die genannten Werte gibt es noch keinen Handelstag nach der Aussage oder keine Kursreihe."),
        syms.map(a => priceChart(a, { h: 190, marks: { [s.d]: [{ k: "s", s }] } }))),
      panel("", "Umfeld", "Andere Stimmen in denselben Tagen", others.length ? contra + " von " + others.length + " mit Gegenrichtung" : null,
        others.length ? others.map(stmCard) : h("p", { class: "empty" }, "Keine weitere Aussage zu diesen Werten im Abstand von vier Tagen."))))] };
  },
  t(key) {
    const tk = slugMap.t[key]; if (!tk) return null;
    const l = last(tk), cs = cser(tk), st = D.statements.filter(s => (s.a || []).includes(tk)), mv = D.moves.filter(m => m.tk.split("·").includes(tk));
    const story = D.stories.find(s => s.tk === tk || s.px === tk), calls = D.calls.filter(c => c.a === tk), alias = !l && cs, hi = cs ? Math.max(...cs.c) : null;
    const rs = rotStats().find(r => r.k === tk), r1 = cs && tk !== D.desk.rot.bench && !alias ? rel(tk, 30) : null, cal = D.calendar.filter(e => (e.aff || []).includes(tk) && (e.e || e.d) >= TODAY).slice(0, 4);
    const fut = alias || /Future/.test((cs || {}).b || "");
    return { title: tk + (D.desk.assets[tk] || (cs && cs.n) ? " · " + (D.desk.assets[tk] || cs.n) : ""), crumb: cs ? cs.b : "Wert", body: [h("div", { class: "grid" },
      panel("c12 hero", cs ? cs.b : "Wert", "Grober Kursverlauf", alias ? "Für diesen Wert liegt nur die Future-Reihe vor, nicht der Spotpreis." : story && story.lv ? "Linien: Marken aus der Story " + story.t + "." : null,
        l ? h("div", { class: "kv" },
          kvB("Schluss " + fmtS(l.d), fv(l.v, l.s.u)), kvB("1 Tag", l.p ? sign(delta(l.s, l.p, l.v), 2) + dU(l.s) : "–"), kvB("1 Woche", chgD(tk, 7)), kvB("1 Monat", chgD(tk, 30)), kvB("3 Monate", chgD(tk, 91)),
          kvB("Zum 6-Monats-Hoch", l.s.u === "%" ? sign((l.v - hi) * 100, 0) + " Bp" : sign((l.v / hi - 1) * 100, 1) + " %"),
          r1 != null ? kvB("Gegen S&P 500 · 1 M", sign(r1, 1) + " Pp.") : null) : null,
        rs ? h("p", { class: "note" }, "Money Rotation: ", qTag(rs.q), " " + QD[rs.q][1] + ". ", h("a", { class: "more", href: "#rotation" }, "Zur Rotation")) : null,
        cs ? priceChart(tk, { h: 340, levels: story && story.lv && !fut ? lvFor(story) : [], marks: marksFor(tk, story && (story.px === tk || story.sym === tk || story.tk === tk) ? story : null) }) : h("p", { class: "empty" }, "Für diesen Wert liegt kein Kursverlauf vor."),
        story ? h("p", { class: "note" }, h("a", { class: "more", href: href("s", story.id) }, "Zur Story: " + story.t)) : null),
      panel("c7", "Aussagen", "Was zu diesem Wert gesagt wurde", st.length + " Aussagen", st.length ? stanceBar(st) : null, stmList(st)),
      panel("c5", "Positionen, Calls, Termine", "Wer hier handelt und was ansteht", null, mvBlock(mv, true),
        calls.length ? [h("div", { class: "sub-h" }, "Calls"), calls.map(c => { const e = callEval(c); return h("div", { class: "lrow" }, h("time", { datetime: c.d }, fmtS(c.d)), h("span", {}, who(c.p), ": " + c.t + " ", tag(e.st, VC[e.cls]))); })] : null,
        cal.length ? [h("div", { class: "sub-h" }, "Nächste Termine mit Wirkung auf " + tk), h("ul", { class: "list" }, cal.map(calItem))] : null))] };
  },
  s(key) {
    const st = D.stories.find(s => s.id === key); if (!st) return null;
    const sc = D.scenarios.filter(x => x.st === key), list = D.statements.filter(s => (s.st || []).includes(key)), mv = D.moves.filter(m => m.tk.split("·").includes(st.tk));
    const cal = D.calendar.filter(e => e.st === key && (e.e || e.d) >= TODAY), sym = st.px || st.sym, start = st.tl.length ? st.tl[0].d : null, cnt = {};
    list.forEach(s => (s.a || []).forEach(a => { cnt[a] = (cnt[a] || 0) + 1; }));
    const aff = Object.entries(cnt).sort((a, b) => b[1] - a[1]).filter(([a]) => cser(a) && cser(a).c.length > 24).slice(0, 8);
    return { title: st.t, crumb: "Hot Story · " + st.tk, body: [
      h("nav", { class: "tabs", "aria-label": "Stories" }, D.stories.map(x => h("a", { class: "tab", href: href("s", x.id), "aria-current": x.id === key ? "page" : null }, x.t))),
      h("div", { class: "grid" },
        panel("c8 hero", st.tk, st.kpi, st.sub, h("p", { class: "lead" }, st.sum), st.sym ? storyChart(st, st.lv ? 360 : 260) : null),
        panel("c4", "Zeitleiste", "Was wann geschah", sym ? "Mit der Kursbewegung des Tages" : null,
          h("ul", { class: "list" }, st.tl.map(e => { const r = sym && e.d <= D.desk.pxAsOf ? react(sym, e.d) : null; return h("li", { class: e.d > TODAY ? "fut" : null }, h("time", { datetime: e.d }, fmtS(e.d)), h("span", {}, e.t, r && r.d === e.d ? h("div", { style: "margin-top:5px" }, rxChip(r)) : null)); })),
          h("p", { class: "note" }, "Quellen: ", (st.src || []).map((k, i) => [i ? " · " : "", srcLink(k)]))),
        aff.length ? panel("c12", "Wirkung", "Wen die Story bewegt", "Die in den Aussagen am häufigsten genannten Werte" + (start ? " und ihre Kursentwicklung seit dem ersten Ereignis am " + fmtD(start) + "." : "."),
          h("div", { class: "inst" }, aff.map(([a, n]) => {
            const s2 = cser(a), i0 = start ? idxOn(s2._t, start) : -1, b = i0 > 0 ? s2.c[i0 - 1] : null, v = b ? delta(s2, b, s2.c[s2.c.length - 1]) : null;
            return h("a", { class: "ic", href: href("t", a) }, h("span", {}, h("span", { class: "chip tk", style: "border:0;padding:0" }, a), h("span", { class: "ic-n" }, " " + (D.desk.assets[a] || s2.n))), spark(a, 96, 28),
              h("span", { class: "ic-v" }, v == null ? "–" : [arrow(v), sign(v, 1) + dU(s2)]), h("span", { class: "ic-c" }, n + (n === 1 ? " Aussage" : " Aussagen")), h("span", { class: "srow-f", style: "grid-column:1/-1" }, (start ? "seit " + fmtS(start) + " · " : "") + s2.b));
          }))) : null,
        st.lv ? panel("c7", "Level", "Genannte Marken", null, ladder(st)) : null,
        sc.length ? panel(st.lv ? "c5" : "c12", "Szenarien", "Was eingepreist und erwartet wird", null, h("div", { style: "display:grid;gap:10px" }, sc.map(x => scenEl(x, false)))) : null,
        cal.length ? panel("c12", "Termine", "Was für diese Story ansteht", null, h("ul", { class: "list" }, cal.map(calItem))) : null,
        panel(mv.length ? "c7" : "c12", "Stimmen", "Alle Aussagen zur Story", list.length + " Aussagen", list.length ? stanceBar(list) : null, stmList(list)),
        mv.length ? panel("c5", "Positionen", "Wer " + st.tk + " handelt", null, mvBlock(mv, true)) : null)] };
  },
  x(key) {
    if (!D.desk.areas[key]) return null;
    const a = areaStats().find(x => x.k === key) || { st: [], v: ["Uneinheitlich", "neut"], talk: 0, money: null, buy: [], sell: [] }, mv = D.moves.filter(m => m.sec === key);
    const px = D.desk.areaPx[key], rs = px && rotStats().find(r => r.k === px), marks = {};
    a.st.forEach(s => { (marks[s.d] = marks[s.d] || []).push({ k: "s", s }); });
    return { title: D.desk.areas[key], crumb: "Gebiet", body: [h("div", { class: "grid" },
      panel("c12 hero", "Einordnung", a.v[0], "Worte gegen Geld: Saldo der Aussagen und Saldo der 13F-Meldungen.",
        h("div", { class: "kv" }, kvB("Stimmen-Saldo", sign(a.talk), a.st.length + " Aussagen"), kvB("13F Käufe / Verkäufe", a.money == null ? "–" : a.buy.length + " / " + a.sell.length, a.money == null ? "keine Daten" : "Saldo " + sign(a.money)),
          rs ? kvB("Kurs gegen S&P 500 · 1 M", sign(rs.r1, 1) + " Pp.", "3 M " + sign(rs.r3, 1) + " Pp.") : null, rs ? kvB("Lage in der Rotation", QD[rs.q][0], QD[rs.q][1]) : null),
        stanceBar(a.st),
        px && cser(px) ? [h("div", { class: "sub-h" }, "Kurs-Stellvertreter: " + cser(px).n), priceChart(px, { h: 260, marks }), h("p", { class: "note" }, "Kein exakter Korb des Gebiets, sondern der nächstliegende handelbare Stellvertreter.")] : null),
      panel("c7", "Aussagen", "Was zu diesem Gebiet gesagt wurde", a.st.length + " Aussagen", stmList(a.st)),
      panel("c5", "Positionen", "Wer hier kauft und verkauft", null, mvBlock(mv, true)))] };
  }
});
