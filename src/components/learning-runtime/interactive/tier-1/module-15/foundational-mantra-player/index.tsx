"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, ShieldAlert, ChevronRight, Sliders } from "lucide-react";

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
    planetColor: "#f59e0b",
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
    planetColor: "#6366f1",
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
    planetColor: "#ef4444",
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
    planetColor: "#22d3ee",
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
    planetColor: "#10b981",
    devanagari: "सरस्वती नमस्तुभ्यं वरदे कामरूपिणी । विद्यारम्भं करिष्यामी सिद्धिर्भवतु मे सदा ॥",
    iast: "sarasvatī namas-tubhyaṁ vara-de kāma-rūpiṇī | vidyārambhaṁ kariṣyāmi siddhir bhavatu me sadā ||",
    literalTranslation: "Salutations to Sarasvatī, the giver of boons, who fulfills desires. I am beginning my studies; may there always be success for me.",
    honestyNote: null
  }
];

interface TuningProfile {
  freqs: number[];
  waveformType: OscillatorType;
  baseLfoFreq: number;
  lfoDepth: number;
}

const TUNING_PROFILES: Record<string, TuningProfile> = {
  gayatri: { freqs: [220.00, 146.83, 185.00, 293.66], waveformType: "sine", baseLfoFreq: 0.25, lfoDepth: 0.02 },
  mahamrityunjaya: { freqs: [110.00, 146.83, 73.42, 147.83], waveformType: "triangle", baseLfoFreq: 0.15, lfoDepth: 0.02 },
  hanuman: { freqs: [196.00, 130.81, 261.63, 131.81], waveformType: "triangle", baseLfoFreq: 0.8, lfoDepth: 0.04 },
  shri_sukta: { freqs: [220.00, 174.61, 261.63, 349.23], waveformType: "sine", baseLfoFreq: 0.3, lfoDepth: 0.02 },
  sarasvati: { freqs: [293.66, 196.00, 246.94, 392.00], waveformType: "triangle", baseLfoFreq: 0.25, lfoDepth: 0.02 }
};

const DEFAULT_PROFILE: TuningProfile = {
  freqs: [220.00, 146.83, 147.83, 73.42],
  waveformType: "triangle",
  baseLfoFreq: 0.25,
  lfoDepth: 0.02
};

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
  return { ctx: null, oscs: [], gains: [], lfo: null, lfoGain: null, master: null, fadeTimer: null };
}

export function FoundationalMantraPlayer() {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(1);
  const [wavePhase, setWavePhase] = useState<number>(0);

  const activeMantra = REPERTOIRE[selectedIndex];
  const engineRef = useRef<AudioEngine>(createEngine());
  const isPlayingRef = useRef(false);
  const speedRef = useRef(speed);

  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { speedRef.current = speed; }, [speed]);

  const ensureAudioContext = useCallback((): AudioContext | null => {
    if (typeof window === "undefined") return null;
    const eng = engineRef.current;
    if (!eng.ctx || eng.ctx.state === "closed") {
      try {
        const Ctor = window.AudioContext || (window as any).webkitAudioContext;
        if (Ctor) eng.ctx = new Ctor();
      } catch (err) {
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
    if (!ctx) return;

    killAudioNodes();

    const profile = TUNING_PROFILES[mantraId] || DEFAULT_PROFILE;
    const eng = engineRef.current;
    const now = ctx.currentTime;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0, now);
    master.gain.linearRampToValueAtTime(0.18, now + 0.3);
    master.connect(ctx.destination);
    eng.master = master;

    profile.freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = idx === 3 ? "sine" : profile.waveformType;
      osc.frequency.setValueAtTime(freq, now);

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

    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(profile.baseLfoFreq * currentSpeed, now);

    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(profile.lfoDepth, now);

    lfo.connect(lfoGain);
    lfoGain.connect(master.gain);
    lfo.start(now);

    eng.lfo = lfo;
    eng.lfoGain = lfoGain;
  }, [ensureAudioContext, killAudioNodes]);

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

  useEffect(() => {
    return () => { killAudioNodes(); };
  }, [killAudioNodes]);

  useEffect(() => {
    if (isPlaying) adjustLfo(activeMantra.id, speed);
  }, [speed, isPlaying, activeMantra.id, adjustLfo]);

  // Phase animation loop for waveform
  useEffect(() => {
    let animFrame: number;
    const animateWave = () => {
      setWavePhase(prev => (prev + 0.1) % (Math.PI * 2));
      animFrame = requestAnimationFrame(animateWave);
    };
    if (isPlaying) {
      animFrame = requestAnimationFrame(animateWave);
    }
    return () => cancelAnimationFrame(animFrame);
  }, [isPlaying]);

  // Progress simulation
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
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
    if (isPlayingRef.current) {
      killAudioNodes();
    }
    isPlayingRef.current = false;
    setIsPlaying(false);
    setProgress(0);
    setSelectedIndex(idx);
  };

  // Generate dynamic wave path for visualizer
  const renderWavePath = () => {
    const w = 320;
    const h = 60;
    const wavePoints = [];
    const amp = isPlaying ? 16 : 3;
    const freqCount = 3.5;
    
    for (let x = 0; x <= w; x += 4) {
      const angle = (x / w) * Math.PI * 2 * freqCount + wavePhase;
      const y = h / 2 + Math.sin(angle) * amp;
      wavePoints.push(`${x},${y}`);
    }
    return `M ${wavePoints.join(" L ")}`;
  };

  // Floating planet X coordinate along the path
  const planetX = 20 + (progress / 100) * 280;

  return (
    <div style={{ padding: "16px", borderRadius: "16px", background: "rgba(255, 253, 248, 0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(156, 122, 47, 0.15)", fontFamily: "'Inter', sans-serif", color: INK_PRIMARY, maxWidth: "960px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "12px" }}>
      
      <style>{`
        .mantra-row {
          border: 1px solid rgba(156,122,47,0.08);
          background: rgba(255, 255, 255, 0.45);
          transition: all 0.2s ease-in-out;
        }
        .mantra-row:hover {
          border-color: ${GOLD};
          background: rgba(251,248,243,0.8);
          transform: translateX(2px);
        }
      `}</style>

      {/* WARNING HEADER */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", background: "rgba(173, 75, 55, 0.06)", border: "1px solid rgba(173, 75, 55, 0.2)", borderRadius: "10px", padding: "10px 14px" }}>
        <ShieldAlert size={18} style={{ color: "#ad4b37", flexShrink: 0, marginTop: "2px" }} />
        <div>
          <strong style={{ fontSize: "11.5px", color: "#762e21" }}>Pedagogical Limitation Warning:</strong>
          <p style={{ margin: "2px 0 0 0", fontSize: "11px", lineHeight: "1.4", color: "#762e21" }}>
            This player offers <strong>theoretical exposure</strong> for pronunciation alignment. As a Tier-1 student/graduate, you are trained to <strong>explain</strong> these mantras, <strong>never prescribe</strong> them to clients. Prescription authority is gated to Tier-2 (Module 21) and Ethics (Module 24).
          </p>
        </div>
      </div>

      {/* DASHBOARD GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: "16px", flexWrap: "wrap", marginTop: "4px" }}>
        
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
                  borderLeft: isSelected ? `4.5px solid ${mantra.planetColor}` : "1px solid rgba(156,122,47,0.08)",
                  background: isSelected ? "rgba(251, 248, 243, 0.85)" : "rgba(255, 255, 255, 0.45)"
                }}
              >
                <div style={{ display: "flex", justifyItems: "center", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h5 style={{ margin: 0, fontSize: "12.5px", fontWeight: 800, color: isSelected ? GOLD_DEEP : INK_PRIMARY }}>
                      {mantra.name}
                    </h5>
                    <p style={{ margin: "2px 0 0 0", fontSize: "10px", color: INK_MUTED }}>
                      Theme: {mantra.theme.split(" / ")[0]}
                    </p>
                  </div>
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: mantra.planetColor }} />
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

          {/* HONESTY NOTE */}
          {activeMantra.honestyNote && (
            <div style={{ background: "rgba(156,122,47,0.05)", border: "1px dashed rgba(156,122,47,0.2)", borderRadius: "8px", padding: "8px 10px", fontSize: "10px", lineHeight: "1.35", color: INK_SECONDARY }}>
              <strong style={{ color: GOLD_DEEP }}>Honest Translation Context:</strong> {activeMantra.honestyNote}
            </div>
          )}

          {/* DYNAMIC SPECTRUM VISUALIZER */}
          <div style={{ background: "rgba(255, 255, 255, 0.65)", border: "1px solid rgba(156,122,47,0.1)", borderRadius: "10px", padding: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
            
            {/* Visualizer SVG */}
            <div style={{ position: "relative", height: "60px", background: "rgba(0,0,0,0.02)", borderRadius: "8px" }}>
              <svg width="100%" height="60" viewBox="0 0 320 60" style={{ display: "block" }}>
                {/* Horizontal reference grid */}
                <line x1="0" y1="30" x2="320" y2="30" stroke="rgba(156,122,47,0.12)" strokeDasharray="3,3" />
                
                {/* Sine Wave */}
                <path d={renderWavePath()} fill="none" stroke={activeMantra.planetColor} strokeWidth="2" style={{ transition: "stroke 0.3s ease" }} />

                {/* Floating planetary node sliding along timeline */}
                <g style={{ transform: `translateX(${planetX - 160}px)`, transition: "transform 0.1s linear", transformOrigin: "160px 30px" }}>
                  <circle cx="160" cy="30" r="8" fill={activeMantra.planetColor} style={{ filter: "drop-shadow(0 0 4px " + activeMantra.planetColor + ")" }} />
                  <circle cx="160" cy="30" r="3" fill="#ffffff" />
                </g>
              </svg>

              {/* Pulsing breathing circle (pranayama pacing helper) */}
              <div style={{
                position: "absolute",
                right: "10px",
                top: "10px",
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                border: `2px solid ${activeMantra.planetColor}`,
                transform: `scale(${isPlaying ? 1 + 0.25 * Math.sin(wavePhase * 1.5) : 1})`,
                transition: "transform 0.1s ease",
                opacity: isPlaying ? 0.8 : 0.3
              }} />
            </div>

            {/* Controls */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
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

              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(156,122,47,0.08)", paddingTop: "8px", fontSize: "10px", color: INK_MUTED }}>
        <span>Grahvani Learning Runtime (Chapter 2)</span>
        <span>Foundational Five Player</span>
      </div>
    </div>
  );
}
