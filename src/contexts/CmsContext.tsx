import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Papa from "papaparse";

const SHEET_ID = "1cs6LoN5rdsXjIRWziDAWVyHWNDXKE6UIuzgP7znhjWY";
const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutes

type Language = "UA" | "EN" | "DE" | "PL";

interface CmsData {
  static: Record<string, Record<Language, string>>;
  news: any[];
  staff: any[];
  programs: any[];
  projects: any[];
  disciplines: any[];
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
  t: (key: string, defaultVal?: string) => string;
}

const FALLBACK_STATIC_TRANSLATIONS: Record<string, Record<Language, string>> = {
  a11y_voice_online_ok: {
    UA: "Українське онлайн-озвучування (HD)",
    EN: "Online Text-to-Speech (HD)",
    DE: "Online-Sprachausgabe (HD)",
    PL: "Synteza mowy online (HD)",
  },
  a11y_btn_test_speech: {
    UA: "Прослухати тестовий зразок",
    EN: "Listen to sample",
    DE: "Hörprobe abspielen",
    PL: "Odtwórz próbkę",
  },
  a11y_btn_testing_speech: {
    UA: "Відтворення зразка...",
    EN: "Playing sample...",
    DE: "Hörprobe läuft...",
    PL: "Odtwarzanie próbki...",
  },
  a11y_btn_stop_test: {
    UA: "Зупинити тестовий зразок",
    EN: "Stop sample playback",
    DE: "Hörprobe stoppen",
    PL: "Zatrzymaj próbkę",
  },
  a11y_speech_sample: {
    UA: "Озвучування тексту працює. Виділіть будь-який фрагмент тексту на сайті для прослуховування.",
    EN: "Text-to-speech is working. Highlight any text on the website to listen.",
    DE: "Die Sprachausgabe funktioniert. Markieren Sie einen beliebigen Text auf der Website, um ihn anzuhören.",
    PL: "Synteza mowy działa. Zaznacz dowolny fragment tekstu na stronie, aby go odsłuchać.",
  },
  a11y_speech_hint: {
    UA: "* Виділіть курсором або клавіатурою (Shift+стрілки) будь-який фрагмент тексту на сторінці — система автоматично озвучить його.",
    EN: "* Highlight any text on the page with your cursor or keyboard (Shift+arrows) — the system will automatically read it aloud.",
    DE: "* Markieren Sie einen beliebigen Text auf der Seite mit dem Cursor oder der Tastatur (Umschalt+Pfeiltasten) — das System liest ihn automatisch vor.",
    PL: "* Zaznacz dowolny tekst na stronie kursorem lub klawiaturą (Shift+strzałki) — system automatycznie odczyta go na głos.",
  },
  a11y_speech_player_aria: {
    UA: "Панель озвучування виділеного тексту",
    EN: "Selected text speech player",
    DE: "Sprachausgabe-Leiste für markierten Text",
    PL: "Panel odczytywania zaznaczonego tekstu",
  },
  a11y_speaking_now: {
    UA: "Озвучується:",
    EN: "Speaking:",
    DE: "Wird vorgelesen:",
    PL: "Odtwarzanie:",
  },
  a11y_loading_audio: {
    UA: "Завантаження звуку...",
    EN: "Loading audio...",
    DE: "Audio wird geladen...",
    PL: "Ładowanie dźwięku...",
  },
  a11y_selected_text: {
    UA: "Виділено для читання:",
    EN: "Selected for reading:",
    DE: "Zum Lesen markiert:",
    PL: "Zaznaczono do odczytu:",
  },
  a11y_esc_stop: {
    UA: "ESC = Стоп",
    EN: "ESC = Stop",
    DE: "ESC = Stopp",
    PL: "ESC = Stop",
  },
  a11y_speech_ready: {
    UA: "Озвучування активне",
    EN: "Speech active",
    DE: "Sprachausgabe aktiv",
    PL: "Synteza aktywna",
  },
  a11y_select_prompt: {
    UA: "Виділіть будь-який текст на сторінці",
    EN: "Select any text on the page",
    DE: "Markieren Sie einen beliebigen Text auf der Seite",
    PL: "Zaznacz dowolny tekst na stronie",
  },
  a11y_btn_stop_hint: {
    UA: "Зупинити аудіопрогравання (Esc)",
    EN: "Stop audio playback (Esc)",
    DE: "Audiowiedergabe stoppen (Esc)",
    PL: "Zatrzymaj odtwarzanie (Esc)",
  },
  a11y_btn_stop: {
    UA: "Стоп",
    EN: "Stop",
    DE: "Stopp",
    PL: "Stop",
  },
  a11y_btn_replay: {
    UA: "Слухати",
    EN: "Listen",
    DE: "Anhören",
    PL: "Słuchaj",
  },
  a11y_btn_replay_hint: {
    UA: "Озвучити виділений текст",
    EN: "Read selected text aloud",
    DE: "Markierten Text vorlesen",
    PL: "Odczytaj zaznaczony tekst",
  },
  a11y_btn_dismiss: {
    UA: "Приховати панель",
    EN: "Hide player",
    DE: "Panel ausblenden",
    PL: "Ukryj panel",
  },
};

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
    document.documentElement.lang = lang === "UA" ? "uk" : lang.toLowerCase();
  }, [lang]);

  useEffect(() => {
    const fetchDirectlyFromSheets = async () => {
      try {
        // Check persistent local storage cache first
        const cachedStr = localStorage.getItem("cms_cache_data");
        const cachedTimeStr = localStorage.getItem("cms_cache_time");
        
        if (cachedStr && cachedTimeStr) {
          const cachedTime = parseInt(cachedTimeStr, 10);
          if (Date.now() - cachedTime < CACHE_DURATION_MS) {
            setData(JSON.parse(cachedStr));
            setLoading(false);
            return;
          }
        }

        const sheets = ["Static", "News", "Staff", "Programs", "Projects", "Disciplines", "ApplicantsSteps", "ApplicantsDocuments", "ApplicantsChecklist", "Multimedia"];
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
        try {
          localStorage.setItem("cms_cache_data", JSON.stringify(parsedData));
          localStorage.setItem("cms_cache_time", Date.now().toString());
        } catch (e) {
          console.warn("Failed to persist CMS cache to localStorage", e);
        }
        setLoading(false);

      } catch (err: any) {
        console.error(err);
        // Fallback to cached data even if expired to prevent site crash
        const fallbackStr = localStorage.getItem("cms_cache_data");
        if (fallbackStr) {
          try {
            setData(JSON.parse(fallbackStr));
            setLoading(false);
            return;
          } catch (e) {
            // ignore
          }
        }
        setError(err.message || "Failed to load CMS data");
        setLoading(false);
      }
    };

    fetchDirectlyFromSheets();
  }, []);

  const t = (key: string, defaultVal?: string): string => {
    if (data?.static?.[key]?.[lang]) {
      return data.static[key][lang];
    }
    if (FALLBACK_STATIC_TRANSLATIONS[key]?.[lang]) {
      return FALLBACK_STATIC_TRANSLATIONS[key][lang];
    }
    return defaultVal || key;
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
