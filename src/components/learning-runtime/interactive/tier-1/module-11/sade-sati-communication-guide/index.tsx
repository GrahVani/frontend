"use client";

import React, { useState } from "react";
import { User, MessageSquare, AlertTriangle, CheckCircle, ShieldAlert, Info, Ban } from "lucide-react";
import { IAST } from '@/components/learning-runtime/interactive/../chrome/typography';

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const GREEN = "#10b981";
const RED = "#f43f5e";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

interface ProtocolStep {
  stepNum: number;
  label: string;
  focus: string;
  phraseUse: string;
  phraseAvoid: string;
  reason: string;
}

const PROTOCOL_STEPS: ProtocolStep[] = [
  { stepNum: 1, label: "Acknowledge", focus: "Validate concerns honestly", phraseUse: "\"I hear that you feel anxious. Sāḍhe-Sātī is indeed a transit of intense demands. Let's analyze it calmly.\"", phraseAvoid: "\"Sāḍhe-Sātī is complete nonsense, there's nothing to worry about.\" OR \"You are right to fear it, it is ruinous.\"", reason: "Validating feelings builds trust while checking fatalism." },
  { stepNum: 2, label: "Identify", focus: "Pinpoint active phase & duration", phraseUse: "\"You are currently in the Mukhya phase, where Saturn transits directly over your Scorpio Moon, lasting until next year.\"", phraseAvoid: "\"You are in Sāḍhe-Sātī, so the next 7.5 years are a complete write-off.\"", reason: "Narrowing focus to the specific phase makes the challenge manageable." },
  { stepNum: 3, label: "Check", focus: "Surface positive conditions", phraseUse: "\"In your chart, Saturn is exalted in Libra natally, and Jupiter is aspecting the transit, which heavily mitigates these challenges.\"", phraseAvoid: "\"There is no relief, transit Saturn sits on your Moon and that means pure bad luck.\"", reason: "Most charts possess mitigating factors that lift the blanket sentence." },
  { stepNum: 4, label: "Frame", focus: "Karmic re-prioritisation", phraseUse: "\"This transit acts as a psychological sorting. It presses you to discard outworn structures and consolidate boundaries. It is deep maturation.\"", phraseAvoid: "\"Saturn is angry at your past karma and is actively punishing you.\"", reason: "Shifting from 'punishment' to 'structural correction' empowers the native." },
  { stepNum: 5, label: "Recommend", focus: "Supportive remedies", phraseUse: "\"I suggest reading the Hanuman Chālīsā on Saturdays, dedicating time to elderly care, and cultivating patient discipline.\"", phraseAvoid: "\"You must purchase a blue sapphire ring for 60,000 INR and pay for a grand cancellation ritual immediately.\"", reason: "Classical remedies are devotional practices. Exploitative selling violates ethics." },
  { stepNum: 6, label: "Avoid", focus: "Ban catastrophic predictions", phraseUse: "\"This is a demanding, slow-moving period that requires patience. Let's build a timeline to navigate it step-by-step.\"", phraseAvoid: "\"You will lose your job, your marriage will fall apart, and death is highly likely.\"", reason: "Catastrophic claims are unprovable, inaccurate, and inflict psychological trauma." }
];

const RED_FLAGS = [
  { icon: "💎", label: "Gem-selling pressure", desc: "Mandating expensive stones as 'required' for survival." },
  { icon: "🔥", label: "Catastrophic certainty", desc: "Claiming definite ruin, death, or divorce without nuance." },
  { icon: "💰", label: "Remedy up-selling", desc: "Escalating ritual costs based on client fear response." },
  { icon: "🚫", label: "Dismissing all hope", desc: "Stating there are zero mitigations or favourable factors." },
  { icon: "🧿", label: "Superstitious terror", desc: "Using planetary fear to control client behaviour." },
];

export function SadeSatiCommunicationGuide() {
  const [styleMode, setStyleMode] = useState<"bazaar" | "ethical">("ethical");
  const [activeStep, setActiveStep] = useState<number>(1);

  return (
    <div className="gl-surface-twilight-glass" style={{ padding: "20px", borderRadius: "16px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", boxShadow: "0 8px 32px rgba(72, 48, 16, 0.05)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "14px" }}>
      
      <div>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: GOLD_DEEP }}>
          <IAST>Naitika Nirūpaṇam</IAST> — Ethical Dialogue Lab
        </h3>
        <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: INK_SECONDARY }}>Practice the six-step honest-handling protocol for fear-laden transits.</p>
      </div>

      {/* ─── STYLE TOGGLE (TOP CONTROL) ─── */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={() => setStyleMode("bazaar")} style={{ flex: 1, padding: "10px", borderRadius: "8px", border: styleMode === "bazaar" ? `2px solid ${RED}` : "1px solid rgba(0,0,0,0.1)", background: styleMode === "bazaar" ? "rgba(244,63,94,0.06)" : "#ffffff", color: styleMode === "bazaar" ? RED : INK_SECONDARY, fontWeight: 700, fontSize: "12px", cursor: "pointer" }}>
          🚨 Bazaar / Fearmongering
        </button>
        <button onClick={() => setStyleMode("ethical")} style={{ flex: 1, padding: "10px", borderRadius: "8px", border: styleMode === "ethical" ? `2px solid ${GREEN}` : "1px solid rgba(0,0,0,0.1)", background: styleMode === "ethical" ? "rgba(16,185,129,0.06)" : "#ffffff", color: styleMode === "ethical" ? GREEN : INK_SECONDARY, fontWeight: 700, fontSize: "12px", cursor: "pointer" }}>
          🛡️ Ethical / Empowering
        </button>
      </div>

      {/* ─── MAIN SPLIT: METERS+RED FLAGS + PROTOCOL ─── */}
      <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
        
        {/* Left: Client preview + Red flags */}
        <div style={{ flex: "1 1 320px", display: "flex", flexDirection: "column", gap: "12px", minWidth: 0 }}>
          {/* Client Profile */}
          <div style={{ background: "#ffffff", padding: "12px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", gap: "10px", alignItems: "center" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "20px", background: "rgba(156,122,47,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: GOLD_DEEP }}><User size={18} /></div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: INK_PRIMARY }}>Client: Scorpio Moon, Mukhya Phase</div>
              <div style={{ fontSize: "10px", color: INK_MUTED }}>Career anxiety • Vulnerable to panic spend</div>
            </div>
          </div>

          {/* Dialogue Preview */}
          <div style={{ background: styleMode === "bazaar" ? "#fef2f2" : "#f0fdf4", border: `1px solid ${styleMode === "bazaar" ? "#fecaca" : "#bbf7d0"}`, padding: "14px", borderRadius: "8px", fontSize: "12px", lineHeight: "1.5", color: styleMode === "bazaar" ? "#7f1d1d" : "#14532d", fontStyle: "italic", minHeight: "80px" }}>
            {styleMode === "bazaar" ? (
              <div>"Your Sade-Sati is starting its peak. Transit Saturn is sitting right on your Scorpio Moon. This brings direct ruin to your career; you are highly likely to lose your job. To survive this, you must purchase a 60,000 INR blue sapphire and let us perform a grand ritual."</div>
            ) : (
              <div>"I understand you feel anxious about your job. You are currently in the middle phase of Sade-Sati, which brings significant structural demand. In your chart, however, your natal Saturn is strong, and we can work through this constructively. Focus on Saturday discipline, simple elderly charity, and patient boundary-setting."</div>
            )}
          </div>

          {/* Meters */}
          <div style={{ background: "#ffffff", padding: "12px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ fontSize: "10px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase" }}>Client Anxiety</span>
              <div style={{ fontSize: "16px", fontWeight: 800, color: styleMode === "bazaar" ? RED : GREEN, background: styleMode === "bazaar" ? "rgba(244,63,94,0.1)" : "rgba(16,185,129,0.1)", padding: "6px 14px", borderRadius: "16px", marginTop: "4px" }}>
                {styleMode === "bazaar" ? "🔴 Critical" : "🟢 Low"}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <span style={{ fontSize: "10px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase" }}>Empowerment</span>
              <div style={{ fontSize: "16px", fontWeight: 800, color: styleMode === "bazaar" ? RED : GOLD_DEEP, background: styleMode === "bazaar" ? "rgba(244,63,94,0.1)" : "rgba(156,122,47,0.1)", padding: "6px 14px", borderRadius: "16px", marginTop: "4px" }}>
                {styleMode === "bazaar" ? "⚠️ Low" : "🔥 High"}
              </div>
            </div>
          </div>

          {/* Red Flags */}
          <div style={{ background: "#ffffff", padding: "12px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)" }}>
            <h4 style={{ margin: "0 0 8px 0", fontSize: "12px", fontWeight: 700, color: RED, display: "flex", alignItems: "center", gap: "5px" }}>
              <Ban size={14} /> Red Flags to Reject
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
              {RED_FLAGS.map((rf, i) => (
                <div key={i} style={{ background: "#fef2f2", border: "1px solid #fecaca", padding: "6px", borderRadius: "6px" }}>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#991b1b" }}>{rf.icon} {rf.label}</div>
                  <div style={{ fontSize: "9px", color: "#7f1d1d" }}>{rf.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: 6-Step Protocol */}
        <div style={{ flex: "1 1 300px", background: "#ffffff", padding: "14px", borderRadius: "12px", border: "1px solid rgba(156,122,47,0.1)", minWidth: 0 }}>
          <h4 style={{ margin: "0 0 10px 0", fontSize: "13px", fontWeight: 700, color: GOLD_DEEP }}>The 6-Step Ethical Protocol</h4>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", borderBottom: "1.5px solid rgba(0,0,0,0.05)", paddingBottom: "8px" }}>
            {PROTOCOL_STEPS.map(s => (
              <button key={s.stepNum} onClick={() => setActiveStep(s.stepNum)} style={{ width: "26px", height: "26px", borderRadius: "13px", border: "none", background: activeStep === s.stepNum ? GOLD : "rgba(0,0,0,0.05)", color: activeStep === s.stepNum ? "#ffffff" : INK_SECONDARY, fontWeight: 800, fontSize: "10px", cursor: "pointer" }}>{s.stepNum}</button>
            ))}
          </div>
          {(() => {
            const step = PROTOCOL_STEPS[activeStep - 1];
            return (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "13px", fontWeight: 800, color: GOLD_DEEP }}>Step {step.stepNum}: {step.label}</span>
                  <span style={{ fontSize: "9px", color: INK_MUTED, fontWeight: 700 }}>{step.focus}</span>
                </div>
                <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "8px", borderRadius: "6px" }}>
                  <div style={{ fontSize: "9px", fontWeight: 700, color: "#166534", marginBottom: "2px", display: "flex", alignItems: "center", gap: "3px" }}><CheckCircle size={9} /> WHAT TO SAY:</div>
                  <div style={{ fontSize: "11px", color: "#14532d", fontStyle: "italic", lineHeight: "1.4" }}>{step.phraseUse}</div>
                </div>
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", padding: "8px", borderRadius: "6px" }}>
                  <div style={{ fontSize: "9px", fontWeight: 700, color: "#991b1b", marginBottom: "2px", display: "flex", alignItems: "center", gap: "3px" }}><ShieldAlert size={9} /> WHAT TO AVOID:</div>
                  <div style={{ fontSize: "11px", color: "#7f1d1d", fontStyle: "italic", lineHeight: "1.4" }}>{step.phraseAvoid}</div>
                </div>
                <div style={{ fontSize: "10px", color: INK_MUTED, lineHeight: "1.4", borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: "6px" }}><strong>Why:</strong> {step.reason}</div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Source Footer */}
      <div className="rounded-lg p-3 text-[10px]" style={{ background: SURFACE_MANUSCRIPT, border: "1px solid var(--gl-gold-hairline)", color: INK_MUTED }}>
        <strong>Source:</strong> <IAST>Phaladīpikā</IAST> — predictive statements must be grounded in <IAST>śubha-aśubha</IAST> synthesis. Classical ethics (per <IAST>Bṛhat Pārāśara Horā Śāstra</IAST>) require <IAST>satya</IAST> (truth) with <IAST>dayā</IAST> (compassion). When client distress exceeds astrological scope, referral to mental health professionals is the ethical duty.
      </div>
    </div>
  );
}
