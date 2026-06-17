"use client";

import { useState } from "react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const HAIRLINE = "var(--gl-gold-hairline, rgba(156, 122, 47, 0.15))";
const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GREEN = "#2F7D55";
const RED = "#A23A1E";
const AMBER = "#D97706";

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
  const [eesarphaSeparation, setEesarphaSeparation] = useState(-5);

  // Ikkavāla state
  const [selectedIkkavala, setSelectedIkkavala] = useState<string[]>(["Sun", "Jupiter"]);

  // Induvāra state
  const [flankA, setFlankA] = useState(3); // Mars
  const [centralPos, setCentralPos] = useState(4); // Moon
  const [flankB, setFlankB] = useState(5); // Saturn
  const [consultAnswer, setConsultAnswer] = useState<number | null>(null);

  const toggleIkkavalaPlanet = (name: string) => {
    if (selectedIkkavala.includes(name)) {
      if (selectedIkkavala.length > 2) {
        setSelectedIkkavala(selectedIkkavala.filter((p) => p !== name));
      }
    } else {
      setSelectedIkkavala([...selectedIkkavala, name]);
    }
  };

  const isLeftFlanked = (flankA === (centralPos - 1 + 12) % 12) && (flankB === (centralPos + 1) % 12);
  const isRightFlanked = (flankB === (centralPos - 1 + 12) % 12) && (flankA === (centralPos + 1) % 12);
  const isBesieged = isLeftFlanked || isRightFlanked;

  const handleConsultOption = (index: number) => {
    setConsultAnswer(index);
  };

  const consultOptions = [
    {
      text: "No. Induvāra indicates a period of heightened external pressure and responsibility. It suggests that you will need to exercise discipline and caution, but it does not dictate structural ruin. We look at other indicators like Muntha and Varshesha to assess final outcome.",
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
        padding: "20px",
        borderRadius: "12px",
        background: "rgba(255, 253, 246, 0.7)",
        border: "1px solid rgba(156, 122, 47, 0.15)",
        boxShadow: "0 8px 32px rgba(156, 122, 47, 0.05)",
        fontFamily: "'Inter', sans-serif",
        color: INK_PRIMARY,
        maxWidth: "860px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "16px"
      }}
      data-interactive="tajika-three-yoga-comparator"
    >
      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(156,122,47,0.12)", paddingBottom: "12px", marginBottom: "4px" }}>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: GOLD_DEEP, display: "flex", alignItems: "center", gap: "6px" }}>
          Tājika Three Yoga Comparator
        </h3>
        <span style={{ fontSize: "11.5px", color: INK_SECONDARY }}>Compare Eesarphā (separating), Ikkavāla (conjunction), and Induvāra (besieged) configurations</span>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "6px", background: "rgba(156, 122, 47, 0.06)", padding: "4px", borderRadius: "8px" }}>
        {[
          { id: "eesarpha", name: "Eesarphā (Separating)" },
          { id: "ikkavala", name: "Ikkavāla (Same-Sign)" },
          { id: "induvara", name: "Induvāra (Besieged)" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              flex: 1,
              border: "none",
              background: activeTab === tab.id ? GOLD : "transparent",
              color: activeTab === tab.id ? "#ffffff" : INK_SECONDARY,
              borderRadius: "6px",
              padding: "6px 10px",
              fontWeight: 700,
              fontSize: "11.5px",
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
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Concept Card */}
          <div style={{ background: "#ffffff", border: "1px solid rgba(156, 122, 47, 0.08)", padding: "14px", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: GOLD_DEEP }}>Eesarphā: The Dissolving Connection</span>
            <p style={{ margin: 0, fontSize: "11.5px", color: INK_SECONDARY, lineHeight: 1.45 }}>
              Eesarphā occurs when the faster planet has passed the point of exact aspect but remains within the combined dīptāṁśa orb. It represents fading outcomes or past-year matters concluding.
            </p>
          </div>

          {/* Interactive slider card */}
          <div style={{ background: "#ffffff", border: "1px solid rgba(156, 122, 47, 0.08)", padding: "14px", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11.5px" }}>
              <span>Aspect Separation:</span>
              <strong style={{ color: eesarphaSeparation <= 0 ? GREEN : AMBER }}>
                {eesarphaSeparation < 0 ? `Applying (${Math.abs(eesarphaSeparation)}° before exact)` : 
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

            {/* Visual representation */}
            <div style={{ display: "flex", alignItems: "center", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "6px", padding: "14px", background: "rgba(0,0,0,0.01)" }}>
              <div style={{ flex: 1, textAlign: "center" }}>
                <span style={{ fontSize: "20px", color: GOLD }}>☽</span>
                <strong style={{ display: "block", fontSize: "11px" }}>Moon (Fast)</strong>
                <span style={{ fontSize: "9.5px", color: INK_MUTED }}>Degree: {10 + eesarphaSeparation}°</span>
              </div>
              <div style={{ flex: 2, position: "relative", height: "4px", background: HAIRLINE }}>
                <div style={{ position: "absolute", left: "50%", top: -10, bottom: -10, width: "1.5px", background: GOLD }} />
                <div style={{
                  position: "absolute",
                  left: `${50 + eesarphaSeparation * 5}%`,
                  top: -6,
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: eesarphaSeparation <= 0 ? GREEN : AMBER,
                  transform: "translateX(-6px)"
                }} />
              </div>
              <div style={{ flex: 1, textAlign: "center" }}>
                <span style={{ fontSize: "20px", color: GOLD }}>♃</span>
                <strong style={{ display: "block", fontSize: "11px" }}>Jupiter (Slow)</strong>
                <span style={{ fontSize: "9.5px", color: INK_MUTED }}>Degree: 10°</span>
              </div>
            </div>
          </div>

          {/* Verdict Box */}
          <div style={{ 
            padding: "12px", 
            borderRadius: "8px", 
            border: `1.5px solid ${eesarphaSeparation > 0 ? AMBER : GREEN}`,
            background: "#ffffff"
          }}>
            <strong style={{ color: eesarphaSeparation > 0 ? AMBER : GREEN, fontSize: "12px", display: "block", marginBottom: "4px" }}>
              {eesarphaSeparation > 0 ? "Verdict: Eesarphā Yoga is Active" : "Verdict: Ithasāla Yoga is Active"}
            </strong>
            <span style={{ fontSize: "11.5px", lineHeight: 1.4 }}>
              {eesarphaSeparation > 0 
                ? "As the faster Moon moves past Jupiter's degree, the energy of the aspect is separating. The opportunity described by this combination (such as a career leap) has already been initiated or has passed its peak. Focus on consolidating previous gains."
                : "The faster Moon is approaching Jupiter's degree. The aspect is applying. The promise of expansion and support is forming and will deliver a concrete event in the upcoming year."}
            </span>
          </div>
        </div>
      )}

      {activeTab === "ikkavala" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Concept Card */}
          <div style={{ background: "#ffffff", border: "1px solid rgba(156, 122, 47, 0.08)", padding: "14px", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: GOLD_DEEP }}>Ikkavāla: Energy Confluence in the Same Sign</span>
            <p style={{ margin: 0, fontSize: "11.5px", color: INK_SECONDARY, lineHeight: 1.45 }}>
              When multiple planets occupy the exact same sign in the Varṣaphala chart, they merge their indications. The entire sign acts as a single dynamic focus, blending their separate significations.
            </p>
          </div>

          {/* Selector Card */}
          <div style={{ background: "#ffffff", border: "1px solid rgba(156, 122, 47, 0.08)", padding: "14px", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: INK_MUTED }}>Toggle Grahas to combine:</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {PLANETS.map((p) => {
                const active = selectedIkkavala.includes(p.name);
                return (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => toggleIkkavalaPlanet(p.name)}
                    style={{
                      border: `1.5px solid ${active ? GOLD : HAIRLINE}`,
                      background: active ? GOLD : "transparent",
                      color: active ? "#ffffff" : INK_SECONDARY,
                      borderRadius: "16px",
                      padding: "4px 12px",
                      fontSize: "11px",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px"
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "14px" }}>
            {/* Visual circle container */}
            <div style={{ 
              background: "#ffffff", 
              border: "1px solid rgba(156, 122, 47, 0.08)", 
              borderRadius: "8px", 
              padding: "20px", 
              display: "flex", 
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "180px"
            }}>
              <div style={{ 
                border: `2px dashed ${GOLD}`, 
                borderRadius: "50%", 
                width: "140px", 
                height: "140px", 
                display: "flex", 
                flexWrap: "wrap",
                alignContent: "center",
                justifyContent: "center",
                gap: "6px",
                background: "rgba(156, 122, 47, 0.02)",
                padding: "10px"
              }}>
                {selectedIkkavala.map((name) => {
                  const p = PLANETS.find((x) => x.name === name);
                  return (
                    <div key={name} style={{ display: "flex", alignItems: "center", background: "#ffffff", border: `1px solid ${HAIRLINE}`, borderRadius: "4px", padding: "2px 4px", fontSize: "10px" }}>
                      <strong>{p?.glyph} {name}</strong>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Merge description card */}
            <div style={{ background: "#ffffff", border: "1px solid rgba(156, 122, 47, 0.08)", padding: "14px", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontSize: "11.5px", fontWeight: 700, color: GOLD_DEEP }}>Merged Significations:</span>
              <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "11px", color: INK_SECONDARY, lineHeight: 1.5 }}>
                {selectedIkkavala.map((name) => {
                  const p = PLANETS.find((x) => x.name === name);
                  return (
                    <li key={name}><strong>{name}</strong>: {p?.desc}</li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === "induvara" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Concept Card */}
          <div style={{ background: "#ffffff", border: "1px solid rgba(156, 122, 47, 0.08)", padding: "14px", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: GOLD_DEEP }}>Induvāra: Besieged Container</span>
            <p style={{ margin: 0, fontSize: "11.5px", color: INK_SECONDARY, lineHeight: 1.45 }}>
              Induvāra Yoga occurs when a naturally beneficial planet (or the Moon) is flanked in adjacent signs by the natural malefics Mars and Saturn, creating intense pressure and testing the client's resilience.
            </p>
          </div>

          {/* Flank selector card */}
          <div style={{ background: "#ffffff", border: "1px solid rgba(156, 122, 47, 0.08)", padding: "14px", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
              <div>
                <label style={{ display: "block", fontSize: "10px", fontWeight: 700, color: INK_MUTED, marginBottom: "4px", textTransform: "uppercase" }}>Mars position</label>
                <select value={flankA} onChange={(e) => setFlankA(Number(e.target.value))} style={{ width: "100%", padding: "4px 8px", borderRadius: "4px", border: "1px solid rgba(156,122,47,0.2)", fontSize: "11.5px", background: "#fff" }}>
                  {ZODIAC_SIGNS.map((s: string, i: number) => <option key={s} value={i}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "10px", fontWeight: 700, color: INK_MUTED, marginBottom: "4px", textTransform: "uppercase" }}>Moon position</label>
                <select value={centralPos} onChange={(e) => setCentralPos(Number(e.target.value))} style={{ width: "100%", padding: "4px 8px", borderRadius: "4px", border: "1px solid rgba(156,122,47,0.2)", fontSize: "11.5px", background: "#fff" }}>
                  {ZODIAC_SIGNS.map((s: string, i: number) => <option key={s} value={i}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "10px", fontWeight: 700, color: INK_MUTED, marginBottom: "4px", textTransform: "uppercase" }}>Saturn position</label>
                <select value={flankB} onChange={(e) => setFlankB(Number(e.target.value))} style={{ width: "100%", padding: "4px 8px", borderRadius: "4px", border: "1px solid rgba(156,122,47,0.2)", fontSize: "11.5px", background: "#fff" }}>
                  {ZODIAC_SIGNS.map((s: string, i: number) => <option key={s} value={i}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Horizontal flanking display */}
            <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
              {[-1, 0, 1].map((offset) => {
                const targetSignIdx = (centralPos + offset + 12) % 12;
                const signName = ZODIAC_SIGNS[targetSignIdx];
                const hasMars = flankA === targetSignIdx;
                const hasSaturn = flankB === targetSignIdx;
                const hasMoon = offset === 0;

                return (
                  <div key={offset} style={{
                    flex: 1,
                    background: hasMoon && isBesieged ? `${RED}08` : "rgba(0,0,0,0.02)",
                    border: `1px solid ${hasMoon && isBesieged ? RED : HAIRLINE}`,
                    borderRadius: "6px",
                    padding: "10px",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px"
                  }}>
                    <span style={{ fontSize: "10px", fontWeight: 800, color: INK_MUTED }}>{signName}</span>
                    <div style={{ height: "24px", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                      {hasMars && <span style={{ fontSize: "11px", color: RED, fontWeight: 700 }}>♂ Mars</span>}
                      {hasMoon && <span style={{ fontSize: "11px", color: isBesieged ? RED : GOLD, fontWeight: 700 }}>☽ Moon</span>}
                      {hasSaturn && <span style={{ fontSize: "11px", color: INK_PRIMARY, fontWeight: 700 }}>♄ Saturn</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Induvāra Counseling case */}
          {isBesieged && (
            <div style={{ background: "#ffffff", border: `1px solid ${GOLD}`, padding: "14px", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "6px" }}>
                <span style={{ color: GOLD_DEEP, fontSize: "10px", textTransform: "uppercase", fontWeight: 900 }}>M19 Client Consultation Case</span>
                <h4 style={{ margin: "2px 0 0", fontSize: "13px", color: INK_PRIMARY }}>Counseling Practice: Besieged Moon</h4>
              </div>

              <blockquote style={{ margin: "0 0 8px 0", paddingLeft: "8px", borderLeft: `3px solid ${RED}`, color: INK_SECONDARY, fontSize: "11px", fontStyle: "italic", lineHeight: 1.45 }}>
                &ldquo;I saw my Moon is besieged between Mars and Saturn in my solar return chart. Does this mean my health and career will be completely ruined this year? I am terrified.&rdquo;
              </blockquote>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {consultOptions.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleConsultOption(i)}
                    style={{
                      textAlign: "left",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: `1.5px solid ${consultAnswer === i ? (opt.isCorrect ? GREEN : RED) : HAIRLINE}`,
                      background: consultAnswer === i ? (opt.isCorrect ? `${GREEN}08` : `${RED}08`) : "#ffffff",
                      color: INK_PRIMARY,
                      fontSize: "11px",
                      lineHeight: 1.4,
                      cursor: "pointer",
                      transition: "all 0.2s"
                    }}
                  >
                    <strong>Option {String.fromCharCode(65 + i)}:</strong> {opt.text}
                  </button>
                ))}
              </div>

              {consultAnswer !== null && (
                <div style={{ 
                  padding: "10px", 
                  borderRadius: "6px", 
                  background: consultOptions[consultAnswer].isCorrect ? `${GREEN}12` : `${RED}12`,
                  border: `1px solid ${consultOptions[consultAnswer].isCorrect ? GREEN : RED}`,
                  color: consultOptions[consultAnswer].isCorrect ? GREEN : RED,
                  fontSize: "11px"
                }}>
                  <strong>{consultOptions[consultAnswer].isCorrect ? "✓ Excellence Verified" : "✗ Framework Violation"}</strong>
                  <p style={{ margin: "2px 0 0", color: INK_PRIMARY }}>{consultOptions[consultAnswer].feedback}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
