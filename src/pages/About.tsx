import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useCms } from "../contexts/CmsContext";
import { MapPin, ArrowUpRight, Facebook, Instagram, Globe, X, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDriveLink } from "../lib/utils";

export default function About() {
  const { t, data } = useCms();

  const politeImagesRaw = data?.multimedia?.filter((m: any) => m.Category === "GalleryPolite") || [];
  const galleryImages = politeImagesRaw.length > 0 
    ? politeImagesRaw.map((m: any) => formatDriveLink(m.Image || m.image || m.img || m.Media || m.media || m.Url || m.url || m.Media || m.media || "")).filter((u: string) => u !== "")
    : [
        "https://picsum.photos/seed/polite1/1200/800",
        "https://picsum.photos/seed/polite2/1200/800",
        "https://picsum.photos/seed/polite3/1200/800"
      ];

  const groomImagesRaw = data?.multimedia?.filter((m: any) => m.Category === "GalleryGroom") || [];
  const groomImages = groomImagesRaw.length > 0
    ? groomImagesRaw.map((m: any) => formatDriveLink(m.Image || m.image || m.img || m.Media || m.media || m.Url || m.url || m.Media || m.media || "")).filter((u: string) => u !== "")
    : [
        "https://picsum.photos/seed/groom1/1200/800",
        "https://picsum.photos/seed/groom2/1200/800",
        "https://picsum.photos/seed/groom3/1200/800"
      ];

  const partnerImagesRaw = data?.multimedia?.filter((m: any) => m.Category === "Partner") || [];
  const partners = partnerImagesRaw.length > 0
    ? partnerImagesRaw.map((m: any) => ({
        imgUrl: formatDriveLink((m.Image || m.image || m.img || m.Media || m.media || m.Url || m.url || "").trim()),
        link: (m.Link || m.link || m.Href || m.href || "").trim()
      })).filter((p: any) => p.imgUrl !== "")
    : [
        { imgUrl: "https://via.placeholder.com/300x150/1A1A1A/FFFFFF?text=Partner+1", link: "" },
        { imgUrl: "https://via.placeholder.com/300x150/1A1A1A/FFFFFF?text=Partner+2", link: "" },
        { imgUrl: "https://via.placeholder.com/300x150/1A1A1A/FFFFFF?text=Partner+3", link: "" },
        { imgUrl: "https://via.placeholder.com/300x150/1A1A1A/FFFFFF?text=Partner+4", link: "" },
        { imgUrl: "https://via.placeholder.com/300x150/1A1A1A/FFFFFF?text=Partner+5", link: "" },
      ];

  const [currentGalleryIdx, setCurrentGalleryIdx] = useState(0);
  const [isGalleryHovered, setIsGalleryHovered] = useState(false);
  
  const [currentGroomIdx, setCurrentGroomIdx] = useState(0);
  const [isGroomHovered, setIsGroomHovered] = useState(false);

  const [lightboxData, setLightboxData] = useState<{ images: string[], index: number } | null>(null);

  useEffect(() => {
    if (isGalleryHovered || lightboxData) return;
    const timer = setInterval(() => {
      setCurrentGalleryIdx((prev) => (prev + 1) % galleryImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isGalleryHovered, lightboxData]);

  useEffect(() => {
    if (isGroomHovered || lightboxData) return;
    const timer = setInterval(() => {
      setCurrentGroomIdx((prev) => (prev + 1) % groomImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isGroomHovered, lightboxData]);

  const handlePrevImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!lightboxData) return;
    setLightboxData(prev => prev ? { ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length } : null);
  }, [lightboxData]);

  const handleNextImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!lightboxData) return;
    setLightboxData(prev => prev ? { ...prev, index: (prev.index + 1) % prev.images.length } : null);
  }, [lightboxData]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxData) return;
      if (e.key === "ArrowLeft") {
        setLightboxData(prev => prev ? { ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length } : null);
      } else if (e.key === "ArrowRight") {
        setLightboxData(prev => prev ? { ...prev, index: (prev.index + 1) % prev.images.length } : null);
      } else if (e.key === "Escape") {
        setLightboxData(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxData]);

  const headerBgItem = data?.multimedia?.find((m: any) => m.Category === "AboutHeader");
  const headerBgRaw = headerBgItem ? (headerBgItem.Image || headerBgItem.image || headerBgItem.img || headerBgItem.Media || headerBgItem.media || headerBgItem.Url || headerBgItem.url || "") : null;
  const headerBgUrl = headerBgRaw ? formatDriveLink(headerBgRaw) : null;

  return (
    <div className="flex flex-col w-full bg-page-bg">
      {/* Page Header */}
      <section className="border-b-2 border-border-main bg-surface-main p-6 md:p-12 lg:p-16 relative overflow-hidden">
        <div className="max-w-[1000px] z-10 relative">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-7xl lg:text-[8rem] font-bold leading-[0.85] tracking-[-0.04em] uppercase text-text-main text-balance break-words hyphens-auto"
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
        <div className="lg:col-span-7 xl:col-span-8 bg-surface-main flex flex-col">
          
          {/* History Section */}
          <div className="p-6 md:p-12 lg:p-16 lg:pb-8 max-w-4xl">
            <span className="font-mono text-xs text-text-dim block mb-8 uppercase tracking-widest">
              {t("about_history_label", "Історія")}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-8 leading-none">
              {t("about_history_title", "Спадщина та Авангард")}
            </h2>
          </div>

          {headerBgUrl && (
            <div className="w-full border-y-2 border-border-main bg-surface-mut overflow-hidden">
              <img src={headerBgUrl} alt="History" className="w-full h-auto object-cover" />
            </div>
          )}

          <div className="p-6 md:p-12 lg:p-16 lg:pt-8 max-w-4xl">
            <div className="space-y-6 text-lg font-light leading-relaxed text-text-main text-balance">
              <p>
                {t("about_history_p1", "Кафедра візуального дизайну і мистецтва є невід'ємною частиною Інституту архітектури та дизайну Національного університету «Львівська політехніка». Ми базуємося на глибоких традиціях львівської архітектурної школи, трансформуючи їх у мову сучасного візуального проєктування.")}
              </p>
              <p>
                {t("about_history_p2", "Наш підхід полягає у відмові від суто художнього оздоблення на користь функціонального комунікативного дизайну. Ми вчимо не просто створювати зображення, а проєктувати інформаційні системи, керувати увагою та формувати сенси через візуальну мову.")}
              </p>
            </div>
          </div>

          <hr className="border-border-main border-t-2" />

          {/* Gallery Polite Section */}
          <div className="p-6 md:p-12 lg:p-16 lg:pb-8 max-w-4xl">
            <span className="font-mono text-xs text-text-dim block mb-8 uppercase tracking-widest">
              {t("about_gallery_label", "Арт-простір")}
            </span>
            
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-8 leading-none">
              {t("about_gallery_title", "Галерея «Політе»")}
            </h2>
            
            <div className="space-y-6 text-lg font-light leading-relaxed text-text-main text-balance">
              <p>
                {t("about_gallery_p1", "Галерея «Політе» — це новостворений арт-простір для мистецтва, зустрічей, експериментів та живого діалогу, який діє на базі нашої кафедри. Ми створили платформу, де перетинаються глибокі академічні традиції та сучасні творчі практики.")}
              </p>
            </div>
          </div>

          {/* Mini Gallery Carousel */}
          <div 
            className="w-full relative border-y-2 border-border-main bg-ink overflow-hidden h-[40vh] md:h-[60vh] flex items-center justify-center cursor-pointer group"
            onMouseEnter={() => setIsGalleryHovered(true)}
            onMouseLeave={() => setIsGalleryHovered(false)}
            onClick={() => setLightboxData({ images: galleryImages, index: currentGalleryIdx })}
          >
            <AnimatePresence mode="popLayout">
              <motion.img 
                key={currentGalleryIdx}
                src={galleryImages[currentGalleryIdx]}
                alt={t("about_gallery_polite_alt", "Галерея Політе")}
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute inset-0 w-full h-full object-cover grayscale mix-blend-screen opacity-70 transition-all duration-700 group-hover:grayscale-0 group-hover:mix-blend-normal group-hover:opacity-100"
              />
            </AnimatePresence>
          </div>

          <div className="p-6 md:p-12 lg:p-16 lg:pt-8 max-w-4xl">
            <div className="space-y-6 text-lg font-light leading-relaxed text-text-main text-balance">
              <p>
                {t("about_gallery_p2", "Першою експозицією простору став проєкт відомого представника української «Нової хвилі» Олега Тістола під назвою «Тіні вибору \"Анґіарі\"». Художник досліджує досвід вибору, пам'ять та відповідальність через мотив тіні, безпосередньо залучаючи до творчого процесу українських захисників.")}
              </p>
            </div>
          </div>

          <hr className="border-border-main border-t-2" />

          {/* G-room Section */}
          <div className="p-6 md:p-12 lg:p-16 lg:pb-8 max-w-4xl">
            <span className="font-mono text-xs text-text-dim block mb-8 uppercase tracking-widest">
              {t("about_groom_label", "Лабораторія")}
            </span>
            
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight mb-8 leading-none">
              {t("about_groom_title", "Мультимедійна лабораторія G-room")}
            </h2>
          </div>

          {/* Mini Gallery Carousel */}
          <div 
            className="w-full relative border-y-2 border-border-main bg-ink overflow-hidden h-[40vh] md:h-[60vh] flex items-center justify-center cursor-pointer group"
            onMouseEnter={() => setIsGroomHovered(true)}
            onMouseLeave={() => setIsGroomHovered(false)}
            onClick={() => setLightboxData({ images: groomImages, index: currentGroomIdx })}
          >
            <AnimatePresence mode="popLayout">
              <motion.img 
                key={currentGroomIdx}
                src={groomImages[currentGroomIdx]}
                alt={t("about_groom_alt", "Галерея G-room")}
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute inset-0 w-full h-full object-cover grayscale mix-blend-screen opacity-70 transition-all duration-700 group-hover:grayscale-0 group-hover:mix-blend-normal group-hover:opacity-100"
              />
            </AnimatePresence>
          </div>

          <div className="p-6 md:p-12 lg:p-16 lg:pt-8 max-w-4xl">
            <div className="space-y-6 text-lg font-light leading-relaxed text-text-main text-balance">
              <p>
                {t("about_groom_p1", "Мультимедійна лабораторія G-room (також відома як Garmonia Room) — це творчий та експериментальний простір для студентів спеціальності «Дизайн». Тут вони вивчають та створюють передові проєкти у сферах графічного, мультимедійного та інтерактивного дизайну.")}
              </p>
              <p>
                {t("about_groom_p2", "Лабораторія забезпечує практичну базу для розробки сучасних візуальних медіапроєктів. Простір оснащений передовим світловим, музичним та екранним обладнанням для створення масштабних проєкційних інсталяцій (відеомепінг) та концептуальних аудіовізуальних перформансів.")}
              </p>
            </div>
          </div>

          <hr className="border-border-main border-t-2" />

          {/* Partners Section */}
          <div className="py-6 md:py-12 lg:py-16 w-full overflow-hidden">
            <div className="px-6 md:px-12 lg:px-16 max-w-4xl mb-8">
              <span className="font-mono text-xs text-text-dim block mb-8 uppercase tracking-widest">
                {t("about_partners_label", "Співпраця")}
              </span>
              
              <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tight leading-none">
                {t("about_partners_title", "З ким ми співпрацюємо")}
              </h2>
            </div>
            
            <div className="w-full relative flex py-4">
              <div className="flex animate-marquee min-w-max gap-8 md:gap-12 hover:animation-play-state-paused">
                {[...partners, ...partners, ...partners, ...partners].map((partner, idx) => {
                  const content = (
                    <img 
                      src={partner.imgUrl} 
                      alt={`Partner ${idx + 1}`} 
                      className="max-w-full max-h-[70px] md:max-h-[90px] object-contain transition-all duration-300 partner-logo"
                      loading="lazy"
                    />
                  );
                  
                  return (
                    <div key={idx} className="w-[160px] md:w-[200px] flex-shrink-0 flex items-center justify-center group cursor-default">
                      {partner.link ? (
                        <a href={partner.link} target="_blank" rel="noopener noreferrer" className="focus-ring outline-none hover:scale-105 transition-transform duration-300">
                          {content}
                        </a>
                      ) : (
                        content
                      )}
                    </div>
                  );
                })}
              </div>
              </div>
          </div>

          <hr className="border-border-main border-t-2" />

          {/* Social Links Section */}
          <div className="py-8 md:py-12 lg:py-16 w-full">
            <div className="px-6 md:px-12 lg:px-16 max-w-4xl">
              <span className="font-mono text-xs text-text-dim block mb-8 uppercase tracking-widest">
                {t("about_social_label", "Ми в мережі")}
              </span>
              
              <div className="flex gap-6">
                <a href="https://lpnu.ua/vdm" target="_blank" rel="noopener noreferrer" className="p-4 bg-surface-mut rounded-full text-text-main hover:bg-accent-yellow hover:text-ink transition-colors focus-ring outline-none" aria-label={t("about_lpnu_site_aria", "Сайт Львівської політехніки")}>
                  <Globe className="w-8 h-8" />
                </a>
                <a href="https://www.facebook.com/visualdesignandart" target="_blank" rel="noopener noreferrer" className="p-4 bg-surface-mut rounded-full text-text-main hover:bg-accent-yellow hover:text-ink transition-colors focus-ring outline-none" aria-label="Facebook">
                  <Facebook className="w-8 h-8" />
                </a>
                <a href="https://www.instagram.com/vdm_lpnu/" target="_blank" rel="noopener noreferrer" className="p-4 bg-surface-mut rounded-full text-text-main hover:bg-accent-yellow hover:text-ink transition-colors focus-ring outline-none" aria-label="Instagram">
                  <Instagram className="w-8 h-8" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contacts & Map */}
        <div className="lg:col-span-5 xl:col-span-4 bg-ink text-paper flex flex-col lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)] overflow-y-auto custom-scrollbar">
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

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-ink/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8 cursor-zoom-out group/lightbox"
            onClick={() => setLightboxData(null)}
          >
            <button 
              className="absolute top-6 right-6 text-paper/70 hover:text-accent-yellow transition-colors focus-ring outline-none z-[110]"
              onClick={(e) => { e.stopPropagation(); setLightboxData(null); }}
              aria-label="Close"
            >
              <X className="w-10 h-10" />
            </button>

            {/* Left Nav */}
            <button 
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-paper/40 hover:text-accent-yellow transition-all duration-300 focus-ring outline-none z-[110] opacity-0 group-hover/lightbox:opacity-100 hover:scale-110"
              onClick={handlePrevImage}
              aria-label="Previous image"
            >
              <ChevronLeft className="w-12 h-12 md:w-16 md:h-16" />
            </button>

            <AnimatePresence mode="wait">
              <motion.img
                key={lightboxData.index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                src={lightboxData.images[lightboxData.index]}
                alt="Expanded view"
                className="max-w-full max-h-[90vh] object-contain shadow-2xl cursor-default"
                onClick={(e) => e.stopPropagation()}
              />
            </AnimatePresence>

            {/* Right Nav */}
            <button 
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-paper/40 hover:text-accent-yellow transition-all duration-300 focus-ring outline-none z-[110] opacity-0 group-hover/lightbox:opacity-100 hover:scale-110"
              onClick={handleNextImage}
              aria-label="Next image"
            >
              <ChevronRight className="w-12 h-12 md:w-16 md:h-16" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
