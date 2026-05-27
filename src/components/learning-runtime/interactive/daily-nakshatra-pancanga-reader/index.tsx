"use client";

import { useState, useMemo } from "react";
import { IAST, Devanagari } from "../../chrome/typography";
import { NAKSHATRAS, RULER_COLORS, GANA_STYLE } from "../nakshatra-data";

/* ─── Simulated daily transitions ─── */
interface Transition {
  time: number; // minutes from 00:00
  type: "nakshatra" | "tithi" | "yoga" | "karana";
  value: string;
  index: number;
}

const DAY_TRANSITIONS: Transition[] = [
  { time: 0, type: "nakshatra", value: "Rohiṇī", index: 3 },
  { time: 0, type: "tithi", value: "Ekādaśī", index: 11 },
  { time: 0, type: "yoga", value: "Vṛddhi", index: 4 },
  { time: 0, type: "karana", value: "Balava", index: 2 },
  { time: 78, type: "karana", value: "Kaulava", index: 3 },
  { time: 156, type: "tithi", value: "Dvādaśī", index: 12 },
  { time: 156, type: "karana", value: "Taitila", index: 4 },
  { time: 234, type: "karana", value: "Gara", index: 5 },
  { time: 312, type: "nakshatra", value: "Mṛgaśīrṣa", index: 4 },
  { time: 312, type: "karana", value: "Vaṇij", index: 6 },
  { time: 390, type: "karana", value: "Viṣṭi", index: 7 },
  { time: 468, type: "tithi", value: "Trayodaśī", index: 13 },
  { time: 468, type: "karana", value: "Śakuni", index: 8 },
  { time: 546, type: "karana", value: "Catuṣpāda", index: 9 },
  { time: 624, type: "karana", value: "Nāga", index: 10 },
  { time: 702, type: "yoga", value: "Dhruva", index: 5 },
  { time: 720, type: "nakshatra", value: "Ārdrā", index: 5 },
  { time: 780, type: "tithi", value: "Caturdaśī", index: 14 },
  { time: 858, type: "karana", value: "Kimstughna", index: 0 },
  { time: 936, type: "yoga", value: "Vyāghāta", index: 6 },
  { time: 1020, type: "nakshatra", value: "Punarvasu", index: 6 },
  { time: 1080, type: "tithi", value: "Amāvāsyā", index: 15 },
  { time: 1170, type: "yoga", value: "Harṣaṇa", index: 7 },
  { time: 1290, type: "nakshatra", value: "Puṣya", index: 7 },
  { time: 1350, type: "yoga", value: "Vajra", index: 8 },
];

const VARA_NAMES = ["Ravi-vāra (Sunday)", "Soma-vāra (Monday)", "Maṅgala-vāra (Tuesday)", "Budha-vāra (Wednesday)", "Guru-vāra (Thursday)", "Śukra-vāra (Friday)", "Śani-vāra (Saturday)"];

const TITHI_NAMES = ["—", "Pratipadā", "Dvitīyā", "Tṛtīyā", "Caturthī", "Pañcamī", "Ṣaṣṭhī", "Saptamī", "Aṣṭamī", "Navamī", "Daśamī", "Ekādaśī", "Dvādaśī", "Trayodaśī", "Caturdaśī", "Pūrṇimā/Amāvāsyā"];

const KARANA_NAMES = ["Kimstughna", "Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vaṇij", "Viṣṭi", "Śakuni", "Catuṣpāda", "Nāga"];

const YOGA_NAMES = ["Viśkambha", "Prīti", "Āyuṣmān", "Saubhāgya", "Śobhana", "Atigaṇḍa", "Sukarman", "Dhṛti", "Śūla", "Gaṇḍa", "Vṛddhi", "Dhruva", "Vyāghāta", "Harṣaṇa", "Vajra", "Siddhi", "Vyatīpāta", "Varīyān", "Parigha", "Śiva", "Siddha", "Sādhya", "Śubha", "Śukla", "Brahma", "Indra", "Vaidhṛti"];

/* Activity suitability by nakṣatra (simplified classical) */
const ACTIVITIES: { key: string; label: string; icon: string }[] = [
  { key: "travel", label: "Travel", icon: "✈️" },
  { key: "marriage", label: "Marriage", icon: "💒" },
  { key: "medical", label: "Medical", icon: "🩺" },
  { key: "spiritual", label: "Spiritual", icon: "🧘" },
  { key: "business", label: "Business", icon: "💼" },
  { key: "hair", label: "Cutting hair", icon: "💈" },
  { key: "construction", label: "Construction", icon: "🏗️" },
];

const ACTIVITY_MAP: Record<number, Record<string, "good" | "bad" | "mixed">> = {
  1:  { travel: "good", marriage: "good", medical: "good", spiritual: "good", business: "good", hair: "mixed", construction: "good" },
  2:  { travel: "mixed", marriage: "bad", medical: "bad", spiritual: "mixed", business: "bad", hair: "bad", construction: "bad" },
  3:  { travel: "bad", marriage: "mixed", medical: "bad", spiritual: "good", business: "mixed", hair: "bad", construction: "bad" },
  4:  { travel: "good", marriage: "good", medical: "good", spiritual: "good", business: "good", hair: "good", construction: "good" },
  5:  { travel: "good", marriage: "mixed", medical: "mixed", spiritual: "good", business: "good", hair: "mixed", construction: "mixed" },
  6:  { travel: "mixed", marriage: "bad", medical: "good", spiritual: "mixed", business: "bad", hair: "bad", construction: "bad" },
  7:  { travel: "good", marriage: "good", medical: "good", spiritual: "good", business: "good", hair: "good", construction: "good" },
  8:  { travel: "good", marriage: "good", medical: "good", spiritual: "good", business: "good", hair: "good", construction: "good" },
  9:  { travel: "mixed", marriage: "bad", medical: "mixed", spiritual: "mixed", business: "bad", hair: "bad", construction: "bad" },
  10: { travel: "mixed", marriage: "mixed", medical: "mixed", spiritual: "good", business: "mixed", hair: "mixed", construction: "mixed" },
  11: { travel: "good", marriage: "good", medical: "mixed", spiritual: "mixed", business: "good", hair: "good", construction: "good" },
  12: { travel: "good", marriage: "good", medical: "good", spiritual: "good", business: "good", hair: "good", construction: "good" },
  13: { travel: "good", marriage: "good", medical: "good", spiritual: "good", business: "good", hair: "good", construction: "good" },
  14: { travel: "mixed", marriage: "mixed", medical: "mixed", spiritual: "mixed", business: "mixed", hair: "mixed", construction: "mixed" },
  15: { travel: "good", marriage: "mixed", medical: "mixed", spiritual: "good", business: "good", hair: "mixed", construction: "mixed" },
  16: { travel: "mixed", marriage: "bad", medical: "mixed", spiritual: "mixed", business: "mixed", hair: "bad", construction: "bad" },
  17: { travel: "good", marriage: "good", medical: "good", spiritual: "good", business: "good", hair: "good", construction: "good" },
  18: { travel: "mixed", marriage: "bad", medical: "mixed", spiritual: "mixed", business: "bad", hair: "bad", construction: "bad" },
  19: { travel: "bad", marriage: "bad", medical: "mixed", spiritual: "mixed", business: "bad", hair: "bad", construction: "bad" },
  20: { travel: "good", marriage: "good", medical: "mixed", spiritual: "good", business: "good", hair: "good", construction: "good" },
  21: { travel: "good", marriage: "good", medical: "good", spiritual: "good", business: "good", hair: "good", construction: "good" },
  22: { travel: "good", marriage: "mixed", medical: "good", spiritual: "good", business: "good", hair: "good", construction: "mixed" },
  23: { travel: "good", marriage: "mixed", medical: "mixed", spiritual: "good", business: "good", hair: "mixed", construction: "mixed" },
  24: { travel: "mixed", marriage: "bad", medical: "good", spiritual: "mixed", business: "bad", hair: "bad", construction: "bad" },
  25: { travel: "mixed", marriage: "mixed", medical: "mixed", spiritual: "good", business: "mixed", hair: "mixed", construction: "mixed" },
  26: { travel: "good", marriage: "good", medical: "good", spiritual: "good", business: "good", hair: "good", construction: "good" },
  27: { travel: "good", marriage: "good", medical: "good", spiritual: "good", business: "good", hair: "good", construction: "good" },
};

const ACTIVITY_REASONS: Record<string, Record<string, string>> = {
  travel: {
    good: "Nakṣatra supports movement and journey; favourable for long-distance travel.",
    bad: "Nakṣatra inauspicious for travel; risk of obstacles or delays.",
    mixed: "Travel possible with precautions; avoid initiating at transition times.",
  },
  marriage: {
    good: "Benefic gana and deity support union ceremonies.",
    bad: "Rākṣasa gana or inauspicious deity creates instability for marriage.",
    mixed: "Acceptable with remedial measures; consult muhūrta specifics.",
  },
  medical: {
    good: "Healing energy strong; favourable for treatment and surgery.",
    bad: "Destructive symbolism; avoid invasive procedures.",
    mixed: "Minor treatments acceptable; defer major surgery if possible.",
  },
  spiritual: {
    good: "Deva gana and sattvic deity support meditation, fasting, and ritual.",
    bad: "Tāmasic energy; spiritual practice may face inner resistance.",
    mixed: "Personal practice fine; avoid initiating group ceremonies.",
  },
  business: {
    good: "Growth-oriented nakṣatra; excellent for deals and openings.",
    bad: "Nakṣatra associated with loss or emptiness; defer signing contracts.",
    mixed: "Review terms carefully; avoid speculative ventures today.",
  },
  hair: {
    good: "Auspicious for cutting hair and nails; promotes growth and health.",
    bad: "Cutting may deplete vitality; postpone grooming.",
    mixed: "Neutral; no strong classical prohibition.",
  },
  construction: {
    good: "Stability nakṣatra; excellent for laying foundations.",
    bad: "Uprooting symbolism; avoid ground-breaking or demolition.",
    mixed: "Repairs acceptable; defer major structural changes.",
  },
};

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

function fmtTime(minutes: number) {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${pad2(h)}:${pad2(m)}`;
}

function currentValue(time: number, type: Transition["type"]) {
  const relevant = DAY_TRANSITIONS.filter((t) => t.type === type && t.time <= time);
  return relevant.length ? relevant[relevant.length - 1] : DAY_TRANSITIONS.find((t) => t.type === type)!;
}

function nextTransition(time: number, type: Transition["type"]) {
  const upcoming = DAY_TRANSITIONS.filter((t) => t.type === type && t.time > time);
  return upcoming.length ? upcoming[0] : null;
}

export function DailyNakshatraPancangaReader() {
  const [sliderMin, setSliderMin] = useState(480); // 08:00
  const [todayVara] = useState(1); // Monday

  const nakshatra = currentValue(sliderMin, "nakshatra");
  const nextNakshatra = nextTransition(sliderMin, "nakshatra");
  const tithi = currentValue(sliderMin, "tithi");
  const yoga = currentValue(sliderMin, "yoga");
  const karana = currentValue(sliderMin, "karana");

  const nakData = NAKSHATRAS[nakshatra.index];
  const rc = RULER_COLORS[nakData.rulerKey];
  const activities = ACTIVITY_MAP[nakData.num];

  return (
    <div className="space-y-6">
      <div style={{ textAlign: "center" }}>
        <p className="text-xs uppercase mb-2" style={{ color: "var(--gl-gold-accent)", letterSpacing: "0.16em", fontWeight: 700 }}>
          B-Builder · Synthesis Mode
        </p>
        <h3 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "26px", fontWeight: 500, color: "var(--gl-gold-accent)" }}>
          Daily Nakṣatra & Pañcāṅga Reader
        </h3>
        <p className="text-base italic mt-2 mx-auto" style={{ fontFamily: "var(--font-cormorant), serif", color: "var(--gl-ink-secondary)", maxWidth: 560, lineHeight: 1.5 }}>
          Drag the time slider to scroll through the day. Watch pañcāṅga elements transition
          and read the classical suitability for each activity.
        </p>
      </div>

      {/* Time slider */}
      <div className="rounded-xl p-5" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)" }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--gl-gold-accent)" }}>Time of Day</span>
          <span className="text-2xl font-bold" style={{ fontFamily: "var(--font-cormorant), serif", color: "var(--gl-ink-primary)" }}>{fmtTime(sliderMin)}</span>
        </div>
        <input
          type="range"
          min={0}
          max={1439}
          step={1}
          value={sliderMin}
          onChange={(e) => setSliderMin(Number(e.target.value))}
          className="w-full gl-focus-ring"
          style={{ accentColor: "var(--gl-gold-accent)" }}
        />
        <div className="flex justify-between text-[10px] mt-1" style={{ color: "var(--gl-ink-muted)" }}>
          <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:59</span>
        </div>
      </div>

      {/* Pañcāṅga tiles */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="rounded-xl p-4 text-center" style={{ background: rc.bg, border: `2px solid ${rc.border}` }}>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: rc.text }}>Nakṣatra</p>
          <p className="text-lg font-semibold" style={{ fontFamily: "var(--font-cormorant), serif", color: "var(--gl-ink-primary)" }}>
            <IAST>{nakshatra.value}</IAST>
          </p>
          <Devanagari size="sm">{nakData.devanagari}</Devanagari>
          {nextNakshatra && (
            <p className="text-[10px] mt-2" style={{ color: "var(--gl-ink-muted)" }}>
              until {fmtTime(nextNakshatra.time)} → <IAST>{nextNakshatra.value}</IAST>
            </p>
          )}
        </div>
        <div className="rounded-xl p-4 text-center" style={{ background: "rgba(255,249,234,0.5)", border: "1px solid var(--gl-gold-hairline)" }}>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--gl-gold-accent)" }}>Tithi</p>
          <p className="text-lg font-semibold" style={{ fontFamily: "var(--font-cormorant), serif", color: "var(--gl-ink-primary)" }}>
            <IAST>{tithi.value}</IAST>
          </p>
          <p className="text-[10px] mt-1" style={{ color: "var(--gl-ink-muted)" }}>{tithi.index}/30</p>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ background: "rgba(255,249,234,0.5)", border: "1px solid var(--gl-gold-hairline)" }}>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--gl-gold-accent)" }}>Vāra</p>
          <p className="text-lg font-semibold" style={{ fontFamily: "var(--font-cormorant), serif", color: "var(--gl-ink-primary)" }}>
            <IAST>{VARA_NAMES[todayVara].split(" (")[0]}</IAST>
          </p>
          <p className="text-[10px] mt-1" style={{ color: "var(--gl-ink-muted)" }}>{VARA_NAMES[todayVara].split(" (")[1].replace(")", "")}</p>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ background: "rgba(255,249,234,0.5)", border: "1px solid var(--gl-gold-hairline)" }}>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--gl-gold-accent)" }}>Yoga</p>
          <p className="text-lg font-semibold" style={{ fontFamily: "var(--font-cormorant), serif", color: "var(--gl-ink-primary)" }}>
            <IAST>{yoga.value}</IAST>
          </p>
          <p className="text-[10px] mt-1" style={{ color: "var(--gl-ink-muted)" }}>{yoga.index}/27</p>
        </div>
        <div className="rounded-xl p-4 text-center" style={{ background: "rgba(255,249,234,0.5)", border: "1px solid var(--gl-gold-hairline)" }}>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--gl-gold-accent)" }}>Karaṇa</p>
          <p className="text-lg font-semibold" style={{ fontFamily: "var(--font-cormorant), serif", color: "var(--gl-ink-primary)" }}>
            <IAST>{karana.value}</IAST>
          </p>
          <p className="text-[10px] mt-1" style={{ color: "var(--gl-ink-muted)" }}>{karana.index}/11</p>
        </div>
      </div>

      {/* Nakṣatra of the day card */}
      <div className="rounded-xl p-5" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: `2px solid ${rc.border}` }}>
        <div className="flex flex-col md:flex-row gap-5">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold" style={{ background: rc.bg, color: rc.text, border: `2px solid ${rc.border}` }}>
                {nakData.num}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: rc.text }}>Nakṣatra of the Moment</p>
                <h4 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-cormorant), serif", color: "var(--gl-ink-primary)" }}>
                  <IAST>{nakshatra.value}</IAST> <span className="text-base" style={{ color: "var(--gl-ink-muted)" }}>({nakData.ruler})</span>
                </h4>
              </div>
            </div>
            <Devanagari size="md" style={{ marginBottom: 12 }}>{nakData.devanagari}</Devanagari>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="rounded-lg p-2 text-center" style={{ background: rc.bg, border: `1px solid ${rc.border}` }}>
                <div className="text-[10px] uppercase tracking-wide" style={{ color: "var(--gl-ink-muted)" }}>Deity</div>
                <div className="text-sm font-semibold" style={{ color: rc.text }}>{nakData.deity}</div>
              </div>
              <div className="rounded-lg p-2 text-center" style={{ background: GANA_STYLE[nakData.gana].bg, border: `1px solid ${GANA_STYLE[nakData.gana].text}` }}>
                <div className="text-[10px] uppercase tracking-wide" style={{ color: "var(--gl-ink-muted)" }}>Gana</div>
                <div className="text-sm font-semibold" style={{ color: GANA_STYLE[nakData.gana].text }}>{nakData.gana}</div>
              </div>
            </div>
            <p className="text-sm italic" style={{ color: "var(--gl-ink-secondary)" }}>{nakData.meaning}</p>
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--gl-gold-accent)" }}>Recommended Activities</p>
            <div className="space-y-2">
              {ACTIVITIES.map((act) => {
                const rating = activities[act.key];
                const color = rating === "good" ? "#4A7C59" : rating === "bad" ? "#A23A1E" : "#8B6914";
                const bg = rating === "good" ? "rgba(74,124,89,0.08)" : rating === "bad" ? "rgba(162,58,30,0.08)" : "rgba(183,137,31,0.06)";
                const indicator = rating === "good" ? "●" : rating === "bad" ? "●" : "◐";
                return (
                  <div key={act.key} className="flex items-center gap-3 rounded-lg p-2" style={{ background: bg, border: `1px solid ${color}30` }}>
                    <span className="text-lg">{act.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold" style={{ color: "var(--gl-ink-primary)" }}>{act.label}</span>
                        <span style={{ color, fontSize: 10 }}>{indicator}</span>
                      </div>
                      <p className="text-[11px]" style={{ color: "var(--gl-ink-secondary)" }}>{ACTIVITY_REASONS[act.key][rating]}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Classical reasoning summary */}
      <div className="rounded-xl p-5" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)" }}>
        <h4 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: "var(--gl-gold-accent)" }}>Classical Reasoning</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="rounded-lg p-3" style={{ background: "rgba(74,124,89,0.06)", border: "1px solid rgba(74,124,89,0.20)" }}>
            <p className="font-semibold mb-1" style={{ color: "#4A7C59" }}>Auspicious (Śubha)</p>
            <p style={{ color: "var(--gl-ink-secondary)" }}>
              {nakData.gana === "deva" ? "Deva gana brings sattvic energy. " : ""}
              {["jupiter", "venus", "moon"].includes(nakData.rulerKey) ? "Benefic ruler supports growth and harmony." : ""}
              {["saturn", "mars", "rahu", "ketu"].includes(nakData.rulerKey) ? "Strong discipline for focused work." : ""}
              {nakData.rulerKey === "sun" ? "Solar energy favours authority and visibility." : ""}
            </p>
          </div>
          <div className="rounded-lg p-3" style={{ background: "rgba(183,137,31,0.05)", border: "1px solid rgba(183,137,31,0.20)" }}>
            <p className="font-semibold mb-1" style={{ color: "#8B6914" }}>Mixed (Mishra)</p>
            <p style={{ color: "var(--gl-ink-secondary)" }}>
              Manuṣya gana requires mindful action. Results depend on intention and effort.
              Suitable for routine work with standard precautions.
            </p>
          </div>
          <div className="rounded-lg p-3" style={{ background: "rgba(162,58,30,0.06)", border: "1px solid rgba(162,58,30,0.20)" }}>
            <p className="font-semibold mb-1" style={{ color: "#A23A1E" }}>Inauspicious (Aśubha)</p>
            <p style={{ color: "var(--gl-ink-secondary)" }}>
              {nakData.gana === "rākṣasa" ? "Rākṣasa gana brings tāmasic force. " : ""}
              Avoid new beginnings; channel energy toward endings, removal, or protection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
