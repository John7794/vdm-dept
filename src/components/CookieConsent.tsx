import React, { useState, useEffect, useRef } from "react";
import {
  Cookie,
  X,
  Check,
  Lock,
  Sliders,
  BarChart2,
  Video,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useCookieConsent, CookiePreferences } from "../contexts/CookieConsentContext";
import { usePrivacyModal } from "../contexts/PrivacyModalContext";
import { useCms } from "../contexts/CmsContext";

export default function CookieConsent() {
  const { t } = useCms();
  const { openPrivacyModal } = usePrivacyModal();
  const {
    isOpen,
    preferences,
    openCookieSettings,
    closeCookieSettings,
    savePreferences,
    acceptAll,
    acceptNecessaryOnly,
  } = useCookieConsent();

  // Local draft state for toggles in the modal
  const [draftPrefs, setDraftPrefs] = useState<CookiePreferences>(preferences);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Sync draft preferences whenever modal opens or preferences change
  useEffect(() => {
    setDraftPrefs(preferences);
  }, [preferences, isOpen]);

  // Lock body scroll and handle Escape key when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          closeCookieSettings();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen, closeCookieSettings]);

  const handleToggle = (key: keyof CookiePreferences) => {
    if (key === "necessary") return;
    setDraftPrefs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSaveDraft = () => {
    savePreferences(draftPrefs);
  };

  const scrollToCategory = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleOpenPrivacyModal = () => {
    closeCookieSettings();
    setTimeout(() => {
      openPrivacyModal();
    }, 200);
  };

  return (
    <>
      {/* Floating Trigger button to reopen cookie settings anytime */}
      {!isOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={openCookieSettings}
          type="button"
          aria-label={t("cookie_trigger_aria", "Налаштування файлів cookie")}
          title={t("cookie_trigger_title", "Налаштування файлів cookie")}
          className="fixed bottom-4 left-4 z-40 p-2.5 bg-surface-main text-text-main border-2 border-border-main shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.8)] hover:bg-surface-mut hover:scale-105 active:scale-95 transition-all duration-200 group flex items-center gap-1.5 focus-ring"
        >
          <Cookie className="w-4 h-4 text-accent-blue a11y-keep transition-transform group-hover:rotate-12" />
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider pr-1">
            {t("cookie_trigger_badge", "Cookie")}
          </span>
        </motion.button>
      )}

      {/* Centered Modal Window - exact same styling as PrivacyModal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10 bg-black/70 backdrop-blur-sm overflow-hidden">
            {/* Backdrop click */}
            <div
              className="absolute inset-0"
              onClick={closeCookieSettings}
              aria-hidden="true"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="cookie-modal-title"
              className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-surface-main text-text-main border-2 border-border-main shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.7)] z-10 overflow-hidden font-sans"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-6 border-b-2 border-border-main bg-page-bg flex items-start justify-between gap-4 flex-shrink-0">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-mono text-[10px] sm:text-xs uppercase bg-accent-blue/15 text-accent-blue px-2.5 py-0.5 border border-accent-blue/30 font-bold">
                      {t("cookie_meta_badge", "Конфіденційність та безпека")}
                    </span>
                    <span className="font-mono text-[10px] sm:text-xs uppercase text-text-dim">
                      {t("cookie_meta_laws", "ДСТУ EN 301 549 / ePrivacy Directive")}
                    </span>
                  </div>
                  <h2
                    id="cookie-modal-title"
                    className="text-lg sm:text-2xl font-bold uppercase tracking-tight text-text-main leading-tight flex items-center gap-2.5"
                  >
                    <Cookie className="w-5 h-5 sm:w-6 sm:h-6 text-accent-yellow a11y-keep flex-shrink-0" />
                    <span>{t("cookie_title", "Налаштування файлів cookie")}</span>
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={closeCookieSettings}
                  aria-label={t("cookie_close_aria", "Закрити вікно")}
                  title={t("cookie_close_aria", "Закрити")}
                  className="p-2 border-2 border-border-soft hover:border-border-main hover:bg-surface-mut transition-colors focus-ring flex-shrink-0 text-text-dim hover:text-text-main"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Category Navigation Links */}
              <div className="px-4 sm:px-6 py-2 bg-surface-mut/50 border-b border-border-soft flex items-center gap-1.5 sm:gap-3 overflow-x-auto text-[11px] font-mono whitespace-nowrap flex-shrink-0">
                <span className="text-text-dim uppercase font-bold mr-1">
                  {t("cookie_nav_lbl", "Категорії:")}
                </span>
                <button
                  type="button"
                  onClick={() => scrollToCategory("cookie-cat-necessary")}
                  className="px-2 py-1 text-text-dim hover:text-text-main hover:underline underline-offset-4 transition-colors"
                >
                  1. {t("cookie_cat_necessary_title", "Необхідні")}
                </button>
                <span className="text-border-soft">/</span>
                <button
                  type="button"
                  onClick={() => scrollToCategory("cookie-cat-functional")}
                  className="px-2 py-1 text-text-dim hover:text-text-main hover:underline underline-offset-4 transition-colors"
                >
                  2. {t("cookie_cat_functional_title", "Функціональні")}
                </button>
                <span className="text-border-soft">/</span>
                <button
                  type="button"
                  onClick={() => scrollToCategory("cookie-cat-analytics")}
                  className="px-2 py-1 text-text-dim hover:text-text-main hover:underline underline-offset-4 transition-colors"
                >
                  3. {t("cookie_cat_analytics_title", "Аналітичні")}
                </button>
                <span className="text-border-soft">/</span>
                <button
                  type="button"
                  onClick={() => scrollToCategory("cookie-cat-multimedia")}
                  className="px-2 py-1 text-text-dim hover:text-text-main hover:underline underline-offset-4 transition-colors"
                >
                  4. {t("cookie_cat_multimedia_title", "Мультимедійні")}
                </button>
              </div>

              {/* Modal Body with Custom Scrollbar & hr dividers between blocks */}
              <div
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 custom-scrollbar text-sm leading-relaxed"
              >
                {/* Description Lead */}
                <p className="text-sm md:text-base text-text-dim font-light leading-relaxed border-l-2 border-accent-blue pl-4 py-1">
                  {t(
                    "cookie_desc",
                    "Налаштуйте параметри приватності та використання файлів cookie відповідно до ваших уподобань. Необхідні технічні cookie забезпечують безпеку, функціонування сайту та параметри панелі доступності."
                  )}{" "}
                  <button
                    type="button"
                    onClick={handleOpenPrivacyModal}
                    className="underline underline-offset-2 font-bold text-text-main hover:text-accent-blue focus-ring cursor-pointer inline p-0 bg-transparent border-none text-sm md:text-base"
                  >
                    {t("cookie_privacy_link", "Детальніше у Політиці конфіденційності")}
                  </button>
                  .
                </p>

                <hr className="border-t border-border-soft" />

                {/* 1. Необхідні (Завжди активні) */}
                <div id="cookie-cat-necessary" className="space-y-3">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2.5">
                      <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-accent-blue a11y-keep flex-shrink-0" />
                      <h3 className="text-base sm:text-lg font-bold uppercase tracking-tight text-text-main">
                        1. {t("cookie_cat_necessary_title", "Необхідні технічні файли")}
                      </h3>
                      <span className="font-mono text-[10px] uppercase bg-text-main/10 text-text-main px-2 py-0.5 border border-border-main/50 font-bold">
                        {t("cookie_cat_necessary_badge", "Завжди активні")}
                      </span>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={true}
                      disabled
                      aria-label={t("cookie_cat_necessary_aria", "Необхідні cookie завжди активні")}
                      className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-not-allowed opacity-80 border-2 border-border-main bg-text-main transition-colors"
                    >
                      <span className="inline-block h-4 w-4 transform bg-page-bg transition duration-150 ease-in-out mt-[2px] translate-x-5" />
                    </button>
                  </div>

                  <div className="text-xs sm:text-sm text-text-dim font-light pl-6 sm:pl-7 space-y-1.5">
                    <p>
                      {t(
                        "cookie_cat_necessary_desc",
                        "Забезпечують базові технічні функції сайту: безпеку сесії користувача, захист від спаму, запам'ятовування теми оформлення (світла/темна) та збереження індивідуальних налаштувань панелі цифрової доступності (ДСТУ EN 301 549)."
                      )}
                    </p>
                    <p className="text-[11px] font-mono text-text-dim">
                      Термін зберігання: від сесії до 1 року. Не передаються третім сторонам.
                    </p>
                  </div>
                </div>

                <hr className="border-t border-border-soft" />

                {/* 2. Функціональні */}
                <div id="cookie-cat-functional" className="space-y-3">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2.5">
                      <Sliders className="w-4 h-4 sm:w-5 sm:h-5 text-accent-blue a11y-keep flex-shrink-0" />
                      <h3 className="text-base sm:text-lg font-bold uppercase tracking-tight text-text-main">
                        2. {t("cookie_cat_functional_title", "Функціональні параметри")}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs font-mono font-bold uppercase text-text-dim hidden sm:inline">
                        {draftPrefs.functional
                          ? t("cookie_status_on", "Вкл")
                          : t("cookie_status_off", "Викл")}
                      </span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={draftPrefs.functional}
                        onClick={() => handleToggle("functional")}
                        aria-label={t("cookie_cat_functional_aria", "Перемикач функціональних cookie")}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer border-2 border-border-main transition-colors focus-ring ${
                          draftPrefs.functional ? "bg-accent-blue" : "bg-surface-mut"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform bg-page-bg transition duration-150 ease-in-out mt-[2px] ${
                            draftPrefs.functional ? "translate-x-5" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="text-xs sm:text-sm text-text-dim font-light pl-6 sm:pl-7 space-y-1.5">
                    <p>
                      {t(
                        "cookie_cat_functional_desc",
                        "Дозволяють запам'ятати обрану мовну версію сайту (UA / EN / DE / PL), активні фільтри перегляду проєктів, викладачів та обрані навчальні курси для зручної навігації при наступних візитах."
                      )}
                    </p>
                    <p className="text-[11px] font-mono text-text-dim">
                      Термін зберігання: 6 місяців.
                    </p>
                  </div>
                </div>

                <hr className="border-t border-border-soft" />

                {/* 3. Аналітичні */}
                <div id="cookie-cat-analytics" className="space-y-3">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2.5">
                      <BarChart2 className="w-4 h-4 sm:w-5 sm:h-5 text-accent-blue a11y-keep flex-shrink-0" />
                      <h3 className="text-base sm:text-lg font-bold uppercase tracking-tight text-text-main">
                        3. {t("cookie_cat_analytics_title", "Аналітичні метрики")}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs font-mono font-bold uppercase text-text-dim hidden sm:inline">
                        {draftPrefs.analytics
                          ? t("cookie_status_on", "Вкл")
                          : t("cookie_status_off", "Викл")}
                      </span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={draftPrefs.analytics}
                        onClick={() => handleToggle("analytics")}
                        aria-label={t("cookie_cat_analytics_aria", "Перемикач аналітичних cookie")}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer border-2 border-border-main transition-colors focus-ring ${
                          draftPrefs.analytics ? "bg-accent-blue" : "bg-surface-mut"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform bg-page-bg transition duration-150 ease-in-out mt-[2px] ${
                            draftPrefs.analytics ? "translate-x-5" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="text-xs sm:text-sm text-text-dim font-light pl-6 sm:pl-7 space-y-1.5">
                    <p>
                      {t(
                        "cookie_cat_analytics_desc",
                        "Збирають виключно знеособлену статистику відвідувань окремих сторінок вебресурсу без ідентифікації особи. Використовуються адміністрацією кафедри для оптимізації структури навчальних матеріалів."
                      )}
                    </p>
                    <p className="text-[11px] font-mono text-text-dim">
                      Анонімізовані дані IP-адреси згідно з GDPR / ePrivacy.
                    </p>
                  </div>
                </div>

                <hr className="border-t border-border-soft" />

                {/* 4. Мультимедійні */}
                <div id="cookie-cat-multimedia" className="space-y-3">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2.5">
                      <Video className="w-4 h-4 sm:w-5 sm:h-5 text-accent-blue a11y-keep flex-shrink-0" />
                      <h3 className="text-base sm:text-lg font-bold uppercase tracking-tight text-text-main">
                        4. {t("cookie_cat_multimedia_title", "Мультимедіа та зовнішні сервіси")}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs font-mono font-bold uppercase text-text-dim hidden sm:inline">
                        {draftPrefs.multimedia
                          ? t("cookie_status_on", "Вкл")
                          : t("cookie_status_off", "Викл")}
                      </span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={draftPrefs.multimedia}
                        onClick={() => handleToggle("multimedia")}
                        aria-label={t("cookie_cat_multimedia_aria", "Перемикач мультимедійних cookie")}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer border-2 border-border-main transition-colors focus-ring ${
                          draftPrefs.multimedia ? "bg-accent-blue" : "bg-surface-mut"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform bg-page-bg transition duration-150 ease-in-out mt-[2px] ${
                            draftPrefs.multimedia ? "translate-x-5" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="text-xs sm:text-sm text-text-dim font-light pl-6 sm:pl-7 space-y-1.5">
                    <p>
                      {t(
                        "cookie_cat_multimedia_desc",
                        "Необхідні для коректного показу вбудованих презентацій проєктів, інтерактивних мап навчальних аудиторій та відеоматеріалів кафедр (YouTube, Vimeo)."
                      )}
                    </p>
                    <p className="text-[11px] font-mono text-text-dim">
                      Активуються лише при перегляді сторінок з мультимедійним контентом.
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 sm:p-5 border-t-2 border-border-main bg-page-bg flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={acceptNecessaryOnly}
                  className="text-xs font-mono uppercase underline underline-offset-4 text-text-dim hover:text-text-main py-1.5 transition-colors focus-ring text-left"
                >
                  {t("cookie_btn_necessary_only", "Лише необхідні")}
                </button>

                <div className="flex items-center gap-2.5 justify-end">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="px-4 py-2.5 border-2 border-border-main bg-surface-main text-text-main font-mono text-xs uppercase font-bold hover:bg-surface-mut active:scale-[0.98] transition-all focus-ring flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4 text-accent-blue" />
                    <span>{t("cookie_btn_save", "Зберегти вибір")}</span>
                  </button>
                  <button
                    type="button"
                    onClick={acceptAll}
                    className="px-6 py-2.5 bg-text-main text-page-bg font-bold uppercase tracking-widest text-xs hover:opacity-90 active:scale-[0.98] transition-all focus-ring text-center"
                  >
                    {t("cookie_btn_accept_all", "Прийняти всі")}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
