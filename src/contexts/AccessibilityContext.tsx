import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

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
  const toggleSpeech = () => updateSetting("speechEnabled", !settings.speechEnabled);

  const resetSettings = () => {
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

    // Font size classes
    root.classList.remove("a11y-font-normal", "a11y-font-large", "a11y-font-xlarge");
    root.classList.add(`a11y-font-${settings.fontSize}`);

    // Contrast classes
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

    // Spacing
    if (settings.letterSpacing) {
      root.classList.add("a11y-letter-spacing");
    } else {
      root.classList.remove("a11y-letter-spacing");
    }

    // Hide images
    if (settings.hideImages) {
      root.classList.add("a11y-hide-images");
    } else {
      root.classList.remove("a11y-hide-images");
    }

    // Highlight links
    if (settings.highlightLinks) {
      root.classList.add("a11y-highlight-links");
    } else {
      root.classList.remove("a11y-highlight-links");
    }
  }, [settings]);

  // Speech synthesis functionality (WCAG 2.1 Audio / Screen reading support)
  const stopSpeech = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  const speakText = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    if (!text.trim()) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "uk-UA";
    utterance.rate = 0.95;

    // Try to pick an Ukrainian voice if available
    const voices = window.speechSynthesis.getVoices();
    const ukVoice = voices.find((v) => v.lang.startsWith("uk") || v.lang.startsWith("uk_UA"));
    if (ukVoice) {
      utterance.voice = ukVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  // Text selection reader when speech is enabled
  useEffect(() => {
    if (!settings.speechEnabled) return;

    const handleMouseUp = () => {
      const selected = window.getSelection()?.toString().trim();
      if (selected && selected.length > 2) {
        speakText(selected);
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
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
