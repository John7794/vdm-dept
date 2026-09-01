import { Link, useLocation } from "react-router-dom";
import { useCms } from "../../contexts/CmsContext";
import { formatDriveLink } from "../../lib/utils";

const LogoText = ({ className }: { className?: string }) => (
  <div className={`font-bold text-4xl tracking-tighter uppercase select-none ${className}`}>
    VDA<span className="text-accent-blue">.</span>
  </div>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const { data, t } = useCms();

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
      <img src={currentLogoUrl} alt="VDA Logo" className={`h-12 md:h-16 w-auto object-contain ${className || ""}`} />
    ) : (
      <LogoText className={className} />
    )
  );

  return (
    <footer className="bg-ink text-paper border-t-2 border-ink mt-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-4 divide-y-2 md:divide-y-0 md:divide-x-2 divide-paper/20 border-b-2 border-paper/20">
        
        {/* Branding Block */}
        <div className="p-8 md:p-12 md:col-span-2 space-y-8 flex flex-col">
          <div className="flex flex-col gap-8">
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
        <div className="p-8 md:p-12 space-y-6 flex flex-col">
          <div className="font-mono text-xs text-paper/50 uppercase mb-8">{t("footer_nav_label")}</div>
          <ul className="text-sm font-bold uppercase tracking-widest space-y-4 flex-grow flex flex-col justify-end">
            <li>
              {location.pathname === "/applicants" ? (
                <span className="text-accent-yellow block">{t("nav_applicants")}</span>
              ) : (
                <Link to="/applicants" className="hover:text-accent-yellow transition-colors focus-ring block">{t("nav_applicants")}</Link>
              )}
            </li>
            <li>
              {location.pathname === "/programs" ? (
                <span className="text-accent-yellow block">{t("nav_programs")}</span>
              ) : (
                <Link to="/programs" className="hover:text-accent-yellow transition-colors focus-ring block">{t("nav_programs")}</Link>
              )}
            </li>
            <li>
              {location.pathname === "/projects" ? (
                <span className="text-accent-yellow block">{t("nav_projects")}</span>
              ) : (
                <Link to="/projects" className="hover:text-accent-yellow transition-colors focus-ring block">{t("nav_projects")}</Link>
              )}
            </li>
            <li>
              {location.pathname === "/about" ? (
                <span className="text-accent-yellow block">{t("nav_about", "Про нас")}</span>
              ) : (
                <Link to="/about" className="hover:text-accent-yellow transition-colors focus-ring block">{t("nav_about", "Про нас")}</Link>
              )}
            </li>
          </ul>
        </div>
        
      </div>
      
      {/* Bottom Bar */}
      <div className="px-8 py-10 text-[10px] md:text-xs text-paper/40 font-mono uppercase tracking-[0.2em] flex flex-col items-center gap-6">
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-8 text-center">
          <p>© {currentYear} VDA</p>
          <span className="hidden md:block w-1 h-1 bg-paper/20 rounded-full"></span>
          <p>{t("footer_rights")}</p>
        </div>
      </div>
    </footer>
  );
}
