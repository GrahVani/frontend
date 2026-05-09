"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface TTSOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  lang?: string;
  voiceURI?: string;
}

interface UseTTSReturn {
  speaking: boolean;
  paused: boolean;
  supported: boolean;
  speak: (text: string, options?: TTSOptions) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  voices: SpeechSynthesisVoice[];
}

/**
 * Browser-native Text-to-Speech hook.
 * Ready for Bulbul 3 API integration — swap the speak() implementation
 * to call an external TTS endpoint when Bulbul 3 keys are available.
 */
export function useTTS(): UseTTSReturn {
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [supported, setSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }
    setSupported(true);

    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      setVoices(available);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    // Chrome bug: speechSynthesis pauses after ~15s of inactivity
    const resumeInterval = setInterval(() => {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    }, 10000);

    return () => {
      clearInterval(resumeInterval);
      window.speechSynthesis.cancel();
    };
  }, []);

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      setPaused(false);
      utteranceRef.current = null;
    }
  }, []);

  const pause = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.pause();
      setPaused(true);
    }
  }, []);

  const resume = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.resume();
      setPaused(false);
    }
  }, []);

  const speak = useCallback(
    (text: string, options: TTSOptions = {}) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

      // Stop any ongoing speech
      window.speechSynthesis.cancel();
      setPaused(false);

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options.rate ?? 1;
      utterance.pitch = options.pitch ?? 1;
      utterance.volume = options.volume ?? 1;
      utterance.lang = options.lang ?? "en-IN";

      // Prefer Indian English voice if available, else fall through
      if (options.voiceURI) {
        const selected = voices.find((v) => v.voiceURI === options.voiceURI);
        if (selected) utterance.voice = selected;
      } else {
        const indianVoice = voices.find(
          (v) =>
            v.lang.includes("en-IN") ||
            v.lang.includes("hi-IN") ||
            v.name.toLowerCase().includes("india")
        );
        if (indianVoice) utterance.voice = indianVoice;
      }

      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => {
        setSpeaking(false);
        setPaused(false);
        utteranceRef.current = null;
      };
      utterance.onerror = (e) => {
        // eslint-disable-next-line no-console
        console.error("TTS error:", e);
        setSpeaking(false);
        setPaused(false);
        utteranceRef.current = null;
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [voices]
  );

  return { speaking, paused, supported, speak, stop, pause, resume, voices };
}
