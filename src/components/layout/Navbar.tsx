import { Link, useLocation } from "react-router-dom";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../ThemeProvider";
import { useCms } from "../../contexts/CmsContext";
import { formatDriveLink } from "../../lib/utils";

const LogoText = ({ className }: { className?: string }) => (
  <div className={`font-bold text-2xl tracking-tighter uppercase select-none ${className}`}>
    VDA<span className="text-accent-blue">.</span>
  </div>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { data, lang, setLang, t } = useCms();

  const logoDataLight = (data?.multimedia || []).find((item: any) => item.Category === "LogoLight" && item.Url && item.Url.trim() !== "");
  const logoDataDark = (data?.multimedia || []).find((item: any) => item.Category === "LogoDark" && item.Url && item.Url.trim() !== "");

  const logoLightUrl = logoDataLight ? formatDriveLink(logoDataLight.Url) : null;
  const logoDarkUrl = logoDataDark ? formatDriveLink(logoDataDark.Url) : null;
  
  // LogoLight = White logo (for dark theme)
  // LogoDark = Black logo (for light theme)
  const getLogo = () => {
    if (theme === "dark") return logoLightUrl || logoDarkUrl;
    return logoDarkUrl || logoLightUrl;
  };
  
  const currentLogoUrl = getLogo();

  const Logo = ({ className }: { className?: string }) => (
    currentLogoUrl ? (
      <img src={currentLogoUrl} alt="VDA Logo" className={`h-8 w-auto object-contain ${className || ""}`} />
    ) : (
      <LogoText className={className} />
    )
  );

  const NAV_LINKS = [
    { name: t("nav_home"), path: "/" },
    { name: t("nav_about", "Про нас"), path: "/about" },
    { name: t("nav_programs"), path: "/programs" },
    { name: t("nav_staff"), path: "/staff" },
    { name: t("nav_news"), path: "/news" },
    { name: t("nav_projects"), path: "/projects" },
    { name: t("nav_applicants"), path: "/applicants" },
  ];

  const langs: ("UA" | "EN" | "DE" | "PL")[] = ["UA", "EN", "DE", "PL"];
  
  const flagMap: Record<string, string> = {
    UA: "https://flagcdn.com/ua.svg",
    EN: "https://flagcdn.com/gb.svg",
    DE: "https://flagcdn.com/de.svg",
    PL: "https://flagcdn.com/pl.svg",
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-page-bg border-b-2 border-border-main transition-colors duration-300">
      <div className="flex h-20 w-full">
        <div className="flex-shrink-0 flex items-center border-r-2 border-border-main px-6 w-full lg:w-auto lg:min-w-[320px] justify-between lg:justify-start">
          {location.pathname === "/" ? (
            <div className="flex items-center" aria-label="Головна сторінка">
              <Logo className="text-text-main" />
            </div>
          ) : (
            <Link to="/" className="flex items-center focus-ring rounded-sm outline-none" aria-label="Головна сторінка">
              <Logo className="text-text-main" />
            </Link>
          )}
          
          <div className="flex items-center gap-2 lg:hidden">
            <button 
              onClick={() => setIsLangOpen(!isLangOpen)} 
              className="p-2 text-text-main focus-ring border-2 border-transparent hover:border-border-main transition-colors flex items-center gap-1.5"
              aria-label="Мова"
            >
              <img src={flagMap[lang]} alt={lang} className="w-5 h-auto object-cover rounded-sm shadow-[0_0_2px_rgba(0,0,0,0.2)]" />
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
              <img src={flagMap[lang]} alt={lang} className="w-5 h-auto object-cover rounded-sm shadow-[0_0_2px_rgba(0,0,0,0.2)]" />
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
                      className="px-6 py-4 flex items-center justify-center gap-2 text-xs font-bold text-text-main hover:bg-surface-mut transition-colors"
                    >
                      <img src={flagMap[l]} alt={l} className="w-5 h-auto object-cover rounded-sm shadow-[0_0_2px_rgba(0,0,0,0.2)]" />
                      <span>{l}</span>
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
                className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-bold uppercase ${lang === l ? 'bg-text-main text-page-bg' : 'text-text-main hover:bg-surface-mut'}`}
              >
                <img src={flagMap[l]} alt={l} className="w-5 h-auto object-cover rounded-sm shadow-[0_0_2px_rgba(0,0,0,0.2)]" />
                <span>{l}</span>
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
