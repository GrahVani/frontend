"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Filter,
  HelpCircle,
  Info,
  MapPinned,
  MessageCircleWarning,
  RotateCcw,
  ShieldCheck,
  Users,
  XCircle
} from "lucide-react";
import { IAST } from "@/components/learning-runtime/interactive/../chrome/typography";
import { workbenchDiagramLayoutStyle, workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const GOLD_DEEP = "#7A5E1E";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";
const AMBER = "#D97706";
const BLUE = "#356CAB";
const PURPLE = "#6B5AA8";

type Category =
  | "Relationship"
  | "Career + Work"
  | "Wealth"
  | "Health + Longevity"
  | "Spirituality"
  | "Specialised";

type TabKey = "reference" | "fallback" | "trainer";
type NativeKey = "kavya" | "meera";
type DomainKey = "marriage" | "children" | "career" | "wealth" | "health" | "spirituality" | "specialised";

interface Saham {
  key: string;
  name: string;
  sanskrit: string;
  category: Category;
  meaning: string;
  domain: string;
  highRisk?: boolean;
  riskNote?: string;
}

const CATEGORIES: Category[] = [
  "Relationship",
  "Career + Work",
  "Wealth",
  "Health + Longevity",
  "Spirituality",
  "Specialised"
];

const SAHAMS: Saham[] = [
  // Relationship (6)
  { key: "vivaha", name: "Vivāha Saham", sanskrit: "विवाह सहम", category: "Relationship", meaning: "Marriage timing and spousal-domain themes.", domain: "Marriage timing, spouse-domain themes", highRisk: true, riskNote: "Over-promise risk: a favourable placement does not guarantee marriage." },
  { key: "putra", name: "Putra Saham", sanskrit: "पुत्र सहम", category: "Relationship", meaning: "Children prospects and parent-child relations.", domain: "Offspring prospects, parental-relationship", highRisk: true, riskNote: "Over-promise risk: does not guarantee childbirth." },
  { key: "matr", name: "Mātṛ Saham", sanskrit: "मातृ सहम", category: "Relationship", meaning: "Mother-relations and maternal-family context.", domain: "Maternal-family context" },
  { key: "pitr", name: "Pitṛ Saham", sanskrit: "पितृ सहम", category: "Relationship", meaning: "Father-relations and paternal-family themes.", domain: "Paternal-family context" },
  { key: "bandhu", name: "Bandhu Saham", sanskrit: "बन्धु सहम", category: "Relationship", meaning: "Siblings and extended-kin context.", domain: "Sibling and extended-family context" },
  { key: "mitra", name: "Mitra Saham", sanskrit: "मित्र सहम", category: "Relationship", meaning: "Friendships, social circles, and collaborations.", domain: "Social-circle, collaborative context" },

  // Career + Work (4)
  { key: "karma", name: "Karma Saham", sanskrit: "कर्म सहम", category: "Career + Work", meaning: "Career actions, work status, and vocational focus.", domain: "Occupational-domain context" },
  { key: "raja", name: "Rāja Saham", sanskrit: "राज सहम", category: "Career + Work", meaning: "Stature, authority, power, and recognition.", domain: "Leadership, power-domain context" },
  { key: "vyapara", name: "Vyāpāra Saham", sanskrit: "व्यापार सहम", category: "Career + Work", meaning: "Business, commerce, and entrepreneurial ventures.", domain: "Commerce, entrepreneurial context" },
  { key: "vahana", name: "Vāhana Saham", sanskrit: "वाहन सहम", category: "Career + Work", meaning: "Vehicles, assets, mobility, and resources.", domain: "Mobility and resource themes" },

  // Wealth (3)
  { key: "dhana", name: "Dhana Saham", sanskrit: "धन सहम", category: "Wealth", meaning: "Wealth accumulation and financial assets.", domain: "Accumulation, financial-resource context", highRisk: true, riskNote: "Over-promise risk: a favourable placement does not guarantee wealth." },
  { key: "labha", name: "Lābha Saham", sanskrit: "लाभ सहम", category: "Wealth", meaning: "Gains, revenues, and returns.", domain: "Acquisition, benefit context" },
  { key: "vyaya", name: "Vyaya Saham", sanskrit: "व्यय सहम", category: "Wealth", meaning: "Expenses, investments, and monetary outflows.", domain: "Outflow, investment context" },

  // Health + Longevity (3)
  { key: "jivana", name: "Jīvana Saham", sanskrit: "जीवन सहम", category: "Health + Longevity", meaning: "Vitality, life force, and overall health.", domain: "Life-force, health context" },
  { key: "mrtyu", name: "Mṛtyu Saham", sanskrit: "मृत्यु सहम", category: "Health + Longevity", meaning: "Mortality-awareness and life-fragility themes.", domain: "Health-awareness (NOT death-prediction)", highRisk: true, riskNote: "Highest fear-induction risk: never deliver as a death prediction." },
  { key: "ayur", name: "Ayur Saham", sanskrit: "आयुस् सहम", category: "Health + Longevity", meaning: "Long-term health and physical stamina.", domain: "Long-term health perspective" },

  // Spirituality (3)
  { key: "dharma", name: "Dharma Saham", sanskrit: "धर्म सहम", category: "Spirituality", meaning: "Ethical duty and righteous action.", domain: "Ethical-duty, righteous-action context" },
  { key: "tapasvi", name: "Tapasvī Saham", sanskrit: "तपस्विन् सहम", category: "Spirituality", meaning: "Spiritual discipline and austerities.", domain: "Spiritual-discipline context" },
  { key: "tirtha", name: "Tīrtha Saham", sanskrit: "तीर्थ सहम", category: "Spirituality", meaning: "Spiritual pilgrimages and sacred journeys.", domain: "Sacred-journey context" },

  // Specialised (3)
  { key: "vada", name: "Vāda Saham", sanskrit: "वाद सहम", category: "Specialised", meaning: "Debates, arguments, and verbal engagement.", domain: "Argumentation, verbal-engagement context" },
  { key: "vairagya", name: "Vairāgya Saham", sanskrit: "वैराग्य सहम", category: "Specialised", meaning: "Renunciation and detachment.", domain: "Detachment-development context" },
  { key: "roga", name: "Roga Saham", sanskrit: "रोग सहम", category: "Specialised", meaning: "Illness-context and health vulnerability.", domain: "Health-affliction context (NOT illness-prediction)", highRisk: true, riskNote: "Highest fear-induction risk: never deliver as an illness prediction." }
];

const DOMAINS: Record<DomainKey, { label: string; question: string; house: number; secondaryHouse?: number; sahams: string[]; signification: string }> = {
  marriage: { label: "Marriage", question: "Will I get married this year?", house: 7, sahams: ["Vivāha", "Putra", "Mitra"], signification: "7th house and lord in natal and varṣaphala charts" },
  children: { label: "Children", question: "What about children this year?", house: 5, sahams: ["Putra", "Bandhu"], signification: "5th house and lord in natal and varṣaphala charts" },
  career: { label: "Career", question: "What is my career direction this year?", house: 10, sahams: ["Karma", "Rāja", "Vyāpāra"], signification: "10th house and lord in natal and varṣaphala charts" },
  wealth: { label: "Wealth", question: "Will my finances improve this year?", house: 2, secondaryHouse: 11, sahams: ["Dhana", "Lābha", "Vyaya"], signification: "2nd and 11th houses and lords" },
  health: { label: "Health", question: "Should I be worried about my health?", house: 1, secondaryHouse: 6, sahams: ["Jīvana", "Mṛtyu", "Ayur", "Roga"], signification: "1st, 6th, and 8th houses and lords" },
  spirituality: { label: "Spirituality", question: "What does this year hold spiritually?", house: 9, secondaryHouse: 12, sahams: ["Dharma", "Tapasvī", "Tīrtha"], signification: "9th and 12th houses and lords" },
  specialised: { label: "Disputes / Renunciation", question: "Will I face conflict or choose retreat?", house: 6, secondaryHouse: 12, sahams: ["Vāda", "Vairāgya"], signification: "6th and 12th houses and lords" }
};

const MARRIAGE_FALLBACK: Record<NativeKey, { label: string; natal?: string; varsa: string; note: string }> = {
  kavya: {
    label: "Kavya — year 30",
    natal: "Natal 7th is Capricorn (lord Saturn in Libra, natal 4th house).",
    varsa: "Varṣaphala 7th is Cancer (lord Moon in Aries, varṣa 4th house).",
    note: "Both charts place the 7th lord in a 4th-house context — a structural echo, not a marriage verdict."
  },
  meera: {
    label: "Meera — year 25",
    natal: undefined,
    varsa: "Varṣaphala 7th is Leo (lord Sun in Sagittarius, varṣa 11th house).",
    note: "Her natal thread was kept deliberately narrow in Chapter 1, so only varṣaphala data is used here."
  }
};

const TRAINER_SCENARIOS = [
  {
    key: "mrtyu",
    saham: "Mṛtyu Saham",
    claim: "A prior reading says your Mṛtyu Saham falls in a malefic-aspected house this year — prepare for serious danger.",
    choices: [
      "Reassure the client that Mṛtyu Saham is only a soft indicator and they probably have nothing to worry about.",
      "Name the formula gap, refuse the fear-induction framing, and redirect a genuine health concern to medical consultation.",
      "Acknowledge that the 8th-house placement is concerning and advise caution for the year."
    ],
    correct: 1,
    feedback: "Correct. Mṛtyu Saham has no verified formula in this module, so the prior claim cannot be confirmed on its own terms. More importantly, fear-induction is refused regardless of the saham. A real health concern is redirected to appropriate medical care."
  },
  {
    key: "roga",
    saham: "Roga Saham",
    claim: "Your Roga Saham is badly placed — you will fall seriously ill this year.",
    choices: [
      "Tell the client the prediction is probably exaggerated but recommend preventive tests just in case.",
      "Agree the placement is worrying and suggest they prepare for illness.",
      "State that Roga Saham's formula is not available here, refuse the illness-prediction framing, and offer the standard house/lord fallback as the honest technique."
    ],
    correct: 2,
    feedback: "Correct. Roga Saham cannot be computed from this curriculum's sourced material, and 'serious illness' is exactly the fear-induction pattern this discipline refuses. The honest move is to name the gap and use house/lord reading instead."
  },
  {
    key: "vivaha",
    saham: "Vivāha Saham",
    claim: "My Vivāha Saham is favourable — does that mean I will definitely get married this year?",
    choices: [
      "Yes, a favourable Vivāha Saham is a strong marriage-timing signal.",
      "No. The Vivāha Saham formula is unavailable in this module, and even where known it indicates opportunity-context, not a guarantee. Offer the 7th-house/lord reading instead.",
      "It depends on whether the transits also support it."
    ],
    correct: 1,
    feedback: "Correct. The Vivāha Saham formula is not sourced here, so no value can be computed. The 7th-house/lord reading is the reliable fallback and must be offered as a substitute, not as the saham itself."
  },
  {
    key: "dhana",
    saham: "Dhana Saham",
    claim: "My Dhana Saham looks excellent — should I invest everything this year?",
    choices: [
      "A strong Dhana Saham is a green light for major financial moves.",
      "Dhana Saham shows wealth context, but a single saham never justifies major decisions; use multiple convergent grounds.",
      "Invest cautiously, but the saham is a reliable gain indicator."
    ],
    correct: 1,
    feedback: "Correct. No single saham — especially one whose formula is not verified here — should drive a major financial decision. Convergent, independent grounds are required."
  }
];

export function ExtendedSahamRepertoireWorkbench() {
  const [tab, setTab] = useState<TabKey>("reference");
  const [filter, setFilter] = useState<Category | "All">("All");
  const [domain, setDomain] = useState<DomainKey>("marriage");
  const [native, setNative] = useState<NativeKey>("kavya");

  const [scenarioIndex, setScenarioIndex] = useState<number>(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const filteredSahams = useMemo(() => {
    return filter === "All" ? SAHAMS : SAHAMS.filter((s) => s.category === filter);
  }, [filter]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    SAHAMS.forEach((s) => { counts[s.category] = (counts[s.category] || 0) + 1; });
    return counts;
  }, []);

  const activeScenario = TRAINER_SCENARIOS[scenarioIndex];
  const isCorrect = selectedChoice === activeScenario.correct;

  function handleScenarioSelect(idx: number) {
    setScenarioIndex(idx);
    setSelectedChoice(null);
    setShowFeedback(false);
  }

  function handleChoice(idx: number) {
    setSelectedChoice(idx);
    setShowFeedback(true);
  }

  return (
    <div data-interactive="extended-saham-repertoire-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Extended saham repertoire</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              Catalogue the 22 named life-event sahams and practise the honest fallback
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              T1-19 names 22 life-event sahams individually. Their formulas are not verified here. This workbench keeps the list honest, offers standard house/lord fallback, and trains refusal of fear-induction.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setTab("reference");
              setFilter("All");
              setDomain("marriage");
              setNative("kavya");
              handleScenarioSelect(0);
            }}
            style={buttonStyle(false, GOLD)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {[
          { key: "reference", label: "22-saham reference", icon: BookOpen },
          { key: "fallback", label: "House/lord fallback", icon: MapPinned },
          { key: "trainer", label: "Fear-induction trainer", icon: ShieldCheck }
        ].map(({ key, label, icon: Icon }) => {
          const active = tab === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key as TabKey)}
              style={{
                ...smallChipStyle(active, active ? GOLD_DEEP : INK_MUTED),
                height: "44px",
                padding: "0 1rem",
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem"
              }}
            >
              <Icon size={16} />
              {label}
            </button>
          );
        })}
      </div>

      {tab === "reference" && (
        <>
          <section style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <Info size={16} color={GOLD} />
              <p style={{ ...eyebrowStyle, margin: 0 }}>Resolving the count question</p>
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
              Modern compilations disagree (~40 vs ~50 vs ~70). T1-19&apos;s own &quot;47 life-event sahams&quot; is a sum of approximate category ranges.
              Only <strong style={{ fontWeight: 600, color: INK_PRIMARY }}>22 are individually named</strong> in this curriculum&apos;s source chain — and that is the honest catalogue.
            </p>
            <CountDiagram />
          </section>

          <section style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <Filter size={16} color={GOLD} />
              <p style={{ ...eyebrowStyle, margin: 0 }}>Filter by category</p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
              <button type="button" onClick={() => setFilter("All")} style={smallChipStyle(filter === "All", GOLD)}>
                All <span style={{ color: INK_MUTED, fontWeight: 500 }}>(22)</span>
              </button>
              {CATEGORIES.map((cat) => (
                <button key={cat} type="button" onClick={() => setFilter(cat)} style={smallChipStyle(filter === cat, categoryColor(cat))}>
                  {cat} <span style={{ color: INK_MUTED, fontWeight: 500 }}>({categoryCounts[cat]})</span>
                </button>
              ))}
            </div>
          </section>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))", gap: "0.85rem" }}>
            {filteredSahams.map((s) => (
              <div
                key={s.key}
                style={{
                  ...cardStyle,
                  borderColor: s.highRisk ? `${VERMILION}55` : HAIRLINE,
                  background: s.highRisk ? `${VERMILION}08` : SURFACE
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "0.5rem" }}>
                  <div>
                    <h3 style={{ margin: 0, color: INK_PRIMARY, fontSize: "1.05rem", fontWeight: 600 }}>{s.name}</h3>
                    <p style={{ margin: "0.15rem 0 0", color: INK_MUTED, fontSize: "0.85rem" }}>
                      <IAST>{s.sanskrit}</IAST>
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: categoryColor(s.category),
                      background: `${categoryColor(s.category)}15`,
                      padding: "0.25rem 0.5rem",
                      borderRadius: "999px",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {s.category}
                  </span>
                </div>
                <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, fontSize: "0.9rem", lineHeight: 1.5 }}>{s.meaning}</p>
                <p style={{ margin: "0.45rem 0 0", color: INK_MUTED, fontSize: "0.85rem" }}>
                  <span style={{ fontWeight: 600, color: INK_SECONDARY }}>Domain:</span> {s.domain}
                </p>
                <div
                  style={{
                    marginTop: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    fontSize: "0.8rem",
                    color: VERMILION,
                    fontWeight: 600
                  }}
                >
                  <XCircle size={14} />
                  Formula unavailable — concept only
                </div>
                {s.highRisk && (
                  <div
                    style={{
                      marginTop: "0.6rem",
                      padding: "0.55rem 0.7rem",
                      borderRadius: "8px",
                      background: `${VERMILION}12`,
                      color: VERMILION,
                      fontSize: "0.8rem",
                      lineHeight: 1.45
                    }}
                  >
                    <AlertTriangle size={14} style={{ display: "inline", marginRight: "0.3rem", verticalAlign: "middle" }} />
                    {s.riskNote}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "fallback" && (
        <>
          <section style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <MapPinned size={16} color={GOLD} />
              <p style={{ ...eyebrowStyle, margin: 0 }}>Fallback technique</p>
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
              A client asks a life-domain question. The matching saham&apos;s formula is unavailable. The honest practitioner reaches for standard Parasari house/lord reading — already computable from verified chart data — and names it as a substitute, not as the saham itself.
            </p>
          </section>

          <div style={workbenchDiagramLayoutStyle}>
            <section style={{ ...cardStyle, flex: "2 1 460px" }}>
              <p style={eyebrowStyle}>Fallback pathway</p>
              <FallbackDiagram domain={domain} />
              <div style={{ marginTop: "0.75rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.55rem" }}>
                <MiniFact icon={<HelpCircle size={16} />} title="Client asks" body={DOMAINS[domain].question} color={BLUE} />
                <MiniFact icon={<MapPinned size={16} />} title="Fallback house" body={`House ${DOMAINS[domain].house}${DOMAINS[domain].secondaryHouse ? ` + ${DOMAINS[domain].secondaryHouse}` : ""}`} color={GREEN} />
                <MiniFact icon={<BookOpen size={16} />} title="Related sahams" body={DOMAINS[domain].sahams.join(", ")} color={AMBER} />
              </div>
            </section>

            <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
              <Panel title="Life-domain question" icon={<HelpCircle size={18} />} color={BLUE}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
                  {(Object.keys(DOMAINS) as DomainKey[]).map((key) => (
                    <button key={key} type="button" onClick={() => setDomain(key)} style={smallChipStyle(domain === key, domain === key ? BLUE : INK_MUTED)}>
                      {DOMAINS[key].label}
                    </button>
                  ))}
                </div>
                <p style={bodyTextStyle}>{DOMAINS[domain].signification}.</p>
              </Panel>

              <Panel title="Related saham concept" icon={<BookOpen size={18} />} color={AMBER}>
                <p style={bodyTextStyle}>
                  {DOMAINS[domain].sahams.join(", ")} are conceptually related, but their formulas are not available in this module.
                </p>
              </Panel>
            </section>
          </div>

          <section style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <Users size={16} color={GOLD} />
              <p style={{ ...eyebrowStyle, margin: 0 }}>Worked fallback: marriage-domain question</p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", marginBottom: "0.75rem" }}>
              {(Object.keys(MARRIAGE_FALLBACK) as NativeKey[]).map((key) => (
                <button key={key} type="button" onClick={() => setNative(key)} style={smallChipStyle(native === key, native === key ? GOLD_DEEP : INK_MUTED)}>
                  {MARRIAGE_FALLBACK[key].label}
                </button>
              ))}
            </div>
            <div style={workbenchTwoColumnStyle}>
              {MARRIAGE_FALLBACK[native].natal && (
                <div style={{ ...cardStyle, background: `${BLUE}08` }}>
                  <p style={{ ...eyebrowStyle, margin: 0, color: BLUE }}>Natal chart</p>
                  <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{MARRIAGE_FALLBACK[native].natal}</p>
                </div>
              )}
              <div style={{ ...cardStyle, background: `${GREEN}08` }}>
                <p style={{ ...eyebrowStyle, margin: 0, color: GREEN }}>Varṣaphala chart</p>
                <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{MARRIAGE_FALLBACK[native].varsa}</p>
              </div>
            </div>
            <p style={{ margin: "0.75rem 0 0", color: INK_MUTED, fontSize: "0.9rem", lineHeight: 1.55 }}>
              {MARRIAGE_FALLBACK[native].note}
            </p>
          </section>
        </>
      )}

      {tab === "trainer" && (
        <>
          <section style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <ShieldCheck size={16} color={GOLD} />
              <p style={{ ...eyebrowStyle, margin: 0 }}>Fear-induction refusal trainer</p>
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
              Practise the disciplined client response. The best answer names the formula gap, refuses fear or over-promise, and offers the honest fallback where appropriate.
            </p>
          </section>

          <div style={workbenchDiagramLayoutStyle}>
            <section style={{ ...cardStyle, flex: "2 1 480px" }}>
              <p style={eyebrowStyle}>Scenario</p>
              <div
                style={{
                  padding: "0.9rem",
                  borderRadius: "10px",
                  background: `${VERMILION}08`,
                  border: `1px solid ${VERMILION}30`,
                  color: INK_PRIMARY,
                  lineHeight: 1.55,
                  marginBottom: "0.85rem"
                }}
              >
                <strong style={{ fontWeight: 600, color: VERMILION }}>Client:</strong>{" "}
                <IAST>{activeScenario.claim}</IAST>
              </div>

              <p style={{ ...eyebrowStyle, marginTop: 0 }}>Choose the most disciplined response</p>
              <div style={{ display: "grid", gap: "0.55rem" }}>
                {activeScenario.choices.map((choice, idx) => {
                  const state = selectedChoice === null ? "idle" : selectedChoice === idx ? (isCorrect ? "correct" : "wrong") : "idle";
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleChoice(idx)}
                      style={{
                        textAlign: "left",
                        padding: "0.85rem 1rem",
                        borderRadius: "10px",
                        border: `1.5px solid ${state === "correct" ? GREEN : state === "wrong" ? VERMILION : HAIRLINE}`,
                        background: state === "correct" ? `${GREEN}10` : state === "wrong" ? `${VERMILION}10` : SURFACE,
                        color: INK_PRIMARY,
                        fontSize: "0.95rem",
                        lineHeight: 1.5,
                        cursor: selectedChoice === null ? "pointer" : "default"
                      }}
                    >
                      <span style={{ fontWeight: 600, color: state === "correct" ? GREEN : state === "wrong" ? VERMILION : INK_MUTED, marginRight: "0.5rem" }}>
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      {choice}
                    </button>
                  );
                })}
              </div>

              {showFeedback && (
                <div
                  style={{
                    marginTop: "0.85rem",
                    padding: "0.85rem",
                    borderRadius: "10px",
                    background: isCorrect ? `${GREEN}10` : `${VERMILION}10`,
                    border: `1px solid ${isCorrect ? GREEN : VERMILION}`,
                    color: INK_SECONDARY,
                    lineHeight: 1.6
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.3rem", color: isCorrect ? GREEN : VERMILION, fontWeight: 600 }}>
                    {isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                    {isCorrect ? "Discipline-compliant" : "Not the best response"}
                  </div>
                  {activeScenario.feedback}
                </div>
              )}
            </section>

            <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
              <Panel title="Pick a scenario" icon={<MessageCircleWarning size={18} />} color={AMBER}>
                <div style={{ display: "grid", gap: "0.4rem" }}>
                  {TRAINER_SCENARIOS.map((sc, idx) => (
                    <button
                      key={sc.key}
                      type="button"
                      onClick={() => handleScenarioSelect(idx)}
                      style={{
                        textAlign: "left",
                        padding: "0.55rem 0.75rem",
                        borderRadius: "8px",
                        border: `1.5px solid ${scenarioIndex === idx ? AMBER : HAIRLINE}`,
                        background: scenarioIndex === idx ? `${AMBER}10` : SURFACE,
                        color: scenarioIndex === idx ? AMBER : INK_SECONDARY,
                        fontSize: "0.85rem",
                        fontWeight: scenarioIndex === idx ? 600 : 500
                      }}
                    >
                      {sc.saham}
                    </button>
                  ))}
                </div>
              </Panel>

              <Panel title="Discipline checklist" icon={<ShieldCheck size={18} />} color={GREEN}>
                <ChecklistItem done={showFeedback && isCorrect} label="Name the formula gap when relevant" />
                <ChecklistItem done={showFeedback && isCorrect && activeScenario.key !== "dhana"} label="Refuse fear-induction or over-promise" />
                <ChecklistItem done={showFeedback && isCorrect} label="Offer house/lord fallback as a substitute" />
                <ChecklistItem done={showFeedback && isCorrect && (activeScenario.key === "mrtyu" || activeScenario.key === "roga")} label="Redirect genuine health concerns to medical care" />
              </Panel>
            </section>
          </div>
        </>
      )}
    </div>
  );
}

function CountDiagram() {
  return (
    <svg viewBox="0 0 560 120" role="img" aria-label="Saham count comparison" style={{ width: "100%", maxHeight: 160, marginTop: "0.75rem" }}>
      <text x="20" y="24" fill={INK_MUTED} fontSize="12" fontWeight={600}>External compilations (disagree)</text>
      <rect x="20" y="34" width="120" height="46" rx="6" fill={`${INK_MUTED}15`} stroke={INK_MUTED} />
      <text x="80" y="54" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight={600}>~40</text>
      <text x="80" y="72" textAnchor="middle" fill={INK_MUTED} fontSize="10">variant A</text>

      <rect x="155" y="34" width="120" height="46" rx="6" fill={`${INK_MUTED}15`} stroke={INK_MUTED} />
      <text x="215" y="54" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight={600}>~50</text>
      <text x="215" y="72" textAnchor="middle" fill={INK_MUTED} fontSize="10">variant B</text>

      <rect x="290" y="34" width="120" height="46" rx="6" fill={`${INK_MUTED}15`} stroke={INK_MUTED} />
      <text x="350" y="54" textAnchor="middle" fill={INK_PRIMARY} fontSize="13" fontWeight={600}>~70</text>
      <text x="350" y="72" textAnchor="middle" fill={INK_MUTED} fontSize="10">variant C</text>

      <path d="M 440 57 L 480 57" stroke={GOLD} strokeWidth="2" strokeDasharray="4 2" />
      <polygon points="480,57 474,52 474,62" fill={GOLD} />

      <rect x="495" y="34" width="140" height="70" rx="8" fill={`${GREEN}12`} stroke={GREEN} strokeWidth="2" />
      <text x="565" y="60" textAnchor="middle" fill={INK_PRIMARY} fontSize="16" fontWeight={600}>22</text>
      <text x="565" y="78" textAnchor="middle" fill={GREEN} fontSize="10" fontWeight={600}>individually named</text>
      <text x="565" y="92" textAnchor="middle" fill={INK_MUTED} fontSize="9">in T1-19</text>
    </svg>
  );
}

function FallbackDiagram({ domain }: { domain: DomainKey }) {
  const d = DOMAINS[domain];
  return (
    <svg viewBox="0 0 560 140" role="img" aria-label="House lord fallback pathway" style={{ width: "100%", maxHeight: 180, marginTop: "0.4rem" }}>
      <rect x="20" y="45" width="110" height="50" rx="8" fill={`${BLUE}12`} stroke={BLUE} />
      <text x="75" y="62" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight={600}>Client asks</text>
      <text x="75" y="80" textAnchor="middle" fill={INK_SECONDARY} fontSize="10">{d.question}</text>

      <path d="M 135 70 L 175 70" stroke={GOLD} strokeWidth="2" />
      <polygon points="175,70 169,65 169,75" fill={GOLD} />

      <rect x="185" y="45" width="110" height="50" rx="8" fill={`${GREEN}12`} stroke={GREEN} />
      <text x="240" y="62" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight={600}>Fallback house</text>
      <text x="240" y="80" textAnchor="middle" fill={INK_SECONDARY} fontSize="10">House {d.house}{d.secondaryHouse ? ` + ${d.secondaryHouse}` : ""}</text>

      <path d="M 300 70 L 340 70" stroke={GOLD} strokeWidth="2" />
      <polygon points="340,70 334,65 334,75" fill={GOLD} />

      <rect x="350" y="45" width="110" height="50" rx="8" fill={`${PURPLE}12`} stroke={PURPLE} />
      <text x="405" y="62" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight={600}>House lord</text>
      <text x="405" y="80" textAnchor="middle" fill={INK_SECONDARY} fontSize="10">sign, dignity, placement</text>

      <path d="M 405 100 L 405 115" stroke={PURPLE} strokeWidth="2" />
      <polygon points="405,115 400,109 410,109" fill={PURPLE} />

      <rect x="320" y="118" width="170" height="34" rx="8" fill={`${GOLD}12`} stroke={GOLD} />
      <text x="405" y="134" textAnchor="middle" fill={INK_PRIMARY} fontSize="10" fontWeight={600}>Contextual reading, not a saham value</text>

      <text x="280" y="20" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight={600}>
        Sahams {d.sahams.join(", ")} — concept related, formula unavailable
      </text>
    </svg>
  );
}

function ChecklistItem({ done, label }: { done: boolean; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color: done ? GREEN : INK_MUTED, fontSize: "0.85rem", marginBottom: "0.35rem" }}>
      {done ? <CheckCircle2 size={14} /> : <div style={{ width: 14, height: 14, borderRadius: "50%", border: `1.5px solid ${INK_MUTED}` }} />}
      <span style={{ textDecoration: done ? "none" : "none" }}>{label}</span>
    </div>
  );
}

function categoryColor(category: Category): string {
  switch (category) {
    case "Relationship": return BLUE;
    case "Career + Work": return GREEN;
    case "Wealth": return GOLD;
    case "Health + Longevity": return VERMILION;
    case "Spirituality": return PURPLE;
    case "Specialised": return AMBER;
    default: return INK_MUTED;
  }
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ ...cardStyle, borderColor: `${color}55` }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", marginBottom: "0.55rem" }}>
        <span style={{ color }}>{icon}</span>
        <p style={{ ...eyebrowStyle, margin: 0, color }}>{title}</p>
      </div>
      {children}
    </section>
  );
}

function MiniFact({ icon, title, body, color }: { icon: ReactNode; title: string; body: string; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "start", gap: "0.55rem", padding: "0.65rem", borderRadius: "8px", background: `${color}10`, border: `1px solid ${color}30` }}>
      <span style={{ color, marginTop: "0.1rem" }}>{icon}</span>
      <div>
        <p style={{ margin: 0, fontSize: "0.75rem", fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.06em" }}>{title}</p>
        <p style={{ margin: "0.15rem 0 0", color: INK_PRIMARY, fontSize: "0.85rem", lineHeight: 1.4 }}>{body}</p>
      </div>
    </div>
  );
}

const cardStyle: CSSProperties = {
  background: SURFACE,
  border: `1px solid ${HAIRLINE}`,
  borderRadius: "12px",
  padding: "1rem"
};

const eyebrowStyle: CSSProperties = {
  fontSize: "11px",
  fontWeight: 700,
  color: GOLD_DEEP,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  margin: "0 0 0.35rem"
};

const bodyTextStyle: CSSProperties = {
  margin: "0.55rem 0 0",
  color: INK_SECONDARY,
  fontSize: "0.9rem",
  lineHeight: 1.55
};

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    padding: "0.45rem 0.75rem",
    borderRadius: "999px",
    border: `1.5px solid ${active ? color : HAIRLINE}`,
    background: active ? `${color}15` : SURFACE,
    color: active ? color : INK_SECONDARY,
    fontWeight: 600,
    fontSize: "0.85rem",
    cursor: "pointer",
    transition: "all 150ms ease"
  };
}

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    gap: "0.35rem",
    padding: "0.5rem 0.85rem",
    borderRadius: "8px",
    border: `1.5px solid ${active ? color : HAIRLINE}`,
    background: active ? `${color}15` : SURFACE,
    color: active ? color : INK_SECONDARY,
    fontWeight: 600,
    fontSize: "0.85rem",
    cursor: "pointer"
  };
}
