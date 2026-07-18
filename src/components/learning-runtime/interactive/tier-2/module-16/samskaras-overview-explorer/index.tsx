"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  BookOpen,
  Info,
  MessageSquareQuote,
  RotateCcw,
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


interface Samskara {
  number: number;
  name: string;
  note: string;
  description: string;
  fullDepth: boolean;
}

const SAMSKARAS: Samskara[] = [
  { number: 1, name: "Garbhādhāna", note: "conception", description: "The rite surrounding conception, marking the beginning of the life-cycle sequence.", fullDepth: false },
  { number: 2, name: "Puṁsavana", note: "early-to-mid pregnancy", description: "A prenatal rite classically timed in early-to-mid pregnancy.", fullDepth: false },
  { number: 3, name: "Sīmantonnayana", note: "later pregnancy", description: "A prenatal rite classically timed in later pregnancy.", fullDepth: false },
  { number: 4, name: "Jātakarma", note: "birth rites", description: "Birth rites; in some Gṛhyasūtra traditions merged with Nāmakaraṇa.", fullDepth: false },
  { number: 5, name: "Nāmakaraṇa", note: "naming", description: "The naming ceremony, classically around the tenth-to-twelfth day.", fullDepth: true },
  { number: 6, name: "Niṣkramaṇa", note: "first outing", description: "The infant's first outing from the home.", fullDepth: false },
  { number: 7, name: "Annaprāśana", note: "first solid food", description: "The ceremony of the child's first solid food.", fullDepth: false },
  { number: 8, name: "Cūḍākaraṇa / Muṇḍana", note: "first hair-cutting", description: "The first hair-cutting or tonsure ceremony.", fullDepth: true },
  { number: 9, name: "Karṇavedha", note: "ear-piercing", description: "The ear-piercing ceremony.", fullDepth: false },
  { number: 10, name: "Vidyārambha", note: "start of learning", description: "Start of formal learning; absent from the oldest Dharmasūtra lists.", fullDepth: false },
  { number: 11, name: "Upanayana", note: "sacred-thread", description: "Sacred-thread investiture; entry into formal Vedic study.", fullDepth: true },
  { number: 12, name: "Vedārambha", note: "Veda-study", description: "Formal start of Veda-study proper.", fullDepth: false },
  { number: 13, name: "Keśānta / Godāna", note: "coming-of-age", description: "A coming-of-age rite marking the end of childhood.", fullDepth: false },
  { number: 14, name: "Samāvartana", note: "graduation", description: "Graduation; the completion of studenthood.", fullDepth: false },
  { number: 15, name: "Vivāha", note: "marriage", description: "Marriage. Correctly the fifteenth saṁskāra, not the eighth (Lesson 16.1.2 corrected).", fullDepth: true },
  { number: 16, name: "Antyeṣṭi", note: "funeral rites", description: "Funeral rites; the final saṁskāra of the life cycle.", fullDepth: false },
];

const SOURCE_VARIANCE = [
  { source: "Gautama Dharmasūtra", count: "~40", note: "Lists forty outer saṁskāras" },
  { source: "Gṛhyasūtras", count: "~12-18", note: "Individual texts vary" },
  { source: "Manusmṛti", count: "~13", note: "Approximately thirteen" },
  { source: "Modern synthesis", count: "16", note: "Standard widely-cited enumeration" },
];

const HONEST_ANSWER_SCRIPT = `The number you'll usually hear is sixteen, and that's the number I'll use with you too, because it's the most widely recognised synthesis. But I want to be honest that the classical texts themselves don't all agree -- one early text lists forty, others list something between twelve and eighteen, and Manusmṛti's own count is different again. Sixteen is the number later tradition settled on as the standard, not a single ancient text's own fixed count.`;

export function SamskarasOverviewExplorer() {
  const [selected, setSelected] = useState<number>(1);
  const active = SAMSKARAS.find((s) => s.number === selected) ?? SAMSKARAS[0];

  function reset() {
    setSelected(1);
  }

  return (
    <div data-interactive="samskaras-overview-explorer" style={{ display: "flex", flexDirection: "column", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>The 16 saṁskāras — overview and source variance</p>
            <h2 style={{ margin: "0.2rem 0 0", color: ACCENT, fontSize: "1.25rem", fontWeight: 600 }}>
              Browse the life-cycle sequence with honest source disclosure
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              {`"Sixteen" is the standard modern synthesis, not a single classical text's fixed count. Select any saṁskāra to see its place, description, and whether this module treats it at full depth or awareness-and-recognition.`}
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
          Source: Gautama Dharmasūtra; Gṛhyasūtras; Manusmṛti; Rajbali Pandey
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Life-cycle sequence</p>
        <div
          style={{
            display: "flex",
            gap: "0.45rem",
            overflowX: "auto",
            padding: "0.35rem 0",
          }}
        >
          {SAMSKARAS.map((s) => (
            <button
              key={s.number}
              type="button"
              onClick={() => setSelected(s.number)}
              style={{
                flex: "0 0 auto",
                width: 64,
                padding: "0.5rem 0.35rem",
                borderRadius: 8,
                border: `1px solid ${selected === s.number ? ACCENT : HAIRLINE}`,
                background: selected === s.number ? `${ACCENT}15` : SURFACE,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              <span style={{ fontSize: "0.7rem", fontWeight: 700, color: selected === s.number ? ACCENT : INK_MUTED }}>#{s.number}</span>
              <span style={{ fontSize: "0.75rem", fontWeight: 600, color: selected === s.number ? ACCENT : INK_PRIMARY, textAlign: "center", lineHeight: 1.2 }}>
                {s.name}
              </span>
              {s.fullDepth && <span style={{ width: 6, height: 6, borderRadius: "50%", background: GREEN }} />}
            </button>
          ))}
        </div>

        <div
          style={{
            marginTop: "0.85rem",
            padding: "0.85rem",
            borderRadius: 8,
            border: `1px solid ${active.fullDepth ? GREEN : HAIRLINE}`,
            background: active.fullDepth ? `${GREEN}10` : SURFACE,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: INK_MUTED }}>#{active.number}</span>
            <span style={{ fontSize: "1.05rem", fontWeight: 600, color: active.fullDepth ? GREEN : INK_PRIMARY }}>{active.name}</span>
            {active.fullDepth && (
              <span
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                  color: GREEN,
                  border: `1px solid ${GREEN}`,
                  borderRadius: 999,
                  padding: "0.1rem 0.4rem",
                }}
              >
                Full depth
              </span>
            )}
          </div>
          <p style={{ margin: 0, fontSize: "0.85rem", color: INK_SECONDARY, lineHeight: 1.6 }}>{active.description}</p>
          <div style={{ fontSize: "0.78rem", color: INK_MUTED, marginTop: "0.35rem" }}>{active.note}</div>
        </div>
      </section>

      <div style={workbenchTwoColumnStyle}>
        <section style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          <p style={eyebrowStyle}>{`Source variance — why "16" needs a caveat`}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.55rem" }}>
            {SOURCE_VARIANCE.map((sv) => (
              <div key={sv.source} style={{ padding: "0.65rem", borderRadius: 8, border: `1px solid ${HAIRLINE}`, background: SURFACE }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: INK_MUTED, marginBottom: "0.25rem" }}>{sv.source}</div>
                <div style={{ fontSize: "1.5rem", fontWeight: 600, color: sv.source === "Modern synthesis" ? GREEN : INK_PRIMARY }}>{sv.count}</div>
                <div style={{ fontSize: "0.75rem", color: INK_SECONDARY, marginTop: "0.2rem" }}>{sv.note}</div>
              </div>
            ))}
          </div>
          <div
            style={{
              padding: "0.75rem",
              borderRadius: 8,
              border: `1px solid ${BLUE}`,
              background: `${BLUE}08`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: BLUE, marginBottom: "0.35rem" }}>
              <MessageSquareQuote size={12} />
              Discipline-compliant answer
            </div>
            <p style={{ margin: 0, fontSize: "0.88rem", color: INK_PRIMARY, lineHeight: 1.65 }}>{HONEST_ANSWER_SCRIPT}</p>
          </div>
        </section>

        <section style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          <p style={eyebrowStyle}>Module scope depth</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.45rem" }}>
            {SAMSKARAS.map((s) => (
              <div
                key={s.number}
                style={{
                  padding: "0.5rem",
                  borderRadius: 6,
                  border: `1px solid ${s.fullDepth ? GREEN : HAIRLINE}`,
                  background: s.fullDepth ? `${GREEN}08` : SURFACE,
                  fontSize: "0.78rem",
                  color: s.fullDepth ? GREEN : INK_SECONDARY,
                }}
              >
                <span style={{ fontWeight: 600, color: INK_PRIMARY }}>{s.number}.</span> {s.name}
              </div>
            ))}
          </div>
          <div
            style={{
              padding: "0.65rem 0.85rem",
              borderRadius: 6,
              border: `1px solid ${GOLD}`,
              background: `${GOLD}08`,
              fontSize: "0.85rem",
              color: INK_SECONDARY,
              lineHeight: 1.55,
            }}
          >
            <Info size={14} color={GOLD} style={{ display: "inline", marginRight: 6, verticalAlign: "text-bottom" }} />
            {`Full depth is given only to Vivāha (Chapter 2) and the three saṁskāras in Lesson 16.6.2: Nāmakaraṇa, Upanayana, and Cūḍākaraṇa/Muṇḍana. The remaining twelve are treated at awareness-and-recognition depth, per this module's disclosed scoping decision.`}
          </div>
        </section>
      </div>

      <section
        style={{
          ...cardStyle,
          borderColor: `${VERMILION}66`,
          background: `${VERMILION}0A`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <AlertTriangle size={18} color={VERMILION} />
          <p style={{ ...eyebrowStyle, margin: 0 }}>Correction to Lesson 16.1.2</p>
        </div>
        <h3 style={{ margin: "0.35rem 0 0", color: VERMILION, fontSize: "1.05rem", fontWeight: 600 }}>
          Vivāha is the 15th saṁskāra, not the 8th
        </h3>
        <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
          {`Lesson 16.1.2 §4.2 previously described a wedding as "itself the 8th saṁskāra classically." Per the standard sixteen-item enumeration, Vivāha is the fifteenth. The error has been corrected in Lesson 16.1.2 itself and is disclosed here, consistent with this module's practice of naming and fixing citation errors rather than silently carrying them forward.`}
        </p>
      </section>
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
