import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { useCms } from "../contexts/CmsContext";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  const { t } = useCms();

  return (
    <div className="flex flex-col w-full min-h-[85vh] bg-page-bg items-center justify-center p-6 md:p-12 relative overflow-hidden">
      
      {/* Huge background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] dark:opacity-[0.05] z-0 overflow-hidden">
        <span className="text-[40vw] font-bold leading-none select-none tracking-tighter">
          404
        </span>
      </div>

      <div className="z-10 relative flex flex-col items-center text-center max-w-2xl">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-6xl md:text-8xl lg:text-[10rem] font-bold leading-none tracking-tighter uppercase text-text-main mb-6"
        >
          404
        </motion.h1>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-text-main mb-8"
        >
          {t("not_found_title", "Сторінку не знайдено")}
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg text-text-dim mb-12"
        >
          {t("not_found_desc", "Можливо, вона була видалена, або ви перейшли за неправильним посиланням. Давайте повернемося на головну.")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link 
            to="/" 
            className="group inline-flex items-center gap-4 bg-text-main text-page-bg px-8 py-4 font-bold uppercase tracking-widest text-sm hover:bg-accent-yellow hover:text-ink transition-all duration-300 focus-ring shadow-xl"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            {t("not_found_btn", "На головну")}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
