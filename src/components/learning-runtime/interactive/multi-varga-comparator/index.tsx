"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, BriefcaseBusiness, Car, GitCompare, Landmark, RotateCcw, ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import { useLessonSlug } from "../rashi-attribute-wheel";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const PURPLE = "#6A568E";

type Strength = "strong" | "weak";
type D12Tone = "blessing" | "mixed" | "afflicted";
type D1Tone = "supports" | "mixed" | "strained";

const SPIRITUAL_TRIO_SLUG = "the-spiritual-trio-d20-d27-d60-introduction";
const MARRIAGE_WORKFLOW_SLUG = "multi-varga-reading-marriage-d1-d9-d24-d60-workflow";
const CAREER_WORKFLOW_SLUG = "multi-varga-reading-career-d1-d10-d24-workflow";
const CHILDREN_WORKFLOW_SLUG = "multi-varga-reading-children-d1-d7-d9-workflow";

const PRESETS = [
  { label: "Both manifest", d1: "supports", d10: "strong", d16: "strong", d12: "blessing" },
  { label: "Workaholic", d1: "supports", d10: "strong", d16: "weak", d12: "mixed" },
  { label: "Inherited comforts", d1: "mixed", d10: "weak", d16: "strong", d12: "blessing" },
  { label: "Dual struggle", d1: "strained", d10: "weak", d16: "weak", d12: "afflicted" },
] as const;

const SPIRITUAL_PRESETS = [
  { label: "Willing spirit", d1: "supports", d20: "strong", d27: "weak", d60: "strong", birth: 5 },
  { label: "Good ground", d1: "mixed", d20: "weak", d27: "strong", d60: "strong", birth: 2 },
  { label: "Integrated support", d1: "supports", d20: "strong", d27: "strong", d60: "strong", birth: 1 },
  { label: "Confirmation only", d1: "strained", d20: "weak", d27: "weak", d60: "weak", birth: 7 },
] as const;

const CAREER_KARAKAS = {
  sun: { label: "Sun", role: "authority, leadership, government, visibility", color: GOLD },
  saturn: { label: "Saturn", role: "employment, service, duty, long effort", color: PURPLE },
  mercury: { label: "Mercury", role: "skill, commerce, speech, calculation", color: GREEN },
  mars: { label: "Mars", role: "technical work, engineering, action, tools", color: VERMILION },
} as const;

export function MultiVargaComparator() {
  const slug = useLessonSlug();
  if (slug === MARRIAGE_WORKFLOW_SLUG) return <MarriageWorkflowComparator />;
  if (slug === CAREER_WORKFLOW_SLUG) return <CareerWorkflowComparator />;
  if (slug === CHILDREN_WORKFLOW_SLUG) return <ChildrenWorkflowComparator />;
  return slug === SPIRITUAL_TRIO_SLUG ? <SpiritualTrioComparator /> : <CareerComfortComparator />;
}

function ChildrenWorkflowComparator() {
  const [d1, setD1] = useState<Strength>("strong");
  const [d7, setD7] = useState<Strength>("strong");
  const [d9, setD9] = useState<Strength>("strong");
  const [jupiterStrong, setJupiterStrong] = useState(true);
  const [showNoFear, setShowNoFear] = useState(true);
  const [showTier2, setShowTier2] = useState(true);

  const verdict = useMemo(() => getChildrenVerdict(d1, d7), [d1, d7]);
  const d9Text =
    d9 === "strong"
      ? "D9 gives supportive marriage context around the children question."
      : "D9 shows partnership context needs care, so it colours the children trajectory.";
  const jupiterText = jupiterStrong
    ? "Jupiter, the putra-karaka, supports the reading."
    : "Jupiter, the putra-karaka, asks for extra care and whole-chart support.";
  const statement = `${verdict.statement} ${jupiterText} ${d9Text} Keep the language supportive; count and timing go to Tier 2.`;

  const presets = [
    { label: "Supportive joy", d1: "strong", d7: "strong", d9: "strong", jupiter: true },
    { label: "Possible, delayed", d1: "strong", d7: "weak", d9: "strong", jupiter: false },
    { label: "D7 blessing", d1: "weak", d7: "strong", d9: "weak", jupiter: true },
    { label: "Needs care", d1: "weak", d7: "weak", d9: "weak", jupiter: false },
  ] as const;

  const reset = () => {
    setD1("strong");
    setD7("strong");
    setD9("strong");
    setJupiterStrong(true);
    setShowNoFear(true);
    setShowTier2(true);
  };

  return (
    <div data-interactive="multi-varga-comparator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={surfaceStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Children multi-varga workflow</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>D1 baseline, D7 primary, D9 marriage context</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Read the D1 5th first, then let the D7 carry the children judgment. D9 colours the partnership context, and Jupiter anchors the putra-karaka check.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, BLUE)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(340px, 1.08fr) minmax(320px, 0.92fr)", gap: "1rem", alignItems: "start" }}>
        <section style={surfaceStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>D1 x D7 synthesis matrix</p>
              <h3 style={{ margin: "0.2rem 0 0", color: verdict.color, fontSize: "1.2rem" }}>{verdict.short}</h3>
            </div>
            <strong style={{ color: d9 === "strong" ? GREEN : GOLD }}>D9 context: {d9 === "strong" ? "supportive" : "strained"}</strong>
          </div>

          <ChildrenWorkflowSvg d1={d1} d7={d7} d9={d9} jupiterStrong={jupiterStrong} color={verdict.color} />

          <div style={{ border: `1px solid ${verdict.color}66`, borderRadius: 8, background: `${verdict.color}12`, padding: "1rem" }}>
            <p style={eyebrowStyle}>Supportive synthesis</p>
            <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, fontSize: "1rem", fontWeight: 500 }}>{statement}</p>
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Try lesson examples" icon={<BadgeCheck size={18} />} color={BLUE}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setD1(preset.d1);
                    setD7(preset.d7);
                    setD9(preset.d9);
                    setJupiterStrong(preset.jupiter);
                  }}
                  style={buttonStyle(verdict.short === preset.label, BLUE)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="D1 and D7 core" icon={<GitCompare size={18} />} color={verdict.color}>
            <StrengthToggle label="D1 5th baseline" value={d1} onChange={setD1} strongText="Strong D1" weakText="Weak D1" color={GREEN} />
            <StrengthToggle label="D7 children chart" value={d7} onChange={setD7} strongText="Strong D7" weakText="Weak D7" color={BLUE} />
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5, fontSize: "1rem", fontWeight: 500 }}>The D7 carries the most weight for children; D1 alone is not enough.</p>
          </Panel>

          <Panel title="Jupiter putra-karaka" icon={<Sparkles size={18} />} color={jupiterStrong ? GREEN : GOLD}>
            <button type="button" onClick={() => setJupiterStrong((value) => !value)} style={buttonStyle(jupiterStrong, GREEN)}>
              {jupiterStrong ? "Jupiter supports" : "Jupiter needs care"}
            </button>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5, fontSize: "1rem", fontWeight: 500 }}>{jupiterText}</p>
          </Panel>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
        <Panel title="D9 marriage context" icon={<UsersRound size={18} />} color={d9 === "strong" ? GREEN : GOLD}>
          <StrengthToggle label="D9 partnership context" value={d9} onChange={setD9} strongText="Supportive D9" weakText="Strained D9" color={GREEN} />
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5, fontSize: "1rem", fontWeight: 500 }}>{d9Text}</p>
        </Panel>

        <Panel title="No-fear discipline" icon={<ShieldCheck size={18} />} color={showNoFear ? GREEN : GOLD}>
          <button type="button" onClick={() => setShowNoFear((value) => !value)} style={buttonStyle(showNoFear, GREEN)}>
            {showNoFear ? "No-fear visible" : "Show no-fear"}
          </button>
          {showNoFear ? (
            <div style={{ display: "grid", gap: "0.45rem" }}>
              {[
                "Never deliver a doom verdict.",
                "Describe tendencies, conditions, and care points.",
                "Weigh the whole chart before concern language.",
                "Refer medical questions appropriately.",
              ].map((item) => <EvidenceRow key={item}>{item}</EvidenceRow>)}
            </div>
          ) : (
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5, fontSize: "1rem", fontWeight: 500 }}>This is a sensitive domain; keep learner language gentle and conditional.</p>
          )}
        </Panel>

        <Panel title="Tier 2 boundary" icon={<Landmark size={18} />} color={showTier2 ? VERMILION : GOLD}>
          <button type="button" onClick={() => setShowTier2((value) => !value)} style={buttonStyle(showTier2, VERMILION)}>
            {showTier2 ? "Boundary visible" : "Show boundary"}
          </button>
          {showTier2 ? (
            <div style={{ display: "grid", gap: "0.45rem" }}>
              {[
                "Tier 1 gives nature and conditions.",
                "Count is not read here.",
                "Timing needs dashas and dedicated protocols.",
                "Children module detail is Tier 2.",
              ].map((item) => <EvidenceRow key={item}>{item}</EvidenceRow>)}
            </div>
          ) : (
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5, fontSize: "1rem", fontWeight: 500 }}>Keep this workflow away from count and timing.</p>
          )}
        </Panel>
      </div>
    </div>
  );
}

function CareerWorkflowComparator() {
  const [d1, setD1] = useState<Strength>("strong");
  const [d10, setD10] = useState<Strength>("strong");
  const [d24, setD24] = useState<Strength>("strong");
  const [karaka, setKaraka] = useState<"sun" | "saturn" | "mercury" | "mars">("sun");
  const [vargottamaKaraka, setVargottamaKaraka] = useState(true);
  const [educationDriven, setEducationDriven] = useState(true);
  const [showTier2, setShowTier2] = useState(true);

  const verdict = useMemo(() => getCareerVerdict(d1, d10), [d1, d10]);
  const karakaMeta = CAREER_KARAKAS[karaka];
  const d24Text = educationDriven
    ? d24 === "strong"
      ? "D24 supports an education-shaped career direction."
      : "D24 shows the education-shaped career needs repair, training, or clearer credentials."
    : "D24 is not forced because this scenario is not primarily education-driven.";
  const stabilityText = vargottamaKaraka
    ? `${karakaMeta.label} vargottama adds steadiness to the career indicator.`
    : `${karakaMeta.label} is not flagged vargottama, so the career indicator needs support from other evidence.`;
  const statement = `${verdict.statement} ${stabilityText} ${d24Text} Tier 1 gives strength and shape; exact field and timing go to Tier 2.`;

  const presets = [
    { label: "Career success", d1: "strong", d10: "strong", d24: "strong", education: true, vargottama: true, karaka: "sun" },
    { label: "Exists, no flourish", d1: "strong", d10: "weak", d24: "strong", education: true, vargottama: false, karaka: "saturn" },
    { label: "D10 rescues", d1: "weak", d10: "strong", d24: "weak", education: true, vargottama: true, karaka: "mercury" },
    { label: "Career struggle", d1: "weak", d10: "weak", d24: "weak", education: false, vargottama: false, karaka: "mars" },
  ] as const;

  const reset = () => {
    setD1("strong");
    setD10("strong");
    setD24("strong");
    setKaraka("sun");
    setVargottamaKaraka(true);
    setEducationDriven(true);
    setShowTier2(true);
  };

  return (
    <div data-interactive="multi-varga-comparator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={surfaceStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Career multi-varga workflow</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>D1 baseline, D10 primary, D24 education-shaped dimension</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Read the D1 10th first, then let the D10 carry the career judgment. Add D24 only where education, credentials, or learning shape the vocation.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, BLUE)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(340px, 1.08fr) minmax(320px, 0.92fr)", gap: "1rem", alignItems: "start" }}>
        <section style={surfaceStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>D1 x D10 synthesis matrix</p>
              <h3 style={{ margin: "0.2rem 0 0", color: verdict.color, fontSize: "1.2rem" }}>{verdict.short}</h3>
            </div>
            <strong style={{ color: educationDriven ? GREEN : GOLD }}>{educationDriven ? "D24 relevant" : "D24 optional"}</strong>
          </div>

          <CareerWorkflowSvg d1={d1} d10={d10} d24={d24} educationDriven={educationDriven} color={verdict.color} />

          <div style={{ border: `1px solid ${verdict.color}66`, borderRadius: 8, background: `${verdict.color}12`, padding: "1rem" }}>
            <p style={eyebrowStyle}>Career synthesis</p>
            <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{statement}</p>
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Try lesson examples" icon={<BadgeCheck size={18} />} color={BLUE}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setD1(preset.d1);
                    setD10(preset.d10);
                    setD24(preset.d24);
                    setEducationDriven(preset.education);
                    setVargottamaKaraka(preset.vargottama);
                    setKaraka(preset.karaka);
                  }}
                  style={buttonStyle(verdict.short === preset.label, BLUE)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="D1 and D10 core" icon={<GitCompare size={18} />} color={verdict.color}>
            <StrengthToggle label="D1 10th baseline" value={d1} onChange={setD1} strongText="Strong D1" weakText="Weak D1" color={GREEN} />
            <StrengthToggle label="D10 career chart" value={d10} onChange={setD10} strongText="Strong D10" weakText="Weak D10" color={BLUE} />
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>The D10 carries the most weight for career; D1 alone is not enough.</p>
          </Panel>

          <Panel title="Career karaka" icon={<BriefcaseBusiness size={18} />} color={karakaMeta.color}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {(Object.keys(CAREER_KARAKAS) as (keyof typeof CAREER_KARAKAS)[]).map((key) => (
                <button key={key} type="button" onClick={() => setKaraka(key)} style={buttonStyle(karaka === key, CAREER_KARAKAS[key].color)}>
                  {CAREER_KARAKAS[key].label}
                </button>
              ))}
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{karakaMeta.role}</p>
            <button type="button" onClick={() => setVargottamaKaraka((value) => !value)} style={buttonStyle(vargottamaKaraka, GREEN)}>
              {vargottamaKaraka ? "Vargottama karaka flagged" : "No vargottama flag"}
            </button>
          </Panel>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
        <Panel title="D24 education dimension" icon={<Sparkles size={18} />} color={educationDriven ? (d24 === "strong" ? GREEN : GOLD) : INK_MUTED}>
          <button type="button" onClick={() => setEducationDriven((value) => !value)} style={buttonStyle(educationDriven, GREEN)}>
            {educationDriven ? "Education shapes vocation" : "Do not force D24"}
          </button>
          <StrengthToggle label="D24 learning support" value={d24} onChange={setD24} strongText="Strong D24" weakText="Weak D24" color={GREEN} />
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{d24Text}</p>
        </Panel>

        <Panel title="Tier 2 boundary" icon={<ShieldCheck size={18} />} color={showTier2 ? VERMILION : GOLD}>
          <button type="button" onClick={() => setShowTier2((value) => !value)} style={buttonStyle(showTier2, VERMILION)}>
            {showTier2 ? "Boundary visible" : "Show boundary"}
          </button>
          {showTier2 ? (
            <div style={{ display: "grid", gap: "0.45rem" }}>
              {[
                "Tier 1 gives career strength and shape.",
                "Specific field identification is Tier 2.",
                "Career timing and changes need dashas.",
                "Vocational skill assessment is deferred.",
              ].map((item) => <EvidenceRow key={item}>{item}</EvidenceRow>)}
            </div>
          ) : (
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>Keep the lesson focused on strength and shape, not exact field or timing.</p>
          )}
        </Panel>

        <Panel title="Evidence discipline" icon={<Landmark size={18} />} color={GREEN}>
          <div style={{ display: "grid", gap: "0.45rem" }}>
            {[
              "D1: 10th house, 10th lord, and karakas.",
              "D10: career orientation, 10th-D10, lord, and karakas.",
              "D24: education-driven direction when relevant.",
            ].map((item) => <EvidenceRow key={item}>{item}</EvidenceRow>)}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function MarriageWorkflowComparator() {
  const [d1, setD1] = useState<Strength>("strong");
  const [d9, setD9] = useState<Strength>("strong");
  const [d24, setD24] = useState<Strength>("strong");
  const [d60, setD60] = useState<Strength>("weak");
  const [btrConfirmed, setBtrConfirmed] = useState(false);
  const [karaka, setKaraka] = useState<"venus" | "jupiter">("venus");
  const [vargottamaKaraka, setVargottamaKaraka] = useState(true);
  const [showBoundary, setShowBoundary] = useState(true);

  const verdict = useMemo(() => getMarriageVerdict(d1, d9), [d1, d9]);
  const d24Text =
    d24 === "strong"
      ? "D24 supports intellectual and educational compatibility."
      : "D24 asks for extra care around study, worldview, or intellectual rhythm.";
  const d60Text = btrConfirmed
    ? d60 === "strong"
      ? "D60 adds a supportive karmic-context note, used as substrate rather than destiny."
      : "D60 adds a heavier karmic-context note, still handled as substrate rather than destiny."
    : "D60 is omitted because birth-time rectification is not confirmed.";
  const karakaText = karaka === "venus" ? "Venus is used as spouse-karaka in a man's chart." : "Jupiter is used as spouse-karaka in a woman's chart.";
  const stabilityText = vargottamaKaraka
    ? `${karaka === "venus" ? "Venus" : "Jupiter"} vargottama adds a stable-marriage indicator.`
    : `${karaka === "venus" ? "Venus" : "Jupiter"} is not flagged vargottama, so stability must come from other evidence.`;
  const statement = `${verdict.statement} ${stabilityText} ${d24Text} ${d60Text} ${karakaText} Timing is deferred to the dashas.`;

  const presets = [
    { label: "Strong promise", d1: "strong", d9: "strong", d24: "strong", d60: "weak", btr: false, vargottama: true },
    { label: "Promise with strain", d1: "strong", d9: "weak", d24: "strong", d60: "weak", btr: false, vargottama: false },
    { label: "Delayed, improves", d1: "weak", d9: "strong", d24: "weak", d60: "strong", btr: true, vargottama: true },
    { label: "Needs care", d1: "weak", d9: "weak", d24: "weak", d60: "weak", btr: true, vargottama: false },
  ] as const;

  const reset = () => {
    setD1("strong");
    setD9("strong");
    setD24("strong");
    setD60("weak");
    setBtrConfirmed(false);
    setKaraka("venus");
    setVargottamaKaraka(true);
    setShowBoundary(true);
  };

  return (
    <div data-interactive="multi-varga-comparator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={surfaceStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Marriage multi-varga workflow</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>D1 baseline, D9 primary, D24 dimension, D60 gate</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Build the marriage synthesis in order: D1 proposes, D9 disposes, D24 adds compatibility, and D60 enters only when the birth time is rectified.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, BLUE)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(340px, 1.08fr) minmax(320px, 0.92fr)", gap: "1rem", alignItems: "start" }}>
        <section style={surfaceStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>D1 x D9 synthesis matrix</p>
              <h3 style={{ margin: "0.2rem 0 0", color: verdict.color, fontSize: "1.2rem" }}>{verdict.short}</h3>
            </div>
            <strong style={{ color: btrConfirmed ? PURPLE : GOLD }}>{btrConfirmed ? "D60 allowed" : "D60 omitted"}</strong>
          </div>

          <MarriageWorkflowSvg d1={d1} d9={d9} d24={d24} d60={d60} btrConfirmed={btrConfirmed} color={verdict.color} />

          <div style={{ border: `1px solid ${verdict.color}66`, borderRadius: 8, background: `${verdict.color}12`, padding: "1rem" }}>
            <p style={eyebrowStyle}>Supportive synthesis</p>
            <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{statement}</p>
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Try lesson examples" icon={<BadgeCheck size={18} />} color={BLUE}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setD1(preset.d1);
                    setD9(preset.d9);
                    setD24(preset.d24);
                    setD60(preset.d60);
                    setBtrConfirmed(preset.btr);
                    setVargottamaKaraka(preset.vargottama);
                  }}
                  style={buttonStyle(verdict.short === preset.label, BLUE)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="D1 and D9 core" icon={<GitCompare size={18} />} color={verdict.color}>
            <StrengthToggle label="D1 7th baseline" value={d1} onChange={setD1} strongText="Strong D1" weakText="Weak D1" color={GREEN} />
            <StrengthToggle label="D9 marriage chart" value={d9} onChange={setD9} strongText="Strong D9" weakText="Weak D9" color={BLUE} />
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>The D9 carries the most weight for marriage; never finalize from D1 alone.</p>
          </Panel>

          <Panel title="Spouse-karaka" icon={<UsersRound size={18} />} color={vargottamaKaraka ? GREEN : GOLD}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button type="button" onClick={() => setKaraka("venus")} style={buttonStyle(karaka === "venus", GREEN)}>Venus: male chart</button>
              <button type="button" onClick={() => setKaraka("jupiter")} style={buttonStyle(karaka === "jupiter", BLUE)}>Jupiter: female chart</button>
            </div>
            <button type="button" onClick={() => setVargottamaKaraka((value) => !value)} style={buttonStyle(vargottamaKaraka, GREEN)}>
              {vargottamaKaraka ? "Vargottama karaka flagged" : "No vargottama flag"}
            </button>
          </Panel>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
        <Panel title="D24 compatibility" icon={<Sparkles size={18} />} color={d24 === "strong" ? GREEN : GOLD}>
          <StrengthToggle label="D24 intellectual match" value={d24} onChange={setD24} strongText="Compatible" weakText="Needs care" color={GREEN} />
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{d24Text}</p>
        </Panel>

        <Panel title="D60 birth-time gate" icon={<Landmark size={18} />} color={btrConfirmed ? PURPLE : VERMILION}>
          <button type="button" onClick={() => setBtrConfirmed((value) => !value)} style={buttonStyle(btrConfirmed, PURPLE)}>
            {btrConfirmed ? "Birth time rectified" : "Birth time not rectified"}
          </button>
          <StrengthToggle label="D60 karmic context" value={d60} onChange={setD60} strongText="Supportive context" weakText="Heavy context" color={PURPLE} />
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{d60Text}</p>
        </Panel>

        <Panel title="Reading boundary" icon={<ShieldCheck size={18} />} color={showBoundary ? GREEN : GOLD}>
          <button type="button" onClick={() => setShowBoundary((value) => !value)} style={buttonStyle(showBoundary, GREEN)}>
            {showBoundary ? "Boundary visible" : "Show boundary"}
          </button>
          {showBoundary ? (
            <div style={{ display: "grid", gap: "0.45rem" }}>
              {[
                "Use supportive language: describe conditions and care points.",
                "Do not say never married or guarantee a result.",
                "Do not time marriage here; dashas are Tier 2.",
                "Name which varga supports each point.",
              ].map((item) => <EvidenceRow key={item}>{item}</EvidenceRow>)}
            </div>
          ) : (
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>The workflow is interpretive and supportive, not fatalistic.</p>
          )}
        </Panel>
      </div>
    </div>
  );
}

function CareerComfortComparator() {
  const [d1Tone, setD1Tone] = useState<D1Tone>("supports");
  const [d10, setD10] = useState<Strength>("strong");
  const [d16, setD16] = useState<Strength>("weak");
  const [d12, setD12] = useState<D12Tone>("mixed");
  const [showEvidence, setShowEvidence] = useState(true);

  const verdict = useMemo(() => getMatrixVerdict(d10, d16), [d10, d16]);
  const d12Effect = getD12Effect(d12);
  const d1Effect = getD1Effect(d1Tone);
  const statement = `${verdict.claim} (${verdict.evidence}). ${d12Effect.statement}. ${d1Effect.statement}. Honest synthesis: ${verdict.short}; D12 ${d12Effect.verb}; D1 ${d1Effect.verb}.`;

  const reset = () => {
    setD1Tone("supports");
    setD10("strong");
    setD16("weak");
    setD12("mixed");
    setShowEvidence(true);
  };

  return (
    <div data-interactive="multi-varga-comparator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={surfaceStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Multi-varga comparator</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>D1, D10, D12, D16 in one honest sentence</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 880 }}>
              Toggle the four chart layers. The matrix reads career versus comforts, then D12 modulates through parents and D1 anchors the whole statement.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, BLUE)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(340px, 1.04fr) minmax(320px, 0.96fr)", gap: "1rem", alignItems: "start" }}>
        <section style={surfaceStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>D10 x D16 matrix</p>
              <h3 style={{ margin: "0.2rem 0 0", color: verdict.color, fontSize: "1.2rem" }}>{verdict.short}</h3>
            </div>
            <strong style={{ color: d12Effect.color }}>D12: {d12Effect.label}</strong>
          </div>

          <MatrixSvg d10={d10} d16={d16} color={verdict.color} />

          <div style={{ border: `1px solid ${verdict.color}66`, borderRadius: 8, background: `${verdict.color}12`, padding: "1rem" }}>
            <p style={eyebrowStyle}>Combined statement</p>
            <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{statement}</p>
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Try lesson examples" icon={<BadgeCheck size={18} />} color={BLUE}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setD1Tone(preset.d1);
                    setD10(preset.d10);
                    setD16(preset.d16);
                    setD12(preset.d12);
                  }}
                  style={buttonStyle(verdict.short === preset.label, BLUE)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Career and comforts" icon={<GitCompare size={18} />} color={PURPLE}>
            <StrengthToggle label="D10 career" value={d10} onChange={setD10} strongText="Strong career" weakText="Weak career" color={BLUE} />
            <StrengthToggle label="D16 comforts" value={d16} onChange={setD16} strongText="Strong comforts" weakText="Weak comforts" color={GREEN} />
          </Panel>

          <Panel title="D12 modulation" icon={<UsersRound size={18} />} color={d12Effect.color}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {(["blessing", "mixed", "afflicted"] as D12Tone[]).map((tone) => (
                <button key={tone} type="button" onClick={() => setD12(tone)} style={buttonStyle(d12 === tone, getD12Effect(tone).color)}>
                  {getD12Effect(tone).label}
                </button>
              ))}
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{d12Effect.statement}</p>
          </Panel>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
        <Panel title="D1 baseline" icon={<ShieldCheck size={18} />} color={d1Effect.color}>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {(["supports", "mixed", "strained"] as D1Tone[]).map((tone) => (
              <button key={tone} type="button" onClick={() => setD1Tone(tone)} style={buttonStyle(d1Tone === tone, getD1Effect(tone).color)}>
                {getD1Effect(tone).label}
              </button>
            ))}
          </div>
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{d1Effect.statement}</p>
        </Panel>

        <Panel title="Evidence discipline" icon={<BriefcaseBusiness size={18} />} color={showEvidence ? GREEN : GOLD}>
          <button type="button" onClick={() => setShowEvidence((value) => !value)} style={buttonStyle(showEvidence, GREEN)}>
            {showEvidence ? "Evidence named" : "Hide checklist"}
          </button>
          {showEvidence ? (
            <div style={{ display: "grid", gap: "0.45rem" }}>
              {[
                "D1 gives the baseline promise.",
                "D10 supports the career conclusion.",
                "D16 supports the comfort conclusion.",
                "D12 modifies through parental blessing or difficulty.",
              ].map((item) => <EvidenceRow key={item}>{item}</EvidenceRow>)}
            </div>
          ) : (
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>Do not collapse the charts into one undifferentiated verdict.</p>
          )}
        </Panel>

        <Panel title="Reading boundary" icon={<Car size={18} />} color={VERMILION}>
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
            This is a synthesis trainer. It does not compute a birth chart; it teaches how to reconcile convergence and divergence while naming the supporting varga.
          </p>
        </Panel>
      </div>
    </div>
  );
}

function SpiritualTrioComparator() {
  const [d1Tone, setD1Tone] = useState<D1Tone>("supports");
  const [d20, setD20] = useState<Strength>("strong");
  const [d27, setD27] = useState<Strength>("weak");
  const [d60, setD60] = useState<Strength>("strong");
  const [birthNudge, setBirthNudge] = useState(5);
  const [showWorkflow, setShowWorkflow] = useState(true);

  const d1Effect = getD1Effect(d1Tone);
  const synthesis = useMemo(() => getSpiritualSynthesis(d1Tone, d20, d27, d60, birthNudge), [birthNudge, d1Tone, d20, d27, d60]);
  const cautionColor = birthNudge >= 4 ? VERMILION : birthNudge >= 2 ? GOLD : GREEN;

  const reset = () => {
    setD1Tone("supports");
    setD20("strong");
    setD27("weak");
    setD60("strong");
    setBirthNudge(5);
    setShowWorkflow(true);
  };

  return (
    <div data-interactive="multi-varga-comparator" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={surfaceStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Spiritual trio comparator</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>D1-12th, D20, D27, D60 in one descriptive map</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Compare practice, life-force, and karmic substrate without collapsing them. The goal is to name the layer, describe the support, and keep the moksha reading non-prescriptive.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, BLUE)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(340px, 1.05fr) minmax(320px, 0.95fr)", gap: "1rem", alignItems: "start" }}>
        <section style={surfaceStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Four-layer moksha workflow</p>
              <h3 style={{ margin: "0.2rem 0 0", color: synthesis.color, fontSize: "1.2rem" }}>{synthesis.short}</h3>
            </div>
            <strong style={{ color: cautionColor }}>{birthNudge >= 4 ? "Confirmation only" : "Usable teaching sample"}</strong>
          </div>

          <SpiritualWorkflowSvg d1Tone={d1Tone} d20={d20} d27={d27} d60={d60} birthNudge={birthNudge} />

          <div style={{ border: `1px solid ${synthesis.color}66`, borderRadius: 8, background: `${synthesis.color}12`, padding: "1rem" }}>
            <p style={eyebrowStyle}>Combined statement</p>
            <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{synthesis.statement}</p>
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Try lesson examples" icon={<BadgeCheck size={18} />} color={BLUE}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {SPIRITUAL_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setD1Tone(preset.d1);
                    setD20(preset.d20);
                    setD27(preset.d27);
                    setD60(preset.d60);
                    setBirthNudge(preset.birth);
                  }}
                  style={buttonStyle(synthesis.short === preset.label, BLUE)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Practice and vehicle" icon={<GitCompare size={18} />} color={PURPLE}>
            <StrengthToggle label="D20 practice" value={d20} onChange={setD20} strongText="Committed practice" weakText="Little practice" color={BLUE} />
            <StrengthToggle label="D27 life-force" value={d27} onChange={setD27} strongText="Stamina supports" weakText="Vehicle tires" color={GREEN} />
          </Panel>

          <Panel title="D60 substrate preview" icon={<Landmark size={18} />} color={d60 === "strong" ? GREEN : VERMILION}>
            <StrengthToggle label="D60 karmic ground" value={d60} onChange={setD60} strongText="Supportive ground" weakText="Heavy substrate" color={GREEN} />
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>D60 is previewed here only as the deepest inherited substrate. The full D60 method comes in Chapter 7.</p>
          </Panel>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem" }}>
        <Panel title="D1 12th and Ketu baseline" icon={<ShieldCheck size={18} />} color={d1Effect.color}>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {(["supports", "mixed", "strained"] as D1Tone[]).map((tone) => (
              <button key={tone} type="button" onClick={() => setD1Tone(tone)} style={buttonStyle(d1Tone === tone, getD1Effect(tone).color)}>
                {getD1Effect(tone).label}
              </button>
            ))}
          </div>
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{d1Effect.statement} In this lesson, D1 means the 12th house, its lord, and Ketu.</p>
        </Panel>

        <Panel title="Birth-time caveat" icon={<Sparkles size={18} />} color={cautionColor}>
          <label style={{ display: "grid", gap: "0.45rem", color: INK_SECONDARY, fontWeight: 700 }}>
            Time uncertainty: {birthNudge} min
            <input
              type="range"
              min={0}
              max={8}
              value={birthNudge}
              onChange={(event) => setBirthNudge(Number(event.target.value))}
              style={{ width: "100%", accentColor: cautionColor }}
            />
          </label>
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
            {birthNudge >= 4 ? "D27 and D60 are fine vargas. With rough time, use the trio as confirmation, not primary prediction." : "Good enough for the teaching model, but real D27/D60 work still deserves careful birth time."}
          </p>
        </Panel>

        <Panel title="Evidence discipline" icon={<BriefcaseBusiness size={18} />} color={showWorkflow ? GREEN : GOLD}>
          <button type="button" onClick={() => setShowWorkflow((value) => !value)} style={buttonStyle(showWorkflow, GREEN)}>
            {showWorkflow ? "Workflow named" : "Show checklist"}
          </button>
          {showWorkflow ? (
            <div style={{ display: "grid", gap: "0.45rem" }}>
              {[
                "D1-12th plus Ketu gives the baseline.",
                "D20 names the active practice.",
                "D27 names the vehicle and stamina.",
                "D60 names the substrate, deferred for full detail.",
              ].map((item) => <EvidenceRow key={item}>{item}</EvidenceRow>)}
            </div>
          ) : (
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>The three vargas are distinct, not redundant.</p>
          )}
        </Panel>

        <Panel title="Reading boundary" icon={<Car size={18} />} color={VERMILION}>
          <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
            This trainer is descriptive, not prescriptive. It never pronounces salvation, destiny, or spiritual worth; it only names tendencies and supports.
          </p>
        </Panel>
      </div>
    </div>
  );
}

function MatrixSvg({ d10, d16, color }: { d10: Strength; d16: Strength; color: string }) {
  const cells = [
    { x: 310, y: 86, d10: "strong", d16: "strong", label: "Both manifest", text: "career + comforts" },
    { x: 86, y: 86, d10: "weak", d16: "strong", label: "Inherited comforts", text: "comforts lead" },
    { x: 310, y: 202, d10: "strong", d16: "weak", label: "Workaholic", text: "career leads" },
    { x: 86, y: 202, d10: "weak", d16: "weak", label: "Dual struggle", text: "both strained" },
  ] as const;

  return (
    <svg viewBox="0 0 620 340" role="img" aria-label="D10 and D16 synthesis matrix" style={svgStyle}>
      <rect x="34" y="34" width="552" height="264" rx="8" fill={`${GOLD}08`} stroke={HAIRLINE} />
      <text x="310" y="62" textAnchor="middle" fill={INK_MUTED} fontSize="13" fontWeight="750">D10 career strength crossed with D16 comfort strength</text>
      <text x="310" y="320" textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="650">D12 does not replace this matrix; it modulates the result.</text>
      <text x="50" y="88" fill={GREEN} fontSize="12.5" fontWeight="800">D16 strong</text>
      <text x="50" y="250" fill={VERMILION} fontSize="12.5" fontWeight="800">D16 weak</text>
      <text x="148" y="286" fill={VERMILION} fontSize="12.5" fontWeight="800">D10 weak</text>
      <text x="412" y="286" fill={BLUE} fontSize="12.5" fontWeight="800">D10 strong</text>
      {cells.map((cell) => {
        const active = d10 === cell.d10 && d16 === cell.d16;
        return (
          <g key={cell.label}>
            <rect x={cell.x} y={cell.y} width="206" height="86" rx="8" fill={active ? `${color}22` : "rgba(255,251,241,0.64)"} stroke={active ? color : HAIRLINE} strokeWidth={active ? 3 : 1.2} />
            <text x={cell.x + 103} y={cell.y + 34} textAnchor="middle" fill={active ? color : INK_PRIMARY} fontSize="14" fontWeight="800">{cell.label}</text>
            <text x={cell.x + 103} y={cell.y + 58} textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="650">{cell.text}</text>
          </g>
        );
      })}
    </svg>
  );
}

function SpiritualWorkflowSvg({ d1Tone, d20, d27, d60, birthNudge }: { d1Tone: D1Tone; d20: Strength; d27: Strength; d60: Strength; birthNudge: number }) {
  const d1 = getD1Effect(d1Tone);
  const layers = [
    { x: 72, key: "D1", role: "baseline", question: "12th + Ketu", color: d1.color, active: d1Tone === "supports" },
    { x: 212, key: "D20", role: "practice", question: "what you do", color: d20 === "strong" ? BLUE : VERMILION, active: d20 === "strong" },
    { x: 352, key: "D27", role: "vehicle", question: "what carries it", color: d27 === "strong" ? GREEN : VERMILION, active: d27 === "strong" },
    { x: 492, key: "D60", role: "substrate", question: "what ground", color: d60 === "strong" ? PURPLE : VERMILION, active: d60 === "strong" },
  ] as const;
  const caution = birthNudge >= 4;

  return (
    <svg viewBox="0 0 620 360" role="img" aria-label="D1 D20 D27 D60 moksha workflow" style={svgStyle}>
      <rect x="34" y="34" width="552" height="280" rx="8" fill={`${GOLD}08`} stroke={HAIRLINE} />
      <text x="310" y="62" textAnchor="middle" fill={INK_MUTED} fontSize="13" fontWeight="750">Four layers, one descriptive moksha workflow</text>
      <line x1="108" y1="162" x2="492" y2="162" stroke={`${GOLD}88`} strokeWidth="4" strokeLinecap="round" />
      {layers.map((layer, index) => (
        <g key={layer.key}>
          {index > 0 ? <path d={`M ${layer.x - 54} 162 C ${layer.x - 32} 132, ${layer.x - 22} 132, ${layer.x - 4} 162`} fill="none" stroke={layer.color} strokeWidth="2" opacity="0.54" /> : null}
          <circle cx={layer.x} cy="162" r={layer.active ? 52 : 46} fill={`${layer.color}18`} stroke={layer.color} strokeWidth={layer.active ? 4 : 2} />
          <text x={layer.x} y="143" textAnchor="middle" fill={layer.color} fontSize="18" fontWeight="800">{layer.key}</text>
          <text x={layer.x} y="166" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="750">{layer.role}</text>
          <text x={layer.x} y="187" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="650">{layer.question}</text>
        </g>
      ))}
      <text x="310" y="270" textAnchor="middle" fill={caution ? VERMILION : GREEN} fontSize="12" fontWeight="800">
        {caution ? "Rough time: use D27/D60 as confirmation." : "Name each layer; do not collapse the vargas."}
      </text>
      <text x="310" y="296" textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="650">
        Spiritual reading is descriptive: tendencies and supports, never a verdict.
      </text>
    </svg>
  );
}

function MarriageWorkflowSvg({ d1, d9, d24, d60, btrConfirmed, color }: { d1: Strength; d9: Strength; d24: Strength; d60: Strength; btrConfirmed: boolean; color: string }) {
  const d60Color = btrConfirmed ? (d60 === "strong" ? PURPLE : VERMILION) : VERMILION;
  const layers = [
    { x: 76, key: "D1", role: "baseline", question: "7th + lord + karaka", color: d1 === "strong" ? GREEN : VERMILION, active: d1 === "strong" },
    { x: 216, key: "D9", role: "primary", question: "marriage chart", color: d9 === "strong" ? BLUE : VERMILION, active: d9 === "strong" },
    { x: 356, key: "D24", role: "compatibility", question: "intellectual match", color: d24 === "strong" ? GREEN : GOLD, active: d24 === "strong" },
    { x: 496, key: "D60", role: "BTR-only", question: btrConfirmed ? "karmic context" : "withheld", color: d60Color, active: btrConfirmed },
  ] as const;

  return (
    <svg viewBox="0 0 620 360" role="img" aria-label="D1 D9 D24 D60 marriage workflow" style={svgStyle}>
      <rect x="34" y="34" width="552" height="280" rx="8" fill={`${GOLD}08`} stroke={HAIRLINE} />
      <text x="310" y="62" textAnchor="middle" fill={INK_MUTED} fontSize="13" fontWeight="750">Marriage workflow: each varga read with D1; D9 carries the most weight</text>
      <line x1="102" y1="164" x2="496" y2="164" stroke={`${GOLD}88`} strokeWidth="4" strokeLinecap="round" />
      {layers.map((layer, index) => (
        <g key={layer.key}>
          {index > 0 ? <path d={`M ${layer.x - 56} 164 C ${layer.x - 34} 134, ${layer.x - 22} 134, ${layer.x - 5} 164`} fill="none" stroke={layer.color} strokeWidth="2" opacity="0.55" /> : null}
          <circle cx={layer.x} cy="164" r={layer.active ? 52 : 45} fill={`${layer.color}${layer.key === "D60" && !btrConfirmed ? "12" : "18"}`} stroke={layer.color} strokeWidth={layer.active ? 4 : 2} />
          <text x={layer.x} y="144" textAnchor="middle" fill={layer.color} fontSize="18" fontWeight="800">{layer.key}</text>
          <text x={layer.x} y="168" textAnchor="middle" fill={INK_PRIMARY} fontSize="12.5" fontWeight="750">{layer.role}</text>
          <text x={layer.x} y="189" textAnchor="middle" fill={layer.key === "D60" && !btrConfirmed ? VERMILION : INK_SECONDARY} fontSize="11.5" fontWeight="650">{layer.question}</text>
        </g>
      ))}
      <rect x="136" y="248" width="348" height="38" rx="8" fill={`${color}14`} stroke={`${color}66`} />
      <text x="310" y="272" textAnchor="middle" fill={color} fontSize="13" fontWeight="800">D1 x D9 gives the core matrix; D24 and D60 are layers, not replacements.</text>
      <text x="310" y="316" textAnchor="middle" fill={btrConfirmed ? PURPLE : VERMILION} fontSize="12" fontWeight="750">
        {btrConfirmed ? "D60 gate open: read substrate, not destiny." : "D60 gate closed: omit karmic context on rough time."}
      </text>
    </svg>
  );
}

function CareerWorkflowSvg({ d1, d10, d24, educationDriven, color }: { d1: Strength; d10: Strength; d24: Strength; educationDriven: boolean; color: string }) {
  const layers = [
    { x: 96, key: "D1", role: "baseline", question: "10th + lord + karakas", color: d1 === "strong" ? GREEN : VERMILION, active: d1 === "strong" },
    { x: 310, key: "D10", role: "primary", question: "career chart", color: d10 === "strong" ? BLUE : VERMILION, active: d10 === "strong" },
    { x: 524, key: "D24", role: "education", question: "learning-shaped field", color: educationDriven ? (d24 === "strong" ? GREEN : GOLD) : INK_MUTED, active: educationDriven && d24 === "strong" },
  ] as const;

  return (
    <svg viewBox="0 0 620 360" role="img" aria-label="D1 D10 D24 career workflow" style={svgStyle}>
      <rect x="34" y="34" width="552" height="280" rx="8" fill={`${GOLD}08`} stroke={HAIRLINE} />
      <text x="310" y="62" textAnchor="middle" fill={INK_MUTED} fontSize="13" fontWeight="750">Career workflow: D1 baseline, D10 primary, D24 where education shapes vocation</text>
      <line x1="122" y1="164" x2="524" y2="164" stroke={`${GOLD}88`} strokeWidth="4" strokeLinecap="round" />
      {layers.map((layer, index) => (
        <g key={layer.key}>
          {index > 0 ? <path d={`M ${layer.x - 82} 164 C ${layer.x - 56} 130, ${layer.x - 28} 130, ${layer.x - 6} 164`} fill="none" stroke={layer.color} strokeWidth="2" opacity="0.55" /> : null}
          <circle cx={layer.x} cy="164" r={layer.active ? 56 : 48} fill={`${layer.color}18`} stroke={layer.color} strokeWidth={layer.active ? 4 : 2} />
          <text x={layer.x} y="143" textAnchor="middle" fill={layer.color} fontSize="19" fontWeight="800">{layer.key}</text>
          <text x={layer.x} y="168" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="750">{layer.role}</text>
          <text x={layer.x} y="190" textAnchor="middle" fill={INK_SECONDARY} fontSize="11.5" fontWeight="650">{layer.question}</text>
        </g>
      ))}
      <rect x="132" y="248" width="356" height="38" rx="8" fill={`${color}14`} stroke={`${color}66`} />
      <text x="310" y="272" textAnchor="middle" fill={color} fontSize="13" fontWeight="800">D1 x D10 gives strength and shape; D24 is a relevant dimension, not the boss.</text>
      <text x="310" y="316" textAnchor="middle" fill={VERMILION} fontSize="12" fontWeight="750">
        Exact field and timing are Tier 2 career work.
      </text>
    </svg>
  );
}

function ChildrenWorkflowSvg({ d1, d7, d9, jupiterStrong, color }: { d1: Strength; d7: Strength; d9: Strength; jupiterStrong: boolean; color: string }) {
  const layers = [
    { x: 96, key: "D1", role: "baseline", question: "5th + lord + Jupiter", color: d1 === "strong" ? GREEN : VERMILION, active: d1 === "strong" },
    { x: 310, key: "D7", role: "primary", question: "children chart", color: d7 === "strong" ? BLUE : VERMILION, active: d7 === "strong" },
    { x: 524, key: "D9", role: "context", question: "marriage setting", color: d9 === "strong" ? GREEN : GOLD, active: d9 === "strong" },
  ] as const;

  return (
    <svg viewBox="0 0 620 372" role="img" aria-label="D1 D7 D9 children workflow" style={svgStyle}>
      <rect x="34" y="34" width="552" height="294" rx="8" fill={`${GOLD}08`} stroke={HAIRLINE} />
      <text x="310" y="62" textAnchor="middle" fill={INK_MUTED} fontSize="13" fontWeight="750">Children workflow: D1 baseline, D7 primary, D9 marriage context</text>
      <line x1="122" y1="164" x2="524" y2="164" stroke={`${GOLD}88`} strokeWidth="4" strokeLinecap="round" />
      {layers.map((layer, index) => (
        <g key={layer.key}>
          {index > 0 ? <path d={`M ${layer.x - 82} 164 C ${layer.x - 56} 130, ${layer.x - 28} 130, ${layer.x - 6} 164`} fill="none" stroke={layer.color} strokeWidth="2" opacity="0.55" /> : null}
          <circle cx={layer.x} cy="164" r={layer.active ? 56 : 48} fill={`${layer.color}18`} stroke={layer.color} strokeWidth={layer.active ? 4 : 2} />
          <text x={layer.x} y="143" textAnchor="middle" fill={layer.color} fontSize="19" fontWeight="800">{layer.key}</text>
          <text x={layer.x} y="168" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight="750">{layer.role}</text>
          <text x={layer.x} y="190" textAnchor="middle" fill={INK_SECONDARY} fontSize="11.5" fontWeight="650">{layer.question}</text>
        </g>
      ))}
      <circle cx="310" cy="248" r="26" fill={`${jupiterStrong ? GREEN : GOLD}18`} stroke={jupiterStrong ? GREEN : GOLD} strokeWidth="3" />
      <text x="310" y="254" textAnchor="middle" fill={jupiterStrong ? GREEN : GOLD} fontSize="15" fontWeight="800">Ju</text>
      <rect x="138" y="290" width="344" height="38" rx="8" fill={`${color}14`} stroke={`${color}66`} />
      <text x="310" y="314" textAnchor="middle" fill={color} fontSize="13" fontWeight="800">D1 x D7 gives the core; D9 modulates the partnership context.</text>
      <text x="310" y="352" textAnchor="middle" fill={VERMILION} fontSize="12" fontWeight="750">
        No doom verdicts. Count and timing are Tier 2.
      </text>
    </svg>
  );
}

function StrengthToggle({ label, value, onChange, strongText, weakText, color }: { label: string; value: Strength; onChange: (value: Strength) => void; strongText: string; weakText: string; color: string }) {
  return (
    <div style={{ display: "grid", gap: "0.45rem" }}>
      <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</p>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <button type="button" onClick={() => onChange("strong")} style={buttonStyle(value === "strong", color)}>{strongText}</button>
        <button type="button" onClick={() => onChange("weak")} style={buttonStyle(value === "weak", VERMILION)}>{weakText}</button>
      </div>
    </div>
  );
}

function EvidenceRow({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "flex", gap: "0.45rem", alignItems: "flex-start", color: INK_SECONDARY, fontWeight: 600, fontSize: "1rem", lineHeight: 1.45 }}>
      <BadgeCheck size={15} color={GREEN} aria-hidden="true" />
      {children}
    </div>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 800, fontSize: "1.05rem", lineHeight: 1.3 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem", display: "grid", gap: "0.7rem", fontSize: "1rem", lineHeight: 1.5 }}>{children}</div>
    </section>
  );
}

function getMatrixVerdict(d10: Strength, d16: Strength) {
  if (d10 === "strong" && d16 === "strong") {
    return { short: "Both manifest", color: GREEN, claim: "Career success and material comfort both manifest", evidence: "D10 is strong and D16 is strong" };
  }
  if (d10 === "strong" && d16 === "weak") {
    return { short: "Workaholic", color: GOLD, claim: "Professional success is stronger than comfort", evidence: "D10 is strong while D16 is weak" };
  }
  if (d10 === "weak" && d16 === "strong") {
    return { short: "Inherited comforts", color: BLUE, claim: "Comforts are present without a strong personal-career signature", evidence: "D10 is weak while D16 is strong" };
  }
  return { short: "Dual struggle", color: VERMILION, claim: "Career and comforts both need careful handling", evidence: "D10 is weak and D16 is weak" };
}

function getD12Effect(tone: D12Tone) {
  if (tone === "blessing") return { label: "Blessing", color: GREEN, verb: "strengthens the path", statement: "D12 shows parental blessing, which strengthens the career-and-comforts synthesis." };
  if (tone === "afflicted") return { label: "Afflicted", color: VERMILION, verb: "complicates the path", statement: "D12 shows parental difficulty, which complicates or weakens the otherwise stated result." };
  return { label: "Mixed", color: GOLD, verb: "adds nuance", statement: "D12 is mixed, so parental influence is named as nuance rather than a clean boost or block." };
}

function getD1Effect(tone: D1Tone) {
  if (tone === "supports") return { label: "D1 supports", color: GREEN, verb: "confirms the baseline", statement: "D1 supports the baseline promise, so the varga reading has a stable foundation." };
  if (tone === "strained") return { label: "D1 strained", color: VERMILION, verb: "limits the baseline", statement: "D1 is strained, so the vargas qualify a pressured base rather than overriding it." };
  return { label: "Mixed D1", color: GOLD, verb: "qualifies the baseline", statement: "D1 is mixed, so the vargas refine a non-simple baseline." };
}

function getMarriageVerdict(d1: Strength, d9: Strength) {
  if (d1 === "strong" && d9 === "strong") {
    return { short: "Strong promise", color: GREEN, statement: "D1 and D9 both support the marriage question, so the promise and depth agree." };
  }
  if (d1 === "strong" && d9 === "weak") {
    return { short: "Promise with strain", color: GOLD, statement: "D1 supports marriage, but D9 weakens the depth, so describe marriage with trouble or care points." };
  }
  if (d1 === "weak" && d9 === "strong") {
    return { short: "Delayed, improves", color: BLUE, statement: "D1 is weak while D9 is strong, so the surface may delay or strain, but the deeper marriage chart can improve the result." };
  }
  return { short: "Needs care", color: VERMILION, statement: "D1 and D9 are both weak, so frame the marriage question as challenging or delayed without fatalistic verdicts." };
}

function getCareerVerdict(d1: Strength, d10: Strength) {
  if (d1 === "strong" && d10 === "strong") {
    return { short: "Career success", color: GREEN, statement: "D1 and D10 both support career, so the baseline and primary career chart agree." };
  }
  if (d1 === "strong" && d10 === "weak") {
    return { short: "Exists, no flourish", color: GOLD, statement: "D1 supports career, but D10 is weak, so career exists without the same flourish or professional lift." };
  }
  if (d1 === "weak" && d10 === "strong") {
    return { short: "D10 rescues", color: BLUE, statement: "D1 looks mediocre, but D10 is strong, so the career can flourish despite the surface weakness." };
  }
  return { short: "Career struggle", color: VERMILION, statement: "D1 and D10 are both weak, so describe career struggle and needed support without naming a fatal outcome." };
}

function getChildrenVerdict(d1: Strength, d7: Strength) {
  if (d1 === "strong" && d7 === "strong") {
    return { short: "Supportive joy", color: GREEN, statement: "D1 and D7 both support the children question, so the baseline and primary children chart agree." };
  }
  if (d1 === "strong" && d7 === "weak") {
    return { short: "Possible, delayed", color: GOLD, statement: "D1 supports children, but D7 is weak, so describe possible delay or difficulty as care points." };
  }
  if (d1 === "weak" && d7 === "strong") {
    return { short: "D7 blessing", color: BLUE, statement: "D1 looks mediocre, but D7 is strong, so children blessings may come despite the surface weakness." };
  }
  return { short: "Needs care", color: VERMILION, statement: "D1 and D7 are both weak, so frame the children question as challenging or delayed without a doom verdict." };
}

function getSpiritualSynthesis(d1Tone: D1Tone, d20: Strength, d27: Strength, d60: Strength, birthNudge: number) {
  const caution = birthNudge >= 4 ? " Because the time is rough, especially for D27 and D60, treat this as confirmation rather than primary prediction." : "";
  const boundary = " Keep the reading descriptive: name tendencies and supports, never a moksha verdict.";
  const d1 = d1Tone === "supports" ? "D1-12th and Ketu support the baseline" : d1Tone === "strained" ? "D1-12th and Ketu are strained" : "D1-12th and Ketu are mixed";

  if (d20 === "strong" && d27 === "weak") {
    return {
      short: "Willing spirit",
      color: GOLD,
      statement: `${d1}. D20 is strong, so practice and devotion are active; D27 is weak, so the life-force vehicle tires. D60 ${d60 === "strong" ? "offers supportive substrate" : "adds heavier substrate"}. Pace the practice and name which layer says what.${caution}${boundary}`,
    };
  }

  if (d60 === "strong" && d20 === "weak") {
    return {
      short: "Good ground",
      color: BLUE,
      statement: `${d1}. D60 is supportive, so the karmic ground is favorable; D20 is weak, so the ground is not yet matched by active practice. D27 ${d27 === "strong" ? "can carry the path well" : "needs stamina care"}.${caution}${boundary}`,
    };
  }

  if (d20 === "strong" && d27 === "strong" && d60 === "strong" && d1Tone === "supports") {
    return {
      short: "Integrated support",
      color: GREEN,
      statement: "D1-12th plus Ketu, D20 practice, D27 vehicle, and D60 substrate all support the spiritual map. This is convergence, but still descriptive rather than prescriptive." + caution + boundary,
    };
  }

  if (birthNudge >= 4 || (d20 === "weak" && d27 === "weak" && d60 === "weak")) {
    return {
      short: "Confirmation only",
      color: VERMILION,
      statement: `${d1}. The trio is strained or time-sensitive, so use D20/D27/D60 as cautious confirmation. Do not make hard spiritual claims from fine vargas on rough time.${boundary}`,
    };
  }

  return {
    short: "Mixed synthesis",
    color: PURPLE,
    statement: `${d1}. D20 ${d20 === "strong" ? "supports active practice" : "shows limited active practice"}, D27 ${d27 === "strong" ? "supports stamina" : "shows a tiring vehicle"}, and D60 ${d60 === "strong" ? "supports the substrate" : "shows heavier substrate"}. The honest reading names each layer separately.${caution}${boundary}`,
  };
}

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.42rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.5rem 0.65rem",
    fontSize: "0.95rem",
    lineHeight: 1.2,
    fontWeight: 700,
    cursor: "pointer",
  };
}

const svgStyle: CSSProperties = {
  width: "100%",
  maxHeight: 390,
  margin: "0.8rem auto",
  display: "block",
};

const surfaceStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  overflow: "hidden",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 800,
};
