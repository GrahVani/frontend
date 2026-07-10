"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, BriefcaseBusiness, Clock3, FileText, GitMerge, MapPin, RotateCcw, Scale, ShieldCheck, WalletCards } from "lucide-react";
import { workbenchDiagramLayoutStyle } from '@/components/learning-runtime/interactive/lib/layouts';

type ViewMode = "scope" | "streams" | "timing" | "writeup";
type KpMode = "supportive" | "divergent";

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

const OPAQUE_LIGHT_FILL: Record<string, string> = {
  [BLUE]: "#E3EEF9",
  [GREEN]: "#E8F5E9",
  [GOLD]: "#FDF4E3",
  [VERMILION]: "#F9E8E3",
  [PURPLE]: "#EDE9F6",
};

const VIEW_COPY: Record<ViewMode, { label: string; title: string; body: string; icon: ReactNode; color: string }> = {
  scope: {
    label: "Scope",
    title: "Fit, prospects, and timing are in scope",
    body: "Salary figures, legal clauses, commute, manager temperament, family factors, and risk appetite must be routed to the client or appropriate professionals.",
    icon: <ShieldCheck size={16} />,
    color: GOLD,
  },
  streams: {
    label: "Streams",
    title: "Gather each stream separately",
    body: "Parashari/D10 show capacity, AmK shows field fit, KP sharpens the specific offer, and yogas add gains texture.",
    icon: <GitMerge size={16} />,
    color: BLUE,
  },
  timing: {
    label: "Timing",
    title: "Saturn/Mercury plus transit supports now",
    body: "The dasha of the 10th lord and AmK opens the window, while supportive transit supplies the second yes.",
    icon: <Clock3 size={16} />,
    color: GREEN,
  },
  writeup: {
    label: "Write-up",
    title: "Document verdict, confidence, timing, and scope",
    body: "The finished answer is a strong-moderate yes, with Saturn demand and possible relocation/change named.",
    icon: <FileText size={16} />,
    color: PURPLE,
  },
};

export function JobOfferSynthesisWorkbench() {
  const [viewMode, setViewMode] = useState<ViewMode>("streams");
  const [kpMode, setKpMode] = useState<KpMode>("supportive");
  const [saturnDemand, setSaturnDemand] = useState(true);
  const [relocationFootnote, setRelocationFootnote] = useState(true);
  const [dashaWindow, setDashaWindow] = useState(true);
  const [transitTrigger, setTransitTrigger] = useState(true);
  const [scopeFramed, setScopeFramed] = useState(true);
  const [salaryRouted, setSalaryRouted] = useState(true);
  const [contractRouted, setContractRouted] = useState(true);

  const kpSupportive = kpMode === "supportive";
  const twoYes = dashaWindow && transitTrigger;
  const scopeOk = scopeFramed && salaryRouted && contractRouted;
  const divergence = !kpSupportive;
  const score = Math.max(5, Math.min(98, 46 + (kpSupportive ? 22 : -24) + (twoYes ? 18 : -8) + (scopeOk ? 8 : -18) - (saturnDemand ? 4 : 0) - (relocationFootnote ? 3 : 0)));

  const tier = useMemo(() => {
    if (!scopeOk) return "method warning";
    if (divergence) return "weak / uncertain on this offer";
    if (score >= 78) return "strong-moderate";
    if (score >= 58) return "moderate";
    return "weak";
  }, [divergence, scopeOk, score]);

  const verdict = useMemo(() => {
    if (!scopeOk) return "Scope warning: answer career fit, prospects, and timing; route salary figures and contract/legal clauses outside astrology.";
    if (divergence) return "Capacity remains positive, but KP flags obstruction/exit for this specific offer, so lower confidence and name the uncertainty instead of forcing a clean yes.";
    if (!twoYes) return "The streams support the offer, but timing is not fully confirmed until the dasha window and transit trigger both agree.";
    return "Strong-moderate yes: the offer looks supportive and well-timed, suited to analytical work, income-bearing, demanding, and possibly involving relocation or change.";
  }, [divergence, scopeOk, twoYes]);

  return (
    <div data-interactive="job-offer-synthesis-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Worked synthesis: job offer</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>Run the whole module on &quot;Should I take it?&quot;</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Scope the question, gather streams, handle qualifications and divergence, time the window, and produce a documented verdict.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setViewMode("streams");
              setKpMode("supportive");
              setSaturnDemand(true);
              setRelocationFootnote(true);
              setDashaWindow(true);
              setTransitTrigger(true);
              setScopeFramed(true);
              setSalaryRouted(true);
              setContractRouted(true);
            }}
            style={buttonStyle(false, GOLD)}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {(Object.keys(VIEW_COPY) as ViewMode[]).map((mode) => (
            <button key={mode} type="button" aria-pressed={viewMode === mode} onClick={() => setViewMode(mode)} style={buttonStyle(viewMode === mode, VIEW_COPY[mode].color)}>
              {VIEW_COPY[mode].icon}
              {VIEW_COPY[mode].label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: "0.8rem", border: `1px solid ${VIEW_COPY[viewMode].color}55`, borderRadius: 8, background: `${VIEW_COPY[viewMode].color}10`, padding: "0.85rem" }}>
          <h3 style={{ margin: 0, color: VIEW_COPY[viewMode].color, fontSize: "1.12rem" }}>{VIEW_COPY[viewMode].title}</h3>
          <p style={bodyTextStyle}>{VIEW_COPY[viewMode].body}</p>
        </div>
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 460px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Decision synthesis</p>
              <h3 style={{ margin: "0.15rem 0 0", color: tierColor(tier), fontSize: "1.2rem" }}>{tier}</h3>
            </div>
            <strong style={{ color: tierColor(tier) }}>{score}% support</strong>
          </div>
          <JobOfferSvg kpSupportive={kpSupportive} twoYes={twoYes} scopeOk={scopeOk} saturnDemand={saturnDemand} relocationFootnote={relocationFootnote} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 135px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="Convergence" body={kpSupportive ? "clear yes" : "real divergence"} color={kpSupportive ? GREEN : VERMILION} icon={<GitMerge size={16} />} />
            <MiniFact title="Texture" body={saturnDemand ? "demanding role" : "lighter demand"} color={GOLD} icon={<BriefcaseBusiness size={16} />} />
            <MiniFact title="Timing" body={twoYes ? "now supported" : "not confirmed"} color={twoYes ? GREEN : GOLD} icon={<Clock3 size={16} />} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Stream verdicts" icon={<GitMerge size={18} />} color={kpSupportive ? GREEN : VERMILION}>
            <StreamRow label="Parashari" body="10th-lord Saturn in 11th: capable, gains-oriented, demanding." verdict="positive" color={GREEN} />
            <StreamRow label="D10" body="Professional capacity confirmed at depth." verdict="positive" color={GREEN} />
            <StreamRow label="AmK" body="Mercury supports analytical/communication field match." verdict="positive" color={GREEN} />
            <StreamRow label="KP" body={kpSupportive ? "10/11/2/6 supports taking employment for income." : "8/12 flags obstruction, exit, or loss for this offer."} verdict={kpSupportive ? "positive + footnote" : "divergent"} color={kpSupportive ? GREEN : VERMILION} />
            <StreamRow label="Yoga" body="Mild Dhana-yoga supports gains through career." verdict="supportive" color={GOLD} />
          </Panel>

          <Panel title="Decision-closest KP switch" icon={<BadgeCheck size={18} />} color={kpSupportive ? GREEN : VERMILION}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <button type="button" aria-pressed={kpMode === "supportive"} onClick={() => setKpMode("supportive")} style={buttonStyle(kpMode === "supportive", GREEN)}>
                Supportive KP
              </button>
              <button type="button" aria-pressed={kpMode === "divergent"} onClick={() => setKpMode("divergent")} style={buttonStyle(kpMode === "divergent", VERMILION)}>
                KP obstruction
              </button>
            </div>
            <p style={bodyTextStyle}>Flip to the lesson’s variation: career capacity stays strong, but this specific offer becomes uncertain.</p>
          </Panel>
        </section>
      </div>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Qualifications and timing</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={saturnDemand} color={saturnDemand ? GOLD : GREEN} icon={<BriefcaseBusiness size={18} />} title="Saturn demand named" body={saturnDemand ? "Role rewards sustained effort; not an easy ride." : "Demand qualification hidden."} onClick={() => setSaturnDemand((value) => !value)} />
            <Toggle active={relocationFootnote} color={relocationFootnote ? GOLD : GREEN} icon={<MapPin size={18} />} title="KP 12th footnote named" body={relocationFootnote ? "Possible relocation, change, or expenditure noted." : "Relocation/change texture hidden."} onClick={() => setRelocationFootnote((value) => !value)} />
            <Toggle active={dashaWindow} color={dashaWindow ? GREEN : VERMILION} icon={<Clock3 size={18} />} title="Saturn/Mercury dasha window" body={dashaWindow ? "Career significators are running." : "Career window is not open."} onClick={() => setDashaWindow((value) => !value)} />
            <Toggle active={transitTrigger} color={transitTrigger ? GREEN : GOLD} icon={<BadgeCheck size={18} />} title="Transit trigger confirms" body={transitTrigger ? "Two-yes timing is met." : "Timing still awaits trigger."} onClick={() => setTransitTrigger((value) => !value)} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Scope and agency</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={scopeFramed} color={scopeFramed ? GREEN : VERMILION} icon={<ShieldCheck size={18} />} title="Scope frame stated" body={scopeFramed ? "Chart answers fit/prospects/timing; client decides." : "Agency/scope frame missing."} onClick={() => setScopeFramed((value) => !value)} />
            <Toggle active={salaryRouted} color={salaryRouted ? GREEN : VERMILION} icon={<WalletCards size={18} />} title="Salary routed out" body={salaryRouted ? "Compensation is benchmark/negotiation, not chart decree." : "Salary figure is being answered astrologically."} onClick={() => setSalaryRouted((value) => !value)} />
            <Toggle active={contractRouted} color={contractRouted ? GREEN : VERMILION} icon={<Scale size={18} />} title="Contract/legal routed out" body={contractRouted ? "Non-compete/legal terms go to a qualified professional." : "Legal terms are being answered astrologically."} onClick={() => setContractRouted((value) => !value)} />
          </div>
        </section>
      </div>

      <section style={{ ...cardStyle, borderColor: `${tierColor(tier)}66`, background: `${tierColor(tier)}10` }}>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "start" }}>
          <FileText size={20} color={tierColor(tier)} aria-hidden="true" />
          <div>
            <p style={eyebrowStyle}>Write-up preview</p>
            <h3 style={{ margin: "0.15rem 0 0", color: tierColor(tier), fontSize: "1.16rem" }}>{tier}</h3>
            <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{verdict}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function JobOfferSvg({ kpSupportive, twoYes, scopeOk, saturnDemand, relocationFootnote }: { kpSupportive: boolean; twoYes: boolean; scopeOk: boolean; saturnDemand: boolean; relocationFootnote: boolean }) {
  const finalColor = scopeOk ? (kpSupportive ? GREEN : VERMILION) : VERMILION;
  return (
    <svg viewBox="0 0 720 390" role="img" aria-label="Job offer synthesis decision diagram" style={{ width: "100%", minHeight: 340, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="684" height="354" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <path d="M 150 115 L 220 115 M 320 115 L 390 115 M 490 115 L 560 115" stroke={HAIRLINE} strokeWidth="3" />
      <Node x={100} y={115} label="Capacity" body="D1 + D10" active color={GREEN} />
      <Node x={270} y={115} label="Field fit" body="AmK Mercury" active color={PURPLE} />
      <Node x={440} y={115} label="This offer" body={kpSupportive ? "KP yes" : "KP obstruction"} active color={kpSupportive ? GREEN : VERMILION} />
      <Node x={610} y={115} label="Timing" body={twoYes ? "two-yes" : "pending"} active={twoYes} color={twoYes ? GREEN : GOLD} />
      <circle cx="360" cy="260" r="68" fill={OPAQUE_LIGHT_FILL[finalColor]} stroke={finalColor} strokeWidth="3" />
      <text x="360" y="254" textAnchor="middle" fill={finalColor} fontSize="20" fontWeight="600">{kpSupportive && scopeOk ? "TAKE?" : "CAUTION"}</text>
      <text x="360" y="278" textAnchor="middle" fill={INK_MUTED} fontSize="14">{kpSupportive ? "strong-moderate yes" : "uncertain offer"}</text>
      <rect x="100" y="330" width="520" height="40" rx="8" fill={OPAQUE_LIGHT_FILL[GOLD]} stroke={HAIRLINE} />
      <text x="360" y="354" textAnchor="middle" fill={INK_MUTED} fontSize="14">
        {saturnDemand ? "Saturn demand named" : "demand hidden"} | {relocationFootnote ? "relocation/change footnote named" : "footnote hidden"}
      </text>
    </svg>
  );
}

function Node({ x, y, label, body, active, color }: { x: number; y: number; label: string; body: string; active: boolean; color: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r="50" fill={active ? OPAQUE_LIGHT_FILL[color] : "transparent"} stroke={active ? color : HAIRLINE} strokeWidth={active ? 3 : 1.5} />
      <text x={x} y={y - 6} textAnchor="middle" fill={active ? color : INK_MUTED} fontSize="16" fontWeight="600">{label}</text>
      <text x={x} y={y + 18} textAnchor="middle" fill={INK_MUTED} fontSize="13">{body}</text>
    </g>
  );
}

function StreamRow({ label, body, verdict, color }: { label: string; body: string; verdict: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}0D`, padding: "0.65rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem", alignItems: "center" }}>
        <strong style={{ color }}>{label}</strong>
        <span style={{ color, fontSize: "0.78rem", fontWeight: 600 }}>{verdict}</span>
      </div>
      <p style={{ ...bodyTextStyle, marginTop: "0.35rem" }}>{body}</p>
    </div>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ ...cardStyle, padding: "0.9rem" }}>
      <div style={{ display: "flex", gap: "0.55rem", alignItems: "center", color }}>
        {icon}
        <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 600 }}>{title}</h3>
      </div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function Toggle({ active, color, icon, title, body, onClick }: { active: boolean; color: string; icon: ReactNode; title: string; body: string; onClick: () => void }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} style={toggleStyle(active, color)}>
      <span style={{ color }}>{icon}</span>
      <span>
        <strong style={{ fontWeight: 600 }}>{title}</strong>
        <span>{body}</span>
      </span>
    </button>
  );
}

function MiniFact({ icon, title, body, color }: { icon: ReactNode; title: string; body: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}10`, padding: "0.65rem" }}>
      <div style={{ display: "flex", gap: "0.45rem", alignItems: "center", color }}>
        {icon}
        <strong style={{ fontSize: "0.86rem", fontWeight: 600 }}>{title}</strong>
      </div>
      <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.82rem", lineHeight: 1.35 }}>{body}</p>
    </div>
  );
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  boxShadow: "var(--gl-shadow-soft)",
};

const workbenchTwoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(360px, 1.25fr) minmax(320px, 1fr)",
  gap: "1rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontSize: "0.75rem",
  fontWeight: 600,
};

const bodyTextStyle: CSSProperties = {
  margin: "0.45rem 0 0",
  color: INK_SECONDARY,
  lineHeight: 1.55,
  fontSize: "0.92rem",
};

function tierColor(tier: string): string {
  if (tier === "strong-moderate") return GREEN;
  if (tier === "moderate") return BLUE;
  if (tier === "weak / uncertain on this offer") return GOLD;
  return VERMILION;
}

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}16` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.58rem 0.75rem",
    minHeight: 38,
    display: "inline-flex",
    gap: "0.45rem",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
    cursor: "pointer",
  };
}

function toggleStyle(active: boolean, color: string): CSSProperties {
  return {
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}12` : "transparent",
    color: INK_PRIMARY,
    padding: "0.75rem",
    display: "flex",
    gap: "0.7rem",
    alignItems: "start",
    textAlign: "left",
    cursor: "pointer",
  };
}
