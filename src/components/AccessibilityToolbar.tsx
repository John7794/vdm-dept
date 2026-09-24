import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Type,
  Eye,
  Volume2,
  VolumeX,
  Image,
  ImageOff,
  Underline,
  RotateCcw,
  Check,
  Play,
  Square,
  Loader2,
} from "lucide-react";
import { useAccessibility, FontSize, ContrastMode } from "../contexts/AccessibilityContext";
import { useCms } from "../contexts/CmsContext";

export default function AccessibilityToolbar() {
  const { t } = useCms();
  const {
    isOpen,
    setIsOpen,
    settings,
    setFontSize,
    setContrast,
    toggleLetterSpacing,
    toggleHideImages,
    toggleHighlightLinks,
    toggleSpeech,
    resetSettings,
    isCustomized,
    isSpeaking,
    isLoadingAudio,
    activeSpeechText,
    speakText,
    stopSpeech,
    clearActiveSpeech,
    playTestAudio,
    stopTestAudio,
    isPlayingTestAudio,
  } = useAccessibility();

  const handleTestSpeech = () => {
    playTestAudio(
      t(
        "a11y_speech_sample",
        "Озвучування тексту працює. Виділіть будь-який фрагмент тексту на сайті для прослуховування."
      )
    );
  };

  // Only show player when text is actively selected and speech mode is on
  const shouldShowFloatingBar = Boolean(activeSpeechText) && settings.speechEnabled;

  return (
    <>
      {/* 1. Modal Accessibility Configuration Panel */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 sm:p-6 md:p-10 bg-black/60 backdrop-blur-sm overflow-y-auto">
            {/* Backdrop click to close */}
            <div
              className="absolute inset-0"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="a11y-title"
              data-a11y-toolbar="true"
              className="relative w-full max-w-2xl bg-surface-main text-text-main border-2 border-border-main shadow-2xl p-6 sm:p-8 rounded-none my-auto z-10"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b-2 border-border-main pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-text-main text-page-bg">
                    <Eye className="w-5 h-5 a11y-keep" />
                  </div>
                  <div>
                    <h2 id="a11y-title" className="text-xl font-bold uppercase tracking-tight">
                      {t("a11y_title", "Панель доступності")}
                    </h2>
                    <p className="text-xs text-text-dim font-mono uppercase tracking-wider">
                      {t("a11y_subtitle", "ДСТУ EN 301 549:2022 / WCAG 2.1 (Версія для осіб з порушеннями зору)")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 border-2 border-transparent hover:border-border-main transition-colors focus-ring outline-none"
                  aria-label={t("a11y_close", "Закрити панель доступності")}
                >
                  <X className="w-6 h-6 a11y-keep" />
                </button>
              </div>

              <div className="space-y-6">
                {/* 1. Розмір шрифту */}
                <div>
                  <label className="font-mono text-xs uppercase tracking-widest text-text-dim block mb-3 font-bold">
                    {t("a11y_sec1_title", "1. Розмір шрифту (Масштабування тексту)")}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "normal", label: "A", sub: t("a11y_font_normal", "100% (Звичайний)") },
                      { id: "large", label: "A+", sub: t("a11y_font_large", "115% (Збільшений)") },
                      { id: "xlarge", label: "A++", sub: t("a11y_font_xlarge", "130% (Великий)") },
                    ].map((item) => {
                      const isActive = settings.fontSize === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setFontSize(item.id as FontSize)}
                          className={`p-3 border-2 transition-all flex flex-col items-center justify-center gap-1 focus-ring ${
                            isActive
                              ? "bg-text-main text-page-bg border-text-main font-bold"
                              : "border-border-main hover:bg-surface-mut"
                          }`}
                          aria-pressed={isActive}
                        >
                          <span className="text-lg font-bold">{item.label}</span>
                          <span className="text-[10px] font-mono uppercase tracking-wider">{item.sub}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Контраст та колірна схема */}
                <div>
                  <label className="font-mono text-xs uppercase tracking-widest text-text-dim block mb-3 font-bold">
                    {t("a11y_sec2_title", "2. Контрастність та колірна схема")}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      {
                        id: "normal",
                        label: t("a11y_contrast_normal", "Стандартна"),
                        bg: "bg-surface-main text-text-main border-border-main",
                      },
                      {
                        id: "high",
                        label: t("a11y_contrast_high", "Високий контраст"),
                        bg: "bg-white text-black border-black",
                      },
                      {
                        id: "yellow-black",
                        label: t("a11y_contrast_yellow_black", "Жовтий на чорному"),
                        bg: "bg-black text-[#FFFF00] border-[#FFFF00]",
                      },
                      {
                        id: "blue-white",
                        label: t("a11y_contrast_blue_white", "Синій на білому"),
                        bg: "bg-[#E8F4F8] text-[#0A2540] border-[#0A2540]",
                      },
                      {
                        id: "mono",
                        label: t("a11y_contrast_mono", "Монохром"),
                        bg: "bg-[#777777] text-white border-white",
                      },
                    ].map((mode) => {
                      const isActive = settings.contrast === mode.id;
                      return (
                        <button
                          key={mode.id}
                          onClick={() => setContrast(mode.id as ContrastMode)}
                          className={`p-3 border-2 text-xs font-bold uppercase transition-all flex items-center justify-between gap-2 focus-ring ${mode.bg} ${
                            isActive ? "ring-2 ring-accent-blue font-extrabold" : ""
                          }`}
                          aria-pressed={isActive}
                        >
                          <span>{mode.label}</span>
                          {isActive && <Check className="w-4 h-4 a11y-keep" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Додаткові налаштування сприйняття */}
                <div>
                  <label className="font-mono text-xs uppercase tracking-widest text-text-dim block mb-3 font-bold">
                    {t("a11y_sec3_title", "3. Параметри читабельності та відображення")}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Інтервал */}
                    <button
                      onClick={toggleLetterSpacing}
                      className={`p-3 border-2 flex items-center justify-between gap-3 text-xs uppercase font-bold transition-all focus-ring ${
                        settings.letterSpacing
                          ? "bg-text-main text-page-bg border-text-main"
                          : "border-border-main hover:bg-surface-mut"
                      }`}
                      aria-pressed={settings.letterSpacing}
                    >
                      <div className="flex items-center gap-2">
                        <Type className="w-4 h-4 a11y-keep" />
                        <span>{t("a11y_opt_spacing", "Збільшений інтервал")}</span>
                      </div>
                      {settings.letterSpacing ? (
                        <span className="text-[10px] font-mono">{t("a11y_status_on", "УВІМК")}</span>
                      ) : (
                        <span className="text-[10px] font-mono text-text-dim">{t("a11y_status_off", "ВИМК")}</span>
                      )}
                    </button>

                    {/* Підкреслення посилань */}
                    <button
                      onClick={toggleHighlightLinks}
                      className={`p-3 border-2 flex items-center justify-between gap-3 text-xs uppercase font-bold transition-all focus-ring ${
                        settings.highlightLinks
                          ? "bg-text-main text-page-bg border-text-main"
                          : "border-border-main hover:bg-surface-mut"
                      }`}
                      aria-pressed={settings.highlightLinks}
                    >
                      <div className="flex items-center gap-2">
                        <Underline className="w-4 h-4 a11y-keep" />
                        <span>{t("a11y_opt_links", "Підкреслити посилання")}</span>
                      </div>
                      {settings.highlightLinks ? (
                        <span className="text-[10px] font-mono">{t("a11y_status_on", "УВІМК")}</span>
                      ) : (
                        <span className="text-[10px] font-mono text-text-dim">{t("a11y_status_off", "ВИМК")}</span>
                      )}
                    </button>

                    {/* Приховати зображення */}
                    <button
                      onClick={toggleHideImages}
                      className={`p-3 border-2 flex items-center justify-between gap-3 text-xs uppercase font-bold transition-all focus-ring ${
                        settings.hideImages
                          ? "bg-text-main text-page-bg border-text-main"
                          : "border-border-main hover:bg-surface-mut"
                      }`}
                      aria-pressed={settings.hideImages}
                    >
                      <div className="flex items-center gap-2">
                        {settings.hideImages ? (
                          <ImageOff className="w-4 h-4 a11y-keep" />
                        ) : (
                          <Image className="w-4 h-4 a11y-keep" />
                        )}
                        <span>{t("a11y_opt_images", "Приховати зображення")}</span>
                      </div>
                      {settings.hideImages ? (
                        <span className="text-[10px] font-mono">{t("a11y_status_hidden", "СХОВАНО")}</span>
                      ) : (
                        <span className="text-[10px] font-mono text-text-dim">{t("a11y_status_visible", "ВИДИМІ")}</span>
                      )}
                    </button>

                    {/* Синтез голосу */}
                    <button
                      onClick={toggleSpeech}
                      className={`p-3 border-2 flex items-center justify-between gap-3 text-xs uppercase font-bold transition-all focus-ring ${
                        settings.speechEnabled
                          ? "bg-text-main text-page-bg border-text-main"
                          : "border-border-main hover:bg-surface-mut"
                      }`}
                      aria-pressed={settings.speechEnabled}
                    >
                      <div className="flex items-center gap-2">
                        {settings.speechEnabled ? (
                          <Volume2 className="w-4 h-4 a11y-keep" />
                        ) : (
                          <VolumeX className="w-4 h-4 a11y-keep" />
                        )}
                        <span>{t("a11y_opt_speech", "Озвучування тексту")}</span>
                      </div>
                      {settings.speechEnabled ? (
                        <span className="text-[10px] font-mono">{t("a11y_status_active", "АКТИВНО")}</span>
                      ) : (
                        <span className="text-[10px] font-mono text-text-dim">{t("a11y_status_off", "ВИМК")}</span>
                      )}
                    </button>
                  </div>

                  {/* Speech status & instant test button */}
                  {settings.speechEnabled && (
                    <div className="mt-3 p-3.5 bg-surface-mut/50 border-2 border-border-main space-y-2.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div className="flex items-center gap-2 text-xs font-mono">
                          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                          <span className="font-bold text-text-main">
                            {t("a11y_voice_online_ok", "Українське онлайн-озвучування (HD)")}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={handleTestSpeech}
                          className={`inline-flex items-center justify-center gap-2 px-3.5 py-1.5 text-xs font-mono uppercase font-bold transition-all focus-ring ${
                            isPlayingTestAudio
                              ? "bg-accent-blue text-white ring-2 ring-accent-blue"
                              : "bg-text-main text-page-bg hover:opacity-90"
                          }`}
                          title={isPlayingTestAudio ? t("a11y_btn_stop_test", "Зупинити тестовий зразок") : t("a11y_btn_test_speech", "Прослухати тестовий зразок")}
                        >
                          {isPlayingTestAudio ? (
                            <>
                              <Volume2 className="w-3.5 h-3.5 animate-pulse text-white" />
                              <span>{t("a11y_btn_testing_speech", "Відтворення зразка...")}</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5 a11y-keep" />
                              <span>{t("a11y_btn_test_speech", "Прослухати тестовий зразок")}</span>
                            </>
                          )}
                        </button>
                      </div>

                      <p className="text-xs font-mono text-text-dim leading-relaxed">
                        {t(
                          "a11y_speech_hint",
                          "* Виділіть курсором або клавіатурою (Shift+стрілки) будь-який фрагмент тексту на сторінці — система автоматично озвучить його."
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Controls */}
              <div className="mt-8 pt-4 border-t-2 border-border-main flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={resetSettings}
                  disabled={!isCustomized}
                  className="w-full sm:w-auto px-4 py-3 border-2 border-border-main font-mono text-xs uppercase tracking-wider font-bold hover:bg-surface-mut disabled:opacity-40 disabled:hover:bg-transparent flex items-center justify-center gap-2 transition-colors focus-ring"
                >
                  <RotateCcw className="w-4 h-4 a11y-keep" />
                  {t("a11y_btn_reset", "Скинути налаштування")}
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full sm:w-auto px-6 py-3 bg-text-main text-page-bg font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity focus-ring"
                >
                  {t("a11y_btn_apply", "Застосувати і закрити")}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Floating Speech Player / Action Bar for Selected Text */}
      <AnimatePresence>
        {shouldShowFloatingBar && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            role="region"
            data-a11y-toolbar="true"
            aria-label={t("a11y_speech_player_aria", "Панель озвучування виділеного тексту")}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md bg-surface-main text-text-main border-2 border-border-main shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.8)] p-2.5 sm:p-3 flex items-center justify-between gap-3 text-xs font-sans"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`p-2 ${
                  isSpeaking
                    ? "bg-accent-blue text-white animate-pulse"
                    : isLoadingAudio
                    ? "bg-accent-yellow text-black"
                    : "bg-text-main text-page-bg"
                } flex-shrink-0 transition-colors`}
              >
                {isLoadingAudio ? (
                  <Loader2 className="w-4 h-4 animate-spin a11y-keep" />
                ) : (
                  <Volume2 className="w-4 h-4 a11y-keep" />
                )}
              </div>

              <div className="min-w-0">
                {activeSpeechText ? (
                  <>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-text-dim block uppercase font-bold leading-tight truncate">
                        {isSpeaking
                          ? t("a11y_speaking_now", "Озвучується:")
                          : isLoadingAudio
                          ? t("a11y_loading_audio", "Завантаження звуку...")
                          : t("a11y_selected_text", "Виділено для читання:")}
                      </span>
                      <span className="hidden sm:inline-block text-[9px] font-mono text-text-dim/80 border border-border-soft px-1 rounded">
                        ESC = Стоп
                      </span>
                    </div>
                    <p className="text-xs font-bold text-text-main truncate max-w-[170px] sm:max-w-[230px]">
                      «{activeSpeechText}»
                    </p>
                  </>
                ) : (
                  <>
                    <span className="text-[10px] font-mono text-text-dim block uppercase font-bold leading-tight">
                      {t("a11y_speech_ready", "Озвучування активне")}
                    </span>
                    <p className="text-[11px] text-text-main truncate">
                      {t("a11y_select_prompt", "Виділіть будь-який текст на сторінці")}
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              {activeSpeechText && (
                <>
                  {isSpeaking || isLoadingAudio ? (
                    <button
                      type="button"
                      onClick={stopSpeech}
                      title={t("a11y_btn_stop_hint", "Зупинити аудіопрогравання (Esc)")}
                      aria-label={t("a11y_btn_stop", "Зупинити озвучування")}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-bold uppercase transition-colors flex items-center gap-1.5 focus-ring shadow-sm"
                    >
                      <Square className="w-3 h-3 fill-current text-white" />
                      <span>{t("a11y_btn_stop", "Стоп")}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        if (!settings.speechEnabled) {
                          toggleSpeech();
                        }
                        speakText(activeSpeechText);
                      }}
                      title={t("a11y_btn_replay", "Озвучити виділений текст")}
                      aria-label={t("a11y_btn_replay", "Озвучити виділений текст")}
                      className="px-3 py-1.5 bg-text-main text-page-bg font-mono text-xs font-bold uppercase hover:opacity-90 transition-opacity flex items-center gap-1.5 focus-ring"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>{t("a11y_btn_replay", "Слухати")}</span>
                    </button>
                  )}
                </>
              )}

              <button
                type="button"
                onClick={clearActiveSpeech}
                title={t("a11y_btn_dismiss", "Приховати та зняти виділення")}
                aria-label={t("a11y_btn_dismiss", "Приховати панель")}
                className="p-1.5 text-text-dim hover:text-text-main hover:bg-surface-mut border border-transparent hover:border-border-main transition-colors focus-ring"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
