import { motion } from "motion/react";
import { ArrowUpRight, ExternalLink, BookCheck } from "lucide-react";
import { useMemo } from "react";
import { useCms } from "../contexts/CmsContext";

function cleanDisciplineName(name: string): string {
  if (!name) return "";
  return name
    .replace(/,?\s*частина\s*\d+/gi, "")
    .replace(/,?\s*ч\.\s*\d+/gi, "")
    .replace(/\s*\(\s*частина\s*\d+\s*\)/gi, "")
    .trim();
}

function ProgramDisciplines({ prog, disciplines, lang, t }: { prog: any, disciplines: any[], lang: string, t: any }) {
  const level = prog.Level_UA || prog.Level || prog.level || prog.Degree_UA || "";
  
  let progDisciplines: any[] = [];
  if (level.includes("Бакалавр")) {
    progDisciplines = disciplines.filter(d => String(d.Degree_UA).includes("Бакалаврат") || String(d.Degree_UA).includes("Бакалавр"));
  } else if (level.includes("Магістр")) {
    progDisciplines = disciplines.filter(d => String(d.Degree_UA).includes("Магістратура") || String(d.Degree_UA).includes("Магістр"));
  } else if (level.includes("Аспірант") || level.includes("PhD")) {
    progDisciplines = disciplines.filter(d => String(d.Degree_UA).includes("Аспірантура") || String(d.Degree_UA).includes("Аспірант"));
  }
  
  // Deduplicate and aggregate disciplines into clean list without part 1/2 and without semester/control columns
  const uniqueDisciplines = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];

    progDisciplines.forEach((d: any) => {
      const nameUA = d.Name_UA || d.Name_EN || Object.values(d)[0] || "";
      const rawName = lang === "UA" ? nameUA : (d[`Name_${lang}`] || d[`Name_${lang}_1`] || nameUA);
      const cleaned = cleanDisciplineName(String(rawName));
      if (cleaned && !seen.has(cleaned.toLowerCase())) {
        seen.add(cleaned.toLowerCase());
        list.push(cleaned);
      }
    });

    return list;
  }, [progDisciplines, lang]);

  if (uniqueDisciplines.length === 0) return null;

  // Official educational program (ОПП) link on lpnu.ua
  const oppLink = prog.Link || prog.link || "https://lpnu.ua/vdm";

  return (
    <div className="mt-8">
      {/* Header with link to lpnu.ua */}
      <div className="p-4 border-b-2 border-border-main flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-surface-mut">
        <div className="flex items-center gap-2">
          <BookCheck className="w-4 h-4 text-accent-blue" />
          <h4 className="font-bold text-xs sm:text-sm tracking-widest uppercase font-mono text-text-main">
            {t("prog_lbl_disciplines", "Дисципліни навчального плану")}
            <span className="ml-2 text-text-dim text-xs">({uniqueDisciplines.length})</span>
          </h4>
        </div>
        <a 
          href={oppLink} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center gap-1.5 font-mono text-xs text-accent-blue hover:text-text-main transition-colors underline underline-offset-4 font-bold"
        >
          <span>{t("prog_opp_link", "Офіційна програма (ОПП) на сайті lpnu.ua")}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Clean, concise aggregated disciplines grid */}
      <div className="p-4 sm:p-6 bg-surface-main/40 border border-border-soft">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5">
          {uniqueDisciplines.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 py-1 group">
              <span className="font-mono text-xs text-accent-blue/80 font-bold mt-0.5 select-none shrink-0">
                {String(idx + 1).padStart(2, "0")}.
              </span>
              <span className="text-sm font-medium text-text-main group-hover:text-accent-blue transition-colors leading-snug">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Programs() {
  const { data, lang, t } = useCms();
  const programs = data?.programs || [];
  const disciplines = data?.Disciplines || data?.disciplines || [];

  const bPrograms = useMemo(() => programs.filter((p: any) => 
    (p.Level_UA || p.Level || p.level) === "Бакалавріат" || (p.Level_UA || p.Level || p.level) === "Бакалавр"
  ).map((p: any) => {
    const title = p.Title_UA || p.title || p.Title || "";
    if (title.toLowerCase().includes("образотворче мистецтво")) {
      return {
        ...p,
        Title_UA: "Інтер'єр та просторовий дизайн",
        Title_EN: "Interior and Spatial Design",
        Title_DE: "Interieur und räumliches Design",
        Title_PL: "Architektura wnętrz i projektowanie przestrzenne",
        Code: "B2 Дизайн",
        progId: "prog_2"
      };
    } else {
      return {
        ...p,
        Code: "B2 Дизайн",
        progId: "prog_1"
      };
    }
  }), [programs]);
  
  const mPrograms = useMemo(() => programs.filter((p: any) => 
    (p.Level_UA || p.Level || p.level) === "Магістратура"
  ).map((p: any) => ({
    ...p,
    progId: "prog_3"
  })), [programs]);
  
  const phdPrograms = useMemo(() => programs.filter((p: any) => 
    (p.Level_UA || p.Level || p.level) === "Аспірантура"
  ).map((p: any) => ({
    ...p,
    progId: "prog_4"
  })), [programs]);

  return (
    <div className="flex flex-col w-full bg-page-bg">
      {/* Page Header */}
      <section className="border-b-2 border-border-main bg-surface-main p-6 md:p-12 lg:p-16 relative overflow-hidden">
        <div className="max-w-[1000px] z-10 relative">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-7xl lg:text-[8rem] font-bold leading-[0.85] tracking-[-0.04em] uppercase text-text-main text-balance whitespace-pre-line break-words hyphens-auto"
          >
            {t("prog_page_title", "ОСВІТНІ ПРОГРАМИ.")}
          </motion.h1>
          <p className="mt-8 text-xl max-w-2xl font-light leading-relaxed text-text-main whitespace-pre-line">
            {t("prog_page_desc", "Ми пропонуємо повний цикл вищої освіти: від базової підготовки бакалаврів та спеціалізованих магістерських напрямків до науково-дослідницьких програм аспірантури (PhD).")}
          </p>
        </div>
      </section>

      <div className="flex flex-col lg:flex-row w-full items-stretch">
        <div className="flex-grow lg:w-[75%] xl:w-[80%] flex flex-col border-r-0 lg:border-r-2 border-border-main">
          {/* Bachelor Dashboard */}
          <section id="bachelor" className="grid grid-cols-1 border-b-2 border-border-main scroll-mt-[80px]">
            <div className="flex flex-col">
              <div className="sticky top-[80px] z-20 bg-surface-mut/95 backdrop-blur-md text-text-main p-6 flex justify-between items-center border-b-2 border-border-main">
                <h2 className="text-2xl font-bold uppercase tracking-widest break-words hyphens-auto">{t("prog_bachelor", "БАКАЛАВРІАТ")}</h2>
                <span className="font-mono text-sm">LEVEL 1</span>
              </div>
              
              <div className="p-6 md:p-12 flex-grow bg-surface-main">
                <div className="space-y-12">
                  {bPrograms.length > 0 ? bPrograms.map((prog: any, idx: number) => (
                    <div key={idx} className="group">
                      <div className="flex items-start justify-between border-b-2 border-border-soft pb-4 transition-colors group-hover:border-border-main">
                        <div>
                          <span className="font-mono text-xs text-text-dim block mb-2 uppercase">{t("prog_lbl_specialty", "СПЕЦІАЛЬНІСТЬ")} {prog.Code || prog.code || prog.id}</span>
                          <h3 className="text-2xl md:text-3xl font-bold leading-none tracking-tight uppercase group-hover:text-accent-blue transition-colors text-text-main">
                            {prog[`Title_${lang}`] || prog.Title_UA || prog.title}
                          </h3>
                        </div>
                        {prog.Link || prog.link ? (
                          <a href={prog.Link || prog.link} target="_blank" rel="noopener noreferrer" className="flex-shrink-0" aria-label="Open Program on lpnu.ua">
                            <ArrowUpRight className="w-8 h-8 text-text-dim group-hover:text-text-main transition-colors" />
                          </a>
                        ) : (
                          <ArrowUpRight className="w-8 h-8 text-text-dim/30 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex flex-row justify-between sm:justify-start gap-4 sm:gap-8 mt-4 font-mono text-[10px] sm:text-sm tracking-widest uppercase text-text-main">
                        <span className="text-text-dim">{t("prog_lbl_duration", "ТРИВАЛІСТЬ:")} <span className="text-text-main block mt-1 sm:mt-0 sm:inline sm:ml-2">{prog[`Duration_${lang}`] || prog.Duration_UA || prog.duration}</span></span>
                        <span className="text-text-dim">{t("prog_lbl_degree", "СТУПІНЬ:")} <span className="text-text-main block mt-1 sm:mt-0 sm:inline sm:ml-2">{prog[`Degree_${lang}`] || prog.Degree_UA || prog.degree}</span></span>
                      </div>
                      <ProgramDisciplines prog={prog} disciplines={disciplines} lang={lang} t={t} />
                    </div>
                  )) : (
                    <div className="text-text-dim font-mono text-xs uppercase">{t("prog_loading", "Завантаження...")}</div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Master Dashboard */}
          <section id="master" className="grid grid-cols-1 border-b-2 border-border-main scroll-mt-[80px]">
            <div className="flex flex-col">
              <div className="sticky top-[80px] z-20 bg-surface-mut/95 backdrop-blur-md text-text-main p-6 flex justify-between items-center border-b-2 border-border-main">
                <h2 className="text-2xl font-bold uppercase tracking-widest break-words hyphens-auto">{t("prog_master", "МАГІСТРАТУРА")}</h2>
                <span className="font-mono text-sm">LEVEL 2</span>
              </div>
              
              <div className="p-6 md:p-12 flex-grow bg-page-bg">
                <div className="space-y-12">
                  {mPrograms.length > 0 ? mPrograms.map((prog: any, idx: number) => (
                    <div key={idx} className="group">
                      <div className="flex items-start justify-between border-b-2 border-border-soft pb-4 transition-colors group-hover:border-border-main">
                        <div>
                          <span className="font-mono text-xs text-text-dim block mb-2 uppercase">{t("prog_lbl_specialty", "СПЕЦІАЛЬНІСТЬ")} {prog.Code || prog.code || prog.id}</span>
                          <h3 className="text-2xl md:text-3xl font-bold leading-none tracking-tight uppercase group-hover:text-accent-blue transition-colors text-text-main">
                            {prog[`Title_${lang}`] || prog.Title_UA || prog.title}
                          </h3>
                        </div>
                        {prog.Link || prog.link ? (
                          <a href={prog.Link || prog.link} target="_blank" rel="noopener noreferrer" className="flex-shrink-0" aria-label="Open Program on lpnu.ua">
                            <ArrowUpRight className="w-8 h-8 text-text-dim group-hover:text-text-main transition-colors" />
                          </a>
                        ) : (
                          <ArrowUpRight className="w-8 h-8 text-text-dim/30 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex flex-row justify-between sm:justify-start gap-4 sm:gap-8 mt-4 font-mono text-[10px] sm:text-sm tracking-widest uppercase text-text-main">
                        <span className="text-text-dim">{t("prog_lbl_duration", "ТРИВАЛІСТЬ:")} <span className="text-text-main block mt-1 sm:mt-0 sm:inline sm:ml-2">{prog[`Duration_${lang}`] || prog.Duration_UA || prog.duration}</span></span>
                        <span className="text-text-dim">{t("prog_lbl_degree", "СТУПІНЬ:")} <span className="text-text-main block mt-1 sm:mt-0 sm:inline sm:ml-2">{prog[`Degree_${lang}`] || prog.Degree_UA || prog.degree}</span></span>
                      </div>
                      <ProgramDisciplines prog={prog} disciplines={disciplines} lang={lang} t={t} />
                    </div>
                  )) : (
                     <div className="text-text-dim font-mono text-xs uppercase">{t("prog_loading", "Завантаження...")}</div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* PhD Dashboard */}
          <section id="phd" className="grid grid-cols-1 border-b-2 border-border-main scroll-mt-[80px]">
            <div className="flex flex-col">
              <div className="sticky top-[80px] z-20 bg-surface-mut/95 backdrop-blur-md text-text-main p-6 flex justify-between items-center border-b-2 border-border-main">
                <h2 className="text-2xl font-bold uppercase tracking-widest break-words hyphens-auto">{t("prog_phd", "АСПІРАНТУРА")}</h2>
                <span className="font-mono text-sm">LEVEL 3</span>
              </div>
              
              <div className="p-6 md:p-12 flex-grow bg-surface-main">
                <div className="space-y-12">
                  {phdPrograms.length > 0 ? phdPrograms.map((prog: any, idx: number) => (
                    <div key={idx} className="group">
                    <div className="flex items-start justify-between border-b-2 border-border-soft pb-4 transition-colors group-hover:border-border-main">
                      <div>
                        <span className="font-mono text-xs text-text-dim block mb-2 uppercase">{t("prog_lbl_specialty", "СПЕЦІАЛЬНІСТЬ")} {prog.Code || prog.code || prog.id}</span>
                        <h3 className="text-2xl md:text-3xl font-bold leading-none tracking-tight uppercase group-hover:text-accent-blue transition-colors text-text-main">
                          {prog[`Title_${lang}`] || prog.Title_UA || prog.title}
                        </h3>
                      </div>
                      {prog.Link || prog.link ? (
                        <a href={prog.Link || prog.link} target="_blank" rel="noopener noreferrer" className="flex-shrink-0" aria-label="Open Program on lpnu.ua">
                          <ArrowUpRight className="w-8 h-8 text-text-dim group-hover:text-text-main transition-colors" />
                        </a>
                      ) : (
                        <ArrowUpRight className="w-8 h-8 text-text-dim/30 flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex flex-row justify-between sm:justify-start gap-4 sm:gap-8 mt-4 font-mono text-[10px] sm:text-sm tracking-widest uppercase text-text-main">
                      <span className="text-text-dim">{t("prog_lbl_duration", "ТРИВАЛІСТЬ:")} <span className="text-text-main block mt-1 sm:mt-0 sm:inline sm:ml-2">{prog[`Duration_${lang}`] || prog.Duration_UA || prog.duration}</span></span>
                      <span className="text-text-dim">{t("prog_lbl_degree", "СТУПІНЬ:")} <span className="text-text-main block mt-1 sm:mt-0 sm:inline sm:ml-2">{prog[`Degree_${lang}`] || prog.Degree_UA || prog.degree}</span></span>
                    </div>
                    <ProgramDisciplines prog={prog} disciplines={disciplines} lang={lang} t={t} />
                  </div>
                  )) : (
                    <div className="text-text-dim font-mono text-xs uppercase">{t("prog_loading", "Завантаження...")}</div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
        
        {/* Navigation Sidebar */}
        <aside className="hidden lg:block lg:w-[25%] xl:w-[20%] bg-surface-main relative">
          <div className="sticky top-[120px] p-8 xl:p-12">
             <nav className="flex flex-col space-y-8">
                <h4 className="font-mono text-sm tracking-widest text-text-dim uppercase">{t("prog_lbl_navigation", "Навігація")}</h4>
                <ul className="space-y-6">
                  <li><a href="#bachelor" className="text-lg xl:text-xl font-bold uppercase text-text-dim hover:text-accent-blue transition-colors block">{t("prog_bachelor", "БАКАЛАВРІАТ")}</a></li>
                  <li><a href="#master" className="text-lg xl:text-xl font-bold uppercase text-text-dim hover:text-accent-blue transition-colors block">{t("prog_master", "МАГІСТРАТУРА")}</a></li>
                  <li><a href="#phd" className="text-lg xl:text-xl font-bold uppercase text-text-dim hover:text-accent-blue transition-colors block">{t("prog_phd", "АСПІРАНТУРА")}</a></li>
                </ul>
             </nav>
          </div>
        </aside>
      </div>
    </div>
  );
}
