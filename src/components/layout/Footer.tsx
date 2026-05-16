import { Link } from "react-router-dom";
import logoImage from "../../assets/images/regenerated_image_1778868808604.png";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ink text-paper border-t-2 border-ink mt-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-4 divide-y-2 md:divide-y-0 md:divide-x-2 divide-paper/20 border-b-2 border-paper/20">
        
        {/* Branding Block */}
        <div className="p-8 md:p-12 md:col-span-2 space-y-8 flex flex-col">
          <div className="flex flex-col gap-8">
            <Link to="/" className="inline-block transition-opacity hover:opacity-80">
              <img 
                src={logoImage} 
                alt="Логотип кафедри" 
                className="h-16 md:h-20 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-paper/70 max-w-sm text-sm leading-relaxed font-light uppercase tracking-widest">
              Кафедра візуального дизайну <br />і мистецтва <br />
              Інститут архітектури та дизайну <br />
              «Львівська політехніка»
            </p>
          </div>
        </div>

        {/* Contacts */}
        <div className="p-8 md:p-12 space-y-6">
          <div className="font-mono text-xs text-paper/50 uppercase mb-8">Контакти</div>
          <address className="not-italic text-sm space-y-4">
            <p className="font-bold uppercase tracking-wider block">Локація:</p>
            <p className="text-paper/70">м. Львів,<br/>вул. Січових Стрільців, 7</p>
            <p className="font-bold uppercase tracking-wider block mt-6">Email:</p>
            <p>
              <a href="mailto:vdm.dept@lpnu.ua" className="text-paper hover:text-accent-yellow transition-colors focus-ring underline underline-offset-4 pointer-events-auto block">
                vdm.dept@lpnu.ua
              </a>
            </p>
          </address>
        </div>

        {/* Links */}
        <div className="p-8 md:p-12 space-y-6 flex flex-col">
          <div className="font-mono text-xs text-paper/50 uppercase mb-8">Навігація</div>
          <ul className="text-sm font-bold uppercase tracking-widest space-y-4 flex-grow flex flex-col justify-end">
            <li><Link to="/applicants" className="hover:text-accent-yellow transition-colors focus-ring block">Вступнику</Link></li>
            <li><Link to="/programs" className="hover:text-accent-yellow transition-colors focus-ring block">Програми</Link></li>
            <li><Link to="/projects" className="hover:text-accent-yellow transition-colors focus-ring block">Портфоліо</Link></li>
          </ul>
        </div>
        
      </div>
      
      {/* Bottom Bar */}
      <div className="px-8 py-10 text-[10px] md:text-xs text-paper/40 font-mono uppercase tracking-[0.2em] flex flex-col items-center gap-6">
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-8 text-center">
          <p>© {currentYear} КАФЕДРА ВДМ НУ «ЛЬВІВСЬКА ПОЛІТЕХНІКА»</p>
          <span className="hidden md:block w-1 h-1 bg-paper/20 rounded-full"></span>
          <p>УСІ ПРАВА ЗАСТЕРЕЖЕНО</p>
        </div>
        <div className="flex gap-6 opacity-60">
          <p>Створено для A11y</p>
          <p className="text-paper/80">WCAG 2.1 AA</p>
        </div>
      </div>
    </footer>
  );
}
