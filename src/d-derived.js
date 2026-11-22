/* derived */
function coverage() { const set = new Set(); D.statements.forEach(s => { if (s.p) set.add(s.p); }); D.moves.forEach(m => set.add(m.p)); return set; }
function recent(days) { const t = new Date(D.desk.asOf + "T00:00:00Z").getTime() - days * 864e5, iso = new Date(t).toISOString().slice(0, 10); return { iso, list: D.statements.filter(s => s.d >= iso) }; }
function verdict(t, m) {
  if (m == null) return t > 0 ? ["Zustimmung", "buy"] : t < 0 ? ["Warnungen", "sell"] : ["Uneinheitlich", "neut"];
  if (t > 0 && m > 0) return ["Rückenwind", "buy"];
  if (t < 0 && m < 0) return ["Abbau und Warnungen", "sell"];
  if (t > 0 && m < 0) return ["Gelobt, aber verkauft", "warn"];
  if (t < 0 && m > 0) return ["Gewarnt, aber gekauft", "warn"];
  return ["Uneinheitlich", "neut"];
}
function areaStats() {
  return Object.keys(D.desk.areas).map(k => {
    const st = D.statements.filter(s => (s.ar || []).includes(k)), c = stanceCounts(heads(st));
    const mv = D.moves.filter(m => m.sec === k && !m.per), buy = mv.filter(m => AC[m.ac].buy), sell = mv.filter(m => !AC[m.ac].buy);
    const talk = c.bull - c.warn - c.bear, money = mv.length ? buy.length - sell.length : null;
    return { k, l: D.desk.areas[k], st, c, talk, money, buy, sell, v: verdict(talk, money) };
  }).filter(a => a.st.length || a.money != null);
}
function callEval(c) {
  const ref = c.ref != null ? c.ref : pxAt(c.a, c.d), l = last(c.a);
  if (ref == null || !l) return { st: "keine Kursdaten", cls: "neut" };
  const mv = (l.v / ref - 1) * 100, base = { ref, now: l.v, mv, u: l.s.u };
  if (c.res) return { ...base, st: c.res + (c.resD ? " am " + fmtS(c.resD) : ""), cls: "sell", ok: false };
  if (c.dir === "long") return { ...base, st: mv >= 0 ? "im Plan" : "gegenläufig", cls: mv >= 0 ? "buy" : "sell", ok: mv >= 0 };
  if (c.dir === "short") return { ...base, st: mv <= 0 ? "im Plan" : "gegenläufig", cls: mv <= 0 ? "buy" : "sell", ok: mv <= 0 };
  return { ...base, st: "offen", cls: "neut", need: (c.tgt / l.v - 1) * 100 };
}
function sagenTun(pid) {
  const out = [];
  D.people.forEach(p => {
    if (pid && p.id !== pid) return;
    const mv = D.moves.filter(m => m.p === p.id), st = D.statements.filter(s => s.p === p.id && s.k !== "Handel" && s.k !== "13F");
    if (!mv.length || !st.length) return;
    const tks = new Set(); mv.forEach(m => m.tk.split("·").forEach(t => tks.add(t)));
    tks.forEach(tk => {
      const s = st.filter(x => (x.a || []).includes(tk)).sort(byDate), m = mv.filter(x => x.tk.split("·").includes(tk));
      if (!s.length) return;
      const want = s[0].s === "bull" ? 1 : s[0].s === "neut" ? null : 0;
      const hit = m.filter(x => AC[x.ac].buy === want).length;
      out.push({ p, tk, s: s[0], m, v: want == null ? ["ohne klare Richtung", "neut"] : hit === m.length ? ["deckungsgleich", "buy"] : hit === 0 ? ["abweichend", "sell"] : ["gedreht", "warn"] });
    });
  });
  return out;
}
const VC = { buy: "var(--buy)", sell: "var(--sell)", warn: "var(--warn)", neut: "var(--neut)" };