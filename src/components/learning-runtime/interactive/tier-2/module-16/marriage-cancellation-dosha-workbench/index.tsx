"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  Ban,
  CheckCircle2,
  Moon,
  RotateCcw,
  ShieldCheck,
  Skull,
  User,
  XCircle,
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

type TithiStatus = "favoured" | "acceptable" | "discouraged" | "prohibited";
type Strength = "strong" | "weak";
type Party = "bride" | "groom";
type Purity = "candra" | "tara" | "lagna";
type MarsHouse = "upachaya" | "non-upachaya" | "none";
type ScenarioKey = "candidate-3" | "hypothetical-fail";

interface Tithi {
  n: number;
  name: string;
  paksha: "śukla" | "kṛṣṇa";
  status: TithiStatus;
  note: string;
}

const TITHIS: Tithi[] = Array.from({ length: 30 }, (_, i) => {
  const n = i + 1;
  const paksha = n <= 15 ? "śukla" : "kṛṣṇa";
  const day = n <= 15 ? n : n - 15;
  const cls = day % 5;
  let status: TithiStatus = "acceptable";
  let name = "";
  if (cls === 1) { status = "acceptable"; name = "Nanda"; }
  else if (cls === 2) { status = "favoured"; name = "Bhadra"; }
  else if (cls === 3) { status = "discouraged"; name = "Jaya"; }
  else if (cls === 4) { status = "prohibited"; name = "Riktā"; }
  else if (cls === 0) { status = "favoured"; name = "Pūrṇā"; }
  if (n === 30) { status = "prohibited"; name = "Amāvasyā"; }
  return { n, name, paksha, status, note: `${paksha} ${day}${status === "prohibited" ? " — marriage-prohibited" : ""}` };
});

const PURITIES: { key: Purity; label: string }[] = [
  { key: "candra", label: "Candra-bala" },
  { key: "tara", label: "Tārā-bala" },
  { key: "lagna", label: "Lagna-śuddhi" },
];

const STATUS_COLOR: Record<TithiStatus, string> = {
  favoured: GREEN,
  acceptable: BLUE,
  discouraged: GOLD,
  prohibited: VERMILION,
};

const SCENARIOS: Record<ScenarioKey, { title: string; note: string; defaults: WorkbenchState }> = {
  "candidate-3": {
    title: "Meera & Arjun — Candidate 3",
    note: "Pūrṇā tithi; Tri-bāla-śuddhi strong for both; no natal Maṅgala-doṣa.",
    defaults: {
      selectedTithi: 15,
      triBala: { bride: { candra: "strong", tara: "strong", lagna: "strong" }, groom: { candra: "strong", tara: "strong", lagna: "strong" } },
      natalDosha: false,
      cancellationChecked: false,
      marsHouse: "none",
    },
  },
  "hypothetical-fail": {
    title: "Hypothetical — failing candidate",
    note: "Amāvasyā tithi; bride's tārā-bala weak; uncancelled natal Maṅgala-doṣa with Mars in the 4th.",
    defaults: {
      selectedTithi: 30,
      triBala: { bride: { candra: "strong", tara: "weak", lagna: "strong" }, groom: { candra: "strong", tara: "strong", lagna: "strong" } },
      natalDosha: true,
      cancellationChecked: false,
      marsHouse: "non-upachaya",
    },
  },
};

interface WorkbenchState {
  selectedTithi: number;
  triBala: Record<Party, Record<Purity, Strength>>;
  natalDosha: boolean;
  cancellationChecked: boolean;
  marsHouse: MarsHouse;
}

function nextStrength(s: Strength): Strength {
  return s === "strong" ? "weak" : "strong";
}

export function MarriageCancellationDoshaWorkbench() {
  const [scenario, setScenario] = useState<ScenarioKey>("candidate-3");
  const [state, setState] = useState<WorkbenchState>(SCENARIOS["candidate-3"].defaults);

  const applyScenario = (key: ScenarioKey) => {
    setScenario(key);
    setState(SCENARIOS[key].defaults);
  };

  const selectedTithiData = TITHIS.find((t) => t.n === state.selectedTithi) || TITHIS[14];
  const tithiProhibited = selectedTithiData.status === "prohibited";
  const kuhuActive = state.selectedTithi === 30;

  const triBalaFailure = useMemo(() => {
    return (["bride", "groom"] as Party[]).some((party) =>
      PURITIES.some((p) => state.triBala[party][p.key] === "weak")
    );
  }, [state.triBala]);

  const mangalaActive = state.natalDosha && !state.cancellationChecked;
  const mangalaCancels = mangalaActive && state.marsHouse !== "upachaya";

  const allClear = !tithiProhibited && !triBalaFailure && !mangalaCancels;

  const setTriBala = (party: Party, purity: Purity, value: Strength) => {
    setState((prev) => ({
      ...prev,
      triBala: {
        ...prev.triBala,
        [party]: { ...prev.triBala[party], [purity]: value },
      },
    }));
  };

  const reset = () => applyScenario("candidate-3");

  return (
    <div data-interactive="marriage-cancellation-dosha-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Marriage cancellation-doṣa workbench</p>
            <h2 style={{ margin: "0.2rem 0 0", color: ACCENT, fontSize: "1.35rem", fontWeight: 600 }}>
              Run the three wedding-specific cancellation-doṣas
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Screen a candidate against the prohibited-tithi list, Tri-bāla-śuddhi, Maṅgala-doṣa interaction and Kuhū-yoga. Toggle any check to see exactly what cancels the muhūrta.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, ACCENT)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Scenario</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.55rem" }}>
          {(Object.keys(SCENARIOS) as ScenarioKey[]).map((key) => (
            <button key={key} type="button" aria-pressed={scenario === key} onClick={() => applyScenario(key)} style={smallChipStyle(scenario === key, key === "candidate-3" ? GREEN : VERMILION)}>
              {SCENARIOS[key].title}
            </button>
          ))}
        </div>
        <p style={{ margin: 0, color: INK_SECONDARY, fontSize: "0.85rem" }}>{SCENARIOS[scenario].note}</p>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 500px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Prohibited-tithi list</p>
              <h3 style={{ margin: "0.15rem 0 0", color: tithiProhibited ? VERMILION : GREEN, fontSize: "1.2rem", fontWeight: 600 }}>
                {tithiProhibited ? "Prohibited tithi" : "Tithi permitted"}
              </h3>
            </div>
            <span style={{ fontSize: "0.85rem", color: INK_MUTED }}>
              Selected: {selectedTithiData.paksha} {selectedTithiData.n <= 15 ? selectedTithiData.n : selectedTithiData.n - 15} · {selectedTithiData.name}
            </span>
          </div>
          <TithiCycleSvg selected={state.selectedTithi} onSelect={(n) => setState((prev) => ({ ...prev, selectedTithi: n }))} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.65rem", fontSize: "0.78rem", color: INK_MUTED, marginTop: "0.55rem" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: "50%", background: GREEN }} /> Favoured</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: "50%", background: BLUE }} /> Acceptable</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: "50%", background: GOLD }} /> Discouraged</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: "50%", background: VERMILION }} /> Prohibited</span>
          </div>
          {kuhuActive && (
            <div style={{ marginTop: "0.65rem", padding: "0.55rem", borderRadius: 6, border: "1px solid " + VERMILION, background: VERMILION + "10" }}>
              <p style={{ margin: 0, color: VERMILION, fontWeight: 600 }}>
                <Moon size={14} style={{ verticalAlign: "text-bottom", marginRight: 6 }} aria-hidden="true" />
                Kuhū-yoga active
              </p>
              <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem" }}>
                Amāvasyā is a dedicated marriage cancellation, distinct from the Riktā-tithi list.
              </p>
            </div>
          )}
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 300px" }}>
          <Panel title="Tri-bāla-śuddhi" icon={<ShieldCheck size={18} />} color={triBalaFailure ? VERMILION : GREEN}>
            <p style={bodyTextStyle}>
              Candra-bala, tārā-bala and lagna-śuddhi must each be strong for <strong style={{ fontWeight: 600 }}>both</strong> bride and groom individually. Averaging is not allowed.
            </p>
            <TriBalaControls state={state.triBala} onChange={setTriBala} />
          </Panel>
        </section>
      </div>

      <div style={workbenchTwoColumnStyle}>
        <Panel title="Maṅgala-doṣa interaction" icon={<Skull size={18} />} color={mangalaCancels ? VERMILION : mangalaActive ? GOLD : GREEN}>
          <div style={{ display: "grid", gap: "0.55rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
              <input type="checkbox" checked={state.natalDosha} onChange={(e) => setState((prev) => ({ ...prev, natalDosha: e.target.checked }))} />
              <span>Natal Maṅgala-doṣa present in at least one chart</span>
            </label>
            {state.natalDosha && (
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                <input type="checkbox" checked={state.cancellationChecked} onChange={(e) => setState((prev) => ({ ...prev, cancellationChecked: e.target.checked }))} />
                <span>T2-04 cancellation conditions checked and apply</span>
              </label>
            )}
            <div>
              <span style={{ ...eyebrowStyle, display: "block", marginBottom: "0.35rem" }}>Muhūrta-Mars house</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
                {(["none", "upachaya", "non-upachaya"] as MarsHouse[]).map((h) => (
                  <button key={h} type="button" aria-pressed={state.marsHouse === h} onClick={() => setState((prev) => ({ ...prev, marsHouse: h }))} style={smallChipStyle(state.marsHouse === h, h === "upachaya" ? GREEN : h === "non-upachaya" ? VERMILION : GOLD)}>
                    {h === "upachaya" ? "Upachaya (3/6/10/11)" : h === "non-upachaya" ? "Non-upachaya" : "Not relevant"}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <MarsHouseSvg marsHouse={state.marsHouse} />
          <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, fontSize: "0.85rem", lineHeight: 1.5 }}>
            {mangalaCancels
              ? "Natal doṣa is active and muhūrta-Mars is in a non-upachaya house — the candidate is cancelled."
              : mangalaActive
                ? "Natal doṣa is active, but muhūrta-Mars is in an upachaya house, so it mitigates rather than amplifies."
                : "No active natal Maṅgala-doṣa; this cancellation-doṣa is not triggered."}
          </p>
        </Panel>

        <section style={{ ...cardStyle, borderColor: allClear ? `${GREEN}66` : `${VERMILION}66`, background: allClear ? `${GREEN}0F` : `${VERMILION}0F` }}>
          <p style={eyebrowStyle}>Overall verdict</p>
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
            {allClear ? <CheckCircle2 size={22} color={GREEN} aria-hidden="true" /> : <XCircle size={22} color={VERMILION} aria-hidden="true" />}
            <p style={{ margin: 0, color: allClear ? GREEN : VERMILION, fontWeight: 600, fontSize: "1.1rem" }}>
              {allClear ? "Candidate clears all three cancellation-doṣas" : "Candidate is cancelled"}
            </p>
          </div>
          <div style={{ marginTop: "0.75rem", display: "grid", gap: "0.45rem" }}>
            <VerdictRow ok={!tithiProhibited} label="Tithi screen" failText={`${selectedTithiData.name} is marriage-prohibited`} okText={`${selectedTithiData.name} is permitted`} />
            <VerdictRow ok={!triBalaFailure} label="Tri-bāla-śuddhi" failText="At least one purity is weak for one party" okText="All purities strong for both parties" />
            <VerdictRow ok={!mangalaCancels} label="Maṅgala-doṣa" failText="Active natal doṣa amplified by muhūrta-Mars" okText={mangalaActive ? "Active doṣa mitigated by upachaya Mars" : "Not triggered"} />
          </div>
        </section>
      </div>
    </div>
  );
}

function TriBalaControls({
  state,
  onChange,
}: {
  state: Record<Party, Record<Purity, Strength>>;
  onChange: (party: Party, purity: Purity, value: Strength) => void;
}) {
  return (
    <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
      {(Object.keys(state) as Party[]).map((party) => (
        <div key={party} style={{ padding: "0.65rem", borderRadius: 8, border: `1px solid ${HAIRLINE}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: party === "bride" ? PURPLE : BLUE, fontWeight: 700, marginBottom: "0.45rem" }}>
            <User size={16} aria-hidden="true" />
            {party === "bride" ? "Bride" : "Groom"}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.45rem" }}>
            {PURITIES.map((p) => {
              const strength = state[party][p.key];
              const color = strength === "strong" ? GREEN : VERMILION;
              return (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => onChange(party, p.key, nextStrength(strength))}
                  style={{
                    border: `1px solid ${color}`, borderRadius: 6, background: color + "10", color,
                    padding: "0.4rem 0.3rem", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer",
                  }}
                >
                  {p.label}: {strength === "strong" ? "Strong" : "Weak"}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function VerdictRow({ ok, label, okText, failText }: { ok: boolean; label: string; okText: string; failText: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem" }}>
      {ok ? <CheckCircle2 size={14} color={GREEN} aria-hidden="true" /> : <Ban size={14} color={VERMILION} aria-hidden="true" />}
      <span style={{ color: ok ? GREEN : VERMILION, fontWeight: 600 }}>{label}</span>
      <span style={{ color: INK_SECONDARY }}>— {ok ? okText : failText}</span>
    </div>
  );
}

function TithiCycleSvg({ selected, onSelect }: { selected: number; onSelect: (n: number) => void }) {
  const cx = 310;
  const cy = 170;
  const r = 140;
  return (
    <svg viewBox="0 0 620 390" role="img" aria-label="Lunar month tithi cycle" style={{ width: "100%", maxHeight: 380, display: "block" }}>
      <ellipse cx={cx} cy={cy} rx={r + 20} ry={r + 20} fill="none" stroke={HAIRLINE} strokeWidth="2" />
      <text x={cx} y={cy + 5} textAnchor="middle" fill={INK_MUTED} fontSize="13" fontWeight={700}>Lunar month</text>
      {TITHIS.map((t, index) => {
        const angle = (index * 12 - 90) * (Math.PI / 180);
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        const isSelected = t.n === selected;
        const color = STATUS_COLOR[t.status];
        return (
          <g key={t.n} onClick={() => onSelect(t.n)} style={{ cursor: "pointer" }}>
            <circle cx={x} cy={y} r={isSelected ? 13 : 10} fill={isSelected ? color : color + "20"} stroke={color} strokeWidth={isSelected ? 3 : 2} />
            <text x={x} y={y + 3.5} textAnchor="middle" fill={isSelected ? "#fff" : INK_PRIMARY} fontSize={isSelected ? 10 : 8} fontWeight={700}>
              {t.n}
            </text>
            {isSelected && (
              <text x={x} y={y + 27} textAnchor="middle" fill={color} fontSize="11" fontWeight={700}>
                {t.name}
              </text>
            )}
          </g>
        );
      })}
      <g transform={`translate(${cx - 90} 350)`}>
        <rect x="0" y="0" width="180" height="28" rx="6" fill={`${GOLD}10`} stroke={GOLD} />
        <text x="90" y="18" textAnchor="middle" fill={INK_SECONDARY} fontSize="11" fontWeight={700}>Click any tithi to select it</text>
      </g>
    </svg>
  );
}

function MarsHouseSvg({ marsHouse }: { marsHouse: MarsHouse }) {
  const houses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const upachaya = new Set([3, 6, 10, 11]);
  return (
    <svg viewBox="0 0 260 120" role="img" aria-label="Muhurta Mars house placement" style={{ width: "100%", maxHeight: 130, marginTop: "0.75rem", display: "block" }}>
      <rect x="10" y="10" width="240" height="100" rx="8" fill={`${VERMILION}08`} stroke={HAIRLINE} />
      <text x="130" y="30" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight={700}>Muhūrta-lagna houses</text>
      {houses.map((h) => {
        const isUpachaya = upachaya.has(h);
        const x = 20 + ((h - 1) % 6) * 40;
        const y = 42 + (h > 6 ? 36 : 0);
        const isMars = marsHouse === "upachaya" && isUpachaya ? true : marsHouse === "non-upachaya" && !isUpachaya && h !== 1 ? true : false;
        return (
          <g key={h}>
            <rect x={x} y={y} width="32" height="26" rx="4" fill={isUpachaya ? `${GREEN}18` : "transparent"} stroke={isUpachaya ? GREEN : HAIRLINE} strokeWidth={isUpachaya ? 2 : 1} />
            <text x={x + 16} y={y + 17} textAnchor="middle" fill={isUpachaya ? GREEN : INK_SECONDARY} fontSize="10" fontWeight={700}>{h}</text>
            {isMars && (
              <circle cx={x + 24} cy={y + 6} r={5} fill={VERMILION} />
            )}
          </g>
        );
      })}
      <text x="130" y="108" textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight={700}>Green boxes = upachaya houses (3, 6, 10, 11)</text>
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

const cardStyle: CSSProperties = { border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" };
const bodyTextStyle: CSSProperties = { margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 };
const eyebrowStyle: CSSProperties = { margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" };
