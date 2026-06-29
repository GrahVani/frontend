"use client";

import { useState } from "react";
import { BookOpen, Check, X, HelpCircle, RefreshCw, Flame, ArrowRight, ArrowLeft } from "lucide-react";
import { IAST } from "../../chrome/typography";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const HAIRLINE = "var(--gl-gold-hairline, rgba(156, 122, 47, 0.15))";
const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GREEN = "#2F7D55";
const RED = "#A23A1E";
const AMBER = "#D97706";
const LIGHT_BG = "#FCFAF2";

const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const PLANETS = [
  { name: "Moon", glyph: "☽", desc: "Mind, emotions, and public interactions" },
  { name: "Mercury", glyph: "☿", desc: "Communication, intellect, and business transactions" },
  { name: "Venus", glyph: "♀", desc: "Relationships, harmony, and creative output" },
  { name: "Sun", glyph: "☉", desc: "Vitality, authority, and status updates" },
  { name: "Mars", glyph: "♂", desc: "Drive, physical energy, and conflict handling" },
  { name: "Jupiter", glyph: "♃", desc: "Wisdom, expansion, and financial grace" },
  { name: "Saturn", glyph: "♄", desc: "Structure, delays, and resilience tests" },
];

export function TajikaThreeYogaComparator() {
  const [activeTab, setActiveTab] = useState<"eesarpha" | "ikkavala" | "induvara">("eesarpha");

  // Eesarphā state
  const [eesarphaSeparation, setEesarphaSeparation] = useState(4); // default separating

  // Ikkavāla state
  const [selectedIkkavala, setSelectedIkkavala] = useState<string[]>(["Sun", "Jupiter", "Mercury"]);

  // Induvāra state
  const [flankA, setFlankA] = useState(3); // Mars in Cancer (index 3)
  const [centralPos, setCentralPos] = useState(4); // Moon in Leo (index 4)
  const [flankB, setFlankB] = useState(5); // Saturn in Virgo (index 5)
  const [consultAnswer, setConsultAnswer] = useState<number | null>(null);

  const toggleIkkavalaPlanet = (name: string) => {
    if (selectedIkkavala.includes(name)) {
      if (selectedIkkavala.length > 1) {
        setSelectedIkkavala(selectedIkkavala.filter((p) => p !== name));
      }
    } else {
      setSelectedIkkavala([...selectedIkkavala, name]);
    }
  };

  // Besieged logic: central sign flanked directly by flankA and flankB (Virgo flanked by Leo and Libra)
  const isLeftFlanked = (flankA === (centralPos - 1 + 12) % 12) && (flankB === (centralPos + 1) % 12);
  const isRightFlanked = (flankB === (centralPos - 1 + 12) % 12) && (flankA === (centralPos + 1) % 12);
  const isBesieged = isLeftFlanked || isRightFlanked;

  const handleConsultOption = (index: number) => {
    setConsultAnswer(index);
  };

  const consultOptions = [
    {
      text: "No. Induvāra indicates a period of heightened external pressure and responsibility. It suggests that you will need to exercise discipline and caution, but it does not dictate structural ruin. We look at other indicators like Munthā and Varṣeśa to assess final outcomes.",
      isCorrect: true,
      feedback: "Correct! This response conforms to the M19 framing principles. It avoids catastrophic fear-induction, recognizes the role of multiple chart factors, and supports client agency."
    },
    {
      text: "Yes, absolutely. A besieged Lagnesha Moon between two natural malefics brings guaranteed physical catastrophe. You should perform heavy protective rituals immediately to survive.",
      isCorrect: false,
      feedback: "Incorrect. This is fear-mongering and fatalistic. It violates the M19 guidelines by predicting absolute ruin based on a single factor."
    },
    {
      text: "Don't worry at all! This yoga is actually a secret blessing that makes you invincible and guarantees extreme wealth by the end of the year.",
      isCorrect: false,
      feedback: "Incorrect. This is toxic positivity and over-promising. It ignores the genuine challenge indicated by the flanking malefics."
    }
  ];

  return (
    <div
      className="gl-surface-twilight-glass"
      style={{
        padding: "24px",
        borderRadius: "14px",
        background: "rgba(255, 253, 246, 0.85)",
        border: "1px solid rgba(156, 122, 47, 0.2)",
        boxShadow: "0 10px 40px rgba(156, 122, 47, 0.08)",
        fontFamily: "'Inter', sans-serif",
        color: INK_PRIMARY,
        maxWidth: "920px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "16px"
      }}
      data-interactive="tajika-three-yoga-comparator"
    >
      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(156,122,47,0.15)", paddingBottom: "12px" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Module 19 — Chapter 2 — Lesson 2
        </span>
        <h3 style={{ margin: "4px 0 0", fontSize: "22px", fontWeight: 800, color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
          Tājika Three Yoga Comparator
        </h3>
        <p style={{ margin: "4px 0 0", fontSize: "13.5px", color: INK_SECONDARY, lineHeight: "1.4" }}>
          Analyze Eesarphā (separating aspect), Ikkavāla (same-sign confluence), and Induvāra (besieged planetary focus) configurations.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "6px", background: "rgba(156, 122, 47, 0.06)", padding: "5px", borderRadius: "8px" }}>
        {[
          { id: "eesarpha", name: "Eesarphā (Separating Aspect)" },
          { id: "ikkavala", name: "Ikkavāla (Same-Sign Confluence)" },
          { id: "induvara", name: "Induvāra (Besieged Alignment)" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              setConsultAnswer(null);
            }}
            style={{
              flex: 1,
              border: "none",
              background: activeTab === tab.id ? GOLD : "transparent",
              color: activeTab === tab.id ? "#ffffff" : INK_SECONDARY,
              borderRadius: "6px",
              padding: "8px 12px",
              fontWeight: 700,
              fontSize: "12px",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Content Area */}
      {activeTab === "eesarpha" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Concept Card */}
          <div style={{ background: "#ffffff", border: "1px solid rgba(156, 122, 47, 0.15)", padding: "16px", borderRadius: "8px" }}>
            <span style={{ fontSize: "11px", fontWeight: 800, color: RED, textTransform: "uppercase" }}>Eesarphā: The Dissolving Connection</span>
            <p style={{ margin: "4px 0 0", fontSize: "13.5px", color: INK_SECONDARY, lineHeight: 1.5 }}>
              Eesarphā occurs when the faster planet has passed the point of exact aspect but remains within the combined dīptāṁśa orb. It represents fading outcomes, releasing connections, or past-year matters concluding.
            </p>
          </div>

          {/* Interactive slider card */}
          <div style={{ background: "#ffffff", border: "1px solid rgba(156, 122, 47, 0.15)", padding: "20px", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", alignItems: "center" }}>
              <span style={{ fontWeight: 700 }}>Aspect Offset:</span>
              <strong style={{ color: eesarphaSeparation <= 0 ? GREEN : RED, fontSize: "14.5px" }}>
                {eesarphaSeparation < 0 ? `Applying (${Math.abs(eesarphaSeparation)}° before exact - Itthasala)` : 
                 eesarphaSeparation === 0 ? "Exact Aspect (Peak)" : 
                 `Separating (${eesarphaSeparation}° past exact - Eesarphā)`}
              </strong>
            </div>
            
            <input
              type="range"
              min={-10}
              max={10}
              value={eesarphaSeparation}
              onChange={(e) => setEesarphaSeparation(Number(e.target.value))}
              style={{ width: "100%", accentColor: GOLD }}
            />

            {/* Interactive SVG for Eesarpha */}
            <div style={{ display: "flex", justifyContent: "center", background: LIGHT_BG, padding: "12px", borderRadius: "6px", border: "1px solid rgba(156,122,47,0.08)" }}>
              <svg viewBox="0 0 500 120" style={{ width: "100%", maxWidth: "460px", height: "auto" }}>
                {/* Horizontal track */}
                <line x1="40" y1="60" x2="460" y2="60" stroke="rgba(156, 122, 47, 0.2)" strokeWidth="2" strokeDasharray="3,3" />
                
                {/* Exact center line */}
                <line x1="250" y1="30" x2="250" y2="90" stroke={GOLD} strokeWidth="1.5" />
                <text x="250" y="24" fontSize="9" fontWeight="800" fill={GOLD_DEEP} textAnchor="middle">EXACT ASPECT LINE (0°)</text>

                {/* Shaded Orb region: combined orb (e.g. 10.5 degrees) */}
                <rect x="150" y="45" width="200" height="30" fill="rgba(47, 125, 85, 0.05)" rx="4" />
                <text x="345" y="52" fontSize="7.5" fontWeight="700" fill={GREEN}>Orb Boundary</text>

                {/* Anchor Target Planet: Jupiter (Slower, at 0°) */}
                <g transform="translate(250, 60)">
                  <circle r="16" fill="#ffffff" stroke={GOLD} strokeWidth="3" />
                  <text y="1" textAnchor="middle" dominantBaseline="middle" fontSize="14" fill={GOLD}>♃</text>
                  <text y="24" textAnchor="middle" fontSize="9.5" fontWeight="800" fill={INK_SECONDARY}>Jupiter (Slow)</text>
                </g>

                {/* Moving Planet: Moon (Faster, at offset) */}
                {/* Scale 250 + offset * 18 */}
                <g transform={`translate(${250 + eesarphaSeparation * 18}, 60)`} style={{ transition: "transform 150ms ease" }}>
                  <circle r="16" fill="#ffffff" stroke="#475569" strokeWidth="3" />
                  <text y="1" textAnchor="middle" dominantBaseline="middle" fontSize="14" fill="#475569">☽</text>
                  <text y="24" textAnchor="middle" fontSize="9.5" fontWeight="800" fill={INK_SECONDARY}>Moon (Fast)</text>
                </g>

                {/* Motion Direction Arrow */}
                {eesarphaSeparation !== 0 && (
                  <path 
                    d={eesarphaSeparation > 0 
                      ? `M ${250 + eesarphaSeparation * 18 - 25} 40 L ${250 + eesarphaSeparation * 18 - 45} 40` 
                      : `M ${250 + eesarphaSeparation * 18 + 25} 40 L ${250 + eesarphaSeparation * 18 + 45} 40`
                    } 
                    fill="none" 
                    stroke={eesarphaSeparation > 0 ? RED : GREEN} 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                  />
                )}
                {/* Arrowhead */}
                {eesarphaSeparation !== 0 && (
                  <polygon 
                    points={eesarphaSeparation > 0
                      ? `${250 + eesarphaSeparation * 18 - 45},40 ${250 + eesarphaSeparation * 18 - 41},37 ${250 + eesarphaSeparation * 18 - 41},43`
                      : `${250 + eesarphaSeparation * 18 + 45},40 ${250 + eesarphaSeparation * 18 + 41},37 ${250 + eesarphaSeparation * 18 + 41},43`
                    } 
                    fill={eesarphaSeparation > 0 ? RED : GREEN} 
                  />
                )}
                
                {/* Status text label on graph */}
                <text 
                  x="250" 
                  y="108" 
                  fontSize="10" 
                  fontWeight="800" 
                  fill={eesarphaSeparation > 0 ? RED : GREEN} 
                  textAnchor="middle"
                >
                  {eesarphaSeparation > 0 ? "MOON LEAVING UNION (EESARPHĀ)" : "MOON APPROACHING UNION (ITTHASALA)"}
                </text>
              </svg>
            </div>
          </div>

          {/* Verdict Box */}
          <div style={{ 
            padding: "16px", 
            borderRadius: "8px", 
            border: `1.5px solid ${eesarphaSeparation > 0 ? RED : GREEN}`,
            background: "#ffffff"
          }}>
            <strong style={{ color: eesarphaSeparation > 0 ? RED : GREEN, fontSize: "14.5px", display: "block", marginBottom: "4px" }}>
              {eesarphaSeparation > 0 ? "Verdict: Eesarphā Yoga (Separating)" : "Verdict: Ithasala Yoga (Applying)"}
            </strong>
            <span style={{ fontSize: "13px", lineHeight: 1.5, color: INK_SECONDARY }}>
              {eesarphaSeparation > 0 
                ? "The faster Moon moves past Jupiter's degree. The energy is separating. The opportunity described by this combination (such as a career leap) has already passed its peak or has been finalized. Focus on consolidation rather than fresh pursuits."
                : "The faster Moon is approaching Jupiter's degree. The aspect is applying. The promise of expansion and support is forming and will deliver a concrete event in the upcoming year cycle."}
            </span>
          </div>
        </div>
      )}

      {activeTab === "ikkavala" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Concept Card */}
          <div style={{ background: "#ffffff", border: "1px solid rgba(156, 122, 47, 0.15)", padding: "16px", borderRadius: "8px" }}>
            <span style={{ fontSize: "11px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase" }}>Ikkavāla: Energy Confluence in the Same Sign</span>
            <p style={{ margin: "4px 0 0", fontSize: "13.5px", color: INK_SECONDARY, lineHeight: 1.5 }}>
              When multiple planets occupy the exact same sign in the Varṣaphala, they merge their indications. The entire sign acts as a single dynamic focus, blending their separate significations.
            </p>
          </div>

          {/* Selector Card */}
          <div style={{ background: "#ffffff", border: "1px solid rgba(156, 122, 47, 0.15)", padding: "16px", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <span style={{ fontSize: "11.5px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase" }}>Select Grahas to combine in the same sign:</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {PLANETS.map((p) => {
                const active = selectedIkkavala.includes(p.name);
                return (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => toggleIkkavalaPlanet(p.name)}
                    style={{
                      border: `1.5px solid ${active ? GOLD : "rgba(156,122,47,0.2)"}`,
                      background: active ? GOLD : "transparent",
                      color: active ? "#ffffff" : INK_SECONDARY,
                      borderRadius: "20px",
                      padding: "6px 14px",
                      fontSize: "12.5px",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      transition: "all 150ms ease"
                    }}
                  >
                    <span>{p.glyph}</span>
                    <span>{p.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Synthesis Display */}
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "16px" }}>
            
            {/* Visual SVG confluence representation */}
            <div style={{ 
              background: "#ffffff", 
              border: "1px solid rgba(156, 122, 47, 0.15)", 
              borderRadius: "8px", 
              padding: "20px", 
              display: "flex", 
              flexDirection: "column",
              alignItems: "center"
            }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "10px" }}>
                Same-Sign Energy Vault
              </span>
              <svg viewBox="0 0 200 200" style={{ width: "100%", maxWidth: "160px", height: "auto" }}>
                {/* Outer Sign circle */}
                <circle cx="100" cy="100" r="85" fill={LIGHT_BG} stroke={GOLD} strokeWidth="2" strokeDasharray="4,4" />
                <text x="100" y="24" fontSize="9" fontWeight="800" fill={GOLD_DEEP} textAnchor="middle">ZODIAC SIGN BOUNDARY</text>

                {/* Central energy node */}
                <circle cx="100" cy="100" r="30" fill="rgba(156, 122, 47, 0.1)" stroke={GOLD} strokeWidth="1.5" />
                <text x="100" y="103" fontSize="10" fontWeight="900" fill={GOLD_DEEP} textAnchor="middle">CONFLUENCE</text>

                {/* Merging lines and active nodes */}
                {selectedIkkavala.map((name, idx) => {
                  const angle = (idx / selectedIkkavala.length) * 2 * Math.PI - Math.PI / 2;
                  const radius = 60;
                  const x = 100 + radius * Math.cos(angle);
                  const y = 100 + radius * Math.sin(angle);
                  
                  return (
                    <g key={name}>
                      <line x1="100" y1="100" x2={x} y2={y} stroke="rgba(156, 122, 47, 0.4)" strokeWidth="1" />
                      <circle cx={x} cy={y} r="14" fill="#ffffff" stroke={GOLD} strokeWidth="1.5" />
                      <text x={x} y={y + 3} fontSize="11" fontWeight="800" fill={INK_PRIMARY} textAnchor="middle">
                        {PLANETS.find(p => p.name === name)?.glyph}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Merge description card */}
            <div style={{ background: "#ffffff", border: "1px solid rgba(156, 122, 47, 0.15)", padding: "16px", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <span style={{ fontSize: "12px", fontWeight: 700, color: GOLD_DEEP, textTransform: "uppercase" }}>Combined Indications:</span>
              <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "13px", color: INK_SECONDARY, lineHeight: 1.5 }}>
                {selectedIkkavala.map((name) => {
                  const p = PLANETS.find((x) => x.name === name);
                  return (
                    <li key={name} style={{ marginBottom: "4px" }}>
                      <strong style={{ color: GOLD_DEEP }}>{p?.glyph} {name}</strong>: {p?.desc}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === "induvara" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Concept Card */}
          <div style={{ background: "#ffffff", border: "1px solid rgba(156, 122, 47, 0.15)", padding: "16px", borderRadius: "8px" }}>
            <span style={{ fontSize: "11px", fontWeight: 800, color: RED, textTransform: "uppercase" }}>Induvāra: Besieged Lagnesha / Moon</span>
            <p style={{ margin: "4px 0 0", fontSize: "13.5px", color: INK_SECONDARY, lineHeight: 1.5 }}>
              Induvāra Yoga occurs when a naturally beneficial planet (or the Moon) is flanked in adjacent signs by the natural malefics Mars and Saturn, creating intense pressure and testing the client's resilience.
            </p>
          </div>

          {/* Flank selector card */}
          <div style={{ background: "#ffffff", border: "1px solid rgba(156, 122, 47, 0.15)", padding: "16px", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "10.5px", fontWeight: 700, color: INK_MUTED, marginBottom: "6px", textTransform: "uppercase" }}>Mars position</label>
                <select value={flankA} onChange={(e) => setFlankA(Number(e.target.value))} style={{ width: "100%", padding: "6px 10px", borderRadius: "6px", border: "1px solid rgba(156,122,47,0.25)", fontSize: "12.5px", background: "#fff", color: INK_PRIMARY, fontWeight: 700 }}>
                  {ZODIAC_SIGNS.map((s: string, i: number) => <option key={s} value={i}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "10.5px", fontWeight: 700, color: INK_MUTED, marginBottom: "6px", textTransform: "uppercase" }}>Moon position</label>
                <select value={centralPos} onChange={(e) => setCentralPos(Number(e.target.value))} style={{ width: "100%", padding: "6px 10px", borderRadius: "6px", border: "1px solid rgba(156,122,47,0.25)", fontSize: "12.5px", background: "#fff", color: INK_PRIMARY, fontWeight: 700 }}>
                  {ZODIAC_SIGNS.map((s: string, i: number) => <option key={s} value={i}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "10.5px", fontWeight: 700, color: INK_MUTED, marginBottom: "6px", textTransform: "uppercase" }}>Saturn position</label>
                <select value={flankB} onChange={(e) => setFlankB(Number(e.target.value))} style={{ width: "100%", padding: "6px 10px", borderRadius: "6px", border: "1px solid rgba(156,122,47,0.25)", fontSize: "12.5px", background: "#fff", color: INK_PRIMARY, fontWeight: 700 }}>
                  {ZODIAC_SIGNS.map((s: string, i: number) => <option key={s} value={i}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* SVG Visualizing flanking and pressure vectors */}
            <div style={{ display: "flex", justifyContent: "center", background: LIGHT_BG, padding: "16px", borderRadius: "6px", border: "1px solid rgba(156,122,47,0.08)", marginTop: "8px" }}>
              <svg viewBox="0 0 460 110" style={{ width: "100%", maxWidth: "420px", height: "auto" }}>
                {/* 3 Sign Blocks */}
                {/* Left block (Lagna - 1) */}
                <rect x="15" y="15" width="120" height="70" rx="6" fill={flankA === (centralPos - 1 + 12) % 12 ? "rgba(162, 58, 30, 0.05)" : "#ffffff"} stroke={flankA === (centralPos - 1 + 12) % 12 ? RED : "rgba(156,122,47,0.2)"} strokeWidth="1.5" />
                <text x="75" y="32" fontSize="9" fontWeight="800" fill={INK_MUTED} textAnchor="middle">{ZODIAC_SIGNS[(centralPos - 1 + 12) % 12]}</text>
                <text x="75" y="58" fontSize="13" fontWeight="800" fill={RED} textAnchor="middle">
                  {flankA === (centralPos - 1 + 12) % 12 ? "♂ Mars (Malefic)" : (flankB === (centralPos - 1 + 12) % 12 ? "♄ Saturn" : "Empty")}
                </text>

                {/* Central block (Lagna) */}
                <rect x="170" y="15" width="120" height="70" rx="6" fill={isBesieged ? "rgba(162, 58, 30, 0.08)" : "#ffffff"} stroke={isBesieged ? RED : GOLD} strokeWidth={isBesieged ? "2.5" : "1.5"} />
                <text x="230" y="32" fontSize="9.5" fontWeight="800" fill={GOLD_DEEP} textAnchor="middle">{ZODIAC_SIGNS[centralPos]}</text>
                <text x="230" y="58" fontSize="14.5" fontWeight="900" fill={isBesieged ? RED : GOLD} textAnchor="middle">☽ Moon (Lagna)</text>

                {/* Right block (Lagna + 1) */}
                <rect x="325" y="15" width="120" height="70" rx="6" fill={flankB === (centralPos + 1) % 12 ? "rgba(162, 58, 30, 0.05)" : "#ffffff"} stroke={flankB === (centralPos + 1) % 12 ? RED : "rgba(156,122,47,0.2)"} strokeWidth="1.5" />
                <text x="385" y="32" fontSize="9" fontWeight="800" fill={INK_MUTED} textAnchor="middle">{ZODIAC_SIGNS[(centralPos + 1) % 12]}</text>
                <text x="385" y="58" fontSize="13" fontWeight="800" fill={INK_PRIMARY} textAnchor="middle">
                  {flankB === (centralPos + 1) % 12 ? "♄ Saturn (Malefic)" : (flankA === (centralPos + 1) % 12 ? "♂ Mars" : "Empty")}
                </text>

                {/* Flanking Pressure Arrows */}
                {isBesieged && (
                  <g>
                    {/* Left arrow pointing to center */}
                    <path d="M 140 50 L 164 50" fill="none" stroke={RED} strokeWidth="2.5" />
                    <polygon points="165,50 159,46 159,54" fill={RED} />
                    
                    {/* Right arrow pointing to center */}
                    <path d="M 320 50 L 296 50" fill="none" stroke={RED} strokeWidth="2.5" />
                    <polygon points="295,50 301,46 301,54" fill={RED} />
                    
                    <text x="230" y="98" fontSize="8.5" fontWeight="850" fill={RED} textAnchor="middle" letterSpacing="0.05em">BESIEGED (PĀPA-KARTARI) FORCE ACTIVE</text>
                  </g>
                )}
              </svg>
            </div>
          </div>

          {/* Induvāra Counseling case */}
          {isBesieged && (
            <div style={{ background: "#ffffff", border: `1.5px solid ${GOLD}`, padding: "16px", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ borderBottom: `1.5px solid ${HAIRLINE}`, paddingBottom: "8px" }}>
                <span style={{ color: GOLD_DEEP, fontSize: "10.5px", textTransform: "uppercase", fontWeight: 900 }}>M19 Client Consultation Case Study</span>
                <h4 style={{ margin: "2px 0 0", fontSize: "14px", color: INK_PRIMARY, fontWeight: 700 }}>Counseling Practice: Besieged Moon</h4>
              </div>

              <blockquote style={{ margin: "0 0 10px 0", paddingLeft: "10px", borderLeft: `3px solid ${RED}`, color: INK_SECONDARY, fontSize: "12.5px", fontStyle: "italic", lineHeight: 1.5 }}>
                &ldquo;I saw my Moon is besieged between Mars and Saturn in my solar return chart. Does this mean my health and career will be completely ruined this year? I am terrified.&rdquo;
              </blockquote>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {consultOptions.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleConsultOption(i)}
                    style={{
                      textAlign: "left",
                      padding: "10px 14px",
                      borderRadius: "6px",
                      border: `1.5px solid ${consultAnswer === i ? (opt.isCorrect ? GREEN : RED) : HAIRLINE}`,
                      background: consultAnswer === i ? (opt.isCorrect ? "rgba(47, 125, 85, 0.04)" : "rgba(162, 58, 30, 0.04)") : "#ffffff",
                      color: INK_PRIMARY,
                      fontSize: "12.5px",
                      lineHeight: 1.45,
                      cursor: "pointer",
                      transition: "all 150ms ease"
                    }}
                  >
                    <strong>Option {String.fromCharCode(65 + i)}:</strong> {opt.text}
                  </button>
                ))}
              </div>

              {consultAnswer !== null && (
                <div style={{ 
                  padding: "12px", 
                  borderRadius: "6px", 
                  background: consultOptions[consultAnswer].isCorrect ? "rgba(47, 125, 85, 0.08)" : "rgba(162, 58, 30, 0.08)",
                  border: `1px solid ${consultOptions[consultAnswer].isCorrect ? GREEN : RED}`,
                  color: consultOptions[consultAnswer].isCorrect ? GREEN : RED,
                  fontSize: "12.5px",
                  lineHeight: "1.4"
                }}>
                  <strong>{consultOptions[consultAnswer].isCorrect ? "✓ Excellence Verified" : "✗ Framework Violation"}</strong>
                  <p style={{ margin: "4px 0 0", color: INK_PRIMARY }}>{consultOptions[consultAnswer].feedback}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
