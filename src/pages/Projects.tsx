import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useState, useMemo } from "react";
import { useCms } from "../contexts/CmsContext";
import { Link } from "react-router-dom";

export default function Projects() {
  const { data, lang, t } = useCms();
  const [activeFilter, setActiveFilter] = useState("ALL");
  
  const projects = data?.projects || [];

  // Extract unique types for the filter based on the current language
  const filters = useMemo(() => {
    const types = new Set<string>();
    projects.forEach((p: any) => {
      const type = p[`Type_${lang}`] || p.Type_UA || p.type || p.Type || "";
      if (type) {
        // Handle comma-separated types if necessary
        type.split(',').forEach((tStr: string) => types.add(tStr.trim()));
      }
    });
    return ["ALL", ...Array.from(types)];
  }, [projects, lang]);

  const filteredProjects = projects.filter((project: any) => {
    if (activeFilter === "ALL") return true;
    const type = project[`Type_${lang}`] || project.Type_UA || project.type || project.Type || "";
    return type.includes(activeFilter);
  });

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
            {t("proj_page_title")}
          </motion.h1>
          <div className="mt-8 flex flex-wrap gap-4">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`font-mono text-xs uppercase tracking-widest border border-border-main px-3 py-1 transition-colors cursor-pointer focus-ring outline-none ${
                  activeFilter === filter 
                    ? "bg-text-main text-page-bg" 
                    : "bg-surface-main text-text-main hover:bg-surface-mut"
                }`}
              >
                {filter === "ALL" ? t("proj_filter_all") : filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-border-main border-b-2 border-border-main">
        {filteredProjects.map((project: any, idx: number) => {
          const title = project[`Title_${lang}`] || project.Title_UA || project.title || "";
          const type = project[`Type_${lang}`] || project.Type_UA || project.type || project.Type || "";
          const student = project[`Student_${lang}`] || project.Student_UA || project.student || "";
          const year = project.Year || project.year || "";
          const img = project.Image || project.image || project.img || "";

          return (
            <motion.article 
              key={project.ID || project.id || idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="relative group flex flex-col bg-surface-main cursor-crosshair border-b-2 lg:border-b-0 lg:border-b-[transparent] border-border-main lg:[&:nth-last-child(-n+3)]:border-b-0 lg:[&:not(:nth-last-child(-n+3))]:border-b-2"
            >
              {/* Image Placeholder */}
              <div className="aspect-[4/3] w-full bg-ink overflow-hidden relative border-b-2 border-border-main">
                {img ? (
                  <img 
                    src={img} 
                    alt={title} 
                    className="w-full h-full object-cover grayscale opacity-70 mix-blend-screen group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-100 group-hover:mix-blend-normal transition-all duration-700 ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-mono text-xs text-paper/50 uppercase tracking-widest">
                    No Image
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-ink/20 backdrop-blur-sm">
                  <span className="bg-text-main text-page-bg p-4 rounded-full pointer-events-none">
                    <ArrowUpRight className="w-6 h-6" />
                  </span>
                </div>
              </div>
              
              {/* Meta */}
              <div className="p-6 md:p-8 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <span className="font-mono text-[10px] text-text-dim border border-border-soft px-2 py-1 uppercase">{type}</span>
                  <span className="font-mono text-[10px] text-text-main uppercase font-bold">{year}</span>
                </div>
                <h3 className="text-2xl font-bold uppercase tracking-tight leading-none mb-2 group-hover:text-accent-blue transition-colors text-balance text-text-main">
                  {title}
                </h3>
                <p className="font-light text-sm text-text-main mt-auto pt-4 uppercase tracking-wider">
                  {t("proj_lbl_author")} <span className="font-bold">{student}</span>
                </p>
              </div>

              <Link to={`/projects/${project.ID || project.id}`} className="absolute inset-0 z-10" aria-label={`${t("proj_read_more")} ${title}`} />
            </motion.article>
          );
        })}
      </section>
    </div>
  );
}
