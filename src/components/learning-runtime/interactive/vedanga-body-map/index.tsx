/**
 * Vedāṅga Body Map — Phase C-Reformed final integration of the generated
 * illustration. The figure (saffron upavīta, six baked-in Vedāṅga glyphs) is
 * the visual; invisible absolute-positioned hit regions overlay each glyph at
 * its percent-of-image coordinates. Active state lights a warm halo behind
 * the tapped glyph; Jyotiṣa's third-eye carries an additional ceremonial
 * vedasya cakṣuḥ flourish in the side panel.
 */

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Devanagari, IAST } from "../../chrome/typography";
import { VEDANGAS, type VedangaEntry } from "./data";

export function VedangaBodyMap() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const active = activeIdx !== null ? VEDANGAS[activeIdx] : null;

  const handleKey = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActiveIdx(idx);
    } else if (e.key === "Escape") {
      setActiveIdx(null);
    } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      setActiveIdx((idx + 1) % VEDANGAS.length);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      setActiveIdx((idx - 1 + VEDANGAS.length) % VEDANGAS.length);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-6 items-stretch">
      {/* Vedic scholar illustration with invisible interactive overlays */}
      <div
        className="gl-surface-twilight-glass p-6 flex flex-col items-center"
        style={{ minHeight: "560px" }}
      >
        <p
          className="text-xs uppercase mb-4"
          style={{
            color: "#9C7A2F",
            letterSpacing: "0.16em",
            fontWeight: 700,
          }}
        >
          The Vedic Body
        </p>

        <figure
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "440px",
            aspectRatio: "1024 / 1536",
            margin: "0 auto",
          }}
        >
          <Image
            src="/assets/learning/vedic-body-composite.png"
            alt="A Vedic scholar in saffron upavīta with the six Vedāṅga glyphs marked at their classical body-part metaphor positions: nose (Śikṣā), hand (Kalpa), mouth (Vyākaraṇa), ear (Nirukta), foot (Chandas), and third-eye (Jyotiṣa)."
            fill
            priority
            sizes="(max-width: 768px) 100vw, 440px"
            style={{
              objectFit: "contain",
              userSelect: "none",
            }}
          />

          {/* Six invisible hit regions overlaid on the baked-in glyphs */}
          {VEDANGAS.map((v, idx) => {
            const isActive = activeIdx === idx;
            const isJyotisha = v.slug === "jyotisha";
            return (
              <button
                key={v.slug}
                onClick={() => setActiveIdx(idx)}
                onKeyDown={(e) => handleKey(e, idx)}
                aria-label={`${v.iast} — ${v.bodyPart}. Activate to reveal its Vedāṅga function and classical citation.`}
                aria-pressed={isActive}
                className="gl-focus-ring"
                style={{
                  position: "absolute",
                  left: `${v.position.x}%`,
                  top: `${v.position.y}%`,
                  transform: "translate(-50%, -50%)",
                  width: isJyotisha ? "13%" : "10.5%",
                  aspectRatio: "1 / 1",
                  borderRadius: "50%",
                  background: "transparent",
                  border: "none",
                  // Active = soft warm halo BEHIND the baked-in glyph, no hard ring.
                  boxShadow: isActive
                    ? `0 0 50px 20px ${isJyotisha ? "rgba(244, 199, 123, 0.65)" : "rgba(244, 199, 123, 0.50)"}, 0 0 100px 40px rgba(232, 168, 92, 0.28)`
                    : "none",
                  cursor: "pointer",
                  transition: reducedMotion ? "none" : "box-shadow 320ms cubic-bezier(0.65, 0, 0.35, 1)",
                  zIndex: 2,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.boxShadow =
                      "0 0 28px 10px rgba(244, 199, 123, 0.28)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
                onFocus={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(156, 122, 47, 0.30), 0 0 28px 10px rgba(244, 199, 123, 0.28)";
                  }
                }}
                onBlur={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
              />
            );
          })}

          {/* Active glow — soft warm pulse BEHIND the painted glyph (no hard ring). */}
          {active && !reducedMotion && (
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                left: `${active.position.x}%`,
                top: `${active.position.y}%`,
                transform: "translate(-50%, -50%)",
                width: active.slug === "jyotisha" ? "20%" : "16%",
                aspectRatio: "1 / 1",
                borderRadius: "50%",
                background: `radial-gradient(circle, ${active.slug === "jyotisha" ? "rgba(244, 199, 123, 0.55)" : "rgba(244, 199, 123, 0.42)"} 0%, rgba(232, 168, 92, 0.18) 45%, transparent 75%)`,
                pointerEvents: "none",
                animation: "gl-bodymap-breathe 2.4s ease-in-out infinite",
                zIndex: 1,
                filter: "blur(6px)",
              }}
            />
          )}
        </figure>

        <style>{`
          @keyframes gl-bodymap-breathe {
            0%, 100% { opacity: 0.55; transform: translate(-50%, -50%) scale(0.92); }
            50%      { opacity: 0.85; transform: translate(-50%, -50%) scale(1.08); }
          }
        `}</style>

        <p
          className="text-center italic mt-4"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            color: "var(--gl-ink-secondary)",
            maxWidth: "340px",
            fontSize: "15px",
            lineHeight: 1.5,
          }}
        >
          Tap any of the six luminous body-parts to read its Vedāṅga.
        </p>
      </div>

      {/* Side panel — active or guidance */}
      <aside
        className="gl-surface-twilight-glass p-6 flex flex-col"
        aria-live="polite"
        style={{ minHeight: "560px" }}
      >
        {active ? <ActiveDetail entry={active} /> : <GuidancePanel />}
      </aside>
    </div>
  );
}

function GuidancePanel() {
  return (
    <div className="flex flex-col gap-4 h-full">
      <p
        className="text-xs uppercase"
        style={{
          color: "#9C7A2F",
          letterSpacing: "0.16em",
          fontWeight: 700,
        }}
      >
        Six limbs, one body
      </p>
      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "20px",
          lineHeight: 1.4,
          color: "var(--gl-ink-primary)",
        }}
      >
        Each Vedāṅga embodies a part of the Vedic body — and a function of Vedic study.
      </p>
      <div
        style={{
          padding: "14px 16px",
          background: "rgba(232, 199, 114, 0.12)",
          borderLeft: "3px solid #A23A1E",
          borderRadius: "0 8px 8px 0",
        }}
      >
        <p
          className="text-xs uppercase mb-1"
          style={{
            color: "#A23A1E",
            letterSpacing: "0.12em",
            fontWeight: 600,
          }}
        >
          Try this
        </p>
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontStyle: "italic",
            fontSize: "16px",
            color: "var(--gl-ink-primary)",
            lineHeight: 1.55,
          }}
        >
          Tap the figure&apos;s{" "}
          <strong style={{ fontStyle: "normal", color: "#A23A1E", fontWeight: 600 }}>third-eye</strong>{" "}
          first. That is Jyotiṣa — <em>vedasya cakṣuḥ</em>, the eye of the Veda. It carries a bonus reveal.
        </p>
      </div>

      {/* Idle-state schema preview — fills the otherwise-empty middle space
          with a quiet preview of what each tap will reveal. Once a body-part
          is tapped, ActiveDetail replaces the whole GuidancePanel, so this
          previews — never competes with — the active state. The marginTop +
          marginBottom auto pair centers it vertically in whatever void is
          left between TRY THIS and the legend at the bottom. */}
      <div
        aria-hidden="true"
        style={{
          marginTop: "auto",
          marginBottom: "auto",
          padding: "16px 18px",
          border: "1px dashed rgba(156, 122, 47, 0.32)",
          borderRadius: "10px",
          background: "rgba(255, 252, 240, 0.45)",
        }}
      >
        <p
          className="uppercase"
          style={{
            fontSize: "12px",
            color: "var(--gl-ink-secondary)",
            letterSpacing: "0.18em",
            fontWeight: 700,
            marginBottom: "12px",
            textAlign: "center",
          }}
        >
          Each tap reveals
        </p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
          {[
            ["देवनागरी", "the Vedāṅga's name in script"],
            ["IAST", "the romanised transliteration"],
            ["function", "what it studies of the Veda"],
            ["citation", "the foundational classical text"],
          ].map(([label, gloss]) => (
            <li
              key={label}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(80px, 88px) 1fr",
                gap: "10px",
                fontSize: "15px",
                lineHeight: 1.45,
                alignItems: "baseline",
              }}
            >
              <span
                style={{
                  fontFamily: label === "देवनागरी" ? "var(--font-devanagari), serif" : "var(--font-cormorant), serif",
                  fontStyle: label === "देवनागरी" ? "normal" : "italic",
                  fontSize: label === "देवनागरी" ? "15px" : "14px",
                  color: "var(--gl-ink-secondary)",
                  textAlign: "right",
                }}
              >
                {label}
              </span>
              <span style={{ color: "var(--gl-ink-secondary)" }}>{gloss}</span>
            </li>
          ))}
        </ul>
      </div>

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {[
          ["Third-eye", "Jyotiṣa", "celestial time"],
          ["Nose", "Śikṣā", "phonetics"],
          ["Mouth", "Vyākaraṇa", "grammar"],
          ["Ear", "Nirukta", "etymology"],
          ["Hand", "Kalpa", "ritual"],
          ["Foot", "Chandas", "prosody"],
        ].map(([part, name, func], i) => (
          <li
            key={i}
            style={{
              fontSize: "15px",
              color: "var(--gl-ink-secondary)",
              padding: "6px 0",
              borderBottom: i < 5 ? "1px solid rgba(156, 122, 47, 0.18)" : "none",
              display: "grid",
              gridTemplateColumns: "64px 1fr 1fr",
              gap: "8px",
              alignItems: "baseline",
            }}
          >
            <span
              style={{
                color: "var(--gl-ink-muted)",
                fontFamily: "var(--font-cormorant), serif",
                fontStyle: "italic",
              }}
            >
              {part}
            </span>
            <span style={{ fontWeight: 600, color: "var(--gl-ink-primary)" }}>{name}</span>
            <span
              style={{
                color: "var(--gl-ink-muted)",
                fontFamily: "var(--font-cormorant), serif",
                fontStyle: "italic",
              }}
            >
              {func}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ActiveDetail({ entry }: { entry: VedangaEntry }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #F4C77B 0%, #E8A85C 100%)",
            color: "#1A1408",
            fontFamily: "var(--font-cormorant), serif",
            fontWeight: 600,
            fontSize: "16px",
            boxShadow: "0 2px 8px rgba(232, 168, 92, 0.35)",
          }}
        >
          {entry.number}
        </span>
        <span
          className="text-xs uppercase"
          style={{
            color: "#A23A1E",
            letterSpacing: "0.14em",
            fontWeight: 700,
          }}
        >
          Limb {entry.number} of 6
        </span>
      </div>
      <Devanagari size="md" asElement="p" surface="dark">
        {entry.devanagari}
      </Devanagari>
      <IAST size="lg" asElement="p" surface="dark" style={{ color: "var(--gl-ink-secondary)" }}>
        {entry.iast}
      </IAST>
      <p
        className="text-sm"
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontStyle: "italic",
          color: "#A23A1E",
          fontWeight: 500,
        }}
      >
        {entry.bodyPart}
      </p>
      <p
        style={{
          fontFamily: "var(--font-sans), system-ui, sans-serif",
          fontSize: "16px",
          lineHeight: 1.65,
          color: "var(--gl-ink-primary)",
        }}
      >
        {entry.function}
      </p>
      <div
        style={{
          marginTop: "auto",
          paddingTop: "14px",
          borderTop: "1px solid rgba(156, 122, 47, 0.25)",
        }}
      >
        <p
          className="text-xs uppercase mb-1"
          style={{ color: "var(--gl-ink-muted)", letterSpacing: "0.12em", fontWeight: 600 }}
        >
          Classical anchor
        </p>
        <p
          className="text-xs italic"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            color: "var(--gl-ink-secondary)",
            lineHeight: 1.55,
          }}
        >
          {entry.citation}
        </p>
      </div>
      {entry.bonus && (
        <div
          className="mt-2 text-center p-4 rounded-lg"
          style={{
            background: "linear-gradient(135deg, rgba(244, 199, 123, 0.22) 0%, rgba(232, 168, 92, 0.14) 100%)",
            border: "1px solid rgba(156, 122, 47, 0.35)",
            boxShadow: "0 1px 0 rgba(255,255,255,0.55) inset, 0 4px 14px rgba(232, 168, 92, 0.18)",
          }}
        >
          <p
            lang="sa-Latn"
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontStyle: "italic",
              fontSize: "22px",
              color: "#A23A1E",
              fontWeight: 600,
              marginBottom: "3px",
            }}
          >
            vedasya cakṣuḥ
          </p>
          <p
            className="text-xs"
            style={{
              color: "var(--gl-ink-muted)",
              fontFamily: "var(--font-cormorant), serif",
              fontStyle: "italic",
            }}
          >
            the eye of the Veda
          </p>
        </div>
      )}
    </div>
  );
}
