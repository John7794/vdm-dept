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
  nav_staff: {
    UA: "Колектив",
    EN: "Faculty",
    DE: "Kollegium",
    PL: "Kadra",
  },
  staff_page_title: {
    UA: "КОЛЕКТИВ.",
    EN: "FACULTY.",
    DE: "KOLLEGIUM.",
    PL: "KADRA.",
  },
  staff_page_desc: {
    UA: "Професорсько-викладацький склад кафедри візуального дизайну і мистецтва.",
    EN: "Academic faculty and teaching staff of the Department of Visual Design and Art.",
    DE: "Lehrkörper und Dozenten des Fachbereichs für Visuelles Design und Kunst.",
    PL: "Kadra dydaktyczno-naukowa Katedry Projektowania Wizualnego i Sztuki.",
  },
  home_hero_title: {
    UA: "Візуальний Дизайн\nі Мистецтво.",
    EN: "Visual Design\nand Art.",
    DE: "Visuelles Design\nund Kunst.",
    PL: "Projektowanie Wizualne\ni Sztuka.",
  },
  home_manifesto_badge: {
    UA: "Маніфест кафедри",
    EN: "Department Manifesto",
    DE: "Manifest des Fachbereichs",
    PL: "Manifest katedry",
  },
  home_manifesto_text: {
    UA: "Ми — кафедра візуального дизайну і мистецтва — команда дизайнерів, митців і дослідників, творча майстерня та інтелектуальний колектив, об’єднаний спільною метою: формувати покоління професіоналів, здатних перетворювати ідеї на потужні візуальні повідомлення. Дизайн-програма ВДМ експериментує з різними формами комунікації, з метою створити нову візуальну мову, яка резонує з сучасним суспільством та сповідує ідеали національного самовираження. Ми віримо, що дизайн і мистецтво мають трансформативний потенціал впливати на світ, а унікальність кожного студента - це рушійна сила для суспільних і культурних змін.",
    EN: "We are the Department of Visual Design and Art — a team of designers, artists, and researchers, a creative studio and intellectual collective united by a common goal: to cultivate a generation of professionals capable of transforming ideas into powerful visual messages. The VDA design program experiments with diverse communication forms to develop a new visual language that resonates with contemporary society and upholds the ideals of cultural self-expression. We believe that design and art hold the transformative potential to shape the world, and that each student's uniqueness is a driving force for social and cultural change.",
    DE: "Wir sind der Fachbereich für Visuelles Design und Kunst – ein Team aus Designern, Künstlern und Forschern, eine kreative Werkstatt und ein intellektuelles Kollektiv, das durch ein gemeinsames Ziel verbunden ist: eine Generation von Fachleuten heranzubilden, die Ideen in kraftvolle visuelle Botschaften verwandeln können. Unser Designprogramm experimentiert mit verschiedenen Kommunikationsformen, um eine neue visuelle Sprache zu schaffen, die in der modernen Gesellschaft nachhallt und den Idealen des kulturellen Ausdrucks verpflichtet ist. Wir glauben an das transformative Potenzial von Design und Kunst, und die Einzigartigkeit jedes Studierenden ist die treibende Kraft für gesellschaftliche und kulturelle Veränderungen.",
    PL: "Jesteśmy Katedrą Projektowania Wizualnego i Sztuki — zespołem projektantów, artystów i badaczy, pracownią twórczą oraz kolektywem intelektualnym, który łączy wspólny cel: kształtowanie pokolenia profesjonalistów zdolnych do przekształcania idei w wyraziste komunikaty wizualne. Program projektowy WDM eksperymentuje z różnymi formami komunikacji, tworząc nowy język wizualny rezonujący ze współczesnym społeczeństwem i wyrażający wartości tożsamości kulturowej. Wierzymy, że projektowanie i sztuka mają transformacyjny potencjał zmieniania świata, a unikalność każdego studenta stanowi siłę napędową zmian społecznych i kulturowych.",
  },
  home_curriculum_heading: {
    UA: "Основні напрями навчальної програми",
    EN: "Core Curriculum Areas",
    DE: "Hauptbereiche des Studienprogramms",
    PL: "Główne kierunki programu kształcenia",
  },
  home_curriculum_badge: {
    UA: "7 Спеціалізованих векторів",
    EN: "7 Specialized Tracks",
    DE: "7 Spezialisierte Richtungen",
    PL: "7 Wektorów specjalizacyjnych",
  },
  home_video_heading: {
    UA: "Відео про навчання на кафедрі",
    EN: "Video About Studies at the Department",
    DE: "Video über das Studium am Fachbereich",
    PL: "Wideo o studiach w katedrze",
  },
  home_video_subheading: {
    UA: "* Атмосфера лекцій, творчих лабораторій, студентських проєктів та захистів дипломних робіт.",
    EN: "* Atmosphere of lectures, creative labs, student projects, and diploma defenses.",
    DE: "* Atmosphäre von Vorlesungen, Kreativlaboren, studentischen Projekten und Diplomverteidigungen.",
    PL: "* Atmosfera wykładów, pracowni twórczych, projektów studenckich i obron dyplomowych.",
  },
  home_video_badge: {
    UA: "Творчий процес ВДМ",
    EN: "VDA Creative Process",
    DE: "VDA Kreativprozess",
    PL: "Proces twórczy WDM",
  },
  home_video_card_title: {
    UA: "Життя та навчання на кафедрі",
    EN: "Life and Studies at the Department",
    DE: "Leben und Studium am Fachbereich",
    PL: "Życie i nauka w katedrze",
  },
  home_video_card_desc: {
    UA: "Динамічний ритм життя кафедри: від пошуку ідей та роботи в творчих майстернях до захисту авторських дизайн-проєктів. Пориньте в атмосферу нашої спільноти у відеоматеріалі.",
    EN: "The dynamic rhythm of department life: from concept exploration and workshop studio practice to the defense of authorial design projects. Immerse yourself in the atmosphere of our community in this video.",
    DE: "Der dynamische Rhythmus unseres Fachbereichs: von Ideenfindung und Atelierarbeit bis zur Verteidigung eigener Designprojekte. Tauchen Sie im Video in die Atmosphäre unserer Gemeinschaft ein.",
    PL: "Dynamiczny rytm życia katedry: od poszukiwania idei i pracy w pracowniach twórczych po obrony autorskich projektów dyplomowych. Zanurz się w atmosferze naszej społeczności w materiale wideo.",
  },
  home_video_btn_ig: {
    UA: "Переглянути в Instagram",
    EN: "Watch on Instagram",
    DE: "Auf Instagram ansehen",
    PL: "Zobacz na Instagramie",
  },
  home_video_tag_address: {
    UA: "вул. Січових Стрільців, 7",
    EN: "7 Sichovykh Striltsiv St",
    DE: "Sitschowych-Strilziw-Str. 7",
    PL: "ul. Siczowych Strilciw 7",
  },
  home_video_tag_field: {
    UA: "Графічний дизайн & Арт",
    EN: "Graphic Design & Art",
    DE: "Grafikdesign & Kunst",
    PL: "Projektowanie graficzne & Sztuka",
  },
  home_video_tag_code: {
    UA: "В2.01 Дизайн",
    EN: "B2.01 Design",
    DE: "B2.01 Design",
    PL: "B2.01 Projektowanie",
  },
  home_marquee: {
    UA: "ФОРМУЄМО НОВЕ ПОКОЛІННЯ ВІЗУАЛЬНИХ ДИЗАЙНЕРІВ",
    EN: "SHAPING THE NEXT GENERATION OF VISUAL DESIGNERS",
    DE: "WIR FORMEN DIE NÄCHSTE GENERATION VISUELLER DESIGNER",
    PL: "KSZTAŁTUJEMY NOWE POKOLENIE PROJEKTANTÓW WIZUALNYCH",
  },
  prog_lbl_disciplines: {
    UA: "Дисципліни навчального плану",
    EN: "Curriculum Disciplines",
    DE: "Studienplan-Disziplinen",
    PL: "Dyscypliny planu studiów",
  },
  prog_opp_link: {
    UA: "Електронний каталог дисциплін та ОПП (lpnu.ua)",
    EN: "Electronic Course Catalog & Study Program (lpnu.ua)",
    DE: "Elektronischer Studienplankatalog & EOP (lpnu.ua)",
    PL: "Elektroniczny katalog przedmiotów i program (lpnu.ua)",
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
