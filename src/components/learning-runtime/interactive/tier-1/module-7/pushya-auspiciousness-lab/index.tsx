"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Gem,
  GraduationCap,
  Heart,
  Landmark,
  Stethoscope,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { IAST } from '@/components/learning-runtime/interactive/../chrome/typography';

type ActivityKey = "gold" | "venture" | "education" | "medicine" | "ritual" | "marriage";

type Activity = {
  label: string;
  icon: LucideIcon;
  verdict: "strong" | "avoid";
  timing: string;
  reasoning: string;
  lane: string;
};

const REASONS = [
  { label: "Deity", value: "Bṛhaspati", note: "Guru of the devas: wisdom, guidance, blessing." },
  { label: "Symbol", value: "Udder", note: "Nourishment that flows steadily and freely." },
  { label: "Lordship", value: "Saturn", note: "Structure, duty, durability, and long-term support." },
  { label: "Quality", value: "Light", note: "Quick, clean, suitable for auspicious starts." },
];

const ACTIVITIES: Record<ActivityKey, Activity> = {
  gold: {
    label: "Gold / metals",
    icon: Gem,
    verdict: "strong",
    lane: "acquisition",
    timing: "Prefer Puṣya-Saturday; Guru-Puṣya is also excellent.",
    reasoning: "Metal purchase fits Saturn's lordship and Puṣya's prosperity-supporting nourishment.",
  },
  venture: {
    label: "New venture",
    icon: Landmark,
    verdict: "strong",
    lane: "beginning",
    timing: "Use Puṣya as one favourable input, then still check tithi, lagna, and the wider muhūrta.",
    reasoning: "The star supports enduring, dharmic beginnings rather than quick speculation.",
  },
  education: {
    label: "Study / initiation",
    icon: GraduationCap,
    verdict: "strong",
    lane: "learning",
    timing: "Guru-Puṣya is especially coherent for study, teaching, mantra, and formal starts.",
    reasoning: "Bṛhaspati's wisdom and the nourishment symbol both point to growth through knowledge.",
  },
  medicine: {
    label: "Treatment",
    icon: Stethoscope,
    verdict: "strong",
    lane: "healing",
    timing: "Good for non-emergency treatments when the full pañcāṅga agrees.",
    reasoning: "Puṣya nourishes and stabilizes; it supports healing without replacing medical judgment.",
  },
  ritual: {
    label: "Religious activity",
    icon: CheckCircle2,
    verdict: "strong",
    lane: "dharma",
    timing: "Strong for pūjā, temple visits, vrata beginnings, and devotional undertakings.",
    reasoning: "The guru-deity and deva quality make sacred starts doctrinally natural.",
  },
  marriage: {
    label: "Marriage",
    icon: Heart,
    verdict: "avoid",
    lane: "exception",
    timing: "Use a union-suited nakṣatra instead: Rohiṇī, Mṛgaśīrṣa, Anurādhā, Hasta, or the Uttarā group.",
    reasoning: "Puṣya is auspicious, but its disciplined dharma flavour is not the kāma register a wedding needs.",
  },
};

const WEEKDAYS = [
  { label: "Thursday", name: "Guru-Puṣya", note: "Doubles the Bṛhaspati teaching and blessing theme." },
  { label: "Saturday", name: "Puṣya-Saturday", note: "Especially remembered for gold, metals, and durable acquisition." },
  { label: "Any other day", name: "Plain Puṣya", note: "Still auspicious, but must be judged with the full muhūrta." },
];

function PushyaFlowDiagram({
  activeKey,
  onSelect,
}: {
  activeKey: ActivityKey;
  onSelect: (key: ActivityKey) => void;
}) {
  const active = ACTIVITIES[activeKey];
  const verdictColor = active.verdict === "strong" ? "#2F7D4B" : "#A23A1E";
  const activityKeys = Object.keys(ACTIVITIES) as ActivityKey[];

  return (
    <div className="rounded-2xl p-4" style={{ background: "#FFFDF7", border: "1px solid var(--gl-gold-hairline)" }}>
      <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
        <div className="relative overflow-hidden rounded-xl p-3" style={{ background: "linear-gradient(135deg, #FFF8E8, #FFFFFF)" }}>
          <svg viewBox="0 0 800 540" role="img" aria-label="Puṣya doctrine flows into activity matching" className="w-full h-auto">
            <defs>
              <marker id="pushya-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 Z" fill="#C9A24D" />
              </marker>
            </defs>

            <circle cx="380" cy="264" r="92" fill="#FFFDF7" stroke="#C9A24D" strokeWidth="3" />
            <circle cx="380" cy="264" r="60" fill="#F8E8B8" stroke="#A77A24" strokeWidth="2" />
            <text x="380" y="253" textAnchor="middle" fontSize="25" fontWeight="700" fill="#4C2F1A">Puṣya</text>
            <text x="380" y="282" textAnchor="middle" fontSize="14" fill="#6C5530">nourish + sustain</text>

            {REASONS.map((reason, index) => {
              const y = 98 + index * 100;
              return (
                <g key={reason.label}>
                  <rect x="42" y={y - 34} width="232" height="72" rx="16" fill="#FFFFFF" stroke="#E0C988" />
                  <text x="66" y={y - 8} fontSize="14" fontWeight="700" fill="#8A6424">{reason.label}</text>
                  <text x="66" y={y + 18} fontSize="20" fontWeight="700" fill="#3D2A1D">{reason.value}</text>
                  <path d={`M 274 ${y + 2} C 320 ${y + 2}, 306 264, 288 264`} fill="none" stroke="#C9A24D" strokeWidth="2" markerEnd="url(#pushya-arrow)" />
                </g>
              );
            })}

            {activityKeys.map((key, index) => {
              const item = ACTIVITIES[key];
              const y = 64 + index * 72;
              const isActive = key === activeKey;
              const fill = isActive ? (item.verdict === "strong" ? "#E8F4EC" : "#FBEAE4") : "#FFFFFF";
              const stroke = isActive ? (item.verdict === "strong" ? "#2F7D4B" : "#A23A1E") : "#E0C988";
              return (
                <g key={key} onClick={() => onSelect(key)} onKeyDown={(event) => event.key === "Enter" && onSelect(key)} role="button" tabIndex={0} style={{ cursor: "pointer" }}>
                  <path d={`M 472 264 C 514 264, 508 ${y + 30}, 540 ${y + 30}`} fill="none" stroke={stroke} strokeWidth={isActive ? "3" : "1.8"} markerEnd="url(#pushya-arrow)" />
                  <rect x="542" y={y} width="214" height="60" rx="14" fill={fill} stroke={stroke} strokeWidth={isActive ? "2.5" : "1.4"} />
                  <text x="564" y={y + 25} fontSize="17" fontWeight="700" fill="#3D2A1D">{item.label}</text>
                  <text x="564" y={y + 45} fontSize="12" fontWeight="700" fill={item.verdict === "strong" ? "#2F7D4B" : "#A23A1E"}>
                    {item.verdict === "strong" ? "MATCHED" : "EXCEPTION"}
                  </text>
                </g>
              );
            })}

            <rect x="266" y="430" width="228" height="60" rx="18" fill="#FFF6F0" stroke="rgba(162,58,30,0.35)" />
            <text x="380" y="456" textAnchor="middle" fontSize="16" fontWeight="700" fill="#A23A1E">Not generic luck</text>
            <text x="380" y="478" textAnchor="middle" fontSize="13" fill="#6C5530">match star to action</text>
          </svg>
        </div>

        <div className="rounded-xl p-4" style={{ background: "#FFFFFF", border: `1px solid ${verdictColor}44` }}>
          <p className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: verdictColor }}>
            {active.verdict === "strong" ? "Activity matches Puṣya" : "Classical exception"}
          </p>
          <h4 className="mt-2 text-2xl font-semibold" style={{ color: "var(--gl-ink-primary)" }}>{active.label}</h4>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--gl-ink-secondary)" }}>{active.reasoning}</p>
          <div className="mt-4 rounded-xl p-3" style={{ background: active.verdict === "strong" ? "#F2FBF5" : "#FFF6F0", border: `1px solid ${verdictColor}33` }}>
            <p className="flex gap-2 text-sm font-semibold leading-relaxed" style={{ color: verdictColor }}>
              {active.verdict === "strong" ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
              <span>{active.timing}</span>
            </p>
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--gl-ink-muted)" }}>Reasoning lane</p>
          <p className="mt-1 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: "#FFF8E8", color: "var(--gl-ink-primary)" }}>
            {active.lane}
          </p>
        </div>
      </div>
    </div>
  );
}

export function PushyaAuspiciousnessLab() {
  const [activity, setActivity] = useState<ActivityKey>("gold");
  const [weekday, setWeekday] = useState("Thursday");
  const active = ACTIVITIES[activity];
  const Icon = active.icon;

  const selectedWeekday = useMemo(
    () => WEEKDAYS.find((item) => item.label === weekday) ?? WEEKDAYS[0],
    [weekday],
  );

  return (
    <div className="rounded-2xl p-5 md:p-6" style={{ background: "var(--gl-card-surface-solid)", border: "1px solid var(--gl-gold-hairline)" }}>
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em]" style={{ color: "var(--gl-gold-accent)" }}>
            Module 7 Muhūrta Lens
          </p>
          <h3 className="mt-2 text-2xl font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
            <IAST>Puṣya</IAST> activity-matching diagram
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed" style={{ color: "var(--gl-ink-secondary)" }}>
            Follow the doctrine into the decision: Puṣya is powerful because it nourishes, but the action must fit that flavour.
          </p>
        </div>
      </div>

      <div className="mt-5">
        <PushyaFlowDiagram activeKey={activity} onSelect={setActivity} />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-xl p-4" style={{ background: "#FFF8E8", border: "1px solid var(--gl-gold-hairline)" }}>
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--gl-ink-muted)" }}>Select an activity</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {(Object.keys(ACTIVITIES) as ActivityKey[]).map((key) => {
              const item = ACTIVITIES[key];
              const ButtonIcon = item.icon;
              const isActive = key === activity;
              return (
                <button
                  type="button"
                  key={key}
                  onClick={() => setActivity(key)}
                  className="flex min-h-[68px] items-center gap-3 rounded-xl p-3 text-left transition"
                  style={{
                    background: isActive ? "#FFFFFF" : "rgba(255,255,255,0.55)",
                    border: isActive ? "2px solid var(--gl-gold-accent)" : "1px solid var(--gl-gold-hairline)",
                    color: "var(--gl-ink-primary)",
                  }}
                >
                  <ButtonIcon size={20} color={item.verdict === "avoid" ? "#A23A1E" : "#2F7D4B"} />
                  <span className="text-sm font-semibold">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl p-4" style={{ background: "#FFFDF7", border: "1px solid var(--gl-gold-hairline)" }}>
          <div className="flex items-center gap-3">
            <div className="rounded-full p-3" style={{ background: active.verdict === "strong" ? "#E8F4EC" : "#FBEAE4" }}>
              <Icon size={24} color={active.verdict === "strong" ? "#2F7D4B" : "#A23A1E"} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--gl-ink-muted)" }}>Weekday modifier</p>
              <p className="text-lg font-semibold" style={{ color: "var(--gl-ink-primary)" }}>{selectedWeekday.name}</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {WEEKDAYS.map((item) => (
              <button
                type="button"
                key={item.label}
                onClick={() => setWeekday(item.label)}
                className="rounded-full px-3 py-2 text-sm font-semibold"
                style={{
                  background: item.label === weekday ? "#FFFFFF" : "#FFF8E8",
                  border: item.label === weekday ? "2px solid var(--gl-gold-accent)" : "1px solid var(--gl-gold-hairline)",
                  color: "var(--gl-ink-primary)",
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--gl-ink-secondary)" }}>{selectedWeekday.note}</p>
        </div>
      </div>

      <div className="mt-4 flex gap-3 rounded-xl p-4" style={{ background: "#FFF6F0", border: "1px solid rgba(162, 58, 30, 0.25)" }}>
        <AlertTriangle size={20} color="#A23A1E" />
        <p className="text-sm leading-relaxed" style={{ color: "var(--gl-ink-secondary)" }}>
          Practitioner discipline: Puṣya is a strong supportive condition inside the full muhūrta method, not a guarantee and not a generic answer for every event.
        </p>
      </div>
    </div>
  );
}
