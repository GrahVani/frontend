"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { BookOpen, FolderOpen, Scale, Search, Sparkles } from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type TabKey = "wheel" | "vikram" | "doctrine" | "limits";

type Tara = { name: string; quality: "favourable" | "unfavourable" | "mixed"; note?: string };

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

const TABS: Record<TabKey, { label: string; icon: typeof Search }> = {
  wheel: { label: "Tāra wheel", icon: Search },
  vikram: { label: "Vikram&apos;s case", icon: FolderOpen },
  doctrine: { label: "Doctrine", icon: BookOpen },
  limits: { label: "Limits", icon: Scale },
};

const NAKSHATRAS: string[] = [
  "Aśvinī",
  "Bharaṇī",
  "Kṛttikā",
  "Rohiṇī",
  "Mṛgaśīrṣa",
  "Ārdrā",
  "Punarvasu",
  "Puṣya",
  "Āśleṣā",
  "Maghā",
  "Pūrva Phālgunī",
  "Uttara Phālgunī",
  "Hasta",
  "Chitrā",
  "Svātī",
  "Viśākhā",
  "Anurādhā",
  "Jyeṣṭhā",
  "Mūla",
  "Pūrva Aṣāḍhā",
  "Uttara Aṣāḍhā",
  "Śravaṇa",
  "Dhaniṣṭhā",
  "Śatabhiṣaj",
  "Pūrva Bhādrapadā",
  "Uttara Bhādrapadā",
  "Revatī",
];

const TARAS: Record<number, Tara> = {
  1: { name: "Janma", quality: "mixed" },
  2: { name: "Sampat", quality: "favourable" },
  3: { name: "Vipat", quality: "unfavourable" },
  4: { name: "Kṣema", quality: "favourable" },
  5: { name: "Pratyak", quality: "unfavourable" },
  6: { name: "Sādhaka", quality: "favourable" },
  7: { name: "Vadha", quality: "unfavourable", note: "worst" },
  8: { name: "Mitra", quality: "favourable" },
  9: { name: "Ati-Mitra", quality: "favourable" },
};

function computeTara(janmaIndex: number, targetIndex: number): { count: number; taraNumber: number; tara: Tara } {
  const janmaPos = janmaIndex + 1;
  const targetPos = targetIndex + 1;
  const count = targetPos >= janmaPos ? targetPos - janmaPos + 1 : 28 - janmaPos + targetPos;
  const taraNumber = count % 9 === 0 ? 9 : count % 9;
  return { count, taraNumber, tara: TARAS[taraNumber] };
}

function qualityColor(quality: Tara["quality"]) {
  return quality === "favourable" ? GREEN : quality === "unfavourable" ? VERMILION : GOLD;
}

function NakshatraSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (index: number) => void;
}) {
  return (
    <label style={{ display: "grid", gap: "0.25rem" }}>
      <span style={{ color: INK_SECONDARY, fontSize: "0.88rem" }}>{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ padding: "0.4rem", borderRadius: 6, border: `1px solid ${HAIRLINE}`, background: SURFACE, color: INK_PRIMARY }}
      >
        {NAKSHATRAS.map((n, i) => (
          <option key={n} value={i}>
            {i + 1}. {n}
          </option>
        ))}
      </select>
    </label>
  );
}

function TaraWheelSvg({ taraNumber }: { taraNumber: number }) {
  const cx = 200;
  const cy = 200;
  const r = 150;
  const innerR = 90;

  const angleFor = (n: number) => ((n - 1) * 40 - 90) * (Math.PI / 180);

  return (
    <svg viewBox="0 0 400 400" role="img" aria-label="Tara Bala nine-position wheel" style={{ width: "100%", maxHeight: 320, display: "block" }}>
      <rect x={10} y={10} width={380} height={380} rx={8} fill={`${BLUE}08`} stroke={HAIRLINE} />
      {Array.from({ length: 9 }, (_, i) => {
        const n = i + 1;
        const active = n === taraNumber;
        const start = angleFor(n);
        const end = angleFor(n + 1);
        const x1 = cx + r * Math.cos(start);
        const y1 = cy + r * Math.sin(start);
        const x2 = cx + r * Math.cos(end);
        const y2 = cy + r * Math.sin(end);
        const x3 = cx + innerR * Math.cos(end);
        const y3 = cy + innerR * Math.sin(end);
        const x4 = cx + innerR * Math.cos(start);
        const y4 = cy + innerR * Math.sin(start);
        const mid = (start + end) / 2;
        const labelR = (r + innerR) / 2;
        const lx = cx + labelR * Math.cos(mid);
        const ly = cy + labelR * Math.sin(mid);
        const color = qualityColor(TARAS[n].quality);
        return (
          <g key={n}>
            <path d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 0 0 ${x4} ${y4} Z`} fill={active ? `${color}35` : `${color}12`} stroke={active ? color : HAIRLINE} strokeWidth={active ? 3 : 1} />
            <text x={lx} y={ly - 4} textAnchor="middle" fill={active ? color : INK_SECONDARY} fontSize={11} fontWeight={600}>
              {n}
            </text>
            <text x={lx} y={ly + 10} textAnchor="middle" fill={active ? INK_PRIMARY : INK_SECONDARY} fontSize={9} fontWeight={600}>
              {TARAS[n].name}
            </text>
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={innerR - 4} fill={SURFACE} stroke={HAIRLINE} />
      <text x={cx} y={cy - 8} textAnchor="middle" fill={INK_PRIMARY} fontSize={12} fontWeight={600}>
        Result
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill={qualityColor(TARAS[taraNumber].quality)} fontSize={18} fontWeight={600}>
        {TARAS[taraNumber].name}
      </text>
      <text x={cx} y={cy + 34} textAnchor="middle" fill={INK_SECONDARY} fontSize={10} fontWeight={600}>
        {TARAS[taraNumber].quality}
      </text>
    </svg>
  );
}

function NakshatraStripSvg({ janmaIndex, targetIndex }: { janmaIndex: number; targetIndex: number }) {
  const cellW = 18;
  const startX = 30;
  const y = 60;
  const height = 44;

  return (
    <svg viewBox="0 0 560 140" role="img" aria-label="Nakshatra count from Janma to target" style={{ width: "100%", maxHeight: 150, display: "block" }}>
      <rect x={10} y={10} width={540} height={120} rx={8} fill={`${GOLD}08`} stroke={HAIRLINE} />
      <text x={280} y={34} textAnchor="middle" fill={INK_PRIMARY} fontSize={13} fontWeight={600}>
        Counting forward from Janma-nakṣatra to target
      </text>
      {NAKSHATRAS.map((n, i) => {
        const x = startX + i * cellW;
        const isJanma = i === janmaIndex;
        const isTarget = i === targetIndex;
        const inPath = isInPath(janmaIndex, targetIndex, i);
        return (
          <g key={n}>
            <rect x={x} y={y} width={cellW - 1} height={height} rx={2} fill={isJanma ? `${BLUE}30` : isTarget ? `${GREEN}30` : inPath ? `${GOLD}15` : `${INK_MUTED}10`} stroke={isJanma ? BLUE : isTarget ? GREEN : HAIRLINE} />
            <text x={x + cellW / 2 - 0.5} y={y + 16} textAnchor="middle" fill={INK_SECONDARY} fontSize={7} fontWeight={600}>
              {i + 1}
            </text>
            <text x={x + cellW / 2 - 0.5} y={y + 32} textAnchor="middle" fill={isJanma || isTarget ? INK_PRIMARY : INK_SECONDARY} fontSize={7} fontWeight={600} transform={`rotate(-35, ${x + cellW / 2 - 0.5}, ${y + 32})`}>
              {n}
            </text>
          </g>
        );
      })}
      <text x={startX + janmaIndex * cellW + cellW / 2} y={y + height + 18} textAnchor="middle" fill={BLUE} fontSize={10} fontWeight={600}>
        Janma
      </text>
      <text x={startX + targetIndex * cellW + cellW / 2} y={y + height + 32} textAnchor="middle" fill={GREEN} fontSize={10} fontWeight={600}>
        Target
      </text>
    </svg>
  );
}

function isInPath(start: number, end: number, i: number): boolean {
  if (start === end) return false;
  if (end > start) return i > start && i < end;
  return i > start || i < end;
}

function CandidateRow({ label, janmaIndex, targetIndex }: { label: string; janmaIndex: number; targetIndex: number }) {
  const { count, taraNumber, tara } = computeTara(janmaIndex, targetIndex);
  const color = qualityColor(tara.quality);
  return (
    <tr>
      <td style={{ padding: "0.6rem", borderBottom: `1px solid ${HAIRLINE}`, color: INK_PRIMARY, fontWeight: 600 }}>{label}</td>
      <td style={{ padding: "0.6rem", borderBottom: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>{NAKSHATRAS[janmaIndex]}</td>
      <td style={{ padding: "0.6rem", borderBottom: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>{NAKSHATRAS[targetIndex]}</td>
      <td style={{ padding: "0.6rem", borderBottom: `1px solid ${HAIRLINE}`, color: INK_PRIMARY, fontWeight: 600 }}>{count}</td>
      <td style={{ padding: "0.6rem", borderBottom: `1px solid ${HAIRLINE}` }}>
        <span style={{ display: "inline-flex", padding: "0.25rem 0.6rem", borderRadius: 12, border: `1px solid ${color}`, background: `${color}15`, color, fontWeight: 600, fontSize: "0.88rem" }}>
          {taraNumber}. {tara.name}
        </span>
      </td>
      <td style={{ padding: "0.6rem", borderBottom: `1px solid ${HAIRLINE}`, color }}>{tara.quality}</td>
    </tr>
  );
}

export function TaraBalaWheel() {
  const [activeTab, setActiveTab] = useState<TabKey>("wheel");
  const [janmaIndex, setJanmaIndex] = useState(19); // Pūrva Aṣāḍhā
  const [targetIndex, setTargetIndex] = useState(13); // Chitrā

  const { count, taraNumber, tara } = computeTara(janmaIndex, targetIndex);

  const setVikram = () => {
    setJanmaIndex(19);
    setTargetIndex(13);
  };

  const nudgeTarget = (delta: number) => {
    setTargetIndex((prev) => (prev + delta + 27) % 27);
  };

  const reset = () => {
    setActiveTab("wheel");
    setVikram();
  };

  return (
    <div data-interactive="tara-bala-wheel" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Janma Tāra · Chapter 5</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Tāra Bala wheel
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Count from the Janma-nakṣatra to a target nakṣatra, reduce modulo nine, and read the resulting tārā.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            Reset
          </button>
        </div>
      </section>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {(Object.keys(TABS) as TabKey[]).map((key) => {
          const TabIcon = TABS[key].icon;
          return (
            <button
              key={key}
              type="button"
              aria-pressed={activeTab === key}
              onClick={() => setActiveTab(key)}
              style={tabChipStyle(activeTab === key, key === activeTab ? GOLD : INK_MUTED)}
            >
              <TabIcon size={15} aria-hidden="true" />
              {TABS[key].label}
            </button>
          );
        })}
      </div>

      {activeTab === "wheel" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Compute</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: BLUE, fontSize: "1.15rem", fontWeight: 600 }}>
              Choose Janma and target nakṣatras
            </h3>
            <div style={workbenchDiagramLayoutStyle}>
              <div style={{ flex: "1 1 320px", minWidth: 280 }}>
                <TaraWheelSvg taraNumber={taraNumber} />
              </div>
              <div style={{ flex: "1 1 300px", display: "grid", gap: "0.75rem", minWidth: 260 }}>
                <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${HAIRLINE}`, background: SURFACE, display: "grid", gap: "0.6rem" }}>
                  <NakshatraSelect label="Janma-nakṣatra (Moon)" value={janmaIndex} onChange={setJanmaIndex} />
                  <NakshatraSelect label="Target nakṣatra (Lagna)" value={targetIndex} onChange={setTargetIndex} />
                </div>
                <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${HAIRLINE}`, background: SURFACE }}>
                  <p style={{ margin: "0 0 0.35rem", color: INK_MUTED, fontSize: "0.8rem", fontWeight: 600 }}>STEP-BY-STEP</p>
                  <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                    Inclusive count from {NAKSHATRAS[janmaIndex]} to {NAKSHATRAS[targetIndex]} = <strong style={{ color: INK_PRIMARY, fontWeight: 600 }}>{count}</strong>.<br />
                    {count} mod 9 = <strong style={{ color: INK_PRIMARY, fontWeight: 600 }}>{taraNumber}</strong> → <strong style={{ color: qualityColor(tara.quality), fontWeight: 600 }}>{tara.name}</strong> ({tara.quality}).
                  </p>
                </div>
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                  <button type="button" onClick={() => nudgeTarget(-1)} style={buttonStyle(false, BLUE)}>
                    Target −1
                  </button>
                  <button type="button" onClick={() => nudgeTarget(1)} style={buttonStyle(false, BLUE)}>
                    Target +1
                  </button>
                  <button type="button" onClick={setVikram} style={buttonStyle(false, GOLD)}>
                    <Sparkles size={15} aria-hidden="true" />
                    Vikram&apos;s case
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Nakṣatra path</p>
            <NakshatraStripSvg janmaIndex={janmaIndex} targetIndex={targetIndex} />
          </section>
        </>
      )}

      {activeTab === "vikram" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Vikram&apos;s case</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: BLUE, fontSize: "1.15rem", fontWeight: 600 }}>
              Identical tārā for every candidate
            </h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "0.6rem", borderBottom: `2px solid ${HAIRLINE}`, color: INK_MUTED, fontWeight: 600 }}>Candidate</th>
                    <th style={{ textAlign: "left", padding: "0.6rem", borderBottom: `2px solid ${HAIRLINE}`, color: INK_MUTED, fontWeight: 600 }}>Janma-nakṣatra</th>
                    <th style={{ textAlign: "left", padding: "0.6rem", borderBottom: `2px solid ${HAIRLINE}`, color: INK_MUTED, fontWeight: 600 }}>Lagna-nakṣatra</th>
                    <th style={{ textAlign: "left", padding: "0.6rem", borderBottom: `2px solid ${HAIRLINE}`, color: INK_MUTED, fontWeight: 600 }}>Count</th>
                    <th style={{ textAlign: "left", padding: "0.6rem", borderBottom: `2px solid ${HAIRLINE}`, color: INK_MUTED, fontWeight: 600 }}>Tārā</th>
                    <th style={{ textAlign: "left", padding: "0.6rem", borderBottom: `2px solid ${HAIRLINE}`, color: INK_MUTED, fontWeight: 600 }}>Quality</th>
                  </tr>
                </thead>
                <tbody>
                  <CandidateRow label="A" janmaIndex={19} targetIndex={13} />
                  <CandidateRow label="B" janmaIndex={19} targetIndex={13} />
                  <CandidateRow label="C" janmaIndex={19} targetIndex={13} />
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: "0.75rem", padding: "0.75rem", borderRadius: 8, border: `1px solid ${GOLD}55`, background: `${GOLD}10` }}>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                <span style={{ color: GOLD, fontWeight: 600 }}>Non-discriminating, not a failure.</span> The Moon nakṣatra (Pūrva Aṣāḍhā) and the Lagna nakṣatra (Chitrā) are the same for all three candidates, so the tārā is the same. The wheel reports this honestly instead of inventing a difference.
              </p>
            </div>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>What would discriminate?</p>
            <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${PURPLE}55`, background: `${PURPLE}10` }}>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                If even one candidate&apos;s Lagna crossed into a different nakṣatra, the count would change and the tārā could differ. Vikram&apos;s candidates were designed within one 24-minute window narrow enough to stay inside Chitrā — the same structural cause that tied the classical KP Ruling-Planet set in Chapter 4.
              </p>
            </div>
          </section>
        </>
      )}

      {activeTab === "doctrine" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>The nine tārās</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: BLUE, fontSize: "1.15rem", fontWeight: 600 }}>
              Reused exactly from T1-07 16.6.4
            </h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.95rem" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "0.6rem", borderBottom: `2px solid ${HAIRLINE}`, color: INK_MUTED, fontWeight: 600 }}>#</th>
                    <th style={{ textAlign: "left", padding: "0.6rem", borderBottom: `2px solid ${HAIRLINE}`, color: INK_MUTED, fontWeight: 600 }}>Tārā</th>
                    <th style={{ textAlign: "left", padding: "0.6rem", borderBottom: `2px solid ${HAIRLINE}`, color: INK_MUTED, fontWeight: 600 }}>Quality</th>
                    <th style={{ textAlign: "left", padding: "0.6rem", borderBottom: `2px solid ${HAIRLINE}`, color: INK_MUTED, fontWeight: 600 }}>Note</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 9 }, (_, i) => {
                    const n = i + 1;
                    const t = TARAS[n];
                    const c = qualityColor(t.quality);
                    return (
                      <tr key={n}>
                        <td style={{ padding: "0.6rem", borderBottom: `1px solid ${HAIRLINE}`, color: INK_PRIMARY, fontWeight: 600 }}>{n}</td>
                        <td style={{ padding: "0.6rem", borderBottom: `1px solid ${HAIRLINE}`, color: INK_PRIMARY, fontWeight: 600 }}>{t.name}</td>
                        <td style={{ padding: "0.6rem", borderBottom: `1px solid ${HAIRLINE}`, color: c, fontWeight: 600 }}>{t.quality}</td>
                        <td style={{ padding: "0.6rem", borderBottom: `1px solid ${HAIRLINE}`, color: INK_MUTED }}>{t.note ?? "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Citation honesty</p>
            <div style={{ display: "grid", gap: "0.65rem" }}>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${VERMILION}55`, background: `${VERMILION}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: VERMILION, fontWeight: 600 }}>Imprecise citation:</span> the module overview lists a &quot;T1-23 cross-reference&quot; for this lesson. T1-23 itself does not contain the Tāra Bala computation; it only forward-references the topic.
                </p>
              </div>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${GREEN}55`, background: `${GREEN}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: GREEN, fontWeight: 600 }}>Real source:</span> T1-07 Chapter 6 Lesson 4 — <i>Tāra Bala and Aṣṭa-Kūṭa: An Introduction</i>. That is the doctrinal anchor reused here.
                </p>
              </div>
            </div>
          </section>
        </>
      )}

      {activeTab === "limits" && (
        <>
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Resolution limit</p>
            <h3 style={{ margin: "0.15rem 0 0.75rem", color: VERMILION, fontSize: "1.15rem", fontWeight: 600 }}>
              No classical finer layer to reach for
            </h3>
            <div style={{ display: "grid", gap: "0.65rem" }}>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${BLUE}55`, background: `${BLUE}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: BLUE, fontWeight: 600 }}>KP RPP (Chapter 4):</span> when the classical five-role set ties, KP supplies a standard finer layer — the Lagna sub-lord — that can break the tie.
                </p>
              </div>
              <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${VERMILION}55`, background: `${VERMILION}10` }}>
                <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                  <span style={{ color: VERMILION, fontWeight: 600 }}>Janma Tāra (Chapter 5):</span> classical Tāra Bala doctrine, as developed in this curriculum, has no comparable &quot;sub-tārā&quot; layer. When the inputs tie, the result ties.
                </p>
              </div>
            </div>
          </section>

          <section style={cardStyle}>
            <p style={eyebrowStyle}>Honest contribution</p>
            <div style={{ padding: "0.75rem", borderRadius: 8, border: `1px solid ${GREEN}55`, background: `${GREEN}10` }}>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                <span style={{ color: GREEN, fontWeight: 600 }}>Confirmatory only.</span> A favourable Kṣema tārā between Moon and Lagna is a real fact about Vikram&apos;s chart as a whole. It adds to the portrait of the native; it does not, by itself, choose between A, B, and C.
              </p>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.72rem",
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

const cardStyle: CSSProperties = {
  background: SURFACE,
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  padding: "1rem",
};

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    padding: "0.45rem 0.75rem",
    borderRadius: 6,
    border: `1px solid ${active ? color : HAIRLINE}`,
    background: active ? color : SURFACE,
    color: active ? "#fff" : INK_PRIMARY,
    cursor: "pointer",
    fontWeight: 500,
    fontSize: "0.92rem",
  };
}

function tabChipStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    padding: "0.5rem 0.85rem",
    borderRadius: 20,
    border: `1px solid ${active ? color : HAIRLINE}`,
    background: active ? `${color}15` : SURFACE,
    color: active ? color : INK_SECONDARY,
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.92rem",
  };
}
