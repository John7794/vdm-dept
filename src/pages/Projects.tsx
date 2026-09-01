import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useState, useMemo } from "react";
import { useCms } from "../contexts/CmsContext";
import { Link } from "react-router-dom";
import ResponsiveImage from "../components/ResponsiveImage";

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

  // Bento grid pattern generator
  const getBentoClasses = (idx: number, total: number) => {
    // If only one project is shown, make it span the entire grid 
    if (total === 1) return "md:col-span-2 md:row-span-2 lg:col-span-4 lg:row-span-2";
    
    // If exactly two projects are shown, make them evenly split the space
    if (total === 2) return "md:col-span-1 md:row-span-1 lg:col-span-2 lg:row-span-2";
    
    const i = idx % 7;
    // Mobile: 1 col, auto height (base classes)
    // Tablet (md): 2 cols
    // Desktop (lg): 4 cols
    switch (i) {
      case 0: return "md:col-span-2 md:row-span-2 lg:col-span-2 lg:row-span-2";
      case 1: return "md:col-span-1 md:row-span-1 lg:col-span-1 lg:row-span-1";
      case 2: return "md:col-span-1 md:row-span-1 lg:col-span-1 lg:row-span-1";
      case 3: return "md:col-span-2 md:row-span-1 lg:col-span-2 lg:row-span-1";
      case 4: return "md:col-span-1 md:row-span-1 lg:col-span-1 lg:row-span-1";
      case 5: return "md:col-span-1 md:row-span-1 lg:col-span-1 lg:row-span-1";
      case 6: return "md:col-span-2 md:row-span-1 lg:col-span-2 lg:row-span-1";
      default: return "";
    }
  };

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
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-[400px] lg:auto-rows-[450px] gap-[2px] bg-border-main border-b-2 border-border-main">
        {filteredProjects.map((project: any, idx: number) => {
          const title = project[`Title_${lang}`] || project.Title_UA || project.title || "";
          const type = project[`Type_${lang}`] || project.Type_UA || project.type || project.Type || "";
          const student = project[`Student_${lang}`] || project.Student_UA || project.student || "";
          const year = project.Year || project.year || "";
          const img = project.Image || project.image || project.img || project.Media || project.media || "";

          return (
            <motion.article 
              key={project.ID || project.id || idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`relative group flex flex-col bg-surface-main cursor-crosshair overflow-hidden ${getBentoClasses(idx, filteredProjects.length)}`}
            >
              <div className="flex-grow w-full bg-ink overflow-hidden relative">
                {(project.Image || project.image || project.img || project.Media || project.media || project.Image_2x || project.Image_Mobile || project.Image_Mobile_2x || project.Image_Tablet || project.Image_Tablet_2x) ? (
                  <ResponsiveImage 
                    desktopUrl={project.Image || project.image || project.img || project.Media || project.media || ""}
                    desktopUrl2x={project.Image_2x || project.image_2x || project.Media_2x || project.media_2x || ""}
                    tabletUrl={project.Image_Tablet || project.image_Tablet || project.Media_Tablet || project.media_Tablet || ""}
                    tabletUrl2x={project.Image_Tablet_2x || project.image_Tablet_2x || project.Media_Tablet_2x || project.media_Tablet_2x || ""}
                    mobileUrl={project.Image_Mobile || project.image_Mobile || project.Media_Mobile || project.media_Mobile || ""}
                    mobileUrl2x={project.Image_Mobile_2x || project.image_Mobile_2x || project.Media_Mobile_2x || project.media_Mobile_2x || ""}
                    alt={title}
                    className="absolute inset-0 w-full h-full object-cover grayscale opacity-70 mix-blend-screen group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-100 group-hover:mix-blend-normal transition-all duration-700 ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-mono text-xs text-paper/50 uppercase tracking-widest">
                    No Image
                  </div>
                )}
                
                {/* Gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                  <span className="bg-text-main text-page-bg p-4 rounded-full">
                    <ArrowUpRight className="w-6 h-6" />
                  </span>
                </div>
              </div>
              
              {/* Meta overlaid on bottom */}
              <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end pointer-events-none z-10">
                <div className="flex justify-between items-start mb-auto">
                  <span className="font-mono text-[10px] text-text-main bg-page-bg px-2 py-1 uppercase">{type}</span>
                  <span className="font-mono text-[10px] text-page-bg bg-text-main px-2 py-1 uppercase font-bold">{year}</span>
                </div>
                
                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-2xl lg:text-3xl font-bold uppercase tracking-tight leading-none mb-2 text-white">
                    {title}
                  </h3>
                  <p className="font-light text-sm text-white/80 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {t("proj_lbl_author")} <span className="font-bold">{student}</span>
                  </p>
                </div>
              </div>

              <Link to={`/projects/${project.ID || project.id}`} className="absolute inset-0 z-30" aria-label={`${t("proj_read_more")} ${title}`} />
            </motion.article>
          );
        })}
      </section>
    </div>
  );
}
