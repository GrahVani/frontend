"use client";

import React, { useState, useMemo } from "react";
import { Moon, Info } from "lucide-react";
import { IAST } from '@/components/learning-runtime/interactive/../chrome/typography';
import { RASHIS } from '@/components/learning-runtime/interactive/rashi-data';

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const SLATE_BLUE = "#3b82f6";
const PURPLE = "#8b5cf6";
const AMBER = "#f59e0b";
const GREEN = "#10b981";
const RED = "#ef4444";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

interface TransitHouseDetail { houseNum: number; nameSanskrit: string; nameIAST: string; quality: "Favourable" | "Difficult" | "Mixed"; color: string; theme: string; details: string; }

const HOUSE_DATA: Record<number, TransitHouseDetail> = {
  1: { houseNum: 1, nameSanskrit: "मुख्य", nameIAST: "Mukhya", quality: "Difficult", color: PURPLE, theme: "Self, mental load, physical pressure", details: "Saturn on the Moon mind. High responsibility, core identity re-prioritisation." },
  2: { houseNum: 2, nameSanskrit: "अन्त्य", nameIAST: "Antya", quality: "Difficult", color: AMBER, theme: "Finances, family, speech", details: "Winding down of Sade-Sati. Resource caution, domestic duties." },
  3: { houseNum: 3, nameSanskrit: "तृतीय", nameIAST: "Tṛtīya", quality: "Favourable", color: GREEN, theme: "Courage, initiative, siblings", details: "Upachaya (growth) house. High energy, successful ventures, sibling support." },
  4: { houseNum: 4, nameSanskrit: "कण्टक", nameIAST: "Kaṇṭaka", quality: "Difficult", color: RED, theme: "Home, property, mother, happiness", details: "Thorn Saturn. Domestic changes, renovations, mother health." },
  5: { houseNum: 5, nameSanskrit: "पञ्चम", nameIAST: "Pañcama", quality: "Mixed", color: SLATE_BLUE, theme: "Children, education, investments", details: "Mixed. Disciplined study, creative limits, caution in speculation." },
  6: { houseNum: 6, nameSanskrit: "षष्ठ", nameIAST: "Ṣaṣṭha", quality: "Favourable", color: GREEN, theme: "Victory, health, obstacles-clear", details: "Upachaya. Overcoming competitors, resolving chronic health issues." },
  7: { houseNum: 7, nameSanskrit: "सप्तम", nameIAST: "Saptama", quality: "Difficult", color: RED, theme: "Partnership, spouse, contracts", details: "Challenging axis. Joint assets alignment, marriage patience." },
  8: { houseNum: 8, nameSanskrit: "अष्टम", nameIAST: "Aṣṭama", quality: "Difficult", color: RED, theme: "Sudden changes, delays, research", details: "Duṣṭhāna. Delays, sudden events, deep cleansing, occult." },
  9: { houseNum: 9, nameSanskrit: "नवम", nameIAST: "Navama", quality: "Mixed", color: SLATE_BLUE, theme: "Dharma, travel, teachers, fortune", details: "Mixed. Spiritual restructuring, travel for study, delayed fortune." },
  10: { houseNum: 10, nameSanskrit: "दशम", nameIAST: "Daśama", quality: "Mixed", color: SLATE_BLUE, theme: "Profession, status, career", details: "Saturn's natural house. Intense work, professional building." },
  11: { houseNum: 11, nameSanskrit: "एकादश", nameIAST: "Ekādaśa", quality: "Favourable", color: GREEN, theme: "Gains, networks, desires-fill", details: "Prime Upachaya. Stable financial gains, elder support." },
  12: { houseNum: 12, nameSanskrit: "प्रथम", nameIAST: "Pratham", quality: "Difficult", color: AMBER, theme: "Losses, isolation, release", details: "Sade-Sati entry. Release of outworn things, subconscious transitions." }
};

export function SaturnTransitMap() {
  const [moonSignNum, setMoonSignNum] = useState<number>(1);
  const [saturnHouse, setSaturnHouse] = useState<number>(3);
  const [ashtamaJup, setAshtamaJup] = useState<boolean>(false);
  const [ashtamaLord, setAshtamaLord] = useState<boolean>(false);
  const [ashtamaBenefics, setAshtamaBenefics] = useState<boolean>(false);

  const moonRashi = useMemo(() => RASHIS.find(r => r.number === moonSignNum) || RASHIS[0], [moonSignNum]);
  const saturnSignNum = useMemo(() => ((moonSignNum + saturnHouse - 1 - 1) % 12) + 1, [moonSignNum, saturnHouse]);
  const saturnRashi = useMemo(() => RASHIS.find(r => r.number === saturnSignNum) || RASHIS[0], [saturnSignNum]);

  const activeHouseData = useMemo(() => {
    const data = { ...HOUSE_DATA[saturnHouse] };
    if (saturnHouse === 8) {
      if (ashtamaJup) { data.quality = "Favourable"; data.color = GREEN; data.details = "Jupiter aspects Saturn: completely cancels Aṣṭama Śani."; }
      else if (ashtamaLord || ashtamaBenefics) { data.quality = "Mixed"; data.color = SLATE_BLUE; data.details = `Mitigated by: ${ashtamaLord ? "strong 8th lord " : ""}${ashtamaBenefics ? "natal benefics" : ""}.`; }
    }
    return data;
  }, [saturnHouse, ashtamaJup, ashtamaLord, ashtamaBenefics]);

  const sectors = useMemo(() => {
    const coords = [];
    for (let i = 0; i < 12; i++) {
      const houseNum = i + 1;
      const angleDeg = i * 30 - 90;
      coords.push({ houseNum, angleDeg });
    }
    return coords;
  }, []);

  return (
    <div className="gl-surface-twilight-glass" style={{ padding: "20px", borderRadius: "16px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", boxShadow: "0 8px 32px rgba(72, 48, 16, 0.05)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "14px" }}>
      
      <div>
        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: GOLD_DEEP }}>
          <IAST>Śanigochara-Nakṣa</IAST> — 12-Position Saturn Map
        </h3>
        <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: INK_SECONDARY }}>Upachaya houses (3, 6, 11) are favourable. Always check Saturn's position from the Moon.</p>
      </div>

      {/* ─── CONTROLS BAR (TOP) ─── */}
      <div style={{ background: "#ffffff", padding: "12px", borderRadius: "10px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 700, color: GOLD_DEEP, whiteSpace: "nowrap" }}>
            <Moon size={14} /> Moon Sign
          </div>
          {RASHIS.map(r => (
            <button key={r.number} onClick={() => setMoonSignNum(r.number)} style={{
              padding: "4px 7px", borderRadius: "5px", border: moonSignNum === r.number ? `1.5px solid ${GOLD}` : "1px solid rgba(0,0,0,0.08)",
              background: moonSignNum === r.number ? "rgba(156,122,47,0.08)" : "#ffffff", fontSize: "10px", fontWeight: moonSignNum === r.number ? 700 : 500,
              cursor: "pointer", textAlign: "center", color: moonSignNum === r.number ? GOLD_DEEP : INK_SECONDARY
            }}>
              <div style={{ fontWeight: 700 }}>{r.nameEnglish}</div>
              <div style={{ fontSize: "8px", opacity: 0.85 }}><IAST>{r.nameIAST}</IAST></div>
            </button>
          ))}
        </div>
        {saturnHouse === 8 && (
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center", borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: "8px" }}>
            <span style={{ fontSize: "10px", fontWeight: 700, color: RED }}>🛡️ Aṣṭama Cancellations:</span>
            <label style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", cursor: "pointer" }}><input type="checkbox" checked={ashtamaJup} onChange={(e) => setAshtamaJup(e.target.checked)} style={{ accentColor: RED }} /> Jupiter aspect</label>
            <label style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", cursor: "pointer" }}><input type="checkbox" checked={ashtamaLord} onChange={(e) => setAshtamaLord(e.target.checked)} style={{ accentColor: RED }} /> Strong 8th lord</label>
            <label style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", cursor: "pointer" }}><input type="checkbox" checked={ashtamaBenefics} onChange={(e) => setAshtamaBenefics(e.target.checked)} style={{ accentColor: RED }} /> Benefics in 8th</label>
          </div>
        )}
      </div>

      {/* ─── MAIN SPLIT: COMPASS + VERDICT ─── */}
      <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
        {/* Compass */}
        <div style={{ flex: "0 0 280px", background: "#ffffff", padding: "14px", borderRadius: "12px", border: "1px solid rgba(156,122,47,0.1)", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ position: "relative", width: "260px", height: "260px" }}>
            <svg width="260" height="260" viewBox="0 0 300 300">
              <circle cx="150" cy="150" r="130" fill="none" stroke="rgba(156,122,47,0.15)" strokeWidth="1.5" />
              <circle cx="150" cy="150" r="75" fill="none" stroke="rgba(156,122,47,0.08)" strokeWidth="1" />
              {sectors.map((s) => {
                const baseData = HOUSE_DATA[s.houseNum];
                const angleRad = ((s.angleDeg + 15) * Math.PI) / 180;
                let color = baseData.color;
                if (s.houseNum === 8) { if (ashtamaJup) color = GREEN; else if (ashtamaLord || ashtamaBenefics) color = SLATE_BLUE; }
                const fill = `${color}0F`;
                const stroke = color;
                const isCurrentSaturn = s.houseNum === saturnHouse;
                const pathData = [`M ${150 + 75 * Math.cos((s.angleDeg * Math.PI) / 180)} ${150 + 75 * Math.sin((s.angleDeg * Math.PI) / 180)}`, `L ${150 + 130 * Math.cos((s.angleDeg * Math.PI) / 180)} ${150 + 130 * Math.sin((s.angleDeg * Math.PI) / 180)}`, `A 130 130 0 0 1 ${150 + 130 * Math.cos(((s.angleDeg + 30) * Math.PI) / 180)} ${150 + 130 * Math.sin(((s.angleDeg + 30) * Math.PI) / 180)}`, `L ${150 + 75 * Math.cos(((s.angleDeg + 30) * Math.PI) / 180)} ${150 + 75 * Math.sin(((s.angleDeg + 30) * Math.PI) / 180)}`, `A 75 75 0 0 0 ${150 + 75 * Math.cos((s.angleDeg * Math.PI) / 180)} ${150 + 75 * Math.sin((s.angleDeg * Math.PI) / 180)}`, "Z"].join(" ");
                const signNum = ((moonSignNum + s.houseNum - 1 - 1) % 12) + 1;
                const r = RASHIS[signNum - 1];
                const ptSign = { x: 150 + 116 * Math.cos(angleRad), y: 150 + 116 * Math.sin(angleRad) };
                const ptName = { x: 150 + 96 * Math.cos(angleRad), y: 150 + 96 * Math.sin(angleRad) };
                const ptHouse = { x: 150 + 60 * Math.cos(angleRad), y: 150 + 60 * Math.sin(angleRad) };
                return (
                  <g key={s.houseNum} style={{ cursor: "pointer" }} onClick={() => setSaturnHouse(s.houseNum)}>
                    <path d={pathData} fill={fill} stroke={isCurrentSaturn ? GOLD : stroke} strokeWidth={isCurrentSaturn ? "2.5" : "0.8"} style={{ transition: "all 0.15s" }} />
                    <text x={ptSign.x} y={ptSign.y} textAnchor="middle" style={{ fontSize: "8px", fontWeight: 700, fill: INK_PRIMARY }}>{r.nameEnglish}</text>
                    <text x={ptName.x} y={ptName.y + 1} textAnchor="middle" style={{ fontSize: "7px", fill: INK_SECONDARY }}><IAST>{baseData.nameIAST}</IAST></text>
                    <text x={ptHouse.x} y={ptHouse.y} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "9px", fontWeight: 800, fill: stroke }}>H{s.houseNum}</text>
                  </g>
                );
              })}
              {(() => { const coord = sectors[saturnHouse - 1]; const angleRad = ((coord.angleDeg + 15) * Math.PI) / 180; const sx = 150 + 85 * Math.cos(angleRad); const sy = 150 + 85 * Math.sin(angleRad); return (<g style={{ pointerEvents: "none" }}><circle cx={sx} cy={sy} r="10.5" fill="#1e293b" stroke="#ffffff" strokeWidth="1" /><text x={sx} y={sy} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "9px", fill: "#ffffff", fontWeight: 700 }}>♄</text></g>); })()}
              <circle cx="150" cy="150" r="32" fill="rgba(0,0,0,0.03)" />
              <circle cx="150" cy="132" r="8" fill={GOLD} stroke="#ffffff" strokeWidth="1" />
              <text x="150" y="132" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "8px", fill: "#ffffff" }}>☽</text>
              <text x="150" y="152" textAnchor="middle" style={{ fontSize: "7.5px", fontWeight: 700, fill: INK_MUTED }}>CHANDRA</text>
            </svg>
          </div>
          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <span style={{ fontSize: "9px", fontWeight: 700, color: GREEN, display: "flex", alignItems: "center", gap: "3px" }}><span style={{ width: "8px", height: "8px", borderRadius: "4px", background: GREEN }} /> Upachaya</span>
            <span style={{ fontSize: "9px", fontWeight: 700, color: RED, display: "flex", alignItems: "center", gap: "3px" }}><span style={{ width: "8px", height: "8px", borderRadius: "4px", background: RED }} /> Duṣṭhāna</span>
            <span style={{ fontSize: "9px", fontWeight: 700, color: SLATE_BLUE, display: "flex", alignItems: "center", gap: "3px" }}><span style={{ width: "8px", height: "8px", borderRadius: "4px", background: SLATE_BLUE }} /> Mixed</span>
          </div>
        </div>

        {/* Verdict */}
        <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "10px", minWidth: 0 }}>
          <div style={{ background: "rgba(156,122,47,0.03)", border: `1.2px solid rgba(156,122,47,0.15)`, borderRadius: "12px", padding: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <span style={{ fontSize: "10px", fontWeight: 800, textTransform: "uppercase", padding: "3px 6px", borderRadius: "4px", background: activeHouseData.color, color: "#ffffff" }}>{activeHouseData.quality}</span>
              <span style={{ fontSize: "11px", fontWeight: 700, color: GOLD_DEEP }}><IAST>{activeHouseData.nameIAST}</IAST></span>
            </div>
            <h4 style={{ margin: "4px 0", fontSize: "14px", fontWeight: 700, color: activeHouseData.color }}>House {saturnHouse} from Moon: {activeHouseData.theme}</h4>
            <p style={{ margin: "6px 0 0 0", fontSize: "12px", lineHeight: "1.45", color: INK_SECONDARY }}>
              Moon in <strong>{moonRashi.nameEnglish} (<IAST>{moonRashi.nameIAST}</IAST>)</strong>, Saturn in H{saturnHouse} occupies <strong>{saturnRashi.nameEnglish} (<IAST>{saturnRashi.nameIAST}</IAST>)</strong>. {activeHouseData.details}
            </p>
            <p className="mt-2 text-[10px] italic" style={{ color: INK_MUTED }}>
              <Info size={10} className="inline mr-1" />
              3rd, 6th, 11th = <IAST>upachaya</IAST> (growth). Saturn does well here. 1st, 2nd, 4th, 7th, 8th, 12th are challenging. Always check dignity and active <IAST>daśā</IAST>.
            </p>
          </div>
          <div className="rounded-lg p-3 text-[10px]" style={{ background: SURFACE_MANUSCRIPT, border: "1px solid var(--gl-gold-hairline)", color: INK_MUTED }}>
            <strong>Source:</strong> <IAST>Bṛhat Pārāśara Horā Śāstra</IAST> (gochara-phala); <IAST>Phaladīpikā</IAST> — Upachaya houses (3, 6, 10, 11) are growth houses. 8th (<IAST>Aṣṭama</IAST>) is a <IAST>duṣṭhāna</IAST>; Jupiter's aspect cancels its malefic effect.
          </div>
        </div>
      </div>
    </div>
  );
}
