/**
 * Lesson-specific interactive scenes.
 *
 * This component is dynamically imported by the lesson page so that heavy
 * interactive components are only compiled/bundled when the lesson that needs
 * them is rendered. This prevents the server page from eagerly importing every
 * interactive explorer and overwhelming the bundler.
 */

"use client";

import { VedangaBodyMap } from "@/components/learning-runtime/interactive/vedanga-body-map";
import { VedangaVsVedantaComparator } from "@/components/learning-runtime/interactive/vedanga-vs-vedanta-comparator";
import { VedangaRelationshipDiagram } from "@/components/learning-runtime/interactive/vedanga-relationship-diagram";
import { JyotishaVsWesternVsPopComparator } from "@/components/learning-runtime/interactive/jyotisha-vs-western-vs-pop-comparator";
import { KarmaTypologyExplorer } from "@/components/learning-runtime/interactive/karma-typology-explorer";
import { HistoricalTimeline } from "@/components/learning-runtime/interactive/historical-timeline";
import { BphsRecensionComparator } from "@/components/learning-runtime/interactive/bphs-recension-comparator";
import { VarahamihiraSkandhaCoverageExplorer } from "@/components/learning-runtime/interactive/varahamihira-skandha-coverage-explorer";
import { MedievalCodifierRelativeDatingExplorer } from "@/components/learning-runtime/interactive/medieval-codifier-relative-dating-explorer";
import { ParashariJaiminiParallelTraditionExplorer } from "@/components/learning-runtime/interactive/parashari-jaimini-parallel-tradition-explorer";
import { FourStreamLandscapeExplorer } from "@/components/learning-runtime/interactive/four-stream-landscape-explorer";
import { ShuklaTithiStrip } from "@/components/learning-runtime/interactive/shukla-tithi-strip";
import type { ReactNode } from "react";

interface LessonScenesProps {
  slug: string;
}

export function LessonScenes({ slug }: LessonScenesProps): ReactNode {
  if (slug === "jyotisha-as-vedanga") {
    return (
      <div className="space-y-8">
        <div>
          <h3
            className="mb-3"
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "26px",
              fontWeight: 500,
              color: "var(--gl-gold-accent)",
            }}
          >
            The Vedic Body
          </h3>
          <VedangaBodyMap />
        </div>
        <div>
          <h3
            className="mb-3"
            style={{
              fontFamily: "var(--font-cormorant), serif",
              fontSize: "26px",
              fontWeight: 500,
              color: "var(--gl-gold-accent)",
            }}
          >
            Vedāṅga is not Vedānta
          </h3>
          <p
            className="text-base italic mb-4"
            style={{
              fontFamily: "var(--font-cormorant), serif",
              color: "var(--gl-ink-secondary)",
              lineHeight: 1.55,
              maxWidth: "640px",
            }}
          >
            For each text below, choose the tradition it belongs to. A wrong choice surfaces a hint — try again until the row settles.
          </p>
          <VedangaVsVedantaComparator />
        </div>
      </div>
    );
  }

  if (slug === "the-six-vedangas-and-their-relationship") {
    return (
      <div data-l2-scenes-mounted="true">
        <h3
          className="mb-3"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "26px",
            fontWeight: 500,
            color: "var(--gl-gold-accent)",
          }}
        >
          The Six Vedāṅgas as a Coordinated Lotus
        </h3>
        <p
          className="text-base italic mb-4"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            color: "var(--gl-ink-secondary)",
            lineHeight: 1.55,
            maxWidth: "680px",
          }}
        >
          The painting on the left is the contemplative figure. The panel on the
          right is the explore surface — tap any of the six Vedāṅga rows to read
          its function, cluster membership, and Jyotiṣa interlock.
        </p>
        <VedangaRelationshipDiagram />
      </div>
    );
  }

  if (slug === "modern-founders-krishnamurti-and-joshi") {
    return (
      <div data-l26-scenes-mounted="true">
        <h3
          className="mb-3"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "26px",
            fontWeight: 500,
            color: "var(--gl-gold-accent)",
          }}
        >
          The Four-Stream Classical Landscape Completed
        </h3>
        <p
          className="text-base italic mb-4"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            color: "var(--gl-ink-secondary)",
            lineHeight: 1.55,
            maxWidth: "680px",
          }}
        >
          Two modern primaries — KP and Lal Kitab — complete the four-stream
          landscape (Parāśari + Jaiminī + KP + Lal Kitab). Below: the four-stream
          hero, the modern-primary vs modern-revival distinction, K.S.
          Krishnamurti&apos;s five distinctive KP contributions, Pandit Roop Chand
          Joshi&apos;s six distinctive Lal Kitab contributions, and the three
          modern-primary status criteria with per-stream evidence.
        </p>
        <FourStreamLandscapeExplorer />
      </div>
    );
  }

  if (slug === "jaimini-and-the-second-tradition") {
    return (
      <div data-l25-scenes-mounted="true">
        <h3
          className="mb-3"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "26px",
            fontWeight: 500,
            color: "var(--gl-gold-accent)",
          }}
        >
          Jaiminī and the Parallel Second Tradition
        </h3>
        <p
          className="text-base italic mb-4"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            color: "var(--gl-ink-secondary)",
            lineHeight: 1.55,
            maxWidth: "680px",
          }}
        >
          Parāśari and Jaiminī run alongside each other across three millennia
          of classical Jyotiṣa — structurally parallel, doctrinally complementary.
          Below: the diptych framing, the four-layer side-by-side lineage, the
          sūtra-vs-verse genre contrast, the five genuinely-distinctive Jaiminī
          doctrines, and the same-Jaiminī identity question held open.
        </p>
        <ParashariJaiminiParallelTraditionExplorer />
      </div>
    );
  }

  if (slug === "medieval-codifiers-kalyanavarma-mantresvara") {
    return (
      <div data-l24-scenes-mounted="true">
        <h3
          className="mb-3"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "26px",
            fontWeight: 500,
            color: "var(--gl-gold-accent)",
          }}
        >
          Kalyāṇavarmā, Mantreśvara, and the Medieval Codifiers
        </h3>
        <p
          className="text-base italic mb-4"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            color: "var(--gl-ink-secondary)",
            lineHeight: 1.55,
            maxWidth: "680px",
          }}
        >
          Four medieval codifiers refining and synthesising the Parāśara +
          Varāhamihira foundation. Below: the three-layer Parāśari-tradition
          lineage, the four codifier plates with bracketed dating + citation
          evidence + distinctive contribution, and the compounding-uncertainty
          visualisation.
        </p>
        <MedievalCodifierRelativeDatingExplorer />
      </div>
    );
  }

  if (slug === "varahamihira-the-systematic-codifier") {
    return (
      <div data-l23-scenes-mounted="true">
        <h3
          className="mb-3"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "26px",
            fontWeight: 500,
            color: "var(--gl-gold-accent)",
          }}
        >
          Varāhamihira, the Systematic Codifier
        </h3>
        <p
          className="text-base italic mb-4"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            color: "var(--gl-ink-secondary)",
            lineHeight: 1.55,
            maxWidth: "680px",
          }}
        >
          The most-reliably-dateable classical Jyotiṣa author and the only one
          to codify across all three skandhas. Below: the date-anchor hero, his
          three primary texts, the astronomical-position dating methodology, and
          the both-anchors framework pairing him with Parāśara.
        </p>
        <VarahamihiraSkandhaCoverageExplorer />
      </div>
    );
  }

  if (slug === "parashara-the-foundational-rishi") {
    return (
      <div data-l22-scenes-mounted="true">
        <h3
          className="mb-3"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "26px",
            fontWeight: 500,
            color: "var(--gl-gold-accent)",
          }}
        >
          Parāśara, BPHS, and the Recension Problem
        </h3>
        <p
          className="text-base italic mb-4"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            color: "var(--gl-ink-secondary)",
            lineHeight: 1.55,
            maxWidth: "680px",
          }}
        >
          One name spans two layers: the pre-classical Maharṣi Parāśara whom
          tradition attests, and the medieval-recensional Bṛhat Parāśara Horā
          Śāstra we actually read. Below: the duality framing, the ten major
          prakaraṇa-divisions, and the citation discipline that respects both
          layers.
        </p>
        <BphsRecensionComparator />
      </div>
    );
  }

  if (slug === "the-historical-timeline-of-jyotisha") {
    return (
      <div data-l21-scenes-mounted="true">
        <h3
          className="mb-3"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "26px",
            fontWeight: 500,
            color: "var(--gl-gold-accent)",
          }}
        >
          Three Millennia, Twelve Anchors
        </h3>
        <p
          className="text-base italic mb-4"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            color: "var(--gl-ink-secondary)",
            lineHeight: 1.55,
            maxWidth: "680px",
          }}
        >
          The major authors and texts of Indian Jyotiṣa, placed on the
          academic-Indology chronological axis. Each marker is clickable. Toggle
          the traditional-dating overlay to see where the lineage chronology and
          the academic-Indology chronology disagree — sometimes by centuries,
          sometimes by millennia.
        </p>
        <HistoricalTimeline />
      </div>
    );
  }

  if (slug === "philosophy-of-karma-and-prediction") {
    return (
      <div data-l4-scenes-mounted="true">
        <h3
          className="mb-3"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "26px",
            fontWeight: 500,
            color: "var(--gl-gold-accent)",
          }}
        >
          The Four-Fold Karma and What Jyotiṣa Reads
        </h3>
        <p
          className="text-base italic mb-4"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            color: "var(--gl-ink-secondary)",
            lineHeight: 1.55,
            maxWidth: "680px",
          }}
        >
          Saṁcita, Prārabdha, Āgāmī, Kriyamāṇa — four karma types around a single
          agent at the cycle&apos;s centre. Tap any node to read what the type is,
          what Jyotiṣa can see of it, and how much agency the agent has over it.
          The pattern teaches WHY deterministic prediction is incoherent with the
          framework.
        </p>
        <KarmaTypologyExplorer />
      </div>
    );
  }

  if (slug === "the-15-shukla-tithis") {
    return (
      <div data-l312-scenes-mounted="true">
        <h3
          className="mb-3"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "26px",
            fontWeight: 500,
            color: "var(--gl-gold-accent)",
          }}
        >
          The 15 Śukla Tithis in Sequence
        </h3>
        <p
          className="text-base italic mb-4"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            color: "var(--gl-ink-secondary)",
            lineHeight: 1.55,
            maxWidth: "680px",
          }}
        >
          Scroll through the strip below — each card shows the tithi name,
          Devanāgarī, deity, and quality. Tap any card to reveal its operational
          significance and festival associations. Filter by quality to see the
          mod-5 pattern (Nandā 1/6/11, Bhadrā 2/7/12, Jayā 3/8/13, Riktā 4/9/14,
          Pūrṇā 5/10/15).
        </p>
        <ShuklaTithiStrip />
      </div>
    );
  }

  if (slug === "jyotisha-vs-western-astrology-vs-pop-astrology") {
    return (
      <div data-l3-scenes-mounted="true">
        <h3
          className="mb-3"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "26px",
            fontWeight: 500,
            color: "var(--gl-gold-accent)",
          }}
        >
          What Jyotiṣa Is — and Is Not
        </h3>
        <p
          className="text-base italic mb-4"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            color: "var(--gl-ink-secondary)",
            lineHeight: 1.55,
            maxWidth: "680px",
          }}
        >
          Three astrology traditions, six discriminating dimensions. The painting
          on the left grounds the visual register — the panel on the right is the
          explore surface. Pick a dimension to see how each tradition handles it,
          then read the convergence and divergence callouts beneath.
        </p>
        <JyotishaVsWesternVsPopComparator />
      </div>
    );
  }

  return null;
}
