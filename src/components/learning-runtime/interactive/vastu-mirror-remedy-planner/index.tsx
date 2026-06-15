"use client";

import { useMemo, useState } from "react";
import type React from "react";
import { BedDouble, DoorOpen, Eye, Home, RotateCcw, Sparkles } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import {
  FACING,
  MIRROR_TYPES,
  ROOMS,
  WALLS,
  findOption,
  findWall,
  judgeMirror,
  mitigationFor,
  verdictLabel,
  type FacingKey,
  type MirrorTypeKey,
  type Option,
  type RoomKey,
  type VerdictKey,
  type WallKey,
} from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const GOLD = ink.goldAccent;
const GREEN = "#2F7D52";
const BLUE = "#2F6F9F";
const AMBER = "#B9801E";
const VERMILION = ink.vermilionAccent;

function wash(color: string, alphaHex = "12") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function verdictColor(verdict: VerdictKey) {
  if (verdict === "canonical") return GREEN;
  if (verdict === "acceptable") return BLUE;
  if (verdict === "mitigate") return GOLD;
  if (verdict === "avoid") return AMBER;
  return VERMILION;
}

function wallLine(wall: WallKey) {
  if (wall === "north" || wall === "ne" || wall === "nw") return { x1: 128, y1: 92, x2: 392, y2: 92, mx: wall === "ne" ? 340 : wall === "nw" ? 180 : 260, my: 92 };
  if (wall === "south" || wall === "se" || wall === "sw") return { x1: 128, y1: 312, x2: 392, y2: 312, mx: wall === "se" ? 340 : wall === "sw" ? 180 : 260, my: 312 };
  if (wall === "east") return { x1: 392, y1: 92, x2: 392, y2: 312, mx: 392, my: 202 };
  return { x1: 128, y1: 92, x2: 128, y2: 312, mx: 128, my: 202 };
}

function MirrorSketch({ wallKey, facingKey, verdict }: { wallKey: WallKey; facingKey: FacingKey; verdict: VerdictKey }) {
  const line = wallLine(wallKey);
  const color = verdictColor(verdict);
  const target = facingKey === "bed" ? { x: 260, y: 230, label: "Bed" } : facingKey === "entry" ? { x: 260, y: 332, label: "Entry" } : facingKey === "stove" ? { x: 330, y: 232, label: "Stove" } : facingKey === "water" ? { x: 190, y: 232, label: "Water" } : null;

  return (
    <section className="min-w-0 overflow-hidden rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <div className="mb-3 flex min-w-0 flex-wrap items-center justify-between gap-2">
        <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Mirror reflection map</p>
        <p className="m-0 text-xs font-semibold" style={{ color: INK_SECONDARY }}>Wall + direct reflection</p>
      </div>
      <svg viewBox="0 0 520 390" className="block h-auto w-full" role="img" aria-label="Vastu mirror wall placement sketch">
        <rect x="36" y="30" width="448" height="330" rx="24" fill={SURFACE_2} stroke={HAIRLINE} />
        <rect x="128" y="92" width="264" height="220" rx="6" fill="rgba(255,249,240,0.96)" stroke={HAIRLINE} />
        <text x="260" y="76" textAnchor="middle" fontSize="14" fontWeight="900" fill={GOLD}>N</text>
        <text x="412" y="206" textAnchor="middle" fontSize="14" fontWeight="900" fill={GOLD}>E</text>
        <text x="260" y="334" textAnchor="middle" fontSize="14" fontWeight="900" fill={GOLD}>S</text>
        <text x="108" y="206" textAnchor="middle" fontSize="14" fontWeight="900" fill={GOLD}>W</text>
        <line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke={color} strokeWidth="8" strokeLinecap="round" />
        <circle cx={line.mx} cy={line.my} r="20" fill={SURFACE} stroke={color} strokeWidth="3" />
        <text x={line.mx} y={line.my + 5} textAnchor="middle" fontSize="12" fontWeight="900" fill={color}>M</text>
        <rect x="218" y="190" width="84" height="56" rx="12" fill={wash(GOLD, "10")} stroke={HAIRLINE} />
        <text x="260" y="221" textAnchor="middle" fontSize="13" fontWeight="900" fill={INK_PRIMARY}>Room</text>
        {target ? (
          <g>
            <line x1={line.mx} y1={line.my} x2={target.x} y2={target.y} stroke={color} strokeWidth="2" strokeDasharray="6 6" />
            <rect x={target.x - 39} y={target.y - 18} width="78" height="36" rx="14" fill={wash(color, "12")} stroke={color} />
            <text x={target.x} y={target.y + 4} textAnchor="middle" fontSize="12" fontWeight="900" fill={color}>{target.label}</text>
          </g>
        ) : null}
        <text x="260" y="354" textAnchor="middle" fontSize="12" fontWeight="800" fill={INK_SECONDARY}>
          Wall may be good, but direct bed or entry reflection changes the judgment.
        </text>
      </svg>
    </section>
  );
}

export function VastuMirrorRemedyPlanner() {
  const [wallKey, setWallKey] = useState<WallKey>("north");
  const [roomKey, setRoomKey] = useState<RoomKey>("living");
  const [facingKey, setFacingKey] = useState<FacingKey>("none");
  const [mirrorType, setMirrorType] = useState<MirrorTypeKey>("flat");

  const wall = useMemo(() => findWall(wallKey), [wallKey]);
  const room = useMemo(() => findOption(ROOMS, roomKey), [roomKey]);
  const facing = useMemo(() => findOption(FACING, facingKey), [facingKey]);
  const mirror = useMemo(() => findOption(MIRROR_TYPES, mirrorType), [mirrorType]);
  const verdict = useMemo(() => judgeMirror(wall, roomKey, facingKey, mirrorType), [wall, roomKey, facingKey, mirrorType]);
  const color = verdictColor(verdict);
  const mitigation = mitigationFor(verdict, facingKey, mirrorType);

  const reset = () => {
    setWallKey("north");
    setRoomKey("living");
    setFacingKey("none");
    setMirrorType("flat");
  };

  return (
    <div
      className="w-full min-w-0"
      data-interactive="vastu-mirror-remedy-planner"
      style={{
        maxWidth: "none",
        background: "var(--gl-surface-card, var(--gl-card-surface, #FFF9F0))",
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 16,
        padding: 20,
        color: INK_PRIMARY,
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Mirror remedy planner</p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Place mirrors by wall, room, and reflection target
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Mirrors are a modern Tier 2 symbolic tool. Use N/E support, avoid bed-facing and entry-facing placements, and name convex mirrors honestly.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset mirror
        </button>
      </div>

      <section className="mb-4 grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Selector title="Wall direction" icon={<Home size={16} />} options={WALLS} value={wallKey} onChange={setWallKey} />
        <Selector title="Room context" icon={roomKey === "bedroom" ? <BedDouble size={16} /> : <Home size={16} />} options={ROOMS} value={roomKey} onChange={setRoomKey} />
        <Selector title="Mirror faces" icon={facingKey === "entry" ? <DoorOpen size={16} /> : <Eye size={16} />} options={FACING} value={facingKey} onChange={setFacingKey} />
        <Selector title="Mirror type" icon={<Sparkles size={16} />} options={MIRROR_TYPES} value={mirrorType} onChange={setMirrorType} />
      </section>

      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(320px,400px)]">
        <MirrorSketch wallKey={wallKey} facingKey={facingKey} verdict={verdict} />
        <aside className="grid min-w-0 content-start gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(color, "10"), border: `1px solid ${color}` }}>
            <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
              <p className="m-0 text-xs font-bold uppercase" style={{ color, letterSpacing: "0.08em" }}>{verdictLabel(verdict)}</p>
              <span className="rounded-full px-3 py-1 text-xs font-black uppercase" style={{ color, background: SURFACE, border: `1px solid ${color}` }}>{wall.label}</span>
            </div>
            <h3 className="m-0 mt-2 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>{wall.quality}</h3>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{wall.guidance}</p>
            <p className="mb-0 mt-3 text-sm font-semibold" style={{ color }}>{mitigation}</p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Context check</p>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_PRIMARY }}>{room.label}: {room.note}</p>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{facing.label}: {facing.note}</p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
            <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Honest attribution</p>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_PRIMARY }}>{mirror.label}: {mirror.note}</p>
          </article>
        </aside>
      </section>
    </div>
  );
}

function Selector<T extends string>({
  title,
  icon,
  options,
  value,
  onChange,
}: {
  title: string;
  icon: React.ReactNode;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <section className="min-w-0 rounded-xl p-3" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <div className="mb-2 flex items-center gap-2">
        <span style={{ color: GOLD }}>{icon}</span>
        <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>{title}</p>
      </div>
      <div className="grid min-w-0 gap-2">
        {options.map((option) => {
          const selected = option.key === value;
          return (
            <button
              key={option.key}
              type="button"
              onClick={() => onChange(option.key)}
              className="min-w-0 rounded-lg px-3 py-2 text-left text-sm font-semibold"
              style={{
                color: selected ? INK_PRIMARY : INK_SECONDARY,
                background: selected ? wash(GOLD, "12") : SURFACE_2,
                border: `1px solid ${selected ? GOLD : HAIRLINE}`,
              }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
