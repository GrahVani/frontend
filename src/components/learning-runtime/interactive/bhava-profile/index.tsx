"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AlertTriangle, BriefcaseBusiness, Car, CircleDot, Coins, Compass, GraduationCap, HeartPulse, Home, Landmark, MessageCircle, Moon, RotateCcw, ShieldCheck, Sparkles, Sun, UsersRound, Utensils, UserRound } from "lucide-react";
import { useLessonSlug } from "../rashi-attribute-wheel";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";

const HOUSES = [
  "Tanu",
  "Dhana",
  "Sahaja",
  "Sukha",
  "Putra",
  "Ripu",
  "Yuvati",
  "Randhra",
  "Dharma",
  "Karma",
  "Labha",
  "Vyaya",
];

const LAGNESHA_NOTES = [
  {
    house: 1,
    title: "Self-led anchor",
    note: "The chart leader sits in the self: identity, vitality, and personal initiative become very direct.",
  },
  {
    house: 2,
    title: "Family and speech color the self",
    note: "The life-anchor bends toward resources, food, speech, family values, and accumulated stability.",
  },
  {
    house: 3,
    title: "Effort becomes the anchor",
    note: "Courage, skills, siblings, writing, and repeated practice shape how the native stands in life.",
  },
  {
    house: 4,
    title: "Inner base becomes central",
    note: "Home, mother, education, property, and emotional steadiness strongly color the whole chart.",
  },
  {
    house: 5,
    title: "Intelligence and merit lead",
    note: "Learning, creativity, mantra, children, and purva-punya become key carriers of the self.",
  },
  {
    house: 6,
    title: "Growth through friction",
    note: "Service, discipline, debts, disease, and competition become arenas where the native builds strength.",
  },
  {
    house: 7,
    title: "Self meets the other",
    note: "Partnership, contracts, spouse, and public dealings become major mirrors for the native's life.",
  },
  {
    house: 8,
    title: "Depth and vulnerability",
    note: "Longevity, hidden matters, breaks, inheritance, and transformation pull the chart-anchor inward.",
  },
  {
    house: 9,
    title: "Dharma steers the life",
    note: "Teachers, blessings, father, scripture, ethics, and fortune guide the native's wider direction.",
  },
  {
    house: 10,
    title: "Action becomes visible",
    note: "Career, authority, karma, status, and public work become the field where the self is expressed.",
  },
  {
    house: 11,
    title: "Networks amplify the native",
    note: "Gains, elder siblings, allies, ambitions, and large circles become major life channels.",
  },
  {
    house: 12,
    title: "Release and retreat color the self",
    note: "Foreign lands, sleep, losses, solitude, expenditure, and moksha themes draw the chart-anchor beyond the visible.",
  },
];

const CONDITIONS = {
  strong: {
    label: "Strong Lagnesha",
    color: GREEN,
    score: 86,
    note: "Well placed, supported, or dignified: the whole chart gains stamina and clearer direction.",
  },
  ordinary: {
    label: "Average Lagnesha",
    color: GOLD,
    score: 58,
    note: "Functional but mixed: read house, dignity, aspects, and company before calling the foundation strong or weak.",
  },
  afflicted: {
    label: "Afflicted Lagnesha",
    color: VERMILION,
    score: 34,
    note: "Debilitated, harmed, or unsupported: health, confidence, and chart-wide steadiness need careful cultivation.",
  },
} as const;

const OCCUPANTS = {
  none: {
    label: "No planet in 1st",
    color: INK_MUTED,
    note: "Read the Lagna sign and Lagnesha first. An empty 1st is still the chart's anchor.",
  },
  benefic: {
    label: "Benefic in 1st",
    color: GREEN,
    note: "Jupiter, Venus, or a supportive Moon can bless appearance, temperament, health, and approachability.",
  },
  malefic: {
    label: "Malefic in 1st",
    color: VERMILION,
    note: "Saturn or Mars can sober or sharpen the self. This asks for character-cultivation, not panic.",
  },
  mixed: {
    label: "Mixed influence",
    color: PURPLE,
    note: "Multiple influences make the personality layered. Judge dignity, lordship, aspects, and exact strength.",
  },
} as const;

const ATTRIBUTES = [
  ["Name", "Tanu"],
  ["Number", "1st house"],
  ["Domain", "Self, body, personality, Lagna"],
  ["Significations", "native, appearance, vitality, character, self-image, beginnings, will, wellbeing"],
  ["Body", "head, brain, hair, scalp, upper face"],
  ["People", "the native themselves; no relative is assigned here"],
  ["Class 1", "Kendra"],
  ["Class 2", "Trikona"],
  ["Aim", "Dharma group"],
  ["Karaka", "Sun; Mars may be added for vitality"],
] as const;

const DHANA_ATTRIBUTES = [
  ["Name", "Dhana"],
  ["Number", "2nd house"],
  ["Domain", "Accumulated wealth, family, speech, food"],
  ["Significations", "savings, assets, jewels, family lineage, speech, truthfulness, food, values"],
  ["Body", "lower face, right eye, mouth, tongue, teeth, throat"],
  ["People", "immediate family and family lineage"],
  ["Class 1", "Panaphara"],
  ["Class 2", "Maraka with the 7th"],
  ["Aim", "Artha group"],
  ["Karaka", "Jupiter for wealth; Mercury for speech"],
] as const;

const WEALTH_HOUSES = [
  {
    house: 2,
    title: "Dhana",
    label: "Savings",
    color: GOLD,
    note: "Accumulated wealth: what is stored, held, eaten, spoken, and inherited through family.",
  },
  {
    house: 9,
    title: "Dharma",
    label: "Fortune",
    color: PURPLE,
    note: "Bhagya and grace: blessings, teachers, father, ethics, and the fortune that supports prosperity.",
  },
  {
    house: 11,
    title: "Labha",
    label: "Gains",
    color: GREEN,
    note: "Income and fulfilment: earnings, networks, ambitions, and fresh gains entering the life.",
  },
] as const;

const DHANA_OCCUPANTS = {
  none: {
    label: "No planet in 2nd",
    color: INK_MUTED,
    note: "Judge the 2nd lord, aspects, and karakas. An empty 2nd still speaks through its lord.",
  },
  mercury: {
    label: "Mercury in 2nd",
    color: BLUE,
    note: "Clear speech, commerce, calculation, learning, and a persuasive voice become prominent when well placed.",
  },
  jupiter: {
    label: "Jupiter in 2nd",
    color: GREEN,
    note: "Wealth, family support, wisdom in speech, and generosity are strengthened when Jupiter is dignified.",
  },
  malefic: {
    label: "Malefic in 2nd",
    color: VERMILION,
    note: "Speech may become sharp or resources pressured. Judge dignity and timing before making a hard conclusion.",
  },
} as const;

type DhanaOccupantKey = keyof typeof DHANA_OCCUPANTS;

const SAHAJA_ATTRIBUTES = [
  ["Name", "Sahaja / Vikrama"],
  ["Number", "3rd house"],
  ["Domain", "Younger siblings, self-effort, courage, communication"],
  ["Significations", "initiative, valour, writing, short journeys, hobbies, neighbours, mental endurance"],
  ["Body", "arms, hands, shoulders, right ear, upper chest"],
  ["People", "younger siblings, neighbours, short-term companions"],
  ["Class 1", "Apoklima"],
  ["Class 2", "Upachaya"],
  ["Aim", "Kama group"],
  ["Karaka", "Mars for siblings and valour; Mercury for communication"],
] as const;

const UPACHAYA_HOUSES = [
  {
    house: 3,
    title: "Sahaja",
    label: "Courage",
    color: BLUE,
    note: "A malefic here can build initiative, grit, writing effort, and courage over time.",
  },
  {
    house: 6,
    title: "Ripu",
    label: "Competition",
    color: VERMILION,
    note: "A malefic here can build capacity to defeat obstacles, enemies, debts, and disease.",
  },
  {
    house: 10,
    title: "Karma",
    label: "Work",
    color: GOLD,
    note: "A malefic here can forge career strength through responsibility, pressure, and persistence.",
  },
  {
    house: 11,
    title: "Labha",
    label: "Gains",
    color: GREEN,
    note: "A malefic here can drive gains, ambition, networks, and fulfilment through sustained effort.",
  },
] as const;

const SAHAJA_MALEFICS = {
  saturn: {
    label: "Saturn",
    color: VERMILION,
    note: "Saturn grows slowly: discipline, endurance, patience, and earned courage.",
  },
  mars: {
    label: "Mars",
    color: GOLD,
    note: "Mars grows through action: boldness, initiative, skill, and competitive drive.",
  },
  rahu: {
    label: "Rahu",
    color: PURPLE,
    note: "Rahu grows through hunger: ambition, experimentation, and unusual communications.",
  },
  ketu: {
    label: "Ketu",
    color: BLUE,
    note: "Ketu grows through focus: technical skill, detachment, and sharp independent effort.",
  },
} as const;

type SahajaMaleficKey = keyof typeof SAHAJA_MALEFICS;

const SUKHA_ATTRIBUTES = [
  ["Name", "Sukha / Bandhu"],
  ["Number", "4th house"],
  ["Domain", "Mother, home, emotional security, land, vehicles, education"],
  ["Significations", "home base, mother, property, land, vehicles, formal education, inner peace, domestic life"],
  ["Body", "chest, heart, lungs, emotional centre"],
  ["People", "mother, caretakers, kin and domestic circle"],
  ["Class 1", "Kendra"],
  ["Class 2", "Moksha group"],
  ["Aim", "Inner settlement and release"],
  ["Karaka", "Moon primary; Mars/Saturn land; Mercury education; Venus vehicles"],
] as const;

const SUKHA_QUESTIONS = {
  mother: {
    label: "Mother / comfort",
    karaka: "Moon",
    color: BLUE,
    icon: Moon,
    note: "Lead with the Moon for mother, emotional comfort, mental settlement, and the felt safety of home.",
  },
  land: {
    label: "Land / property",
    karaka: "Mars + Saturn",
    color: VERMILION,
    icon: Landmark,
    note: "For land and property, bring Mars forward for land and Saturn for durable structures and settled holdings.",
  },
  education: {
    label: "Education",
    karaka: "Mercury",
    color: GREEN,
    icon: GraduationCap,
    note: "For education, use Mercury alongside the 4th lord and occupants, especially for school-level learning.",
  },
  vehicles: {
    label: "Vehicles",
    karaka: "Venus",
    color: PURPLE,
    icon: Car,
    note: "For vehicles and comforts, bring Venus forward while still checking the 4th house and its lord.",
  },
} as const;

const SUKHA_OCCUPANTS = {
  benefic: {
    label: "Benefic in 4th",
    color: GREEN,
    note: "A benefic tends to settle the home and heart, supporting comfort, peace, and domestic sweetness.",
  },
  moon: {
    label: "Moon in 4th",
    color: BLUE,
    note: "The primary karaka sits in its natural field: mother, mind, and emotional security become central.",
  },
  malefic: {
    label: "Malefic in 4th",
    color: VERMILION,
    note: "Saturn or Mars can make home and heart effortful or sober. Weigh dignity and benefic aspects before judging.",
  },
  mixed: {
    label: "Mixed influence",
    color: GOLD,
    note: "The 4th becomes layered: one part may support home while another pressures land, mother, or emotional peace.",
  },
} as const;

type SukhaQuestionKey = keyof typeof SUKHA_QUESTIONS;
type SukhaOccupantKey = keyof typeof SUKHA_OCCUPANTS;

const PUTRA_ATTRIBUTES = [
  ["Name", "Putra / Suta"],
  ["Number", "5th house"],
  ["Domain", "Children, intellect, merit, mantra, creativity, speculation"],
  ["Significations", "children, applied intellect, purva-punya, mantra, devotion, creativity, romance, students, speculation"],
  ["Body", "upper abdomen and stomach"],
  ["People", "children, students, pupils"],
  ["Class 1", "Panaphara"],
  ["Class 2", "Trikona"],
  ["Aim", "Dharma group"],
  ["Karaka", "Jupiter for children, wisdom, devotion, and merit"],
] as const;

const PUTRA_DOMAINS = {
  children: {
    label: "Children",
    color: GREEN,
    icon: UserRound,
    note: "The primary Putra meaning: progeny, students, and blessings that continue the line.",
  },
  intellect: {
    label: "Intellect",
    color: BLUE,
    icon: GraduationCap,
    note: "Applied discernment and counsel: not raw Mercury-mind, but wisdom that can judge well.",
  },
  mantra: {
    label: "Mantra",
    color: PURPLE,
    icon: Sparkles,
    note: "Devotion, mantra, and spiritual practice are the 5th's own means of replenishing merit.",
  },
  speculation: {
    label: "Speculation",
    color: GOLD,
    icon: Coins,
    note: "Risk, speculation, and sudden gains belong here, but a weak 5th cautions against gambling.",
  },
} as const;

const PUTRA_OCCUPANTS = {
  jupiter: {
    label: "Jupiter in 5th",
    color: GREEN,
    note: "Karaka in its field: children, wisdom, devotion, and good counsel are strengthened when Jupiter is sound.",
  },
  benefic: {
    label: "Benefic in 5th",
    color: BLUE,
    note: "A benefic enriches the blessing cluster: children, creativity, study, romance, and fortune flow more easily.",
  },
  malefic: {
    label: "Malefic in 5th",
    color: VERMILION,
    note: "A malefic can complicate progeny or speculation. Read difficulty honestly, but never as a curse.",
  },
  rahu: {
    label: "Rahu in 5th",
    color: PURPLE,
    note: "Rahu can intensify risk, romance, creativity, or speculation. Discipline matters before chasing sudden gains.",
  },
} as const;

type PutraDomainKey = keyof typeof PUTRA_DOMAINS;
type PutraOccupantKey = keyof typeof PUTRA_OCCUPANTS;

const SHATRU_ATTRIBUTES = [
  ["Name", "Shatru / Ari / Roga"],
  ["Number", "6th house"],
  ["Domain", "Enemies, illness, debt, service, daily work"],
  ["Significations", "open enemies, disease, debts, obligations, service, routine, competition, litigation, maternal uncle, hygiene"],
  ["Body", "lower abdomen, intestines, digestive tract"],
  ["People", "open enemies, servants/employees, maternal uncle"],
  ["Class 1", "Apoklima"],
  ["Class 2", "Dusthana + upachaya"],
  ["Aim", "Artha group"],
  ["Karaka", "Mars for conflict; Saturn for chronic illness and service"],
] as const;

const SHATRU_OCCUPANTS = {
  mars: {
    label: "Mars in 6th",
    color: VERMILION,
    note: "Mars aims its fight at the right target: opponents, debts, and obstacles. This is often favourable.",
  },
  saturn: {
    label: "Saturn in 6th",
    color: PURPLE,
    note: "Saturn brings endurance, duty, and capacity for service. Chronic pressure becomes workable discipline.",
  },
  jupiter: {
    label: "Jupiter in 6th",
    color: GREEN,
    note: "Jupiter gives soft support, but a gentle benefic has less fighting power in a battle-house.",
  },
  benefic: {
    label: "Other benefic",
    color: BLUE,
    note: "A benefic can soothe the 6th, but may be weaker here than a malefic that can actually fight.",
  },
} as const;

const TROUBLE_HOUSES = [
  {
    house: 6,
    title: "Fightable",
    color: VERMILION,
    note: "Visible trouble: enemies, illness, debt, competition. These are obstacles effort can defeat.",
  },
  {
    house: 8,
    title: "Sudden / hidden",
    color: PURPLE,
    note: "Hidden or sudden trouble: crises, breaks, longevity, transformation, and occult depth.",
  },
  {
    house: 12,
    title: "Loss / release",
    color: GOLD,
    note: "Dissolving trouble: loss, expenditure, sleep, foreignness, retreat, and letting go.",
  },
] as const;

type ShatruOccupantKey = keyof typeof SHATRU_OCCUPANTS;

const YUVATI_ATTRIBUTES = [
  ["Name", "Yuvati / Kalatra / Dyuna"],
  ["Number", "7th house"],
  ["Domain", "Spouse, partnership, trade, travel, the other"],
  ["Significations", "marriage, business partners, contracts, trade, public dealings, foreign travel, open opponents"],
  ["Body", "lower abdomen and pelvic region"],
  ["People", "spouse, partners, clients, open opponents"],
  ["Class 1", "Kendra"],
  ["Class 2", "Maraka with the 2nd"],
  ["Aim", "Kama group"],
  ["Karaka", "Venus in male charts; Jupiter in female charts; Mercury for trade"],
] as const;

const YUVATI_OCCUPANTS = {
  benefic: {
    label: "Benefic on axis",
    color: GREEN,
    note: "A benefic tends to ease partnership, counsel, cooperation, and public dealings.",
  },
  mars: {
    label: "Mars on axis",
    color: VERMILION,
    note: "Mars can sharpen attraction, conflict, assertion, and the way the self meets the other.",
  },
  saturn: {
    label: "Saturn on axis",
    color: PURPLE,
    note: "Saturn can delay, sober, formalize, or burden partnership, but may also make it durable.",
  },
  mercury: {
    label: "Mercury on axis",
    color: BLUE,
    note: "Mercury supports trade, contracts, negotiation, and business partnership.",
  },
} as const;

type ChartGenderKey = "male" | "female";
type YuvatiOccupantKey = keyof typeof YUVATI_OCCUPANTS;

const AYU_ATTRIBUTES = [
  ["Name", "Ayu / Randhra / Mrtyu"],
  ["Number", "8th house"],
  ["Domain", "Longevity, hidden things, inheritance, occult, transformation"],
  ["Significations", "longevity, secrets, unconscious, inheritance, insurance, sudden windfalls, occult, research, crisis, chronic disease"],
  ["Body", "external genitals and excretory organs"],
  ["People", "in-laws, spouse's family"],
  ["Class 1", "Panaphara"],
  ["Class 2", "Dusthana + moksha group"],
  ["Aim", "Transformation through depth"],
  ["Karaka", "Saturn for longevity, endings, slow and hidden matters"],
] as const;

const AYU_FACES = {
  longevity: {
    label: "Longevity",
    color: PURPLE,
    note: "Saturn is the karaka, but lifespan needs convergence of many factors and must never be pronounced from one placement.",
  },
  hidden: {
    label: "Hidden / research",
    color: BLUE,
    note: "The 8th uncovers what is concealed: secrets, unconscious material, occult study, and deep research.",
  },
  inheritance: {
    label: "Inheritance",
    color: GOLD,
    note: "The 8th can show legacies, insurance, and unearned gain, especially when linked to the 2nd or 11th.",
  },
  transformation: {
    label: "Transformation",
    color: GREEN,
    note: "The 8th's difficulty can become depth, initiation, and real change when handled honestly.",
  },
} as const;

const AYU_OCCUPANTS = {
  saturn: {
    label: "Saturn in 8th",
    color: PURPLE,
    note: "Saturn emphasizes longevity, endurance, fear, endings, and slow hidden processes. Read with restraint.",
  },
  ketu: {
    label: "Ketu in 8th",
    color: BLUE,
    note: "Ketu can deepen occult or research aptitude, while also drawing the native toward turbulence or detachment.",
  },
  benefic: {
    label: "Benefic in 8th",
    color: GREEN,
    note: "A benefic can protect, support inheritance, or soften crisis, but it still works through an 8th-house field.",
  },
  malefic: {
    label: "Malefic in 8th",
    color: VERMILION,
    note: "A malefic can intensify upheaval or chronic difficulty. Name the pressure without catastrophising.",
  },
} as const;

type AyuFaceKey = keyof typeof AYU_FACES;
type AyuOccupantKey = keyof typeof AYU_OCCUPANTS;

const BHAGYA_ATTRIBUTES = [
  ["Name", "Bhagya / Pitri / Dharma"],
  ["Number", "9th house"],
  ["Domain", "Father, dharma, fortune, higher learning, guru"],
  ["Significations", "father, dharma, fortune, guru, higher learning, pilgrimage, philosophy, worship, distant travel, charity"],
  ["Body", "hips and thighs"],
  ["People", "father and guru"],
  ["Class 1", "Apoklima"],
  ["Class 2", "Trikona"],
  ["Aim", "Dharma group"],
  ["Karaka", "Sun for father; Jupiter for dharma, guru, and fortune"],
] as const;

const BHAGYA_QUESTIONS = {
  father: {
    label: "Father",
    karaka: "Sun",
    color: VERMILION,
    note: "For father questions, weigh the Sun with the 9th house and its lord.",
  },
  dharma: {
    label: "Dharma",
    karaka: "Jupiter",
    color: GREEN,
    note: "For dharma, meaning, ethics, and fortune, Jupiter comes forward as the main karaka.",
  },
  guru: {
    label: "Guru / teaching",
    karaka: "Jupiter",
    color: PURPLE,
    note: "For teacher, guidance, higher learning, and pilgrimage, Jupiter carries the living wisdom register.",
  },
  fortune: {
    label: "Fortune",
    karaka: "Jupiter",
    color: GOLD,
    note: "For broad good fortune, read the 9th, its lord, benefic support, and Jupiter's condition.",
  },
} as const;

const JUPITER_ALIGNMENTS = {
  none: {
    label: "No Jupiter link",
    color: INK_MUTED,
    note: "No special 9th-Jupiter alignment is active. Read the 9th by ordinary house, lord, occupant, and aspect rules.",
  },
  in: {
    label: "Jupiter in 9th",
    color: GREEN,
    note: "Jupiter sits in the dharma house: the significator and significated align directly.",
  },
  aspecting: {
    label: "Jupiter aspects 9th",
    color: BLUE,
    note: "Jupiter casts support onto the dharma house, enriching guidance, meaning, and fortune.",
  },
  ruling: {
    label: "Jupiter rules 9th",
    color: PURPLE,
    note: "Jupiter is the 9th lord, so dharma and fortune are carried by the natural dharma-karaka.",
  },
} as const;

type BhagyaQuestionKey = keyof typeof BHAGYA_QUESTIONS;
type JupiterAlignmentKey = keyof typeof JUPITER_ALIGNMENTS;

const KARMA_ATTRIBUTES = [
  ["Name", "Karma / Rajya"],
  ["Number", "10th house"],
  ["Domain", "Profession, status, authority, action in the world"],
  ["Significations", "career, livelihood, reputation, public image, fame, authority, government, leadership"],
  ["Body", "knees and lower thighs"],
  ["People", "superiors, authorities; father in one tradition"],
  ["Class 1", "Kendra"],
  ["Class 2", "Upachaya"],
  ["Aim", "Artha group"],
  ["Karaka", "Saturn primary; Sun, Mercury, Jupiter by career type"],
] as const;

const KARMA_CAREERS = {
  authority: {
    label: "Authority",
    karaka: "Sun",
    color: VERMILION,
    note: "For authority, government, command, and public rank, bring the Sun forward with the 10th and Saturn.",
  },
  commerce: {
    label: "Commerce / skill",
    karaka: "Mercury",
    color: GREEN,
    note: "For trade, business, craft, technical skill, and communication professions, Mercury becomes the career-specific karaka.",
  },
  counsel: {
    label: "Counsel / teaching",
    karaka: "Jupiter",
    color: GOLD,
    note: "For teaching, advice, law, knowledge, and guidance professions, Jupiter carries the career-type signal.",
  },
  endurance: {
    label: "Enduring work",
    karaka: "Saturn",
    color: PURPLE,
    note: "For duty, labor, administration, discipline, and long professional endurance, Saturn is both career type and primary karma-karaka.",
  },
} as const;

const KARMA_OCCUPANTS = {
  saturn: {
    label: "Saturn in 10th",
    color: PURPLE,
    note: "Angle + upachaya + karma-house + karma-karaka converge. This is the slow, disciplined, durable career doctrine.",
  },
  mars: {
    label: "Mars in 10th",
    color: VERMILION,
    note: "Mars becomes public drive and competitive action. The upachaya rule keeps this from being a reflexive career-ruin reading.",
  },
  benefic: {
    label: "Benefic in 10th",
    color: GREEN,
    note: "A benefic can smooth reputation, support helpful authority, and make public action more graceful.",
  },
  empty: {
    label: "No occupant",
    color: INK_MUTED,
    note: "With no occupant, read the 10th sign, its lord, aspects, Saturn, and the career-specific karaka.",
  },
} as const;

type KarmaCareerKey = keyof typeof KARMA_CAREERS;
type KarmaOccupantKey = keyof typeof KARMA_OCCUPANTS;

const PREDICTIVE_KARMA_QUESTIONS = {
  type: {
    label: "Profession type",
    clientQuestion: "What work suits me?",
    color: GREEN,
    short: "Field and style",
    answer: "Read the sign on the 10th, planets in the 10th, the 10th lord, and later the navamsha/D10 refinement.",
    features: ["10th sign", "Occupants", "10th lord", "Navamsha"],
    trap: "Do not infer status only from the sign flavor.",
  },
  status: {
    label: "Status / elevation",
    clientQuestion: "Will I rise?",
    color: GOLD,
    short: "Standing level",
    answer: "Read the strength, dignity, placement, and support of the 10th and its lord.",
    features: ["10th lord", "Strength", "Dignity", "Support"],
    trap: "Do not read rank from sign symbolism alone.",
  },
  independent: {
    label: "Employed vs independent",
    clientQuestion: "Should I stay employed or go independent?",
    color: BLUE,
    short: "Work orientation",
    answer: "Read the 10th lord's orientation: service links such as the 6th versus business or public-dealing links such as the 7th.",
    features: ["10th lord", "6th link", "7th link", "Self houses"],
    trap: "Do not decide this from one occupant without the lord's direction.",
  },
  stability: {
    label: "Stability vs change",
    clientQuestion: "Will I ever settle?",
    color: VERMILION,
    short: "Change pressure",
    answer: "Read the 10th lord's placement, dusthana links, affliction, and timing through dasha in later lessons.",
    features: ["10th lord", "Dusthana links", "Affliction", "Dasha"],
    trap: "Do not answer this with a profession-type reading.",
  },
} as const;

const PREDICTIVE_KARMA_AXES = [
  {
    key: "sign",
    label: "10th sign",
    color: GREEN,
    map: "Field and style",
    note: "Element and nature hint at the kind of work: earth is practical, air is communicative, fire is directive, water is adaptive.",
    questions: ["type"],
  },
  {
    key: "occupants",
    label: "Planets in 10th",
    color: BLUE,
    map: "Vocational signature",
    note: "Occupants strongly flavor the work: Sun for authority, Mercury for commerce, Venus for arts, Saturn for duty and structure.",
    questions: ["type"],
  },
  {
    key: "lord",
    label: "10th lord",
    color: GOLD,
    map: "Delivery and direction",
    note: "Placement, dignity, and strength show how well the career promise delivers and where the career energy flows.",
    questions: ["type", "status", "independent", "stability"],
  },
  {
    key: "navamsha",
    label: "Lord's navamsha",
    color: PURPLE,
    map: "Inner refinement",
    note: "The navamsha of the 10th lord refines type and inner quality; the D10 comes later as a refinement, not a replacement.",
    questions: ["type"],
  },
] as const;

const PREDICTIVE_REFERENCES = {
  lagna: {
    label: "From Lagna",
    color: GOLD,
    focus: "Career proper",
    note: "Start here: the D1 10th from Lagna is the foundation for the professional promise.",
  },
  moon: {
    label: "From Moon",
    color: BLUE,
    focus: "Public and mental feel",
    note: "Shows how work is experienced, how public life feels, and whether the mind can inhabit the role.",
  },
  sun: {
    label: "From Sun",
    color: VERMILION,
    focus: "Authority and vocation",
    note: "Shows authority, purpose in action, and the solar dimension of public role.",
  },
} as const;

type PredictiveKarmaQuestionKey = keyof typeof PREDICTIVE_KARMA_QUESTIONS;
type PredictiveReferenceKey = keyof typeof PREDICTIVE_REFERENCES;

const TENTH_LORD_PLACEMENTS = [
  {
    house: 1,
    name: "Tanu",
    nature: "kendra-trikona",
    color: GOLD,
    direction: "Career becomes identity: self-made work, public personality, and personal effort carry the profession.",
    strong: "High capacity makes the native visible, self-directed, and able to turn personality into professional authority.",
    weak: "Low capacity can make career identity unstable: public effort is present, but confidence or consistency needs support.",
  },
  {
    house: 2,
    name: "Dhana",
    nature: "artha",
    color: GREEN,
    direction: "Career enters wealth, family, food, speech, voice, finance, or accumulated resources.",
    strong: "High capacity supports earning through profession, finance, speech, advising, family enterprise, or food-linked work.",
    weak: "Low capacity can create uneven income, speech-resource pressure, or family obligations shaping career choices.",
  },
  {
    house: 3,
    name: "Sahaja",
    nature: "upachaya",
    color: BLUE,
    direction: "Career runs through effort, communication, courage, hands, media, sales, writing, performance, and initiative.",
    strong: "High capacity turns repeated effort into skill, enterprise, and communications-based professional momentum.",
    weak: "Low capacity still pushes effort, but the person may scatter energy or struggle to sustain independent initiative.",
  },
  {
    house: 4,
    name: "Sukha",
    nature: "kendra",
    color: BLUE,
    direction: "Career connects with home, land, vehicles, education, public base, homeland, comfort, or real estate.",
    strong: "High capacity supports property, education, public-facing service, home-based work, or stable institutional roles.",
    weak: "Low capacity can make private foundations affect the career: home, education, or property matters may interrupt delivery.",
  },
  {
    house: 5,
    name: "Putra",
    nature: "trikona",
    color: GOLD,
    direction: "Career flows through intelligence, teaching, creativity, counsel, speculation, politics, or advisory work.",
    strong: "High capacity gives creative authority, advisory skill, political intelligence, or education-linked professional rise.",
    weak: "Low capacity can make talent visible but inconsistent, especially around speculation, students, or counsel roles.",
  },
  {
    house: 6,
    name: "Shatru",
    nature: "dusthana-upachaya",
    color: VERMILION,
    direction: "Career enters service, employment, competition, medicine, law, litigation, conflict, and overcoming rivals.",
    strong: "High capacity makes the 6th productive: service, medicine, law, operations, competition, and problem-solving can thrive.",
    weak: "Low capacity emphasizes service pressure, rivalry, workplace conflict, or health-debt-obligation themes around work.",
  },
  {
    house: 7,
    name: "Yuvati",
    nature: "kendra",
    color: GREEN,
    direction: "Career goes through partnership, clients, trade, diplomacy, public dealing, contracts, or foreign contact.",
    strong: "High capacity supports business, client-facing work, negotiations, partnership-led success, and public visibility.",
    weak: "Low capacity can bring dependency on partners, unstable contracts, or public dealings that drain the career.",
  },
  {
    house: 8,
    name: "Randhra",
    nature: "dusthana",
    color: PURPLE,
    direction: "Career enters research, hidden matters, investigation, others resources, insurance, inheritance, occult, and transformation.",
    strong: "High capacity channels the 8th into research, investigation, crisis work, depth professions, or confidential expertise.",
    weak: "Low capacity can show breaks, instability, hidden obstructions, or professional volatility if the lord cannot carry the field.",
  },
  {
    house: 9,
    name: "Dharma",
    nature: "trikona-yoga",
    color: GOLD,
    direction: "Career fuses with dharma, law, higher learning, religion, fortune, foreign travel, teaching, or advisory work.",
    strong: "High capacity delivers dharma-karmadhipati strongly: distinguished, fortunate, and purpose-aligned professional rise.",
    weak: "Low capacity leaves the yoga present but under-delivered: fortune is indicated, yet realization needs correction and timing.",
  },
  {
    house: 10,
    name: "Karma",
    nature: "kendra-upachaya",
    color: GOLD,
    direction: "Career stays in its own field: leadership, authority, visibility, professional autonomy, and public action.",
    strong: "High capacity gives a sharp career engine: recognition, authority, and self-driven professional accomplishment.",
    weak: "Low capacity still makes career central, but public delivery may fluctuate until dignity, support, or timing improves.",
  },
  {
    house: 11,
    name: "Labha",
    nature: "upachaya",
    color: GREEN,
    direction: "Career yields gains, networks, large organizations, income, ambitions, and fulfilled professional desires.",
    strong: "High capacity converts profession into income, allies, scale, organizational reach, and material reward.",
    weak: "Low capacity can bring uneven gains, unreliable networks, or ambition that outpaces delivery.",
  },
  {
    house: 12,
    name: "Vyaya",
    nature: "dusthana-moksha",
    color: VERMILION,
    direction: "Career goes abroad, behind the scenes, into seclusion, institutions, hospitals, charities, ashrams, research, or expenditure.",
    strong: "High capacity makes the 12th productive: foreign work, research, spiritual or institutional service, and focused hidden labor.",
    weak: "Low capacity can show loss, obscurity, draining expenditure, isolation, or difficulty receiving recognition.",
  },
] as const;

const TENTH_LORD_CAPACITY = {
  strong: {
    label: "Strong / dignified",
    color: GREEN,
    score: 88,
    note: "The placement direction delivers cleanly. The house signature becomes usable professional strength.",
  },
  mixed: {
    label: "Mixed / average",
    color: GOLD,
    score: 58,
    note: "The direction is real but uneven. Read aspects, dignity, cancellation, and timing before final judgment.",
  },
  weak: {
    label: "Weak / afflicted",
    color: VERMILION,
    score: 30,
    note: "The same direction struggles to deliver. Do not erase the signature, but qualify its outcome carefully.",
  },
} as const;

const TENTH_LORD_CONNECTIONS = {
  direct: {
    label: "10th lord in 9th",
    activeHouse: 9,
    note: "The most direct dharma-karmadhipati expression: karma flows into dharma, fortune, law, teaching, and higher meaning.",
  },
  reverse: {
    label: "9th lord in 10th",
    activeHouse: 10,
    note: "Reverse connection: dharma flows into karma, supporting authority, public work, and fortune-backed action.",
  },
  exchange: {
    label: "9th-10th exchange",
    activeHouse: 9,
    note: "Exchange or conjunction ties fortune and action mutually. Capacity decides whether the yoga is fully delivered.",
  },
} as const;

type TenthLordPlacement = (typeof TENTH_LORD_PLACEMENTS)[number];
type TenthLordCapacityKey = keyof typeof TENTH_LORD_CAPACITY;
type TenthLordConnectionKey = keyof typeof TENTH_LORD_CONNECTIONS;

const LABHA_ATTRIBUTES = [
  ["Name", "Labha / Aya"],
  ["Number", "11th house"],
  ["Domain", "Gains, income, ambitions, networks"],
  ["Significations", "income, profits, fulfilled desires, ambitions, hopes, friends, networks, elder siblings, recovery from illness"],
  ["Body", "lower legs and calves"],
  ["People", "elder siblings, friends, wider network"],
  ["Class 1", "Panaphara"],
  ["Class 2", "Upachaya"],
  ["Aim", "Kama group"],
  ["Karaka", "Jupiter as labha-karaka"],
] as const;

const LABHA_GAIN_MODES = {
  second: {
    label: "2nd: holdings",
    house: 2,
    color: BLUE,
    note: "The 2nd is accumulated wealth: savings, assets, speech, family resources, and what the native holds.",
  },
  ninth: {
    label: "9th: fortune",
    house: 9,
    color: GOLD,
    note: "The 9th is broad prosperity, blessing, dharma, and good fortune rather than direct income flow.",
  },
  eleventh: {
    label: "11th: inflow",
    house: 11,
    color: GREEN,
    note: "The 11th is income and realised gains: what flows in, the river of profit and fulfilled ambition.",
  },
} as const;

const LABHA_OCCUPANTS = {
  jupiter: {
    label: "Jupiter in 11th",
    color: GOLD,
    note: "Jupiter reinforces the labha-karaka field: abundance, fulfilment, networks, and gains are naturally emphasised.",
  },
  saturn: {
    label: "Saturn in 11th",
    color: PURPLE,
    note: "A malefic in this upachaya can become slow, disciplined, reliable gain and a serious long-term network.",
  },
  mars: {
    label: "Mars in 11th",
    color: VERMILION,
    note: "Mars can turn ambition into competitive pursuit of gains. In an upachaya, pressure often becomes productivity.",
  },
  benefic: {
    label: "Benefic in 11th",
    color: GREEN,
    note: "A benefic supports friendships, fulfilment, income flow, and easier access to helpful circles.",
  },
} as const;

type LabhaGainKey = keyof typeof LABHA_GAIN_MODES;
type LabhaOccupantKey = keyof typeof LABHA_OCCUPANTS;

const VYAYA_ATTRIBUTES = [
  ["Name", "Vyaya / Hani / Moksha"],
  ["Number", "12th house"],
  ["Domain", "Loss, expenditure, foreign lands, liberation"],
  ["Significations", "loss, outflow, expenses, foreign lands, isolation, hospitals, ashrams, prisons, sleep, bed-pleasures, charity, moksha"],
  ["Body", "feet, ankles, left eye"],
  ["People", "hidden enemies; distant or secluded people"],
  ["Class 1", "Apoklima"],
  ["Class 2", "Dusthana"],
  ["Aim", "Moksha group"],
  ["Karaka", "Saturn primary; Ketu secondary"],
] as const;

const VYAYA_FACES = {
  loss: {
    label: "Loss / expense",
    color: VERMILION,
    note: "The 12th shows what leaves: money spent, energy drained, comfort surrendered, and hidden outflow.",
  },
  foreign: {
    label: "Foreign lands",
    color: BLUE,
    note: "Foreign residence, immigration, distant places, and the leaving of homeland are classic 12th-house expressions.",
  },
  isolation: {
    label: "Isolation / bed",
    color: PURPLE,
    note: "Hospitals, ashrams, prisons, retreat, sleep, and bed-pleasures all belong to secluded or surrendered spaces.",
  },
  moksha: {
    label: "Moksha",
    color: GREEN,
    note: "At its deepest, the 12th is liberation: loss becomes release when the soul lets go of clinging.",
  },
} as const;

const VYAYA_KARAKAS = {
  saturn: {
    label: "Saturn",
    color: PURPLE,
    note: "Saturn teaches release through restriction, loss, discipline, renunciation, and hard subtraction.",
  },
  ketu: {
    label: "Ketu",
    color: BLUE,
    note: "Ketu teaches release through detachment, inwardness, moksha pull, and natural disinterest in worldly grip.",
  },
  both: {
    label: "Saturn + Ketu",
    color: GOLD,
    note: "Together they show the full 12th-house code: renunciation by loss plus liberation by detachment.",
  },
} as const;

type VyayaFaceKey = keyof typeof VYAYA_FACES;
type VyayaKarakaKey = keyof typeof VYAYA_KARAKAS;

type ConditionKey = keyof typeof CONDITIONS;
type OccupantKey = keyof typeof OCCUPANTS;

export function BhavaProfile() {
  const slug = useLessonSlug();
  if (slug === "the-10th-house-significations-revisited-for-prediction") return <PredictiveKarmaProfile />;
  if (slug === "the-10th-lord-permutations-across-the-12-houses") return <TenthLordPermutationProfile />;
  if (slug === "2nd-bhava-dhana") return <DhanaProfile />;
  if (slug === "3rd-bhava-sahaja") return <SahajaProfile />;
  if (slug === "4th-bhava-sukha") return <SukhaProfile />;
  if (slug === "5th-bhava-putra") return <PutraProfile />;
  if (slug === "6th-bhava-shatru") return <ShatruProfile />;
  if (slug === "7th-bhava-yuvati") return <YuvatiProfile />;
  if (slug === "8th-bhava-ayu") return <AyuProfile />;
  if (slug === "9th-bhava-bhagya") return <BhagyaProfile />;
  if (slug === "10th-bhava-karma") return <KarmaProfile />;
  if (slug === "11th-bhava-labha") return <LabhaProfile />;
  if (slug === "12th-bhava-vyaya") return <VyayaProfile />;
  return <TanuProfile />;
}

function TanuProfile() {
  const [lagneshaHouse, setLagneshaHouse] = useState(1);
  const [condition, setCondition] = useState<ConditionKey>("strong");
  const [occupant, setOccupant] = useState<OccupantKey>("benefic");
  const selectedNote = LAGNESHA_NOTES[lagneshaHouse - 1];
  const conditionState = CONDITIONS[condition];
  const occupantState = OCCUPANTS[occupant];

  const synthesis = useMemo(() => {
    const score = Math.round((conditionState.score + (occupant === "benefic" ? 82 : occupant === "malefic" ? 42 : occupant === "mixed" ? 60 : 55)) / 2);
    if (score >= 75) return "Foundation reads lifted: the self has support, direction, and chart-wide resilience.";
    if (score >= 52) return "Foundation reads mixed: keep weighing Lagnesha dignity, occupants, and aspects together.";
    return "Foundation reads pressured: do not doom-read it, but give health, identity, and discipline extra attention.";
  }, [conditionState.score, occupant]);

  return (
    <div data-interactive="bhava-profile" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>1st bhava profile</p>
            <h2 style={{ margin: "0.2rem 0 0", color: BLUE, fontSize: "1.35rem" }}>
              Tanu: self, body, personality, Lagna
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 780 }}>
              Place the Lagnesha, change its condition, and compare who sits in the 1st. Watch how the chart-anchor changes the reading of the whole life.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setLagneshaHouse(1);
              setCondition("strong");
              setOccupant("benefic");
            }}
            style={buttonStyle(false)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 1fr) minmax(320px, 0.9fr)", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Chart anchor</p>
              <h3 style={{ margin: "0.15rem 0 0", color: BLUE, fontSize: "1.2rem" }}>Lagna counts every house from itself</h3>
            </div>
            <strong style={{ color: conditionState.color }}>{conditionState.label}</strong>
          </div>
          <BhavaAnchorSvg lagneshaHouse={lagneshaHouse} conditionColor={conditionState.color} occupantColor={occupantState.color} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.65rem" }}>
            <MiniFact icon={<UserRound size={16} />} title="People" body="Native themselves" color={BLUE} />
            <MiniFact icon={<ShieldCheck size={16} />} title="Class" body="Only kendra + trikona" color={GOLD} />
            <MiniFact icon={<Sun size={16} />} title="Karaka" body="Sun for self and soul" color={VERMILION} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title={`Lagnesha in house ${lagneshaHouse}: ${HOUSES[lagneshaHouse - 1]}`} icon={<Compass size={18} />} color={BLUE}>
            <div style={{ display: "grid", gap: "0.65rem" }}>
              <input
                aria-label="Lagnesha house"
                type="range"
                min={1}
                max={12}
                value={lagneshaHouse}
                onChange={(event) => setLagneshaHouse(Number(event.target.value))}
                style={{ width: "100%", accentColor: BLUE }}
              />
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {LAGNESHA_NOTES.map((item) => (
                  <button
                    key={item.house}
                    type="button"
                    aria-pressed={lagneshaHouse === item.house}
                    onClick={() => setLagneshaHouse(item.house)}
                    style={{ ...smallChipStyle(lagneshaHouse === item.house, BLUE), minWidth: 40 }}
                  >
                    {item.house}
                  </button>
                ))}
              </div>
              <strong style={{ color: BLUE }}>{selectedNote.title}</strong>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{selectedNote.note}</p>
            </div>
          </Panel>

          <Panel title="Change the strength cue" icon={<HeartPulse size={18} />} color={conditionState.color}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.65rem" }}>
              {(Object.keys(CONDITIONS) as ConditionKey[]).map((key) => (
                <button key={key} type="button" aria-pressed={condition === key} onClick={() => setCondition(key)} style={smallChipStyle(condition === key, CONDITIONS[key].color)}>
                  {CONDITIONS[key].label}
                </button>
              ))}
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{conditionState.note}</p>
          </Panel>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 1fr) minmax(320px, 0.9fr)", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
          <p style={eyebrowStyle}>Ten attributes</p>
          <h3 style={{ margin: "0.15rem 0 0.8rem", color: BLUE, fontSize: "1.18rem" }}>The Tanu card learners should memorize</h3>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            {ATTRIBUTES.map(([label, value], index) => (
              <div key={label} style={{ display: "grid", gridTemplateColumns: "112px minmax(0, 1fr)", gap: "0.6rem", border: `1px solid ${index < 3 ? BLUE : index < 6 ? GREEN : index < 9 ? GOLD : VERMILION}33`, borderRadius: 8, padding: "0.6rem", background: `${index < 3 ? BLUE : index < 6 ? GREEN : index < 9 ? GOLD : VERMILION}0D` }}>
                <strong style={{ color: INK_MUTED }}>{label}</strong>
                <span style={{ color: INK_SECONDARY, lineHeight: 1.45 }}>{value}</span>
              </div>
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Drop a planet into the 1st" icon={<CircleDot size={18} />} color={occupantState.color}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.65rem" }}>
              {(Object.keys(OCCUPANTS) as OccupantKey[]).map((key) => (
                <button key={key} type="button" aria-pressed={occupant === key} onClick={() => setOccupant(key)} style={smallChipStyle(occupant === key, OCCUPANTS[key].color)}>
                  {OCCUPANTS[key].label}
                </button>
              ))}
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{occupantState.note}</p>
          </Panel>

          <Panel title="Four-step reading order" icon={<Sparkles size={18} />} color={PURPLE}>
            <ol style={{ margin: 0, paddingLeft: "1.25rem", color: INK_SECONDARY, lineHeight: 1.65 }}>
              <li>Read the Lagna sign itself.</li>
              <li>Find the Lagnesha: house, dignity, company.</li>
              <li>Judge planets occupying the 1st.</li>
              <li>Then add aspects to the 1st.</li>
            </ol>
          </Panel>

          <section style={{ border: `1px solid ${GOLD}66`, borderRadius: 8, background: `${GOLD}16`, padding: "1rem" }}>
            <strong style={{ color: GOLD }}>Anchor synthesis</strong>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{synthesis}</p>
          </section>
        </section>
      </div>
    </div>
  );
}

function DhanaProfile() {
  const [selectedWealthHouse, setSelectedWealthHouse] = useState(2);
  const [occupant, setOccupant] = useState<DhanaOccupantKey>("mercury");
  const [marakaMode, setMarakaMode] = useState(false);
  const selectedWealth = WEALTH_HOUSES.find((item) => item.house === selectedWealthHouse) ?? WEALTH_HOUSES[0];
  const occupantState = DHANA_OCCUPANTS[occupant];

  const synthesis = useMemo(() => {
    if (marakaMode) return "Maraka is a timing flag: during specific dashas or transits, the 2nd can carry health or ending themes. It is never a standalone death sentence.";
    if (selectedWealthHouse === 2 && occupant === "mercury") return "Dhana reads as careful holding plus articulate speech: savings, family values, and clear words become the first judgement.";
    if (selectedWealthHouse === 11) return "This points to gains, not necessarily savings. A high earner can still have a weak 2nd if money does not stay.";
    if (selectedWealthHouse === 9) return "This points to fortune and support. The 9th blesses prosperity, but the 2nd shows what is actually held.";
    return "Read the 2nd as what the native holds: wealth, family, speech, food, and values.";
  }, [marakaMode, occupant, selectedWealthHouse]);

  return (
    <div data-interactive="bhava-profile" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>2nd bhava profile</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              Dhana: wealth, family, speech, food
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 780 }}>
              Compare the three wealth houses, place Mercury or Jupiter in the 2nd, and turn on the maraka caution without over-reading it.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedWealthHouse(2);
              setOccupant("mercury");
              setMarakaMode(false);
            }}
            style={buttonStyle(false)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 1fr) minmax(320px, 0.9fr)", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Wealth discipline</p>
              <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.2rem" }}>2nd saves, 9th blesses, 11th earns</h3>
            </div>
            <strong style={{ color: selectedWealth.color }}>{selectedWealth.label}</strong>
          </div>
          <DhanaWealthSvg selectedHouse={selectedWealthHouse} occupantColor={occupantState.color} marakaMode={marakaMode} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.65rem" }}>
            <MiniFact icon={<Coins size={16} />} title="Held wealth" body="Savings, assets, jewels" color={GOLD} />
            <MiniFact icon={<MessageCircle size={16} />} title="Speech" body="Words, truth, promises" color={BLUE} />
            <MiniFact icon={<Utensils size={16} />} title="Food" body="Mouth, diet, nourishment" color={GREEN} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title={`House ${selectedWealth.house}: ${selectedWealth.title}`} icon={<Coins size={18} />} color={selectedWealth.color}>
            <div style={{ display: "grid", gap: "0.65rem" }}>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {WEALTH_HOUSES.map((item) => (
                  <button key={item.house} type="button" aria-pressed={selectedWealthHouse === item.house} onClick={() => setSelectedWealthHouse(item.house)} style={smallChipStyle(selectedWealthHouse === item.house, item.color)}>
                    {item.house}: {item.label}
                  </button>
                ))}
              </div>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{selectedWealth.note}</p>
            </div>
          </Panel>

          <Panel title="Place a planet in the 2nd" icon={<CircleDot size={18} />} color={occupantState.color}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.65rem" }}>
              {(Object.keys(DHANA_OCCUPANTS) as DhanaOccupantKey[]).map((key) => (
                <button key={key} type="button" aria-pressed={occupant === key} onClick={() => setOccupant(key)} style={smallChipStyle(occupant === key, DHANA_OCCUPANTS[key].color)}>
                  {DHANA_OCCUPANTS[key].label}
                </button>
              ))}
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{occupantState.note}</p>
          </Panel>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 1fr) minmax(320px, 0.9fr)", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
          <p style={eyebrowStyle}>Ten attributes</p>
          <h3 style={{ margin: "0.15rem 0 0.8rem", color: GOLD, fontSize: "1.18rem" }}>The Dhana card learners should memorize</h3>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            {DHANA_ATTRIBUTES.map(([label, value], index) => (
              <div key={label} style={{ display: "grid", gridTemplateColumns: "112px minmax(0, 1fr)", gap: "0.6rem", border: `1px solid ${index < 3 ? BLUE : index < 6 ? GREEN : index < 9 ? GOLD : VERMILION}33`, borderRadius: 8, padding: "0.6rem", background: `${index < 3 ? BLUE : index < 6 ? GREEN : index < 9 ? GOLD : VERMILION}0D` }}>
                <strong style={{ color: INK_MUTED }}>{label}</strong>
                <span style={{ color: INK_SECONDARY, lineHeight: 1.45 }}>{value}</span>
              </div>
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Maraka caution" icon={<AlertTriangle size={18} />} color={marakaMode ? VERMILION : GOLD}>
            <button type="button" aria-pressed={marakaMode} onClick={() => setMarakaMode((value) => !value)} style={smallChipStyle(marakaMode, VERMILION)}>
              {marakaMode ? "Maraka caution on" : "Turn on maraka caution"}
            </button>
            <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>
              The 2nd and 7th are maraka houses. For beginners this means a timing-sensitive caution, not a prediction by itself.
            </p>
          </Panel>

          <Panel title="Reading order for Dhana" icon={<Sparkles size={18} />} color={PURPLE}>
            <ol style={{ margin: 0, paddingLeft: "1.25rem", color: INK_SECONDARY, lineHeight: 1.65 }}>
              <li>Separate savings, gains, and fortune.</li>
              <li>Judge the 2nd lord and planets in the 2nd.</li>
              <li>Use Jupiter for wealth and Mercury for speech.</li>
              <li>Keep maraka as a timing flag only.</li>
            </ol>
          </Panel>

          <section style={{ border: `1px solid ${GOLD}66`, borderRadius: 8, background: `${GOLD}16`, padding: "1rem" }}>
            <strong style={{ color: GOLD }}>Dhana synthesis</strong>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{synthesis}</p>
          </section>
        </section>
      </div>
    </div>
  );
}

function DhanaWealthSvg({ selectedHouse, occupantColor, marakaMode }: { selectedHouse: number; occupantColor: string; marakaMode: boolean }) {
  const center = 170;
  const radius = 116;
  const points = Array.from({ length: 12 }, (_, index) => {
    const angle = ((index - 3) / 12) * Math.PI * 2;
    return {
      house: index + 1,
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius,
    };
  });

  return (
    <svg viewBox="0 0 340 340" role="img" aria-label="Dhana wealth houses diagram" style={{ width: "100%", maxHeight: 430, margin: "0.4rem auto 0.7rem", display: "block" }}>
      <circle cx={center} cy={center} r={132} fill={`${GOLD}10`} stroke={HAIRLINE} strokeWidth="1.5" />
      {points.map((point) => {
        const wealth = WEALTH_HOUSES.find((item) => item.house === point.house);
        const active = point.house === selectedHouse;
        const maraka = marakaMode && (point.house === 2 || point.house === 7);
        const fill = active ? wealth?.color ?? GOLD : maraka ? VERMILION : wealth ? `${wealth.color}33` : "#FFF9EA";
        return (
          <g key={point.house}>
            <line x1={center} y1={center} x2={point.x} y2={point.y} stroke={active ? wealth?.color ?? GOLD : `${GOLD}44`} strokeWidth={active ? 3 : 1.1} />
            <circle cx={point.x} cy={point.y} r={active ? 19 : wealth || maraka ? 17 : 14} fill={fill} stroke={active || maraka ? "#fff" : HAIRLINE} strokeWidth="2" />
            <text x={point.x} y={point.y + 5} textAnchor="middle" fill={active || maraka ? "#fff" : INK_SECONDARY} fontSize="13" fontWeight="900">{point.house}</text>
            {wealth ? (
              <text x={point.x} y={point.y + 34} textAnchor="middle" fill={wealth.color} fontSize="11" fontWeight="900">{wealth.label}</text>
            ) : null}
          </g>
        );
      })}
      <circle cx={center} cy={center} r={54} fill="#FFF9EA" stroke={GOLD} strokeWidth="3" />
      <text x={center} y={center - 8} textAnchor="middle" fill={GOLD} fontSize="26" fontWeight="900">2</text>
      <text x={center} y={center + 17} textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="800">Dhana</text>
      <circle cx={center + 37} cy={center - 34} r={8} fill={occupantColor} stroke="#fff" strokeWidth="2" />
      <text x={center} y={28} textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="900" letterSpacing="1.2">WEALTH: HELD / BLESSED / GAINED</text>
    </svg>
  );
}

function SahajaProfile() {
  const [selectedHouse, setSelectedHouse] = useState(3);
  const [malefic, setMalefic] = useState<SahajaMaleficKey>("saturn");
  const [contrastFifth, setContrastFifth] = useState(false);
  const selectedUpachaya = UPACHAYA_HOUSES.find((item) => item.house === selectedHouse) ?? UPACHAYA_HOUSES[0];
  const maleficState = SAHAJA_MALEFICS[malefic];

  const synthesis = useMemo(() => {
    if (contrastFifth) return `${maleficState.label} in the 5th is not an upachaya rule. A gentle house can be disrupted by the same pressure that strengthens a struggle-house.`;
    if (selectedHouse === 3) return `${maleficState.label} in the 3rd supports the lesson's key reading: courage and self-effort grow through friction over time.`;
    return `${maleficState.label} in the ${selectedHouse}th is still upachaya: read cumulative strengthening in ${selectedUpachaya.label.toLowerCase()}, not automatic harm.`;
  }, [contrastFifth, maleficState.label, selectedHouse, selectedUpachaya.label]);

  return (
    <div data-interactive="bhava-profile" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>3rd bhava profile</p>
            <h2 style={{ margin: "0.2rem 0 0", color: BLUE, fontSize: "1.35rem" }}>
              Sahaja: siblings, effort, courage, communication
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 780 }}>
              Mark the four upachaya houses, drop a malefic into them, and compare why the same malefic does not behave the same way in the 5th.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedHouse(3);
              setMalefic("saturn");
              setContrastFifth(false);
            }}
            style={buttonStyle(false)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 1fr) minmax(320px, 0.9fr)", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Upachaya doctrine</p>
              <h3 style={{ margin: "0.15rem 0 0", color: BLUE, fontSize: "1.2rem" }}>3, 6, 10, 11 grow with malefics</h3>
            </div>
            <strong style={{ color: contrastFifth ? VERMILION : selectedUpachaya.color }}>{contrastFifth ? "5th contrast" : selectedUpachaya.label}</strong>
          </div>
          <SahajaUpachayaSvg selectedHouse={selectedHouse} maleficColor={maleficState.color} contrastFifth={contrastFifth} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.65rem" }}>
            <MiniFact icon={<ShieldCheck size={16} />} title="Class" body="Apoklima + upachaya" color={BLUE} />
            <MiniFact icon={<CircleDot size={16} />} title="Core" body="Self-effort and courage" color={GOLD} />
            <MiniFact icon={<MessageCircle size={16} />} title="Karaka" body="Mars primary, Mercury secondary" color={GREEN} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title={contrastFifth ? "Contrast: malefic in 5th" : `Upachaya ${selectedHouse}: ${selectedUpachaya.title}`} icon={<Compass size={18} />} color={contrastFifth ? VERMILION : selectedUpachaya.color}>
            <div style={{ display: "grid", gap: "0.65rem" }}>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {UPACHAYA_HOUSES.map((item) => (
                  <button key={item.house} type="button" aria-pressed={!contrastFifth && selectedHouse === item.house} onClick={() => { setSelectedHouse(item.house); setContrastFifth(false); }} style={smallChipStyle(!contrastFifth && selectedHouse === item.house, item.color)}>
                    {item.house}: {item.label}
                  </button>
                ))}
                <button type="button" aria-pressed={contrastFifth} onClick={() => setContrastFifth(true)} style={smallChipStyle(contrastFifth, VERMILION)}>
                  5: Gentle contrast
                </button>
              </div>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
                {contrastFifth ? "The 5th is not one of the growing houses. Use it to feel the contrast: house nature changes malefic results." : selectedUpachaya.note}
              </p>
            </div>
          </Panel>

          <Panel title="Choose the malefic" icon={<CircleDot size={18} />} color={maleficState.color}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.65rem" }}>
              {(Object.keys(SAHAJA_MALEFICS) as SahajaMaleficKey[]).map((key) => (
                <button key={key} type="button" aria-pressed={malefic === key} onClick={() => setMalefic(key)} style={smallChipStyle(malefic === key, SAHAJA_MALEFICS[key].color)}>
                  {SAHAJA_MALEFICS[key].label}
                </button>
              ))}
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{maleficState.note}</p>
          </Panel>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 1fr) minmax(320px, 0.9fr)", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
          <p style={eyebrowStyle}>Ten attributes</p>
          <h3 style={{ margin: "0.15rem 0 0.8rem", color: BLUE, fontSize: "1.18rem" }}>The Sahaja card learners should memorize</h3>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            {SAHAJA_ATTRIBUTES.map(([label, value], index) => (
              <div key={label} style={{ display: "grid", gridTemplateColumns: "112px minmax(0, 1fr)", gap: "0.6rem", border: `1px solid ${index < 3 ? BLUE : index < 6 ? GREEN : index < 9 ? GOLD : VERMILION}33`, borderRadius: 8, padding: "0.6rem", background: `${index < 3 ? BLUE : index < 6 ? GREEN : index < 9 ? GOLD : VERMILION}0D` }}>
                <strong style={{ color: INK_MUTED }}>{label}</strong>
                <span style={{ color: INK_SECONDARY, lineHeight: 1.45 }}>{value}</span>
              </div>
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Sibling distinction" icon={<UserRound size={18} />} color={PURPLE}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
              <div style={{ border: `1px solid ${BLUE}44`, borderRadius: 8, background: `${BLUE}10`, padding: "0.75rem" }}>
                <strong style={{ color: BLUE }}>3rd</strong>
                <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY }}>Younger siblings</p>
              </div>
              <div style={{ border: `1px solid ${GREEN}44`, borderRadius: 8, background: `${GREEN}10`, padding: "0.75rem" }}>
                <strong style={{ color: GREEN }}>11th</strong>
                <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY }}>Elder siblings</p>
              </div>
            </div>
          </Panel>

          <Panel title="Reading order for Sahaja" icon={<Sparkles size={18} />} color={GOLD}>
            <ol style={{ margin: 0, paddingLeft: "1.25rem", color: INK_SECONDARY, lineHeight: 1.65 }}>
              <li>Read courage, initiative, and self-effort first.</li>
              <li>Add younger siblings and communication.</li>
              <li>Mark the 3rd as upachaya.</li>
              <li>If a malefic is there, read growth through friction.</li>
            </ol>
          </Panel>

          <section style={{ border: `1px solid ${GOLD}66`, borderRadius: 8, background: `${GOLD}16`, padding: "1rem" }}>
            <strong style={{ color: GOLD }}>Sahaja synthesis</strong>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{synthesis}</p>
          </section>
        </section>
      </div>
    </div>
  );
}

function SahajaUpachayaSvg({ selectedHouse, maleficColor, contrastFifth }: { selectedHouse: number; maleficColor: string; contrastFifth: boolean }) {
  const center = 170;
  const radius = 116;
  const points = Array.from({ length: 12 }, (_, index) => {
    const angle = ((index - 3) / 12) * Math.PI * 2;
    return {
      house: index + 1,
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius,
    };
  });

  return (
    <svg viewBox="0 0 340 340" role="img" aria-label="Sahaja upachaya houses diagram" style={{ width: "100%", maxHeight: 430, margin: "0.4rem auto 0.7rem", display: "block" }}>
      <circle cx={center} cy={center} r={132} fill={`${BLUE}0E`} stroke={HAIRLINE} strokeWidth="1.5" />
      {points.map((point) => {
        const upachaya = UPACHAYA_HOUSES.find((item) => item.house === point.house);
        const active = !contrastFifth && point.house === selectedHouse;
        const fifth = contrastFifth && point.house === 5;
        const fill = active ? upachaya?.color ?? BLUE : fifth ? VERMILION : upachaya ? `${upachaya.color}33` : "#FFF9EA";
        return (
          <g key={point.house}>
            <line x1={center} y1={center} x2={point.x} y2={point.y} stroke={active || fifth ? maleficColor : `${GOLD}44`} strokeWidth={active || fifth ? 3 : 1.1} />
            <circle cx={point.x} cy={point.y} r={active || fifth ? 19 : upachaya ? 17 : 14} fill={fill} stroke={active || fifth ? "#fff" : HAIRLINE} strokeWidth="2" />
            <text x={point.x} y={point.y + 5} textAnchor="middle" fill={active || fifth ? "#fff" : INK_SECONDARY} fontSize="13" fontWeight="900">{point.house}</text>
            {upachaya ? (
              <text x={point.x} y={point.y + 34} textAnchor="middle" fill={upachaya.color} fontSize="11" fontWeight="900">{upachaya.label}</text>
            ) : fifth ? (
              <text x={point.x} y={point.y + 34} textAnchor="middle" fill={VERMILION} fontSize="11" fontWeight="900">Contrast</text>
            ) : null}
          </g>
        );
      })}
      <circle cx={center} cy={center} r={54} fill="#FFF9EA" stroke={BLUE} strokeWidth="3" />
      <text x={center} y={center - 8} textAnchor="middle" fill={BLUE} fontSize="26" fontWeight="900">3</text>
      <text x={center} y={center + 17} textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="800">Sahaja</text>
      <circle cx={center + 37} cy={center - 34} r={8} fill={maleficColor} stroke="#fff" strokeWidth="2" />
      <text x={center} y={28} textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="900" letterSpacing="1.2">UPACHAYA: FRICTION BUILDS CAPACITY</text>
    </svg>
  );
}

function SukhaProfile() {
  const [question, setQuestion] = useState<SukhaQuestionKey>("mother");
  const [occupant, setOccupant] = useState<SukhaOccupantKey>("moon");
  const [showOpposite, setShowOpposite] = useState(false);
  const questionState = SUKHA_QUESTIONS[question];
  const occupantState = SUKHA_OCCUPANTS[occupant];
  const QuestionIcon = questionState.icon;

  const synthesis = useMemo(() => {
    const axis = showOpposite ? " Compare the 10th as the public peak: the 4th is private ground, the 10th visible action." : "";
    if (question === "mother" && occupant === "moon") return `Sukha reads strongly through the Moon: mother, mind, comfort, and home-base become the centre of judgement.${axis}`;
    if (question === "land") return `For land, do not read only the Moon. Bring Mars and Saturn forward with the 4th lord, occupants, and aspects.${axis}`;
    if (occupant === "malefic") return `A malefic in the 4th can make home or emotional security effortful, but dignity and benefic aspects decide how heavy it becomes.${axis}`;
    return `Let the question select the karaka: ${questionState.karaka} carries this query, while the 4th house and its lord remain the field.${axis}`;
  }, [occupant, question, questionState.karaka, showOpposite]);

  return (
    <div data-interactive="bhava-profile" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>4th bhava profile</p>
            <h2 style={{ margin: "0.2rem 0 0", color: BLUE, fontSize: "1.35rem" }}>
              Sukha: mother, home, heart, land, education
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 820 }}>
              Use the 4th as the chart&apos;s home base. Let the question bring forward the right karaka, then compare benefic and malefic influences on the heart.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setQuestion("mother");
              setOccupant("moon");
              setShowOpposite(false);
            }}
            style={buttonStyle(false)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 1fr) minmax(320px, 0.9fr)", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Home base</p>
              <h3 style={{ margin: "0.15rem 0 0", color: BLUE, fontSize: "1.2rem" }}>The 4th is the chest of the chart</h3>
            </div>
            <strong style={{ color: questionState.color }}>{questionState.karaka}</strong>
          </div>
          <SukhaHomeSvg questionColor={questionState.color} occupantColor={occupantState.color} showOpposite={showOpposite} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.65rem" }}>
            <MiniFact icon={<Home size={16} />} title="Domain" body="Home, mother, land" color={BLUE} />
            <MiniFact icon={<Moon size={16} />} title="Primary karaka" body="Moon for mother and comfort" color={PURPLE} />
            <MiniFact icon={<ShieldCheck size={16} />} title="Class" body="Kendra + moksha group" color={GOLD} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title={`Question focus: ${questionState.label}`} icon={<QuestionIcon size={18} />} color={questionState.color}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.65rem" }}>
              {(Object.keys(SUKHA_QUESTIONS) as SukhaQuestionKey[]).map((key) => {
                const item = SUKHA_QUESTIONS[key];
                return (
                  <button key={key} type="button" aria-pressed={question === key} onClick={() => setQuestion(key)} style={smallChipStyle(question === key, item.color)}>
                    {item.label}
                  </button>
                );
              })}
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{questionState.note}</p>
          </Panel>

          <Panel title="Planet in the 4th" icon={<CircleDot size={18} />} color={occupantState.color}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.65rem" }}>
              {(Object.keys(SUKHA_OCCUPANTS) as SukhaOccupantKey[]).map((key) => (
                <button key={key} type="button" aria-pressed={occupant === key} onClick={() => setOccupant(key)} style={smallChipStyle(occupant === key, SUKHA_OCCUPANTS[key].color)}>
                  {SUKHA_OCCUPANTS[key].label}
                </button>
              ))}
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{occupantState.note}</p>
          </Panel>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 1fr) minmax(320px, 0.9fr)", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
          <p style={eyebrowStyle}>Ten attributes</p>
          <h3 style={{ margin: "0.15rem 0 0.8rem", color: BLUE, fontSize: "1.18rem" }}>The Sukha card learners should memorize</h3>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            {SUKHA_ATTRIBUTES.map(([label, value], index) => (
              <div key={label} style={{ display: "grid", gridTemplateColumns: "112px minmax(0, 1fr)", gap: "0.6rem", border: `1px solid ${index < 3 ? BLUE : index < 6 ? GREEN : index < 9 ? GOLD : VERMILION}33`, borderRadius: 8, padding: "0.6rem", background: `${index < 3 ? BLUE : index < 6 ? GREEN : index < 9 ? GOLD : VERMILION}0D` }}>
                <strong style={{ color: INK_MUTED }}>{label}</strong>
                <span style={{ color: INK_SECONDARY, lineHeight: 1.45 }}>{value}</span>
              </div>
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="4th and 10th axis" icon={<Compass size={18} />} color={showOpposite ? GOLD : BLUE}>
            <button type="button" aria-pressed={showOpposite} onClick={() => setShowOpposite((value) => !value)} style={smallChipStyle(showOpposite, GOLD)}>
              {showOpposite ? "10th contrast on" : "Show 10th contrast"}
            </button>
            <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>
              The 4th is private ground and emotional base; the 10th is public action and reputation. Both are kendras, but they face opposite directions.
            </p>
          </Panel>

          <Panel title="Reading order for Sukha" icon={<Sparkles size={18} />} color={PURPLE}>
            <ol style={{ margin: 0, paddingLeft: "1.25rem", color: INK_SECONDARY, lineHeight: 1.65 }}>
              <li>Read the sign on the 4th and its lord.</li>
              <li>Judge planets in and aspecting the 4th.</li>
              <li>Choose the karaka by question-type.</li>
              <li>Weigh Moon for mother, comfort, and heart.</li>
            </ol>
          </Panel>

          <section style={{ border: `1px solid ${GOLD}66`, borderRadius: 8, background: `${GOLD}16`, padding: "1rem" }}>
            <strong style={{ color: GOLD }}>Sukha synthesis</strong>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{synthesis}</p>
          </section>
        </section>
      </div>
    </div>
  );
}

function SukhaHomeSvg({ questionColor, occupantColor, showOpposite }: { questionColor: string; occupantColor: string; showOpposite: boolean }) {
  const center = 170;
  const radius = 116;
  const points = Array.from({ length: 12 }, (_, index) => {
    const angle = ((index - 3) / 12) * Math.PI * 2;
    return {
      house: index + 1,
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius,
    };
  });

  return (
    <svg viewBox="0 0 340 340" role="img" aria-label="Sukha home base diagram" style={{ width: "100%", maxHeight: 430, margin: "0.4rem auto 0.7rem", display: "block" }}>
      <circle cx={center} cy={center} r={132} fill={`${BLUE}0E`} stroke={HAIRLINE} strokeWidth="1.5" />
      {points.map((point) => {
        const isFourth = point.house === 4;
        const isTenth = showOpposite && point.house === 10;
        const fill = isFourth ? BLUE : isTenth ? GOLD : point.house === 8 || point.house === 12 ? `${PURPLE}2E` : "#FFF9EA";
        return (
          <g key={point.house}>
            <line x1={center} y1={center} x2={point.x} y2={point.y} stroke={isFourth ? questionColor : isTenth ? GOLD : `${GOLD}44`} strokeWidth={isFourth || isTenth ? 3 : 1.1} />
            <circle cx={point.x} cy={point.y} r={isFourth || isTenth ? 19 : point.house === 8 || point.house === 12 ? 17 : 14} fill={fill} stroke={isFourth || isTenth ? "#fff" : HAIRLINE} strokeWidth="2" />
            <text x={point.x} y={point.y + 5} textAnchor="middle" fill={isFourth || isTenth ? "#fff" : INK_SECONDARY} fontSize="13" fontWeight="900">{point.house}</text>
            {isFourth ? <text x={point.x} y={point.y + 34} textAnchor="middle" fill={BLUE} fontSize="11" fontWeight="900">Home</text> : null}
            {isTenth ? <text x={point.x} y={point.y + 34} textAnchor="middle" fill={GOLD} fontSize="11" fontWeight="900">Public</text> : null}
          </g>
        );
      })}
      <circle cx={center} cy={center} r={54} fill="#FFF9EA" stroke={BLUE} strokeWidth="3" />
      <text x={center} y={center - 8} textAnchor="middle" fill={BLUE} fontSize="26" fontWeight="900">4</text>
      <text x={center} y={center + 17} textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="800">Sukha</text>
      <circle cx={center + 37} cy={center - 34} r={8} fill={occupantColor} stroke="#fff" strokeWidth="2" />
      <text x={center} y={28} textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="900" letterSpacing="1.2">PRIVATE GROUND AND HEART</text>
    </svg>
  );
}

function PutraProfile() {
  const [domain, setDomain] = useState<PutraDomainKey>("children");
  const [occupant, setOccupant] = useState<PutraOccupantKey>("jupiter");
  const [linkNinth, setLinkNinth] = useState(true);
  const domainState = PUTRA_DOMAINS[domain];
  const occupantState = PUTRA_OCCUPANTS[occupant];
  const DomainIcon = domainState.icon;

  const synthesis = useMemo(() => {
    const yoga = linkNinth ? " The 5th-9th link is active: a celebrated dharma-trine connection that strengthens the auspicious reading." : "";
    if (occupant === "malefic") return `Putra is pressured, not cursed. Read delay or difficulty through dignity and aspects, then use the purva-punya frame as a call to devotion, mantra, and right action.${yoga}`;
    if (domain === "speculation" && occupant === "rahu") return `Speculation is intensified. This can show risk appetite, but a disciplined reader warns against gambling when the 5th or its lord is weak.${yoga}`;
    if (occupant === "jupiter") return `Jupiter highlights the 5th's blessing cluster: children, wisdom, devotion, and merit ripening together.${yoga}`;
    return `The selected domain is one face of the same reservoir: children, intellect, creativity, mantra, and fortune cluster through purva-punya.${yoga}`;
  }, [domain, linkNinth, occupant]);

  return (
    <div data-interactive="bhava-profile" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>5th bhava profile</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GREEN, fontSize: "1.35rem" }}>
              Putra: children, intellect, merit, mantra
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 820 }}>
              Explore the 5th as the blessing reservoir: Jupiter as karaka, purva-punya as the frame, and 5th-9th links as dharma-trine strength.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setDomain("children");
              setOccupant("jupiter");
              setLinkNinth(true);
            }}
            style={buttonStyle(false)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 1fr) minmax(320px, 0.9fr)", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Blessing reservoir</p>
              <h3 style={{ margin: "0.15rem 0 0", color: GREEN, fontSize: "1.2rem" }}>The most auspicious trine</h3>
            </div>
            <strong style={{ color: domainState.color }}>Jupiter karaka</strong>
          </div>
          <PutraTrineSvg domainColor={domainState.color} occupantColor={occupantState.color} linkNinth={linkNinth} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.65rem" }}>
            <MiniFact icon={<UserRound size={16} />} title="Core" body="Children and students" color={GREEN} />
            <MiniFact icon={<Sparkles size={16} />} title="Doctrine" body="Purva-punya ripening" color={PURPLE} />
            <MiniFact icon={<ShieldCheck size={16} />} title="Class" body="Panaphara + trikona" color={GOLD} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title={`Blessing face: ${domainState.label}`} icon={<DomainIcon size={18} />} color={domainState.color}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.65rem" }}>
              {(Object.keys(PUTRA_DOMAINS) as PutraDomainKey[]).map((key) => {
                const item = PUTRA_DOMAINS[key];
                return (
                  <button key={key} type="button" aria-pressed={domain === key} onClick={() => setDomain(key)} style={smallChipStyle(domain === key, item.color)}>
                    {item.label}
                  </button>
                );
              })}
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{domainState.note}</p>
          </Panel>

          <Panel title="Planet in the 5th" icon={<CircleDot size={18} />} color={occupantState.color}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.65rem" }}>
              {(Object.keys(PUTRA_OCCUPANTS) as PutraOccupantKey[]).map((key) => (
                <button key={key} type="button" aria-pressed={occupant === key} onClick={() => setOccupant(key)} style={smallChipStyle(occupant === key, PUTRA_OCCUPANTS[key].color)}>
                  {PUTRA_OCCUPANTS[key].label}
                </button>
              ))}
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{occupantState.note}</p>
          </Panel>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 1fr) minmax(320px, 0.9fr)", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
          <p style={eyebrowStyle}>Ten attributes</p>
          <h3 style={{ margin: "0.15rem 0 0.8rem", color: GREEN, fontSize: "1.18rem" }}>The Putra card learners should memorize</h3>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            {PUTRA_ATTRIBUTES.map(([label, value], index) => (
              <div key={label} style={{ display: "grid", gridTemplateColumns: "112px minmax(0, 1fr)", gap: "0.6rem", border: `1px solid ${index < 3 ? BLUE : index < 6 ? GREEN : index < 9 ? GOLD : VERMILION}33`, borderRadius: 8, padding: "0.6rem", background: `${index < 3 ? BLUE : index < 6 ? GREEN : index < 9 ? GOLD : VERMILION}0D` }}>
                <strong style={{ color: INK_MUTED }}>{label}</strong>
                <span style={{ color: INK_SECONDARY, lineHeight: 1.45 }}>{value}</span>
              </div>
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="5th and 9th lord link" icon={<Sparkles size={18} />} color={linkNinth ? PURPLE : GOLD}>
            <button type="button" aria-pressed={linkNinth} onClick={() => setLinkNinth((value) => !value)} style={smallChipStyle(linkNinth, PURPLE)}>
              {linkNinth ? "Dharma-trine link on" : "Link 5th and 9th"}
            </button>
            <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>
              Connections between the 5th and 9th lords join the pure dharma trines and are treated as highly auspicious.
            </p>
          </Panel>

          <Panel title="Reading order for Putra" icon={<GraduationCap size={18} />} color={BLUE}>
            <ol style={{ margin: 0, paddingLeft: "1.25rem", color: INK_SECONDARY, lineHeight: 1.65 }}>
              <li>Read the sign on the 5th and its lord.</li>
              <li>Judge planets in and aspecting the 5th.</li>
              <li>Check Jupiter as karaka.</li>
              <li>Frame difficulty as effort, not curse.</li>
            </ol>
          </Panel>

          <section style={{ border: `1px solid ${GOLD}66`, borderRadius: 8, background: `${GOLD}16`, padding: "1rem" }}>
            <strong style={{ color: GOLD }}>Putra synthesis</strong>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{synthesis}</p>
          </section>
        </section>
      </div>
    </div>
  );
}

function PutraTrineSvg({ domainColor, occupantColor, linkNinth }: { domainColor: string; occupantColor: string; linkNinth: boolean }) {
  const center = 170;
  const radius = 116;
  const points = Array.from({ length: 12 }, (_, index) => {
    const angle = ((index - 3) / 12) * Math.PI * 2;
    return {
      house: index + 1,
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius,
    };
  });

  return (
    <svg viewBox="0 0 340 340" role="img" aria-label="Putra dharma trine diagram" style={{ width: "100%", maxHeight: 430, margin: "0.4rem auto 0.7rem", display: "block" }}>
      <circle cx={center} cy={center} r={132} fill={`${GREEN}0E`} stroke={HAIRLINE} strokeWidth="1.5" />
      {points.map((point) => {
        const trine = point.house === 1 || point.house === 5 || point.house === 9;
        const active = point.house === 5;
        const ninth = linkNinth && point.house === 9;
        const fill = active ? GREEN : ninth ? PURPLE : trine ? `${GOLD}30` : "#FFF9EA";
        return (
          <g key={point.house}>
            <line x1={center} y1={center} x2={point.x} y2={point.y} stroke={active ? domainColor : ninth ? PURPLE : trine ? `${GOLD}AA` : `${GOLD}44`} strokeWidth={active || ninth ? 3 : 1.1} />
            <circle cx={point.x} cy={point.y} r={active || ninth ? 19 : trine ? 17 : 14} fill={fill} stroke={active || ninth ? "#fff" : HAIRLINE} strokeWidth="2" />
            <text x={point.x} y={point.y + 5} textAnchor="middle" fill={active || ninth ? "#fff" : INK_SECONDARY} fontSize="13" fontWeight="900">{point.house}</text>
            {active ? <text x={point.x} y={point.y + 34} textAnchor="middle" fill={GREEN} fontSize="11" fontWeight="900">Putra</text> : null}
            {ninth ? <text x={point.x} y={point.y + 34} textAnchor="middle" fill={PURPLE} fontSize="11" fontWeight="900">9th link</text> : null}
          </g>
        );
      })}
      <circle cx={center} cy={center} r={54} fill="#FFF9EA" stroke={GREEN} strokeWidth="3" />
      <text x={center} y={center - 8} textAnchor="middle" fill={GREEN} fontSize="26" fontWeight="900">5</text>
      <text x={center} y={center + 17} textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="800">Putra</text>
      <circle cx={center + 37} cy={center - 34} r={8} fill={occupantColor} stroke="#fff" strokeWidth="2" />
      <text x={center} y={28} textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="900" letterSpacing="1.2">PURVA-PUNYA RESERVOIR</text>
    </svg>
  );
}

function ShatruProfile() {
  const [occupant, setOccupant] = useState<ShatruOccupantKey>("mars");
  const [selectedTrouble, setSelectedTrouble] = useState(6);
  const [showParadox, setShowParadox] = useState(true);
  const occupantState = SHATRU_OCCUPANTS[occupant];
  const troubleState = TROUBLE_HOUSES.find((item) => item.house === selectedTrouble) ?? TROUBLE_HOUSES[0];
  const isMalefic = occupant === "mars" || occupant === "saturn";

  const synthesis = useMemo(() => {
    if (selectedTrouble !== 6) return `${troubleState.house}th trouble is not the 6th's fightable field. ${troubleState.note}`;
    if (isMalefic) return `${occupantState.label} resolves the paradox: a malefic in a dusthana can be favourable here because the 6th is also an upachaya. Read victory and overcoming.`;
    return `${occupantState.label} is gentler than it looks. In the 6th, a benefic may soothe but has less force to defeat enemies, debt, and disease than Mars or Saturn.`;
  }, [isMalefic, occupantState.label, selectedTrouble, troubleState.house, troubleState.note]);

  return (
    <div data-interactive="bhava-profile" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>6th bhava profile</p>
            <h2 style={{ margin: "0.2rem 0 0", color: VERMILION, fontSize: "1.35rem" }}>
              Shatru: enemies, illness, debt, service
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 820 }}>
              Resolve the 6th-house paradox: it is a dusthana, but also an upachaya, so malefics can become the strength that defeats obstacles.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setOccupant("mars");
              setSelectedTrouble(6);
              setShowParadox(true);
            }}
            style={buttonStyle(false)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 1fr) minmax(320px, 0.9fr)", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Obstacle field</p>
              <h3 style={{ margin: "0.15rem 0 0", color: VERMILION, fontSize: "1.2rem" }}>Difficult, yet growing</h3>
            </div>
            <strong style={{ color: occupantState.color }}>{isMalefic ? "Favourable malefic" : "Softer benefic"}</strong>
          </div>
          <ShatruParadoxSvg occupantColor={occupantState.color} selectedTrouble={selectedTrouble} showParadox={showParadox} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.65rem" }}>
            <MiniFact icon={<AlertTriangle size={16} />} title="Dusthana" body="Enemies, illness, debt" color={VERMILION} />
            <MiniFact icon={<TrendingIcon />} title="Upachaya" body="Improves through effort" color={GREEN} />
            <MiniFact icon={<ShieldCheck size={16} />} title="Karaka" body="Mars primary, Saturn secondary" color={GOLD} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Drop a planet into the 6th" icon={<CircleDot size={18} />} color={occupantState.color}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.65rem" }}>
              {(Object.keys(SHATRU_OCCUPANTS) as ShatruOccupantKey[]).map((key) => (
                <button key={key} type="button" aria-pressed={occupant === key} onClick={() => setOccupant(key)} style={smallChipStyle(occupant === key, SHATRU_OCCUPANTS[key].color)}>
                  {SHATRU_OCCUPANTS[key].label}
                </button>
              ))}
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{occupantState.note}</p>
          </Panel>

          <Panel title="Dusthana + upachaya" icon={<ShieldCheck size={18} />} color={showParadox ? GREEN : VERMILION}>
            <button type="button" aria-pressed={showParadox} onClick={() => setShowParadox((value) => !value)} style={smallChipStyle(showParadox, GREEN)}>
              {showParadox ? "Paradox overlay on" : "Show paradox overlay"}
            </button>
            <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>
              The 6th is hard because it is a dusthana, but workable because it is an upachaya. Malefic force is correctly aimed at obstacles.
            </p>
          </Panel>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 1fr) minmax(320px, 0.9fr)", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
          <p style={eyebrowStyle}>Ten attributes</p>
          <h3 style={{ margin: "0.15rem 0 0.8rem", color: VERMILION, fontSize: "1.18rem" }}>The Shatru card learners should memorize</h3>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            {SHATRU_ATTRIBUTES.map(([label, value], index) => (
              <div key={label} style={{ display: "grid", gridTemplateColumns: "112px minmax(0, 1fr)", gap: "0.6rem", border: `1px solid ${index < 3 ? BLUE : index < 6 ? GREEN : index < 9 ? GOLD : VERMILION}33`, borderRadius: 8, padding: "0.6rem", background: `${index < 3 ? BLUE : index < 6 ? GREEN : index < 9 ? GOLD : VERMILION}0D` }}>
                <strong style={{ color: INK_MUTED }}>{label}</strong>
                <span style={{ color: INK_SECONDARY, lineHeight: 1.45 }}>{value}</span>
              </div>
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title={`Trouble house ${selectedTrouble}: ${troubleState.title}`} icon={<AlertTriangle size={18} />} color={troubleState.color}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.65rem" }}>
              {TROUBLE_HOUSES.map((item) => (
                <button key={item.house} type="button" aria-pressed={selectedTrouble === item.house} onClick={() => setSelectedTrouble(item.house)} style={smallChipStyle(selectedTrouble === item.house, item.color)}>
                  {item.house}: {item.title}
                </button>
              ))}
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{troubleState.note}</p>
          </Panel>

          <Panel title="Reading order for Shatru" icon={<HeartPulse size={18} />} color={BLUE}>
            <ol style={{ margin: 0, paddingLeft: "1.25rem", color: INK_SECONDARY, lineHeight: 1.65 }}>
              <li>Name the obstacle: enemy, illness, debt, or service.</li>
              <li>Remember dusthana plus upachaya together.</li>
              <li>Read malefics as overcoming power.</li>
              <li>Keep 6th, 8th, and 12th distinct.</li>
            </ol>
          </Panel>

          <section style={{ border: `1px solid ${GOLD}66`, borderRadius: 8, background: `${GOLD}16`, padding: "1rem" }}>
            <strong style={{ color: GOLD }}>Shatru synthesis</strong>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{synthesis}</p>
          </section>
        </section>
      </div>
    </div>
  );
}

function ShatruParadoxSvg({ occupantColor, selectedTrouble, showParadox }: { occupantColor: string; selectedTrouble: number; showParadox: boolean }) {
  const center = 170;
  const radius = 116;
  const points = Array.from({ length: 12 }, (_, index) => {
    const angle = ((index - 3) / 12) * Math.PI * 2;
    return {
      house: index + 1,
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius,
    };
  });

  return (
    <svg viewBox="0 0 340 340" role="img" aria-label="Shatru dusthana upachaya diagram" style={{ width: "100%", maxHeight: 430, margin: "0.4rem auto 0.7rem", display: "block" }}>
      <circle cx={center} cy={center} r={132} fill={`${VERMILION}0E`} stroke={HAIRLINE} strokeWidth="1.5" />
      {points.map((point) => {
        const trouble = TROUBLE_HOUSES.find((item) => item.house === point.house);
        const upachaya = point.house === 3 || point.house === 6 || point.house === 10 || point.house === 11;
        const active = point.house === selectedTrouble;
        const sixth = point.house === 6;
        const fill = active ? trouble?.color ?? VERMILION : sixth ? VERMILION : trouble ? `${trouble.color}33` : upachaya && showParadox ? `${GREEN}2E` : "#FFF9EA";
        return (
          <g key={point.house}>
            <line x1={center} y1={center} x2={point.x} y2={point.y} stroke={active ? trouble?.color ?? VERMILION : sixth ? occupantColor : `${GOLD}44`} strokeWidth={active || sixth ? 3 : 1.1} />
            <circle cx={point.x} cy={point.y} r={active || sixth ? 19 : trouble || (upachaya && showParadox) ? 17 : 14} fill={fill} stroke={active || sixth ? "#fff" : HAIRLINE} strokeWidth="2" />
            <text x={point.x} y={point.y + 5} textAnchor="middle" fill={active || sixth ? "#fff" : INK_SECONDARY} fontSize="13" fontWeight="900">{point.house}</text>
            {sixth ? <text x={point.x} y={point.y + 34} textAnchor="middle" fill={VERMILION} fontSize="11" fontWeight="900">Fight</text> : null}
            {trouble && !sixth ? <text x={point.x} y={point.y + 34} textAnchor="middle" fill={trouble.color} fontSize="11" fontWeight="900">{trouble.title}</text> : null}
          </g>
        );
      })}
      <circle cx={center} cy={center} r={54} fill="#FFF9EA" stroke={VERMILION} strokeWidth="3" />
      <text x={center} y={center - 8} textAnchor="middle" fill={VERMILION} fontSize="26" fontWeight="900">6</text>
      <text x={center} y={center + 17} textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="800">Shatru</text>
      <circle cx={center + 37} cy={center - 34} r={8} fill={occupantColor} stroke="#fff" strokeWidth="2" />
      <text x={center} y={28} textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="900" letterSpacing="1.2">OBSTACLES OVERCOME</text>
    </svg>
  );
}

function YuvatiProfile() {
  const [chartGender, setChartGender] = useState<ChartGenderKey>("male");
  const [occupant, setOccupant] = useState<YuvatiOccupantKey>("benefic");
  const [axisPlacement, setAxisPlacement] = useState<1 | 7>(7);
  const [showMaraka, setShowMaraka] = useState(false);
  const spouseKaraka = chartGender === "male" ? "Venus" : "Jupiter";
  const spouseColor = chartGender === "male" ? PURPLE : GREEN;
  const occupantState = YUVATI_OCCUPANTS[occupant];

  const synthesis = useMemo(() => {
    const axis = axisPlacement === 7 ? "The planet is on the partner pole, but because 1st-7th is one axis, the self also feels it." : "The planet is on the self pole, but relationship and public dealings still receive the axis effect.";
    const maraka = showMaraka ? " Maraka is included as a longevity/timing caution, not a standalone verdict." : "";
    if (occupant === "mercury") return `For trade and business partnership, Mercury comes forward alongside the 7th lord. ${axis}${maraka}`;
    return `${spouseKaraka} is the spouse-karaka for this chart setting. ${occupantState.note} ${axis}${maraka}`;
  }, [axisPlacement, occupant, occupantState.note, showMaraka, spouseKaraka]);

  return (
    <div data-interactive="bhava-profile" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>7th bhava profile</p>
            <h2 style={{ margin: "0.2rem 0 0", color: PURPLE, fontSize: "1.35rem" }}>
              Yuvati: spouse, partnership, trade, the other
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 820 }}>
              Read the 7th as the partner pole opposite the Lagna. Toggle chart gender for the spouse-karaka and place a planet on either end of the 1st-7th axis.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setChartGender("male");
              setOccupant("benefic");
              setAxisPlacement(7);
              setShowMaraka(false);
            }}
            style={buttonStyle(false)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 1fr) minmax(320px, 0.9fr)", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Self-other axis</p>
              <h3 style={{ margin: "0.15rem 0 0", color: PURPLE, fontSize: "1.2rem" }}>The 7th is the other pole</h3>
            </div>
            <strong style={{ color: spouseColor }}>{spouseKaraka} spouse-karaka</strong>
          </div>
          <YuvatiAxisSvg occupantColor={occupantState.color} axisPlacement={axisPlacement} showMaraka={showMaraka} spouseColor={spouseColor} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.65rem" }}>
            <MiniFact icon={<UsersRound size={16} />} title="People" body="Spouse and partners" color={PURPLE} />
            <MiniFact icon={<BriefcaseBusiness size={16} />} title="Trade" body="Mercury for business" color={BLUE} />
            <MiniFact icon={<ShieldCheck size={16} />} title="Class" body="Kendra + maraka + kama" color={GOLD} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Chart gender and spouse-karaka" icon={<UsersRound size={18} />} color={spouseColor}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.65rem" }}>
              <button type="button" aria-pressed={chartGender === "male"} onClick={() => setChartGender("male")} style={smallChipStyle(chartGender === "male", PURPLE)}>
                Male chart: Venus
              </button>
              <button type="button" aria-pressed={chartGender === "female"} onClick={() => setChartGender("female")} style={smallChipStyle(chartGender === "female", GREEN)}>
                Female chart: Jupiter
              </button>
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
              Use {spouseKaraka} for marriage in this setting, then read the 7th house, its lord, occupants, and aspects alongside it.
            </p>
          </Panel>

          <Panel title="Place a planet on the axis" icon={<CircleDot size={18} />} color={occupantState.color}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.65rem" }}>
              {(Object.keys(YUVATI_OCCUPANTS) as YuvatiOccupantKey[]).map((key) => (
                <button key={key} type="button" aria-pressed={occupant === key} onClick={() => setOccupant(key)} style={smallChipStyle(occupant === key, YUVATI_OCCUPANTS[key].color)}>
                  {YUVATI_OCCUPANTS[key].label}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.65rem" }}>
              <button type="button" aria-pressed={axisPlacement === 1} onClick={() => setAxisPlacement(1)} style={smallChipStyle(axisPlacement === 1, BLUE)}>
                Place on 1st
              </button>
              <button type="button" aria-pressed={axisPlacement === 7} onClick={() => setAxisPlacement(7)} style={smallChipStyle(axisPlacement === 7, PURPLE)}>
                Place on 7th
              </button>
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{occupantState.note}</p>
          </Panel>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 1fr) minmax(320px, 0.9fr)", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
          <p style={eyebrowStyle}>Ten attributes</p>
          <h3 style={{ margin: "0.15rem 0 0.8rem", color: PURPLE, fontSize: "1.18rem" }}>The Yuvati card learners should memorize</h3>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            {YUVATI_ATTRIBUTES.map(([label, value], index) => (
              <div key={label} style={{ display: "grid", gridTemplateColumns: "112px minmax(0, 1fr)", gap: "0.6rem", border: `1px solid ${index < 3 ? BLUE : index < 6 ? GREEN : index < 9 ? GOLD : VERMILION}33`, borderRadius: 8, padding: "0.6rem", background: `${index < 3 ? BLUE : index < 6 ? GREEN : index < 9 ? GOLD : VERMILION}0D` }}>
                <strong style={{ color: INK_MUTED }}>{label}</strong>
                <span style={{ color: INK_SECONDARY, lineHeight: 1.45 }}>{value}</span>
              </div>
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Maraka reminder" icon={<AlertTriangle size={18} />} color={showMaraka ? VERMILION : GOLD}>
            <button type="button" aria-pressed={showMaraka} onClick={() => setShowMaraka((value) => !value)} style={smallChipStyle(showMaraka, VERMILION)}>
              {showMaraka ? "Maraka reminder on" : "Show maraka reminder"}
            </button>
            <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>
              The 2nd and 7th are maraka houses. Include the 7th for longevity work, but do not make a verdict from this one fact.
            </p>
          </Panel>

          <Panel title="Reading order for Yuvati" icon={<Sparkles size={18} />} color={BLUE}>
            <ol style={{ margin: 0, paddingLeft: "1.25rem", color: INK_SECONDARY, lineHeight: 1.65 }}>
              <li>Read the sign on the 7th and its lord.</li>
              <li>Judge occupants and aspects on the 1st-7th axis.</li>
              <li>Choose Venus or Jupiter by chart gender.</li>
              <li>Use Mercury for business partnership.</li>
            </ol>
          </Panel>

          <section style={{ border: `1px solid ${GOLD}66`, borderRadius: 8, background: `${GOLD}16`, padding: "1rem" }}>
            <strong style={{ color: GOLD }}>Yuvati synthesis</strong>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{synthesis}</p>
          </section>
        </section>
      </div>
    </div>
  );
}

function YuvatiAxisSvg({ occupantColor, axisPlacement, showMaraka, spouseColor }: { occupantColor: string; axisPlacement: 1 | 7; showMaraka: boolean; spouseColor: string }) {
  const center = 170;
  const radius = 116;
  const points = Array.from({ length: 12 }, (_, index) => {
    const angle = ((index - 3) / 12) * Math.PI * 2;
    return {
      house: index + 1,
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius,
    };
  });

  return (
    <svg viewBox="0 0 340 340" role="img" aria-label="Yuvati self other axis diagram" style={{ width: "100%", maxHeight: 430, margin: "0.4rem auto 0.7rem", display: "block" }}>
      <circle cx={center} cy={center} r={132} fill={`${PURPLE}0E`} stroke={HAIRLINE} strokeWidth="1.5" />
      {points.map((point) => {
        const axis = point.house === 1 || point.house === 7;
        const maraka = showMaraka && (point.house === 2 || point.house === 7);
        const placed = point.house === axisPlacement;
        const fill = placed ? occupantColor : point.house === 1 ? BLUE : point.house === 7 ? PURPLE : maraka ? VERMILION : "#FFF9EA";
        return (
          <g key={point.house}>
            <line x1={center} y1={center} x2={point.x} y2={point.y} stroke={axis ? (placed ? occupantColor : spouseColor) : maraka ? VERMILION : `${GOLD}44`} strokeWidth={axis || maraka ? 3 : 1.1} />
            <circle cx={point.x} cy={point.y} r={axis || maraka ? 19 : 14} fill={fill} stroke={axis || maraka ? "#fff" : HAIRLINE} strokeWidth="2" />
            <text x={point.x} y={point.y + 5} textAnchor="middle" fill={axis || maraka ? "#fff" : INK_SECONDARY} fontSize="13" fontWeight="900">{point.house}</text>
            {point.house === 1 ? <text x={point.x} y={point.y + 34} textAnchor="middle" fill={BLUE} fontSize="11" fontWeight="900">Self</text> : null}
            {point.house === 7 ? <text x={point.x} y={point.y + 34} textAnchor="middle" fill={PURPLE} fontSize="11" fontWeight="900">Other</text> : null}
            {showMaraka && point.house === 2 ? <text x={point.x} y={point.y + 34} textAnchor="middle" fill={VERMILION} fontSize="11" fontWeight="900">Maraka</text> : null}
          </g>
        );
      })}
      <line x1={points[0].x} y1={points[0].y} x2={points[6].x} y2={points[6].y} stroke={spouseColor} strokeWidth="4" strokeLinecap="round" opacity="0.45" />
      <circle cx={center} cy={center} r={54} fill="#FFF9EA" stroke={PURPLE} strokeWidth="3" />
      <text x={center} y={center - 8} textAnchor="middle" fill={PURPLE} fontSize="26" fontWeight="900">7</text>
      <text x={center} y={center + 17} textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="800">Yuvati</text>
      <circle cx={center + 37} cy={center - 34} r={8} fill={occupantColor} stroke="#fff" strokeWidth="2" />
      <text x={center} y={28} textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="900" letterSpacing="1.2">SELF AND OTHER AXIS</text>
    </svg>
  );
}

function AyuProfile() {
  const [face, setFace] = useState<AyuFaceKey>("transformation");
  const [occupant, setOccupant] = useState<AyuOccupantKey>("saturn");
  const [showParadox, setShowParadox] = useState(true);
  const [wealthLink, setWealthLink] = useState<"none" | "second" | "eleventh">("none");
  const faceState = AYU_FACES[face];
  const occupantState = AYU_OCCUPANTS[occupant];

  const synthesis = useMemo(() => {
    const link = wealthLink === "second" ? " The 8th is linked to the 2nd, so inheritance may connect to stored wealth or family assets." : wealthLink === "eleventh" ? " The 8th is linked to the 11th, so sudden gains or windfalls may connect to income and networks." : "";
    if (face === "longevity") return `Saturn is highlighted as the longevity karaka, but the discipline is restraint: never pronounce lifespan from one house or one planet.${link}`;
    if (occupant === "malefic") return `The 8th is pressured: name upheaval, chronic difficulty, or hidden strain without turning it into doom. Hold difficulty and transformation together.${link}`;
    if (occupant === "ketu") return `Ketu in the 8th can show occult depth and research instinct, alongside turbulence or detachment. Read both halves, not only the gift.${link}`;
    return `${faceState.note} The 8th is both dusthana and moksha terrain, so the honest reading avoids both catastrophe and bypassing.${link}`;
  }, [face, faceState.note, occupant, wealthLink]);

  return (
    <div data-interactive="bhava-profile" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>8th bhava profile</p>
            <h2 style={{ margin: "0.2rem 0 0", color: PURPLE, fontSize: "1.35rem" }}>
              Ayu: longevity, hidden things, transformation
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 820 }}>
              Hold the 8th&apos;s paradox carefully: real difficulty, real depth, Saturn as longevity karaka, and no lifespan verdict from one factor.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setFace("transformation");
              setOccupant("saturn");
              setShowParadox(true);
              setWealthLink("none");
            }}
            style={buttonStyle(false)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 1fr) minmax(320px, 0.9fr)", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Paradox house</p>
              <h3 style={{ margin: "0.15rem 0 0", color: PURPLE, fontSize: "1.2rem" }}>Dusthana and moksha together</h3>
            </div>
            <strong style={{ color: occupantState.color }}>Saturn karaka</strong>
          </div>
          <AyuParadoxSvg faceColor={faceState.color} occupantColor={occupantState.color} showParadox={showParadox} wealthLink={wealthLink} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.65rem" }}>
            <MiniFact icon={<AlertTriangle size={16} />} title="Dusthana" body="Crisis, hidden strain" color={VERMILION} />
            <MiniFact icon={<Sparkles size={16} />} title="Moksha" body="Depth and transformation" color={PURPLE} />
            <MiniFact icon={<ShieldCheck size={16} />} title="Karaka" body="Saturn for longevity" color={GOLD} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title={`8th-house face: ${faceState.label}`} icon={<Compass size={18} />} color={faceState.color}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.65rem" }}>
              {(Object.keys(AYU_FACES) as AyuFaceKey[]).map((key) => (
                <button key={key} type="button" aria-pressed={face === key} onClick={() => setFace(key)} style={smallChipStyle(face === key, AYU_FACES[key].color)}>
                  {AYU_FACES[key].label}
                </button>
              ))}
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{faceState.note}</p>
          </Panel>

          <Panel title="Planet in the 8th" icon={<CircleDot size={18} />} color={occupantState.color}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.65rem" }}>
              {(Object.keys(AYU_OCCUPANTS) as AyuOccupantKey[]).map((key) => (
                <button key={key} type="button" aria-pressed={occupant === key} onClick={() => setOccupant(key)} style={smallChipStyle(occupant === key, AYU_OCCUPANTS[key].color)}>
                  {AYU_OCCUPANTS[key].label}
                </button>
              ))}
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{occupantState.note}</p>
          </Panel>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 1fr) minmax(320px, 0.9fr)", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
          <p style={eyebrowStyle}>Ten attributes</p>
          <h3 style={{ margin: "0.15rem 0 0.8rem", color: PURPLE, fontSize: "1.18rem" }}>The Ayu card learners should memorize</h3>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            {AYU_ATTRIBUTES.map(([label, value], index) => (
              <div key={label} style={{ display: "grid", gridTemplateColumns: "112px minmax(0, 1fr)", gap: "0.6rem", border: `1px solid ${index < 3 ? BLUE : index < 6 ? GREEN : index < 9 ? GOLD : VERMILION}33`, borderRadius: 8, padding: "0.6rem", background: `${index < 3 ? BLUE : index < 6 ? GREEN : index < 9 ? GOLD : VERMILION}0D` }}>
                <strong style={{ color: INK_MUTED }}>{label}</strong>
                <span style={{ color: INK_SECONDARY, lineHeight: 1.45 }}>{value}</span>
              </div>
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Paradox discipline" icon={<ShieldCheck size={18} />} color={showParadox ? PURPLE : GOLD}>
            <button type="button" aria-pressed={showParadox} onClick={() => setShowParadox((value) => !value)} style={smallChipStyle(showParadox, PURPLE)}>
              {showParadox ? "Paradox overlay on" : "Show paradox overlay"}
            </button>
            <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>
              Do not catastrophise the 8th as doom, and do not bypass real difficulty as only transformation. Hold both.
            </p>
          </Panel>

          <Panel title="Inheritance link" icon={<Coins size={18} />} color={wealthLink === "none" ? GOLD : GREEN}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.65rem" }}>
              <button type="button" aria-pressed={wealthLink === "none"} onClick={() => setWealthLink("none")} style={smallChipStyle(wealthLink === "none", GOLD)}>
                No wealth link
              </button>
              <button type="button" aria-pressed={wealthLink === "second"} onClick={() => setWealthLink("second")} style={smallChipStyle(wealthLink === "second", GREEN)}>
                Link 2nd
              </button>
              <button type="button" aria-pressed={wealthLink === "eleventh"} onClick={() => setWealthLink("eleventh")} style={smallChipStyle(wealthLink === "eleventh", GREEN)}>
                Link 11th
              </button>
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>
              Inheritance and windfall readings sharpen when the 8th connects with stored wealth or gains.
            </p>
          </Panel>

          <Panel title="Reading order for Ayu" icon={<Sparkles size={18} />} color={BLUE}>
            <ol style={{ margin: 0, paddingLeft: "1.25rem", color: INK_SECONDARY, lineHeight: 1.65 }}>
              <li>Read the sign on the 8th and its lord.</li>
              <li>Judge occupants and aspects.</li>
              <li>Check Saturn for longevity and endings.</li>
              <li>Never pronounce lifespan from one factor.</li>
            </ol>
          </Panel>

          <section style={{ border: `1px solid ${GOLD}66`, borderRadius: 8, background: `${GOLD}16`, padding: "1rem" }}>
            <strong style={{ color: GOLD }}>Ayu synthesis</strong>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{synthesis}</p>
          </section>
        </section>
      </div>
    </div>
  );
}

function AyuParadoxSvg({ faceColor, occupantColor, showParadox, wealthLink }: { faceColor: string; occupantColor: string; showParadox: boolean; wealthLink: "none" | "second" | "eleventh" }) {
  const center = 170;
  const radius = 116;
  const points = Array.from({ length: 12 }, (_, index) => {
    const angle = ((index - 3) / 12) * Math.PI * 2;
    return {
      house: index + 1,
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius,
    };
  });

  return (
    <svg viewBox="0 0 340 340" role="img" aria-label="Ayu dusthana moksha paradox diagram" style={{ width: "100%", maxHeight: 430, margin: "0.4rem auto 0.7rem", display: "block" }}>
      <circle cx={center} cy={center} r={132} fill={`${PURPLE}0E`} stroke={HAIRLINE} strokeWidth="1.5" />
      {points.map((point) => {
        const dusthana = point.house === 6 || point.house === 8 || point.house === 12;
        const moksha = point.house === 4 || point.house === 8 || point.house === 12;
        const wealth = (wealthLink === "second" && point.house === 2) || (wealthLink === "eleventh" && point.house === 11);
        const active = point.house === 8;
        const fill = active ? PURPLE : wealth ? GREEN : showParadox && moksha ? `${PURPLE}30` : dusthana ? `${VERMILION}30` : "#FFF9EA";
        return (
          <g key={point.house}>
            <line x1={center} y1={center} x2={point.x} y2={point.y} stroke={active ? faceColor : wealth ? GREEN : dusthana || moksha ? `${GOLD}88` : `${GOLD}44`} strokeWidth={active || wealth ? 3 : 1.1} />
            <circle cx={point.x} cy={point.y} r={active || wealth || dusthana || moksha ? 17 : 14} fill={fill} stroke={active || wealth ? "#fff" : HAIRLINE} strokeWidth="2" />
            <text x={point.x} y={point.y + 5} textAnchor="middle" fill={active || wealth ? "#fff" : INK_SECONDARY} fontSize="13" fontWeight="900">{point.house}</text>
            {active ? <text x={point.x} y={point.y + 34} textAnchor="middle" fill={PURPLE} fontSize="11" fontWeight="900">Ayu</text> : null}
            {wealth ? <text x={point.x} y={point.y + 34} textAnchor="middle" fill={GREEN} fontSize="11" fontWeight="900">Wealth</text> : null}
          </g>
        );
      })}
      <circle cx={center} cy={center} r={54} fill="#FFF9EA" stroke={PURPLE} strokeWidth="3" />
      <text x={center} y={center - 8} textAnchor="middle" fill={PURPLE} fontSize="26" fontWeight="900">8</text>
      <text x={center} y={center + 17} textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="800">Ayu</text>
      <circle cx={center + 37} cy={center - 34} r={8} fill={occupantColor} stroke="#fff" strokeWidth="2" />
      <text x={center} y={28} textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="900" letterSpacing="1.2">DIFFICULTY AND DEPTH</text>
    </svg>
  );
}

function BhagyaProfile() {
  const [question, setQuestion] = useState<BhagyaQuestionKey>("dharma");
  const [alignment, setAlignment] = useState<JupiterAlignmentKey>("in");
  const [linkFifth, setLinkFifth] = useState(true);
  const questionState = BHAGYA_QUESTIONS[question];
  const alignmentState = JUPITER_ALIGNMENTS[alignment];
  const activeKarakaColor = questionState.karaka === "Sun" ? VERMILION : GREEN;

  const synthesis = useMemo(() => {
    const fifth = linkFifth ? " The 5th-9th link is also active, joining stored merit to dharma and fortune." : "";
    if (question === "father") return `Use the Sun for the father question, then read the 9th and its lord. Do not substitute Jupiter just because the 9th is a dharma house.${fifth}`;
    if (alignment !== "none") return `${alignmentState.note} This is the special 9th-Jupiter alignment that activates the dharma register strongly.${fifth}`;
    return `${questionState.note} The 9th remains a pure dharma trine, but no special Jupiter alignment is currently marked.${fifth}`;
  }, [alignment, alignmentState.note, linkFifth, question, questionState.note]);

  return (
    <div data-interactive="bhava-profile" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>9th bhava profile</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              Bhagya: father, dharma, fortune, guru
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 820 }}>
              Choose the question to highlight the correct karaka, then activate Jupiter&apos;s special alignment with the 9th house.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setQuestion("dharma");
              setAlignment("in");
              setLinkFifth(true);
            }}
            style={buttonStyle(false)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 1fr) minmax(320px, 0.9fr)", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Dharma trine</p>
              <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.2rem" }}>Fortune and meaning</h3>
            </div>
            <strong style={{ color: activeKarakaColor }}>{questionState.karaka} karaka</strong>
          </div>
          <BhagyaDharmaSvg questionColor={questionState.color} alignmentColor={alignmentState.color} alignment={alignment} linkFifth={linkFifth} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.65rem" }}>
            <MiniFact icon={<Sun size={16} />} title="Father" body="Sun karaka" color={VERMILION} />
            <MiniFact icon={<Sparkles size={16} />} title="Dharma" body="Jupiter karaka" color={GREEN} />
            <MiniFact icon={<ShieldCheck size={16} />} title="Class" body="Apoklima + trikona" color={GOLD} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title={`Question: ${questionState.label}`} icon={questionState.karaka === "Sun" ? <Sun size={18} /> : <Sparkles size={18} />} color={questionState.color}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.65rem" }}>
              {(Object.keys(BHAGYA_QUESTIONS) as BhagyaQuestionKey[]).map((key) => (
                <button key={key} type="button" aria-pressed={question === key} onClick={() => setQuestion(key)} style={smallChipStyle(question === key, BHAGYA_QUESTIONS[key].color)}>
                  {BHAGYA_QUESTIONS[key].label}
                </button>
              ))}
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{questionState.note}</p>
          </Panel>

          <Panel title="9th-Jupiter alignment" icon={<CircleDot size={18} />} color={alignmentState.color}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.65rem" }}>
              {(Object.keys(JUPITER_ALIGNMENTS) as JupiterAlignmentKey[]).map((key) => (
                <button key={key} type="button" aria-pressed={alignment === key} onClick={() => setAlignment(key)} style={smallChipStyle(alignment === key, JUPITER_ALIGNMENTS[key].color)}>
                  {JUPITER_ALIGNMENTS[key].label}
                </button>
              ))}
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{alignmentState.note}</p>
          </Panel>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 1fr) minmax(320px, 0.9fr)", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
          <p style={eyebrowStyle}>Ten attributes</p>
          <h3 style={{ margin: "0.15rem 0 0.8rem", color: GOLD, fontSize: "1.18rem" }}>The Bhagya card learners should memorize</h3>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            {BHAGYA_ATTRIBUTES.map(([label, value], index) => (
              <div key={label} style={{ display: "grid", gridTemplateColumns: "112px minmax(0, 1fr)", gap: "0.6rem", border: `1px solid ${index < 3 ? BLUE : index < 6 ? GREEN : index < 9 ? GOLD : VERMILION}33`, borderRadius: 8, padding: "0.6rem", background: `${index < 3 ? BLUE : index < 6 ? GREEN : index < 9 ? GOLD : VERMILION}0D` }}>
                <strong style={{ color: INK_MUTED }}>{label}</strong>
                <span style={{ color: INK_SECONDARY, lineHeight: 1.45 }}>{value}</span>
              </div>
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="5th-9th dharma link" icon={<Sparkles size={18} />} color={linkFifth ? PURPLE : GOLD}>
            <button type="button" aria-pressed={linkFifth} onClick={() => setLinkFifth((value) => !value)} style={smallChipStyle(linkFifth, PURPLE)}>
              {linkFifth ? "5th-9th link on" : "Link 5th and 9th"}
            </button>
            <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>
              The 5th and 9th join stored merit with dharma and fortune, one of the most celebrated auspicious links.
            </p>
          </Panel>

          <Panel title="Reading order for Bhagya" icon={<GraduationCap size={18} />} color={BLUE}>
            <ol style={{ margin: 0, paddingLeft: "1.25rem", color: INK_SECONDARY, lineHeight: 1.65 }}>
              <li>Read the sign on the 9th and its lord.</li>
              <li>Judge occupants and aspects, especially Jupiter.</li>
              <li>Use Sun for father questions.</li>
              <li>Use Jupiter for dharma, guru, and fortune.</li>
            </ol>
          </Panel>

          <section style={{ border: `1px solid ${GOLD}66`, borderRadius: 8, background: `${GOLD}16`, padding: "1rem" }}>
            <strong style={{ color: GOLD }}>Bhagya synthesis</strong>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{synthesis}</p>
          </section>
        </section>
      </div>
    </div>
  );
}

function BhagyaDharmaSvg({ questionColor, alignmentColor, alignment, linkFifth }: { questionColor: string; alignmentColor: string; alignment: JupiterAlignmentKey; linkFifth: boolean }) {
  const center = 170;
  const radius = 116;
  const points = Array.from({ length: 12 }, (_, index) => {
    const angle = ((index - 3) / 12) * Math.PI * 2;
    return {
      house: index + 1,
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius,
    };
  });

  return (
    <svg viewBox="0 0 340 340" role="img" aria-label="Bhagya dharma trine and Jupiter alignment diagram" style={{ width: "100%", maxHeight: 430, margin: "0.4rem auto 0.7rem", display: "block" }}>
      <circle cx={center} cy={center} r={132} fill={`${GOLD}10`} stroke={HAIRLINE} strokeWidth="1.5" />
      {points.map((point) => {
        const trine = point.house === 1 || point.house === 5 || point.house === 9;
        const active = point.house === 9;
        const fifth = linkFifth && point.house === 5;
        const fill = active ? GOLD : fifth ? PURPLE : trine ? `${GOLD}30` : "#FFF9EA";
        return (
          <g key={point.house}>
            <line x1={center} y1={center} x2={point.x} y2={point.y} stroke={active ? questionColor : fifth ? PURPLE : trine ? `${GOLD}AA` : `${GOLD}44`} strokeWidth={active || fifth ? 3 : 1.1} />
            <circle cx={point.x} cy={point.y} r={active || fifth || trine ? 17 : 14} fill={fill} stroke={active || fifth ? "#fff" : HAIRLINE} strokeWidth="2" />
            <text x={point.x} y={point.y + 5} textAnchor="middle" fill={active || fifth ? "#fff" : INK_SECONDARY} fontSize="13" fontWeight="900">{point.house}</text>
            {active ? <text x={point.x} y={point.y + 34} textAnchor="middle" fill={GOLD} fontSize="11" fontWeight="900">Bhagya</text> : null}
            {fifth ? <text x={point.x} y={point.y + 34} textAnchor="middle" fill={PURPLE} fontSize="11" fontWeight="900">5th link</text> : null}
          </g>
        );
      })}
      {alignment !== "none" ? (
        <g>
          <circle cx={center + 58} cy={center - 46} r={16} fill={alignmentColor} stroke="#fff" strokeWidth="2" />
          <text x={center + 58} y={center - 41} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="900">Ju</text>
        </g>
      ) : null}
      <circle cx={center} cy={center} r={54} fill="#FFF9EA" stroke={GOLD} strokeWidth="3" />
      <text x={center} y={center - 8} textAnchor="middle" fill={GOLD} fontSize="26" fontWeight="900">9</text>
      <text x={center} y={center + 17} textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="800">Bhagya</text>
      <text x={center} y={28} textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="900" letterSpacing="1.2">DHARMA AND FORTUNE</text>
    </svg>
  );
}

function KarmaProfile() {
  const [career, setCareer] = useState<KarmaCareerKey>("endurance");
  const [occupant, setOccupant] = useState<KarmaOccupantKey>("saturn");
  const [showPrivateBase, setShowPrivateBase] = useState(true);
  const careerState = KARMA_CAREERS[career];
  const occupantState = KARMA_OCCUPANTS[occupant];
  const saturnConvergence = occupant === "saturn";

  const synthesis = useMemo(() => {
    const axis = showPrivateBase ? " Keep the 4th opposite in view: private stability supports public action." : "";
    if (saturnConvergence) return `Saturn in the 10th is the signature convergence: kendra, upachaya, karma-house, and karma-karaka all meet. Read it as slow-earned durable standing.${axis}`;
    if (occupant === "mars") return `Mars in this upachaya becomes public drive and competitive effort. Do not read a 10th-house malefic as automatic career ruin.${axis}`;
    return `${careerState.note} Then judge sign, lord, occupants, aspects, and Saturn as the primary karma-karaka.${axis}`;
  }, [careerState.note, occupant, saturnConvergence, showPrivateBase]);

  return (
    <div data-interactive="bhava-profile" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>10th bhava profile</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              Karma: profession, status, authority, public action
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 820 }}>
              Test the most public house by choosing a career type, placing a 10th-house occupant, and comparing the 4th-10th axis.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setCareer("endurance");
              setOccupant("saturn");
              setShowPrivateBase(true);
            }}
            style={buttonStyle(false)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 1fr) minmax(320px, 0.9fr)", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Midheaven house</p>
              <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.2rem" }}>Action seen by the world</h3>
            </div>
            <strong style={{ color: careerState.color }}>{careerState.karaka} karaka</strong>
          </div>
          <KarmaMidheavenSvg careerColor={careerState.color} occupantColor={occupantState.color} showPrivateBase={showPrivateBase} saturnConvergence={saturnConvergence} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "0.65rem" }}>
            <MiniFact icon={<Landmark size={16} />} title="Class" body="Kendra + upachaya" color={BLUE} />
            <MiniFact icon={<BriefcaseBusiness size={16} />} title="Aim" body="Artha career house" color={GOLD} />
            <MiniFact icon={<ShieldCheck size={16} />} title="Primary karaka" body="Saturn for karma" color={PURPLE} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title={`Career type: ${careerState.label}`} icon={<BriefcaseBusiness size={18} />} color={careerState.color}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.65rem" }}>
              {(Object.keys(KARMA_CAREERS) as KarmaCareerKey[]).map((key) => (
                <button key={key} type="button" aria-pressed={career === key} onClick={() => setCareer(key)} style={smallChipStyle(career === key, KARMA_CAREERS[key].color)}>
                  {KARMA_CAREERS[key].label}
                </button>
              ))}
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{careerState.note}</p>
          </Panel>

          <Panel title={`Occupant: ${occupantState.label}`} icon={<CircleDot size={18} />} color={occupantState.color}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.65rem" }}>
              {(Object.keys(KARMA_OCCUPANTS) as KarmaOccupantKey[]).map((key) => (
                <button key={key} type="button" aria-pressed={occupant === key} onClick={() => setOccupant(key)} style={smallChipStyle(occupant === key, KARMA_OCCUPANTS[key].color)}>
                  {KARMA_OCCUPANTS[key].label}
                </button>
              ))}
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{occupantState.note}</p>
          </Panel>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 1fr) minmax(320px, 0.9fr)", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
          <p style={eyebrowStyle}>Ten attributes</p>
          <h3 style={{ margin: "0.15rem 0 0.8rem", color: GOLD, fontSize: "1.18rem" }}>The Karma card learners should memorize</h3>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            {KARMA_ATTRIBUTES.map(([label, value], index) => (
              <div key={label} style={{ display: "grid", gridTemplateColumns: "112px minmax(0, 1fr)", gap: "0.6rem", border: `1px solid ${index < 3 ? BLUE : index < 6 ? GREEN : index < 9 ? GOLD : PURPLE}33`, borderRadius: 8, padding: "0.6rem", background: `${index < 3 ? BLUE : index < 6 ? GREEN : index < 9 ? GOLD : PURPLE}0D` }}>
                <strong style={{ color: INK_MUTED }}>{label}</strong>
                <span style={{ color: INK_SECONDARY, lineHeight: 1.45 }}>{value}</span>
              </div>
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="4th-10th public axis" icon={<Home size={18} />} color={showPrivateBase ? BLUE : GOLD}>
            <button type="button" aria-pressed={showPrivateBase} onClick={() => setShowPrivateBase((value) => !value)} style={smallChipStyle(showPrivateBase, BLUE)}>
              {showPrivateBase ? "Private base visible" : "Show 4th opposite"}
            </button>
            <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>
              The 4th is the private base at the bottom of the chart; the 10th is the public peak where action becomes reputation.
            </p>
          </Panel>

          <Panel title="Reading order for Karma" icon={<Landmark size={18} />} color={GREEN}>
            <ol style={{ margin: 0, paddingLeft: "1.25rem", color: INK_SECONDARY, lineHeight: 1.65 }}>
              <li>Read the sign on the 10th and its lord.</li>
              <li>Judge occupants through the upachaya rule.</li>
              <li>Check aspects on the 10th.</li>
              <li>Add Saturn and the career-specific karaka.</li>
            </ol>
          </Panel>

          <section style={{ border: `1px solid ${GOLD}66`, borderRadius: 8, background: `${GOLD}16`, padding: "1rem" }}>
            <strong style={{ color: GOLD }}>Karma synthesis</strong>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{synthesis}</p>
          </section>
        </section>
      </div>
    </div>
  );
}

function PredictiveKarmaProfile() {
  const [question, setQuestion] = useState<PredictiveKarmaQuestionKey>("type");
  const [reference, setReference] = useState<PredictiveReferenceKey>("lagna");
  const [showD1, setShowD1] = useState(true);
  const [showAgreement, setShowAgreement] = useState(true);
  const questionState = PREDICTIVE_KARMA_QUESTIONS[question];
  const referenceState = PREDICTIVE_REFERENCES[reference];
  const activeAxes = PREDICTIVE_KARMA_AXES.filter((axis) => axis.questions.some((item) => item === question));

  const synthesis = useMemo(() => {
    const agreement = showAgreement
      ? " Compare Lagna, Moon, and Sun: agreement makes the career signature consistent; divergence makes the picture mixed."
      : "";
    const anchor = showD1
      ? " The D1 stays primary here; the D10 refines only after this foundation is read."
      : " Turn the D1 anchor back on before moving to divisional refinement.";
    return `${questionState.answer} ${questionState.trap}${agreement}${anchor}`;
  }, [questionState.answer, questionState.trap, showAgreement, showD1]);

  return (
    <div data-interactive="bhava-profile" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Tier 2 predictive 10th profile</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              Karma-bhava as a career question instrument
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 850 }}>
              Choose the client&apos;s career sub-question, then watch the relevant 10th-house axes, reference frame, and D1-first discipline come forward.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setQuestion("type");
              setReference("lagna");
              setShowD1(true);
              setShowAgreement(true);
            }}
            style={buttonStyle(false)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 1.05fr) minmax(320px, 0.95fr)", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Sub-question first</p>
              <h3 style={{ margin: "0.15rem 0 0", color: questionState.color, fontSize: "1.2rem" }}>{questionState.label}</h3>
            </div>
            <strong style={{ color: referenceState.color }}>{referenceState.label}</strong>
          </div>
          <PredictiveKarmaSvg question={question} reference={reference} showD1={showD1} showAgreement={showAgreement} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "0.65rem" }}>
            <MiniFact icon={<BriefcaseBusiness size={16} />} title="Client asks" body={questionState.clientQuestion} color={questionState.color} />
            <MiniFact icon={<Compass size={16} />} title="Reference" body={referenceState.focus} color={referenceState.color} />
            <MiniFact icon={<ShieldCheck size={16} />} title="Discipline" body={showD1 ? "D1 before D10" : "D1 anchor hidden"} color={showD1 ? GREEN : VERMILION} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Career sub-question" icon={<MessageCircle size={18} />} color={questionState.color}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.65rem" }}>
              {(Object.keys(PREDICTIVE_KARMA_QUESTIONS) as PredictiveKarmaQuestionKey[]).map((key) => (
                <button key={key} type="button" aria-pressed={question === key} onClick={() => setQuestion(key)} style={smallChipStyle(question === key, PREDICTIVE_KARMA_QUESTIONS[key].color)}>
                  {PREDICTIVE_KARMA_QUESTIONS[key].label}
                </button>
              ))}
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{questionState.answer}</p>
          </Panel>

          <Panel title="Reference frame" icon={<Compass size={18} />} color={referenceState.color}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.65rem" }}>
              {(Object.keys(PREDICTIVE_REFERENCES) as PredictiveReferenceKey[]).map((key) => (
                <button key={key} type="button" aria-pressed={reference === key} onClick={() => setReference(key)} style={smallChipStyle(reference === key, PREDICTIVE_REFERENCES[key].color)}>
                  {PREDICTIVE_REFERENCES[key].label}
                </button>
              ))}
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{referenceState.note}</p>
          </Panel>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 1fr) minmax(320px, 0.95fr)", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
          <p style={eyebrowStyle}>Reading axes</p>
          <h3 style={{ margin: "0.15rem 0 0.8rem", color: GOLD, fontSize: "1.18rem" }}>What gets weighted for this question</h3>
          <div style={{ display: "grid", gap: "0.55rem" }}>
            {PREDICTIVE_KARMA_AXES.map((axis) => {
              const active = activeAxes.some((item) => item.key === axis.key);
              return (
                <div key={axis.key} style={{ display: "grid", gridTemplateColumns: "minmax(120px, 0.35fr) minmax(0, 1fr)", gap: "0.7rem", border: `1px solid ${active ? axis.color : HAIRLINE}`, borderRadius: 8, padding: "0.7rem", background: active ? `${axis.color}14` : "rgba(255,251,241,0.58)" }}>
                  <div>
                    <strong style={{ color: active ? axis.color : INK_MUTED }}>{axis.label}</strong>
                    <p style={{ margin: "0.25rem 0 0", color: INK_MUTED, fontSize: "0.78rem", fontWeight: 850 }}>{axis.map}</p>
                  </div>
                  <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.45 }}>{axis.note}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="D1-first guard" icon={<ShieldCheck size={18} />} color={showD1 ? GREEN : VERMILION}>
            <button type="button" aria-pressed={showD1} onClick={() => setShowD1((value) => !value)} style={smallChipStyle(showD1, GREEN)}>
              {showD1 ? "D1 anchor visible" : "Show D1 anchor"}
            </button>
            <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>
              Read the rashi chart&apos;s 10th, its lord, and occupants before any divisional layer. The D10 refines the promise; it does not replace it.
            </p>
          </Panel>

          <Panel title="Reference agreement" icon={<UsersRound size={18} />} color={showAgreement ? BLUE : GOLD}>
            <button type="button" aria-pressed={showAgreement} onClick={() => setShowAgreement((value) => !value)} style={smallChipStyle(showAgreement, BLUE)}>
              {showAgreement ? "Agreement visible" : "Show agreement"}
            </button>
            <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>
              Lagna, Moon, and Sun agreeing gives a cleaner career signature. Differing references show mixed profession, feeling, or authority layers.
            </p>
          </Panel>

          <section style={{ border: `1px solid ${questionState.color}66`, borderRadius: 8, background: `${questionState.color}14`, padding: "1rem" }}>
            <strong style={{ color: questionState.color }}>Predictive synthesis</strong>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{synthesis}</p>
          </section>
        </section>
      </div>
    </div>
  );
}

function PredictiveKarmaSvg({ question, reference, showD1, showAgreement }: { question: PredictiveKarmaQuestionKey; reference: PredictiveReferenceKey; showD1: boolean; showAgreement: boolean }) {
  const center = 170;
  const radius = 116;
  const questionState = PREDICTIVE_KARMA_QUESTIONS[question];
  const referenceState = PREDICTIVE_REFERENCES[reference];
  const points = Array.from({ length: 12 }, (_, index) => {
    const angle = ((index - 3) / 12) * Math.PI * 2;
    return {
      house: index + 1,
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius,
    };
  });
  const activeAxes = PREDICTIVE_KARMA_AXES.filter((axis) => axis.questions.some((item) => item === question));
  const activeAxisLabels = activeAxes.map((axis) => axis.label).join(" + ");

  return (
    <svg viewBox="0 0 340 340" role="img" aria-label="Predictive tenth-house career sub-question diagram" style={{ width: "100%", maxHeight: 430, margin: "0.4rem auto 0.7rem", display: "block" }}>
      <circle cx={center} cy={center} r={132} fill={`${GOLD}10`} stroke={HAIRLINE} strokeWidth="1.5" />
      {showD1 ? <circle cx={center} cy={center} r={100} fill="none" stroke={`${GREEN}66`} strokeWidth="4" strokeDasharray="8 8" /> : null}
      {showAgreement ? (
        <g>
          <line x1={points[9].x} y1={points[9].y} x2={points[0].x} y2={points[0].y} stroke={`${BLUE}77`} strokeWidth="3" strokeLinecap="round" />
          <line x1={points[9].x} y1={points[9].y} x2={points[3].x} y2={points[3].y} stroke={`${BLUE}55`} strokeWidth="3" strokeLinecap="round" />
        </g>
      ) : null}
      {points.map((point) => {
        const active = point.house === 10;
        const service = question === "independent" && point.house === 6;
        const business = question === "independent" && point.house === 7;
        const dusthana = question === "stability" && (point.house === 6 || point.house === 8 || point.house === 12);
        const typeSupport = question === "type" && (point.house === 2 || point.house === 6);
        const fill = active ? questionState.color : service ? BLUE : business ? GREEN : dusthana ? `${VERMILION}28` : typeSupport ? `${GOLD}24` : "#FFF9EA";
        const stroke = active ? questionState.color : service ? BLUE : business ? GREEN : dusthana ? VERMILION : typeSupport ? GOLD : `${GOLD}44`;
        return (
          <g key={point.house}>
            <line x1={center} y1={center} x2={point.x} y2={point.y} stroke={stroke} strokeWidth={active || service || business || dusthana ? 3 : 1.1} />
            <circle cx={point.x} cy={point.y} r={active ? 20 : service || business || dusthana || typeSupport ? 17 : 14} fill={fill} stroke={active ? "#fff" : HAIRLINE} strokeWidth="2" />
            <text x={point.x} y={point.y + 5} textAnchor="middle" fill={active ? "#fff" : INK_SECONDARY} fontSize="13" fontWeight="900">{point.house}</text>
            {active ? <text x={point.x} y={point.y - 28} textAnchor="middle" fill={questionState.color} fontSize="11" fontWeight="900">10th</text> : null}
            {service ? <text x={point.x} y={point.y + 34} textAnchor="middle" fill={BLUE} fontSize="10" fontWeight="900">service</text> : null}
            {business ? <text x={point.x} y={point.y + 34} textAnchor="middle" fill={GREEN} fontSize="10" fontWeight="900">business</text> : null}
          </g>
        );
      })}
      <circle cx={center} cy={center} r={58} fill="#FFF9EA" stroke={referenceState.color} strokeWidth="3" />
      <text x={center} y={center - 18} textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight="900">READ FROM</text>
      <text x={center} y={center + 2} textAnchor="middle" fill={referenceState.color} fontSize="15" fontWeight="950">{referenceState.label.replace("From ", "")}</text>
      <text x={center} y={center + 22} textAnchor="middle" fill={questionState.color} fontSize="11" fontWeight="900">{questionState.short}</text>
      <text x={center} y={28} textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight="900" letterSpacing="1.2">{activeAxisLabels.toUpperCase()}</text>
      {showD1 ? <text x={center} y={322} textAnchor="middle" fill={GREEN} fontSize="11" fontWeight="900">D1 foundation before D10 refinement</text> : null}
    </svg>
  );
}

function TenthLordPermutationProfile() {
  const [placementHouse, setPlacementHouse] = useState(9);
  const [capacity, setCapacity] = useState<TenthLordCapacityKey>("strong");
  const [connection, setConnection] = useState<TenthLordConnectionKey>("direct");
  const [showNature, setShowNature] = useState(true);
  const [destinyGuard, setDestinyGuard] = useState(true);
  const placement = TENTH_LORD_PLACEMENTS.find((item) => item.house === placementHouse) ?? TENTH_LORD_PLACEMENTS[8];
  const capacityState = TENTH_LORD_CAPACITY[capacity];
  const connectionState = TENTH_LORD_CONNECTIONS[connection];
  const yogaFlag = placementHouse === 9 || (connection !== "direct" && connectionState.activeHouse === placementHouse);
  const deliveryText = capacity === "weak" ? placement.weak : capacity === "strong" ? placement.strong : `${placement.strong} But keep the delivery qualified until dignity, aspects, and timing agree.`;

  const synthesis = useMemo(() => {
    const yoga = yogaFlag
      ? ` Dharma-karmadhipati is flagged: ${connectionState.note}`
      : " No 9th-10th lord connection is selected for this placement.";
    const guard = destinyGuard
      ? " Keep the two-step discipline: direction first, delivery second."
      : " The guard is off: this is where placement-as-destiny mistakes creep in.";
    return `${placement.direction} ${deliveryText} ${capacityState.note}${yoga} ${guard}`;
  }, [capacityState.note, connectionState.note, deliveryText, destinyGuard, placement.direction, yogaFlag]);

  return (
    <div data-interactive="bhava-profile" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>10th lord permutation workbench</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              Direction from house, delivery from capacity
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 850 }}>
              Move the career-lord through all twelve houses, then change its capacity to see why a placement is a direction rather than a fixed verdict.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setPlacementHouse(9);
              setCapacity("strong");
              setConnection("direct");
              setShowNature(true);
              setDestinyGuard(true);
            }}
            style={buttonStyle(false)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 1.05fr) minmax(320px, 0.95fr)", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Twelve placements</p>
              <h3 style={{ margin: "0.15rem 0 0", color: placement.color, fontSize: "1.2rem" }}>
                10th lord in {placementHouse}: {placement.name}
              </h3>
            </div>
            <strong style={{ color: capacityState.color }}>{capacityState.label}</strong>
          </div>
          <TenthLordPermutationSvg placement={placement} capacity={capacity} showNature={showNature} yogaFlag={yogaFlag} onSelectHouse={setPlacementHouse} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "0.65rem" }}>
            <MiniFact icon={<Compass size={16} />} title="Direction" body={`House ${placementHouse}: ${placement.name}`} color={placement.color} />
            <MiniFact icon={<ShieldCheck size={16} />} title="Delivery" body={capacityState.label} color={capacityState.color} />
            <MiniFact icon={<Landmark size={16} />} title="Nature" body={placement.nature} color={showNature ? BLUE : INK_MUTED} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Place the 10th lord" icon={<BriefcaseBusiness size={18} />} color={placement.color}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "0.45rem" }}>
              {TENTH_LORD_PLACEMENTS.map((item) => (
                <button
                  key={item.house}
                  type="button"
                  aria-pressed={placementHouse === item.house}
                  onClick={() => setPlacementHouse(item.house)}
                  style={smallChipStyle(placementHouse === item.house, item.color)}
                >
                  H{item.house}
                </button>
              ))}
            </div>
            <p style={{ margin: "0.75rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>{placement.direction}</p>
          </Panel>

          <Panel title="Lord capacity" icon={<ShieldCheck size={18} />} color={capacityState.color}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.65rem" }}>
              {(Object.keys(TENTH_LORD_CAPACITY) as TenthLordCapacityKey[]).map((key) => (
                <button key={key} type="button" aria-pressed={capacity === key} onClick={() => setCapacity(key)} style={smallChipStyle(capacity === key, TENTH_LORD_CAPACITY[key].color)}>
                  {TENTH_LORD_CAPACITY[key].label}
                </button>
              ))}
            </div>
            <div style={{ height: 12, borderRadius: 8, background: `${GOLD}22`, overflow: "hidden", border: `1px solid ${HAIRLINE}` }}>
              <div style={{ width: `${capacityState.score}%`, height: "100%", background: capacityState.color, transition: "width 240ms ease" }} />
            </div>
            <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>{deliveryText}</p>
          </Panel>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 1fr) minmax(320px, 0.95fr)", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
          <p style={eyebrowStyle}>Placement table</p>
          <h3 style={{ margin: "0.15rem 0 0.8rem", color: GOLD, fontSize: "1.18rem" }}>Tour the twelve directions</h3>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            {TENTH_LORD_PLACEMENTS.map((item) => {
              const active = item.house === placementHouse;
              const dusthana = item.nature.includes("dusthana");
              const yoga = item.house === 9;
              return (
                <button
                  key={item.house}
                  type="button"
                  onClick={() => setPlacementHouse(item.house)}
                  style={{ textAlign: "left", border: `1px solid ${active ? item.color : HAIRLINE}`, borderRadius: 8, background: active ? `${item.color}14` : "rgba(255,251,241,0.58)", padding: "0.7rem", cursor: "pointer" }}
                >
                  <span style={{ display: "flex", justifyContent: "space-between", gap: "0.8rem", alignItems: "center" }}>
                    <strong style={{ color: active ? item.color : INK_SECONDARY }}>H{item.house} {item.name}</strong>
                    <span style={{ color: yoga ? GOLD : dusthana ? VERMILION : INK_MUTED, fontSize: "0.75rem", fontWeight: 900 }}>{yoga ? "yoga" : item.nature}</span>
                  </span>
                  <span style={{ display: "block", marginTop: "0.35rem", color: INK_SECONDARY, lineHeight: 1.4 }}>{item.direction}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Dharma-karmadhipati check" icon={<Sparkles size={18} />} color={yogaFlag ? GOLD : INK_MUTED}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.65rem" }}>
              {(Object.keys(TENTH_LORD_CONNECTIONS) as TenthLordConnectionKey[]).map((key) => (
                <button key={key} type="button" aria-pressed={connection === key} onClick={() => setConnection(key)} style={smallChipStyle(connection === key, GOLD)}>
                  {TENTH_LORD_CONNECTIONS[key].label}
                </button>
              ))}
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{connectionState.note}</p>
          </Panel>

          <Panel title="House nature overlay" icon={<Landmark size={18} />} color={showNature ? BLUE : GOLD}>
            <button type="button" aria-pressed={showNature} onClick={() => setShowNature((value) => !value)} style={smallChipStyle(showNature, BLUE)}>
              {showNature ? "Nature visible" : "Show nature"}
            </button>
            <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>
              Kendra and trikona placements support visibility and flow; dusthana placements are not automatic failure, but they need capacity to become productive.
            </p>
          </Panel>

          <Panel title="Placement-as-destiny guard" icon={<AlertTriangle size={18} />} color={destinyGuard ? GREEN : VERMILION}>
            <button type="button" aria-pressed={destinyGuard} onClick={() => setDestinyGuard((value) => !value)} style={smallChipStyle(destinyGuard, GREEN)}>
              {destinyGuard ? "Guard active" : "Reactivate guard"}
            </button>
            <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>
              Same placement, different outcomes: a strong 12th can give foreign or institutional success; a weak 12th can show loss and obscurity.
            </p>
          </Panel>

          <section style={{ border: `1px solid ${placement.color}66`, borderRadius: 8, background: `${placement.color}14`, padding: "1rem" }}>
            <strong style={{ color: placement.color }}>Direction + delivery synthesis</strong>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{synthesis}</p>
          </section>
        </section>
      </div>
    </div>
  );
}

function TenthLordPermutationSvg({ placement, capacity, showNature, yogaFlag, onSelectHouse }: { placement: TenthLordPlacement; capacity: TenthLordCapacityKey; showNature: boolean; yogaFlag: boolean; onSelectHouse: (house: number) => void }) {
  const center = 170;
  const radius = 116;
  const capacityState = TENTH_LORD_CAPACITY[capacity];
  const points = TENTH_LORD_PLACEMENTS.map((item, index) => {
    const angle = ((index - 3) / 12) * Math.PI * 2;
    return {
      ...item,
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius,
    };
  });
  const activePoint = points.find((item) => item.house === placement.house) ?? points[8];
  const tenthPoint = points[9];

  return (
    <svg viewBox="0 0 340 340" role="img" aria-label="Tenth lord placement wheel with capacity and house nature overlay" style={{ width: "100%", maxHeight: 430, margin: "0.4rem auto 0.7rem", display: "block" }}>
      <circle cx={center} cy={center} r={132} fill={`${GOLD}10`} stroke={HAIRLINE} strokeWidth="1.5" />
      {showNature ? (
        <g>
          <circle cx={center} cy={center} r={128} fill="none" stroke={`${GREEN}30`} strokeWidth="8" strokeDasharray="18 14" />
          <circle cx={center} cy={center} r={96} fill="none" stroke={`${VERMILION}22`} strokeWidth="8" strokeDasharray="10 22" />
        </g>
      ) : null}
      <line x1={tenthPoint.x} y1={tenthPoint.y} x2={activePoint.x} y2={activePoint.y} stroke={placement.color} strokeWidth="4" strokeLinecap="round" />
      <circle cx={center} cy={center} r={48} fill="#FFF9EA" stroke={capacityState.color} strokeWidth="3" />
      <text x={center} y={center - 16} textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight="900">10TH LORD</text>
      <text x={center} y={center + 4} textAnchor="middle" fill={placement.color} fontSize="17" fontWeight="950">H{placement.house}</text>
      <text x={center} y={center + 23} textAnchor="middle" fill={capacityState.color} fontSize="10" fontWeight="900">{capacity === "strong" ? "full delivery" : capacity === "weak" ? "qualified" : "mixed"}</text>
      {points.map((point) => {
        const active = point.house === placement.house;
        const source = point.house === 10;
        const dusthana = point.nature.includes("dusthana");
        const support = point.nature.includes("kendra") || point.nature.includes("trikona");
        const fill = active ? placement.color : source ? GOLD : showNature && dusthana ? `${VERMILION}28` : showNature && support ? `${GREEN}24` : "#FFF9EA";
        return (
          <g key={point.house} role="button" tabIndex={0} onClick={() => onSelectHouse(point.house)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") onSelectHouse(point.house); }} style={{ cursor: "pointer" }}>
            <line x1={center} y1={center} x2={point.x} y2={point.y} stroke={active ? placement.color : source ? `${GOLD}99` : `${GOLD}44`} strokeWidth={active || source ? 2.5 : 1.1} />
            <circle cx={point.x} cy={point.y} r={active ? 20 : source ? 18 : 15} fill={fill} stroke={active || source ? "#fff" : HAIRLINE} strokeWidth="2" />
            <text x={point.x} y={point.y + 5} textAnchor="middle" fill={active || source ? "#fff" : INK_SECONDARY} fontSize="13" fontWeight="900">{point.house}</text>
            {active ? <text x={point.x} y={point.y + 34} textAnchor="middle" fill={placement.color} fontSize="10" fontWeight="900">lord sits</text> : null}
            {yogaFlag && point.house === 9 ? <text x={point.x} y={point.y - 28} textAnchor="middle" fill={GOLD} fontSize="10" fontWeight="900">yoga</text> : null}
          </g>
        );
      })}
      <circle cx={activePoint.x} cy={activePoint.y - 19} r="8" fill={capacityState.color} stroke="#fff" strokeWidth="2" />
      <text x={center} y={28} textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight="900" letterSpacing="1.2">CAREER-LORD CARRIES KARMA INTO HOUSE {placement.house}</text>
      {yogaFlag ? <text x={center} y={322} textAnchor="middle" fill={GOLD} fontSize="11" fontWeight="900">9th-10th connection: dharma-karmadhipati flagged</text> : null}
    </svg>
  );
}

function KarmaMidheavenSvg({ careerColor, occupantColor, showPrivateBase, saturnConvergence }: { careerColor: string; occupantColor: string; showPrivateBase: boolean; saturnConvergence: boolean }) {
  const center = 170;
  const radius = 116;
  const points = Array.from({ length: 12 }, (_, index) => {
    const angle = ((index - 3) / 12) * Math.PI * 2;
    return {
      house: index + 1,
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius,
    };
  });

  return (
    <svg viewBox="0 0 340 340" role="img" aria-label="Karma bhava midheaven, upachaya, and public-private axis diagram" style={{ width: "100%", maxHeight: 430, margin: "0.4rem auto 0.7rem", display: "block" }}>
      <circle cx={center} cy={center} r={132} fill={`${GOLD}10`} stroke={HAIRLINE} strokeWidth="1.5" />
      {showPrivateBase ? <line x1={center} y1={center + radius} x2={center} y2={center - radius} stroke={`${BLUE}AA`} strokeWidth="4" strokeLinecap="round" /> : null}
      {points.map((point) => {
        const upachaya = point.house === 3 || point.house === 6 || point.house === 10 || point.house === 11;
        const artha = point.house === 2 || point.house === 6 || point.house === 10;
        const active = point.house === 10;
        const privateBase = showPrivateBase && point.house === 4;
        const fill = active ? GOLD : privateBase ? BLUE : upachaya ? `${GREEN}22` : artha ? `${GOLD}24` : "#FFF9EA";
        return (
          <g key={point.house}>
            <line x1={center} y1={center} x2={point.x} y2={point.y} stroke={active ? careerColor : privateBase ? BLUE : upachaya ? `${GREEN}99` : `${GOLD}44`} strokeWidth={active || privateBase ? 3 : 1.1} />
            <circle cx={point.x} cy={point.y} r={active || privateBase ? 18 : upachaya || artha ? 16 : 14} fill={fill} stroke={active || privateBase ? "#fff" : HAIRLINE} strokeWidth="2" />
            <text x={point.x} y={point.y + 5} textAnchor="middle" fill={active || privateBase ? "#fff" : INK_SECONDARY} fontSize="13" fontWeight="900">{point.house}</text>
            {active ? <text x={point.x} y={point.y - 26} textAnchor="middle" fill={GOLD} fontSize="11" fontWeight="900">Karma</text> : null}
            {privateBase ? <text x={point.x} y={point.y + 34} textAnchor="middle" fill={BLUE} fontSize="11" fontWeight="900">4th base</text> : null}
          </g>
        );
      })}
      <circle cx={center} cy={center} r={54} fill="#FFF9EA" stroke={careerColor} strokeWidth="3" />
      <text x={center} y={center - 8} textAnchor="middle" fill={GOLD} fontSize="26" fontWeight="900">10</text>
      <text x={center} y={center + 17} textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="800">Karma</text>
      <circle cx={center + 38} cy={center - 34} r={saturnConvergence ? 12 : 9} fill={occupantColor} stroke="#fff" strokeWidth="2" />
      <text x={center + 38} y={center - 30} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="900">{saturnConvergence ? "Sa" : ""}</text>
      <text x={center} y={28} textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="900" letterSpacing="1.2">PUBLIC ACTION AND STATUS</text>
    </svg>
  );
}

function LabhaProfile() {
  const [gainMode, setGainMode] = useState<LabhaGainKey>("eleventh");
  const [occupant, setOccupant] = useState<LabhaOccupantKey>("jupiter");
  const [showSiblingAxis, setShowSiblingAxis] = useState(true);
  const gainState = LABHA_GAIN_MODES[gainMode];
  const occupantState = LABHA_OCCUPANTS[occupant];
  const upachayaMalefic = occupant === "saturn" || occupant === "mars";
  const occupantAbbr = occupant === "jupiter" ? "Ju" : occupant === "saturn" ? "Sa" : occupant === "mars" ? "Ma" : "Be";

  const synthesis = useMemo(() => {
    const sibling = showSiblingAxis ? " The 3rd-11th axis is visible: younger siblings belong to the 3rd, elder siblings to the 11th." : "";
    if (upachayaMalefic) return `${occupantState.note} Do not read this malefic as blocked gains by default; the 11th is the last upachaya and grows through effort.${sibling}`;
    if (gainMode !== "eleventh") return `${gainState.note} Keep it distinct from Labha: the 11th is income and realised gain, not every form of wealth.${sibling}`;
    return `${gainState.note} Judge the 11th through sign, lord, occupants, aspects, and Jupiter as labha-karaka.${sibling}`;
  }, [gainMode, gainState.note, occupantState.note, showSiblingAxis, upachayaMalefic]);

  return (
    <div data-interactive="bhava-profile" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>11th bhava profile</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              Labha: gains, fulfilled desire, elder siblings, networks
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 820 }}>
              Compare wealth houses, mark the sibling axis, and test how the last upachaya turns effort into realised gain.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setGainMode("eleventh");
              setOccupant("jupiter");
              setShowSiblingAxis(true);
            }}
            style={buttonStyle(false)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 1fr) minmax(320px, 0.9fr)", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Fulfilled desire</p>
              <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.2rem" }}>Income flow and networks</h3>
            </div>
            <strong style={{ color: GOLD }}>Jupiter karaka</strong>
          </div>
          <LabhaGainSvg gainHouse={gainState.house} gainColor={gainState.color} occupantColor={occupantState.color} occupantAbbr={occupantAbbr} showSiblingAxis={showSiblingAxis} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "0.65rem" }}>
            <MiniFact icon={<Coins size={16} />} title="Wealth role" body="11th = inflow" color={GREEN} />
            <MiniFact icon={<UsersRound size={16} />} title="People" body="Elder siblings, friends" color={BLUE} />
            <MiniFact icon={<Sparkles size={16} />} title="Class" body="Panaphara + upachaya" color={GOLD} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title={`Wealth lens: ${gainState.label}`} icon={<Coins size={18} />} color={gainState.color}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.65rem" }}>
              {(Object.keys(LABHA_GAIN_MODES) as LabhaGainKey[]).map((key) => (
                <button key={key} type="button" aria-pressed={gainMode === key} onClick={() => setGainMode(key)} style={smallChipStyle(gainMode === key, LABHA_GAIN_MODES[key].color)}>
                  {LABHA_GAIN_MODES[key].label}
                </button>
              ))}
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{gainState.note}</p>
          </Panel>

          <Panel title={`Occupant: ${occupantState.label}`} icon={<CircleDot size={18} />} color={occupantState.color}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.65rem" }}>
              {(Object.keys(LABHA_OCCUPANTS) as LabhaOccupantKey[]).map((key) => (
                <button key={key} type="button" aria-pressed={occupant === key} onClick={() => setOccupant(key)} style={smallChipStyle(occupant === key, LABHA_OCCUPANTS[key].color)}>
                  {LABHA_OCCUPANTS[key].label}
                </button>
              ))}
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{occupantState.note}</p>
          </Panel>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 1fr) minmax(320px, 0.9fr)", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
          <p style={eyebrowStyle}>Ten attributes</p>
          <h3 style={{ margin: "0.15rem 0 0.8rem", color: GOLD, fontSize: "1.18rem" }}>The Labha card learners should memorize</h3>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            {LABHA_ATTRIBUTES.map(([label, value], index) => (
              <div key={label} style={{ display: "grid", gridTemplateColumns: "112px minmax(0, 1fr)", gap: "0.6rem", border: `1px solid ${index < 3 ? BLUE : index < 6 ? GREEN : index < 9 ? GOLD : PURPLE}33`, borderRadius: 8, padding: "0.6rem", background: `${index < 3 ? BLUE : index < 6 ? GREEN : index < 9 ? GOLD : PURPLE}0D` }}>
                <strong style={{ color: INK_MUTED }}>{label}</strong>
                <span style={{ color: INK_SECONDARY, lineHeight: 1.45 }}>{value}</span>
              </div>
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="3rd-11th sibling axis" icon={<UsersRound size={18} />} color={showSiblingAxis ? BLUE : GOLD}>
            <button type="button" aria-pressed={showSiblingAxis} onClick={() => setShowSiblingAxis((value) => !value)} style={smallChipStyle(showSiblingAxis, BLUE)}>
              {showSiblingAxis ? "Sibling axis visible" : "Show sibling axis"}
            </button>
            <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>
              The 3rd governs younger siblings; the 11th governs elder siblings and the wider circle of friends.
            </p>
          </Panel>

          <Panel title="Reading order for Labha" icon={<Sparkles size={18} />} color={GREEN}>
            <ol style={{ margin: 0, paddingLeft: "1.25rem", color: INK_SECONDARY, lineHeight: 1.65 }}>
              <li>Read the sign on the 11th and its lord.</li>
              <li>Judge occupants through the upachaya rule.</li>
              <li>Check aspects on the 11th.</li>
              <li>Add Jupiter&apos;s condition for gains and fulfilment.</li>
            </ol>
          </Panel>

          <section style={{ border: `1px solid ${GOLD}66`, borderRadius: 8, background: `${GOLD}16`, padding: "1rem" }}>
            <strong style={{ color: GOLD }}>Labha synthesis</strong>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{synthesis}</p>
          </section>
        </section>
      </div>
    </div>
  );
}

function LabhaGainSvg({ gainHouse, gainColor, occupantColor, occupantAbbr, showSiblingAxis }: { gainHouse: number; gainColor: string; occupantColor: string; occupantAbbr: string; showSiblingAxis: boolean }) {
  const center = 170;
  const radius = 116;
  const points = Array.from({ length: 12 }, (_, index) => {
    const angle = ((index - 3) / 12) * Math.PI * 2;
    return {
      house: index + 1,
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius,
    };
  });

  return (
    <svg viewBox="0 0 340 340" role="img" aria-label="Labha bhava wealth distinction, sibling axis, and upachaya diagram" style={{ width: "100%", maxHeight: 430, margin: "0.4rem auto 0.7rem", display: "block" }}>
      <circle cx={center} cy={center} r={132} fill={`${GOLD}10`} stroke={HAIRLINE} strokeWidth="1.5" />
      {showSiblingAxis ? <line x1={points[2].x} y1={points[2].y} x2={points[10].x} y2={points[10].y} stroke={`${BLUE}AA`} strokeWidth="4" strokeLinecap="round" /> : null}
      {points.map((point) => {
        const wealth = point.house === 2 || point.house === 9 || point.house === 11;
        const upachaya = point.house === 3 || point.house === 6 || point.house === 10 || point.house === 11;
        const sibling = showSiblingAxis && (point.house === 3 || point.house === 11);
        const active = point.house === gainHouse || point.house === 11;
        const fill = point.house === 11 ? GREEN : point.house === gainHouse ? gainColor : sibling ? BLUE : upachaya ? `${GREEN}22` : wealth ? `${GOLD}26` : "#FFF9EA";
        return (
          <g key={point.house}>
            <line x1={center} y1={center} x2={point.x} y2={point.y} stroke={active ? gainColor : sibling ? BLUE : upachaya ? `${GREEN}99` : `${GOLD}44`} strokeWidth={active || sibling ? 3 : 1.1} />
            <circle cx={point.x} cy={point.y} r={active || sibling ? 18 : wealth || upachaya ? 16 : 14} fill={fill} stroke={active || sibling ? "#fff" : HAIRLINE} strokeWidth="2" />
            <text x={point.x} y={point.y + 5} textAnchor="middle" fill={active || sibling ? "#fff" : INK_SECONDARY} fontSize="13" fontWeight="900">{point.house}</text>
            {point.house === 11 ? <text x={point.x} y={point.y - 27} textAnchor="middle" fill={GREEN} fontSize="11" fontWeight="900">Labha</text> : null}
            {showSiblingAxis && point.house === 3 ? <text x={point.x} y={point.y + 34} textAnchor="middle" fill={BLUE} fontSize="11" fontWeight="900">younger</text> : null}
            {showSiblingAxis && point.house === 11 ? <text x={point.x} y={point.y + 34} textAnchor="middle" fill={BLUE} fontSize="11" fontWeight="900">elder</text> : null}
          </g>
        );
      })}
      <circle cx={center} cy={center} r={54} fill="#FFF9EA" stroke={GREEN} strokeWidth="3" />
      <text x={center} y={center - 8} textAnchor="middle" fill={GREEN} fontSize="26" fontWeight="900">11</text>
      <text x={center} y={center + 17} textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="800">Labha</text>
      <circle cx={center + 38} cy={center - 34} r={10} fill={occupantColor} stroke="#fff" strokeWidth="2" />
      <text x={center + 38} y={center - 30} textAnchor="middle" fill="#fff" fontSize="9" fontWeight="900">{occupantAbbr}</text>
      <text x={center} y={28} textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="900" letterSpacing="1.2">GAINS AND FULFILLED DESIRE</text>
    </svg>
  );
}

function VyayaProfile() {
  const [face, setFace] = useState<VyayaFaceKey>("moksha");
  const [karaka, setKaraka] = useState<VyayaKarakaKey>("both");
  const [showParadox, setShowParadox] = useState(true);
  const [showMirror, setShowMirror] = useState(true);
  const faceState = VYAYA_FACES[face];
  const karakaState = VYAYA_KARAKAS[karaka];

  const synthesis = useMemo(() => {
    const paradox = showParadox ? " Read both flags together: dusthana names the difficulty, moksha names the release." : "";
    const mirror = showMirror ? " Keep the neighbour contrast exact: 11th is inflow, 12th is outflow." : "";
    if (karaka === "ketu") return `${karakaState.note} Ketu in the 12th doubles the moksha pull, but balance withdrawal with the rest of the chart.${paradox}${mirror}`;
    if (karaka === "saturn") return `${karakaState.note} Do not catastrophise the loss; Saturn can mature into vairagya and disciplined letting-go.${paradox}${mirror}`;
    return `${karakaState.note} ${faceState.note}${paradox}${mirror}`;
  }, [faceState.note, karaka, karakaState.note, showMirror, showParadox]);

  return (
    <div data-interactive="bhava-profile" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>12th bhava profile</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              Vyaya: loss, expenditure, foreign lands, moksha
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 820 }}>
              Explore the final house as outflow and release: Saturn&apos;s subtraction, Ketu&apos;s detachment, and the dusthana-moksha paradox.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setFace("moksha");
              setKaraka("both");
              setShowParadox(true);
              setShowMirror(true);
            }}
            style={buttonStyle(false)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 1fr) minmax(320px, 0.9fr)", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Final letting-go</p>
              <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.2rem" }}>Outflow becomes release</h3>
            </div>
            <strong style={{ color: karakaState.color }}>{karakaState.label}</strong>
          </div>
          <VyayaReleaseSvg faceColor={faceState.color} karakaColor={karakaState.color} karaka={karaka} showParadox={showParadox} showMirror={showMirror} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "0.65rem" }}>
            <MiniFact icon={<AlertTriangle size={16} />} title="Difficulty" body="Dusthana: loss/outflow" color={VERMILION} />
            <MiniFact icon={<Sparkles size={16} />} title="Release" body="Moksha: liberation" color={GREEN} />
            <MiniFact icon={<Compass size={16} />} title="Places" body="Foreign, isolated, distant" color={BLUE} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title={`12th face: ${faceState.label}`} icon={<Compass size={18} />} color={faceState.color}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.65rem" }}>
              {(Object.keys(VYAYA_FACES) as VyayaFaceKey[]).map((key) => (
                <button key={key} type="button" aria-pressed={face === key} onClick={() => setFace(key)} style={smallChipStyle(face === key, VYAYA_FACES[key].color)}>
                  {VYAYA_FACES[key].label}
                </button>
              ))}
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{faceState.note}</p>
          </Panel>

          <Panel title={`Karaka lens: ${karakaState.label}`} icon={<CircleDot size={18} />} color={karakaState.color}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.65rem" }}>
              {(Object.keys(VYAYA_KARAKAS) as VyayaKarakaKey[]).map((key) => (
                <button key={key} type="button" aria-pressed={karaka === key} onClick={() => setKaraka(key)} style={smallChipStyle(karaka === key, VYAYA_KARAKAS[key].color)}>
                  {VYAYA_KARAKAS[key].label}
                </button>
              ))}
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{karakaState.note}</p>
          </Panel>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 1fr) minmax(320px, 0.9fr)", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
          <p style={eyebrowStyle}>Ten attributes</p>
          <h3 style={{ margin: "0.15rem 0 0.8rem", color: GOLD, fontSize: "1.18rem" }}>The Vyaya card learners should memorize</h3>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            {VYAYA_ATTRIBUTES.map(([label, value], index) => (
              <div key={label} style={{ display: "grid", gridTemplateColumns: "112px minmax(0, 1fr)", gap: "0.6rem", border: `1px solid ${index < 3 ? BLUE : index < 6 ? GREEN : index < 9 ? VERMILION : PURPLE}33`, borderRadius: 8, padding: "0.6rem", background: `${index < 3 ? BLUE : index < 6 ? GREEN : index < 9 ? VERMILION : PURPLE}0D` }}>
                <strong style={{ color: INK_MUTED }}>{label}</strong>
                <span style={{ color: INK_SECONDARY, lineHeight: 1.45 }}>{value}</span>
              </div>
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Dusthana + moksha flags" icon={<ShieldCheck size={18} />} color={showParadox ? GREEN : VERMILION}>
            <button type="button" aria-pressed={showParadox} onClick={() => setShowParadox((value) => !value)} style={smallChipStyle(showParadox, GREEN)}>
              {showParadox ? "Paradox visible" : "Show paradox"}
            </button>
            <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>
              The 12th is difficult and liberating at once: what leaves the life may also loosen the soul&apos;s binding.
            </p>
          </Panel>

          <Panel title="11th-12th mirror" icon={<Coins size={18} />} color={showMirror ? GOLD : BLUE}>
            <button type="button" aria-pressed={showMirror} onClick={() => setShowMirror((value) => !value)} style={smallChipStyle(showMirror, GOLD)}>
              {showMirror ? "Inflow/outflow visible" : "Show 11th mirror"}
            </button>
            <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>
              The 11th is gain and inflow; the 12th is loss and outflow. Match the question to the correct side.
            </p>
          </Panel>

          <section style={{ border: `1px solid ${GOLD}66`, borderRadius: 8, background: `${GOLD}16`, padding: "1rem" }}>
            <strong style={{ color: GOLD }}>Vyaya synthesis</strong>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{synthesis}</p>
          </section>
        </section>
      </div>
    </div>
  );
}

function VyayaReleaseSvg({ faceColor, karakaColor, karaka, showParadox, showMirror }: { faceColor: string; karakaColor: string; karaka: VyayaKarakaKey; showParadox: boolean; showMirror: boolean }) {
  const center = 170;
  const radius = 116;
  const points = Array.from({ length: 12 }, (_, index) => {
    const angle = ((index - 3) / 12) * Math.PI * 2;
    return {
      house: index + 1,
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius,
    };
  });
  const label = karaka === "saturn" ? "Sa" : karaka === "ketu" ? "Ke" : "Sa/Ke";

  return (
    <svg viewBox="0 0 340 340" role="img" aria-label="Vyaya bhava dusthana moksha and inflow outflow diagram" style={{ width: "100%", maxHeight: 430, margin: "0.4rem auto 0.7rem", display: "block" }}>
      <circle cx={center} cy={center} r={132} fill={`${GOLD}10`} stroke={HAIRLINE} strokeWidth="1.5" />
      {showMirror ? <line x1={points[10].x} y1={points[10].y} x2={points[11].x} y2={points[11].y} stroke={`${GOLD}AA`} strokeWidth="4" strokeLinecap="round" /> : null}
      {points.map((point) => {
        const active = point.house === 12;
        const mirror = showMirror && point.house === 11;
        const dusthana = point.house === 6 || point.house === 8 || point.house === 12;
        const moksha = point.house === 4 || point.house === 8 || point.house === 12;
        const paradox = showParadox && active;
        const fill = active ? VERMILION : mirror ? GREEN : paradox ? GOLD : dusthana ? `${VERMILION}22` : moksha ? `${GREEN}22` : "#FFF9EA";
        return (
          <g key={point.house}>
            <line x1={center} y1={center} x2={point.x} y2={point.y} stroke={active ? faceColor : mirror ? GREEN : dusthana ? `${VERMILION}88` : moksha ? `${GREEN}88` : `${GOLD}44`} strokeWidth={active || mirror ? 3 : 1.1} />
            <circle cx={point.x} cy={point.y} r={active || mirror ? 18 : dusthana || moksha ? 16 : 14} fill={fill} stroke={active || mirror ? "#fff" : HAIRLINE} strokeWidth="2" />
            <text x={point.x} y={point.y + 5} textAnchor="middle" fill={active || mirror ? "#fff" : INK_SECONDARY} fontSize="13" fontWeight="900">{point.house}</text>
            {active ? <text x={point.x} y={point.y + 34} textAnchor="middle" fill={VERMILION} fontSize="11" fontWeight="900">outflow</text> : null}
            {mirror ? <text x={point.x} y={point.y + 34} textAnchor="middle" fill={GREEN} fontSize="11" fontWeight="900">inflow</text> : null}
          </g>
        );
      })}
      {showParadox ? (
        <g>
          <path d={`M ${center - 66} ${center + 42} C ${center - 20} ${center + 80}, ${center + 38} ${center + 78}, ${center + 70} ${center + 28}`} fill="none" stroke={GREEN} strokeWidth="4" strokeLinecap="round" />
          <text x={center} y={center + 92} textAnchor="middle" fill={GREEN} fontSize="12" fontWeight="900">loss opens release</text>
        </g>
      ) : null}
      <circle cx={center} cy={center} r={54} fill="#FFF9EA" stroke={karakaColor} strokeWidth="3" />
      <text x={center} y={center - 8} textAnchor="middle" fill={VERMILION} fontSize="26" fontWeight="900">12</text>
      <text x={center} y={center + 17} textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="800">Vyaya</text>
      <circle cx={center + 39} cy={center - 34} r={label.length > 2 ? 14 : 10} fill={karakaColor} stroke="#fff" strokeWidth="2" />
      <text x={center + 39} y={center - 30} textAnchor="middle" fill="#fff" fontSize={label.length > 2 ? "8" : "9"} fontWeight="900">{label}</text>
      <text x={center} y={28} textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="900" letterSpacing="1.2">LOSS, DISTANCE, LIBERATION</text>
    </svg>
  );
}

function TrendingIcon() {
  return <Sparkles size={16} aria-hidden="true" />;
}

function BhavaAnchorSvg({ lagneshaHouse, conditionColor, occupantColor }: { lagneshaHouse: number; conditionColor: string; occupantColor: string }) {
  const center = 170;
  const radius = 118;
  const points = Array.from({ length: 12 }, (_, index) => {
    const angle = ((index - 3) / 12) * Math.PI * 2;
    return {
      house: index + 1,
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius,
    };
  });

  return (
    <svg viewBox="0 0 340 340" role="img" aria-label="Tanu chart anchor diagram" style={{ width: "100%", maxHeight: 430, margin: "0.4rem auto 0.7rem", display: "block" }}>
      <defs>
        <radialGradient id="tanuGlow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor={`${GOLD}44`} />
          <stop offset="100%" stopColor={`${GOLD}08`} />
        </radialGradient>
      </defs>
      <circle cx={center} cy={center} r={132} fill="url(#tanuGlow)" stroke={HAIRLINE} strokeWidth="1.5" />
      {points.map((point) => (
        <line key={`ray-${point.house}`} x1={center} y1={center} x2={point.x} y2={point.y} stroke={point.house === lagneshaHouse ? conditionColor : `${GOLD}55`} strokeWidth={point.house === lagneshaHouse ? 3 : 1.2} />
      ))}
      <circle cx={center} cy={center} r={54} fill="#FFF9EA" stroke={BLUE} strokeWidth="3" />
      <text x={center} y={center - 8} textAnchor="middle" fill={BLUE} fontSize="26" fontWeight="900">1</text>
      <text x={center} y={center + 17} textAnchor="middle" fill={INK_SECONDARY} fontSize="13" fontWeight="800">Tanu</text>
      <circle cx={center + 37} cy={center - 34} r={8} fill={occupantColor} stroke="#fff" strokeWidth="2" />
      {points.map((point) => {
        const active = point.house === lagneshaHouse;
        return (
          <g key={point.house}>
            <circle cx={point.x} cy={point.y} r={active ? 18 : point.house === 1 ? 17 : 15} fill={active ? conditionColor : point.house === 1 ? BLUE : "#FFF9EA"} stroke={active || point.house === 1 ? "#fff" : HAIRLINE} strokeWidth="2" />
            <text x={point.x} y={point.y + 5} textAnchor="middle" fill={active || point.house === 1 ? "#fff" : INK_SECONDARY} fontSize="13" fontWeight="900">{point.house}</text>
            {active ? (
              <text x={point.x} y={point.y + 34} textAnchor="middle" fill={conditionColor} fontSize="11" fontWeight="900">Lagnesha</text>
            ) : null}
          </g>
        );
      })}
      <text x={center} y={28} textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="900" letterSpacing="1.2">ALL HOUSES COUNT FROM LAGNA</text>
    </svg>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 950 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function MiniFact({ icon, title, body, color }: { icon: ReactNode; title: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}0F`, padding: "0.7rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color, fontWeight: 950 }}>{icon}{title}</div>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.35 }}>{body}</p>
    </div>
  );
}

function buttonStyle(active: boolean): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    border: `1px solid ${active ? BLUE : HAIRLINE}`,
    borderRadius: 8,
    background: active ? BLUE : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.55rem 0.75rem",
    fontWeight: 850,
    cursor: "pointer",
  };
}

function smallChipStyle(active: boolean, color: string): React.CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.48rem 0.62rem",
    fontWeight: 850,
    cursor: "pointer",
  };
}

const eyebrowStyle: React.CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 900,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
