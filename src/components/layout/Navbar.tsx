import { Link, useLocation } from "react-router-dom";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import { useTheme } from "../ThemeProvider";
import logoImage from "../../assets/images/regenerated_image_1778868808082.png";

const NAV_LINKS = [
  { name: "Головна", path: "/" },
  { name: "Освітні програми", path: "/programs" },
  { name: "Працівники", path: "/staff" },
  { name: "Новини", path: "/news" },
  { name: "Проєкти", path: "/projects" },
  { name: "Абітурієнтам", path: "/applicants" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 w-full z-50 bg-page-bg border-b-2 border-border-main transition-colors duration-300">
      <div className="flex h-20 w-full">
        <div className="flex-shrink-0 flex items-center border-r-2 border-border-main px-6 w-full lg:w-auto lg:min-w-[320px] justify-between lg:justify-start">
          <Link to="/" className="flex items-center focus-ring rounded-sm outline-none" aria-label="Головна сторінка">
            <img 
              src={logoImage} 
              alt="Логотип кафедри візуального дизайну і мистецтва" 
              className={`h-10 w-auto object-contain transition-all duration-300 ${theme === "dark" ? "brightness-0 invert" : ""}`}
            />
          </Link>
          
          <div className="flex items-center gap-2 lg:hidden">
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
            return (
              <Link
                key={link.path}
                to={link.path}
                className="flex-1 flex items-center justify-center px-4 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-text-main hover:text-page-bg focus-ring outline-none relative overflow-hidden group"
                aria-current={isActive ? "page" : undefined}
              >
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
              </Link>
            );
          })}
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
