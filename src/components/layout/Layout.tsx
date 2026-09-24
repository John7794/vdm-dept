import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { motion, useScroll, useSpring, AnimatePresence } from "motion/react";
import { ArrowUp } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useCms } from "../../contexts/CmsContext";

export default function Layout() {
  const { t } = useCms();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 25,
    restDelta: 0.001,
  });

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 280);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen bg-page-bg text-text-main selection:bg-accent-yellow selection:text-ink font-sans">
      {/* Universal Top Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 h-[2.5px] z-[9999] pointer-events-none">
        <motion.div
          style={{ scaleX }}
          aria-hidden="true"
          className="h-full w-full bg-accent-yellow origin-left"
        />
      </div>

      {/* WCAG 2.1 AA / ДСТУ EN 301 549: Skip to main content link for screen readers and keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[9999] focus:px-4 focus:py-3 focus:bg-accent-yellow focus:text-ink focus:font-bold focus:uppercase focus:text-xs focus:tracking-wider focus:border-2 focus:border-border-main focus:shadow-2xl outline-none"
      >
        {t("skip_to_content", "Перейти до основного вмісту (Enter)")}
      </a>

      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-grow flex flex-col pt-[80px] outline-none">
        <Outlet />
      </main>

      {/* Scroll-to-Top Floating Trigger */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 15, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.85 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToTop}
            type="button"
            aria-label={t("scroll_top_aria", "Прокрутити вгору")}
            title={t("scroll_top_title", "Прокрутити нагору")}
            className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-40 p-2.5 rounded-md bg-surface-main/90 backdrop-blur-md text-text-main border border-border-soft shadow-lg hover:border-border-main hover:bg-accent-yellow hover:text-ink active:scale-95 transition-all duration-200 group flex items-center justify-center focus-ring"
          >
            <ArrowUp className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
          </motion.button>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
