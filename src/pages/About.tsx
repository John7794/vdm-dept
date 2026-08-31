import { motion } from "motion/react";
import { useCms } from "../contexts/CmsContext";
import { MapPin, Phone, Mail } from "lucide-react";
import { formatDriveLink } from "../lib/utils";

export default function About() {
  const { t, data } = useCms();

  const headerBgRaw = data?.multimedia?.find((m: any) => m.Category === "AboutHeader")?.Url;
  const headerBgUrl = headerBgRaw ? formatDriveLink(headerBgRaw) : null;

  return (
    <div className="flex flex-col w-full bg-page-bg">
      {/* Page Header */}
      <section className="border-b-2 border-border-main bg-surface-main p-6 md:p-12 lg:p-16 relative overflow-hidden pt-32 lg:pt-40 min-h-[50vh] flex flex-col justify-end">
        {headerBgUrl && (
          <>
            <div 
              className="absolute inset-0 bg-cover bg-center z-0"
              style={{ backgroundImage: `url(${headerBgUrl})` }}
            />
            {/* Dark/Light overlay to ensure text contrast */}
            <div className="absolute inset-0 bg-page-bg/60 z-0 backdrop-blur-[2px]" />
          </>
        )}
        
        <div className="max-w-[1000px] z-10 relative">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-7xl lg:text-[8rem] font-bold leading-[0.85] tracking-[-0.04em] uppercase text-text-main text-balance"
          >
            {t("about_title", "Про Нас.")}
          </motion.h1>
          <p className="mt-8 text-xl max-w-2xl font-light leading-relaxed text-text-main">
            {t("about_desc", "Історія, досягнення та контакти кафедри візуального дизайну і мистецтва.")}
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-border-main border-b-2 border-border-main">
        
        {/* Left Column: History & Achievements */}
        <div className="lg:col-span-7 xl:col-span-8 bg-surface-main">
          <div className="p-6 md:p-12 lg:p-16 max-w-4xl space-y-16">
            
            {/* History Section */}
            <div>
              <span className="font-mono text-xs text-text-dim block mb-8 uppercase tracking-widest">
                {t("about_history_label", "Історія")}
              </span>
              
              <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-8 leading-none">
                {t("about_history_title", "Спадщина та Авангард")}
              </h2>
              
              <div className="space-y-6 text-lg font-light leading-relaxed text-text-main text-balance">
                <p>
                  {t("about_history_p1", "Кафедра візуального дизайну і мистецтва є невід'ємною частиною Інституту архітектури та дизайну Національного університету «Львівська політехніка». Ми базуємося на глибоких традиціях львівської архітектурної школи, трансформуючи їх у мову сучасного візуального проєктування.")}
                </p>
                <p>
                  {t("about_history_p2", "Наш підхід полягає у відмові від суто художнього оздоблення на користь функціонального комунікативного дизайну. Ми вчимо не просто створювати зображення, а проєктувати інформаційні системи, керувати увагою та формувати сенси через візуальну мову.")}
                </p>
              </div>
            </div>

            {/* Achievements Section */}
            <div>
              <span className="font-mono text-xs text-text-dim block mb-8 uppercase tracking-widest">
                {t("about_achievements_label", "Досягнення")}
              </span>
              
              <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-8 leading-none">
                {t("about_achievements_title", "Наші результати")}
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="relative pl-6">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-blue shadow-[var(--theme-glow)]"></div>
                  <div className="text-4xl md:text-5xl font-bold font-mono mb-2">20+</div>
                  <div className="text-sm font-bold uppercase tracking-widest text-text-dim">
                    {t("about_achievements_1", "Років досвіду")}
                  </div>
                </div>
                <div className="relative pl-6">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-blue shadow-[var(--theme-glow)]"></div>
                  <div className="text-4xl md:text-5xl font-bold font-mono mb-2">500+</div>
                  <div className="text-sm font-bold uppercase tracking-widest text-text-dim">
                    {t("about_achievements_2", "Випускників")}
                  </div>
                </div>
                <div className="relative pl-6">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-blue shadow-[var(--theme-glow)]"></div>
                  <div className="text-4xl md:text-5xl font-bold font-mono mb-2">50+</div>
                  <div className="text-sm font-bold uppercase tracking-widest text-text-dim">
                    {t("about_achievements_3", "Нагород на конкурсах")}
                  </div>
                </div>
                <div className="relative pl-6">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-blue shadow-[var(--theme-glow)]"></div>
                  <div className="text-4xl md:text-5xl font-bold font-mono mb-2">100%</div>
                  <div className="text-sm font-bold uppercase tracking-widest text-text-dim">
                    {t("about_achievements_4", "Проєктне навчання")}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Contacts & Map */}
        <div className="lg:col-span-5 xl:col-span-4 bg-ink text-paper flex flex-col">
          <div className="p-6 md:p-12 flex-grow">
            <span className="font-mono text-xs text-paper/50 block mb-8 uppercase tracking-widest">
              {t("nav_contacts", "Контакти")}
            </span>
            
            <h2 className="text-3xl font-bold uppercase tracking-tight mb-12">
              {t("about_contacts_title", "Зв'яжіться з нами")}
            </h2>
            
            <ul className="space-y-8">
              <li className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-accent-yellow shrink-0 mt-1" />
                <div>
                  <h3 className="font-mono text-sm tracking-widest uppercase mb-2 text-paper/70">
                    {t("footer_location", "Адреса")}
                  </h3>
                  <p className="font-light text-base leading-relaxed whitespace-pre-line">
                    {t("about_address_full", "вул. Січових Стрільців, 7\nм. Львів\nУкраїна, 79000")}
                  </p>
                </div>
              </li>
              
              <li className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-accent-yellow shrink-0 mt-1" />
                <div>
                  <h3 className="font-mono text-sm tracking-widest uppercase mb-2 text-paper/70">
                    {t("about_phone_label", "Телефон")}
                  </h3>
                  <a href="tel:+380322582672" className="font-light text-base leading-relaxed hover:text-accent-yellow transition-colors focus-ring outline-none">
                    {t("about_phone", "+38 (032) 258 26 72")}
                  </a>
                </div>
              </li>
              
              <li className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-accent-yellow shrink-0 mt-1" />
                <div>
                  <h3 className="font-mono text-sm tracking-widest uppercase mb-2 text-paper/70">
                    {t("footer_email_label", "Електронна пошта")}
                  </h3>
                  <a href="mailto:vd.dept@lpnu.ua" className="font-light text-base leading-relaxed hover:text-accent-yellow transition-colors focus-ring outline-none">
                    {t("footer_email", "vd.dept@lpnu.ua")}
                  </a>
                </div>
              </li>
            </ul>
          </div>
          
          {/* Embedded Map */}
          <div className="w-full h-80 lg:h-[400px] border-t-2 border-border-soft mt-auto bg-surface-mut">
            <iframe 
              src="https://maps.google.com/maps?q=вул.+Січових+Стрільців,+7,+Львів&t=&z=16&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Map location"
            ></iframe>
          </div>
        </div>

      </section>
    </div>
  );
}
