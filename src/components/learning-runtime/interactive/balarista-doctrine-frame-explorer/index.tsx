"use client";

import { useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  Baby,
  History,
  Info,
  RotateCcw,
  Scale,
  Stethoscope,
} from "lucide-react";

type CategoryKey = "bala" | "madhya" | "yoga";
type EraKey = "premodern" | "modern";
type ScopeKey = "vocabulary" | "restrained" | "forecast";
type PathKey = "config" | "cancel" | "ethics";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const SHADOW = "var(--gl-shadow-soft)";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const BLUE = "#356CAB";
const PURPLE = "#6B5AA8";

const CATEGORIES: Record<
  CategoryKey,
  {
    label: string;
    devanagari: string;
    threshold: string;
    ages: string;
    color: string;
    definition: string;
    note: string;
  }
> = {
  bala: {
    label: "Bālāriṣṭa",
    devanagari: "बालारिष्ट",
    threshold: "around age 8",
    ages: "0–8",
    color: VERMILION,
    definition: "Risk indications concentrated in the earliest years of life.",
    note: "The youngest sub-category of Alpāyu; not interchangeable with the later two.",
  },
  madhya: {
    label: "Madhyāriṣṭa",
    devanagari: "मध्यारिष्ट",
    threshold: "around age 20",
    ages: "8–20",
    color: GOLD,
    definition: "Risk indications extending further into childhood.",
    note: "A middle grade — still Alpāyu, but carrying a different classical weight.",
  },
  yoga: {
    label: "Yogāriṣṭa",
    devanagari: "योगारिष्ट",
    threshold: "around age 32",
    ages: "20–32",
    color: PURPLE,
    definition: "Risk indications reaching into early adulthood.",
    note: "The outer Alpāyu threshold; conflating it with Bālāriṣṭa flattens the doctrine.",
  },
};

const FRAMEWORK = {
  alp: { label: "Alpāyu", note: "Short life", color: VERMILION },
  mad: { label: "Madhyāyu", note: "Medium life", color: GOLD },
  pur: { label: "Pūrṇāyu", note: "Full life", color: GREEN },
};

const ERAS: Record<
  EraKey,
  {
    label: string;
    mortality: string;
    context: string;
    bullets: string[];
    icon: ReactNode;
    color: string;
  }
> = {
  premodern: {
    label: "Pre-modern context",
    mortality: "~25–50%",
    context:
      "Child mortality was a pervasive, largely unpreventable reality. A doctrine this consequential received correspondingly serious classical attention.",
    bullets: [
      "limited medical prevention",
      "nutrition and sanitation constraints",
      "doctrine developed under constant loss",
    ],
    icon: <History size={18} aria-hidden="true" />,
    color: VERMILION,
  },
  modern: {
    label: "Modern context",
    mortality: "~3–5%",
    context:
      "Outcomes are dominated by medicine, public health, nutrition, and circumstance — not directly transferable from the classical setting.",
    bullets: [
      "healthcare access and vaccines",
      "congenital-condition management",
      "injury prevention and nutrition",
    ],
    icon: <Stethoscope size={18} aria-hidden="true" />,
    color: GREEN,
  },
};

const SCOPES: Record<
  ScopeKey,
  {
    label: string;
    correct: boolean;
    summary: string;
    feedback: string;
  }
> = {
  vocabulary: {
    label: "Classical vocabulary + cancellation analysis",
    correct: true,
    summary:
      "Treat the configuration as the starting point for the chapter's real technical payload.",
    feedback:
      "This is the curriculum's scope: identify the configuration, then move straight to the cancellation apparatus.",
  },
  restrained: {
    label: "Quietly note it, but keep the technical display minimal",
    correct: false,
    summary:
      "Still treats the doctrine as a live risk assessment delivered to a vulnerable person.",
    feedback:
      "Too close to a forecast. The parent is in a vulnerable position; restraint comes before technical display.",
  },
  forecast: {
    label: "Live mortality forecast for the parent",
    correct: false,
    summary:
      "This is exactly what the curriculum rejects as a client-facing use of this doctrine.",
    feedback:
      "Never. Bālāriṣṭa is taught as classical vocabulary and a cancellation-analysis starting point, never as a live forecast.",
  },
};

const PATH: Record<
  PathKey,
  {
    label: string;
    lesson: string;
    color: string;
    body: string;
  }
> = {
  config: {
    label: "Configurations",
    lesson: "7.2.2",
    color: BLUE,
    body: "Identify the major classical Bālāriṣṭa configurations.",
  },
  cancel: {
    label: "Cancellations",
    lesson: "7.2.3",
    color: GREEN,
    body:
      "The chapter's technical centre of gravity — most candidate charts carry one or more classical cancellations.",
  },
  ethics: {
    label: "Ethics",
    lesson: "7.2.4",
    color: PURPLE,
    body: "How, and whether, any of this belongs in a conversation with a parent.",
  },
};

const MISTAKES = [
  {
    label: "Treating the three categories as interchangeable",
    wrong:
      "Any risk-adjacent configuration, regardless of age threshold, is called 'Bālāriṣṭa'.",
    right:
      "Bālāriṣṭa, Madhyāriṣṭa, and Yogāriṣṭa are three graded Alpāyu categories with different thresholds.",
  },
  {
    label: "Applying the doctrine unmodified to a modern context",
    wrong:
      "Classical Bālāriṣṭa is read as a direct, literal modern prediction.",
    right:
      "Modern child mortality is overwhelmingly medical, public-health, and circumstantial; the doctrine is classical vocabulary, not a live forecast.",
  },
  {
    label: "Learning configurations without learning cancellations",
    wrong:
      "A Bālāriṣṭa-relevant configuration is treated as conclusive without checking cancellation.",
    right:
      "Configuration → cancellation → ethics is deliberate; do not apply 7.2.2 without 7.2.3.",
  },
];

export function BalaristaDoctrineFrameExplorer() {
  const [category, setCategory] = useState<CategoryKey>("bala");
  const [era, setEra] = useState<EraKey>("premodern");
  const [scope, setScope] = useState<ScopeKey | null>(null);
  const [pathNode, setPathNode] = useState<PathKey>("cancel");
  const [showSloka, setShowSloka] = useState(false);
  const [openMistakes, setOpenMistakes] = useState<Record<number, boolean>>({});

  const reset = () => {
    setCategory("bala");
    setEra("premodern");
    setScope(null);
    setPathNode("cancel");
    setShowSloka(false);
    setOpenMistakes({});
  };

  const toggleMistake = (index: number) =>
    setOpenMistakes((prev) => ({ ...prev, [index]: !prev[index] }));

  const activeCategory = CATEGORIES[category];
  const activeEra = ERAS[era];
  const activeScope = scope ? SCOPES[scope] : null;

  return (
    <div data-interactive="balarista-doctrine-frame-explorer" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={panelStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Bālāriṣṭa — classical doctrine revisited</p>
            <h2 style={{ margin: "0.2rem 0 0", color: VERMILION, fontSize: "1.35rem", fontWeight: 600 }}>
              Learn the frame before touching a chart
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 880, fontWeight: 400 }}>
              This lesson teaches Bālāriṣṭa as classical vocabulary and the starting point for cancellation analysis — never as a live mortality forecast.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(300px, 1.1fr) minmax(300px, 0.9fr)", gap: "1rem", alignItems: "start" }}>
        <section style={panelStyle}>
          <p style={eyebrowStyle}>Longevity framework</p>
          <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.1rem", fontWeight: 600 }}>
            Three graded categories inside Alpāyu
          </h3>
          <CategoryArcSvg selected={category} onSelect={setCategory} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.55rem", marginTop: "0.75rem" }}>
            {(Object.entries(CATEGORIES) as [CategoryKey, typeof CATEGORIES.bala][]).map(([key, cat]) => (
              <button
                key={key}
                type="button"
                aria-pressed={category === key}
                onClick={() => setCategory(key)}
                style={categoryChipStyle(category === key, cat.color)}
              >
                <span style={{ fontWeight: 500 }}>{cat.label}</span>
                <span style={{ fontSize: "0.8rem", opacity: 0.85 }}>{cat.ages}</span>
              </button>
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Selected category" icon={<Baby size={18} />} color={activeCategory.color}>
            <p style={{ margin: 0, color: INK_PRIMARY, fontWeight: 500, fontSize: "1.05rem" }}>
              {activeCategory.label}{" "}
              <span style={{ color: INK_MUTED, fontSize: "0.9rem" }}>({activeCategory.devanagari})</span>
            </p>
            <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
              {activeCategory.definition}
            </p>
            <div style={{ marginTop: "0.65rem", padding: "0.6rem", borderRadius: 8, background: `${activeCategory.color}10`, border: `1px solid ${activeCategory.color}55` }}>
              <p style={{ margin: 0, color: activeCategory.color, fontWeight: 500 }}>
                Classical threshold: {activeCategory.threshold}
              </p>
              <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, fontSize: "0.86rem", lineHeight: 1.5 }}>
                {activeCategory.note}
              </p>
            </div>
          </Panel>

          <Panel title="Framework reminder" icon={<Scale size={18} />} color={BLUE}>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
              Classical longevity doctrine groups life into Alpāyu, Madhyāyu, and Pūrṇāyu. The three
              <em>ariṣṭa</em> categories are sub-divisions of Alpāyu only.
            </p>
          </Panel>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(300px, 1fr) minmax(300px, 1fr)", gap: "1rem", alignItems: "start" }}>
        <section style={panelStyle}>
          <p style={eyebrowStyle}>Historical context</p>
          <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.1rem", fontWeight: 600 }}>
            Why the doctrine is so extensively developed
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <button type="button" aria-pressed={era === "premodern"} onClick={() => setEra("premodern")} style={smallChipStyle(era === "premodern", VERMILION)}>
              Pre-modern
            </button>
            <button type="button" aria-pressed={era === "modern"} onClick={() => setEra("modern")} style={smallChipStyle(era === "modern", GREEN)}>
              Modern
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", display: "grid", placeItems: "center", background: `${activeEra.color}15`, border: `2px solid ${activeEra.color}` }}>
              <span style={{ color: activeEra.color, fontWeight: 600, fontSize: "0.95rem" }}>{activeEra.mortality}</span>
            </div>
            <div>
              <p style={{ margin: 0, color: INK_PRIMARY, fontWeight: 500 }}>{activeEra.label} — under-five mortality</p>
              <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, fontSize: "0.88rem", lineHeight: 1.5 }}>{activeEra.context}</p>
            </div>
          </div>
          <ul style={{ margin: 0, paddingLeft: "1.2rem", color: INK_SECONDARY, lineHeight: 1.6, fontWeight: 400 }}>
            {activeEra.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </section>

        <section style={panelStyle}>
          <p style={eyebrowStyle}>Scope routing</p>
          <h3 style={{ margin: "0.15rem 0 0.75rem", color: GREEN, fontSize: "1.1rem", fontWeight: 600 }}>
            What do you do with a Bālāriṣṭa-relevant chart?
          </h3>
          <p style={{ margin: "0 0 0.65rem", color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
            A parent brings a young child&apos;s chart. The configuration is classically notable. Choose the curriculum-correct scope.
          </p>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            {(Object.entries(SCOPES) as [ScopeKey, typeof SCOPES.vocabulary][]).map(([key, option]) => (
              <button
                key={key}
                type="button"
                aria-pressed={scope === key}
                onClick={() => setScope(key)}
                style={scopeChipStyle(scope === key, option.correct ? GREEN : key === "forecast" ? VERMILION : GOLD)}
              >
                <span style={{ fontWeight: 500 }}>{option.label}</span>
              </button>
            ))}
          </div>
          {activeScope && (
            <div
              style={{
                marginTop: "0.75rem",
                padding: "0.75rem",
                borderRadius: 8,
                background: activeScope.correct ? `${GREEN}10` : `${VERMILION}10`,
                border: `1px solid ${activeScope.correct ? GREEN : VERMILION}55`,
              }}
            >
              <p style={{ margin: 0, color: activeScope.correct ? GREEN : VERMILION, fontWeight: 500 }}>
                {activeScope.correct ? "Correct scope" : "Discipline warning"}
              </p>
              <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
                {activeScope.feedback}
              </p>
            </div>
          )}
        </section>
      </div>

      <section style={panelStyle}>
        <p style={eyebrowStyle}>Chapter pathway</p>
        <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.1rem", fontWeight: 600 }}>
          The order is itself the safeguard
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem", alignItems: "stretch" }}>
          {(Object.entries(PATH) as [PathKey, typeof PATH.config][]).map(([key, node]) => (
            <button
              key={key}
              type="button"
              aria-pressed={pathNode === key}
              onClick={() => setPathNode(key)}
              style={pathNodeStyle(pathNode === key, node.color)}
            >
              <span style={{ color: INK_MUTED, fontSize: "0.78rem", fontWeight: 500 }}>{node.lesson}</span>
              <span style={{ color: node.color, fontWeight: 600, fontSize: "1.05rem" }}>{node.label}</span>
              {key === "cancel" && (
                <span style={{ color: INK_MUTED, fontSize: "0.76rem" }}>technical centre of gravity</span>
              )}
            </button>
          ))}
        </div>
        <div style={{ marginTop: "0.85rem", padding: "0.75rem", borderRadius: 8, background: `${PATH[pathNode].color}10`, border: `1px solid ${PATH[pathNode].color}55` }}>
          <p style={{ margin: 0, color: PATH[pathNode].color, fontWeight: 500 }}>
            {PATH[pathNode].lesson} — {PATH[pathNode].label}
          </p>
          <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
            {PATH[pathNode].body}
          </p>
        </div>
      </section>

      <section style={panelStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
          <p style={eyebrowStyle}>Teaching verse</p>
          <button type="button" aria-pressed={showSloka} onClick={() => setShowSloka((v) => !v)} style={smallChipStyle(showSloka, GOLD)}>
            {showSloka ? "Hide verse" : "Show verse"}
          </button>
        </div>
        {showSloka && (
          <div style={{ marginTop: "0.75rem", color: INK_SECONDARY, lineHeight: 1.7, fontWeight: 400 }}>
            <p style={{ margin: 0, fontStyle: "italic" }}>
              bālāriṣṭaṁ yathā proktaṁ tathā bhaṅgo&apos;pi kathyate |<br />
              ubhayaṁ jñātvā vaded vidvān naikaṁ dṛṣṭvaiva kathyate ||
            </p>
            <p style={{ margin: "0.6rem 0 0", color: INK_PRIMARY }}>
              &quot;As Bālāriṣṭa is spoken of, so too is its cancellation spoken of. Knowing both, the learned one may speak — not having seen only one alone.&quot;
            </p>
            <p style={{ margin: "0.5rem 0 0", fontSize: "0.85rem", color: INK_MUTED }}>
              Composite teaching paraphrase of the BPHS framing, not a verbatim quotation.
            </p>
          </div>
        )}
      </section>

      <section style={panelStyle}>
        <p style={eyebrowStyle}>Common mistakes</p>
        <h3 style={{ margin: "0.15rem 0 0.75rem", color: GOLD, fontSize: "1.1rem", fontWeight: 600 }}>
          Hold the doctrinal discipline
        </h3>
        <div style={{ display: "grid", gap: "0.65rem" }}>
          {MISTAKES.map((item, index) => {
            const open = openMistakes[index];
            return (
              <div key={index} style={{ border: `1px solid ${open ? VERMILION : HAIRLINE}`, borderRadius: 8, background: open ? `${VERMILION}0D` : SURFACE, padding: "0.75rem" }}>
                <button
                  type="button"
                  onClick={() => toggleMistake(index)}
                  style={{ width: "100%", textAlign: "left", background: "transparent", border: "none", padding: 0, cursor: "pointer", color: INK_PRIMARY, fontWeight: 500 }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <Info size={15} aria-hidden="true" style={{ color: open ? VERMILION : INK_MUTED }} />
                    {item.label}
                  </span>
                </button>
                {open && (
                  <div style={{ marginTop: "0.6rem", color: INK_SECONDARY, lineHeight: 1.55, fontWeight: 400 }}>
                    <p style={{ margin: 0, color: VERMILION }}>
                      <span style={{ fontWeight: 500 }}>Overclaim:</span> {item.wrong}
                    </p>
                    <p style={{ margin: "0.35rem 0 0" }}>
                      <span style={{ fontWeight: 500, color: GREEN }}>Honest reading:</span> {item.right}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function CategoryArcSvg({
  selected,
  onSelect,
}: {
  selected: CategoryKey;
  onSelect: (key: CategoryKey) => void;
}) {
  const bandY = { alp: 42, mad: 112, pur: 182 };
  const bandH = 54;
  const cx: Record<CategoryKey, number> = { bala: 125, madhya: 280, yoga: 435 };
  const cy = bandY.alp + bandH / 2;

  return (
    <svg viewBox="0 0 560 250" role="img" aria-label="The three graded Ariṣṭa categories inside the Alpāyu longevity band" style={{ width: "100%", maxHeight: 260, display: "block" }}>
      {/* Framework bands */}
      <rect x={80} y={bandY.alp} width={450} height={bandH} rx={6} fill={`${FRAMEWORK.alp.color}12`} stroke={FRAMEWORK.alp.color} strokeWidth="1.5" />
      <rect x={80} y={bandY.mad} width={450} height={bandH} rx={6} fill={`${FRAMEWORK.mad.color}0D`} stroke={FRAMEWORK.mad.color} strokeWidth="1.5" />
      <rect x={80} y={bandY.pur} width={450} height={bandH} rx={6} fill={`${FRAMEWORK.pur.color}0D`} stroke={FRAMEWORK.pur.color} strokeWidth="1.5" />

      <text x={40} y={bandY.alp + bandH / 2 + 5} textAnchor="end" fill={FRAMEWORK.alp.color} fontSize="13" fontWeight={600}>{FRAMEWORK.alp.label}</text>
      <text x={40} y={bandY.mad + bandH / 2 + 5} textAnchor="end" fill={FRAMEWORK.mad.color} fontSize="13" fontWeight={600}>{FRAMEWORK.mad.label}</text>
      <text x={40} y={bandY.pur + bandH / 2 + 5} textAnchor="end" fill={FRAMEWORK.pur.color} fontSize="13" fontWeight={600}>{FRAMEWORK.pur.label}</text>

      {/* Connecting arc under categories */}
      <path d="M 125 98 Q 280 125 435 98" fill="none" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="4 3" />

      {/* Category nodes */}
      {(Object.keys(CATEGORIES) as CategoryKey[]).map((key) => {
        const cat = CATEGORIES[key];
        const isSelected = selected === key;
        return (
          <g key={key} style={{ cursor: "pointer" }} onClick={() => onSelect(key)}>
            <circle cx={cx[key]} cy={cy} r={isSelected ? 28 : 22} fill={`${cat.color}${isSelected ? "22" : "14"}`} stroke={cat.color} strokeWidth={isSelected ? 3 : 2} />
            <text x={cx[key]} y={cy + 4} textAnchor="middle" fill={cat.color} fontSize={isSelected ? 14 : 12} fontWeight={600}>
              {key === "bala" ? "Bā" : key === "madhya" ? "Ma" : "Yo"}
            </text>
            <text x={cx[key]} y={cy + 44} textAnchor="middle" fill={INK_SECONDARY} fontSize="11" fontWeight={500}>
              {cat.threshold}
            </text>
          </g>
        );
      })}

      <text x={280} y={24} textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight={500}>
        Click a bead to see its classical threshold
      </text>
    </svg>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem", boxShadow: SHADOW }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 600 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function buttonStyle(active: boolean): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    border: `1px solid ${active ? BLUE : HAIRLINE}`,
    borderRadius: 8,
    background: active ? BLUE : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.55rem 0.75rem",
    fontWeight: 500,
    cursor: "pointer",
  };
}

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.45rem 0.65rem",
    fontWeight: 500,
    cursor: "pointer",
  };
}

function categoryChipStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "grid",
    gap: "0.15rem",
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}14` : SURFACE,
    color: active ? color : INK_SECONDARY,
    padding: "0.55rem",
    fontWeight: 500,
    cursor: "pointer",
  };
}

function scopeChipStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "grid",
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}14` : SURFACE,
    color: active ? color : INK_SECONDARY,
    padding: "0.65rem",
    cursor: "pointer",
  };
}

function pathNodeStyle(active: boolean, color: string): CSSProperties {
  return {
    position: "relative",
    display: "grid",
    gap: "0.2rem",
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}12` : SURFACE,
    padding: "0.75rem",
    cursor: "pointer",
  };
}

const panelStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  boxShadow: SHADOW,
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: INK_MUTED,
  fontSize: "0.76rem",
  fontWeight: 600,
};
