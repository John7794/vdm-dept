import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "UA" | "EN" | "DE" | "PL";

interface CmsData {
  static: Record<string, Record<Language, string>>;
  news: any[];
  staff: any[];
  programs: any[];
  projects: any[];
}

interface CmsContextType {
  data: CmsData | null;
  loading: boolean;
  error: string | null;
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const CmsContext = createContext<CmsContextType | undefined>(undefined);

export function CmsProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<CmsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Try to load lang from localStorage, default to UA
  const [lang, setLangState] = useState<Language>(() => {
    return (localStorage.getItem("site_lang") as Language) || "UA";
  });

  const setLang = (newLang: Language) => {
    localStorage.setItem("site_lang", newLang);
    setLangState(newLang);
  };

  useEffect(() => {
    fetch("/api/cms")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load CMS data");
        return res.json();
      })
      .then((cmsData) => {
        setData(cmsData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const t = (key: string): string => {
    if (!data || !data.static) return key;
    const entry = data.static[key];
    if (!entry) return key;
    return entry[lang] || key;
  };

  return (
    <CmsContext.Provider value={{ data, loading, error, lang, setLang, t }}>
      {children}
    </CmsContext.Provider>
  );
}

export function useCms() {
  const ctx = useContext(CmsContext);
  if (!ctx) throw new Error("useCms must be used within a CmsProvider");
  return ctx;
}
