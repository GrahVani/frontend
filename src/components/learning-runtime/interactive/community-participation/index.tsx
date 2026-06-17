"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Users, ShieldCheck, AlertTriangle, Scale, UserCheck, HelpCircle } from "lucide-react";
import { goldOnGlassHairline } from "@/design-tokens/grahvani-learning/colors";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary, #3E2A1F)";
const INK_SECONDARY = "var(--gl-ink-secondary, #5C3D26)";
const INK_MUTED = "var(--gl-ink-muted, #7C6D5B)";
const GOLD = "#A8821E";
const VERMILION = "#A23A1E";
const GREEN = "#2E7D32";

export function CommunityParticipation() {
  const [activeTab, setActiveTab] = useState<"mentor" | "peer" | "challenge">("mentor");

  // Example 1: Mentor Selection
  const [selectedMentor, setSelectedMentor] = useState<string>("none");

  // Example 2: Peer Review
  const [peerChoice, setPeerChoice] = useState<string>("none");

  // Example 3: Responding to a Challenge
  const [responseChoice, setResponseChoice] = useState<string>("none");

  // Dynamic calculations for dials based on active selections
  let driftRisk = 50;
  let calibration = 50;
  let parampara = 50;
  let status: "empowered" | "dependent" | "neglect" = "empowered";
  let feedbackText = "Audit your community engagement style using the tabs above.";

  if (activeTab === "mentor") {
    if (selectedMentor === "teacher_p") {
      driftRisk = 12;
      calibration = 90;
      parampara = 95;
      status = "empowered";
      feedbackText = "Teacher P is the correct parampara choice. Their SJC-style program, ongoing student-cohorts, and verifiable lineage alignment support disciplined learning without cultic dependency.";
    } else if (selectedMentor === "teacher_q") {
      driftRisk = 40;
      calibration = 30;
      parampara = 90; // High attachment, but low calibration
      status = "dependent";
      feedbackText = "Teacher Q warning: Exhibits guru-cult-dependency. Exclusivity claims ('only true Vedic astrology') and opaque structures suppress your independent development.";
    } else if (selectedMentor === "teacher_r") {
      driftRisk = 65;
      calibration = 45;
      parampara = 25;
      status = "neglect";
      feedbackText = "Teacher R error: Academic scholarship is useful for contemporary-discourse (Mode 4), but treating an academic scholar as a practitioner mentor is a category error.";
    }
  } else if (activeTab === "peer") {
    if (peerChoice === "accept") {
      driftRisk = 15;
      calibration = 95;
      parampara = 75;
      status = "empowered";
      feedbackText = "Sahādhyāyī compliance: Exposing your Manglik-dosha timing prediction error to peer review circle reveals Saturn's transit cancellation was misapplied. Calibration succeeds.";
    } else if (peerChoice === "reject") {
      driftRisk = 85;
      calibration = 15;
      parampara = 20;
      status = "neglect";
      feedbackText = "Isolation Drift: Dismissing peer review observations causes your Manglik misinterpretation to entrench silently. Inaccurate confidence compounds.";
    } else if (peerChoice === "coterie") {
      driftRisk = 75;
      calibration = 30;
      parampara = 40;
      status = "dependent";
      feedbackText = "Coterie failure: You and a close group of peers mutually defend the Manglik timing mistake to protect each other's reputations, blocking honest correction.";
    }
  } else { // challenge
    if (responseChoice === "inquiry") {
      driftRisk = 10;
      calibration = 95;
      parampara = 90;
      status = "empowered";
      feedbackText = "Humble Inquiry (Paripraśna): Acknowledging the challenge, checking primary Sanskrit manuals (BPHS/Bṛhat Jātaka), and seeking senior confirmation aligns with Gītā 4.34.";
    } else if (responseChoice === "defensive") {
      driftRisk = 70;
      calibration = 30;
      parampara = 40;
      status = "dependent";
      feedbackText = "Defensive ego deflection: Relying on credentialism or certificates to dismiss source questions is a direct competence-boundary breach.";
    } else if (responseChoice === "isolation") {
      driftRisk = 95;
      calibration = 10;
      parampara = 5;
      status = "neglect";
      feedbackText = "Isolated withdrawal: Retreating from critical public review is the isolation failure-mode. Idiosyncratic slippage goes completely uncorrected.";
    }
  }

  return (
    <div
      className="w-full animate-fadeIn"
      style={{
        background: "var(--gl-surface-card, var(--gl-card-surface, #FFF9F0))",
        border: `1px solid ${goldOnGlassHairline}`,
        borderRadius: 16,
        padding: "24px 26px 20px",
        color: INK_PRIMARY,
        fontFamily: "var(--font-sans), system-ui, sans-serif",
        boxShadow: "0 14px 40px rgba(62, 42, 31, 0.08)",
      }}
    >
      {/* Header */}
      <div className="mb-6 flex flex-col gap-2 border-b pb-4" style={{ borderColor: HAIRLINE }}>
        <div className="flex items-center gap-2">
          <Users size={16} color={GOLD} />
          <p className="m-0 text-xs font-bold uppercase tracking-widest" style={{ color: GOLD }}>
            Module 24 • Chapter 4 • Lesson 2
          </p>
        </div>
        <h2 className="m-0 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
          Satsaṅga & Peer-Review Circle Dojo
        </h2>
        <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>
          Benchmark your community interactions. Study mentor selection, peer review corrections, and response strategies from the lesson text.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b mb-6" style={{ borderColor: HAIRLINE }}>
        {[
          { id: "mentor", label: "Example 1: Mentor Selection" },
          { id: "peer", label: "Example 2: Peer Review Circle" },
          { id: "challenge", label: "Example 3: Public Challenge" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className="pb-2 px-1 text-xs font-bold transition-all relative"
            style={{
              color: activeTab === tab.id ? GOLD : INK_SECONDARY,
            }}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-[2px]"
                style={{ background: GOLD }}
                layoutId="activeTabUnderline2"
              />
            )}
          </button>
        ))}
      </div>

      {/* Layout Grid */}
      <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
        
        {/* Left Side: Active Scenario Controls */}
        <div className="flex flex-col gap-4">
          {activeTab === "mentor" && (
            <div className="flex flex-col gap-4">
              <div className="p-4 rounded-xl border flex flex-col gap-1.5" style={{ background: SURFACE_2, borderColor: HAIRLINE }}>
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: GOLD }}>
                  Context: Choosing a Lineage Mentor
                </span>
                <p className="m-0 text-xs leading-relaxed" style={{ color: INK_PRIMARY }}>
                  A practitioner wants to establish a parampara relationship. Evaluate the three teachers from Section 6 Example 1:
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {[
                  {
                    id: "teacher_p",
                    title: "Teacher P: Parāśarī Linage Program",
                    desc: "Verifiable lineage claim, structured multi-year cohort sessions, and transparent fee model. Teaches you to apply rules directly.",
                  },
                  {
                    id: "teacher_q",
                    title: "Teacher Q: Charismatic Guru (Cultic)",
                    desc: "Declares their school is the only 'true Vedic path'. Demands personal loyalty and uncritical assent to predictions.",
                  },
                  {
                    id: "teacher_r",
                    title: "Teacher R: Academic Scholar",
                    desc: "Rigorous historical researcher. Writes scholarly papers on Jyotiḥśāstra, but does not offer practitioner-counseling formation.",
                  },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMentor(m.id)}
                    className="p-3 rounded-lg border text-left text-xs transition-all hover:bg-white/50"
                    style={{
                      background: selectedMentor === m.id ? SURFACE_2 : SURFACE,
                      borderColor: selectedMentor === m.id ? GOLD : HAIRLINE,
                    }}
                  >
                    <span className="font-bold block" style={{ color: selectedMentor === m.id ? INK_PRIMARY : INK_SECONDARY }}>{m.title}</span>
                    <span className="text-[10px] mt-0.5 block" style={{ color: INK_SECONDARY }}>{m.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === "peer" && (
            <div className="flex flex-col gap-4">
              <div className="p-4 rounded-xl border flex flex-col gap-1.5" style={{ background: SURFACE_2, borderColor: HAIRLINE }}>
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: GOLD }}>
                  Context: Manglik Transit Correction
                </span>
                <p className="m-0 text-xs leading-relaxed" style={{ color: INK_PRIMARY }}>
                  In a peer review circle (Sahādhyāyī mode), a cohort-mate points out you misapplied a Saturn transit to cancel a client's Manglik-dosha prediction. Select your action:
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {[
                  {
                    id: "accept",
                    title: "Accept Review & Crosscheck BPHS",
                    desc: "Open BPHS and verify. Realize the transit cancellation parameters were misapplied. Correct the notes.",
                  },
                  {
                    id: "reject",
                    title: "Defend Reading & Withdraw",
                    desc: "Insist your prediction was correct due to 'intuitive vision', dismissing their classic textual queries.",
                  },
                  {
                    id: "coterie",
                    title: "Coterie Reputation Protection",
                    desc: "Conspire with friendly peers to suppress the observation and validate each other's chart metrics.",
                  },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPeerChoice(p.id)}
                    className="p-3 rounded-lg border text-left text-xs transition-all hover:bg-white/50"
                    style={{
                      background: peerChoice === p.id ? SURFACE_2 : SURFACE,
                      borderColor: peerChoice === p.id ? GOLD : HAIRLINE,
                    }}
                  >
                    <span className="font-bold block" style={{ color: peerChoice === p.id ? INK_PRIMARY : INK_SECONDARY }}>{p.title}</span>
                    <span className="text-[10px] mt-0.5 block" style={{ color: INK_SECONDARY }}>{p.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === "challenge" && (
            <div className="flex flex-col gap-4">
              <div className="p-4 rounded-xl border flex flex-col gap-1.5" style={{ background: SURFACE_2, borderColor: HAIRLINE }}>
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: GOLD }}>
                  Context: Response to Public Inquiry
                </span>
                <p className="m-0 text-xs leading-relaxed" style={{ color: INK_PRIMARY }}>
                  A student on an ICAS forum questions the classical source of a remedial prescription in your case file. How do you respond?
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {[
                  {
                    id: "inquiry",
                    title: "Humble Inquiry (Paripraśna)",
                    desc: "Acknowledge the query, name the specific translation edition (e.g. Santhanam BPHS), and seek validation.",
                  },
                  {
                    id: "defensive",
                    title: "Defensive Credentials Deflection",
                    desc: "Assert your years of experience and ICAS certifications as reasons why your prescription is beyond question.",
                  },
                  {
                    id: "isolation",
                    title: "Withdraw from Forum / Isolation",
                    desc: "Ignore the post and delete your forum thread to avoid critical peer scrutiny.",
                  },
                ].map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setResponseChoice(r.id)}
                    className="p-3 rounded-lg border text-left text-xs transition-all hover:bg-white/50"
                    style={{
                      background: responseChoice === r.id ? SURFACE_2 : SURFACE,
                      borderColor: responseChoice === r.id ? GOLD : HAIRLINE,
                    }}
                  >
                    <span className="font-bold block" style={{ color: responseChoice === r.id ? INK_PRIMARY : INK_SECONDARY }}>{r.title}</span>
                    <span className="text-[10px] mt-0.5 block" style={{ color: INK_SECONDARY }}>{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Side: Visual dial and audit metrics */}
        <div className="rounded-xl p-5 border flex flex-col justify-between" style={{ background: SURFACE, borderColor: HAIRLINE }}>
          
          {/* Drift Dial */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: GOLD }}>
              Idiosyncratic Drift Risk
            </span>

            <div className="flex justify-center rounded-xl p-2 my-3 border bg-white" style={{ borderColor: HAIRLINE }}>
              <svg width="160" height="80" viewBox="0 0 160 80">
                <path d="M 20 75 A 60 60 0 0 1 140 75" fill="none" stroke="rgba(168,130,30,0.15)" strokeWidth="6" strokeLinecap="round" />
                <path d="M 20 75 A 60 60 0 0 1 60 35" fill="none" stroke={GREEN} strokeWidth="6" />
                <path d="M 60 35 A 60 60 0 0 1 100 35" fill="none" stroke={GOLD} strokeWidth="6" />
                <path d="M 100 35 A 60 60 0 0 1 140 75" fill="none" stroke={VERMILION} strokeWidth="6" />

                {(() => {
                  const angle = -180 + (driftRisk / 100) * 180;
                  return (
                    <g transform="translate(80, 75)">
                      <line x1="0" y1="0" x2="-45" y2="0" stroke={INK_PRIMARY} strokeWidth="2.5" transform={`rotate(${angle})`} strokeLinecap="round" />
                      <circle cx="0" cy="0" r="7" fill={INK_PRIMARY} />
                    </g>
                  );
                })()}
                <text x="80" y="70" fill={INK_MUTED} fontSize="6" fontWeight="bold" textAnchor="middle">Idiosyncratic Drift</text>
              </svg>
            </div>

            {/* Metrics progress bars */}
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold">
                  <span>Drift Risk Index:</span>
                  <span style={{ color: driftRisk > 50 ? VERMILION : GREEN }}>{driftRisk}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: SURFACE_2 }}>
                  <div className="h-full" style={{ width: `${driftRisk}%`, background: driftRisk > 50 ? VERMILION : GREEN }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold">
                  <span>Calibration Value:</span>
                  <span style={{ color: calibration > 50 ? GREEN : VERMILION }}>{calibration}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: SURFACE_2 }}>
                  <div className="h-full bg-emerald-700" style={{ width: `${calibration}%` }} />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold">
                  <span>Parampara Alignment:</span>
                  <span style={{ color: parampara > 50 ? GREEN : GOLD }}>{parampara}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: SURFACE_2 }}>
                  <div className="h-full bg-amber-600" style={{ width: `${parampara}%` }} />
                </div>
              </div>
            </div>

          </div>

          {/* Verdict audit box */}
          <div className="mt-4 pt-3 border-t" style={{ borderColor: HAIRLINE }}>
            <div
              className="p-3 rounded-lg flex items-start gap-2.5 text-[11px] leading-normal border"
              style={{
                background: SURFACE_2,
                borderColor: status === "empowered" ? `${GREEN}33` : `${VERMILION}33`,
              }}
            >
              {status === "empowered" ? (
                <ShieldCheck size={15} color={GREEN} className="flex-shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle size={15} color={VERMILION} className="flex-shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-bold block" style={{ color: status === "empowered" ? GREEN : VERMILION }}>
                  {status === "empowered" ? "Satsaṅga Alignment Compliant" : "Auditor Deviation Alert"}
                </span>
                <p className="m-0 mt-0.5 text-[10px]" style={{ color: INK_SECONDARY }}>{feedbackText}</p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Footer Sloka */}
      <div className="mt-6 border-t pt-4 text-center" style={{ borderColor: HAIRLINE }}>
        <p className="m-0 text-[10px] tracking-wider uppercase font-bold" style={{ color: GOLD }}>
          Bhagavad Gītā 4.34 — Reverence, Inquiry, Service
        </p>
        <p className="m-0 mt-1.5 text-xs font-semibold font-devanagari tracking-wide" style={{ color: INK_PRIMARY }}>
          तद्विद्धि प्रणिपातेन परिप्रश्नेन सेवया। उपदेक्ष्यन्ति ते ज्ञानं ज्ञानिनस्तत्त्वदर्शिनः॥ ४.३४॥
        </p>
        <p className="m-0 mt-0.5 text-[10px] italic" style={{ color: INK_SECONDARY }}>
          tad viddhi praṇipātena paripraśnena sevayā | upadekṣyanti te jñānaṁ jñāninas tattva-darśinaḥ || 4.34 ||
        </p>
        <p className="m-0 mt-1 text-[10px] max-w-xl mx-auto leading-relaxed" style={{ color: INK_SECONDARY }}>
          &ldquo;Know that by reverent approach, by inquiry, by service; the knowers, the seers of truth, will instruct you in that knowledge.&rdquo;
        </p>
      </div>

    </div>
  );
}
