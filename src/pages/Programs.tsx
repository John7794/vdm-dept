import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useMemo } from "react";
import { useCms } from "../contexts/CmsContext";

function ProgramDisciplines({ prog, disciplines, lang, t }: { prog: any, disciplines: any[], lang: string, t: any }) {
  let progDisciplines = [];
  const level = prog.Level_UA || prog.Level || prog.level || prog.Degree_UA || "";
  
  if (level.includes("Бакалавр")) {
    progDisciplines = disciplines.filter(d => String(d.Degree_UA).includes("Бакалаврат") || String(d.Degree_UA).includes("Бакалавр"));
  } else if (level.includes("Магістр")) {
    progDisciplines = disciplines.filter(d => String(d.Degree_UA).includes("Магістратура") || String(d.Degree_UA).includes("Магістр"));
  } else if (level.includes("Аспірант") || level.includes("PhD")) {
    progDisciplines = disciplines.filter(d => String(d.Degree_UA).includes("Аспірантура") || String(d.Degree_UA).includes("Аспірант"));
  }
  
  if (!progDisciplines || progDisciplines.length === 0) return null;

  function extractCourse(semesterStr: string) {
    if (!semesterStr) return 1;
    const matches = String(semesterStr).match(/\d+/g);
    if (matches && matches.length > 0) {
      const firstNum = parseInt(matches[0], 10);
      return Math.ceil(firstNum / 2);
    }
    return 1;
  }

  const grouped = progDisciplines.reduce((acc, d) => {
    const course = extractCourse(d.Semester_UA || d.Semester_EN || d.semester || "");
    if (!acc[course]) acc[course] = [];
    acc[course].push(d);
    return acc;
  }, {} as Record<number, any[]>);

  const courses = Object.keys(grouped).map(Number).sort((a, b) => a - b);

  return (
    <div className="mt-8">
      <div className="p-4 border-b border-border-soft flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3 bg-surface-mut">
        <h4 className="font-bold text-sm tracking-widest uppercase">{t("prog_lbl_disciplines", "Дисципліни")}</h4>
        <a href="#" className="font-mono text-xs hover:text-accent-blue transition-colors underline underline-offset-4 decoration-border-main hover:decoration-accent-blue">Завантажити програму (PDF)</a>
      </div>
      <div className="p-0 space-y-12 mt-6">
        {courses.map(course => (
          <div key={course} className="space-y-4">
            <h5 className="font-mono font-bold text-sm text-accent-blue uppercase tracking-widest pl-4 border-l-2 border-accent-blue">{course} {lang === "UA" ? "Курс" : "Course"}</h5>
            <div className="bg-surface-main/30 border border-border-soft">
                <div className="hidden sm:grid grid-cols-[1fr_120px_180px] font-mono text-xs text-text-dim border-b border-border-soft bg-surface-mut/50 p-4">
    <div>{lang === "UA" ? "Назва дисципліни" : "Discipline"}</div>
    <div className="text-center">{lang === "UA" ? "Семестр" : "Semester"}</div>
    <div>{lang === "UA" ? "Тип контролю" : "Control Type"}</div>
  </div>
                <div className="divide-y divide-border-soft/30">
                  {grouped[course].map((d: any, i: number) => {
                    const nameUA = d.Name_UA || d.Name_EN || Object.values(d)[0] || "";
                    const nameStr = lang === "UA" ? nameUA : (d[`Name_${lang}`] || d[`Name_${lang}_1`] || nameUA);
                    
                    const semUA = d.Semester_UA || d.Semester_EN || d.semester || "";
                    const semStr = lang === "UA" ? semUA : (d[`Semester_${lang}`] || semUA);
                    
                    const ctrlUA = d.Control_Type_UA || d.Control_Type_EN || d.control || "";
                    const ctrlStr = lang === "UA" ? ctrlUA : (d[`Control_Type_${lang}`] || ctrlUA);

                    return (
                      <div key={i} className="hover:bg-surface-mut transition-colors group p-4">
                      <div className="text-sm mb-3 sm:hidden text-text-main leading-snug pr-4">{nameStr}</div>
                      
                      <div className="hidden sm:grid sm:grid-cols-[1fr_120px_180px] sm:items-center">
                        <div className="text-sm pr-4">{nameStr}</div>
                        <div className="text-center font-mono text-xs">{semStr}</div>
                        <div className="font-mono text-xs text-text-dim leading-tight">{ctrlStr}</div>
                      </div>

                      <div className="flex sm:hidden items-center gap-4 text-xs font-mono text-text-dim">
                        <span className="bg-surface-mut px-2 py-1 border border-border-soft whitespace-nowrap">{semStr}</span>
                        <span className="leading-tight">{ctrlStr}</span>
                      </div>
                    </div>
                    );
                  })}
                </div>
            </div>
          </div>
        ))}
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
      }
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
            {t("prog_page_title")}
          </motion.h1>
          <p className="mt-8 text-xl max-w-2xl font-light leading-relaxed text-text-main whitespace-pre-line">
            {t("prog_page_desc")}
          </p>
        </div>
      </section>

      <div className="flex flex-col lg:flex-row w-full items-stretch">
        <div className="flex-grow lg:w-[75%] xl:w-[80%] flex flex-col border-r-0 lg:border-r-2 border-border-main">
          {/* Bachelor Dashboard */}
      <section id="bachelor" className="grid grid-cols-1 border-b-2 border-border-main scroll-mt-[80px]">
        <div className="flex flex-col">
          <div className="sticky top-[80px] z-20 bg-surface-mut/95 backdrop-blur-md text-text-main p-6 flex justify-between items-center border-b-2 border-border-main">
            <h2 className="text-2xl font-bold uppercase tracking-widest break-words hyphens-auto">{t("prog_bachelor")}</h2>
            <span className="font-mono text-sm">LEVEL 1</span>
          </div>
          
          <div className="p-6 md:p-12 flex-grow bg-surface-main">
            <div className="space-y-12">
              {bPrograms.length > 0 ? bPrograms.map((prog: any, idx: number) => (
                <div key={idx} className="group cursor-crosshair">
                  <div className="flex items-start justify-between border-b-2 border-border-soft pb-4 transition-colors group-hover:border-border-main">
                    <div>
                      <span className="font-mono text-xs text-text-dim block mb-2 uppercase">{t("prog_lbl_specialty")} {prog.Code || prog.code || prog.id}</span>
                      <h3 className="text-2xl md:text-3xl font-bold leading-none tracking-tight uppercase group-hover:text-accent-blue transition-colors text-text-main">
                        {prog[`Title_${lang}`] || prog.Title_UA || prog.title}
                      </h3>
                    </div>
                    {prog.Link || prog.link ? (
                      <a href={prog.Link || prog.link} target="_blank" rel="noopener noreferrer" className="flex-shrink-0" aria-label="Open Program">
                        <ArrowUpRight className="w-8 h-8 text-text-dim group-hover:text-text-main transition-colors" />
                      </a>
                    ) : (
                      <ArrowUpRight className="w-8 h-8 text-text-dim/30 flex-shrink-0 cursor-not-allowed" />
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mt-4 font-mono text-sm tracking-widest uppercase text-text-main">
                    <span className="text-text-dim">{t("prog_lbl_duration")} <span className="text-text-main block sm:inline mt-1 sm:mt-0">{prog[`Duration_${lang}`] || prog.Duration_UA || prog.duration}</span></span>
                    <span className="text-text-dim">{t("prog_lbl_degree")} <span className="text-text-main block sm:inline mt-1 sm:mt-0">{prog[`Degree_${lang}`] || prog.Degree_UA || prog.degree}</span></span>
                  </div>
                  <ProgramDisciplines prog={prog} disciplines={disciplines} lang={lang} t={t} />
                </div>
              )) : (
                <div className="text-text-dim font-mono text-xs uppercase">{t("prog_loading")}</div>
              )}
            </div>
          </div>
        </div>
      </section>



      {/* Master Dashboard */}
      <section id="master" className="grid grid-cols-1 border-b-2 border-border-main scroll-mt-[80px]">
        <div className="flex flex-col">
          <div className="sticky top-[80px] z-20 bg-surface-mut/95 backdrop-blur-md text-text-main p-6 flex justify-between items-center border-b-2 border-border-main">
            <h2 className="text-2xl font-bold uppercase tracking-widest break-words hyphens-auto">{t("prog_master")}</h2>
            <span className="font-mono text-sm">LEVEL 2</span>
          </div>
          
          <div className="p-6 md:p-12 flex-grow bg-page-bg">
            <div className="space-y-12">
              {mPrograms.length > 0 ? mPrograms.map((prog: any, idx: number) => (
                <div key={idx} className="group cursor-crosshair">
                  <div className="flex items-start justify-between border-b-2 border-border-soft pb-4 transition-colors group-hover:border-border-main">
                    <div>
                      <span className="font-mono text-xs text-text-dim block mb-2 uppercase">{t("prog_lbl_specialty")} {prog.Code || prog.code || prog.id}</span>
                      <h3 className="text-2xl md:text-3xl font-bold leading-none tracking-tight uppercase group-hover:text-accent-blue transition-colors text-text-main">
                        {prog[`Title_${lang}`] || prog.Title_UA || prog.title}
                      </h3>
                    </div>
                    {prog.Link || prog.link ? (
                      <a href={prog.Link || prog.link} target="_blank" rel="noopener noreferrer" className="flex-shrink-0" aria-label="Open Program">
                        <ArrowUpRight className="w-8 h-8 text-text-dim group-hover:text-text-main transition-colors" />
                      </a>
                    ) : (
                      <ArrowUpRight className="w-8 h-8 text-text-dim/30 flex-shrink-0 cursor-not-allowed" />
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mt-4 font-mono text-sm tracking-widest uppercase text-text-main">
                    <span className="text-text-dim">{t("prog_lbl_duration")} <span className="text-text-main block sm:inline mt-1 sm:mt-0">{prog[`Duration_${lang}`] || prog.Duration_UA || prog.duration}</span></span>
                    <span className="text-text-dim">{t("prog_lbl_degree")} <span className="text-text-main block sm:inline mt-1 sm:mt-0">{prog[`Degree_${lang}`] || prog.Degree_UA || prog.degree}</span></span>
                  </div>
                  <ProgramDisciplines prog={prog} disciplines={disciplines} lang={lang} t={t} />
                </div>
              )) : (
                 <div className="text-text-dim font-mono text-xs uppercase">{t("prog_loading")}</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* PhD Dashboard */}
      <section id="phd" className="grid grid-cols-1 border-b-2 border-border-main scroll-mt-[80px]">
        <div className="flex flex-col">
          <div className="sticky top-[80px] z-20 bg-surface-mut/95 backdrop-blur-md text-text-main p-6 flex justify-between items-center border-b-2 border-border-main">
            <h2 className="text-2xl font-bold uppercase tracking-widest break-words hyphens-auto">{t("prog_phd")}</h2>
            <span className="font-mono text-sm">LEVEL 3</span>
          </div>
          
          <div className="p-6 md:p-12 flex-grow bg-surface-main">
            <div className="space-y-12">
              {phdPrograms.length > 0 ? phdPrograms.map((prog: any, idx: number) => (
                <div key={idx} className="group cursor-crosshair">
                <div className="flex items-start justify-between border-b-2 border-border-soft pb-4 transition-colors group-hover:border-border-main">
                  <div>
                    <span className="font-mono text-xs text-text-dim block mb-2 uppercase">{t("prog_lbl_specialty")} {prog.Code || prog.code || prog.id}</span>
                    <h3 className="text-2xl md:text-3xl font-bold leading-none tracking-tight uppercase group-hover:text-accent-blue transition-colors text-text-main">
                      {prog[`Title_${lang}`] || prog.Title_UA || prog.title}
                    </h3>
                  </div>
                  {prog.Link || prog.link ? (
                    <a href={prog.Link || prog.link} target="_blank" rel="noopener noreferrer" className="flex-shrink-0" aria-label="Open Program">
                      <ArrowUpRight className="w-8 h-8 text-text-dim group-hover:text-text-main transition-colors" />
                    </a>
                  ) : (
                    <ArrowUpRight className="w-8 h-8 text-text-dim/30 flex-shrink-0 cursor-not-allowed" />
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mt-4 font-mono text-sm tracking-widest uppercase text-text-main">
                  <span className="text-text-dim">{t("prog_lbl_duration")} <span className="text-text-main block sm:inline mt-1 sm:mt-0">{prog[`Duration_${lang}`] || prog.Duration_UA || prog.duration}</span></span>
                  <span className="text-text-dim">{t("prog_lbl_degree")} <span className="text-text-main block sm:inline mt-1 sm:mt-0">{prog[`Degree_${lang}`] || prog.Degree_UA || prog.degree}</span></span>
                </div>
                <ProgramDisciplines prog={prog} disciplines={disciplines} lang={lang} t={t} />
              </div>
              )) : (
                <div className="text-text-dim font-mono text-xs uppercase">{t("prog_loading")}</div>
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
                  <li><a href="#bachelor" className="text-lg xl:text-xl font-bold uppercase text-text-dim hover:text-accent-blue transition-colors block">{t("prog_bachelor")}</a></li>
                  <li><a href="#master" className="text-lg xl:text-xl font-bold uppercase text-text-dim hover:text-accent-blue transition-colors block">{t("prog_master")}</a></li>
                  <li><a href="#phd" className="text-lg xl:text-xl font-bold uppercase text-text-dim hover:text-accent-blue transition-colors block">{t("prog_phd")}</a></li>
                </ul>
             </nav>
          </div>
        </aside>
      </div>
    </div>
  );
}
