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
                className={`text-[clamp(2.5rem,7vw,7.5rem)] font-bold leading-[0.85] tracking-[-0.04em] uppercase text-balance whitespace-pre-line break-words hyphens-auto ${theme === "dark" ? "text-white" : "text-black"}`}
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
                  className="text-[clamp(2.5rem,7vw,7.5rem)] font-bold leading-[0.85] tracking-[-0.04em] uppercase text-transparent select-none whitespace-pre-line break-words hyphens-auto"
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

      {/* Vertical Alternating Dashboard Pattern */}
      <section className="flex flex-col w-full border-b-2 border-border-main">
        {[
          {
            num: "01.",
            title: t("nav_programs", "Програми"),
            desc: t("home_section_programs_desc", "Бакалаврські та магістерські програми з візуального дизайну та мистецтва. Дізнайтеся про наші напрямки підготовки."),
            link: "/programs",
            btnLabel: t("home_section_programs_btn", "Усі програми"),
            bgClass: "bg-page-bg",
            image: getSectionImage("home_programs")
          },
          {
            num: "02.",
            title: t("nav_team", "Команда"),
            desc: t("home_section_team_desc", "Викладачі та фахівці-практики, які формують нове покоління дизайнерів. Познайомтеся з нашими менторами."),
            link: "/team",
            btnLabel: t("home_section_team_btn", "Склад кафедри"),
            bgClass: "bg-surface-mut",
            image: getSectionImage("home_team")
          },
          {
            num: "03.",
            title: t("nav_portfolio", "Портфоліо"),
            desc: t("home_section_portfolio_desc", "Найкращі студентські проєкти, курсові та дипломні дослідження. Наочний результат нашого підходу до навчання."),
            link: "/portfolio",
            btnLabel: t("home_section_portfolio_btn", "Відкрити портфоліо"),
            bgClass: "bg-page-bg",
            image: getSectionImage("home_portfolio")
          },
          {
            num: "04.",
            title: t("nav_news", "Новини"),
            desc: t("home_section_news_desc", "Актуальні події, анонси, виставки, лекції та життя нашої кафедри. Залишайтеся в курсі останніх новин."),
            link: "/news",
            btnLabel: t("home_section_news_btn", "Переглянути новини"),
            bgClass: "bg-surface-mut",
            image: getSectionImage("home_news")
          },
          {
            num: "05.",
            title: t("nav_entrants", "Вступнику"),
            desc: t("home_section_entrants_desc", "Умови вступу, творчі конкурси, вимоги до портфоліо та підготовчі курси для майбутніх студентів кафедри."),
            link: "/entrants",
            btnLabel: t("home_section_entrants_btn", "Для вступників"),
            bgClass: "bg-page-bg",
            image: getSectionImage("home_entrants")
          },
          {
            num: "06.",
            title: t("nav_about", "Про нас"),
            desc: t("home_section_about_desc", "Історія кафедри, наші досягнення, лабораторії та партнери. Про філософію та візію нашого освітнього простору."),
            link: "/about",
            btnLabel: t("home_section_about_btn", "Більше про кафедру"),
            bgClass: "bg-surface-mut",
            image: getSectionImage("home_about")
          }
        ].map((item, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <div 
              key={idx} 
              className={`flex flex-col border-b-2 border-border-main last:border-b-0 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
            >
              {/* Text Pane */}
              <div className={`w-full md:w-1/2 p-8 md:p-12 lg:p-24 flex flex-col justify-center ${item.bgClass} ${isEven ? 'md:border-r-2 border-border-main' : 'md:border-l-2 border-border-main'}`}>
                <div>
                  <span className="font-mono text-xs text-text-dim block mb-6">{item.num} {item.title}</span>
                  <h2 className="text-4xl lg:text-5xl font-bold uppercase tracking-tight mb-6 leading-none text-balance">{item.title}</h2>
                  <p className="text-text-dim font-light text-lg leading-relaxed mb-10 max-w-xl text-balance">
                    {item.desc}
                  </p>
                </div>
                <div>
                  <Link 
                    to={item.link} 
                    className="group/btn inline-flex items-center gap-6 bg-text-main text-page-bg px-8 py-5 font-bold uppercase tracking-widest text-xs hover:bg-accent-yellow hover:text-ink transition-all duration-500 focus-ring shadow-xl w-full md:w-auto justify-center"
                  >
                    {item.btnLabel}
                    <ArrowUpRight className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Image Pane */}
              <div className="w-full md:w-1/2 relative min-h-[350px] md:min-h-[450px] bg-ink overflow-hidden group border-t-2 md:border-t-0 border-border-main flex items-center justify-center">
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="absolute inset-0 w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 mix-blend-screen dark:mix-blend-normal"
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
