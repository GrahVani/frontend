"use client";

import React, { useState, useMemo } from "react";
import { CheckCircle2, AlertTriangle, ShieldCheck, List, ClipboardList, Info, Sparkles, HelpCircle, XCircle } from "lucide-react";

const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const SLATE_BLUE = "#3b82f6";
const PURPLE = "#8b5cf6";
const AMBER = "#f59e0b";
const GREEN = "#10b981";
const RED = "#ef4444";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";

interface WorkflowStep {
  num: number;
  title: string;
  desc: string;
}

const STEPS: WorkflowStep[] = [
  { num: 1, title: "Identify Question", desc: "Formulate a clear area of concern: Marriage, Career Promotion, or Health." },
  { num: 2, title: "Compute Transits", desc: "Acquire planetary degrees and zodiac coordinates using the Astro Engine." },
  { num: 3, title: "Read from Moon", desc: "Evaluate the primary transit position from the natal Moon (Chandra Lagna)." },
  { num: 4, title: "Read from Lagna", desc: "Cross-check the transit position from the physical ascendant (Udaya Lagna)." },
  { num: 5, title: "Read from Kāraka", desc: "Verify transits to the specific planet signifying the matter (Venus for marriage, Sun for status)." },
  { num: 6, title: "Apply Vedha Rules", desc: "Check if another planet sits in the designated obstruction-point, nullifying the transit." },
  { num: 7, title: "Cross-Reference Dasha", desc: "Confirm if the active Vimshottari Dasha or Bhukti lord promises this event theme." },
  { num: 8, title: "Apply Two-Yes", desc: "Synthesize. Require at least two independent indicators and dasha trigger before predicting." }
];

export function TransitWorkflowWorkbench() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [question, setQuestion] = useState<"Marriage" | "Career" | "Custom">("Marriage");
  
  // Reference checklist values
  const [moonFavorable, setMoonFavorable] = useState<boolean>(true);
  const [lagnaFavorable, setLagnaFavorable] = useState<boolean>(true);
  const [karakaFavorable, setKarakaFavorable] = useState<boolean>(true);
  const [vedhaObstructed, setVedhaObstructed] = useState<boolean>(false);
  const [dashaTriggerMatches, setDashaTriggerMatches] = useState<boolean>(true);

  // Dynamic labels based on selected question topic
  const labels = useMemo(() => {
    if (question === "Marriage") {
      return {
        moonLabel: "Jupiter in 7th from Moon (+1)",
        moonDesc: "Favorable relationship transit relative to Chandra Lagna.",
        lagnaLabel: "Venus aspecting the natal 7th (+1)",
        lagnaDesc: "Cross-check physical 7H ascendant alignment.",
        karakaLabel: "Transit favorable to spouse-kāraka Venus (+1)",
        karakaDesc: "Ensure natal Venus receives auspicious transit aspects.",
        vedhaLabel: "Jupiter's 7H vedha obstructed? (12H occupied)",
        vedhaDesc: "Check if the 12th house from Moon has blocker occupants.",
        dashaLabel: "Venus Mahādaśā/Bhukti active (+1)",
        dashaDesc: "Verify spouse-kāraka is active in Vimshottari timeline."
      };
    } else if (question === "Career") {
      return {
        moonLabel: "Saturn in 3rd/6th/11th from Moon (+1)",
        moonDesc: "Favorable career transit relative to Chandra Lagna.",
        lagnaLabel: "Saturn in 10th from Lagna (+1)",
        lagnaDesc: "Cross-check professional 10H physical ascendant alignment.",
        karakaLabel: "Transit favorable to status-kāraka Sun (+1)",
        karakaDesc: "Ensure natal Sun receives positive transit aspects.",
        vedhaLabel: "Saturn transit obstructed? (vedha point occupied)",
        vedhaDesc: "Check if Saturn's designated vedha-point has blocker occupants.",
        dashaLabel: "Saturn Mahādaśā/Bhukti active (+1)",
        dashaDesc: "Verify career-significator is active in Vimshottari timeline."
      };
    } else {
      return {
        moonLabel: "Moon Reference Favorable (+1)",
        moonDesc: "Transit position relative to Moon is auspicious.",
        lagnaLabel: "Lagna Reference Favorable (+1)",
        lagnaDesc: "Transit position relative to Lagna is auspicious.",
        karakaLabel: "Kāraka Reference Favorable (+1)",
        karakaDesc: "Transit relative to relevant significator is auspicious.",
        vedhaLabel: "Transit obstructed by Vedha?",
        vedhaDesc: "Check if designated counter-house vedha-point is occupied.",
        dashaLabel: "Vimshottari trigger active (+1)",
        dashaDesc: "Verify active dasha/bhukti lord matches theme."
      };
    }
  }, [question]);

  // Quick preset loading matching the lesson worked example
  const loadPreset = (type: "marriage_worked" | "career_obstructed" | "reset") => {
    if (type === "marriage_worked") {
      setQuestion("Marriage");
      setMoonFavorable(true); // Jupiter in 7th from Moon (+1)
      setLagnaFavorable(true); // Venus aspecting 7H (+1)
      setKarakaFavorable(true); // Favorable transit to natal Venus (+1)
      setVedhaObstructed(false); // No blocker (+0)
      setDashaTriggerMatches(true); // Venus MD running (+1)
      setActiveStep(8);
    } else if (type === "career_obstructed") {
      setQuestion("Career");
      setMoonFavorable(true); // Favorable transit
      setLagnaFavorable(true); // Favorable transit
      setKarakaFavorable(false);
      setVedhaObstructed(true); // Obstructed by Vedha!
      setDashaTriggerMatches(true);
      setActiveStep(6);
    } else {
      setQuestion("Custom");
      setMoonFavorable(false);
      setLagnaFavorable(false);
      setKarakaFavorable(false);
      setVedhaObstructed(false);
      setDashaTriggerMatches(false);
      setActiveStep(1);
    }
  };

  // Compute Synthesized Verdict
  const verdict = useMemo(() => {
    const positiveCount = (moonFavorable ? 1 : 0) + (lagnaFavorable ? 1 : 0) + (karakaFavorable ? 1 : 0);
    
    if (vedhaObstructed) {
      return {
        status: "Nullified",
        color: AMBER,
        icon: <AlertTriangle size={18} />,
        headline: "Transit Benefits Blocked (Vedha Active)",
        desc: "Although the transiting planets occupy favorable sectors from the Moon/Lagna, an obstruction planet sits in the vedha-point, nullifying the transit benefits. The event will not activate."
      };
    }

    if (!dashaTriggerMatches) {
      return {
        status: "Background",
        color: INK_MUTED,
        icon: <Info size={18} />,
        headline: "Background Mood Only (No Dasha Support)",
        desc: "The transit indicators look highly favorable, but the running Vimshottari Dasha lord does not trigger this house or planet. The transit acts as a background mental state, not a concrete event."
      };
    }

    if (positiveCount >= 2) {
      return {
        status: "Two-Yes",
        color: GREEN,
        icon: <CheckCircle2 size={18} />,
        headline: "Verified Two-Yes Event Window!",
        desc: "High probability window! We have a matched Vimshottari dasha lord, no active vedha obstructions, and at least two positive transit reference triggers. Reassure the client."
      };
    }

    return {
      status: "Insufficient",
      color: RED,
      icon: <XCircle size={18} />,
      headline: "Insufficient Indicators",
      desc: "Fewer than two independent transit indicators support the question. Relying on a single transit point is classical over-prediction. Do not predict concrete success."
    };
  }, [moonFavorable, lagnaFavorable, karakaFavorable, vedhaObstructed, dashaTriggerMatches]);

  return (
    <div
      className="gl-surface-twilight-glass"
      style={{
        padding: "24px",
        borderRadius: "16px",
        background: "rgba(255, 253, 248, 0.75)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(156, 122, 47, 0.15)",
        boxShadow: "0 8px 32px rgba(72, 48, 16, 0.05)",
        fontFamily: "'Inter', sans-serif",
        color: INK_PRIMARY,
        maxWidth: "960px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "24px"
      }}
    >
      {/* Header */}
      <div>
        <h3 style={{ margin: 0, fontSize: "20px", fontWeight: 800, color: GOLD_DEEP }}>
          गोचरपठनतन्त्रसमन्वयः — Transit Workflow Workbench
        </h3>
        <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: INK_SECONDARY }}>
          Execute the Capstone 8-step transit workflow, applying references, checks, and dasha cross-validation.
        </p>
      </div>

      {/* Preset Loader shortcuts */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", borderBottom: "1px solid rgba(0,0,0,0.05)", paddingBottom: "12px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: INK_MUTED, alignSelf: "center" }}>Load Worked Presets:</span>
        <button onClick={() => loadPreset("marriage_worked")} style={{ padding: "4px 8px", fontSize: "10.5px", background: "rgba(16,185,129,0.08)", border: `1px solid ${GREEN}`, color: GREEN, borderRadius: "4px", cursor: "pointer", fontWeight: 700 }}>
          Will I marry in 2026? (Favorable)
        </button>
        <button onClick={() => loadPreset("career_obstructed")} style={{ padding: "4px 8px", fontSize: "10.5px", background: "rgba(245,158,11,0.08)", border: `1px solid ${AMBER}`, color: AMBER, borderRadius: "4px", cursor: "pointer", fontWeight: 700 }}>
          Will I get promoted? (Vedha Obstructed)
        </button>
        <button onClick={() => loadPreset("reset")} style={{ padding: "4px 8px", fontSize: "10.5px", background: "#f1f5f9", border: "1px solid #cbd5e1", color: INK_SECONDARY, borderRadius: "4px", cursor: "pointer", fontWeight: 700 }}>
          Reset custom
        </button>
      </div>

      {/* Main Grid Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
        
        {/* Left Column: Interactive 8-Step List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <label style={{ fontSize: "12.5px", fontWeight: 700, color: GOLD_DEEP, display: "block", marginBottom: "4px" }}>
            Eight-Step Workflow Checklist
          </label>
          {STEPS.map((s) => {
            const isActive = activeStep === s.num;
            return (
              <button
                key={s.num}
                onClick={() => setActiveStep(s.num)}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: isActive ? `1.8px solid ${GOLD_DEEP}` : "1px solid rgba(0,0,0,0.08)",
                  background: isActive ? "rgba(156,122,47,0.08)" : "#ffffff",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s ease"
                }}
              >
                <div style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: isActive ? GOLD_DEEP : "rgba(0,0,0,0.05)",
                  color: isActive ? "#ffffff" : INK_MUTED,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10.5px",
                  fontWeight: 800,
                  flexShrink: 0
                }}>
                  {s.num}
                </div>
                <div>
                  <div style={{ fontSize: "12px", fontWeight: 700, color: isActive ? GOLD_DEEP : INK_PRIMARY }}>{s.title}</div>
                  {isActive && <div style={{ fontSize: "10.5px", color: INK_SECONDARY, marginTop: "4px", lineHeight: "1.35" }}>{s.desc}</div>}
                </div>
              </button>
            );
          })}
        </div>

        {/* Center/Right Column: Configurator and Verdict Outcome */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* Active Step Configurator panel */}
          <div style={{ background: "#ffffff", padding: "16px", borderRadius: "12px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <h4 style={{ margin: "0 0 12px 0", fontSize: "13px", fontWeight: 700, color: GOLD_DEEP, display: "flex", alignItems: "center", gap: "6px" }}>
              <ClipboardList size={16} /> Config Step {activeStep} Inputs
            </h4>

            {activeStep === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: INK_SECONDARY }}>Select Predictive Query Topic:</span>
                <div style={{ display: "flex", gap: "6px" }}>
                  {["Marriage", "Career", "Custom"].map(q => (
                    <button
                      key={q}
                      onClick={() => setQuestion(q as "Marriage" | "Career" | "Custom")}
                      style={{
                        padding: "6px 12px",
                        fontSize: "11px",
                        fontWeight: 700,
                        borderRadius: "4px",
                        border: question === q ? `1.5px solid ${GOLD}` : "1px solid rgba(0,0,0,0.1)",
                        background: question === q ? "rgba(156,122,47,0.06)" : "#ffffff",
                        color: question === q ? GOLD_DEEP : INK_SECONDARY,
                        cursor: "pointer"
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div style={{ fontSize: "11.5px", color: INK_SECONDARY, lineHeight: "1.4" }}>
                <span>✨ Sidereal Lahiri Ephemeris cast via Astro Engine:</span>
                <ul style={{ margin: "4px 0 0 0", paddingLeft: "16px" }}>
                  <li>Saturn transit degree: 14° Capricorn</li>
                  <li>Jupiter transit degree: 23° Gemini</li>
                  <li>Venus transit degree: 12° Aries</li>
                </ul>
              </div>
            )}

            {activeStep === 3 && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: "11.5px", fontWeight: 700, color: INK_PRIMARY }}>{labels.moonLabel}:</span>
                  <span style={{ fontSize: "10.5px", color: INK_MUTED, display: "block" }}>{labels.moonDesc}</span>
                </div>
                <input type="checkbox" checked={moonFavorable} onChange={(e) => setMoonFavorable(e.target.checked)} style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: GOLD }} />
              </div>
            )}

            {activeStep === 4 && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: "11.5px", fontWeight: 700, color: INK_PRIMARY }}>{labels.lagnaLabel}:</span>
                  <span style={{ fontSize: "10.5px", color: INK_MUTED, display: "block" }}>{labels.lagnaDesc}</span>
                </div>
                <input type="checkbox" checked={lagnaFavorable} onChange={(e) => setLagnaFavorable(e.target.checked)} style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: GOLD }} />
              </div>
            )}

            {activeStep === 5 && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: "11.5px", fontWeight: 700, color: INK_PRIMARY }}>{labels.karakaLabel}:</span>
                  <span style={{ fontSize: "10.5px", color: INK_MUTED, display: "block" }}>{labels.karakaDesc}</span>
                </div>
                <input type="checkbox" checked={karakaFavorable} onChange={(e) => setKarakaFavorable(e.target.checked)} style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: GOLD }} />
              </div>
            )}

            {activeStep === 6 && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: "11.5px", fontWeight: 700, color: INK_PRIMARY }}>{labels.vedhaLabel}:</span>
                  <span style={{ fontSize: "10.5px", color: INK_MUTED, display: "block" }}>{labels.vedhaDesc}</span>
                </div>
                <input type="checkbox" checked={vedhaObstructed} onChange={(e) => setVedhaObstructed(e.target.checked)} style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: GOLD }} />
              </div>
            )}

            {activeStep === 7 && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: "11.5px", fontWeight: 700, color: INK_PRIMARY }}>{labels.dashaLabel}:</span>
                  <span style={{ fontSize: "10.5px", color: INK_MUTED, display: "block" }}>{labels.dashaDesc}</span>
                </div>
                <input type="checkbox" checked={dashaTriggerMatches} onChange={(e) => setDashaTriggerMatches(e.target.checked)} style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: GOLD }} />
              </div>
            )}

            {activeStep === 8 && (
              <div style={{ fontSize: "11.5px", color: INK_SECONDARY, lineHeight: "1.4" }}>
                <strong>Two-Yes Corroboration Checklist:</strong>
                <ul style={{ margin: "4px 0 0 0", paddingLeft: "16px", display: "flex", flexDirection: "column", gap: "4px" }}>
                  <li>{labels.moonLabel}? {moonFavorable ? "Yes (Favorable)" : "No"}</li>
                  <li>{labels.lagnaLabel}? {lagnaFavorable ? "Yes (Favorable)" : "No"}</li>
                  <li>{labels.karakaLabel}? {karakaFavorable ? "Yes (Favorable)" : "No"}</li>
                  <li>{labels.vedhaLabel}? {vedhaObstructed ? "Yes (Obstructed)" : "No (Clear)"}</li>
                  <li>{labels.dashaLabel}? {dashaTriggerMatches ? "Yes (Active)" : "No"}</li>
                </ul>
              </div>
            )}
          </div>

          {/* Predictive Engine Verdict Card */}
          <div style={{
            background: verdict.status === "Two-Yes" ? "rgba(16,185,129,0.04)" : verdict.status === "Nullified" ? "rgba(245,158,11,0.04)" : "rgba(239,68,68,0.04)",
            border: `1.5px solid ${verdict.color}`,
            borderRadius: "12px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "8px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: verdict.color }}>
              {verdict.status === "Two-Yes" ? <ShieldCheck size={18} /> : <AlertTriangle size={18} />}
              <h4 style={{ margin: 0, fontSize: "13.5px", fontWeight: 800 }}>
                {verdict.headline}
              </h4>
            </div>

            <p style={{ margin: 0, fontSize: "12.5px", lineHeight: "1.45", color: INK_SECONDARY }}>
              {verdict.desc}
            </p>

            <div style={{ borderTop: "1px dashed rgba(0,0,0,0.05)", paddingTop: "8px", marginTop: "4px", fontSize: "10.5px", color: INK_MUTED }}>
              <strong>Topic:</strong> {question} Query | <strong>References matched:</strong> {(moonFavorable ? 1 : 0) + (lagnaFavorable ? 1 : 0) + (karakaFavorable ? 1 : 0)} / 3
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}


