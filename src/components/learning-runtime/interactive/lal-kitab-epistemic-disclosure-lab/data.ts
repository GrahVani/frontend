import { ink } from "@/design-tokens/grahvani-learning/colors";

export type AuthorityKey = "scripture" | "science" | "folk";
export type ClaimVerdict = "honest" | "overclaim" | "dismissal";

export interface AuthorityProfile {
  key: AuthorityKey;
  label: string;
  devanagari: string;
  status: "absent" | "absent-controlled" | "present-modest";
  headline: string;
  detail: string;
  color: string;
}

export interface ClaimCard {
  id: string;
  claim: string;
  verdict: ClaimVerdict;
  honestRewrite: string;
  reason: string;
}

export interface DisclosureStep {
  label: string;
  prompt: string;
  modelLine: string;
  color: string;
}

export const AUTHORITY_PROFILES: AuthorityProfile[] = [
  {
    key: "scripture",
    label: "Scriptural pedigree",
    devanagari: "शास्त्र",
    status: "absent",
    headline: "No Veda, Purana, or Samhita citation",
    detail: "Lal Kitab is not derived from classical Sanskrit shastra; do not borrow ancient-Vedic authority.",
    color: ink.vermilionAccent,
  },
  {
    key: "science",
    label: "Controlled validation",
    devanagari: "परीक्षण",
    status: "absent-controlled",
    headline: "No controlled-study validation",
    detail: "Practitioner reports are observation, not peer-reviewed trials or replicated experiments.",
    color: "#356C96",
  },
  {
    key: "folk",
    label: "Empirical-folk practice",
    devanagari: "लोक",
    status: "present-modest",
    headline: "Observation and practice, modestly held",
    detail: "The honest support is practitioner-reported effectiveness, like folk medicine: meaningful, not proof.",
    color: "#2F7D52",
  },
];

export const CLAIM_CARDS: ClaimCard[] = [
  {
    id: "vedic",
    claim: "This is ancient Vedic wisdom from the scriptures.",
    verdict: "overclaim",
    honestRewrite: "This is a Lal Kitab folk remedy from a modern North-Indian tradition, not a Vedic-scriptural remedy.",
    reason: "The lesson says Lal Kitab cites no Veda, Purana, or Samhita.",
  },
  {
    id: "scientific",
    claim: "These remedies are scientifically proven.",
    verdict: "overclaim",
    honestRewrite: "Practitioners report benefit, but there are no controlled studies proving the remedy.",
    reason: "Anecdotal practitioner experience is not controlled validation.",
  },
  {
    id: "guarantee",
    claim: "Do this for forty days and the problem will definitely be solved.",
    verdict: "overclaim",
    honestRewrite: "You can try this low-cost practice, but I cannot guarantee the outcome.",
    reason: "No folk remedy should be sold as a promised result.",
  },
  {
    id: "worthless",
    claim: "If it is not scripture or science, it is just worthless superstition.",
    verdict: "dismissal",
    honestRewrite: "It is not proven or scriptural, but it is a living folk practice that some practitioners report as helpful.",
    reason: "The lesson refuses both inflated claims and total dismissal.",
  },
  {
    id: "honest",
    claim: "This is an empirical-folk Lal Kitab remedy: observed in practice, not guaranteed, and not scripture-derived.",
    verdict: "honest",
    honestRewrite: "This wording is already balanced and usable.",
    reason: "It names origin, limits authority, and preserves the client&apos;s informed choice.",
  },
];

export const DISCLOSURE_STEPS: DisclosureStep[] = [
  {
    label: "Name origin",
    prompt: "Where does this come from?",
    modelLine: "Lal Kitab is a twentieth-century folk tradition built from observation and practice.",
    color: "#2F7D52",
  },
  {
    label: "Name limits",
    prompt: "Is it Vedic or scientifically proven?",
    modelLine: "It is not from Sanskrit scripture, and it has not been validated by controlled studies.",
    color: "#356C96",
  },
  {
    label: "Return choice",
    prompt: "Should I try it?",
    modelLine: "Many people choose to try it because it is low-cost; I want you to decide with accurate information.",
    color: ink.goldAccent,
  },
];

export function getAuthority(key: AuthorityKey) {
  return AUTHORITY_PROFILES.find((profile) => profile.key === key) ?? AUTHORITY_PROFILES[2];
}

export function verdictColor(verdict: ClaimVerdict) {
  if (verdict === "honest") return "#2F7D52";
  if (verdict === "dismissal") return "#8F6C1F";
  return ink.vermilionAccent;
}

export function verdictLabel(verdict: ClaimVerdict) {
  if (verdict === "honest") return "Honest";
  if (verdict === "dismissal") return "Over-correction";
  return "Overclaim";
}
