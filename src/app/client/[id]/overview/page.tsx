"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  ChevronDown,
  ChevronRight,
  Sparkles,
  TrendingUp,
  FileText,
  LayoutDashboard,
  Loader2,
  Moon,
  Orbit,
} from "lucide-react";

import { useVedicClient } from "@/context/VedicClientContext";
import { useAstrologerStore } from "@/store/useAstrologerStore";
import {
  useDasha,
  useShadbala,
  useAshtakavarga,
} from "@/hooks/queries/useCalculations";
import { findActiveDashaPath, type DashaNode } from "@/lib/dasha-utils";
import { parseChartData, signIdToName } from "@/lib/chart-helpers";
import { getPlanetSymbol } from "@/lib/planet-symbols";
import { cn } from "@/lib/utils";

import NorthIndianChart from "@/components/astrology/NorthIndianChart";
import GoldenButton from "@/components/GoldenButton";

import {
  Card,
  CardHeader,
  CardTitle,
  CardSubtitle,
  CardBody,
  CardFooter,
} from "@/design-system/components/cards";
import { DataTable, type DataTableColumn } from "@/design-system/components/table";
import {
  pageHeaderClasses,
  pageSummaryClasses,
  heroInsightClasses,
  insightStripClasses,
  metricGridClasses,
  metricCardClasses,
} from "@/design-system/templates/shared-template";
import { dashboardTemplateClasses } from "@/design-system/templates/dashboard-template";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PlanetaryInfo {
  planet: string;
  sign: string;
  degree: string;
  nakshatra: string;
  nakshatraPart: number;
  house: number;
  isRetro?: boolean;
}

interface ShadbalaRow {
  planet: string;
  rupas: number;
  virupas: number;
  rank: number;
  status: string;
}

interface AshtakavargaRow {
  sign: string;
  score: number;
}

interface DisplayClient {
  id?: string;
  name: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: { city: string };
  rashi?: string;
  nakshatra?: string;
}

// ---------------------------------------------------------------------------
// Mock fallback client
// ---------------------------------------------------------------------------

const MOCK_CLIENT: DisplayClient = {
  id: "",
  name: "Ananya Sharma",
  dateOfBirth: "1992-08-15",
  timeOfBirth: "14:30",
  placeOfBirth: { city: "New Delhi, India" },
  rashi: "Leo",
  nakshatra: "Magha",
};

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function formatDateShort(dateStr: string): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function daysBetween(start: string, end: string): number {
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  if (isNaN(s) || isNaN(e)) return 0;
  return Math.max(0, Math.ceil((e - s) / (1000 * 60 * 60 * 24)));
}

function getElement(sign: string): string {
  const fire = ["Aries", "Leo", "Sagittarius"];
  const earth = ["Taurus", "Virgo", "Capricorn"];
  const air = ["Gemini", "Libra", "Aquarius"];
  const water = ["Cancer", "Scorpio", "Pisces"];
  if (fire.includes(sign)) return "fire";
  if (earth.includes(sign)) return "earth";
  if (air.includes(sign)) return "air";
  if (water.includes(sign)) return "water";
  return "balanced";
}

function getNakshatraTone(nakshatra?: string): string {
  const fire = ["Ashwini", "Magha", "Moola"];
  const earth = ["Bharani", "Purva Phalguni", "Purva Ashadha"];
  const air = ["Krittika", "Uttara Phalguni", "Uttara Ashadha"];
  const water = ["Rohini", "Hasta", "Shravana"];
  if (!nakshatra) return "balanced";
  if (fire.includes(nakshatra)) return "fiery, activation";
  if (earth.includes(nakshatra)) return "grounded, material";
  if (air.includes(nakshatra)) return "intellectual, mobile";
  if (water.includes(nakshatra)) return "emotional, receptive";
  return "balanced";
}

function getDashaTheme(planet: string): string {
  const themes: Record<string, string> = {
    Saturn: "maturity, discipline, and karmic restructuring",
    Jupiter: "growth, wisdom, and expansion of fortune",
    Mars: "courage, conflict, and accelerated action",
    Mercury: "communication, commerce, and analytical refinement",
    Venus: "relationships, pleasure, and creative flowering",
    Sun: "authority, vitality, and self-definition",
    Moon: "emotional maturation, public connection, and nurturing",
    Rahu: "obsession, foreign influence, and unconventional ascent",
    Ketu: "detachment, spiritual insight, and karmic release",
  };
  return themes[planet] ?? "a period of significant inner development";
}

function computeStrongestPlanet(
  shadbalaData: Record<string, unknown> | undefined
): { planet: string; score: number } | null {
  if (!shadbalaData) return null;

  const rupas = shadbalaData.shadbala_rupas as Record<string, number> | undefined;
  if (!rupas) return null;

  const sorted = Object.entries(rupas).sort((a, b) => b[1] - a[1]);
  if (sorted.length === 0) return null;

  const [planet, score] = sorted[0];
  return { planet, score: Number(score) || 0 };
}

function computeShadbalaRows(
  shadbalaData: Record<string, unknown> | undefined
): ShadbalaRow[] {
  if (!shadbalaData) return [];

  const rupas = (shadbalaData.shadbala_rupas || {}) as Record<string, number>;
  const virupas = (shadbalaData.shadbala_virupas || {}) as Record<string, number>;
  const ranks = (shadbalaData.relative_rank || {}) as Record<string, number>;
  const summary = (shadbalaData.strength_summary || {}) as Record<string, string>;

  return Object.keys(rupas).map((planet) => ({
    planet,
    rupas: Number(rupas[planet]) || 0,
    virupas: Number(virupas[planet]) || 0,
    rank: Number(ranks[planet]) || 0,
    status: summary[planet] ?? "—",
  }));
}

function computeAshtakavargaTotal(
  ashtakavargaData: unknown
): number | null {
  if (!ashtakavargaData) return null;

  const root = (ashtakavargaData as Record<string, unknown>).data ?? ashtakavargaData;
  const summary =
    (root as Record<string, unknown>).sarvashtakavarga_summary ??
    (root as Record<string, unknown>).sarvashtakavarga ??
    (root as Record<string, unknown>).ashtakvarga;

  if (typeof summary === "number") return summary;
  if (typeof summary === "object" && summary !== null) {
    const values = Object.values(summary).filter(
      (v): v is number => typeof v === "number"
    );
    return values.reduce((a, b) => a + b, 0);
  }
  return null;
}

function computeAshtakavargaRows(
  ashtakavargaData: unknown
): AshtakavargaRow[] {
  if (!ashtakavargaData) return [];

  const root = (ashtakavargaData as Record<string, unknown>).data ?? ashtakavargaData;
  const summary =
    (root as Record<string, unknown>).sarvashtakavarga_summary ??
    (root as Record<string, unknown>).sarvashtakavarga ??
    (root as Record<string, unknown>).ashtakvarga;

  if (typeof summary === "object" && summary !== null && !Array.isArray(summary)) {
    return Object.entries(summary)
      .filter(([, v]) => typeof v === "number")
      .map(([sign, score]) => ({ sign, score: Number(score) }));
  }

  return [];
}

function countChartsByPrefix(
  processedCharts: Record<string, { chartType?: string }>,
  prefix: string
): number {
  return Object.values(processedCharts).filter((c) =>
    c.chartType?.startsWith(prefix)
  ).length;
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

export default function ClientOverviewPage() {
  const { clientDetails, processedCharts, isLoadingCharts } = useVedicClient();
  const { ayanamsa } = useAstrologerStore();

  const displayClient: DisplayClient = clientDetails ?? MOCK_CLIENT;
  const clientId = displayClient.id ?? "";
  const activeAyanamsa = ayanamsa.toLowerCase();

  // -------------------------------------------------------------------------
  // Queries
  // -------------------------------------------------------------------------

  const { data: dashaResponse, isLoading: isDashaLoading } = useDasha(
    clientId,
    "tree",
    activeAyanamsa,
    { drillDownPath: [] }
  );

  const { data: shadbalaResponse, isLoading: isShadbalaLoading } =
    useShadbala(clientId);

  const { data: ashtakavargaResponse, isLoading: isAshtakavargaLoading } =
    useAshtakavarga(clientId, activeAyanamsa, "sarva");

  // -------------------------------------------------------------------------
  // Derived chart data
  // -------------------------------------------------------------------------

  const chartData = useMemo(() => {
    const d1Key = `D1_${activeAyanamsa}`;
    const d1 = processedCharts[d1Key]?.chartData;
    if (!d1) return null;
    return parseChartData(d1);
  }, [processedCharts, activeAyanamsa]);

  const planetaryInfo: PlanetaryInfo[] = useMemo(() => {
    if (!chartData) return [];
    return chartData.planets.map((p) => ({
      planet: p.name,
      sign: signIdToName[p.signId] ?? "??",
      degree: p.degree ?? "00°00′",
      nakshatra: p.nakshatra ?? "??",
      nakshatraPart: p.pada ?? 1,
      house: p.house ?? 1,
      isRetro: p.isRetro,
    }));
  }, [chartData]);

  const ascendant = chartData ? signIdToName[chartData.ascendant] : "—";
  const moonInfo = planetaryInfo.find((p) => p.planet === "Moon");

  // -------------------------------------------------------------------------
  // Derived dasha data
  // -------------------------------------------------------------------------

  const activeDasha = useMemo(() => {
    if (!dashaResponse?.data) {
      return {
        nodes: [] as DashaNode[],
        maha: "—",
        antar: "—",
        pratya: null as string | null,
        start: "—",
        end: "—",
        remaining: 0,
        elapsed: 0,
        total: 0,
        progress: 0,
      };
    }

    const path = findActiveDashaPath(dashaResponse.data as never);
    const nodes = path.nodes;
    const mahaNode = nodes[0];
    const antarNode = nodes[1];

    const maha = mahaNode?.planet ?? "Unknown";
    const antar = antarNode?.planet ?? "Unknown";
    const pratya = nodes[2]?.planet ?? null;

    const start = mahaNode?.startDate ?? "";
    const end = mahaNode?.endDate ?? "";
    const total = daysBetween(start, end);
    const elapsed = daysBetween(start, new Date().toISOString());
    const remaining = Math.max(0, total - elapsed);
    const progress = total > 0 ? Math.min(100, Math.round((elapsed / total) * 100)) : 0;

    return {
      nodes,
      maha,
      antar,
      pratya,
      start: formatDateShort(start),
      end: formatDateShort(end),
      remaining,
      elapsed,
      total,
      progress,
    };
  }, [dashaResponse]);

  const upcomingTransitions = useMemo(() => {
    if (!dashaResponse?.data) return [];

    const data = dashaResponse.data as Record<string, unknown>;
    const mahadashas =
      (data.mahadashas as Record<string, unknown>[]) ??
      (data.periods as Record<string, unknown>[]) ??
      [];

    const now = new Date().getTime();

    return mahadashas
      .filter((period) => {
        const end = new Date(String(period.end_date ?? period.endDate ?? "")).getTime();
        return !isNaN(end) && end > now;
      })
      .slice(0, 3)
      .map((period) => ({
        planet: String(period.planet ?? period.lord ?? "—"),
        start: formatDateShort(String(period.start_date ?? period.startDate ?? "")),
        end: formatDateShort(String(period.end_date ?? period.endDate ?? "")),
      }));
  }, [dashaResponse]);

  // -------------------------------------------------------------------------
  // Derived metric data
  // -------------------------------------------------------------------------

  const shadbalaData = shadbalaResponse as Record<string, unknown> | undefined;
  const strongestPlanet = useMemo(
    () => computeStrongestPlanet(shadbalaData),
    [shadbalaData]
  );

  const shadbalaRows = useMemo(
    () => computeShadbalaRows(shadbalaData),
    [shadbalaData]
  );

  const ashtakavargaTotal = useMemo(
    () => computeAshtakavargaTotal(ashtakavargaResponse),
    [ashtakavargaResponse]
  );

  const ashtakavargaRows = useMemo(
    () => computeAshtakavargaRows(ashtakavargaResponse),
    [ashtakavargaResponse]
  );

  const yogaCount = useMemo(
    () => countChartsByPrefix(processedCharts, "yoga_"),
    [processedCharts]
  );

  const doshaCount = useMemo(
    () => countChartsByPrefix(processedCharts, "dosha_"),
    [processedCharts]
  );

  // -------------------------------------------------------------------------
  // Template data
  // -------------------------------------------------------------------------

  const heroTitle =
    activeDasha.maha === "—"
      ? "Current Life Period"
      : `${activeDasha.maha} Mahadasha · ${activeDasha.antar} Antardasha`;

  const heroSubtitle =
    activeDasha.maha === "—"
      ? "Dasha data is loading."
      : `The ${activeDasha.maha} Mahadasha, currently focused through ${activeDasha.antar}, is a chapter of ${getDashaTheme(
          activeDasha.maha
        ).toLowerCase()}.`;

  const heroMetadata =
    activeDasha.maha === "—"
      ? "—"
      : `${activeDasha.start} – ${activeDasha.end} · ${activeDasha.remaining.toLocaleString()} days remaining`;

  const insights = [
    {
      label: "Ascendant",
      value: ascendant,
      metadata: "Lagna",
    },
    {
      label: "Moon Rashi",
      value: moonInfo?.sign ?? "—",
      metadata: `${displayClient.nakshatra ?? moonInfo?.nakshatra ?? "—"} · Pada ${
        moonInfo?.nakshatraPart ?? "—"
      }`,
    },
    {
      label: "Current Mahadasha",
      value: activeDasha.maha,
      metadata: activeDasha.start,
    },
    {
      label: "Current Antardasha",
      value: activeDasha.antar,
      metadata:
        activeDasha.remaining > 0
          ? `${activeDasha.remaining.toLocaleString()} days left`
          : "—",
    },
    {
      label: "Strongest Planet",
      value: strongestPlanet?.planet ?? "—",
      metadata: strongestPlanet ? `${strongestPlanet.score.toFixed(1)} rupas` : "—",
    },
    {
      label: "Key Transit",
      value: "Saturn in 8th",
      metadata: "Aquarius · restructuring",
    },
  ];

  const metrics = [
    {
      label: "Shadbala",
      value: strongestPlanet ? strongestPlanet.score.toFixed(1) : "—",
      metadata: "Strongest planet rupas",
    },
    {
      label: "Ashtakavarga",
      value: ashtakavargaTotal?.toString() ?? "—",
      metadata: "Sarva total",
    },
    {
      label: "Yogas",
      value: yogaCount,
      metadata: "Active combinations",
    },
    {
      label: "Doshas",
      value: doshaCount,
      metadata: "Active corrections",
    },
  ];

  const interpretation = useMemo(() => {
    if (!chartData || activeDasha.maha === "—") {
      return "Client overview is being prepared.";
    }

    const moonRashi = moonInfo?.sign ?? "—";
    const nakshatra = displayClient.nakshatra ?? moonInfo?.nakshatra ?? "—";

    return [
      `With ${ascendant} rising, the client presents a ${getElement(
        ascendant
      )}-tempered outer personality.`,
      `The Moon in ${moonRashi} (${nakshatra}) colours the emotional baseline with ${getNakshatraTone(
        nakshatra
      )} energy.`,
      `Currently in ${activeDasha.maha} Mahadasha · ${activeDasha.antar} Antardasha, the dominant life theme is ${getDashaTheme(
        activeDasha.maha
      ).toLowerCase()}.`,
      getDashaTheme(activeDasha.antar),
    ].join(" ");
  }, [chartData, ascendant, moonInfo, activeDasha, displayClient.nakshatra]);

  // -------------------------------------------------------------------------
  // Table columns
  // -------------------------------------------------------------------------

  const planetaryColumns: DataTableColumn<PlanetaryInfo>[] = [
    {
      key: "planet",
      header: "Planet",
      render: (row) => (
        <span className="inline-flex items-center gap-2">
          <span className="font-serif text-[18px]">{getPlanetSymbol(row.planet)}</span>
          <span>{row.planet}</span>
          {row.isRetro && <span className="text-meta-md text-muted">℞</span>}
        </span>
      ),
    },
    { key: "sign", header: "Sign" },
    { key: "degree", header: "Degree", type: "numeric" },
    { key: "nakshatra", header: "Nakshatra" },
    { key: "nakshatraPart", header: "Pada", align: "center", type: "numeric" },
    { key: "house", header: "House", align: "center", type: "numeric" },
  ];

  const shadbalaColumns: DataTableColumn<ShadbalaRow>[] = [
    { key: "planet", header: "Planet" },
    { key: "rupas", header: "Rupas", align: "right", type: "numeric" },
    { key: "virupas", header: "Virupas", align: "right", type: "numeric" },
    { key: "rank", header: "Rank", align: "center", type: "numeric" },
    { key: "status", header: "Status" },
  ];

  const ashtakavargaColumns: DataTableColumn<AshtakavargaRow>[] = [
    { key: "sign", header: "Sign" },
    { key: "score", header: "Score", align: "center", type: "numeric" },
  ];

  // -------------------------------------------------------------------------
  // Loading state
  // -------------------------------------------------------------------------

  const isLoading =
    isLoadingCharts || isDashaLoading || isShadbalaLoading || isAshtakavargaLoading;

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div
      className={cn(
        dashboardTemplateClasses.root,
        "animate-in fade-in slide-in-from-bottom-4 duration-700"
      )}
    >
      {/* 1. PAGE HEADER */}
      <header className={pageHeaderClasses.container}>
        <div className={pageHeaderClasses.titleBlock}>
          <h1 className={pageHeaderClasses.title}>Overview</h1>
          <p className={pageHeaderClasses.subtitle}>
            Astrological intelligence for {displayClient.name}
          </p>
        </div>
        <div className={pageHeaderClasses.actions}>
          <GoldenButton topText="Generate" bottomText="Full Report" />
        </div>
      </header>

      {/* 2. PAGE SUMMARY */}
      <section
        className={pageSummaryClasses.container}
        aria-label="Client birth summary"
      >
        <div className={pageSummaryClasses.item}>
          <Calendar className="w-4 h-4 text-muted" />
          <span className={pageSummaryClasses.label}>Born</span>
          <span className={pageSummaryClasses.value}>
            {formatDateShort(displayClient.dateOfBirth)}
          </span>
        </div>
        <div className={pageSummaryClasses.item}>
          <Clock className="w-4 h-4 text-muted" />
          <span className={pageSummaryClasses.label}>Time</span>
          <span className={pageSummaryClasses.value}>
            {displayClient.timeOfBirth}
          </span>
        </div>
        <div className={pageSummaryClasses.item}>
          <MapPin className="w-4 h-4 text-muted" />
          <span className={pageSummaryClasses.label}>Place</span>
          <span className={pageSummaryClasses.value}>
            {displayClient.placeOfBirth?.city ?? "—"}
          </span>
        </div>
        <div className={pageSummaryClasses.item}>
          <Sparkles className="w-4 h-4 text-muted" />
          <span className={pageSummaryClasses.label}>Ayanamsa</span>
          <span className={pageSummaryClasses.value}>{ayanamsa}</span>
        </div>
      </section>

      {/* 3. HERO INSIGHT */}
      {isLoading ? (
        <Card variant="hero" className={heroInsightClasses.container}>
          <div className="flex items-center gap-3 text-muted">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-body-md">Consulting the stars...</span>
          </div>
        </Card>
      ) : (
        <Card variant="hero" className={heroInsightClasses.container}>
          <span className={heroInsightClasses.label}>Current Life Period</span>
          <h2 className={heroInsightClasses.value}>{heroTitle}</h2>
          <p className={heroInsightClasses.supportingText}>{heroSubtitle}</p>
          <p className={heroInsightClasses.metadata}>{heroMetadata}</p>

          {/* Progress bar */}
          {activeDasha.total > 0 && (
            <div className="mt-4">
              <div className="h-1.5 w-full bg-bg-subtle rounded-full overflow-hidden border border-border-secondary">
                <div
                  className="h-full bg-text-primary rounded-full"
                  style={{ width: `${activeDasha.progress}%` }}
                  aria-hidden="true"
                />
              </div>
              <p className="text-meta-md text-muted mt-1.5">
                {activeDasha.progress}% elapsed
              </p>
            </div>
          )}

          <div className={heroInsightClasses.actionArea}>
            <Link
              href={`/client/${clientId}/dashas`}
              className="inline-flex items-center gap-1.5 text-body-md font-medium text-primary hover:underline"
            >
              Open Dasha Timeline
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </Card>
      )}

      {/* 4. INSIGHT STRIP */}
      <section className={insightStripClasses.container} aria-label="Key insights">
        {insights.map((insight) => (
          <Card
            key={insight.label}
            variant="insight"
            className={insightStripClasses.item}
          >
            <span className={insightStripClasses.label}>{insight.label}</span>
            <span className={insightStripClasses.value}>{insight.value}</span>
            {insight.metadata && (
              <span className={insightStripClasses.metadata}>
                {insight.metadata}
              </span>
            )}
          </Card>
        ))}
      </section>

      {/* 5. METRIC GRID */}
      <section
        className={metricGridClasses[4]}
        aria-label="Quantified metrics"
      >
        {metrics.map((metric) => (
          <Card
            key={metric.label}
            variant="widget"
            className={metricCardClasses.container}
          >
            <span className={metricCardClasses.label}>{metric.label}</span>
            <span className={metricCardClasses.value}>{metric.value}</span>
            {metric.metadata && (
              <span className={metricCardClasses.metadata}>{metric.metadata}</span>
            )}
          </Card>
        ))}
      </section>

      {/* 6. CONTENT AREA */}
      <section
        className={dashboardTemplateClasses.contentArea}
        aria-label="Chart and interpretation"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-card-gap">
          {/* Chart */}
          <Card variant="data" className="lg:col-span-5">
            <CardHeader>
              <div>
                <CardTitle>D1 Natal Chart</CardTitle>
                <CardSubtitle>{ayanamsa} ayanamsa</CardSubtitle>
              </div>
            </CardHeader>
            <CardBody className="items-center justify-center">
              {chartData ? (
                <div className="w-full max-w-[320px]">
                  <NorthIndianChart
                    ascendantSign={chartData.ascendant}
                    planets={chartData.planets}
                    showDegrees
                  />
                </div>
              ) : (
                <p className="text-body-md text-muted">Chart data unavailable</p>
              )}
            </CardBody>
          </Card>

          {/* Interpretation */}
          <Card variant="insight" className="lg:col-span-7">
            <CardHeader>
              <div>
                <CardTitle>Reading</CardTitle>
                <CardSubtitle>Consultant summary</CardSubtitle>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-body-md text-secondary leading-relaxed">
                {interpretation}
              </p>
            </CardBody>
          </Card>
        </div>

        {/* Timeline */}
        <Card variant="data">
          <CardHeader>
            <div>
              <CardTitle>Upcoming Dasha Transitions</CardTitle>
              <CardSubtitle>Next major life periods</CardSubtitle>
            </div>
          </CardHeader>
          <CardBody>
            {upcomingTransitions.length > 0 ? (
              <div className="space-y-3">
                {upcomingTransitions.map((t, i) => (
                  <div
                    key={`${t.planet}-${i}`}
                    className="flex items-center justify-between py-2 border-b border-border-secondary last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-serif text-[20px]">
                        {getPlanetSymbol(t.planet)}
                      </span>
                      <div>
                        <p className="text-body-md text-primary font-medium">
                          {t.planet} Mahadasha
                        </p>
                        <p className="text-meta-md text-muted">
                          {t.start} – {t.end}
                        </p>
                      </div>
                    </div>
                    <TrendingUp className="w-4 h-4 text-muted" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-body-md text-muted">
                No upcoming transitions available.
              </p>
            )}
          </CardBody>
        </Card>
      </section>

      {/* 7. DATA AREA */}
      <section className={dashboardTemplateClasses.dataArea} aria-label="Supporting data">
        {/* Planetary Positions — visible by default */}
        <Card variant="data">
          <CardHeader>
            <div>
              <CardTitle>Planetary Positions</CardTitle>
              <CardSubtitle>Natal planet coordinates</CardSubtitle>
            </div>
          </CardHeader>
          <CardBody>
            <DataTable
              columns={planetaryColumns}
              data={planetaryInfo}
              variant="compact"
              ariaLabel="Planetary positions"
              loading={isLoadingCharts}
              loadingRows={5}
            />
          </CardBody>
        </Card>

        {/* Shadbala — collapsed */}
        <CollapsibleDataCard title="Shadbala Detail" defaultOpen={false}>
          <DataTable
            columns={shadbalaColumns}
            data={shadbalaRows}
            variant="compact"
            ariaLabel="Shadbala strength detail"
            loading={isShadbalaLoading}
            loadingRows={5}
          />
        </CollapsibleDataCard>

        {/* Ashtakavarga — collapsed */}
        <CollapsibleDataCard title="Ashtakavarga Summary" defaultOpen={false}>
          <DataTable
            columns={ashtakavargaColumns}
            data={ashtakavargaRows}
            variant="compact"
            ariaLabel="Ashtakavarga summary"
            loading={isAshtakavargaLoading}
            loadingRows={5}
          />
        </CollapsibleDataCard>
      </section>

      {/* 8. ACTION AREA */}
      <section className={dashboardTemplateClasses.actionArea} aria-label="Actions">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-card-gap">
          <ActionCard
            href={`/client/${clientId}/reports`}
            icon={FileText}
            title="Generate Report"
            desc="Create a full PDF analysis"
          />
          <ActionCard
            href={`/client/${clientId}/charts`}
            icon={LayoutDashboard}
            title="View Charts"
            desc="D1, D9, and divisionals"
          />
          <ActionCard
            href={`/client/${clientId}/dashas`}
            icon={Moon}
            title="View Dashas"
            desc="Timeline analysis"
          />
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Local helper components
// ---------------------------------------------------------------------------

function CollapsibleDataCard({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = `${title.toLowerCase().replace(/\s+/g, "-")}-panel`;

  return (
    <Card variant="data">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left"
        aria-expanded={open}
        aria-controls={panelId}
      >
        <CardHeader
          action={
            <ChevronDown
              className={cn(
                "w-4 h-4 text-muted transition-transform",
                open && "rotate-180"
              )}
            />
          }
        >
          <div>
            <CardTitle>{title}</CardTitle>
          </div>
        </CardHeader>
      </button>
      {open && (
        <CardBody id={panelId}>
          {children}
        </CardBody>
      )}
    </Card>
  );
}

function ActionCard({
  href,
  icon: Icon,
  title,
  desc,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  desc: string;
}) {
  return (
    <Link href={href} className="block">
      <Card variant="interactive" className="h-full">
        <CardBody className="flex-row items-center gap-card-gap">
          <Icon className="w-6 h-6 text-muted shrink-0" />
          <div>
            <h3 className="text-title-md font-ui text-primary">{title}</h3>
            <p className="text-body-sm text-secondary">{desc}</p>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
