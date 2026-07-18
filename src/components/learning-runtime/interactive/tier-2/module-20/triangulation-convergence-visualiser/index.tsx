"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  Ban,
  CirclePlus,
  Gauge,
  GitMerge,
  ListChecks,
  Lock,
  RotateCcw,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

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

const TIER_STEPS = [
  { key: "strong", match: "3+", label: "Strong indication", color: GREEN, y: 36 },
  { key: "moderate", match: "2", label: "Moderate indication", color: GOLD, y: 106 },
  { key: "weak", match: "1", label: "Weak / possibility only", color: BLUE, y: 176 },
  { key: "none", match: "0", label: "No defensible prediction", color: VERMILION, y: 246 },
] as const;

const TIER_SEGMENT_HEIGHT = 64;

function tierIndexForCount(count: number) {
  if (count >= 3) return 0;
  if (count === 2) return 1;
  if (count === 1) return 2;
  return 3;
}

export function TriangulationConvergenceVisualiser() {
  const [thirdThread, setThirdThread] = useState(false);
  const [nadiamsaTried, setNadiamsaTried] = useState(false);
  const [errorInjected, setErrorInjected] = useState(false);
  const [dataNotStream, setDataNotStream] = useState(true);
  const [qualitative, setQualitative] = useState(true);

  const count = 2 + (thirdThread ? 1 : 0);
  const tier = TIER_STEPS[tierIndexForCount(count)];
  const warning = !dataNotStream || !qualitative;

  const statement = useMemo(() => {
    if (count >= 3) {
      return "There is a strong indication that Candidate B (06:00) is Vikram's correct birth-time window — three genuinely independent threads converge: Ch3 tattva-śuddhi, the Ch4 Lagna sub-lord, and a fresh dated-event discrimination that shares no input with either.";
    }
    return "There is a moderate indication that Candidate B (06:00) is Vikram's correct birth-time window, though a confirming third independent method is not yet in place.";
  }, [count]);

  const reset = () => {
    setThirdThread(false);
    setNadiamsaTried(false);
    setErrorInjected(false);
    setDataNotStream(true);
    setQualitative(true);
  };

  return (
    <div data-interactive="triangulation-convergence-visualiser" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Convergence across methods</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem", fontWeight: 600 }}>
              Independent agreement amplifies confidence — same-root agreement cannot
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Watch Vikram&apos;s two counted threads set the tier, add a hypothetical third thread to reach strong, and try to add Nāḍiāṁśa — the same-root check runs before the count.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 520px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap", marginBottom: "0.75rem" }}>
            <div>
              <p style={eyebrowStyle}>Vikram&apos;s convergence map</p>
              <h3 style={{ margin: "0.15rem 0 0", color: tier.color, fontSize: "1.2rem", fontWeight: 600 }}>
                {count} independent threads → {tier.label.toLowerCase()}
              </h3>
            </div>
            <span style={{ color: tier.color, fontWeight: 600 }}>{tier.label}</span>
          </div>
          <ConvergenceSvg thirdThread={thirdThread} nadiamsaTried={nadiamsaTried} count={count} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 140px), 1fr))", gap: "0.65rem", marginTop: "0.85rem" }}>
            <MiniFact icon={<Target size={16} />} title="Independent threads" body={String(count)} color={GREEN} />
            <MiniFact icon={<Gauge size={16} />} title="Confidence tier" body={tier.label} color={tier.color} />
            <MiniFact icon={<Scale size={16} />} title="Licensed wording" body={count >= 3 ? "strong indication" : "moderate indication"} color={tier.color} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px", alignContent: "start" }}>
          <Panel title="Evidence threads" icon={<GitMerge size={18} />} color={GOLD}>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <LockedThreadRow chapter="Ch3" method="Tattva-śuddhi" root="root: tattva assignments across the whole chart" />
              <LockedThreadRow chapter="Ch4" method="Lagna sub-lord" root="root: one Lagna degree, KP sub-division" />
              <button type="button" aria-pressed={thirdThread} onClick={() => setThirdThread((value) => !value)} style={threadButtonStyle(thirdThread, GREEN)}>
                <CirclePlus size={14} aria-hidden="true" />
                <span style={{ display: "grid", gap: "0.1rem", textAlign: "left" }}>
                  <span style={{ fontWeight: 600 }}>Ch2 re-run · fresh dated event</span>
                  <span style={{ fontSize: "0.8rem", opacity: 0.85 }}>root: new event data — shared with nothing</span>
                </span>
                <span style={{ marginLeft: "auto", fontSize: "0.78rem", fontWeight: 600 }}>{thirdThread ? "counted" : "add"}</span>
              </button>
              <button type="button" aria-pressed={nadiamsaTried} onClick={() => setNadiamsaTried((value) => !value)} style={threadButtonStyle(nadiamsaTried, PURPLE)}>
                <Ban size={14} aria-hidden="true" />
                <span style={{ display: "grid", gap: "0.1rem", textAlign: "left" }}>
                  <span style={{ fontWeight: 600 }}>Ch5.2 · Nāḍiāṁśa</span>
                  <span style={{ fontSize: "0.8rem", opacity: 0.85 }}>root: same Lagna degree as the sub-lord</span>
                </span>
                <span style={{ marginLeft: "auto", fontSize: "0.78rem", fontWeight: 600 }}>{nadiamsaTried ? "refused" : "try adding"}</span>
              </button>
            </div>
            {thirdThread ? (
              <div role="status" style={{ border: `1px solid ${GREEN}55`, borderRadius: 8, background: `${GREEN}10`, padding: "0.65rem 0.75rem", color: INK_SECONDARY, lineHeight: 1.45, marginTop: "0.6rem" }}>
                <span style={{ color: GREEN, fontWeight: 600 }}>Third thread counted.</span> The count rises to 3 and the tier recomputes to strong. Remove it and the tier falls back — convergence raises, its absence does not inflate.
              </div>
            ) : null}
            {nadiamsaTried ? (
              <div role="status" style={{ border: `1px solid ${PURPLE}55`, borderRadius: 8, background: `${PURPLE}10`, padding: "0.65rem 0.75rem", color: INK_SECONDARY, lineHeight: 1.45, marginTop: "0.6rem" }}>
                <span style={{ color: PURPLE, fontWeight: 600 }}>Refused — same root.</span> Nāḍiāṁśa reads the same Lagna-degree input already counted by the Ch4 sub-lord row. Its agreement checks the arithmetic, not the input — so it cannot raise the count.
              </div>
            ) : null}
          </Panel>
        </section>
      </div>

      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "start", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>§4.1 · the mechanism</p>
            <h3 style={{ margin: "0.15rem 0 0", color: errorInjected ? VERMILION : GREEN, fontSize: "1.2rem", fontWeight: 600 }}>
              {errorInjected ? "One wrong input, two very different consequences" : "Why independence amplifies confidence"}
            </h3>
          </div>
          <button type="button" aria-pressed={errorInjected} onClick={() => setErrorInjected((value) => !value)} style={buttonStyle(errorInjected, VERMILION)}>
            <ShieldAlert size={15} aria-hidden="true" />
            {errorInjected ? "Remove the input error" : "Inject an input error"}
          </button>
        </div>
        <MechanismSvg errorInjected={errorInjected} />
        <p style={{ margin: "0.25rem 0 0", color: INK_SECONDARY, lineHeight: 1.6, maxWidth: 940 }}>
          {errorInjected
            ? "One wrong input injected. In the independent lane only one thread breaks — the disagreement exposes the error. In the same-root lane both readings inherit the error identically and still agree, so their agreement tells you nothing about whether the input was right."
            : "Two independent threads agree on B: for both to be wrong in the same direction, two structurally unrelated failure modes would have to align by chance — a materially less likely coincidence than either failing alone. Same-root agreement cannot rule coincidence out; it only shows both computations ran correctly on the shared input."}
        </p>
      </section>

      <div style={responsiveThreeColumnStyle}>
        <Panel title="Tier table · T2-01 1.3.1" icon={<ListChecks size={18} />} color={GOLD}>
          <div style={{ display: "grid", gap: "0.45rem" }}>
            {TIER_STEPS.map((step, index) => {
              const active = index === tierIndexForCount(count);
              return (
                <div
                  key={step.key}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "72px 1fr",
                    gap: "0.6rem",
                    alignItems: "center",
                    border: `1px solid ${active ? step.color : HAIRLINE}`,
                    borderRadius: 8,
                    background: active ? `${step.color}14` : "transparent",
                    padding: "0.5rem 0.65rem",
                  }}
                >
                  <span style={{ color: active ? step.color : INK_MUTED, fontWeight: 600, fontSize: "0.85rem" }}>{step.match}</span>
                  <span style={{ color: active ? step.color : INK_SECONDARY, fontWeight: active ? 600 : 400 }}>{step.label}</span>
                </div>
              );
            })}
          </div>
          <p style={bodyTextStyle}>
            The independent count alone sets the tier. Four agreeing-sounding findings do not round 2 up to 3 — do not round up.
          </p>
        </Panel>

        <Panel title="What would raise the tier" icon={<Sparkles size={18} />} color={GREEN}>
          <ul style={{ margin: 0, paddingLeft: "1.1rem", display: "grid", gap: "0.5rem", color: INK_SECONDARY, lineHeight: 1.5 }}>
            <li>A precisely dated third life event whose antardaśā-lord discrimination breaks independently — Chapter 2&apos;s method re-run with fresh data.</li>
            <li>A properly-sourced D60 fine reading, if the sourcing policy is ever revisited — named a gap, not a permanent wall.</li>
          </ul>
          <p style={bodyTextStyle}>
            Naming what would raise the tier — without pretending it has been raised — is itself part of the uncertainty-honesty rule.
          </p>
        </Panel>

        <Panel title="Reading discipline" icon={<ShieldCheck size={18} />} color={dataNotStream && qualitative ? GREEN : VERMILION}>
          <div style={{ display: "grid", gap: "0.6rem" }}>
            <button type="button" aria-pressed={dataNotStream} onClick={() => setDataNotStream((value) => !value)} style={togglePanelStyle(dataNotStream, GREEN)}>
              <ShieldCheck size={18} aria-hidden="true" />
              <span>
                <span style={{ fontWeight: 600, display: "block" }}>Independence = separate data, not separate streams</span>
                <span>{dataNotStream ? "A KP method and a Parāśarī method can still share one input." : "Warning: stream labels prove nothing — check the data each method reads."}</span>
              </span>
            </button>
            <button type="button" aria-pressed={qualitative} onClick={() => setQualitative((value) => !value)} style={togglePanelStyle(qualitative, GOLD)}>
              <Scale size={18} aria-hidden="true" />
              <span>
                <span style={{ fontWeight: 600, display: "block" }}>Keep tiers qualitative</span>
                <span>{qualitative ? "Moderate never means “about 60%”." : "Warning: do not convert the tier into a percentage."}</span>
              </span>
            </button>
          </div>
        </Panel>
      </div>

      <div style={workbenchTwoColumnStyle}>
        <section style={{ ...cardStyle, borderColor: count >= 3 ? `${GREEN}66` : `${GOLD}66`, background: count >= 3 ? `${GREEN}0F` : `${GOLD}0F` }}>
          <p style={eyebrowStyle}>{count >= 3 ? "Strong, reached the honest way" : "Why moderate is not a shortfall"}</p>
          <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
            {count >= 3
              ? "The third thread is genuinely fresh: new event data, no shared root with tattva-śuddhi or the sub-lord. The discipline welcomes real independent evidence exactly as readily as it refuses miscounted echoes."
              : "A less careful accounting would reach “strong” by counting every agreeing-sounding finding — miscounting same-root agreement as fresh votes, the more dangerous and more common tier error. Six chapters of careful work produce the honest tier, not the louder one."}
          </p>
        </section>

        <section style={{ ...cardStyle, borderColor: warning ? `${VERMILION}66` : `${tier.color}66`, background: warning ? `${VERMILION}0F` : `${tier.color}0F` }}>
          <p style={eyebrowStyle}>Licensed statement</p>
          <h3 style={{ margin: "0.15rem 0 0", color: warning ? VERMILION : tier.color, fontSize: "1.18rem", fontWeight: 600 }}>
            {warning ? "Discipline warning" : tier.label}
          </h3>
          <p style={{ margin: "0.65rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
            {warning
              ? [
                  !dataNotStream ? "Different streams are not automatically independent — the sub-lord and Nāḍiāṁśa belong to different streams yet share one Lagna-degree input. " : "",
                  !qualitative ? "Tiers are qualitative labels, not percentages (T2-01 1.3.1 §4.4)." : "",
                ].join("")
              : statement}
          </p>
          {!warning ? (
            <p style={{ margin: "0.5rem 0 0", color: INK_MUTED, fontSize: "0.85rem" }}>Stated as a qualitative tier — never a percentage.</p>
          ) : null}
        </section>
      </div>
    </div>
  );
}

const THREAD_NODE = { x: 24, w: 150, h: 46 } as const;

function ThreadNode({ y, color, chapter, method, status, muted, dashed }: { y: number; color: string; chapter: string; method: string; status: string; muted?: boolean; dashed?: boolean }) {
  const effectiveColor = muted ? INK_MUTED : color;
  return (
    <g>
      <rect
        x={THREAD_NODE.x}
        y={y}
        width={THREAD_NODE.w}
        height={THREAD_NODE.h}
        rx={8}
        fill={muted ? "transparent" : color}
        stroke={effectiveColor}
        strokeWidth={1.5}
        fillOpacity={muted ? 0 : 0.06}
        strokeDasharray={dashed ? "5 4" : undefined}
      />
      <text x={THREAD_NODE.x + 10} y={y + 15} fill={INK_MUTED} fontSize="9.5">{chapter}</text>
      <text x={THREAD_NODE.x + 10} y={y + 29} fill={muted ? INK_SECONDARY : INK_PRIMARY} fontSize="11.5" fontWeight="600">{method}</text>
      <text x={THREAD_NODE.x + 10} y={y + 41} fill={effectiveColor} fontSize="9.5">{status}</text>
    </g>
  );
}

function ConvergenceSvg({ thirdThread, nadiamsaTried, count }: { thirdThread: boolean; nadiamsaTried: boolean; count: number }) {
  const tierIndex = tierIndexForCount(count);
  const tier = TIER_STEPS[tierIndex];
  const activeCenterY = tier.y + TIER_SEGMENT_HEIGHT / 2;

  return (
    <svg viewBox="0 0 560 340" role="img" aria-label="Vikram's evidence threads converging to the confidence tier" style={{ width: "100%", maxHeight: 440, margin: "0.4rem auto 0.85rem", display: "block" }}>
      <ThreadNode y={34} color={GREEN} chapter="Ch3" method="Tattva-śuddhi" status="independent · counted" />
      <ThreadNode y={106} color={GREEN} chapter="Ch4" method="Lagna sub-lord" status="independent · counted" />
      <ThreadNode y={178} color={GREEN} chapter="Ch2 re-run" method="Fresh dated event" status={thirdThread ? "independent · counted" : "hypothetical · not added"} muted={!thirdThread} dashed={!thirdThread} />
      <ThreadNode y={250} color={PURPLE} chapter="Ch5.2" method="Nāḍiāṁśa" status={nadiamsaTried ? "same-root · refused" : "same-root · echo"} dashed />

      <path d="M 174 57 C 226 57, 236 118, 274 136" fill="none" stroke={GREEN} strokeWidth="2.5" />
      <path d="M 174 129 C 210 129, 224 148, 264 161" fill="none" stroke={GREEN} strokeWidth="2.5" />
      <path d="M 174 201 C 212 201, 226 186, 272 194" fill="none" stroke={thirdThread ? GREEN : INK_MUTED} strokeWidth="2.5" strokeDasharray={thirdThread ? undefined : "6 5"} strokeOpacity={thirdThread ? 1 : 0.6} />
      <path d="M 174 273 C 206 273, 206 152, 216 146" fill="none" stroke={PURPLE} strokeWidth="2" strokeDasharray="5 5" strokeOpacity={nadiamsaTried ? 1 : 0.45} />

      <circle cx="222" cy="141" r="7" fill={SURFACE} stroke={PURPLE} strokeWidth="1.8" strokeOpacity={nadiamsaTried ? 1 : 0.6} />
      <line x1="217.5" y1="145.5" x2="226.5" y2="136.5" stroke={PURPLE} strokeWidth="1.8" strokeOpacity={nadiamsaTried ? 1 : 0.6} />
      <text x="222" y="120" textAnchor="middle" fill={PURPLE} fontSize="9.5" fillOpacity={nadiamsaTried ? 1 : 0.7}>shared input · Lagna degree</text>

      <circle cx="310" cy="166" r="48" fill={tier.color} stroke={tier.color} strokeWidth="2" fillOpacity={0.08} />
      <text x="310" y="152" textAnchor="middle" fill={INK_MUTED} fontSize="10">B-over-A count</text>
      <text x="310" y="176" textAnchor="middle" fill={tier.color} fontSize="24" fontWeight="600">{count}</text>
      <text x="310" y="192" textAnchor="middle" fill={INK_MUTED} fontSize="9.5">independent threads</text>

      <line x1="356" y1="166" x2="390" y2={activeCenterY} stroke={tier.color} strokeWidth="2" />
      <polygon points={`390,${activeCenterY - 6} 398,${activeCenterY} 390,${activeCenterY + 6}`} fill={tier.color} />

      {TIER_STEPS.map((step, index) => {
        const active = index === tierIndex;
        return (
          <g key={step.key}>
            <rect
              x="400"
              y={step.y}
              width="136"
              height={TIER_SEGMENT_HEIGHT}
              rx={8}
              fill={step.color} fillOpacity={active ? 0.12 : 0.04}
              stroke={step.color}
              strokeWidth={active ? 2 : 1}
              strokeOpacity={active ? 1 : 0.45}
            />
            <text x="412" y={step.y + 24} fill={step.color} fontSize="12" fontWeight="600" fillOpacity={active ? 1 : 0.6}>{step.match}</text>
            <text x="412" y={step.y + 42} fill={active ? INK_PRIMARY : INK_MUTED} fontSize="10">{step.label}</text>
            {active ? (
              <text x="412" y={step.y + 56} fill={step.color} fontSize="9" fontWeight="600">current tier</text>
            ) : null}
          </g>
        );
      })}

      <text x="280" y="330" textAnchor="middle" fill={INK_MUTED} fontSize="10">Only independent-discrimination threads reach the count — same-root echoes are stopped at the root check</text>
    </svg>
  );
}

function MechBox({ x, y, w, lines, color, active }: { x: number; y: number; w: number; lines: string[]; color: string; active?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height="34" rx={8} fill={color} stroke={color} strokeWidth={active ? 2 : 1.2} fillOpacity={active ? 0.10 : 0.04} />
      {lines.map((line, i) => (
        <text key={i} x={x + w / 2} y={y + (lines.length === 1 ? 21 : 14 + i * 12)} textAnchor="middle" fill={i === 0 ? color : INK_SECONDARY} fontSize={i === 0 ? "10" : "9"} fontWeight={i === 0 ? 600 : 400}>{line}</text>
      ))}
    </g>
  );
}

function MechanismSvg({ errorInjected }: { errorInjected: boolean }) {
  const rowAY = 40;
  const rowBY = 88;
  const lane2Top = 178;
  const lane2Row1Y = lane2Top + 14;
  const lane2Row2Y = lane2Row1Y + 48;
  const sharedY = (lane2Row1Y + lane2Row2Y + 34) / 2 - 23;

  const independentErrorColor = errorInjected ? VERMILION : GREEN;
  const lane1VerdictA = errorInjected ? { lines: ["favours A ✕"], color: VERMILION } : { lines: ["favours B"], color: GREEN };
  const lane1VerdictB = { lines: ["favours B"], color: GREEN };
  const lane2Verdict = errorInjected ? { lines: ["favours A ✕"], color: VERMILION } : { lines: ["favours B"], color: GREEN };

  return (
    <svg viewBox="0 0 560 312" role="img" aria-label="Error propagation through independent versus same-root methods" style={{ width: "100%", maxHeight: 400, margin: "0.6rem auto 0.5rem", display: "block" }}>
      <text x="24" y="24" fill={GREEN} fontSize="11" fontWeight="600">Independent roots — separate inputs</text>

      <MechBox x={24} y={rowAY} w={116} lines={errorInjected ? ["Input ✕", "tattva set — wrong"] : ["Input", "tattva set"]} color={independentErrorColor} active={errorInjected} />
      <MechBox x={164} y={rowAY} w={128} lines={["Ch3", "Tattva-śuddhi"]} color={errorInjected ? VERMILION : GOLD} />
      <MechBox x={316} y={rowAY} w={96} lines={lane1VerdictA.lines} color={lane1VerdictA.color} active={!errorInjected} />
      <MechBox x={24} y={rowBY} w={116} lines={["Input", "Lagna degree"]} color={GREEN} />
      <MechBox x={164} y={rowBY} w={128} lines={["Ch4", "Lagna sub-lord"]} color={GOLD} />
      <MechBox x={316} y={rowBY} w={96} lines={lane1VerdictB.lines} color={lane1VerdictB.color} active />

      <line x1="140" y1={rowAY + 17} x2="162" y2={rowAY + 17} stroke={INK_MUTED} strokeWidth="1.5" />
      <line x1="292" y1={rowAY + 17} x2="314" y2={rowAY + 17} stroke={INK_MUTED} strokeWidth="1.5" />
      <line x1="140" y1={rowBY + 17} x2="162" y2={rowBY + 17} stroke={INK_MUTED} strokeWidth="1.5" />
      <line x1="292" y1={rowBY + 17} x2="314" y2={rowBY + 17} stroke={INK_MUTED} strokeWidth="1.5" />

      <g>
        <rect x="436" y="46" width="108" height="64" rx={8} fill={errorInjected ? GREEN : "transparent"} stroke={errorInjected ? GREEN : HAIRLINE} strokeWidth="1.2" fillOpacity={errorInjected ? 0.06 : 0} />
        {(errorInjected ? ["only one thread", "breaks — disagreement", "exposes the error"] : ["separate failure", "modes rarely align", "by chance"]).map((line, i) => (
          <text key={i} x="490" y={66 + i * 14} textAnchor="middle" fill={errorInjected ? GREEN : INK_MUTED} fontSize="9.5">{line}</text>
        ))}
      </g>
      <line x1="412" y1={rowAY + 17} x2="434" y2="72" stroke={INK_MUTED} strokeWidth="1.2" strokeDasharray="3 3" />
      <line x1="412" y1={rowBY + 17} x2="434" y2="86" stroke={INK_MUTED} strokeWidth="1.2" strokeDasharray="3 3" />

      <line x1="16" y1="152" x2="544" y2="152" stroke={HAIRLINE} strokeWidth="1" strokeDasharray="4 4" />

      <text x="24" y="172" fill={PURPLE} fontSize="11" fontWeight="600">Same root — one shared input</text>

      <MechBox x={24} y={sharedY} w={116} lines={errorInjected ? ["Shared input ✕", "Lagna degree — wrong"] : ["Shared input", "Lagna degree"]} color={errorInjected ? VERMILION : PURPLE} active={errorInjected} />
      <MechBox x={164} y={lane2Row1Y} w={128} lines={["Ch4", "Lagna sub-lord"]} color={GOLD} />
      <MechBox x={164} y={lane2Row2Y} w={128} lines={["Ch5.2", "Nāḍiāṁśa"]} color={GOLD} />
      <MechBox x={316} y={lane2Row1Y} w={96} lines={lane2Verdict.lines} color={lane2Verdict.color} active={!errorInjected} />
      <MechBox x={316} y={lane2Row2Y} w={96} lines={lane2Verdict.lines} color={lane2Verdict.color} active={!errorInjected} />

      <line x1="140" y1={sharedY + 23} x2="162" y2={lane2Row1Y + 17} stroke={errorInjected ? VERMILION : INK_MUTED} strokeWidth="1.5" />
      <line x1="140" y1={sharedY + 23} x2="162" y2={lane2Row2Y + 17} stroke={errorInjected ? VERMILION : INK_MUTED} strokeWidth="1.5" />
      <line x1="292" y1={lane2Row1Y + 17} x2="314" y2={lane2Row1Y + 17} stroke={INK_MUTED} strokeWidth="1.5" />
      <line x1="292" y1={lane2Row2Y + 17} x2="314" y2={lane2Row2Y + 17} stroke={INK_MUTED} strokeWidth="1.5" />

      <g>
        <rect x="436" y={sharedY - 9} width="108" height="64" rx={8} fill={errorInjected ? VERMILION : "transparent"} stroke={errorInjected ? VERMILION : HAIRLINE} strokeWidth="1.2" fillOpacity={errorInjected ? 0.06 : 0} />
        {(errorInjected ? ["both break together —", "agreement hides", "the error"] : ["agreement only checks", "the arithmetic", "ran right"]).map((line, i) => (
          <text key={i} x="490" y={sharedY + 11 + i * 14} textAnchor="middle" fill={errorInjected ? VERMILION : INK_MUTED} fontSize="9.5">{line}</text>
        ))}
      </g>
      <line x1="412" y1={lane2Row1Y + 17} x2="434" y2={sharedY + 14} stroke={INK_MUTED} strokeWidth="1.2" strokeDasharray="3 3" />
      <line x1="412" y1={lane2Row2Y + 17} x2="434" y2={sharedY + 28} stroke={INK_MUTED} strokeWidth="1.2" strokeDasharray="3 3" />

      <text x="280" y="304" textAnchor="middle" fill={INK_MUTED} fontSize="10">A shared input error propagates identically through every reading; independent errors must align by chance</text>
    </svg>
  );
}

function LockedThreadRow({ chapter, method, root }: { chapter: string; method: string; root: string }) {
  return (
    <div style={lockedThreadStyle}>
      <Lock size={14} aria-hidden="true" />
      <span style={{ display: "grid", gap: "0.1rem" }}>
        <span style={{ fontWeight: 600, color: INK_PRIMARY }}>{chapter} · {method}</span>
        <span style={{ color: INK_MUTED, fontSize: "0.8rem" }}>{root}</span>
      </span>
      <span style={{ marginLeft: "auto", color: GREEN, fontSize: "0.78rem", fontWeight: 600 }}>counted</span>
    </div>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 600 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function MiniFact({ icon, title, body, color }: { icon: ReactNode; title: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}0F`, padding: "0.7rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color, fontWeight: 600 }}>{icon}{title}</div>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.35 }}>{body}</p>
    </div>
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
    padding: "0.55rem 0.75rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

const lockedThreadStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.55rem",
  border: `1px solid ${GREEN}44`,
  borderRadius: 8,
  background: `${GREEN}0A`,
  color: GREEN,
  padding: "0.6rem 0.7rem",
};

function threadButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "flex",
    alignItems: "center",
    gap: "0.55rem",
    width: "100%",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}14` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.6rem 0.7rem",
    cursor: "pointer",
  };
}

function togglePanelStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: "24px 1fr",
    gap: "0.65rem",
    alignItems: "start",
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}14` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.75rem",
    cursor: "pointer",
  };
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
};

const workbenchTwoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
  gap: "1rem",
  alignItems: "start",
};

const responsiveThreeColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
  gap: "1rem",
  alignItems: "start",
};

const bodyTextStyle: CSSProperties = {
  margin: "0.55rem 0 0",
  color: INK_SECONDARY,
  lineHeight: 1.5,
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
