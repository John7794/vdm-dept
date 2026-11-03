import { motion } from "motion/react";
import { Play, Sparkles, BookOpen, Layers, Monitor, Building, Eye, Instagram, ArrowUpRight, Film } from "lucide-react";
import { useCms } from "../contexts/CmsContext";
import SeoHead from "../components/SeoHead";
import { parseVideoUrl } from "../lib/utils";

interface SubItem {
  subCode: string;
  text_UA: string;
  text_EN: string;
  text_DE: string;
  text_PL: string;
}

interface DirectionItem {
  code: string;
  title_UA: string;
  title_EN: string;
  title_DE: string;
  title_PL: string;
  items: SubItem[];
  icon: any;
}

const PROGRAM_DIRECTIONS: DirectionItem[] = [
  {
    code: "01",
    title_UA: "КОРПОРАТИВНИЙ ІДЕНТИФІКАЦІЙНИЙ ДИЗАЙН",
    title_EN: "CORPORATE IDENTITY DESIGN",
    title_DE: "CORPORATE IDENTITY & BRANDING",
    title_PL: "IDENTYFIKACJA WIZUALNA I BRANDING",
    icon: Layers,
    items: [
      {
        subCode: "1.1",
        text_UA: "Логотип, брендинг, айдентика. Системи ідентифікації для виробництв, організацій, масових заходів (економічних, культурних, соціальних). Упаковка і тара.",
        text_EN: "Logo, branding, visual identity. Identification systems for enterprises, organizations, and public events (economic, cultural, social). Packaging and container design.",
        text_DE: "Logoentwicklung, Branding, Corporate Identity. Identifikationssysteme für Unternehmen, Organisationen und Großveranstaltungen. Verpackungsdesign.",
        text_PL: "Logo, branding, identyfikacja wizualna. Systemy identyfikacji dla przedsiębiorstw, organizacji i wydarzeń masowych. Projektowanie opakowań."
      },
      {
        subCode: "1.2",
        text_UA: "Предметний дизайн рекламно-інформаційних стендів, як носіїв ідеології бренду та корпоративної ідентифікації. Корпоративний дизайн предметів обладнання екстер’єрів та інтер’єрів комерційних підприємств, який відповідає загальному візуальному образу айдентики, з усіма її графічними елементами комунікації.",
        text_EN: "Industrial display design for advertising and info stands as brand ideology carriers. Corporate exterior and interior equipment design matching the holistic visual identity.",
        text_DE: "Objektdesign für Werbe- und Informationsstände als Träger der Markenphilosophie. Corporate Design von Ausstattungsgegenständen für Innen- und Außenräume.",
        text_PL: "Wzornictwo stojaków reklamowo-informacyjnych jako nośników ideologii marki. Projektowanie wyposażenia wnętrz i elewacji obiektów komercyjnych w spójności z identyfikacją wizualną."
      },
      {
        subCode: "1.3",
        text_UA: "Візуальна ідентичність територій, що охоплює створення єдиного ідентифікаційного образу для міст, районів тощо, що відображає їх унікальність, культурне надбання, цінності та атмосферу. Включає символіку та мистецькі твори у середовищі.",
        text_EN: "Territorial place branding and visual identity for cities and districts, reflecting their cultural heritage, values, and atmosphere. Includes public environmental art and iconography.",
        text_DE: "Regionales und städtisches Placemaking: Entwicklung einheitlicher Identitäten für Städte und Regionen, die kulturelles Erbe und Werte widerspiegeln.",
        text_PL: "Identyfikacja wizualna miast i regionów: tworzenie spójnego wizerunku odzwierciedlającego dziedzictwo kulturowe, wartości i unikalny charakter."
      }
    ]
  },
  {
    code: "02",
    title_UA: "РЕКЛАМНІ ТА МАРКЕТИНГОВІ ВІЗУАЛЬНІ КОМУНІКАЦІЇ",
    title_EN: "ADVERTISING & MARKETING COMMUNICATIONS",
    title_DE: "WERBE- UND MARKETING-KOMMUNIKATION",
    title_PL: "KOMUNIKACJA REKLAMOWA I MARKETINGOWA",
    icon: Sparkles,
    items: [
      {
        subCode: "2.1",
        text_UA: "Поліграфічна рекламна продукція: друковані видання, афіші, флаєри, буклети.",
        text_EN: "Print advertising collateral: editorial publications, promotional posters, flyers, and brochures.",
        text_DE: "Druckwerbemittel: Printpublikationen, Plakate, Flyer und Broschüren.",
        text_PL: "Poligraficzna produkcja reklamowa: publikacje drukowane, plakaty, ulotki, foldery."
      },
      {
        subCode: "2.2",
        text_UA: "Зовнішня реклама білбордів, сітілайтів, вивісок, світлових коробів, об’ємних фірмових знаків та логотипів для міського дизайну та для просторів інтер’єрів громадських споруд. Предметний дизайн експозиційного обладнання для виставок та ярмарок. Предметний та предметно-просторовий дизайн вітрин та навколовітринного середовища в торгових просторах.",
        text_EN: "Outdoor advertising: billboards, citylights, signage, lightboxes, and 3D architectural logos. Exhibition and trade show display hardware. Retail window display and visual merchandising design.",
        text_DE: "Außenwerbung: Großflächenplakate, City-Light-Poster, Leuchtkästen und plastische Logos im Stadtraum. Messedesign und Ausstellungssysteme. Schaufenstergestaltung.",
        text_PL: "Reklama zewnętrzna: billboardy, citylighty, szyldy, kasetony świetlne i przestrzenne znaki firmowe. Wzornictwo systemów wystawienniczych oraz aranżacja witryn handlowych."
      },
      {
        subCode: "2.3",
        text_UA: "Реклама у цифровому середовищі (банери, креативи, публікації у соцмережах, рекламна анімація та відеографіка).",
        text_EN: "Digital advertising media: web banners, digital creatives, social media campaigns, motion graphics, and video ads.",
        text_DE: "Digitale Werbung: Online-Banner, Social-Media-Kampagnen, Werbeanimationen und Motion Design.",
        text_PL: "Reklama w środowisku cyfrowym: banery internetowe, kreacje do mediów społecznościowych, animacje reklamowe i wideografika."
      }
    ]
  },
  {
    code: "03",
    title_UA: "ДИЗАЙН ГРАФІЧНИХ ЗНАКОВИХ СИСТЕМ ДЛЯ СЕРЕДОВИЩА ТА ВИРОБІВ",
    title_EN: "SIGN SYSTEMS & ENVIRONMENTAL GRAPHIC DESIGN",
    title_DE: "LEITSYSTEME & INDUSTRIELLE GRAFIKDESIGN-SYSTEME",
    title_PL: "SYSTEMY ZNAKOWE I PROJEKTOWANIE DLA PRZEMYSŁU",
    icon: Eye,
    items: [
      {
        subCode: "3.1",
        text_UA: "Дизайн графічних інформаційних знакових систем. Графічна навігація в середовищі. Піктограми і символи для громадських просторів. Знаки безпеки та інформаційні елементи для предметно-просторового середовища. Інфографіка.",
        text_EN: "Wayfinding and environmental signage systems. Spatial navigation, public pictograms, safety iconography, and informative infographics.",
        text_DE: "Grafische Informations- und Wegeleitsysteme. Raumorientierung, Piktogramme und Symbole für den öffentlichen Raum. Infografiken.",
        text_PL: "Projektowanie graficznych systemów informacyjnych i nawigacji przestrzennej. Piktogramy, znaki bezpieczeństwa i infografika."
      },
      {
        subCode: "3.2",
        text_UA: "Маркування для промислових виробів, графічні інструкції, логотипи та візуальні елементи для промислових виробів (упаковки, маркування). Знаково-образні системи візуальної комунікації та предметний дизайн як їх складова для соціальних та комерційних подій.",
        text_EN: "Industrial product labeling, user manuals, and technical graphics. Visual communication systems and spatial stage accessories for public and commercial events.",
        text_DE: "Industrielle Kennzeichnung, grafische Bedienungsanleitungen und Produktausstattung. Visuelle Zeichensysteme und Event-Design.",
        text_PL: "Znakowanie wyrobów przemysłowych, instrukcje graficzne, etykiety. Systemy komunikacji wizualnej i wzornictwo dla wydarzeń masowych."
      }
    ]
  },
  {
    code: "04",
    title_UA: "МУЛЬТИМЕДІЙНІ ЦИФРОВІ ТВОРИ",
    title_EN: "MULTIMEDIA DIGITAL ARTS",
    title_DE: "DIGITALE MULTIMEDIA-KUNST",
    title_PL: "CYFROWE DZIEŁA MULTIMEDIALNE",
    icon: Play,
    items: [
      {
        subCode: "4.1",
        text_UA: "Анімація та відеографіка. Рекламні ролики, графічна анімація для соціальних мереж, мобільних додатків та вебсайтів.",
        text_EN: "Animation and videography: commercial clips, 2D/3D motion graphics for social media, mobile apps, and websites.",
        text_DE: "Animation und Videografie: Werbespots, Motion Graphics für soziale Netzwerke, mobile Apps und Webseiten.",
        text_PL: "Animacja i wideografika: spoty reklamowe, animacje graficzne dla mediów społecznościowych, aplikacji mobilnych i serwisów www."
      },
      {
        subCode: "4.2",
        text_UA: "Інтерактивний дизайн. Концептуальні візуалізації для відеоігор (сцени, персонажі, анімація).",
        text_EN: "Interactive experience design. Concept art and visual worldbuilding for video games, digital environments, and characters.",
        text_DE: "Interaktives Design: Konzeptkunst und visuelle Gestaltung für Videospiele (Umgebungsdesign, Charaktere, Animationen).",
        text_PL: "Projektowanie interaktywne: grafika koncepcyjna i wizualizacje do gier wideo (sceny, postaci, animacje)."
      },
      {
        subCode: "4.3",
        text_UA: "Проекційний меппінг, інсталяції для подій, концертів чи фестивалів. Цифровий стріт-арт, анімації для проєкційні шоу на будівлях чи в інтер’єрах (віджеїнг).",
        text_EN: "Projection mapping, audiovisual installations for concerts and festivals. Digital street art, building facade projections, and live VJing.",
        text_DE: "Projection Mapping, audiovisuelle Installationen für Festivals und Konzerte. Digitale Street-Art, Fassadenprojektionen und Live-VJing.",
        text_PL: "Mapping projekcyjny, instalacje audiowizualne na koncerty i festiwale. Cyfrowy street art, projekcje architektoniczne i VJing."
      }
    ]
  },
  {
    code: "05",
    title_UA: "ВЕБДИЗАЙН ТА ЦИФРОВІ ПРОДУКТИ",
    title_EN: "WEB & DIGITAL PRODUCT DESIGN",
    title_DE: "WEBDESIGN & INTERFACE-GESTALTUNG",
    title_PL: "WEB DESIGN & UX/UI",
    icon: Monitor,
    items: [
      {
        subCode: "5.1",
        text_UA: "Розробка користувацьких інтерфейсів (UI/UX-дизайн). Створення зручної навігації, інтуїтивних меню та адаптивних макетів.",
        text_EN: "User interface & experience design (UI/UX). Intuitive navigation structures, design systems, and responsive layouts across platforms.",
        text_DE: "Entwicklung von Benutzeroberflächen (UI/UX-Design): intuitive Navigation, Menüarchitektur und adaptive Layouts.",
        text_PL: "Projektowanie interfejsów użytkownika (UI/UX): przejrzysta nawigacja, intuicyjne menu oraz responsywne układy stron."
      },
      {
        subCode: "5.2",
        text_UA: "Розробка макетів для корпоративних, освітніх чи комерційних сайтів. Проєктування сайтів для різних пристроїв: комп’ютерів, планшетів, смартфонів.",
        text_EN: "Layout design for corporate, educational, and commercial platforms. Cross-device interface optimization for desktop, tablet, and mobile screens.",
        text_DE: "Layoutentwicklung für Corporate-, Bildungs- und E-Commerce-Plattformen für Desktop, Tablet und Smartphone.",
        text_PL: "Projektowanie makiet stron korporacyjnych, edukacyjnych i komercyjnych pod komputery, tablety i smartfony."
      }
    ]
  },
  {
    code: "06",
    title_UA: "ДИЗАЙН МІСЬКОГО СЕРЕДОВИЩА ТА СТРІТ-АРТ",
    title_EN: "URBAN ENVIRONMENTAL DESIGN & STREET ART",
    title_DE: "URBANE GESTALTUNG & STREET-ART",
    title_PL: "PROJEKTOWANIE PRZESTRZENI MIEJSKIEJ I STREET ART",
    icon: Building,
    items: [
      {
        subCode: "6.1",
        text_UA: "Мурали та графіті для забезпечення комунікації засобами графічного дизайну у міському просторі. Розробка великих настінних композицій, що інтегруються в архітектуру міста. Концептуальна скульптура та 3D-об’єкти для громадських просторів.",
        text_EN: "Murals, public art, and architectural wall compositions fostering social communication. Artistic revitalization of urban spaces. Conceptual sculptures and 3D installations for public plazas.",
        text_DE: "Murals und Street-Art zur visuellen Sozialkommunikation. Großformatige Wandgestaltungen in urbaner Architektur sowie 3D-Installationen für Plätze und Parks.",
        text_PL: "Murale i sztuka publiczna dla komunikacji społecznej. Wielkoformatowe kompozycje zintegrowane z architekturą miasta. Rzeźba koncepcyjna i obiekty 3D w przestrzeni publicznej."
      },
      {
        subCode: "6.2",
        text_UA: "Концептуальне візуальне мистецтво. Публічні інсталяції. Тимчасові арт-об’єкти, які взаємодіють із простором і глядачами як елементи ідентифікації та рекламного дизайну.",
        text_EN: "Conceptual visual art and public installations. Temporary site-specific art objects engaging spectators as creative landmarks and communication catalysts.",
        text_DE: "Konzeptuelle Kunst und temporäre urbane Installationen, die mit Raum und Publikum interagieren und Identifikationswerte schaffen.",
        text_PL: "Koncepcyjne dzieła sztuki i instalacje publiczne. Tymczasowe obiekty artystyczne wchodzące w relację z odbiorcą jako elementy tożsamości miejsca."
      }
    ]
  },
  {
    code: "07",
    title_UA: "ДИЗАЙН ДРУКОВАНИХ ВИДАНЬ ТА ІЛЮСТРАЦІЯ",
    title_EN: "EDITORIAL DESIGN & ILLUSTRATION",
    title_DE: "EDITORIAL DESIGN & ILLUSTRATION",
    title_PL: "PROJEKTOWANIE PUBLIKACJI I ILUSTRACJA",
    icon: BookOpen,
    items: [
      {
        subCode: "7.1",
        text_UA: "Дизайн журналів, книг, газет, постерів, концепція, верстка, макетування.",
        text_EN: "Editorial design for magazines, books, newspapers, and cultural posters: publication concept, grid systems, typography, and page layout.",
        text_DE: "Editorial Design für Magazine, Bücher, Zeitungen und Plakate: Konzeption, Typografie, Rastersysteme und Umbruch.",
        text_PL: "Projektowanie czasopism, książek, gazet, plakatów: koncepcja, typografia, skład i łamanie tekstu."
      },
      {
        subCode: "7.2",
        text_UA: "Ілюстрація для книг (друкованих та цифрових), обкладинок, плакатів, коміксів.",
        text_EN: "Illustration for print and digital books, book jackets, editorial posters, and graphic novels / comic art.",
        text_DE: "Illustration für analoge und digitale Bücher, Buchumschläge, redaktionelle Plakate und Comics.",
        text_PL: "Ilustracja książkowa (tradycyjna i cyfrowa), projektowanie okładek, plakatów oraz komiksów."
      },
      {
        subCode: "7.3",
        text_UA: "Артбук як форма візуальної експресії та експериментального дизайну. Комбінування тексту, ілюстрації, фотографії, ручних технік і цифрових технологій для створення концептуальних видань.",
        text_EN: "The Artbook as experimental design and personal artistic expression: combining typography, illustration, photography, handmade printmaking, and digital techniques for conceptual editions.",
        text_DE: "Das Artbook als experimentelles Ausdrucksmittel: Verschmelzung von Text, Illustration, Fotografie, handwerklichen Drucktechniken und digitalen Medien zu konzeptionellen Künstlerbüchern.",
        text_PL: "Artbook jako forma ekspresji wizualnej i eksperymentu projektowego: łączenie tekstu, ilustracji, fotografii, technik ręcznych i cyfrowych w wydawnictwach autorskich."
      }
    ]
  }
];

export default function Home() {
  const { data, t, lang } = useCms();

  // Video embed item if configured in Multimedia or state
  const promoVideoItem = (data?.multimedia || []).find((m: any) => m.Category === "StudyVideo" || m.Category === "PromoVideo");
  const promoVideoUrl = promoVideoItem ? (promoVideoItem.Link || promoVideoItem.link || promoVideoItem.Url || promoVideoItem.url || promoVideoItem.Media || promoVideoItem.media) : null;
  const activeVideoUrl = (promoVideoUrl && String(promoVideoUrl).trim() !== "") ? String(promoVideoUrl).trim() : "https://www.instagram.com/p/DePJa6UIT62/";
  const videoData = parseVideoUrl(activeVideoUrl);

  return (
    <div className="flex flex-col w-full bg-page-bg">
      <SeoHead
        title={t("home_hero_title", "Візуальний Дизайн і Мистецтво").replace(/\n/g, ' ')}
        description={t("home_manifesto_text", "Офіційний сайт кафедри візуального дизайну і мистецтва (ВДМ) Інституту архітектури та дизайну Національного університету «Львівська політехніка».")}
        breadcrumbName="Головна"
      />

      {/* 1. Primary Curriculum Directions (Основні напрями навчальної програми) */}
      <section className="w-full border-b-2 border-border-main bg-page-bg">
        {/* Section Header */}
        <div className="border-b-2 border-border-main p-6 md:p-12 lg:px-20 bg-surface-mut flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="font-mono text-xs text-text-dim block mb-3 uppercase tracking-widest font-bold">
              [ 01 / АКАДЕМІЧНІ НАПРЯМИ ]
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-text-main leading-tight">
              {t("home_curriculum_heading", "Основні напрями навчальної програми")}
            </h1>
          </div>
          <div className="font-mono text-xs uppercase tracking-wider flex items-center gap-2">
            <span className="inline-flex items-center gap-2 bg-accent-yellow text-black font-black px-3.5 py-1.5 rounded-sm border border-black/20 shadow-sm">
              <span className="w-2 h-2 bg-black rounded-full"></span>
              <span>{t("home_curriculum_badge", "7 Спеціалізованих векторів")}</span>
            </span>
          </div>
        </div>

        {/* Directions List - Unified Vertical Paragraph Blocks */}
        <div className="divide-y-2 divide-border-main">
          {PROGRAM_DIRECTIONS.map((dir) => {
            const IconComponent = dir.icon;
            return (
              <div 
                key={dir.code}
                className="p-6 md:p-10 lg:p-14 bg-page-bg hover:bg-surface-mut/20 transition-colors"
              >
                <div className="max-w-6xl mx-auto space-y-6">
                  {/* Верхній рядок: 01. КОРПОРАТИВНИЙ ІДЕНТИФІКАЦІЙНИЙ ДИЗАЙН */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-border-main pb-5">
                    <div className="flex items-center gap-3.5 md:gap-5">
                      <span className="inline-flex items-center justify-center font-mono text-xl md:text-2xl font-black bg-accent-yellow text-black px-3.5 py-1.5 rounded-sm border border-black/20 shadow-sm shrink-0">
                        {dir.code}
                      </span>
                      <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold uppercase tracking-tight text-text-main leading-tight">
                        {(dir as any)[`title_${lang}`] || dir.title_UA}
                      </h2>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
                      <span className="font-mono text-xs uppercase tracking-widest text-text-dim">
                        {dir.items.length} {lang === "UA" ? (dir.items.length === 1 ? "пункт" : dir.items.length < 5 ? "пункти" : "пунктів") : lang === "DE" ? "Schwerpunkte" : lang === "PL" ? "punkty" : "items"}
                      </span>
                      <div className="p-2.5 bg-surface-mut border border-border-main text-text-main">
                        <IconComponent className="w-5 h-5 a11y-keep" />
                      </div>
                    </div>
                  </div>

                  {/* Під ним відповідні пункти (виділені, контрастні, абзацні) */}
                  <div className="space-y-4 pt-1">
                    {dir.items.map((subItem) => (
                      <div 
                        key={subItem.subCode} 
                        className="flex items-start gap-4 md:gap-5 p-5 md:p-6 border-2 border-border-main bg-surface-main hover:border-text-main transition-all rounded-sm shadow-xs"
                      >
                        <span className="font-mono text-xs md:text-sm font-black bg-accent-yellow text-black px-3 py-1.5 rounded-sm shrink-0 border border-black/20 shadow-sm">
                          {subItem.subCode}
                        </span>
                        <p className="text-base md:text-lg text-text-main font-semibold leading-relaxed">
                          {(subItem as any)[`text_${lang}`] || subItem.text_UA}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Typographic Manifesto Block */}
      <section className="w-full border-b-2 border-border-main bg-surface-main py-16 md:py-24 px-6 md:px-12 lg:px-20 relative">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-border-main pb-6 mb-10">
            <div>
              <span className="font-mono text-xs text-text-dim block mb-2 uppercase tracking-widest font-bold">
                [ 02 / МАНІФЕСТ КАФЕДРИ ]
              </span>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight text-text-main leading-tight">
                {t("home_hero_title", "Візуальний Дизайн і Мистецтво").replace(/\n/g, ' ')}
              </h2>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-text-main text-page-bg font-mono text-xs uppercase tracking-widest font-bold shadow-sm shrink-0">
              <span className="w-2 h-2 rounded-full bg-accent-yellow animate-pulse"></span>
              <span>{t("home_manifesto_badge", "Маніфест кафедри")}</span>
            </div>
          </div>

          <p className="text-lg md:text-2xl lg:text-[1.85rem] font-normal tracking-normal leading-[1.5] text-text-main text-balance select-text border-l-4 border-accent-yellow pl-6 md:pl-10">
            {t(
              "home_manifesto_text",
              "Ми — кафедра візуального дизайну і мистецтва — команда дизайнерів, митців і дослідників, творча майстерня та інтелектуальний колектив, об’єднаний спільною метою: формувати покоління професіоналів, здатних перетворювати ідеї на потужні візуальні повідомлення. Дизайн-програма ВДМ експериментує з різними формами комунікації, з метою створити нову візуальну мову, яка резонує з сучасним суспільством та сповідує ідеали національного самовираження. Ми віримо, що дизайн і мистецтво мають трансформативний потенціал впливати на світ, а унікальність кожного студента - це рушійна сила для суспільних і культурних змін."
            )}
          </p>
        </div>
      </section>

      {/* 3. Video Showcase Section (Відео про навчання на кафедрі) */}
      <section className="w-full border-b-2 border-border-main bg-surface-main p-6 md:p-12 lg:p-20">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b-2 border-border-main pb-6">
            <div>
              <span className="font-mono text-xs text-text-dim block mb-2 uppercase tracking-widest font-bold">
                [ 03 / ВІДЕОМАТЕРІАЛИ КАФЕДРИ ]
              </span>
              <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-text-main">
                {t("home_video_heading", "Відео про навчання на кафедрі")}
              </h2>
            </div>
            <p className="text-xs font-mono text-text-dim max-w-sm">
              {t("home_video_subheading", "* Атмосфера лекцій, творчих лабораторій, студентських проєктів та захистів дипломних робіт.")}
            </p>
          </div>

          {/* Video Container Frame */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-surface-mut/40 border-2 border-border-main p-6 md:p-10 lg:p-12">
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-accent-yellow text-black border border-black/20 font-mono text-xs font-black uppercase tracking-wider rounded-sm shadow-sm">
                  <Film className="w-3.5 h-3.5" />
                  <span>{t("home_video_badge", "Творчий процес ВДМ")}</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-text-main leading-tight">
                  {t("home_video_card_title", "Життя та навчання на кафедрі")}
                </h3>
                <p className="text-base text-text-main font-semibold leading-relaxed">
                  {t("home_video_card_desc", "Динамічний ритм життя кафедри: від пошуку ідей та роботи в творчих майстернях до захисту авторських дизайн-проєктів. Пориньте в атмосферу нашої спільноти у відеоматеріалі.")}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex flex-wrap gap-2 text-xs font-mono text-text-dim">
                  <span className="bg-surface-main border border-border-main px-3 py-1 font-bold">🏛 {t("home_video_tag_address", "вул. Січових Стрільців, 7")}</span>
                  <span className="bg-surface-main border border-border-main px-3 py-1 font-bold">🎨 {t("home_video_tag_field", "Графічний дизайн & Арт")}</span>
                  <span className="bg-surface-main border border-border-main px-3 py-1 font-bold">✨ {t("home_video_tag_code", "В2.01 Дизайн")}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 border-t border-border-main">
                <a
                  href="https://www.instagram.com/p/DePJa6UIT62/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-text-main text-page-bg px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider hover:bg-accent-yellow hover:text-black transition-colors duration-200"
                >
                  <Instagram className="w-4 h-4" />
                  <span>{t("home_video_btn_ig", "Переглянути в Instagram")}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
                <a
                  href="https://www.instagram.com/vdm_lpnu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 font-mono text-xs text-text-dim hover:text-text-main underline decoration-accent-yellow underline-offset-4 py-2"
                >
                  <span>@vdm_lpnu</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-[360px] md:max-w-[400px] border-2 border-border-main bg-black shadow-2xl overflow-hidden rounded-xl">
                <video
                  src="/video/study-at-vdm.mp4#t=0.001"
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full h-auto max-h-[620px] object-contain bg-black block"
                >
                  Ваш браузер не підтримує відтворення відео.
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Dynamic Marquee Ticker */}
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

