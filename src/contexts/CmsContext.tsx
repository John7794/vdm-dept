import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Papa from "papaparse";

const SHEET_ID = "1cs6LoN5rdsXjIRWziDAWVyHWNDXKE6UIuzgP7znhjWY";
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

type Language = "UA" | "EN" | "DE" | "PL";

interface CmsData {
  static: Record<string, Record<Language, string>>;
  news: any[];
  staff: any[];
  programs: any[];
  projects: any[];
  applicantssteps: any[];
  applicantsdocuments: any[];
  applicantschecklist: any[];
  multimedia: any[];
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
    const fetchDirectlyFromSheets = async () => {
      try {
        // Check session storage cache first
        const cachedStr = sessionStorage.getItem("cms_cache_data");
        const cachedTimeStr = sessionStorage.getItem("cms_cache_time");
        
        if (cachedStr && cachedTimeStr) {
          const cachedTime = parseInt(cachedTimeStr, 10);
          if (Date.now() - cachedTime < CACHE_DURATION_MS) {
            setData(JSON.parse(cachedStr));
            setLoading(false);
            return;
          }
        }

        const sheets = ["Static", "News", "Staff", "Programs", "Projects", "ApplicantsSteps", "ApplicantsDocuments", "ApplicantsChecklist", "Multimedia"];
        const parsedData: any = {};

        // Fetch each sheet in parallel for better performance
        await Promise.all(sheets.map(async (sheet) => {
          const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${sheet}`;
          const res = await fetch(url);
          if (!res.ok) {
            console.error(`Failed to fetch sheet ${sheet}`);
            return;
          }
          const csv = await res.text();
          
          return new Promise<void>((resolve) => {
            Papa.parse(csv, {
              header: true,
              skipEmptyLines: true,
              complete: (results) => {
                if (sheet === "Static") {
                  parsedData.static = {};
                  for (const row of results.data as any[]) {
                    if (row.Key) {
                      parsedData.static[row.Key] = {
                        UA: row.UA || "",
                        EN: row.EN || "",
                        DE: row.DE || "",
                        PL: row.PL || ""
                      };
                    }
                  }
                } else {
                  parsedData[sheet.toLowerCase()] = results.data;
                }
                resolve();
              }
            });
          });
        }));

        // Validate we got data
        if (!parsedData.static) {
          throw new Error("Could not parse main CMS data.");
        }

        setData(parsedData);
        sessionStorage.setItem("cms_cache_data", JSON.stringify(parsedData));
        sessionStorage.setItem("cms_cache_time", Date.now().toString());
        setLoading(false);

      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load CMS data");
        setLoading(false);
      }
    };

    fetchDirectlyFromSheets();
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
