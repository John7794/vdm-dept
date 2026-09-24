import React, { createContext, useContext, useState, useEffect } from "react";

export interface CookiePreferences {
  necessary: boolean; // Always true (technical/essential)
  functional: boolean; // Interface settings, language
  analytics: boolean; // Anonymous traffic stats
  multimedia: boolean; // Embedded videos, external maps/media
}

interface StoredConsent {
  accepted: boolean;
  preferences: CookiePreferences;
  timestamp: string;
}

interface CookieConsentContextType {
  isOpen: boolean;
  hasConsented: boolean;
  preferences: CookiePreferences;
  openCookieSettings: () => void;
  closeCookieSettings: () => void;
  updatePreference: (key: keyof CookiePreferences, value: boolean) => void;
  savePreferences: (customPrefs?: CookiePreferences) => void;
  acceptAll: () => void;
  acceptNecessaryOnly: () => void;
}

const STORAGE_KEY = "vda_cookie_consent";

const DEFAULT_PREFERENCES: CookiePreferences = {
  necessary: true,
  functional: true,
  analytics: true,
  multimedia: true,
};

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

export const CookieConsentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsVisible] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: StoredConsent = JSON.parse(stored);
        setHasConsented(true);
        if (parsed.preferences) {
          setPreferences({
            necessary: true,
            functional: Boolean(parsed.preferences.functional),
            analytics: Boolean(parsed.preferences.analytics),
            multimedia: Boolean(parsed.preferences.multimedia),
          });
        }
      } else {
        // Show banner after short delay for initial visitors
        const timer = setTimeout(() => setIsVisible(true), 800);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.error("Error reading cookie consent:", e);
    }
  }, []);

  const openCookieSettings = () => {
    setIsVisible(true);
  };

  const closeCookieSettings = () => {
    setIsVisible(false);
  };

  const updatePreference = (key: keyof CookiePreferences, value: boolean) => {
    if (key === "necessary") return; // cannot be changed
    setPreferences((prev) => ({ ...prev, [key]: value }));
  };

  const persistConsent = (prefs: CookiePreferences) => {
    try {
      const consentData: StoredConsent = {
        accepted: true,
        preferences: prefs,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consentData));
      setHasConsented(true);
      setPreferences(prefs);
    } catch (e) {
      console.error("Error saving cookie consent:", e);
    }
    setIsVisible(false);
  };

  const savePreferences = (customPrefs?: CookiePreferences) => {
    const toSave = customPrefs ? { ...customPrefs, necessary: true } : { ...preferences, necessary: true };
    persistConsent(toSave);
  };

  const acceptAll = () => {
    const allPrefs: CookiePreferences = {
      necessary: true,
      functional: true,
      analytics: true,
      multimedia: true,
    };
    persistConsent(allPrefs);
  };

  const acceptNecessaryOnly = () => {
    const necessaryOnly: CookiePreferences = {
      necessary: true,
      functional: false,
      analytics: false,
      multimedia: false,
    };
    persistConsent(necessaryOnly);
  };

  return (
    <CookieConsentContext.Provider
      value={{
        isOpen,
        hasConsented,
        preferences,
        openCookieSettings,
        closeCookieSettings,
        updatePreference,
        savePreferences,
        acceptAll,
        acceptNecessaryOnly,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
};

export const useCookieConsent = (): CookieConsentContextType => {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error("useCookieConsent must be used within a CookieConsentProvider");
  }
  return context;
};
