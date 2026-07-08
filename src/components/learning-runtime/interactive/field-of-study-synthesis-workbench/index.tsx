"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  BookOpen,
  Calculator,
  Compass,
  GraduationCap,
  MapPinned,
  Palette,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Swords,
  Target,
  Timer,
} from "lucide-react";
import { grahas, ink } from "@/design-tokens/grahvani-learning/colors";
import { fontFamilies } from "@/design-tokens/grahvani-learning/typography";

const HAIRLINE = "var(--gl-gold-hairline, rgba(232, 199, 114, 0.22))";
const SURFACE = "var(--gl-card-surface-solid, #FFF9F0)";
const SURFACE_2 = "var(--gl-surface-2, #F5EDD8)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #1A1408)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #5A4E2E)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #8A7E5E)";
const GOLD = ink.goldAccent;
const GREEN = grahas.budha.primary;
const SAFFRON = grahas.guru.primary;
const BLUE = grahas.shukra.primary;
const CORAL = grahas.mangala.primary;
const MAROON = grahas.ketu.primary;

type TabKey = "threads" | "venus" | "timing" | "reading";

const TABS: { key: TabKey; label: string }[] = [
  { key: "threads", label: "Five threads" },
  { key: "venus", label: "Venus link" },
  { key: "timing", label: "Timing overlay" },
  { key: "reading", label: "Client reading" },
];

const THREADS = [
  {
    key: "mercury",
    label: "Mercury",
    subtitle: "analytical / verbal capacity",
    color: GREEN,
    icon: <Calculator size={16} />,
    base: "strong analytical and verbal capacity",
    complication: "this capacity may express with more friction in rigid, formal academic structures than in flexible settings",
    hasComplication: true,
  },
  {
    key: "jupiter",
    label: "Jupiter",
    subtitle: "meaning / principle / pedagogy",
    color: SAFFRON,
    icon: <BookOpen size={16} />,
    base: "a real pull toward meaning, principle, and teaching",
  },
  {
    key: "venus",
    label: "Venus",
    subtitle: "aesthetic / creative sensibility",
    color: BLUE,
    icon: <Palette size={16} />,
    base: "an aesthetic and creative sensibility",
  },
  {
    key: "mars",
    label: "Mars",
    subtitle: "competitive / decisive edge",
    color: CORAL,
    icon: <Swords size={16} />,
    base: "a sharp, competitive, decisive edge",
  },
  {
    key: "ketu",
    label: "Ketu",
    subtitle: "unconventional / self-directed path",
    color: MAROON,
    icon: <Compass size={16} />,
    base: "a genuine inclination toward unconventional, self-directed, or research-oriented paths rather than closely-mentored ones",
  },
];

function wash(color: string, alphaHex = "14") {
  return color.startsWith("#") ? `${color}${alphaHex}` : color;
}

export function FieldOfStudySynthesisWorkbench() {
  const [tab, setTab] = useState<TabKey>("threads");

  function reset() {
    setTab("threads");
  }

  return (
    <div
      data-interactive="field-of-study-synthesis-workbench"
      className="w-full min-w-0"
      style={{
        background: SURFACE,
        border: `1px solid ${HAIRLINE}`,
        borderRadius: 16,
        padding: 20,
        color: INK_PRIMARY,
        boxSizing: "border-box",
        overflow: "hidden",
        fontFamily: fontFamilies.body,
      }}
    >
      <header className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="m-0 text-xs uppercase" style={{ color: GOLD, letterSpacing: "0.08em", fontWeight: 600 }}>
            Worked synthesis
          </p>
          <h2
            className="mt-1 text-xl sm:text-2xl"
            style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
          >
            The field-of-study question
          </h2>
          <p className="mt-1 max-w-3xl text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            Assemble every chapter&apos;s findings into one client-ready tendency reading. Add the D24 complication and
            the Ketu thread, trace Venus&apos;s structural link, and overlay the two timing windows.
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 self-start rounded-lg px-3 py-2 text-sm"
          style={{ background: SURFACE, border: `1px solid ${HAIRLINE}`, color: INK_SECONDARY, fontWeight: 500 }}
        >
          <RotateCcw size={15} aria-hidden="true" />
          Restart
        </button>
      </header>

      <nav className="mb-5 flex flex-wrap gap-2" aria-label="Field-of-study synthesis sections">
        {TABS.map((t) => (
          <TabButton key={t.key} active={tab === t.key} onClick={() => setTab(t.key)}>
            {t.label}
          </TabButton>
        ))}
      </nav>

      {tab === "threads" && <ThreadsTab />}
      {tab === "venus" && <VenusTab />}
      {tab === "timing" && <TimingTab />}
      {tab === "reading" && <ReadingTab />}
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className="rounded-lg px-3 py-2 text-sm"
      style={{
        border: `1px solid ${active ? GOLD : HAIRLINE}`,
        background: active ? GOLD : "transparent",
        color: active ? "#1A1408" : INK_SECONDARY,
        fontWeight: 500,
      }}
    >
      {children}
    </button>
  );
}

function ThreadsTab() {
  const [mercuryD24, setMercuryD24] = useState(true);
  const [ketuThread, setKetuThread] = useState(true);

  const synthesis = useMemo(() => {
    const parts: string[] = [];
    parts.push(mercuryD24
      ? "strong analytical and verbal capacity (though this may express with more friction in rigid, formal academic structures than in flexible settings)"
      : "strong analytical and verbal capacity");
    parts.push("a real pull toward meaning, principle, and teaching");
    parts.push("an aesthetic and creative sensibility");
    parts.push("a sharp, competitive, decisive edge");
    if (ketuThread) {
      parts.push("a genuine inclination toward unconventional, self-directed, or research-oriented paths rather than closely-mentored ones");
    }
    return `Five genuine aptitude threads: ${parts.join("; ")}. This is a multi-threaded tendency profile, not a single named profession.`;
  }, [mercuryD24, ketuThread]);

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.1-4.2</p>
        <h3
          className="mt-1 text-lg"
          style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
        >
          Five aptitude threads
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Chart E1&apos;s four Chapter 3 threads are extended by two later findings: the D24 complication on Mercury and
          Ketu&apos;s unconventional-path shape on the 9th house.
        </p>

        <div className="mt-4 space-y-3">
          {THREADS.map((t) => {
            const isMercury = t.key === "mercury";
            const isKetu = t.key === "ketu";
            return (
              <div key={t.key} className="rounded-lg p-3" style={{ background: wash(t.color, "10"), border: `1px solid ${wash(t.color, "55")}` }}>
                <div className="flex items-center gap-2" style={{ color: t.color }}>
                  {t.icon}
                  <span className="text-sm" style={{ fontWeight: 600 }}>{t.label}</span>
                  <span className="text-xs" style={{ color: INK_MUTED }}>— {t.subtitle}</span>
                </div>
                <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
                  {isMercury && mercuryD24
                    ? "D1: exalted, angular, uncombust — strong analytical/verbal thread. D24: shifts to Cancer (enemy sign), so formal structured settings may feel harder than flexible ones."
                    : isMercury
                    ? "D1: exalted, angular, uncombust — strong analytical/verbal thread."
                    : t.key === "jupiter"
                    ? "Own-signed, kendra, aspecting Lagna — genuine meaning/dharmic/pedagogical pull."
                    : t.key === "venus"
                    ? "Own-signed in the 2nd, Sarasvatī-yoga co-former — aesthetic/creative sensibility."
                    : t.key === "mars"
                    ? "Exalted in the 5th — sharp, competitive, decisive edge."
                    : "9th-house occupant; KP level-2 significator of the 9th cusp — unconventional, self-directed higher-learning path."}
                </p>
                {isMercury && (
                  <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm" style={{ color: INK_SECONDARY }}>
                    <input
                      type="checkbox"
                      checked={mercuryD24}
                      onChange={(e) => setMercuryD24(e.target.checked)}
                      className="h-4 w-4 rounded border"
                      style={{ accentColor: t.color }}
                    />
                    Include D24 complication
                  </label>
                )}
                {isKetu && (
                  <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm" style={{ color: INK_SECONDARY }}>
                    <input
                      type="checkbox"
                      checked={ketuThread}
                      onChange={(e) => setKetuThread(e.target.checked)}
                      className="h-4 w-4 rounded border"
                      style={{ accentColor: t.color }}
                    />
                    Include as fifth thread
                  </label>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <Sparkles size={18} style={{ color: GOLD }} aria-hidden="true" />
          <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 600 }}>Live synthesis</p>
        </div>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.65 }}>
          {synthesis}
        </p>
        <ThreadsSvg mercuryD24={mercuryD24} ketuThread={ketuThread} />
      </aside>
    </div>
  );
}

function VenusTab() {
  const [showLink, setShowLink] = useState(true);

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.3</p>
        <h3
          className="mt-1 text-lg"
          style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
        >
          Venus bridges two threads
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          The same planet that Chapter 3 identified as the aesthetic/creative thread is also, independently, the KP
          anchor of the 9th-house higher-learning promise. This suggests the two capacities may converge rather than run
          in parallel.
        </p>

        <div className="mt-4 rounded-lg p-3" style={{ background: wash(BLUE, "10"), border: `1px solid ${wash(BLUE, "55")}` }}>
          <div className="flex items-center gap-2">
            <Target size={18} style={{ color: BLUE }} aria-hidden="true" />
            <p className="m-0 text-sm" style={{ color: BLUE, fontWeight: 600 }}>Structural-link observation</p>
          </div>
          <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            Venus is cuspal sub-lord of both the 5th and 9th houses and a significator of all three education houses. In
            the same chart, Venus co-forms the Sarasvatī yoga. The aesthetic thread and the higher-learning thread are
            therefore not accidental neighbours — they are anchored in the same planet.
          </p>
          <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm" style={{ color: INK_SECONDARY }}>
            <input
              type="checkbox"
              checked={showLink}
              onChange={(e) => setShowLink(e.target.checked)}
              className="h-4 w-4 rounded border"
              style={{ accentColor: BLUE }}
            />
            Show structural link on the diagram
          </label>
        </div>

        <div className="mt-3 rounded-lg p-3" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
            This is a genuine, KP-corroborated observation, not a certainty. It invites the practitioner to look for
            fields where creativity and higher study can coexist — design, research-oriented arts, creative scholarship,
            etc. — without forcing a single named profession.
          </p>
        </div>
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <VenusLinkSvg showLink={showLink} />
      </aside>
    </div>
  );
}

function TimingTab() {
  const [showEarly, setShowEarly] = useState(true);
  const [showDecision, setShowDecision] = useState(true);

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§4.4</p>
        <h3
          className="mt-1 text-lg"
          style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
        >
          Timing windows
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          Two windows serve different purposes. The early window is where a signal may first become visible; the current
          Venus mahādaśā is where a real field-of-study choice is made and pursued.
        </p>

        <div className="mt-4 space-y-3">
          <div className="rounded-lg p-3" style={{ background: wash(MAROON, "10"), border: `1px solid ${wash(MAROON, "55")}` }}>
            <div className="flex items-center gap-2">
              <Timer size={18} style={{ color: MAROON }} aria-hidden="true" />
              <p className="m-0 text-sm" style={{ color: MAROON, fontWeight: 600 }}>Early-signal window</p>
            </div>
            <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              Age 9.97-11.14 — Ketu mahādaśā, Venus antardaśā. Clean two-yes convergence on the 9th house. A parent or
              teacher might notice the unconventional, self-directed learning inclination here, but a ten-year-old is not
              choosing a field of study.
            </p>
            <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm" style={{ color: INK_SECONDARY }}>
              <input
                type="checkbox"
                checked={showEarly}
                onChange={(e) => setShowEarly(e.target.checked)}
                className="h-4 w-4 rounded border"
                style={{ accentColor: MAROON }}
              />
              Show on timeline
            </label>
          </div>

          <div className="rounded-lg p-3" style={{ background: wash(BLUE, "10"), border: `1px solid ${wash(BLUE, "55")}` }}>
            <div className="flex items-center gap-2">
              <GraduationCap size={18} style={{ color: BLUE }} aria-hidden="true" />
              <p className="m-0 text-sm" style={{ color: BLUE, fontWeight: 600 }}>Decision-relevant window</p>
            </div>
            <p className="m-0 mt-1 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
              Venus mahādaśā, age 16.5625-36.5625. Covers university admissions and the years in which a real field
              choice gets made and pursued. Carried by the same planet that structurally links the aesthetic and
              higher-learning threads.
            </p>
            <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm" style={{ color: INK_SECONDARY }}>
              <input
                type="checkbox"
                checked={showDecision}
                onChange={(e) => setShowDecision(e.target.checked)}
                className="h-4 w-4 rounded border"
                style={{ accentColor: BLUE }}
              />
              Show on timeline
            </label>
          </div>
        </div>
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <TimingSvg showEarly={showEarly} showDecision={showDecision} />
      </aside>
    </div>
  );
}

function ReadingTab() {
  const [notes, setNotes] = useState("");

  const lower = notes.toLowerCase();
  const hasDeterministic = lower.includes("will ") || lower.includes("definitely") || lower.includes("should avoid") || lower.includes("must not");

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
      <section className="min-w-0 rounded-xl p-4" style={{ background: SURFACE, border: `1px solid ${HAIRLINE}` }}>
        <p className="m-0 text-xs uppercase" style={{ color: INK_MUTED, fontWeight: 600 }}>§6 Example 1</p>
        <h3
          className="mt-1 text-lg"
          style={{ color: INK_PRIMARY, fontFamily: fontFamilies.literarySerif, fontWeight: 600 }}
        >
          Client-ready field-of-study reading
        </h3>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.6 }}>
          The complete reading uses every thread, the Venus structural link, and the timing window — all framed as
          tendencies and illustrative categories, never a named-profession verdict.
        </p>

        <div className="mt-4 rounded-lg p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
          <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.7 }}>
            “Your chart shows five genuine, distinct aptitude threads: strong analytical and verbal capacity (though
            this may express with more friction in rigid, formal academic structures than in flexible settings); a real
            pull toward meaning, principle, and teaching; an aesthetic and creative sensibility; a sharp, competitive
            edge; and a genuine inclination toward unconventional, self-directed, or research-oriented paths rather than
            closely-conventional ones, especially in higher learning. Two of these threads — the aesthetic/creative and
            the higher-learning orientation — are tied together more closely than they might first appear, both anchored
            in the same planet, Venus, which is also the planetary period now running through your late teens and
            twenties, the very years in which a real field choice gets made and pursued. This combination could suit a
            considerable range of fields that let analytical rigor, meaning-orientation, aesthetic sensibility,
            competitive drive, and an unconventional approach coexist — for instance, design or creative fields with a
            strong technical or research component, principled/pedagogical work with a creative or unconventional
            delivery, or applied research fields that reward both rigor and an independent, non-standard approach —
            offered as illustrative categories the chart&apos;s threads plausibly support, not as a closed list or a
            verdict.”
          </p>
        </div>

        <label className="mt-4 block text-sm" style={{ color: INK_SECONDARY }}>
          Draft your own closing framing (practise non-deterministic language)
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 w-full rounded-lg p-3 text-sm"
            style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}`, color: INK_PRIMARY, minHeight: 96 }}
            placeholder="Write a tendency-framed closing sentence..."
          />
        </label>

        {hasDeterministic && (
          <div className="mt-3 rounded-lg p-3" style={{ background: "rgba(200, 65, 46, 0.08)", border: `1px solid rgba(200, 65, 46, 0.35)` }}>
            <div className="flex items-start gap-2">
              <ShieldAlert size={18} style={{ color: CORAL, flexShrink: 0 }} aria-hidden="true" />
              <p className="m-0 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
                Deterministic wording detected. Replace “will / definitely / should avoid” with capacity-based tendency
                language and a routing note where appropriate.
              </p>
            </div>
          </div>
        )}
      </section>

      <aside className="min-w-0 rounded-xl p-4" style={{ background: SURFACE_2, border: `1px solid ${HAIRLINE}` }}>
        <div className="flex items-center gap-2">
          <MapPinned size={18} style={{ color: GREEN }} aria-hidden="true" />
          <p className="m-0 text-sm" style={{ color: GREEN, fontWeight: 600 }}>Routing note</p>
        </div>
        <p className="m-0 mt-2 text-sm" style={{ color: INK_SECONDARY, lineHeight: 1.55 }}>
          For specific programme, college, or career-pathway decisions, route to a qualified career counsellor or
          educational advisor. The chart supports capacities and timing windows; it does not replace professional
          counselling.
        </p>

        <div className="mt-4 rounded-lg p-3" style={{ background: wash(GOLD, "10"), border: `1px solid ${wash(GOLD, "55")}` }}>
          <p className="m-0 text-sm" style={{ color: GOLD, fontWeight: 600 }}>Checklist for an honest reading</p>
          <ul className="m-0 mt-2 list-disc space-y-1 pl-5 text-sm" style={{ color: INK_SECONDARY }}>
            <li>All five threads named explicitly.</li>
            <li>D24 complication on Mercury is held alongside strength, not used to erase it.</li>
            <li>Venus structural link is offered as convergence possibility, not certainty.</li>
            <li>Two timing windows are distinguished by purpose, not treated as deadlines.</li>
            <li>Final answer is tendency-framed with illustrative categories.</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}

function ThreadsSvg({ mercuryD24, ketuThread }: { mercuryD24: boolean; ketuThread: boolean }) {
  return (
    <svg viewBox="0 0 320 200" role="img" aria-label="Five aptitude threads around a central tendency" style={{ width: "100%", maxHeight: 220, margin: "1rem auto 0", display: "block" }}>
      <rect x="20" y="20" width="280" height="160" rx="8" fill={`${GOLD}0F`} stroke={HAIRLINE} />

      <circle cx="160" cy="100" r="20" fill={`${GOLD}22`} stroke={GOLD} strokeWidth="2" />
      <text x="160" y="105" textAnchor="middle" fill={GOLD} fontSize="10" fontWeight={600}>tendency</text>

      <circle cx="100" cy="55" r="16" fill={`${GREEN}18`} stroke={GREEN} strokeWidth="2" />
      <text x="100" y="59" textAnchor="middle" fill={GREEN} fontSize="8" fontWeight={600}>Mercury</text>
      {mercuryD24 && (
        <>
          <text x="100" y="48" textAnchor="middle" fill={INK_MUTED} fontSize="7" fontWeight={600}>D24 friction</text>
          <circle cx="118" cy="55" r="3" fill={GREEN} />
        </>
      )}

      <circle cx="220" cy="55" r="16" fill={`${SAFFRON}18`} stroke={SAFFRON} strokeWidth="2" />
      <text x="220" y="59" textAnchor="middle" fill={SAFFRON} fontSize="8" fontWeight={600}>Jupiter</text>

      <circle cx="70" cy="130" r="16" fill={`${BLUE}18`} stroke={BLUE} strokeWidth="2" />
      <text x="70" y="134" textAnchor="middle" fill={BLUE} fontSize="8" fontWeight={600}>Venus</text>

      <circle cx="250" cy="130" r="16" fill={`${CORAL}18`} stroke={CORAL} strokeWidth="2" />
      <text x="250" y="134" textAnchor="middle" fill={CORAL} fontSize="8" fontWeight={600}>Mars</text>

      <circle
        cx="160"
        cy="165"
        r="16"
        fill={ketuThread ? `${MAROON}18` : `${MAROON}08`}
        stroke={ketuThread ? MAROON : INK_MUTED}
        strokeWidth="2"
        strokeDasharray={ketuThread ? undefined : "4 2"}
      />
      <text x="160" y="169" textAnchor="middle" fill={ketuThread ? MAROON : INK_MUTED} fontSize="8" fontWeight={600}>Ketu</text>

      <path d="M 115 63 L 145 86" stroke={HAIRLINE} strokeWidth="1.5" />
      <path d="M 205 63 L 175 86" stroke={HAIRLINE} strokeWidth="1.5" />
      <path d="M 83 118 L 145 95" stroke={HAIRLINE} strokeWidth="1.5" />
      <path d="M 237 118 L 175 95" stroke={HAIRLINE} strokeWidth="1.5" />
      {ketuThread && <path d="M 160 118 L 160 149" stroke={HAIRLINE} strokeWidth="1.5" />}

      <text x="160" y="188" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight={600}>Threads combine into a range, not one profession</text>
    </svg>
  );
}

function VenusLinkSvg({ showLink }: { showLink: boolean }) {
  return (
    <svg viewBox="0 0 320 220" role="img" aria-label="Venus as the bridge between aesthetic and higher-learning threads" style={{ width: "100%", maxHeight: 240, margin: "0 auto", display: "block" }}>
      <rect x="20" y="20" width="280" height="180" rx="8" fill={`${GOLD}0F`} stroke={HAIRLINE} />

      <rect x="50" y="60" width="100" height="50" rx="8" fill={`${BLUE}18`} stroke={BLUE} strokeWidth="1.5" />
      <text x="100" y="82" textAnchor="middle" fill={BLUE} fontSize="10" fontWeight={600}>Aesthetic /</text>
      <text x="100" y="96" textAnchor="middle" fill={BLUE} fontSize="10" fontWeight={600}>creative thread</text>

      <rect x="170" y="60" width="100" height="50" rx="8" fill={`${SAFFRON}18`} stroke={SAFFRON} strokeWidth="1.5" />
      <text x="220" y="82" textAnchor="middle" fill={SAFFRON} fontSize="10" fontWeight={600}>Higher-learning /</text>
      <text x="220" y="96" textAnchor="middle" fill={SAFFRON} fontSize="10" fontWeight={600}>9th-house thread</text>

      <circle cx="160" cy="155" r="24" fill={`${BLUE}22`} stroke={BLUE} strokeWidth="2" />
      <text x="160" y="159" textAnchor="middle" fill={BLUE} fontSize="11" fontWeight={600}>Venus</text>

      {showLink && (
        <>
          <path d="M 110 110 L 150 138" stroke={BLUE} strokeWidth="2" />
          <path d="M 210 110 L 170 138" stroke={BLUE} strokeWidth="2" />
          <circle cx="150" cy="138" r="3" fill={BLUE} />
          <circle cx="170" cy="138" r="3" fill={BLUE} />
        </>
      )}

      <text x="160" y="196" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight={600}>
        {showLink ? "Same planet anchors both threads" : "Toggle the structural link above"}
      </text>
    </svg>
  );
}

function TimingSvg({ showEarly, showDecision }: { showEarly: boolean; showDecision: boolean }) {
  const startAge = 0;
  const endAge = 40;
  const barX = 40;
  const barY = 90;
  const barW = 240;
  const scale = barW / (endAge - startAge);

  function ageX(age: number) {
    return barX + (age - startAge) * scale;
  }

  const earlyStart = ageX(9.97);
  const earlyEnd = ageX(11.14);
  const decisionStart = ageX(16.5625);
  const decisionEnd = ageX(36.5625);

  return (
    <svg viewBox="0 0 320 200" role="img" aria-label="Two timing windows on a lifespan timeline" style={{ width: "100%", maxHeight: 220, margin: "0 auto", display: "block" }}>
      <rect x="20" y="20" width="280" height="160" rx="8" fill={`${GOLD}0F`} stroke={HAIRLINE} />

      <text x="160" y="42" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight={600}>Age timeline (years)</text>

      <line x1={barX} y1={barY} x2={barX + barW} y2={barY} stroke={HAIRLINE} strokeWidth="2" />
      {[0, 10, 20, 30, 40].map((age) => (
        <g key={age}>
          <line x1={ageX(age)} y1={barY - 4} x2={ageX(age)} y2={barY + 4} stroke={INK_MUTED} strokeWidth="1.5" />
          <text x={ageX(age)} y={barY + 18} textAnchor="middle" fill={INK_MUTED} fontSize="9" fontWeight={600}>{age}</text>
        </g>
      ))}

      {showEarly && (
        <g>
          <rect x={earlyStart} y={barY - 28} width={earlyEnd - earlyStart} height="18" rx="4" fill={`${MAROON}22`} stroke={MAROON} strokeWidth="1.5" />
          <text x={(earlyStart + earlyEnd) / 2} y={barY - 16} textAnchor="middle" fill={MAROON} fontSize="8" fontWeight={600}>early signal</text>
          <line x1={(earlyStart + earlyEnd) / 2} y1={barY - 10} x2={(earlyStart + earlyEnd) / 2} y2={barY - 4} stroke={MAROON} strokeWidth="1" />
        </g>
      )}

      {showDecision && (
        <g>
          <rect x={decisionStart} y={barY + 12} width={decisionEnd - decisionStart} height="18" rx="4" fill={`${BLUE}22`} stroke={BLUE} strokeWidth="1.5" />
          <text x={(decisionStart + decisionEnd) / 2} y={barY + 24} textAnchor="middle" fill={BLUE} fontSize="8" fontWeight={600}>decision-relevant Venus mahādaśā</text>
          <line x1={(decisionStart + decisionEnd) / 2} y1={barY + 12} x2={(decisionStart + decisionEnd) / 2} y2={barY + 6} stroke={BLUE} strokeWidth="1" />
        </g>
      )}

      <circle cx={ageX(18)} cy={barY} r="4" fill={GOLD} />
      <text x={ageX(18)} y={barY - 10} textAnchor="middle" fill={GOLD} fontSize="8" fontWeight={600}>now ~18</text>

      <text x="160" y="168" textAnchor="middle" fill={INK_MUTED} fontSize="11" fontWeight={600}>Signal window ≠ decision window</text>
    </svg>
  );
}
