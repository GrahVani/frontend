"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, Filter, ListChecks, RotateCcw, Search, ShieldAlert } from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const VERMILION = "#A23A1E";

type Varga = {
  d: number;
  name: string;
  sanskrit: string;
  part: string;
  degrees: number | null;
  domain: string;
  tier1: boolean;
  special?: "unequal" | "finest";
};

const VARGAS: Varga[] = [
  { d: 1, name: "Rashi", sanskrit: "Rasi", part: "30 deg 00 min", degrees: 30, domain: "whole life, body, macroscopic chart", tier1: true },
  { d: 2, name: "Hora", sanskrit: "Hora", part: "15 deg 00 min", degrees: 15, domain: "wealth", tier1: false },
  { d: 3, name: "Drekkana", sanskrit: "Drekkana", part: "10 deg 00 min", degrees: 10, domain: "siblings, courage, well-being", tier1: true },
  { d: 4, name: "Chaturthamsha", sanskrit: "Chaturthamsha", part: "7 deg 30 min", degrees: 7.5, domain: "property, fortune, fixed assets", tier1: false },
  { d: 7, name: "Saptamsha", sanskrit: "Saptamsha", part: "about 4 deg 17 min", degrees: 30 / 7, domain: "children, progeny", tier1: true },
  { d: 9, name: "Navamsha", sanskrit: "Navamsha", part: "3 deg 20 min", degrees: 30 / 9, domain: "marriage, dharma, general strength", tier1: true },
  { d: 10, name: "Dashamsha", sanskrit: "Dashamsha", part: "3 deg 00 min", degrees: 3, domain: "career, profession", tier1: true },
  { d: 12, name: "Dvadashamsha", sanskrit: "Dvadashamsha", part: "2 deg 30 min", degrees: 2.5, domain: "parents", tier1: true },
  { d: 16, name: "Shodashamsha", sanskrit: "Shodashamsha", part: "1 deg 52 min 30 sec", degrees: 30 / 16, domain: "vehicles, material comforts", tier1: false },
  { d: 20, name: "Vimshamsha", sanskrit: "Vimshamsha", part: "1 deg 30 min", degrees: 1.5, domain: "spirituality, worship", tier1: false },
  { d: 24, name: "Chaturvimshamsha", sanskrit: "Chaturvimshamsha", part: "1 deg 15 min", degrees: 1.25, domain: "education, learning", tier1: false },
  { d: 27, name: "Bhamsha", sanskrit: "Bhamsha / Nakshatramsha", part: "about 1 deg 06 min", degrees: 30 / 27, domain: "strengths and weaknesses", tier1: false },
  { d: 30, name: "Trimshamsha", sanskrit: "Trimshamsha", part: "unequal", degrees: null, domain: "misfortunes, disease, evils", tier1: false, special: "unequal" },
  { d: 40, name: "Khavedamsha", sanskrit: "Khavedamsha", part: "0 deg 45 min", degrees: 0.75, domain: "maternal lineage", tier1: false },
  { d: 45, name: "Akshavedamsha", sanskrit: "Akshavedamsha", part: "0 deg 40 min", degrees: 2 / 3, domain: "paternal lineage", tier1: false },
  { d: 60, name: "Shashtyamsha", sanskrit: "Shashtyamsha", part: "0 deg 30 min", degrees: 0.5, domain: "karmic substrate, deepest roots", tier1: false, special: "finest" },
];

const DOMAIN_SHORTCUTS = [
  { label: "Education", match: "education" },
  { label: "Vehicles", match: "vehicles" },
  { label: "Career", match: "career" },
  { label: "Marriage", match: "marriage" },
  { label: "Children", match: "children" },
  { label: "Karma", match: "karmic" },
];

export function VargaReferenceTable() {
  const [selectedD, setSelectedD] = useState(9);
  const [tierOnly, setTierOnly] = useState(false);
  const [highlightSpecial, setHighlightSpecial] = useState(true);
  const [query, setQuery] = useState("");

  const selected = VARGAS.find((varga) => varga.d === selectedD) ?? VARGAS[5];
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return VARGAS.filter((varga) => {
      const tierMatch = !tierOnly || varga.tier1;
      const queryMatch = !normalized || `d${varga.d} ${varga.name} ${varga.sanskrit} ${varga.domain}`.toLowerCase().includes(normalized);
      return tierMatch && queryMatch;
    });
  }, [query, tierOnly]);

  const verdict = useMemo(() => {
    if (selected.special === "unequal") {
      return "D30 is the one unequal varga. Do not divide it into thirty equal 1 degree parts.";
    }
    if (selected.special === "finest") {
      return "D60 is the finest standard varga at 30 minutes per part and is highly birth-time sensitive.";
    }
    if (selected.tier1) {
      return `D${selected.d} is part of the Tier-1 emphasis set. Memorise its jurisdiction and read it with D1 context.`;
    }
    return `D${selected.d} belongs to the full sixteen-varga index. Keep its jurisdiction available for later chapters.`;
  }, [selected]);

  return (
    <div data-interactive="varga-reference-table" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Shodasha-varga reference</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>
              Sixteen divisions, sixteen jurisdictions
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 850 }}>
              Select any varga to see its division size, domain, Tier-1 emphasis, and the special D30/D60 cautions.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedD(9);
              setTierOnly(false);
              setHighlightSpecial(true);
              setQuery("");
            }}
            style={buttonStyle(false, BLUE)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(360px, 1.1fr) minmax(300px, 0.9fr)", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Sixteen-row index</p>
              <h3 style={{ margin: "0.15rem 0 0", color: GOLD, fontSize: "1.2rem" }}>
                Sequence: {VARGAS.map((varga) => varga.d).join(", ")}
              </h3>
            </div>
            <strong style={{ color: filtered.length === 16 ? GREEN : BLUE }}>{filtered.length} shown</strong>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(88px, 1fr))", gap: "0.45rem", marginTop: "0.85rem" }}>
            {filtered.map((varga) => {
              const special = highlightSpecial && varga.special;
              const color = special === "unequal" ? VERMILION : special === "finest" ? BLUE : varga.tier1 ? GREEN : GOLD;
              return (
                <button key={varga.d} type="button" onClick={() => setSelectedD(varga.d)} style={vargaCellStyle(selectedD === varga.d, color)}>
                  <strong>D{varga.d}</strong>
                  <span>{varga.name}</span>
                  {special ? <small>{special}</small> : varga.tier1 ? <small>Tier 1</small> : null}
                </button>
              );
            })}
          </div>

          <DivisionScale selected={selected} />
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="Search and filters" icon={<Search size={18} />} color={BLUE}>
            <label style={labelStyle}>
              Find by domain or name
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="career, D24, parents..." style={inputStyle} />
            </label>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button type="button" aria-pressed={tierOnly} onClick={() => setTierOnly((value) => !value)} style={buttonStyle(tierOnly, GREEN)}>
                <Filter size={14} aria-hidden="true" />
                Tier-1 subset
              </button>
              <button type="button" aria-pressed={highlightSpecial} onClick={() => setHighlightSpecial((value) => !value)} style={buttonStyle(highlightSpecial, VERMILION)}>
                <ShieldAlert size={14} aria-hidden="true" />
                Special flags
              </button>
            </div>
          </Panel>

          <Panel title="Domain shortcuts" icon={<ListChecks size={18} />} color={GOLD}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              {DOMAIN_SHORTCUTS.map((shortcut) => (
                <button
                  key={shortcut.label}
                  type="button"
                  onClick={() => {
                    setQuery(shortcut.match);
                    const match = VARGAS.find((varga) => varga.domain.toLowerCase().includes(shortcut.match));
                    if (match) setSelectedD(match.d);
                  }}
                  style={buttonStyle(false, GOLD)}
                >
                  {shortcut.label}
                </button>
              ))}
            </div>
          </Panel>
        </section>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(245px, 1fr))", gap: "1rem", alignItems: "start" }}>
        <ResultCard title={`D${selected.d} ${selected.name}`} value={selected.sanskrit} color={selected.special === "unequal" ? VERMILION : selected.special === "finest" ? BLUE : GOLD} note={`Each part: ${selected.part}.`} />
        <ResultCard title="Jurisdiction" value={selected.domain} color={selected.tier1 ? GREEN : GOLD} note={selected.tier1 ? "In the Tier-1 emphasis set." : "Part of the full sixteen-varga reference."} />
        <section style={{ border: `1px solid ${(selected.special ? VERMILION : GOLD)}66`, borderRadius: 8, background: `${(selected.special ? VERMILION : GOLD)}12`, padding: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: selected.special ? VERMILION : GOLD, fontWeight: 800, fontSize: "1.02rem", lineHeight: 1.25 }}>
            <BadgeCheck size={18} />
            Memory verdict
          </div>
          <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{verdict}</p>
        </section>
      </div>
    </div>
  );
}

function DivisionScale({ selected }: { selected: Varga }) {
  const barWidth = selected.degrees ? Math.max(8, (selected.degrees / 30) * 500) : 96;
  return (
    <svg viewBox="0 0 560 120" role="img" aria-label="Varga part size scale from D1 to selected division" style={{ width: "100%", marginTop: "0.9rem", display: "block" }}>
      <rect x="28" y="26" width="504" height="34" rx="8" fill={`${GOLD}13`} stroke={HAIRLINE} />
      <rect x="28" y="26" width={barWidth} height="34" rx="8" fill={selected.special === "unequal" ? `${VERMILION}55` : `${GREEN}55`} />
      <text x="28" y="84" fill={INK_MUTED} fontSize="11.5" fontWeight="700">D1: 30 deg</text>
      <text x="532" y="84" textAnchor="end" fill={INK_MUTED} fontSize="11.5" fontWeight="700">D60: 30 min</text>
      <text x="280" y="108" textAnchor="middle" fill={selected.special === "unequal" ? VERMILION : GOLD} fontSize="12" fontWeight="800">
        {selected.special === "unequal" ? "D30 uses a special unequal construction" : `D${selected.d} part size: ${selected.part}`}
      </text>
    </svg>
  );
}

function ResultCard({ title, value, color, note }: { title: string; value: string; color: string; note: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}0D`, padding: "0.75rem" }}>
      <div style={{ color, fontWeight: 800 }}>{title}</div>
      <strong style={{ display: "block", marginTop: "0.45rem", color: INK_PRIMARY }}>{value}</strong>
      <p style={{ margin: "0.25rem 0 0", color: INK_MUTED, lineHeight: 1.4 }}>{note}</p>
    </div>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 800, fontSize: "1.02rem", lineHeight: 1.25 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem", display: "grid", gap: "0.7rem" }}>{children}</div>
    </section>
  );
}

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY,
    padding: "0.52rem 0.68rem",
    fontWeight: 700,
    cursor: "pointer",
  };
}

function vargaCellStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "grid",
    gap: "0.18rem",
    minHeight: 82,
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}18` : "rgba(255,251,241,0.52)",
    color: active ? color : INK_PRIMARY,
    padding: "0.55rem",
    textAlign: "left",
    cursor: "pointer",
  };
}

const inputStyle: CSSProperties = {
  width: "100%",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: "rgba(255,251,241,0.78)",
  color: INK_PRIMARY,
  padding: "0.58rem 0.65rem",
  fontWeight: 700,
};

const labelStyle: CSSProperties = {
  display: "grid",
  gap: "0.35rem",
  color: INK_MUTED,
  fontWeight: 800,
  fontSize: "0.78rem",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 800,
};
