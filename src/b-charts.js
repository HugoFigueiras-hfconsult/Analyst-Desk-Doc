/* charts */
function ticks(lo, hi, n) {
  const raw = (hi - lo) / n, mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 2.5, 5, 10].map(m => m * mag).find(s => s >= raw) || raw, out = [];
  for (let t = Math.ceil(lo / step) * step; t <= hi + 1e-9; t += step) out.push(+t.toFixed(6));
  return { out, dec: step % 1 === 0 ? 0 : (step * 10) % 1 === 0 ? 1 : 2 };
}
const KC = { kz: "#1c9fc4", sup: "#ab9016", ref: "#7483a0", now: "#ff8a2a" };
function priceChart(sym, o = {}) {
  const s = cser(sym);
  if (!s || s.c.length < 3) return h("p", { class: "empty" }, s ? "Erst " + s.c.length + " Handelstage: noch kein Verlauf." : "Für diesen Wert liegt kein Kursverlauf vor.");
  const box = h("div", { class: "chart" }), H = o.h || 240;
  box._draw = (el, W) => {
    const wide = W > 560, byV = {};
    (wide ? o.levels || [] : []).forEach(l => { const k = l.v; (byV[k] = byV[k] || { v: l.v, k: l.k, ls: [] }).ls.push(l.l); });
    const lv = Object.values(byV);
    const padL = 54, padR = lv.length ? 190 : 14, padT = 10, padB = 22, ys = s.c, xs = s._t, n = ys.length;
    let lo = Math.min(...ys), hi = Math.max(...ys);
    lv.forEach(l => { lo = Math.min(lo, l.v); hi = Math.max(hi, l.v); });
    const pad = (hi - lo) * 0.07 || 1; lo -= pad; hi += pad;
    const X = i => padL + (W - padL - padR) * i / (n - 1), Y = v => padT + (H - padT - padB) * (1 - (v - lo) / (hi - lo));
    const tk = ticks(lo, hi, 4);
    let g = "";
    tk.out.forEach(t => { g += `<line x1="${padL}" x2="${W - padR}" y1="${Y(t).toFixed(1)}" y2="${Y(t).toFixed(1)}" class="g"/><text x="${padL - 8}" y="${(Y(t) + 3.5).toFixed(1)}" class="ax" text-anchor="end">${esc(nf(t, tk.dec))}</text>`; });
    let pm = xs[0].slice(0, 7);
    xs.forEach((d, i) => { const m = d.slice(0, 7); if (m !== pm) { pm = m; if (X(i) < W - padR - 20) g += `<text x="${X(i).toFixed(1)}" y="${H - 5}" class="ax">${MON[+d.slice(5, 7) - 1]}</text>`; } });
    const pts = ys.map((v, i) => X(i).toFixed(1) + "," + Y(v).toFixed(1)), id = "c" + (uid++);
    const mIdx = {}; let mk = "";
    Object.keys(o.marks || {}).forEach(d => { if (d < xs[0]) return; const i = idxOn(xs, d); if (i < n && dayDiff(xs[i], d) <= 4) (mIdx[i] = mIdx[i] || []).push(...o.marks[d]); });
    Object.keys(mIdx).forEach(i => {
      const L = mIdx[i], x = X(+i).toFixed(1), sm = L.find(m => m.k === "s"), c = L.some(m => m.k === "e") ? "#ff8a2a" : sm ? MKC[sm.s.s] : AC[L[0].m.ac].buy ? MKC.bull : MKC.bear;
      mk += `<line x1="${x}" x2="${x}" y1="${Y(ys[i]).toFixed(1)}" y2="${H - padB - 4}" stroke="${c}" stroke-width="1" opacity=".3"/><path d="M${x} ${H - padB - 9} l4.5 4.5 l-4.5 4.5 l-4.5 -4.5 Z" fill="${c}" stroke="#0c111b" stroke-width="1.5"/>`;
    });
    const near = i => { for (const k of [0, -1, 1, -2, 2]) if (mIdx[i + k]) return i + k; return -1; };
    let hit = [];
    let lvs = "";
    if (lv.length) {
      const L = lv.map(l => ({ ...l, y: Y(l.v), ly: Y(l.v) })).sort((a, b) => a.y - b.y);
      for (let i = 1; i < L.length; i++) if (L[i].ly - L[i - 1].ly < 13) L[i].ly = L[i - 1].ly + 13;
      const maxY = H - padB - 2;
      if (L[L.length - 1].ly > maxY) { L[L.length - 1].ly = maxY; for (let i = L.length - 2; i >= 0; i--) if (L[i + 1].ly - L[i].ly < 13) L[i].ly = L[i + 1].ly - 13; }
      L.forEach(l => {
        const c = KC[l.k] || KC.ref, x2 = W - padR, txt = l.ls.join(" · ");
        lvs += `<line x1="${padL}" x2="${x2}" y1="${l.y.toFixed(1)}" y2="${l.y.toFixed(1)}" stroke="${c}" stroke-width="1" stroke-dasharray="${l.k === "now" ? "0" : "3 4"}" opacity=".8"/>` +
          `<path d="M${x2} ${l.y.toFixed(1)} L${x2 + 9} ${l.ly.toFixed(1)}" stroke="${c}" stroke-width="1" fill="none" opacity=".8"/><circle cx="${x2 + 12}" cy="${l.ly.toFixed(1)}" r="2.5" fill="${c}"/>` +
          `<text x="${x2 + 19}" y="${(l.ly + 3.5).toFixed(1)}" class="lbm">${esc(nf(l.v, l.v % 1 ? 2 : 0))}</text><text x="${x2 + 19 + (nf(l.v, l.v % 1 ? 2 : 0).length * 6.8 + 6)}" y="${(l.ly + 3.5).toFixed(1)}" class="lb">${esc(txt.length > 21 ? txt.slice(0, 20) + "…" : txt)}</text>`;
      });
    }
    el.innerHTML = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc("Kursverlauf " + s.n + ", " + fmtD(xs[0]) + " bis " + fmtD(xs[n - 1]))}">` +
      `<defs><linearGradient id="${id}a" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#ff3d8b" stop-opacity=".26"/><stop offset="1" stop-color="#ff3d8b" stop-opacity="0"/></linearGradient>` +
      `<linearGradient id="${id}l" gradientUnits="userSpaceOnUse" x1="${padL}" x2="${W - padR}" y1="0" y2="0"><stop offset="0" stop-color="#ff8a2a"/><stop offset="1" stop-color="#ff3d8b"/></linearGradient></defs>${g}` +
      `<path d="M${pts.join(" L")} L${X(n - 1).toFixed(1)},${H - padB} L${padL},${H - padB} Z" fill="url(#${id}a)"/>${lvs}` +
      `<polyline points="${pts.join(" ")}" fill="none" stroke="url(#${id}l)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>${mk}` +
      `<circle cx="${X(n - 1).toFixed(1)}" cy="${Y(ys[n - 1]).toFixed(1)}" r="4" fill="#ff3d8b" stroke="#0c111b" stroke-width="2"/>` +
      `<line class="cur" y1="${padT}" y2="${H - padB}" stroke="#7483a0" stroke-width="1" visibility="hidden"/><circle class="curd" r="4" fill="#e9eef6" stroke="#0c111b" stroke-width="2" visibility="hidden"/>` +
      `<rect x="${padL}" y="${padT}" width="${W - padL - padR}" height="${H - padT - padB}" fill="transparent"/></svg>`;
    const svg = el.firstChild, cur = $(".cur", svg), cd = $(".curd", svg);
    svg.addEventListener("pointermove", ev => {
      const r = svg.getBoundingClientRect();
      let i = Math.max(0, Math.min(n - 1, Math.round((ev.clientX - r.left - padL) / (W - padL - padR) * (n - 1))));
      const j = near(i); if (j >= 0) i = j; hit = j >= 0 ? mIdx[j] : [];
      svg.style.cursor = hit.some(m => m.k === "s") ? "pointer" : "";
      cur.setAttribute("x1", X(i)); cur.setAttribute("x2", X(i)); cur.setAttribute("visibility", "visible");
      cd.setAttribute("cx", X(i)); cd.setAttribute("cy", Y(ys[i])); cd.setAttribute("visibility", "visible");
      showTip(ev, [h("b", {}, fmtD(xs[i])), h("span", { class: "mono" }, fv(ys[i], s.u) + (i ? "  " + sign(delta(s, ys[i - 1], ys[i]), 1) + dU(s) : "")), hit.slice(0, 4).map(markLine), hit.length > 4 ? h("div", { class: "tip-l" }, "und " + (hit.length - 4) + " weitere") : null]);
    });
    svg.addEventListener("pointerleave", () => { hideTip(); cur.setAttribute("visibility", "hidden"); cd.setAttribute("visibility", "hidden"); });
    svg.addEventListener("click", () => { const m = hit.find(m => m.k === "s"); if (m) go("a", m.s.id); });
  };
  return h("div", {}, box, h("div", { class: "chart-cap" }, s.n + " · " + s.b + " · Schlusskurse " + fmtD(s._t[0]) + " bis " + fmtD(s._t[s._t.length - 1]) + " · " + D.prices.src,
    " · ", h("a", { href: "https://www.tradingview.com/chart/?symbol=" + encodeURIComponent(s.tv), target: "_blank", rel: "noopener noreferrer" }, "TradingView ↗")),
    o.marks && Object.keys(o.marks).length ? h("div", { class: "chart-cap" }, "◆ Tage mit Aussage, Ereignis oder Handel: Farbe nach Haltung, Orange für Ereignisse der Story. Zeiger darüber zeigt den Inhalt, ein Klick öffnet die Aussage.") : null);
}
function spark(sym, w = 110, hh = 30) {
  const s = cser(sym);
  if (!s || s.c.length < 3) return h("span", { class: "srow-f" }, "kein Verlauf");
  const c = s.c.slice(-90), lo = Math.min(...c), hi = Math.max(...c), n = c.length;
  const xy = c.map((v, i) => [(2 + (w - 7) * i / (n - 1)).toFixed(1), (3 + (hh - 6) * (1 - (v - lo) / ((hi - lo) || 1))).toFixed(1)]);
  const e = h("span", { class: "spark", "aria-hidden": "true" });
  e.innerHTML = `<svg width="${w}" height="${hh}"><polyline points="${xy.map(p => p.join(",")).join(" ")}" fill="none" stroke="#a9b4c6" stroke-width="1.25" stroke-linejoin="round"/><circle cx="${xy[n - 1][0]}" cy="${xy[n - 1][1]}" r="2.6" fill="#ff8a2a"/></svg>`;
  return e;
}
function layoutCharts() { document.querySelectorAll(".chart").forEach(el => { if (el._draw && el.clientWidth > 0) el._draw(el, el.clientWidth); }); }