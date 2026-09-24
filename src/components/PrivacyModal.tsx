import React, { useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ShieldCheck, Scale, Info, Lock, FileText, Cookie, ExternalLink } from "lucide-react";
import { useCms } from "../contexts/CmsContext";
import { usePrivacyModal } from "../contexts/PrivacyModalContext";
import { useCookieConsent } from "../contexts/CookieConsentContext";

export default function PrivacyModal() {
  const { t } = useCms();
  const { isOpen, closePrivacyModal } = usePrivacyModal();
  const { openCookieSettings } = useCookieConsent();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleOpenCookieSettings = () => {
    closePrivacyModal();
    setTimeout(() => {
      openCookieSettings();
    }, 200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10 bg-black/70 backdrop-blur-sm overflow-hidden">
        {/* Backdrop click */}
        <div 
          className="absolute inset-0" 
          onClick={closePrivacyModal} 
          aria-hidden="true" 
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="privacy-modal-title"
          className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-surface-main text-text-main border-2 border-border-main shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.7)] z-10 overflow-hidden"
        >
          {/* Modal Header */}
          <div className="p-4 sm:p-6 border-b-2 border-border-main bg-page-bg flex items-start justify-between gap-4 flex-shrink-0">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="font-mono text-[10px] sm:text-xs uppercase bg-accent-blue/15 text-accent-blue px-2.5 py-0.5 border border-accent-blue/30 font-bold">
                  {t("privacy_meta_badge", "Правові засади діяльності")}
                </span>
                <span className="font-mono text-[10px] sm:text-xs uppercase text-text-dim">
                  {t("privacy_meta_laws", "ЗУ № 2297-VI / ЗУ № 2811-IX")}
                </span>
              </div>
              <h2
                id="privacy-modal-title"
                className="text-lg sm:text-2xl font-bold uppercase tracking-tight text-text-main leading-tight"
              >
                {t("privacy_title", "Політика конфіденційності та правова інформація")}
              </h2>
            </div>

            <button
              type="button"
              onClick={closePrivacyModal}
              aria-label={t("privacy_modal_close_btn", "Закрити")}
              title={t("privacy_modal_close_btn", "Закрити")}
              className="p-2 border-2 border-border-soft hover:border-border-main hover:bg-surface-mut transition-colors focus-ring flex-shrink-0 text-text-dim hover:text-text-main"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick navigation links */}
          <div className="px-4 sm:px-6 py-2 bg-surface-mut/50 border-b border-border-soft flex items-center gap-1.5 sm:gap-3 overflow-x-auto text-[11px] font-mono whitespace-nowrap flex-shrink-0">
            <span className="text-text-dim uppercase font-bold mr-1">
              {t("privacy_nav_lbl", "Розділи:")}
            </span>
            <button
              type="button"
              onClick={() => scrollToSection("privacy-sec-1")}
              className="px-2 py-1 text-text-dim hover:text-text-main hover:underline underline-offset-4 transition-colors"
            >
              1. {t("privacy_tab_general", "Загальні")}
            </button>
            <span className="text-border-soft">/</span>
            <button
              type="button"
              onClick={() => scrollToSection("privacy-sec-2")}
              className="px-2 py-1 text-text-dim hover:text-text-main hover:underline underline-offset-4 transition-colors"
            >
              2. {t("privacy_tab_categories", "Дані")}
            </button>
            <span className="text-border-soft">/</span>
            <button
              type="button"
              onClick={() => scrollToSection("privacy-sec-3")}
              className="px-2 py-1 text-text-dim hover:text-text-main hover:underline underline-offset-4 transition-colors"
            >
              3. {t("privacy_tab_rights", "Права (ст. 8)")}
            </button>
            <span className="text-border-soft">/</span>
            <button
              type="button"
              onClick={() => scrollToSection("privacy-sec-4")}
              className="px-2 py-1 text-text-dim hover:text-text-main hover:underline underline-offset-4 transition-colors"
            >
              4. Cookies
            </button>
            <span className="text-border-soft">/</span>
            <button
              type="button"
              onClick={() => scrollToSection("privacy-sec-5")}
              className="px-2 py-1 text-text-dim hover:text-text-main hover:underline underline-offset-4 transition-colors"
            >
              5. {t("privacy_tab_copyright", "Авторське право")}
            </button>
            <span className="text-border-soft">/</span>
            <button
              type="button"
              onClick={() => scrollToSection("privacy-sec-6")}
              className="px-2 py-1 text-text-dim hover:text-text-main hover:underline underline-offset-4 transition-colors"
            >
              6. {t("privacy_tab_contacts", "Реквізити")}
            </button>
          </div>

          {/* Modal Body with Custom Scrollbar */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 custom-scrollbar text-sm leading-relaxed"
          >
            {/* Description Lead */}
            <p className="text-sm md:text-base text-text-dim font-light leading-relaxed border-l-2 border-accent-blue pl-4 py-1">
              {t(
                "privacy_desc",
                "Порядок збирання, використання, захисту персональних даних та умови користування офіційним вебресурсом Кафедри дизайну та візуальних комунікацій Національного університету «Львівська політехніка»."
              )}
            </p>

            <hr className="border-t border-border-soft" />

            {/* 1. Преамбула */}
            <div id="privacy-sec-1" className="space-y-3">
              <h3 className="text-base sm:text-lg font-bold uppercase tracking-tight flex items-center gap-2 text-text-main">
                <Scale className="w-4 h-4 sm:w-5 sm:h-5 text-accent-blue a11y-keep flex-shrink-0" />
                {t("privacy_sec1_title", "1. Загальні положення та правові підстави")}
              </h3>
              <div className="space-y-3 text-xs sm:text-sm text-text-dim font-light pl-6 sm:pl-7">
                <p>
                  {t(
                    "privacy_sec1_p1",
                    "Ця Політика конфіденційності та обробки персональних даних (далі — «Політика») регулює порядок збору, обробки, використання та зберігання персональних даних користувачів офіційного вебсайту Кафедри дизайну та візуальних комунікацій Інституту архітектури та дизайну Національного університету «Львівська політехніка» (далі — «Кафедра», «Володілець даних»)."
                  )}
                </p>
                <p className="font-medium text-text-main">
                  {t("privacy_sec1_p2", "Обробка даних здійснюється у суворій відповідності до:")}
                </p>
                <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs sm:text-sm text-text-main">
                  <li>{t("privacy_sec1_law1", "Закону України «Про захист персональних даних» від 01.06.2010 № 2297-VI;")}</li>
                  <li>{t("privacy_sec1_law2", "Закону України «Про інформацію» від 02.10.1992 № 2657-XII;")}</li>
                  <li>{t("privacy_sec1_law3", "Закону України «Про забезпечення функціонування української мови як державної» від 25.04.2019 № 2704-VIII;")}</li>
                  <li>{t("privacy_sec1_law4", "Закону України «Про авторське право і суміжні права» від 01.12.2022 № 2811-IX;")}</li>
                  <li>{t("privacy_sec1_law5", "ДСТУ EN 301 549:2022 щодо доступності інформаційно-комунікаційних послуг.")}</li>
                </ul>
              </div>
            </div>

            <hr className="border-t border-border-soft" />

            {/* 2. Склад персональних даних */}
            <div id="privacy-sec-2" className="space-y-3">
              <h3 className="text-base sm:text-lg font-bold uppercase tracking-tight flex items-center gap-2 text-text-main">
                <Info className="w-4 h-4 sm:w-5 sm:h-5 text-accent-blue a11y-keep flex-shrink-0" />
                {t("privacy_sec2_title", "2. Склад та категорії персональних даних")}
              </h3>
              <div className="space-y-4 text-xs sm:text-sm text-text-dim font-light pl-6 sm:pl-7">
                <p>
                  {t("privacy_sec2_desc", "Кафедра обробляє виключно той мінімальний обсяг даних, який є необхідним для реалізації мети взаємодії:")}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  <div className="space-y-1.5 border-l-2 border-accent-blue/50 pl-3.5 py-1">
                    <span className="font-bold text-xs uppercase block text-text-main">
                      {t("privacy_sec2_f1_title", "Дані форми зворотного зв'язку:")}
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-xs text-text-dim">
                      <li>{t("privacy_sec2_f1_i1", "Ім'я (Прізвище, Ім'я, По батькові або звернення);")}</li>
                      <li>{t("privacy_sec2_f1_i2", "Адреса електронної пошти (email);")}</li>
                      <li>{t("privacy_sec2_f1_i3", "Текст повідомлення чи запитання користувача.")}</li>
                    </ul>
                  </div>
                  <div className="space-y-1.5 border-l-2 border-accent-blue/50 pl-3.5 py-1">
                    <span className="font-bold text-xs uppercase block text-text-main">
                      {t("privacy_sec2_f2_title", "Технічні та аналітичні дані (Cookies):")}
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-xs text-text-dim">
                      <li>{t("privacy_sec2_f2_i1", "Обрана мовна локалізація сайту (UA/EN/DE/PL);")}</li>
                      <li>{t("privacy_sec2_f2_i2", "Параметри панелі доступності (розмір шрифту, контрастність);")}</li>
                      <li>{t("privacy_sec2_f2_i3", "Технічна інформація пристрою та браузера.")}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-t border-border-soft" />

            {/* 3. Права суб'єкта персональних даних */}
            <div id="privacy-sec-3" className="space-y-3">
              <h3 className="text-base sm:text-lg font-bold uppercase tracking-tight flex items-center gap-2 text-text-main">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-accent-blue a11y-keep flex-shrink-0" />
                {t("privacy_sec3_title", "3. Права суб'єкта персональних даних (Стаття 8 Закону України № 2297-VI)")}
              </h3>
              <div className="space-y-2 text-xs sm:text-sm text-text-dim font-light pl-6 sm:pl-7">
                <p className="mb-2">
                  {t(
                    "privacy_sec3_desc",
                    "Згідно зі статтею 8 Закону України «Про захист персональних даних», як суб'єкт персональних даних, ви маєте невіддільне право:"
                  )}
                </p>
                <ol className="list-decimal list-inside space-y-2 text-xs font-mono leading-normal text-text-main">
                  <li>{t("privacy_sec3_r1", "Знати про джерела збирання, місцезнаходження своїх персональних даних, мету їх обробки та місцезнаходження володільця даних;")}</li>
                  <li>{t("privacy_sec3_r2", "Отримувати інформацію про умови надання доступу до персональних даних, зокрема інформацію про третіх осіб, яким передаються ваші дані;")}</li>
                  <li>{t("privacy_sec3_r3", "На доступ до своїх персональних даних;")}</li>
                  <li>{t("privacy_sec3_r4", "Отримувати не пізніш як за 30 календарних днів з дня надходження запиту відповідь про те, чи обробляються ваші персональні дані, а також отримувати зміст таких даних;")}</li>
                  <li>{t("privacy_sec3_r5", "Пред'являти вмотивовану вимогу володільцю персональних даних із запереченням проти обробки своїх персональних даних;")}</li>
                  <li>{t("privacy_sec3_r6", "Пред'являти вмотивовану вимогу щодо зміни або знищення своїх персональних даних будь-яким володільцем, якщо ці дані обробляються незаконно чи є недостовірними;")}</li>
                  <li>{t("privacy_sec3_r7", "На захист своїх персональних даних від незаконної обробки та випадкової втрати, знищення, пошкодження;")}</li>
                  <li>{t("privacy_sec3_r8", "Звертатися із скаргами на обробку своїх персональних даних до Уповноваженого Верховної Ради України з прав людини або до суду;")}</li>
                  <li>{t("privacy_sec3_r9", "Застосовувати засоби правового захисту в разі порушення законодавства про захист персональних даних;")}</li>
                  <li>{t("privacy_sec3_r10", "Відкликати згоду на обробку персональних даних у будь-який момент.")}</li>
                </ol>
              </div>
            </div>

            <hr className="border-t border-border-soft" />

            {/* 4. Файли Cookie */}
            <div id="privacy-sec-4" className="space-y-3">
              <h3 className="text-base sm:text-lg font-bold uppercase tracking-tight flex items-center gap-2 text-text-main">
                <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-accent-blue a11y-keep flex-shrink-0" />
                {t("privacy_sec4_title", "4. Використання файлів cookie")}
              </h3>
              <div className="space-y-4 text-xs sm:text-sm text-text-dim font-light pl-6 sm:pl-7">
                <p>
                  {t(
                    "privacy_sec4_desc",
                    "Файли cookie — це невеликі текстові файли, які зберігаються на вашому комп'ютері або мобільному пристрої під час перегляду вебсайту для забезпечення його коректної роботи та персоналізації інтерфейсу."
                  )}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="border-l-2 border-accent-blue/50 pl-3.5 py-1">
                    <span className="font-bold text-xs uppercase block text-text-main mb-1">
                      {t("privacy_cat_necessary_label", "1. Необхідні (технічні) cookie:")}
                    </span>
                    <p className="text-xs text-text-dim">
                      {t(
                        "cookie_cat_necessary_desc",
                        "Обов'язкові для навігації, безпеки, збереження теми та налаштувань доступності (ДСТУ EN 301 549)."
                      )}
                    </p>
                  </div>
                  <div className="border-l-2 border-accent-blue/50 pl-3.5 py-1">
                    <span className="font-bold text-xs uppercase block text-text-main mb-1">
                      {t("privacy_cat_functional_label", "2. Функціональні cookie:")}
                    </span>
                    <p className="text-xs text-text-dim">
                      {t(
                        "cookie_cat_functional_desc",
                        "Запам'ятовують мовну версію та фільтри проєктів і навчальних програм."
                      )}
                    </p>
                  </div>
                  <div className="border-l-2 border-accent-blue/50 pl-3.5 py-1">
                    <span className="font-bold text-xs uppercase block text-text-main mb-1">
                      {t("privacy_cat_analytics_label", "3. Аналітичні cookie:")}
                    </span>
                    <p className="text-xs text-text-dim">
                      {t(
                        "cookie_cat_analytics_desc",
                        "Знеособлена статистика перегляду сторінок для оптимізації структури матеріалів."
                      )}
                    </p>
                  </div>
                  <div className="border-l-2 border-accent-blue/50 pl-3.5 py-1">
                    <span className="font-bold text-xs uppercase block text-text-main mb-1">
                      {t("privacy_cat_multimedia_label", "4. Мультимедійні cookie:")}
                    </span>
                    <p className="text-xs text-text-dim">
                      {t(
                        "cookie_cat_multimedia_desc",
                        "Відтворення вбудованих відеороликів, інтерактивних мап та робіт студентів."
                      )}
                    </p>
                  </div>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleOpenCookieSettings}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-text-main text-page-bg font-mono text-xs uppercase font-bold hover:opacity-90 active:scale-95 transition-all focus-ring"
                  >
                    <Cookie className="w-3.5 h-3.5 a11y-keep" />
                    <span>{t("privacy_cookie_btn", "Налаштувати дозволи файлів cookie")}</span>
                  </button>
                </div>
              </div>
            </div>

            <hr className="border-t border-border-soft" />

            {/* 5. Авторське право */}
            <div id="privacy-sec-5" className="space-y-3">
              <h3 className="text-base sm:text-lg font-bold uppercase tracking-tight flex items-center gap-2 text-text-main">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-accent-blue a11y-keep flex-shrink-0" />
                {t("privacy_sec5_title", "5. Авторське право та використання матеріалів (ЗУ № 2811-IX)")}
              </h3>
              <div className="space-y-3 text-xs sm:text-sm text-text-dim font-light pl-6 sm:pl-7">
                <p>
                  {t(
                    "privacy_sec5_p1",
                    "Усі права на матеріали, розміщені на цьому вебсайті (текстові публікації, фотографії робіт, методичні розробки, навчальні програми, графічні елементи та логотипи), захищені Законом України «Про авторське право і суміжні права»."
                  )}
                </p>
                <p>
                  {t(
                    "privacy_sec5_p2",
                    "Використання будь-яких матеріалів сайту дозволяється виключно за умови відкритого та прямого індексованого гіперпосилання на офіційний сайт Кафедри дизайну та візуальних комунікацій не нижче другого абзацу тексту матеріалу. Будь-яке комерційне використання без письмового дозволу Кафедри заборонено."
                  )}
                </p>
              </div>
            </div>

            <hr className="border-t border-border-soft" />

            {/* 6. Контакти володільця даних */}
            <div id="privacy-sec-6" className="space-y-3">
              <h3 className="text-base sm:text-lg font-bold uppercase tracking-tight flex items-center gap-2 text-text-main">
                <Info className="w-4 h-4 sm:w-5 sm:h-5 text-accent-blue a11y-keep flex-shrink-0" />
                {t("privacy_sec6_title", "6. Офіційні реквізити та контактні дані")}
              </h3>
              <div className="space-y-2 text-xs sm:text-sm text-text-dim font-mono leading-relaxed pl-6 sm:pl-7">
                <p className="font-bold text-text-main">
                  {t("privacy_sec6_dept", "Кафедра дизайну та візуальних комунікацій Інституту архітектури та дизайну НУ «Львівська політехніка»")}
                </p>
                <p>{t("privacy_sec6_address", "Адреса: 79000, Україна, м. Львів, вул. Січових Стрільців, 7, корпус 204")}</p>
                <p>
                  {t("privacy_sec6_email", "Офіційний email:")}{" "}
                  <a href="mailto:vdm.dept@lpnu.ua" className="underline hover:text-accent-blue">
                    vdm.dept@lpnu.ua
                  </a>
                </p>
                <p>
                  {t("privacy_sec6_portal", "Головний портал університету:")}{" "}
                  <a href="https://lpnu.ua" target="_blank" rel="noopener noreferrer" className="underline hover:text-accent-blue inline-flex items-center gap-1">
                    lpnu.ua <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-4 border-t-2 border-border-main bg-page-bg flex items-center justify-between gap-4 flex-shrink-0">
            <span className="text-[10px] font-mono text-text-dim uppercase hidden sm:inline">
              © {new Date().getFullYear()} {t("footer_rights", "Всі права захищено (ЗУ № 2811-IX)")}
            </span>
            <button
              type="button"
              onClick={closePrivacyModal}
              className="w-full sm:w-auto px-6 py-2.5 bg-text-main text-page-bg font-bold uppercase tracking-widest text-xs hover:opacity-90 active:scale-[0.98] transition-all focus-ring text-center ml-auto"
            >
              {t("privacy_modal_close_btn", "Закрити")}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
