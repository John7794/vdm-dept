import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Calendar, Filter, Sparkles } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useCms } from "../contexts/CmsContext";
import SeoHead from "../components/SeoHead";
import { Link } from "react-router-dom";
import ResponsiveImage from "../components/ResponsiveImage";
import { formatNewsDisplayDate, parseNewsDateToTimestamp } from "../lib/utils";

const PAGE_SIZE = 8;

export default function News() {
  const { data, lang, t } = useCms();
  const newsItemsRaw = data?.news || [];
  
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [activeYear, setActiveYear] = useState("ALL");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Extract available categories
  const categoryFilters = useMemo(() => {
    const types = new Set<string>();
    newsItemsRaw.forEach((p: any) => {
      const type = p[`Type_${lang}`] || p.Type_UA || p.type || p.Type || "";
      if (type) {
        type.split(/[,;]/).forEach((tStr: string) => types.add(tStr.trim()));
      }
    });
    return ["ALL", ...Array.from(types).filter(Boolean)];
  }, [newsItemsRaw, lang]);

  // Extract available years
  const yearFilters = useMemo(() => {
    const years = new Set<string>();
    newsItemsRaw.forEach((p: any) => {
      const d = p[`Date_${lang}`] || p.Date_UA || p.Date_EN || p.Date || "";
      const match = d.match(/202\d/);
      if (match) years.add(match[0]);
    });
    return ["ALL", ...Array.from(years).sort().reverse()];
  }, [newsItemsRaw, lang]);

  // Filter and sort items chronologically (newest first)
  const filteredSortedNews = useMemo(() => {
    const filtered = newsItemsRaw.filter((item: any) => {
      // Filter by category
      if (activeFilter !== "ALL") {
        const type = item[`Type_${lang}`] || item.Type_UA || item.type || item.Type || "";
        if (!type.includes(activeFilter)) return false;
      }
      // Filter by year
      if (activeYear !== "ALL") {
        const d = item[`Date_${lang}`] || item.Date_UA || item.Date_EN || item.Date || "";
        if (!d.includes(activeYear)) return false;
      }
      return true;
    });

    return [...filtered].sort((a: any, b: any) => {
      const timeA = parseNewsDateToTimestamp(a.Date_EN || a.Date_UA || a.Date || a.date);
      const timeB = parseNewsDateToTimestamp(b.Date_EN || b.Date_UA || b.Date || b.date);
      return timeB - timeA;
    });
  }, [newsItemsRaw, activeFilter, activeYear, lang]);

  // Reset pagination on filter change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeFilter, activeYear]);

  // Slice for load-more pagination
  const displayedItems = useMemo(() => {
    return filteredSortedNews.slice(0, visibleCount);
  }, [filteredSortedNews, visibleCount]);

  const hasMore = visibleCount < filteredSortedNews.length;

  return (
    <div className="flex flex-col w-full bg-page-bg">
      <SeoHead
        title={t("nav_news", "Новини")}
        description="Новини, події, виставки та анонси кафедри візуального дизайну і мистецтва."
        breadcrumbName={t("nav_news", "Новини")}
      />

      {/* Page Header */}
      <section className="border-b-2 border-border-main bg-surface-main p-6 md:p-12 lg:p-16 relative overflow-hidden">
        <div className="max-w-[1200px] z-10 relative">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-7xl lg:text-[7rem] font-bold leading-[0.88] tracking-[-0.04em] uppercase text-text-main text-balance whitespace-pre-line break-words hyphens-auto"
          >
            {t("news_page_title", "Новини\n& Події.")}
          </motion.h1>

          {/* Filters Bar */}
          <div className="mt-10 pt-8 border-t-2 border-border-main/20 flex flex-col gap-6">
            {/* Year Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-text-main/60 flex items-center gap-1.5 mr-2">
                <Calendar className="w-3.5 h-3.5" />
                {lang === "UA" ? "Рік:" : lang === "DE" ? "Jahr:" : lang === "PL" ? "Rok:" : "Year:"}
              </span>
              {yearFilters.map(year => (
                <button
                  key={year}
                  onClick={() => setActiveYear(year)}
                  className={`font-mono text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 transition-all cursor-pointer focus-ring outline-none border ${
                    activeYear === year
                      ? "bg-text-main text-page-bg border-text-main shadow-sm"
                      : "bg-surface-mut/60 text-text-main/80 border-border-main/50 hover:bg-surface-mut hover:text-text-main"
                  }`}
                >
                  {year === "ALL" 
                    ? (lang === "UA" ? "Усі роки" : lang === "DE" ? "Alle Jahre" : lang === "PL" ? "Wszystkie lata" : "All years")
                    : year
                  }
                </button>
              ))}
            </div>

            {/* Category / Topic Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-text-main/60 flex items-center gap-1.5 mr-2">
                <Filter className="w-3.5 h-3.5" />
                {lang === "UA" ? "Тема:" : lang === "DE" ? "Thema:" : lang === "PL" ? "Kategoria:" : "Topic:"}
              </span>
              {categoryFilters.map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`font-mono text-xs uppercase tracking-wider px-3.5 py-1.5 transition-all cursor-pointer focus-ring outline-none border ${
                    activeFilter === filter 
                      ? "bg-accent-yellow text-black font-bold border-black shadow-sm" 
                      : "bg-surface-mut/60 text-text-main/80 border-border-main/50 hover:bg-surface-mut hover:text-text-main"
                  }`}
                >
                  {filter === "ALL" 
                    ? (lang === "UA" ? "Усі теми" : lang === "DE" ? "Alle Themen" : lang === "PL" ? "Wszystkie tematy" : "All topics")
                    : filter
                  }
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic News Feed */}
      <section className="grid grid-cols-1 md:grid-cols-12 bg-page-bg border-b-2 border-border-main">
        <div className="md:col-span-12 divide-y-2 border-border-main divide-border-main">
          {displayedItems.map((item: any, idx: number) => {
            const title = item[`Title_${lang}`] || item.Title_UA || item.title || "";
            const desc = item[`Desc_${lang}`] || item.Desc_UA || item.desc || item.excerpt || "";
            const type = item[`Type_${lang}`] || item.Type_UA || item.type || "";
            const date = formatNewsDisplayDate(item, lang);
            const imageSrc = item.Image || item.image || item.img || item.Media || item.media || "";

            return (
              <motion.article 
                key={item.ID || item.id || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="relative p-6 md:p-10 lg:p-12 group hover:bg-surface-main transition-colors cursor-crosshair flex flex-col md:flex-row gap-8 items-start"
              >
                {/* Left Meta & Thumbnail */}
                <div className="w-full md:w-56 flex-shrink-0 flex flex-col gap-4">
                  <div>
                    <span className="font-mono text-lg md:text-xl font-bold tracking-tight text-text-main block">
                      {date}
                    </span>
                    {type && (
                      <span className="inline-block mt-2 font-mono text-xs text-text-main font-semibold bg-surface-mut border border-border-main px-2.5 py-1 uppercase">
                        {type}
                      </span>
                    )}
                  </div>
                  
                  {imageSrc && (
                    <div className="w-full aspect-[4/3] border-2 border-border-main bg-surface-mut overflow-hidden hidden md:block shadow-sm group-hover:border-accent-yellow transition-colors">
                      <ResponsiveImage 
                        desktopUrl={imageSrc}
                        desktopUrl2x={item.Image_2x || imageSrc}
                        tabletUrl={item.Image_Tablet || imageSrc}
                        tabletUrl2x={item.Image_Tablet_2x || imageSrc}
                        mobileUrl={item.Image_Mobile || imageSrc}
                        mobileUrl2x={item.Image_Mobile_2x || imageSrc}
                        alt={title}
                        className="w-full h-full object-cover grayscale opacity-85 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                      />
                    </div>
                  )}
                </div>
                
                {/* Main Content */}
                <div className="flex-grow flex flex-col">
                  {imageSrc && (
                    <div className="w-full aspect-[16/9] border-2 border-border-main bg-surface-mut overflow-hidden mb-6 md:hidden shadow-sm">
                      <ResponsiveImage 
                        desktopUrl={imageSrc}
                        desktopUrl2x={item.Image_2x || imageSrc}
                        tabletUrl={item.Image_Tablet || imageSrc}
                        tabletUrl2x={item.Image_Tablet_2x || imageSrc}
                        mobileUrl={item.Image_Mobile || imageSrc}
                        mobileUrl2x={item.Image_Mobile_2x || imageSrc}
                        alt={title}
                        className="w-full h-full object-cover grayscale opacity-85 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                      />
                    </div>
                  )}
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold uppercase tracking-tight leading-snug mb-4 group-hover:text-accent-yellow transition-colors text-balance text-text-main">
                    {title}
                  </h3>
                  <p className="text-text-main/80 font-light leading-relaxed max-w-3xl whitespace-pre-line text-sm md:text-base">
                    {desc}
                  </p>
                  <div className="mt-6 font-mono text-xs uppercase tracking-widest flex items-center gap-2 font-bold group-hover:translate-x-1 transition-transform">
                    {t("news_read_more", "Читати далі")} <ArrowRight className="w-4 h-4 text-accent-yellow" />
                  </div>
                </div>

                <Link 
                  to={`/news/${item.ID || item.id}`} 
                  className="absolute inset-0 z-10 focus-ring" 
                  aria-label={`${t("news_read_more", "Читати далі")}: ${title}`} 
                />
              </motion.article>
            );
          })}
          
          {filteredSortedNews.length === 0 && (
             <div className="p-16 text-center opacity-60 font-mono text-sm uppercase tracking-widest">
               {lang === "UA" ? "Новин за обраними фільтрами не знайдено" : "No news found for the selected filters"}
             </div>
          )}
        </div>
      </section>

      {/* Pagination / Load More Bar */}
      {hasMore && (
        <section className="p-8 md:p-12 border-b-2 border-border-main bg-surface-main flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="font-mono text-xs md:text-sm tracking-widest text-text-main/70 uppercase">
            {lang === "UA" ? "Показано" : lang === "DE" ? "Angezeigt" : lang === "PL" ? "Pokazano" : "Showing"}{" "}
            <strong className="text-text-main font-bold">{displayedItems.length}</strong>{" "}
            {lang === "UA" ? "із" : lang === "DE" ? "von" : lang === "PL" ? "z" : "of"}{" "}
            <strong className="text-text-main font-bold">{filteredSortedNews.length}</strong>{" "}
            {lang === "UA" ? "новин" : lang === "DE" ? "Nachrichten" : lang === "PL" ? "wiadomości" : "news"}
          </div>
          <button
            onClick={() => setVisibleCount(prev => prev + PAGE_SIZE)}
            className="w-full sm:w-auto px-10 py-4 bg-accent-yellow text-black font-mono text-xs font-bold uppercase tracking-widest border-2 border-black hover:bg-black hover:text-white transition-all shadow-md active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {lang === "UA" 
              ? `Показати ще (+${Math.min(PAGE_SIZE, filteredSortedNews.length - displayedItems.length)})` 
              : `Load more (+${Math.min(PAGE_SIZE, filteredSortedNews.length - displayedItems.length)})`
            }
          </button>
        </section>
      )}

      {!hasMore && filteredSortedNews.length > PAGE_SIZE && (
        <div className="p-6 text-center font-mono text-xs text-text-dim uppercase tracking-widest border-b-2 border-border-main bg-surface-mut">
          ✓ {lang === "UA" ? "Усі новини за цим фільтром завантажено" : "All news for this filter have been loaded"} ({filteredSortedNews.length})
        </div>
      )}
    </div>
  );
}
