"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { BadgeCheck, BriefcaseBusiness, Building2, Clock3, FileText, GitCompare, RotateCcw, ShieldCheck, TrendingUp, WalletCards } from "lucide-react";
import { workbenchDiagramLayoutStyle } from '@/components/learning-runtime/interactive/lib/layouts';

type ViewMode = "clusters" | "streams" | "timing" | "scope";
type TimingMode = "later" | "now";

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
  clusters: {
    label: "Clusters",
    title: "Compare service against enterprise",
    body: "Employment is read through the 6th and 10th. Entrepreneurship is read through the 3rd, 7th, lagna, 11th, Mars, and Mercury.",
    icon: <GitCompare size={16} />,
    color: BLUE,
  },
  streams: {
    label: "Streams",
    title: "Capacity is real, outcome is mixed",
    body: "Parashari, D10, AmK, KP, and yogas agree on enterprise capacity, but the business outcome is qualified by 7th-house and KP risk.",
    icon: <TrendingUp size={16} />,
    color: GREEN,
  },
  timing: {
    label: "Timing",
    title: "Capacity yes does not mean leap now",
    body: "The current period favours employment and gains. The cleaner business-significator period comes later, so the two-yes for leaving now is not met.",
    icon: <Clock3 size={16} />,
    color: GOLD,
  },
  scope: {
    label: "Scope",
    title: "Agency and financial routing stay visible",
    body: "Astrology can judge capacity, comparative prospects, and timing. Financial runway, business plan, and market viability need practical advisors.",
    icon: <ShieldCheck size={16} />,
    color: PURPLE,
  },
};

export function EntrepreneurshipEmploymentSynthesisWorkbench() {
  const [viewMode, setViewMode] = useState<ViewMode>("timing");
  const [timingMode, setTimingMode] = useState<TimingMode>("later");
  const [enterpriseStrong, setEnterpriseStrong] = useState(true);
  const [marketMixed, setMarketMixed] = useState(true);
  const [employmentStable, setEmploymentStable] = useState(true);
  const [kpRiskNamed, setKpRiskNamed] = useState(true);
  const [agencyFramed, setAgencyFramed] = useState(true);
  const [financialRouted, setFinancialRouted] = useState(true);
  const [guaranteeRefused, setGuaranteeRefused] = useState(true);

  const leapNow = timingMode === "now";
  const scopeOk = agencyFramed && financialRouted && guaranteeRefused;
  const capacityScore = (enterpriseStrong ? 42 : 12) + (kpRiskNamed ? 8 : 0) + (marketMixed ? -8 : 12);
  const leapScore = Math.max(5, Math.min(98, capacityScore + (leapNow ? 30 : -10) + (marketMixed ? -14 : 10) + (scopeOk ? 8 : -18)));

  const tier = useMemo(() => {
    if (!scopeOk) return "method warning";
    if (leapNow && enterpriseStrong && !marketMixed) return "strong leap window";
    if (!leapNow && enterpriseStrong) return "moderate: build now, leap later";
    return "weak";
  }, [enterpriseStrong, leapNow, marketMixed, scopeOk]);

  const verdict = useMemo(() => {
    if (!scopeOk) return "Scope warning: do not guarantee success or answer financial runway astrologically. Return agency and route business-plan numbers to qualified advisors.";
    if (leapNow && enterpriseStrong && !marketMixed) return "Strong support for the leap window: enterprise capacity is clean, business outcome indicators are supportive, and the business timing is active. Still route finances and preserve agency.";
    if (enterpriseStrong) return "Capacity yes / now no: real entrepreneurial ability is present, but the business outcome is mixed and current timing favours employment. Build the venture alongside work, then revisit the leap when business timing turns.";
    return "The leap is weakly supported: enterprise capacity is not strong enough to outweigh stable employment and practical risk. Frame this as a chart view, not a command.";
  }, [enterpriseStrong, leapNow, marketMixed, scopeOk]);

  return (
    <div data-interactive="entrepreneurship-employment-synthesis-workbench" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Worked synthesis: employment vs enterprise</p>
            <h2 style={{ margin: "0.2rem 0 0", color: GOLD, fontSize: "1.35rem" }}>Separate capacity from the timing of the leap</h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 920 }}>
              Compare the service and business clusters side by side, then test whether the chart supports leaving now or building first.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setViewMode("timing");
              setTimingMode("later");
              setEnterpriseStrong(true);
              setMarketMixed(true);
              setEmploymentStable(true);
              setKpRiskNamed(true);
              setAgencyFramed(true);
              setFinancialRouted(true);
              setGuaranteeRefused(true);
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
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={eyebrowStyle}>Comparative verdict</p>
              <h3 style={{ margin: "0.15rem 0 0", color: tierColor(tier), fontSize: "1.2rem" }}>{tier}</h3>
            </div>
            <strong style={{ color: tierColor(tier), fontWeight: 600 }}>{leapScore}% leap support</strong>
          </div>
          <EnterpriseEmploymentSvg leapNow={leapNow} enterpriseStrong={enterpriseStrong} marketMixed={marketMixed} employmentStable={employmentStable} scopeOk={scopeOk} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 135px), 1fr))", gap: "0.6rem" }}>
            <MiniFact title="Enterprise" body={enterpriseStrong ? "capacity yes" : "capacity weak"} color={enterpriseStrong ? GREEN : GOLD} icon={<TrendingUp size={16} />} />
            <MiniFact title="Employment" body={employmentStable ? "stable now" : "less stable"} color={employmentStable ? BLUE : GOLD} icon={<BriefcaseBusiness size={16} />} />
            <MiniFact title="Timing" body={leapNow ? "leap window" : "build first"} color={leapNow ? GREEN : GOLD} icon={<Clock3 size={16} />} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem", flex: "1 1 280px" }}>
          <Panel title="Timing scenario" icon={<Clock3 size={18} />} color={leapNow ? GREEN : GOLD}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              <button type="button" aria-pressed={timingMode === "later"} onClick={() => setTimingMode("later")} style={buttonStyle(timingMode === "later", GOLD)}>
                Business dasha later
              </button>
              <button type="button" aria-pressed={timingMode === "now"} onClick={() => setTimingMode("now")} style={buttonStyle(timingMode === "now", GREEN)}>
                Business dasha now
              </button>
            </div>
            <p style={bodyTextStyle}>Switch to the lesson&apos;s contrasting case where the enterprise cluster is clean and the timing supports the leap.</p>
          </Panel>

          <Panel title="Stream comparison" icon={<GitCompare size={18} />} color={BLUE}>
            <StreamRow label="Parashari" body="Mars/3rd show enterprise capacity; 7th outcome is mixed; 10th keeps employment viable." verdict="capacity yes" color={GREEN} />
            <StreamRow label="D10" body="Leadership-flavoured professional capacity is confirmed, but marketplace outcome is not settled." verdict="confirms capacity" color={GREEN} />
            <StreamRow label="AmK" body="Mars as AmK supports drive, initiative, and independent work." verdict="enterprise fit" color={PURPLE} />
            <StreamRow label="KP" body={marketMixed ? "7th CSL mixes 7/11 with 8/12; 10th CSL keeps employment stable." : "7th CSL cleanly supports 7/11/2, raising business prospects."} verdict={marketMixed ? "mixed-to-risky" : "clean-positive"} color={marketMixed ? GOLD : GREEN} />
            <StreamRow label="Yogas" body="Ruchaka gives leadership capacity; mild Dhana leans gains through 10th/11th." verdict="mixed texture" color={GOLD} />
          </Panel>
        </section>
      </div>

      <div style={workbenchTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Reading controls</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={enterpriseStrong} color={enterpriseStrong ? GREEN : GOLD} icon={<TrendingUp size={18} />} title="Enterprise capacity strong" body={enterpriseStrong ? "Mars/lagna/3rd/Ruchaka/AmK show real ability." : "Capacity is not strong enough for a leap reading."} onClick={() => setEnterpriseStrong((value) => !value)} />
            <Toggle active={marketMixed} color={marketMixed ? GOLD : GREEN} icon={<Building2 size={18} />} title="Business outcome mixed" body={marketMixed ? "7th and KP carry risk, obstruction, or loss signals." : "Business outcome indicators are clean-positive."} onClick={() => setMarketMixed((value) => !value)} />
            <Toggle active={employmentStable} color={employmentStable ? BLUE : GOLD} icon={<BriefcaseBusiness size={18} />} title="Employment stable now" body={employmentStable ? "6th/10th and current gains timing support staying employed." : "Service cluster is weaker in this scenario."} onClick={() => setEmploymentStable((value) => !value)} />
            <Toggle active={kpRiskNamed} color={kpRiskNamed ? GOLD : VERMILION} icon={<BadgeCheck size={18} />} title="KP risk named" body={kpRiskNamed ? "Mixed 8/12 risk is surfaced instead of hidden." : "KP risk is being softened away."} onClick={() => setKpRiskNamed((value) => !value)} />
          </div>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Scope and ethics</p>
          <div style={{ display: "grid", gap: "0.75rem", marginTop: "0.75rem" }}>
            <Toggle active={agencyFramed} color={agencyFramed ? GREEN : VERMILION} icon={<ShieldCheck size={18} />} title="Agency preserved" body={agencyFramed ? "The answer pushes neither leap nor staying." : "The astrologer is pushing the decision."} onClick={() => setAgencyFramed((value) => !value)} />
            <Toggle active={financialRouted} color={financialRouted ? GREEN : VERMILION} icon={<WalletCards size={18} />} title="Financial runway routed" body={financialRouted ? "Runway, business plan, and viability go to practical advisors." : "Financial runway is being answered astrologically."} onClick={() => setFinancialRouted((value) => !value)} />
            <Toggle active={guaranteeRefused} color={guaranteeRefused ? GREEN : VERMILION} icon={<FileText size={18} />} title="Guarantee refused" body={guaranteeRefused ? "The write-up gives likelihood, not certainty." : "The reading promises business success."} onClick={() => setGuaranteeRefused((value) => !value)} />
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

function EnterpriseEmploymentSvg({ leapNow, enterpriseStrong, marketMixed, employmentStable, scopeOk }: { leapNow: boolean; enterpriseStrong: boolean; marketMixed: boolean; employmentStable: boolean; scopeOk: boolean }) {
  const enterpriseColor = enterpriseStrong ? GREEN : GOLD;
  const businessOutcomeColor = marketMixed ? GOLD : GREEN;
  const employmentColor = employmentStable ? BLUE : GOLD;
  const finalColor = !scopeOk ? VERMILION : leapNow && enterpriseStrong && !marketMixed ? GREEN : GOLD;
  const finalLabel = !scopeOk ? "SCOPE" : leapNow && enterpriseStrong && !marketMixed ? "LEAP NOW" : "BUILD FIRST";

  return (
    <svg viewBox="0 0 760 410" role="img" aria-label="Employment versus entrepreneurship synthesis balance diagram" style={{ width: "100%", minHeight: 320, margin: "0.7rem 0" }}>
      <rect x="18" y="18" width="724" height="374" rx="8" fill={SURFACE} stroke={HAIRLINE} />
      <path d="M 380 100 L 380 286" stroke={HAIRLINE} strokeWidth="3" />
      <path d="M 165 286 L 595 286" stroke={HAIRLINE} strokeWidth="3" />
      <path d="M 338 200 L 422 200" stroke={HAIRLINE} strokeWidth="3" strokeDasharray="6 8" />
      <circle cx="380" cy="100" r="42" fill={OPAQUE_LIGHT_FILL[PURPLE]} stroke={PURPLE} strokeWidth="3" />
      <text x="380" y="96" textAnchor="middle" fill={PURPLE} fontSize="15" fontWeight="600">QUESTION</text>
      <text x="380" y="117" textAnchor="middle" fill={INK_MUTED} fontSize="13">leave employment?</text>

      <rect x="58" y="145" width="300" height="130" rx="8" fill={OPAQUE_LIGHT_FILL[employmentColor]} stroke={employmentColor} strokeWidth="2.5" />
      <text x="208" y="178" textAnchor="middle" fill={employmentColor} fontSize="18" fontWeight="600">Employment case</text>
      <text x="208" y="207" textAnchor="middle" fill={INK_MUTED} fontSize="14">6th + 10th + gains now</text>
      <text x="208" y="238" textAnchor="middle" fill={employmentColor} fontSize="15" fontWeight="600">{employmentStable ? "stable near-term" : "less stable"}</text>

      <rect x="402" y="145" width="300" height="130" rx="8" fill={OPAQUE_LIGHT_FILL[enterpriseColor]} stroke={enterpriseColor} strokeWidth="2.5" />
      <text x="552" y="178" textAnchor="middle" fill={enterpriseColor} fontSize="18" fontWeight="600">Enterprise case</text>
      <text x="552" y="207" textAnchor="middle" fill={INK_MUTED} fontSize="14">3rd + 7th + lagna + Mars</text>
      <text x="552" y="238" textAnchor="middle" fill={businessOutcomeColor} fontSize="15" fontWeight="600">{marketMixed ? "capacity yes, outcome mixed" : "clean business support"}</text>

      <circle cx="380" cy="286" r="68" fill={OPAQUE_LIGHT_FILL[finalColor]} stroke={finalColor} strokeWidth="3" />
      <text x="380" y="280" textAnchor="middle" fill={finalColor} fontSize="20" fontWeight="600">{finalLabel}</text>
      <text x="380" y="306" textAnchor="middle" fill={INK_MUTED} fontSize="14">{leapNow ? "business timing active" : "business timing later"}</text>
      <rect x="90" y="360" width="580" height="36" rx="8" fill={OPAQUE_LIGHT_FILL[GOLD]} stroke={HAIRLINE} />
      <text x="380" y="383" textAnchor="middle" fill={INK_MUTED} fontSize="14">Capacity and timing are separate findings; finance remains out of scope.</text>
    </svg>
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
  if (tier === "strong leap window") return GREEN;
  if (tier === "moderate: build now, leap later") return GOLD;
  if (tier === "weak") return BLUE;
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
