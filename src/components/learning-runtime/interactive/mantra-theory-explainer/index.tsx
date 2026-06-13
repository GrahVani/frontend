"use client";

import React, { useState, useEffect, useRef } from "react";
import { Info, Volume2, Grid, HelpCircle, Activity, Award, RefreshCw, AlertTriangle } from "lucide-react";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

const BIJAS = [
  {
    syllable: "Hrīṁ",
    devanagari: "ह्रीं",
    deityForce: "Bhuvaneshvari / Cosmic Space & Illusion (Māyā)",
    vibration: "Solar & warming resonance. It stimulates spiritual aspiration and mental clarity.",
    tip: "Pronounce 'H' clearly, transition to a long 'ree', and end with a nasalised 'ṁ' (anusvāra) vibrating in the upper palate.",
    planetLink: "Sun / Lagna (governs vitality and the self)"
  },
  {
    syllable: "Aiṁ",
    devanagari: "ऐं",
    deityForce: "Sarasvati / Wisdom & Creative Intelligence",
    vibration: "Lunar & cooling resonance. It awakens memory, artistic expression, and speech.",
    tip: "Pronounce as a diphthong 'ah-ee' blending into the nasalised 'ṁ', avoiding the English word 'aim'.",
    planetLink: "Mercury / Jupiter (governs intellect and speech)"
  },
  {
    syllable: "Klīṁ",
    devanagari: "क्लीं",
    deityForce: "Krishna / Kama - Desire & Attraction",
    vibration: "Magnetic & grounding resonance. It creates harmony, devotion, and draws energy inward.",
    tip: "Start with a soft 'K-l', transition to a sustained 'ee', and close with a long, echoing nasal vibration.",
    planetLink: "Venus / Mars (governs relationship, passion, and focus)"
  }
];

const PHONEME_GROUPS = [
  {
    name: "Svara (Vowels)",
    items: [
      { char: "अ", iast: "a", cat: "Vowel", desc: "Guttural - primal sound of creation" },
      { char: "आ", iast: "ā", cat: "Vowel", desc: "Guttural - elongation of breath" },
      { char: "इ", iast: "i", cat: "Vowel", desc: "Palatal - upward movement of prana" },
      { char: "ई", iast: "ī", cat: "Vowel", desc: "Palatal - sustained vital force" },
      { char: "उ", iast: "u", cat: "Vowel", desc: "Labial - concentration of energy" },
      { char: "ऊ", iast: "ū", cat: "Vowel", desc: "Labial - deep grounding force" },
      { char: "ऋ", iast: "ṛ", cat: "Vowel", desc: "Retroflex - internal cerebral resonance" },
      { char: "ॠ", iast: "ṝ", cat: "Vowel", desc: "Retroflex - prolonged cerebral vibration" },
      { char: "ऌ", iast: "ḷ", cat: "Vowel", desc: "Dental - root energy alignment" },
      { char: "ए", iast: "e", cat: "Vowel", desc: "Diphthong - integration of sounds" },
      { char: "ऐ", iast: "ai", cat: "Vowel", desc: "Diphthong - wisdom catalyst" },
      { char: "ओ", iast: "o", cat: "Vowel", desc: "Diphthong - universal synthesis" },
      { char: "औ", iast: "au", cat: "Vowel", desc: "Diphthong - expanding consciousness" },
      { char: "अं", iast: "aṁ", cat: "Vowel / Anusvāra", desc: "Nasaliser - cranial echo chamber" },
      { char: "अः", iast: "aḥ", cat: "Vowel / Visarga", desc: "Aspirate - release of energy" }
    ]
  },
  {
    name: "Ka-Varga (Gutturals)",
    items: [
      { char: "क", iast: "ka", cat: "Guttural", desc: "Unaspirated voiceless - start of articulation" },
      { char: "ख", iast: "kha", cat: "Guttural", desc: "Aspirated voiceless - spacious breath" },
      { char: "ग", iast: "ga", cat: "Guttural", desc: "Unaspirated voiced - density, structure" },
      { char: "घ", iast: "gha", cat: "Guttural", desc: "Aspirated voiced - heavy projection" },
      { char: "ङ", iast: "ṅa", cat: "Guttural", desc: "Nasal - subtle background resonance" }
    ]
  },
  {
    name: "Ca-Varga (Palatals)",
    items: [
      { char: "च", iast: "ca", cat: "Palatal", desc: "Voiceless - swift energy direction" },
      { char: "छ", iast: "cha", cat: "Palatal", desc: "Aspirated voiceless - expansive flow" },
      { char: "ज", iast: "ja", cat: "Palatal", desc: "Voiced - dynamic expansion" },
      { char: "झ", iast: "jha", cat: "Palatal", desc: "Aspirated voiced - intense friction" },
      { char: "ञ", iast: "ña", cat: "Palatal", desc: "Nasal - internalised reflection" }
    ]
  },
  {
    name: "Ṭa-Varga (Retroflex)",
    items: [
      { char: "ट", iast: "ṭa", cat: "Retroflex", desc: "Voiceless - crisp cranial contact" },
      { char: "ठ", iast: "ṭha", cat: "Retroflex", desc: "Aspirated voiceless - intense focus" },
      { char: "ड", iast: "ḍa", cat: "Retroflex", desc: "Voiced - grounding pulse" },
      { char: "ढ", iast: "ḍha", cat: "Retroflex", desc: "Aspirated voiced - echoic release" },
      { char: "ण", iast: "ṇa", cat: "Retroflex", desc: "Nasal - cranial saturation" }
    ]
  },
  {
    name: "Ta-Varga (Dentals)",
    items: [
      { char: "त", iast: "ta", cat: "Dental", desc: "Voiceless - light, direct action" },
      { char: "थ", iast: "tha", cat: "Dental", desc: "Aspirated voiceless - intellectual drive" },
      { char: "द", iast: "da", cat: "Dental", desc: "Voiced - steady endurance" },
      { char: "ध", iast: "dha", cat: "Dental", desc: "Aspirated voiced - devotional flow" },
      { char: "न", iast: "na", cat: "Dental", desc: "Nasal - soothing, nourishing sound" }
    ]
  },
  {
    name: "Pa-Varga (Labials)",
    items: [
      { char: "प", iast: "pa", cat: "Labial", desc: "Voiceless - outward projection" },
      { char: "फ", iast: "pha", cat: "Labial", desc: "Aspirated voiceless - sudden release" },
      { char: "ब", iast: "ba", cat: "Labial", desc: "Voiced - physical grounding" },
      { char: "भ", iast: "bha", cat: "Labial", desc: "Aspirated voiced - deep cosmic focus" },
      { char: "म", iast: "ma", cat: "Labial", desc: "Nasal - centering, motherly echo" }
    ]
  },
  {
    name: "Antastha (Semi-vowels)",
    items: [
      { char: "य", iast: "ya", cat: "Semi-vowel", desc: "Palatal (Air) - circulation of force" },
      { char: "र", iast: "ra", cat: "Semi-vowel", desc: "Retroflex (Fire) - warmth, ignition" },
      { char: "ल", iast: "la", cat: "Semi-vowel", desc: "Dental (Earth) - stabilizing support" },
      { char: "व", iast: "va", cat: "Semi-vowel", desc: "Labial (Water) - flowing connection" }
    ]
  },
  {
    name: "Ūṣman (Sibilants & Aspirate)",
    items: [
      { char: "श", iast: "śa", cat: "Sibilant", desc: "Palatal - peaceful silence" },
      { char: "ष", iast: "ṣa", cat: "Sibilant", desc: "Retroflex - protective boundary" },
      { char: "स", iast: "sa", cat: "Sibilant", desc: "Dental - vital breath (Prāṇa)" },
      { char: "ह", iast: "ha", cat: "Aspirate", desc: "Guttural - pure space (Ākāśa)" }
    ]
  },
  {
    name: "Samyukta (Conjunct)",
    items: [
      { char: "क्ष", iast: "kṣa", cat: "Conjunct (51st)", desc: "Synthesis - integration of Earth and Cosmos" }
    ]
  }
];

const COMPARISONS = [
  {
    id: 1,
    syllable: "Hrīṁ",
    correct: "Hrīṁ (IAST: hrīṃ)",
    altered: "Hreem / Hrim",
    difference: "Loses the nasalized cranial echo (anusvāra). Casual spelling encourages a flat 'm' sound ending, which halts the subtle cranial vibration before it can resonate in the upper brain centers.",
    effect: "Instead of activating the ākāśa space element, the flat 'm' grounds the energy abruptly, neutralizing the causal solar dhyāna state."
  },
  {
    id: 2,
    syllable: "Aiṁ",
    correct: "Aiṁ (IAST: aiṃ)",
    altered: "Aim",
    difference: "Pronounced like the English word 'aim' rather than a diphthong blending 'a-i' into the bindu. This shortcuts the vowel transition, which is designed to stimulate intellectual flexibility.",
    effect: "The cognitive activation of Sarasvatī is replaced by a static phonetic tone, diminishing the wisdom-awakening capacity."
  },
  {
    id: 3,
    syllable: "Klīṁ",
    correct: "Klīṁ (IAST: klīṃ)",
    altered: "Kleem",
    difference: "The 'K' and 'l' are often separated into two syllables ('ka-leem') or the nasal 'ṁ' is resolved as a hard consonant 'n' ('kleen').",
    effect: "Splitting the seed sound disperses the unified concentration (ekāgratā). Distorting the ending to 'n' redirects the magnetic draw outward instead of inward."
  }
];

export function MantraTheoryExplainer() {
  const [activeTab, setActiveTab] = useState<"vibration" | "bijas" | "matrika" | "pronunciation">("vibration");
  
  // Vibration Tab state
  const [frequency, setFrequency] = useState<number>(3); // 1 to 5
  const [amplitude, setAmplitude] = useState<number>(3); // 1 to 5
  const [isVibrating, setIsVibrating] = useState<boolean>(true);
  const [phase, setPhase] = useState<number>(0);
  
  // Bīja Tab state
  const [activeBijaIndex, setActiveBijaIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  
  // Mātṛkā Tab state
  const [selectedPhoneme, setSelectedPhoneme] = useState<any>(null);

  // Web Audio Context refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const droneOscRef = useRef<OscillatorNode | null>(null);
  const droneGainRef = useRef<GainNode | null>(null);

  const getAudioContext = () => {
    if (typeof window === "undefined") return null;
    if (!audioCtxRef.current) {
      try {
        console.log("[MantraTheoryExplainer] Instantiating new AudioContext");
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          audioCtxRef.current = new AudioContextClass();
        }
      } catch (err) {
        console.error("[MantraTheoryExplainer] Error instantiating AudioContext:", err);
      }
    }
    return audioCtxRef.current;
  };

  const resumeAudioContext = () => {
    try {
      console.log("[MantraTheoryExplainer] resumeAudioContext called");
      const ctx = getAudioContext();
      if (ctx) {
        console.log("[MantraTheoryExplainer] AudioContext state:", ctx.state);
        if (ctx.state === "suspended") {
          ctx.resume()
            .then(() => console.log("[MantraTheoryExplainer] AudioContext resumed successfully"))
            .catch((e: any) => console.warn("[MantraTheoryExplainer] Failed to resume AudioContext:", e));
        }
      }
      return ctx;
    } catch (err) {
      console.error("[MantraTheoryExplainer] Error in resumeAudioContext:", err);
      return null;
    }
  };

  const triggerVibration = (pattern: number | number[]) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (err) {
        console.warn("Haptic vibration blocked or unsupported:", err);
      }
    }
  };

  const startDrone = (ctx: AudioContext, freqVal: number, ampVal: number) => {
    try {
      const baseFreq = 120 + freqVal * 30; // 150 Hz to 270 Hz
      const baseVol = ampVal * 0.015;     // 0.015 to 0.075 volume

      if (!droneOscRef.current) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = "triangle"; // soft meditative hum
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
        gain.gain.setValueAtTime(baseVol, ctx.currentTime);
        
        osc.start();
        
        droneOscRef.current = osc;
        droneGainRef.current = gain;
      } else {
        updateDroneParams(ctx, freqVal, ampVal);
      }
    } catch (err) {
      console.warn("Failed to initiate drone:", err);
    }
  };

  const updateDroneParams = (ctx: AudioContext, freqVal: number, ampVal: number) => {
    const baseFreq = 120 + freqVal * 30;
    const baseVol = ampVal * 0.015;
    if (droneOscRef.current) {
      droneOscRef.current.frequency.setTargetAtTime(baseFreq, ctx.currentTime, 0.1);
    }
    if (droneGainRef.current) {
      droneGainRef.current.gain.setTargetAtTime(baseVol, ctx.currentTime, 0.1);
    }
  };

  const stopDrone = () => {
    if (droneOscRef.current) {
      try {
        droneOscRef.current.stop();
        droneOscRef.current.disconnect();
        droneGainRef.current?.disconnect();
      } catch (e) {}
      droneOscRef.current = null;
      droneGainRef.current = null;
    }
  };

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      stopDrone();
    };
  }, []);

  // Synthesize specific bīja sounds in the browser
  const playBijaSynth = (type: string) => {
    const ctx = resumeAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Envelope: fade in, sustain, fade out
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.08, now + 0.1); // soft attack

      if (type === "Hrīṁ") {
        // Solar, bright E4 tone transitioning to high nasalized E5
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(329.63, now); // E4
        osc1.frequency.exponentialRampToValueAtTime(349.23, now + 1.2); // slight modulation

        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(659.25, now); // E5 (overtone)
        osc2.frequency.exponentialRampToValueAtTime(698.46, now + 1.2);

        gainNode.gain.setValueAtTime(0.08, now + 0.8);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 1.8);
        osc2.stop(now + 1.8);
      } else if (type === "Aiṁ") {
        // Sweeping tone representing the diphthong 'a-i' into bindu
        osc1.type = "triangle";
        osc1.frequency.setValueAtTime(220.00, now); // A3
        osc1.frequency.linearRampToValueAtTime(330.00, now + 0.5); // slide upward
        osc1.frequency.linearRampToValueAtTime(440.00, now + 1.2); // A4

        osc2.type = "sine";
        osc2.frequency.setValueAtTime(440.00, now);
        osc2.frequency.linearRampToValueAtTime(660.00, now + 1.2);

        gainNode.gain.setValueAtTime(0.08, now + 1.0);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 2.0);
        osc2.stop(now + 2.0);
      } else if (type === "Klīṁ") {
        // Deep, grounding, magnetic F3 note with slow decay
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(174.61, now); // F3
        osc1.frequency.linearRampToValueAtTime(164.81, now + 1.5); // slide down to E3

        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(349.23, now); // F4
        osc2.frequency.linearRampToValueAtTime(329.63, now + 1.5);

        gainNode.gain.setValueAtTime(0.08, now + 0.7);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 2.4);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 2.4);
        osc2.stop(now + 2.4);
      }
    } catch (e) {
      console.warn("Synthesis failed:", e);
    }
  };

  // Synthesize comparison sounds
  const playComparisonSynth = (syllable: string, isCorrect: boolean) => {
    const ctx = resumeAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      if (isCorrect) {
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.08, now + 0.1);

        if (syllable === "Hrīṁ") {
          osc1.type = "sine";
          osc1.frequency.setValueAtTime(329.63, now);
          osc1.frequency.exponentialRampToValueAtTime(349.23, now + 1.0);

          osc2.type = "triangle";
          osc2.frequency.setValueAtTime(659.25, now);
          osc2.frequency.exponentialRampToValueAtTime(698.46, now + 1.2);

          gainNode.gain.setValueAtTime(0.08, now + 0.8);
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 2.0);
          osc2.stop(now + 2.0);
        } else if (syllable === "Aiṁ") {
          osc1.type = "triangle";
          osc1.frequency.setValueAtTime(220.00, now);
          osc1.frequency.linearRampToValueAtTime(330.00, now + 0.4);
          osc1.frequency.linearRampToValueAtTime(440.00, now + 1.0);

          osc2.type = "sine";
          osc2.frequency.setValueAtTime(440.00, now);
          osc2.frequency.linearRampToValueAtTime(660.00, now + 1.0);

          gainNode.gain.setValueAtTime(0.08, now + 0.8);
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 2.2);
          osc2.stop(now + 2.2);
        } else if (syllable === "Klīṁ") {
          osc1.type = "sine";
          osc1.frequency.setValueAtTime(174.61, now);
          osc1.frequency.linearRampToValueAtTime(164.81, now + 1.2);

          osc2.type = "triangle";
          osc2.frequency.setValueAtTime(349.23, now);
          osc2.frequency.linearRampToValueAtTime(329.63, now + 1.2);

          gainNode.gain.setValueAtTime(0.08, now + 0.8);
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 2.4);

          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 2.4);
          osc2.stop(now + 2.4);
        }
      } else {
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.09, now + 0.02);

        osc1.type = "sawtooth";
        osc2.type = "sine";

        if (syllable === "Hrīṁ") {
          osc1.frequency.setValueAtTime(329.63, now);
          osc2.frequency.setValueAtTime(329.63 * 1.5, now);

          gainNode.gain.setValueAtTime(0.09, now + 0.4);
          gainNode.gain.linearRampToValueAtTime(0.001, now + 0.65);

          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 0.7);
          osc2.stop(now + 0.7);
        } else if (syllable === "Aiṁ") {
          osc1.frequency.setValueAtTime(293.66, now);
          osc2.frequency.setValueAtTime(293.66 * 2.0, now);

          gainNode.gain.setValueAtTime(0.09, now + 0.4);
          gainNode.gain.linearRampToValueAtTime(0.001, now + 0.6);

          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 0.65);
          osc2.stop(now + 0.65);
        } else if (syllable === "Klīṁ") {
          osc1.frequency.setValueAtTime(174.61, now);
          osc2.type = "square";
          osc2.frequency.setValueAtTime(174.61, now);
          osc2.frequency.setValueAtTime(500.00, now + 0.3);

          gainNode.gain.setValueAtTime(0.09, now + 0.45);
          gainNode.gain.linearRampToValueAtTime(0.001, now + 0.6);

          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 0.65);
          osc2.stop(now + 0.65);
        }
      }
    } catch (e) {
      console.warn("Comparison synthesis failed:", e);
    }
  };

  // Animate dynamic wave translation phase when vibrating
  useEffect(() => {
    let animationFrame: number;
    const animate = () => {
      setPhase(prev => (prev + 0.12) % (Math.PI * 2));
      animationFrame = requestAnimationFrame(animate);
    };
    if (isVibrating) {
      animationFrame = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(animationFrame);
  }, [isVibrating]);

  const startBijaPlayback = (idx: number) => {
    setActiveBijaIndex(idx);
    setIsPlaying(true);
    playBijaSynth(BIJAS[idx].syllable);
    setTimeout(() => {
      setIsPlaying(false);
    }, 2500);
  };

  // Build the dynamic SVG sine wave path
  const width = 340;
  const height = 120;
  const points = [];
  const yCenter = height / 2;
  const waveFrequency = frequency * 2;
  const waveAmplitude = amplitude * 7;

  for (let x = 0; x <= width; x += 3) {
    const angle = (x / width) * Math.PI * 2 * waveFrequency + phase;
    const y = yCenter + Math.sin(angle) * waveAmplitude;
    points.push(`${x},${y}`);
  }
  const pathD = `M ${points.join(" L ")}`;

  return (
    <div style={{
      padding: "16px",
      borderRadius: "16px",
      background: "rgba(255, 253, 248, 0.75)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(156, 122, 47, 0.15)",
      fontFamily: "'Inter', sans-serif",
      color: INK_PRIMARY,
      maxWidth: "960px",
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      gap: "12px"
    }}>
      {/* Dynamic Style Injection for CSS Animations */}
      <style>{`
        @keyframes soundbar {
          0%, 100% { height: 4px; }
          50% { height: 28px; }
        }
        .bija-card {
          border: 1px solid rgba(156, 122, 47, 0.1);
          background: rgba(255, 255, 255, 0.4);
          transition: all 0.25s ease-in-out;
        }
        .bija-card:hover {
          border-color: ${GOLD};
          background: rgba(251, 248, 243, 0.8);
          box-shadow: 0 4px 12px rgba(156, 122, 47, 0.08);
          transform: translateY(-2px);
        }
        .phoneme-btn {
          border: 1px solid rgba(156, 122, 47, 0.1);
          background: rgba(255, 255, 255, 0.65);
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .phoneme-btn:hover {
          border-color: ${GOLD};
          background: rgba(156, 122, 47, 0.1);
          box-shadow: 0 2px 8px rgba(156, 122, 47, 0.12);
          transform: scale(1.1);
        }
      `}</style>

      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "8px",
        borderBottom: "1px solid rgba(156,122,47,0.1)",
        paddingBottom: "10px"
      }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800, color: GOLD_DEEP }}>
            Mantra Theory Explainer
          </h3>
          <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_SECONDARY }}>
            Explore sound mechanisms, seed vibrations, the Sanskrit phoneme-matrix, and pronunciation impacts.
          </p>
        </div>
      </div>

      {/* TABS */}
      <div style={{
        display: "flex",
        gap: "4px",
        background: "rgba(156, 122, 47, 0.05)",
        padding: "4px",
        borderRadius: "10px",
        overflowX: "auto"
      }}>
        {[
          { id: "vibration", label: "Sound Vibration", icon: Activity },
          { id: "bijas", label: "Bīja Seeds", icon: Volume2 },
          { id: "matrika", label: "Mātṛkā Matrix", icon: Grid },
          { id: "pronunciation", label: "Pronunciation Compare", icon: HelpCircle }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                const ctx = resumeAudioContext();
                triggerVibration(40);
                setActiveTab(tab.id as any);
                if (tab.id === "vibration" && isVibrating && ctx) {
                  startDrone(ctx, frequency, amplitude);
                } else {
                  stopDrone();
                }
              }}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                padding: "8px 12px",
                border: "none",
                borderRadius: "8px",
                background: isActive ? "#ffffff" : "transparent",
                color: isActive ? GOLD_DEEP : INK_SECONDARY,
                fontSize: "12px",
                fontWeight: isActive ? 800 : 600,
                cursor: "pointer",
                boxShadow: isActive ? "0 2px 6px rgba(0,0,0,0.05)" : "none",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap"
              }}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: SOUND VIBRATION */}
      {activeTab === "vibration" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", minHeight: "300px" }}>
          
          {/* Astrological calligraphic etymology card */}
          <div style={{
            background: "rgba(251, 248, 243, 0.9)",
            border: `1.5px solid ${GOLD}`,
            borderRadius: "12px",
            padding: "16px",
            textAlign: "center",
            boxShadow: "inset 0 0 10px rgba(156,122,47,0.04)",
            display: "flex",
            flexDirection: "column",
            gap: "4px"
          }}>
            <span style={{ fontSize: "9px", fontWeight: 800, color: GOLD, letterSpacing: "1px", textTransform: "uppercase" }}>Classical Sanskrit Etymology</span>
            <h4 style={{ margin: 0, fontSize: "18px", fontWeight: 900, color: GOLD_DEEP, fontFamily: "'Noto Serif', 'Georgia', serif" }}>
              मननात् त्रायते इति मन्त्रः ।
            </h4>
            <p style={{ margin: 0, fontSize: "11px", fontWeight: 705, color: INK_SECONDARY, fontStyle: "italic" }}>
              mananāt trāyate iti mantraḥ
            </p>
            <p style={{ margin: "4px 0 0 0", fontSize: "11px", color: INK_PRIMARY, lineHeight: "1.4" }}>
              "That which **protects (trāyate)** through **contemplation (manana)** is a *mantra*."
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
            
            {/* Visualizer Block (SINE WAVE) */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255, 255, 255, 0.4)",
              border: "1px solid rgba(156, 122, 47, 0.12)",
              borderRadius: "12px",
              padding: "16px",
              minHeight: "220px",
              position: "relative"
            }}>
              {/* Dynamic SVG Waveform path */}
              <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} style={{
                borderRadius: "8px",
                background: "rgba(251, 248, 243, 0.4)",
                border: "1px solid rgba(156, 122, 47, 0.08)"
              }}>
                <path d={pathD} fill="none" stroke={isVibrating ? GOLD : "rgba(156, 122, 47, 0.2)"} strokeWidth="2.5" />
                {/* Horizontal Center line */}
                <line x1="0" y1={yCenter} x2={width} y2={yCenter} stroke="rgba(156, 122, 47, 0.15)" strokeDasharray="4,4" />
              </svg>

              {/* Vibration Status text */}
              <div style={{ marginTop: "12px", textAlign: "center" }}>
                <span style={{ fontSize: "10.5px", fontWeight: 800, color: GOLD_DEEP, letterSpacing: "1px", textTransform: "uppercase" }}>
                  Status: {isVibrating ? "Vibrating Causal Space" : "Apathetically Muted"}
                </span>
              </div>
            </div>

            {/* Controller Block */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", background: SURFACE_MANUSCRIPT, padding: "10px 12px", borderRadius: "10px", border: "1px dashed rgba(156,122,47,0.2)" }}>
                <Info size={14} style={{ color: GOLD, marginTop: "2px", flexShrink: 0 }} />
                <p style={{ margin: 0, fontSize: "11px", lineHeight: "1.4", color: INK_SECONDARY }}>
                  <strong>Doctrinal Principle:</strong> Mantras do not rely on standard verbal meaning. The cosmic vibration acts directly as an energetic catalyst (causal space) to alter mental templates. Use sliders to change frequency/amplitude parameters.
                </p>
              </div>

              {/* Controls */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", background: "rgba(255, 255, 255, 0.4)", padding: "12px", border: "1px solid rgba(156, 122, 47, 0.1)", borderRadius: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label style={{ fontSize: "11.5px", fontWeight: 700, color: INK_SECONDARY }}>Vibration Frequency (Sonic Pitch)</label>
                  <span style={{ fontSize: "11px", fontWeight: 800, color: GOLD }}>Level {frequency}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={frequency}
                  onChange={(e) => {
                    const ctx = resumeAudioContext();
                    triggerVibration(20);
                    const val = Number(e.target.value);
                    setFrequency(val);
                    if (isVibrating && ctx) {
                      startDrone(ctx, val, amplitude);
                    }
                  }}
                  disabled={!isVibrating}
                  style={{ width: "100%", accentColor: GOLD, cursor: isVibrating ? "pointer" : "not-allowed" }}
                />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                  <label style={{ fontSize: "11.5px", fontWeight: 700, color: INK_SECONDARY }}>Vibration Amplitude (Pranic Volume)</label>
                  <span style={{ fontSize: "11px", fontWeight: 800, color: GOLD }}>Level {amplitude}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={amplitude}
                  onChange={(e) => {
                    const ctx = resumeAudioContext();
                    triggerVibration(20);
                    const val = Number(e.target.value);
                    setAmplitude(val);
                    if (isVibrating && ctx) {
                      startDrone(ctx, frequency, val);
                    }
                  }}
                  disabled={!isVibrating}
                  style={{ width: "100%", accentColor: GOLD, cursor: isVibrating ? "pointer" : "not-allowed" }}
                />

                <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
                  <button
                    onClick={() => {
                      const ctx = resumeAudioContext();
                      triggerVibration(100);
                      const next = !isVibrating;
                      setIsVibrating(next);
                      if (next && ctx) {
                        startDrone(ctx, frequency, amplitude);
                      } else {
                        stopDrone();
                      }
                    }}
                    style={{
                      flex: 1,
                      padding: "8px",
                      borderRadius: "6px",
                      border: `1px solid ${GOLD}`,
                      background: isVibrating ? "transparent" : GOLD,
                      color: isVibrating ? GOLD_DEEP : "#ffffff",
                      fontSize: "11px",
                      fontWeight: 750,
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                  >
                    {isVibrating ? "Mute Emitter" : "Activate Vibration"}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB CONTENT: BĪJA SEEDS */}
      {activeTab === "bijas" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: "16px", flexWrap: "wrap" }}>
            
            {/* List and Selector */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {BIJAS.map((bija, idx) => {
                const isActive = activeBijaIndex === idx;
                return (
                  <div
                    key={bija.syllable}
                    onClick={() => {
                      resumeAudioContext();
                      triggerVibration(40);
                      setActiveBijaIndex(idx);
                      setIsPlaying(false);
                    }}
                    className="bija-card"
                    style={{
                      padding: "12px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      borderLeft: isActive ? `4px solid ${GOLD}` : "1px solid rgba(156, 122, 47, 0.1)",
                      background: isActive ? "rgba(251, 248, 243, 0.85)" : "rgba(255, 255, 255, 0.45)"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <span style={{ fontSize: "16px", fontWeight: 800, color: GOLD_DEEP }}>
                          {bija.syllable}
                        </span>
                        <span style={{ fontSize: "11px", color: INK_MUTED, marginLeft: "8px" }}>
                          ({bija.devanagari})
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          resumeAudioContext();
                          triggerVibration(80);
                          startBijaPlayback(idx);
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          border: "none",
                          background: isActive && isPlaying ? GOLD : "rgba(156, 122, 47, 0.08)",
                          color: isActive && isPlaying ? "#ffffff" : GOLD_DEEP,
                          cursor: "pointer",
                          transition: "all 0.2s ease"
                        }}
                      >
                        <Volume2 size={13} />
                      </button>
                    </div>
                    <div style={{ fontSize: "10px", color: INK_SECONDARY, marginTop: "4px" }}>
                      Force: {bija.deityForce.split(" / ")[0]}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detail Panel */}
            <div style={{
              background: "rgba(255, 253, 248, 0.9)",
              border: `1px solid rgba(156,122,47,0.15)`,
              borderRadius: "12px",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              justifyContent: "space-between"
            }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(156,122,47,0.08)", paddingBottom: "6px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 800, color: GOLD_DEEP }}>
                    Seed Sound: {BIJAS[activeBijaIndex].syllable} ({BIJAS[activeBijaIndex].devanagari})
                  </span>
                  <span style={{ fontSize: "10px", fontWeight: 700, color: GOLD, textTransform: "uppercase" }}>
                    Bīja Sound
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "11px" }}>
                  <div>
                    <strong style={{ color: INK_SECONDARY }}>Force/Deity Representation:</strong>
                    <div style={{ color: INK_PRIMARY, marginTop: "1px" }}>{BIJAS[activeBijaIndex].deityForce}</div>
                  </div>
                  <div>
                    <strong style={{ color: INK_SECONDARY }}>Sonic Vibration Profile:</strong>
                    <div style={{ color: INK_PRIMARY, marginTop: "1px" }}>{BIJAS[activeBijaIndex].vibration}</div>
                  </div>
                  <div>
                    <strong style={{ color: INK_SECONDARY }}>Jyotiṣa Planetary Resonator:</strong>
                    <div style={{ color: INK_PRIMARY, marginTop: "1px" }}>{BIJAS[activeBijaIndex].planetLink}</div>
                  </div>
                  <div style={{ background: "rgba(156,122,47,0.05)", padding: "8px", borderRadius: "6px", border: "1px dashed rgba(156,122,47,0.1)" }}>
                    <strong style={{ color: GOLD_DEEP }}>Pronunciation Discipline:</strong>
                    <div style={{ color: INK_PRIMARY, marginTop: "2px", lineHeight: "1.3" }}>{BIJAS[activeBijaIndex].tip}</div>
                  </div>
                </div>
              </div>

              {/* Animated player status when playing */}
              <div style={{
                height: "36px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(255, 255, 255, 0.5)",
                border: "1px solid rgba(156, 122, 47, 0.08)",
                borderRadius: "8px",
                padding: "0 10px"
              }}>
                {isPlaying ? (
                  <>
                    <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", width: "30px", height: "30px" }}>
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          style={{
                            width: "3px",
                            background: GOLD,
                            borderRadius: "1px",
                            animation: `soundbar 0.8s ease-in-out infinite`,
                            animationDelay: `${i * 0.15}s`
                          }}
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: "10px", color: GOLD_DEEP, fontWeight: 700 }}>
                      Listening simulation: "{BIJAS[activeBijaIndex].syllable}" playing...
                    </span>
                  </>
                ) : (
                  <span style={{ fontSize: "10px", color: INK_MUTED, fontStyle: "italic" }}>
                    Click the speaker icon to simulate listening.
                  </span>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

      {/* TAB CONTENT: MĀTṚKĀ MATRIX */}
      {activeTab === "matrika" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          
          <div style={{ display: "flex", alignItems: "flex-start", gap: "6px", background: "rgba(156,122,47,0.05)", padding: "8px 12px", borderRadius: "8px", fontSize: "11px", color: INK_SECONDARY }}>
            <Grid size={14} style={{ color: GOLD, marginTop: "2px" }} />
            <span>
              The <strong>Mātṛkā ("matrix")</strong> consists of the ~50 Sanskrit letters representing primal vibrations. In mantra theory, the body contains these sounds as nodes. Select any phoneme to view its classification.
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "16px", flexWrap: "wrap", marginTop: "4px" }}>
            
            {/* The Alphabet Grid Classified by grammar Vargas */}
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              background: "rgba(255,255,255,0.45)",
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid rgba(156,122,47,0.08)",
              maxHeight: "360px",
              overflowY: "auto"
            }}>
              {PHONEME_GROUPS.map(group => (
                <div key={group.name} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span style={{ fontSize: "9px", fontWeight: 800, color: GOLD_DEEP, textTransform: "uppercase", letterSpacing: "0.2px" }}>
                    {group.name}
                  </span>
                  <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "4px"
                  }}>
                    {group.items.map(item => {
                      const isSelected = selectedPhoneme?.char === item.char;
                      return (
                        <button
                          key={item.char}
                          onClick={() => {
                            resumeAudioContext();
                            triggerVibration(60);
                            setSelectedPhoneme(item);
                          }}
                          className="phoneme-btn"
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "36px",
                            height: "36px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            border: isSelected ? `2.5px solid ${GOLD}` : "1px solid rgba(156, 122, 47, 0.12)",
                            background: isSelected ? "rgba(156, 122, 47, 0.15)" : "rgba(255, 255, 255, 0.65)",
                            fontWeight: isSelected ? 800 : "normal"
                          }}
                        >
                          <span style={{ fontSize: "13px", color: INK_PRIMARY, fontWeight: 800 }}>{item.char}</span>
                          <span style={{ fontSize: "8px", color: INK_MUTED, marginTop: "1px" }}>{item.iast}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Inspector detail */}
            <div style={{
              background: "rgba(255, 253, 248, 0.9)",
              border: `1px solid rgba(156,122,47,0.15)`,
              borderRadius: "10px",
              padding: "12px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              minHeight: "180px",
              alignSelf: "flex-start"
            }}>
              {selectedPhoneme ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "8px",
                      background: "rgba(156,122,47,0.08)",
                      border: `1.5px solid ${GOLD}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "20px",
                      fontWeight: 800,
                      color: GOLD_DEEP
                    }}>
                      {selectedPhoneme.char}
                    </div>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 800, color: INK_PRIMARY }}>
                        IAST: {selectedPhoneme.iast}
                      </div>
                      <div style={{ fontSize: "10px", color: GOLD, fontWeight: 700, textTransform: "uppercase" }}>
                        Category: {selectedPhoneme.cat || "Matrix sound"}
                      </div>
                    </div>
                  </div>

                  <div style={{ borderTop: "1px solid rgba(156,122,47,0.08)", paddingTop: "8px", marginTop: "4px" }}>
                    <strong style={{ fontSize: "10px", color: INK_SECONDARY }}>Sonic & Pranic Action:</strong>
                    <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: INK_PRIMARY, lineHeight: "1.3" }}>
                      {selectedPhoneme.desc}
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: "center", color: INK_MUTED, padding: "20px" }}>
                  <Info size={24} style={{ color: GOLD, margin: "0 auto 8px auto", opacity: 0.7 }} />
                  <span style={{ fontSize: "11px" }}>Select any Sanskrit phoneme character to inspect its vibration profile.</span>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* TAB CONTENT: PRONUNCIATION */}
      {activeTab === "pronunciation" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          
          <div style={{ display: "flex", gap: "8px", background: "rgba(156,122,47,0.04)", padding: "10px", border: "1px solid rgba(156, 122, 47, 0.08)", borderRadius: "8px" }}>
            <AlertTriangle size={15} style={{ color: GOLD, flexShrink: 0, marginTop: "2px" }} />
            <p style={{ margin: 0, fontSize: "11px", lineHeight: "1.4", color: INK_SECONDARY }}>
              <strong>Pronunciation is the Mantra:</strong> Because the mechanism is vibration, altering the phonemes creates a different sound shape, leading to a different/neutralized effect. Flat English transliterations run the risk of neutralizing the mantra's efficacy.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {COMPARISONS.map(comp => (
              <div
                key={comp.id}
                style={{
                  background: "rgba(255, 255, 255, 0.4)",
                  border: "1px solid rgba(156, 122, 47, 0.12)",
                  borderRadius: "10px",
                  padding: "12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(156,122,47,0.06)", paddingBottom: "6px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 850, color: GOLD_DEEP }}>
                    Seed: {comp.syllable}
                  </span>
                  <span style={{ fontSize: "9px", background: "rgba(156,122,47,0.06)", padding: "2px 6px", borderRadius: "4px", color: GOLD_DEEP, fontWeight: 700 }}>
                    Phonetic Deviation Analysis
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "12px", flexWrap: "wrap" }}>
                  {/* Left Column: Correct vs Altered */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ display: "inline-block", width: "45px", fontSize: "9px", background: "#4e7037", color: "#ffffff", padding: "1px 4px", borderRadius: "3px", fontWeight: 800, textAlign: "center" }}>IAST</span>
                      <span style={{ fontSize: "11px", fontWeight: 750, color: INK_PRIMARY }}>{comp.correct}</span>
                      <button
                        onClick={() => {
                          resumeAudioContext();
                          triggerVibration(40);
                          playComparisonSynth(comp.syllable, true);
                        }}
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          color: GOLD,
                          padding: "2px",
                          display: "inline-flex",
                          alignItems: "center"
                        }}
                        title="Play Correct Resonance"
                      >
                        <Volume2 size={12} />
                      </button>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ display: "inline-block", width: "45px", fontSize: "9px", background: "#ad4b37", color: "#ffffff", padding: "1px 4px", borderRadius: "3px", fontWeight: 800, textAlign: "center" }}>ALTERED</span>
                      <span style={{ fontSize: "11px", color: INK_MUTED }}>"{comp.altered}"</span>
                      <button
                        onClick={() => {
                          resumeAudioContext();
                          triggerVibration(40);
                          playComparisonSynth(comp.syllable, false);
                        }}
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          color: INK_MUTED,
                          padding: "2px",
                          display: "inline-flex",
                          alignItems: "center"
                        }}
                        title="Play Flat/Altered Sound"
                      >
                        <Volume2 size={12} />
                      </button>
                    </div>
                    <div style={{ fontSize: "10px", color: INK_SECONDARY, borderTop: "1px dashed rgba(0,0,0,0.05)", paddingTop: "4px", marginTop: "2px" }}>
                      <strong>Sonic Drift:</strong> {comp.difference}
                    </div>
                  </div>

                  {/* Right Column: Theoretical Impact */}
                  <div style={{ background: "rgba(255, 253, 248, 0.8)", border: "1px solid rgba(156, 122, 47, 0.08)", borderRadius: "6px", padding: "8px", display: "flex", flexDirection: "column", gap: "4px" }}>
                    <div style={{ fontSize: "9px", fontWeight: 800, color: GOLD, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Energetic Outcome
                    </div>
                    <p style={{ margin: 0, fontSize: "10.5px", color: INK_PRIMARY, lineHeight: "1.3" }}>
                      {comp.effect}
                    </p>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: "1px solid rgba(156,122,47,0.08)",
        paddingTop: "8px",
        fontSize: "10px",
        color: INK_MUTED
      }}>
        <span>Grahvani Learning Runtime (Chapter 2)</span>
        <span>Honesty & Precision Focus</span>
      </div>
    </div>
  );
}
