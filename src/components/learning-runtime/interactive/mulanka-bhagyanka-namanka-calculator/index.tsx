"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  BookOpen,
  Calculator,
  CheckCircle2,
  ChevronRight,
  Grid3X3,
  ListChecks,
  RotateCcw,
  ShieldAlert,
} from "lucide-react";
import {
  computeNameNumber,
  computePythagoreanFourNumbers,
  getRegister,
  getNameResultForConvention,
  SYSTEMS,
  CHALDEAN_GROUPS,
  PYTHAGOREAN_GROUPS,
  WORKED_EXAMPLES,
  WORKFLOW_STEPS,
  systemShortLabel,
  type NumerologySystem,
  type Convention,
} from "./data";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const PURPLE = "#6B4C8C";
const TEAL = "#2E7D7B";

export function MulankaBhagyankaNamankaCalculator() {
  const [activeTab, setActiveTab] = useState<TabKey>("calculator");
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setResetKey((k) => k + 1);
    setActiveTab("calculator");
  };

  return (
    <div data-interactive="mulanka-bhagyanka-namanka-calculator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Lesson 21.3.3 — Name-Number (Nāmāṅka) Computation</p>
            <h2 style={{ margin: "0.2rem 0 0", color: TEAL, fontSize: "1.35rem" }}>
              Three-System Name-Number Calculator
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 780 }}>
              Compute Name-Number in Chaldean, Pythagorean, or Vedic-Chaldean hybrid. See letter-by-letter values,
              reduction steps, graha-aṅka register, caveats, and (for Pythagorean) the four-number framework.
            </p>
          </div>
          <button type="button" onClick={handleReset} style={buttonStyle(false, BLUE)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            aria-pressed={activeTab === tab.key}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              border: `1px solid ${activeTab === tab.key ? TEAL : HAIRLINE}`,
              borderRadius: 8,
              background: activeTab === tab.key ? TEAL : "transparent",
              color: activeTab === tab.key ? "#fff" : INK_SECONDARY,
              padding: "0.52rem 0.85rem",
              fontWeight: 850,
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div key={resetKey}>
        {activeTab === "calculator" && <CalculatorTab />}
        {activeTab === "tables" && <TablesTab />}
        {activeTab === "examples" && <ExamplesTab />}
        {activeTab === "workflow" && <WorkflowTab />}
      </div>
    </div>
  );
}

/* ───────────────────────── Calculator Tab ───────────────────────── */

function CalculatorTab() {
  const [name, setName] = useState<string>("Priya Sharma");
  const [system, setSystem] = useState<NumerologySystem>("chaldean");
  const [convention, setConvention] = useState<Convention>("flexible");
  const [showFourNumbers, setShowFourNumbers] = useState(false);
  const [day, setDay] = useState<string>("15");
  const [month, setMonth] = useState<string>("8");
  const [year, setYear] = useState<string>("1990");

  const result = computeNameNumber(name, system, convention);
  const finalResult = getNameResultForConvention(result, convention);
  const register = finalResult !== null ? getRegister(finalResult) : null;

  const dayNum = parseInt(day, 10);
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);

  const fourNumbers =
    system === "pythagorean" && showFourNumbers
      ? computePythagoreanFourNumbers(name, dayNum || null, monthNum || null, yearNum || null, convention)
      : null;

  const hasLetters = result.values.length > 0;

  return (
    <section style={{ display: "grid", gap: "0.85rem" }}>
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", display: "grid", gap: "0.75rem" }}>
        <div style={{ display: "grid", gap: "0.35rem" }}>
          <label style={{ fontSize: "0.78rem", fontWeight: 900, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter first, middle, last name"
            style={{ ...inputStyle, width: "100%", maxWidth: 420 }}
          />
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "end" }}>
          <div style={{ display: "grid", gap: "0.35rem" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 900, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>System</span>
            <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
              {SYSTEMS.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setSystem(s.key)}
                  style={{ ...buttonStyle(system === s.key, TEAL), fontSize: "0.82rem" }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gap: "0.35rem" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 900, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>Convention</span>
            <div style={{ display: "flex", gap: "0.35rem" }}>
              <button type="button" onClick={() => setConvention("strict")} style={{ ...buttonStyle(convention === "strict", PURPLE), fontSize: "0.82rem" }}>
                Strict (preserve)
              </button>
              <button type="button" onClick={() => setConvention("flexible")} style={{ ...buttonStyle(convention === "flexible", BLUE), fontSize: "0.82rem" }}>
                Flexible (reduce)
              </button>
            </div>
          </div>
        </div>

        {system === "pythagorean" && (
          <div style={{ display: "grid", gap: "0.35rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input
                id="show-four"
                type="checkbox"
                checked={showFourNumbers}
                onChange={(e) => setShowFourNumbers(e.target.checked)}
                style={{ accentColor: TEAL, width: 16, height: 16 }}
              />
              <label htmlFor="show-four" style={{ fontSize: "0.9rem", color: INK_SECONDARY, cursor: "pointer" }}>
                Compute Pythagorean four-number framework (requires birth-date for Life Path)
              </label>
            </div>
            {showFourNumbers && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "end" }}>
                <div style={{ display: "grid", gap: "0.35rem" }}>
                  <label style={{ fontSize: "0.78rem", fontWeight: 900, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>Day</label>
                  <input type="number" min={1} max={31} value={day} onChange={(e) => setDay(e.target.value)} style={inputStyle} />
                </div>
                <div style={{ display: "grid", gap: "0.35rem" }}>
                  <label style={{ fontSize: "0.78rem", fontWeight: 900, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>Month</label>
                  <input type="number" min={1} max={12} value={month} onChange={(e) => setMonth(e.target.value)} style={inputStyle} />
                </div>
                <div style={{ display: "grid", gap: "0.35rem" }}>
                  <label style={{ fontSize: "0.78rem", fontWeight: 900, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>Year</label>
                  <input type="number" min={1000} max={9999} value={year} onChange={(e) => setYear(e.target.value)} style={{ ...inputStyle, width: 100 }} />
                </div>
              </div>
            )}
          </div>
        )}

        {!hasLetters && name.trim().length > 0 && (
          <div style={{ color: VERMILION, fontSize: "0.85rem", fontWeight: 850 }}>
            Enter at least one English letter to compute a Name-Number.
          </div>
        )}
      </div>

      {hasLetters && finalResult !== null && register && (
        <>
          <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", display: "grid", gap: "0.6rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <Calculator size={18} color={TEAL} />
              <span style={{ fontWeight: 950, color: TEAL, fontSize: "1rem" }}>Computation steps</span>
            </div>
            <div style={{ display: "grid", gap: "0.35rem" }}>
              {result.steps.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: "50%", background: `${TEAL}18`, color: TEAL, fontWeight: 950, fontSize: "0.72rem", flexShrink: 0, marginTop: 1 }}>
                    {i + 1}
                  </span>
                  <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.87rem" }}>{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem" }}>
            <div style={{ border: `1px solid ${convention === "strict" ? PURPLE : HAIRLINE}`, borderRadius: 8, background: convention === "strict" ? `${PURPLE}0A` : SURFACE, padding: "1rem", display: "grid", gap: "0.3rem" }}>
              <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: convention === "strict" ? PURPLE : INK_MUTED, fontWeight: 900 }}>Name-Number</div>
              <div style={{ fontSize: "2.2rem", fontWeight: 950, color: convention === "strict" ? PURPLE : BLUE, lineHeight: 1 }}>{finalResult}</div>
              <div style={{ fontSize: "0.85rem", color: INK_SECONDARY, fontWeight: 850 }}>{systemShortLabel(system)} — {convention === "strict" ? "Strict preservation" : "Flexibility (reduce)"}</div>
            </div>

            <div style={{ border: `1px solid ${GOLD}44`, borderRadius: 8, background: `${GOLD}0A`, padding: "1rem", display: "grid", gap: "0.3rem" }}>
              <div style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: GOLD, fontWeight: 900 }}>Graha-aṅka register</div>
              <div style={{ fontSize: "1.35rem", fontWeight: 950, color: GOLD, lineHeight: 1.2 }}>
                {"graha" in register ? register.graha : register.baseGraha}
              </div>
              <div style={{ fontSize: "0.85rem", color: INK_SECONDARY }}>
                {"graha" in register ? `Digit ${register.digit}` : `Master ${register.master} intensifies ${register.baseGraha}`}
              </div>
            </div>
          </div>

          {fourNumbers && (
            <div style={{ border: `1px solid ${TEAL}44`, borderRadius: 8, background: `${TEAL}0A`, padding: "1rem", display: "grid", gap: "0.6rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <Grid3X3 size={18} color={TEAL} />
                <span style={{ fontWeight: 950, color: TEAL, fontSize: "1rem" }}>Pythagorean four-number framework</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.6rem" }}>
                <NumberPill label="Expression" value={fourNumbers.expression} color={BLUE} />
                <NumberPill label="Soul Urge" value={fourNumbers.soulUrge} color={PURPLE} />
                <NumberPill label="Personality" value={fourNumbers.personality} color={GOLD} />
                <NumberPill label="Life Path" value={fourNumbers.lifePath} color={GREEN} />
              </div>
              <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.82rem", lineHeight: 1.5 }}>
                Vowels = A, E, I, O, U. Y is treated as consonant per Decoz convention.
                Life Path equals Bhāgyāṅka of the full birth-date.
              </p>
            </div>
          )}

          {"caveat" in register && register.caveat && (
            <div style={{ border: `1px solid ${VERMILION}44`, borderRadius: 8, background: `${VERMILION}0A`, padding: "0.85rem", display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
              <ShieldAlert size={18} color={VERMILION} style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.85rem" }}>
                <strong style={{ color: VERMILION }}>Caveat:</strong> {register.caveat}
              </p>
            </div>
          )}

          <div style={{ border: `1px solid ${VERMILION}44`, borderRadius: 8, background: `${VERMILION}0A`, padding: "0.85rem", display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
            <ShieldAlert size={18} color={VERMILION} style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.85rem" }}>
              <strong style={{ color: VERMILION }}>Name-change discipline:</strong> Name-Number is the only personal-number changeable by name-change, but legal name-change is a major-life-decision requiring convergent independent grounds (marriage, legal recognition, aesthetic preference, etc.), never single-numerology-framing alone.
            </p>
          </div>

          <div style={{ border: `1px solid ${GREEN}44`, borderRadius: 8, background: `${GREEN}0A`, padding: "0.85rem", display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
            <CheckCircle2 size={18} color={GREEN} style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.85rem" }}>
              <strong style={{ color: GREEN }}>System-dependence note:</strong> Name-Number differs across systems because each uses a different letter-table. Mūlāṅka and Bhāgyāṅka are birth-date-derived and identical across systems. Pick one system + one name-form and apply consistently per Lesson 21.1.4.
            </p>
          </div>
        </>
      )}
    </section>
  );
}

function NumberPill({ label, value, color }: { label: string; value: number | null; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}0A`, padding: "0.6rem", display: "grid", gap: "0.15rem" }}>
      <div style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.06em", color, fontWeight: 900 }}>{label}</div>
      <div style={{ fontSize: "1.5rem", fontWeight: 950, color, lineHeight: 1 }}>{value ?? "—"}</div>
    </div>
  );
}

/* ───────────────────────── Tables Tab ───────────────────────── */

function TablesTab() {
  return (
    <section style={{ display: "grid", gap: "0.85rem" }}>
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", display: "grid", gap: "0.6rem" }}>
        <h3 style={{ margin: 0, color: TEAL, fontSize: "1.05rem" }}>Chaldean letter-table</h3>
        <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.85rem" }}>Irregular vibrational grouping. Value 9 is reserved-sacred; no letter carries 9.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.5rem" }}>
          {CHALDEAN_GROUPS.map((g) => (
            <div key={g.value} style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.6rem", background: SURFACE }}>
              <div style={{ fontSize: "1.3rem", fontWeight: 950, color: BLUE }}>{g.value}</div>
              <div style={{ fontSize: "0.82rem", color: INK_SECONDARY }}>{g.letters}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", display: "grid", gap: "0.6rem" }}>
        <h3 style={{ margin: 0, color: TEAL, fontSize: "1.05rem" }}>Pythagorean letter-table</h3>
        <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.85rem" }}>Sequential A=1, B=2, ..., I=9, J=1, K=2, ..., Z=8. All values 1-9 assigned.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.5rem" }}>
          {PYTHAGOREAN_GROUPS.map((g) => (
            <div key={g.value} style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.6rem", background: SURFACE }}>
              <div style={{ fontSize: "1.3rem", fontWeight: 950, color: PURPLE }}>{g.value}</div>
              <div style={{ fontSize: "0.82rem", color: INK_SECONDARY }}>{g.letters}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ border: `1px solid ${GREEN}44`, borderRadius: 8, background: `${GREEN}0A`, padding: "0.85rem" }}>
        <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.85rem" }}>
          <strong style={{ color: GREEN }}>Vedic note:</strong> Pure Vedic Devanāgarī-syllable values vary by recension. For Romanised English names, the Vedic-Chaldean hybrid uses the Chaldean table above for computation and Vedic graha-aṅka vocabulary (1=Sūrya ... 9=Maṅgala) for interpretation.
        </p>
      </div>
    </section>
  );
}

/* ───────────────────────── Examples Tab ───────────────────────── */

function ExamplesTab() {
  return (
    <section style={{ display: "grid", gap: "0.75rem" }}>
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <BookOpen size={18} color={TEAL} />
          <span style={{ fontWeight: 950, color: TEAL, fontSize: "1rem" }}>Worked examples</span>
        </div>
        <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.88rem" }}>
          Same names computed across systems to show system-dependence.
        </p>
      </div>

      {WORKED_EXAMPLES.map((ex) => (
        <article key={ex.id} style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", display: "grid", gap: "0.55rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <div style={{ fontWeight: 950, color: INK_PRIMARY, fontSize: "1rem" }}>
              {ex.label}
            </div>
            <div style={{ fontSize: "0.78rem", color: INK_MUTED, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              {systemShortLabel(ex.system)}
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <div style={{ border: `1px solid ${PURPLE}33`, borderRadius: 8, background: `${PURPLE}0A`, padding: "0.5rem 0.7rem" }}>
              <div style={{ fontSize: "0.68rem", color: PURPLE, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em" }}>Strict</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 950, color: PURPLE }}>{ex.strictResult}</div>
            </div>
            <div style={{ border: `1px solid ${BLUE}33`, borderRadius: 8, background: `${BLUE}0A`, padding: "0.5rem 0.7rem" }}>
              <div style={{ fontSize: "0.68rem", color: BLUE, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em" }}>Flexible</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 950, color: BLUE }}>{ex.flexibleResult}</div>
            </div>
            <div style={{ border: `1px solid ${GOLD}44`, borderRadius: 8, background: `${GOLD}0A`, padding: "0.5rem 0.7rem", flex: 1, minWidth: 160 }}>
              <div style={{ fontSize: "0.68rem", color: GOLD, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em" }}>Register</div>
              <div style={{ fontSize: "0.95rem", fontWeight: 950, color: GOLD }}>{ex.register}</div>
            </div>
          </div>

          <div style={{ display: "grid", gap: "0.3rem" }}>
            {ex.notes.map((note, i) => (
              <div key={i} style={{ display: "flex", gap: "0.4rem", alignItems: "flex-start" }}>
                <ChevronRight size={14} color={TEAL} style={{ flexShrink: 0, marginTop: 3 }} />
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.45, fontSize: "0.84rem" }}>{note}</p>
              </div>
            ))}
          </div>
        </article>
      ))}
    </section>
  );
}

/* ───────────────────────── Workflow Tab ───────────────────────── */

function WorkflowTab() {
  return (
    <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", display: "grid", gap: "0.75rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
        <ListChecks size={18} color={TEAL} />
        <span style={{ fontWeight: 950, color: TEAL, fontSize: "1rem" }}>Discipline-compliant Name-Number reading workflow</span>
      </div>
      <div style={{ display: "grid", gap: "0.5rem" }}>
        {WORKFLOW_STEPS.map((step, i) => (
          <div key={i} style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start", border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.75rem", background: SURFACE }}>
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, borderRadius: "50%", background: TEAL, color: "#fff", fontWeight: 950, fontSize: "0.8rem", flexShrink: 0 }}>
              {i + 1}
            </span>
            <div>
              <div style={{ fontWeight: 950, color: INK_PRIMARY, fontSize: "0.95rem", marginBottom: "0.15rem" }}>{step.title}</div>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.85rem" }}>{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────── Tabs ───────────────────────── */

type TabKey = "calculator" | "tables" | "examples" | "workflow";

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "calculator", label: "Calculator", icon: <Calculator size={16} /> },
  { key: "tables", label: "Letter tables", icon: <Grid3X3 size={16} /> },
  { key: "examples", label: "Examples", icon: <BookOpen size={16} /> },
  { key: "workflow", label: "Workflow", icon: <ListChecks size={16} /> },
];

/* ───────────────────────── Helpers ───────────────────────── */

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.52rem 0.68rem",
    fontWeight: 850,
    cursor: "pointer",
  };
}

const inputStyle: CSSProperties = {
  width: 80,
  padding: "0.55rem 0.7rem",
  borderRadius: 8,
  border: `1px solid ${HAIRLINE}`,
  background: SURFACE,
  color: INK_PRIMARY,
  fontSize: "1rem",
  fontWeight: 850,
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 900,
};
