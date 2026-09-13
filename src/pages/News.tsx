import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useCms } from "../contexts/CmsContext";
import { Link } from "react-router-dom";
import ResponsiveImage from "../components/ResponsiveImage";
import { formatDriveLink } from "../lib/utils";

export default function News() {
  const { data, lang, t } = useCms();
  const newsItemsRaw = data?.news || [];
  const [activeFilter, setActiveFilter] = useState("ALL");

  const filters = useMemo(() => {
    const types = new Set<string>();
    newsItemsRaw.forEach((p: any) => {
      const type = p[`Type_${lang}`] || p.Type_UA || p.type || p.Type || "";
      if (type) {
        type.split(/[,;]/).forEach((tStr: string) => types.add(tStr.trim()));
      }
    });
    return ["ALL", ...Array.from(types).filter(Boolean)];
  }, [newsItemsRaw, lang]);

  const newsItems = newsItemsRaw.filter((item: any) => {
    if (activeFilter === "ALL") return true;
    const type = item[`Type_${lang}`] || item.Type_UA || item.type || item.Type || "";
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
            className="text-5xl md:text-7xl lg:text-[8rem] font-bold leading-[0.85] tracking-[-0.04em] uppercase text-text-main text-balance whitespace-pre-line break-words hyphens-auto"
          >
            {t("news_page_title")}
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
                {filter === "ALL" ? t("news_tag_latest", "ОСТАННІ НОВИНИ") : filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic News Feed */}
      <section className="grid grid-cols-1 md:grid-cols-12 bg-page-bg border-b-2 border-border-main">
        <div className="md:col-span-12 divide-y-2 border-border-main divide-border-main">
          {newsItems.map((item: any, idx: number) => {
            const title = item[`Title_${lang}`] || item.Title_UA || item.title || "";
            const desc = item[`Desc_${lang}`] || item.Desc_UA || item.desc || item.excerpt || "";
            const type = item[`Type_${lang}`] || item.Type_UA || item.type || "";
            const date = item[`Date_${lang}`] || item.Date_UA || item.Date || item.date || "";

            return (
              <motion.article 
                key={item.ID || item.id || idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="relative p-6 md:p-12 group hover:bg-surface-main transition-colors cursor-crosshair flex flex-col md:flex-row gap-8"
              >
                <div className="w-full md:w-48 flex-shrink-0 flex flex-col gap-4">
                  <div>
                    <span className="font-mono text-xl font-bold tracking-tighter text-text-main">{date}</span>
                    {type && <span className="inline-block mt-2 font-mono text-xs text-text-dim border border-border-soft px-2 py-1 w-max uppercase">{type}</span>}
                  </div>
                  
                  {(item.Image || item.image || item.img || item.Media || item.media || item.Media || item.media || item.Image_2x || item.Image_Mobile || item.Image_Mobile_2x || item.Image_Tablet || item.Image_Tablet_2x) && (
                    <div className="w-full aspect-square md:aspect-[4/3] border border-border-main bg-surface-mut overflow-hidden hidden md:block">
                      <ResponsiveImage 
                        desktopUrl={item.Image || item.image || item.img || item.Media || item.media || item.Media || item.media || ""}
                        desktopUrl2x={item.Image_2x || item.image_2x || item.Media_2x || item.media_2x || ""}
                        tabletUrl={item.Image_Tablet || item.image_Tablet || item.Media_Tablet || item.media_Tablet || ""}
                        tabletUrl2x={item.Image_Tablet_2x || item.image_Tablet_2x || item.Media_Tablet_2x || item.media_Tablet_2x || ""}
                        mobileUrl={item.Image_Mobile || item.image_Mobile || item.Media_Mobile || item.media_Mobile || ""}
                        mobileUrl2x={item.Image_Mobile_2x || item.image_Mobile_2x || item.Media_Mobile_2x || item.media_Mobile_2x || ""}
                        alt={title}
                        className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex-grow flex flex-col">
                  {(item.Image || item.image || item.img || item.Media || item.media || item.Media || item.media || item.Image_2x || item.Image_Mobile || item.Image_Mobile_2x || item.Image_Tablet || item.Image_Tablet_2x) && (
                    <div className="w-full aspect-[16/9] border border-border-main bg-surface-mut overflow-hidden mb-6 md:hidden">
                      <ResponsiveImage 
                        desktopUrl={item.Image || item.image || item.img || item.Media || item.media || item.Media || item.media || ""}
                        desktopUrl2x={item.Image_2x || item.image_2x || item.Media_2x || item.media_2x || ""}
                        tabletUrl={item.Image_Tablet || item.image_Tablet || item.Media_Tablet || item.media_Tablet || ""}
                        tabletUrl2x={item.Image_Tablet_2x || item.image_Tablet_2x || item.Media_Tablet_2x || item.media_Tablet_2x || ""}
                        mobileUrl={item.Image_Mobile || item.image_Mobile || item.Media_Mobile || item.media_Mobile || ""}
                        mobileUrl2x={item.Image_Mobile_2x || item.image_Mobile_2x || item.Media_Mobile_2x || item.media_Mobile_2x || ""}
                        alt={title}
                        className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                      />
                    </div>
                  )}
                  <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tight leading-none mb-4 group-hover:text-accent-blue transition-colors text-balance text-text-main">
                    {title}
                  </h3>
                  <p className="text-text-main opacity-80 font-light leading-relaxed max-w-2xl whitespace-pre-line">
                    {desc}
                  </p>
                  <div className="mt-8 font-mono text-xs uppercase tracking-widest flex items-center gap-2 font-bold group-hover:underline underline-offset-4">
                    {t("news_read_more")} <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>

                <Link to={`/news/${item.ID || item.id}`} className="absolute inset-0 z-10 focus-ring" aria-label={`${t("news_read_more")} ${title}`} />
              </motion.article>
            );
          })}
          
          {newsItems.length === 0 && (
             <div className="p-12 text-center opacity-50 font-mono text-xs uppercase tracking-widest">
               No news found
             </div>
          )}
        </div>
        
        
      </section>
    </div>
  );
}
