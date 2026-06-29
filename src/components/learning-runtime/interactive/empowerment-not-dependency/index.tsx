"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Compass, ShieldCheck, AlertTriangle, Coins } from "lucide-react";
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

interface Option {
  label: string;
  text: string;
  agency: number;
  anxiety: number;
  revenue: string;
  status: "empowered" | "dependent" | "neglect";
  feedback: string;
}

interface Scenario {
  year: number;
  title: string;
  context: string;
  options: Record<string, Option>;
}

const SCENARIOS: Record<string, Scenario> = {
  y1: {
    year: 1,
    title: "Year 1: Job Loss Crisis",
    context: "Client is in severe stress following sudden corporate layoffs, asking when they will find another high-paying job.",
    options: {
      dependent: {
        label: "Option A: Dependency Fostering",
        text: "Tell them Saturn guarantees a job exactly on November 12, but only if they check in with you weekly to align daily transits, warning that any un-consulted action will trigger a curse.",
        agency: 10,
        anxiety: 85,
        revenue: "High ($400/mo recurring)",
        status: "dependent",
        feedback: "Severe violation. Exploits client vulnerability to manufacture continuing consult dependencies. The client stops making efforts, waiting passively for your dates."
      },
      neglect: {
        label: "Option B: Svadharma Neglect",
        text: "Tell them to apply for whatever they want, and refuse to examine the chart transits, dismissing their professional timing concern as purely mundane.",
        agency: 45,
        anxiety: 60,
        revenue: "Loss (-$50)",
        status: "neglect",
        feedback: "Under-reach. Neglects the legitimate astrological support (Lagna timing, active Dasa tones) which can offer structured hope and focus."
      },
      empowered: {
        label: "Option C: Agency Building",
        text: "Explain that the 10th house transit demands slow foundation building. Help them identify active search directions, outline timing parameters, and suggest booking again only when concrete offers are received.",
        agency: 85,
        anxiety: 20,
        revenue: "Stable ($150 one-off)",
        status: "empowered",
        feedback: "Dharmic balance. Pairs chart observations with active client search responsibility, releasing the decision locus to them."
      }
    }
  },
  y2: {
    year: 2,
    title: "Year 2: Sade-Sāti Panic",
    context: "Client reads internet articles on Sade-Sāti catastrophising and calls in panic, begging for a remedial ritual recommendation.",
    options: {
      dependent: {
        label: "Option A: Dependency Fostering",
        text: "Validate the internet doom. Tell them their family and health are at risk, prescribing ₹80,000 in monthly protective rituals performed exclusively through your temple contact.",
        agency: 5,
        anxiety: 95,
        revenue: "Extremely High ($800 one-off)",
        status: "dependent",
        feedback: "Violates classical Nirlobha (freedom from greed). Uses Sāḍhe-Sāti anxiety to lock the client into expensive remedial routines, stripping them of personal agency."
      },
      neglect: {
        label: "Option B: Svadharma Neglect",
        text: "Tell them Sade-Sāti is complete superstition, hang up, and refuse to outline the real transit parameters.",
        agency: 50,
        anxiety: 70,
        revenue: "Loss (-$40)",
        status: "neglect",
        feedback: "Neglect. Refusing to educate the client leaves them vulnerable to other fear-mongering sources online."
      },
      empowered: {
        label: "Option C: Agency Building",
        text: "Deconstruct the online myths. Explain Saturn's transit as a timing phase of consolidation, patient building, and lifestyle adjustments, advising against costly rituals.",
        agency: 90,
        anxiety: 15,
        revenue: "Stable ($120 one-off)",
        status: "empowered",
        feedback: "Perfect. Translates planetary transits into constructive self-discipline and stress-management, neutralizing fear."
      }
    }
  },
  y3: {
    year: 3,
    title: "Year 3: Relationship Crossroads",
    context: "Client is experiencing relational friction and demands: 'Tell me if I should stay or divorce. I will do whatever you say.'",
    options: {
      dependent: {
        label: "Option A: Dependency Fostering",
        text: "Make the decision for them. Declare that Mars in the 7th house renders the partner incompatible, and command them to file for divorce next Tuesday.",
        agency: 5,
        anxiety: 90,
        revenue: "High ($350)",
        status: "dependent",
        feedback: "Breaches counseling boundaries. Placing the decision authority on the practitioner causes the client to escape personal responsibility for relationship choices."
      },
      neglect: {
        label: "Option B: Svadharma Neglect",
        text: "Refuse to comment on relationship indicators or Mars placements, telling them to resolve it entirely with lawyers.",
        agency: 45,
        anxiety: 55,
        revenue: "Loss (-$60)",
        status: "neglect",
        feedback: "Under-reach. The chart's communication/7th house indicators can serve as useful reflective mirrors if presented supportively."
      },
      empowered: {
        label: "Option C: Agency Building",
        text: "Explain the active communication transits (Mars aspect). Help them see the behavior patterns and suggest relational counselor referral, leaving the decision locus with the client.",
        agency: 95,
        anxiety: 10,
        revenue: "Stable ($150)",
        status: "empowered",
        feedback: "Dharmic. Empowers the client's discernment, supporting their relationship choice rather than dictating it."
      }
    }
  },
  y4: {
    year: 4,
    title: "Year 4: Independent Launch",
    context: "Client is launching a venture. They present their own transit notes on Jupiter, showing basic self-literacy, and ask for a final review.",
    options: {
      dependent: {
        label: "Option A: Dependency Fostering",
        text: "Dismiss their notes as amateur. Assert that only you can calculate Muhurtas, and demand they hire you on a monthly retainer for launch decisions.",
        agency: 10,
        anxiety: 80,
        revenue: "High ($500/mo retainer)",
        status: "dependent",
        feedback: "Severe boundary overreach. Suppresses the client's emerging self-literacy to preserve practitioner authority and secure recurring retainer fees."
      },
      neglect: {
        label: "Option B: Svadharma Neglect",
        text: "Tell them timing is meaningless and they should sign contracts whenever they feel like it.",
        agency: 50,
        anxiety: 40,
        revenue: "Loss (-$80)",
        status: "neglect",
        feedback: "Neglects the traditional value of Muhūrta timing parameters."
      },
      empowered: {
        label: "Option C: Agency Building",
        text: "Review and validate their transit notes. Co-calculate the refined timing window, congratulating them on their self-discernment and pattern literacy.",
        agency: 100,
        anxiety: 5,
        revenue: "Sustainable ($100 check-in)",
        status: "empowered",
        feedback: "The culmination of Svadharma. The client has outgrown the need for basic dependency; they are now an empowered partner in chart dialogue."
      }
    }
  }
};

export function EmpowermentNotDependency() {
  const [activeYear, setActiveYear] = useState<string>("y1");
  const [activeOpt, setActiveOpt] = useState<string>("dependent");

  const scenario = SCENARIOS[activeYear];
  const option = scenario.options[activeOpt] || Object.values(scenario.options)[0];

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
          <Compass size={16} color={GOLD} className="animate-spin-slow" />
          <p className="m-0 text-xs font-bold uppercase tracking-widest" style={{ color: GOLD }}>
            Client Relationship Design
          </p>
        </div>
        <h2 className="m-0 text-xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
          Client Agency & Relationship Simulator
        </h2>
        <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>
          Manage a 4-year client trajectory and balance client psychological health with practice revenue sustainability.
        </p>
      </div>

      {/* Year Tabs */}
      <div className="flex flex-wrap gap-1 p-1 rounded-xl mb-6" style={{ background: SURFACE_2 }}>
        {Object.entries(SCENARIOS).map(([key, s]) => (
          <button
            key={key}
            onClick={() => {
              setActiveYear(key);
              setActiveOpt("dependent");
            }}
            className="flex-1 min-w-[120px] py-2 px-3 rounded-lg border text-center transition-all text-xs font-bold"
            style={{
              background: activeYear === key ? SURFACE : "transparent",
              borderColor: activeYear === key ? GOLD : "transparent",
              color: activeYear === key ? INK_PRIMARY : INK_SECONDARY,
            }}
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
        
        {/* Left Side: Context & Actions */}
        <div className="flex flex-col gap-4">
          <div className="p-4 rounded-xl border flex flex-col gap-1.5" style={{ background: SURFACE_2, borderColor: HAIRLINE }}>
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: GOLD }}>
              Client Query Context (Year {scenario.year})
            </span>
            <p className="m-0 text-xs leading-relaxed font-semibold" style={{ color: INK_PRIMARY }}>
              {scenario.context}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: INK_SECONDARY }}>
              Select Practitioner Action
            </span>
            <div className="flex flex-col gap-2">
              {Object.entries(scenario.options).map(([key, opt]) => (
                <button
                  key={key}
                  onClick={() => setActiveOpt(key)}
                  className="w-full p-3 rounded-lg border text-left transition-all text-xs flex flex-col gap-1 hover:bg-white/50"
                  style={{
                    background: activeOpt === key ? SURFACE_2 : SURFACE,
                    borderColor: activeOpt === key ? GOLD : HAIRLINE,
                  }}
                >
                  <span className="font-bold" style={{ color: activeOpt === key ? INK_PRIMARY : INK_SECONDARY }}>
                    {opt.label}
                  </span>
                  <span className="text-[10px] text-stone-600 leading-normal" style={{ color: INK_SECONDARY }}>
                    {opt.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Authority scale and metrics */}
        <div className="rounded-xl p-5 border flex flex-col justify-between" style={{ background: SURFACE, borderColor: HAIRLINE }}>
          <div>
            <div className="mb-4">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: GOLD }}>
                Decision Authority & Agency scale
              </span>
            </div>

            {/* Visual SVG Authority Scale */}
            <div className="flex justify-center rounded-xl p-4 mb-4 border bg-white" style={{ borderColor: HAIRLINE }}>
              <svg viewBox="0 0 260 120" className="w-full max-w-[440px] h-auto block">
                {/* Horizontal Scale Line */}
                <line x1="38" y1="66" x2="222" y2="66" stroke="rgba(168,130,30,0.2)" strokeWidth="4" rx="2" />
                <line x1="38" y1="66" x2="130" y2="66" stroke={option.status === "dependent" ? VERMILION : "rgba(168,130,30,0.1)"} strokeWidth={option.status === "dependent" ? 4 : 1.5} />
                <line x1="130" y1="66" x2="222" y2="66" stroke={option.status === "empowered" ? GREEN : "rgba(168,130,30,0.1)"} strokeWidth={option.status === "empowered" ? 4 : 1.5} />
                
                {/* End Labels */}
                <text x="18" y="38" fill={INK_MUTED} fontSize="10" fontWeight="bold" textAnchor="start">Astrologer&apos;s Desk</text>
                <text x="242" y="38" fill={INK_MUTED} fontSize="10" fontWeight="bold" textAnchor="end">Client&apos;s Hands</text>

                {/* Center marker */}
                <line x1="130" y1="56" x2="130" y2="76" stroke={GOLD} strokeWidth="2" />

                {/* Animated pointer based on agency level */}
                {(() => {
                  const xCoord = 38 + (option.agency / 100) * 184;
                  const color = option.status === "empowered" ? GREEN : option.status === "dependent" ? VERMILION : GOLD;
                  return (
                    <g transform={`translate(${xCoord}, 66)`}>
                      <circle cx="0" cy="0" r="11" fill={color} />
                      <polygon points="-7,-5 0,-19 7,-5" fill={color} />
                    </g>
                  );
                })()}

                <text x="130" y="104" fill={option.status === "empowered" ? GREEN : option.status === "dependent" ? VERMILION : GOLD} fontSize="11" fontWeight="bold" textAnchor="middle">
                  {option.status === "empowered" ? "Empowered Agency Shift" : option.status === "dependent" ? "Dependency Lock" : "Unguided Agency"}
                </text>
              </svg>
            </div>

            {/* Metrics */}
            <div className="space-y-3">
              
              {/* Agency Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span>Client Agency & Self-Literacy:</span>
                  <span style={{ color: option.agency > 50 ? GREEN : VERMILION }}>{option.agency}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: SURFACE_2 }}>
                  <motion.div
                    className="h-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${option.agency}%` }}
                    transition={{ duration: 0.3 }}
                    style={{ background: option.agency > 50 ? GREEN : GOLD }}
                  />
                </div>
              </div>

              {/* Anxiety Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span>Client Anxiety Level:</span>
                  <span style={{ color: option.anxiety > 50 ? VERMILION : GREEN }}>{option.anxiety}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: SURFACE_2 }}>
                  <motion.div
                    className="h-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${option.anxiety}%` }}
                    transition={{ duration: 0.3 }}
                    style={{ background: option.anxiety > 50 ? VERMILION : GREEN }}
                  />
                </div>
              </div>

              {/* Revenue indicator */}
              <div className="flex items-center justify-between text-[11px] font-bold pt-2 border-t" style={{ borderColor: HAIRLINE }}>
                <span className="flex items-center gap-1">
                  <Coins size={13} color={GOLD} />
                  <span>Practice Revenue Stream:</span>
                </span>
                <span style={{ color: option.status === "dependent" ? VERMILION : GREEN }}>{option.revenue}</span>
              </div>

            </div>
          </div>

          {/* Feedback details */}
          <div className="mt-4 pt-3 border-t" style={{ borderColor: HAIRLINE }}>
            <div
              className="p-3 rounded-lg flex items-start gap-2.5 text-[11px] leading-normal border"
              style={{
                background: SURFACE_2,
                borderColor: option.status === "empowered" ? `${GREEN}33` : `${VERMILION}33`,
              }}
            >
              {option.status === "empowered" ? (
                <>
                  <ShieldCheck size={15} color={GREEN} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block" style={{ color: GREEN }}>Svadharma Compliant</span>
                    <p className="m-0 mt-0.5" style={{ color: INK_SECONDARY }}>{option.feedback}</p>
                  </div>
                </>
              ) : (
                <>
                  <AlertTriangle size={15} color={option.status === "dependent" ? VERMILION : GOLD} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block" style={{ color: option.status === "dependent" ? VERMILION : GOLD }}>
                      {option.status === "dependent" ? "Dependency Loop" : "Under-reach Neglect"}
                    </span>
                    <p className="m-0 mt-0.5" style={{ color: INK_SECONDARY }}>{option.feedback}</p>
                  </div>
                </>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Gita Sloka Footer */}
      <div className="mt-6 border-t pt-4 text-center" style={{ borderColor: HAIRLINE }}>
        <p className="m-0 text-[10px] tracking-wider uppercase font-bold" style={{ color: GOLD }}>
          Bhagavad Gītā 18.63 — Release to agency
        </p>
        <p className="m-0 mt-1.5 text-xs font-semibold font-devanagari tracking-wide" style={{ color: INK_PRIMARY }}>
          इति ते ज्ञानमाख्यातं गुह्याद्गुह्यतरं मया। विमृश्यैतदशेषेण यथेच्छसि तथा कुरु॥ १८.६३॥
        </p>
        <p className="m-0 mt-0.5 text-[10px] italic" style={{ color: INK_SECONDARY }}>
          iti te jñānam ākhyātaṁ guhyād guhyataraṁ mayā | vimṛśyaitad aśeṣeṇa yathecchasi tathā kuru || 18.63 ||
        </p>
        <p className="m-0 mt-1 text-[10px] max-w-xl mx-auto leading-relaxed" style={{ color: INK_SECONDARY }}>
          &ldquo;Thus the knowledge, more secret than secret, has been declared by me. Reflecting on all this fully, do as you please.&rdquo;
        </p>
      </div>
    </div>
  );
}
