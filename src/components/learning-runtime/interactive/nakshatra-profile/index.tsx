"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { BookOpen, Brain, GitBranch, Map, Moon, RotateCcw, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { IAST } from "../../chrome/typography";
import { useLessonSlug } from "../rashi-attribute-wheel";
import { GANA_STYLE, NAKSHATRAS, RULER_COLORS, type NakshatraData } from "../nakshatra-data";

type Pada = {
  num: number;
  navamsa: string;
  sign: string;
  range: string;
};

type Profile = {
  num: number;
  slug: string;
  meaning: string;
  range: string;
  rashi: string;
  padas: [Pada, Pada, Pada, Pada];
  vimshottariYears: number;
  deityNote: string;
  symbolNote: string;
  tattva: string;
  quality: string;
  correspondences: string;
  themes: [string, string, string];
  moonReading: string;
  beneficReading: string;
  maleficReading: string;
  caution: string;
};

type ArcSegment = {
  num: number;
  label: string;
};

type AttributeKey =
  | "identity"
  | "range"
  | "padas"
  | "lord"
  | "deity"
  | "symbol"
  | "gana"
  | "yoni"
  | "tattva"
  | "quality"
  | "correspondences"
  | "reading";

const SLUG_TO_NAKSHATRA: Record<string, number> = {
  "ashwini-the-horse-headed-physicians": 1,
  "bharani-the-bearer": 2,
  "krittika-the-cutters-and-fire-feeders": 3,
  "rohini-the-red-and-fertile-favourite-of-chandra": 4,
  "mrigashira-the-deer-head": 5,
  "ardra-the-moist-rudra-tear": 6,
  "ardra-the-teardrop": 6,
  "punarvasu-the-return-of-light": 7,
  "punarvasu-the-return-of-the-light": 7,
  "pushya-the-nourisher": 8,
  "ashlesha-the-entwiner-naga-domain": 9,
  "ashlesha-the-entwining-serpent": 9,
  "magha-the-mighty-ancestor-domain": 10,
  "purva-phalguni-the-former-fig-tree-domain": 11,
  "uttara-phalguni-the-latter-fig-tree-domain": 12,
  "hasta-the-hand-skill-domain": 13,
};

const ATTRIBUTE_ORDER: { key: AttributeKey; label: string; short: string; angle: number }[] = [
  { key: "identity", label: "Name + meaning", short: "Name", angle: -90 },
  { key: "range", label: "Sidereal range", short: "Range", angle: -60 },
  { key: "padas", label: "Padas", short: "Padas", angle: -30 },
  { key: "lord", label: "Ruling graha", short: "Lord", angle: 0 },
  { key: "deity", label: "Devata", short: "Deity", angle: 30 },
  { key: "symbol", label: "Symbol", short: "Symbol", angle: 60 },
  { key: "gana", label: "Gana", short: "Gana", angle: 90 },
  { key: "yoni", label: "Yoni", short: "Yoni", angle: 120 },
  { key: "tattva", label: "Tattva", short: "Tattva", angle: 150 },
  { key: "quality", label: "Quality", short: "Quality", angle: 180 },
  { key: "correspondences", label: "Correspondences", short: "Links", angle: 210 },
  { key: "reading", label: "Placement reading", short: "Read", angle: 240 },
];

const BASE_PADA: Record<number, [Pada, Pada, Pada, Pada]> = {
  1: [
    { num: 1, navamsa: "Aries", sign: "Aries", range: "0°00'-3°20' Aries" },
    { num: 2, navamsa: "Taurus", sign: "Aries", range: "3°20'-6°40' Aries" },
    { num: 3, navamsa: "Gemini", sign: "Aries", range: "6°40'-10°00' Aries" },
    { num: 4, navamsa: "Cancer", sign: "Aries", range: "10°00'-13°20' Aries" },
  ],
  2: [
    { num: 1, navamsa: "Leo", sign: "Aries", range: "13°20'-16°40' Aries" },
    { num: 2, navamsa: "Virgo", sign: "Aries", range: "16°40'-20°00' Aries" },
    { num: 3, navamsa: "Libra", sign: "Aries", range: "20°00'-23°20' Aries" },
    { num: 4, navamsa: "Scorpio", sign: "Aries", range: "23°20'-26°40' Aries" },
  ],
  3: [
    { num: 1, navamsa: "Sagittarius", sign: "Aries", range: "26°40'-30°00' Aries" },
    { num: 2, navamsa: "Capricorn", sign: "Taurus", range: "0°00'-3°20' Taurus" },
    { num: 3, navamsa: "Aquarius", sign: "Taurus", range: "3°20'-6°40' Taurus" },
    { num: 4, navamsa: "Pisces", sign: "Taurus", range: "6°40'-10°00' Taurus" },
  ],
  4: [
    { num: 1, navamsa: "Aries", sign: "Taurus", range: "10°00'-13°20' Taurus" },
    { num: 2, navamsa: "Taurus", sign: "Taurus", range: "13°20'-16°40' Taurus" },
    { num: 3, navamsa: "Gemini", sign: "Taurus", range: "16°40'-20°00' Taurus" },
    { num: 4, navamsa: "Cancer", sign: "Taurus", range: "20°00'-23°20' Taurus" },
  ],
  5: [
    { num: 1, navamsa: "Leo", sign: "Taurus", range: "23°20'-26°40' Taurus" },
    { num: 2, navamsa: "Virgo", sign: "Taurus", range: "26°40'-30°00' Taurus" },
    { num: 3, navamsa: "Libra", sign: "Gemini", range: "0°00'-3°20' Gemini" },
    { num: 4, navamsa: "Scorpio", sign: "Gemini", range: "3°20'-6°40' Gemini" },
  ],
  6: [
    { num: 1, navamsa: "Sagittarius", sign: "Gemini", range: "6°40'-10°00' Gemini" },
    { num: 2, navamsa: "Capricorn", sign: "Gemini", range: "10°00'-13°20' Gemini" },
    { num: 3, navamsa: "Aquarius", sign: "Gemini", range: "13°20'-16°40' Gemini" },
    { num: 4, navamsa: "Pisces", sign: "Gemini", range: "16°40'-20°00' Gemini" },
  ],
  7: [
    { num: 1, navamsa: "Aries", sign: "Gemini", range: "20°00'-23°20' Gemini" },
    { num: 2, navamsa: "Taurus", sign: "Gemini", range: "23°20'-26°40' Gemini" },
    { num: 3, navamsa: "Gemini", sign: "Gemini", range: "26°40'-30°00' Gemini" },
    { num: 4, navamsa: "Cancer", sign: "Cancer", range: "0°00'-3°20' Cancer" },
  ],
  8: [
    { num: 1, navamsa: "Leo", sign: "Cancer", range: "3°20'-6°40' Cancer" },
    { num: 2, navamsa: "Virgo", sign: "Cancer", range: "6°40'-10°00' Cancer" },
    { num: 3, navamsa: "Libra", sign: "Cancer", range: "10°00'-13°20' Cancer" },
    { num: 4, navamsa: "Scorpio", sign: "Cancer", range: "13°20'-16°40' Cancer" },
  ],
  9: [
    { num: 1, navamsa: "Sagittarius", sign: "Cancer", range: "16°40'-20°00' Cancer" },
    { num: 2, navamsa: "Capricorn", sign: "Cancer", range: "20°00'-23°20' Cancer" },
    { num: 3, navamsa: "Aquarius", sign: "Cancer", range: "23°20'-26°40' Cancer" },
    { num: 4, navamsa: "Pisces", sign: "Cancer", range: "26°40'-30°00' Cancer" },
  ],
  10: [
    { num: 1, navamsa: "Aries", sign: "Leo", range: "0°00'-3°20' Leo" },
    { num: 2, navamsa: "Taurus", sign: "Leo", range: "3°20'-6°40' Leo" },
    { num: 3, navamsa: "Gemini", sign: "Leo", range: "6°40'-10°00' Leo" },
    { num: 4, navamsa: "Cancer", sign: "Leo", range: "10°00'-13°20' Leo" },
  ],
  11: [
    { num: 1, navamsa: "Leo", sign: "Leo", range: "13°20'-16°40' Leo" },
    { num: 2, navamsa: "Virgo", sign: "Leo", range: "16°40'-20°00' Leo" },
    { num: 3, navamsa: "Libra", sign: "Leo", range: "20°00'-23°20' Leo" },
    { num: 4, navamsa: "Scorpio", sign: "Leo", range: "23°20'-26°40' Leo" },
  ],
  12: [
    { num: 1, navamsa: "Sagittarius", sign: "Leo", range: "26°40'-30°00' Leo" },
    { num: 2, navamsa: "Capricorn", sign: "Virgo", range: "0°00'-3°20' Virgo" },
    { num: 3, navamsa: "Aquarius", sign: "Virgo", range: "3°20'-6°40' Virgo" },
    { num: 4, navamsa: "Pisces", sign: "Virgo", range: "6°40'-10°00' Virgo" },
  ],
  13: [
    { num: 1, navamsa: "Aries", sign: "Virgo", range: "10°00'-13°20' Virgo" },
    { num: 2, navamsa: "Taurus", sign: "Virgo", range: "13°20'-16°40' Virgo" },
    { num: 3, navamsa: "Gemini", sign: "Virgo", range: "16°40'-20°00' Virgo" },
    { num: 4, navamsa: "Cancer", sign: "Virgo", range: "20°00'-23°20' Virgo" },
  ],
};

const PROFILES: Profile[] = [
  {
    num: 1,
    slug: "ashwini-the-horse-headed-physicians",
    meaning: "the horse-women / of the horse",
    range: "0°00'-13°20' Aries",
    rashi: "Entirely in Aries (Mesha)",
    padas: BASE_PADA[1],
    vimshottariYears: 7,
    deityNote: "The Ashvini Kumaras are the twin divine physicians, bringing rescue, renewal, and quick healing.",
    symbolNote: "The horse's head gives speed, vitality, arrival, and the urge to begin.",
    tattva: "Earth (prithivi)",
    quality: "Gentle (mridu) and movable (cara): good for travel, beginnings, treatment, and healing rites.",
    correspondences: "Nadi: Vata; caste: Vaishya; direction: South; body: knees.",
    themes: ["healing", "speed", "beginnings"],
    moonReading: "Moon here gives a quick, pioneering, healing-inclined mind and begins life in Ketu mahadasha.",
    beneficReading: "Benefics act swiftly and constructively, often through healing, rescue, or new starts.",
    maleficReading: "Malefics can sharpen haste and impatience; channel the speed instead of judging it.",
    caution: "Do not read Ashvini as speed alone. Its speed is medicinal: it arrives to restore.",
  },
  {
    num: 2,
    slug: "bharani-the-bearer",
    meaning: "the bearer / the one who carries",
    range: "13°20'-26°40' Aries",
    rashi: "Entirely in Aries (Mesha)",
    padas: BASE_PADA[2],
    vimshottariYears: 20,
    deityNote: "Yama is lord of dharma, consequence, restraint, and the threshold between life and death.",
    symbolNote: "The yoni is the womb-gate: the power to bear life, burdens, consequence, and transformation.",
    tattva: "Earth (prithivi)",
    quality: "Fierce (krura/ugra): intense, disciplined, transformative, not casual or soft.",
    correspondences: "Nadi: Pitta; caste: Mleccha; direction: West.",
    themes: ["bearing", "restraint", "transformation"],
    moonReading: "Moon here bears intensity and consequence with Venusian creativity; it seeds Venus mahadasha.",
    beneficReading: "Benefics can express endurance, fertility, creativity, and the ability to carry responsibility.",
    maleficReading: "Malefics intensify pressure and restraint; avoid fear-framing and read the whole chart.",
    caution: "Yama is not a doom signal. Read dharma, thresholds, and bearing-power without fear-mongering.",
  },
  {
    num: 3,
    slug: "krittika-the-cutters-and-fire-feeders",
    meaning: "the cutters; the Pleiades star-cluster",
    range: "26°40' Aries-10°00' Taurus",
    rashi: "Spans Aries pada 1 and Taurus padas 2-4",
    padas: BASE_PADA[3],
    vimshottariYears: 6,
    deityNote: "Agni purifies, consumes, transforms, and carries offerings; the Skanda foster-myth adds fierce nurture.",
    symbolNote: "Razor, knife, and flame: precision, separation, digestion, sacrifice, and purifying heat.",
    tattva: "Earth (prithivi)",
    quality: "Mixed (mishra): auspicious or difficult according to context and how the edge is used.",
    correspondences: "Nadi: Kapha; caste: Brahmana; direction: North.",
    themes: ["cutting", "purifying fire", "fierce nurture"],
    moonReading: "Moon here is sharp, discerning, zealous, protective, and seeded into Sun mahadasha.",
    beneficReading: "Benefics give clean discrimination, disciplined refinement, and protective nourishment.",
    maleficReading: "Malefics can become harsh, combative, or overly critical; the edge needs discipline.",
    caution: "Do not miss the sign crossing: Aries pada runs hotter, Taurus padas stabilize the fire.",
  },
  {
    num: 4,
    slug: "rohini-the-red-and-fertile-favourite-of-chandra",
    meaning: "the red one / the growing one",
    range: "10°00'-23°20' Taurus",
    rashi: "Entirely in Taurus (Vrishabha)",
    padas: BASE_PADA[4],
    vimshottariYears: 10,
    deityNote: "Brahma/Prajapati gives creative and generative power; the Candra-Rohini story makes it lunar and beloved.",
    symbolNote: "Ox-cart, chariot, and banyan: productivity, rooted growth, beauty, and material increase.",
    tattva: "Earth (prithivi)",
    quality: "Fixed (dhruva): good for stable, lasting, foundational, and fertile undertakings.",
    correspondences: "Nadi: Kapha; caste: Shudra; direction: East.",
    themes: ["fertility", "beauty", "material growth"],
    moonReading: "Moon thrives here: sensuous, nurturing, fertile, emotionally rich, and seeded into Moon mahadasha.",
    beneficReading: "Benefics support beauty, abundance, stability, artistic growth, and productive rootedness.",
    maleficReading: "Malefics can constrict or harden attachment; read stability and possessiveness together.",
    caution: "Do not reduce Rohini to charm. Creator-deity + Moon + Taurus earth makes it generative.",
  },
  {
    num: 5,
    slug: "mrigashira-the-deer-head",
    meaning: "the deer's head",
    range: "23°20' Taurus-6°40' Gemini",
    rashi: "Spans Taurus padas 1-2 and Gemini padas 3-4",
    padas: BASE_PADA[5],
    vimshottariYears: 7,
    deityNote: "Soma brings sweetness, refinement, nectar, beauty, and a gentle longing for delight.",
    symbolNote: "The deer's head is alert, curious, soft-footed, and always seeking the next meadow.",
    tattva: "Earth (prithivi), transitioning toward air",
    quality: "Gentle (mridu): good for searching, learning, travel, exploration, and refined arts.",
    correspondences: "Nadi: Pitta; caste: Vaishya; direction: West.",
    themes: ["seeking", "curiosity", "refinement"],
    moonReading: "Moon here is curious, refined, restless, and searching, with Mars mahadasha seeded at birth.",
    beneficReading: "Benefics give research, artistry, learning, charm, and graceful exploration.",
    maleficReading: "Malefics can become never-satisfied searching; name the restlessness constructively.",
    caution: "Do not miss Mars under the softness. The seeker is gentle, but actively driven.",
  },
  {
    num: 6,
    slug: "ardra-the-moist-rudra-tear",
    meaning: "the moist one / the teardrop",
    range: "6°40'-20°00' Gemini",
    rashi: "Entirely in Gemini (Mithuna)",
    padas: BASE_PADA[6],
    vimshottariYears: 18,
    deityNote: "Rudra (the howling storm god, a fierce form of Shiva) brings necessary destruction and emotional release.",
    symbolNote: "A teardrop or diamond: sorrow, emotional cleansing, and immense pressure creating brilliance.",
    tattva: "Water (Jala) within Air",
    quality: "Fierce (krura/ugra): good for demolition, confronting hard truths, and deep emotional clearing.",
    correspondences: "Nadi: Vata; caste: Butcher; direction: West.",
    themes: ["storms", "emotional release", "brilliance"],
    moonReading: "Moon here is intensely analytical, prone to emotional storms, and seeded into Rahu mahadasha.",
    beneficReading: "Benefics bring sharp intellect, research capacity, and the ability to find clarity after chaos.",
    maleficReading: "Malefics can intensify turbulence and grief; channel the storm into productive demolition.",
    caution: "Do not fear the storm. Ardra clears the stagnant air so new growth can occur.",
  },
  {
    num: 7,
    slug: "punarvasu-the-return-of-light",
    meaning: "the two restorers of goods / the return of the light",
    range: "20°00' Gemini-3°20' Cancer",
    rashi: "Spans Gemini padas 1-3 and Cancer pada 4",
    padas: BASE_PADA[7],
    vimshottariYears: 16,
    deityNote: "Aditi, the mother of the gods, provides boundlessness, safety, and ultimate maternal protection.",
    symbolNote: "A quiver of arrows: resources that are endlessly replenished and returned.",
    tattva: "Water (Jala)",
    quality: "Movable (cara): good for travel, healing, returning home, and recovering lost things.",
    correspondences: "Nadi: Vata; caste: Vaishya; direction: North.",
    themes: ["renewal", "safety", "replenishment"],
    moonReading: "Moon here is nurturing, optimistic, deeply attached to home, and seeded into Jupiter mahadasha.",
    beneficReading: "Benefics give immense protective grace, abundance, and the ability to bounce back from loss.",
    maleficReading: "Malefics can cause multiple attempts before success; the 'return' implies a prior departure.",
    caution: "Watch the sign boundary. Gemini padas are intellectual; the Cancer pada shifts to deep emotion.",
  },
  {
    num: 8,
    slug: "pushya-the-nourisher",
    meaning: "the nourisher / the blossoming",
    range: "3°20'-16°40' Cancer",
    rashi: "Entirely in Cancer (Karka)",
    padas: BASE_PADA[8],
    vimshottariYears: 19,
    deityNote: "Brihaspati, the guru of the gods, brings divine wisdom, ritual purity, and expansion.",
    symbolNote: "A cow's udder or lotus: supreme selfless nourishment and spiritual blossoming.",
    tattva: "Water (Jala)",
    quality: "Gentle (mridu): the most auspicious star for initiating positive, nurturing, and spiritual actions.",
    correspondences: "Nadi: Pitta; caste: Kshatriya; direction: East.",
    themes: ["nourishment", "devotion", "wisdom"],
    moonReading: "Moon here is profoundly devoted, stable, spiritually inclined, and seeded into Saturn mahadasha.",
    beneficReading: "Benefics express their highest protective and nurturing qualities here, supporting growth.",
    maleficReading: "Saturn's rulership means the nourishment requires discipline; it is not lazy indulgence.",
    caution: "Pushya is highly auspicious for everything EXCEPT marriage, per classical Muhurta rules.",
  },
  {
    num: 9,
    slug: "ashlesha-the-entwiner-naga-domain",
    meaning: "the entwiner / the embrace",
    range: "16°40'-30°00' Cancer",
    rashi: "Entirely in Cancer (Karka)",
    padas: BASE_PADA[9],
    vimshottariYears: 17,
    deityNote: "The Nagas (divine serpents) govern hidden realms, venom, mystical insight, and tight attachment.",
    symbolNote: "A coiled serpent: intense embrace, hypnotic focus, Kundalini energy, and hidden motives.",
    tattva: "Water (Jala)",
    quality: "Fierce (krura/ugra): good for secretive acts, intense focus, confronting poison, and mesmerism.",
    correspondences: "Nadi: Kapha; caste: Mleccha; direction: South.",
    themes: ["entwining", "hidden depths", "hypnotic focus"],
    moonReading: "Moon here is intensely observant, secretive, prone to deep attachments, and seeded into Mercury mahadasha.",
    beneficReading: "Benefics give profound psychological insight, protective embrace, and mystical awareness.",
    maleficReading: "Malefics can weaponize the venom; watch for manipulation, paranoia, or suffocating attachment.",
    caution: "Ashlesha marks the volatile Gandanta zone (water-to-fire transition) at its very end (Cancer 30°).",
  },
  {
    num: 10,
    slug: "magha-the-mighty-ancestor-domain",
    meaning: "the mighty / the great; the throne-room",
    range: "0°00'-13°20' Leo",
    rashi: "Entirely in Leo (Simha)",
    padas: BASE_PADA[10],
    vimshottariYears: 7,
    deityNote: "The Pitris are the ancestors, whose lineage, blessings, and dignity flow down to the living.",
    symbolNote: "The throne is power, status, command, royal dignity: Magha gives a natural sense of station and pride.",
    tattva: "Water (jala)",
    quality: "Fierce (ugra/krura): auspicious for assertive, commanding, authoritative acts.",
    correspondences: "Nadi: Kapha; caste: Shudra; direction: West; yoni: rat; gana: rakshasa.",
    themes: ["inherited greatness", "authority", "lineage"],
    moonReading: "Moon here gives a proud, dignified mind with a strong sense of station and tradition; seeds Ketu mahadasha.",
    beneficReading: "Benefics bring their significations with dignity and an honoured, traditional quality.",
    maleficReading: "Malefics can sharpen pride into arrogance or status-obsession; weigh by dignity.",
    caution: "Do not read Magha's power as self-made. The throne is inherited, the dignity descends through lineage.",
  },
  {
    num: 11,
    slug: "purva-phalguni-the-former-fig-tree-domain",
    meaning: "the former reddish/fig one",
    range: "13°20'-26°40' Leo",
    rashi: "Entirely in Leo (Simha)",
    padas: BASE_PADA[11],
    vimshottariYears: 20,
    deityNote: "Bhaga is the Aditya of delight, good fortune, and marital bliss.",
    symbolNote: "The front legs of a bed (the lying-down end) symbolize rest, relaxation, and the pleasures of intimacy.",
    tattva: "Water (jala)",
    quality: "Fierce (ugra/krura): but pleasure-oriented in expression (strong passionate appetite for enjoyment).",
    correspondences: "Nadi: Pitta; caste: Brahmana; direction: North; yoni: rat; gana: manushya.",
    themes: ["pleasure", "romance", "creativity"],
    moonReading: "Moon here gives a warm, sociable, pleasure-loving mind, drawn to beauty and comfort; seeds Venus mahadasha.",
    beneficReading: "Benefics flourish in love, art, and enjoyment.",
    maleficReading: "Malefics can tilt the pleasure-seeking toward indulgence or laziness, or mature it into measured enjoyment.",
    caution: "Do not confuse the fierce quality as contradicting pleasure. It expresses through vivid appetite and lavish warmth.",
  },
  {
    num: 12,
    slug: "uttara-phalguni-the-latter-fig-tree-domain",
    meaning: "the latter reddish/fig one",
    range: "26°40' Leo - 10°00' Virgo",
    rashi: "Spans Leo (pada 1) and Virgo (padas 2-4)",
    padas: BASE_PADA[12],
    vimshottariYears: 6,
    deityNote: "Aryaman is the Aditya of patronage, contracts, alliances, hospitality, and noble friendship.",
    symbolNote: "The back legs of a bed (the supporting end) symbolize the stable foundation of a union rather than its first delight.",
    tattva: "Fire (agni)",
    quality: "Fixed (dhruva): auspicious for permanent, foundational acts, marriage and alliances.",
    correspondences: "Nadi: Vata; caste: Kshatriya; direction: East; yoni: cow/bull; gana: manushya.",
    themes: ["commitment", "patronage", "lasting union"],
    moonReading: "Moon gives a reliable, generous mind oriented to commitment, friendship, and service; seeds Sun mahadasha.",
    beneficReading: "Benefics bring steady, honourable, enduring quality.",
    maleficReading: "Malefics can stiffen the commitment into rigidity or over-obligation.",
    caution: "Unlike Purva-Phalguni, Uttara-Phalguni is highly auspicious for marriage. Do not ignore the sign-crossing.",
  },
  {
    num: 13,
    slug: "hasta-the-hand-skill-domain",
    meaning: "the hand; skill and craftsmanship",
    range: "10°00'-23°20' Virgo",
    rashi: "Entirely in Virgo (Kanya)",
    padas: BASE_PADA[13],
    vimshottariYears: 10,
    deityNote: "Savitri is the Sun as divine inspirer and impeller, giving the blessing to rouse, accomplish, and set in motion.",
    symbolNote: "An open palm is the instrument of all skill, craft, and making: having it 'in hand'.",
    tattva: "Fire (agni)",
    quality: "Light/swift (laghu/kshipra): auspicious for crafts, trade, learning a skill, quick acts, and healing.",
    correspondences: "Nadi: Vata; caste: Vaishya; direction: East; yoni: buffalo; gana: deva.",
    themes: ["skill/craft", "healing touch", "manifestation"],
    moonReading: "Moon gives a skilful, clever, resourceful doer's mind; adaptable and capable; seeds Moon mahadasha.",
    beneficReading: "Benefics bring skill, deftness, and the capacity to manifest.",
    maleficReading: "Malefics can tilt the cleverness toward trickery, manipulation, or restless fiddling.",
    caution: "Do not reduce Hasta to manual labour. It governs all skill, and is morally neutral (mastery vs sleight).",
  },
];

const GRAHAS = ["Moon", "Sun", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"] as const;

const CH1_ARC: ArcSegment[] = [
  { num: 1, label: "Ashvini" },
  { num: 2, label: "Bharani" },
  { num: 3, label: "Krittika" },
  { num: 4, label: "Rohini" },
  { num: 5, label: "Mrigashira" },
];

const CH2_ARC: ArcSegment[] = [
  { num: 6, label: "Ardra" },
  { num: 7, label: "Punarvasu" },
  { num: 8, label: "Pushya" },
  { num: 9, label: "Ashlesha" },
];

const CH3_ARC: ArcSegment[] = [
  { num: 10, label: "Magha" },
  { num: 11, label: "Purva-Phalguni" },
  { num: 12, label: "Uttara-Phalguni" },
  { num: 13, label: "Hasta" },
];

function polar(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, start: number, end: number) {
  const s = polar(cx, cy, r, end);
  const e = polar(cx, cy, r, start);
  const largeArc = end - start <= 180 ? "0" : "1";
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 0 ${e.x} ${e.y} L ${cx} ${cy} Z`;
}

function getBase(num: number): NakshatraData {
  return NAKSHATRAS.find((item) => item.num === num) ?? NAKSHATRAS[0];
}

function getProfile(num: number): Profile {
  return PROFILES.find((item) => item.num === num) ?? PROFILES[0];
}

function getAttributeValue(profile: Profile, base: NakshatraData, key: AttributeKey) {
  switch (key) {
    case "identity":
      return `${base.name}: ${profile.meaning}`;
    case "range":
      return `${profile.range}; ${profile.rashi}`;
    case "padas":
      return profile.padas.map((pada) => `P${pada.num} ${pada.navamsa}`).join(" | ");
    case "lord":
      return `${base.ruler}; Vimshottari mahadasha ${profile.vimshottariYears} years`;
    case "deity":
      return `${base.deity}. ${profile.deityNote}`;
    case "symbol":
      return `${base.symbol}. ${profile.symbolNote}`;
    case "gana":
      return base.gana;
    case "yoni":
      return base.yoni;
    case "tattva":
      return profile.tattva;
    case "quality":
      return profile.quality;
    case "correspondences":
      return profile.correspondences;
    case "reading":
      return profile.moonReading;
    default:
      return "";
  }
}

function getReading(profile: Profile, graha: string) {
  if (graha === "Moon") return profile.moonReading;
  if (["Jupiter", "Venus", "Mercury"].includes(graha)) return profile.beneficReading;
  if (["Mars", "Saturn", "Rahu", "Ketu", "Sun"].includes(graha)) return profile.maleficReading;
  return profile.beneficReading;
}

function ChapterArc({
  active,
  onSelect,
}: {
  active: number;
  onSelect: (num: number) => void;
}) {
  const activeProfile = getProfile(active);
  const activeBase = getBase(active);
  const activeStyle = RULER_COLORS[activeBase.rulerKey];

  const isCh3 = active > 9;
  const isCh2 = active > 5 && active <= 9;
  const arcSegments = isCh3 ? CH3_ARC : isCh2 ? CH2_ARC : CH1_ARC;
  const chapterTitle = isCh3 ? "Chapter 3 sky path" : isCh2 ? "Chapter 2 sky path" : "Chapter 1 sky path";
  const chapterSubtitle = isCh3 ? "Leo 0°00' to Virgo 23°20'" : isCh2 ? "Mithuna 6°40' to Karka 30°00'" : "Mesha 0° to Mithuna 6°40 min";

  return (
    <div className="rounded-xl p-4" style={{ background: "var(--gl-card-surface-solid)", border: "1px solid var(--gl-gold-hairline)" }}>
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <Map size={17} color={activeStyle.text} />
          <h3 className="text-base font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
            {chapterTitle}
          </h3>
        </div>
        <p className="text-xs font-semibold" style={{ color: "var(--gl-ink-muted)" }}>
          {chapterSubtitle}
        </p>
      </div>

      <div className="mt-4 grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(108px, 1fr))" }}>
        {arcSegments.map((segment) => {
          const base = getBase(segment.num);
          const style = RULER_COLORS[base.rulerKey];
          const profile = getProfile(segment.num);
          const isActive = segment.num === active;
          return (
            <motion.button
              whileHover={{ scale: 1.05, y: -4, rotateX: 5, z: 10 }}
              type="button"
              key={segment.num}
              onClick={() => onSelect(segment.num)}
              className="relative min-h-[74px] rounded-xl p-3 text-left transition-shadow shadow-sm hover:shadow-md"
              style={{
                background: isActive ? style.bg : "var(--gl-card-surface-solid)",
                border: isActive ? `2px solid ${style.border}` : "1px solid var(--gl-gold-hairline)",
                color: isActive ? style.text : "var(--gl-ink-muted)",
                boxShadow: isActive ? `0 0 12px ${style.border}40` : undefined,
                transformStyle: "preserve-3d"
              }}
              title={`${base.name}: ${profile.range}`}
            >
              <span className="block text-[11px] font-bold uppercase tracking-wider">{segment.num}/27</span>
              <span className="mt-1 block text-sm font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
                <IAST>{base.name}</IAST>
              </span>
              <span className="mt-1 block text-[11px] leading-snug" style={{ color: "var(--gl-ink-muted)" }}>
                {segment.label} · {base.ruler}
              </span>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-3 rounded-lg px-3 py-2 text-xs font-semibold" style={{ background: "#FFFDF7", border: "1px solid var(--gl-gold-hairline)", color: "var(--gl-ink-muted)" }}>
        {isCh3
          ? "Uttara-Phalguni crosses from Leo into Virgo, shifting from Solar pride into Mercurial service."
          : isCh2 
          ? "Ashlesha marks the dangerous Gandanta point at Cancer 30°, ending the first great zodiacal quadrant." 
          : "Taurus begins inside Krittika after its first pada; this is why the pada lens matters for boundary-crossing stars."}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))" }}>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider" style={{ color: activeStyle.text }}>
            Active range
          </p>
          <p className="mt-1 text-sm font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
            <IAST>{activeBase.name}</IAST>: {activeProfile.range}
          </p>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: "var(--gl-ink-secondary)", minWidth: 0 }}>
          {activeProfile.rashi}. Boundary-crossing stars expose why pada and sign cannot be skipped.
        </p>
      </div>
    </div>
  );
}

function MeaningBraid({ profile, base }: { profile: Profile; base: NakshatraData }) {
  const style = RULER_COLORS[base.rulerKey];
  const steps = [
    { label: "Deity", value: base.deity, note: profile.deityNote },
    { label: "Symbol", value: base.symbol, note: profile.symbolNote },
    { label: "Lord", value: base.ruler, note: `${base.ruler} gives the dasha key: ${profile.vimshottariYears} years.` },
    { label: "Quality", value: profile.quality.split(":")[0], note: profile.quality },
  ];

  return (
    <div className="rounded-xl p-4" style={{ background: "var(--gl-card-surface-solid)", border: "1px solid var(--gl-gold-hairline)" }}>
      <div className="flex items-center gap-2">
        <GitBranch size={17} color={style.text} />
        <h3 className="text-base font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
          Meaning braid
        </h3>
      </div>
      <div className="mt-3 grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
        {steps.map((step, index) => (
          <div
            key={step.label}
            className="rounded-lg p-3 text-left"
            style={{ background: index === 2 ? style.bg : "#FFFDF7", border: `1px solid ${index === 2 ? style.border : "var(--gl-gold-hairline)"}` }}
            title={step.note}
          >
            <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: index === 2 ? style.text : "var(--gl-ink-muted)" }}>
              {index + 1}. {step.label}
            </p>
            <p className="mt-1 text-sm font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
              <IAST>{step.value}</IAST>
            </p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--gl-ink-secondary)" }}>
        Read in this order: spiritual core, visible image, timing lord, practical suitability. That turns twelve facts into one usable judgement.
      </p>
    </div>
  );
}

function AttributeWheel({
  active,
  base,
  onSelect,
}: {
  active: AttributeKey;
  base: NakshatraData;
  onSelect: (key: AttributeKey) => void;
}) {
  const cx = 180;
  const cy = 180;
  const reducedMotion = useReducedMotion();
  const rulerStyle = RULER_COLORS[base.rulerKey];

  return (
    <motion.svg 
      whileHover={reducedMotion ? undefined : { rotateX: 5, rotateY: -5, scale: 1.02 }}
      style={{ perspective: "1000px", filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.05))" }}
      viewBox="-18 -18 396 396" className="w-full transition-all" role="img" aria-label={`Twelve attribute wheel for ${base.name}`}
    >
      <defs>
        <radialGradient id="nakProfileHub" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#FFFDF7" />
          <stop offset="100%" stopColor={rulerStyle.bg} />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r="155" fill="none" stroke="var(--gl-gold-hairline)" strokeOpacity="0.75" />
      <circle cx={cx} cy={cy} r="104" fill="none" stroke="var(--gl-gold-hairline)" strokeDasharray="3 7" strokeOpacity="0.45" />
      {ATTRIBUTE_ORDER.map((item, index) => {
        const start = -90 + index * 30;
        const end = start + 28;
        const isActive = active === item.key;
        const mid = polar(cx, cy, 115, start + 14);
        const label = polar(cx, cy, 144, start + 14);
        return (
          <g key={item.key}>
            <motion.path
              d={arcPath(cx, cy, 155, start, end)}
              fill={isActive ? rulerStyle.bg : "var(--gl-card-surface-solid, #fffaf0)"}
              stroke={isActive ? rulerStyle.border : "var(--gl-gold-hairline)"}
              strokeWidth={isActive ? 2 : 1}
              opacity={isActive ? 1 : 0.82}
              whileHover={reducedMotion ? undefined : { scale: 1.012, transformOrigin: "180px 180px" }}
              onClick={() => onSelect(item.key)}
              style={{ cursor: "pointer" }}
            />
            <circle cx={mid.x} cy={mid.y} r={isActive ? 6 : 3} fill={isActive ? rulerStyle.text : "var(--gl-gold-accent)"}>
              <title>{item.label}</title>
            </circle>
            <text
              x={label.x}
              y={label.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="12"
              fontWeight={isActive ? 700 : 500}
              fill={isActive ? rulerStyle.text : "var(--gl-ink-muted)"}
              onClick={() => onSelect(item.key)}
              style={{ cursor: "pointer", userSelect: "none" }}
            >
              {item.short}
            </text>
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r="72" fill="url(#nakProfileHub)" stroke={rulerStyle.border} strokeWidth="2" />
      <text x={cx} y={cy - 20} textAnchor="middle" fontSize="13" fontWeight="700" fill={rulerStyle.text}>
        {base.num}/27
      </text>
      <text x={cx} y={cy + 6} textAnchor="middle" fontSize="24" fontWeight="700" fill="var(--gl-ink-primary)">
        {base.name}
      </text>
      <text x={cx} y={cy + 30} textAnchor="middle" fontSize="12" fontWeight="600" fill="var(--gl-ink-muted)">
        {base.ruler} ruled
      </text>
    </motion.svg>
  );
}

export function NakshatraProfile() {
  const lessonSlug = useLessonSlug();
  const defaultNum = SLUG_TO_NAKSHATRA[lessonSlug] ?? 1;
  const [selectedNum, setSelectedNum] = useState(defaultNum);
  const [activeTab, setActiveTab] = useState<"attributes" | "padas" | "placement">("attributes");
  const [activeAttr, setActiveAttr] = useState<AttributeKey>("identity");
  const [activePada, setActivePada] = useState(1);
  const [graha, setGraha] = useState<(typeof GRAHAS)[number]>("Moon");

  const base = useMemo(() => getBase(selectedNum), [selectedNum]);
  const profile = useMemo(() => getProfile(selectedNum), [selectedNum]);
  const rulerStyle = RULER_COLORS[base.rulerKey];
  const ganaStyle = GANA_STYLE[base.gana];
  const activePadaData = profile.padas[activePada - 1];
  const activeAttribute = ATTRIBUTE_ORDER.find((item) => item.key === activeAttr) ?? ATTRIBUTE_ORDER[0];
  const lordTriad = NAKSHATRAS.filter((item) => item.rulerKey === base.rulerKey);
  const reducedMotion = useReducedMotion();

  const reset = () => {
    setSelectedNum(defaultNum);
    setActiveTab("attributes");
    setActiveAttr("identity");
    setActivePada(1);
    setGraha("Moon");
  };

  return (
    <div
      className="w-full overflow-hidden p-6 md:p-8"
      data-interactive="nakshatra-profile"
      style={{
        background: "var(--gl-surface-card, var(--gl-card-surface, #FFF9F0))",
        border: "1px solid var(--gl-border-subtle, var(--gl-gold-hairline))",
        borderRadius: 16,
        boxSizing: "border-box",
        maxWidth: "100%",
      }}
    >
      {/* Header */}
      <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between" style={{ borderColor: "var(--gl-gold-hairline)" }}>
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--gl-gold-accent)" }}>
            <Sparkles size={15} />
            Module 7 profile card
          </div>
          <h2 className="mt-2 text-2xl md:text-3xl font-semibold" style={{ fontFamily: "var(--font-cormorant), serif", color: "var(--gl-ink-primary)" }}>
            <IAST>{base.name}</IAST> Twelve-Attribute Explorer
          </h2>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed" style={{ color: "var(--gl-ink-secondary)" }}>
            Select a star below, then use the tabs to explore its core attributes, pada divisions, and planet placements.
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition hover:opacity-80"
          style={{ background: "var(--gl-card-surface-solid)", border: "1px solid var(--gl-gold-hairline)", color: "var(--gl-ink-primary)" }}
        >
          <RotateCcw size={16} />
          Reset
        </button>
      </div>

      {/* Chapter Sky Path Selection (Always Visible at Top) */}
      <div className="mt-6">
        <ChapterArc
          active={selectedNum}
          onSelect={(num) => {
            setSelectedNum(num);
            setActivePada(1);
          }}
        />
      </div>
      {/* Navigation Tabs */}
      <div className="flex gap-2 mt-6 flex-wrap" role="tablist">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          type="button"
          role="tab"
          aria-selected={activeTab === "attributes"}
          onClick={() => setActiveTab("attributes")}
          className="px-4 py-2 text-sm rounded-lg transition-all font-semibold"
          style={{
            background: activeTab === "attributes" ? "var(--gl-gold-accent)" : "var(--gl-surface-manuscript)",
            color: activeTab === "attributes" ? "#1a1a2e" : "var(--gl-ink-primary)",
            border: "1px solid var(--gl-gold-accent)",
            opacity: activeTab === "attributes" ? 1 : 0.7,
          }}
        >
          1. Core Attributes
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          type="button"
          role="tab"
          aria-selected={activeTab === "padas"}
          onClick={() => setActiveTab("padas")}
          className="px-4 py-2 text-sm rounded-lg transition-all font-semibold"
          style={{
            background: activeTab === "padas" ? "var(--gl-gold-accent)" : "var(--gl-surface-manuscript)",
            color: activeTab === "padas" ? "#1a1a2e" : "var(--gl-ink-primary)",
            border: "1px solid var(--gl-gold-accent)",
            opacity: activeTab === "padas" ? 1 : 0.7,
          }}
        >
          2. Pada Lens
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          type="button"
          role="tab"
          aria-selected={activeTab === "placement"}
          onClick={() => setActiveTab("placement")}
          className="px-4 py-2 text-sm rounded-lg transition-all font-semibold"
          style={{
            background: activeTab === "placement" ? "var(--gl-gold-accent)" : "var(--gl-surface-manuscript)",
            color: activeTab === "placement" ? "#1a1a2e" : "var(--gl-ink-primary)",
            border: "1px solid var(--gl-gold-accent)",
            opacity: activeTab === "placement" ? 1 : 0.7,
          }}
        >
          3. Placement Reader
        </motion.button>
      </div>

      {/* Tab Content Area */}
      <div className="mt-8">
        {activeTab === "attributes" && (
          <div
            className="grid items-start gap-8 lg:grid-cols-[1fr_1.2fr]"
          >
            {/* Attribute Wheel & Quick Stats */}
            <div className="flex flex-col items-center">
              <div className="w-full max-w-[320px] lg:max-w-[360px]">
                <AttributeWheel active={activeAttr} base={base} onSelect={setActiveAttr} />
              </div>

              <div className="mt-6 grid w-full grid-cols-3 gap-2">
                <div className="rounded-lg px-3 py-2 text-center" style={{ background: rulerStyle.bg, border: `1px solid ${rulerStyle.border}` }}>
                  <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "var(--gl-ink-muted)" }}>
                    Lord
                  </p>
                  <p className="text-sm font-semibold" style={{ color: rulerStyle.text }}>
                    {base.ruler}
                  </p>
                </div>
                <div className="rounded-lg px-3 py-2 text-center" style={{ background: ganaStyle.bg, border: `1px solid ${ganaStyle.text}` }}>
                  <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "var(--gl-ink-muted)" }}>
                    Gana
                  </p>
                  <p className="text-sm font-semibold" style={{ color: ganaStyle.text }}>
                    {base.gana}
                  </p>
                </div>
                <div className="rounded-lg px-3 py-2 text-center" style={{ background: "var(--gl-surface-manuscript)", border: "1px solid var(--gl-gold-hairline)" }}>
                  <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "var(--gl-ink-muted)" }}>
                    Tara
                  </p>
                  <p className="text-sm font-semibold" style={{ color: "var(--gl-gold-accent)" }}>
                    {base.taraName}
                  </p>
                </div>
              </div>
            </div>

            {/* Selected Attribute Detail & Meaning Braid */}
            <div className="space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedNum}-${activeAttr}`}
                  initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
                  className="rounded-xl p-6"
                  style={{ background: rulerStyle.bg, border: `1px solid ${rulerStyle.border}` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider" style={{ color: rulerStyle.text }}>
                        Selected attribute
                      </p>
                      <h3 className="mt-1 text-xl font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
                        {activeAttribute.label}
                      </h3>
                    </div>
                    <BookOpen size={22} color={rulerStyle.text} />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--gl-ink-secondary)" }}>
                    {getAttributeValue(profile, base, activeAttr)}
                  </p>
                </motion.div>
              </AnimatePresence>

              <MeaningBraid profile={profile} base={base} />

              <div className="grid gap-3 grid-cols-3">
                {profile.themes.map((theme) => (
                  <div key={theme} className="rounded-lg px-3 py-2 text-center" style={{ background: "var(--gl-surface-manuscript)", border: "1px solid var(--gl-gold-hairline)" }}>
                    <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--gl-ink-muted)" }}>
                      Theme
                    </p>
                    <p className="mt-1 text-sm font-semibold capitalize" style={{ color: rulerStyle.text }}>
                      {theme}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "padas" && (
          <div className="mx-auto max-w-2xl space-y-6">
            <div className="rounded-xl p-5" style={{ background: "var(--gl-surface-manuscript)", border: "1px solid var(--gl-gold-hairline)" }}>
              <div className="flex items-center gap-2">
                <Moon size={18} color={rulerStyle.text} />
                <h3 className="text-lg font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
                  The Pada Lens
                </h3>
              </div>
              <p className="mt-1 text-sm" style={{ color: "var(--gl-ink-secondary)" }}>
                Each nakshatra is divided into four 3°20&apos; padas, acting as a bridge to the Navamsha (D9) divisional chart.
              </p>

              <div className="mt-6 grid grid-cols-4 gap-3">
                {profile.padas.map((pada) => {
                  const isActive = pada.num === activePada;
                  return (
                    <button
                      type="button"
                      key={pada.num}
                      onClick={() => setActivePada(pada.num)}
                      className="rounded-xl px-2 py-3 text-center transition"
                      style={{
                        background: isActive ? rulerStyle.bg : "var(--gl-surface-manuscript)",
                        border: isActive ? `2px solid ${rulerStyle.border}` : "1px solid var(--gl-gold-hairline)",
                      }}
                    >
                      <span className="block text-sm font-bold" style={{ color: isActive ? rulerStyle.text : "var(--gl-gold-accent)" }}>
                        Pada {pada.num}
                      </span>
                      <span className="block text-xs font-semibold mt-1" style={{ color: "var(--gl-ink-secondary)" }}>
                        {base.syllables[pada.num - 1]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl p-6" style={{ background: rulerStyle.bg, border: `1px solid ${rulerStyle.border}` }}>
              <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: rulerStyle.text }}>
                Pada {activePada} Details
              </h4>
              <div className="mt-4 space-y-3">
                <div>
                  <span className="text-xs text-gray-500 uppercase font-semibold">Degrees Range</span>
                  <p className="text-base font-semibold" style={{ color: "var(--gl-ink-primary)" }}>{activePadaData.range}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase font-semibold">Navamsha (D9) Sign</span>
                  <p className="text-base font-semibold" style={{ color: "var(--gl-ink-primary)" }}>{activePadaData.navamsa}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase font-semibold">Sign Coloration / Context</span>
                  <p className="text-sm mt-1 leading-relaxed" style={{ color: "var(--gl-ink-secondary)" }}>
                    This pada occupies {activePadaData.sign} in the main Rashi chart, projecting to the {activePadaData.navamsa} navamsha.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "placement" && (
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="rounded-xl p-5" style={{ background: "var(--gl-surface-manuscript)", border: "1px solid var(--gl-gold-hairline)" }}>
              <div className="flex items-center gap-2">
                <Brain size={18} color={rulerStyle.text} />
                <h3 className="text-lg font-semibold" style={{ color: "var(--gl-ink-primary)" }}>
                  Placement Reader
                </h3>
              </div>
              <p className="mt-1 text-sm" style={{ color: "var(--gl-ink-secondary)" }}>
                Click a planet to see how its significations are flavored by <IAST>{base.name}</IAST>.
              </p>

              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {GRAHAS.map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => setGraha(item)}
                    className="rounded-full px-4 py-2 text-sm font-semibold transition"
                    style={{
                      background: graha === item ? rulerStyle.bg : "var(--gl-surface-manuscript)",
                      border: graha === item ? `1px solid ${rulerStyle.border}` : "1px solid var(--gl-gold-hairline)",
                      color: graha === item ? rulerStyle.text : "var(--gl-ink-muted)",
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl p-6" style={{ background: "var(--gl-surface-manuscript)", border: `1px solid var(--gl-gold-hairline)`, borderLeft: `6px solid ${rulerStyle.border}` }}>
              <h4 className="text-sm font-bold uppercase tracking-wider" style={{ color: rulerStyle.text }}>
                Reading: {graha} in <IAST>{base.name}</IAST>
              </h4>
              <p className="mt-3 text-base leading-relaxed" style={{ color: "var(--gl-ink-primary)" }}>
                {getReading(profile, graha)}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl p-5" style={{ background: "var(--gl-surface-manuscript)", border: "1px solid var(--gl-gold-hairline)" }}>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--gl-gold-accent)" }}>
                  Lord Triad Memory Hook
                </p>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--gl-ink-secondary)" }}>
                  {base.ruler} rules <span className="font-semibold">{lordTriad.map((item) => item.name).join(", ")}</span>.
                </p>
              </div>

              <div className="rounded-xl p-5" style={{ background: "var(--gl-surface-manuscript)", border: "1px solid var(--gl-gold-hairline)" }}>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--gl-gold-accent)" }}>
                  Reading Discipline
                </p>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--gl-ink-secondary)" }}>
                  {profile.caution}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
