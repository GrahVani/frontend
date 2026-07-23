"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  AlertTriangle,
  BadgeCheck,
  Lock,
  MessageSquareWarning,
  RefreshCw,
  Route,
  Scale,
  ShieldCheck,
  Sparkles,
  Unlock,
} from "lucide-react";
import { workbenchDiagramLayoutStyle } from "@/components/learning-runtime/interactive/lib/layouts";

type ViewKey = "attempt" | "indicators" | "ethics";

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

const REQUIRED_CHECKS = [
  {
    key: "pattern",
    label: "Describe first-marriage difficulty as a pattern",
    body: "7th lord in the 12th and Saturn on the 7th are named without blame.",
    icon: <Scale size={16} />,
  },
  {
    key: "second",
    label: "Read second-marriage support independently",
    body: "Upapada second sign, Venus in the 11th, KP 2-7-11, and Venus dasha are weighed.",
    icon: <Sparkles size={16} />,
  },
  {
    key: "choice",
    label: "State availability, not compulsion",
    body: "The chart supports remarriage; it does not order Meena to remarry.",
    icon: <Route size={16} />,
  },
  {
    key: "grief",
    label: "Route active grief to care",
    body: "If guilt or grief is active, counselling support is named gently.",
    icon: <ShieldCheck size={16} />,
  },
] as const;

const BLAME_WORDS = ["cursed", "bad for marriage", "your fault", "ruin marriages", "must remarry", "definitely remarry"];

export function MarriageCase5SecondMarriageEthicalFraming() {
  const [activeView, setActiveView] = useState<ViewKey>("attempt");
  const [isUnsealed, setIsUnsealed] = useState(false);
  const [firstPattern, setFirstPattern] = useState("");
  const [secondSupport, setSecondSupport] = useState("");
  const [windowText, setWindowText] = useState("");
  const [clientWords, setClientWords] = useState("");
  const [checks, setChecks] = useState<Record<string, boolean>>({
    pattern: true,
    second: true,
    choice: true,
    grief: false,
  });

  const flaggedWords = useMemo(() => {
    const lower = clientWords.toLowerCase();
    return BLAME_WORDS.filter((word) => lower.includes(word));
  }, [clientWords]);

  const readyCount = Object.values(checks).filter(Boolean).length;
  const canFinalize = readyCount === REQUIRED_CHECKS.length && flaggedWords.length === 0 && clientWords.trim().length > 80;

  const resetAll = () => {
    setActiveView("attempt");
    setIsUnsealed(false);
    setFirstPattern("");
    setSecondSupport("");
    setWindowText("");
    setClientWords("");
    setChecks({ pattern: true, second: true, choice: true, grief: false });
  };

  return (
    <div data-interactive="marriage-case-5-second-marriage-question-with-ethical-framing" style={{ display: "grid", gap: "1.25rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Module 22 Chapter 2 Case 5 Workbench</p>
            <h2 style={headingStyle}>Second-marriage question with ethical framing</h2>
            <p style={bodyStyle}>
              Work Meena&apos;s remarriage question by separating first-marriage difficulty from personal blame, then reading second-marriage support and grief routing before the final wording.
            </p>
          </div>
          <button type="button" onClick={resetAll} style={softButtonStyle}>
            <RefreshCw size={14} aria-hidden="true" />
            Reset Workbench
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ textAlign: "center", marginBottom: "0.25rem" }}>
          <p style={eyebrowStyle}>Second-marriage architecture</p>
          <span style={{ fontSize: "0.85rem", color: INK_SECONDARY }}>Describe the first pattern, prove the second support, then frame the client-facing answer with care.</span>
        </div>
        <SecondMarriageSvg activeView={activeView} canFinalize={canFinalize} />
      </section>

      <div style={workbenchDiagramLayoutStyle}>
        <section style={{ ...cardStyle, flex: "2 1 520px" }}>
          <div style={tabRailStyle}>
            <TabButton active={activeView === "attempt"} color={GOLD} onClick={() => setActiveView("attempt")}>1. Sealed Attempt</TabButton>
            <TabButton active={activeView === "indicators"} color={GREEN} onClick={() => setActiveView("indicators")}>2. Indicator Map</TabButton>
            <TabButton active={activeView === "ethics"} color={BLUE} onClick={() => setActiveView("ethics")}>3. Framing Guard</TabButton>
          </div>

          {activeView === "attempt" && (
            <div style={{ display: "grid", gap: "0.9rem" }}>
              <div style={noticeStyle(GOLD)}>
                {isUnsealed ? <Unlock size={18} /> : <Lock size={18} />}
                <span>{isUnsealed ? "Worked solution unsealed. Compare without erasing your attempt." : "Record your attempt before opening the worked solution."}</span>
              </div>
              <Field label="First-marriage difficulty, without blame" value={firstPattern} onChange={setFirstPattern} placeholder="e.g. 7th lord in 12th and Saturn aspect describe strain and separation, not fault." />
              <Field label="Second-marriage support" value={secondSupport} onChange={setSecondSupport} placeholder="e.g. second from Upapada supported, Venus in 11th, KP 2-7-11 grants remarriage." />
              <Field label="Window and confidence tier" value={windowText} onChange={setWindowText} placeholder="e.g. opening Venus dasha gives a supportive window; moderate-to-strong favourable." />
              <button type="button" onClick={() => setIsUnsealed((value) => !value)} style={{ ...softButtonStyle, justifySelf: "start" }}>
                {isUnsealed ? <Lock size={14} /> : <Unlock size={14} />}
                {isUnsealed ? "Seal Worked Solution" : "Unseal Worked Solution"}
              </button>
              {isUnsealed && (
                <div style={solutionStyle}>
                  <p style={panelTitleStyle}>Worked comparison</p>
                  <p style={bodyStyle}>
                    The first marriage shows real difficulty: Mars as 7th lord in the 12th and Saturn&apos;s separative aspect. The second marriage is still supported through the Upapada&apos;s second sign, Venus in the 11th, KP marriage houses, and the opening Venus dasha. Verdict: moderate-to-strong favourable, stated as available and supported.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeView === "indicators" && (
            <div style={{ display: "grid", gap: "0.75rem" }}>
              <IndicatorRow color={VERMILION} title="First-marriage difficulty" body="7th lord Mars in the 12th plus Saturn aspecting the 7th: a real separation pattern, not a personal indictment." />
              <IndicatorRow color={GREEN} title="Second from Upapada" body="The Jaimini second-marriage layer is benefic-supported, so the second marriage is read on its own merits." />
              <IndicatorRow color={BLUE} title="Venus and KP corroboration" body="Venus in the 11th supports fulfilment; the KP 7th cusp indicates 2, 7, and 11 for marriage fructification." />
              <IndicatorRow color={PURPLE} title="Timing window" body="The opening Venus mahadasha gives a supportive remarriage period, with transit refinement if a narrower span is needed." />
            </div>
          )}

          {activeView === "ethics" && (
            <div style={{ display: "grid", gap: "0.9rem" }}>
              <Field
                label="Client-facing answer"
                value={clientWords}
                onChange={setClientWords}
                multiline
                placeholder="Write a warm answer that says the first marriage was difficult without blame, the second marriage is supported, remarriage remains her choice, and grief can be supported by a counsellor."
              />
              <div style={flaggedWords.length > 0 ? noticeStyle(VERMILION) : noticeStyle(GREEN)}>
                {flaggedWords.length > 0 ? <MessageSquareWarning size={18} /> : <BadgeCheck size={18} />}
                <span>{flaggedWords.length > 0 ? `Rewrite flagged phrase: ${flaggedWords.join(", ")}` : "No blame-laden trigger phrases detected."}</span>
              </div>
            </div>
          )}
        </section>

        <aside style={{ ...cardStyle, flex: "1 1 340px" }}>
          <p style={eyebrowStyle}>Required ethical checks</p>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.85rem" }}>
            {REQUIRED_CHECKS.map((item) => (
              <ToggleRow
                key={item.key}
                checked={checks[item.key]}
                onChange={(checked) => setChecks((current) => ({ ...current, [item.key]: checked }))}
                label={item.label}
                body={item.body}
                icon={item.icon}
              />
            ))}
          </div>
          <div style={{ ...noticeStyle(canFinalize ? GREEN : GOLD), marginTop: "1rem" }}>
            {canFinalize ? <BadgeCheck size={18} /> : <AlertTriangle size={18} />}
            <span>{canFinalize ? "Ready to finalise: supportive verdict, no blame, grief routed." : `${readyCount}/4 checks clear. Add safe wording before finalising.`}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default MarriageCase5SecondMarriageEthicalFraming;

function SecondMarriageSvg({ activeView, canFinalize }: { activeView: ViewKey; canFinalize: boolean }) {
  const activeColor = activeView === "attempt" ? GOLD : activeView === "indicators" ? GREEN : BLUE;
  return (
    <svg viewBox="0 0 760 220" role="img" aria-label="Second marriage ethical framing flow" style={{ width: "100%", maxHeight: 245, margin: "0.5rem auto", display: "block" }}>
      <rect x="12" y="12" width="736" height="196" rx="10" fill="#FDFAF2" stroke={HAIRLINE} strokeWidth="1" />
      <g transform="translate(34, 42)">
        <rect x="0" y="0" width="190" height="126" rx="8" fill="#FFF3E0" stroke={VERMILION} strokeWidth="1.4" />
        <text x="95" y="24" textAnchor="middle" fill={VERMILION} fontSize="10" fontWeight="600">FIRST MARRIAGE</text>
        <text x="95" y="50" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="600">Difficulty is real</text>
        <text x="95" y="75" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">7th lord in 12th</text>
        <text x="95" y="94" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">Saturn aspect on 7th</text>
        <text x="95" y="113" textAnchor="middle" fill={VERMILION} fontSize="9" fontWeight="500">Describe, do not blame</text>
      </g>
      <path d="M232 105 L270 105" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="5 6" />
      <g transform="translate(276, 42)">
        <rect x="0" y="0" width="210" height="126" rx="8" fill="#E8F5E9" stroke={GREEN} strokeWidth="1.4" />
        <text x="105" y="24" textAnchor="middle" fill={GREEN} fontSize="10" fontWeight="600">SECOND MARRIAGE</text>
        <text x="105" y="50" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="600">Support is present</text>
        <text x="105" y="75" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">Upapada second sign</text>
        <text x="105" y="94" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">Venus 11th + KP yes</text>
        <text x="105" y="113" textAnchor="middle" fill={GREEN} fontSize="9" fontWeight="500">Moderate-to-strong favourable</text>
      </g>
      <path d="M492 105 L530 105" stroke={HAIRLINE} strokeWidth="2" strokeDasharray="5 6" />
      <g transform="translate(536, 42)">
        <rect x="0" y="0" width="190" height="126" rx="8" fill="#EBF3FA" stroke={canFinalize ? GREEN : activeColor} strokeWidth="1.8" />
        <text x="95" y="24" textAnchor="middle" fill={canFinalize ? GREEN : activeColor} fontSize="10" fontWeight="600">CLIENT WORDING</text>
        <text x="95" y="50" textAnchor="middle" fill={INK_PRIMARY} fontSize="11" fontWeight="600">{canFinalize ? "Ready to finalise" : "Guard the frame"}</text>
        <text x="95" y="75" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">Available, not required</text>
        <text x="95" y="94" textAnchor="middle" fill={INK_SECONDARY} fontSize="9" fontWeight="500">No curse, no fault</text>
        <text x="95" y="113" textAnchor="middle" fill={canFinalize ? GREEN : BLUE} fontSize="9" fontWeight="500">Grief routed with care</text>
      </g>
    </svg>
  );
}

function TabButton({ active, color, onClick, children }: { active: boolean; color: string; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} style={tabButtonStyle(active, color)}>
      {children}
    </button>
  );
}

function Field({ label, value, onChange, placeholder, multiline = false }: { label: string; value: string; onChange: (value: string) => void; placeholder: string; multiline?: boolean }) {
  const inputStyle: CSSProperties = {
    width: "100%",
    padding: "0.55rem 0.7rem",
    borderRadius: "0.45rem",
    border: `1px solid ${HAIRLINE}`,
    background: "#FFFFFF",
    color: INK_PRIMARY,
    fontSize: "0.9rem",
    lineHeight: 1.5,
  };

  return (
    <label style={{ display: "grid", gap: "0.25rem" }}>
      <span style={{ fontSize: "0.82rem", color: INK_SECONDARY, fontWeight: 600 }}>{label}</span>
      {multiline ? (
        <textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} rows={6} style={{ ...inputStyle, resize: "vertical" }} />
      ) : (
        <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} style={inputStyle} />
      )}
    </label>
  );
}

function ToggleRow({ checked, onChange, label, body, icon }: { checked: boolean; onChange: (checked: boolean) => void; label: string; body: string; icon: ReactNode }) {
  return (
    <label style={toggleStyle(checked)}>
      <span style={{ color: checked ? GREEN : INK_MUTED }}>{icon}</span>
      <span>
        <span style={{ display: "block", color: INK_PRIMARY, fontWeight: 500 }}>{label}</span>
        <span style={smallTextStyle}>{body}</span>
      </span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} style={{ marginLeft: "auto", accentColor: GOLD }} />
    </label>
  );
}

function IndicatorRow({ color, title, body }: { color: string; title: string; body: string }) {
  return (
    <div style={{ border: `1px solid ${color}`, borderRadius: "0.55rem", background: softFill(color), padding: "0.8rem" }}>
      <p style={{ ...panelTitleStyle, color }}>{title}</p>
      <p style={bodyStyle}>{body}</p>
    </div>
  );
}

function softFill(color: string) {
  return color === VERMILION ? "#FFF3E0" : color === GREEN ? "#E8F5E9" : color === BLUE ? "#EBF3FA" : "#F1ECFA";
}

const cardStyle: CSSProperties = {
  background: SURFACE,
  border: `1px solid ${HAIRLINE}`,
  borderRadius: "0.75rem",
  padding: "1.25rem",
  boxShadow: "var(--gl-card-shadow-soft)",
};

const eyebrowStyle: CSSProperties = {
  fontSize: "0.725rem",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: INK_MUTED,
  margin: 0,
};

const headingStyle: CSSProperties = {
  margin: "0.2rem 0 0",
  color: GOLD,
  fontSize: "1.35rem",
  fontWeight: 600,
  lineHeight: 1.25,
};

const panelTitleStyle: CSSProperties = {
  margin: 0,
  color: INK_PRIMARY,
  fontSize: "0.98rem",
  fontWeight: 600,
  lineHeight: 1.35,
};

const bodyStyle: CSSProperties = {
  margin: "0.45rem 0 0",
  color: INK_SECONDARY,
  lineHeight: 1.55,
  maxWidth: 900,
  fontSize: "0.95rem",
};

const smallTextStyle: CSSProperties = {
  color: INK_MUTED,
  fontSize: "0.82rem",
  lineHeight: 1.45,
};

const softButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.4rem",
  background: "transparent",
  border: `1px solid ${HAIRLINE}`,
  borderRadius: "0.5rem",
  padding: "0.45rem 0.8rem",
  fontSize: "0.85rem",
  color: GOLD,
  cursor: "pointer",
  fontWeight: 500,
};

const tabRailStyle: CSSProperties = {
  display: "flex",
  borderBottom: `1px solid ${HAIRLINE}`,
  paddingBottom: "0.5rem",
  marginBottom: "1rem",
  gap: "0.4rem",
  flexWrap: "wrap",
};

function tabButtonStyle(active: boolean, color: string): CSSProperties {
  return {
    padding: "0.45rem 0.8rem",
    fontSize: "0.85rem",
    borderRadius: "0.35rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    background: active ? softFill(color) : "transparent",
    color: active ? color : INK_SECONDARY,
    cursor: "pointer",
    fontWeight: 600,
  };
}

function toggleStyle(checked: boolean): CSSProperties {
  return {
    border: `1px solid ${checked ? GREEN : HAIRLINE}`,
    borderRadius: "0.55rem",
    background: checked ? "#E8F5E9" : "#FFFFFF",
    padding: "0.7rem",
    display: "flex",
    gap: "0.65rem",
    alignItems: "center",
    cursor: "pointer",
  };
}

function noticeStyle(color: string): CSSProperties {
  return {
    border: `1px solid ${color}`,
    borderRadius: "0.55rem",
    background: softFill(color),
    color,
    padding: "0.75rem",
    display: "flex",
    alignItems: "start",
    gap: "0.55rem",
    lineHeight: 1.45,
    fontSize: "0.9rem",
  };
}

const solutionStyle: CSSProperties = {
  border: `1px solid ${GREEN}`,
  borderRadius: "0.55rem",
  background: "#E8F5E9",
  padding: "0.9rem",
};
