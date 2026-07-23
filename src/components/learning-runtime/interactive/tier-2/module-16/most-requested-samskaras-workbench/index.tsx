"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Info,
  MapPin,
  RotateCcw,
  Scissors,
  Sparkles,
  XCircle,
} from "lucide-react";
import { workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";

type SamskaraKey = "namakarana" | "cudakarana" | "upanayana" | "vivaha";

interface DayCandidate {
  date: string;
  weekday: string;
  nakshatra: string;
  tithiClass: string;
  yoga: string;
}

interface SamskaraData {
  key: SamskaraKey;
  title: string;
  note: string;
  scope: string;
  refinement: string;
  icon: typeof CalendarDays;
  color: string;
  window: string;
  candidates: DayCandidate[];
  checkSpecific: (d: DayCandidate) => boolean;
  specificLabel: string;
}

const MRUDU_NAKSHATRAS = ["Mṛgaśīrṣā", "Citrā", "Anurādhā", "Revatī"];

function isTithiAvoided(tithiClass: string) {
  return tithiClass === "Riktā";
}

function isYogaAvoided(yoga: string) {
  return ["Vyatīpāta", "Vaidhṛti"].includes(yoga);
}

const SAMSKARAS: SamskaraData[] = [
  {
    key: "namakarana",
    title: "Nāmakaraṇa",
    note: "naming ceremony",
    scope: "Commonly within the first two weeks; real regional variation exists. This module's scope is timing only; the nakṣatra-syllable naming custom is noted but not developed as a timing rule.",
    refinement: "General pañcāṅga base inside the family's chosen window; no additional saṁskāra-specific timing rule is well-documented in T1-23.",
    icon: Sparkles,
    color: BLUE,
    window: "Days 8-14 after birth",
    candidates: [
      { date: "Day 8", weekday: "Monday", nakshatra: "Aśvinī", tithiClass: "Nandā", yoga: "Dhruva" },
      { date: "Day 10", weekday: "Wednesday", nakshatra: "Rohiṇī", tithiClass: "Nandā", yoga: "Sukarmā" },
      { date: "Day 12", weekday: "Friday", nakshatra: "Punarvasu", tithiClass: "Bhadrā", yoga: "Dhṛti" },
      { date: "Day 14", weekday: "Sunday", nakshatra: "Āśleṣā", tithiClass: "Riktā", yoga: "Vaidhṛti" },
    ],
    checkSpecific: () => true,
    specificLabel: "Within common naming window",
  },
  {
    key: "cudakarana",
    title: "Cūḍākaraṇa / Muṇḍana",
    note: "first hair-cutting",
    scope: "Mṛdu-nakṣatra affinity is the one specific timing refinement T1-23's own nakṣatra-classification lesson supports. No stronger claim is made.",
    refinement: "Moon in a Mṛdu-class nakṣatra: Mṛgaśīrṣā, Citrā, Anurādhā, or Revatī.",
    icon: Scissors,
    color: GREEN,
    window: "Family's two-week candidate window",
    candidates: [
      { date: "Option A", weekday: "Tuesday", nakshatra: "Mṛgaśīrṣā", tithiClass: "Nandā", yoga: "Dhruva" },
      { date: "Option B", weekday: "Thursday", nakshatra: "Citrā", tithiClass: "Pūrṇā", yoga: "Sukarmā" },
      { date: "Option C", weekday: "Saturday", nakshatra: "Kṛttikā", tithiClass: "Bhadrā", yoga: "Vṛddhi" },
      { date: "Option D", weekday: "Monday", nakshatra: "Aśvinī", tithiClass: "Jayā", yoga: "Dhṛti" },
    ],
    checkSpecific: (d) => MRUDU_NAKSHATRAS.includes(d.nakshatra),
    specificLabel: "Mṛdu nakṣatra",
  },
  {
    key: "upanayana",
    title: "Upanayana",
    note: "sacred-thread investiture",
    scope: "Timing only. The appropriate age-window is determined by the family and their officiants; this module screens within that window.",
    refinement: "Wednesday (Mercury/learning) or Thursday (Jupiter/dharma) vāra preferred for education-related initiations.",
    icon: BookOpen,
    color: PURPLE,
    window: "Family-determined age-window",
    candidates: [
      { date: "Option A", weekday: "Monday", nakshatra: "Hasta", tithiClass: "Nandā", yoga: "Siddha" },
      { date: "Option B", weekday: "Wednesday", nakshatra: "Svātī", tithiClass: "Pūrṇā", yoga: "Sukarmā" },
      { date: "Option C", weekday: "Thursday", nakshatra: "Anurādhā", tithiClass: "Bhadrā", yoga: "Vṛddhi" },
      { date: "Option D", weekday: "Saturday", nakshatra: "Mūla", tithiClass: "Riktā", yoga: "Vyatīpāta" },
    ],
    checkSpecific: (d) => ["Wednesday", "Thursday"].includes(d.weekday),
    specificLabel: "Wednesday or Thursday vāra",
  },
  {
    key: "vivaha",
    title: "Vivāha",
    note: "marriage",
    scope: "Already fully developed in Chapter 2. This section only places marriage correctly as the 15th of the 16 saṁskāras.",
    refinement: "See Chapter 2 (Lessons 16.2.1-16.2.5) for the complete marriage-muhūrta workflow.",
    icon: CalendarDays,
    color: GOLD,
    window: "N/A — full treatment in Chapter 2",
    candidates: [],
    checkSpecific: () => false,
    specificLabel: "Chapter 2 pointer",
  },
];

export function MostRequestedSamskarasWorkbench() {
  const [selected, setSelected] = useState<SamskaraKey>("cudakarana");
  const active = SAMSKARAS.find((s) => s.key === selected) ?? SAMSKARAS[0];

  function reset() {
    setSelected("cudakarana");
  }

  return (
    <div data-interactive="most-requested-samskaras-workbench" style={{ display: "flex", flexDirection: "column", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Most-requested saṁskāras</p>
            <h2 style={{ margin: "0.2rem 0 0", color: ACCENT, fontSize: "1.25rem", fontWeight: 600 }}>
              Apply saṁskāra-specific timing refinements inside a candidate window
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              {`Three of the four saṁskāras here receive their first dedicated treatment in this curriculum; the fourth (marriage) points back to Chapter 2. Screen honestly, without inventing unsupported detail.`}
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, ACCENT)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
        <div
          style={{
            marginTop: "0.65rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.375rem",
            padding: "0.25rem 0.5rem",
            borderRadius: 4,
            background: `${BLUE}10`,
            color: BLUE,
            fontSize: "0.72rem",
            fontWeight: 500,
          }}
        >
          <BookOpen size={10} />
          Source: T1-23 Lessons 23.2.2, 23.2.3; Gṛhyasūtras; Manusmṛti
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Select a saṁskāra</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.55rem", marginTop: "0.55rem" }}>
          {SAMSKARAS.map((s) => {
            const Icon = s.icon;
            const isActive = s.key === selected;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => setSelected(s.key)}
                style={{
                  textAlign: "left",
                  padding: "0.75rem",
                  borderRadius: 8,
                  border: `1px solid ${isActive ? s.color : HAIRLINE}`,
                  background: isActive ? `${s.color}10` : SURFACE,
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Icon size={16} color={isActive ? s.color : INK_MUTED} />
                  <span style={{ fontWeight: 600, fontSize: "0.9rem", color: isActive ? s.color : INK_PRIMARY }}>{s.title}</span>
                  <ChevronRight size={14} color={isActive ? s.color : INK_MUTED} style={{ marginLeft: "auto" }} />
                </div>
                <div style={{ fontSize: "0.75rem", color: INK_SECONDARY, marginTop: "0.3rem" }}>{s.note}</div>
              </button>
            );
          })}
        </div>
      </section>

      {active.key === "vivaha" ? (
        <section
          style={{
            ...cardStyle,
            borderColor: `${GOLD}66`,
            background: `${GOLD}0A`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <MapPin size={18} color={GOLD} />
            <p style={{ ...eyebrowStyle, margin: 0 }}>Pointer to Chapter 2</p>
          </div>
          <h3 style={{ margin: "0.35rem 0 0", color: GOLD, fontSize: "1.05rem", fontWeight: 600 }}>
            Vivāha is the 15th of the 16 saṁskāras
          </h3>
          <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
            {`Marriage already received this module's fullest treatment — five lessons across Chapter 2 covering classical foundation, prohibited tithis, paired tārā-bala, synastry-sensitive moment-selection, and a full worked example. Nothing new is added here; this section only places Chapter 2's work correctly within the 16-saṁskāra sequence.`}
          </p>
        </section>
      ) : (
        <div style={workbenchTwoColumnStyle}>
          <section style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            <p style={eyebrowStyle}>Scope and refinement</p>
            <div
              style={{
                padding: "0.65rem 0.85rem",
                borderRadius: 6,
                border: `1px solid ${active.color}`,
                background: `${active.color}08`,
                fontSize: "0.85rem",
                color: INK_PRIMARY,
                lineHeight: 1.6,
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: active.color, marginBottom: "0.25rem" }}>
                <Info size={12} />
                Scope limit
              </span>
              {active.scope}
            </div>
            <div
              style={{
                padding: "0.65rem 0.85rem",
                borderRadius: 6,
                border: `1px solid ${GREEN}`,
                background: `${GREEN}08`,
                fontSize: "0.85rem",
                color: INK_PRIMARY,
                lineHeight: 1.6,
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: GREEN, marginBottom: "0.25rem" }}>
                <CheckCircle2 size={12} />
                Specific refinement
              </span>
              {active.refinement}
            </div>
            {active.key === "cudakarana" && (
              <div
                style={{
                  padding: "0.65rem",
                  borderRadius: 6,
                  border: `1px solid ${HAIRLINE}`,
                  background: SURFACE,
                }}
              >
                <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: INK_MUTED, marginBottom: "0.35rem" }}>Mṛdu-class nakṣatras</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                  {MRUDU_NAKSHATRAS.map((n) => (
                    <span
                      key={n}
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: GREEN,
                        border: `1px solid ${GREEN}`,
                        borderRadius: 999,
                        padding: "0.15rem 0.5rem",
                      }}
                    >
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            <p style={eyebrowStyle}>{`Candidate window: ${active.window}`}</p>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Option</th>
                    <th style={thStyle}>Vāra</th>
                    <th style={thStyle}>Nakṣatra</th>
                    <th style={thStyle}>Tithi class</th>
                    <th style={thStyle}>Yoga</th>
                    <th style={thStyle}>Verdict</th>
                  </tr>
                </thead>
                <tbody>
                  {active.candidates.map((c) => {
                    const specificPass = active.checkSpecific(c);
                    const tithiFail = isTithiAvoided(c.tithiClass);
                    const yogaFail = isYogaAvoided(c.yoga);
                    const pass = specificPass && !tithiFail && !yogaFail;
                    return (
                      <tr key={c.date}>
                        <td style={tdStyle}>{c.date}</td>
                        <td style={{ ...tdStyle, color: active.key === "upanayana" && ["Wednesday", "Thursday"].includes(c.weekday) ? GREEN : INK_PRIMARY }}>{c.weekday}</td>
                        <td style={{ ...tdStyle, color: active.key === "cudakarana" && MRUDU_NAKSHATRAS.includes(c.nakshatra) ? GREEN : INK_PRIMARY }}>{c.nakshatra}</td>
                        <td style={{ ...tdStyle, color: tithiFail ? VERMILION : INK_PRIMARY }}>{c.tithiClass}</td>
                        <td style={{ ...tdStyle, color: yogaFail ? VERMILION : INK_PRIMARY }}>{c.yoga}</td>
                        <td style={tdStyle}>
                          {pass ? (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", color: GREEN, fontWeight: 600, fontSize: "0.78rem", textTransform: "uppercase" }}>
                              <CheckCircle2 size={12} /> recommended
                            </span>
                          ) : tithiFail || yogaFail ? (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", color: VERMILION, fontWeight: 600, fontSize: "0.78rem", textTransform: "uppercase" }}>
                              <XCircle size={12} /> avoid
                            </span>
                          ) : (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", color: GOLD, fontWeight: 600, fontSize: "0.78rem", textTransform: "uppercase" }}>
                              acceptable
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {(() => {
              const passing = active.candidates.filter((c) => active.checkSpecific(c) && !isTithiAvoided(c.tithiClass) && !isYogaAvoided(c.yoga));
              const specificPassing = active.candidates.filter((c) => active.checkSpecific(c));
              if (passing.length > 0) {
                return (
                  <div style={{ padding: "0.65rem 0.85rem", borderRadius: 6, border: `1px solid ${GREEN}`, background: `${GREEN}10`, fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.55 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: GREEN, marginBottom: "0.25rem" }}>
                      <CheckCircle2 size={12} />
                      Recommendation
                    </span>
                    {`${passing.map((c) => c.date).join(" and ")} ${passing.length > 1 ? "satisfy" : "satisfies"} both the general pañcāṅga base and the ${active.title}-specific refinement.`}
                  </div>
                );
              }
              if (specificPassing.length === 0) {
                return (
                  <div style={{ padding: "0.65rem 0.85rem", borderRadius: 6, border: `1px solid ${VERMILION}`, background: `${VERMILION}10`, fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.55 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: VERMILION, marginBottom: "0.25rem" }}>
                      <AlertTriangle size={12} />
                      Honest disclosure
                    </span>
                    {`No day in this window satisfies the ${active.title}-specific refinement (${active.specificLabel}). I would not silently substitute a different criterion; I would tell the family this constraint and either wait for a wider medically or practically acceptable window or proceed with the general pañcāṅga base only, naming the limitation.`}
                  </div>
                );
              }
              return (
                <div style={{ padding: "0.65rem 0.85rem", borderRadius: 6, border: `1px solid ${GOLD}`, background: `${GOLD}10`, fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.55 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: GOLD, marginBottom: "0.25rem" }}>
                    <Info size={12} />
                    Mixed result
                  </span>
                  {`Some days satisfy the ${active.title}-specific refinement but fail the general pañcāṅga base. The specific refinement does not override universal avoidances.`}
                </div>
              );
            })()}
          </section>
        </div>
      )}
    </div>
  );
}

const cardStyle: CSSProperties = {
  background: SURFACE,
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "1rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  fontSize: "0.72rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  color: INK_MUTED,
  display: "flex",
  alignItems: "center",
  gap: "0.35rem",
};

const thStyle: CSSProperties = {
  textAlign: "left",
  padding: "0.55rem 0.65rem",
  borderBottom: `1px solid ${HAIRLINE}`,
  color: INK_MUTED,
  fontSize: "0.72rem",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const tdStyle: CSSProperties = {
  padding: "0.55rem 0.65rem",
  borderBottom: `1px solid ${HAIRLINE}`,
  color: INK_PRIMARY,
  verticalAlign: "top",
};

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    padding: "0.45rem 0.75rem",
    borderRadius: 6,
    border: `1px solid ${active ? color : HAIRLINE}`,
    background: active ? `${color}15` : SURFACE,
    color: active ? color : INK_SECONDARY,
    fontWeight: 600,
    fontSize: "0.82rem",
    cursor: "pointer",
  };
}
