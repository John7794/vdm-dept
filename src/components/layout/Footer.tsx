import { Link, useLocation } from "react-router-dom";
import { useCms } from "../../contexts/CmsContext";
import { useAccessibility } from "../../contexts/AccessibilityContext";
import { useCookieConsent } from "../../contexts/CookieConsentContext";
import { usePrivacyModal } from "../../contexts/PrivacyModalContext";
import { formatDriveLink } from "../../lib/utils";
import { Eye, ExternalLink, ShieldCheck, Cookie } from "lucide-react";

const LogoText = ({ className }: { className?: string }) => (
  <div className={`font-bold text-4xl tracking-tighter uppercase select-none ${className}`}>
    VDA<span className="text-accent-blue">.</span>
  </div>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const { data, t } = useCms();
  const { toggleToolbar } = useAccessibility();
  const { openCookieSettings } = useCookieConsent();
  const { openPrivacyModal } = usePrivacyModal();

  const logoDataLight = (data?.multimedia || []).find((item: any) => {
    const url = (item.Image || item.image || item.img || item.Media || item.media || item.Media || item.media || item.Url || item.url || "").trim();
    return item.Category === "LogoLight" && url !== "";
  });
  const logoDataDark = (data?.multimedia || []).find((item: any) => {
    const url = (item.Image || item.image || item.img || item.Media || item.media || item.Media || item.media || item.Url || item.url || "").trim();
    return item.Category === "LogoDark" && url !== "";
  });
  
  const lightUrl = logoDataLight ? formatDriveLink((logoDataLight.Image || logoDataLight.image || logoDataLight.img || logoDataLight.Media || logoDataLight.media || logoDataLight.Url || logoDataLight.url).trim()) : null;
  const darkUrl = logoDataDark ? formatDriveLink((logoDataDark.Image || logoDataDark.image || logoDataDark.img || logoDataDark.Media || logoDataDark.media || logoDataDark.Url || logoDataDark.url).trim()) : null;
  
  // Footer is always dark background, so prefer the light (white) logo
  const currentLogoUrl = lightUrl || darkUrl;

  const Logo = ({ className }: { className?: string }) => (
    currentLogoUrl ? (
      <img src={currentLogoUrl} alt="VDA Logo" className={`h-12 md:h-16 w-auto object-contain vda-logo ${className || ""}`} />
    ) : (
      <LogoText className={`vda-logo ${className || ""}`} />
    )
  );

  return (
    <footer className="bg-ink text-paper border-t-2 border-ink mt-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-4 divide-y-2 md:divide-y-0 md:divide-x-2 divide-paper/20 border-b-2 border-paper/20">
        
        {/* Branding Block */}
        <div className="p-8 md:p-12 md:col-span-2 space-y-8 flex flex-col justify-between">
          <div className="flex flex-col gap-6">
            {location.pathname === "/" ? (
              <div className="inline-block">
                <Logo className="text-paper" />
              </div>
            ) : (
              <Link to="/" className="inline-block transition-opacity hover:opacity-80">
                <Logo className="text-paper" />
              </Link>
            )}
            <p className="text-paper/70 max-w-sm text-sm leading-relaxed font-light uppercase tracking-widest whitespace-pre-line">
              {t("footer_desc")}
            </p>
          </div>

          {/* Institutional Note */}
          <div className="pt-4 border-t border-paper/10 text-xs text-paper/60 font-mono space-y-1">
            <p className="font-bold text-paper/80 uppercase">
              {t("footer_university", "Національний університет «Львівська політехніка»")}
            </p>
            <p>{t("footer_institute", "Інститут архітектури та дизайну")}</p>
            <a
              href="https://lpnu.ua"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-accent-yellow hover:underline underline-offset-4 font-bold mt-2"
            >
              {t("footer_portal_link", "lpnu.ua — Головний портал університету")} <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Contacts */}
        <div className="p-8 md:p-12 space-y-6">
          <div className="font-mono text-xs text-paper/50 uppercase mb-8">{t("nav_contacts")}</div>
          <address className="not-italic text-sm space-y-4">
            <p className="font-bold uppercase tracking-wider block">{t("footer_location")}</p>
            <p className="text-paper/70 whitespace-pre-line">{t("footer_address")}</p>
            <p className="font-bold uppercase tracking-wider block mt-6">{t("footer_email_label")}</p>
            <p>
              <a href="mailto:vdm.dept@lpnu.ua" className="text-paper hover:text-accent-yellow transition-colors focus-ring underline underline-offset-4 pointer-events-auto block">
                {t("footer_email")}
              </a>
            </p>
          </address>
        </div>

        {/* Links */}
        <div className="p-8 md:p-12 space-y-6 flex flex-col justify-between">
          <div>
            <div className="font-mono text-xs text-paper/50 uppercase mb-8">{t("footer_nav_label")}</div>
            <ul className="text-sm font-bold uppercase tracking-widest space-y-3">
              <li>
                <Link to="/applicants" className="hover:text-accent-yellow transition-colors focus-ring block">{t("nav_applicants")}</Link>
              </li>
              <li>
                <Link to="/programs" className="hover:text-accent-yellow transition-colors focus-ring block">{t("nav_programs")}</Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-accent-yellow transition-colors focus-ring block">{t("nav_projects")}</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-accent-yellow transition-colors focus-ring block">{t("nav_about", "Про нас")}</Link>
              </li>
            </ul>
          </div>

          {/* Legal and Accessibility Links */}
          <div className="pt-6 border-t border-paper/10 space-y-2.5">
            <button
              type="button"
              onClick={openPrivacyModal}
              className="text-xs uppercase font-mono tracking-wider text-paper/70 hover:text-accent-yellow flex items-center gap-2 transition-colors focus-ring text-left"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t("cookie_privacy_link", "Політика конфіденційності")}</span>
            </button>
            <button
              onClick={openCookieSettings}
              className="text-xs uppercase font-mono tracking-wider text-paper/70 hover:text-accent-yellow flex items-center gap-2 transition-colors focus-ring text-left"
            >
              <Cookie className="w-3.5 h-3.5" />
              <span>{t("cookie_settings_btn", "Налаштування файлів cookie")}</span>
            </button>
            <button
              onClick={toggleToolbar}
              className="text-xs uppercase font-mono tracking-wider text-paper/70 hover:text-accent-yellow flex items-center gap-2 transition-colors focus-ring text-left"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{t("a11y_toolbar_btn", "Панель доступності (ДСТУ EN 301 549)")}</span>
            </button>
          </div>
        </div>
        
      </div>
      
      {/* Bottom Bar: Copyright & Attribution */}
      <div className="px-8 py-8 text-[10px] md:text-xs text-paper/50 font-mono uppercase tracking-wider flex flex-col items-center gap-3 text-center">
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
          <p>© {currentYear} {t("footer_copyright", "Кафедра дизайну та візуальних комунікацій НУ «Львівська політехніка»")}</p>
          <span className="hidden md:block w-1 h-1 bg-paper/20 rounded-full"></span>
          <p>{t("footer_rights", "Всі права захищено (ЗУ № 2811-IX)")}</p>
        </div>
        <p className="text-[10px] text-paper/40 max-w-3xl leading-relaxed">
          {t("footer_attribution", "Використання матеріалів вебсайту дозволяється за умови обов'язкового відкритого прямого гіперпосилання на офіційне першоджерело.")}
        </p>
      </div>
    </footer>
  );
}
