const DETAIL = {
  p(key) {
    const p = P[key]; if (!p) return null;
    const kb = KB[key] || {}, st = D.statements.filter(s => s.p === key).sort(byDate), mv = D.moves.filter(m => m.p === key);
    const calls = D.calls.filter(c => c.p === key), sat = sagenTun(key), th = kb.th || st.slice(0, 3).map(s => ({ d: s.d, t: s.t }));
    return { title: p.n, crumb: "Wissensbank · " + D.desk.groups[p.g], body: [
      h("div", { class: "phead" }, avatar(p, true), h("div", {}, h("h2", {}, p.n), h("div", { class: "note", style: "margin:4px 0 0" }, p.f + " · " + p.r + (p.star ? " · Leitfigur" : ""))),
        h("div", { class: "row", style: "margin-left:auto" }, h("a", { class: "btn btn-s", href: "#wissen" }, "Zur Wissensbank"))),
      h("div", { class: "grid" },
        panel("c5", "Profil", "Wer das ist und wo er spricht", p.v ? "Rolle in den Quellen bestätigt." : "Rolle nach Wissensstand Mitte 2026; der nächste Sweep bestätigt sie.",
          kb.sum ? h("p", { class: "lead" }, kb.sum) : h("p", { class: "empty" }, "Noch kein Kurzprofil hinterlegt."),
          kb.fokus ? [h("div", { class: "sub-h" }, "Blickrichtung"), h("p", { class: "note", style: "color:var(--ink-2)" }, kb.fokus)] : null,
          h("div", { class: "sub-h" }, "Kanäle für den Sweep"), kb.kan ? h("ul", { class: "ul" }, kb.kan.map(k => h("li", {}, k))) : h("p", { class: "empty" }, "Noch keine Kanäle hinterlegt."),
          kb.note ? h("p", { class: "note" }, kb.note) : null,
          kb.open ? [h("div", { class: "sub-h" }, "Offen für den nächsten Sweep"), h("p", { class: "note", style: "color:var(--ink-2)" }, kb.open)] : null),
        panel("c7", "Gedächtnis", "Stehende Thesen", st.length + " Aussagen · " + mv.length + " Positionen · " + calls.length + " Calls",
          th.length ? h("ul", { class: "list" }, th.map(t => h("li", {}, h("time", { datetime: t.d }, fmtS(t.d)), h("span", {}, t.t)))) : h("p", { class: "empty" }, "Noch keine These erfasst."),
          st.length ? [h("div", { class: "sub-h" }, "Haltung über alle Aussagen"), stanceBar(st, false, true)] : null,
          calls.length ? [h("div", { class: "sub-h" }, "Calls im Zwischenstand"), calls.map(c => { const e = callEval(c); return h("div", { class: "lrow" }, h("time", { datetime: c.d }, fmtS(c.d)), h("span", {}, tkChip(c.a), " " + c.t + " ", tag(e.st, VC[e.cls]), e.mv != null ? h("span", { class: "mono" }, " " + sign(e.mv, 1) + " %") : null)); })] : null,
          sat.length ? [h("div", { class: "sub-h" }, "Sagen und Tun"), sat.map(r => h("div", { class: "lrow" }, h("span", {}, tkChip(r.tk)), h("span", {}, pill(r.s.s), " " + r.m.map(m => AC[m.ac].l).join(", ") + " ", tag(r.v[0], VC[r.v[1]]))))] : null),
        panel("c7", "Aussagen", "Alles, was gesammelt wurde", null, stmList(st)),
        panel("c5", "Positionen", "Käufe, Verkäufe, Shorts", null, mvBlock(mv, false)))] };
  },
  th(key) {
    const th = slugMap.th[key]; if (!th) return null;
    const list = D.statements.filter(s => (s.th || []).includes(th));
    return { title: th, crumb: "Aussagen · Thema", body: [h("div", { class: "grid" }, panel("c12", "Thema", "Alle Aussagen mit Datum", list.length + " Aussagen", stanceBar(list), stmList(list)))] };
  }
};
function matchQ(s) {
  if (!state.q) return true;
  const hay = [s.t, whoName(s), whoFirm(s), s.org || "", (s.a || []).join(" "), (s.a || []).map(a => D.desk.assets[a] || "").join(" "), (s.th || []).join(" "), s.lv || ""].join(" ").toLowerCase();
  return state.q.split(/\s+/).every(w => hay.includes(w));
}

/* ask the desk */
function deskContext() {
  const L = ["STAND: " + fmtD(D.desk.asOf), "KURSE (Schluss " + fmtD(D.desk.pxAsOf) + "): " + D.desk.rail.map(k => { const l = last(k); return l ? l.s.n + " " + fv(l.v, l.s.u) + (l.p ? " (" + sign((l.v / l.p - 1) * 100) + " %)" : "") + " [" + l.s.b + "]" : ""; }).join("; "),
    "AUSSAGEN (Datum | Person, Haus | Einordnung | Inhalt):"];
  D.statements.slice().sort(byDate).forEach(s => L.push(s.d + (s.da ? " (ca.)" : "") + " | " + whoName(s) + (whoFirm(s) ? ", " + whoFirm(s) : "") + " | " + ST[s.s].l + " | " + s.t + (s.lv ? " | Marke: " + s.lv : "") + ((s.a || []).length ? " | " + s.a.join(",") : "")));
  L.push("POSITIONSAENDERUNGEN (13F Q3 2026, Stand 30.09.2026, sofern nicht anders vermerkt):");
  D.moves.forEach(m => L.push(P[m.p].n + " (" + P[m.p].f + ") | " + AC[m.ac].l + " | " + m.nm + " " + m.tk + " | " + m.det + (m.per ? " | " + m.per : "")));
  L.push("RELATIVE STAERKE GEGEN S&P 500 (Kurs, 1 Monat / 3 Monate in Prozentpunkten, Stand " + D.desk.pxAsOf + "): " + rotStats().map(r => r.l + " " + sign(r.r1, 1) + "/" + sign(r.r3, 1)).join("; "));
  L.push("ROTATIONS-PAARE (Veraenderung des Verhaeltnisses in 1 Monat): " + pairStats().map(p => p.l + " " + sign(p.m1, 1) + " %").join("; "));
  L.push("SZENARIEN:");
  D.scenarios.forEach(sc => L.push(sc.t + " [" + sc.type + ", " + sc.basis + ", Stand " + sc.asOf + "]: " + sc.items.map(i => i.l + (i.p != null ? " " + i.p + " %" : "")).join("; ")));
  L.push("TERMINE: " + D.calendar.filter(e => e.d >= D.desk.asOf).slice(0, 8).map(e => e.d + " " + e.t).join("; "));
  return L.join("\n");
}
async function askDesk(q, out, btn) {
  if (!sample) { out.textContent = "Claude ist in dieser Ansicht nicht verfügbar. Die Funktion läuft in der veröffentlichten Ansicht des Artefakts."; return; }
  if (btn.disabled) return;
  btn.disabled = true; out.textContent = "Der Desk liest die Daten.";
  const prompt = "Du bist der Analyst Desk eines Finanzberaters und Traders. Beantworte die FRAGE ausschließlich aus den DATEN. Nenne zu jeder Aussage Person und Datum (TT.MM.). Trenne Positionsdaten von Meinungen und weise darauf hin, dass 13F-Daten den Stand 30.09. zeigen. Kursbewegungen nach einer Aussage sind ein zeitlicher Zusammenhang, keine belegte Ursache. Benenne Widersprüche zwischen den Stimmen. Wenn die Daten etwas nicht hergeben, sag das klar. Keine Anlageempfehlung. Antworte auf Deutsch in knappen Absätzen, ohne Markdown-Zeichen.\n\nFRAGE: " + q + "\n\nDATEN:\n" + deskContext();
  try {
    const r = await sample(prompt, { onText: ({ text }) => { if (text) out.textContent = text; } });
    out.textContent = r.text + (r.truncated ? "\n\nDie Antwort wurde gekürzt." : "");
  } catch (e) {
    out.textContent = e && e.code === "not_granted" ? "Ohne Zustimmung kann der Desk keine Antwort erzeugen."
      : e && e.code === "rate_limited" ? "Gerade zu viele Anfragen. In einer Minute noch einmal versuchen." : "Die Anfrage ist fehlgeschlagen. Bitte erneut versuchen.";
  }
  btn.disabled = false;
}