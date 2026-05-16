import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { useTheme } from "../components/ThemeProvider";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../lib/firebase";
import { handleFirestoreError, OperationType } from "../lib/firestore-errors";
import heroImage1 from "../assets/images/regenerated_image_1778867776797.jpg";
import heroImage2 from "../assets/images/regenerated_image_1778865710012.jpg";
import heroImage3 from "../assets/images/regenerated_image_1778867677539.jpg";

const HERO_SLIDES = [
  heroImage2,
  heroImage3
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [announcements, setAnnouncements] = useState<string[]>(["ВІДКРИТО НАБІР НА МАГІСТРАТУРУ 2026"]);
  const [slides, setSlides] = useState<string[]>([heroImage2, heroImage3]);

  useEffect(() => {
    // Fetch Announcements
    const qAnnouncements = query(collection(db, 'announcements'));
    const unsubAnnouncements = onSnapshot(qAnnouncements, (snapshot) => {
      if (!snapshot.empty) {
        const texts: string[] = [];
        snapshot.forEach(doc => texts.push(doc.data().text));
        setAnnouncements(texts);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'announcements');
    });

    // Fetch Hero Slides
    const qSlides = query(collection(db, 'heroSlides'));
    const unsubSlides = onSnapshot(qSlides, (snapshot) => {
      if (!snapshot.empty) {
        const urls: string[] = [];
        snapshot.forEach(doc => urls.push(doc.data().image));
        setSlides(urls);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'heroSlides');
    });

    return () => {
      unsubAnnouncements();
      unsubSlides();
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const { theme } = useTheme();

  return (
    <div className="flex flex-col w-full bg-page-bg">
      {/* Hero Section - Stencil Effect with Slider */}
      <section className="relative flex flex-col w-full border-b-2 border-border-main overflow-hidden bg-page-bg">
        {/* The Base Slider Layer */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={slides[currentSlide]}
                alt="Hero Background"
                className="w-full h-full object-cover"
              />
              {/* Blue Overlay / Decorative Background Layer */}
              <div className="absolute inset-0 bg-accent-blue/10 pointer-events-none mix-blend-overlay"></div>
            </motion.div>
          </AnimatePresence>
          
          {/* Decorative blue geometric block */}
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
                className={`text-[clamp(3.5rem,10vw,8.5rem)] font-bold leading-[0.85] tracking-[-0.04em] uppercase text-balance ${theme === "dark" ? "text-white" : "text-black"}`}
              >
                Візуальний<br />
                Дизайн і<br />
                Мистецтво.
              </motion.h1>
            </div>
          </div>

          {/* Right Column (Pure Hole) */}
          <div className={`lg:col-span-4 flex items-end p-12 transition-colors duration-500 ${theme === "dark" ? "bg-white" : "bg-black"}`}>
             <div className={`w-full font-mono text-xs flex justify-between items-end opacity-50 ${theme === "dark" ? "text-black" : "text-white"}`}>
               <span>ЕКСПОЗИЦІЯ / 0{currentSlide + 1}</span>
               <span className={`w-20 h-[1px] block mb-2 ${theme === "dark" ? "bg-black" : "bg-white"}`}></span>
             </div>
          </div>
        </div>

        {/* Standard UI Overlay (Always visible, no blend) */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="grid grid-cols-1 lg:grid-cols-12 w-full min-h-[85vh] h-full">
            <div className="lg:col-span-8 p-6 md:p-12 lg:p-16 flex flex-col justify-start pointer-events-auto">
              {/* Sync with the stencil text height using a ghost invisible header */}
              <div className="mt-12 md:mt-24">
                <h2 
                  className="text-[clamp(3.5rem,10vw,8.5rem)] font-bold leading-[0.85] tracking-[-0.04em] uppercase text-transparent select-none"
                  aria-hidden="true"
                >
                  Візуальний<br />
                  Дизайн і<br />
                  Мистецтво.
                </h2>
              </div>

              <div className="mt-8 md:mt-16 mb-12 max-w-xl group relative z-30">
                <div className="mt-4 md:mt-12">
                  <Link 
                    to="/applicants" 
                    className="group/btn inline-flex items-center gap-6 bg-text-main text-page-bg px-8 py-5 font-bold uppercase tracking-widest text-sm hover:bg-accent-yellow hover:text-text-main transition-all duration-500 focus-ring shadow-2xl pointer-events-auto relative z-40"
                  >
                    Вступна кампанія 
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
            <span className="font-mono text-xs text-text-dim block mb-6">01. ПІДХІД</span>
            <h2 className="text-3xl font-bold uppercase tracking-tight mb-4 leading-none">Синтез<br />Традицій</h2>
            <p className="text-text-dim font-light mt-4 text-sm leading-relaxed">
              Академічна база поєднується з цифровою добою. Ми формуємо фахівців, здатних проєктувати складні інформаційні системи та естетичні простори.
            </p>
          </div>

          <div className="p-8 md:p-12 hover:bg-surface-main transition-colors cursor-crosshair bg-surface-mut">
            <span className="font-mono text-xs text-text-dim block mb-6">02. ПРАКТИКА</span>
            <h2 className="text-3xl font-bold uppercase tracking-tight mb-4 leading-none">Проєктно-<br />Базоване<br />Навчання</h2>
            <p className="text-text-dim font-light mt-4 text-sm leading-relaxed">
              Жодної теорії заради теорії. Студенти розв'язують реальні комунікаційні проблеми замовників ще під час навчання.
            </p>
          </div>

          <div className="p-8 md:p-12 hover:bg-surface-main transition-colors cursor-crosshair">
            <span className="font-mono text-xs text-text-dim block mb-6">03. ДИСЦИПЛІНИ</span>
            <ul className="space-y-3 font-medium text-lg tracking-tight uppercase">
              <li className="flex justify-between border-b border-border-soft pb-1"><span>UX / UI Дизайн</span> <ArrowUpRight className="w-4 h-4 text-text-dim" /></li>
              <li className="flex justify-between border-b border-border-soft pb-1"><span>Типографіка</span> <ArrowUpRight className="w-4 h-4 text-text-dim" /></li>
              <li className="flex justify-between border-b border-border-soft pb-1"><span>Брендинг</span> <ArrowUpRight className="w-4 h-4 text-text-dim" /></li>
              <li className="flex justify-between border-b border-border-soft pb-1"><span>Motion & 3D</span> <ArrowUpRight className="w-4 h-4 text-text-dim" /></li>
              <li className="flex justify-between border-b border-border-soft pb-1"><span>Арт-дирекшн</span> <ArrowUpRight className="w-4 h-4 text-text-dim" /></li>
            </ul>
          </div>
          
        </div>
      </section>
      
      {/* Dynamic News Ticker / Marquee abstraction */}
      <div className="border-b-2 border-border-main overflow-hidden bg-surface-mut py-4 flex flex-nowrap whitespace-nowrap">
        <motion.div 
          animate={{ x: [0, -1000] }} 
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="flex space-x-8 font-mono text-sm font-bold uppercase text-text-main"
        >
           {Array(20).fill(announcements).flat().map((text, i) => (
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
