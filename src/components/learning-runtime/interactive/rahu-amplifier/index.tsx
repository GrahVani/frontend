"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Eclipse, Gem, Globe2, MonitorCog, Moon, Orbit, RotateCcw, Siren, Sun, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Company = "none" | "benefic" | "malefic";
type LightFlag = "none" | "sun" | "moon";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const RAHU = "#6B5AA8";
const KETU = "#8A6A2A";
const GREEN = "#2F7D55";
const RED = "#A44135";
const GOLD = "#D99622";
const MOON = "#6D7FA8";

const HOUSES = [
  { house: 1, label: "Self", theme: "identity, image, appetite for visibility", ketu: "partnership release" },
  { house: 2, label: "Wealth", theme: "speech, family, money, food, stored value", ketu: "shared-resource release" },
  { house: 3, label: "Effort", theme: "skills, media, courage, siblings, messages", ketu: "belief-system release" },
  { house: 4, label: "Home", theme: "property, roots, inner security, mother", ketu: "public-status release" },
  { house: 5, label: "Creativity", theme: "learning, children, romance, performance", ketu: "network release" },
  { house: 6, label: "Service", theme: "work, conflict, health routines, competition", ketu: "retreat release" },
  { house: 7, label: "Partnership", theme: "marriage, alliances, contracts, the other", ketu: "self-release" },
  { house: 8, label: "Depth", theme: "secrets, inheritance, occult, crisis, research", ketu: "simple-value release" },
  { house: 9, label: "Dharma", theme: "teachers, pilgrimage, law, publishing", ketu: "immediate-effort release" },
  { house: 10, label: "Career", theme: "status, authority, technology, public achievement", ketu: "home/root release" },
  { house: 11, label: "Gains", theme: "networks, audience, ambition, large goals", ketu: "personal-joy release" },
  { house: 12, label: "Foreign / beyond", theme: "foreign lands, isolation, sleep, moksha hunger", ketu: "daily-struggle release" },
];

const SIGNIFICATIONS: Array<{ label: string; text: string; icon: LucideIcon }> = [
  { label: "Foreign", text: "Lands, cultures, trade, migration, cross-border life.", icon: Globe2 },
  { label: "Technology", text: "Machines, electricity, digital systems, the new.", icon: MonitorCog },
  { label: "Obsession", text: "Wanting more than the house can finally satisfy.", icon: Zap },
  { label: "Sudden events", text: "Shocks, leaps, disruption, strange openings.", icon: Siren },
  { label: "Hessonite", text: "Gomedha belongs to Rahu, used with care.", icon: Gem },
];

function opposite(house: number) {
  return ((house + 5) % 12) + 1;
}

function point(house: number, radius: number) {
  const angle = ((house - 1) * 30 - 90) * (Math.PI / 180);
  return { x: 180 + radius * Math.cos(angle), y: 180 + radius * Math.sin(angle) };
}

export function RahuAmplifier() {
  const [rahuHouse, setRahuHouse] = useState(10);
  const [company, setCompany] = useState<Company>("benefic");
  const [lightFlag, setLightFlag] = useState<LightFlag>("none");
  const ketuHouse = opposite(rahuHouse);
  const rahu = HOUSES[rahuHouse - 1];
  const ketu = HOUSES[ketuHouse - 1];
  const rahuPoint = point(rahuHouse, 124);
  const ketuPoint = point(ketuHouse, 124);

  const amplification = useMemo(() => {
    if (company === "benefic") return { color: GREEN, title: "Benefic company", text: "Rahu magnifies opportunity, reach, influence, learning, and unusual success, but keeps a restless edge." };
    if (company === "malefic") return { color: RED, title: "Malefic company", text: "Rahu magnifies pressure, obsession, volatility, secrecy, and the harmful side of the house." };
    return { color: RAHU, title: "Rahu alone", text: "Rahu amplifies the house through hunger, foreignness, novelty, and dissatisfaction. Check aspects next." };
  }, [company]);

  const shadow = useMemo(() => {
    if (lightFlag === "sun") return "Rahu on Sun: eclipse-shadow touches authority, father, vitality, and identity.";
    if (lightFlag === "moon") return "Rahu on Moon: eclipse-shadow touches mind, mother, memory, and emotional safety.";
    return "No light contact selected: read Rahu's amplification first, then add eclipse-shadow only with Sun/Moon contact.";
  }, [lightFlag]);

  return (
    <div data-interactive="rahu-amplifier" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "end", flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Rahu amplifier
            </p>
            <h2 style={{ margin: "0.2rem 0 0", color: RAHU, fontSize: "1.35rem" }}>
              The head that grasps and magnifies
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setRahuHouse(10);
              setCompany("benefic");
              setLightFlag("none");
            }}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "transparent", color: INK_SECONDARY, padding: "0.55rem 0.75rem", fontWeight: 850, cursor: "pointer" }}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }} aria-label="Rahu house wheel">
          <svg viewBox="0 0 360 360" role="img" aria-label="Rahu house wheel with Ketu opposite" style={{ width: "100%", height: "auto", display: "block" }}>
            <circle cx="180" cy="180" r="148" fill="rgba(255,251,241,0.7)" stroke={HAIRLINE} />
            <line x1={rahuPoint.x} y1={rahuPoint.y} x2={ketuPoint.x} y2={ketuPoint.y} stroke="rgba(75,58,35,0.38)" strokeWidth="4" strokeDasharray="8 6" />
            {[...Array(12)].map((_, index) => {
              const house = index + 1;
              const p = point(house, 124);
              const isRahu = house === rahuHouse;
              const isKetu = house === ketuHouse;
              const fill = isRahu ? RAHU : isKetu ? KETU : "#fff";
              return (
                <g
                  key={house}
                  role="button"
                  tabIndex={0}
                  aria-label={`Place Rahu in house ${house}`}
                  aria-pressed={isRahu}
                  onClick={() => setRahuHouse(house)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setRahuHouse(house);
                    }
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <circle cx={p.x} cy={p.y} r={isRahu || isKetu ? 24 : 19} fill={fill} stroke={isRahu ? RAHU : isKetu ? KETU : HAIRLINE} strokeWidth={isRahu || isKetu ? 3 : 1.5} />
                  <text x={p.x} y={p.y + 4} textAnchor="middle" fill={isRahu || isKetu ? "#fff" : INK_SECONDARY} fontSize="11" fontWeight="900" pointerEvents="none">
                    {isRahu ? "Ra" : isKetu ? "Ke" : house}
                  </text>
                </g>
              );
            })}
            <circle cx="180" cy="180" r="52" fill="rgba(107,90,168,0.12)" stroke={RAHU} strokeWidth="2" />
            <text x="180" y="174" textAnchor="middle" fill={RAHU} fontSize="18" fontWeight="900">Rahu</text>
            <text x="180" y="197" textAnchor="middle" fill={INK_MUTED} fontSize="12" fontWeight="800">always with Ketu</text>
          </svg>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Card title={`Rahu in ${rahuHouse}: ${rahu.label}`} color={RAHU} icon={<Orbit size={18} aria-hidden="true" />}>
            Amplifies {rahu.theme}. Ketu in {ketuHouse} asks release through {ketu.ketu}.
          </Card>

          <section style={{ border: `1px solid ${amplification.color}55`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
            <div style={{ color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>Company toggle</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.5rem", marginTop: "0.7rem" }}>
              {[
                ["none", "Alone", RAHU],
                ["benefic", "Benefic", GREEN],
                ["malefic", "Malefic", RED],
              ].map(([key, label, color]) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={company === key}
                  onClick={() => setCompany(key as Company)}
                  style={{ border: `1px solid ${company === key ? color : HAIRLINE}`, borderRadius: 8, background: company === key ? color : "transparent", color: company === key ? "#fff" : INK_SECONDARY, padding: "0.6rem 0.45rem", fontWeight: 850, cursor: "pointer" }}
                >
                  {label}
                </button>
              ))}
            </div>
            <h3 style={{ margin: "0.85rem 0 0.25rem", color: amplification.color, fontSize: "1.1rem" }}>{amplification.title}</h3>
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>{amplification.text}</p>
          </section>

          <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", color: RED, fontWeight: 900 }}>
              <Eclipse size={18} aria-hidden="true" />
              Light contact
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "0.5rem", marginTop: "0.7rem" }}>
              {[
                ["none", "None", INK_MUTED],
                ["sun", "Sun", GOLD],
                ["moon", "Moon", MOON],
              ].map(([key, label, color]) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={lightFlag === key}
                  onClick={() => setLightFlag(key as LightFlag)}
                  style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.35rem", border: `1px solid ${lightFlag === key ? color : HAIRLINE}`, borderRadius: 8, background: lightFlag === key ? color : "transparent", color: lightFlag === key ? "#fff" : INK_SECONDARY, padding: "0.6rem 0.45rem", fontWeight: 850, cursor: "pointer" }}
                >
                  {key === "sun" ? <Sun size={15} aria-hidden="true" /> : key === "moon" ? <Moon size={15} aria-hidden="true" /> : null}
                  {label}
                </button>
              ))}
            </div>
            <p style={{ margin: "0.8rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>{shadow}</p>
          </section>
        </section>
      </div>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.8rem" }}>
        {SIGNIFICATIONS.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label} title={item.label} color={RAHU} icon={<Icon size={17} aria-hidden="true" />}>
              {item.text}
            </Card>
          );
        })}
      </section>
    </div>
  );
}

function Card({ title, color, icon, children }: { title: string; color: string; icon: ReactNode; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "0.9rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 900 }}>
        {icon}
        {title}
      </div>
      <p style={{ margin: "0.5rem 0 0", color: INK_SECONDARY, lineHeight: 1.55 }}>{children}</p>
    </section>
  );
}
