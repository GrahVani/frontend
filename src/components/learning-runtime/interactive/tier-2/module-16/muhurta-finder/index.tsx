"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  BadgeCheck,
  Ban,
  ChevronDown,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { workbenchTwoColumnStyle } from "@/components/learning-runtime/interactive/lib/layouts";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const ACCENT = "var(--gl-gold-accent)";
const GREEN = "#2F7D55";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";

const STAGES = [
  { id: 1, label: "Event context" },
  { id: 2, label: "Candidate window" },
  { id: 3, label: "Foundational screening" },
  { id: 4, label: "Personalisation overlay" },
  { id: 5, label: "Final selection" },
];

const EVENTS = ["Marriage", "Gṛha-praveśa", "Business-launch", "Surgery", "Journey", "Saṁskāra"];

const NAKSHATRAS = [
  "Aśvinī", "Bharaṇī", "Kṛttikā", "Rohiṇī", "Mṛgaśīrṣa", "Ārdrā", "Punarvasu", "Puṣya", "Āśleṣā",
  "Maghā", "Pūrvaphālgunī", "Uttaraphālgunī", "Hasta", "Chitrā", "Svātī", "Viśākhā", "Anurādhā", "Jyeṣṭhā",
  "Mūla", "Pūrvāṣāḍhā", "Uttarāṣāḍhā", "Śravaṇa", "Dhaniṣṭhā", "Śatabhiṣaj", "Pūrvabhādrapadā", "Uttarabhādrapadā", "Revatī",
];

const TARA_NAMES = ["Janma", "Sampat", "Vipat", "Kṣema", "Pratyari", "Sādhaka", "Vadha", "Mitra", "Parama Mitra"];
const TARA_AUSPICIOUS = [false, true, false, true, false, true, false, true, true];

const TITHI_CLASSES = ["Nandā", "Bhadrā", "Jayā", "Riktā", "Pūrṇā"];

interface Candidate {
  id: number;
  date: string;
  nak: number;
  tithiClass: string;
  yogaClear: boolean;
  karanaClear: boolean;
}

function taraGroup(birthNak: number, eventNak: number) {
  const diff = (eventNak - birthNak) % 9;
  const idx = ((diff + 9) % 9);
  return { name: TARA_NAMES[idx], auspicious: TARA_AUSPICIOUS[idx] };
}

function stakesFor(event: string, anxiety: boolean) {
  if (anxiety) return { level: "Trivial-client-paranoia", color: VERMILION, note: "Decline per T1-23's scripted response." };
  if (["Marriage", "Surgery", "Business-launch"].includes(event)) return { level: "High-stakes", color: VERMILION, note: "Warrant the full five-stage pipeline." };
  if (event === "Gṛha-praveśa" || event === "Saṁskāra") return { level: "Medium-stakes", color: GOLD, note: "Full pipeline recommended; some routine cases may use lighter checks." };
  return { level: "Routine-stakes", color: GREEN, note: "Chowghadiyā-level screening may suffice." };
}

export function MuhurtaFinder() {
  const [stage, setStage] = useState(1);
  const [event, setEvent] = useState("Marriage");
  const [anxiety, setAnxiety] = useState(false);
  const [brideNak, setBrideNak] = useState(11); // Uttaraphalguni
  const [groomNak, setGroomNak] = useState(16); // Anuradha
  const [candidates, setCandidates] = useState<Candidate[]>([
    { id: 1, date: "6 Nov 2026, Friday", nak: 20, tithiClass: "Riktā", yogaClear: true, karanaClear: true },
    { id: 2, date: "8 Nov 2026, Sunday", nak: 7, tithiClass: "Riktā", yogaClear: true, karanaClear: true },
    { id: 3, date: "11 Nov 2026, Wednesday", nak: 3, tithiClass: "Pūrṇā", yogaClear: true, karanaClear: true },
  ]);

  const stakes = useMemo(() => stakesFor(event, anxiety), [event, anxiety]);

  const evaluated = useMemo(() => candidates.map((c) => {
    const foundationalPass = c.tithiClass !== "Riktā" && c.yogaClear && c.karanaClear;
    const brideTara = taraGroup(brideNak, c.nak);
    const groomTara = taraGroup(groomNak, c.nak);
    const taraPass = brideTara.auspicious && groomTara.auspicious;
    const finalPass = foundationalPass && taraPass;
    return { ...c, foundationalPass, brideTara, groomTara, taraPass, finalPass };
  }), [candidates, brideNak, groomNak]);

  const winner = evaluated.find((c) => c.finalPass) || null;

  const reset = () => {
    setStage(1);
    setEvent("Marriage");
    setAnxiety(false);
    setBrideNak(11);
    setGroomNak(16);
    setCandidates([
      { id: 1, date: "6 Nov 2026, Friday", nak: 20, tithiClass: "Riktā", yogaClear: true, karanaClear: true },
      { id: 2, date: "8 Nov 2026, Sunday", nak: 7, tithiClass: "Riktā", yogaClear: true, karanaClear: true },
      { id: 3, date: "11 Nov 2026, Wednesday", nak: 3, tithiClass: "Pūrṇā", yogaClear: true, karanaClear: true },
    ]);
  };

  return (
    <div data-interactive="muhurta-finder" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Muhūrta finder</p>
            <h2 style={{ margin: "0.2rem 0 0", color: ACCENT, fontSize: "1.35rem", fontWeight: 600 }}>
              Five-stage workflow from request to recommendation
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 900 }}>
              Walk through event-context intake, candidate-window identification, foundational screening, personalisation overlay, and final selection. Each stage feeds the next.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, ACCENT)}>
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={cardStyle}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
          {STAGES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setStage(s.id)}
              style={{
                flex: "1 1 120px",
                padding: "0.5rem",
                borderRadius: 6,
                border: "1px solid " + (stage === s.id ? ACCENT : HAIRLINE),
                background: stage === s.id ? ACCENT + "15" : SURFACE,
                color: stage === s.id ? ACCENT : INK_SECONDARY,
                fontWeight: 600,
                fontSize: "0.82rem",
                cursor: "pointer",
              }}
            >
              <span style={{ display: "block", fontSize: "0.7rem", color: INK_MUTED, fontWeight: 700 }}>Stage {s.id}</span>
              {s.label}
            </button>
          ))}
        </div>
      </section>

      {stage === 1 && (
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Stage 1 — Event-context intake</p>
          <div style={workbenchTwoColumnStyle}>
            <div>
              <label style={{ ...eyebrowStyle, display: "block", marginBottom: "0.35rem" }}>Event type</label>
              <div style={{ position: "relative" }}>
                <select value={event} onChange={(e) => setEvent(e.target.value)} style={selectStyle}>
                  {EVENTS.map((ev) => <option key={ev} value={ev}>{ev}</option>)}
                </select>
                <ChevronDown size={14} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: INK_MUTED }} aria-hidden="true" />
              </div>
            </div>
            <div>
              <label style={{ ...eyebrowStyle, display: "block", marginBottom: "0.35rem" }}>Client framing</label>
              <div style={{ display: "flex", gap: "0.45rem" }}>
                <button type="button" aria-pressed={!anxiety} onClick={() => setAnxiety(false)} style={buttonStyle(!anxiety, GREEN)}>Genuine request</button>
                <button type="button" aria-pressed={anxiety} onClick={() => setAnxiety(true)} style={buttonStyle(anxiety, VERMILION)}>Trivial anxiety / paranoia</button>
              </div>
            </div>
          </div>

          <div style={{ marginTop: "0.75rem", padding: "0.65rem", borderRadius: 8, border: "1px solid " + stakes.color, background: stakes.color + "10" }}>
            <p style={{ margin: 0, color: stakes.color, fontWeight: 600, fontSize: "1.05rem" }}>Stakes classification: {stakes.level}</p>
            <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY }}>{stakes.note}</p>
          </div>
        </section>
      )}

      {stage === 2 && (
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Stage 2 — Candidate-window identification</p>
          <p style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            The client&apos;s practical range produced three candidate moments. A genuine muhūrta service compares several candidates rather than accepting the first suggested date.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "0.55rem", marginTop: "0.55rem" }}>
            {candidates.map((c) => (
              <div key={c.id} style={{ border: "1px solid " + HAIRLINE, borderRadius: 6, padding: "0.55rem" }}>
                <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" }}>Candidate {c.id}</p>
                <p style={{ margin: "0.15rem 0 0", color: INK_PRIMARY, fontWeight: 600, fontSize: "0.9rem" }}>{c.date}</p>
                <p style={{ margin: "0.1rem 0 0", color: INK_SECONDARY, fontSize: "0.8rem" }}>{NAKSHATRAS[c.nak]}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {(stage === 3 || stage === 4) && (
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Stage {stage} — {stage === 3 ? "Foundational screening" : "Personalisation overlay"}</p>

          <div style={{ marginBottom: "0.75rem" }}>
            <p style={{ ...eyebrowStyle, marginBottom: "0.35rem" }}>Native birth nakṣatras</p>
            <div style={workbenchTwoColumnStyle}>
              <div style={{ position: "relative" }}>
                <label style={{ ...eyebrowStyle, display: "block", marginBottom: "0.3rem" }}>Bride / native 1</label>
                <select value={brideNak} onChange={(e) => setBrideNak(parseInt(e.target.value, 10))} style={selectStyle}>
                  {NAKSHATRAS.map((n, i) => <option key={i} value={i}>{n}</option>)}
                </select>
                <ChevronDown size={14} style={{ position: "absolute", right: 10, bottom: 10, pointerEvents: "none", color: INK_MUTED }} aria-hidden="true" />
              </div>
              <div style={{ position: "relative" }}>
                <label style={{ ...eyebrowStyle, display: "block", marginBottom: "0.3rem" }}>Groom / native 2</label>
                <select value={groomNak} onChange={(e) => setGroomNak(parseInt(e.target.value, 10))} style={selectStyle}>
                  {NAKSHATRAS.map((n, i) => <option key={i} value={i}>{n}</option>)}
                </select>
                <ChevronDown size={14} style={{ position: "absolute", right: 10, bottom: 10, pointerEvents: "none", color: INK_MUTED }} aria-hidden="true" />
              </div>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
              <thead>
                <tr>
                  <th style={thStyle}>Candidate</th>
                  <th style={thStyle}>Nakṣatra</th>
                  <th style={thStyle}>Tithi class</th>
                  <th style={thStyle}>Yoga / Karaṇa</th>
                  <th style={thStyle}>Bride tārā</th>
                  <th style={thStyle}>Groom tārā</th>
                  <th style={thStyle}>Verdict</th>
                </tr>
              </thead>
              <tbody>
                {evaluated.map((c) => (
                  <tr key={c.id}>
                    <td style={tdStyle}>{c.date}</td>
                    <td style={tdStyle}>{NAKSHATRAS[c.nak]}</td>
                    <td style={tdStyle}>
                      <div style={{ position: "relative" }}>
                        <select value={c.tithiClass} onChange={(e) => updateCandidate(c.id, { tithiClass: e.target.value })} style={{ ...selectStyle, borderColor: c.tithiClass === "Riktā" ? VERMILION : HAIRLINE }}>
                          {TITHI_CLASSES.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", gap: "0.35rem" }}>
                        <button type="button" aria-pressed={c.yogaClear} onClick={() => updateCandidate(c.id, { yogaClear: !c.yogaClear })} style={smallToggle(c.yogaClear, c.yogaClear ? GREEN : VERMILION)}>Yoga</button>
                        <button type="button" aria-pressed={c.karanaClear} onClick={() => updateCandidate(c.id, { karanaClear: !c.karanaClear })} style={smallToggle(c.karanaClear, c.karanaClear ? GREEN : VERMILION)}>Karaṇa</button>
                      </div>
                    </td>
                    <td style={{ ...tdStyle, color: c.brideTara.auspicious ? GREEN : VERMILION, fontWeight: 600 }}>{c.brideTara.name}</td>
                    <td style={{ ...tdStyle, color: c.groomTara.auspicious ? GREEN : VERMILION, fontWeight: 600 }}>{c.groomTara.name}</td>
                    <td style={tdStyle}>{c.finalPass ? <BadgePill color={GREEN} icon={<BadgeCheck size={14} aria-hidden="true" />} label="Clears" /> : <BadgePill color={VERMILION} icon={<Ban size={14} aria-hidden="true" />} label="Rejected" />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p style={{ margin: "0.65rem 0 0", color: INK_MUTED, fontSize: "0.8rem", lineHeight: 1.5 }}>
            Stage 3 is event-neutral: a Riktā tithi or failed yoga/karaṇa rejects a candidate regardless of event. Stage 4 is native-specific: tārā bala depends on each native&apos;s own birth nakṣatra.
          </p>
        </section>
      )}

      {stage === 5 && (
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Stage 5 — Event-specific overlay and final selection</p>
          {winner ? (
            <div style={{ padding: "0.75rem", borderRadius: 8, border: "1px solid " + GREEN, background: GREEN + "10" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Sparkles size={18} style={{ color: GREEN }} aria-hidden="true" />
                <span style={{ color: GREEN, fontWeight: 600, fontSize: "1.05rem" }}>Leading candidate: {winner.date}</span>
              </div>
              <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>
                {winner.date} clears foundational screening and personalisation for both natives. Chapter 2&apos;s marriage-specific overlays would now refine this leading candidate further.
              </p>
            </div>
          ) : (
            <div style={{ padding: "0.65rem", borderRadius: 8, border: "1px solid " + VERMILION, background: VERMILION + "10", color: VERMILION }}>
              No candidate clears every stage with the current inputs. The least-weak option should be offered with its limiting factors named explicitly.
            </div>
          )}

          <div style={{ marginTop: "0.75rem", padding: "0.65rem", borderRadius: 8, border: "1px solid " + HAIRLINE, background: SURFACE }}>
            <p style={{ ...eyebrowStyle, marginBottom: "0.35rem" }}>Client-communication draft</p>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6, fontStyle: "italic" }}>
              &quot;The muhūrta selection identifies {winner ? winner.date : "no fully clear candidate"} as the strongest option among the dates we screened. This is one input among many — your own preparation, decisions, and broader context also shape the outcome. I am not offering a guarantee; I am offering a well-screened favourable window.&quot;
            </p>
          </div>
        </section>
      )}
    </div>
  );

  function updateCandidate(id: number, patch: Partial<Candidate>) {
    setCandidates((prev) => prev.map((c) => c.id === id ? { ...c, ...patch } : c));
  }
}

function BadgePill({ color, icon, label }: { color: string; icon: ReactNode; label: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", padding: "0.25rem 0.45rem", borderRadius: 4, border: "1px solid " + color, background: color + "10", color, fontWeight: 600, fontSize: "0.82rem" }}>
      {icon}
      {label}
    </span>
  );
}

const cardStyle: CSSProperties = { background: SURFACE, border: "1px solid " + HAIRLINE, borderRadius: 8, padding: "0.9rem 1rem" };
const eyebrowStyle: CSSProperties = { color: INK_MUTED, fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", margin: "0 0 0.25rem" };

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex", alignItems: "center", gap: "0.35rem", fontSize: "0.82rem", fontWeight: 600,
    padding: "0.35rem 0.65rem", borderRadius: 6, cursor: "pointer",
    border: "1px solid " + color, background: active ? color : "transparent", color: active ? "white" : color,
  };
}

function smallToggle(active: boolean, color: string): CSSProperties {
  return {
    fontSize: "0.75rem", fontWeight: 600, padding: "0.2rem 0.45rem", borderRadius: 4, cursor: "pointer",
    border: "1px solid " + color, background: active ? color : "transparent", color: active ? "white" : color,
  };
}

const selectStyle: CSSProperties = {
  width: "100%", appearance: "none", background: SURFACE, color: INK_PRIMARY, border: "1px solid " + HAIRLINE,
  borderRadius: 6, padding: "0.4rem 1.6rem 0.4rem 0.55rem", fontSize: "0.88rem", fontWeight: 500,
};

const thStyle: CSSProperties = {
  textAlign: "left", padding: "0.5rem", borderBottom: "1px solid " + HAIRLINE, color: INK_MUTED,
  fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase",
};

const tdStyle: CSSProperties = {
  padding: "0.5rem", borderBottom: "1px solid " + HAIRLINE, color: INK_PRIMARY, verticalAlign: "middle",
};
