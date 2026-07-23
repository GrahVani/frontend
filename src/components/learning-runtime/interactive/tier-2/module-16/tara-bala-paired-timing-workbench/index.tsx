"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  CalendarDays,
  Clock,
  Heart,
  RotateCcw,
  Search,
} from "lucide-react";
import { workbenchDiagramLayoutStyle, workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const BLUE = "#356CAB";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const PURPLE = "#6B5AA8";

const NAKSHATRAS = [
  "Aśvinī", "Bharaṇī", "Kṛttikā", "Rohiṇī", "Mṛgaśīrṣa", "Ārdrā", "Punarvasu", "Puṣya", "Āśleṣā",
  "Maghā", "Pūrva Phālgunī", "Uttara Phālgunī", "Hasta", "Citrā", "Svātī", "Viśākhā", "Anurādhā", "Jyeṣṭhā",
  "Mūla", "Pūrva Aṣāḍhā", "Uttara Aṣāḍhā", "Śravaṇa", "Dhaniṣṭhā", "Śatabhiṣaj", "Pūrva Bhādrapadā", "Uttara Bhādrapadā", "Revatī",
] as const;

type NakshatraIndex = number;
type PairStatus = "both-auspicious" | "mixed" | "both-inauspicious";

interface Tara {
  name: string;
  auspicious: boolean;
}

const CANDIDATE_DATES = [
  { label: "Candidate 1", date: "6 Nov", nakshatra: "Uttara Aṣāḍhā", index: 20 },
  { label: "Candidate 2", date: "8 Nov", nakshatra: "Puṣya", index: 7 },
  { label: "Candidate 3", date: "11 Nov", nakshatra: "Rohiṇī", index: 3 },
];

function taraFor(count: number): Tara {
  const r = count % 9;
  if (r === 1) return { name: "Janma", auspicious: false };
  if (r === 2) return { name: "Sampat", auspicious: true };
  if (r === 3) return { name: "Vipat", auspicious: false };
  if (r === 4) return { name: "Kṣema", auspicious: true };
  if (r === 5) return { name: "Pratyari", auspicious: false };
  if (r === 6) return { name: "Sādhaka", auspicious: true };
  if (r === 7) return { name: "Vadha", auspicious: false };
  if (r === 8) return { name: "Mitra", auspicious: true };
  return { name: "Ati-Mitra", auspicious: true };
}

function computeTara(birth: NakshatraIndex, candidate: NakshatraIndex): Tara {
  const count = ((candidate - birth + 27) % 27) + 1;
  return taraFor(count);
}

function pairStatus(bride: Tara, groom: Tara): PairStatus {
  if (bride.auspicious && groom.auspicious) return "both-auspicious";
  if (!bride.auspicious && !groom.auspicious) return "both-inauspicious";
  return "mixed";
}

const STATUS_STYLE: Record<PairStatus, { color: string; label: string }> = {
  "both-auspicious": { color: GREEN, label: "Both auspicious" },
  mixed: { color: GOLD, label: "Mixed — fails" },
  "both-inauspicious": { color: VERMILION, label: "Both inauspicious" },
};

export function TaraBalaPairedTimingWorkbench() {
  const [brideIndex, setBrideIndex] = useState<NakshatraIndex>(11);
  const [groomIndex, setGroomIndex] = useState<NakshatraIndex>(16);
  const [selectedCandidate, setSelectedCandidate] = useState<NakshatraIndex>(3);
  const [showDisambiguation, setShowDisambiguation] = useState(false);

  const table = useMemo(() => {
    return NAKSHATRAS.map((name, index) => {
      const bride = computeTara(brideIndex, index);
      const groom = computeTara(groomIndex, index);
      const status = pairStatus(bride, groom);
      return { index, name, bride, groom, status };
    });
  }, [brideIndex, groomIndex]);

  const stats = useMemo(() => {
    return table.reduce(
      (acc, row) => {
        acc[row.status] += 1;
        return acc;
      },
      { "both-auspicious": 0, mixed: 0, "both-inauspicious": 0 }
    );
  }, [table]);

  const period9 = useMemo(() => {
    return Array.from({ length: 9 }, (_, residue) => {
      const index = residue;
      const bride = computeTara(brideIndex, index);
      const groom = computeTara(groomIndex, index);
      return { residue, status: pairStatus(bride, groom) };
    });
  }, [brideIndex, groomIndex]);

  const selectedRow = table[selectedCandidate];
  const filteredCandidates = CANDIDATE_DATES.filter((c) => table[c.index].status === "both-auspicious");

  const reset = () => {
    setBrideIndex(11);
    setGroomIndex(16);
    setSelectedCandidate(3);
    setShowDisambiguation(false);
  };

  return (
    <div data-interactive="tara-bala-paired-timing-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Tārā-bala paired timing workbench</p>
            <h2 style={{ margin: "0.2rem 0 0", color: ACCENT, fontSize: "1.35rem", fontWeight: 600 }}>
              Build the couple&apos;s 27-nakṣatra table once, then filter
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              The bride&apos;s and groom&apos;s tārā-bala outcomes are linked by their fixed birth-nakṣatra offset. Precompute the full table at intake, then look up any candidate date by its Moon nakṣatra.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, ACCENT)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Couple</p>
          <label style={{ ...eyebrowStyle, display: "block", marginBottom: "0.35rem" }}>Bride&apos;s birth nakṣatra</label>
          <select value={brideIndex} onChange={(e) => setBrideIndex(Number(e.target.value))} style={selectStyle}>
            {NAKSHATRAS.map((n, i) => <option key={n} value={i}>{n}</option>)}
          </select>
          <label style={{ ...eyebrowStyle, display: "block", marginBottom: "0.35rem", marginTop: "0.55rem" }}>Groom&apos;s birth nakṣatra</label>
          <select value={groomIndex} onChange={(e) => setGroomIndex(Number(e.target.value))} style={selectStyle}>
            {NAKSHATRAS.map((n, i) => <option key={`g-${n}`} value={i}>{n}</option>)}
          </select>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Table statistics</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.55rem" }}>
            <StatBox count={stats["both-auspicious"]} total={27} label="Both auspicious" color={GREEN} />
            <StatBox count={stats.mixed} total={27} label="Mixed" color={GOLD} />
            <StatBox count={stats["both-inauspicious"]} total={27} label="Both inauspicious" color={VERMILION} />
          </div>
          <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
            The pattern repeats every 9 nakṣatras, but the exact split depends on this couple&apos;s birth-nakṣatra offset.
          </p>
        </section>
      </div>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 520px" }}>
          <p style={eyebrowStyle}>27-nakṣatra paired table</p>
          <div style={{ maxHeight: 360, overflowY: "auto", marginTop: "0.55rem" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
              <thead style={{ position: "sticky", top: 0, background: SURFACE }}>
                <tr>
                  <th style={thStyle}>#</th>
                  <th style={thStyle}>Candidate nakṣatra</th>
                  <th style={thStyle}>Bride tārā</th>
                  <th style={thStyle}>Groom tārā</th>
                  <th style={thStyle}>Pair status</th>
                </tr>
              </thead>
              <tbody>
                {table.map((row) => {
                  const s = STATUS_STYLE[row.status];
                  const isSelected = row.index === selectedCandidate;
                  return (
                    <tr
                      key={row.index}
                      onClick={() => setSelectedCandidate(row.index)}
                      style={{ background: isSelected ? `${s.color}10` : "transparent", cursor: "pointer" }}
                    >
                      <td style={tdStyle}>{row.index + 1}</td>
                      <td style={tdStyle}><strong style={{ fontWeight: 600, color: INK_PRIMARY }}>{row.name}</strong></td>
                      <td style={tdStyle}>
                        <TaraChip tara={row.bride} />
                      </td>
                      <td style={tdStyle}>
                        <TaraChip tara={row.groom} />
                      </td>
                      <td style={tdStyle}>
                        <span style={{ fontSize: "0.75rem", fontWeight: 600, padding: "0.15rem 0.45rem", borderRadius: 4, background: s.color + "15", color: s.color, border: "1px solid " + s.color }}>
                          {s.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 300px" }}>
          <Panel title="Period-9 structure" icon={<Clock size={18} />} color={BLUE}>
            <Period9Svg period9={period9} />
            <p style={bodyTextStyle}>
              Each 9-segment arc repeats three times across the 27 nakṣatras. All nakṣatras sharing the same residue mod 9 have identical paired outcomes.
            </p>
          </Panel>

          <Panel title="Candidate lookup" icon={<Search size={18} />} color={PURPLE}>
            <label style={{ ...eyebrowStyle, display: "block", marginBottom: "0.35rem" }}>Select candidate nakṣatra</label>
            <select value={selectedCandidate} onChange={(e) => setSelectedCandidate(Number(e.target.value))} style={selectStyle}>
              {NAKSHATRAS.map((n, i) => <option key={`c-${n}`} value={i}>{n}</option>)}
            </select>
            <div style={{ marginTop: "0.65rem", padding: "0.55rem", borderRadius: 6, border: "1px solid " + STATUS_STYLE[selectedRow.status].color, background: STATUS_STYLE[selectedRow.status].color + "10" }}>
              <p style={{ margin: 0, color: STATUS_STYLE[selectedRow.status].color, fontWeight: 600 }}>{STATUS_STYLE[selectedRow.status].label}</p>
              <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem" }}>
                Bride: {selectedRow.bride.name} · Groom: {selectedRow.groom.name}
              </p>
            </div>
          </Panel>
        </section>
      </div>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Precompute once, filter many</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.65rem" }}>
            {CANDIDATE_DATES.map((c) => (
              <button key={c.label} type="button" onClick={() => setSelectedCandidate(c.index)} style={buttonStyle(false, BLUE)}>
                <CalendarDays size={14} aria-hidden="true" />
                {c.label}
              </button>
            ))}
          </div>
          <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
            {filteredCandidates.length === 0
              ? "None of the loaded candidates are both-auspicious for this couple."
              : `Both-auspicious candidates: ${filteredCandidates.map((c) => `${c.label} (${c.date}, ${c.nakshatra})`).join(", ")}.`}
          </p>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Paired tārā-bala vs. tārā-kūṭa</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.65rem" }}>
            <button type="button" aria-pressed={!showDisambiguation} onClick={() => setShowDisambiguation(false)} style={smallChipStyle(!showDisambiguation, GREEN)}>
              <Clock size={14} aria-hidden="true" />
              Timing
            </button>
            <button type="button" aria-pressed={showDisambiguation} onClick={() => setShowDisambiguation(true)} style={smallChipStyle(showDisambiguation, PURPLE)}>
              <Heart size={14} aria-hidden="true" />
              Matching
            </button>
          </div>
          <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
            {showDisambiguation
              ? "Tārā-kūṭa compares bride&apos;s birth nakṣatra directly against groom&apos;s birth nakṣatra. It is a matching question, answered once per couple before any muhūrta date is chosen."
              : "Paired muhūrta-tārā-bala compares each party&apos;s birth nakṣatra against a candidate wedding-date&apos;s Moon nakṣatra. It is a timing question, asked fresh for every candidate date."}
          </p>
        </section>
      </div>
    </div>
  );
}

function TaraChip({ tara }: { tara: Tara }) {
  const color = tara.auspicious ? GREEN : VERMILION;
  return (
    <span style={{ fontSize: "0.75rem", fontWeight: 600, padding: "0.12rem 0.4rem", borderRadius: 4, background: color + "12", color, border: "1px solid " + color }}>
      {tara.name}
    </span>
  );
}

function StatBox({ count, total, label, color }: { count: number; total: number; label: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}0F`, padding: "0.7rem", textAlign: "center" }}>
      <p style={{ margin: 0, color, fontSize: "1.35rem", fontWeight: 600 }}>{count}/{total}</p>
      <p style={{ margin: "0.2rem 0 0", color: INK_SECONDARY, fontSize: "0.78rem" }}>{label}</p>
    </div>
  );
}

function Period9Svg({ period9 }: { period9: { residue: number; status: PairStatus }[] }) {
  const cx = 140;
  const cy = 140;
  const r = 90;
  return (
    <svg viewBox="0 0 280 280" role="img" aria-label="Period 9 tara bala structure" style={{ width: "100%", maxHeight: 240, display: "block" }}>
      <circle cx={cx} cy={cy} r={r + 20} fill="none" stroke={HAIRLINE} strokeWidth="2" />
      <text x={cx} y={cy + 5} textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight={700}>Mod 9</text>
      {period9.map((p, i) => {
        const angle = (i * 40 - 90) * (Math.PI / 180);
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        const color = STATUS_STYLE[p.status].color;
        return (
          <g key={p.residue}>
            <circle cx={x} cy={y} r={22} fill={color + "18"} stroke={color} strokeWidth="2" />
            <text x={x} y={y + 4} textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight={700}>{p.residue === 0 ? 9 : p.residue}</text>
          </g>
        );
      })}
    </svg>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 700 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex", alignItems: "center", gap: "0.45rem", border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8, background: active ? color : "transparent", color: active ? "#fff" : INK_SECONDARY,
    padding: "0.55rem 0.75rem", fontWeight: 600, cursor: "pointer",
  };
}

function smallChipStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`, borderRadius: 8, background: active ? color : "transparent",
    color: active ? "#fff" : INK_SECONDARY, padding: "0.48rem 0.68rem", fontWeight: 600, cursor: "pointer",
  };
}

const selectStyle: CSSProperties = {
  width: "100%", appearance: "none", background: SURFACE, color: INK_PRIMARY, border: "1px solid " + HAIRLINE,
  borderRadius: 6, padding: "0.4rem 0.55rem", fontSize: "0.88rem", fontWeight: 500,
};

const cardStyle: CSSProperties = { border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" };
const bodyTextStyle: CSSProperties = { margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 };
const eyebrowStyle: CSSProperties = { margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" };

const thStyle: CSSProperties = { textAlign: "left", padding: "0.55rem 0.45rem", borderBottom: `1px solid ${HAIRLINE}`, color: INK_MUTED, fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase" };
const tdStyle: CSSProperties = { padding: "0.45rem", borderBottom: `1px solid ${HAIRLINE}`, verticalAlign: "top" };
