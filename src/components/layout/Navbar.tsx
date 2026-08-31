import { Link, useLocation } from "react-router-dom";
import { Menu, X, Moon, Sun, Globe } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../ThemeProvider";
import { useCms } from "../../contexts/CmsContext";
import logoImage from "../../assets/images/regenerated_image_1778868808082.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, t } = useCms();

  const NAV_LINKS = [
    { name: t("nav_home"), path: "/" },
    { name: t("nav_programs"), path: "/programs" },
    { name: t("nav_staff"), path: "/staff" },
    { name: t("nav_news"), path: "/news" },
    { name: t("nav_projects"), path: "/projects" },
    { name: t("nav_applicants"), path: "/applicants" },
  ];

  const langs: ("UA" | "EN" | "DE" | "PL")[] = ["UA", "EN", "DE", "PL"];

  return (
    <header className="fixed top-0 w-full z-50 bg-page-bg border-b-2 border-border-main transition-colors duration-300">
      <div className="flex h-20 w-full">
        <div className="flex-shrink-0 flex items-center border-r-2 border-border-main px-6 w-full lg:w-auto lg:min-w-[320px] justify-between lg:justify-start">
          {location.pathname === "/" ? (
            <div className="flex items-center" aria-label="Головна сторінка">
              <img 
                src={logoImage} 
                alt="Логотип кафедри" 
                className={`h-10 w-auto object-contain transition-all duration-300 ${theme === "dark" ? "brightness-0 invert" : ""}`}
              />
            </div>
          ) : (
            <Link to="/" className="flex items-center focus-ring rounded-sm outline-none" aria-label="Головна сторінка">
              <img 
                src={logoImage} 
                alt="Логотип кафедри" 
                className={`h-10 w-auto object-contain transition-all duration-300 ${theme === "dark" ? "brightness-0 invert" : ""}`}
              />
            </Link>
          )}
          
          <div className="flex items-center gap-2 lg:hidden">
            <button 
              onClick={() => setIsLangOpen(!isLangOpen)} 
              className="p-2 text-text-main focus-ring border-2 border-transparent hover:border-border-main transition-colors"
              aria-label="Мова"
            >
              <span className="font-bold text-sm uppercase">{lang}</span>
            </button>
            <button 
              onClick={toggleTheme} 
              className="p-2 text-text-main focus-ring border-2 border-transparent hover:border-border-main transition-colors"
              aria-label="Перемикач теми"
            >
              {theme === "dark" ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-text-main focus-ring border-2 border-transparent hover:border-border-main transition-colors"
              aria-expanded={isOpen}
              aria-label="Меню"
            >
              {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
            </button>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex w-full divide-x-2 divide-border-main" aria-label="Головна навігація">
            {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.path;
            
            const content = (
              <>
                <span className="relative z-10">{link.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeNavSegment"
                    className="absolute bottom-0 left-0 w-full h-[4px] bg-accent-blue"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </>
            );

            if (isActive) {
              return (
                <div
                  key={link.path}
                  className="flex-1 flex items-center justify-center px-4 text-xs font-bold uppercase tracking-widest relative overflow-hidden text-accent-blue cursor-default"
                  aria-current="page"
                >
                  {content}
                </div>
              );
            }

            return (
              <Link
                key={link.path}
                to={link.path}
                className="flex-1 flex items-center justify-center px-4 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-text-main hover:text-page-bg focus-ring outline-none relative overflow-hidden group"
              >
                {content}
              </Link>
            );
          })}
          
          {/* Lang Switcher (Desktop) */}
          <div className="relative flex items-center">
            <button 
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="h-full px-6 flex items-center gap-2 text-text-main hover:bg-text-main hover:text-page-bg transition-colors focus-ring outline-none"
            >
              <Globe className="w-4 h-4" />
              <span className="font-bold text-xs">{lang}</span>
            </button>
            
            <AnimatePresence>
              {isLangOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full right-0 w-full bg-page-bg border-2 border-t-0 border-border-main flex flex-col"
                >
                  {langs.filter(l => l !== lang).map(l => (
                    <button
                      key={l}
                      onClick={() => { setLang(l); setIsLangOpen(false); }}
                      className="px-6 py-4 text-xs font-bold text-text-main hover:bg-surface-mut transition-colors text-center"
                    >
                      {l}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={toggleTheme} 
            className="flex items-center justify-center px-6 text-text-main hover:bg-text-main hover:text-page-bg transition-colors focus-ring outline-none flex-shrink-0"
            aria-label="Перемикач теми"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </nav>
      </div>

      {/* Mobile Nav */}
      <motion.div 
        initial={false}
        animate={{ height: isOpen ? "auto" : 0 }}
        className="lg:hidden overflow-hidden bg-page-bg border-b-2 border-border-main divide-y-2 divide-border-main"
      >
        {isLangOpen && (
          <div className="flex divide-x-2 divide-border-main border-b-2 border-border-main">
            {langs.map(l => (
              <button
                key={l}
                onClick={() => { setLang(l); setIsLangOpen(false); }}
                className={`flex-1 py-4 text-sm font-bold uppercase ${lang === l ? 'bg-text-main text-page-bg' : 'text-text-main hover:bg-surface-mut'}`}
              >
                {l}
              </button>
            ))}
          </div>
        )}
        <div className="flex flex-col">
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-6 py-4 text-sm font-bold uppercase tracking-widest transition-colors ${
                  isActive ? "bg-text-main text-page-bg" : "hover:bg-surface-mut text-text-main"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      </motion.div>
    </header>
  );
}
