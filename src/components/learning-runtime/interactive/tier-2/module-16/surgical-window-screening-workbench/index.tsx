"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  BookOpen,
  CalendarDays,
  Info,
  Lock,
  MessageSquareQuote,
  RotateCcw,
  ShieldAlert,
  Star,
  Swords,
  XCircle,
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
const PURPLE = "#6B5AA8";

interface Candidate {
  key: string;
  day: string;
  vara: string;
  varaLord: string;
  nakshatra: string;
  tithi: string;
  tithiClass: string;
  yoga: string;
  karana: string;
}

const CANDIDATES: Candidate[] = [
  { key: "mon", day: "Monday", vara: "Moon", varaLord: "Moon", nakshatra: "Swāti", tithi: "Krishna Ṣaṣṭhī", tithiClass: "Nandā", yoga: "Dhruva", karana: "Garija" },
  { key: "tue", day: "Tuesday", vara: "Mars", varaLord: "Mars", nakshatra: "Ārdrā", tithi: "Shukla Daśamī", tithiClass: "Pūrṇā", yoga: "Āyuṣmān", karana: "Taitila" },
  { key: "wed", day: "Wednesday", vara: "Mercury", varaLord: "Mercury", nakshatra: "Pūrva Phalgunī", tithi: "Krishna Pratipadā", tithiClass: "Nandā", yoga: "Dhṛti", karana: "Bālava" },
  { key: "thu", day: "Thursday", vara: "Jupiter", varaLord: "Jupiter", nakshatra: "Uttara Āṣāḍhā", tithi: "Krishna Dvādaśī", tithiClass: "Bhadrā", yoga: "Variyāna", karana: "Taitila" },
  { key: "fri", day: "Friday", vara: "Venus", varaLord: "Venus", nakshatra: "Kṛttikā", tithi: "Shukla Ṣaṣṭhī", tithiClass: "Nandā", yoga: "Vaidhṛti", karana: "Taitila" },
];

const TIKSHNA_NAKSHATRAS = ["Ārdrā", "Āśleṣā", "Jyeṣṭhā", "Mūla"];
const INAUSPICIOUS_YOGAS = ["Vyatīpāta", "Vaidhṛti"];
const AVOIDED_TITHI_CLASS = "Riktā";

interface EvaluatedCandidate extends Candidate {
  isTuesdayMars: boolean;
  isTikshna: boolean;
  isAvoidedYoga: boolean;
  isAvoidedTithi: boolean;
  isCombined: boolean;
  score: number;
  rankLabel: string;
}

function evaluateCandidate(c: Candidate): EvaluatedCandidate {
  const isTuesdayMars = c.vara === "Mars" && c.day === "Tuesday";
  const isTikshna = TIKSHNA_NAKSHATRAS.includes(c.nakshatra);
  const isAvoidedYoga = INAUSPICIOUS_YOGAS.includes(c.yoga);
  const isAvoidedTithi = c.tithiClass === AVOIDED_TITHI_CLASS;
  const isCombined = isTuesdayMars && isTikshna && !isAvoidedYoga && !isAvoidedTithi;

  let score = 0;
  if (isCombined) score = 4;
  else if (isTuesdayMars && isTikshna) score = 3;
  else if (isTuesdayMars || isTikshna) score = 2;
  else if (c.tithiClass === "Pūrṇā" || c.tithiClass === "Bhadrā" || c.tithiClass === "Nandā" || c.tithiClass === "Jayā") score = 1;

  if (isAvoidedYoga || isAvoidedTithi) score = -1;

  let rankLabel = "Acceptable";
  if (isAvoidedYoga || isAvoidedTithi) rankLabel = "Avoid";
  else if (isCombined) rankLabel = "Strongest";
  else if (isTuesdayMars && isTikshna) rankLabel = "Strong";
  else if (isTuesdayMars || isTikshna) rankLabel = "Favoured";

  return { ...c, isTuesdayMars, isTikshna, isAvoidedYoga, isAvoidedTithi, isCombined, score, rankLabel };
}

function rankColor(rankLabel: string): string {
  if (rankLabel === "Strongest") return GREEN;
  if (rankLabel === "Strong") return GREEN;
  if (rankLabel === "Favoured") return BLUE;
  if (rankLabel === "Avoid") return VERMILION;
  return GOLD;
}

export function SurgicalWindowScreeningWorkbench() {
  const [showOutside, setShowOutside] = useState(false);

  const evaluated = useMemo(() => CANDIDATES.map(evaluateCandidate), []);
  const strongest = evaluated.find((c) => c.rankLabel === "Strongest") || evaluated[0];
  const avoided = evaluated.find((c) => c.rankLabel === "Avoid");

  return (
    <div data-interactive="surgical-window-screening-workbench" style={{ display: "flex", flexDirection: "column", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Surgical window screening</p>
            <h2 style={{ margin: "0.2rem 0 0", color: ACCENT, fontSize: "1.25rem", fontWeight: 600 }}>
              {`Screen every day inside the surgeon's given window`}
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              {`The physician's range is taken exactly as given. Within it, apply the general pañcāṅga check plus the Tuesday-Mars and Tīkṣṇa-nakṣatra surgical exceptions.`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowOutside(false);
            }}
            style={buttonStyle(false, ACCENT)}
          >
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
          Source: Lesson 16.5.1 §4.2-§4.4; Muhūrta-Cintāmaṇi via T1-23
        </div>
      </section>

      <section
        style={{
          ...cardStyle,
          borderColor: `${VERMILION}66`,
          background: `${VERMILION}0A`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Lock size={18} color={VERMILION} />
          <p style={{ ...eyebrowStyle, margin: 0 }}>Hard boundary</p>
        </div>
        <h3 style={{ margin: "0.35rem 0 0", color: VERMILION, fontSize: "1.05rem", fontWeight: 600 }}>
          The window is taken exactly as given
        </h3>
        <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
          {`Screen only the days the surgeon offered. Recommending a day outside the range — or asking whether the range could be widened for astrological reasons — violates the medical-primacy doctrine from Lesson 16.5.1.`}
        </p>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
          <p style={eyebrowStyle}>{`Vikram's five-day candidate window`}</p>
          <button type="button" onClick={() => setShowOutside((v) => !v)} style={buttonStyle(showOutside, VERMILION)}>
            {showOutside ? <XCircle size={14} /> : <AlertTriangle size={14} />}
            {showOutside ? "Hide outside-window mistake" : "Try expanding the window"}
          </button>
        </div>

        {showOutside && (
          <div
            style={{
              marginBottom: "0.85rem",
              padding: "0.75rem",
              borderRadius: 8,
              border: `1px solid ${VERMILION}`,
              background: `${VERMILION}10`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: VERMILION, marginBottom: "0.35rem" }}>
              <ShieldAlert size={12} />
              Blocked: medical-primacy violation
            </div>
            <p style={{ margin: 0, fontSize: "0.88rem", color: INK_PRIMARY, lineHeight: 1.6 }}>
              {`The next Saturday also happens to be Tuesday + Tīkṣṇa — an even stronger classical combination. But it is outside the surgeon's offered window. Mentioning it, or asking the family to request it, is the same error as suggesting a reschedule for a fixed-time surgery. The muhūrta stays inside the given range.`}
            </p>
          </div>
        )}

        <WindowSvg showOutside={showOutside} />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "0.65rem" }}>
          {evaluated.map((c) => (
            <CandidateCard key={c.key} candidate={c} isTop={c.key === strongest.key} />
          ))}
        </div>
      </section>

      <div style={workbenchTwoColumnStyle}>
        <section style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <p style={eyebrowStyle}>Ranking</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem" }}>
            {evaluated
              .slice()
              .sort((a, b) => b.score - a.score)
              .map((c, i) => (
                <div
                  key={c.key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.65rem",
                    padding: "0.55rem 0.75rem",
                    borderRadius: 6,
                    border: `1px solid ${rankColor(c.rankLabel)}`,
                    background: `${rankColor(c.rankLabel)}10`,
                  }}
                >
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: INK_MUTED }}>#{i + 1}</span>
                  <span style={{ fontWeight: 600, color: INK_PRIMARY, flex: 1 }}>{c.day}</span>
                  <span style={{ fontSize: "0.78rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.03em", color: rankColor(c.rankLabel) }}>{c.rankLabel}</span>
                </div>
              ))}
          </div>
          <div
            style={{
              marginTop: "auto",
              padding: "0.65rem",
              borderRadius: 6,
              border: `1px solid ${BLUE}`,
              background: `${BLUE}08`,
              fontSize: "0.8rem",
              color: INK_SECONDARY,
              lineHeight: 1.55,
            }}
          >
            <Info size={14} color={BLUE} style={{ display: "inline", marginRight: 6, verticalAlign: "text-bottom" }} />
            {`No day in the window has a Riktā tithi. Friday is avoided only because of Vaidhṛti yoga, a universal inauspicious yoga with no surgical exception.`}
          </div>
        </section>

        <section style={{ ...cardStyle, display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <MessageSquareQuote size={16} color={GREEN} />
            <p style={{ ...eyebrowStyle, margin: 0 }}>Recommendation</p>
          </div>
          <div
            style={{
              padding: "0.85rem",
              borderRadius: 8,
              border: `1px solid ${GREEN}`,
              background: `${GREEN}10`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
              <Star size={16} color={GREEN} />
              <span style={{ fontWeight: 600, color: GREEN, fontSize: "1.05rem" }}>{strongest.day}</span>
            </div>
            <p style={{ margin: 0, fontSize: "0.88rem", color: INK_PRIMARY, lineHeight: 1.65 }}>
              {`Tuesday is the clear standout: Mars-ruled vāra, Tīkṣṇa-class nakṣatra (Ārdrā), and a Pūrṇā-class tithi. This is the combined-strength case T1-23 names as particularly strong for surgical procedures.`}
            </p>
          </div>
          {avoided && (
            <div
              style={{
                padding: "0.65rem 0.85rem",
                borderRadius: 6,
                border: `1px solid ${VERMILION}`,
                background: `${VERMILION}08`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: VERMILION, marginBottom: "0.25rem" }}>
                <XCircle size={12} />
                Disclosed weak day
              </div>
              <p style={{ margin: 0, fontSize: "0.85rem", color: INK_PRIMARY, lineHeight: 1.55 }}>
                {`${avoided.day} carries ${avoided.yoga} yoga — avoided regardless of surgical context.`}
              </p>
            </div>
          )}
          <div
            style={{
              padding: "0.65rem 0.85rem",
              borderRadius: 6,
              border: `1px solid ${HAIRLINE}`,
              background: SURFACE,
            }}
          >
            <p style={{ margin: 0, fontSize: "0.85rem", color: INK_SECONDARY, lineHeight: 1.6 }}>
              {`"Based on the surgeon's own window, Tuesday is the most classically-favourable choice among the medically-acceptable days. This is an additional layer to the surgeon's medical judgment, not a replacement for it."`}
            </p>
          </div>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Screening rules</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.65rem", marginTop: "0.55rem" }}>
          <RuleCard icon={<CalendarDays size={16} color={INK_MUTED} />} title="General pañcāṅga" body="Riktā tithi, Vyatīpāta and Vaidhṛti yogas are always avoided. Other tithi/yoga/karaṇa classes are read normally." />
          <RuleCard icon={<Swords size={16} color={VERMILION} />} title="Tuesday-Mars exception" body="Tuesday, otherwise generally avoided, is a genuine surgical candidate because Mars-character matches cutting and intervention." />
          <RuleCard icon={<Swords size={16} color={PURPLE} />} title="Tīkṣṇa-nakṣatra exception" body="Ārdrā, Āśleṣā, Jyeṣṭhā, Mūla — sharp, incisive nakṣatras that match surgical action." />
          <RuleCard icon={<Star size={16} color={GREEN} />} title="Combined strength" body="A day that is both Tuesday and Tīkṣṇa-nakṣatra is named as a particularly strong surgical window." />
        </div>
      </section>
    </div>
  );
}

function CandidateCard({ candidate, isTop }: { candidate: EvaluatedCandidate; isTop: boolean }) {
  const color = rankColor(candidate.rankLabel);
  return (
    <div
      style={{
        padding: "0.75rem",
        borderRadius: 8,
        border: `1px solid ${isTop ? color : HAIRLINE}`,
        background: isTop ? `${color}10` : SURFACE,
        display: "flex",
        flexDirection: "column",
        gap: "0.45rem",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem" }}>
        <span style={{ fontWeight: 600, color: INK_PRIMARY }}>{candidate.day}</span>
        {isTop && <Star size={14} color={GREEN} />}
      </div>
      <div style={{ fontSize: "0.78rem", color: INK_SECONDARY, lineHeight: 1.5 }}>
        <div>{candidate.vara} vāra</div>
        <div>{candidate.nakshatra}</div>
        <div>
          {candidate.tithi} — <span style={{ color: candidate.tithiClass === AVOIDED_TITHI_CLASS ? VERMILION : GREEN }}>{candidate.tithiClass}</span>
        </div>
        <div style={{ color: candidate.isAvoidedYoga ? VERMILION : INK_SECONDARY }}>{candidate.yoga} yoga</div>
        <div>{candidate.karana} karaṇa</div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem", marginTop: "0.25rem" }}>
        {candidate.isTuesdayMars && <MiniChip label="Tuesday-Mars" color={VERMILION} />}
        {candidate.isTikshna && <MiniChip label="Tīkṣṇa" color={PURPLE} />}
        {candidate.isCombined && <MiniChip label="Combined" color={GREEN} />}
        {candidate.isAvoidedYoga && <MiniChip label={`${candidate.yoga}`} color={VERMILION} />}
        {!candidate.isTuesdayMars && !candidate.isTikshna && !candidate.isAvoidedYoga && !candidate.isAvoidedTithi && <MiniChip label="Acceptable" color={GOLD} />}
      </div>
    </div>
  );
}

function MiniChip({ label, color }: { label: string; color: string }) {
  return (
    <span
      style={{
        fontSize: "0.65rem",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.03em",
        color,
        border: `1px solid ${color}`,
        borderRadius: 999,
        padding: "0.1rem 0.4rem",
      }}
    >
      {label}
    </span>
  );
}

function RuleCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div style={{ padding: "0.65rem", borderRadius: 8, border: `1px solid ${HAIRLINE}`, background: SURFACE }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", fontWeight: 600, color: INK_PRIMARY, marginBottom: "0.25rem" }}>
        {icon}
        {title}
      </div>
      <div style={{ fontSize: "0.78rem", color: INK_SECONDARY, lineHeight: 1.5 }}>{body}</div>
    </div>
  );
}

function WindowSvg({ showOutside }: { showOutside: boolean }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const outsideDay = "Sat";
  const boxWidth = 56;
  const gap = 12;
  const startX = 24;
  const y = 40;
  const totalWidth = startX + days.length * (boxWidth + gap) - gap + (showOutside ? boxWidth + gap : 0) + 24;

  return (
    <svg viewBox={`0 0 ${totalWidth} 110`} role="img" aria-label="Surgeon's given window Monday through Friday, with an outside Saturday shown only as a blocked mistake" style={{ width: "100%", maxHeight: 110, display: "block", marginBottom: "0.85rem" }}>
      <text x={startX} y={18} fontSize={10} fill={INK_MUTED} fontWeight={600}>
        {`Surgeon's window`}
      </text>
      {days.map((d, i) => {
        const x = startX + i * (boxWidth + gap);
        const isTue = d === "Tue";
        return (
          <g key={d}>
            <rect x={x} y={y} width={boxWidth} height={46} rx={6} fill={isTue ? `${GREEN}10` : SURFACE} stroke={isTue ? GREEN : HAIRLINE} strokeWidth={isTue ? 2 : 1} />
            <text x={x + boxWidth / 2} y={y + 20} textAnchor="middle" fontSize={11} fill={INK_PRIMARY} fontWeight={600}>
              {d}
            </text>
            <text x={x + boxWidth / 2} y={y + 36} textAnchor="middle" fontSize={9} fill={INK_SECONDARY}>
              inside
            </text>
          </g>
        );
      })}
      {showOutside && (
        <g>
          <rect x={startX + days.length * (boxWidth + gap)} y={y} width={boxWidth} height={46} rx={6} fill={`${VERMILION}10`} stroke={VERMILION} strokeWidth={2} strokeDasharray="4 2" />
          <text x={startX + days.length * (boxWidth + gap) + boxWidth / 2} y={y + 20} textAnchor="middle" fontSize={11} fill={VERMILION} fontWeight={600}>
            {outsideDay}
          </text>
          <text x={startX + days.length * (boxWidth + gap) + boxWidth / 2} y={y + 36} textAnchor="middle" fontSize={9} fill={VERMILION}>
            outside
          </text>
          <line x1={startX + days.length * (boxWidth + gap) - gap / 2} y1={y - 8} x2={startX + days.length * (boxWidth + gap) - gap / 2} y2={y + 54} stroke={VERMILION} strokeWidth={2} />
          <text x={startX + days.length * (boxWidth + gap) - gap / 2 - 4} y={y - 12} textAnchor="end" fontSize={9} fill={VERMILION} fontWeight={600}>
            Do not cross
          </text>
        </g>
      )}
    </svg>
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
