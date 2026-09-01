import { motion } from "motion/react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { useMemo } from "react";
import { useCms } from "../contexts/CmsContext";

export default function Programs() {
  const { data, lang, t } = useCms();
  const programs = data?.programs || [];

  const bPrograms = useMemo(() => programs.filter((p: any) => 
    (p.Level_UA || p.Level || p.level) === "Бакалавріат"
  ), [programs]);
  
  const mPrograms = useMemo(() => programs.filter((p: any) => 
    (p.Level_UA || p.Level || p.level) === "Магістратура"
  ), [programs]);
  
  const phdPrograms = useMemo(() => programs.filter((p: any) => 
    (p.Level_UA || p.Level || p.level) === "Аспірантура"
  ), [programs]);

  const parseCompetencies = (prog: any) => {
    if (!prog) return [];
    const compRaw = prog[`Competencies_${lang}`] || prog.Competencies_UA || prog.competencies;
    if (typeof compRaw === 'string' && compRaw.trim() !== '') {
      return compRaw.split(';').map(c => c.trim()).filter(Boolean);
    } else if (Array.isArray(compRaw)) {
      return compRaw;
    }
    return [];
  };

  const bCompetencies = bPrograms.length > 0 ? parseCompetencies(bPrograms[0]) : [];
  const mCompetencies = mPrograms.length > 0 ? parseCompetencies(mPrograms[0]) : [];
  const phdCompetencies = phdPrograms.length > 0 ? parseCompetencies(phdPrograms[0]) : [];

  return (
    <div className="flex flex-col w-full bg-page-bg">
      {/* Page Header */}
      <section className="border-b-2 border-border-main bg-surface-main p-6 md:p-12 lg:p-16 relative overflow-hidden">
        <div className="max-w-[1000px] z-10 relative">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-7xl lg:text-[8rem] font-bold leading-[0.85] tracking-[-0.04em] uppercase text-text-main text-balance whitespace-pre-line"
          >
            {t("prog_page_title")}
          </motion.h1>
          <p className="mt-8 text-xl max-w-2xl font-light leading-relaxed text-text-main whitespace-pre-line">
            {t("prog_page_desc")}
          </p>
        </div>
      </section>

      {/* Dashboard Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-border-main border-b-2 border-border-main">
        
        {/* Bachelor Dashboard */}
        <div className="flex flex-col">
          <div className="bg-surface-mut text-text-main p-6 flex justify-between items-center border-b-2 border-border-main">
            <h2 className="text-2xl font-bold uppercase tracking-widest">{t("prog_bachelor")}</h2>
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
                  <div className="flex gap-8 mt-4 font-mono text-sm tracking-widest uppercase text-text-main">
                    <span className="text-text-dim">{t("prog_lbl_duration")} <span className="text-text-main">{prog[`Duration_${lang}`] || prog.Duration_UA || prog.duration}</span></span>
                    <span className="text-text-dim">{t("prog_lbl_degree")} <span className="text-text-main">{prog[`Degree_${lang}`] || prog.Degree_UA || prog.degree}</span></span>
                  </div>
                </div>
              )) : (
                <div className="text-text-dim font-mono text-xs uppercase">{t("prog_loading")}</div>
              )}
            </div>
            
            {bCompetencies.length > 0 && (
              <div className="mt-16 bg-page-bg p-8 border border-border-soft">
                <h4 className="font-bold uppercase tracking-widest mb-6">{t("prog_lbl_comp_bachelor")}</h4>
                <ul className="space-y-4">
                  {bCompetencies.map((skill: string, i: number) => (
                    <li key={i} className="flex gap-4 items-start">
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span className="leading-snug">{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Master Dashboard */}
        <div className="flex flex-col">
          <div className="bg-surface-mut text-text-main p-6 flex justify-between items-center border-b-2 border-border-main">
            <h2 className="text-2xl font-bold uppercase tracking-widest">{t("prog_master")}</h2>
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
                  <div className="flex gap-8 mt-4 font-mono text-sm tracking-widest uppercase text-text-main">
                    <span className="text-text-dim">{t("prog_lbl_duration")} <span className="text-text-main">{prog[`Duration_${lang}`] || prog.Duration_UA || prog.duration}</span></span>
                    <span className="text-text-dim">{t("prog_lbl_degree")} <span className="text-text-main">{prog[`Degree_${lang}`] || prog.Degree_UA || prog.degree}</span></span>
                  </div>
                </div>
              )) : (
                 <div className="text-text-dim font-mono text-xs uppercase">{t("prog_loading")}</div>
              )}
            </div>
            
            {mCompetencies.length > 0 && (
              <div className="mt-16 bg-surface-main p-8 border border-border-soft">
                <h4 className="font-bold uppercase tracking-widest mb-6">{t("prog_lbl_comp_master")}</h4>
                <ul className="space-y-4">
                  {mCompetencies.map((skill: string, i: number) => (
                    <li key={i} className="flex gap-4 items-start">
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-accent-blue" />
                      <span className="leading-snug">{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

      </section>

      {/* PhD Dashboard */}
      <section className="grid grid-cols-1 border-b-2 border-border-main">
        <div className="flex flex-col">
          <div className="bg-surface-mut text-text-main p-6 flex justify-between items-center border-b-2 border-border-main">
            <h2 className="text-2xl font-bold uppercase tracking-widest">{t("prog_phd")}</h2>
            <span className="font-mono text-sm">LEVEL 3</span>
          </div>
          
          <div className="p-6 md:p-12 bg-surface-main">
            <div className="space-y-12 max-w-3xl">
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
                <div className="flex gap-8 mt-4 font-mono text-sm tracking-widest uppercase text-text-main">
                  <span className="text-text-dim">{t("prog_lbl_duration")} <span className="text-text-main">{prog[`Duration_${lang}`] || prog.Duration_UA || prog.duration}</span></span>
                  <span className="text-text-dim">{t("prog_lbl_degree")} <span className="text-text-main">{prog[`Degree_${lang}`] || prog.Degree_UA || prog.degree}</span></span>
                </div>
              </div>
              )) : (
                <div className="text-text-dim font-mono text-xs uppercase">{t("prog_loading")}</div>
              )}
            </div>
            
            {phdCompetencies.length > 0 && (
              <div className="mt-16 bg-surface-mut p-8 border border-border-soft max-w-3xl">
                <h4 className="font-bold uppercase tracking-widest mb-6">{t("prog_lbl_comp_phd")}</h4>
                <ul className="space-y-4">
                  {phdCompetencies.map((skill: string, i: number) => (
                    <li key={i} className="flex gap-4 items-start">
                      <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-accent-blue" />
                      <span className="leading-snug">{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
