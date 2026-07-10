"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { BadgeCheck, BookOpen, Boxes, CircleSlash, Layers3, RotateCcw, Sparkles } from "lucide-react";

interface HouseModel {
  house: number;
  name: string;
  domain: string;
  significations: string;
  body: string;
  people: string;
  classA: string;
  classB: string;
  aim: string;
  karaka: string;
}

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

const HOUSES: HouseModel[] = [
  {
    house: 1,
    name: "Tanu",
    domain: "Self, body, personality",
    significations: "appearance, vitality, character, direction of life",
    body: "head, body as a whole",
    people: "the native themselves",
    classA: "Kendra",
    classB: "Trikona",
    aim: "Dharma",
    karaka: "Sun and Lagna",
  },
  {
    house: 4,
    name: "Sukha",
    domain: "Home, mother, inner contentment",
    significations: "property, vehicles, education, emotional base",
    body: "chest, heart",
    people: "mother, caretakers",
    classA: "Kendra",
    classB: "Moksha house",
    aim: "Moksha",
    karaka: "Moon",
  },
  {
    house: 7,
    name: "Yuvati",
    domain: "Partnership, spouse, trade",
    significations: "marriage, contracts, public dealing, travel",
    body: "lower abdomen, reproductive region",
    people: "spouse, partners, clients",
    classA: "Kendra",
    classB: "Maraka house",
    aim: "Kama",
    karaka: "Venus",
  },
  {
    house: 10,
    name: "Karma",
    domain: "Career, status, visible action",
    significations: "profession, authority, reputation, public work",
    body: "knees, activity in the world",
    people: "leaders, employers, authority figures",
    classA: "Kendra",
    classB: "Upachaya",
    aim: "Artha",
    karaka: "Sun, Mercury, Jupiter, Saturn",
  },
];

const GROUPS = [
  {
    key: "A",
    title: "Identity",
    color: BLUE,
    icon: BookOpen,
    items: ["Sanskrit name", "Number", "Primary life-domain"],
  },
  {
    key: "B",
    title: "Significations",
    color: GREEN,
    icon: Boxes,
    items: ["Full classical significations", "Body parts", "People / relationship roles"],
  },
  {
    key: "C",
    title: "Classifications",
    color: GOLD,
    icon: Layers3,
    items: ["Kendra / panaphara / apoklima", "Trikona / dusthana / upachaya", "Artha / dharma / kama / moksha"],
  },
  {
    key: "D",
    title: "Significator",
    color: PURPLE,
    icon: Sparkles,
    items: ["Naisargika karaka"],
  },
];

const DROPPED = [
  "Friendships",
  "Special states",
  "Paksha-bala",
  "Dasha years",
  "Gem / metal",
];

export function BhavaTemplateCard() {
  const [houseIndex, setHouseIndex] = useState(0);
  const [showGrahaContrast, setShowGrahaContrast] = useState(false);
  const [blankMode, setBlankMode] = useState(false);
  const house = HOUSES[houseIndex];

  return (
    <div data-interactive="bhava-template-card" style={{ display: "grid", gap: "1rem", color: INK_PRIMARY }}>
      <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Per-bhava template
            </p>
            <h2 style={{ margin: "0.2rem 0 0", color: BLUE, fontSize: "1.35rem" }}>
              Ten attributes, four groups, one scaffold for every house
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setHouseIndex(0);
              setShowGrahaContrast(false);
              setBlankMode(false);
            }}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem", border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: "transparent", color: INK_SECONDARY, padding: "0.55rem 0.75rem", fontWeight: 850, cursor: "pointer" }}
          >
            <RotateCcw size={15} aria-hidden="true" />
            Reset
          </button>
        </div>
      </section>

      <section style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }} aria-label="Template controls">
        {HOUSES.map((item, index) => (
          <button
            key={item.house}
            type="button"
            aria-pressed={houseIndex === index}
            onClick={() => setHouseIndex(index)}
            style={{ border: `1px solid ${houseIndex === index ? BLUE : HAIRLINE}`, borderRadius: 8, background: houseIndex === index ? BLUE : "transparent", color: houseIndex === index ? "#fff" : INK_SECONDARY, padding: "0.55rem 0.7rem", fontWeight: 850, cursor: "pointer" }}
          >
            H{item.house} {item.name}
          </button>
        ))}
        <Toggle label="Blank card" active={blankMode} onClick={() => setBlankMode((value) => !value)} color={GOLD} />
        <Toggle label="Graha contrast" active={showGrahaContrast} onClick={() => setShowGrahaContrast((value) => !value)} color={VERMILION} />
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))", gap: "1rem", alignItems: "start" }}>
        <section style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "start", flexWrap: "wrap" }}>
            <div>
              <p style={{ margin: 0, color: INK_MUTED, fontSize: "0.78rem", fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Model card
              </p>
              <h3 style={{ margin: "0.2rem 0 0", color: BLUE, fontSize: "1.25rem" }}>
                {blankMode ? "Blank bhava card" : `House ${house.house}: ${house.name}`}
              </h3>
            </div>
            <strong style={{ color: blankMode ? INK_MUTED : GREEN }}>{blankMode ? "Fill it yourself" : house.domain}</strong>
          </div>

          <div style={{ display: "grid", gap: "0.75rem", marginTop: "1rem" }}>
            <TemplateGroup group="A" title="Identity" color={BLUE} rows={[
              ["Name", house.name],
              ["Number", `${house.house}`],
              ["Primary domain", house.domain],
            ]} blank={blankMode} />
            <TemplateGroup group="B" title="Significations" color={GREEN} rows={[
              ["Things", house.significations],
              ["Body", house.body],
              ["People", house.people],
            ]} blank={blankMode} />
            <TemplateGroup group="C" title="Classifications" color={GOLD} rows={[
              ["Position", house.classA],
              ["Quality", house.classB],
              ["Aim of life", house.aim],
            ]} blank={blankMode} />
            <TemplateGroup group="D" title="Karaka" color={PURPLE} rows={[
              ["Natural significator", house.karaka],
            ]} blank={blankMode} />
          </div>
        </section>

        <section style={{ display: "grid", gap: "0.85rem" }}>
          <Panel title="The four groups" icon={<BadgeCheck size={18} />} color={BLUE}>
            <div style={{ display: "grid", gap: "0.65rem" }}>
              {GROUPS.map((group) => {
                const Icon = group.icon;
                return (
                  <div key={group.key} style={{ border: `1px solid ${group.color}44`, borderRadius: 8, background: `${group.color}10`, padding: "0.75rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: group.color, fontWeight: 950 }}>
                      <Icon size={16} aria-hidden="true" />
                      Group {group.key}: {group.title}
                    </div>
                    <p style={{ margin: "0.35rem 0 0", color: INK_SECONDARY, lineHeight: 1.45 }}>{group.items.join(" · ")}</p>
                  </div>
                );
              })}
            </div>
          </Panel>

          {showGrahaContrast ? (
            <Panel title="Dropped planet-only attributes" icon={<CircleSlash size={18} />} color={VERMILION}>
              <p style={{ margin: "0 0 0.65rem", color: INK_SECONDARY, lineHeight: 1.5 }}>
                Houses are arenas, not agents. These five per-graha attributes do not belong to a house card:
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {DROPPED.map((item) => (
                  <span key={item} style={{ border: `1px solid ${VERMILION}44`, borderRadius: 8, color: VERMILION, padding: "0.42rem 0.55rem", fontWeight: 850 }}>
                    {item}
                  </span>
                ))}
              </div>
            </Panel>
          ) : (
            <Panel title="How to study the next twelve lessons" icon={<BookOpen size={18} />} color={GREEN}>
              <p style={{ margin: 0, color: INK_SECONDARY, lineHeight: 1.55 }}>
                Walk A to D every time: identity, significations, classifications, karaka. Same shape, new contents.
              </p>
            </Panel>
          )}
        </section>
      </div>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "0.8rem" }}>
        <Reminder title="Ten, not fifteen" body="The house template drops five planet-only attributes." />
        <Reminder title="Arenas, not agents" body="A house is where life happens; a planet is what acts there." />
        <Reminder title="Group C matters" body="Classifications reveal strategic house quality, not just topics." />
        <Reminder title="Chapters 2-5" body="The same scaffold carries through all twelve house lessons." />
      </section>
    </div>
  );
}

function Toggle({ label, active, onClick, color }: { label: string; active: boolean; onClick: () => void; color: string }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      style={{ border: `1px solid ${active ? color : HAIRLINE}`, borderRadius: 8, background: active ? color : "transparent", color: active ? "#fff" : INK_SECONDARY, padding: "0.55rem 0.7rem", fontWeight: 850, cursor: "pointer" }}
    >
      {label}
    </button>
  );
}

function TemplateGroup({ group, title, color, rows, blank }: { group: string; title: string; color: string; rows: Array<[string, string]>; blank: boolean }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: `${color}0F`, padding: "0.8rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 950 }}>
        <span style={{ display: "inline-grid", placeItems: "center", width: 24, height: 24, borderRadius: 999, background: color, color: "#fff" }}>{group}</span>
        {title}
      </div>
      <div style={{ display: "grid", gap: "0.42rem", marginTop: "0.65rem" }}>
        {rows.map(([label, value]) => (
          <div key={label} style={{ display: "grid", gridTemplateColumns: "130px minmax(0, 1fr)", gap: "0.6rem", alignItems: "start" }}>
            <strong style={{ color: INK_MUTED }}>{label}</strong>
            <span style={{ color: blank ? INK_MUTED : INK_SECONDARY, lineHeight: 1.45 }}>{blank ? "__________" : value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Panel({ title, icon, color, children }: { title: string; icon: ReactNode; color: string; children: ReactNode }) {
  return (
    <section style={{ border: `1px solid ${color}44`, borderRadius: 8, background: SURFACE, padding: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color, fontWeight: 950 }}>{icon}{title}</div>
      <div style={{ marginTop: "0.75rem" }}>{children}</div>
    </section>
  );
}

function Reminder({ title, body }: { title: string; body: string }) {
  return (
    <div style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 8, background: SURFACE, padding: "0.9rem" }}>
      <strong style={{ color: GOLD }}>{title}</strong>
      <p style={{ margin: "0.4rem 0 0", color: INK_SECONDARY, lineHeight: 1.5 }}>{body}</p>
    </div>
  );
}
