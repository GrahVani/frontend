"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  TrendingUp,
  Loader2,
  RefreshCw,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  BrainCircuit,
  Star,
  Info,
  ChevronDown,
  FileText,
  Printer,
  User,
  ArrowRight,
  History,
  Layers,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { useVedicClient } from "@/context/VedicClientContext";
import { useAstrologerStore } from "@/store/useAstrologerStore";
import { useDasha, useOtherDasha } from "@/hooks/queries/useCalculations";
import {
  DashaNode,
  RawDashaPeriod,
  standardizeDashaLevels,
  findActiveDashaPath,
  getSublevels,
} from "@/lib/dasha-utils";
import { PLANET_INTEL } from "@/lib/dasha-utils/planet-intel";
import {
  formatDateDisplay,
  calculateDuration,
} from "@/lib/dasha-utils/date-helpers";
import { PLANET_COLORS } from "@/lib/astrology-constants";
import { getPlanetSymbol } from "@/lib/planet-symbols";
import { cn } from "@/lib/utils";

import {
  Card,
  CardHeader,
  CardTitle,
  CardSubtitle,
  CardBody,
} from "@/design-system/components/cards";
import {
  DataTable,
  type DataTableColumn,
} from "@/design-system/components/table";
import {
  pageHeaderClasses,
  pageSummaryClasses,
  heroInsightClasses,
  insightStripClasses,
} from "@/design-system/templates/shared-template";
import { analysisTemplateClasses } from "@/design-system/templates/analysis-template";

// ─── Level configuration ──────────────────────────────────────────────────

const DASHA_LEVELS = [
  { id: "mahadasha", name: "Mahadasha", short: "Maha" },
  { id: "antardasha", name: "Antardasha", short: "Antar" },
  { id: "pratyantardasha", name: "Pratyantardasha", short: "Pratyantar" },
  { id: "sookshmadasha", name: "Sookshma", short: "Sookshma" },
  { id: "pranadasha", name: "Prana", short: "Prana" },
];

const SYSTEM_OPTIONS = [
  { value: "vimshottari", label: "Vimshottari (120 yrs)" },
  { value: "chara", label: "Jaimini Chara Dasha" },
  { value: "yogini", label: "Yogini (36 yrs)" },
];

// ─── Local helpers ────────────────────────────────────────────────────────

function parseDateStr(dateStr: string): Date | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

function getDaysRemaining(endDateStr: string): number {
  const end = parseDateStr(endDateStr);
  if (!end) return 0;
  const now = new Date();
  return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}

function getDaysUntil(startDateStr: string): number {
  const start = parseDateStr(startDateStr);
  if (!start) return 0;
  const now = new Date();
  return Math.max(0, Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}

interface DashaLike {
  planet?: string;
  lord?: string;
  startDate?: string;
  endDate?: string;
  raw?: Record<string, unknown>;
  sign_name?: string;
}

function getDisplayName(node: DashaLike | undefined, isChara: boolean): string {
  if (!node) return "—";
  const raw = node.raw;
  const planet = node.planet || node.lord || (raw as Record<string, unknown>)?.lord || "";
  if (isChara) {
    return String((raw as Record<string, unknown>)?.sign_name || planet || "—");
  }
  return String(planet || "—");
}

function getPlanetKey(name: string): string {
  const clean = name?.split(" ")[0];
  return PLANET_INTEL[clean] ? clean : "";
}

function getIntel(name: string) {
  const key = getPlanetKey(name);
  return key ? PLANET_INTEL[key] : null;
}

function formatRange(startDate?: string, endDate?: string): string {
  return `${formatDateDisplay(startDate || "")} – ${formatDateDisplay(endDate || "")}`;
}

// ─── Main component ───────────────────────────────────────────────────────

export default function DashaIntelligenceDashboard() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clientDetails } = useVedicClient();
  const { ayanamsa } = useAstrologerStore();

  const [selectedDashaType, setSelectedDashaType] = useState<string>("vimshottari");
  const [selectedIntelPlanet, setSelectedIntelPlanet] = useState<string>("");
  const isVimshottari = selectedDashaType === "vimshottari";
  const isChara = selectedDashaType === "chara";

  // Backend context from URL drill-down path
  const backendContext = useMemo(() => {
    const pathParam = searchParams.get("p");
    return { drillDownPath: pathParam ? pathParam.split(",") : [] };
  }, [searchParams]);

  // Data queries
  const {
    data: treeResponse,
    isLoading: treeLoading,
    isFetching: treeFetching,
  } = useDasha(
    clientDetails?.id || "",
    "tree",
    ayanamsa.toLowerCase(),
    backendContext
  );

  const {
    data: otherData,
    isLoading: otherLoading,
    isFetching: otherFetching,
  } = useOtherDasha(
    clientDetails?.id || "",
    selectedDashaType,
    ayanamsa.toLowerCase()
  );

  const isLoading = isVimshottari ? treeLoading : otherLoading;
  const isFetching = isVimshottari ? treeFetching : otherFetching;
  const response = isVimshottari ? treeResponse : otherData;

  // Active path analysis
  const activeAnalysis = useMemo(() => {
    if (!response?.data) return null;
    const backendPath = (response.data as Record<string, unknown>).curr_path;
    if (backendPath && Array.isArray(backendPath) && backendPath.length >= 5) {
      return {
        nodes: backendPath as DashaNode[],
        progress: findActiveDashaPath(response.data).progress,
        metadata: findActiveDashaPath(response.data).metadata,
      };
    }
    return findActiveDashaPath(response.data);
  }, [response]);

  const activeNodes = activeAnalysis?.nodes || [];
  const metadata = activeAnalysis?.metadata;

  // Viewing branch + periods for table
  const { currentPath, viewingPeriods, isPathSatisfied, rawMahadashas } = useMemo(() => {
    const raw =
      (response?.data as Record<string, unknown>)?.mahadashas as Record<string, unknown>[] ||
      (response?.data as Record<string, unknown>)?.periods as Record<string, unknown>[] ||
      [];

    const pathParam = searchParams.get("p") || "";
    const targetPlanets = pathParam ? pathParam.split(",") : [];

    let branch = raw;
    let parentStart = "";
    let reconciledPath: DashaLike[] = [];
    let viewingBranch = raw;
    let satisfiedCount = 0;

    if (raw.length > 0) {
      for (const pName of targetPlanets) {
        const match = branch.find((n: Record<string, unknown>) =>
          ((n.planet as string) || (n.lord as string) || "").toLowerCase() ===
          (pName || "").toLowerCase()
        );
        if (match) {
          reconciledPath.push(match);
          parentStart = (match.start_date || match.startDate) as string;
          satisfiedCount++;
          const subs = getSublevels(match);
          if (subs && subs.length > 0) {
            branch = subs;
            viewingBranch = subs;
          } else {
            break;
          }
        } else break;
      }
    }

    return {
      currentPath: reconciledPath,
      viewingPeriods: standardizeDashaLevels(viewingBranch, parentStart),
      isPathSatisfied: targetPlanets.length === 0 || satisfiedCount === targetPlanets.length,
      rawMahadashas: raw,
    };
  }, [response, searchParams]);

  const currentLevel = currentPath.length;

  // Sync selected intel planet to active mahadasha on first load
  useEffect(() => {
    if (activeNodes.length > 0 && !selectedIntelPlanet) {
      setSelectedIntelPlanet(getDisplayName(activeNodes[0], isChara));
    }
  }, [activeNodes, isChara, selectedIntelPlanet]);

  // ─── Navigation ─────────────────────────────────────────────────────────

  const handleDrillDown = (period: DashaNode) => {
    if (currentLevel >= 4) return;
    const raw = period.raw;
    if (raw && getSublevels(raw as RawDashaPeriod)) {
      const newPathArr = [...currentPath, raw as RawDashaPeriod];
      const urlPlanets = newPathArr.map((p) => p.planet || p.lord).join(",");
      router.replace(`?p=${urlPlanets}`, { scroll: false });
      setSelectedIntelPlanet(getDisplayName(period, isChara));
    }
  };

  const handleBreadcrumbClick = (targetIdx: number) => {
    if (targetIdx === -1) {
      router.replace("?", { scroll: false });
      if (activeNodes[0]) setSelectedIntelPlanet(getDisplayName(activeNodes[0], isChara));
      return;
    }

    let newPathArr: DashaLike[] = [];
    if (targetIdx < currentPath.length) {
      newPathArr = currentPath.slice(0, targetIdx + 1) as DashaLike[];
    } else {
      newPathArr = activeNodes.slice(0, targetIdx + 1) as DashaLike[];
    }

    if (newPathArr.length > 0) {
      const lastNode = newPathArr[newPathArr.length - 1];
      const urlPlanets = newPathArr.map((p) => p.planet || p.lord).join(",");
      router.replace(`?p=${urlPlanets}`, { scroll: false });
      setSelectedIntelPlanet(getDisplayName(lastNode, isChara));
    }
  };

  const handleSystemChange = (type: string) => {
    setSelectedDashaType(type);
    setSelectedIntelPlanet("");
    router.replace("?", { scroll: false });
  };

  // ─── Derived insights ───────────────────────────────────────────────────

  const maha = activeNodes[0];
  const antar = activeNodes[1];
  const pratyantar = activeNodes[2];

  const mahaName = maha ? getDisplayName(maha, isChara) : "—";
  const antarName = antar ? getDisplayName(antar, isChara) : "—";
  const pratyantarName = pratyantar ? getDisplayName(pratyantar, isChara) : "—";

  const mahaIntel = getIntel(mahaName);
  const antarIntel = getIntel(antarName);

  const heroTitle = maha && antar
    ? `${mahaName} Mahadasha · ${antarName} Antardasha`
    : maha
      ? `${mahaName} Mahadasha`
      : "Current Dasha Period";

  const heroSupporting = mahaIntel
    ? `The ${mahaName} Mahadasha${antar ? `, currently focused through ${antarName},` : ""} is a chapter of ${mahaIntel.themes[0].toLowerCase()} and ${mahaIntel.themes[1].toLowerCase()}.`
    : "Dasha data is loading.";

  const heroMeta = maha
    ? `${formatRange(maha.startDate, maha.endDate)} · ${getDaysRemaining(maha.endDate).toLocaleString()} days remaining`
    : "";

  // Next antardasha within current mahadasha
  const nextAntardasha = useMemo(() => {
    if (!maha || !isVimshottari) return null;
    const antardashas = getSublevels(maha.raw || (maha as unknown as Record<string, unknown>));
    if (!antardashas || antardashas.length === 0) return null;
    const standardized = standardizeDashaLevels(antardashas, maha.startDate);
    const idx = standardized.findIndex((p) => p.planet === antar?.planet);
    return standardized[idx + 1] || null;
  }, [maha, antar, isVimshottari]);

  // Upcoming transition: soonest end date among active path nodes (excluding maha)
  const upcomingTransition = useMemo(() => {
    const candidates = activeNodes.slice(1).filter((n) => n?.endDate);
    if (candidates.length === 0) return null;
    return candidates.reduce((soonest, node) => {
      const nodeDays = getDaysRemaining(node.endDate);
      const soonestDays = getDaysRemaining(soonest.endDate);
      return nodeDays < soonestDays ? node : soonest;
    }, candidates[0]);
  }, [activeNodes]);

  const insights = useMemo(
    () => [
      {
        label: "Current Mahadasha",
        value: mahaName,
        metadata: maha ? formatRange(maha.startDate, maha.endDate) : "—",
      },
      {
        label: "Current Antardasha",
        value: antarName,
        metadata: antar ? formatRange(antar.startDate, antar.endDate) : "—",
      },
      {
        label: "Next Antardasha",
        value: nextAntardasha ? getDisplayName(nextAntardasha, isChara) : "—",
        metadata: nextAntardasha
          ? `Starts ${formatDateDisplay(nextAntardasha.startDate)}`
          : "Final antardasha",
      },
      {
        label: "Mahadasha Lord Strength",
        value: mahaIntel?.nature.split(" ")[0] || "—",
        metadata: mahaIntel?.nature || "",
      },
      {
        label: "Current Life Theme",
        value: antarIntel?.themes.slice(0, 2).join(", ") || mahaIntel?.themes[0] || "—",
        metadata: "Primary focus area",
      },
      {
        label: "Upcoming Transition",
        value: upcomingTransition ? getDisplayName(upcomingTransition, isChara) : "—",
        metadata: upcomingTransition
          ? `In ${getDaysRemaining(upcomingTransition.endDate)} days`
          : "—",
      },
    ],
    [maha, antar, mahaName, antarName, pratyantarName, nextAntardasha, mahaIntel, antarIntel, upcomingTransition, isChara]
  );

  // ─── Guard ──────────────────────────────────────────────────────────────

  if (!clientDetails) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <p className="text-body-lg text-gold-dark font-serif">
          Please select a client to view Dasha details
        </p>
      </div>
    );
  }

  // ─── Table columns ──────────────────────────────────────────────────────

  const tableData = useMemo(
    () =>
      viewingPeriods.map((period) => ({
        planet: getDisplayName(period, isChara),
        rawPlanet: period.planet,
        startDate: period.startDate,
        endDate: period.endDate,
        duration: calculateDuration(period.startDate, period.endDate),
        isCurrent: period.isCurrent,
        canDrill: !!period.raw && !!getSublevels(period.raw as RawDashaPeriod) && currentLevel < 4,
        raw: period.raw,
      })),
    [viewingPeriods, isChara, currentLevel]
  );

  const columns: DataTableColumn<(typeof tableData)[number]>[] = [
    {
      key: "planet",
      header: "Planet",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-card flex items-center justify-center border font-semibold text-body-md shadow-sm",
              PLANET_COLORS[row.rawPlanet] || "bg-surface-pure border-border-primary"
            )}
          >
            {isChara ? row.planet.slice(0, 2) : getPlanetSymbol(row.rawPlanet)}
          </div>
          <div>
            <div className="font-semibold text-primary text-body-md">
              {isChara ? row.planet : (
                <span className="inline-flex items-center gap-1.5">
                  {getPlanetSymbol(row.rawPlanet)} {row.planet}
                </span>
              )}
            </div>
            {row.isCurrent && (
              <span className="inline-block text-[10px] font-black uppercase text-gold-dark bg-gold-primary/10 px-1.5 py-0.5 rounded tracking-tighter">
                Current Period
              </span>
            )}
          </div>
        </div>
      ),
    },
    { key: "startDate", header: "Start Date", render: (row) => formatDateDisplay(row.startDate) },
    { key: "endDate", header: "End Date", render: (row) => formatDateDisplay(row.endDate) },
    {
      key: "duration",
      header: "Duration",
      render: (row) => <span className="text-gold-dark/70 font-bold">{row.duration}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      align: "center",
      render: (row) => (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setSelectedIntelPlanet(row.planet)}
            className={cn(
              "p-2 rounded-card border shadow-sm transition-all",
              currentLevel < 4
                ? "bg-surface-pure border-border-primary text-gold-dark hover:bg-gold-primary hover:text-white"
                : "bg-surface-warm border-border-primary text-muted cursor-default"
            )}
            title={currentLevel < 4 ? "View Intelligence" : "Final Stage"}
          >
            <BrainCircuit className="w-4 h-4" />
          </button>
          {row.canDrill && (
            <button
              onClick={() =>
                handleDrillDown({
                  planet: row.rawPlanet,
                  startDate: row.startDate,
                  endDate: row.endDate,
                  raw: row.raw as RawDashaPeriod,
                })
              }
              className="p-2 rounded-card bg-surface-pure text-gold-dark hover:bg-gold-primary hover:text-white transition-all"
              title="Drill Down"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ];

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <div className={cn(analysisTemplateClasses.root, "animate-in fade-in duration-500 pb-10")}>
      {/* 1. Page Header */}
      <header className={pageHeaderClasses.container}>
        <div className={pageHeaderClasses.titleBlock}>
          <h1 className={pageHeaderClasses.title}>Dasha Intelligence Dashboard</h1>
          <p className={pageHeaderClasses.subtitle}>
            Temporal analysis for {clientDetails.name}
          </p>
        </div>
        <div className={pageHeaderClasses.actions}>
          <button
            onClick={() => queryClient.invalidateQueries({ queryKey: ["dasha"] })}
            disabled={isFetching}
            className="inline-flex items-center gap-2 px-4 py-2 bg-surface-primary border border-border-primary rounded-card text-body-md font-medium text-primary hover:bg-bg-elevated transition-colors disabled:opacity-50"
          >
            <RefreshCw className={cn("w-4 h-4", isFetching && "animate-spin")} />
            Refresh
          </button>
        </div>
      </header>

      {/* 2. Page Summary */}
      <section className={pageSummaryClasses.container} aria-label="Client context">
        <div className={pageSummaryClasses.item}>
          <span className={pageSummaryClasses.label}>Client</span>
          <span className={pageSummaryClasses.value}>{clientDetails.name}</span>
        </div>
        <div className={pageSummaryClasses.item}>
          <span className={pageSummaryClasses.label}>Birth Date</span>
          <span className={pageSummaryClasses.value}>{formatDateDisplay(clientDetails.dateOfBirth)}</span>
        </div>
        <div className={pageSummaryClasses.item}>
          <span className={pageSummaryClasses.label}>Birth Time</span>
          <span className={pageSummaryClasses.value}>{clientDetails.timeOfBirth}</span>
        </div>
        <div className={pageSummaryClasses.item}>
          <span className={pageSummaryClasses.label}>Place</span>
          <span className={pageSummaryClasses.value}>{clientDetails.placeOfBirth?.city || "Unknown"}</span>
        </div>
        <div className={pageSummaryClasses.item}>
          <span className={pageSummaryClasses.label}>Ayanamsa</span>
          <span className={pageSummaryClasses.value}>{ayanamsa}</span>
        </div>
        <div className={pageSummaryClasses.item}>
          <span className={pageSummaryClasses.label}>Nakshatra</span>
          <span className={pageSummaryClasses.value}>{metadata?.nakshatraAtBirth || "—"}</span>
        </div>
      </section>

      {/* 3. Insight Strip */}
      <section className={insightStripClasses.container} aria-label="Dasha insights">
        {insights.map((insight) => (
          <Card key={insight.label} variant="insight" className={insightStripClasses.item}>
            <span className={insightStripClasses.label}>{insight.label}</span>
            <span className={insightStripClasses.value}>{insight.value}</span>
            {insight.metadata && (
              <span className={insightStripClasses.metadata}>{insight.metadata}</span>
            )}
          </Card>
        ))}
      </section>

      {/* 4. Hero Insight */}
      <Card variant="hero" className={heroInsightClasses.container}>
        {isLoading || !maha ? (
          <div className="flex items-center gap-3 text-muted">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-body-md">Calculating dasha periods...</span>
          </div>
        ) : (
          <>
            <span className={heroInsightClasses.label}>Current Life Period</span>
            <h2 className={heroInsightClasses.value}>{heroTitle}</h2>
            <p className={heroInsightClasses.supportingText}>{heroSupporting}</p>
            <p className={heroInsightClasses.metadata}>{heroMeta}</p>
            {activeAnalysis && (
              <div className="mt-4 max-w-xl">
                <div className="flex items-center justify-between text-meta-md text-muted mb-1">
                  <span>Period progress</span>
                  <span>{Math.round(activeAnalysis.progress)}%</span>
                </div>
                <div className="h-2 bg-bg-subtle rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold-primary rounded-full transition-all"
                    style={{ width: `${activeAnalysis.progress}%` }}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* 5. Analysis Area */}
      <section className={analysisTemplateClasses.analysisArea} aria-label="Dasha analysis">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-card-gap">
          {/* Current Period Interpretation */}
          <Card variant="insight" className="lg:col-span-7">
            <CardHeader>
              <div>
                <CardTitle>Current Period Interpretation</CardTitle>
                <CardSubtitle>
                  {mahaName} Mahadasha · {antarName} Antardasha
                </CardSubtitle>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              {mahaIntel && (
                <div>
                  <h4 className="text-title-md font-ui text-primary mb-1">{mahaName} Mahadasha</h4>
                  <p className="text-body-md text-secondary">{mahaIntel.advice}</p>
                  <p className="text-body-sm text-muted mt-1">{mahaIntel.tip}</p>
                </div>
              )}
              {antarIntel && (
                <div className="pt-4 border-t border-border-secondary">
                  <h4 className="text-title-md font-ui text-primary mb-1">{antarName} Antardasha</h4>
                  <p className="text-body-md text-secondary">{antarIntel.advice}</p>
                  <p className="text-body-sm text-muted mt-1">{antarIntel.tip}</p>
                </div>
              )}
              {!mahaIntel && !antarIntel && (
                <p className="text-body-md text-secondary">Select a dasha period to view interpretation.</p>
              )}
            </CardBody>
          </Card>

          {/* Planetary Influence */}
          <Card variant="insight" className="lg:col-span-5">
            <CardHeader>
              <div>
                <CardTitle>Planetary Influence</CardTitle>
                <CardSubtitle>Active lord themes</CardSubtitle>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              {[mahaName, antarName, pratyantarName].filter(Boolean).map((name, idx) => {
                const intel = getIntel(name);
                const labels = ["Mahadasha", "Antardasha", "Pratyantardasha"];
                return (
                  <div key={name + idx}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-body-md font-medium text-primary">{name}</span>
                      <span className="text-meta-md text-muted">{labels[idx]}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {intel?.themes.map((theme) => (
                        <span
                          key={theme}
                          className="px-2 py-1 bg-surface-secondary border border-border-primary text-secondary rounded-card text-body-sm"
                        >
                          {theme}
                        </span>
                      )) || <span className="text-body-sm text-muted">No interpretation available</span>}
                    </div>
                  </div>
                );
              })}
            </CardBody>
          </Card>

          {/* Timeline Visualization */}
          <Card variant="data" className="lg:col-span-8">
            <CardHeader>
              <div>
                <CardTitle>Life Timeline</CardTitle>
                <CardSubtitle>Mahadasha sequence</CardSubtitle>
              </div>
            </CardHeader>
            <CardBody>
              {rawMahadashas.length > 0 ? (
                <div className="flex items-center gap-1 overflow-x-auto pb-2">
                  {rawMahadashas.slice(0, 12).map((d, i) => {
                    const name = getDisplayName(
                      { planet: String(d.planet || d.lord || ""), raw: d as Record<string, unknown> } as DashaNode,
                      isChara
                    );
                    const isCurrent = (d as Record<string, unknown>).isCurrent;
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          if (getSublevels(d)) {
                            router.replace(`?p=${d.planet || d.lord}`, { scroll: false });
                            setSelectedIntelPlanet(name);
                          }
                        }}
                        className={cn(
                          "flex flex-col items-center gap-2 min-w-[80px] p-3 rounded-card border transition-colors",
                          isCurrent
                            ? "border-gold-primary bg-gold-primary/5"
                            : "border-border-primary hover:bg-bg-elevated"
                        )}
                      >
                        <div
                          className={cn(
                            "w-12 h-12 rounded-card border flex items-center justify-center text-body-xs font-black shadow-sm",
                            PLANET_COLORS[String(d.planet || d.lord || "Jupiter")] || "bg-surface-pure border-border-primary"
                          )}
                        >
                          {name.slice(0, 2)}
                        </div>
                        <span className="text-[10px] font-bold text-gold-dark uppercase">{name}</span>
                        <span className="text-[9px] text-muted">
                          {formatDateDisplay(String((d as Record<string, unknown>).start_date || (d as Record<string, unknown>).startDate || ""))}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-body-md text-muted text-center py-8">No mahadasha timeline available.</p>
              )}
            </CardBody>
          </Card>

          {/* Upcoming Changes */}
          <Card variant="insight" className="lg:col-span-4">
            <CardHeader>
              <div>
                <CardTitle>Upcoming Changes</CardTitle>
                <CardSubtitle>Next transitions</CardSubtitle>
              </div>
            </CardHeader>
            <CardBody className="space-y-3">
              {activeNodes.slice(1, 4).map((node, idx) => {
                const name = getDisplayName(node, isChara);
                const days = getDaysRemaining(node.endDate);
                const label = DASHA_LEVELS[idx + 1]?.name || "Sub-period";
                return (
                  <div
                    key={name + idx}
                    className="flex items-center justify-between py-2 border-b border-border-secondary last:border-b-0"
                  >
                    <div>
                      <span className="text-body-md font-medium text-primary">{name} {label} ends</span>
                      <p className="text-body-sm text-muted">{formatDateDisplay(node.endDate)}</p>
                    </div>
                    <span className="text-meta-md font-bold text-gold-dark">{days}d</span>
                  </div>
                );
              })}
              {!activeNodes[1] && (
                <p className="text-body-md text-muted">No upcoming transitions available.</p>
              )}
            </CardBody>
          </Card>
        </div>
      </section>

      {/* 6. Table Area */}
      <section className={analysisTemplateClasses.tablesArea} aria-label="Dasha tables">
        <Card variant="data">
          <CardHeader>
            <div>
              <CardTitle>Dasha Timeline</CardTitle>
              <CardSubtitle>
                {DASHA_LEVELS[currentLevel]?.name || "Mahadasha"} periods
              </CardSubtitle>
            </div>
            <div className="flex items-center gap-3">
              {/* System selector */}
              <div className="relative">
                <select
                  id="dasha-system-select"
                  value={selectedDashaType}
                  onChange={(e) => handleSystemChange(e.target.value)}
                  className="appearance-none bg-surface-primary border border-border-primary rounded-card px-4 py-2 pr-10 text-primary font-medium focus:outline-none focus:ring-2 focus:ring-gold-primary/30 cursor-pointer min-w-[180px]"
                >
                  {SYSTEM_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
              </div>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border-secondary">
              <button
                onClick={() => handleBreadcrumbClick(-1)}
                className={cn(
                  "text-body-sm font-bold hover:text-gold-dark transition-colors",
                  currentLevel === 0 ? "text-primary" : "text-muted"
                )}
              >
                Mahadasha
              </button>
              {currentPath.map((period, idx) => {
                const name = getDisplayName(period as DashaLike, isChara);
                return (
                  <React.Fragment key={idx}>
                    <ChevronRight className="w-4 h-4 text-muted" />
                    <button
                      onClick={() => handleBreadcrumbClick(idx)}
                      className={cn(
                        "text-body-sm font-bold px-2 py-0.5 rounded-card border",
                        PLANET_COLORS[name] || "bg-surface-primary border-border-primary text-primary hover:text-gold-dark"
                      )}
                    >
                      {name} {DASHA_LEVELS[idx]?.short}
                    </button>
                  </React.Fragment>
                );
              })}
              {currentLevel > 0 && (
                <>
                  <ChevronRight className="w-4 h-4 text-muted" />
                  <span className="text-body-sm font-bold text-primary">
                    {DASHA_LEVELS[currentLevel]?.name}
                  </span>
                </>
              )}
            </div>

            {/* Level pills */}
            {isVimshottari && (
              <div className="flex gap-2 overflow-x-auto">
                {DASHA_LEVELS.map((level, idx) => {
                  const isNavigable = idx <= currentLevel || idx < (activeNodes?.length || 0);
                  return (
                    <button
                      key={level.id}
                      onClick={
                        currentLevel === idx ? undefined : () => handleBreadcrumbClick(idx - 1)
                      }
                      disabled={!isNavigable}
                      className={cn(
                        "px-3 py-1.5 rounded-card text-body-sm font-bold transition-all whitespace-nowrap border",
                        currentLevel === idx
                          ? "bg-gold-primary text-white border-gold-primary shadow-sm cursor-default"
                          : isNavigable
                            ? "bg-surface-primary text-primary border-border-primary hover:bg-bg-elevated"
                            : "bg-surface-secondary text-muted border-border-primary cursor-not-allowed"
                      )}
                    >
                      {level.short}
                    </button>
                  );
                })}
              </div>
            )}

            {/* DataTable */}
            {isLoading || !isPathSatisfied ? (
              <div className="flex flex-col items-center justify-center h-[300px]">
                <Loader2 className="w-10 h-10 text-gold-dark animate-spin mb-4" />
                <p className="text-body-md text-muted italic">
                  {!isPathSatisfied
                    ? `Diving into ${DASHA_LEVELS[currentLevel]?.name}...`
                    : "Calculating dasha eras..."}
                </p>
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={tableData}
                variant="default"
                stickyHeader
                maxHeight="480px"
                ariaLabel="Dasha timeline table"
              />
            )}
          </CardBody>
        </Card>
      </section>

      {/* 7. Raw Data Area */}
      <section className={analysisTemplateClasses.rawDataArea} aria-label="Raw dasha data">
        <RawDataCard title="Complete Dasha Tree">
          {rawMahadashas.length > 0 ? (
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {rawMahadashas.map((d, i) => (
                <div
                  key={i}
                  className="p-3 bg-surface-secondary rounded-card border border-border-primary text-body-sm text-secondary"
                >
                  <span className="font-medium text-primary">{getDisplayName(
                    { planet: String(d.planet || d.lord || ""), raw: d as Record<string, unknown> } as DashaNode,
                    isChara
                  )}</span>
                  {" "}{formatDateDisplay(String((d as Record<string, unknown>).start_date || (d as Record<string, unknown>).startDate || ""))}
                  {" – "}{formatDateDisplay(String((d as Record<string, unknown>).end_date || (d as Record<string, unknown>).endDate || ""))}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-body-md text-muted">No dasha tree data available.</p>
          )}
        </RawDataCard>

        <RawDataCard title="Historical Periods">
          {rawMahadashas.length > 0 ? (
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {rawMahadashas
                .filter((d) => {
                  const end = String((d as Record<string, unknown>).end_date || (d as Record<string, unknown>).endDate || "");
                  return end && getDaysRemaining(end) === 0;
                })
                .map((d, i) => (
                  <div
                    key={i}
                    className="p-3 bg-surface-secondary rounded-card border border-border-primary text-body-sm text-secondary"
                  >
                    <span className="font-medium text-primary">{getDisplayName(
                      { planet: String(d.planet || d.lord || ""), raw: d as Record<string, unknown> } as DashaNode,
                      isChara
                    )}</span>
                    {" "}{formatDateDisplay(String((d as Record<string, unknown>).start_date || (d as Record<string, unknown>).startDate || ""))}
                    {" – "}{formatDateDisplay(String((d as Record<string, unknown>).end_date || (d as Record<string, unknown>).endDate || ""))}
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-body-md text-muted">No historical periods available.</p>
          )}
        </RawDataCard>
      </section>

      {/* 8. Action Area */}
      <section aria-label="Actions">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-card-gap">
          <ActionCard
            onClick={() => queryClient.invalidateQueries({ queryKey: ["dasha"] })}
            icon={RefreshCw}
            title="Refresh Dasha Data"
            desc="Recalculate from the backend"
          />
          <ActionCard
            href={`/client/${clientDetails.id}/overview`}
            icon={User}
            title="View Client Overview"
            desc="Return to the main dashboard"
          />
          <ActionCard
            href={`/client/${clientDetails.id}/reports`}
            icon={FileText}
            title="Generate Report"
            desc="Create a dasha analysis PDF"
          />
        </div>
      </section>
    </div>
  );
}

// ─── Local components ─────────────────────────────────────────────────────

function RawDataCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const panelId = `${title.toLowerCase().replace(/\s+/g, "-")}-panel`;

  return (
    <Card variant="data">
      <CardHeader
        role="button"
        tabIndex={0}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((o) => !o);
          }
        }}
        action={
          <span
            className={cn(
              "text-muted transition-transform inline-block",
              open && "rotate-180"
            )}
          >
            ▼
          </span>
        }
        aria-expanded={open}
        aria-controls={panelId}
        className="cursor-pointer hover:bg-bg-elevated transition-colors"
      >
        <div>
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      {open && <CardBody id={panelId}>{children}</CardBody>}
    </Card>
  );
}

function ActionCard({
  href,
  onClick,
  icon: Icon,
  title,
  desc,
}: {
  href?: string;
  onClick?: () => void;
  icon: React.ElementType;
  title: string;
  desc: string;
}) {
  const content = (
    <CardBody className="flex-row items-center gap-card-gap">
      <Icon className="w-6 h-6 text-muted shrink-0" />
      <div>
        <h3 className="text-title-md font-ui text-primary">{title}</h3>
        <p className="text-body-sm text-secondary">{desc}</p>
      </div>
    </CardBody>
  );

  if (href) {
    return (
      <a href={href} className="block">
        <Card variant="interactive" className="h-full">
          {content}
        </Card>
      </a>
    );
  }

  return (
    <Card
      variant="interactive"
      className="h-full"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {content}
    </Card>
  );
}
