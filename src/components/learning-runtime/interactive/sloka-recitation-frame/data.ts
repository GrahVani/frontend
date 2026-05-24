/**
 * Per-word gloss registry for Pāṇinīya Śikṣā 41-42.
 * Format mirrors the curriculum's planned `sloka-glosses/<slug>.json` schema
 * (in B4 we ship this inline; later waves move it into the curriculum repo).
 *
 * The Sanskrit syntax of these ślokas is famously rich; the glosses are
 * intentionally brief — full grammatical analysis lives in §4 of the lesson body.
 */

export interface WordGloss {
  devanagari: string;
  iast: string;
  gloss: string;
  /** Optional etymological note. */
  etymology?: string;
}

/** Words of the ślokas in source order. */
export const SLOKA_WORDS: WordGloss[] = [
  { devanagari: "छन्दः", iast: "chandaḥ", gloss: "Chandas — prosody / metre, the Vedāṅga of verse-form.", etymology: "from √chand 'to please, to be pleasant'" },
  { devanagari: "पादौ", iast: "pādau", gloss: "the two feet (dual)", etymology: "pāda 'foot' in dual case" },
  { devanagari: "तु", iast: "tu", gloss: "indeed, but (emphatic particle)" },
  { devanagari: "वेदस्य", iast: "vedasya", gloss: "of the Veda (genitive)", etymology: "veda + genitive ending -sya" },
  { devanagari: "हस्तौ", iast: "hastau", gloss: "the two hands (dual)", etymology: "hasta 'hand' in dual case" },
  { devanagari: "कल्पः", iast: "kalpaḥ", gloss: "Kalpa — ritual procedure, the Vedāṅga of rite." },
  { devanagari: "अथ", iast: "atha", gloss: "now, thus, and then (continuative)" },
  { devanagari: "कथ्यते", iast: "kathyate", gloss: "is said, is described (passive)", etymology: "from √kath 'to tell'" },
  { devanagari: "ज्योतिषाम्", iast: "jyotiṣām", gloss: "of celestial lights (genitive plural)", etymology: "jyotis 'light, luminary'" },
  { devanagari: "अयनम्", iast: "ayanam", gloss: "course, motion, path", etymology: "from √i 'to go'" },
  { devanagari: "चक्षुः", iast: "cakṣuḥ", gloss: "the eye — vedasya cakṣuḥ, the eye of the Veda.", etymology: "from √cakṣ 'to see'" },
  { devanagari: "निरुक्तम्", iast: "niruktam", gloss: "Nirukta — etymology, the Vedāṅga of meaning." },
  { devanagari: "श्रोत्रम्", iast: "śrotram", gloss: "the ear", etymology: "from √śru 'to hear'" },
  { devanagari: "उच्यते", iast: "ucyate", gloss: "is called, is spoken of (passive)", etymology: "from √vac 'to speak'" },
];

export const SLOKA_DEVANAGARI =
  "छन्दः पादौ तु वेदस्य हस्तौ कल्पोऽथ कथ्यते।\nज्योतिषामयनं चक्षुर्निरुक्तं श्रोत्रमुच्यते॥";

export const SLOKA_IAST =
  "chandaḥ pādau tu vedasya hastau kalpo'tha kathyate |\njyotiṣām ayanaṁ cakṣur niruktaṁ śrotram ucyate ||";

export const SLOKA_ENGLISH =
  "Chandas (prosody) is said to be the feet of the Veda; Kalpa (ritual) the hands; Jyotiṣa (the science of celestial motion) the eye; and Nirukta (etymology) the ear.";

export const SLOKA_SOURCE = "Pāṇinīya Śikṣā 41-42";
export const SLOKA_TRANSLATOR = "Translation: editorial paraphrase (Grahvani curriculum, after Sastry 1985)";
