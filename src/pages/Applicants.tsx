import { motion } from "motion/react";
import { ArrowRight, CheckSquare } from "lucide-react";
import { useCms } from "../contexts/CmsContext";

export default function Applicants() {
  const { data, lang, t } = useCms();
  
  const steps = data?.applicantssteps || [];
  const documents = data?.applicantsdocuments || [];
  const checklist = data?.applicantschecklist || [];

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
            {t("app_page_title") || "ВСТУПНИКУ\n2026."}
          </motion.h1>
          <p className="mt-8 text-xl max-w-2xl font-light leading-relaxed text-text-main whitespace-pre-line">
            {t("app_page_desc") || "Чіткий алгоритм вступу на програми бакалавріату та магістратури. Терміни, вимоги до творчого конкурсу, документація."}
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-border-main border-b-2 border-border-main">
        
        {/* Left Column: Algorithm */}
        <div className="lg:col-span-8 bg-surface-main p-6 md:p-12 lg:p-16">
           <span className="font-mono text-xs text-text-dim block mb-8 uppercase tracking-widest">{t("app_algorithm_lbl") || "Алгоритм"}</span>
           <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-12 leading-none text-text-main">
             {t("app_steps_title") || "Кроки до зарахування"}
           </h2>
           
           <div className="space-y-12">
             {steps.length > 0 ? steps.map((step: any, idx: number) => {
               const title = step[`Title_${lang}`] || step.Title_UA || step.title || step.Title || "";
               const desc = step[`Desc_${lang}`] || step.Desc_UA || step.desc || step.description || step.Desc || "";
               return (
                 <div key={step.ID || step.id || idx} className="flex flex-col md:flex-row gap-6 md:gap-12">
                   <div className="font-mono text-4xl md:text-6xl font-bold text-border-main pointer-events-none select-none">
                     {String(idx + 1).padStart(2, '0')}
                   </div>
                   <div>
                     <h3 className="text-xl font-bold uppercase tracking-widest mb-2 text-accent-blue">{title}</h3>
                     <p className="font-light leading-relaxed text-text-main whitespace-pre-line">
                       {desc}
                     </p>
                   </div>
                 </div>
               );
             }) : (
               <div className="text-text-dim font-mono text-xs">{t("app_loading") || "Завантаження..."}</div>
             )}
           </div>
        </div>
        
        {/* Right Column: Key info and Downloads */}
        <div className="lg:col-span-4 bg-page-bg">
          <div className="p-6 md:p-12 border-b-2 border-border-main">
             <span className="font-mono text-xs text-text-dim block mb-6 uppercase tracking-widest">{t("app_docs_lbl") || "Документація"}</span>
             <h3 className="text-xl font-bold uppercase tracking-tight mb-6 text-text-main">{t("app_docs_title") || "Матеріали для завантаження"}</h3>
             
             <div className="space-y-4">
               {documents.length > 0 ? documents.map((doc: any, idx: number) => {
                 const title = doc[`Title_${lang}`] || doc.Title_UA || doc.title || doc.Title || "";
                 const type = doc[`Type_${lang}`] || doc.Type_UA || doc.type || doc.Type || "";
                 const info = doc[`Info_${lang}`] || doc.Info_UA || doc.info || doc.Info || "";
                 const url = doc.Url || doc.url || doc.Link || doc.link || "#";

                 return (
                   <div key={doc.ID || doc.id || idx} className="mb-6">
                      <h4 className="text-sm font-bold uppercase mb-2 text-text-main">{title}</h4>
                      <a 
                        href={url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-between w-full border-2 border-border-main p-4 hover:bg-text-main hover:text-page-bg text-text-main transition-colors focus-ring outline-none group text-left"
                      >
                        <span className="font-bold uppercase tracking-widest text-sm">{t("app_docs_download") || "Завантажити"} {type}</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </a>
                      {info && <p className="font-mono text-[10px] text-text-dim mt-2 uppercase">{info}</p>}
                   </div>
                 );
               }) : (
                 <div className="text-text-dim font-mono text-xs">{t("app_docs_empty") || "Немає доступних документів."}</div>
               )}
             </div>
          </div>
          
          <div className="p-6 md:p-12 text-text-main">
             <span className="font-mono text-xs text-text-dim block mb-6 uppercase tracking-widest">{t("app_checklist_lbl") || "Чек-лист"}</span>
             <h3 className="text-xl font-bold uppercase tracking-tight mb-6">{t("app_checklist_title") || "Обов'язкові документи"}</h3>
             <ul className="space-y-4">
               {checklist.length > 0 ? checklist.map((item: any, i: number) => {
                 const text = item[`Text_${lang}`] || item.Text_UA || item.text || item.Text || "";
                 if (!text) return null;
                 return (
                   <li key={i} className="flex gap-4 items-start">
                     <CheckSquare className="w-5 h-5 flex-shrink-0 mt-0.5 text-text-main" />
                     <span className="leading-snug font-medium">{text}</span>
                   </li>
                 );
               }) : (
                 <li className="flex gap-4 items-start">
                   <span className="leading-snug font-medium text-text-dim">{t("app_loading") || "Завантаження..."}</span>
                 </li>
               )}
             </ul>
          </div>
        </div>

      </section>
      
      {/* Footer Banner */}
      <section className="bg-accent-yellow text-ink p-6 md:p-12 lg:p-16 text-center border-t-2 border-border-main">
        <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-4">{t("app_faq_title") || "Маєте запитання щодо вступу?"}</h2>
        <p className="font-mono text-sm uppercase tracking-widest mb-8">{t("app_faq_desc") || "Звертайтеся до приймальної комісії НУЛП."}</p>
        <a href="tel:+380322582537" className="inline-flex items-center gap-2 border-2 border-ink text-ink px-8 py-4 font-bold uppercase tracking-widest hover:bg-ink hover:text-paper transition-colors focus-ring">
          +38 (032) 258-25-37
        </a>
      </section>
    </div>
  );
}
