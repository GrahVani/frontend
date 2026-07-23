"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  ArrowLeftRight,
  CheckCircle2,
  HeartHandshake,
  Info,
  RotateCcw,
  Scale,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type AdKey = "moon" | "mars" | "rahu" | "jupiter" | "saturn" | "mercury" | "ketu" | "venus" | "sun";
type MistakeKey = "decade" | "hypothetical" | "wasted";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const GREEN = "#2F7D55";
const BLUE = "#356CAB";
const AMBER = "#B88421";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";

const AD_DATA: Record<AdKey, {
  label: string;
  start: number;
  end: number;
  ch13: number | null;
  ch13Note?: string;
  ch4: string | null;
  ch4Count: number;
  excluded?: boolean;
}> = {
  moon: { label: "Moon/Moon", start: 30.506, end: 31.339, ch13: null, ch4: "Dārākāraka self-rule", ch4Count: 1 },
  mars: { label: "Moon/Mars", start: 31.339, end: 31.923, ch13: 0, ch4: null, ch4Count: 0 },
  rahu: { label: "Moon/Rāhu", start: 31.923, end: 33.423, ch13: null, ch4: null, ch4Count: 0, excluded: true },
  jupiter: { label: "Moon/Jupiter", start: 33.423, end: 34.756, ch13: 1, ch13Note: "Husband-kāraka", ch4: null, ch4Count: 0 },
  saturn: { label: "Moon/Saturn", start: 34.756, end: 36.339, ch13: 0.5, ch13Note: "Ownership partial", ch4: null, ch4Count: 0 },
  mercury: { label: "Moon/Mercury", start: 36.339, end: 37.756, ch13: 1, ch13Note: "Aspects h7", ch4: null, ch4Count: 0 },
  ketu: { label: "Moon/Ketu", start: 37.756, end: 38.339, ch13: null, ch4: null, ch4Count: 0, excluded: true },
  venus: { label: "Moon/Venus", start: 38.339, end: 40.006, ch13: 0, ch4: null, ch4Count: 0 },
  sun: { label: "Moon/Sun", start: 40.006, end: 40.506, ch13: 1, ch13Note: "Aspects h7", ch4: null, ch4Count: 0 },
};

const AD_ORDER: AdKey[] = ["moon", "mars", "rahu", "jupiter", "saturn", "mercury", "ketu", "venus", "sun"];

const MISTAKES: Record<MistakeKey, { label: string; offText: string }> = {
  decade: {
    label: "Decade-wide qualifiers are texture, not AD-specific indicators",
    offText: "Warning: Jupiter/Pisces and DK/MD apply equally to all nine antardaśās; they cannot raise one AD above another.",
  },
  hypothetical: {
    label: "Lesson 18.3.4’s hypothetical convergence did not occur",
    offText: "Warning: Pisces Cara MD is decade-wide and 9th-from-Lagna; it does not confirm Moon/Jupiter’s narrow window.",
  },
  wasted: {
    label: "A wider Weak-tier field is real information, not a wasted chapter",
    offText: "Warning: more independently-sourced Weak windows is progress of a different kind than a single Moderate window.",
  },
};

function formatAge(n: number) {
  return n.toFixed(3);
}

function tierLabel(count: number, excluded?: boolean) {
  if (excluded) return { label: "Not evaluated", color: INK_MUTED };
  if (count >= 2) return { label: "Moderate", color: GREEN };
  if (count >= 1) return { label: "Weak", color: AMBER };
  if (count > 0) return { label: "Weak / partial", color: AMBER };
  return { label: "None", color: INK_MUTED };
}

export function VimshottariJaiminiParallelSynthesisWorkbench() {
  const [selected, setSelected] = useState<AdKey>("moon");
  const [addDecade, setAddDecade] = useState(false);
  const [showHypo, setShowHypo] = useState(false);
  const [showPhrase, setShowPhrase] = useState(false);
  const [mistakes, setMistakes] = useState<Record<MistakeKey, boolean>>({
    decade: true,
    hypothetical: true,
    wasted: true,
  });

  const ad = AD_DATA[selected];
  const honestCount = (ad.ch13 ?? 0) + ad.ch4Count;
  const displayedCount = addDecade ? honestCount + 1 : honestCount;
  const allHeld = Object.values(mistakes).every(Boolean);

  function reset() {
    setSelected("moon");
    setAddDecade(false);
    setShowHypo(false);
    setShowPhrase(false);
    setMistakes({ decade: true, hypothetical: true, wasted: true });
  }

  return (
    <div data-interactive="vimshottari-jaimini-parallel-synthesis-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Chapter 4 capstone synthesis</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Vimśottarī-Jaimini parallel on Kavya’s chart
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Extend Lesson 18.3.4’s table with Chapter 4’s findings, separate decade-wide texture from antardaśā-specific indicators, and report the honest final picture.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" /> Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>What Chapter 4 actually supplied</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))", gap: "0.75rem", marginTop: "0.75rem" }}>
          <MiniFact icon={<HeartHandshake size={16} />} title="Jupiter + Pisces" body="Jupiter owns and occupies the running Cara sign; applies to the whole decade." color={GREEN} />
          <MiniFact icon={<Scale size={16} />} title="Dārākāraka = Moon" body="The whole Moon MD is the Dārākāraka’s own mahādaśā; applies to the whole decade." color={BLUE} />
          <MiniFact icon={<ArrowLeftRight size={16} />} title="Moon/Moon antardaśā" body="Dārākāraka rules both MD and AD — one new Weak-tier indicator." color={PURPLE} />
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Extended synthesis table</p>
        <div style={{ overflowX: "auto", marginTop: "0.75rem" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem", minWidth: 640 }}>
            <thead>
              <tr style={{ background: `${GOLD}08` }}>
                <th style={thStyle}>Antardaśā</th>
                <th style={thStyle}>Age</th>
                <th style={thStyle}>Ch 1–3</th>
                <th style={thStyle}>Ch 4 specific</th>
                <th style={thStyle}>Total</th>
                <th style={thStyle}>Tier</th>
              </tr>
            </thead>
            <tbody>
              {AD_ORDER.map((key) => {
                const a = AD_DATA[key];
                const total = (a.ch13 ?? 0) + a.ch4Count;
                const isSelected = key === selected;
                return (
                  <tr key={key} onClick={() => { setSelected(key); setAddDecade(false); }} style={{ background: isSelected ? `${GOLD}10` : "transparent", cursor: "pointer" }}>
                    <td style={tdStyle}>
                      <span style={{ fontWeight: isSelected ? 700 : 600 }}>{a.label}</span>
                    </td>
                    <td style={tdStyle}>{formatAge(a.start)}–{formatAge(a.end)}</td>
                    <td style={tdStyle}>
                      {a.excluded ? "excluded" : a.ch13 === null ? "—" : a.ch13 === 0.5 ? "≤½ partial" : `${a.ch13} ${a.ch13Note ? `(${a.ch13Note})` : ""}`}
                    </td>
                    <td style={tdStyle}>{a.ch4 || "none"}</td>
                    <td style={tdStyle}>{a.excluded ? "—" : total}</td>
                    <td style={tdStyle}>
                      <TierBadge count={total} excluded={a.excluded} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 480px" }}>
          <p style={eyebrowStyle}>Selected antardaśā — {ad.label}</p>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap", marginTop: "0.5rem" }}>
            <h3 style={{ margin: 0, color: GOLD, fontSize: "1.2rem", fontWeight: 600 }}>
              Honest count: {ad.excluded ? "not evaluated" : displayedCount} indicator{!ad.excluded && displayedCount !== 1 ? "s" : ""}
            </h3>
            <TierBadge count={displayedCount} excluded={ad.excluded} />
          </div>
          {!ad.excluded && (
            <div style={{ display: "grid", gap: "0.4rem", marginTop: "0.65rem" }}>
              <KeyValue label="Chapters 1–3" value={ad.ch13 === null ? "unevaluated" : ad.ch13 === 0 ? "none" : `${ad.ch13} — ${ad.ch13Note}`} />
              <KeyValue label="Chapter 4 specific" value={ad.ch4 || "none"} />
              <KeyValue label="Decade-wide qualifiers" value="Jupiter/Pisces + DK/Moon-MD (texture only)" />
            </div>
          )}
          {ad.excluded && (
            <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
              Nodes were excluded from Chapters 2–3 and remain excluded here; no indicator count is assigned.
            </p>
          )}
          {!ad.excluded && (
            <div style={{ marginTop: "0.85rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: INK_SECONDARY, fontSize: "0.85rem", cursor: "pointer" }}>
                <input type="checkbox" checked={addDecade} onChange={(e) => setAddDecade(e.target.checked)} />
                Mistake: count decade-wide qualifiers as AD-specific indicators
              </label>
              {addDecade && (
                <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.65rem", alignItems: "start" }}>
                  <AlertTriangle size={20} color={VERMILION} />
                  <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                    This inflates {ad.label} to {displayedCount} indicator{displayedCount !== 1 ? "s" : ""}, but the qualifiers apply with equal force to all nine antardaśās.
                    They cannot differentiate one AD from another.
                  </p>
                </div>
              )}
            </div>
          )}
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 300px" }}>
          <Panel title="Final picture" icon={<Scale size={18} />} color={PURPLE}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
              {AD_ORDER.map((key) => {
                const a = AD_DATA[key];
                const total = (a.ch13 ?? 0) + a.ch4Count;
                return <TierBadge key={key} count={total} excluded={a.excluded} compact />;
              })}
            </div>
            <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
              No antardaśā reaches Moderate after four chapters. Four periods are Weak, one is partial Weak, two are None, and the nodes are excluded.
            </p>
          </Panel>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: `${PURPLE}66`, background: `${PURPLE}0F` }}>
        <p style={eyebrowStyle}>Newly evaluated: Moon/Moon antardaśā</p>
        <h3 style={{ margin: "0.15rem 0 0", color: PURPLE, fontSize: "1.18rem", fontWeight: 600 }}>
          Dārākāraka rules both mahādaśā and antardaśā
        </h3>
        <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.65 }}>
          Moon/Moon (age 30.506–31.339) was never evaluated by Chapters 1–3 because Panchadha Maitri cannot compare a planet to itself.
          Chapter 4’s Chāra Kāraka finding gives it one antardaśā-specific indicator for the first time: the Dārākāraka rules both levels.
        </p>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Hypothetical checker</p>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>
              Suppose a verified antar-rāśi formula showed a marriage-relevant sign specifically during Moon/Jupiter’s window (age 33.423–34.756).
              Would that be a genuine second indicator?
            </p>
          </div>
          <button type="button" onClick={() => setShowHypo((v) => !v)} style={buttonStyle(showHypo, GOLD)}>
            <Info size={15} aria-hidden="true" /> {showHypo ? "Hide" : "Reveal"}
          </button>
        </div>
        {showHypo && (
          <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, background: `${GREEN}0F`, border: `1px solid ${GREEN}55` }}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.65 }}>
              Yes — because it would be specific to Moon/Jupiter’s narrow window, not spread across the whole Pisces Cara mahādaśā.
              That is exactly why Lesson 18.3.4’s hypothetical did not actually occur: mahādaśā-level Cara Daśā cannot provide that granularity without a verified antar-rāśi formula.
            </p>
          </div>
        )}
      </section>

      <section
        style={{
          ...cardStyle,
          background: "#F5EDD8",
          borderLeft: "4px solid var(--gold-primary, #C9A24D)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={{ ...eyebrowStyle, color: GOLD }}>Client-facing finding</p>
            <p style={{ margin: "0.45rem 0 0", color: INK_PRIMARY, lineHeight: 1.65, fontStyle: "italic" }}>
              “Looking at your Moon mahādaśā for marriage-timing specifically, across both Vimśottarī and Jaimini Cara Daśā:
              four periods carry one genuine, independent reason to watch them — your Jupiter antardaśā, your own Moon antardaśā at the start,
              and your Sun and Mercury antardaśās. A fifth, Saturn, carries a weaker structural reason. None has two or more independently confirming factors,
              which is what I’d need to call any one of them a confident prediction. The whole decade also sits under a sign-based period connected to your husband-significator,
              which is a supportive backdrop rather than a specific timing pointer.”
            </p>
          </div>
          <button type="button" onClick={() => setShowPhrase((v) => !v)} style={buttonStyle(showPhrase, GOLD)}>
            <Info size={15} aria-hidden="true" /> {showPhrase ? "Hide" : "Why"}
          </button>
        </div>
        {showPhrase && (
          <ul style={{ margin: "0.75rem 0 0", paddingLeft: "1.25rem", color: INK_SECONDARY, lineHeight: 1.65 }}>
            <li>Reports the real expanded picture from two independent systems.</li>
            <li>States the true Weak tier without inflating it.</li>
            <li>Separates decade-wide backdrop from antardaśā-specific reasons.</li>
          </ul>
        )}
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Hold the discipline</p>
        <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.75rem" }}>
          {(Object.keys(MISTAKES) as MistakeKey[]).map((key) => {
            const on = mistakes[key];
            return (
              <button
                key={key}
                type="button"
                aria-pressed={on}
                onClick={() => setMistakes((m) => ({ ...m, [key]: !on }))}
                style={togglePanelStyle(on, on ? GREEN : VERMILION)}
              >
                {on ? <CheckCircle2 size={18} aria-hidden="true" /> : <AlertTriangle size={18} aria-hidden="true" />}
                <span>
                  <strong style={{ fontWeight: 700 }}>{MISTAKES[key].label}</strong>
                  <span>{on ? " — discipline held." : ` ${MISTAKES[key].offText}`}</span>
                </span>
              </button>
            );
          })}
        </div>
        <div
          style={{
            marginTop: "0.75rem",
            padding: "0.65rem 0.85rem",
            borderRadius: 8,
            background: allHeld ? `${GREEN}12` : `${VERMILION}12`,
            border: `1px solid ${allHeld ? GREEN : VERMILION}55`,
            color: allHeld ? GREEN : VERMILION,
            fontWeight: 600,
          }}
        >
          {allHeld
            ? "All discipline commitments are held. The final confidence picture can be reported honestly."
            : `${Object.keys(MISTAKES).length - Object.values(mistakes).filter(Boolean).length} discipline commitment(s) released. Review the warnings above.`}
        </div>
      </section>
    </div>
  );
}

function TierBadge({ count, excluded, compact }: { count: number; excluded?: boolean; compact?: boolean }) {
  const t = tierLabel(count, excluded);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: compact ? "0.2rem 0.5rem" : "0.25rem 0.6rem",
        borderRadius: "9999px",
        background: `${t.color}15`,
        color: t.color,
        border: `1px solid ${t.color}55`,
        fontSize: compact ? "0.72rem" : "0.78rem",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
      }}
    >
      {t.label}
    </span>
  );
}

function KeyValue({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
      <span style={{ color: INK_MUTED, fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
      <span style={{ color: INK_PRIMARY, fontSize: "0.9rem" }}>{value}</span>
    </div>
  );
}

function MiniFact({ icon, title, body, color }: { icon: ReactNode; title: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}0F`, padding: "0.7rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color, fontWeight: 700 }}>{icon}{title}</div>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.35, fontSize: "0.88rem" }}>{body}</p>
    </div>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 700 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.55rem 0.75rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function togglePanelStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "24px 1fr",
    gap: "0.65rem",
    alignItems: "start",
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}14` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.75rem",
    cursor: "pointer",
  };
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 700,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};

const thStyle: CSSProperties = {
  padding: "0.55rem 0.65rem",
  textAlign: "left",
  color: INK_MUTED,
  fontWeight: 700,
  fontSize: "0.72rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const tdStyle: CSSProperties = {
  padding: "0.5rem 0.65rem",
  borderTop: `1px solid ${HAIRLINE}`,
  color: INK_PRIMARY,
  fontSize: "0.82rem",
};
