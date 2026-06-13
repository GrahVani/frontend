"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, AlertTriangle, ShieldAlert, BookOpen, Volume2, Info, ChevronRight, Sliders, Music } from "lucide-react";

const GOLD = "var(--gl-gold-accent, #9C7A2F)";
const GOLD_DEEP = "var(--gl-gold-deep, #7A5E1E)";
const INK_PRIMARY = "var(--gl-ink-on-cream-primary, #2d261e)";
const INK_SECONDARY = "var(--gl-ink-on-cream-secondary, #4d4133)";
const INK_MUTED = "var(--gl-ink-on-cream-muted, #7c6d5b)";
const SURFACE_MANUSCRIPT = "var(--gl-surface-manuscript, rgba(251,248,243,0.6))";

const REPERTOIRE = [
  {
    id: "gayatri",
    name: "Gāyatrī Mantra",
    devanagariName: "गायत्री मन्त्र",
    tradition: "Vaidika (Ṛg Veda)",
    theme: "Sun / Illumination / Wisdom",
    planet: "Sun (Sūrya)",
    devanagari: "तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् ॥",
    iast: "tat savitur vareṇyaṁ bhargo devasya dhīmahi dhiyo yo naḥ pracodayāt ||",
    literalTranslation: "We meditate upon the glorious splendor of the divine Sun; may that divine light inspire and illuminate our intellect.",
    honestyNote: null
  },
  {
    id: "mahamrityunjaya",
    name: "Mahāmṛtyuñjaya (Tryambakam)",
    devanagariName: "महामृत्युञ्जय मन्त्र",
    tradition: "Vaidika (Ṛg / Yajur)",
    theme: "Health / Longevity / Śiva",
    planet: "Saturn / Rahu / Ketu",
    devanagari: "त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् । उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात् ॥",
    iast: "tryambakaṁ yajāmahe sugandhiṁ puṣṭi-vardhanam | urvārukam iva bandhanān mṛtyor mukṣīya mā 'mṛtāt ||",
    literalTranslation: "We worship the three-eyed one (Lord Śiva), who is fragrant and who nourishes all. Just as a cucumber is liberated from its stalk, may He liberate us from death for the sake of immortality.",
    honestyNote: null
  },
  {
    id: "hanuman",
    name: "Hanuman Stuti (Manojavaṁ)",
    devanagariName: "हनुमन्-स्तुतिः",
    tradition: "Devotional / Smārta",
    theme: "Strength / Courage",
    planet: "Mars (Maṅgala)",
    devanagari: "मनोजवं मारुततुल्यवेगं जितेन्द्रियं बुद्धिमतां वरिष्ठम् । वातात्मजं वानरयूथमुख्यं श्रीरामदूतं शरणं प्रपद्ये ॥",
    iast: "manojavaṁ māruta-tulya-vegaṁ jitendriyaṁ buddhimatāṁ variṣṭham | vātātmajaṁ vānara-yūtha-mukhyaṁ śrī-rāma-dūtaṁ śaraṇaṁ prapadye ||",
    literalTranslation: "I take refuge in the messenger of Śrī Rāma, who is swift as the mind, quick as the wind, master of the senses, foremost among the wise, and chief among the vanaras.",
    honestyNote: "Honesty Disclosure: The famous 'Hanuman Cālīsā' is a beloved bhakti composition written by Tulsidas in Awadhi (a dialect of Hindi), not classical Sanskrit or Vedic. While excellent for personal practice, it is classified as a devotional composition. The classical Sanskrit 'Manojavaṁ' stuti is supplied here as the Sanskrit alternative for core study."
  },
  {
    id: "shri_sukta",
    name: "Śrī (Lakṣmī) Sūkta (Verse 1)",
    devanagariName: "श्री सूक्तम् (ऋक् १)",
    tradition: "Vaidika (Ṛg Veda Pariśiṣṭa)",
    theme: "Wealth / Prosperity",
    planet: "Venus (Śukra) / Moon",
    devanagari: "हिरण्यवर्णां हरिणीं सुवर्णरजतस्रजाम् । चन्द्रां हिरण्मयीं लक्ष्मीं जातवेदो म आवह ॥",
    iast: "hiraṇya-varṇāṁ hariṇīṁ suvarṇa-rajata-srajām | candrāṁ hiraṇmayīṁ lakṣmīṁ jāta-vedo ma āvaha ||",
    literalTranslation: "O Jatavedas (Agni), invoke for me that Lakṣmī who is golden-hued, radiant like gold and silver, shining like the Moon, and full of prosperity.",
    honestyNote: null
  },
  {
    id: "sarasvati",
    name: "Sarasvatī Praṇāma Mantra",
    devanagariName: "सरस्वती प्रणाम मन्त्र",
    tradition: "Devotional / Smārta",
    theme: "Learning / Speech / Wisdom",
    planet: "Mercury (Budha) / Jupiter",
    devanagari: "सरस्वती नमस्तुभ्यं वरदे कामरूपिणी । विद्यारम्भं करिष्यामी सिद्धिर्भवतु मे सदा ॥",
    iast: "sarasvatī namas-tubhyaṁ vara-de kāma-rūpiṇī | vidyārambhaṁ kariṣyāmi siddhir bhavatu me sadā ||",
    literalTranslation: "Salutations to Sarasvatī, the giver of boons, who fulfills desires. I am beginning my studies; may there always be success for me.",
    honestyNote: null
  }
];

// ────────────────────────────────────────────────────────────────
// TUNING PROFILES — declared once, outside the component
// ────────────────────────────────────────────────────────────────
interface TuningProfile {
  freqs: number[];
  waveformType: OscillatorType;
  baseLfoFreq: number;
  lfoDepth: number;
}

const TUNING_PROFILES: Record<string, TuningProfile> = {
  gayatri: {
    freqs: [220.00, 146.83, 185.00, 293.66],
    waveformType: "sine",
    baseLfoFreq: 0.25,
    lfoDepth: 0.02,
  },
  mahamrityunjaya: {
    freqs: [110.00, 146.83, 73.42, 147.83],
    waveformType: "triangle",
    baseLfoFreq: 0.15,
    lfoDepth: 0.02,
  },
  hanuman: {
    freqs: [196.00, 130.81, 261.63, 131.81],
    waveformType: "triangle",
    baseLfoFreq: 0.8,
    lfoDepth: 0.04,
  },
  shri_sukta: {
    freqs: [220.00, 174.61, 261.63, 349.23],
    waveformType: "sine",
    baseLfoFreq: 0.3,
    lfoDepth: 0.02,
  },
  sarasvati: {
    freqs: [293.66, 196.00, 246.94, 392.00],
    waveformType: "triangle",
    baseLfoFreq: 0.25,
    lfoDepth: 0.02,
  },
};

const DEFAULT_PROFILE: TuningProfile = {
  freqs: [220.00, 146.83, 147.83, 73.42],
  waveformType: "triangle",
  baseLfoFreq: 0.25,
  lfoDepth: 0.02,
};

// ────────────────────────────────────────────────────────────────
// AUDIO ENGINE — imperative, lives entirely in refs, never
// touched by React effects except unmount cleanup.
// ────────────────────────────────────────────────────────────────
interface AudioEngine {
  ctx: AudioContext | null;
  oscs: OscillatorNode[];
  gains: GainNode[];
  lfo: OscillatorNode | null;
  lfoGain: GainNode | null;
  master: GainNode | null;
  fadeTimer: ReturnType<typeof setTimeout> | null;
}

function createEngine(): AudioEngine {
  return {
    ctx: null,
    oscs: [],
    gains: [],
    lfo: null,
    lfoGain: null,
    master: null,
    fadeTimer: null,
  };
}

export function FoundationalMantraPlayer() {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(1);

  const activeMantra = REPERTOIRE[selectedIndex];

  // ── Ref-based audio engine (immune to React re-renders) ──
  const engineRef = useRef<AudioEngine>(createEngine());
  // Mirror isPlaying into a ref so interval callbacks always
  // see the freshest value without depending on React state.
  const isPlayingRef = useRef(false);
  const speedRef = useRef(speed);

  // Keep refs in sync with state
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { speedRef.current = speed; }, [speed]);

  // ── AudioContext helpers ──

  const ensureAudioContext = useCallback((): AudioContext | null => {
    if (typeof window === "undefined") return null;
    const eng = engineRef.current;
    if (!eng.ctx || eng.ctx.state === "closed") {
      try {
        const Ctor = window.AudioContext || (window as any).webkitAudioContext;
        if (Ctor) eng.ctx = new Ctor();
      } catch (err) {
        console.error("[MantraPlayer] Failed to create AudioContext:", err);
        return null;
      }
    }
    if (eng.ctx && eng.ctx.state === "suspended") {
      eng.ctx.resume().catch(() => {});
    }
    return eng.ctx;
  }, []);

  const triggerVibration = useCallback((pattern: number | number[]) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try { navigator.vibrate(pattern); } catch (_) {}
    }
  }, []);

  // ── Core audio start / stop ──

  const killAudioNodes = useCallback(() => {
    const eng = engineRef.current;
    if (eng.fadeTimer) { clearTimeout(eng.fadeTimer); eng.fadeTimer = null; }
    eng.oscs.forEach(o => { try { o.stop(); o.disconnect(); } catch (_) {} });
    eng.oscs = [];
    eng.gains.forEach(g => { try { g.disconnect(); } catch (_) {} });
    eng.gains = [];
    if (eng.lfo) { try { eng.lfo.stop(); eng.lfo.disconnect(); } catch (_) {} eng.lfo = null; }
    if (eng.lfoGain) { try { eng.lfoGain.disconnect(); } catch (_) {} eng.lfoGain = null; }
    if (eng.master) { try { eng.master.disconnect(); } catch (_) {} eng.master = null; }
  }, []);

  const stopAudio = useCallback((immediate = false) => {
    const eng = engineRef.current;
    if (!eng.master || immediate) { killAudioNodes(); return; }
    // Graceful 250 ms fade-out then cleanup
    try {
      const ctx = eng.ctx;
      if (ctx) {
        const now = ctx.currentTime;
        eng.master.gain.cancelScheduledValues(now);
        eng.master.gain.setValueAtTime(eng.master.gain.value, now);
        eng.master.gain.linearRampToValueAtTime(0, now + 0.25);
      }
    } catch (_) {}
    eng.fadeTimer = setTimeout(killAudioNodes, 300);
  }, [killAudioNodes]);

  const startAudio = useCallback((mantraId: string, currentSpeed: number) => {
    const ctx = ensureAudioContext();
    if (!ctx) { console.warn("[MantraPlayer] No AudioContext"); return; }

    // Always kill existing nodes first (immediate)
    killAudioNodes();

    const profile = TUNING_PROFILES[mantraId] || DEFAULT_PROFILE;
    const eng = engineRef.current;
    const now = ctx.currentTime;

    // ── Master gain — audible volume (0.18 peak) ──
    const master = ctx.createGain();
    master.gain.setValueAtTime(0, now);
    master.gain.linearRampToValueAtTime(0.18, now + 0.3);
    master.connect(ctx.destination);
    eng.master = master;

    // ── Per-voice oscillators ──
    profile.freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = idx === 3 ? "sine" : profile.waveformType;
      osc.frequency.setValueAtTime(freq, now);

      // Sarasvatī: flowing pitch slide on voice 2
      if (mantraId === "sarasvati" && idx === 2) {
        osc.frequency.linearRampToValueAtTime(freq + 10, now + 1.5);
        osc.frequency.linearRampToValueAtTime(freq, now + 3.0);
      }

      const vol = idx >= 2 ? 0.45 : 0.3;
      gain.gain.setValueAtTime(vol, now);

      osc.connect(gain);
      gain.connect(master);
      osc.start(now);

      eng.oscs.push(osc);
      eng.gains.push(gain);
    });

    // ── LFO (breathing swell) ──
    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(profile.baseLfoFreq * currentSpeed, now);

    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(profile.lfoDepth, now);

    lfo.connect(lfoGain);
    lfoGain.connect(master.gain);
    lfo.start(now);

    eng.lfo = lfo;
    eng.lfoGain = lfoGain;

    console.log("[MantraPlayer] ▶ Audio started for", mantraId, "@ speed", currentSpeed);
  }, [ensureAudioContext, killAudioNodes]);

  // ── Adjust LFO when speed changes while playing ──
  const adjustLfo = useCallback((mantraId: string, newSpeed: number) => {
    const eng = engineRef.current;
    if (!eng.lfo || !eng.ctx) return;
    const profile = TUNING_PROFILES[mantraId] || DEFAULT_PROFILE;
    try {
      eng.lfo.frequency.setTargetAtTime(
        profile.baseLfoFreq * newSpeed,
        eng.ctx.currentTime,
        0.1
      );
    } catch (_) {}
  }, []);

  // ── Unmount cleanup only ──
  useEffect(() => {
    return () => { killAudioNodes(); };
  }, [killAudioNodes]);

  // ── Speed change while playing → adjust LFO ──
  useEffect(() => {
    if (isPlaying) adjustLfo(activeMantra.id, speed);
  }, [speed, isPlaying, activeMantra.id, adjustLfo]);

  // ── Progress simulation ──
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          // Completed — stop audio & reset
          isPlayingRef.current = false;
          setIsPlaying(false);
          stopAudio();
          return 0;
        }
        return prev + 1.5 * speedRef.current;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying, stopAudio]);

  // ── User actions ──

  const togglePlay = () => {
    ensureAudioContext();
    triggerVibration(80);
    const next = !isPlaying;
    if (next) {
      if (progress >= 98) setProgress(0);
      startAudio(activeMantra.id, speed);
    } else {
      stopAudio();
    }
    isPlayingRef.current = next;
    setIsPlaying(next);
  };

  const selectMantra = (idx: number) => {
    ensureAudioContext();
    triggerVibration(50);
    // Stop anything playing (immediate) before switching
    if (isPlayingRef.current) {
      killAudioNodes();
    }
    isPlayingRef.current = false;
    setIsPlaying(false);
    setProgress(0);
    setSelectedIndex(idx);
  };

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
      
      {/* Styles for animation waves and active list rows */}
      <style>{`
        @keyframes bounce-wave {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1.1); }
        }
        .bounce-bar {
          width: 3px;
          height: 100%;
          background: ${GOLD};
          border-radius: 1px;
          transform-origin: bottom;
          transform: scaleY(0.3);
        }
        .bounce-bar-active {
          animation: bounce-wave var(--bounce-duration, 1.2s) ease-in-out infinite;
        }
        .mantra-row {
          border: 1px solid rgba(156,122,47,0.08);
          background: rgba(255, 255, 255, 0.45);
          transition: all 0.2s ease-in-out;
        }
        .mantra-row:hover {
          border-color: ${GOLD};
          background: rgba(251,248,243,0.8);
          box-shadow: 0 2px 8px rgba(156,122,47,0.06);
          transform: translateX(2px);
        }
      `}</style>

      {/* WARNING HEADER */}
      <div style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
        background: "rgba(173, 75, 55, 0.06)",
        border: "1px solid rgba(173, 75, 55, 0.2)",
        borderRadius: "10px",
        padding: "10px 14px"
      }}>
        <ShieldAlert size={18} style={{ color: "#ad4b37", flexShrink: 0, marginTop: "2px" }} />
        <div>
          <strong style={{ fontSize: "11.5px", color: "#762e21" }}>Pedagogical Limitation Warning:</strong>
          <p style={{ margin: "2px 0 0 0", fontSize: "11px", lineHeight: "1.4", color: "#762e21" }}>
            This player offers <strong>theoretical exposure</strong> for pronunciation alignment. As a Tier-1 student/graduate, you are trained to <strong>explain</strong> these mantras, <strong>never prescribe</strong> them to clients. Prescription authority is gated to Tier-2 (Module 21) and Ethics (Module 24).
          </p>
        </div>
      </div>

      {/* DASHBOARD GRID */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1.3fr",
        gap: "16px",
        flexWrap: "wrap",
        marginTop: "4px"
      }}>
        
        {/* LEFT COLUMN: LIST */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <span style={{ fontSize: "10.5px", fontWeight: 700, color: INK_MUTED, textTransform: "uppercase" }}>
            Foundational Repertoire
          </span>
          {REPERTOIRE.map((mantra, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <div
                key={mantra.id}
                onClick={() => selectMantra(idx)}
                className="mantra-row"
                style={{
                  padding: "10px 12px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  borderLeft: isSelected ? `4.5px solid ${GOLD}` : "1px solid rgba(156,122,47,0.08)",
                  background: isSelected ? "rgba(251, 248, 243, 0.85)" : "rgba(255, 255, 255, 0.45)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h5 style={{ margin: 0, fontSize: "12.5px", fontWeight: 800, color: isSelected ? GOLD_DEEP : INK_PRIMARY }}>
                      {mantra.name}
                    </h5>
                    <p style={{ margin: "2px 0 0 0", fontSize: "10px", color: INK_MUTED }}>
                      Theme: {mantra.theme.split(" / ")[0]}
                    </p>
                  </div>
                  <ChevronRight size={14} style={{ color: isSelected ? GOLD : INK_MUTED, opacity: isSelected ? 1 : 0.4 }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT COLUMN: PLAYER */}
        <div style={{
          background: "rgba(255, 253, 248, 0.9)",
          border: `1px solid rgba(156,122,47,0.15)`,
          borderRadius: "12px",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          justifyContent: "space-between"
        }}>
          {/* Header Metadata */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(0,0,0,0.06)", paddingBottom: "6px", marginBottom: "8px" }}>
              <span style={{ fontSize: "13px", fontWeight: 850, color: GOLD_DEEP }}>
                {activeMantra.name}
              </span>
              <span style={{ fontSize: "9.5px", background: "rgba(156, 122, 47, 0.08)", padding: "2px 6px", borderRadius: "4px", color: GOLD_DEEP, fontWeight: 700 }}>
                {activeMantra.tradition}
              </span>
            </div>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", fontSize: "10.5px", color: INK_SECONDARY }}>
              <span><strong>Focus:</strong> {activeMantra.theme}</span>
              <span>•</span>
              <span><strong>Graha:</strong> {activeMantra.planet}</span>
            </div>
          </div>

          {/* Texts block */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", minHeight: "100px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "9px", fontWeight: 800, color: GOLD }}>DEVANĀGARĪ</span>
              <p style={{ margin: 0, fontSize: "13.5px", fontWeight: 800, color: INK_PRIMARY, lineHeight: "1.4" }}>
                {activeMantra.devanagari}
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px", borderTop: "1px dashed rgba(156,122,47,0.08)", paddingTop: "6px" }}>
              <span style={{ fontSize: "9px", fontWeight: 800, color: GOLD }}>IAST</span>
              <p style={{ margin: 0, fontSize: "11px", fontWeight: 700, color: GOLD_DEEP, fontStyle: "italic", lineHeight: "1.3" }}>
                {activeMantra.iast}
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px", borderTop: "1px dashed rgba(156,122,47,0.08)", paddingTop: "6px" }}>
              <span style={{ fontSize: "9px", fontWeight: 800, color: GOLD }}>MEANING</span>
              <p style={{ margin: 0, fontSize: "10.5px", color: INK_SECONDARY, lineHeight: "1.3" }}>
                {activeMantra.literalTranslation}
              </p>
            </div>
          </div>

          {/* HONESTY NOTE (FOR HANUMAN) */}
          {activeMantra.honestyNote && (
            <div style={{
              background: "rgba(156,122,47,0.05)",
              border: "1px dashed rgba(156,122,47,0.2)",
              borderRadius: "8px",
              padding: "8px 10px",
              fontSize: "10px",
              lineHeight: "1.35",
              color: INK_SECONDARY
            }}>
              <strong style={{ color: GOLD_DEEP }}>Honest Translation Context:</strong> {activeMantra.honestyNote}
            </div>
          )}

          {/* AUDIO CONTROLS PANEL */}
          <div style={{
            background: "rgba(255, 255, 255, 0.6)",
            border: "1px solid rgba(156,122,47,0.1)",
            borderRadius: "10px",
            padding: "12px",
            display: "flex",
            flexDirection: "column",
            gap: "10px"
          }}>
            
            {/* Timeline & Waveform visualizer */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
              {/* Progress track */}
              <div style={{ flex: 1, height: "4px", background: "rgba(156,122,47,0.12)", borderRadius: "2px", position: "relative" }}>
                <div style={{ width: `${progress}%`, height: "100%", background: GOLD, borderRadius: "2px", transition: "width 0.1s linear" }} />
              </div>

              {/* Waveform indicator */}
              <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", width: "40px", height: "20px" }}>
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={`bounce-bar ${isPlaying ? "bounce-bar-active" : ""}`}
                    style={{
                      "--bounce-duration": `${1 + (i * 0.15)}s`,
                      height: "100%"
                    } as any}
                  />
                ))}
              </div>
            </div>

            {/* Buttons & Sliders */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
              {/* Play Pause Button */}
              <button
                onClick={togglePlay}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  border: "none",
                  background: isPlaying ? GOLD_DEEP : GOLD,
                  color: "#ffffff",
                  fontSize: "11px",
                  fontWeight: 750,
                  cursor: "pointer",
                  transition: "background 0.2s"
                }}
              >
                {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                {isPlaying ? "Pause Simulation" : "Listen (Simulate)"}
              </button>

              {/* Speed Controller */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Sliders size={12} style={{ color: GOLD_DEEP }} />
                <span style={{ fontSize: "10px", color: INK_SECONDARY, fontWeight: 700 }}>Tempo:</span>
                <select
                  value={speed}
                  onChange={(e) => {
                    ensureAudioContext();
                    triggerVibration(30);
                    setSpeed(Number(e.target.value));
                  }}
                  style={{
                    fontSize: "10px",
                    background: "#ffffff",
                    border: "1px solid rgba(156,122,47,0.15)",
                    borderRadius: "4px",
                    padding: "2px 4px",
                    color: INK_PRIMARY,
                    fontWeight: 700
                  }}
                >
                  <option value={0.75}>0.75x (Slow practice)</option>
                  <option value={1}>1.00x (Standard)</option>
                  <option value={1.25}>1.25x (Fluent)</option>
                </select>
              </div>
            </div>

          </div>

        </div>

      </div>

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
        <span>Foundational Five Player</span>
      </div>
    </div>
  );
}
