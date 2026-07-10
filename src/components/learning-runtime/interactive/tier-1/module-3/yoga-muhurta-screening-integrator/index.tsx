"use client";

import { useState } from "react";
import { IAST } from "@/components/learning-runtime/chrome/typography";

const GOLD = "#C28220";
const JADE = "#2d7d46";
const VERMILION = "#A23A1E";
const INDIGO = "#4F6FA8";
const AMBER = "#B8860B";

type EventType = "marriage" | "travel" | "business" | "construction" | "medical" | "spiritual";
type LimbKey = "tithi" | "vara" | "nakshatra" | "yoga" | "karana";

interface LimbCheck {
  limb: LimbKey;
  label: string;
  rule: string;
  detail: string;
  required: boolean;
}

const LIMB_META: Record<LimbKey, { icon: string; color: string; label: string; abbr: string }> = {
  tithi: { icon: "☽", color: INDIGO, label: "Tithi", abbr: "Ti" },
  vara: { icon: "☉", color: GOLD, label: "Vāra", abbr: "Vā" },
  nakshatra: { icon: "✦", color: "#8B5FC0", label: "Nakṣatra", abbr: "Nk" },
  yoga: { icon: "◈", color: "#2E8B57", label: "Yoga", abbr: "Yo" },
  karana: { icon: "◆", color: "#B8860B", label: "Karaṇa", abbr: "Kr" },
};

const EVENT_RULES: Record<EventType, { label: string; limbs: LimbCheck[] }> = {
  marriage: {
    label: "Marriage",
    limbs: [
      { limb: "tithi", label: "Tithi", rule: "Avoid Riktā (4th, 9th, 14th). Prefer Nandā or Bhadrā.", detail: "1st, 2nd, 3rd, 5th, 7th, 10th, 11th, 12th tithis are favourable. Amāvāsyā and Caturdaśī are generally avoided.", required: true },
      { limb: "vara", label: "Vāra", rule: "Monday, Wednesday, Thursday, Friday preferred.", detail: "Avoid Tuesday (Mangala) and Saturday (Śanivāra) for marriage. Thursday (Guruvāra) is the most auspicious.", required: true },
      { limb: "nakshatra", label: "Nakṣatra", rule: "Rohiṇī, Mṛgaśīrṣa, Mūla, Maghā, Uttara-Phālgunī.", detail: "Avoid Nakṣatras belonging to oneself, partner, or immediate family. Mūla is considered excellent for fixed undertakings.", required: true },
      { limb: "yoga", label: "Yoga", rule: "Prefer Prīti, Saubhāgya, Vṛddhi, Brahma, Siddhi.", detail: "Avoid all 4 core inauspicious yogas — Vyatīpāta and Vaidhṛti absolutely (Mahādoṣas), plus Parigha (first half) and Vajra.", required: true },
      { limb: "karana", label: "Karaṇa", rule: "Prefer Bava, Bālava, Kaulava, Taitila, Gara, Vṛddhi.", detail: "Avoid Śakuni, Catuṣpada, Nāga karaṇas. Viṣṭi karaṇa is mixed and depends on other factors.", required: false },
    ],
  },
  travel: {
    label: "Travel",
    limbs: [
      { limb: "tithi", label: "Tithi", rule: "1st, 2nd, 3rd, 5th, 7th, 10th, 11th, 13th.", detail: "Avoid 4th, 6th, 8th, 9th, 12th, 14th tithis. Pratipadā of both pakṣas is excellent.", required: true },
      { limb: "vara", label: "Vāra", rule: "Monday, Wednesday, Thursday, Friday.", detail: "Avoid Tuesday for travel (accident-prone). Sunday is neutral. Saturday depends on direction.", required: true },
      { limb: "nakshatra", label: "Nakṣatra", rule: "Aśvinī, Puṣya, Hasta, Mṛgaśīrṣa, Anurādhā.", detail: "Aśvinī is supreme for all journeys. Mūla is excellent for travel to the east. Avoid Jyeṣṭhā.", required: true },
      { limb: "yoga", label: "Yoga", rule: "Cara / movable-type yogas (movement).", detail: "Avoid the 4 core (Vyatīpāta, Vaidhṛti, Parigha, Vajra) and fixed-type yogas. Movement-themed yogas suit a journey.", required: true },
      { limb: "karana", label: "Karaṇa", rule: "Bava, Bālava, Kaulava, Taitila.", detail: "Vṛddhi is excellent. Avoid Śakuni for travel. First half of Bhadra is good.", required: false },
    ],
  },
  business: {
    label: "Business Opening",
    limbs: [
      { limb: "tithi", label: "Tithi", rule: "1st, 2nd, 3rd, 5th, 7th, 10th, 11th.", detail: "Daśamī (10th) is especially good for business. Avoid Amāvāsyā and Caturdaśī.", required: true },
      { limb: "vara", label: "Vāra", rule: "Wednesday (Budha) or Thursday (Guru).", detail: "Mercury rules commerce; Jupiter rules prosperity. Friday (Venus) is good for arts/beauty. Avoid Tuesday.", required: true },
      { limb: "nakshatra", label: "Nakṣatra", rule: "Aśvinī, Puṣya, Hasta, Svātī, Revatī.", detail: "Hasta is excellent for hand-crafts and trade. Revatī is good for accumulating wealth.", required: true },
      { limb: "yoga", label: "Yoga", rule: "Siddhi (success), Vṛddhi (growth), Śubha.", detail: "Avoid the 4 core inauspicious yogas (Vyatīpāta, Vaidhṛti, Parigha, Vajra). Success/growth-themed yogas fit a business launch.", required: true },
      { limb: "karana", label: "Karaṇa", rule: "Bava, Bālava, Kaulava, Vṛddhi.", detail: "Vṛddhi (growth) is the most appropriate for business. Avoid Śakuni and Nāga.", required: false },
    ],
  },
  construction: {
    label: "Construction",
    limbs: [
      { limb: "tithi", label: "Tithi", rule: "2nd, 3rd, 5th, 7th, 10th, 11th, 13th.", detail: "Dvitīyā and Tṛtīyā are excellent. Daśamī is also good. Avoid Caturthī and Amāvāsyā.", required: true },
      { limb: "vara", label: "Vāra", rule: "Monday, Thursday, Friday.", detail: "Monday (Moon) for homes; Thursday (Jupiter) for temples; Friday (Venus) for beauty. Avoid Tuesday and Saturday.", required: true },
      { limb: "nakshatra", label: "Nakṣatra", rule: "Puṣya, Mṛgaśīrṣa, Hasta, Uttarāṣāḍhā.", detail: "Uttarāṣāḍhā is specifically for laying foundations. Puṣya for all fixed structures.", required: true },
      { limb: "yoga", label: "Yoga", rule: "Dhruva (fixed), Śobhana.", detail: "Dhruva (fixed) suits a foundation. Avoid the 4 core (Vyatīpāta, Vaidhṛti, Parigha, Vajra) and movable-type yogas.", required: true },
      { limb: "karana", label: "Karaṇa", rule: "Kaulava, Taitila, Gara, Vṛddhi.", detail: "Gara (digging) is literally named for excavation. Excellent for foundation work.", required: false },
    ],
  },
  medical: {
    label: "Medical Procedures",
    limbs: [
      { limb: "tithi", label: "Tithi", rule: "Prefer Nandā/Bhadrā/Jayā tithis; avoid Riktā (4th, 9th, 14th).", detail: "Avoid Amāvāsyā and Caturdaśī. (Tithi screening is from Chapter 1; this lesson's focus is the yoga screen.)", required: true },
      { limb: "vara", label: "Vāra", rule: "Monday, Wednesday, Friday.", detail: "Mercury rules medicine. Moon rules healing. Jupiter rules recovery. Avoid Saturday (Saturn = delay).", required: true },
      { limb: "nakshatra", label: "Nakṣatra", rule: "Aśvinī (healers), Hasta (hands), Mṛgaśīrṣa.", detail: "Aśvinī is the supreme healing nakṣatra. Hasta is good for hand-surgeries. Avoid Jyeṣṭhā.", required: true },
      { limb: "yoga", label: "Yoga", rule: "Vajra (sharp action) — the right yoga for surgery.", detail: "Surgery is the contextual exception: Vajra's sharp/cutting nature suits it. Still avoid the Mahādoṣas Vyatīpāta and Vaidhṛti, which override even Vajra.", required: true },
      { limb: "karana", label: "Karaṇa", rule: "Bava, Bālava, Kaulava.", detail: "Mobile karaṇas are preferred. Avoid fixed karaṇas for surgery. Śakuni is very bad.", required: false },
    ],
  },
  spiritual: {
    label: "Spiritual Activities",
    limbs: [
      { limb: "tithi", label: "Tithi", rule: "Ekādaśī, Pūrṇimā, Amāvāsyā.", detail: "Ekādaśī is supreme for fasting and worship. Pūrṇimā for illumination. Amāvāsyā for pitṛ-tarpaṇa.", required: true },
      { limb: "vara", label: "Vāra", rule: "Thursday (Guru) and Monday (Śiva).", detail: "Thursday is the day of the guru. Monday is the day of Śiva. Both are excellent for all spiritual activities.", required: true },
      { limb: "nakshatra", label: "Nakṣatra", rule: "Mṛgaśīrṣa, Rohiṇī, Śravaṇa, Dhaniṣṭhā.", detail: "Śravaṇa (hearing) is excellent for mantra. Mṛgaśīrṣa for seeking. Rohiṇī for devotion.", required: true },
      { limb: "yoga", label: "Yoga", rule: "Brahma, Śiva, Siddhi, Śubha.", detail: "Brahma yoga is supreme for sacred study. Śiva yoga for meditation and austerities. Siddhi for tantra.", required: true },
      { limb: "karana", label: "Karaṇa", rule: "Bava, Bālava, Kaulava, Vṛddhi.", detail: "All movable and mixed karaṇas are good. Vṛddhi for growing spiritual merit.", required: false },
    ],
  },
};

/* ─── 5-Limb Mandala SVG ─── */
function LimbMandala({ checks }: { checks: Record<string, boolean> }) {
  const limbs = ["tithi", "vara", "nakshatra", "yoga", "karana"] as LimbKey[];
  const W = 280;
  const H = 280;
  const CX = W / 2;
  const CY = H / 2;
  const R = 100;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxWidth: 220, display: "block", margin: "0 auto" }}>
      <defs>
        <filter id="lmShadow" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy={1} stdDeviation={2} floodColor="#6B4423" floodOpacity="0.1" /></filter>
      </defs>

      {/* Outer circle */}
      <circle cx={CX} cy={CY} r={R + 8} fill="none" stroke="var(--gl-gold-hairline)" strokeWidth={1} opacity={0.4} />

      {/* Limb positions */}
      {limbs.map((limb, i) => {
        const angle = (i * 72 - 90) * Math.PI / 180;
        const x = CX + R * Math.cos(angle);
        const y = CY + R * Math.sin(angle);
        const meta = LIMB_META[limb];
        const isChecked = checks[limb] ?? false;

        return (
          <g key={limb}>
            <line x1={CX} y1={CY} x2={x} y2={y} stroke="var(--gl-gold-hairline)" strokeWidth={1} strokeDasharray={isChecked ? "none" : "3 3"} opacity={isChecked ? 0.6 : 0.3} />
            <circle cx={x} cy={y} r={20} fill={isChecked ? "#E8F5EE" : "var(--gl-card-surface-solid, #FFF9F0)"} stroke={isChecked ? JADE : meta.color} strokeWidth={isChecked ? 2 : 1} filter="url(#lmShadow)" />
            <text x={x} y={y + 4} textAnchor="middle" fill={isChecked ? JADE : meta.color} fontSize={12} fontWeight={700} style={{ pointerEvents: "none", fontFamily: "var(--font-sans), sans-serif" }}>
              {meta.abbr}
            </text>
          </g>
        );
      })}

      {/* Center hub */}
      <circle cx={CX} cy={CY} r={28} fill="var(--gl-card-surface-solid, #FFF9F0)" stroke={GOLD} strokeWidth={1.5} filter="url(#lmShadow)" />
      <text x={CX} y={CY - 2} textAnchor="middle" fill={GOLD} fontSize={9} fontWeight={700}>5-Limb</text>
      <text x={CX} y={CY + 10} textAnchor="middle" fill="var(--gl-ink-muted)" fontSize={8}>Check</text>
    </svg>
  );
}

/* ─── Progress Ring ─── */
function ProgressRing({ progress, total }: { progress: number; total: number }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const stroke = circumference - (progress / total) * circumference;

  return (
    <svg viewBox="0 0 100 100" className="w-full h-auto" style={{ maxWidth: 80, display: "block", margin: "0 auto" }}>
      <circle cx={50} cy={50} r={radius} fill="none" stroke="var(--gl-gold-hairline)" strokeWidth={6} />
      <circle cx={50} cy={50} r={radius} fill="none" stroke={progress === total ? JADE : GOLD} strokeWidth={6} strokeDasharray={circumference} strokeDashoffset={stroke} strokeLinecap="round" transform="rotate(-90 50 50)" style={{ transition: "stroke-dashoffset 0.5s ease" }} />
      <text x={50} y={50} textAnchor="middle" fill={progress === total ? JADE : GOLD} fontSize={18} fontWeight={800} dy={6}>{progress}</text>
      <text x={50} y={64} textAnchor="middle" fill="var(--gl-ink-muted)" fontSize={9}>{total}</text>
    </svg>
  );
}

export function YogaMuhurtaScreeningIntegrator() {
  const [eventType, setEventType] = useState<EventType>("marriage");
  const [checks, setChecks] = useState<Record<string, boolean>>({});

  const event = EVENT_RULES[eventType];
  const completed = event.limbs.filter((l) => checks[l.limb]).length;
  const total = event.limbs.length;

  function toggle(limb: LimbKey) {
    setChecks((prev) => ({ ...prev, [limb]: !prev[limb] }));
  }

  function resetAll() {
    setChecks({});
  }

  function checkAll() {
    const all: Record<string, boolean> = {};
    for (const l of event.limbs) all[l.limb] = true;
    setChecks(all);
  }

  return (
    <div
      className="w-full"
      style={{ background: "var(--gl-surface-card, var(--gl-card-surface, #FFF9F0))", border: "1px solid var(--gl-border-subtle, var(--gl-gold-hairline))", borderRadius: "16px", padding: "20px" }}
      data-interactive="yoga-muhurta-screening-integrator"
    >
      <div className="mb-4">
        <h2 className="text-lg font-semibold" style={{ color: "var(--gl-ink-primary)" }}><IAST>Muhūrta Screening — 5-Limb Check</IAST></h2>
        <p className="text-sm mt-1" style={{ color: "var(--gl-ink-muted)" }}>Select an event type and check each pañcāṅga limb against classical rules.</p>
      </div>

      {/* Event selector */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(Object.entries(EVENT_RULES) as [EventType, typeof EVENT_RULES["marriage"]][]).map(([key, data]) => (
          <button key={key} onClick={() => { setEventType(key); setChecks({}); }} className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all" style={{ background: eventType === key ? GOLD : "var(--gl-card-surface-solid)", color: eventType === key ? "#fff" : GOLD, border: `1.5px solid ${eventType === key ? GOLD : "var(--gl-gold-hairline)"}`, cursor: "pointer" }}>
            {data.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Checklist + mandala */}
        <div className="space-y-3">
          {/* 5-Limb Mandala */}
          <div className="rounded-xl p-4" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)" }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-2 text-center" style={{ color: GOLD }}>5-Limb Mandala</p>
            <LimbMandala checks={checks} />
          </div>

          {/* Checklist */}
          <div className="rounded-xl p-4" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)" }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: GOLD }}>{event.label} Checklist</p>
              <div className="flex gap-2">
                <button onClick={checkAll} className="text-xs" style={{ color: GOLD, textDecoration: "underline", cursor: "pointer", background: "none", border: "none" }}>Check all</button>
                <button onClick={resetAll} className="text-xs" style={{ color: "var(--gl-ink-muted)", textDecoration: "underline", cursor: "pointer", background: "none", border: "none" }}>Reset</button>
              </div>
            </div>

            <div className="space-y-2">
              {event.limbs.map((limb) => {
                const isChecked = checks[limb.limb] ?? false;
                const meta = LIMB_META[limb.limb];
                const reqText = limb.required ? "Required" : "Recommended";

                return (
                  <div key={limb.limb} onClick={() => toggle(limb.limb)} className="p-3 rounded-lg cursor-pointer transition-all" style={{ background: isChecked ? "#E8F5EE" : "transparent", border: `1.5px solid ${isChecked ? "#A8D4B8" : "var(--gl-gold-hairline)"}` }}>
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-all" style={{ background: isChecked ? JADE : "var(--gl-card-surface-solid)", border: `2px solid ${isChecked ? JADE : "var(--gl-gold-hairline)"}` }}>
                        {isChecked && <span style={{ color: "#fff", fontSize: 10, fontWeight: 800 }}>OK</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-base" style={{ color: meta.color }}>{meta.icon}</span>
                          <span className="text-sm font-semibold" style={{ color: "var(--gl-ink-primary)" }}><IAST>{limb.label}</IAST></span>
                          <span className="text-[10px] uppercase font-bold" style={{ color: limb.required ? VERMILION : "var(--gl-ink-muted)" }}>{reqText}</span>
                        </div>
                        <p className="text-sm mb-1" style={{ color: "var(--gl-ink-secondary)", lineHeight: 1.5 }}>{limb.rule}</p>
                        {isChecked && <p className="text-xs italic" style={{ color: "var(--gl-ink-muted)", lineHeight: 1.5 }}>{limb.detail}</p>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Progress + Result */}
        <div className="space-y-3">
          {/* Progress ring */}
          <div className="rounded-xl p-4 text-center" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)" }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: GOLD }}>Completion</p>
            <ProgressRing progress={completed} total={total} />
            <p className="text-sm mt-2" style={{ color: "var(--gl-ink-secondary)" }}>{completed} of {total} limbs checked</p>
            {completed === total && (
              <div className="mt-3 p-3 rounded-lg" style={{ background: "#E8F5EE", border: "1.5px solid #A8D4B8" }}>
                <p className="text-sm font-semibold" style={{ color: JADE }}>All pañcāṅga limbs pass the screen for {event.label}.</p>
                <p className="text-xs" style={{ color: JADE, marginTop: 4 }}>This is recognition-layer screening, not a finished election. A full client-facing election needs Module 23&apos;s complete workflow (10 screens + the 21 Mahādoṣas + lagna, planetary strength, and chart compatibility). Defer high-stakes delivery to a qualified jyotiṣī.</p>
              </div>
            )}
            {completed < total && completed > 0 && (
              <div className="mt-3 p-3 rounded-lg" style={{ background: "#FDF6E3", border: "1.5px solid #E8D5A3" }}>
                <p className="text-sm" style={{ color: AMBER }}>{total - completed} limb{total - completed > 1 ? "s" : ""} remaining. Review unchecked items.</p>
              </div>
            )}
          </div>

          {/* Consolidated advice */}
          <div className="rounded-xl p-4" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)" }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: GOLD }}>Consolidated Rules</p>
            <div className="space-y-2">
              <div className="p-2.5 rounded-lg" style={{ background: "#FDE8E5", border: "1px solid #E8AFA8" }}>
                <p className="text-xs font-bold uppercase mb-1" style={{ color: VERMILION }}>Always Avoid</p>
                <p className="text-sm" style={{ color: "var(--gl-ink-primary)", lineHeight: 1.5 }}>Vyatīpāta and Vaidhṛti yogas are universally dangerous. Override all other auspicious conditions. Avoid these yogas for every event type.</p>
              </div>
              <div className="p-2.5 rounded-lg" style={{ background: "#E8F5EE", border: "1px solid #A8D4B8" }}>
                <p className="text-xs font-bold uppercase mb-1" style={{ color: JADE }}>Generally Favourable</p>
                <p className="text-sm" style={{ color: "var(--gl-ink-primary)", lineHeight: 1.5 }}>Śubha, Siddhi, Śiva, Sādhya, Dhruva, Sukarman, and Saubhāgya are excellent for almost all undertakings.</p>
              </div>
              <div className="p-2.5 rounded-lg" style={{ background: "#EBF0FA", border: "1px solid #B0C4DE" }}>
                <p className="text-xs font-bold uppercase mb-1" style={{ color: INDIGO }}>Situational</p>
                <p className="text-sm" style={{ color: "var(--gl-ink-primary)", lineHeight: 1.5 }}>Viṣkambha, Vajra, and Śukla are mixed — their effect depends on the specific event and other pañcāṅga elements.</p>
              </div>
            </div>
          </div>

          {/* Classical reference */}
          <div className="rounded-xl p-4" style={{ background: "#FDF6E3", border: "1px dashed var(--gl-gold-hairline)" }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: GOLD }}>Classical Authority</p>
            <p className="text-sm italic" style={{ color: "var(--gl-ink-secondary)", lineHeight: 1.6 }}>The muhūrta is read across all the pañcāṅga limbs — each examined individually and in combination. No single limb is sufficient on its own; the yoga is one screen among several.</p>
            <p className="text-xs mt-1" style={{ color: "var(--gl-ink-muted)" }}>— after Muhūrta Cintāmaṇi (Rāma Daivajña), the lesson's classical anchor</p>
          </div>
        </div>
      </div>
    </div>
  );
}
