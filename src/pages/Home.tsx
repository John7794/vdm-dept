import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { useTheme } from "../components/ThemeProvider";
import { useCms } from "../contexts/CmsContext";
import { formatDriveLink } from "../lib/utils";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const { theme } = useTheme();
  const { data, t } = useCms();

  const defaultSlides = [
    "https://drive.google.com/uc?export=view&id=1n7JNFmicxCNLEm0_AFB_-hg5258z7YmG",
    "https://drive.google.com/uc?export=view&id=11dYw0FRts0F248vo_de-BLW1QTUgPZVP",
    "https://drive.google.com/uc?export=view&id=1i0qE12_3C4i-QTjAfvt7fTTfViiz4I9a"
  ];

  const cmsBanners = (data?.multimedia || [])
    .filter((item: any) => item.Category === "HeroBanner" && item.Url && item.Url.trim() !== "")
    .map((item: any) => formatDriveLink(item.Url))
    .filter((url: string) => url !== "");

  const baseSlides = cmsBanners.length > 0 ? cmsBanners : defaultSlides;
  // Clone the first slide at the end to allow a seamless transition back to start
  const slides = [...baseSlides, baseSlides[0]];

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setCurrentSlide((prev) => prev + 1);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // When we reach the cloned slide at the end, wait for the animation to finish,
  // then instantly snap back to the first slide without a transition.
  useEffect(() => {
    if (currentSlide === baseSlides.length) {
      const snapTimer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentSlide(0);
      }, 1200); // 1200ms matches the transition duration
      return () => clearTimeout(snapTimer);
    }
  }, [currentSlide, baseSlides.length]);

  return (
    <div className="flex flex-col w-full bg-page-bg">
      {/* Hero Section - Stencil Effect with Slider */}
      <section className="relative flex flex-col w-full border-b-2 border-border-main overflow-hidden bg-page-bg">
        {/* The Base Slider Layer */}
        <div className="absolute inset-0 z-0">
          <div 
            className={`flex w-full h-full ${isTransitioning ? "transition-transform duration-[1200ms] ease-[cubic-bezier(0.25,1,0.25,1)]" : ""}`}
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((src, i) => (
              <div 
                key={i} 
                className="w-full h-full flex-shrink-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${src})` }}
              />
            ))}
          </div>
          <div className="absolute inset-0 bg-accent-blue/10 pointer-events-none mix-blend-overlay"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent-blue/20 blur-[100px] rounded-full z-[1]"></div>
        </div>

        {/* The Stencil Overlay Layer */}
        <div 
          className={`relative z-10 grid grid-cols-1 lg:grid-cols-12 min-h-[85vh] pointer-events-none divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-border-main transition-colors duration-500
            ${theme === "dark" ? "mix-blend-multiply" : "mix-blend-screen"}`}
        >
          {/* Left Column (Masking BG) */}
          <div className={`lg:col-span-8 p-6 md:p-12 lg:p-16 flex flex-col justify-start transition-colors duration-500 ${theme === "dark" ? "bg-ink" : "bg-paper"}`}>
            <div className="mt-12 md:mt-24">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={`text-[clamp(3.5rem,10vw,8.5rem)] font-bold leading-[0.85] tracking-[-0.04em] uppercase text-balance whitespace-pre-line ${theme === "dark" ? "text-white" : "text-black"}`}
              >
                {t("home_hero_title")}
              </motion.h1>
            </div>
          </div>

          {/* Right Column (Pure Hole) */}
          <div className={`lg:col-span-4 flex items-end p-12 transition-colors duration-500 ${theme === "dark" ? "bg-white" : "bg-black"}`}>
          </div>
        </div>

        {/* Standard UI Overlay (Always visible, no blend) */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="grid grid-cols-1 lg:grid-cols-12 w-full min-h-[85vh] h-full">
            <div className="lg:col-span-8 p-6 md:p-12 lg:p-16 flex flex-col justify-start pointer-events-auto">
              <div className="mt-12 md:mt-24">
                <h2 
                  className="text-[clamp(3.5rem,10vw,8.5rem)] font-bold leading-[0.85] tracking-[-0.04em] uppercase text-transparent select-none whitespace-pre-line"
                  aria-hidden="true"
                >
                  {t("home_hero_title")}
                </h2>
              </div>

              <div className="mt-8 md:mt-16 mb-12 max-w-xl group relative z-30">
                <div className="mt-4 md:mt-12">
                  <Link 
                    to="/applicants" 
                    className="group/btn inline-flex items-center gap-6 bg-text-main text-page-bg px-8 py-5 font-bold uppercase tracking-widest text-sm hover:bg-accent-yellow hover:text-ink transition-all duration-500 focus-ring shadow-2xl pointer-events-auto relative z-40"
                  >
                    {t("home_btn_apply")}
                    <ArrowUpRight className="w-6 h-6 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="lg:col-span-4 border-l-2 border-border-main hidden lg:block"></div>
          </div>
        </div>
      </section>

      {/* Info Dashboard Pattern */}
      <section className="border-b-2 border-border-main bg-page-bg">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y-2 md:divide-y-0 md:divide-x-2 divide-border-main">
          
          <div className="p-8 md:p-12 hover:bg-surface-main transition-colors cursor-crosshair">
            <span className="font-mono text-xs text-text-dim block mb-6">{t("home_f1_label")}</span>
            <h2 className="text-3xl font-bold uppercase tracking-tight mb-4 leading-none whitespace-pre-line">{t("home_f1_title")}</h2>
            <p className="text-text-dim font-light mt-4 text-sm leading-relaxed whitespace-pre-line">
              {t("home_f1_desc")}
            </p>
          </div>

          <div className="p-8 md:p-12 hover:bg-surface-main transition-colors cursor-crosshair bg-surface-mut">
            <span className="font-mono text-xs text-text-dim block mb-6">{t("home_f2_label")}</span>
            <h2 className="text-3xl font-bold uppercase tracking-tight mb-4 leading-none whitespace-pre-line">{t("home_f2_title")}</h2>
            <p className="text-text-dim font-light mt-4 text-sm leading-relaxed whitespace-pre-line">
              {t("home_f2_desc")}
            </p>
          </div>

          <div className="p-8 md:p-12 hover:bg-surface-main transition-colors cursor-crosshair">
            <span className="font-mono text-xs text-text-dim block mb-6">{t("home_f3_label")}</span>
            <div className="max-h-[220px] overflow-y-auto pr-4 custom-scrollbar">
              <ul className="space-y-3 font-medium text-lg tracking-tight uppercase">
                <li className="flex justify-between border-b border-border-soft pb-1"><span>{t("disc_ux_ui") || "UX / UI Дизайн"}</span> <ArrowUpRight className="w-4 h-4 text-text-dim" /></li>
                <li className="flex justify-between border-b border-border-soft pb-1"><span>{t("disc_typography") || "Типографіка"}</span> <ArrowUpRight className="w-4 h-4 text-text-dim" /></li>
                <li className="flex justify-between border-b border-border-soft pb-1"><span>{t("disc_branding") || "Брендинг"}</span> <ArrowUpRight className="w-4 h-4 text-text-dim" /></li>
                <li className="flex justify-between border-b border-border-soft pb-1"><span>{t("disc_motion") || "Motion & 3D"}</span> <ArrowUpRight className="w-4 h-4 text-text-dim" /></li>
                <li className="flex justify-between border-b border-border-soft pb-1"><span>{t("disc_art_direction") || "Арт-дирекшн"}</span> <ArrowUpRight className="w-4 h-4 text-text-dim" /></li>
                <li className="flex justify-between border-b border-border-soft pb-1"><span>{t("disc_illustration") || "Ілюстрація"}</span> <ArrowUpRight className="w-4 h-4 text-text-dim" /></li>
                <li className="flex justify-between border-b border-border-soft pb-1"><span>{t("disc_game_design") || "Game Design"}</span> <ArrowUpRight className="w-4 h-4 text-text-dim" /></li>
                <li className="flex justify-between border-b border-border-soft pb-1"><span>{t("disc_new_media") || "Нові Медіа"}</span> <ArrowUpRight className="w-4 h-4 text-text-dim" /></li>
              </ul>
            </div>
          </div>
          
        </div>
      </section>
      
      {/* Dynamic News Ticker / Marquee abstraction */}
      <div className="border-b-2 border-border-main overflow-hidden bg-surface-mut py-4 flex flex-nowrap whitespace-nowrap">
        <motion.div 
          animate={{ x: [0, -1000] }} 
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="flex font-mono text-sm font-bold uppercase text-text-main"
        >
           {Array(20).fill([t("home_marquee")]).flat().map((text, i) => (
             <span key={i} className="flex items-center">
               <span>{text}</span>
               <span className="w-2 h-2 bg-text-main rounded-full mx-8"></span>
             </span>
           ))}
        </motion.div>
      </div>

    </div>
  );
}
