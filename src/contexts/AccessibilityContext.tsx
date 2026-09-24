import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  ReactNode,
} from "react";

export type FontSize = "normal" | "large" | "xlarge";
export type ContrastMode = "normal" | "high" | "yellow-black" | "blue-white" | "mono";

interface AccessibilitySettings {
  fontSize: FontSize;
  contrast: ContrastMode;
  letterSpacing: boolean;
  hideImages: boolean;
  highlightLinks: boolean;
  speechEnabled: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  toggleToolbar: () => void;
  setFontSize: (size: FontSize) => void;
  setContrast: (contrast: ContrastMode) => void;
  toggleLetterSpacing: () => void;
  toggleHideImages: () => void;
  toggleHighlightLinks: () => void;
  toggleSpeech: () => void;
  speakText: (text: string) => void;
  stopSpeech: () => void;
  resetSettings: () => void;
  isCustomized: boolean;
  isSpeaking: boolean;
  isLoadingAudio: boolean;
  activeSpeechText: string | null;
  clearActiveSpeech: () => void;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: "normal",
  contrast: "normal",
  letterSpacing: false,
  hideImages: false,
  highlightLinks: false,
  speechEnabled: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    try {
      const saved = localStorage.getItem("vda_accessibility_settings");
      if (saved) return { ...defaultSettings, ...JSON.parse(saved) };
    } catch (e) {
      console.error(e);
    }
    return defaultSettings;
  });

  // Speech & Audio Player State
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [activeSpeechText, setActiveSpeechText] = useState<string | null>(null);

  // Request counter to cancel stale in-flight speech requests
  const currentRequestIdRef = useRef<number>(0);
  // Remember the last processed text to prevent infinite repeat loops on mouseup
  const lastHandledTextRef = useRef<string>("");
  // Audio element reference for HTML5 audio streaming
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  // Fallback Web Speech reference
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const toggleToolbar = () => setIsOpen((prev) => !prev);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    val: AccessibilitySettings[K]
  ) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: val };
      try {
        localStorage.setItem("vda_accessibility_settings", JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const setFontSize = (fontSize: FontSize) => updateSetting("fontSize", fontSize);
  const setContrast = (contrast: ContrastMode) => updateSetting("contrast", contrast);
  const toggleLetterSpacing = () => updateSetting("letterSpacing", !settings.letterSpacing);
  const toggleHideImages = () => updateSetting("hideImages", !settings.hideImages);
  const toggleHighlightLinks = () => updateSetting("highlightLinks", !settings.highlightLinks);

  const toggleSpeech = () => {
    const nextState = !settings.speechEnabled;
    updateSetting("speechEnabled", nextState);
    if (!nextState) {
      stopSpeech();
    }
  };

  const resetSettings = () => {
    stopSpeech();
    setSettings(defaultSettings);
    try {
      localStorage.removeItem("vda_accessibility_settings");
    } catch (e) {
      console.error(e);
    }
  };

  // Sync DOM classes with accessibility settings
  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove("a11y-font-normal", "a11y-font-large", "a11y-font-xlarge");
    root.classList.add(`a11y-font-${settings.fontSize}`);

    root.classList.remove(
      "a11y-contrast-normal",
      "a11y-contrast-high",
      "a11y-contrast-yellow-black",
      "a11y-contrast-blue-white",
      "a11y-contrast-mono"
    );
    if (settings.contrast !== "normal") {
      root.classList.add(`a11y-contrast-${settings.contrast}`);
    }

    if (settings.letterSpacing) {
      root.classList.add("a11y-letter-spacing");
    } else {
      root.classList.remove("a11y-letter-spacing");
    }

    if (settings.hideImages) {
      root.classList.add("a11y-hide-images");
    } else {
      root.classList.remove("a11y-hide-images");
    }

    if (settings.highlightLinks) {
      root.classList.add("a11y-highlight-links");
    } else {
      root.classList.remove("a11y-highlight-links");
    }
  }, [settings]);

  // Stop any currently playing audio or speech synthesis immediately
  const stopSpeech = () => {
    // Invalidate any active or in-flight requests
    currentRequestIdRef.current++;

    if (activeAudioRef.current) {
      try {
        const audio = activeAudioRef.current;
        audio.pause();
        audio.currentTime = 0;
        audio.src = "";
        audio.load(); // Aborts in-flight network requests
      } catch (e) {
        console.warn("Audio stop error:", e);
      }
      activeAudioRef.current = null;
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        console.warn("speechSynthesis cancel error:", e);
      }
    }

    activeUtteranceRef.current = null;
    setIsSpeaking(false);
    setIsLoadingAudio(false);
  };

  const clearActiveSpeech = () => {
    stopSpeech();
    setActiveSpeechText(null);
    lastHandledTextRef.current = "";
    try {
      if (typeof window !== "undefined" && window.getSelection) {
        window.getSelection()?.removeAllRanges();
      }
    } catch (_) {}
  };

  // Speak text using high-fidelity backend TTS audio stream, with SpeechSynthesis fallback
  const speakText = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      stopSpeech();
      return;
    }

    stopSpeech();
    const reqId = ++currentRequestIdRef.current;

    setActiveSpeechText(trimmed);
    lastHandledTextRef.current = trimmed;
    setIsLoadingAudio(true);

    // Detect site language (default uk)
    let lang = "uk";
    try {
      const storedLang = localStorage.getItem("site_lang") || "UA";
      lang = storedLang.toLowerCase();
      if (lang === "ua") lang = "uk";
    } catch (e) {
      lang = "uk";
    }

    // 1. Try HTML5 Audio via /api/tts endpoint
    const audioUrl = `/api/tts?text=${encodeURIComponent(trimmed)}&lang=${encodeURIComponent(lang)}`;
    const audio = new Audio(audioUrl);
    activeAudioRef.current = audio;

    audio.oncanplay = () => {
      if (currentRequestIdRef.current !== reqId) return;
      setIsLoadingAudio(false);
    };

    audio.onplay = () => {
      if (currentRequestIdRef.current !== reqId) {
        audio.pause();
        return;
      }
      setIsSpeaking(true);
      setIsLoadingAudio(false);
    };

    audio.onended = () => {
      if (currentRequestIdRef.current !== reqId) return;
      setIsSpeaking(false);
      setIsLoadingAudio(false);
      activeAudioRef.current = null;
    };

    audio.onerror = (e) => {
      if (currentRequestIdRef.current !== reqId) return;
      console.warn("Backend TTS stream failed, attempting browser SpeechSynthesis fallback...", e);
      setIsLoadingAudio(false);

      // Fallback: Browser Web Speech API
      if ("speechSynthesis" in window) {
        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(trimmed);
          utterance.rate = 1.0;

          const voices = window.speechSynthesis.getVoices();
          const ukVoice = voices.find(
            (v) =>
              v.lang.toLowerCase().startsWith("uk") ||
              v.name.toLowerCase().includes("ukrain") ||
              v.name.toLowerCase().includes("україн")
          );
          const defaultVoice = voices.find((v) => v.default) || voices[0];
          const chosen = ukVoice || defaultVoice;

          if (chosen) {
            utterance.voice = chosen;
            utterance.lang = chosen.lang || "uk-UA";
          } else {
            utterance.lang = "uk-UA";
          }

          utterance.onstart = () => {
            if (currentRequestIdRef.current !== reqId) {
              window.speechSynthesis.cancel();
              return;
            }
            setIsSpeaking(true);
          };
          utterance.onend = () => {
            if (currentRequestIdRef.current !== reqId) return;
            setIsSpeaking(false);
            activeUtteranceRef.current = null;
          };
          utterance.onerror = () => {
            if (currentRequestIdRef.current !== reqId) return;
            setIsSpeaking(false);
            activeUtteranceRef.current = null;
          };

          activeUtteranceRef.current = utterance;
          window.speechSynthesis.speak(utterance);
        } catch (synthErr) {
          console.error("SpeechSynthesis fallback failed:", synthErr);
          setIsSpeaking(false);
        }
      } else {
        setIsSpeaking(false);
      }
    };

    // Trigger playback
    audio.play().catch((playErr) => {
      if (currentRequestIdRef.current !== reqId) return;
      console.warn("Audio play() interrupted or blocked by browser gesture policy:", playErr);
      setIsLoadingAudio(false);
    });
  };

  // Selection detection: captures text selection and plays audio if speech is enabled
  useEffect(() => {
    let timeoutId: any = null;

    const handleSelection = (e: Event) => {
      // Don't intercept selection if the user clicked inside any accessibility control
      const target = e.target as HTMLElement | null;
      if (target && target.closest("[data-a11y-control]")) {
        return;
      }

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        try {
          const selection = window.getSelection();
          if (!selection || selection.isCollapsed) {
            // User unselected or clicked outside
            if (!activeAudioRef.current && !activeUtteranceRef.current) {
              lastHandledTextRef.current = "";
              setActiveSpeechText(null);
            }
            return;
          }

          const text = selection.toString().trim();
          if (text && text.length >= 2) {
            // Ignore selection inside form inputs and textareas
            const activeEl = document.activeElement;
            const isInput =
              activeEl &&
              (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA");
            if (isInput) return;

            // PREVENT INFINITE LOOP: If this is the exact same text that was already selected, do NOT re-speak!
            if (text === lastHandledTextRef.current) {
              return;
            }

            lastHandledTextRef.current = text;
            setActiveSpeechText(text);

            // If speech mode is enabled, immediately voice it!
            if (settings.speechEnabled) {
              speakText(text);
            }
          }
        } catch (e) {
          console.warn("Selection listener error:", e);
        }
      }, 150);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        stopSpeech();
      }
    };

    document.addEventListener("mouseup", handleSelection);
    document.addEventListener("touchend", handleSelection);
    document.addEventListener("keyup", handleSelection);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mouseup", handleSelection);
      document.removeEventListener("touchend", handleSelection);
      document.removeEventListener("keyup", handleSelection);
      window.removeEventListener("keydown", handleKeyDown);
      stopSpeech();
    };
  }, [settings.speechEnabled]);

  const isCustomized =
    settings.fontSize !== "normal" ||
    settings.contrast !== "normal" ||
    settings.letterSpacing ||
    settings.hideImages ||
    settings.highlightLinks ||
    settings.speechEnabled;

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        isOpen,
        setIsOpen,
        toggleToolbar,
        setFontSize,
        setContrast,
        toggleLetterSpacing,
        toggleHideImages,
        toggleHighlightLinks,
        toggleSpeech,
        speakText,
        stopSpeech,
        resetSettings,
        isCustomized,
        isSpeaking,
        isLoadingAudio,
        activeSpeechText,
        clearActiveSpeech,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error("useAccessibility must be used within AccessibilityProvider");
  return ctx;
}
