"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  GitMerge,
  RefreshCcw,
  Scale,
  ShieldAlert,
  Users,
  XCircle,
} from "lucide-react";

const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";
const HAIRLINE = "var(--gl-gold-hairline)";
const SURFACE = "var(--gl-card-surface-solid)";
const GOLD = "#B88421";
const VERMILION = "#A23A1E";
const BLUE = "#356CAB";
const PURPLE = "#6B5AA8";

type Graha = "Sun" | "Mercury" | "Saturn" | "Rahu" | "Jupiter";
type HouseId = 1 | 6 | 7;

type Significator = {
  graha: Graha;
  rank: number;
  note: string;
};

type HouseConfig = {
  id: HouseId;
  label: string;
  role: string;
  color: string;
  significators: Significator[];
};

const HOUSES: HouseConfig[] = [
  {
    id: 1,
    label: "House 1",
    role: "Querent / self",
    color: BLUE,
    significators: [
      { graha: "Sun", rank: 1, note: "Highest-degree planet; vitality and self-domain" },
      { graha: "Mercury", rank: 2, note: "Second-ranked significator of the ascendant" },
    ],
  },
  {
    id: 6,
    label: "House 6",
    role: "Litigation / querent's side",
    color: VERMILION,
    significators: [
      { graha: "Saturn", rank: 1, note: "Lord/occupant of the 6th, in own sign Aquarius" },
      { graha: "Rahu", rank: 2, note: "In Saturn's star, tied to the 6th chain" },
      { graha: "Jupiter", rank: 3, note: "Third-ranked in the 6th significator set" },
    ],
  },
  {
    id: 7,
    label: "House 7",
    role: "Adversary / other party",
    color: PURPLE,
    significators: [
      { graha: "Saturn", rank: 1, note: "Top-ranked significator of the adversarial house" },
      { graha: "Jupiter", rank: 2, note: "Second-ranked significator of the adversarial house" },
    ],
  },
];

const SHARED_GRAHAS: Array<{
  graha: Graha;
  strength: "strong" | "weak";
  color: string;
  houses: HouseId[];
  ranks: Record<number, number>;
  note: string;
}> = [
  {
    graha: "Saturn",
    strength: "strong",
    color: GOLD,
    houses: [6, 7],
    ranks: { 6: 1, 7: 1 },
    note:
      "Saturn is the strongest-ranked significator for both the 6th and the 7th. This is the central shared-significator finding.",
  },
  {
    graha: "Jupiter",
    strength: "weak",
    color: BLUE,
    houses: [6, 7],
    ranks: { 6: 3, 7: 2 },
    note:
      "Jupiter appears in both hierarchies at lower ranks. A secondary, worth-noting overlap rather than a dominant driver.",
  },
];

const DISCIPLINE_STATEMENTS = [
  {
    key: "favour-querent",
    label:
      "Saturn's strength in the 6th house automatically favours the querent over the adversary.",
    correction:
      "Dignity in one house and significator-sharing across houses are separate facts. Saturn's dignity does not transfer advantage to the querent when Saturn also signifies the 7th.",
  },
  {
    key: "verified-rule",
    label:
      "The shared-significator inference is an established, independently-verified classical rule.",
    correction:
      "This inference is a reasonable practitioner-level reading, not pinned to a specific named classical verse. It must be disclosed as interpretation.",
  },
  {
    key: "ignore-jupiter",
    label: "Jupiter's weaker overlap can be ignored because Saturn's overlap is more prominent.",
    correction:
      "Secondary findings are still worth noting, even when they are not built into major claims. Omitting them is selective reporting.",
  },
] as const;

const FLAWED_CLAIMS: Array<{
  key: string;
  label: string;
  flaw: string;
}> = [
  {
    key: "dignity-transfer",
    label:
      "Since Saturn rules both the 6th and 7th significator lists and is well-dignified in the 6th, the querent must have the advantage.",
    flaw:
      "This smuggles in an unsupported transfer: Saturn's dignity in the 6th is a fact about that house, not an automatic advantage over the 7th where Saturn also appears. The shared significator shapes the whole matter's character; it does not pick a winner.",
  },
  {
    key: "verdict-from-complexity",
    label:
      "A shared significator is a genuine complexity, so we cannot say anything at all about the dispute.",
    flaw:
      "Honest caution does not mean silence. We can report the shared finding, name Saturn's qualities as shaping the matter, and disclose that this is interpretation rather than a verified rule.",
  },
  {
    key: "jupiter-cancels-saturn",
    label:
      "Jupiter's overlap across both houses cancels Saturn's overlap and produces a neutral outcome.",
    flaw:
      "There is no doctrinal basis given here for 'cancellation.' Jupiter is a weaker secondary presence; it is noted, not used to neutralise Saturn's stronger shared voice.",
  },
];

export function KpSharedSignificatorExplorer() {
  const [selectedShared, setSelectedShared] = useState<Graha | null>("Saturn");
  const [includeJupiter, setIncludeJupiter] = useState(true);
  const [mistakes, setMistakes] = useState<Record<string, boolean>>({
    "favour-querent": false,
    "verified-rule": false,
    "ignore-jupiter": false,
  });
  const [activeFlaw, setActiveFlaw] = useState<string | null>(null);

  const activeShared = useMemo(
    () => SHARED_GRAHAS.filter((s) => s.graha === "Saturn" || includeJupiter),
    [includeJupiter]
  );

  const sharedGrahaSet = useMemo(
    () => new Set(activeShared.map((s) => s.graha)),
    [activeShared]
  );

  const isShared = (graha: Graha, houseId: HouseId) => {
    if (!sharedGrahaSet.has(graha)) return false;
    const shared = SHARED_GRAHAS.find((s) => s.graha === graha);
    return shared ? shared.houses.includes(houseId) : false;
  };

  function toggleMistake(key: string) {
    setMistakes((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function reset() {
    setSelectedShared("Saturn");
    setIncludeJupiter(true);
    setMistakes({ "favour-querent": false, "verified-rule": false, "ignore-jupiter": false });
    setActiveFlaw(null);
  }

  const selectedSharedData = SHARED_GRAHAS.find((s) => s.graha === selectedShared) ?? null;

  return (
    <div data-interactive="kp-shared-significator-explorer" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={cardStyle}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={eyebrowStyle}>Chart L1 — KP significator comparison</p>
            <h2 style={{ margin: "0.2rem 0 0", color: PURPLE, fontSize: "1.28rem", fontWeight: 600 }}>
              Shared significators across the 1st, 6th, and 7th houses
            </h2>
            <p style={{ margin: "0.45rem 0 0", color: INK_SECONDARY, lineHeight: 1.55, maxWidth: 920 }}>
              Read the three dispute-relevant houses together. Spot where the same graha voices both sides, and practise holding that complexity without forcing a winner.
            </p>
          </div>
          <button type="button" onClick={reset} style={buttonStyle(false, GOLD)}>
            <RefreshCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Three-house hierarchy table</p>
          <div style={{ display: "grid", gap: "0.85rem", marginTop: "0.65rem" }}>
            {HOUSES.map((house) => (
              <div
                key={house.id}
                style={{
                  border: `1px solid ${house.color}44`,
                  borderRadius: 8,
                  background: `${house.color}0A`,
                  padding: "0.75rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: house.color }}>
                  {house.id === 1 ? <Users size={16} aria-hidden="true" /> : <Scale size={16} aria-hidden="true" />}
                  <span style={{ fontWeight: 600 }}>{house.label}</span>
                  <span style={{ color: INK_MUTED, fontSize: "0.82rem" }}>— {house.role}</span>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.55rem" }}>
                  {house.significators.map((sig) => {
                    const shared = isShared(sig.graha, house.id);
                    const sharedColor = sig.graha === "Saturn" ? GOLD : BLUE;
                    return (
                      <button
                        key={sig.graha}
                        type="button"
                        onClick={() => {
                          if (shared) setSelectedShared(sig.graha);
                        }}
                        style={significatorChipStyle(shared, shared ? sharedColor : INK_PRIMARY)}
                        aria-pressed={selectedShared === sig.graha}
                        title={sig.note}
                      >
                        <span style={rankDotStyle(shared ? sharedColor : house.color)}>{sig.rank}</span>
                        <span>{sig.graha}</span>
                        {shared ? <GitMerge size={13} aria-hidden="true" /> : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <p style={{ margin: "0.75rem 0 0", color: INK_MUTED, fontSize: "0.82rem", lineHeight: 1.5 }}>
            Grahas marked with the merge icon appear in more than one of these three hierarchies. Click a shared graha to inspect its rank on each side.
          </p>
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Overlap diagram</p>
          <SharedSignificatorSvg selected={selectedShared} includeJupiter={includeJupiter} />
        </section>
      </div>

      <div style={responsiveTwoColumnStyle}>
        <section style={cardStyle}>
          <p style={eyebrowStyle}>Shared-significator inspector</p>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.55rem" }}>
            {activeShared.map((shared) => (
              <button
                key={shared.graha}
                type="button"
                aria-pressed={selectedShared === shared.graha}
                onClick={() => setSelectedShared(shared.graha)}
                style={buttonStyle(selectedShared === shared.graha, shared.color)}
              >
                {shared.graha}
                <span style={{ fontSize: "0.75rem", opacity: 0.85 }}>({shared.strength})</span>
              </button>
            ))}
            {!includeJupiter ? (
              <button
                type="button"
                onClick={() => setIncludeJupiter(true)}
                style={ghostButtonStyle}
              >
                + Show Jupiter overlap
              </button>
            ) : null}
          </div>

          {selectedSharedData ? (
            <div
              style={{
                marginTop: "0.85rem",
                border: `1px solid ${selectedSharedData.color}55`,
                borderRadius: 8,
                background: `${selectedSharedData.color}0A`,
                padding: "0.85rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: selectedSharedData.color }}>
                <Scale size={18} aria-hidden="true" />
                <span style={{ fontWeight: 600, fontSize: "1.05rem" }}>
                  {selectedSharedData.graha}: {selectedSharedData.strength} overlap
                </span>
              </div>
              <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.6 }}>
                {selectedSharedData.note}
              </p>
              <div style={{ display: "grid", gap: "0.45rem", marginTop: "0.65rem" }}>
                {selectedSharedData.houses.map((houseId) => {
                  const house = HOUSES.find((h) => h.id === houseId)!;
                  const rank = selectedSharedData.ranks[houseId];
                  return (
                    <div key={houseId} style={{ display: "flex", justifyContent: "space-between", gap: "0.75rem" }}>
                      <span style={{ color: INK_SECONDARY, fontSize: "0.88rem" }}>
                        {house.label} — {house.role}
                      </span>
                      <span style={{ color: selectedSharedData.color, fontWeight: 600, fontSize: "0.88rem" }}>
                        Rank {rank}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p style={{ margin: "0.85rem 0 0", color: INK_MUTED }}>Select a shared graha to inspect its cross-house role.</p>
          )}
        </section>

        <section style={cardStyle}>
          <p style={eyebrowStyle}>Jupiter overlap toggle</p>
          <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.88rem", lineHeight: 1.55 }}>
            Switch Jupiter&apos;s secondary overlap on and off to see how much, or how little, the overall reading changes.
          </p>
          <button
            type="button"
            aria-pressed={includeJupiter}
            onClick={() => setIncludeJupiter((v) => !v)}
            style={toggleStyle(includeJupiter, includeJupiter ? BLUE : INK_MUTED)}
          >
            <span style={{ color: includeJupiter ? BLUE : INK_MUTED }}>
              {includeJupiter ? <CheckCircle2 size={18} aria-hidden="true" /> : <XCircle size={18} aria-hidden="true" />}
            </span>
            <span>
              <span style={{ display: "block", fontWeight: 600 }}>Include Jupiter overlap</span>
              <span style={{ color: INK_SECONDARY, fontSize: "0.86rem" }}>
                {includeJupiter
                  ? "Jupiter appears as a secondary, weaker shared voice across both houses."
                  : "Jupiter is hidden; only Saturn's strong overlap is shown."}
              </span>
            </span>
          </button>
          <div
            style={{
              marginTop: "0.85rem",
              border: `1px solid ${includeJupiter ? BLUE : GOLD}55`,
              borderRadius: 8,
              background: `${includeJupiter ? BLUE : GOLD}0A`,
              padding: "0.85rem",
            }}
          >
            <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.6 }}>
              {includeJupiter
                ? "With both overlaps visible, Saturn remains the dominant shared significator and Jupiter is a mild secondary counterbalance. The reading still centres on Saturn's structural qualities."
                : "With Jupiter hidden, Saturn stands alone as the shared significator. The core finding is unchanged; Jupiter's omission only removes a secondary observation worth noting."}
            </p>
          </div>
        </section>
      </div>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Flawed-reasoning lab</p>
        <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.88rem", lineHeight: 1.55 }}>
          Deliberately try each flawed statement. The tool flags the overreach and shows the honest correction.
        </p>
        <div style={{ display: "grid", gap: "0.65rem", marginTop: "0.65rem" }}>
          {FLAWED_CLAIMS.map((claim) => {
            const open = activeFlaw === claim.key;
            return (
              <div
                key={claim.key}
                style={{
                  border: `1px solid ${open ? VERMILION : HAIRLINE}`,
                  borderRadius: 8,
                  background: open ? `${VERMILION}0A` : "transparent",
                  padding: "0.75rem",
                }}
              >
                <button
                  type="button"
                  onClick={() => setActiveFlaw(open ? null : claim.key)}
                  style={{
                    display: "flex",
                    alignItems: "start",
                    gap: "0.55rem",
                    width: "100%",
                    textAlign: "left",
                    background: "transparent",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    color: INK_SECONDARY,
                  }}
                >
                  <span style={{ color: open ? VERMILION : GOLD, marginTop: 2 }}>
                    {open ? <XCircle size={16} aria-hidden="true" /> : <AlertTriangle size={16} aria-hidden="true" />}
                  </span>
                  <span style={{ lineHeight: 1.5 }}>{claim.label}</span>
                </button>
                {open ? (
                  <p style={{ margin: "0.55rem 0 0", color: VERMILION, lineHeight: 1.55, fontSize: "0.9rem" }}>
                    <ShieldAlert size={14} style={{ verticalAlign: "middle" }} aria-hidden="true" /> {claim.flaw}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      <section style={cardStyle}>
        <p style={eyebrowStyle}>Discipline checks</p>
        <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, fontSize: "0.88rem", lineHeight: 1.5 }}>
          Mark each false statement to reveal the correction.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: "0.75rem",
            marginTop: "0.65rem",
          }}
        >
          {DISCIPLINE_STATEMENTS.map((s) => {
            const active = mistakes[s.key];
            return (
              <div
                key={s.key}
                style={{
                  border: `1px solid ${active ? VERMILION : HAIRLINE}`,
                  borderRadius: 8,
                  background: active ? `${VERMILION}0A` : "transparent",
                  padding: "0.75rem",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "start",
                    gap: "0.55rem",
                    color: INK_SECONDARY,
                    cursor: "pointer",
                  }}
                >
                  <input type="checkbox" checked={active} onChange={() => toggleMistake(s.key)} />
                  <span>{s.label}</span>
                </label>
                {active ? (
                  <p style={{ margin: "0.55rem 0 0", color: VERMILION, fontSize: "0.86rem", lineHeight: 1.5 }}>
                    <ShieldAlert size={14} style={{ verticalAlign: "middle" }} aria-hidden="true" /> {s.correction}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      <section
        style={{
          ...cardStyle,
          borderColor: `${PURPLE}66`,
          background: `${PURPLE}0A`,
        }}
      >
        <p style={eyebrowStyle}>Live synthesis</p>
        <h3
          style={{
            margin: "0.15rem 0 0",
            color: PURPLE,
            fontSize: "1.15rem",
            fontWeight: 600,
          }}
        >
          <ArrowRight size={16} style={{ verticalAlign: "middle" }} aria-hidden="true" /> Honest client-facing statement
        </h3>
        <p style={{ margin: "0.55rem 0 0", color: INK_SECONDARY, lineHeight: 1.7 }}>
          Something worth flagging honestly:{" "}
          <strong style={{ color: GOLD, fontWeight: 600 }}>Saturn is the top-ranked KP significator for both the 6th house and the 7th house</strong>{" "}
          in this chart — the querent&apos;s own litigation domain and the adversary&apos;s domain share their single strongest voice.
          {includeJupiter ? (
            <>
              {" "}
              <strong style={{ color: BLUE, fontWeight: 600 }}>Jupiter also appears, more weakly, across both houses</strong> as a secondary presence.
            </>
          ) : (
            " Jupiter's secondary overlap is currently hidden for contrast."
          )}{" "}
          I am not reading that as pointing toward either side winning. What it suggests is that Saturn&apos;s own qualities — structure, patience, process, delay — are likely to shape how the whole matter unfolds, for both parties, more than they tell us who prevails. That is a genuine complexity, not a verdict, and this specific inference is not pinned to one named classical rule — it is a careful reading held with appropriate caution.
        </p>
      </section>
    </div>
  );
}

function SharedSignificatorSvg({
  selected,
  includeJupiter,
}: {
  selected: Graha | null;
  includeJupiter: boolean;
}) {
  const houseXs = [120, 360, 600];
  const houseY = 108;
  const itemSpacing = 70;

  const grahaPositions: Record<string, { x: number; y: number }> = {};
  HOUSES.forEach((house, hIndex) => {
    const x = houseXs[hIndex];
    house.significators.forEach((sig, sIndex) => {
      grahaPositions[`${house.id}-${sig.graha}`] = {
        x,
        y: houseY + sIndex * itemSpacing,
      };
    });
  });

  const activeShared = SHARED_GRAHAS.filter((s) => s.graha === "Saturn" || includeJupiter);

  return (
    <svg viewBox="0 0 720 380" role="img" aria-label="Shared significators across house hierarchies" style={{ width: "100%", minHeight: 380, margin: "0.7rem 0", display: "block" }}>
      <rect x="18" y="18" width="684" height="344" rx="8" fill={SURFACE} stroke={HAIRLINE} />

      {HOUSES.map((house) => {
        const x = houseXs[house.id === 1 ? 0 : house.id === 6 ? 1 : 2];
        return (
          <g key={house.id}>
            <rect x={x - 86} y={42} width={172} height={48} rx={8} fill={`${house.color}${"0D"}`} stroke={`${house.color}${"44"}`} />
            <text x={x} y={61} textAnchor="middle" fill={house.color} fontSize="16" fontWeight="600">
              {house.label}
            </text>
            <text x={x} y={80} textAnchor="middle" fill={INK_MUTED} fontSize="11">
              {house.role}
            </text>
            {house.significators.map((sig) => {
              const pos = grahaPositions[`${house.id}-${sig.graha}`];
              const shared = activeShared.some(
                (s) => s.graha === sig.graha && s.houses.includes(house.id)
              );
              const sharedColor = sig.graha === "Saturn" ? GOLD : BLUE;
              const isSelected = selected === sig.graha;
              return (
                <g key={sig.graha}>
                  <rect
                    x={pos.x - 62}
                    y={pos.y - 22}
                    width={124}
                    height={44}
                    rx={8}
                    fill={isSelected ? (shared ? sharedColor : house.color) : shared ? `${sharedColor}14` : `${house.color}08`}
                    stroke={shared ? sharedColor : house.color}
                    strokeWidth={isSelected ? 3 : 1.5}
                  />
                  <text
                    x={pos.x}
                    y={pos.y - 2}
                    textAnchor="middle"
                    fill={isSelected ? "#fff" : shared ? sharedColor : house.color}
                    fontSize="14"
                    fontWeight="600"
                  >
                    {sig.graha}
                  </text>
                  <text x={pos.x} y={pos.y + 15} textAnchor="middle" fill={isSelected ? "#fff" : INK_MUTED} fontSize="11" fontWeight="600">
                    rank #{sig.rank}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}

      {activeShared.map((shared) => {
        const posA = grahaPositions[`${shared.houses[0]}-${shared.graha}`];
        const posB = grahaPositions[`${shared.houses[1]}-${shared.graha}`];
        if (!posA || !posB) return null;
        const isSelected = selected === shared.graha;
        const midX = (posA.x + posB.x) / 2;
        const midY = (posA.y + posB.y) / 2 - (shared.graha === "Saturn" ? 42 : 30);
        return (
          <g key={shared.graha}>
            <path
              d={`M ${posA.x + 62} ${posA.y} Q ${midX} ${midY} ${posB.x - 62} ${posB.y}`}
              fill="none"
              stroke={shared.color}
              strokeWidth={isSelected ? 4 : 2.5}
              strokeDasharray={shared.strength === "weak" ? "5 4" : undefined}
              markerEnd={`url(#arrow-${shared.graha})`}
              markerStart={`url(#arrow-${shared.graha}-start)`}
            />
            <g>
              <rect
                x={midX - (shared.strength === "strong" ? 46 : 34)}
                y={midY - 16}
                width={shared.strength === "strong" ? 92 : 68}
                height={32}
                rx={8}
                fill={SURFACE}
                stroke={shared.color}
                strokeWidth={2}
              />
              <text x={midX} y={midY + 4} textAnchor="middle" fill={shared.color} fontSize="12" fontWeight="600">
                {shared.strength === "strong" ? "shared" : "weak"}
              </text>
            </g>
          </g>
        );
      })}

      <rect x="0" y="0" width="720" height="380" fill={SURFACE} />
      <rect x="18" y="18" width="684" height="344" rx="8" fill={`${GOLD}${"06"}`} stroke={HAIRLINE} />

      {HOUSES.map((house, index) => {
        const x = houseXs[index];
        return (
          <g key={`clean-${house.id}`}>
            <rect x={x - 88} y="38" width="176" height="44" rx="8" fill={`${house.color}${"0D"}`} stroke={`${house.color}${"44"}`} />
            <text x={x} y="56" textAnchor="middle" fill={house.color} fontSize="15" fontWeight="700">
              {house.label}
            </text>
            <text x={x} y="74" textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight="600">
              {house.role}
            </text>

            {house.significators.map((sig, sigIndex) => {
              const y = 112 + sigIndex * 50;
              const shared = activeShared.some(
                (item) => item.graha === sig.graha && item.houses.includes(house.id)
              );
              const sharedColor = sig.graha === "Saturn" ? GOLD : BLUE;
              const color = shared ? sharedColor : house.color;
              const isSelected = selected === sig.graha;
              return (
                <g key={`clean-${house.id}-${sig.graha}`}>
                  <rect
                    x={x - 70}
                    y={y - 19}
                    width="140"
                    height="38"
                    rx="8"
                    fill={isSelected ? color : shared ? `${color}${"14"}` : `${house.color}08`}
                    stroke={color}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                  />
                  <text x={x} y={y - 2} textAnchor="middle" fill={isSelected ? "#fff" : color} fontSize="13" fontWeight="700">
                    {sig.graha}
                  </text>
                  <text x={x} y={y + 13} textAnchor="middle" fill={isSelected ? "#fff" : INK_MUTED} fontSize="10" fontWeight="600">
                    rank #{sig.rank}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}

      <line x1="58" y1="270" x2="662" y2="270" stroke={HAIRLINE} strokeWidth="1.5" />
      <text x="360" y="292" textAnchor="middle" fill={INK_MUTED} fontSize="13" fontWeight="700">
        Shared significators
      </text>

      {activeShared.map((shared, index) => {
        const x = activeShared.length === 1 ? 360 : index === 0 ? 250 : 470;
        const isSelected = selected === shared.graha;
        return (
          <g key={`clean-shared-${shared.graha}`}>
            <rect
              x={x - 112}
              y="306"
              width="224"
              height="38"
              rx="8"
              fill={isSelected ? `${shared.color}22` : SURFACE}
              stroke={shared.color}
              strokeWidth={isSelected ? 2.5 : 1.5}
              strokeDasharray={shared.strength === "weak" ? "5 4" : undefined}
            />
            <text x={x} y="322" textAnchor="middle" fill={shared.color} fontSize="13" fontWeight="700">
              {shared.graha}: {shared.strength === "strong" ? "strong shared" : "weak shared"}
            </text>
            <text x={x} y="338" textAnchor="middle" fill={INK_MUTED} fontSize="10" fontWeight="600">
              House {shared.houses[0]} rank #{shared.ranks[shared.houses[0]]} + House {shared.houses[1]} rank #{shared.ranks[shared.houses[1]]}
            </text>
          </g>
        );
      })}

      <defs>
        {activeShared.map((shared) => (
          <g key={shared.graha}>
            <marker id={`arrow-${shared.graha}`} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
              <path d="M0,0 L7,3.5 L0,7 Z" fill={shared.color} />
            </marker>
            <marker id={`arrow-${shared.graha}-start`} markerWidth="7" markerHeight="7" refX="1" refY="3.5" orient="auto">
              <path d="M7,0 L0,3.5 L7,7 Z" fill={shared.color} />
            </marker>
          </g>
        ))}
      </defs>
    </svg>
  );
}

function significatorChipStyle(shared: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.4rem",
    border: `1px solid ${shared ? color : HAIRLINE}`,
    borderRadius: 8,
    background: shared ? `${color}16` : "transparent",
    color: shared ? color : INK_PRIMARY,
    padding: "0.45rem 0.65rem",
    fontWeight: 600,
    cursor: shared ? "pointer" : "default",
  };
}

function rankDotStyle(color: string): CSSProperties {
  return {
    width: 22,
    height: 22,
    borderRadius: 999,
    border: `2px solid ${color}`,
    color,
    display: "grid",
    placeItems: "center",
    fontSize: "0.72rem",
    fontWeight: 600,
    flex: "0 0 auto",
  };
}

function buttonStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.45rem",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}16` : "transparent",
    color: active ? color : INK_SECONDARY,
    padding: "0.55rem 0.75rem",
    fontWeight: 600,
    cursor: "pointer",
  };
}

const ghostButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.45rem",
  border: `1px dashed ${HAIRLINE}`,
  borderRadius: 8,
  background: "transparent",
  color: INK_MUTED,
  padding: "0.55rem 0.75rem",
  fontWeight: 600,
  cursor: "pointer",
};

function toggleStyle(active: boolean, color: string): CSSProperties {
  return {
    display: "flex",
    alignItems: "start",
    gap: "0.7rem",
    width: "100%",
    textAlign: "left",
    border: `1px solid ${active ? color : HAIRLINE}`,
    borderRadius: 8,
    background: active ? `${color}0A` : "transparent",
    color: INK_PRIMARY,
    padding: "0.75rem",
    marginTop: "0.75rem",
    cursor: "pointer",
  };
}

const cardStyle: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  borderRadius: 8,
  background: SURFACE,
  padding: "1rem",
  boxShadow: "var(--gl-shadow-soft)",
};

const responsiveTwoColumnStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
  gap: "1rem",
  alignItems: "start",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  color: INK_MUTED,
  fontSize: "0.78rem",
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
};
