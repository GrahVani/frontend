"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import {
  BookOpen,
  Calculator,
  CheckCircle2,
  ChevronRight,
  ListChecks,
  Plus,
  RotateCcw,
  ShieldAlert,
  Table2,
  Trash2,
} from "lucide-react";
import {
  computeCandidate,
  evaluateCandidateCompatibility,
  compatibilityLabel,
  computeMulanka,
  computePersonalBhagyanka,
  GRAHA_FRIENDSHIP_TABLE,
  COMMON_VARIATION_PATTERNS,
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

const SYSTEMS: { key: NumerologySystem; label: string }[] = [
  { key: "chaldean", label: "Chaldean" },
  { key: "pythagorean", label: "Pythagorean" },
  { key: "vedic-hybrid", label: "Vedic-Chaldean hybrid" },
];

export function NameCorrectionCandidateCalculator() {
  const [activeTab, setActiveTab] = useState<TabKey>("calculator");
  const [resetKey, setResetKey] = useState(0);

  const handleReset = () => {
    setResetKey((k) => k + 1);
    setActiveTab("calculator");
  };

  return (
    <div data-interactive="name-correction-candidate-calculator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Lesson 21.4.2 — Name-Correction Computation</p>
            <h2 style={{ margin: "0.2rem 0 0", color: TEAL, fontSize: "1.35rem" }}>
              Name-Correction Candidate Calculator
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 780 }}>
              Compute current + candidate Name-Numbers, compare graha-compatibility with Mūlāṅka / Bhāgyāṅka,
              and generate discipline-compliant presentation framing.
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
              fontWeight: 400,
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
  const [system, setSystem] = useState<NumerologySystem>("vedic-hybrid");
  const [convention, setConvention] = useState<Convention>("flexible");
  const [currentName, setCurrentName] = useState<string>("Priya Devi");
  const [candidates, setCandidates] = useState<string[]>(["Priya Sharma", "Pria Sharma"]);
  const [newCandidate, setNewCandidate] = useState<string>("");
  const [birthDay, setBirthDay] = useState<string>("15");
  const [birthMonth, setBirthMonth] = useState<string>("8");
  const [birthYear, setBirthYear] = useState<string>("1990");
  const [showPresentation, setShowPresentation] = useState(false);

  const dayNum = parseInt(birthDay, 10);
  const monthNum = parseInt(birthMonth, 10);
  const yearNum = parseInt(birthYear, 10);

  const birthDateValid =
    !Number.isNaN(dayNum) && dayNum >= 1 && dayNum <= 31 &&
    !Number.isNaN(monthNum) && monthNum >= 1 && monthNum <= 12 &&
    !Number.isNaN(yearNum) && yearNum >= 1000 && yearNum <= 9999;

  const mulanka = birthDateValid ? computeMulanka(dayNum) : null;
  const bhagyanka = birthDateValid ? computePersonalBhagyanka(dayNum, monthNum, yearNum, convention) : null;

  const currentResult = computeCandidate(currentName, system, convention);
  const candidateResults = candidates
    .map((name) => ({ name, result: computeCandidate(name, system, convention) }))
    .filter((item): item is { name: string; result: NonNullable<typeof item.result> } => item.result !== null);

  const addCandidate = () => {
    if (newCandidate.trim()) {
      setCandidates((prev) => [...prev, newCandidate.trim()]);
      setNewCandidate("");
    }
  };

  const removeCandidate = (idx: number) => {
    setCandidates((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <section style={{ display: "grid", gap: "0.85rem" }}>
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", display: "grid", gap: "0.75rem" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "end" }}>
          <div style={{ display: "grid", gap: "0.35rem", flex: 1, minWidth: 200 }}>
            <label style={{ fontSize: "0.78rem", fontWeight: 400, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>Current name</label>
            <input type="text" value={currentName} onChange={(e) => setCurrentName(e.target.value)} placeholder="e.g., Priya Devi" style={{ ...inputStyle, width: "100%" }} />
          </div>

          <div style={{ display: "grid", gap: "0.35rem" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 400, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>System</span>
            <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
              {SYSTEMS.map((s) => (
                <button key={s.key} type="button" onClick={() => setSystem(s.key)} style={{ ...buttonStyle(system === s.key, TEAL), fontSize: "0.82rem" }}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gap: "0.35rem" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 400, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>Convention</span>
            <div style={{ display: "flex", gap: "0.35rem" }}>
              <button type="button" onClick={() => setConvention("strict")} style={{ ...buttonStyle(convention === "strict", PURPLE), fontSize: "0.82rem" }}>Strict</button>
              <button type="button" onClick={() => setConvention("flexible")} style={{ ...buttonStyle(convention === "flexible", BLUE), fontSize: "0.82rem" }}>Flexible</button>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "end" }}>
          <div style={{ display: "grid", gap: "0.35rem" }}>
            <label style={{ fontSize: "0.78rem", fontWeight: 400, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>Birth day</label>
            <input type="number" min={1} max={31} value={birthDay} onChange={(e) => setBirthDay(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ display: "grid", gap: "0.35rem" }}>
            <label style={{ fontSize: "0.78rem", fontWeight: 400, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>Birth month</label>
            <input type="number" min={1} max={12} value={birthMonth} onChange={(e) => setBirthMonth(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ display: "grid", gap: "0.35rem" }}>
            <label style={{ fontSize: "0.78rem", fontWeight: 400, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>Birth year</label>
            <input type="number" min={1000} max={9999} value={birthYear} onChange={(e) => setBirthYear(e.target.value)} style={{ ...inputStyle, width: 100 }} />
          </div>
        </div>

        {!birthDateValid && (
          <div style={{ color: VERMILION, fontSize: "0.85rem", fontWeight: 400 }}>
            Enter a valid birth-date to enable Mūlāṅka / Bhāgyāṅka compatibility comparison.
          </div>
        )}
      </div>

      {currentResult && (
        <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", display: "grid", gap: "0.5rem" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 400, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>Step 1 — Current Name-Number</div>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ fontSize: "1.2rem", fontWeight: 400, color: INK_PRIMARY }}>{currentName}</div>
            <div style={{ border: `1px solid ${BLUE}33`, borderRadius: 8, background: `${BLUE}0A`, padding: "0.5rem 0.7rem" }}>
              <div style={{ fontSize: "0.68rem", color: BLUE, fontWeight: 400, textTransform: "uppercase", letterSpacing: "0.06em" }}>Name-Number</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 400, color: BLUE }}>{currentResult.finalResult}</div>
            </div>
            <div style={{ border: `1px solid ${GOLD}44`, borderRadius: 8, background: `${GOLD}0A`, padding: "0.5rem 0.7rem" }}>
              <div style={{ fontSize: "0.68rem", color: GOLD, fontWeight: 400, textTransform: "uppercase", letterSpacing: "0.06em" }}>Register</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 400, color: GOLD }}>{currentResult.registerName}</div>
            </div>
          </div>
        </div>
      )}

      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", display: "grid", gap: "0.75rem" }}>
        <div style={{ fontSize: "0.85rem", fontWeight: 400, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>Step 3 — Spelling-variation candidates</div>

        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {candidates.map((c, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.35rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.35rem 0.6rem", background: SURFACE }}>
              <span style={{ fontWeight: 400, color: INK_PRIMARY, fontSize: "0.9rem" }}>{c}</span>
              <button type="button" onClick={() => removeCandidate(i)} style={{ ...iconButtonStyle, color: VERMILION }} aria-label={`Remove ${c}`}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "end" }}>
          <input
            type="text"
            value={newCandidate}
            onChange={(e) => setNewCandidate(e.target.value)}
            placeholder="Add a candidate spelling"
            style={{ ...inputStyle, minWidth: 200 }}
            onKeyDown={(e) => { if (e.key === "Enter") addCandidate(); }}
          />
          <button type="button" onClick={addCandidate} style={buttonStyle(true, GREEN)}>
            <Plus size={14} aria-hidden="true" />
            Add
          </button>
        </div>
      </div>

      {candidateResults.length > 0 && (
        <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", display: "grid", gap: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <Table2 size={18} color={TEAL} />
            <span style={{ fontWeight: 400, color: TEAL, fontSize: "1rem" }}>Step 4 — Candidate comparison table</span>
          </div>

          <div style={{ display: "grid", gap: "0.45rem" }}>
            {candidateResults.map((item, i) => {
              const compat = evaluateCandidateCompatibility(item.result, mulanka, bhagyanka);
              return (
                <div
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 80px 120px 1fr",
                    gap: "0.75rem",
                    alignItems: "center",
                    padding: "0.6rem 0.75rem",
                    border: `1px solid ${HAIRLINE}`,
                    borderRadius: 8,
                    background: SURFACE,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 400, color: INK_PRIMARY, fontSize: "0.95rem" }}>{item.name}</div>
                    <div style={{ fontSize: "0.78rem", color: INK_MUTED }}>Sum: {item.result.totalSum}</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "1.4rem", fontWeight: 400, color: BLUE }}>{item.result.finalResult}</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 400, color: GOLD, fontSize: "0.9rem" }}>{item.result.registerName}</div>
                    <div style={{ fontSize: "0.75rem", color: INK_MUTED }}>{item.result.registerDetail}</div>
                  </div>
                  <div style={{ fontSize: "0.82rem", color: INK_SECONDARY, lineHeight: 1.4 }}>
                    {compat.withMulanka === "friend" && compat.withBhagyanka === "friend" ? (
                      <span style={{ color: GREEN, fontWeight: 400 }}>MITRA with both</span>
                    ) : compat.withMulanka === "enemy" || compat.withBhagyanka === "enemy" ? (
                      <span style={{ color: VERMILION, fontWeight: 400 }}>SHATRU with at least one</span>
                    ) : (
                      <span style={{ color: GOLD, fontWeight: 400 }}>SAMA / mixed</span>
                    )}
                    <br />
                    {compatibilityLabel(compat)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <button type="button" onClick={() => setShowPresentation(true)} style={buttonStyle(true, TEAL)}>
          <CheckCircle2 size={14} aria-hidden="true" />
          Generate discipline-compliant presentation
        </button>
      </div>

      {showPresentation && (
        <div style={{ border: `1px solid ${GREEN}44`, borderRadius: 8, background: `${GREEN}0A`, padding: "1rem", display: "grid", gap: "0.6rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <CheckCircle2 size={18} color={GREEN} />
            <span style={{ fontWeight: 400, color: GREEN, fontSize: "1rem" }}>Step 6 — Discipline-compliant presentation template</span>
          </div>
          <p style={{ margin: 0, color: INK_PRIMARY, lineHeight: 1.6, fontSize: "0.9rem" }}>
            "Here are the candidate spellings and the Name-Number each produces under the {systemShortLabel(system)} system
            ({convention} convention):"
          </p>
          <ul style={{ margin: 0, paddingLeft: "1.2rem", color: INK_SECONDARY, lineHeight: 1.6, fontSize: "0.88rem" }}>
            {candidateResults.map((item, i) => (
              <li key={i}>
                {item.name} {"->"} Name-Number {item.result.finalResult} ({item.result.registerName} register)
              </li>
            ))}
          </ul>
          <p style={{ margin: 0, color: INK_PRIMARY, lineHeight: 1.6, fontSize: "0.9rem" }}>
            "Graha-compatibility with your Mūlāṅka / Bhāgyāṅka is chart-context information, NOT a life-outcome determinant.
            The register-shift is one ambient-context input among many. Which spelling you choose is your decision —
            pick the one that is phonetically, culturally, and documentarily acceptable to you."
          </p>

          <div style={{ border: `1px solid ${VERMILION}44`, borderRadius: 8, background: `${VERMILION}0A`, padding: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <ShieldAlert size={16} color={VERMILION} />
              <span style={{ fontWeight: 400, color: VERMILION, fontSize: "0.9rem" }}>Refuse deterministic framing</span>
            </div>
            <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
              Refuse *this Name-Number will improve your luck / career / marriage* framings. Name-Number is one input; life-outcomes are multifactorial.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

/* ───────────────────────── Tables Tab ───────────────────────── */

function TablesTab() {
  return (
    <section style={{ display: "grid", gap: "0.85rem" }}>
      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", display: "grid", gap: "0.6rem" }}>
        <h3 style={{ margin: 0, color: TEAL, fontSize: "1.05rem" }}>Classical Parāśari graha-friendship table</h3>
        <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.85rem" }}>
          Used in Step 2 to assess MITRA (friend), SHATRU (enemy), or SAMA (neutral) relationship between candidate Name-Number and Mūlāṅka / Bhāgyāṅka.
        </p>
        <div style={{ display: "grid", gap: "0.35rem" }}>
          {GRAHA_FRIENDSHIP_TABLE.map((row) => (
            <div key={row.digit} style={{ display: "grid", gridTemplateColumns: "80px 1fr 1fr 1fr", gap: "0.5rem", padding: "0.5rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, fontSize: "0.85rem" }}>
              <div style={{ fontWeight: 400, color: INK_PRIMARY }}>{row.digit} — {row.graha}</div>
              <div><span style={{ color: GREEN }}>Friends:</span> <span style={{ color: INK_SECONDARY }}>{row.friends}</span></div>
              <div><span style={{ color: VERMILION }}>Enemies:</span> <span style={{ color: INK_SECONDARY }}>{row.enemies}</span></div>
              <div><span style={{ color: GOLD }}>Neutral:</span> <span style={{ color: INK_SECONDARY }}>{row.neutral}</span></div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", display: "grid", gap: "0.6rem" }}>
        <h3 style={{ margin: 0, color: TEAL, fontSize: "1.05rem" }}>Phonetic-preserving variation patterns</h3>
        <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.85rem" }}>Step 3 constraint: candidates must preserve phonetic-identity of the original name.</p>
        <div style={{ display: "grid", gap: "0.35rem" }}>
          {COMMON_VARIATION_PATTERNS.map((p, i) => (
            <div key={i} style={{ padding: "0.5rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE }}>
              <div style={{ fontWeight: 400, color: INK_PRIMARY, fontSize: "0.9rem" }}>{p.pattern}</div>
              <div style={{ fontSize: "0.82rem", color: INK_SECONDARY }}>{p.examples}</div>
            </div>
          ))}
        </div>
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
          <span style={{ fontWeight: 400, color: TEAL, fontSize: "1rem" }}>Worked examples</span>
        </div>
        <p style={{ margin: "0.3rem 0 0", color: INK_SECONDARY, lineHeight: 1.5, fontSize: "0.88rem" }}>
          Pre-configured name-correction scenarios covering marriage choice, candidate generation, and cross-system difference.
        </p>
      </div>

      {WORKED_EXAMPLES.map((ex) => (
        <article key={ex.id} style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", display: "grid", gap: "0.55rem" }}>
          <div style={{ fontWeight: 400, color: INK_PRIMARY, fontSize: "1rem" }}>{ex.label}</div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <div style={{ border: `1px solid ${BLUE}33`, borderRadius: 8, background: `${BLUE}0A`, padding: "0.5rem 0.7rem" }}>
              <div style={{ fontSize: "0.68rem", color: BLUE, fontWeight: 400, textTransform: "uppercase", letterSpacing: "0.06em" }}>Current</div>
              <div style={{ fontSize: "0.95rem", fontWeight: 400, color: BLUE }}>{ex.currentName}</div>
            </div>
            <div style={{ border: `1px solid ${TEAL}33`, borderRadius: 8, background: `${TEAL}0A`, padding: "0.5rem 0.7rem" }}>
              <div style={{ fontSize: "0.68rem", color: TEAL, fontWeight: 400, textTransform: "uppercase", letterSpacing: "0.06em" }}>System</div>
              <div style={{ fontSize: "0.95rem", fontWeight: 400, color: TEAL }}>{systemShortLabel(ex.system)}</div>
            </div>
            <div style={{ border: `1px solid ${PURPLE}33`, borderRadius: 8, background: `${PURPLE}0A`, padding: "0.5rem 0.7rem" }}>
              <div style={{ fontSize: "0.68rem", color: PURPLE, fontWeight: 400, textTransform: "uppercase", letterSpacing: "0.06em" }}>Convention</div>
              <div style={{ fontSize: "0.95rem", fontWeight: 400, color: PURPLE, textTransform: "capitalize" }}>{ex.convention}</div>
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
        <span style={{ fontWeight: 400, color: TEAL, fontSize: "1rem" }}>Six-step name-correction computation workflow</span>
      </div>
      <div style={{ display: "grid", gap: "0.5rem" }}>
        {WORKFLOW_STEPS.map((step, i) => (
          <div key={i} style={{ display: "flex", gap: "0.6rem", alignItems: "flex-start", border: `1px solid ${HAIRLINE}`, borderRadius: 8, padding: "0.75rem", background: SURFACE }}>
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, borderRadius: "50%", background: TEAL, color: "#fff", fontWeight: 400, fontSize: "0.8rem", flexShrink: 0 }}>
              {i === 0 ? "P" : i}
            </span>
            <div>
              <div style={{ fontWeight: 400, color: INK_PRIMARY, fontSize: "0.95rem", marginBottom: "0.15rem" }}>{step.title}</div>
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
  { key: "tables", label: "Reference tables", icon: <Table2 size={16} /> },
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
    fontWeight: 400,
    cursor: "pointer",
  };
}

const iconButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0.25rem",
  border: "none",
  background: "transparent",
  cursor: "pointer",
};

const inputStyle: CSSProperties = {
  width: 80,
  padding: "0.55rem 0.7rem",
  borderRadius: 8,
  border: `1px solid ${HAIRLINE}`,
  background: SURFACE,
  color: INK_PRIMARY,
  fontSize: "1rem",
  fontWeight: 400,
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 400,
};
