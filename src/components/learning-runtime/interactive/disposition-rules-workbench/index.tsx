"use client";

import { useState, useMemo } from "react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#9C7A2F";
const GREEN = "#10B981";
const RED = "#EF4444";
const ORANGE = "#F59E0B";

const PLANET_NAMES = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];

export function DispositionRulesWorkbench() {
  const [queryType, setQueryType] = useState<"marriage" | "career" | "custom">("marriage");
  const [customQueryHouses, setCustomQueryHouses] = useState<number[]>([1, 7]);
  
  // 3-element significator playground state
  const [occupancy, setOccupancy] = useState<number>(11);
  const [ownership, setOwnership] = useState<number[]>([2]);
  const [ownSubLord, setOwnSubLord] = useState<string>("Venus");
  
  // Toggles for conditions
  const [overrideDignity, setOverrideDignity] = useState<"Exalted" | "Own" | "Neutral" | "Debilitated">("Own");
  const [overrideRP, setOverrideRP] = useState<boolean>(true);
  const [overrideAspect, setOverrideAspect] = useState<boolean>(true);
  const [overrideAfflicted, setOverrideAfflicted] = useState<boolean>(false);

  // Target houses computation
  const targetHouses = useMemo(() => {
    if (queryType === "marriage") return [2, 7, 11];
    if (queryType === "career") return [2, 6, 10, 11];
    return customQueryHouses;
  }, [queryType, customQueryHouses]);

  // Significator status computation
  const isSignificator = useMemo(() => {
    const hasOccupancy = targetHouses.includes(occupancy);
    const hasOwnership = ownership.some(h => targetHouses.includes(h));
    
    // Natural marriage significator check
    let hasSubLordSignification = false;
    if (queryType === "marriage" && ownSubLord === "Venus") {
      hasSubLordSignification = true;
    }
    return hasOccupancy || hasOwnership || hasSubLordSignification;
  }, [occupancy, ownership, ownSubLord, targetHouses, queryType]);

  // Verdict logic
  const verdictDetails = useMemo(() => {
    // 4 YES conditions
    const yes1 = isSignificator;
    const yes2 = overrideDignity === "Exalted" || overrideDignity === "Own";
    const yes3 = overrideRP;
    const yes4 = overrideAspect;

    // 4 NO conditions
    const no1 = !isSignificator;
    const no2 = overrideDignity === "Debilitated";
    const no3 = !overrideRP;
    const no4 = overrideAfflicted;

    const yesCount = [yes1, yes2, yes3, yes4].filter(Boolean).length;
    const noCount = [no1, no2, no3, no4].filter(Boolean).length;

    if (no1) {
      return {
        verdict: "NO" as const,
        reason: "The significator gate is closed. The sub-lord does not signify any relevant houses for this query. This is a gating failure; dignity and timing cannot manifest a promise without a connection.",
        yesCount,
        noCount
      };
    }

    if (yesCount === 4 && noCount === 0) {
      return {
        verdict: "YES" as const,
        reason: "All 4 YES conditions are satisfied. The sub-lord signifies the houses, holds strong capacity, and timing is confirmed by the Ruling Planets.",
        yesCount,
        noCount
      };
    }

    return {
      verdict: "CONDITIONAL" as const,
      reason: `Mixed signals: The sub-lord is a significator (YES 1 holds), but capacity or timing details are qualified. Active YES conditions: ${yesCount}, Active NO conditions: ${noCount}.`,
      yesCount,
      noCount
    };
  }, [isSignificator, overrideDignity, overrideRP, overrideAspect, overrideAfflicted]);

  return (
    <div className="gl-surface-twilight-glass" style={{ padding: "20px 22px 22px" }} data-interactive="disposition-rules-workbench">
      {/* Header */}
      <section style={{ borderBottom: `1px solid ${HAIRLINE}`, paddingBottom: "0.8rem", marginBottom: "1rem" }}>
        <span style={{ color: GOLD, fontSize: "9px", textTransform: "uppercase", fontWeight: 900, letterSpacing: "0.08em" }}>Module 16 · Chapter 4 · Lesson 3</span>
        <h1 style={{ margin: "0.1rem 0 0", color: GOLD, fontSize: "1.3rem", fontWeight: 700 }}>Cuspal Sub-Lord Disposition Workbench</h1>
      </section>

      {/* Main split */}
      <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "1rem" }}>
        
        {/* Left Panel: Inputs and Playground */}
        <div style={{ flex: "1 1 20rem", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          
          {/* Query Selector */}
          <div style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "0.8rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <span style={{ fontSize: "10px", color: INK_MUTED, textTransform: "uppercase", fontWeight: 700 }}>Question Type:</span>
              <div style={{ display: "flex", gap: "0.25rem" }}>
                {["marriage", "career", "custom"].map((q) => (
                  <button
                    key={q}
                    onClick={() => setQueryType(q as any)}
                    style={{
                      border: `1px solid ${queryType === q ? GOLD : HAIRLINE}`,
                      borderRadius: 4,
                      background: queryType === q ? `${GOLD}15` : "transparent",
                      color: queryType === q ? GOLD : INK_SECONDARY,
                      padding: "0.2rem 0.4rem",
                      fontSize: "10px",
                      fontWeight: 700,
                      cursor: "pointer",
                      textTransform: "capitalize"
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
            
            <div style={{ background: "rgba(0,0,0,0.01)", border: `1px solid ${HAIRLINE}`, borderRadius: 6, padding: "0.4rem 0.6rem", fontSize: "11px" }}>
              Target Houses: <strong>{targetHouses.map(h => `${h}H`).join(", ")}</strong>
            </div>

            {queryType === "custom" && (
              <div style={{ display: "flex", gap: "0.2rem", marginTop: "0.4rem", justifyContent: "center" }}>
                {Array.from({ length: 12 }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      const hNum = i + 1;
                      setCustomQueryHouses(prev =>
                        prev.includes(hNum) ? prev.filter(x => x !== hNum) : [...prev, hNum]
                      );
                    }}
                    style={{
                      width: "1.2rem",
                      height: "1.2rem",
                      borderRadius: "50%",
                      border: `1px solid ${customQueryHouses.includes(i + 1) ? GOLD : HAIRLINE}`,
                      background: customQueryHouses.includes(i + 1) ? GOLD : "transparent",
                      color: customQueryHouses.includes(i + 1) ? "#FFF" : INK_SECONDARY,
                      fontSize: "8.5px",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Significator Chain Playground */}
          <div style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "1rem" }}>
            <h3 style={{ margin: "0 0 0.6rem", color: INK_SECONDARY, fontSize: "11px", fontWeight: 800, textTransform: "uppercase" }}>Significator Chain Playground</h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginBottom: "0.6rem" }}>
              <div>
                <label style={{ display: "block", color: INK_MUTED, fontSize: "9px", textTransform: "uppercase", marginBottom: "0.2rem" }}>Occupancy</label>
                <select
                  value={occupancy}
                  onChange={(e) => setOccupancy(Number(e.target.value))}
                  style={{ width: "100%", border: `1px solid ${HAIRLINE}`, borderRadius: 6, background: SURFACE, color: INK_PRIMARY, padding: "0.25rem", fontSize: "11px", fontWeight: 700 }}
                >
                  {Array.from({ length: 12 }, (_, i) => <option key={i} value={i + 1}>{i + 1} House</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: "block", color: INK_MUTED, fontSize: "9px", textTransform: "uppercase", marginBottom: "0.2rem" }}>Own Sub-Lord</label>
                <select
                  value={ownSubLord}
                  onChange={(e) => setOwnSubLord(e.target.value)}
                  style={{ width: "100%", border: `1px solid ${HAIRLINE}`, borderRadius: 6, background: SURFACE, color: INK_PRIMARY, padding: "0.25rem", fontSize: "11px", fontWeight: 700 }}
                >
                  {PLANET_NAMES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: "block", color: INK_MUTED, fontSize: "9px", textTransform: "uppercase", marginBottom: "0.2rem" }}>Ownership Houses</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
                {Array.from({ length: 12 }, (_, i) => {
                  const isChecked = ownership.includes(i + 1);
                  return (
                    <button
                      key={i}
                      onClick={() => setOwnership(prev => prev.includes(i + 1) ? prev.filter(x => x !== i + 1) : [...prev, i + 1])}
                      style={{
                        border: `1px solid ${isChecked ? GOLD : HAIRLINE}`,
                        borderRadius: 4,
                        background: isChecked ? `${GOLD}1A` : SURFACE,
                        color: isChecked ? GOLD : INK_SECONDARY,
                        padding: "0.2rem 0.35rem",
                        fontSize: "10.5px",
                        fontWeight: isChecked ? 800 : 500,
                        cursor: "pointer"
                      }}
                    >
                      {i + 1}H
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Rules Scorecard and Verdict */}
        <div style={{ flex: "1.2 1 22rem", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          
          {/* Rules Checklist */}
          <div style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "1rem" }}>
            <h3 style={{ margin: "0 0 0.6rem", color: INK_SECONDARY, fontSize: "11px", fontWeight: 800, textTransform: "uppercase" }}>Disposition checklist</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "0.5rem" }}>
              {/* YES Columns */}
              <div>
                <span style={{ color: GREEN, fontWeight: 900, display: "block", borderBottom: `1px dashed ${GREEN}40`, paddingBottom: "0.2rem", marginBottom: "0.4rem", fontSize: "10.5px" }}>YES Conditions</span>
                <div style={{ display: "grid", gap: "0.35rem", fontSize: "11px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <input type="checkbox" checked={isSignificator} disabled style={{ accentColor: GREEN }} />
                    <span style={{ opacity: isSignificator ? 1 : 0.6 }}>1. Significator (Target H)</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", flexWrap: "wrap" }}>
                    <input type="checkbox" checked={overrideDignity === "Exalted" || overrideDignity === "Own"} disabled style={{ accentColor: GREEN }} />
                    <span style={{ opacity: (overrideDignity === "Exalted" || overrideDignity === "Own") ? 1 : 0.6 }}>2. Dignity: </span>
                    <select
                      value={overrideDignity}
                      onChange={(e) => setOverrideDignity(e.target.value as any)}
                      style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 4, padding: "0.1rem", fontSize: "10px", fontWeight: 700 }}
                    >
                      <option value="Exalted">Exalted</option>
                      <option value="Own">Own Sign</option>
                      <option value="Neutral">Neutral</option>
                      <option value="Debilitated">Debilitated</option>
                    </select>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <input type="checkbox" checked={overrideRP} onChange={(e) => setOverrideRP(e.target.checked)} style={{ accentColor: GREEN }} />
                    <span>3. Ruling Planet member</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <input type="checkbox" checked={overrideAspect} onChange={(e) => setOverrideAspect(e.target.checked)} style={{ accentColor: GREEN }} />
                    <span>4. Aspects target cusp</span>
                  </div>
                </div>
              </div>

              {/* NO Columns */}
              <div>
                <span style={{ color: RED, fontWeight: 900, display: "block", borderBottom: `1px dashed ${RED}40`, paddingBottom: "0.2rem", marginBottom: "0.4rem", fontSize: "10.5px" }}>NO Conditions</span>
                <div style={{ display: "grid", gap: "0.35rem", fontSize: "11px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <input type="checkbox" checked={!isSignificator} disabled style={{ accentColor: RED }} />
                    <span style={{ opacity: !isSignificator ? 1 : 0.6 }}>1. Non-Significator</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <input type="checkbox" checked={overrideDignity === "Debilitated"} disabled style={{ accentColor: RED }} />
                    <span style={{ opacity: overrideDignity === "Debilitated" ? 1 : 0.6 }}>2. Debilitated</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <input type="checkbox" checked={!overrideRP} disabled style={{ accentColor: RED }} />
                    <span style={{ opacity: !overrideRP ? 1 : 0.6 }}>3. Absent from RPs</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <input type="checkbox" checked={overrideAfflicted} onChange={(e) => setOverrideAfflicted(e.target.checked)} style={{ accentColor: RED }} />
                    <span>4. Afflicted by Malefics</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Verdict Card */}
          <div
            style={{
              border: `1px solid ${verdictDetails.verdict === "YES" ? GREEN : verdictDetails.verdict === "NO" ? RED : ORANGE}`,
              borderRadius: 12,
              background: `${verdictDetails.verdict === "YES" ? GREEN : verdictDetails.verdict === "NO" ? RED : ORANGE}0A`,
              padding: "1rem",
              display: "grid",
              gap: "0.3rem"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong style={{ fontSize: "12.5px", color: verdictDetails.verdict === "YES" ? GREEN : verdictDetails.verdict === "NO" ? RED : ORANGE }}>
                DISPOSITION VERDICT: {verdictDetails.verdict}
              </strong>
              <span style={{ fontSize: "15px" }}>
                {verdictDetails.verdict === "YES" ? "✅" : verdictDetails.verdict === "NO" ? "❌" : "⚠"}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: "11px", color: INK_SECONDARY, lineHeight: 1.4 }}>
              {verdictDetails.reason}
            </p>
          </div>

          {/* Explainer Table instead of raw JSON */}
          <div style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: 12, padding: "0.8rem", fontSize: "10.5px" }}>
            <span style={{ color: GOLD, fontSize: "9px", textTransform: "uppercase", fontWeight: 900, display: "block", marginBottom: "0.3rem" }}>Active Verdict Parameters</span>
            <table style={{ width: "100%", borderCollapse: "collapse", color: INK_SECONDARY }}>
              <tbody>
                <tr style={{ borderBottom: `1px solid ${HAIRLINE}30` }}>
                  <td style={{ padding: "0.25rem 0" }}>Active Query Type</td>
                  <td style={{ padding: "0.25rem 0", textAlign: "right", fontWeight: 700 }}>{queryType.toUpperCase()}</td>
                </tr>
                <tr style={{ borderBottom: `1px solid ${HAIRLINE}30` }}>
                  <td style={{ padding: "0.25rem 0" }}>Target Cusp houses</td>
                  <td style={{ padding: "0.25rem 0", textAlign: "right", fontWeight: 700 }}>{targetHouses.join(", ")}</td>
                </tr>
                <tr style={{ borderBottom: `1px solid ${HAIRLINE}30` }}>
                  <td style={{ padding: "0.25rem 0" }}>Significator gate status</td>
                  <td style={{ padding: "0.25rem 0", textAlign: "right", fontWeight: 700, color: isSignificator ? GREEN : RED }}>{isSignificator ? "OPEN" : "CLOSED"}</td>
                </tr>
                <tr>
                  <td style={{ padding: "0.25rem 0" }}>YES conditions met / NO conditions active</td>
                  <td style={{ padding: "0.25rem 0", textAlign: "right", fontWeight: 700 }}>{verdictDetails.yesCount} YES / {verdictDetails.noCount} NO</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
