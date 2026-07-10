"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft, BookOpen, MapPin, Layers } from "lucide-react";
import { SUBBRANCH_NODES, ROW_ORDER, type SubBranchNode } from "./data";

const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const INDIGO = "#4F6FA8";
const INDIGO_DEEP = "#2F4778";
const INK_ON_CREAM_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_ON_CREAM_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_ON_CREAM_MUTED = "var(--gl-ink-on-cream-muted)";

function skandhaTagColor(skandha: SubBranchNode["skandha"]) {
  switch (skandha) {
    case "Horā":
      return { bg: "rgba(162, 58, 30, 0.10)", text: "#A23A1E" };
    case "Saṁhitā":
      return { bg: "rgba(58, 140, 90, 0.10)", text: "#3A8C5A" };
    case "Cross-cutting":
      return { bg: "rgba(122, 94, 30, 0.10)", text: "#7A5E1E" };
  }
}

export function SevenSubBranchesExplorer() {
  const [activeSlug, setActiveSlug] = useState<SubBranchNode["slug"] | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const orderedNodes = ROW_ORDER.map((slug) => SUBBRANCH_NODES.find((n) => n.slug === slug)!);
  const activeNode = activeSlug ? SUBBRANCH_NODES.find((n) => n.slug === activeSlug) ?? null : null;

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-6"
      style={{ minHeight: "560px" }}
    >
      {/* LEFT — manuscript diagram */}
      <div
        className="relative rounded-xl overflow-hidden gl-surface-twilight-glass aspect-[2/3]"
      >
        <Image
          src="/assets/learning/lesson-figures/seven-sub-branches/figure-sapta-upashakha.png"
          alt="The seven sub-branches of Jyotiṣa arranged by skandha"
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {/* RIGHT — clickable rows / ActiveDetail */}
      <div className="flex flex-col gap-4">
        {activeNode ? (
          <ActiveDetail
            node={activeNode}
            onBack={() => setActiveSlug(null)}
            reducedMotion={reducedMotion}
          />
        ) : (
          <RowList
            nodes={orderedNodes}
            onActivate={setActiveSlug}
            reducedMotion={reducedMotion}
          />
        )}
      </div>
    </div>
  );
}

function RowList({
  nodes,
  onActivate,
  reducedMotion,
}: {
  nodes: SubBranchNode[];
  onActivate: (slug: SubBranchNode["slug"]) => void;
  reducedMotion: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 h-full">
      <p
        className="uppercase"
        style={{
          color: INDIGO,
          letterSpacing: "0.16em",
          fontWeight: 700,
          fontSize: "11px",
          fontFamily: "var(--font-sans), system-ui, sans-serif",
          marginBottom: "4px",
        }}
      >
        Explore each sub-branch
      </p>
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "20px",
          fontWeight: 500,
          color: INK_ON_CREAM_PRIMARY,
          lineHeight: 1.4,
          marginBottom: "8px",
        }}
      >
        The seven-fold subdivision of Jyotiṣa
      </p>
      <div
        style={{
          padding: "14px 16px",
          background: "rgba(232, 199, 114, 0.12)",
          borderLeft: "3px solid #A23A1E",
          borderRadius: "0 8px 8px 0",
          marginBottom: "8px",
        }}
      >
        <p
          className="uppercase mb-1"
          style={{
            color: "#A23A1E",
            letterSpacing: "0.12em",
            fontWeight: 700,
            fontSize: "11px",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
          }}
        >
          Try this
        </p>
        <p
          style={{
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            fontSize: "16px",
            color: INK_ON_CREAM_PRIMARY,
            lineHeight: 1.55,
          }}
        >
          Tap a sub-branch to read its operational scope, foundational texts, curriculum modules, and
          stream-specific emphasis. Then ask: which sub-branch gets the most curriculum coverage — and
          why?
        </p>
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
        {nodes.map((node) => {
          const tag = skandhaTagColor(node.skandha);
          return (
            <li key={node.slug} style={{ margin: 0, padding: 0 }}>
              <button
                type="button"
                onClick={() => onActivate(node.slug)}
                className="gl-focus-ring gl-clickable"
                aria-label={`Open ${node.iast} detail`}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: reducedMotion ? "none" : "background 250ms cubic-bezier(0.32, 0.72, 0.24, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(79, 111, 168, 0.10)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                <span
                  lang="sa"
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontFamily: "var(--font-devanagari), serif",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: node.nodeColorDeep,
                    background: `${node.nodeColor}20`,
                  }}
                >
                  {node.devanagari.charAt(0)}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-cormorant), serif",
                        fontSize: "17px",
                        fontWeight: 500,
                        color: INK_ON_CREAM_PRIMARY,
                      }}
                    >
                      {node.iast}
                    </span>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        padding: "2px 8px",
                        borderRadius: "999px",
                        background: tag.bg,
                        color: tag.text,
                        fontFamily: "var(--font-sans), system-ui, sans-serif",
                      }}
                    >
                      {node.skandha}
                    </span>
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-sans), system-ui, sans-serif",
                      fontSize: "13px",
                      color: INK_ON_CREAM_SECONDARY,
                      lineHeight: 1.45,
                      marginTop: "2px",
                    }}
                  >
                    {node.function}
                  </p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ActiveDetail({
  node,
  onBack,
  reducedMotion,
}: {
  node: SubBranchNode;
  onBack: () => void;
  reducedMotion: boolean;
}) {
  const tag = skandhaTagColor(node.skandha);
  return (
    <div
      className="gl-surface-twilight-glass p-6 flex flex-col h-full"
      style={{
        borderRadius: "12px",
        animation: reducedMotion ? undefined : "fadeIn 280ms ease",
      }}
    >
      <button
        type="button"
        onClick={onBack}
        className="gl-focus-ring gl-clickable flex items-center gap-2 mb-4"
        aria-label="Back to sub-branch list"
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: "4px 0",
          color: INDIGO,
          fontSize: "13px",
          fontWeight: 600,
          fontFamily: "var(--font-sans), system-ui, sans-serif",
        }}
      >
        <ArrowLeft size={14} />
        Back
      </button>

      <div className="flex items-center gap-3 mb-3">
        <span
          lang="sa"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            fontFamily: "var(--font-devanagari), serif",
            fontSize: "18px",
            fontWeight: 500,
            color: node.nodeColorDeep,
            background: `${node.nodeColor}20`,
          }}
        >
          {node.devanagari.charAt(0)}
        </span>
        <div>
          <p
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "22px",
              fontWeight: 500,
              color: INK_ON_CREAM_PRIMARY,
              lineHeight: 1.3,
            }}
          >
            {node.iast}{" "}
            <span
              lang="sa"
              style={{
                fontFamily: "var(--font-devanagari), serif",
                fontSize: "16px",
                color: INK_ON_CREAM_MUTED,
              }}
            >
              {node.devanagari}
            </span>
          </p>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              padding: "2px 8px",
              borderRadius: "999px",
              background: tag.bg,
              color: tag.text,
              fontFamily: "var(--font-sans), system-ui, sans-serif",
            }}
          >
            {node.skandha} skandha
          </span>
        </div>
      </div>

      <p
        style={{
          fontFamily: "var(--font-sans), system-ui, sans-serif",
          fontSize: "15px",
          color: INK_ON_CREAM_SECONDARY,
          lineHeight: 1.6,
          marginBottom: "16px",
        }}
      >
        {node.coverage}
      </p>

      <div className="space-y-4 overflow-auto" style={{ flex: 1 }}>
        <DetailSection icon={<Layers size={14} />} title="Operational scope">
          <ul style={{ listStyle: "disc", paddingLeft: "18px", margin: 0 }}>
            {node.operationalScope.map((item, i) => (
              <li
                key={i}
                style={{
                  fontFamily: "var(--font-sans), system-ui, sans-serif",
                  fontSize: "14px",
                  color: INK_ON_CREAM_SECONDARY,
                  lineHeight: 1.55,
                  marginBottom: "4px",
                }}
              >
                {item}
              </li>
            ))}
          </ul>
        </DetailSection>

        <DetailSection icon={<BookOpen size={14} />} title="Foundational texts">
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
            {node.foundationalTexts.map((text, i) => (
              <li
                key={i}
                style={{
                  padding: "8px 10px",
                  borderRadius: "6px",
                  background: "rgba(255,255,255,0.04)",
                  borderLeft: `2px solid ${GOLD}`,
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontSize: "15px",
                    fontWeight: 500,
                    color: INK_ON_CREAM_PRIMARY,
                    lineHeight: 1.4,
                  }}
                >
                  {text.title}
                </p>
                {text.author && (
                  <p
                    style={{
                      fontFamily: "var(--font-sans), system-ui, sans-serif",
                      fontSize: "12px",
                      color: INK_ON_CREAM_MUTED,
                      lineHeight: 1.4,
                    }}
                  >
                    {text.author}
                  </p>
                )}
                {text.note && (
                  <p
                    style={{
                      fontFamily: "var(--font-sans), system-ui, sans-serif",
                      fontSize: "12px",
                      color: INK_ON_CREAM_SECONDARY,
                      lineHeight: 1.4,
                      marginTop: "2px",
                    }}
                  >
                    {text.note}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </DetailSection>

        <DetailSection icon={<MapPin size={14} />} title="Curriculum modules">
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "4px" }}>
            {node.curriculumModules.map((mod, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontFamily: "var(--font-sans), system-ui, sans-serif",
                  fontSize: "13px",
                  color: INK_ON_CREAM_SECONDARY,
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: GOLD,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    minWidth: "60px",
                  }}
                >
                  {mod.code}
                </span>
                <span>{mod.name}</span>
                <span
                  style={{
                    fontSize: "11px",
                    color: INK_ON_CREAM_MUTED,
                    marginLeft: "auto",
                  }}
                >
                  {mod.tier}
                </span>
              </li>
            ))}
          </ul>
        </DetailSection>

        <DetailSection icon={<Layers size={14} />} title="Per-stream emphasis">
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
            {node.streamEmphasis.map((se, i) => (
              <li
                key={i}
                style={{
                  padding: "8px 10px",
                  borderRadius: "6px",
                  background: "rgba(255,255,255,0.04)",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: INK_ON_CREAM_PRIMARY,
                    marginBottom: "2px",
                  }}
                >
                  {se.stream}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                    fontSize: "13px",
                    color: INK_ON_CREAM_SECONDARY,
                    lineHeight: 1.45,
                  }}
                >
                  {se.emphasis}
                </p>
              </li>
            ))}
          </ul>
        </DetailSection>
      </div>
    </div>
  );
}

function DetailSection({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p
        className="uppercase flex items-center gap-2 mb-2"
        style={{
          color: GOLD,
          letterSpacing: "0.12em",
          fontWeight: 700,
          fontSize: "11px",
          fontFamily: "var(--font-sans), system-ui, sans-serif",
        }}
      >
        {icon}
        {title}
      </p>
      {children}
    </div>
  );
}
