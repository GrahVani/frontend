/**
 * Grahvani Learning — Design System Sanity Check
 *
 * A temporary page that visually proves the locked v0.2 design system renders:
 * — all four surfaces (Deep Night, Twilight Glass, Manuscript Cream, Dawn Accent)
 * — all nine graha hues with their classical attributions
 * — all three typefaces (Tiro Devanagari Hindi, Cormorant Garamond, Inter)
 *
 * Browse at: http://localhost:3000/learn/design-sanity
 *
 * This page exists only during Phase B1. It is removed once Lesson 1 ships
 * (the lesson itself becomes the standing proof).
 */

import { grahas, rashis } from "@/design-tokens/grahvani-learning";

export default function DesignSanityPage() {
  return (
    <div
      className="gl-surface-night min-h-screen px-6 py-12"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      <div className="mx-auto max-w-5xl space-y-12">
        {/* Page heading — Cormorant display */}
        <header className="text-center space-y-3">
          <h1
            className="text-5xl font-medium text-[var(--gl-gold-accent)]"
            style={{ fontFamily: "var(--font-cormorant)", letterSpacing: "0.01em" }}
          >
            Grahvani Learning · Design System
          </h1>
          <p
            className="text-lg italic text-[var(--gl-ink-secondary)]"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            v0.2 sanity check — scholarly · ceremonial · sidereal
          </p>
        </header>

        {/* §1 — Typography samples */}
        <section className="gl-surface-twilight-glass p-8 space-y-6">
          <h2
            className="text-2xl text-[var(--gl-gold-accent)]"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            §3 · Typography
          </h2>

          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-[var(--gl-ink-muted)] mb-2">
                Display · Tiro Devanagari Hindi
              </p>
              <p
                className="text-5xl text-[var(--gl-ink-primary)]"
                lang="sa"
                style={{ fontFamily: "var(--font-devanagari)", lineHeight: 1.45 }}
              >
                ज्योतिषं वेदस्य चक्षुः
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-[var(--gl-ink-muted)] mb-2">
                Literary serif · Cormorant Garamond italic (Sanskrit terms in body)
              </p>
              <p
                className="text-xl italic text-[var(--gl-ink-primary)]"
                lang="sa-Latn"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                jyotiṣaṁ vedasya cakṣuḥ
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-[var(--gl-ink-muted)] mb-2">
                Body sans · Inter at 18px / 1.65 line-height
              </p>
              <p className="text-lg text-[var(--gl-ink-primary)]" style={{ lineHeight: 1.65 }}>
                Jyotiṣa is one of the six <em style={{ fontFamily: "var(--font-cormorant)" }}>Vedāṅgas</em> —
                limbs of the Veda. Each Vedāṅga corresponds to a body part of the Vedic body, and Jyotiṣa
                is the eye (<em style={{ fontFamily: "var(--font-cormorant)" }}>cakṣuḥ</em>). The body
                metaphor is symbolic, not anatomical — a memory palace, not a literal anatomy.
              </p>
            </div>
          </div>
        </section>

        {/* §2 — Manuscript Cream surface with a śloka */}
        <section className="space-y-3">
          <h2
            className="text-2xl text-[var(--gl-gold-accent)] px-2"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            §5 · Manuscript Cream — Classical Authority surface
          </h2>
          <div className="gl-surface-manuscript max-w-2xl">
            <p className="text-xs uppercase tracking-wider mb-3" style={{ color: "var(--gl-ink-on-cream-muted)" }}>
              Pāṇinīya Śikṣā 41–42 (sample)
            </p>
            <p
              className="text-3xl mb-3"
              lang="sa"
              style={{
                fontFamily: "var(--font-devanagari)",
                color: "var(--gl-ink-on-cream-primary)",
                lineHeight: 1.5,
              }}
            >
              छन्दः पादौ तु वेदस्य हस्तौ कल्पोऽथ कथ्यते।
              <br />
              ज्योतिषामयनं चक्षुर्निरुक्तं श्रोत्रमुच्यते॥
            </p>
            <p
              className="text-lg italic mb-3"
              lang="sa-Latn"
              style={{
                fontFamily: "var(--font-cormorant)",
                color: "var(--gl-ink-on-cream-secondary)",
              }}
            >
              chandaḥ pādau tu vedasya hastau kalpo&apos;tha kathyate |
              <br />
              jyotiṣām ayanaṁ cakṣur niruktaṁ śrotram ucyate ||
            </p>
            <p
              className="text-base"
              style={{
                fontFamily: "var(--font-cormorant)",
                color: "var(--gl-ink-on-cream-primary)",
              }}
            >
              &ldquo;Chandas (prosody) is said to be the feet of the Veda; Kalpa (ritual) the hands;
              Jyotiṣa (the science of celestial motion) the eye; and Nirukta (etymology) the ear.&rdquo;
            </p>
          </div>
        </section>

        {/* §3 — The 9 graha hues with classical attribution */}
        <section className="gl-surface-twilight-glass p-8">
          <h2
            className="text-2xl text-[var(--gl-gold-accent)] mb-2"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            §4.3 · The Nine Grahas
          </h2>
          <p className="text-sm text-[var(--gl-ink-secondary)] mb-6">
            Locked hues derived from classical attribution (BPHS Grahanāmādhyāya 3.30, Sāravalī ch. 3).
          </p>
          <div className="grid grid-cols-3 gap-4">
            {Object.values(grahas).map((g) => (
              <div
                key={g.slug}
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <div
                  className="w-14 h-14 rounded-full flex-shrink-0 border"
                  style={{
                    background: g.primary,
                    borderColor: "rgba(232,199,114,0.20)",
                    boxShadow: `0 0 24px ${g.secondaryTint}30`,
                  }}
                  aria-label={`${g.iast} colour swatch ${g.primary}`}
                />
                <div className="min-w-0">
                  <p
                    className="text-xl leading-none"
                    lang="sa"
                    style={{ fontFamily: "var(--font-devanagari)", color: "var(--gl-ink-primary)" }}
                  >
                    {g.devanagari}
                  </p>
                  <p
                    className="text-sm italic"
                    style={{ fontFamily: "var(--font-cormorant)", color: "var(--gl-ink-secondary)" }}
                  >
                    {g.iast} · {g.hueName}
                  </p>
                  <p className="text-xs font-mono text-[var(--gl-ink-muted)]">{g.primary}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* §4 — The 12 rāśi hues */}
        <section className="gl-surface-twilight-glass p-8">
          <h2
            className="text-2xl text-[var(--gl-gold-accent)] mb-2"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            §4.4 · The Twelve Rāśis
          </h2>
          <p className="text-sm text-[var(--gl-ink-secondary)] mb-6">
            Hues derived from element × modality. Fire = warm reds/golds; Earth = ochres; Air = pale gold/blue; Water = blue family.
          </p>
          <div className="grid grid-cols-4 gap-3">
            {Object.values(rashis).map((r) => (
              <div
                key={r.slug}
                className="p-3 rounded-lg flex items-center gap-3"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <div
                  className="w-10 h-10 rounded-md flex-shrink-0"
                  style={{ background: r.primary }}
                  aria-label={`${r.iast} colour swatch`}
                />
                <div className="min-w-0">
                  <p
                    className="text-base"
                    lang="sa"
                    style={{ fontFamily: "var(--font-devanagari)", color: "var(--gl-ink-primary)" }}
                  >
                    {r.devanagari}
                  </p>
                  <p
                    className="text-xs italic"
                    style={{ fontFamily: "var(--font-cormorant)", color: "var(--gl-ink-secondary)" }}
                  >
                    {r.iast} · {r.element}/{r.modality}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* §5 — Dawn Accent celebration surface */}
        <section className="space-y-3">
          <h2
            className="text-2xl text-[var(--gl-gold-accent)] px-2"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            §5.4 · Dawn Accent — Mastery celebration surface
          </h2>
          <div className="gl-surface-dawn p-10 text-center max-w-2xl">
            <p
              className="text-4xl mb-2"
              style={{
                fontFamily: "var(--font-cormorant)",
                color: "var(--gl-ink-on-dawn-primary)",
              }}
            >
              Lesson mastered.
            </p>
            <p
              className="text-lg italic"
              style={{
                fontFamily: "var(--font-cormorant)",
                color: "var(--gl-ink-on-dawn-primary)",
                opacity: 0.78,
              }}
            >
              ज्योतिषं वेदस्य चक्षुः · Jyotiṣa as Vedāṅga
            </p>
          </div>
        </section>

        {/* Footer note */}
        <footer className="text-center pb-12">
          <p className="text-xs text-[var(--gl-ink-muted)]">
            Temporary Phase B1 sanity check. Removed when Lesson 1 ships.
          </p>
        </footer>
      </div>
    </div>
  );
}
