import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { Play, Sparkles, BookOpen, Layers, Monitor, Palette, Building, Eye, Instagram, ArrowUpRight, Film } from "lucide-react";
import { useTheme } from "../components/ThemeProvider";
import { useCms } from "../contexts/CmsContext";
import { formatDriveLink, parseVideoUrl } from "../lib/utils";

interface DirectionItem {
  code: string;
  title: string;
  items: { subCode: string; text: string }[];
  icon: any;
}

const PROGRAM_DIRECTIONS: DirectionItem[] = [
  {
    code: "01",
    title: "КОРПОРАТИВНИЙ ІДЕНТИФІКАЦІЙНИЙ ДИЗАЙН",
    icon: Layers,
    items: [
      {
        subCode: "1.1",
        text: "Логотип, брендинг, айдентика. Системи ідентифікації для виробництв, організацій, масових заходів (економічних, культурних, соціальних). Упаковка і тара."
      },
      {
        subCode: "1.2",
        text: "Предметний дизайн рекламно-інформаційних стендів, як носіїв ідеології бренду та корпоративної ідентифікації. Корпоративний дизайн предметів обладнання екстер’єрів та інтер’єрів комерційних підприємств, який відповідає загальному візуальному образу айдентики, з усіма її графічними елементами комунікації."
      },
      {
        subCode: "1.3",
        text: "Візуальна ідентичність територій, що охоплює створення єдиного ідентифікаційного образу для міст, районів тощо, що відображає їх унікальність, культурне надбання, цінності та атмосферу. Включає символіку та мистецькі твори у середовищі."
      }
    ]
  },
  {
    code: "02",
    title: "РЕКЛАМНІ ТА МАРКЕТИНГОВІ ВІЗУАЛЬНІ КОМУНІКАЦІЇ",
    icon: Sparkles,
    items: [
      {
        subCode: "2.1",
        text: "Поліграфічна рекламна продукція: друковані видання, афіші, флаєри, буклети."
      },
      {
        subCode: "2.2",
        text: "Зовнішня реклама білбордів, сітілайтів, вивісок, світлових коробів, об’ємних фірмових знаків та логотипів для міського дизайну та для просторів інтер’єрів громадських споруд. Предметний дизайн експозиційного обладнання для виставок та ярмарок у комерційній та в соціальній сферах діяльності, як частина завдань з рекламного дизайну. Предметний та предметно-просторовий дизайн вітрин та навколовітринного середовища в торгових просторах, як складова загальної рекламної ідеї."
      },
      {
        subCode: "2.3",
        text: "Реклама у цифровому середовищі (банери, креативи, публікації у соцмережах, рекламна анімація та відеографіка)."
      }
    ]
  },
  {
    code: "03",
    title: "ДИЗАЙН ГРАФІЧНИХ ЗНАКОВИХ СИСТЕМ ДЛЯ ПРЕДМЕТНО-ПРОСТОРОВОГО СЕРЕДОВИЩА ТА ПРОМИСЛОВИХ ВИРОБІВ",
    icon: Eye,
    items: [
      {
        subCode: "3.1",
        text: "Дизайн графічних інформаційних знакових систем. Графічна навігація в середовищі. Піктограми і символи для громадських просторів. Знаки безпеки та інформаційні елементи для предметно-просторового середовища. Інфографіка."
      },
      {
        subCode: "3.2",
        text: "Маркування для промислових виробів, графічні інструкції, логотипи та візуальні елементи для промислових виробів (упаковки, маркування). Знаково-образні системи візуальної комунікації та предметний дизайн як їх складова для соціальних та комерційних подій (перформанси, фестивалі, фан-зони, флеш-моби)."
      }
    ]
  },
  {
    code: "04",
    title: "МУЛЬТИМЕДІЙНІ ЦИФРОВІ ТВОРИ",
    icon: Play,
    items: [
      {
        subCode: "4.1",
        text: "Анімація та відеографіка. Рекламні ролики, графічна анімація для соціальних мереж, мобільних додатків та вебсайтів."
      },
      {
        subCode: "4.2",
        text: "Інтерактивний дизайн. Концептуальні візуалізації для відеоігор (сцени, персонажі, анімація)."
      },
      {
        subCode: "4.3",
        text: "Проекційний меппінг, інсталяції для подій, концертів чи фестивалів. Цифровий стріт-арт, анімації для проєкційні шоу на будівлях чи в інтер’єрах (віджеїнг)."
      }
    ]
  },
  {
    code: "05",
    title: "ВЕБДИЗАЙН",
    icon: Monitor,
    items: [
      {
        subCode: "5.1",
        text: "Розробка користувацьких інтерфейсів (UI/UX-дизайн). Створення зручної навігації, інтуїтивних меню та адаптивних макетів."
      },
      {
        subCode: "5.2",
        text: "Розробка макетів для корпоративних, освітніх чи комерційних сайтів. Проєктування сайтів для різних пристроїв: комп’ютерів, планшетів, смартфонів."
      }
    ]
  },
  {
    code: "06",
    title: "ДИЗАЙН МІСЬКОГО СЕРЕДОВИЩА В КОНТЕКСТІ КОНЦЕПТУАЛЬНОГО ВІЗУАЛЬНОГО МИСТЕЦТВА СТРІТ-АРТУ",
    icon: Building,
    items: [
      {
        subCode: "6.1",
        text: "Мурали та графіті для забезпечення оптимальної комунікації засобами графічного дизайну у сфері соціальних комунікацій. Розробка великих настінних композицій, що інтегруються в архітектуру міста. Художнє переосмислення занедбаних або стандартних міських локацій. Концептуальна скульптура та 3d-об’єкти, інтегровані у громадські простори (парки, площі)."
      },
      {
        subCode: "6.2",
        text: "Концептуальне візуальне мистецтво. Публічні інсталяції. Тимчасові арт-об’єкти, які взаємодіють із простором і глядачами як елементи ідентифікації та рекламного дизайну."
      }
    ]
  },
  {
    code: "07",
    title: "ДИЗАЙН ДРУКОВАНИХ ВИДАНЬ ТА ІЛЮСТРАЦІЯ",
    icon: BookOpen,
    items: [
      {
        subCode: "7.1",
        text: "Дизайн журналів, книг, газет, постерів, концепція, верстка, макетування."
      },
      {
        subCode: "7.2",
        text: "Ілюстрація для книг (друкованих та цифрових), обкладинок, плакатів, коміксів."
      },
      {
        subCode: "7.3",
        text: "Артбук як форма візуальної експресії та експериментального дизайну. Комбінування тексту, ілюстрації, фотографії, ручних технік і цифрових технологій для створення концептуальних видань."
      }
    ]
  }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { theme } = useTheme();
  const { data, t } = useCms();

  const defaultSlides = [
    "https://drive.google.com/uc?export=view&id=1n7JNFmicxCNLEm0_AFB_-hg5258z7YmG",
    "https://drive.google.com/uc?export=view&id=11dYw0FRts0F248vo_de-BLW1QTUgPZVP",
    "https://drive.google.com/uc?export=view&id=1i0qE12_3C4i-QTjAfvt7fTTfViiz4I9a"
  ];

  const cmsBanners = (data?.multimedia || [])
    .filter((item: any) => {
      const url = (item.Image || item.image || item.img || item.Media || item.media || item.Url || item.url || "").trim();
      return item.Category === "HeroBanner" && url !== "";
    })
    .map((item: any) => {
      const url = (item.Image || item.image || item.img || item.Media || item.media || item.Url || item.url || "").trim();
      return formatDriveLink(url);
    })
    .filter((url: string) => url !== "");

  const baseSlides = cmsBanners.length > 0 ? cmsBanners : defaultSlides;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => prev + 1);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slideIndex = currentSlide % baseSlides.length;
  const directionType = currentSlide % 4;

  const variants = {
    enter: (direction: number) => {
      switch (direction) {
        case 0: return { x: "100%", y: 0 };
        case 1: return { x: 0, y: "100%" };
        case 2: return { x: "-100%", y: 0 };
        case 3: return { x: 0, y: "-100%" };
        default: return { x: "100%", y: 0 };
      }
    },
    center: { x: 0, y: 0, zIndex: 1 },
    exit: (direction: number) => {
      switch (direction) {
        case 0: return { x: "-100%", y: 0, zIndex: 0 };
        case 1: return { x: 0, y: "-100%", zIndex: 0 };
        case 2: return { x: "100%", y: 0, zIndex: 0 };
        case 3: return { x: 0, y: "100%", zIndex: 0 };
        default: return { x: "-100%", y: 0, zIndex: 0 };
      }
    }
  };

  // Video embed item if configured in Multimedia or state
  const promoVideoItem = (data?.multimedia || []).find((m: any) => m.Category === "StudyVideo" || m.Category === "PromoVideo");
  const promoVideoUrl = promoVideoItem ? (promoVideoItem.Link || promoVideoItem.link || promoVideoItem.Url || promoVideoItem.url || promoVideoItem.Media || promoVideoItem.media) : null;
  const activeVideoUrl = (promoVideoUrl && String(promoVideoUrl).trim() !== "") ? String(promoVideoUrl).trim() : "https://www.instagram.com/p/DePJa6UIT62/";
  const videoData = parseVideoUrl(activeVideoUrl);

  return (
    <div className="flex flex-col w-full bg-page-bg">
      {/* 1. Hero Section - Stencil Text Mask with Dynamic Kinetic Background */}
      <section className="relative flex flex-col w-full border-b-2 border-border-main overflow-hidden bg-page-bg">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <AnimatePresence initial={false} custom={directionType}>
            <motion.div
              key={currentSlide}
              custom={directionType}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 1.2, ease: [0.25, 1, 0.25, 1] }}
              className="absolute inset-0 w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${baseSlides[slideIndex]})` }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-accent-blue/10 pointer-events-none mix-blend-overlay"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent-blue/20 blur-[100px] rounded-full z-[1]"></div>
        </div>

        {/* The Stencil Overlay Layer */}
        <div 
          className={`relative z-10 flex flex-col lg:grid lg:grid-cols-12 min-h-[calc(100vh-80px)] lg:min-h-[85vh] pointer-events-none lg:divide-x-2 divide-border-main transition-colors duration-500
            ${theme === "dark" ? "mix-blend-multiply" : "mix-blend-screen"}`}
        >
          <div 
            className={`flex-none lg:col-span-8 p-6 md:p-12 lg:p-16 flex flex-col justify-start transition-colors duration-500 
              ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}
          >
            <div className="mt-12 md:mt-24">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={`text-[clamp(2.5rem,7vw,7.5rem)] font-bold leading-[0.85] tracking-[-0.04em] uppercase text-balance whitespace-pre-line break-words hyphens-auto 
                  ${theme === "dark" ? "text-white" : "text-black"}`}
              >
                {t("home_hero_title", "Візуальний Дизайн\nі Мистецтво.")}
              </motion.h1>
            </div>
          </div>

          <div 
            className={`flex-1 lg:col-span-4 min-h-[350px] lg:min-h-full transition-colors duration-500 
              ${theme === "dark" ? "bg-white" : "bg-black"}`}
          >
          </div>
        </div>

        {/* Crisp border and selectable text layer for accessibility */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="flex flex-col lg:grid lg:grid-cols-12 w-full h-full min-h-[calc(100vh-80px)] lg:min-h-[85vh]">
            <div className="flex-none lg:col-span-8 p-6 md:p-12 lg:p-16 flex flex-col justify-start pointer-events-auto">
              <div className="mt-12 md:mt-24">
                <h2 
                  className="text-[clamp(2.5rem,7vw,7.5rem)] font-bold leading-[0.85] tracking-[-0.04em] uppercase text-transparent select-text whitespace-pre-line break-words hyphens-auto"
                  aria-hidden="true"
                >
                  {t("home_hero_title", "Візуальний Дизайн\nі Мистецтво.")}
                </h2>
              </div>
            </div>
            <div className="flex-1 lg:col-span-4 border-t-2 lg:border-t-0 lg:border-l-2 border-border-main"></div>
          </div>
        </div>
      </section>

      {/* 2. Typographic Manifesto Block */}
      <section className="w-full border-b-2 border-border-main bg-surface-main py-16 md:py-24 px-6 md:px-12 lg:px-20 relative">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-text-main text-page-bg font-mono text-xs uppercase tracking-widest font-bold mb-8">
            <span className="w-2 h-2 rounded-full bg-accent-yellow animate-pulse"></span>
            <span>{t("home_manifesto_badge", "Маніфест кафедри")}</span>
          </div>

          <p className="text-xl md:text-3xl lg:text-[2.25rem] font-bold tracking-tight leading-[1.3] text-text-main text-balance select-text border-l-4 border-accent-blue pl-6 md:pl-10">
            {t(
              "home_manifesto_text",
              "Ми — кафедра візуального дизайну і мистецтва — команда дизайнерів, митців і дослідників, творча майстерня та інтелектуальний колектив, об’єднаний спільною метою: формувати покоління професіоналів, здатних перетворювати ідеї на потужні візуальні повідомлення. Дизайн-програма ВДМ експериментує з різними формами комунікації, з метою створити нову візуальну мову, яка резонує з сучасним суспільством та сповідує ідеали національного самовираження. Ми віримо, що дизайн і мистецтво мають трансформативний потенціал впливати на світ, а унікальність кожного студента - це рушійна сила для суспільних і культурних змін."
            )}
          </p>
        </div>
      </section>

      {/* 3. Primary Curriculum Directions (Основні напрями навчальної програми) */}
      <section className="w-full border-b-2 border-border-main bg-page-bg">
        {/* Section Header */}
        <div className="border-b-2 border-border-main p-6 md:p-12 lg:px-20 bg-surface-mut flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="font-mono text-xs text-text-dim block mb-3 uppercase tracking-widest font-bold">
              [ 02 / АКАДЕМІЧНІ НАПРЯМИ ]
            </span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-text-main leading-tight">
              {t("home_curriculum_heading", "Основні напрями навчальної програми")}
            </h2>
          </div>
          <div className="font-mono text-xs text-text-dim uppercase tracking-wider flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-accent-blue rounded-full"></span>
            <span>7 Спеціалізованих векторів</span>
          </div>
        </div>

        {/* Directions List */}
        <div className="divide-y-2 divide-border-main">
          {PROGRAM_DIRECTIONS.map((dir, idx) => {
            const IconComponent = dir.icon;
            return (
              <div 
                key={dir.code}
                className="grid grid-cols-1 lg:grid-cols-12 divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-border-main hover:bg-surface-mut/60 transition-colors group"
              >
                {/* Left Column: Number & Title */}
                <div className="lg:col-span-5 p-6 md:p-10 lg:p-12 flex flex-col justify-between bg-surface-main/40">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-mono text-2xl md:text-3xl font-extrabold text-accent-blue tracking-tighter">
                        {dir.code}.
                      </span>
                      <div className="p-2.5 rounded-none bg-surface-mut border border-border-main text-text-main group-hover:bg-text-main group-hover:text-page-bg transition-colors">
                        <IconComponent className="w-5 h-5 a11y-keep" />
                      </div>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-text-main leading-tight">
                      {dir.title}
                    </h3>
                  </div>
                  
                  <div className="hidden lg:block pt-8 font-mono text-[11px] uppercase tracking-widest text-text-dim">
                    {dir.items.length} {dir.items.length === 1 ? "спеціалізація" : dir.items.length < 5 ? "спеціалізації" : "спеціалізацій"}
                  </div>
                </div>

                {/* Right Column: Detailed Sub-items */}
                <div className="lg:col-span-7 p-6 md:p-10 lg:p-12 space-y-6 flex flex-col justify-center bg-page-bg">
                  {dir.items.map((subItem) => (
                    <div 
                      key={subItem.subCode} 
                      className="flex items-start gap-4 p-4 border border-border-soft bg-surface-main hover:border-border-main transition-colors"
                    >
                      <span className="font-mono text-xs md:text-sm font-bold text-accent-blue bg-accent-blue/10 px-2 py-1 rounded shrink-0 border border-accent-blue/20">
                        {subItem.subCode}
                      </span>
                      <p className="text-sm md:text-base text-text-main font-light leading-relaxed">
                        {subItem.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Video Showcase Section (Відео про навчання на кафедрі) */}
      <section className="w-full border-b-2 border-border-main bg-surface-main p-6 md:p-12 lg:p-20">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-2 border-border-main pb-6">
            <div>
              <span className="font-mono text-xs text-text-dim block mb-2 uppercase tracking-widest font-bold">
                [ 03 / ВІДЕОМАТЕРІАЛИ КАФЕДРИ ]
              </span>
              <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-text-main">
                {t("home_video_heading", "Відео про навчання на кафедрі")}
              </h2>
            </div>
            <p className="text-xs font-mono text-text-dim max-w-sm">
              * Атмосфера лекцій, творчих лабораторій, студентських проєктів та захистів дипломних робіт.
            </p>
          </div>

          {/* Video Container Frame */}
          {videoData?.type === "instagram" ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-surface-mut/40 border-2 border-border-main p-6 md:p-10 lg:p-12">
              <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-blue/10 border border-accent-blue/30 text-accent-blue font-mono text-xs font-bold uppercase tracking-wider">
                    <Film className="w-3.5 h-3.5" />
                    <span>{t("home_video_badge", "Творчий процес ВДМ")}</span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-text-main leading-tight">
                    {t("home_video_card_title", "Життя та навчання на кафедрі")}
                  </h3>
                  <p className="text-base text-text-main font-light leading-relaxed">
                    {t("home_video_card_desc", "Динамічний ритм життя кафедри: від пошуку ідей та роботи в творчих майстернях до захисту авторських дизайн-проєктів. Пориньте в атмосферу нашої спільноти у короткому відео.")}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex flex-wrap gap-2 text-xs font-mono text-text-dim">
                    <span className="bg-surface-main border border-border-main px-3 py-1 font-bold">🏛 вул. Січових Стрільців, 7</span>
                    <span className="bg-surface-main border border-border-main px-3 py-1 font-bold">🎨 Графічний дизайн & Арт</span>
                    <span className="bg-surface-main border border-border-main px-3 py-1 font-bold">✨ В2.01 Дизайн</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 border-t border-border-main">
                  <a
                    href={videoData.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-text-main text-surface-main px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider hover:bg-accent-blue hover:text-white transition-colors duration-200"
                  >
                    <Instagram className="w-4 h-4" />
                    <span>{t("home_video_btn_ig", "Переглянути в Instagram")}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                  <a
                    href="https://www.instagram.com/vdm_lpnu/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 font-mono text-xs text-text-dim hover:text-text-main underline decoration-accent-blue underline-offset-4 py-2"
                  >
                    <span>@vdm_lpnu</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="lg:col-span-6 flex justify-center">
                <div className="w-full max-w-[420px] border-2 border-border-main bg-black shadow-2xl overflow-hidden">
                  <iframe
                    src={videoData.embedUrl}
                    title="Відео кафедри ВДМ"
                    className="w-full h-[560px] md:h-[620px] border-0 bg-black"
                    scrolling="no"
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  />
                </div>
              </div>
            </div>
          ) : videoData?.type === "youtube" || videoData?.type === "vimeo" ? (
            <div className="relative aspect-video w-full border-2 border-border-main bg-ink shadow-2xl overflow-hidden group">
              <iframe
                src={videoData.embedUrl}
                title="Відео про навчання на кафедрі"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : videoData?.type === "direct" ? (
            <div className="relative aspect-video w-full border-2 border-border-main bg-black shadow-2xl overflow-hidden">
              <video
                src={videoData.embedUrl}
                controls
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="relative aspect-video w-full border-2 border-border-main bg-ink shadow-2xl overflow-hidden group">
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-black via-zinc-900 to-black text-white">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-white/30 flex items-center justify-center mb-6 bg-white/5 backdrop-blur-md group-hover:scale-110 group-hover:border-accent-yellow group-hover:text-accent-yellow transition-all duration-300">
                  <Play className="w-8 h-8 md:w-10 md:h-10 ml-1 fill-current" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold uppercase tracking-wider mb-2">
                  Відеопрезентація кафедри
                </h3>
                <p className="text-xs md:text-sm font-mono text-white/60 max-w-md uppercase tracking-wider">
                  Матеріал готується до публікації. Відео з'явиться тут незабаром.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. Dynamic Marquee Ticker */}
      <div className="border-b-2 border-border-main overflow-hidden bg-surface-mut py-4 flex flex-nowrap whitespace-nowrap">
        <motion.div 
          animate={{ x: [0, -1000] }} 
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="flex font-mono text-sm font-bold uppercase text-text-main"
        >
          {Array(20).fill([t("home_marquee", "ФОРМУЄМО НОВЕ ПОКОЛІННЯ ВІЗУАЛЬНИХ ДИЗАЙНЕРІВ")]).flat().map((text, i) => (
            <span key={i} className="flex items-center">
              <span>{text}</span>
              <span className="w-2 h-2 bg-text-main rounded-full mx-8"></span>
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
