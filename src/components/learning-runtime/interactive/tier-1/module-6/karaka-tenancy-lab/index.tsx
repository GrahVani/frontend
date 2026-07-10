"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { CircleDot, Eye, Layers, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";

type ScenarioKey = "reinforce" | "modulate" | "both";
type TenantKey = "natural" | "saturn" | "rahu" | "mars" | "none";

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

const SCENARIOS = {
  reinforce: {
    label: "Reinforcing",
    house: 5,
    houseName: "Putra",
    domain: "children, intellect, merit",
    natural: "Jupiter",
    tenant: "Jupiter",
    color: GOLD,
    note: "The natural karaka is also the tenant. The house theme is strongly emphasized, then judged by Jupiter's condition.",
  },
  modulate: {
    label: "Modulating",
    house: 9,
    houseName: "Bhagya",
    domain: "father, dharma, fortune",
    natural: "Jupiter",
    tenant: "Saturn",
    color: BLUE,
    note: "The natural karaka remains Jupiter, but Saturn as tenant colours the 9th with discipline, delay, duty, or seriousness.",
  },
  both: {
    label: "Check both",
    house: 4,
    houseName: "Sukha",
    domain: "mother, home, inner base",
    natural: "Moon",
    tenant: "Rahu",
    color: PURPLE,
    note: "Read the Moon wherever it sits, and also read Rahu as the chart-specific tenant of the 4th.",
  },
} as const;

const TENANTS = {
  natural: { label: "Natural karaka tenant", planet: "same", color: GOLD, note: "Reinforcement: the fixed karaka and the occupant point to the same house matter." },
  saturn: { label: "Saturn tenant", planet: "Saturn", color: BLUE, note: "Modulation: restraint, duty, delay, time, seriousness, and endurance colour the house." },
  rahu: { label: "Rahu tenant", planet: "Rahu", color: PURPLE, note: "Modulation: unusual, unsettled, foreign, amplifying, or restless themes colour the house." },
  mars: { label: "Mars tenant", planet: "Mars", color: VERMILION, note: "Modulation: heat, conflict, drive, speed, and courage colour the house." },
  none: { label: "No tenant", planet: "none", color: INK_MUTED, note: "No karaka-by-tenancy is active. Read the natural karaka, lord, aspects, and house condition." },
} as const;

export function KarakaTenancyLab() {
  const [scenario, setScenario] = useState<ScenarioKey>("reinforce");
  const [tenant, setTenant] = useState<TenantKey>("natural");
  const [showErrors, setShowErrors] = useState(true);
  const active = SCENARIOS[scenario];
  const tenantState = TENANTS[tenant];
  const tenantPlanet = tenant === "natural" ? active.natural : tenantState.planet;
  const reinforces = tenantPlanet === active.natural;

  const synthesis = useMemo(() => {
    if (tenant === "none") return `For ${active.houseName}, the fixed natural karaka is ${active.natural}. With no occupant, do not invent a tenant-karaka; continue with lord, aspects, and ${active.natural}'s condition.`;
    if (reinforces) return `${active.natural} is both natural karaka and tenant of the ${active.house}th. The two senses reinforce, so the house theme is emphasized; still judge the planet's dignity and condition.`;
    return `${active.natural} remains the fixed natural karaka of ${active.houseName}. ${tenantPlanet} is the chart-specific tenant-karaka, so it modulates the house rather than replacing ${active.natural}.`;
  }, [active, reinforces, tenant, tenantPlanet]);

  return (
    <div data-interactive="karaka-tenancy-lab" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Two senses of karaka</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              Natural karaka vs karaka by tenancy
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 850 }}>
              Choose a house scenario and tenant to see when the two karaka senses reinforce, modulate, or simply require separate checking.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setScenario("reinforce");
              setTenant("natural");
              setShowErrors(true);
            }}
            style={buttonStyle(false)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 1fr) minmax(320px, 0.9fr)", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Selected house</p>
              <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.2rem" }}>
                {active.house}. {active.houseName}: {active.domain}
              </h3>
            </div>
            <strong style={{ color: reinforces ? GREEN : active.color }}>{reinforces ? "Reinforcing" : tenant === "none" ? "No tenant" : "Modulating"}</strong>
          </div>
          <KarakaTenancySvg house={active.house} natural={active.natural} tenant={tenantPlanet} naturalColor={active.color} tenantColor={tenantState.color} reinforces={reinforces} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "0.65rem" }}>
            {(Object.keys(SCENARIOS) as ScenarioKey[]).map((key) => (
              <button key={key} type="button" onClick={() => { setScenario(key); setTenant(key === "reinforce" ? "natural" : key === "modulate" ? "saturn" : "rahu"); }} style={classCardStyle(scenario === key, SCENARIOS[key].color)}>
                <span style={{ display: "flex", gap: "0.45rem", alignItems: "center", fontWeight: 950 }}><CircleDot size={15} />{SCENARIOS[key].label}</span>
                <span style={{ color: INK_MUTED, fontSize: "0.82rem" }}>{SCENARIOS[key].house}. {SCENARIOS[key].houseName}</span>
              </button>
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Tenant in this chart" icon={<Sparkles size={18} />} color={tenantState.color}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.65rem" }}>
              {(Object.keys(TENANTS) as TenantKey[]).map((key) => (
                <button key={key} type="button" aria-pressed={tenant === key} onClick={() => setTenant(key)} style={smallChipStyle(tenant === key, TENANTS[key].color)}>
                  {TENANTS[key].label}
                </button>
              ))}
            </div>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.5 }}>{tenantState.note}</p>
          </Panel>

          <Panel title="Reading discipline" icon={<Layers size={18} />} color={GREEN}>
            <ol style={{ margin: 0, paddingLeft: "1.25rem", color: INK_SECONDARY, lineHeight: 1.65 }}>
              <li>Recall the fixed naisargika karaka.</li>
              <li>Note any tenant planet in the house.</li>
              <li>Synthesise reinforcement or modulation.</li>
              <li>Check the natural karaka&apos;s own condition.</li>
            </ol>
          </Panel>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(320px, 1fr) minmax(320px, 0.9fr)", gap: "1rem", alignItems: "start" }}>
        <Panel title="Two opposite mistakes" icon={<ShieldCheck size={18} />} color={showErrors ? VERMILION : GOLD}>
          <button type="button" aria-pressed={showErrors} onClick={() => setShowErrors((value) => !value)} style={smallChipStyle(showErrors, VERMILION)}>
            {showErrors ? "Mistakes visible" : "Show mistakes"}
          </button>
          <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>
            {showErrors
              ? "Only-natural misses the chart-specific tenant. Only-tenant misses the house's enduring natural significator. Both must be read."
              : "Be explicit with language: naisargika is fixed and universal; tenancy is chart-specific and occupant-based."}
          </p>
        </Panel>

        <section style={{ border: `1px solid ${GOLD}66`, borderRadius: 8, background: `${GOLD}16`, padding: "1rem" }}>
          <strong style={{ color: GOLD }}>Karaka synthesis</strong>
          <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{synthesis}</p>
        </section>
      </div>
    </div>
  );
}

function KarakaTenancySvg({ house, natural, tenant, naturalColor, tenantColor, reinforces }: { house: number; natural: string; tenant: string; naturalColor: string; tenantColor: string; reinforces: boolean }) {
  const center = 170;
  const naturalX = 92;
  const tenantX = 248;
  const tenantLabel = tenant === "none" ? "No tenant" : tenant;

  return (
    <svg viewBox="0 0 340 250" role="img" aria-label="Natural karaka and tenant karaka interaction diagram" style={{ width: "100%", maxHeight: 330, margin: "0.65rem auto 0.8rem", display: "block" }}>
      <rect x="18" y="20" width="304" height="204" rx="8" fill={`${GOLD}0D`} stroke={HAIRLINE} />
      <circle cx={center} cy={122} r={44} fill="#FFF9EA" stroke={reinforces ? GREEN : GOLD} strokeWidth="3" />
      <text x={center} y={116} textAnchor="middle" fill={GOLD} fontSize="25" fontWeight="900">{house}</text>
      <text x={center} y={140} textAnchor="middle" fill={INK_SECONDARY} fontSize="12" fontWeight="850">Bhava</text>

      <circle cx={naturalX} cy={122} r={34} fill={`${naturalColor}18`} stroke={naturalColor} strokeWidth="2.5" />
      <Eye x={naturalX - 8} y={93} size={16} color={naturalColor} />
      <text x={naturalX} y={125} textAnchor="middle" fill={naturalColor} fontSize="13" fontWeight="900">{natural}</text>
      <text x={naturalX} y={160} textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight="850">fixed</text>

      <circle cx={tenantX} cy={122} r={34} fill={`${tenantColor}18`} stroke={tenantColor} strokeWidth="2.5" />
      <Sparkles x={tenantX - 8} y={93} size={16} color={tenantColor} />
      <text x={tenantX} y={125} textAnchor="middle" fill={tenantColor} fontSize="13" fontWeight="900">{tenantLabel}</text>
      <text x={tenantX} y={160} textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight="850">tenant</text>

      <path d={`M ${naturalX + 34} 122 C 126 84, 140 84, ${center - 44} 122`} fill="none" stroke={naturalColor} strokeWidth="3" strokeLinecap="round" />
      <path d={`M ${tenantX - 34} 122 C 214 84, 200 84, ${center + 44} 122`} fill="none" stroke={tenantColor} strokeWidth="3" strokeLinecap="round" />
      <text x={center} y={42} textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="900" letterSpacing="1.2">CONSULT BOTH KARAKA SENSES</text>
      <text x={center} y={210} textAnchor="middle" fill={reinforces ? GREEN : tenant === "none" ? INK_MUTED : GOLD} fontSize="13" fontWeight="900">
        {reinforces ? "reinforcing" : tenant === "none" ? "fixed karaka only; continue with lord/aspects" : "modulating"}
      </text>
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

function buttonStyle(active: boolean): CSSProperties {
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

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.48rem 0.68rem",
    fontWeight: 850,
    cursor: "pointer",
  };
}

function classCardStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "grid",
    gap: "0.35rem",
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}18` : "transparent",
    color,
    padding: "0.7rem",
    cursor: "pointer",
  };
}

const eyebrowStyle: CSSProperties = {
  margin: 0,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 900,
};
