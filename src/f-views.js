const VIEWS = {
  kompass() {
    const A = areaStats(), box = h("div", { class: "chart" });
    box._draw = (el, W) => {
      const H = 400, strip = W > 760, padL = 16, padT = 26, padB = 30, x1 = strip ? W * 0.72 : W - 16, sx = W * 0.79;
      const M = A.filter(a => a.money != null), S = A.filter(a => a.money == null);
      const sq = v => Math.sign(v) * Math.sqrt(Math.abs(v));
      const xm = sq(Math.max(4, ...M.map(a => Math.abs(a.money)))) + 0.5, ym = sq(Math.max(4, ...A.map(a => Math.abs(a.talk)))) + 0.5;
      const X = v => padL + (x1 - padL) * (sq(v) + xm) / (2 * xm), Y = v => padT + (H - padT - padB) * (1 - (sq(v) + ym) / (2 * ym));
      const R = a => 5 + Math.min(10, a.st.length) * 0.8;
      let g = `<rect x="${padL}" y="${padT}" width="${x1 - padL}" height="${H - padT - padB}" fill="rgba(255,255,255,.012)" stroke="#1a2434"/>` +
        `<line x1="${X(0)}" x2="${X(0)}" y1="${padT}" y2="${H - padB}" stroke="#2b384d"/><line x1="${padL}" x2="${x1}" y1="${Y(0)}" y2="${Y(0)}" stroke="#2b384d"/>` +
        `<text x="${padL + 8}" y="${padT + 16}" class="q">Gelobt, aber verkauft</text><text x="${x1 - 8}" y="${padT + 16}" class="q" text-anchor="end">Rückenwind</text>` +
        `<text x="${padL + 8}" y="${H - padB - 9}" class="q">Abbau und Warnungen</text><text x="${x1 - 8}" y="${H - padB - 9}" class="q" text-anchor="end">Gewarnt, aber gekauft</text>` +
        `<text x="${padL}" y="${H - 8}" class="ax">← mehr Verkäufe</text><text x="${X(0)}" y="${H - 8}" class="ax" text-anchor="middle">Geld: Saldo der 13F-Meldungen</text><text x="${x1}" y="${H - 8}" class="ax" text-anchor="end">mehr Käufe →</text>` +
        `<text x="${padL}" y="14" class="ax">↑ Stimmen: mehr Zustimmung · ↓ mehr Warnungen</text>`;
      const pts = M.map(a => ({ a, x: X(a.money), y: Y(a.talk), r: R(a) }));
      if (strip) {
        g += `<line x1="${sx}" x2="${sx}" y1="${padT}" y2="${H - padB}" stroke="#1a2434"/><text x="${sx - 6}" y="14" class="ax">Ohne 13F-Daten</text>`;
        S.forEach(a => pts.push({ a, x: sx, y: Y(a.talk), r: R(a), s: 1 }));
      }
      const sp = pts.filter(p => p.s).sort((a, b) => a.y - b.y);
      for (let i = 1; i < sp.length; i++) if (Math.abs(sp[i].y - sp[i - 1].y) < sp[i].r + sp[i - 1].r && Math.abs(sp[i].x - sp[i - 1].x) < 2) sp[i].x = sp[i - 1].x + sp[i - 1].r + sp[i].r + 4;
      const boxes = pts.map(p => ({ x: p.x - p.r - 1, y: p.y - p.r - 1, w: 2 * p.r + 2, h: 2 * p.r + 2, o: p }));
      const free = (b, p) => !boxes.some(o => o.o !== p && b.x < o.x + o.w && o.x < b.x + b.w && b.y < o.y + o.h && o.y < b.y + b.h);
      pts.forEach(p => {
        const w = p.a.l.length * 6.1, r1 = p.r + 7, cand = [0, 13, -13, 26, -26].map(dy => ({ x: p.x + r1, y: p.y + 4 + dy, an: "start", bx: p.x + r1 }));
        if (!p.s) cand.splice(1, 0, { x: p.x - r1, y: p.y + 4, an: "end", bx: p.x - r1 - w }, { x: p.x, y: p.y - p.r - 7, an: "middle", bx: p.x - w / 2 }, { x: p.x, y: p.y + p.r + 15, an: "middle", bx: p.x - w / 2 });
        const k = cand.find(k => (p.s || (k.bx > padL + 2 && k.bx + w < x1 - 2 && k.y > padT + 30 && k.y < H - padB - 22)) && free({ x: k.bx, y: k.y - 10, w, h: 13 }, p)) || cand[0];
        p.lab = k; boxes.push({ x: k.bx, y: k.y - 10, w, h: 13, o: p });
      });
      pts.forEach(p => {
        const c = { buy: "#1c9fc4", sell: "#e5477d", warn: "#ab9016", neut: "#5d6a82" }[p.a.v[1]];
        g += `<g data-k="${p.a.k}" tabindex="0" role="link" aria-label="${esc(p.a.l + ": " + p.a.v[0])}"><circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${p.r.toFixed(1)}" fill="${p.s ? "#0c111b" : c}" stroke="${p.s ? c : "#0c111b"}" stroke-width="2"/>` +
          `<text x="${p.lab.x.toFixed(1)}" y="${p.lab.y.toFixed(1)}" class="lb" style="fill:#e9eef6" text-anchor="${p.lab.an}">${esc(p.a.l)}</text></g>`;
      });
      el.innerHTML = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Themen-Kompass: Stimmen-Saldo gegen Geld-Saldo je Gebiet">${g}</svg>`;
      el.querySelectorAll("[data-k]").forEach(n => {
        const a = A.find(x => x.k === n.getAttribute("data-k"));
        n.addEventListener("click", () => go("x", a.k));
        n.addEventListener("keydown", ev => { if (ev.key === "Enter") go("x", a.k); });
        withTip(n, () => [h("b", {}, a.l), h("div", {}, "Stimmen: ", h("span", { class: "mono" }, a.c.bull + " bullisch, " + (a.c.warn + a.c.bear) + " warnend oder bärisch, " + a.c.neut + " neutral")),
          h("div", {}, "Geld: ", h("span", { class: "mono" }, a.money == null ? "keine 13F-Daten" : a.buy.length + " Käufe, " + a.sell.length + " Verkäufe")), h("div", {}, a.v[0])]);
      });
    };
    const rows = A.slice().sort((a, b) => (a.talk + (a.money || 0)) - (b.talk + (b.money || 0)));
    return { title: "Themen-Kompass", crumb: "Markt", body: [h("div", { class: "grid" },
      panel("c12 hero", "Stimmen gegen Geld", "Wo Worte und Positionen zusammenpassen", "Jeder Punkt ist ein Gebiet. Hoch: mehr bullische als warnende Aussagen. Rechts: mehr Käufe als Verkäufe in den 13F-Meldungen. Größe: Zahl der Aussagen. Die Achsen sind zur Mitte hin gestreckt, damit kleine Salden lesbar bleiben.",
        h("div", { class: "lg" }, h("span", {}, h("i", { class: "dotk", style: "background:var(--buy)" }), "Rückenwind"), h("span", {}, h("i", { class: "dotk", style: "background:var(--sell)" }), "Abbau und Warnungen"),
          h("span", {}, h("i", { class: "dotk", style: "background:var(--warn)" }), "Worte und Geld widersprechen sich"), h("span", {}, h("i", { class: "dotk", style: "background:var(--neut)" }), "uneinheitlich"), h("span", {}, h("i", { class: "ring" }), "nur Stimmen, keine Positionsdaten")),
        box),
      panel("c12", "Tabelle", "Von kritisch bis gefragt", "Sortiert nach der Summe aus Stimmen- und Geld-Saldo. Zeile öffnen für Aussagen und Einzelwerte.",
        h("div", { class: "tw" }, h("table", { class: "tbl" },
          h("thead", {}, h("tr", {}, h("th", {}, "Gebiet"), h("th", {}, "Einordnung"), h("th", {}, "Stimmen"), h("th", { class: "num" }, "Saldo"), h("th", { class: "num" }, "13F Käufe / Verkäufe"), h("th", {}, "Zuletzt"))),
          h("tbody", {}, rows.map(a => { const l = a.st.slice().sort(byDate)[0]; return h("tr", {},
            h("td", {}, h("a", { class: "lk", href: href("x", a.k) }, a.l)), h("td", {}, tag(a.v[0], VC[a.v[1]])),
            h("td", { style: "min-width:120px" }, stanceBar(a.st, true)), h("td", { class: "num" }, sign(a.talk)),
            h("td", { class: "num" }, a.money == null ? "–" : a.buy.length + " / " + a.sell.length),
            h("td", {}, l ? [whoName(l), " ", h("span", { class: "mono" }, fmtS(l.d))] : "–")); }))))))] };
  },
  wechsel() {
    return { title: "Meinungswechsel", crumb: "Stimmen", body: [h("div", { class: "grid" }, panel("c12", "Vorher und nachher", "Wer seine Sicht geändert hat", "Geänderte Kursziele, Ratings, Prognosen und Positionen. Jeder Sweep ergänzt, was sich gegenüber früheren Aussagen verschoben hat.", changeRows()))] };
  },
  calls() {
    const rows = D.calls.map(c => ({ c, e: callEval(c) })).sort((a, b) => byDate(a.c, b.c)), per = {};
    rows.forEach(({ c, e }) => { const t = per[c.p] || (per[c.p] = { ok: 0, no: 0, open: 0 }); if (e.ok === true) t.ok++; else if (e.ok === false) t.no++; else t.open++; });
    return { title: "Call-Tracker", crumb: "Stimmen", body: [
      h("p", { class: "lead" }, "Zwischenstand seit der Aussage, kein Endurteil: Kursbewegung vom Schlusskurs am Tag der Aussage bis zum letzten Schluss. Kursziele bleiben bis zu ihrem Zieldatum offen. Eine Trefferquote wird erst ausgewiesen, wenn je Kopf genug abgeschlossene Calls vorliegen."),
      h("div", { class: "grid" },
        panel("c8", "Alle Calls", "Messbare Aussagen und ihr Verlauf", rows.length + " Calls · Kurse vom " + fmtD(D.desk.pxAsOf),
          h("div", { class: "tw" }, h("table", { class: "tbl" },
            h("thead", {}, h("tr", {}, h("th", {}, "Datum"), h("th", {}, "Wer"), h("th", {}, "Wert"), h("th", {}, "Call"), h("th", { class: "num" }, "Damals"), h("th", { class: "num" }, "Jetzt"), h("th", { class: "num" }, "Seitdem"), h("th", {}, "Stand"))),
            h("tbody", {}, rows.map(({ c, e }) => h("tr", {},
              h("td", { class: "mono" }, fmtS(c.d)), h("td", {}, who(c.p)), h("td", {}, tkChip(c.a)),
              h("td", {}, c.t, c.note ? h("div", { class: "srow-f" }, c.note) : null),
              h("td", { class: "num" }, e.ref != null ? nf(e.ref, e.ref < 1000 ? 2 : 0) : "–"), h("td", { class: "num" }, e.now != null ? nf(e.now, e.now < 1000 ? 2 : 0) : "–"),
              h("td", { class: "num" }, e.mv != null ? sign(e.mv, 1) + " %" : "–"),
              h("td", {}, tag(e.st, VC[e.cls]), e.need != null ? h("div", { class: "srow-f" }, "bis Ziel " + sign(e.need, 1) + " %") : null))))))),
        panel("c4", "Je Kopf", "Zwischenstand", null, h("table", { class: "tbl" },
          h("thead", {}, h("tr", {}, h("th", {}, "Wer"), h("th", { class: "num" }, "Im Plan"), h("th", { class: "num" }, "Dagegen"), h("th", { class: "num" }, "Offen"))),
          h("tbody", {}, Object.entries(per).sort((a, b) => (b[1].ok + b[1].no) - (a[1].ok + a[1].no)).map(([id, t]) => h("tr", {}, h("td", {}, who(id)), h("td", { class: "num" }, t.ok), h("td", { class: "num" }, t.no), h("td", { class: "num" }, t.open)))))))] };
  },
  "sagen-tun"() {
    const rows = sagenTun();
    return { title: "Sagen & Tun", crumb: "Stimmen", body: [h("div", { class: "grid" }, panel("c12", "Abgleich", "Passen Worte und Positionen zusammen?", "Für jeden Kopf und Wert, zu dem sowohl eine Aussage als auch eine Positionsänderung vorliegt. 13F-Positionen zeigen den Stand 30.09.",
      rows.length ? h("div", { class: "tw" }, h("table", { class: "tbl" },
        h("thead", {}, h("tr", {}, h("th", {}, "Wer"), h("th", {}, "Wert"), h("th", {}, "Sagt"), h("th", {}, "Tut"), h("th", {}, "Abgleich"))),
        h("tbody", {}, rows.map(r => h("tr", {}, h("td", {}, who(r.p.id)), h("td", {}, tkChip(r.tk)),
          h("td", {}, pill(r.s.s), h("div", { class: "srow-f" }, fmtS(r.s.d) + " · " + r.s.k)),
          h("td", {}, r.m.map(m => h("div", {}, h("b", {}, AC[m.ac].l), " · " + m.det, h("span", { class: "srow-f" }, " · " + (m.per || "13F Q3"))))),
          h("td", {}, tag(r.v[0], VC[r.v[1]]))))))) : h("p", { class: "empty" }, "Noch kein Kopf mit Aussage und Position zum selben Wert.")))] };
  },
  wissen() {
    const cov = coverage(), q = state.q;
    let ppl = D.people.filter(p => (state.kb === "all" || (state.kb === "star" ? p.star : cov.has(p.id))) && (state.grp === "all" || state.grp === "org" || p.g === state.grp) && (!q || (p.n + " " + p.f + " " + p.r).toLowerCase().includes(q)));
    ppl.sort((a, b) => ((b.star || 0) - (a.star || 0)) || (cov.has(b.id) - cov.has(a.id)) || a.n.localeCompare(b.n, "de"));
    return { title: "Wissensbank", crumb: "Wissen · " + D.people.length + " Köpfe, " + cov.size + " mit Daten", body: [
      h("p", { class: "lead" }, "Die Ablage zu jedem Kopf: Profil, Kanäle, stehende Thesen, Aussagen, Positionen und offene Fragen. Der Sweep-Agent liest sie vor jedem Lauf und schreibt sie danach fort."),
      h("div", { class: "filters" },
        [["star", "Leitfiguren"], ["data", "Mit Daten"], ["all", "Alle"]].map(([k, l]) => h("button", { class: "chip", type: "button", "aria-pressed": String(state.kb === k), onclick: () => { state.kb = k; route(true); } }, l)),
        [["all", "Alle Gruppen"]].concat(Object.entries(D.desk.groups)).map(([k, l]) => h("button", { class: "chip", type: "button", "aria-pressed": String(state.grp === k), onclick: () => { state.grp = k; route(true); } }, l))),
      ppl.length ? h("div", { class: "kb" }, ppl.map(p => {
        const st = D.statements.filter(s => s.p === p.id).sort(byDate), mv = D.moves.filter(m => m.p === p.id).length;
        return h("a", { class: "kc" + (cov.has(p.id) ? "" : " off"), href: href("p", p.id) },
          avatar(p), h("span", {}, h("span", { class: "kc-n" }, p.n), h("span", { class: "kc-f", style: "display:block" }, p.f)),
          h("span", { style: "grid-column:1/-1" }, stanceBar(st, true, true)),
          h("span", { class: "kc-m" }, h("span", {}, st.length + " Aussagen · " + mv + " Positionen"), h("span", {}, st[0] ? fmtS(st[0].d) : cov.has(p.id) ? "13F" : "wartet")));
      })) : h("p", { class: "empty" }, "Niemand passt zu Filter und Suche.")] };
  },
  cfd() {
    const since = recent(30).iso;
    return { title: "CFD-Brücke", crumb: "Werkzeug", body: [
      h("p", { class: "lead" }, "Kontext für deine sechs Instrumente in den festgelegten Referenzen: Kassa-Indizes und Gold Spot, nie Futures. Die Stände sind Schlusskurse des Basiswerts, keine Capital.com-Quotes. Die Seite liefert Kontext für die Analyse, keine Setups und keine Orders."),
      h("div", { class: "cards2" }, D.desk.cfd.map(c => {
        const l = c.ref ? last(c.ref) : null, st = D.statements.filter(s => s.d >= since && (s.a || []).some(a => c.as.includes(a))).sort(byDate);
        const story = c.story && D.stories.find(s => s.id === c.story), cnt = stanceCounts(st), status = h("span", { class: "srow-f", role: "status" });
        const lv = story && story.lv ? story.lv.items.filter(i => i.k !== "ref").sort((a, b) => b.v - a.v) : [];
        const text = () => c.k + " (" + c.def + ")\n" + (l ? "Referenz: " + fv(l.v, l.s.u) + ", Schluss " + fmtD(l.d) + ", " + D.prices.src : (c.note || "")) +
          "\nStimmen seit " + fmtD(since) + ": " + ORDER.map(k => ST[k].l + " " + cnt[k]).join(", ") +
          (lv.length ? "\nGenannte Marken: " + lv.map(i => nf(i.v, i.v % 1 ? 2 : 0) + " (" + i.l + ", " + fmtS(i.d) + ")").join("; ") : "") +
          "\nAussagen:\n" + (st.length ? st.slice(0, 6).map(s => "- " + fmtS(s.d) + " " + whoName(s) + " [" + ST[s.s].l + "]: " + s.t + (s.lv ? " | " + s.lv : "")).join("\n") : "- keine");
        return h("div", { class: "cfd" },
          h("div", { class: "story-top" }, h("div", {}, h("h3", {}, c.k), h("div", { class: "srow-f", style: "margin-top:5px" }, c.def)), c.ref ? spark(c.ref, 120, 36) : null),
          l ? h("div", {}, h("span", { class: "ic-v", style: "font-size:20px" }, fv(l.v, l.s.u)), h("span", { class: "ic-c" }, l.p ? "  " + sign((l.v / l.p - 1) * 100) + " %" : ""),
            h("div", { class: "srow-f" }, l.s.b + " · Schluss " + fmtD(l.d) + " · " + D.prices.src)) : null,
          c.note ? h("p", { class: "note", style: "margin:0" }, c.note) : null,
          h("div", { class: "sub-h", style: "margin:6px 0 0" }, "Stimmen seit " + fmtS(since) + " · " + st.length), stanceBar(st, true),
          lv.length ? h("p", { class: "note", style: "margin:0" }, "Marken: ", lv.slice(0, 6).map((i, n) => [n ? " · " : "", h("span", { class: "mono", style: "color:var(--ink)" }, nf(i.v, i.v % 1 ? 2 : 0)), " " + i.l])) : null,
          st.slice(0, 2).map(s => h("p", { class: "note", style: "margin:0" }, h("span", { class: "mono" }, fmtS(s.d) + " "), s.p && P[s.p] ? who(s.p) : whoName(s), ": " + (s.lv || s.t))),
          h("div", { class: "row", style: "margin-top:auto" },
            h("button", { class: "btn btn-s btn-p", type: "button", onclick: async () => { try { await navigator.clipboard.writeText(text()); status.textContent = "Kontext kopiert."; } catch (e) { status.textContent = "Kopieren wurde blockiert."; } } }, "Kontext kopieren"),
            c.ref ? h("a", { class: "btn btn-s", href: href("t", c.ref) }, "Verlauf") : null,
            h("a", { class: "btn btn-s", href: "https://www.tradingview.com/chart/?symbol=" + encodeURIComponent(c.tv), target: "_blank", rel: "noopener noreferrer" }, "TradingView ↗"), status));
      }))] };
  },
  fragen() {
    const ta = h("textarea", { id: "ask-q", rows: "3", placeholder: "Zum Beispiel: Was machen die Top-Manager in der KI-Korrektur?" }), out = h("div", { class: "ans", role: "status", "aria-live": "polite" });
    const btn = h("button", { class: "btn btn-p", type: "button", onclick: () => { const q = ta.value.trim(); if (q) askDesk(q, out, btn); } }, "Frage stellen");
    const presets = ["Was machen die Top-Manager in der KI-Korrektur?", "Wo widersprechen sich Bullen und Bären bei Nvidia, und welche Marken werden genannt?", "Was passiert gerade auf der Welt, und wer ist wie dafür positioniert?", "Wie stehen Fed-Erwartung und Positionierung der Macro-Manager zueinander?", "Welche Aussagen sind für SPX500 und NAS100 diese Woche relevant?"];
    return { title: "Desk fragen", crumb: "Werkzeug", body: [h("div", { class: "grid" }, panel("c12", "Tiefenanalyse", "Fragen an die erfassten Daten", sample ? "Antwort nur aus Aussagen, Positionen, Szenarien und Kursen des Desks." : sampleChecked ? "Läuft nur in der veröffentlichten Ansicht mit freigegebenem Claude-Zugriff." : "Verbindung zu Claude wird aufgebaut.",
      h("div", { class: "chips", style: "margin-bottom:10px" }, presets.map(p => h("button", { class: "chip", type: "button", onclick: () => { ta.value = p; ta.focus(); } }, p))),
      ta, h("div", { style: "margin-top:10px" }, btn), out))] };
  }
};