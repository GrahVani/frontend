"use client";

import { useState } from "react";
import { IAST } from "../../chrome/typography";

const GOLD = "#C28220";
const JADE = "#2d7d46";
const VERMILION = "#A23A1E";
const AMBER = "#B8860B";
const INDIGO = "#4F6FA8";

type Status = "barred" | "caution" | "usable" | "fitting";

const STATUS_META: Record<Status, { color: string; bg: string; border: string; label: string }> = {
  barred:  { color: VERMILION, bg: "#FDE8E5", border: "#E8AFA8", label: "Barred" },
  caution: { color: AMBER,     bg: "#FDF6E3", border: "#E8D5A3", label: "With compensation" },
  usable:  { color: JADE,      bg: "#E8F5EE", border: "#A8D4B8", label: "Usable" },
  fitting: { color: JADE,      bg: "#E8F5EE", border: "#A8D4B8", label: "Fitting" },
};

const EVENTS = [
  { id: "marriage", label: "Marriage / Saṁskāra",    dev: "विवाह",        desc: "Marriage and major saṁskāras — the strictest case (§4.4)." },
  { id: "onset",    label: "Auspicious onset",        dev: "आरम्भ",        desc: "Business opening, journey, foundation-laying, signing — gentle beginnings (§4.1)." },
  { id: "surgery",  label: "Sharp / cutting action",  dev: "तीक्ष्ण-कर्म", desc: "Surgery, obstacle-removal, dispelling-malefic rites, (some) litigation (§4.1)." },
] as const;

const VASAS = [
  { id: "patala", label: "Pātāla",     dev: "पाताल",     realm: "underworld", note: "lightest — some traditions treat as nearly negligible" },
  { id: "mrtyu",  label: "Mṛtyu-loka", dev: "मृत्युलोक", realm: "earth",      note: "strictest — the earth-dwelling Bhadrā reaches mortal affairs; full avoidance" },
  { id: "svarga", label: "Svarga",     dev: "स्वर्ग",     realm: "heaven",     note: "moderate" },
] as const;

type EventId = typeof EVENTS[number]["id"];
type VasaId = typeof VASAS[number]["id"];

// The three portions of a Bhadrā window. minutes = relative duration (window ≈ 24 h here).
// One ghaṭī = 24 min → mukha = 5 × 24 = 120 min, puccha = 3 × 24 = 72 min (§4.2).
const PORTIONS = [
  { id: "mukha",  label: "Mukha",  dev: "मुख",  sub: "face · first ~5 ghaṭīs (≈ 2 hrs) · “poison-like”", minutes: 120 },
  { id: "madhya", label: "Madhya", dev: "मध्य", sub: "middle · the long centre",                          minutes: 1248 },
  { id: "puccha", label: "Puccha", dev: "पुच्छ", sub: "tail · last ~3 ghaṭīs (≈ 1.2 hrs) · “fearsome”",    minutes: 72 },
] as const;

type PortionId = typeof PORTIONS[number]["id"];

const WINDOW_START = 360; // 06:00 — an illustrative onset; the real one comes from the pañcāṅga.

function portionStatus(event: EventId, vasa: VasaId, portion: PortionId): Status {
  if (event === "surgery") return "fitting";   // §4.1 sharp-action exception — fierce energy suits it
  if (event === "marriage") return "barred";   // §4.4 entire window barred regardless of vāsa-sthāna
  // onset: mukha & puccha always barred; the long middle is graded by vāsa-sthāna (§4.2 + §4.3)
  if (portion === "mukha" || portion === "puccha") return "barred";
  if (vasa === "patala") return "usable";
  if (vasa === "svarga") return "caution";
  return "barred"; // mṛtyu-loka — strictest
}

function verdict(event: EventId, vasa: VasaId): { status: Status; headline: string; detail: string } {
  if (event === "surgery") return {
    status: "fitting",
    headline: "Bhadrā suits sharp action",
    detail: "Bhadrā's fierce energy fits cutting / transformative work — surgery, obstacle-removal, dispelling-malefic rites, and (some traditions) litigation. The bar on gentle onsets does not apply here.",
  };
  if (event === "marriage") return {
    status: "barred",
    headline: "Entire window barred — absolute",
    detail: "For marriage and major saṁskāras the whole Bhadrā window is barred — mukha, madhya and puccha alike — regardless of vāsa-sthāna (even Pātāla), and no auspicious factor compensates.",
  };
  const madhya = portionStatus("onset", vasa, "madhya");
  if (madhya === "usable") return {
    status: "usable",
    headline: "Mukha & puccha barred · long middle usable",
    detail: "Avoid the ~2-hour mukha and the ~1.2-hour puccha. With Bhadrā in Pātāla the long middle is the lightest case — usable for non-marriage onsets with supporting strength.",
  };
  if (madhya === "caution") return {
    status: "caution",
    headline: "Mukha & puccha barred · middle only with compensation",
    detail: "Avoid mukha and puccha. With Bhadrā in Svarga (moderate) the long middle is permissible for non-marriage onsets only with compensating strength.",
  };
  return {
    status: "barred",
    headline: "Full avoidance",
    detail: "With Bhadrā in Mṛtyu-loka (earth) — the strictest residence — the whole window is avoided for onsets; the earth-dwelling Bhadrā is the one that reaches mortal affairs.",
  };
}

const SCREENS = [
  { n: 1, layer: "Tithi-quality",            ch: 1 },
  { n: 2, layer: "Vāra-event-pairing",        ch: 2 },
  { n: 3, layer: "Choghaḍiyā",                ch: 2 },
  { n: 4, layer: "Rāhu-Kālam",                ch: 2 },
  { n: 5, layer: "Nakṣatra-quality",          ch: 3 },
  { n: 6, layer: "Yoga-screening",            ch: 4 },
  { n: 7, layer: "Karaṇa-screening (Bhadrā)", ch: 5 },
];

function clock(min: number) {
  const m = ((min % 1440) + 1440) % 1440;
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

/* ─── 5-Limb Mandala SVG ─── */
function LimbMandala() {
  const limbs = [
    { abbr: "Ti", label: "Tithi", color: INDIGO },
    { abbr: "Vā", label: "Vāra", color: GOLD },
    { abbr: "Nk", label: "Nakṣatra", color: "#8B5FC0" },
    { abbr: "Yo", label: "Yoga", color: "#2E8B57" },
    { abbr: "Kr", label: "Karaṇa", color: AMBER },
  ];
  const W = 240;
  const H = 240;
  const CX = W / 2;
  const CY = H / 2;
  const R = 76;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: "200px", display: "block", margin: "0 auto" }}>
      <circle cx={CX} cy={CY} r={R + 10} fill="none" stroke="var(--gl-gold-hairline)" strokeWidth={1} opacity={0.3} />
      {limbs.map((limb, i) => {
        const angle = (i * 72 - 90) * Math.PI / 180;
        const x = CX + R * Math.cos(angle);
        const y = CY + R * Math.sin(angle);
        return (
          <g key={limb.abbr}>
            <line x1={CX} y1={CY} x2={x} y2={y} stroke="var(--gl-gold-hairline)" strokeWidth={1} opacity={0.35} />
            <circle cx={x} cy={y} r={18} fill="#FFF9F0" stroke={limb.color} strokeWidth={1.5} />
            <text x={x} y={y + 4} textAnchor="middle" fill={limb.color} fontSize={10} fontWeight={800}>{limb.abbr}</text>
          </g>
        );
      })}
      <circle cx={CX} cy={CY} r={26} fill="#FFF9F0" stroke={GOLD} strokeWidth={2} />
      <text x={CX} y={CY + 4} textAnchor="middle" fill={GOLD} fontSize={10} fontWeight={800}>Pañcāṅga</text>
    </svg>
  );
}

export function BhadraAvoidanceIntegrator() {
  const [event, setEvent] = useState<EventId>("onset");
  const [vasa, setVasa] = useState<VasaId>("mrtyu");
  const [showWorkflow, setShowWorkflow] = useState(false);

  const ev = EVENTS.find((e) => e.id === event)!;
  const vs = VASAS.find((v) => v.id === vasa)!;
  const v = verdict(event, vasa);
  const vm = STATUS_META[v.status];

  // Running clock offsets across the three portions.
  let cursor = WINDOW_START;
  const portionRows = PORTIONS.map((p) => {
    const start = cursor;
    cursor += p.minutes;
    const end = cursor;
    return { ...p, start, end, status: portionStatus(event, vasa, p.id) };
  });

  const vasaMuted = event === "marriage" || event === "surgery";

  return (
    <div className="w-full" style={{ background: "var(--gl-surface-card, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)", borderRadius: "16px", padding: "20px" }} data-interactive="bhadra-avoidance-integrator">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold" style={{ color: "var(--gl-ink-primary)" }}><IAST>Bhadrā (Viṣṭi) Avoidance</IAST></h2>
        <p className="text-sm mt-1" style={{ color: "var(--gl-ink-muted)" }}>Pick an event and a vāsa-sthāna to see how the Bhadrā window applies — the day-level residence and the hour-level mukha/puccha split together. Module 03 capstone, Screen 7.</p>
      </div>

      {/* Event selector */}
      <div className="mb-3">
        <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: GOLD }}>Event</p>
        <div className="flex flex-wrap gap-2">
          {EVENTS.map((e) => {
            const active = e.id === event;
            return (
              <button key={e.id} onClick={() => setEvent(e.id)} className="px-3 py-1.5 rounded-full text-xs font-bold transition-all" style={{ background: active ? GOLD : "var(--gl-card-surface-solid)", color: active ? "#fff" : "var(--gl-ink-primary)", border: `1.5px solid ${active ? GOLD : "var(--gl-gold-hairline)"}`, cursor: "pointer" }}>
                <IAST>{e.label}</IAST>
              </button>
            );
          })}
        </div>
        <p className="text-xs mt-1.5 italic" style={{ color: "var(--gl-ink-muted)" }}>{ev.desc}</p>
      </div>

      {/* Vāsa-sthāna selector */}
      <div className="mb-4">
        <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: GOLD }}>Vāsa-sthāna <span style={{ fontWeight: 500, textTransform: "none" }}>(day-level — which “world” Bhadrā occupies)</span></p>
        <div className="flex flex-wrap gap-2" style={{ opacity: vasaMuted ? 0.45 : 1 }}>
          {VASAS.map((vItem) => {
            const active = vItem.id === vasa;
            return (
              <button key={vItem.id} onClick={() => setVasa(vItem.id)} className="px-3 py-1.5 rounded-full text-xs font-bold transition-all" style={{ background: active ? INDIGO : "var(--gl-card-surface-solid)", color: active ? "#fff" : "var(--gl-ink-primary)", border: `1.5px solid ${active ? INDIGO : "var(--gl-gold-hairline)"}`, cursor: "pointer" }}>
                <IAST>{vItem.label}</IAST> · {vItem.dev}
              </button>
            );
          })}
        </div>
        <p className="text-xs mt-1.5 italic" style={{ color: "var(--gl-ink-muted)" }}>
          {vasaMuted
            ? (event === "marriage"
                ? "For marriage the vāsa-sthāna is irrelevant — Bhadrā is barred even in Pātāla."
                : "For sharp action the bar does not apply, so the residence does not change the verdict.")
            : `${vs.label} (${vs.realm}) — ${vs.note}.`}
        </p>
      </div>

      {/* Verdict banner */}
      <div className="rounded-xl p-4 mb-4" style={{ background: vm.bg, border: `2px solid ${vm.border}` }}>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase" style={{ background: vm.color, color: "#fff" }}>{vm.label}</span>
          <h3 className="text-sm font-bold" style={{ color: vm.color }}>{v.headline}</h3>
        </div>
        <p className="text-xs" style={{ color: "var(--gl-ink-secondary)", lineHeight: 1.5 }}>{v.detail}</p>
      </div>

      {/* Proportional window bar */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: GOLD }}>The Bhadrā window (≈ 22–25 hrs)</p>
          <span className="text-[10px]" style={{ color: "var(--gl-ink-muted)" }}>illustrative onset {clock(WINDOW_START)}</span>
        </div>
        <div className="flex w-full rounded-lg overflow-hidden" style={{ border: "1px solid var(--gl-gold-hairline)", height: "28px" }}>
          {portionRows.map((p) => {
            const sm = STATUS_META[p.status];
            return (
              <div key={p.id} title={`${p.label} — ${sm.label}`} style={{ flexGrow: p.minutes, background: sm.bg, borderRight: p.id !== "puccha" ? `1px solid ${sm.border}` : undefined, display: "flex", alignItems: "center", justifyContent: "center", minWidth: 0 }}>
                <span className="text-[9px] font-bold truncate px-1" style={{ color: sm.color }}>{p.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Portion cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
        {portionRows.map((p) => {
          const sm = STATUS_META[p.status];
          const rolled = p.end >= 1440;
          return (
            <div key={p.id} className="rounded-lg p-3" style={{ background: sm.bg, border: `1.5px solid ${sm.border}` }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold" style={{ color: sm.color }}><IAST>{p.label}</IAST> · {p.dev}</span>
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase" style={{ background: sm.color, color: "#fff" }}>{sm.label}</span>
              </div>
              <p className="text-[11px] mb-1" style={{ color: "var(--gl-ink-secondary)" }}>{p.sub}</p>
              <p className="text-[10px]" style={{ color: "var(--gl-ink-muted)" }}>{clock(p.start)} – {clock(p.end)}{rolled ? " (+1d)" : ""}</p>
            </div>
          );
        })}
      </div>

      {/* Workflow toggle */}
      <div className="flex mb-4">
        <button onClick={() => setShowWorkflow((s) => !s)} className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all" style={{ background: showWorkflow ? "#E8F5EE" : "var(--gl-card-surface-solid)", color: showWorkflow ? JADE : "var(--gl-ink-primary)", border: `1.5px solid ${showWorkflow ? JADE : "var(--gl-gold-hairline)"}`, cursor: "pointer" }}>
          {showWorkflow ? "Hide" : "Show"} Module 03 Screening Workflow
        </button>
      </div>

      {/* Integration workflow — the seven screens */}
      {showWorkflow && (
        <div className="rounded-xl p-4" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)" }}>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="xl:col-span-2">
              <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: GOLD }}>The Seven Screens — five pañcāṅga limbs installed (§4.5)</p>
              <div className="space-y-1.5">
                {SCREENS.map((s) => (
                  <div key={s.n} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: s.n === 7 ? "#FDF6E3" : "var(--gl-card-surface-solid)", border: `1.5px solid ${s.n === 7 ? AMBER : "var(--gl-gold-hairline)"}` }}>
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: s.n === 7 ? AMBER : "var(--gl-gold-hairline)", color: s.n === 7 ? "#fff" : "var(--gl-ink-secondary)" }}>{s.n}</span>
                    <span className="text-xs font-medium flex-grow" style={{ color: s.n === 7 ? AMBER : "var(--gl-ink-primary)" }}><IAST>{s.layer}</IAST></span>
                    <span className="text-[10px]" style={{ color: "var(--gl-ink-muted)" }}>Ch {s.ch}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-3" style={{ color: "var(--gl-ink-muted)" }}>Seven screens is a genuine, usable filter at <em>reference depth</em>. A full client-facing election still adds Module 23's Screens 8–10 — the 21 Mahādoṣas, planetary strength, and tradition method (ten in all).</p>
            </div>
            <div className="flex items-center justify-center"><LimbMandala /></div>
          </div>
        </div>
      )}
    </div>
  );
}
