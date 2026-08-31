import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useCms } from "../contexts/CmsContext";
import { Link } from "react-router-dom";

export default function News() {
  const { data, lang, t } = useCms();
  const newsItems = data?.news || [];

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
            {t("news_page_title")}
          </motion.h1>
          <div className="mt-8 flex flex-wrap gap-4">
            <span className="font-mono text-xs uppercase tracking-widest border border-border-main px-3 py-1 bg-text-main text-page-bg">{t("news_tag_latest")}</span>
            <span className="font-mono text-xs uppercase tracking-widest border border-border-main px-3 py-1">{t("news_tag_announcements")}</span>
          </div>
        </div>
      </section>

      {/* Dynamic News Feed */}
      <section className="grid grid-cols-1 md:grid-cols-12 bg-page-bg border-b-2 border-border-main">
        <div className="md:col-span-8 lg:col-span-9 divide-y-2 lg:border-r-2 border-border-main divide-border-main">
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
                <div className="w-full md:w-48 flex-shrink-0 flex flex-col">
                  <span className="font-mono text-xl font-bold tracking-tighter text-text-main">{date}</span>
                  {type && <span className="inline-block mt-2 font-mono text-xs text-text-dim border border-border-soft px-2 py-1 w-max uppercase">{type}</span>}
                </div>
                
                <div className="flex-grow">
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
        </div>
        
        {/* Sidebar */}
        <aside className="md:col-span-4 lg:col-span-3 bg-surface-main p-6 md:p-12 border-t-2 md:border-t-0 border-border-main">
           <span className="font-mono text-xs text-text-dim block mb-8 uppercase tracking-widest">{t("news_subscribe_lbl")}</span>
           <h3 className="text-xl font-bold uppercase mb-4 text-text-main">{t("news_subscribe_title")}</h3>
           <p className="font-light text-sm text-text-main opacity-80 mb-6">{t("news_subscribe_desc")}</p>
           <form className="flex flex-col gap-4 relative z-20">
             <input 
               type="email" 
               placeholder={t("news_subscribe_placeholder")}
               className="w-full border-2 border-border-main p-3 font-mono text-xs uppercase focus-ring outline-none bg-transparent placeholder-text-dim"
               required
             />
             <button type="submit" className="w-full bg-text-main text-page-bg font-bold uppercase tracking-widest text-sm p-4 hover:bg-accent-blue hover:text-paper transition-colors focus-ring outline-none">
               {t("news_subscribe_btn")}
             </button>
           </form>
           
           <div className="mt-16 brutal-grid h-32 w-full opacity-50 border-t-2 border-border-main"></div>
        </aside>
      </section>
    </div>
  );
}
