/**
 * Engine for Lesson 23.3.2 — 11 Karaṇas & Bhadrā Avoidance.
 *
 * Provides the 11-karaṇa database, category statuses, vāsa-sthāna (residence) rules,
 * mukha-puccha portion definitions, event-type affinities, and diagnostic scenario screener data.
 */

export type KaranaCategory = "cara" | "sthira";

export type EventTypeKey = "marriage" | "onset" | "surgery";

export type VasaKey = "patala" | "mrtyu" | "svarga";

export type PortionKey = "mukha" | "madhya" | "puccha";

export type StatusKey = "barred" | "caution" | "usable" | "fitting";

export type IssueKey =
  | "single-limb-dominance"
  | "cancellation-dosa-ignored"
  | "vasa-sthana-ignored"
  | "none";

export type Verdict = "favourable" | "avoid" | "exception-applies" | "needs-context";

export interface KaranaData {
  number: number;
  name: string;
  devanagari: string;
  category: KaranaCategory;
  deity: string;
  effects: string;
  specialNote?: string;
}

export interface EventType {
  key: EventTypeKey;
  label: string;
  devanagari: string;
  description: string;
  explanation: string;
}

export interface VasaData {
  key: VasaKey;
  label: string;
  devanagari: string;
  realm: string;
  note: string;
}

export interface PortionData {
  key: PortionKey;
  label: string;
  devanagari: string;
  sub: string;
  minutes: number;
}

export interface Scenario {
  id: number;
  title: string;
  event: EventTypeKey;
  vasa: VasaKey;
  karana: string;
  situation: string;
  expectedIssue: IssueKey;
  expectedVerdict: Verdict;
  explanation: string;
  response: string;
}

export const KARANA_DB: KaranaData[] = [
  { number: 1, name: "Bava", devanagari: "बव", category: "cara", deity: "Indra", effects: "Favourable for major auspicious onsets, saṁskāras, and building." },
  { number: 2, name: "Bālava", devanagari: "बालव", category: "cara", deity: "Brahmā", effects: "Favourable; growth and vitality. Highly affined to education and child-related initiations." },
  { number: 3, name: "Kaulava", devanagari: "कौलव", category: "cara", deity: "Mitra", effects: "Favourable; relationship-building, family agreements, and weddings." },
  { number: 4, name: "Taitila", devanagari: "तैतिल", category: "cara", deity: "Aryaman", effects: "Favourable; gentle beginnings, home-decoration, and institutional launches." },
  { number: 5, name: "Garaja", devanagari: "गरज", category: "cara", deity: "Bhaga", effects: "Favourable; action, labor, agriculture, and decisive beginnings." },
  { number: 6, name: "Vaṇija", devanagari: "वणिज", category: "cara", deity: "Manibhadra", effects: "Favourable; specifically affined to commerce, trading, and transaction." },
  { number: 7, name: "Viṣṭi (Bhadrā)", devanagari: "विष्टि", category: "cara", deity: "Yama", effects: "Highly inauspicious. Rules out auspicious commencements (absolute cancellation). Permissible only for surgical and sharp/fierce actions.", specialNote: "Bhadrā / Viṣṭi cancellation rule: avoided for all auspicious commencements." },
  { number: 8, name: "Śakuni", devanagari: "शकुनि", category: "sthira", deity: "Kali", effects: "Fixed near Amāvasyā. Limited-application for healing, medicine, and omens." },
  { number: 9, name: "Chatuṣpada", devanagari: "चतुष्पद", category: "sthira", deity: "Vṛṣabha", effects: "Fixed at Amāvasyā first half. Limited-application; livestock, land, and ancestral ceremonies." },
  { number: 10, name: "Nāga", devanagari: "नाग", category: "sthira", deity: "Nāga", effects: "Fixed at Amāvasyā second half. Limited-application; boundaries, underground work, and serpent observances." },
  { number: 11, name: "Kiṁstughna", devanagari: "किंस्तुघ्न", category: "sthira", deity: "Kubera", effects: "Fixed at Pratipadā first half. Highly favourable for initiating new projects and cycle beginnings." },
];

export const STATUS_META: Record<StatusKey, { color: string; bg: string; border: string; label: string; desc: string }> = {
  barred: {
    color: "#A23A1E",
    bg: "#FDE8E5",
    border: "#E8AFA8",
    label: "Barred",
    desc: "Absolutely excluded. Initiating auspicious actions during this window violates muhūrta-discipline.",
  },
  caution: {
    color: "#B88421",
    bg: "#FDF6E3",
    border: "#E8D5A3",
    desc: "Permissible ONLY if other-limbs (tithi, vāra, nakṣatra) contribute massive compensating strength.",
    label: "Permissible with Compensation",
  },
  usable: {
    color: "#2F7D55",
    bg: "#E8F5EE",
    border: "#A8D4B8",
    desc: "Clean and supportive window for general commencements.",
    label: "Usable",
  },
  fitting: {
    color: "#2E7D7B",
    bg: "#E8F5FF",
    border: "#A5C7E8",
    desc: "Ideally matches the character of the action (e.g. sharp, incisive, cutting action).",
    label: "Fitting Exception",
  },
};

export const EVENTS: EventType[] = [
  {
    key: "marriage",
    label: "Marriage / Major Saṁskāra",
    devanagari: "विवाह",
    description: "Marriage and major saṁskāras — the absolute strictest case. Bhadrā is barred throughout the entire window.",
    explanation: "For weddings and major saṁskāras, the entire Bhadrā window (mukha, madhya, and puccha) is barred, regardless of vāsa-sthāna (even in Pātāla).",
  },
  {
    key: "onset",
    label: "Auspicious onset",
    devanagari: "आरम्भ",
    description: "Business openings, journeys, foundation-stone laying, signing contracts — gentle initiations.",
    explanation: "Avoid the first portion (mukha) and the last portion (puccha) entirely. The middle portion's usability is modulated by vāsa-sthāna: usable in Pātāla, caution in Svarga, barred in Mṛtyu-loka.",
  },
  {
    key: "surgery",
    label: "Sharp / cutting action",
    devanagari: "तीक्ष्ण-कर्म",
    description: "Surgery, obstacle removal, dispelling rites, litigation — sharp, incisive action matching Bhadrā's fierce character.",
    explanation: "Bhadrā's fierce energy fits sharp/cutting actions. The general bar is relaxed; it operates as a fitting exception-context.",
  },
];

export const VASAS: VasaData[] = [
  { key: "patala", label: "Pātāla", devanagari: "पाताल", realm: "underworld", note: "Lightest — Bhadrā dwells in the underworld; effects are negligible for non-marriage onsets" },
  { key: "svarga", label: "Svarga", devanagari: "स्वर्ग", realm: "heaven", note: "Moderate — Bhadrā dwells in heaven; caution required for earth commencements" },
  { key: "mrtyu", label: "Mṛtyu-loka", devanagari: "मृत्युलोक", realm: "earth", note: "Strictest — Bhadrā dwells on earth; reaches mortal affairs directly; full avoidance" },
];

export const PORTIONS: PortionData[] = [
  { key: "mukha", label: "Mukha", devanagari: "मुख", sub: "Face · first ~5 ghaṭīs (≈ 2 hrs) · highly inauspicious poison-like energy", minutes: 120 },
  { key: "madhya", label: "Madhya", devanagari: "मध्य", sub: "Middle · the long central duration of the window", minutes: 1248 },
  { key: "puccha", label: "Puccha", devanagari: "पुच्छ", sub: "Tail · last ~3 ghaṭīs (≈ 1.2 hrs) · fearsome but weakening energy", minutes: 72 },
];

export const SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: "Wedding on Bhadrā (Pātāla residence)",
    event: "marriage",
    vasa: "patala",
    karana: "Viṣṭi (Bhadrā)",
    situation:
      "A family schedules a wedding during Bhadrā. The priest claims it is safe because Bhadrā's vāsa-sthāna is Pātāla (underworld) on that day, making its influence negligible on earth.",
    expectedIssue: "cancellation-dosa-ignored",
    expectedVerdict: "avoid",
    explanation:
      "For marriage, Bhadrā is an absolute cancellation. The vāsa-sthāna (residence) rules only apply to routine auspicious onsets, not weddings, which bar the entire window.",
    response:
      "Reject this date. For weddings and major saṁskāras, Bhadrā acts as an absolute cancellation regardless of vāsa-sthāna (even in Pātāla). Reschedule to a clean cara karaṇa like Kaulava.",
  },
  {
    id: 2,
    title: "Elective surgery scheduled during Bhadrā",
    event: "surgery",
    vasa: "mrtyu",
    karana: "Viṣṭi (Bhadrā)",
    situation:
      "A client asks whether a surgical procedure can be scheduled during Bhadrā. The local calendar lists Bhadrā as active in Mṛtyu-loka (earth), warning against all actions.",
    expectedIssue: "none",
    expectedVerdict: "exception-applies",
    explanation:
      "Surgery is the classic exception-context for Bhadrā. Its fierce, incisive character matches the surgical action perfectly, making it fitting rather than barred.",
    response:
      "This window is usable. Surgery is a sharp action that benefits from Bhadrā's incisive energy, bypassing the general auspicious-onset prohibition.",
  },
  {
    id: 3,
    title: "Business launch during Bhadrā-mukha (Pātāla)",
    event: "onset",
    vasa: "patala",
    karana: "Viṣṭi (Bhadrā)",
    situation:
      "A client wants to launch a shop during the first hour of a Bhadrā window. Since Bhadrā is in Pātāla, the software flags the day as generally usable.",
    expectedIssue: "cancellation-dosa-ignored",
    expectedVerdict: "avoid",
    explanation:
      "Even when Bhadrā is in Pātāla, the head (mukha) is always barred for auspicious onsets. The first 5 ghaṭīs contain highly concentrated disruptive energy.",
    response:
      "Avoid this specific time. Even though Bhadrā resides in Pātāla today, the first 2 hours (Bhadrā-mukha) are universally barred. Delay the launch to the middle portion (madhya).",
  },
  {
    id: 4,
    title: "Contract signing during Bhadrā-madhya in Pātāla",
    event: "onset",
    vasa: "patala",
    karana: "Viṣṭi (Bhadrā)",
    situation:
      "A business owner signs a partnership contract during the middle portion of a Bhadrā window when Bhadrā's vāsa-sthāna is Pātāla.",
    expectedIssue: "none",
    expectedVerdict: "favourable",
    explanation:
      "During Bhadrā in Pātāla, the middle portion (madhya) is usable for non-marriage auspicious onsets. The underworld residence shields earth from its effects.",
    response:
      "This is discipline-compliant. Signing during Bhadrā-madhya with a Pātāla residence is usable for business actions, provided other limbs (tithi/vāra) are strong.",
  },
  {
    id: 5,
    title: "Business launch on Bava but Saturday + Riktā tithi",
    event: "onset",
    vasa: "mrtyu",
    karana: "Bava",
    situation:
      "A practitioner selects a launch time because Bava is a favourable cara karaṇa, neglecting that the day is Saturday (Śani-vāra) and the tithi is Caturthī (Riktā).",
    expectedIssue: "single-limb-dominance",
    expectedVerdict: "avoid",
    explanation:
      "A favourable karaṇa (Bava) does not save a candidate window where other limbs (Riktā tithi, Saturday vāra) are ruled out. This is a single-limb dominance shortcut.",
    response:
      "Reject this date. Although Bava karaṇa is favourable, the Riktā tithi rules out the launch. Muhūrta requires all limbs to support the election, not just the karaṇa.",
  },
  {
    id: 6,
    title: "Shop opening on Vaṇija during Svarga residence",
    event: "onset",
    vasa: "svarga",
    karana: "Vaṇija",
    situation:
      "A merchant schedules a shop opening during Vaṇija karaṇa (affined to trade) when Bhadrā's residence is Svarga (heaven) and other limbs are strong.",
    expectedIssue: "none",
    expectedVerdict: "favourable",
    explanation:
      "Vaṇija is a favourable cara karaṇa specifically affined to trade. Bhadrā is not active during Vaṇija (it only occupies Viṣṭi), so the day's Svarga status is irrelevant.",
    response:
      "This window is highly favourable: Vaṇija karaṇa directly supports commerce, and since Bhadrā is not active, the window is clean and strong.",
  },
];

export function portionStatus(event: EventTypeKey, vasa: VasaKey, portion: PortionKey): StatusKey {
  if (event === "surgery") return "fitting";
  if (event === "marriage") return "barred";
  if (portion === "mukha" || portion === "puccha") return "barred";
  if (vasa === "patala") return "usable";
  if (vasa === "svarga") return "caution";
  return "barred";
}

export function getKarana(num: number): KaranaData | undefined {
  return KARANA_DB.find((k) => k.number === num);
}

export function getEventType(key: EventTypeKey): EventType | undefined {
  return EVENTS.find((e) => e.key === key);
}

export function getVasa(key: VasaKey): VasaData | undefined {
  return VASAS.find((v) => v.key === key);
}

export function verdict(event: EventTypeKey, vasa: VasaKey): { status: StatusKey; headline: string; detail: string } {
  if (event === "surgery") return {
    status: "fitting",
    headline: "Bhadrā suits sharp action",
    detail: "Bhadrā's fierce energy fits cutting/transformative work (surgery, litigation). The general onset bar does not apply.",
  };
  if (event === "marriage") return {
    status: "barred",
    headline: "Entire window barred — absolute",
    detail: "For marriage, the entire Bhadrā window is barred, regardless of vāsa-sthāna (even in Pātāla), and no auspicious factor compensates.",
  };
  const madhya = portionStatus("onset", vasa, "madhya");
  if (madhya === "usable") return {
    status: "usable",
    headline: "Mukha & puccha barred · middle usable",
    detail: "Avoid the 2-hour mukha and 1.2-hour puccha. With Bhadrā in Pātāla (underworld), the middle portion is usable for non-marriage onsets.",
  };
  if (madhya === "caution") return {
    status: "caution",
    headline: "Mukha & puccha barred · middle needs compensation",
    detail: "Avoid mukha and puccha. With Bhadrā in Svarga (heaven), the middle is permissible only if other limbs (tithi/vāra) add compensating strength.",
  };
  return {
    status: "barred",
    headline: "Full avoidance",
    detail: "With Bhadrā in Mṛtyu-loka (earth), the entire window is avoided for onsets. Earth-dwelling Bhadrā directly disrupts human commencements.",
  };
}

export function issueLabel(key: IssueKey): string {
  switch (key) {
    case "single-limb-dominance":
      return "Single-limb dominance shortcut";
    case "cancellation-dosa-ignored":
      return "Bhadrā/Viṣṭi absolute cancellation ignored";
    case "vasa-sthana-ignored":
      return "Vāsa-sthāna (residence) rules misapplied";
    case "none":
      return "No issue (compliant)";
  }
}

export function statusLabel(status: StatusKey): string {
  return STATUS_META[status].label;
}

export function statusColor(status: StatusKey): string {
  return STATUS_META[status].color;
}
