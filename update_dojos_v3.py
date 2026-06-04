import os
import json

base_dir = r"c:\CorpoAstroOfficial_grahavani\Grahvani\frontend-grahvani-software\src\components\learning-runtime\interactive"

components_data = {
    "mula-root-mandala": {
        "export_name": "MulaRootMandala",
        "tab1_name": "Root Mandala",
        "tab1_sub": "Mūla's energetic nodes",
        "tab2_name": "Nirṛti Drill",
        "tab2_sub": "3 evaluation scenarios",
        "nodes": [
            {"id": "mula", "iast": "Mūla", "devanagari": "मूल", "interlockLabel": "The Root", "interlockBrief": "Nirṛti's Domain", "interlockDetail": "Mūla translates directly to 'the root'. It represents the absolute foundation, the core of existence, and the deep, often hidden origins of things. It is positioned near the Galactic Center.", "isCenter": True},
            {"id": "nirriti", "iast": "Nirṛti", "devanagari": "निर्ऋति", "interlockLabel": "Goddess of Destruction", "interlockBrief": "Breaking to Build", "interlockDetail": "Nirṛti is the deity of calamity, destruction, and uprooting. She represents the necessary destruction of the old and the false, stripping things down to their absolute core.", "angleDeg": -90},
            {"id": "ketu", "iast": "Ketu", "devanagari": "केतु", "interlockLabel": "The South Node", "interlockBrief": "The Planetary Lord", "interlockDetail": "Ketu rules Mūla, adding profound spiritual depth, detachment, and a desire to completely sever ties with superficial reality to find the ultimate truth.", "angleDeg": 0},
            {"id": "roots", "iast": "Tied Roots", "devanagari": "मूल", "interlockLabel": "The Tied Bunch", "interlockBrief": "The Symbol of Mūla", "interlockDetail": "The symbol of a tied bunch of roots perfectly captures Mūla's essence: searching beneath the surface, restriction (being tied), and uncovering the foundation of matters.", "angleDeg": 90},
            {"id": "sagittarius", "iast": "Dhanus", "devanagari": "धनुष", "interlockLabel": "Sagittarius", "interlockBrief": "The Rashi", "interlockDetail": "Mūla lies entirely within Sagittarius (Dhanus). This adds a philosophical, truth-seeking fire to its destructive nature. It destroys not out of malice, but to find ultimate meaning.", "angleDeg": 180}
        ],
        "scenarios": [
            {
                "slug": "s1", "question": "A person experiences a sudden loss of their false identity and material attachments, forcing spiritual grounding. Which energies are primarily at play?", "context": "Focus on the destruction of illusion and spiritual detachment.",
                "options": [
                    {"id": "A", "label": "Nirṛti and Ketu", "isCorrect": True, "explanation": "Nirṛti represents the necessary destruction of the false, while Ketu represents sudden severing of attachments."},
                    {"id": "B", "label": "Tied Roots and Mūla", "isCorrect": False, "explanation": "While relevant, they signify digging and foundation, not the active destruction of false identity."},
                    {"id": "C", "label": "Sagittarius and Ketu", "isCorrect": False, "explanation": "Sagittarius is the philosophical fire, but Nirṛti is the active destructive force missing here."}
                ]
            },
            {
                "slug": "s2", "question": "An investigative journalist spends years digging beneath the surface, refusing to stop until they reach the absolute origin of a philosophical truth.",
                "options": [
                    {"id": "A", "label": "Nirṛti and Ketu", "isCorrect": False, "explanation": "This describes destruction and detachment, not sustained philosophical investigation."},
                    {"id": "B", "label": "Tied Roots and Sagittarius", "isCorrect": True, "explanation": "The Tied Roots signify digging beneath the surface, while Sagittarius provides the philosophical truth-seeking fire."},
                    {"id": "C", "label": "Mūla and Nirṛti", "isCorrect": False, "explanation": "Mūla is the core, but Nirṛti focuses on uprooting rather than philosophical investigation."}
                ]
            }
        ]
    },
    "purva-ashadha-relationship-map": {
        "export_name": "PurvaAshadhaRelationshipMap",
        "tab1_name": "Relationship Map",
        "tab1_sub": "Cosmic waters components",
        "tab2_name": "Invincibility Drill",
        "tab2_sub": "3 evaluation scenarios",
        "nodes": [
            {"id": "purva-ashadha", "iast": "Pūrva Aṣāḍhā", "devanagari": "पूर्वाषाढा", "interlockLabel": "The Former Undefeated", "interlockBrief": "The Hub", "interlockDetail": "Pūrva Aṣāḍhā represents early, raw victory and invincibility.", "isCenter": True},
            {"id": "apas", "iast": "Āpas", "devanagari": "आपः", "interlockLabel": "Cosmic Waters", "interlockBrief": "The Deity", "interlockDetail": "Āpas represents the cosmic waters, the ocean of consciousness that flows universally and connects all life.", "angleDeg": -90},
            {"id": "venus", "iast": "Śukra", "devanagari": "शुक्र", "interlockLabel": "Venus", "interlockBrief": "The Lord", "interlockDetail": "Venus brings a desire for rejuvenation, flow, and pleasure to this nakshatra's unstoppable energy.", "angleDeg": 30},
            {"id": "basket", "iast": "Winnowing Basket", "devanagari": "शूर्प", "interlockLabel": "The Symbol", "interlockBrief": "Separating Chaff", "interlockDetail": "The winnowing basket separates the grain (truth) from the chaff (illusion), aligning with the purifying nature of water.", "angleDeg": 150}
        ],
        "scenarios": [
            {
                "slug": "s1", "question": "An individual seeks to completely cleanse themselves of past illusions and separate truth from falsehood. Which energies facilitate this?", "context": "Focus on the purification and separation actions.",
                "options": [
                    {"id": "A", "label": "Āpas and the Winnowing Basket", "isCorrect": True, "explanation": "Āpas provides purifying waters, while the Basket actively separates the true grain from the false chaff."},
                    {"id": "B", "label": "Pūrva Aṣāḍhā and Venus", "isCorrect": False, "explanation": "These energies focus on undefeated victory and flowing pleasure, not purification."},
                    {"id": "C", "label": "Venus and the Winnowing Basket", "isCorrect": False, "explanation": "Venus brings rejuvenation, but Āpas is required for the fundamental cleansing."}
                ]
            },
            {
                "slug": "s2", "question": "A creative person channels an overwhelming, victorious wave of beauty that simply cannot be stopped or reasoned with.",
                "options": [
                    {"id": "A", "label": "Āpas and the Winnowing Basket", "isCorrect": False, "explanation": "These are purifying and separating forces, not unstoppable artistic waves."},
                    {"id": "B", "label": "Pūrva Aṣāḍhā and Venus", "isCorrect": True, "explanation": "Pūrva Aṣāḍhā provides the 'undefeated' raw power, while Venus provides the artistic and flowing essence."},
                    {"id": "C", "label": "Āpas and Venus", "isCorrect": False, "explanation": "While watery and beautiful, this misses the 'undefeated' (Aṣāḍhā) raw power driving the wave."}
                ]
            }
        ]
    },
    "uttara-ashadha-attribute-universe": {
        "export_name": "UttaraAshadhaAttributeUniverse",
        "tab1_name": "Attribute Universe",
        "tab1_sub": "The unbreakable forces",
        "tab2_name": "Victory Drill",
        "tab2_sub": "3 evaluation scenarios",
        "nodes": [
            {"id": "uttara", "iast": "Uttarāṣāḍhā", "devanagari": "उत्तराषाढा", "interlockLabel": "The Latter Undefeated", "interlockBrief": "The Hub", "interlockDetail": "Uttarāṣāḍhā represents absolute, enduring, and unquestioned victory.", "isCenter": True},
            {"id": "visvedevas", "iast": "Viśvedevās", "devanagari": "विश्वेदेवाः", "interlockLabel": "The Universal Gods", "interlockBrief": "The Deity", "interlockDetail": "The Viśvedevās represent all divine virtues combined: goodness, truth, willpower, and time.", "angleDeg": -90},
            {"id": "sun", "iast": "Sūrya", "devanagari": "सूर्य", "interlockLabel": "The Sun", "interlockBrief": "The Lord", "interlockDetail": "The Sun provides the authoritative, brilliant, and unwavering light that guarantees final victory.", "angleDeg": 30},
            {"id": "tusk", "iast": "Elephant Tusk", "devanagari": "गजदन्त", "interlockLabel": "The Symbol", "interlockBrief": "Unbreakable Penetration", "interlockDetail": "The elephant tusk symbolizes an unbreakable weapon that penetrates all obstacles and cannot be defeated.", "angleDeg": 150}
        ],
        "scenarios": [
            {
                "slug": "s1", "question": "A leader wins a war not through brute force, but because they embody all divine virtues and unquestionable, radiant authority.",
                "options": [
                    {"id": "A", "label": "Viśvedevās and Sūrya", "isCorrect": True, "explanation": "The Viśvedevās provide the combined divine virtues, while Sūrya provides the absolute radiant authority."},
                    {"id": "B", "label": "Uttarāṣāḍhā and Elephant Tusk", "isCorrect": False, "explanation": "This represents enduring victory and breaking obstacles, but misses the divine virtues and authority."},
                    {"id": "C", "label": "Sūrya and Elephant Tusk", "isCorrect": False, "explanation": "Authority and unbreakable penetration, but missing the 'all divine virtues' represented by Viśvedevās."}
                ]
            },
            {
                "slug": "s2", "question": "An obstacle that has stopped everyone else is finally pierced and permanently removed by an enduring, immovable force.",
                "options": [
                    {"id": "A", "label": "Viśvedevās and Sūrya", "isCorrect": False, "explanation": "This describes virtuous authority, not the specific act of piercing a final obstacle."},
                    {"id": "B", "label": "Uttarāṣāḍhā and Elephant Tusk", "isCorrect": True, "explanation": "Uttarāṣāḍhā is the enduring final victory, achieved through the unbreakable penetration of the Elephant Tusk."},
                    {"id": "C", "label": "Sūrya and Uttarāṣāḍhā", "isCorrect": False, "explanation": "This describes radiant, final victory, but misses the 'piercing' symbology of the Tusk."}
                ]
            }
        ]
    },
    "shravana-dhanishtha-concept-constellation": {
        "export_name": "ShravanaDhanishthaConceptConstellation",
        "tab1_name": "Concept Constellation",
        "tab1_sub": "Dual constellation map",
        "tab2_name": "Rhythm Drill",
        "tab2_sub": "4 evaluation scenarios",
        "nodes": [
            {"id": "shravana", "iast": "Śravaṇa", "devanagari": "श्रवण", "interlockLabel": "The Ear", "interlockBrief": "Listening to Truth", "interlockDetail": "Śravaṇa is the star of hearing, listening to the divine word (Śruti), and acquiring wisdom through receptivity.", "angleDeg": 180, "isCenter": True},
            {"id": "vishnu", "iast": "Viṣṇu", "devanagari": "विष्णु", "interlockLabel": "The Pervader", "interlockBrief": "Śravaṇa Deity", "interlockDetail": "Viṣṇu preserves the universe and represents the all-pervading consciousness that one hears when truly listening.", "angleDeg": 240},
            {"id": "moon", "iast": "Candra", "devanagari": "चन्द्र", "interlockLabel": "The Moon", "interlockBrief": "Śravaṇa Lord", "interlockDetail": "The Moon represents the receptive, reflective mind necessary to truly hear and absorb knowledge.", "angleDeg": 120},
            {"id": "dhanishtha", "iast": "Dhaniṣṭhā", "devanagari": "धनिष्ठा", "interlockLabel": "The Drum", "interlockBrief": "Rhythm & Wealth", "interlockDetail": "Dhaniṣṭhā is the star of symphony, perfect timing, and the manifestation of wealth through cosmic rhythm.", "angleDeg": 0, "isCenter": True},
            {"id": "vasus", "iast": "Vasus", "devanagari": "वसवः", "interlockLabel": "The 8 Elements", "interlockBrief": "Dhaniṣṭhā Deity", "interlockDetail": "The Vasus are the eight elemental gods of light and abundance, manifesting material and spiritual wealth.", "angleDeg": -60},
            {"id": "mars", "iast": "Maṅgala", "devanagari": "मङ्गल", "interlockLabel": "Mars", "interlockBrief": "Dhaniṣṭhā Lord", "interlockDetail": "Mars provides the driving beat, energy, and action required to keep the cosmic rhythm playing.", "angleDeg": 60}
        ],
        "scenarios": [
            {
                "slug": "s1", "question": "A sage sits in total silence, receiving a transmission of ancient, preserving wisdom through deep receptivity.",
                "options": [
                    {"id": "A", "label": "Śravaṇa, Viṣṇu, Candra", "isCorrect": True, "explanation": "Śravaṇa (hearing), ruled by the receptive Moon, downloading the preserving wisdom of Viṣṇu."},
                    {"id": "B", "label": "Dhaniṣṭhā, Vasus, Maṅgala", "isCorrect": False, "explanation": "These represent rhythm, wealth, and action, not silent receptivity."},
                    {"id": "C", "label": "Śravaṇa, Vasus, Candra", "isCorrect": False, "explanation": "The Vasus manifest material wealth, whereas Viṣṇu provides the preserving wisdom."}
                ]
            },
            {
                "slug": "s2", "question": "A leader takes action with perfect timing and energy, aligning elemental forces to manifest immense physical abundance.",
                "options": [
                    {"id": "A", "label": "Śravaṇa, Viṣṇu, Candra", "isCorrect": False, "explanation": "This describes receptive listening, not taking action to manifest abundance."},
                    {"id": "B", "label": "Dhaniṣṭhā, Vasus, Maṅgala", "isCorrect": True, "explanation": "Dhaniṣṭhā (rhythm/wealth), powered by the action of Mars, to manifest the abundance of the elemental Vasus."},
                    {"id": "C", "label": "Dhaniṣṭhā, Viṣṇu, Maṅgala", "isCorrect": False, "explanation": "Viṣṇu preserves, but it is the Vasus (8 elements) that specifically manifest physical abundance/wealth here."}
                ]
            }
        ]
    },
    "shatabhishaj-bhadrapada-knowledge-galaxy": {
        "export_name": "ShatabhishajBhadrapadaKnowledgeGalaxy",
        "tab1_name": "Galaxy Explorer",
        "tab1_sub": "The hidden healers",
        "tab2_name": "Penance Drill",
        "tab2_sub": "3 evaluation scenarios",
        "nodes": [
            {"id": "shatabhishaj", "iast": "Śatabhiṣaj", "devanagari": "शतभिषज्", "interlockLabel": "100 Physicians", "interlockBrief": "The Veiled Healer", "interlockDetail": "Śatabhiṣaj represents deep, mysterious healing, the cosmic ocean, and things hidden behind a veil.", "angleDeg": -90, "isCenter": True},
            {"id": "purva-bhadrapada", "iast": "Pūrva Bhādrapadā", "devanagari": "पूर्वभाद्रपदा", "interlockLabel": "The Former Blessed Feet", "interlockBrief": "The Fiery Ascetic", "interlockDetail": "Pūrva Bhādrapadā represents intense tapas (penance), the burning fire of transformation, and the front legs of the funeral cot.", "angleDeg": 150, "isCenter": True},
            {"id": "uttara-bhadrapada", "iast": "Uttara Bhādrapadā", "devanagari": "उत्तरभाद्रपदा", "interlockLabel": "The Latter Blessed Feet", "interlockBrief": "The Deep Foundation", "interlockDetail": "Uttara Bhādrapadā represents the cool, deep waters of wisdom that follow the fire, and the back legs of the funeral cot.", "angleDeg": 30, "isCenter": True}
        ],
        "scenarios": [
            {
                "slug": "s1", "question": "A disease that no one can diagnose is suddenly cured by a hidden, unconventional method involving extreme isolation.",
                "options": [
                    {"id": "A", "label": "Śatabhiṣaj", "isCorrect": True, "explanation": "Śatabhiṣaj is the veiled healer of the 100 physicians, ruling over mysteries and isolation."},
                    {"id": "B", "label": "Pūrva Bhādrapadā", "isCorrect": False, "explanation": "This nakshatra represents intense fiery penance, not hidden/veiled healing."},
                    {"id": "C", "label": "Uttara Bhādrapadā", "isCorrect": False, "explanation": "This represents cool wisdom and deep foundation, not the '100 physicians'."}
                ]
            },
            {
                "slug": "s2", "question": "An ascetic endures intense, burning suffering and self-mortification to burn off karma and achieve a higher state of consciousness.",
                "options": [
                    {"id": "A", "label": "Śatabhiṣaj", "isCorrect": False, "explanation": "Śatabhiṣaj is about healing and mysteries, not burning penance."},
                    {"id": "B", "label": "Pūrva Bhādrapadā", "isCorrect": True, "explanation": "Pūrva Bhādrapadā represents the intense, burning fire of tapas and self-mortification."},
                    {"id": "C", "label": "Uttara Bhādrapadā", "isCorrect": False, "explanation": "This nakshatra follows the fire; it represents the cool waters of wisdom after the penance is complete."}
                ]
            }
        ]
    },
    "revati-constellation-diagram": {
        "export_name": "RevatiConstellationDiagram",
        "tab1_name": "Constellation Diagram",
        "tab1_sub": "The final journey",
        "tab2_name": "Nourisher Drill",
        "tab2_sub": "3 evaluation scenarios",
        "nodes": [
            {"id": "revati", "iast": "Revatī", "devanagari": "रेवती", "interlockLabel": "The Wealthy", "interlockBrief": "The Final Journey", "interlockDetail": "Revatī is the final nakshatra, representing the transition to the next world, spiritual wealth, and final dissolution.", "isCenter": True},
            {"id": "pushan", "iast": "Pūṣan", "devanagari": "पूषन्", "interlockLabel": "The Nourisher", "interlockBrief": "The Deity", "interlockDetail": "Pūṣan is the shepherd of the gods, who safely guides souls across thresholds and finds lost things.", "angleDeg": -90},
            {"id": "mercury", "iast": "Budha", "devanagari": "बुध", "interlockLabel": "Mercury", "interlockBrief": "The Lord", "interlockDetail": "Mercury provides the communication and translation skills necessary to cross between different realms of existence.", "angleDeg": 30},
            {"id": "fish", "iast": "Two Fishes", "devanagari": "मीन", "interlockLabel": "The Symbol", "interlockBrief": "Swimming in the Cosmic Ocean", "interlockDetail": "The two fishes swimming in the cosmic ocean represent the soul navigating the waters of Moksha.", "angleDeg": 150}
        ],
        "scenarios": [
            {
                "slug": "s1", "question": "A soul needs gentle guidance to safely navigate from this world to the next without getting lost in the darkness.",
                "options": [
                    {"id": "A", "label": "Revatī and Pūṣan", "isCorrect": True, "explanation": "Revatī represents the final journey, and Pūṣan is the divine shepherd who safely guides souls across."},
                    {"id": "B", "label": "Budha and Two Fishes", "isCorrect": False, "explanation": "These represent translation and swimming the cosmic ocean, not the 'guiding shepherd' archetype."},
                    {"id": "C", "label": "Revatī and Two Fishes", "isCorrect": False, "explanation": "While true to Revatī, this lacks the active guiding energy provided by the deity Pūṣan."}
                ]
            },
            {
                "slug": "s2", "question": "Information from a higher, spiritual realm must be accurately translated and communicated into a form we can understand here on earth.",
                "options": [
                    {"id": "A", "label": "Revatī and Pūṣan", "isCorrect": False, "explanation": "This is about guidance and transition, not specifically translation and communication."},
                    {"id": "B", "label": "Budha and Two Fishes", "isCorrect": True, "explanation": "Budha (Mercury) is the messenger and translator, while the Fishes represent navigating those higher cosmic waters."},
                    {"id": "C", "label": "Budha and Pūṣan", "isCorrect": False, "explanation": "Mercury translates, but Pūṣan guides; the Fishes are a better symbol for the medium (cosmic waters) of the message."}
                ]
            }
        ]
    }
}

DATA_TS_TEMPLATE = """export interface NodeData {
  id: string;
  iast: string;
  devanagari: string;
  interlockLabel: string;
  interlockBrief: string;
  interlockDetail: string;
  angleDeg?: number;
  isCenter?: boolean;
}

export interface DrillScenario {
  slug: string;
  question: string;
  context?: string;
  options: {
    id: string;
    label: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export const NODES: NodeData[] = {nodes_json};

export const DRILL_SCENARIOS: DrillScenario[] = {scenarios_json};
"""

INDEX_TSX_TEMPLATE = """\"use client\";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, BookOpen, Check, X, ArrowRight } from "lucide-react";
import { NODES, DRILL_SCENARIOS } from "./data";

const GOLD = "#9C7A2F";
const GOLD_DEEP = "#7A5E1E";
const GOLD_LIGHT = "#F4C77B";
const INDIGO = "#4F6FA8";
const JADE = "#3A8C5A";
const VERMILION = "#A23A1E";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary)";
const INK_MUTED = "var(--gl-ink-on-cream-muted)";

type Tab = "diagram" | "drill";

export function {export_name}() {
  const [tab, setTab] = useState<Tab>("diagram");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <div
      className="gl-surface-twilight-glass"
      style={{ padding: "20px 22px 22px" }}
      data-interactive="{folder_name}"
    >
      <div role="tablist" aria-label="Synthesis modes" style={{ display: "flex", gap: "10px", marginBottom: "18px", flexWrap: "wrap" }}>
        <TabButton
          active={tab === "diagram"}
          onClick={() => setTab("diagram")}
          label="{tab1_name}"
          sublabel="{tab1_sub}"
          icon={<Sparkles size={14} />}
        />
        <TabButton
          active={tab === "drill"}
          onClick={() => setTab("drill")}
          label="{tab2_name}"
          sublabel="{tab2_sub}"
          icon={<BookOpen size={14} />}
        />
      </div>

      {tab === "diagram" ? (
        <DiagramView reducedMotion={reducedMotion} />
      ) : (
        <DrillView reducedMotion={reducedMotion} />
      )}
    </div>
  );
}

function TabButton({ active, onClick, label, sublabel, icon }: { active: boolean; onClick: () => void; label: string; sublabel: string; icon: React.ReactNode }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className="gl-clickable gl-focus-ring"
      style={{
        flex: "1 1 260px",
        padding: "10px 14px",
        background: active
          ? "linear-gradient(180deg, rgba(255, 248, 230, 0.96) 0%, rgba(252, 240, 210, 0.92) 100%)"
          : "rgba(255, 251, 240, 0.55)",
        border: active ? `1.5px solid ${GOLD}` : "1.5px solid rgba(156, 122, 47, 0.30)",
        borderRadius: "10px",
        cursor: "pointer",
        textAlign: "left",
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <span
        style={{
          width: "28px",
          height: "28px",
          flexShrink: 0,
          borderRadius: "50%",
          background: active ? `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})` : "rgba(156, 122, 47, 0.15)",
          color: active ? "#1A1408" : GOLD_DEEP,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </span>
      <span style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
        <span style={{ fontFamily: "var(--font-sans), system-ui, sans-serif", fontSize: "14px", fontWeight: 700, color: active ? GOLD_DEEP : INK_PRIMARY }}>
          {label}
        </span>
        <span style={{ fontFamily: "var(--font-sans), system-ui, sans-serif", fontSize: "12px", color: INK_MUTED, marginTop: "2px" }}>
          {sublabel}
        </span>
      </span>
    </button>
  );
}

function DiagramView({ reducedMotion }: { reducedMotion: boolean }) {
  const [activeNode, setActiveNode] = useState<string>(NODES[0].id);
  const RADIUS = 140;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-6 items-stretch">
      <div style={{ display: "flex", flex: 1, justifyContent: "center", alignItems: "center", minHeight: "480px" }}>
        <div style={{ position: "relative", width: "100%", maxWidth: "500px", margin: "0 auto", aspectRatio: "1/1" }}>
          <svg width="100%" height="100%" viewBox="-200 -200 400 400" style={{ overflow: "visible" }}>
            <circle cx="0" cy="0" r={RADIUS} fill="none" stroke={GOLD_LIGHT} strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="0" cy="0" r={RADIUS * 0.5} fill="none" stroke={GOLD_LIGHT} strokeWidth="1" strokeDasharray="2 6" />
            
            {NODES.filter(n => !n.isCenter).map((node) => {
              const rad = ((node.angleDeg || 0) * Math.PI) / 180;
              const x = Math.cos(rad) * RADIUS;
              const y = Math.sin(rad) * RADIUS;
              const isActive = activeNode === node.id;
              
              return (
                <g key={node.id}>
                  <motion.line
                    x1="0" y1="0" x2={x} y2={y}
                    stroke={isActive ? GOLD : GOLD_LIGHT}
                    strokeWidth={isActive ? 2 : 1}
                    animate={reducedMotion ? {} : { strokeOpacity: isActive ? 1 : 0.4 }}
                  />
                  <g 
                    transform={`translate(${x}, ${y})`}
                    onClick={() => setActiveNode(node.id)}
                    style={{ cursor: "pointer" }}
                  >
                    <circle 
                      cx="0" cy="0" r="30"
                      fill={isActive ? GOLD : "var(--gl-cream-primary)"}
                      stroke={GOLD}
                      strokeWidth="2"
                    />
                    <text
                      textAnchor="middle" dy="4"
                      fontSize="12" fontWeight={isActive ? 600 : 400}
                      fill={isActive ? "#FFF" : GOLD_DEEP}
                      pointerEvents="none"
                    >
                      {node.iast}
                    </text>
                  </g>
                </g>
              );
            })}

            {NODES.filter(n => n.isCenter).map((node) => {
               const isMultiCenter = NODES.filter(n => n.isCenter).length > 1;
               const rad = ((node.angleDeg || 0) * Math.PI) / 180;
               const dist = isMultiCenter ? RADIUS * 0.4 : 0;
               const x = Math.cos(rad) * dist;
               const y = Math.sin(rad) * dist;
               const isActive = activeNode === node.id;

               return (
                <g 
                  key={node.id}
                  transform={`translate(${x}, ${y})`}
                  onClick={() => setActiveNode(node.id)}
                  style={{ cursor: "pointer" }}
                >
                  <circle cx="0" cy="0" r="45" fill={isActive ? GOLD : "var(--gl-cream-secondary)"} stroke={GOLD_DEEP} strokeWidth="3" />
                  <text textAnchor="middle" dy="-2" fontSize="16" fontWeight="bold" fill={isActive ? "#FFF" : GOLD_DEEP} pointerEvents="none">
                    {node.devanagari}
                  </text>
                  <text textAnchor="middle" dy="16" fontSize="12" fill={isActive ? "rgba(255,255,255,0.9)" : INK_SECONDARY} pointerEvents="none">
                    {node.iast}
                  </text>
                </g>
               )
            })}
          </svg>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, justifyContent: "center", flexDirection: "column" }}>
        {NODES.filter(n => n.id === activeNode).map(node => (
          <motion.div
            key={node.id}
            initial={reducedMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: "24px 28px",
              background: "rgba(156, 122, 47, 0.05)",
              border: `1px solid ${GOLD_LIGHT}`,
              borderRadius: "8px",
            }}
          >
            <h4 style={{ margin: "0 0 4px 0", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.05em", color: GOLD_DEEP }}>
              {node.interlockBrief}
            </h4>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "24px", fontWeight: 500, color: INK_PRIMARY }}>
              {node.interlockLabel}
            </h3>
            <p style={{ margin: 0, fontSize: "18px", color: INK_SECONDARY, lineHeight: 1.6 }}>
              {node.interlockDetail}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function DrillView({ reducedMotion }: { reducedMotion: boolean }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const scenario = DRILL_SCENARIOS[index];
  const isLast = index === DRILL_SCENARIOS.length - 1;

  const handleSubmit = () => {
    if (!selected) return;
    setSubmitted(true);
  };

  const handleNext = () => {
    setSelected(null);
    setSubmitted(false);
    if (!isLast) setIndex((i) => i + 1);
  };

  const selectedOption = scenario.options.find((o) => o.id === selected);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
        <p
          className="uppercase"
          style={{
            fontFamily: "var(--font-sans), system-ui, sans-serif",
            fontSize: "11px",
            fontWeight: 700,
            color: INDIGO,
            letterSpacing: "0.12em",
          }}
        >
          Scenario {index + 1} of {DRILL_SCENARIOS.length}
        </p>
        <div style={{ display: "flex", gap: "4px" }}>
          {DRILL_SCENARIOS.map((_, i) => (
            <span
              key={i}
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: i === index ? INDIGO : "rgba(79, 111, 168, 0.25)",
                transition: reducedMotion ? "none" : "background 250ms cubic-bezier(0.32, 0.72, 0.24, 1)",
              }}
            />
          ))}
        </div>
      </div>

      <p
        style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "20px",
          fontWeight: 500,
          color: INK_PRIMARY,
          lineHeight: 1.4,
        }}
      >
        {scenario.question}
      </p>
      {scenario.context && (
        <p
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontStyle: "italic",
            fontSize: "15px",
            color: INK_SECONDARY,
            lineHeight: 1.5,
          }}
        >
          {scenario.context}
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {scenario.options.map((opt) => {
          const isSelected = selected === opt.id;
          const showCorrect = submitted && opt.isCorrect;
          const showWrong = submitted && isSelected && !opt.isCorrect;
          return (
            <button
              key={opt.id}
              type="button"
              disabled={submitted}
              onClick={() => !submitted && setSelected(opt.id)}
              className="gl-focus-ring gl-clickable"
              aria-pressed={isSelected}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "12px 14px",
                borderRadius: "8px",
                background: showCorrect
                  ? "rgba(58, 140, 90, 0.10)"
                  : showWrong
                  ? "rgba(162, 58, 30, 0.10)"
                  : isSelected
                  ? "rgba(79, 111, 168, 0.10)"
                  : "rgba(255, 252, 240, 0.55)",
                border: showCorrect
                  ? "1.5px solid #3A8C5A"
                  : showWrong
                  ? "1.5px solid #A23A1E"
                  : isSelected
                  ? `1.5px solid ${INDIGO}`
                  : "1px solid rgba(156, 122, 47, 0.20)",
                cursor: submitted ? "default" : "pointer",
                transition: reducedMotion
                  ? "none"
                  : "all 250ms cubic-bezier(0.32, 0.72, 0.24, 1)",
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
              }}
            >
              <span
                style={{
                  width: "24px",
                  height: "24px",
                  flexShrink: 0,
                  borderRadius: "50%",
                  background: showCorrect
                    ? "#3A8C5A"
                    : showWrong
                    ? "#A23A1E"
                    : isSelected
                    ? INDIGO
                    : "rgba(156, 122, 47, 0.15)",
                  color: showCorrect || showWrong || isSelected ? "#FFF" : GOLD_DEEP,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-sans), system-ui, sans-serif",
                  fontSize: "12px",
                  fontWeight: 700,
                  marginTop: "2px",
                }}
              >
                {showCorrect ? <Check size={14} /> : showWrong ? <X size={14} /> : opt.id}
              </span>
              <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span
                  style={{
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                    fontSize: "15px",
                    color: INK_PRIMARY,
                    lineHeight: 1.45,
                    fontWeight: isSelected ? 600 : 400,
                  }}
                >
                  {opt.label}
                </span>
                {submitted && (
                  <span
                    style={{
                      fontFamily: "var(--font-sans), system-ui, sans-serif",
                      fontSize: "14px",
                      color: opt.isCorrect ? JADE : showWrong ? VERMILION : INK_MUTED,
                      lineHeight: 1.5,
                      marginTop: "4px",
                    }}
                  >
                    {opt.explanation}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "4px" }}>
        {!submitted ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!selected}
            className="gl-focus-ring gl-clickable"
            style={{
              padding: "10px 18px",
              borderRadius: "8px",
              background: selected ? `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})` : "rgba(156, 122, 47, 0.15)",
              color: selected ? "#1A1408" : GOLD_DEEP,
              border: "none",
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              fontSize: "14px",
              fontWeight: 700,
              cursor: selected ? "pointer" : "not-allowed",
              transition: reducedMotion
                ? "none"
                : "all 250ms cubic-bezier(0.32, 0.72, 0.24, 1)",
            }}
          >
            Check answer
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="gl-focus-ring gl-clickable"
            style={{
              padding: "10px 18px",
              borderRadius: "8px",
              background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})`,
              color: "#1A1408",
              border: "none",
              fontFamily: "var(--font-sans), system-ui, sans-serif",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {isLast ? "Finish drill" : "Next scenario"}
            <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
"""

for folder_name, cfg in components_data.items():
    comp_dir = os.path.join(base_dir, folder_name)
    data_path = os.path.join(comp_dir, "data.ts")
    index_path = os.path.join(comp_dir, "index.tsx")
    
    nodes_json = json.dumps(cfg["nodes"], indent=2, ensure_ascii=False)
    scenarios_json = json.dumps(cfg["scenarios"], indent=2, ensure_ascii=False)
    
    data_code = DATA_TS_TEMPLATE.replace("{nodes_json}", nodes_json).replace("{scenarios_json}", scenarios_json)
    
    index_code = INDEX_TSX_TEMPLATE.replace("{folder_name}", folder_name)\
        .replace("{export_name}", cfg["export_name"])\
        .replace("{tab1_name}", cfg["tab1_name"])\
        .replace("{tab1_sub}", cfg["tab1_sub"])\
        .replace("{tab2_name}", cfg["tab2_name"])\
        .replace("{tab2_sub}", cfg["tab2_sub"])
        
    with open(data_path, "w", encoding="utf-8") as f:
        f.write(data_code)
        
    with open(index_path, "w", encoding="utf-8") as f:
        f.write(index_code)

print("Properly updated all 6 Chapter 5 components using Module 3's rigorous Dojo architecture!")
