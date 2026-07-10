export type NakshatraKey =
  | "ashwini"
  | "bharani"
  | "krittika"
  | "rohini"
  | "mrigashira"
  | "ardra"
  | "punarvasu"
  | "pushya"
  | "ashlesha"
  | "magha"
  | "purvaphalguni"
  | "uttaraphalguni"
  | "hasta"
  | "chitra"
  | "swati"
  | "vishakha"
  | "anuradha"
  | "jyeshtha"
  | "mula"
  | "purvashadha"
  | "uttarashadha"
  | "shravana"
  | "dhanistha"
  | "shatabhisha"
  | "purvabhadrapada"
  | "uttarabhadrapada"
  | "revati";

export type ActivityKey =
  | "south-travel"
  | "house-construction"
  | "bed-making"
  | "wood-cutting"
  | "funeral-pyre"
  | "grass-thatching"
  | "wedding"
  | "business-launch"
  | "griha-pravesha"
  | "education";

export type Tradition = "northern" | "southern";
export type Verdict = "cancelled" | "allowed" | "depends";

export interface Nakshatra {
  key: NakshatraKey;
  name: string;
  abbrev: string;
  devanagari: string;
  number: number;
  inPanchaka: boolean;
  panchakaExtent?: "partial" | "full";
  panchakaNote?: string;
}

export interface Activity {
  key: ActivityKey;
  label: string;
  sanskrit: string;
  devanagari: string;
  category: "departure" | "foundation" | "auspicious" | "variant";
  verdict: Verdict;
  rationale: string;
  mitigation?: string;
}

export interface CaseFile {
  id: string;
  family: string;
  request: string;
  activityKey: ActivityKey;
  tradition: Tradition;
  context: string;
}

export interface CancellationDosa {
  key: string;
  label: string;
  scope: "cross-activity" | "activity-specific";
  scopeLabel: string;
  description: string;
}

export const NAKSHATRAS: Nakshatra[] = [
  { key: "ashwini", name: "Aśvinī", abbrev: "Aśv", devanagari: "अश्विनी", number: 1, inPanchaka: false, panchakaNote: "Next-cycle boundary variant: some traditions include first 2 pādas." },
  { key: "bharani", name: "Bharaṇī", abbrev: "Bhar", devanagari: "भरणी", number: 2, inPanchaka: false },
  { key: "krittika", name: "Kṛttikā", abbrev: "Kṛt", devanagari: "कृत्तिका", number: 3, inPanchaka: false },
  { key: "rohini", name: "Rohiṇī", abbrev: "Roh", devanagari: "रोहिणी", number: 4, inPanchaka: false },
  { key: "mrigashira", name: "Mṛgaśīrṣā", abbrev: "Mṛg", devanagari: "मृगशीर्षा", number: 5, inPanchaka: false },
  { key: "ardra", name: "Ārdrā", abbrev: "Ārd", devanagari: "आर्द्रा", number: 6, inPanchaka: false },
  { key: "punarvasu", name: "Punarvasu", abbrev: "Pun", devanagari: "पुनर्वसु", number: 7, inPanchaka: false },
  { key: "pushya", name: "Puṣya", abbrev: "Puṣ", devanagari: "पुष्य", number: 8, inPanchaka: false },
  { key: "ashlesha", name: "Āśleṣā", abbrev: "Āśl", devanagari: "आश्लेषा", number: 9, inPanchaka: false },
  { key: "magha", name: "Maghā", abbrev: "Magh", devanagari: "मघा", number: 10, inPanchaka: false },
  { key: "purvaphalguni", name: "Pūrvaphālgunī", abbrev: "Pūr-Ph", devanagari: "पूर्वफाल्गुनी", number: 11, inPanchaka: false },
  { key: "uttaraphalguni", name: "Uttaraphālgunī", abbrev: "Utt-Ph", devanagari: "उत्तरफाल्गुनी", number: 12, inPanchaka: false },
  { key: "hasta", name: "Hasta", abbrev: "Hast", devanagari: "हस्त", number: 13, inPanchaka: false },
  { key: "chitra", name: "Citrā", abbrev: "Cit", devanagari: "चित्रा", number: 14, inPanchaka: false },
  { key: "swati", name: "Svātī", abbrev: "Svāt", devanagari: "स्वाती", number: 15, inPanchaka: false },
  { key: "vishakha", name: "Viśākhā", abbrev: "Viś", devanagari: "विशाखा", number: 16, inPanchaka: false },
  { key: "anuradha", name: "Anurādhā", abbrev: "Anur", devanagari: "अनुराधा", number: 17, inPanchaka: false },
  { key: "jyeshtha", name: "Jyeṣṭhā", abbrev: "Jyeṣ", devanagari: "ज्येष्ठा", number: 18, inPanchaka: false },
  { key: "mula", name: "Mūla", abbrev: "Mūl", devanagari: "मूल", number: 19, inPanchaka: false },
  { key: "purvashadha", name: "Pūrvāṣāḍhā", abbrev: "Pūr-Aṣ", devanagari: "पूर्वाषाढा", number: 20, inPanchaka: false },
  { key: "uttarashadha", name: "Uttarāṣāḍhā", abbrev: "Utt-Aṣ", devanagari: "उत्तराषाढा", number: 21, inPanchaka: false },
  { key: "shravana", name: "Śravaṇā", abbrev: "Śrav", devanagari: "श्रवण", number: 22, inPanchaka: false },
  {
    key: "dhanistha",
    name: "Dhaniṣṭhā",
    abbrev: "Dhan",
    devanagari: "धनिष्ठा",
    number: 23,
    inPanchaka: true,
    panchakaExtent: "partial",
    panchakaNote: "Pañcaka begins at Dhaniṣṭhā 3rd pāda (last 2 pādas only).",
  },
  { key: "shatabhisha", name: "Śatabhiṣā", abbrev: "Śata", devanagari: "शतभिषा", number: 24, inPanchaka: true, panchakaExtent: "full" },
  { key: "purvabhadrapada", name: "Pūrvabhādrapadā", abbrev: "Pūr-Bh", devanagari: "पूर्वभाद्रपदा", number: 25, inPanchaka: true, panchakaExtent: "full" },
  { key: "uttarabhadrapada", name: "Uttarabhādrapadā", abbrev: "Utt-Bh", devanagari: "उत्तरभाद्रपदा", number: 26, inPanchaka: true, panchakaExtent: "full" },
  { key: "revati", name: "Revatī", abbrev: "Rev", devanagari: "रेवती", number: 27, inPanchaka: true, panchakaExtent: "full", panchakaNote: "Pañcaka ends at completion of Revatī." },
];

export const ACTIVITIES: Activity[] = [
  {
    key: "south-travel",
    label: "South-direction travel",
    sanskrit: "Dakṣiṇa-yātrā",
    devanagari: "दक्षिण-यात्रा",
    category: "departure",
    verdict: "cancelled",
    rationale: "The first of the pañca-niṣiddha-karma. Southward journey initiation is avoided during Pañcaka.",
    mitigation: "Saṅkalpa + South-direction-presiding-deity observance per regional tradition; defer if possible.",
  },
  {
    key: "house-construction",
    label: "House-construction initiation",
    sanskrit: "Gṛha-nirmāṇa-ārambha",
    devanagari: "गृह-निर्माण-आरम्भ",
    category: "foundation",
    verdict: "cancelled",
    rationale: "Foundation-stone-laying (śīlā-nyāsa) and new-construction starts are Pañcaka-cancelled.",
    mitigation: "Vāstu-purification ceremonies per Bṛhat Saṁhitā 52–56; Vāstu-expert cross-discipline referral.",
  },
  {
    key: "bed-making",
    label: "Bed-making (new)",
    sanskrit: "Śayyā-nirmāṇa",
    devanagari: "शय्या-निर्माण",
    category: "foundation",
    verdict: "cancelled",
    rationale: "New-bed construction / installation is Pañcaka-cancelled. Routine bed use is not.",
    mitigation: "Defer to post-Pañcaka window.",
  },
  {
    key: "wood-cutting",
    label: "Wood-cutting + timber-gathering",
    sanskrit: "Kāṣṭha-saṁgraha / dāru-chedana",
    devanagari: "काष्ठ-संग्रह / दारु-छेदन",
    category: "foundation",
    verdict: "cancelled",
    rationale: "Timber-gathering for construction purposes is Pañcaka-cancelled (distinct from routine firewood).",
    mitigation: "Defer to post-Pañcaka window.",
  },
  {
    key: "funeral-pyre",
    label: "Funeral-pyre construction",
    sanskrit: "Śmaśāna-kriyā",
    devanagari: "श्मशान-क्रिया",
    category: "departure",
    verdict: "depends",
    rationale: "Northern-tradition 5th forbidden action: funeral-pyre construction for deceased departure.",
    mitigation: "Only applies under northern-tradition variant; follow family regional tradition.",
  },
  {
    key: "grass-thatching",
    label: "Grass-gathering for thatching",
    sanskrit: "Trṇa-saṁgrahaṇa",
    devanagari: "तृण-संग्रहण",
    category: "foundation",
    verdict: "depends",
    rationale: "Southern-tradition 5th forbidden action: grass-gathering for roof-thatching.",
    mitigation: "Only applies under southern-tradition variant; default conservatively when unknown.",
  },
  {
    key: "wedding",
    label: "Wedding-muhūrta",
    sanskrit: "Vivāha-muhūrta",
    devanagari: "विवाह-मुहूर्त",
    category: "auspicious",
    verdict: "allowed",
    rationale: "Pañcaka is activity-specific. Wedding is NOT in the pañca-niṣiddha-karma set.",
    mitigation: "Integrated four-pillar evaluation proceeds normally during Pañcaka window.",
  },
  {
    key: "business-launch",
    label: "Business-launch",
    sanskrit: "Vyāpāra-ārambha",
    devanagari: "व्यापार-आरम्भ",
    category: "auspicious",
    verdict: "allowed",
    rationale: "Business-launch is not one of the five forbidden actions; Pañcaka does not cancel it.",
    mitigation: "Apply general integrated four-pillar evaluation normally.",
  },
  {
    key: "griha-pravesha",
    label: "Gṛha-praveśa re-occupation",
    sanskrit: "Gṛha-praveśa",
    devanagari: "गृह-प्रवेश",
    category: "auspicious",
    verdict: "allowed",
    rationale: "House re-occupation is distinct from construction initiation; Pañcaka does not cancel it.",
    mitigation: "Apply griha-praveśa-specific evaluation; do not conflate with gṛha-nirmāṇa-ārambha.",
  },
  {
    key: "education",
    label: "Education-initiation",
    sanskrit: "Vidyā-ārambha",
    devanagari: "विद्या-आरम्भ",
    category: "auspicious",
    verdict: "allowed",
    rationale: "Education initiation is not in the five Pañcaka-cancelled activity-classes.",
    mitigation: "Apply event-specific evaluation normally.",
  },
];

export const CASE_FILES: CaseFile[] = [
  {
    id: "family-a",
    family: "Family A",
    request: "South-direction pilgrimage commencement (Tirumala yātrā).",
    activityKey: "south-travel",
    tradition: "southern",
    context: "Candidate window overlaps Pañcaka. Activity-class = dakṣiṇa-yātrā.",
  },
  {
    id: "family-b",
    family: "Family B",
    request: "Foundation-stone-laying for new home (śīlā-nyāsa).",
    activityKey: "house-construction",
    tradition: "northern",
    context: "Candidate window overlaps Pañcaka. Activity-class = gṛha-nirmāṇa-ārambha.",
  },
  {
    id: "family-c",
    family: "Family C",
    request: "New wooden bed-installation for a child's room.",
    activityKey: "bed-making",
    tradition: "southern",
    context: "Candidate window overlaps Pañcaka. Activity-class = śayyā-nirmāṇa.",
  },
  {
    id: "family-d",
    family: "Family D",
    request: "Wedding-muhūrta during a Pañcaka window.",
    activityKey: "wedding",
    tradition: "northern",
    context: "Family asks whether Pañcaka cancels wedding candidates.",
  },
  {
    id: "family-e",
    family: "Family E",
    request: "Traditional roof repair requiring fresh grass-thatching.",
    activityKey: "grass-thatching",
    tradition: "southern",
    context: "Regional-tradition variance question: is grass-thatching Pañcaka-cancelled?",
  },
];

export const CANCELLATION_DOSHAS: CancellationDosa[] = [
  {
    key: "vyatipata-vaidhriti",
    label: "Vyatīpāta / Vaidhṛti yoga",
    scope: "cross-activity",
    scopeLabel: "Cross-activity",
    description: "First-pass exclusion for most auspicious initiations regardless of event type.",
  },
  {
    key: "bhadra-mukha",
    label: "Bhadrā-mukha karaṇa",
    scope: "cross-activity",
    scopeLabel: "Cross-activity",
    description: "Viṣṭi/Bhadrā-mukha karaṇa avoided for auspicious initiations broadly.",
  },
  {
    key: "rikta-tithi",
    label: "Riktā tithi without exception",
    scope: "cross-activity",
    scopeLabel: "Cross-activity",
    description: "Tithi 4 / 9 / 14 excluded for most material initiations regardless of event type.",
  },
  {
    key: "panchaka",
    label: "Pañcaka",
    scope: "activity-specific",
    scopeLabel: "Activity-specific",
    description: "Cancels ONLY the 5 specified activity-classes: South-travel, house-construction, bed-making, wood-gathering, funeral-pyre/grass-thatching.",
  },
];

export const TRADITION_NOTES: Record<
  Tradition,
  { label: string; fifthForbidden: ActivityKey; fifthLabel: string; note: string }
> = {
  northern: {
    label: "Northern tradition",
    fifthForbidden: "funeral-pyre",
    fifthLabel: "Śmaśāna-kriyā (funeral-pyre construction)",
    note: "Classical northern-tradition treatments identify the 5th forbidden action as śmaśāna-kriyā.",
  },
  southern: {
    label: "Southern tradition",
    fifthForbidden: "grass-thatching",
    fifthLabel: "Trṇa-saṁgrahaṇa (grass-gathering for thatching)",
    note: "Classical southern-tradition treatments identify the 5th forbidden action as trṇa-saṁgrahaṇa.",
  },
};

export function findActivity(key: ActivityKey): Activity {
  return ACTIVITIES.find((a) => a.key === key) ?? ACTIVITIES[0];
}

export function findNakshatra(key: NakshatraKey): Nakshatra {
  return NAKSHATRAS.find((n) => n.key === key) ?? NAKSHATRAS[0];
}

export function getPanchakaVerdict(activityKey: ActivityKey, tradition: Tradition): { verdict: Verdict; note: string } {
  const activity = findActivity(activityKey);

  if (activity.verdict === "allowed") {
    return { verdict: "allowed", note: `${activity.label} is NOT in the pañca-niṣiddha-karma set. Pañcaka does not cancel it.` };
  }

  if (activity.key === "funeral-pyre") {
    return {
      verdict: tradition === "northern" ? "cancelled" : "allowed",
      note:
        tradition === "northern"
          ? "Northern tradition lists śmaśāna-kriyā as the 5th forbidden action — Pañcaka-CANCELLED."
          : "Southern tradition lists trṇa-saṁgrahaṇa as the 5th forbidden action — funeral-pyre is NOT Pañcaka-cancelled here.",
    };
  }

  if (activity.key === "grass-thatching") {
    return {
      verdict: tradition === "southern" ? "cancelled" : "allowed",
      note:
        tradition === "southern"
          ? "Southern tradition lists trṇa-saṁgrahaṇa as the 5th forbidden action — Pañcaka-CANCELLED."
          : "Northern tradition lists śmaśāna-kriyā as the 5th forbidden action — grass-thatching is NOT Pañcaka-cancelled here.",
    };
  }

  return {
    verdict: "cancelled",
    note: `${activity.label} is in the pañca-niṣiddha-karma — Pañcaka-CANCELLED.`,
  };
}

export function isPanchakaCancelled(activityKey: ActivityKey, tradition: Tradition): boolean {
  return getPanchakaVerdict(activityKey, tradition).verdict === "cancelled";
}
