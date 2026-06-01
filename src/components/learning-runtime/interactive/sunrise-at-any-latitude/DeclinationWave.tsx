"use client";

interface DeclinationWaveProps {
  dayOfYear: number;
  reducedMotion?: boolean;
}

export function DeclinationWave({ dayOfYear, reducedMotion = false }: DeclinationWaveProps) {
  const width = 400;
  const height = 140;
  const padding = 24;
  const chartW = width - padding * 2;
  const chartH = height - padding * 2;
  const cy = padding + chartH / 2;

  // Build cosine wave path
  const points: string[] = [];
  for (let i = 0; i <= 100; i++) {
    const N = 1 + (i / 100) * 364;
    const delta = -23.44 * Math.cos(((N + 10) * 360 * Math.PI) / (365 * 180));
    const x = padding + (i / 100) * chartW;
    const y = cy - (delta / 23.44) * (chartH / 2);
    points.push(`${x},${y}`);
  }
  const pathD = `M ${points.join(" L ")}`;

  // Current position
  const currentDelta = -23.44 * Math.cos(((dayOfYear + 10) * 360 * Math.PI) / (365 * 180));
  const currentX = padding + ((dayOfYear - 1) / 364) * chartW;
  const currentY = cy - (currentDelta / 23.44) * (chartH / 2);

  // Markers
  const markers = [
    { N: 80, label: "Mar Eq", color: "#2F8C5A" },
    { N: 172, label: "Jun Sol", color: "#C28220" },
    { N: 265, label: "Sep Eq", color: "#2F8C5A" },
    { N: 355, label: "Dec Sol", color: "#4A6FA5" },
  ];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" role="img" aria-label="Solar declination cosine wave across the year">
      {/* Baseline */}
      <line x1={padding} y1={cy} x2={width - padding} y2={cy} stroke="var(--gl-ink-muted)" strokeWidth="0.5" opacity="0.3" />

      {/* Wave */}
      <path d={pathD} fill="none" stroke="#C28220" strokeWidth="1.5" opacity="0.6" />

      {/* Fill area */}
      <path d={`${pathD} L ${width - padding},${cy} L ${padding},${cy} Z`} fill="#C28220" opacity="0.08" />

      {/* Season markers */}
      {markers.map((m) => {
        const mx = padding + ((m.N - 1) / 364) * chartW;
        const my = cy - ((-23.44 * Math.cos(((m.N + 10) * 360 * Math.PI) / (365 * 180))) / 23.44) * (chartH / 2);
        return (
          <g key={m.label}>
            <line x1={mx} y1={cy - 4} x2={mx} y2={cy + 4} stroke={m.color} strokeWidth="1" opacity="0.6" />
            <text x={mx} y={cy + 16} textAnchor="middle" fill={m.color} fontSize="8" opacity="0.8">
              {m.label}
            </text>
          </g>
        );
      })}

      {/* Current position dot */}
      <circle cx={currentX} cy={currentY} r="5" fill="#A23A1E" opacity="0.9">
        {!reducedMotion && <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" />}
      </circle>

      {/* Y-axis labels */}
      <text x={padding - 4} y={padding + 4} textAnchor="end" fill="var(--gl-ink-muted)" fontSize="8" opacity="0.6">
        +23°
      </text>
      <text x={padding - 4} y={height - padding + 4} textAnchor="end" fill="var(--gl-ink-muted)" fontSize="8" opacity="0.6">
        −23°
      </text>
    </svg>
  );
}
