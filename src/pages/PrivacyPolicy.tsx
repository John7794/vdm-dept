import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, FileText, ArrowLeft, Lock, Info, Scale, Cookie, Maximize2 } from "lucide-react";
import { useCms } from "../contexts/CmsContext";
import { useCookieConsent } from "../contexts/CookieConsentContext";
import { usePrivacyModal } from "../contexts/PrivacyModalContext";

export default function PrivacyPolicy() {
  const { t } = useCms();
  const { openCookieSettings } = useCookieConsent();
  const { openPrivacyModal } = usePrivacyModal();

  return (
    <div className="flex flex-col w-full bg-page-bg">
      {/* Header */}
      <section className="border-b-2 border-border-main bg-surface-main p-6 md:p-12 lg:p-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between gap-4 mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-text-dim hover:text-text-main transition-colors focus-ring"
            >
              <ArrowLeft className="w-4 h-4 a11y-keep" /> {t("nav_home", "Головна")}
            </Link>

            <button
              type="button"
              onClick={openPrivacyModal}
              className="inline-flex items-center gap-2 font-mono text-xs uppercase px-3 py-1.5 border border-border-soft hover:border-border-main hover:bg-surface-mut text-text-dim hover:text-text-main transition-colors focus-ring"
            >
              <Maximize2 className="w-3.5 h-3.5 a11y-keep" />
              <span>{t("privacy_open_modal_btn", "Відкрити як модальне вікно")}</span>
            </button>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs uppercase bg-accent-blue/15 text-accent-blue px-3 py-1 border border-accent-blue/30 font-bold">
              {t("privacy_meta_badge", "Правові засади діяльності")}
            </span>
            <span className="font-mono text-xs uppercase text-text-dim">
              {t("privacy_meta_laws", "ЗУ № 2297-VI / ЗУ № 2811-IX")}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-text-main leading-tight">
            {t("privacy_title", "Політика конфіденційності та правова інформація")}
          </h1>
          <p className="mt-4 text-base md:text-lg text-text-dim font-light leading-relaxed border-l-2 border-accent-blue pl-4 py-1">
            {t(
              "privacy_desc",
              "Порядок збирання, використання, захисту персональних даних та умови користування офіційним вебресурсом Кафедри дизайну та візуальних комунікацій Національного університету «Львівська політехніка»."
            )}
          </p>
        </div>
      </section>

      {/* Content without heavy box borders, separated by clean hr dividers */}
      <section className="max-w-4xl mx-auto w-full p-6 md:p-12 space-y-10">
        
        {/* 1. Преамбула */}
        <article className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight flex items-center gap-2.5 text-text-main">
            <Scale className="w-5 h-5 text-accent-blue a11y-keep flex-shrink-0" />
            {t("privacy_sec1_title", "1. Загальні положення та правові підстави")}
          </h2>
          <div className="space-y-3 text-sm md:text-base leading-relaxed text-text-dim font-light pl-7">
            <p>
              {t(
                "privacy_sec1_p1",
                "Ця Політика конфіденційності та обробки персональних даних (далі — «Політика») регулює порядок збору, обробки, використання та зберігання персональних даних користувачів офіційного вебсайту Кафедри дизайну та візуальних комунікацій Інституту архітектури та дизайну Національного університету «Львівська політехніка» (далі — «Кафедра», «Володілець даних»)."
              )}
            </p>
            <p className="font-medium text-text-main">
              {t("privacy_sec1_p2", "Обробка даних здійснюється у суворій відповідності до:")}
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 font-medium text-text-main text-sm">
              <li>{t("privacy_sec1_law1", "Закону України «Про захист персональних даних» від 01.06.2010 № 2297-VI;")}</li>
              <li>{t("privacy_sec1_law2", "Закону України «Про інформацію» від 02.10.1992 № 2657-XII;")}</li>
              <li>{t("privacy_sec1_law3", "Закону України «Про забезпечення функціонування української мови як державної» від 25.04.2019 № 2704-VIII;")}</li>
              <li>{t("privacy_sec1_law4", "Закону України «Про авторське право і суміжні права» від 01.12.2022 № 2811-IX;")}</li>
              <li>{t("privacy_sec1_law5", "ДСТУ EN 301 549:2022 щодо доступності інформаційно-комунікаційних послуг.")}</li>
            </ul>
          </div>
        </article>

        <hr className="border-t border-border-soft" />

        {/* 2. Склад персональних даних */}
        <article className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight flex items-center gap-2.5 text-text-main">
            <Info className="w-5 h-5 text-accent-blue a11y-keep flex-shrink-0" />
            {t("privacy_sec2_title", "2. Склад та категорії персональних даних")}
          </h2>
          <div className="space-y-4 text-sm md:text-base leading-relaxed text-text-dim font-light pl-7">
            <p>
              {t("privacy_sec2_desc", "Кафедра обробляє виключно той мінімальний обсяг даних, який є необхідним для реалізації мети взаємодії:")}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2 border-l-2 border-accent-blue/50 pl-4 py-1">
                <span className="font-bold text-xs uppercase tracking-wider block text-text-main">
                  {t("privacy_sec2_f1_title", "Дані форми зворотного зв'язку:")}
                </span>
                <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-text-dim">
                  <li>{t("privacy_sec2_f1_i1", "Ім'я (Прізвище, Ім'я, По батькові або звернення);")}</li>
                  <li>{t("privacy_sec2_f1_i2", "Адреса електронної пошти (email);")}</li>
                  <li>{t("privacy_sec2_f1_i3", "Текст повідомлення чи запитання користувача.")}</li>
                </ul>
              </div>
              <div className="space-y-2 border-l-2 border-accent-blue/50 pl-4 py-1">
                <span className="font-bold text-xs uppercase tracking-wider block text-text-main">
                  {t("privacy_sec2_f2_title", "Технічні та аналітичні дані (Cookies):")}
                </span>
                <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-text-dim">
                  <li>{t("privacy_sec2_f2_i1", "Обрана мовна локалізація сайту (UA/EN/DE/PL);")}</li>
                  <li>{t("privacy_sec2_f2_i2", "Параметри панелі доступності (розмір шрифту, контрастність);")}</li>
                  <li>{t("privacy_sec2_f2_i3", "Технічна інформація пристрою та браузера.")}</li>
                </ul>
              </div>
            </div>
          </div>
        </article>

        <hr className="border-t border-border-soft" />

        {/* 3. Права суб'єкта персональних даних (ст. 8 ЗУ № 2297-VI) */}
        <article className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight flex items-center gap-2.5 text-text-main">
            <ShieldCheck className="w-5 h-5 text-accent-blue a11y-keep flex-shrink-0" />
            {t("privacy_sec3_title", "3. Права суб'єкта персональних даних (Стаття 8 Закону України № 2297-VI)")}
          </h2>
          <div className="space-y-3 text-sm md:text-base leading-relaxed text-text-dim font-light pl-7">
            <p>
              {t(
                "privacy_sec3_desc",
                "Згідно зі статтею 8 Закону України «Про захист персональних даних», як суб'єкт персональних даних, ви маєте невіддільне право:"
              )}
            </p>
            <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm font-mono leading-normal text-text-main pl-1">
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
        </article>

        <hr className="border-t border-border-soft" />

        {/* 4. Файли Cookie */}
        <article className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight flex items-center gap-2.5 text-text-main">
            <Lock className="w-5 h-5 text-accent-blue a11y-keep flex-shrink-0" />
            {t("privacy_sec4_title", "4. Використання файлів cookie")}
          </h2>
          <div className="space-y-4 text-sm md:text-base leading-relaxed text-text-dim font-light pl-7">
            <p>
              {t(
                "privacy_sec4_desc",
                "Файли cookie — це невеликі текстові файли, які зберігаються на вашому комп'ютері або мобільному пристрої під час перегляду вебсайту для забезпечення його коректної роботи та персоналізації інтерфейсу."
              )}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="border-l-2 border-accent-blue/50 pl-3.5 py-1">
                <span className="font-bold text-xs uppercase block text-text-main mb-1">
                  {t("privacy_cat_necessary_label", "1. Необхідні (технічні) cookie:")}
                </span>
                <p className="text-xs sm:text-sm text-text-dim">
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
                <p className="text-xs sm:text-sm text-text-dim">
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
                <p className="text-xs sm:text-sm text-text-dim">
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
                <p className="text-xs sm:text-sm text-text-dim">
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
                onClick={openCookieSettings}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-text-main text-page-bg font-mono text-xs uppercase font-bold hover:opacity-90 active:scale-95 transition-all focus-ring"
              >
                <Cookie className="w-4 h-4 a11y-keep" />
                <span>{t("privacy_cookie_btn", "Налаштувати дозволи файлів cookie")}</span>
              </button>
            </div>
          </div>
        </article>

        <hr className="border-t border-border-soft" />

        {/* 5. Авторське право та використання матеріалів */}
        <article className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight flex items-center gap-2.5 text-text-main">
            <FileText className="w-5 h-5 text-accent-blue a11y-keep flex-shrink-0" />
            {t("privacy_sec5_title", "5. Авторське право та використання матеріалів (ЗУ № 2811-IX)")}
          </h2>
          <div className="space-y-3 text-sm md:text-base leading-relaxed text-text-dim font-light pl-7">
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
        </article>

        <hr className="border-t border-border-soft" />

        {/* 6. Контакти володільця даних */}
        <article className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight flex items-center gap-2.5 text-text-main">
            <Info className="w-5 h-5 text-accent-blue a11y-keep flex-shrink-0" />
            {t("privacy_sec6_title", "6. Офіційні реквізити та контактні дані")}
          </h2>
          <div className="space-y-2 text-sm md:text-base text-text-dim font-mono leading-relaxed pl-7">
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
              <a href="https://lpnu.ua" target="_blank" rel="noopener noreferrer" className="underline hover:text-accent-blue">
                lpnu.ua
              </a>
            </p>
          </div>
        </article>
      </section>
    </div>
  );
}
