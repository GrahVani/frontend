"use client";

import { useState } from "react";
import { IAST } from "../../chrome/typography";

interface GrahaInfo {
  name: string;
  symbol: string;
  color: string;
  period: string;
  speed: string;
  description: string;
}

const CHALDEAN_ORDER: GrahaInfo[] = [
  { name: "Sani", symbol: "♄", color: "var(--gl-graha-shani)", period: "29.5 years", speed: "Slowest", description: "Saturn — the slowest moving planet, governing discipline, delay, and longevity." },
  { name: "Guru", symbol: "♃", color: "var(--gl-graha-guru)", period: "11.9 years", speed: "Slow", description: "Jupiter — the great benefic, governing wisdom, expansion, and dharma." },
  { name: "Mangala", symbol: "♂", color: "var(--gl-graha-mangala)", period: "1.9 years", speed: "Medium", description: "Mars — the warrior, governing courage, conflict, and energy." },
  { name: "Surya", symbol: "☉", color: "var(--gl-graha-surya)", period: "1 year", speed: "Mean", description: "Sun — the king, governing soul, authority, and vitality." },
  { name: "Sukra", symbol: "♀", color: "var(--gl-graha-shukra)", period: "224.7 days", speed: "Fast", description: "Venus — the preceptor of demons, governing beauty, pleasure, and wealth." },
  { name: "Budha", symbol: "☿", color: "var(--gl-graha-budha)", period: "88 days", speed: "Faster", description: "Mercury — the prince, governing intellect, communication, and commerce." },
  { name: "Candra", symbol: "☽", color: "var(--gl-graha-candra)", period: "27.3 days", speed: "Fastest", description: "Moon — the queen, governing mind, emotions, and nourishment." },
];

const DAY_LORDS = ["Surya", "Candra", "Mangala", "Budha", "Guru", "Sukra", "Sani"];
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function ChaldeanPlanetaryHoraExplorer() {
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [selectedGraha, setSelectedGraha] = useState<number | null>(null);
  const [hoverHora, setHoverHora] = useState<number | null>(null);

  const chaldeanNames = CHALDEAN_ORDER.map((g) => g.name);

  const generateHoras = (dayIndex: number) => {
    const dayLord = DAY_LORDS[dayIndex];
    const startIdx = chaldeanNames.indexOf(dayLord);
    const horas = [];
    for (let i = 0; i < 24; i++) {
      const grahaIdx = (startIdx + i) % 7;
      horas.push({ number: i + 1, graha: CHALDEAN_ORDER[grahaIdx] });
    }
    return horas;
  };

  const horas = generateHoras(selectedDay);
  const nextDayLordIndex = (selectedDay + 1) % 7;
  const nextDayFirstHoraGraha = horas[23].graha.name;

  return (
    <div className="w-full" style={{ background: "var(--gl-surface-card, var(--gl-card-surface))", border: "1px solid var(--gl-border-subtle, var(--gl-gold-hairline))", borderRadius: "16px", padding: "24px" }} data-interactive="chaldean-planetary-hora-explorer">
      <div className="mb-5">
        <h2 className="text-xl font-semibold" style={{ color: "var(--gl-ink-primary)" }}><IAST>Chaldean Planetary Hora Explorer</IAST></h2>
        <p className="text-sm mt-1" style={{ color: "var(--gl-ink-muted)" }}>Why the weekdays follow this order — the 24 Hora sequence explained</p>
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-80 shrink-0">
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--gl-gold-accent)" }}>Chaldean Order</h3>
          <p className="text-xs mb-4" style={{ color: "var(--gl-ink-muted)" }}>Arranged by mean orbital speed — slowest to fastest. This is the master key.</p>
          <div className="space-y-2">
            {CHALDEAN_ORDER.map((g, idx) => (
              <button key={g.name} onClick={() => setSelectedGraha(idx)} className="w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all" style={{ background: selectedGraha === idx ? `${g.color}14` : "var(--gl-card-surface-solid, #FFF9F0)", border: selectedGraha === idx ? `1.5px solid ${g.color}` : "1px solid var(--gl-gold-hairline)" }}>
                <span className="text-xl font-bold w-8 text-center" style={{ color: g.color }}>{g.symbol}</span>
                <div className="flex-1">
                  <div className="text-sm font-semibold" style={{ color: "var(--gl-ink-primary)" }}><IAST>{g.name}</IAST></div>
                  <div className="text-xs" style={{ color: "var(--gl-ink-muted)" }}>{g.speed} · {g.period}</div>
                </div>
                <span className="text-xs font-bold" style={{ color: "var(--gl-ink-muted)" }}>{idx + 1}</span>
              </button>
            ))}
          </div>
          {selectedGraha !== null && (
            <div className="mt-3 p-3 rounded-lg text-xs" style={{ background: "var(--gl-card-surface-solid)", border: "1px solid var(--gl-gold-hairline)" }}>
              <p style={{ color: "var(--gl-ink-secondary)" }}>{CHALDEAN_ORDER[selectedGraha].description}</p>
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--gl-gold-accent)" }}>Hora Sequence Generator</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {DAY_NAMES.map((day, idx) => (
              <button key={day} onClick={() => setSelectedDay(idx)} className="px-3 py-1.5 text-xs font-medium rounded-full transition-all" style={{ background: selectedDay === idx ? "var(--gl-gold-accent)" : "transparent", color: selectedDay === idx ? "#fff" : "var(--gl-ink-secondary)", border: "1px solid var(--gl-gold-hairline)" }}>{day}</button>
            ))}
          </div>
          <p className="text-xs mb-4" style={{ color: "var(--gl-ink-muted)" }}>The 1st hora of <strong style={{ color: "var(--gl-ink-primary)" }}>{DAY_NAMES[selectedDay]}</strong> is ruled by <IAST>{DAY_LORDS[selectedDay]}</IAST>. Each subsequent hora follows the Chaldean order.</p>
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2 mb-5">
            {horas.map((h, i) => (
              <div key={i} className="relative flex flex-col items-center justify-center p-2 rounded-lg transition-all cursor-default" style={{ background: hoverHora === i ? `${h.graha.color}28` : `${h.graha.color}10`, border: hoverHora === i ? `1.5px solid ${h.graha.color}` : "1px solid var(--gl-gold-hairline)" }} onMouseEnter={() => setHoverHora(i)} onMouseLeave={() => setHoverHora(null)}>
                <span className="text-xs font-bold" style={{ color: h.graha.color }}>{h.graha.symbol}</span>
                <span className="text-[10px] mt-0.5" style={{ color: "var(--gl-ink-muted)" }}>{h.number}</span>
                {i === 0 && <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white" style={{ background: "var(--gl-gold-accent)" }}>1</span>}
              </div>
            ))}
          </div>
          <div className="rounded-xl p-4" style={{ background: "var(--gl-card-surface-solid, #FFF9F0)", border: "1px solid var(--gl-gold-hairline)" }}>
            <h4 className="text-sm font-semibold mb-2" style={{ color: "var(--gl-ink-primary)" }}>Why does the weekday shift by 3?</h4>
            <div className="space-y-2 text-xs" style={{ color: "var(--gl-ink-secondary)" }}>
              <p>There are <strong>24 horas</strong> in a day and <strong>7 planets</strong> in the Chaldean order.</p>
              <p>24 ÷ 7 = 3 remainder <strong>3</strong>. So after 24 horas, we advance <strong>3 positions</strong> in the Chaldean order.</p>
              <div className="flex items-center gap-3 py-2">
                <div className="px-3 py-1.5 rounded-md text-xs font-mono font-bold" style={{ background: "var(--gl-gold-accent)", color: "#fff" }}>24 mod 7 = 3</div>
                <span style={{ color: "var(--gl-ink-muted)" }}>→ the day-lord shifts forward by 3</span>
              </div>
              <p>Tomorrow ({DAY_NAMES[nextDayLordIndex]}) begins with <IAST>{DAY_LORDS[nextDayLordIndex]}</IAST>, and the 24th hora of today is <IAST>{nextDayFirstHoraGraha}</IAST>.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
