"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, BookOpen, CheckCircle2, CircleDot, Microscope, RotateCcw, ShieldCheck, Sprout } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { Devanagari, IAST } from "../../chrome/typography";
import { AUTHORITY_PROFILES, CLAIM_CARDS, DISCLOSURE_STEPS, getAuthority, verdictColor, verdictLabel, type AuthorityKey, type ClaimVerdict } from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const INK_MUTED = "var(--gl-ink-muted)";
const GOLD = ink.goldAccent;
const GREEN = "#2F7D52";
const BLUE = "#356C96";
const VERMILION = ink.vermilionAccent;

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function AuthorityGlyph({ authorityKey, size, color }: { authorityKey: AuthorityKey; size: number; color: string }) {
  if (authorityKey === "scripture") return <BookOpen size={size} color={color} />;
  if (authorityKey === "science") return <Microscope size={size} color={color} />;
  return <Sprout size={size} color={color} />;
}

function EpistemicStatusSvg({ active }: { active: AuthorityKey }) {
  const activeProfile = getAuthority(active);
  const nodes = [
    { key: "scripture" as const, x: 148, y: 188 },
    { key: "science" as const, x: 380, y: 188 },
    { key: "folk" as const, x: 612, y: 188 },
  ];
  const nodeLabelLines: Record<AuthorityKey, string[]> = {
    scripture: ["Scriptural", "pedigree"],
    science: ["Controlled", "validation"],
    folk: ["Empirical", "folk practice"],
  };

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <svg viewBox="0 0 760 360" className="h-auto w-full min-w-0" role="img" aria-label="Lal Kitab epistemic status map">
        <rect x="20" y="20" width="720" height="310" rx="18" fill={SURFACE_2} stroke={HAIRLINE} />
        <text x="380" y="50" textAnchor="middle" fill={GOLD} fontSize="16" fontWeight="900" letterSpacing="1" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          NAME THE REAL AUTHORITY STATUS
        </text>

        <path d="M148 188 H612" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="8 8" />
        <rect x="265" y="72" width="230" height="70" rx="16" fill={wash(activeProfile.color, "12")} stroke={activeProfile.color} />
        <text x="380" y="100" textAnchor="middle" fill={activeProfile.color} fontSize="14" fontWeight="900" letterSpacing="0.8" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          {activeProfile.label}
        </text>
        <text x="380" y="124" textAnchor="middle" fill={INK_PRIMARY} fontSize="14" fontWeight="900" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          {activeProfile.status === "present-modest" ? "Present, modest" : "Absent as authority"}
        </text>

        {nodes.map((node) => {
          const profile = getAuthority(node.key);
          const selected = node.key === active;
          const marker = profile.status === "present-modest" ? "modest yes" : "no";
          const labelLines = nodeLabelLines[node.key];
          return (
            <g key={node.key}>
              <circle cx={node.x} cy={node.y} r={selected ? 58 : 50} fill={selected ? wash(profile.color, "18") : SURFACE} stroke={selected ? profile.color : HAIRLINE} strokeWidth={selected ? 2.4 : 1.2} />
              <text x={node.x} y={node.y - 18} textAnchor="middle" fill={selected ? profile.color : INK_SECONDARY} fontSize="12" fontWeight="700" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                <tspan x={node.x} dy="0">{labelLines[0]}</tspan>
                <tspan x={node.x} dy="14">{labelLines[1]}</tspan>
              </text>
              <text x={node.x} y={node.y + 24} textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="600" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
                {marker}
              </text>
              <text x={node.x} y={node.y + 74} textAnchor="middle" fill={profile.color} fontSize="22" fontWeight="800" style={{ fontFamily: "var(--font-devanagari), serif" }}>
                {profile.devanagari}
              </text>
            </g>
          );
        })}

        <rect x="108" y="295" width="544" height="28" rx="14" fill={SURFACE} stroke={GOLD} />
        <text x="380" y="314" textAnchor="middle" fill={GOLD} fontSize="12" fontWeight="800" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
          Honest status: practitioner-reported folk practice, not proof.
        </text>
      </svg>
    </section>
  );
}

export function LalKitabEpistemicDisclosureLab() {
  const [activeAuthority, setActiveAuthority] = useState<AuthorityKey>("folk");
  const [claimIndex, setClaimIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, ClaimVerdict | null>>(() => Object.fromEntries(CLAIM_CARDS.map((claim) => [claim.id, null])));
  const authority = getAuthority(activeAuthority);
  const claim = CLAIM_CARDS[claimIndex];
  const selectedAnswer = answers[claim.id];
  const correctCount = useMemo(() => CLAIM_CARDS.filter((item) => answers[item.id] === item.verdict).length, [answers]);

  const answerClaim = (verdict: ClaimVerdict) => {
    setAnswers((current) => ({ ...current, [claim.id]: verdict }));
  };

  const reset = () => {
    setActiveAuthority("folk");
    setClaimIndex(0);
    setAnswers(Object.fromEntries(CLAIM_CARDS.map((item) => [item.id, null])));
  };

  return (
    <div
      className="w-full min-w-0"
      data-interactive="lal-kitab-epistemic-disclosure-lab"
      style={{
        maxWidth: "none",
        background: "var(--gl-surface-card, var(--gl-card-surface, #FFF9F0))",
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 16,
        padding: 20,
        color: INK_PRIMARY,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>
            Lal Kitab epistemic disclosure
          </p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Tell the truth without inflating or dismissing
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Classify authority claims, rewrite overclaims, and rehearse the client-facing disclosure for empirical-folk upayas.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset lab
        </button>
      </div>

      <section className="mb-4 grid min-w-0 gap-3 md:grid-cols-3">
        {AUTHORITY_PROFILES.map((profile) => {
          const selected = profile.key === activeAuthority;
          return (
            <button key={profile.key} type="button" onClick={() => setActiveAuthority(profile.key)} className="min-w-0 rounded-xl p-4 text-left" style={{ background: selected ? wash(profile.color, "12") : SURFACE, border: `1px solid ${selected ? profile.color : HAIRLINE}` }}>
              <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="m-0 text-xs font-black uppercase" style={{ color: profile.color, letterSpacing: "0.08em" }}>{profile.label}</p>
                  <p className="mb-0 mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>{profile.headline}</p>
                  <p className="m-0 text-xs" style={{ color: INK_SECONDARY }}>{profile.status === "present-modest" ? "Available, but modest" : "Do not claim this"}</p>
                </div>
                <AuthorityGlyph authorityKey={profile.key} size={22} color={profile.color} />
              </div>
            </button>
          );
        })}
      </section>

      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
        <div className="grid min-w-0 gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(authority.color, "10"), border: `1px solid ${authority.color}` }}>
            <div className="flex min-w-0 items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="m-0 text-xs font-bold uppercase" style={{ color: authority.color, letterSpacing: "0.08em" }}>Selected status</p>
                <h3 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
                  <IAST>{authority.headline}</IAST>
                </h3>
                <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{authority.detail}</p>
              </div>
              <Devanagari className="shrink-0 text-2xl font-bold" style={{ color: authority.color }}>{authority.devanagari}</Devanagari>
            </div>
          </article>

          <EpistemicStatusSvg active={activeAuthority} />
        </div>

        <aside className="grid min-w-0 gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck size={17} color={GOLD} />
                <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Claim score</p>
              </div>
              <span className="rounded-full px-3 py-1 text-sm font-bold" style={{ background: wash(GOLD, "12"), border: `1px solid ${HAIRLINE}`, color: GOLD }}>
                {correctCount} / {CLAIM_CARDS.length}
              </span>
            </div>
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>
              Refuse three inflation traps: ancient Vedic, scientifically proven, guaranteed outcome.
            </p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Disclosure sentence</p>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>
              This is a Lal Kitab empirical-folk remedy. Practitioners report benefit, but it is not scripture-derived, scientifically proven, or guaranteed.
            </p>
          </article>
        </aside>
      </section>

      <section className="mt-4 grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(300px,380px)]">
        <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle size={17} color={GOLD} />
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Classify the claim</p>
          </div>

          <div className="rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
            <p className="m-0 text-lg font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
              &ldquo;{claim.claim}&rdquo;
            </p>
          </div>

          <div className="mt-3 grid min-w-0 gap-2 sm:grid-cols-3">
            {(["honest", "overclaim", "dismissal"] as ClaimVerdict[]).map((verdict) => {
              const selected = selectedAnswer === verdict;
              const color = verdictColor(verdict);
              return (
                <button key={verdict} type="button" onClick={() => answerClaim(verdict)} className="min-w-0 rounded-lg px-3 py-2 text-sm font-bold" style={{ background: selected ? wash(color, "12") : SURFACE, border: `1px solid ${selected ? color : HAIRLINE}`, color: selected ? color : INK_SECONDARY }}>
                  {verdictLabel(verdict)}
                </button>
              );
            })}
          </div>

          {selectedAnswer ? (
            <div className="mt-3 rounded-xl p-4" style={{ background: wash(selectedAnswer === claim.verdict ? GREEN : VERMILION, "10"), border: `1px solid ${selectedAnswer === claim.verdict ? GREEN : VERMILION}` }}>
              <div className="mb-2 flex items-center gap-2">
                {selectedAnswer === claim.verdict ? <CheckCircle2 size={17} color={GREEN} /> : <CircleDot size={17} color={VERMILION} />}
                <p className="m-0 text-xs font-bold uppercase" style={{ color: selectedAnswer === claim.verdict ? GREEN : VERMILION, letterSpacing: "0.08em" }}>
                  {selectedAnswer === claim.verdict ? "Correct classification" : `Correct answer: ${verdictLabel(claim.verdict)}`}
                </p>
              </div>
              <p className="m-0 text-sm font-bold" style={{ color: INK_PRIMARY }}>{claim.honestRewrite}</p>
              <p className="mb-0 mt-2 text-xs" style={{ color: INK_SECONDARY }}>{claim.reason}</p>
            </div>
          ) : null}
        </article>

        <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Claim deck</p>
          <div className="mt-3 grid min-w-0 gap-2">
            {CLAIM_CARDS.map((item, index) => {
              const selected = claimIndex === index;
              const answered = answers[item.id] === item.verdict;
              return (
                <button key={item.id} type="button" onClick={() => setClaimIndex(index)} className="min-w-0 rounded-lg p-3 text-left text-sm font-bold" style={{ background: selected ? wash(verdictColor(item.verdict), "12") : SURFACE_2, border: `1px solid ${selected ? verdictColor(item.verdict) : HAIRLINE}`, color: selected ? verdictColor(item.verdict) : INK_SECONDARY }}>
                  <span className="mr-2">{answered ? "✓" : index + 1}</span>
                  {verdictLabel(item.verdict)}
                </button>
              );
            })}
          </div>
        </article>
      </section>

      <section className="mt-4 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Three-step client disclosure</p>
        <div className="mt-3 grid min-w-0 gap-3 lg:grid-cols-3">
          {DISCLOSURE_STEPS.map((step, index) => (
            <article key={step.label} className="min-w-0 rounded-xl p-4" style={{ background: wash(step.color, "0F"), border: `1px solid ${HAIRLINE}` }}>
              <p className="m-0 text-xs font-bold uppercase" style={{ color: step.color, letterSpacing: "0.08em" }}>Step {index + 1}: {step.label}</p>
              <p className="mb-0 mt-2 text-sm font-bold" style={{ color: INK_PRIMARY }}>{step.prompt}</p>
              <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{step.modelLine}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-4 rounded-xl p-4" style={{ background: wash(BLUE, "0F"), border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs font-bold uppercase" style={{ color: BLUE, letterSpacing: "0.08em" }}>Folk-medicine analogy</p>
        <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>
          Reported help may be meaningful, but uncontrolled success can come from many causes. It can encourage modest use; it cannot validate the whole doctrine.
        </p>
      </section>
    </div>
  );
}
