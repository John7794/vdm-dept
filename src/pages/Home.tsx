import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { useTheme } from "../components/ThemeProvider";
import { useCms } from "../contexts/CmsContext";
import { useAccessibility } from "../contexts/AccessibilityContext";
import { formatDriveLink } from "../lib/utils";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const { theme } = useTheme();
  const { data, t } = useCms();
  const { settings } = useAccessibility();
  const isA11yContrast = settings.contrast !== "normal";

  const defaultSlides = [
    "https://drive.google.com/uc?export=view&id=1n7JNFmicxCNLEm0_AFB_-hg5258z7YmG",
    "https://drive.google.com/uc?export=view&id=11dYw0FRts0F248vo_de-BLW1QTUgPZVP",
    "https://drive.google.com/uc?export=view&id=1i0qE12_3C4i-QTjAfvt7fTTfViiz4I9a"
  ];

  const cmsBanners = (data?.multimedia || [])
    .filter((item: any) => {
      const url = (item.Image || item.image || item.img || item.Media || item.media || item.Media || item.media || item.Url || item.url || "").trim();
      return item.Category === "HeroBanner" && url !== "";
    })
    .map((item: any) => {
      const url = (item.Image || item.image || item.img || item.Media || item.media || item.Media || item.media || item.Url || item.url || "").trim();
      return formatDriveLink(url);
    })
    .filter((url: string) => url !== "");

  const getSectionImage = (id: string) => {
    const item = (data?.multimedia || []).find((m: any) => m.ID === id);
    if (item) {
      const url = (item.Image || item.image || item.img || item.Media || item.media || item.Url || item.url || "").trim();
      if (url) return formatDriveLink(url);
    }
    return "";
  };

  const baseSlides = cmsBanners.length > 0 ? cmsBanners : defaultSlides;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => prev + 1);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slideIndex = currentSlide % baseSlides.length;
  const directionType = currentSlide % 4; // 0, 1, 2, 3

  const variants = {
    enter: (direction) => {
      switch(direction) {
        case 0: return { x: '100%', y: 0 };
        case 1: return { x: 0, y: '100%' };
        case 2: return { x: '-100%', y: 0 };
        case 3: return { x: 0, y: '-100%' };
        default: return { x: '100%', y: 0 };
      }
    },
    center: { x: 0, y: 0, zIndex: 1 },
    exit: (direction) => {
      switch(direction) {
        case 0: return { x: '-100%', y: 0, zIndex: 0 };
        case 1: return { x: 0, y: '-100%', zIndex: 0 };
        case 2: return { x: '100%', y: 0, zIndex: 0 };
        case 3: return { x: 0, y: '100%', zIndex: 0 };
        default: return { x: '-100%', y: 0, zIndex: 0 };
      }
    }
  };

  return (
    <div className="flex flex-col w-full bg-page-bg">
      {/* Hero Section - Stencil Effect with Slider */}
      <section className="relative flex flex-col w-full border-b-2 border-border-main overflow-hidden bg-page-bg">
        {/* The Base Slider Layer */}
        <div className={`absolute inset-0 z-0 overflow-hidden a11y-hero-slider ${isA11yContrast ? "hidden" : ""}`}>
          <AnimatePresence initial={false} custom={directionType}>
            <motion.div
              key={currentSlide}
              custom={directionType}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 1.2, ease: [0.25, 1, 0.25, 1] }}
              className="absolute inset-0 w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${baseSlides[slideIndex]})` }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-accent-blue/10 pointer-events-none mix-blend-overlay"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent-blue/20 blur-[100px] rounded-full z-[1]"></div>
        </div>

        {/* The Hero Content Layer */}
        <div 
          className={`relative z-10 flex flex-col lg:grid lg:grid-cols-12 min-h-[calc(100vh-80px)] lg:min-h-[85vh] pointer-events-none lg:divide-x-2 divide-border-main transition-colors duration-500
            ${isA11yContrast ? "" : theme === "dark" ? "mix-blend-screen" : "mix-blend-screen"}`}
        >
          {/* Left Column (Masking BG / High-contrast surface) */}
          <div 
            className={`flex-none lg:col-span-8 p-6 md:p-12 lg:p-16 flex flex-col justify-start transition-colors duration-500 ${
              isA11yContrast
                ? "bg-page-bg text-text-main"
                : theme === "dark"
                ? "bg-ink"
                : "bg-paper"
            }`}
          >
            <div className="mt-12 md:mt-24">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={`text-[clamp(2.5rem,7vw,7.5rem)] font-bold leading-[0.85] tracking-[-0.04em] uppercase text-balance whitespace-pre-line break-words hyphens-auto ${
                  isA11yContrast
                    ? "text-text-main"
                    : theme === "dark"
                    ? "text-white"
                    : "text-black"
                }`}
              >
                {t("home_hero_title")}
              </motion.h1>
            </div>
          </div>

          {/* Right Column / Visual Frame */}
          <div 
            className={`flex-1 lg:col-span-4 flex items-end p-12 transition-colors duration-500 ${
              isA11yContrast
                ? "bg-surface-mut border-t-2 lg:border-t-0 lg:border-l-2 border-border-main"
                : theme === "dark"
                ? "bg-black"
                : "bg-black"
            }`}
          >
          </div>
        </div>

        {/* Standard UI Overlay (Always visible) */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="flex flex-col lg:grid lg:grid-cols-12 w-full h-full min-h-[calc(100vh-80px)] lg:min-h-[85vh]">
            <div className="flex-none lg:col-span-8 p-6 md:p-12 lg:p-16 flex flex-col justify-start pointer-events-auto">
              {!isA11yContrast && (
                <div className="mt-12 md:mt-24">
                  <h2 
                    className="text-[clamp(2.5rem,7vw,7.5rem)] font-bold leading-[0.85] tracking-[-0.04em] uppercase text-transparent select-none whitespace-pre-line break-words hyphens-auto"
                    aria-hidden="true"
                  >
                    {t("home_hero_title")}
                  </h2>
                </div>
              )}
            </div>
            <div className="flex-1 lg:col-span-4 border-t-2 lg:border-t-0 lg:border-l-2 border-border-main"></div>
          </div>
        </div>
      </section>

      {/* Vertical Alternating Dashboard Pattern */}
      <section className="flex flex-col w-full border-b-2 border-border-main">
        {[
          {
            num: "01.",
            title: t("home_area_1_title", ""),
            desc: t("home_area_1_desc", ""),
            bgClass: "bg-page-bg",
            image: getSectionImage("home_area_1")
          },
          {
            num: "02.",
            title: t("home_area_2_title", ""),
            desc: t("home_area_2_desc", ""),
            bgClass: "bg-surface-mut",
            image: getSectionImage("home_area_2")
          },
          {
            num: "03.",
            title: t("home_area_3_title", ""),
            desc: t("home_area_3_desc", ""),
            bgClass: "bg-page-bg",
            image: getSectionImage("home_area_3")
          },
          {
            num: "04.",
            title: t("home_area_4_title", ""),
            desc: t("home_area_4_desc", ""),
            bgClass: "bg-surface-mut",
            image: getSectionImage("home_area_4")
          },
          {
            num: "05.",
            title: t("home_area_5_title", ""),
            desc: t("home_area_5_desc", ""),
            bgClass: "bg-page-bg",
            image: getSectionImage("home_area_5")
          }
        ].map((item, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <div 
              key={idx} 
              className={`flex flex-col-reverse min-h-[calc(100vh-80px)] md:min-h-0 border-b-2 border-border-main last:border-b-0 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
            >
              {/* Text Pane */}
              <div className={`flex-1 md:flex-none w-full md:w-1/2 p-6 py-8 md:p-12 lg:p-24 flex flex-col justify-center ${item.bgClass} border-t-2 md:border-t-0 border-border-main ${isEven ? 'md:border-r-2' : 'md:border-l-2'}`}>
                <div>
                  <span className="font-mono text-[10px] md:text-xs text-text-dim block mb-4 md:mb-6">{item.num} {item.title}</span>
                  <h2 className="text-3xl lg:text-5xl font-bold uppercase tracking-tight mb-4 md:mb-6 leading-none text-balance break-words hyphens-auto">{item.title}</h2>
                  <p className="text-text-dim font-light text-base md:text-lg leading-relaxed mb-6 md:mb-10 max-w-xl text-balance break-words hyphens-auto">
                    {item.desc}
                  </p>
                </div>
              </div>

              {/* Image Pane */}
              <div className="w-full md:w-1/2 relative h-[40vh] min-h-[220px] md:h-auto md:min-h-[450px] bg-ink overflow-hidden group flex items-center justify-center">
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="absolute inset-0 w-full h-full object-cover grayscale-0 opacity-100 md:grayscale md:opacity-70 lg:group-hover:grayscale-0 lg:group-hover:opacity-100 transition-all duration-700 mix-blend-screen dark:mix-blend-normal"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-page-bg/20 font-mono text-sm uppercase tracking-widest">{item.title}</span>
                )}
              </div>
            </div>
          );
        })}
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
