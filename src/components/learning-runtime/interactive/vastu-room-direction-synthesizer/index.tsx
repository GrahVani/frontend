"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, ClipboardList, Compass, RotateCcw, ShieldAlert } from "lucide-react";
import { ink } from "@/design-tokens/grahvani-learning/colors";
import { IAST } from "../../chrome/typography";
import {
  DIRECTIONS,
  ROOM_PLACEMENTS,
  WORKFLOW_STEPS,
  getDirection,
  getRoom,
  type DirectionKey,
  type RoomKey,
} from "./data";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.28))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-primary)";
const INK_SECONDARY = "var(--gl-ink-secondary)";
const GOLD = ink.goldAccent;
const GREEN = "#2F7D52";
const BLUE = "#356C96";
const VERMILION = ink.vermilionAccent;

function wash(color: string, alphaHex = "12") {
  return color.startsWith("#") ? `${color}${alphaHex}` : "rgba(232, 199, 114, 0.12)";
}

function categoryFor(room: ReturnType<typeof getRoom>, direction: DirectionKey) {
  if (room.primary.includes(direction)) return "primary";
  if (room.secondary.includes(direction)) return "secondary";
  if (room.acceptable.includes(direction)) return "acceptable";
  if (room.prohibited.includes(direction)) return "prohibited";
  return "neutral";
}

function categoryColor(category: string) {
  if (category === "primary") return GREEN;
  if (category === "secondary") return BLUE;
  if (category === "acceptable") return GOLD;
  if (category === "prohibited") return VERMILION;
  return INK_SECONDARY;
}

function categoryLabel(category: string) {
  if (category === "primary") return "Primary";
  if (category === "secondary") return "Secondary";
  if (category === "acceptable") return "Mitigate";
  if (category === "prohibited") return "Avoid";
  return "Context";
}

function DirectionGrid({ roomKey, onSelect, selected }: { roomKey: RoomKey; selected: DirectionKey; onSelect: (key: DirectionKey) => void }) {
  const room = getRoom(roomKey);
  const cells = Array.from({ length: 9 }, (_, index) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    return DIRECTIONS.find((item) => item.row === row && item.col === col)!;
  });

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
      <div className="mx-auto grid aspect-square w-full max-w-[560px] min-w-0 grid-cols-3 gap-3 rounded-2xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        {cells.map((cell) => {
          const category = categoryFor(room, cell.key);
          const color = categoryColor(category);
          const active = selected === cell.key;
          return (
            <button
              key={cell.key}
              type="button"
              onClick={() => onSelect(cell.key)}
              className="flex min-w-0 flex-col items-start justify-between rounded-xl p-3 text-left"
              style={{
                minHeight: 126,
                background: active ? wash(color, "18") : category === "neutral" ? SURFACE : wash(color, "0F"),
                border: `1.5px solid ${active ? color : category === "neutral" ? HAIRLINE : `${color}88`}`,
              }}
            >
              <span className="text-xs font-black uppercase" style={{ color, letterSpacing: "0.08em" }}>{cell.label}</span>
              <span className="text-sm font-bold" style={{ color: INK_PRIMARY }}>{cell.lord}</span>
              <span className="text-xs" style={{ color: INK_SECONDARY }}>{cell.role}</span>
              <span className="text-xs font-bold" style={{ color }}>{categoryLabel(category)}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export function VastuRoomDirectionSynthesizer() {
  const [activeRoom, setActiveRoom] = useState<RoomKey>("kitchen");
  const [activeDirection, setActiveDirection] = useState<DirectionKey>("se");
  const room = useMemo(() => getRoom(activeRoom), [activeRoom]);
  const direction = useMemo(() => getDirection(activeDirection), [activeDirection]);
  const category = categoryFor(room, activeDirection);
  const color = categoryColor(category);

  const reset = () => {
    setActiveRoom("kitchen");
    setActiveDirection("se");
  };

  return (
    <div
      className="w-full min-w-0"
      data-interactive="vastu-room-direction-synthesizer"
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
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Room-direction synthesis</p>
          <h2 className="mt-1 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
            Place the room by substrate, quality, and element
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY }}>
            Select a room and test each direction as primary, secondary, workable with mitigation, or prohibited.
          </p>
        </div>
        <button type="button" onClick={reset} className="inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY }}>
          <RotateCcw size={16} />
          Reset kitchen
        </button>
      </div>

      <section className="mb-4 grid min-w-0 gap-3 md:grid-cols-4">
        {ROOM_PLACEMENTS.map((item) => {
          const selected = item.key === activeRoom;
          const primary = getDirection(item.primary[0]);
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                setActiveRoom(item.key);
                setActiveDirection(item.primary[0]);
              }}
              className="min-w-0 rounded-xl p-3 text-left"
              style={{ background: selected ? wash(primary.color, "12") : SURFACE, border: `1px solid ${selected ? primary.color : HAIRLINE}` }}
            >
              <span className="block text-sm font-bold" style={{ color: selected ? primary.color : INK_PRIMARY }}>{item.label}</span>
              <span className="mt-1 block text-xs" style={{ color: INK_SECONDARY }}>{item.quality}</span>
            </button>
          );
        })}
      </section>

      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(300px,380px)]">
        <div className="grid min-w-0 gap-4">
          <DirectionGrid roomKey={activeRoom} selected={activeDirection} onSelect={setActiveDirection} />
          <article className="grid min-w-0 gap-3 md:grid-cols-4">
            {[
              ["Primary", GREEN, "Canonical, strongest fit"],
              ["Secondary", BLUE, "Sound second choice"],
              ["Mitigate", GOLD, "Workable with care"],
              ["Avoid", VERMILION, "Relocate or remediate"],
            ].map(([label, swatch, text]) => (
              <section key={label} className="min-w-0 rounded-xl p-3" style={{ background: wash(swatch, "0F"), border: `1px solid ${HAIRLINE}` }}>
                <p className="m-0 text-sm font-bold" style={{ color: swatch }}>{label}</p>
                <p className="mb-0 mt-1 text-xs" style={{ color: INK_SECONDARY }}>{text}</p>
              </section>
            ))}
          </article>
        </div>

        <aside className="grid min-w-0 content-start gap-4">
          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(color, "10"), border: `1px solid ${color}` }}>
            <div className="mb-2 flex items-center gap-2">
              <Compass size={17} color={color} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color, letterSpacing: "0.08em" }}>Placement judgment</p>
            </div>
            <h3 className="m-0 text-2xl font-semibold" style={{ color: INK_PRIMARY, fontFamily: "var(--font-cormorant), serif" }}>
              <IAST>{room.label}</IAST> in {direction.label}
            </h3>
            <p className="m-0 text-sm font-bold" style={{ color }}>{categoryLabel(category)}</p>
            <p className="mb-0 mt-3 text-sm" style={{ color: INK_SECONDARY }}>{room.reasoning}</p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-2 flex items-center gap-2">
              <CheckCircle2 size={17} color={direction.color} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: direction.color, letterSpacing: "0.08em" }}>Selected direction</p>
            </div>
            <p className="m-0 text-lg font-bold" style={{ color: INK_PRIMARY }}>{direction.label} - {direction.lord}</p>
            <p className="m-0 text-sm" style={{ color: INK_SECONDARY }}>{direction.element} / {direction.role}</p>
          </article>

          <article className="min-w-0 rounded-xl p-4" style={{ background: wash(VERMILION, "0F"), border: `1px solid ${HAIRLINE}` }}>
            <div className="mb-2 flex items-center gap-2">
              <ShieldAlert size={17} color={VERMILION} />
              <p className="m-0 text-xs font-bold uppercase" style={{ color: VERMILION, letterSpacing: "0.08em" }}>Mitigation cue</p>
            </div>
            <p className="mb-0 mt-2 text-sm" style={{ color: INK_SECONDARY }}>{room.mitigation}</p>
          </article>
        </aside>
      </section>

      <section className="mt-4 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <div className="mb-3 flex items-center gap-2">
          <ClipboardList size={17} color={GOLD} />
          <p className="m-0 text-xs font-bold uppercase" style={{ color: GOLD, letterSpacing: "0.08em" }}>Five-step workflow</p>
        </div>
        <div className="grid min-w-0 gap-3 md:grid-cols-5">
          {WORKFLOW_STEPS.map((step, index) => (
            <section key={step} className="min-w-0 rounded-xl p-3" style={{ background: index === 0 ? wash(GREEN, "0F") : SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
              <p className="m-0 text-sm font-black" style={{ color: index === 0 ? GREEN : GOLD }}>Step {index + 1}</p>
              <p className="mb-0 mt-1 text-xs" style={{ color: INK_SECONDARY }}>{step}</p>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
