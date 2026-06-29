"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useState, useMemo, useContext, useCallback, useEffect } from "react";
import { IAST } from "../../chrome/typography";
import {
  RASHIS, getDignitiesForRashi, MULA_TRIKONA_REDIRECTS, OPPOSITE_PAIRS,
  ELEMENT_COLORS, DIGNITY_COLORS, GRAHA_SYMBOLS, GRAHA_COLORS,
  polarToCartesian,
  type RashiData,
} from "../rashi-data";
import { LessonContext } from "../rashi-attribute-wheel";

/* ─── Slug → Rāśi mapping ─── */
const SLUG_TO_RASHI: Record<string, number> = {
  "mesha-aries-the-fiery-cardinal": 1,
  "vrishabha-taurus-the-earthen-fixed": 2,
  "mithuna-gemini-the-airy-mutable": 3,
  "karka-cancer-the-watery-cardinal": 4,
  "simha-leo-the-fiery-fixed": 5,
  "kanya-virgo-the-earthen-mutable": 6,
  "tula-libra-the-airy-cardinal": 7,
  "vrishchika-scorpio-the-watery-fixed": 8,
  "dhanus-sagittarius-the-fiery-mutable": 9,
  "makara-capricorn-the-earthen-cardinal": 10,
  "kumbha-aquarius-the-airy-fixed": 11,
  "mina-pisces-the-watery-mutable": 12,
};

/* ─── Per-graha interpretive text (generic pattern, rāśi-aware) ─── */
function getGrahaInterpretation(graha: string, rashi: RashiData): string {
  const dignities = getDignitiesForRashi(rashi.number);
  const exalted = dignities.find((d) => d.type === "Exalted" && d.graha === graha);
  const debilitated = dignities.find((d) => d.type === "Debilitated" && d.graha === graha);
  const ownSign = dignities.find((d) => d.type === "Own-sign" && d.graha === graha);
  const mulaTrikona = dignities.find((d) => d.type === "Mūla-trikoṇa" && d.graha === graha);

  const element = rashi.element.toLowerCase();
  const modality = rashi.modality === "Chara" ? "cardinal" : rashi.modality === "Sthira" ? "fixed" : "mutable";
  const flavour = rashi.keywords.toLowerCase();

  if (exalted) {
    return `${graha} is EXALTED at ${exalted.degree}° ${rashi.nameIAST} — maximum strength. ${graha}'s natural qualities are amplified to their highest degree within ${rashi.nameIAST}'s ${element}-${modality} environment. The ${flavour} nature of this rāśi perfectly channels ${graha}'s significations.`;
  }
  if (debilitated) {
    return `${graha} is DEBILITATED at ${debilitated.degree}° ${rashi.nameIAST} — minimum strength. ${graha}'s natural qualities face challenge within ${rashi.nameIAST}'s ${element}-${modality} environment. However, debilitation is redirection, not destruction — ${graha} must find alternative pathways to express its significations.`;
  }
  if (ownSign) {
    return `${graha} is in OWN-SIGN in ${rashi.nameIAST} — comfortable, authentic expression. As the lord of this rāśi, ${graha} operates in its natural habitat. The ${flavour} qualities flow naturally through ${graha}'s significations.`;
  }
  if (mulaTrikona) {
    return `${graha} is in MŪLA-TRIKOṆA (${mulaTrikona.degreeStart}°–${mulaTrikona.degreeEnd}°) in ${rashi.nameIAST} — power zone. ${graha}'s primary significations are maximally focused and effective here.`;
  }

  // Generic interpretation
  const interpretations: Record<string, string> = {
    Sun: `Sun in ${rashi.nameIAST}: ego + identity shaped by ${element}-${modality} energy. The ${flavour} nature filters the soul's radiance through ${rashi.nameIAST}'s lens — ${rashi.lord}-ruled context.`,
    Moon: `Moon in ${rashi.nameIAST}: emotions + mind filtered through ${element}-${modality} nature. The ${flavour} quality colours the emotional response pattern. ${rashi.lord}-ruled environment shapes instinctive reactions.`,
    Mars: `Mars in ${rashi.nameIAST}: drive + courage expressed through ${element}-${modality} energy. The ${flavour} context channels Mars's fire into ${rashi.nameIAST}'s terrain — ${rashi.lord}-ruled.`,
    Mercury: `Mercury in ${rashi.nameIAST}: intellect + communication adapted to ${element}-${modality} nature. The ${flavour} quality shapes analytical and communicative patterns. ${rashi.lord}-ruled reasoning.`,
    Jupiter: `Jupiter in ${rashi.nameIAST}: wisdom + expansion grounded in ${element}-${modality} energy. The ${flavour} nature shapes dharmic orientation and growth patterns. ${rashi.lord}-ruled context.`,
    Venus: `Venus in ${rashi.nameIAST}: beauty + pleasure expressed through ${element}-${modality} nature. The ${flavour} quality colours aesthetic sensibility and relational patterns. ${rashi.lord}-ruled.`,
    Saturn: `Saturn in ${rashi.nameIAST}: discipline + structure applied through ${element}-${modality} energy. The ${flavour} nature shapes duty orientation and perseverance patterns. ${rashi.lord}-ruled.`,
  };
  return interpretations[graha] ?? `${graha} in ${rashi.nameIAST}: expressed through ${element}-${modality} nature with ${flavour} colouring.`;
}

/* ─── Quiz generator ─── */
function generateQuiz(rashi: RashiData) {
  const allLords = Array.from(new Set(RASHIS.map((r) => r.lord)));
  const allElements = ["Fire", "Earth", "Air", "Water"];
  const allModalities = ["Chara", "Sthira", "Dvi-svabhāva"];
  const dignities = getDignitiesForRashi(rashi.number);
  const exalted = dignities.find((d) => d.type === "Exalted");
  const debilitated = dignities.find((d) => d.type === "Debilitated");
  const opposite = OPPOSITE_PAIRS.find((p) => p.rashiA === rashi.number || p.rashiB === rashi.number);
  const oppositeRashi = opposite ? RASHIS[(opposite.rashiA === rashi.number ? opposite.rashiB : opposite.rashiA) - 1] : null;
  const shuffle = <T,>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5);

  const q1 = { question: `Who is the lord of ${rashi.nameIAST}?`, answer: rashi.lord, options: shuffle([rashi.lord, ...allLords.filter((l) => l !== rashi.lord).slice(0, 3)]) };
  const q2 = { question: `What is the element of ${rashi.nameIAST}?`, answer: rashi.element, options: shuffle(allElements) };
  const q3 = { question: `What is the modality of ${rashi.nameIAST}?`, answer: rashi.modality, options: shuffle(allModalities) };
  const q4 = {
    question: oppositeRashi ? `Which rāśi is opposite (180°) to ${rashi.nameIAST}?` : `What is the body-part associated with ${rashi.nameIAST}?`,
    answer: oppositeRashi ? oppositeRashi.nameIAST : rashi.bodyPart,
    options: oppositeRashi
      ? shuffle([oppositeRashi.nameIAST, ...RASHIS.filter((r) => r.number !== rashi.number && r.number !== oppositeRashi.number).slice(0, 3).map((r) => r.nameIAST)])
      : shuffle([rashi.bodyPart, "Head", "Heart", "Feet"]),
  };
  const q5 = exalted
    ? { question: `Which graha is exalted in ${rashi.nameIAST}?`, answer: exalted.graha, options: shuffle([exalted.graha, ...allLords.filter((l) => l !== exalted.graha).slice(0, 3)]) }
    : {
        question: debilitated ? `Which graha is debilitated in ${rashi.nameIAST}?` : `Which graha has mūla-trikoṇa in ${rashi.nameIAST}?`,
        answer: debilitated ? debilitated.graha : (dignities.find((d) => d.type === "Mūla-trikoṇa")?.graha ?? rashi.lord),
        options: shuffle([debilitated ? debilitated.graha : (dignities.find((d) => d.type === "Mūla-trikoṇa")?.graha ?? rashi.lord), ...allLords.filter((l) => l !== (debilitated ? debilitated.graha : (dignities.find((d) => d.type === "Mūla-trikoṇa")?.graha ?? rashi.lord))).slice(0, 3)]),
      };
  return shuffle([q1, q2, q3, q4, q5]);
}

/* ─── Attribute Constellation Mandala (SVG) ─── */
const ATTRIBUTE_NODES = [
  { key: "lord",      label: "Lord",        angle: 0,   icon: "♀" },
  { key: "element",   label: "Element",     angle: 45,  icon: "🜃" },
  { key: "modality",  label: "Modality",    angle: 90,  icon: "⬟" },
  { key: "gender",    label: "Gender",      angle: 135, icon: "⚢" },
  { key: "bodyPart",  label: "Body-part",   angle: 180, icon: "🦴" },
  { key: "direction", label: "Direction",   angle: 225, icon: "🧭" },
  { key: "dignities", label: "Dignities",   angle: 270, icon: "👑" },
  { key: "flavour",   label: "Flavour",     angle: 315, icon: "✦" },
];

/* Connection pairs for doctrinal relationships */
const DOCTRINAL_CONNECTIONS: Record<string, string[]> = {
  lord:      ["element", "dignities", "flavour"],
  element:   ["lord", "modality", "flavour"],
  modality:  ["element", "gender", "flavour"],
  gender:    ["modality", "direction"],
  bodyPart:  ["direction", "flavour"],
  direction: ["bodyPart", "gender"],
  dignities: ["lord", "flavour"],
  flavour:   ["lord", "element", "modality", "dignities", "bodyPart"],
};

function getAttributeValue(rashi: RashiData, key: string): string {
  switch (key) {
    case "lord":      return `${rashi.lord} (${GRAHA_SYMBOLS[rashi.lord] ?? "○"})`;
    case "element":   return rashi.element;
    case "modality":  return rashi.modality;
    case "gender":    return rashi.gender;
    case "bodyPart":  return rashi.bodyPart;
    case "direction": return rashi.direction;
    case "dignities": {
      const d = getDignitiesForRashi(rashi.number);
      if (d.length === 0) return "No classical dignities";
      return d.map((di) => `${di.badge}${di.graha} ${di.type}`).join(", ");
    }
    case "flavour":   return rashi.keywords;
    default: return "";
  }
}

function getAttributeDoctrinalNote(rashi: RashiData, key: string): string {
  const element = rashi.element;
  const modality = rashi.modality;
  switch (key) {
    case "lord":      return `${rashi.lord} governs ${rashi.nameIAST}. The lord defines the rāśi's managerial principle — how its significations are administered and expressed.`;
    case "element":   return `${element} element: ${element === "Fire" ? "initiating, transforming, light-radiating" : element === "Earth" ? "material, stable, tangible, accumulating" : element === "Air" ? "intellectual, relational, mobile" : "emotional, intuitive, flowing"}. This is the fundamental substance of ${rashi.nameIAST}'s nature.`;
    case "modality":  return `${modality} modality: ${modality === "Chara" ? "cardinal — initiating, action-oriented, starting new cycles" : modality === "Sthira" ? "fixed — persistent, consolidating, holding what has been initiated" : "mutable — adapting, distributing, transitioning between states"}. This shapes how ${rashi.nameIAST} engages with change.`;
    case "gender":    return `${rashi.gender} gender: ${rashi.gender === "Masculine" ? "active, projective, outward-facing — odd-numbered rāśis" : "receptive, absorptive, inward-facing — even-numbered rāśis"}. Rāśi #${rashi.number} is ${rashi.gender.toLowerCase()}.`;
    case "bodyPart":  return `Kālapuruṣa mapping: ${rashi.bodyPart}. Planets in ${rashi.nameIAST} influence this body region. Benefics enhance; malefics may create health vulnerabilities here.`;
    case "direction": return `${rashi.direction} direction: ${rashi.nameIAST} is associated with the ${rashi.direction.toLowerCase()} cardinal direction, relevant in Vāstu and directional-strength (dig-bala) calculations.`;
    case "dignities": {
      const d = getDignitiesForRashi(rashi.number);
      if (d.length === 0) return `No classical exaltation or debilitation in ${rashi.nameIAST}. Only the lord's own-sign status applies.`;
      return d.map((di) => `${di.graha} ${di.type}${di.degree !== undefined ? ` at ${di.degree}°` : di.degreeStart !== undefined ? ` ${di.degreeStart}°–${di.degreeEnd}°` : ""}`).join("; ") + `. These dignity placements define how strongly each graha can express itself here.`;
    }
    case "flavour":   return `The interpretive flavour is the synthesis of all other attributes: lord + element + modality + gender → "${rashi.keywords}". This flavour colours every planet placed in ${rashi.nameIAST}.`;
    default: return "";
  }
}

function AttributeConstellationMandala({
  rashi,
  activeNode,
  onNodeClick,
  focusedNode,
  setFocusedNode,
}: {
  rashi: RashiData;
  activeNode: string | null;
  onNodeClick: (key: string | null) => void;
  focusedNode: string | null;
  setFocusedNode: (key: string | null) => void;
}) {
  const cx = 200;
  const cy = 200;
  const outerR = 155;
  const innerR = 48;

  const connections = activeNode ? (DOCTRINAL_CONNECTIONS[activeNode] ?? []) : [];

  return (
    <svg viewBox="0 0 400 400" className="w-full" style={{ maxWidth: 400 }} role="img" aria-label={`Attribute Constellation Mandala for ${rashi.nameIAST}`}>
      <defs>
        {/* Radial gradient for center hub */}
        <radialGradient id="mandalaHub" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF9F0" />
          <stop offset="55%" stopColor="#F2E6D0" />
          <stop offset="100%" stopColor="#E7D6B8" />
        </radialGradient>
        {/* Glow filter for active nodes */}
        <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Subtle ring pattern */}
        <radialGradient id="ringGrad" cx="50%" cy="50%" r="50%">
          <stop offset="70%" stopColor="transparent" />
          <stop offset="85%" stopColor={`${rashi.color}08`} />
          <stop offset="100%" stopColor={`${rashi.color}15`} />
        </radialGradient>
      </defs>

      {/* Outer decorative rings */}
      <circle cx={cx} cy={cy} r={outerR + 20} fill="none" stroke="var(--gl-gold-accent)" strokeOpacity={0.08} strokeWidth={0.5} />
      <circle cx={cx} cy={cy} r={outerR + 10} fill="none" stroke="var(--gl-gold-accent)" strokeOpacity={0.12} strokeWidth={0.5} strokeDasharray="2 6" />
      <circle cx={cx} cy={cy} r={outerR} fill="url(#ringGrad)" stroke="var(--gl-gold-accent)" strokeOpacity={0.18} strokeWidth={1} />

      {/* Spoke lines from center to each node */}
      {ATTRIBUTE_NODES.map((node) => {
        const pos = polarToCartesian(cx, cy, outerR - 10, node.angle);
        const isActive = activeNode === node.key;
        const isConnected = connections.includes(node.key);
        return (
          <line
            key={`spoke-${node.key}`}
            x1={cx} y1={cy}
            x2={pos.x} y2={pos.y}
            stroke={isActive ? rashi.color : isConnected ? `${rashi.color}` : "var(--gl-gold-accent)"}
            strokeOpacity={isActive ? 0.6 : isConnected ? 0.35 : 0.1}
            strokeWidth={isActive ? 2 : isConnected ? 1.5 : 0.5}
            strokeDasharray={isActive || isConnected ? "none" : "3 5"}
          />
        );
      })}

      {/* Connection arcs between active node and its doctrinal connections */}
      {activeNode && connections.map((connKey) => {
        const fromNode = ATTRIBUTE_NODES.find((n) => n.key === activeNode)!;
        const toNode = ATTRIBUTE_NODES.find((n) => n.key === connKey)!;
        const fromPos = polarToCartesian(cx, cy, outerR - 30, fromNode.angle);
        const toPos = polarToCartesian(cx, cy, outerR - 30, toNode.angle);
        // Curved connection arc via a control point offset from center
        const midX = (fromPos.x + toPos.x) / 2;
        const midY = (fromPos.y + toPos.y) / 2;
        const dx = midX - cx;
        const dy = midY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const controlX = cx + (dx / dist) * (outerR * 0.45);
        const controlY = cy + (dy / dist) * (outerR * 0.45);
        return (
          <motion.path
            key={`arc-${activeNode}-${connKey}`}
            d={`M ${fromPos.x} ${fromPos.y} Q ${controlX} ${controlY} ${toPos.x} ${toPos.y}`}
            fill="none"
            stroke={rashi.color}
            strokeWidth={1.5}
            strokeOpacity={0.5}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        );
      })}

      {/* Inner hub gradient circle */}
      <circle cx={cx} cy={cy} r={innerR} fill="url(#mandalaHub)" stroke={rashi.color} strokeOpacity={0.35} strokeWidth={1.5} />

      {/* Center: Rāśi name Devanāgarī */}
      <text x={cx} y={cy - 14} textAnchor="middle" dominantBaseline="middle" fill={rashi.color} fontSize={22} fontFamily="var(--font-devanagari)" fontWeight={700}>
        {rashi.nameDevanagari}
      </text>
      {/* Center: IAST name */}
      <text x={cx} y={cy + 6} textAnchor="middle" dominantBaseline="middle" fill="var(--gl-gold-accent)" fontSize={13} fontFamily="var(--font-cormorant)" fontWeight={600}>
        {rashi.nameIAST}
      </text>
      {/* Center: English name */}
      <text x={cx} y={cy + 22} textAnchor="middle" dominantBaseline="middle" fill="var(--gl-ink-primary)" fontSize={11} fontWeight={600}>
        {rashi.nameEnglish} · #{rashi.number}
      </text>

      {/* 8 Attribute nodes around the mandala */}
      {ATTRIBUTE_NODES.map((node) => {
        const pos = polarToCartesian(cx, cy, outerR - 10, node.angle);
        const isActive = activeNode === node.key;
        const isFocused = focusedNode === node.key;
        const isConnected = connections.includes(node.key);
        const nodeR = isActive ? 32 : isConnected ? 28 : 26;
        const labelPos = polarToCartesian(cx, cy, outerR + 22, node.angle);

        return (
          <g
            key={node.key}
            role="button"
            tabIndex={0}
            aria-pressed={isActive}
            aria-label={`Attribute node: ${node.label}, value: ${getAttributeValue(rashi, node.key)}`}
            style={{ cursor: "pointer", outline: "none" }}
            onClick={() => onNodeClick(isActive ? null : node.key)}
            onFocus={() => setFocusedNode(node.key)}
            onBlur={() => setFocusedNode(null)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onNodeClick(isActive ? null : node.key);
                e.preventDefault();
              }
            }}
          >
            {/* Node glow for active or focused */}
            {(isActive || isFocused) && (
              <circle cx={pos.x} cy={pos.y} r={nodeR + 6} fill={`${rashi.color}15`} filter="url(#nodeGlow)" />
            )}
            {/* Focus ring outline */}
            {isFocused && (
              <circle cx={pos.x} cy={pos.y} r={nodeR + 4} fill="none" stroke="var(--gl-gold-accent)" strokeWidth={1.5} strokeDasharray="3 3" />
            )}
            {/* Node background */}
            <circle
              cx={pos.x} cy={pos.y} r={nodeR}
              fill={isActive ? `${rashi.color}30` : isConnected ? `${rashi.color}18` : "#FFF9F010"}
              stroke={isActive ? rashi.color : isConnected ? `${rashi.color}80` : "var(--gl-gold-accent)"}
              strokeOpacity={isActive ? 0.9 : isConnected ? 0.6 : 0.25}
              strokeWidth={isActive ? 2 : 1}
              style={{ transition: "all 0.3s ease" }}
            />
            {/* Node icon */}
            <text x={pos.x} y={pos.y - 3} textAnchor="middle" dominantBaseline="middle" fontSize={isActive ? 14 : 12} fill="var(--gl-ink-primary)" style={{ pointerEvents: "none" }}>
              {node.icon}
            </text>
            {/* Node label */}
            <text x={pos.x} y={pos.y + 12} textAnchor="middle" dominantBaseline="middle"
              fill={isActive ? rashi.color : isConnected ? rashi.color : "var(--gl-ink-primary)"}
              fontSize={isActive ? 11 : 10} fontWeight={isActive ? 700 : 600}
              style={{ pointerEvents: "none" }}
            >
              {node.label}
            </text>
            {/* Outer label with value */}
            {isActive && (
              <text x={labelPos.x} y={labelPos.y} textAnchor="middle" dominantBaseline="middle"
                fill="var(--gl-ink-primary)" fontSize={11} fontWeight={600}
                style={{ pointerEvents: "none" }}
              >
                {getAttributeValue(rashi, node.key).length > 28
                  ? getAttributeValue(rashi, node.key).substring(0, 26) + "…"
                  : getAttributeValue(rashi, node.key)}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ─── Dignity Landscape Ring ─── */
function DignityLandscapeRing({ rashi }: { rashi: RashiData }) {
  const dignities = getDignitiesForRashi(rashi.number);
  const redirect = Object.values(MULA_TRIKONA_REDIRECTS).find((r) => r.fromRashi === rashi.number);

  const width = 420;
  const height = 120;
  const arcY = 60;
  const arcLeft = 40;
  const arcRight = width - 40;
  const arcWidth = arcRight - arcLeft;

  return (
    <div className="space-y-3">
      <div className="text-lg font-semibold" style={{ fontFamily: "var(--font-cormorant)", color: "var(--gl-gold-accent)" }}>
        Dignity Landscape — {rashi.startDegree}° to {rashi.endDegree}° Sidereal
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ maxWidth: width }} role="img" aria-label={`Dignity Landscape for ${rashi.nameIAST} spanning from ${rashi.startDegree} to ${rashi.endDegree} degrees`}>
        <defs>
          <linearGradient id="dignityArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={`${rashi.color}25`} />
            <stop offset="50%" stopColor={`${rashi.color}40`} />
            <stop offset="100%" stopColor={`${rashi.color}25`} />
          </linearGradient>
        </defs>

        {/* Background arc representing 30° span */}
        <rect x={arcLeft} y={arcY - 18} width={arcWidth} height={36} rx={8} fill="url(#dignityArcGrad)" stroke={rashi.color} strokeOpacity={0.3} strokeWidth={1} />

        {/* Degree markers every 5° */}
        {Array.from({ length: 7 }, (_, i) => {
          const deg = i * 5;
          const x = arcLeft + (deg / 30) * arcWidth;
          return (
            <g key={deg}>
              <line x1={x} y1={arcY - 18} x2={x} y2={arcY + 18} stroke="var(--gl-gold-accent)" strokeOpacity={0.15} strokeWidth={0.5} />
              <text x={x} y={arcY + 32} textAnchor="middle" fill="var(--gl-ink-secondary)" fontSize={10} fontWeight={500}>
                {rashi.startDegree + deg}°
              </text>
            </g>
          );
        })}

        {/* Start and end labels */}
        <text x={arcLeft} y={arcY - 26} textAnchor="middle" fill="var(--gl-ink-secondary)" fontSize={10} fontWeight={600}>
          {rashi.startDegree}°
        </text>
        <text x={arcRight} y={arcY - 26} textAnchor="middle" fill="var(--gl-ink-secondary)" fontSize={10} fontWeight={600}>
          {rashi.endDegree}°
        </text>

        {/* Dignity markers */}
        {dignities.map((d, i) => {
          const dc = DIGNITY_COLORS[d.type];
          if (d.degree !== undefined) {
            // Point dignity (exalted/debilitated)
            const x = arcLeft + (d.degree / 30) * arcWidth;
            return (
              <g key={i}>
                {/* Glow */}
                <circle cx={x} cy={arcY} r={12} fill={`${dc.text}20`} />
                {/* Marker */}
                <circle cx={x} cy={arcY} r={7} fill={dc.bg} stroke={dc.text} strokeWidth={2} />
                <text x={x} y={arcY + 1} textAnchor="middle" dominantBaseline="middle" fontSize={10} fontWeight={700} fill="var(--gl-ink-primary)">
                  {d.badge}
                </text>
                {/* Label */}
                <text x={x} y={arcY - 28} textAnchor="middle" fill={dc.text} fontSize={10} fontWeight={700}>
                  {d.graha} {d.type}
                </text>
                <text x={x} y={arcY - 16} textAnchor="middle" fill={dc.text} fontSize={10} fontWeight={600}>
                  {d.degree}°
                </text>
              </g>
            );
          }
          if (d.degreeStart !== undefined && d.degreeEnd !== undefined) {
            // Range dignity (mūla-trikoṇa)
            const x1 = arcLeft + (d.degreeStart / 30) * arcWidth;
            const x2 = arcLeft + (d.degreeEnd / 30) * arcWidth;
            return (
              <g key={i}>
                <rect x={x1} y={arcY - 14} width={x2 - x1} height={28} rx={4} fill={`${dc.text}15`} stroke={dc.text} strokeOpacity={0.4} strokeWidth={1} strokeDasharray="3 3" />
                <text x={(x1 + x2) / 2} y={arcY + 1} textAnchor="middle" dominantBaseline="middle" fill={dc.text} fontSize={10} fontWeight={700}>
                  {d.badge} {d.graha} {d.type}
                </text>
              </g>
            );
          }
          // Own-sign — spans full arc
          return (
            <g key={i}>
              <rect x={arcLeft + 2} y={arcY + 10} width={arcWidth - 4} height={5} rx={2} fill={`${dc.text}30`} />
              <text x={arcLeft + arcWidth / 2} y={arcY + 52} textAnchor="middle" fill={dc.text} fontSize={10} fontWeight={600}>
                {d.badge} {d.graha} — {d.type} (entire rāśi)
              </text>
            </g>
          );
        })}
      </svg>

      {/* Mūla-trikoṇa redirect */}
      {redirect && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-3 rounded-xl flex items-center gap-3"
          style={{ background: "#A23A1E08", border: "1px dashed #A23A1E35" }}
        >
          <span className="text-xl">→</span>
          <div>
            <div className="text-xs font-semibold" style={{ color: "#A23A1E" }}>Mūla-trikoṇa Redirect</div>
            <div className="text-xs" style={{ color: "var(--gl-ink-secondary)" }}>{redirect.reason}</div>
          </div>
        </motion.div>
      )}

      {/* Dignity legend */}
      <div className="flex gap-2 flex-wrap">
        {dignities.map((d, i) => {
          const dc = DIGNITY_COLORS[d.type];
          return (
            <span key={i} className="px-2.5 py-1 rounded-lg text-sm font-semibold flex items-center gap-1" style={{ background: dc.bg, color: dc.text, border: `1px solid ${dc.border}` }}>
              {d.badge} {d.graha} {d.degree !== undefined ? `${d.degree}°` : d.degreeStart !== undefined ? `${d.degreeStart}°–${d.degreeEnd}°` : ""}
              <span style={{ opacity: 0.8 }}>{d.type}</span>
            </span>
          );
        })}
        {dignities.length === 0 && (
          <span className="text-sm px-2.5 py-1 rounded-lg" style={{ background: "var(--gl-surface-manuscript)", color: "var(--gl-ink-secondary)", fontWeight: 500 }}>
            No classical exaltation / debilitation in this rāśi
          </span>
        )}
      </div>
    </div>
  );
}

/* ─── Graha Expression Simulator ─── */
const CLASSICAL_GRAHAS = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

function GrahaExpressionSimulator({ rashi }: { rashi: RashiData }) {
  const shouldReduceMotion = useReducedMotion();
  const [selectedGraha, setSelectedGraha] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold" style={{ fontFamily: "var(--font-cormorant)", color: "var(--gl-gold-accent)" }}>
        Graha Expression in <IAST>{rashi.nameIAST}</IAST>
      </div>
      <div className="text-sm" style={{ color: "var(--gl-ink-primary)", fontWeight: 500 }}>
        Click a graha to see how {rashi.nameIAST}&apos;s {rashi.element}-{rashi.modality} nature shapes its expression.
      </div>

      {/* Graha buttons arranged as orbital ring */}
      <div className="flex gap-2 flex-wrap justify-center">
        {CLASSICAL_GRAHAS.map((g) => {
          const isActive = selectedGraha === g;
          const color = GRAHA_COLORS[g] ?? "#888";
          const dignities = getDignitiesForRashi(rashi.number);
          const dignity = dignities.find((d) => d.graha === g);
          return (
            <motion.button
              key={g}
              onClick={() => setSelectedGraha(isActive ? null : g)}
              whileHover={shouldReduceMotion ? undefined : { scale: 1.08 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
              aria-pressed={isActive}
              aria-label={`Simulate ${g} in ${rashi.nameIAST}`}
              className="flex flex-col items-center gap-1 p-3 rounded-xl transition-all"
              style={{
                background: isActive ? `${color}20` : "var(--gl-surface-manuscript)",
                border: `2px solid ${isActive ? color : "var(--gl-gold-hairline)"}`,
                boxShadow: isActive ? `0 4px 20px ${color}30` : "none",
                minWidth: 64,
              }}
            >
              <span className="text-xl" style={{ color }}>{GRAHA_SYMBOLS[g] ?? "○"}</span>
              <span className="text-sm font-semibold" style={{ color: isActive ? color : "var(--gl-ink-primary)" }}>{g}</span>
              {dignity && (
                <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: DIGNITY_COLORS[dignity.type].bg, color: DIGNITY_COLORS[dignity.type].text, fontSize: 9, fontWeight: 700 }}>
                  {dignity.type}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Interpretation panel */}
      <AnimatePresence mode="wait">
        {selectedGraha && (
          <motion.div
            key={selectedGraha}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="p-4 rounded-xl"
            style={{
              background: `${GRAHA_COLORS[selectedGraha] ?? "#888"}08`,
              border: `1px solid ${GRAHA_COLORS[selectedGraha] ?? "#888"}30`,
              boxShadow: `0 4px 20px ${GRAHA_COLORS[selectedGraha] ?? "#888"}10`,
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl" style={{ color: GRAHA_COLORS[selectedGraha] }}>{GRAHA_SYMBOLS[selectedGraha]}</span>
              <div>
                <div className="text-base font-semibold" style={{ fontFamily: "var(--font-cormorant)", color: GRAHA_COLORS[selectedGraha] }}>
                  {selectedGraha} in <IAST>{rashi.nameIAST}</IAST>
                </div>
                <div className="text-xs" style={{ color: "var(--gl-ink-muted)" }}>
                  {rashi.element} · {rashi.modality} · {rashi.lord}-ruled
                </div>
              </div>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--gl-ink-secondary)" }}>
              {getGrahaInterpretation(selectedGraha, rashi)}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {!selectedGraha && (
        <div className="p-4 rounded-xl text-center" style={{ background: "var(--gl-surface-twilight-glass)", border: "1px dashed var(--gl-gold-hairline)" }}>
          <div className="text-sm" style={{ color: "var(--gl-ink-muted)" }}>
            ↑ Click a graha above to explore its expression in <IAST>{rashi.nameIAST}</IAST>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Mirror Comparison ─── */
function MirrorComparison({ rashi }: { rashi: RashiData }) {
  const oppositePair = OPPOSITE_PAIRS.find((p) => p.rashiA === rashi.number || p.rashiB === rashi.number);
  const oppositeRashi = oppositePair ? RASHIS[(oppositePair.rashiA === rashi.number ? oppositePair.rashiB : oppositePair.rashiA) - 1] : null;

  if (!oppositeRashi || !oppositePair) {
    return (
      <div className="p-4 rounded-xl text-center" style={{ background: "var(--gl-surface-twilight-glass)", border: "1px solid var(--gl-gold-hairline)" }}>
        <div className="text-sm" style={{ color: "var(--gl-ink-muted)" }}>No opposite rāśi data available.</div>
      </div>
    );
  }

  const compareAttrs = [
    { label: "Lord", a: rashi.lord, b: oppositeRashi.lord },
    { label: "Element", a: rashi.element, b: oppositeRashi.element },
    { label: "Modality", a: rashi.modality, b: oppositeRashi.modality },
    { label: "Gender", a: rashi.gender, b: oppositeRashi.gender },
    { label: "Body-part", a: rashi.bodyPart, b: oppositeRashi.bodyPart },
    { label: "Direction", a: rashi.direction, b: oppositeRashi.direction },
  ];

  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold" style={{ fontFamily: "var(--font-cormorant)", color: "var(--gl-gold-accent)" }}>
        180° Mirror: <IAST>{rashi.nameIAST}</IAST> ↔ <IAST>{oppositeRashi.nameIAST}</IAST>
      </div>

      {/* Axis info */}
      <div className="p-3 rounded-xl" style={{ background: "#C9A24D0C", border: "1px solid #C9A24D25" }}>
        <div className="text-sm font-bold" style={{ color: "var(--gl-gold-accent)" }}>
          {oppositePair.axis} Axis
        </div>
        <div className="text-sm mt-1 leading-relaxed" style={{ color: "var(--gl-ink-primary)", fontWeight: 500 }}>
          {oppositePair.significance}
        </div>
      </div>

      {/* Visual comparison SVG */}
      <svg viewBox="0 0 400 140" className="w-full" style={{ maxWidth: 400 }} role="img" aria-label={`180 degree axis mirror comparison between ${rashi.nameIAST} and ${oppositeRashi.nameIAST}`}>
        <defs>
          <radialGradient id="rashiAGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={`${rashi.color}30`} />
            <stop offset="100%" stopColor={`${rashi.color}08`} />
          </radialGradient>
          <radialGradient id="rashiBGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={`${oppositeRashi.color}30`} />
            <stop offset="100%" stopColor={`${oppositeRashi.color}08`} />
          </radialGradient>
        </defs>

        {/* Connecting line */}
        <line x1={120} y1={70} x2={280} y2={70} stroke="var(--gl-gold-accent)" strokeOpacity={0.3} strokeWidth={1} strokeDasharray="4 4" />
        <text x={200} y={48} textAnchor="middle" fill="var(--gl-gold-accent)" fontSize={12} fontWeight={700}>180°</text>
        <text x={200} y={62} textAnchor="middle" fill="var(--gl-ink-secondary)" fontSize={10} fontWeight={600}>{oppositePair.axis}</text>

        {/* Rāśi A */}
        <circle cx={80} cy={70} r={42} fill="url(#rashiAGrad)" stroke={rashi.color} strokeOpacity={0.4} strokeWidth={1.5} />
        <text x={80} y={60} textAnchor="middle" dominantBaseline="middle" fill={rashi.color} fontSize={18} fontFamily="var(--font-devanagari)" fontWeight={700}>
          {rashi.nameDevanagari}
        </text>
        <text x={80} y={82} textAnchor="middle" fill="var(--gl-ink-primary)" fontSize={11} fontWeight={700}>
          {rashi.nameIAST}
        </text>
        <text x={80} y={96} textAnchor="middle" fill="var(--gl-ink-secondary)" fontSize={10} fontWeight={600}>
          #{rashi.number} · {rashi.element} · {rashi.modality}
        </text>

        {/* Rāśi B */}
        <circle cx={320} cy={70} r={42} fill="url(#rashiBGrad)" stroke={oppositeRashi.color} strokeOpacity={0.4} strokeWidth={1.5} />
        <text x={320} y={60} textAnchor="middle" dominantBaseline="middle" fill={oppositeRashi.color} fontSize={18} fontFamily="var(--font-devanagari)" fontWeight={700}>
          {oppositeRashi.nameDevanagari}
        </text>
        <text x={320} y={82} textAnchor="middle" fill="var(--gl-ink-primary)" fontSize={11} fontWeight={700}>
          {oppositeRashi.nameIAST}
        </text>
        <text x={320} y={96} textAnchor="middle" fill="var(--gl-ink-secondary)" fontSize={10} fontWeight={600}>
          #{oppositeRashi.number} · {oppositeRashi.element} · {oppositeRashi.modality}
        </text>
      </svg>

      {/* Attribute comparison table */}
      <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid var(--gl-gold-hairline)" }}>
        <table className="w-full text-sm" style={{ borderCollapse: "collapse" }} aria-label={`Comparison table between ${rashi.nameIAST} and ${oppositeRashi.nameIAST}`}>
          <thead>
            <tr>
              <th className="text-left p-2.5 text-sm" style={{ color: "var(--gl-ink-secondary)", borderBottom: "1px solid var(--gl-gold-hairline)", background: "var(--gl-surface-manuscript)", fontWeight: 700 }}>Attribute</th>
              <th className="text-left p-2.5 text-sm" style={{ color: rashi.color, borderBottom: `2px solid ${rashi.color}40`, background: "var(--gl-surface-manuscript)", fontWeight: 700 }}>{rashi.nameDevanagari} {rashi.nameIAST}</th>
              <th className="text-left p-2.5 text-sm" style={{ color: oppositeRashi.color, borderBottom: `2px solid ${oppositeRashi.color}40`, background: "var(--gl-surface-manuscript)", fontWeight: 700 }}>{oppositeRashi.nameDevanagari} {oppositeRashi.nameIAST}</th>
            </tr>
          </thead>
          <tbody>
            {compareAttrs.map((row) => {
              const same = row.a === row.b;
              return (
                <tr key={row.label}>
                  <td className="p-2.5 text-sm font-bold" style={{ color: "var(--gl-ink-secondary)", borderBottom: "1px solid var(--gl-gold-hairline)" }}>{row.label}</td>
                  <td className="p-2.5 text-sm" style={{ color: "var(--gl-ink-primary)", borderBottom: "1px solid var(--gl-gold-hairline)", background: same ? "#C9A24D08" : "transparent", fontWeight: 500 }}>
                    {row.a} {same && <span style={{ color: "#C9A24D" }}>✓</span>}
                  </td>
                  <td className="p-2.5 text-sm" style={{ color: "var(--gl-ink-primary)", borderBottom: "1px solid var(--gl-gold-hairline)", background: same ? "#C9A24D08" : "#A23A1E08", fontWeight: 500 }}>
                    {row.b} {same ? <span style={{ color: "#C9A24D" }}>✓</span> : <span style={{ color: "#A23A1E" }}>✕</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Comparative insight */}
      <div className="text-xs p-3 rounded-xl" style={{ background: "var(--gl-surface-twilight-glass)", border: "1px solid var(--gl-gold-hairline)", color: "var(--gl-ink-secondary)" }}>
        <strong style={{ color: "var(--gl-gold-accent)" }}>Comparative insight: </strong>
        {rashi.lord === oppositeRashi.lord
          ? `Both rāśis share the same lord (${rashi.lord}) — paired rulership with pair-sum ${rashi.number}+${oppositeRashi.number}=9. `
          : `Different lords (${rashi.lord} vs ${oppositeRashi.lord}) — each administers its rāśi differently. `}
        {rashi.element === oppositeRashi.element
          ? `Both share ${rashi.element} element — elemental kin, not opponents. `
          : `${rashi.nameIAST} is ${rashi.element}; ${oppositeRashi.nameIAST} is ${oppositeRashi.element} — elemental complementarity across the axis. `}
        {rashi.modality === oppositeRashi.modality
          ? `Both are ${rashi.modality} — same behavioural pattern.`
          : `${rashi.nameIAST} is ${rashi.modality}; ${oppositeRashi.nameIAST} is ${oppositeRashi.modality} — modality contrast creates dynamic tension.`}
      </div>
    </div>
  );
}

/* ─── Enhanced Quiz ─── */
function EnhancedQuiz({ 
  rashi,
  quizScore,
  setQuizScore
}: { 
  rashi: RashiData;
  quizScore: { correct: number; total: number };
  setQuizScore: React.Dispatch<React.SetStateAction<{ correct: number; total: number }>>;
}) {
  const shouldReduceMotion = useReducedMotion();
  const quiz = useMemo(() => generateQuiz(rashi), [rashi]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);

  const currentQ = quiz[quizIndex];

  const handleGuess = useCallback((opt: string) => {
    if (quizAnswer) return;
    setQuizAnswer(opt);
    setQuizScore((s) => ({ correct: s.correct + (opt === currentQ.answer ? 1 : 0), total: s.total + 1 }));
  }, [quizAnswer, currentQ, setQuizScore]);

  const nextQ = useCallback(() => {
    setQuizAnswer(null);
    setQuizIndex((i) => (i + 1) % quiz.length);
  }, [quiz.length]);

  if (!currentQ) return null;

  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold" style={{ fontFamily: "var(--font-cormorant)", color: "var(--gl-gold-accent)" }}>
        Test Your Knowledge — <IAST>{rashi.nameIAST}</IAST>
      </div>

      <div className="p-5 rounded-xl" style={{ background: "var(--gl-surface-twilight-glass)", border: "1px solid var(--gl-gold-hairline)", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
        {/* Progress */}
        <div className="flex justify-between text-sm mb-4" style={{ color: "var(--gl-ink-secondary)" }}>
          <span>Question {quizIndex + 1} / {quiz.length}</span>
          <span>Score: <strong style={{ color: "var(--gl-gold-accent)" }}>{quizScore.correct}/{quizScore.total}</strong></span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 rounded-full mb-4" style={{ background: "var(--gl-surface-manuscript)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: "var(--gl-gold-accent)" }}
            initial={{ width: 0 }}
            animate={{ width: `${((quizIndex + 1) / quiz.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Question */}
        <div className="text-base font-medium mb-4" style={{ color: "var(--gl-ink-primary)", fontFamily: "var(--font-cormorant)" }}>
          {currentQ.question}
        </div>

        {/* Answer cards */}
        <div className="grid grid-cols-2 gap-3">
          {currentQ.options.map((opt) => {
            const answered = quizAnswer !== null;
            const correct = opt === currentQ.answer;
            const isMyAnswer = quizAnswer === opt;
            return (
              <motion.button
                key={opt}
                onClick={() => handleGuess(opt)}
                disabled={answered}
                whileHover={!answered && !shouldReduceMotion ? { scale: 1.03 } : {}}
                whileTap={!answered && !shouldReduceMotion ? { scale: 0.97 } : {}}
                className="p-3.5 rounded-xl text-sm text-left transition-all"
                style={{
                  background: answered && correct ? "#6B8E6B15" : answered && isMyAnswer ? "#A23A1E15" : "var(--gl-surface-manuscript)",
                  border: `2px solid ${answered && correct ? "#6B8E6B" : answered && isMyAnswer ? "#A23A1E" : "var(--gl-gold-hairline)"}`,
                  color: answered && correct ? "#6B8E6B" : answered && isMyAnswer ? "#A23A1E" : "var(--gl-ink-primary)",
                  boxShadow: answered && correct ? "0 4px 16px #6B8E6B20" : answered && isMyAnswer && !correct ? "0 4px 16px #A23A1E20" : "none",
                  cursor: answered ? "default" : "pointer",
                }}
              >
                <span className="font-medium">{opt}</span>
                {answered && correct && <span className="ml-2">✓</span>}
                {answered && isMyAnswer && !correct && <span className="ml-2">✕</span>}
              </motion.button>
            );
          })}
        </div>

        {/* Next button */}
        {quizAnswer && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={nextQ}
            whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
            className="mt-4 px-5 py-2.5 rounded-xl text-sm font-medium"
            style={{ background: "var(--gl-gold-accent)", color: "#1a1a2e" }}
          >
            Next Question →
          </motion.button>
        )}
      </div>
    </div>
  );
}

/* ─── Section navigation ─── */
const SECTIONS = [
  { key: "mandala",    label: "Attribute Mandala",    icon: "◎" },
  { key: "dignities",  label: "Dignity Landscape",    icon: "👑" },
  { key: "simulator",  label: "Graha Simulator",      icon: "🪐" },
  { key: "mirror",     label: "180° Mirror",          icon: "⇄" },
  { key: "quiz",       label: "Quiz",                 icon: "📝" },
] as const;

type SectionKey = typeof SECTIONS[number]["key"];

/* ═══════════════════════════════════════════════════
   Main Component — RashiProfileExplorer
   ═══════════════════════════════════════════════════ */
export function RashiProfileExplorer() {
  const shouldReduceMotion = useReducedMotion();
  const { slug } = useContext(LessonContext);
  const rashiNum = SLUG_TO_RASHI[slug] ?? 1;

  const rashi = useMemo(() => RASHIS[rashiNum - 1], [rashiNum]);

  const [activeSection, setActiveSection] = useState<SectionKey>("mandala");
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [focusedNode, setFocusedNode] = useState<string | null>(null);

  // Completion states
  const [visitedSections, setVisitedSections] = useState<string[]>(["mandala"]);
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });

  const handleSectionChange = (section: SectionKey) => {
    setActiveSection(section);
    setVisitedSections((prev) => (prev.includes(section) ? prev : [...prev, section]));
  };

  // Reset completion trackers when the active Rāśi changes
  useEffect(() => {
    setActiveNode(null);
    setVisitedSections(["mandala"]);
    setQuizScore({ correct: 0, total: 0 });
    setActiveSection("mandala");
  }, [rashiNum]);

  const ec = ELEMENT_COLORS[rashi.element];
  const isCompleted = visitedSections.length === SECTIONS.length && quizScore.correct >= 4;

  return (
    <div className="w-full space-y-5" style={{ fontFamily: "var(--font-sans)" }}>
      {/* Completion Status Panel */}
      <div 
        className="p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm transition-all"
        style={{ 
          background: isCompleted ? "rgba(107, 142, 107, 0.10)" : "var(--gl-surface-twilight-glass)", 
          border: `1px solid ${isCompleted ? "#6B8E6B" : "var(--gl-gold-hairline)"}` 
        }}
      >
        <div>
          <div className="font-semibold text-base flex items-center gap-1.5" style={{ color: isCompleted ? "#6B8E6B" : "var(--gl-gold-accent)" }}>
            {isCompleted ? "✓ Interactive Lesson Completed!" : "🎯 Interactive Lesson Objectives"}
          </div>
          <div className="mt-1" style={{ color: "var(--gl-ink-primary)", lineHeight: 1.5 }}>
            Explore all 5 sections of this Rāśi (currently {visitedSections.length}/5) and score 4/5 or higher on the quiz.
          </div>
        </div>
        <div className="flex gap-4 font-medium sm:text-right flex-shrink-0">
          <div>
            <span style={{ color: "var(--gl-ink-secondary)" }}>Sections Visited:</span>{" "}
            <span style={{ color: visitedSections.length === SECTIONS.length ? "#6B8E6B" : "var(--gl-gold-accent)", fontWeight: 600 }}>{visitedSections.length} / 5</span>
          </div>
          <div>
            <span style={{ color: "var(--gl-ink-secondary)" }}>Quiz Score:</span>{" "}
            <span style={{ color: quizScore.correct >= 4 ? "#6B8E6B" : "var(--gl-ink-primary)", fontWeight: 600 }}>{quizScore.correct} / {Math.max(5, quizScore.total)}</span>
          </div>
        </div>
      </div>

      {/* Identity Header */}
      <div className="p-5 rounded-2xl flex items-center gap-4 animate-fade-in" style={{ background: `linear-gradient(135deg, ${rashi.color}08 0%, ${rashi.color}18 100%)`, border: `2px solid ${rashi.color}35`, boxShadow: `0 6px 28px ${rashi.color}12` }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl flex-shrink-0" style={{ background: `${rashi.color}20`, color: rashi.color, fontFamily: "var(--font-devanagari)", border: `2px solid ${rashi.color}40` }}>
          {rashi.nameDevanagari}
        </div>
        <div>
          <h2 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-cormorant)", color: rashi.color }}>
            <IAST>{rashi.nameIAST}</IAST> — {rashi.nameEnglish}
          </h2>
          <p className="text-base" style={{ color: "var(--gl-ink-primary)", fontWeight: 500 }}>
            Rāśi #{rashi.number} · {rashi.startDegree}°–{rashi.endDegree}° sidereal · <span style={{ color: ec.text }}>{rashi.element}</span> · {rashi.modality}
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--gl-ink-secondary)", fontWeight: 500 }}>
            Lord: <strong style={{ color: rashi.color }}>{rashi.lord}</strong> · Gender: {rashi.gender} · Direction: {rashi.direction} · Body-part: {rashi.bodyPart}
          </p>
        </div>
      </div>

      {/* Section navigation */}
      <div role="tablist" aria-label="Rāśi Profile Explorer Sections" className="flex gap-2 flex-wrap">
        {SECTIONS.map((s) => (
          <motion.button
            key={s.key}
            id={`tab-${s.key}`}
            role="tab"
            aria-selected={activeSection === s.key}
            aria-controls={`panel-${s.key}`}
            onClick={() => handleSectionChange(s.key)}
            whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
            className="px-4 py-2.5 text-sm rounded-xl transition-all"
            style={{
              background: activeSection === s.key ? rashi.color : "var(--gl-surface-manuscript)",
              color: activeSection === s.key ? "#1a1a2e" : "var(--gl-ink-primary)",
              border: `1px solid ${activeSection === s.key ? rashi.color : "var(--gl-gold-hairline)"}`,
              boxShadow: activeSection === s.key ? `0 3px 16px ${rashi.color}35` : "0 1px 2px rgba(62, 42, 31, 0.04)",
              fontWeight: activeSection === s.key ? 700 : 500,
            }}
          >
            {s.icon} {s.label}
          </motion.button>
        ))}
      </div>

      {/* Section content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          id={`panel-${activeSection}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeSection}`}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
        >
          {/* ─── Mandala Section ─── */}
          {activeSection === "mandala" && (
            <div className="space-y-4">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Mandala SVG */}
                <div className="flex-shrink-0 mx-auto lg:mx-0" style={{ maxWidth: 400 }}>
                  <AttributeConstellationMandala 
                    rashi={rashi} 
                    activeNode={activeNode} 
                    onNodeClick={setActiveNode} 
                    focusedNode={focusedNode}
                    setFocusedNode={setFocusedNode}
                  />
                  <div className="text-sm text-center mt-2" style={{ color: "var(--gl-ink-secondary)", fontWeight: 500 }}>
                    Click or focus and press Enter on any attribute node to explore doctrinal connections
                  </div>
                </div>

                {/* Attribute detail panel */}
                <div className="flex-1 min-w-0">
                  <AnimatePresence mode="wait">
                    {activeNode ? (
                      <motion.div
                        key={activeNode}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.2 }}
                        className="p-5 rounded-xl space-y-3"
                        style={{ background: "var(--gl-surface-twilight-glass)", border: `1px solid ${rashi.color}25`, boxShadow: `0 4px 20px ${rashi.color}08` }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{ATTRIBUTE_NODES.find((n) => n.key === activeNode)?.icon}</span>
                          <h3 className="text-lg font-semibold" style={{ fontFamily: "var(--font-cormorant)", color: "var(--gl-gold-accent)" }}>
                            {ATTRIBUTE_NODES.find((n) => n.key === activeNode)?.label}
                          </h3>
                        </div>
                        <div className="text-base font-medium" style={{ color: rashi.color }}>
                          {getAttributeValue(rashi, activeNode)}
                        </div>
                        <p className="text-base leading-relaxed" style={{ color: "var(--gl-ink-primary)", fontWeight: 500 }}>
                          {getAttributeDoctrinalNote(rashi, activeNode)}
                        </p>
                        {/* Connected attributes */}
                        {DOCTRINAL_CONNECTIONS[activeNode] && (
                          <div className="pt-3" style={{ borderTop: "1px solid var(--gl-gold-hairline)" }}>
                            <div className="text-xs uppercase tracking-wide mb-2" style={{ color: "var(--gl-ink-secondary)", fontWeight: 600 }}>
                              Doctrinally connected to:
                            </div>
                            <div className="flex gap-1.5 flex-wrap">
                              {DOCTRINAL_CONNECTIONS[activeNode].map((connKey) => (
                                <motion.button
                                  key={connKey}
                                  onClick={() => setActiveNode(connKey)}
                                  whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
                                  className="px-2.5 py-1 rounded-lg text-xs"
                                  style={{ background: `${rashi.color}12`, color: rashi.color, border: `1px solid ${rashi.color}30`, cursor: "pointer" }}
                                >
                                  {ATTRIBUTE_NODES.find((n) => n.key === connKey)?.icon} {ATTRIBUTE_NODES.find((n) => n.key === connKey)?.label}
                                </motion.button>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-5 rounded-xl space-y-3"
                        style={{ background: "var(--gl-surface-twilight-glass)", border: "1px solid var(--gl-gold-hairline)" }}
                      >
                        <h3 className="text-lg font-semibold" style={{ fontFamily: "var(--font-cormorant)", color: "var(--gl-gold-accent)" }}>
                          Attribute Constellation
                        </h3>
                        <p className="text-base leading-relaxed" style={{ color: "var(--gl-ink-primary)" }}>
                          The mandala shows <strong><IAST>{rashi.nameIAST}</IAST></strong>&apos;s 8 canonical attributes radiating from its centre.
                          Click any node to see its value, doctrinal significance, and connections to other attributes.
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {ATTRIBUTE_NODES.map((n) => (
                            <motion.button
                              key={n.key}
                              onClick={() => setActiveNode(n.key)}
                              whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
                              whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                              className="p-2.5 rounded-lg text-sm text-center"
                              style={{ background: "var(--gl-surface-manuscript)", border: "1px solid var(--gl-gold-hairline)", color: "var(--gl-ink-primary)", cursor: "pointer" }}
                            >
                              <div className="text-base mb-1">{n.icon}</div>
                              <div className="font-medium">{n.label}</div>
                            </motion.button>
                          ))}
                        </div>

                        {/* Keywords */}
                        <div className="pt-3" style={{ borderTop: "1px solid var(--gl-gold-hairline)" }}>
                          <div className="text-xs uppercase tracking-wide mb-2" style={{ color: "var(--gl-ink-secondary)", fontWeight: 600 }}>Interpretive flavour</div>
                          <div className="flex gap-1.5 flex-wrap">
                            {rashi.keywords.split(", ").map((kw) => (
                              <span key={kw} className="px-2.5 py-1 rounded-full text-xs" style={{ background: `${rashi.color}12`, color: rashi.color, border: `1px solid ${rashi.color}30` }}>
                                {kw}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Mnemonic */}
                        <div className="p-3 rounded-lg" style={{ background: `${rashi.color}06`, border: `1px dashed ${rashi.color}25` }}>
                          <div className="text-xs uppercase tracking-wide mb-1" style={{ color: "var(--gl-ink-secondary)", fontWeight: 600 }}>Mnemonic</div>
                          <div className="text-base italic" style={{ color: "var(--gl-ink-primary)", fontWeight: 500 }}>{rashi.mnemonic}</div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          )}

          {/* ─── Dignity Section ─── */}
          {activeSection === "dignities" && (
            <DignityLandscapeRing rashi={rashi} />
          )}

          {/* ─── Simulator Section ─── */}
          {activeSection === "simulator" && (
            <GrahaExpressionSimulator rashi={rashi} />
          )}

          {/* ─── Mirror Section ─── */}
          {activeSection === "mirror" && (
            <MirrorComparison rashi={rashi} />
          )}

          {/* ─── Quiz Section ─── */}
          {activeSection === "quiz" && (
            <EnhancedQuiz 
              rashi={rashi} 
              quizScore={quizScore}
              setQuizScore={setQuizScore}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Cross-references footer */}
      <div className="text-sm p-3 rounded-xl leading-relaxed" style={{ background: "var(--gl-surface-twilight-glass)", border: "1px solid var(--gl-gold-hairline)", color: "var(--gl-ink-secondary)", fontWeight: 500 }}>
        Cross-references:{" "}
        <span style={{ color: "var(--gl-ink-secondary)" }}>
          Full rāśi interpretation → Module 05/06/13 · Dṛṣṭi mechanics → Module 08 · Daśā timing → Module 09 · Medical Jyotiṣa → Module 12 · Per-rāśi template → Lesson 4.2.1
        </span>
      </div>
    </div>
  );
}
