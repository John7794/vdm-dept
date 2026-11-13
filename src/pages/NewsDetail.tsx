import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useCms } from "../contexts/CmsContext";
import { formatDriveLink, cleanHtml, formatNewsDisplayDate } from "../lib/utils";
import ResponsiveImage from "../components/ResponsiveImage";
import LightboxModal from "../components/LightboxModal";
import SeoHead from "../components/SeoHead";
import React, { useState, useEffect } from "react";

export default function NewsDetail() {
  const { id } = useParams();
  const { data, lang, t } = useCms();

  const newsItem = data?.news?.find((n: any) => (n.ID || n.id) === id);

  if (!newsItem) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center bg-page-bg text-text-main p-12">
        <h1 className="text-4xl font-bold uppercase mb-4">{t("news_not_found", "Новину не знайдено")}</h1>
        <Link to="/news" className="border-2 border-border-main px-6 py-3 font-mono text-sm uppercase tracking-widest hover:bg-text-main hover:text-page-bg transition-colors">
          {t("news_back", "Повернутися до новин")}
        </Link>
      </div>
    );
  }

  const title = newsItem[`Title_${lang}`] || newsItem.Title_UA || newsItem.title || "";
  const excerpt = newsItem[`Desc_${lang}`] || newsItem.Desc_UA || newsItem.desc || newsItem.excerpt || "";
  const type = newsItem[`Type_${lang}`] || newsItem.Type_UA || newsItem.type || "";
  const date = formatNewsDisplayDate(newsItem, lang);
  const content = newsItem[`Content_${lang}`] || newsItem.Content_UA || newsItem.content || "";
  const quote = newsItem[`Quote_${lang}`] || newsItem.Quote_UA || newsItem.quote || "";
  
  const coverDesktop = newsItem.Image || newsItem.image || newsItem.img || newsItem.Media || newsItem.media || "";
  const coverDesktop2x = newsItem.Image_2x || newsItem.image_2x || newsItem.Media_2x || newsItem.media_2x || "";
  const coverTablet = newsItem.Image_Tablet || newsItem.image_Tablet || newsItem.Media_Tablet || newsItem.media_Tablet || "";
  const coverTablet2x = newsItem.Image_Tablet_2x || newsItem.image_Tablet_2x || newsItem.Media_Tablet_2x || newsItem.media_Tablet_2x || "";
  const coverMobile = newsItem.Image_Mobile || newsItem.image_Mobile || newsItem.Media_Mobile || newsItem.media_Mobile || "";
  const coverMobile2x = newsItem.Image_Mobile_2x || newsItem.image_Mobile_2x || newsItem.Media_Mobile_2x || newsItem.media_Mobile_2x || "";

  // Support direct gallery from News sheet (semicolon, newline, or comma separated)
  const directGalleryUrls: string[] = (newsItem.Gallery || newsItem.gallery || "")
    .split(/[\n,;]+/)
    .map((u: string) => u.trim())
    .filter((u: string) => u.length > 0 && (u.startsWith("http://") || u.startsWith("https://") || u.startsWith("/")));

  // Filter media belonging to this news item from Multimedia sheet
  const mediaItems = data?.multimedia?.filter((m: any) => 
    m.Category === `News_${id}` || 
    m.Category === `NewsGallery_${id}` ||
    (m.ID === id && (m.Category?.startsWith("News") || m.Category === id)) ||
    m.Category === id
  ) || [];

  const videoItems = mediaItems.filter((m: any) => {
    const url = (m.Image || m.image || m.img || m.Media || m.media || m.Url || m.url || "").trim();
    return m.Type?.toLowerCase() === "video" || url.includes("youtube.com") || url.includes("youtu.be");
  });

  const imageItems = mediaItems.filter((m: any) => {
    const url = (m.Image || m.image || m.img || m.Media || m.media || m.Url || m.url || "").trim();
    return !(m.Type?.toLowerCase() === "video" || url.includes("youtube.com") || url.includes("youtu.be")) && url !== "";
  });
  
  const multimediaGallery = imageItems.map((m: any) => 
    formatDriveLink((m.Image || m.image || m.img || m.Media || m.media || m.Url || m.url || "").trim())
  );

  // Combine and deduplicate images
  const galleryImages: string[] = Array.from(new Set([...directGalleryUrls, ...multimediaGallery])).filter(Boolean);

  const [currentGalleryIdx, setCurrentGalleryIdx] = useState(0);
  const [isGalleryHovered, setIsGalleryHovered] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (galleryImages.length <= 1 || isGalleryHovered || lightboxIndex !== null) return;
    const timer = setInterval(() => {
      setCurrentGalleryIdx((prev) => (prev + 1) % galleryImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [galleryImages.length, isGalleryHovered, lightboxIndex]);

  return (
    <div className="flex flex-col w-full bg-page-bg text-text-main min-h-screen">
      <SeoHead
        title={title ? `${title} | ВДМ Львівська політехніка` : "Новина кафедри ВДМ"}
        description={excerpt || title}
        image={coverDesktop || (galleryImages.length > 0 ? galleryImages[0] : undefined)}
        article={true}
        publishedTime={date}
      />

      {/* Top Banner / Breadcrumb */}
      <section className="border-b-2 border-border-main bg-surface-main p-6 lg:px-12 flex items-center">
        <Link to="/news" className="font-mono text-xs uppercase tracking-widest flex items-center gap-2 hover:underline underline-offset-4 opacity-70 hover:opacity-100 transition-opacity">
          <ArrowLeft className="w-4 h-4" /> {t("news_back", "Всі новини")}
        </Link>
      </section>

      {/* Article Header */}
      <section className="p-6 md:p-12 lg:p-16 border-b-2 border-border-main flex flex-col items-center text-center">
        <div className="max-w-4xl w-full">
          <div className="flex justify-center gap-4 mb-8">
            <span className="font-mono text-sm font-bold tracking-tighter">{date}</span>
            <span className="font-mono text-[10px] sm:text-xs text-text-dim border border-border-soft px-3 py-1 uppercase">{type}</span>
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-7xl font-bold leading-[0.9] tracking-[-0.04em] uppercase text-balance"
          >
            {title}
          </motion.h1>
        </div>
      </section>

      {/* Hero Image: strictly contained with overflow-hidden to prevent bleeding onto content */}
      {(coverDesktop || coverTablet || coverMobile || coverDesktop2x || coverTablet2x || coverMobile2x) && (
        <section className="w-full border-b-2 border-border-main bg-ink overflow-hidden relative max-h-[50vh] md:max-h-[65vh]">
          <ResponsiveImage 
            desktopUrl={coverDesktop}
            desktopUrl2x={coverDesktop2x}
            tabletUrl={coverTablet}
            tabletUrl2x={coverTablet2x}
            mobileUrl={coverMobile}
            mobileUrl2x={coverMobile2x}
            alt={title}
            className="w-full h-full max-h-[50vh] md:max-h-[65vh] object-cover"
          />
        </section>
      )}

      {/* Article Content: isolated in its own stacking context */}
      <section className="relative z-10 bg-page-bg grid grid-cols-1 lg:grid-cols-12 divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-border-main">
        {/* Main Body */}
        <div className="lg:col-span-8 p-6 md:p-12 lg:p-16 lg:col-start-3">
          <div className="max-w-3xl mx-auto space-y-8 font-light leading-relaxed text-text-main text-lg lg:text-xl">
            {excerpt && (
              <p className="font-medium text-xl lg:text-2xl italic pb-8 border-b border-border-soft text-balance">
                {excerpt}
              </p>
            )}
            
            {content && (
              <div dangerouslySetInnerHTML={{ __html: cleanHtml(content) }} className="prose prose-invert max-w-none prose-p:text-text-main prose-headings:text-text-main prose-a:text-accent-yellow pb-8" />
            )}

            {quote && (
              <blockquote className="border-l-4 border-accent-yellow pl-6 py-2 my-8 italic font-medium text-xl lg:text-2xl text-text-main opacity-90">
                {quote}
              </blockquote>
            )}

            {videoItems.length > 0 && (
              <div className="pt-12 grid grid-cols-1 gap-12 border-t border-border-soft mt-12">
                {videoItems.map((m: any, idx: number) => {
                  const urlDesktop = (m.Image || m.image || m.img || m.Media || m.media || m.Url || m.url || "").trim();
                  const urlMobile = (m.Image_Mobile || m.image_Mobile || m.Media_Mobile || m.media_Mobile || m.Url_Mobile || m.url_mobile || "").trim();
                  
                  const isYt = urlDesktop.includes("youtube.com") || urlDesktop.includes("youtu.be");
                  if (isYt) {
                    let videoId = urlDesktop.includes("v=") ? urlDesktop.split("v=")[1].split("&")[0] : urlDesktop.split("youtu.be/")[1].split("?")[0];
                    return (
                       <div key={idx} className="aspect-video w-full border-2 border-border-main">
                         <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${videoId}`} title="YouTube Video" frameBorder="0" allowFullScreen></iframe>
                       </div>
                    );
                  }
                  // Native video
                  return (
                    <div key={idx} className="w-full border-2 border-border-main aspect-video bg-ink relative">
                      <video controls playsInline className="w-full h-full object-cover">
                        {urlMobile && <source src={urlMobile.includes("drive.google.com") ? formatDriveLink(urlMobile).replace('/view', '/preview') : urlMobile} media="(max-width: 768px)" />}
                        {urlDesktop && <source src={urlDesktop.includes("drive.google.com") ? formatDriveLink(urlDesktop).replace('/view', '/preview') : urlDesktop} />}
                      </video>
                    </div>
                  );
                })}
              </div>
            )}
            
            {!content && mediaItems.length === 0 && galleryImages.length === 0 && !quote && (
              <p className="text-text-dim mt-8">
                {t(
                  "news_pending_content",
                  "Повний текст новини очікує на публікацію. Наша пресслужба працює над підготовкою детальних матеріалів та фотозвіту з цієї події."
                )}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Image Gallery (Fotorama-style with thumbnails & viewer) */}
      {galleryImages.length > 0 && (
        <section className="w-full border-t-2 border-border-main bg-surface-main py-12 px-4 md:px-8 lg:px-16">
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Gallery Header Bar */}
            <div className="flex items-center justify-between border-b-2 border-border-main pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-accent-yellow inline-block"></span>
                <h3 className="font-mono text-xs md:text-sm uppercase tracking-widest font-bold">
                  {t("news_gallery_title", "Фотогалерея події")}
                </h3>
              </div>
              <div className="font-mono text-xs md:text-sm font-bold tracking-wider text-text-dim">
                [ {String(currentGalleryIdx + 1).padStart(2, "0")} / {String(galleryImages.length).padStart(2, "0")} ]
              </div>
            </div>

            {/* Main Image Stage */}
            <div
              className="relative w-full aspect-[16/10] max-h-[65vh] bg-ink border-2 border-border-main overflow-hidden rounded-none flex items-center justify-center cursor-pointer group"
              onMouseEnter={() => setIsGalleryHovered(true)}
              onMouseLeave={() => setIsGalleryHovered(false)}
              onClick={() => setLightboxIndex(currentGalleryIdx)}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentGalleryIdx}
                  src={galleryImages[currentGalleryIdx]}
                  alt={`${title} - фото ${currentGalleryIdx + 1}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="w-full h-full object-contain"
                />
              </AnimatePresence>

              {/* Navigation Arrows */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Попереднє фото"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentGalleryIdx((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-page-bg/90 text-text-main hover:bg-accent-yellow hover:text-black transition-colors border border-border-main z-20 focus-ring shadow-md"
                  >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                  </button>

                  <button
                    type="button"
                    aria-label="Наступне фото"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentGalleryIdx((prev) => (prev + 1) % galleryImages.length);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-page-bg/90 text-text-main hover:bg-accent-yellow hover:text-black transition-colors border border-border-main z-20 focus-ring shadow-md"
                  >
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                </>
              )}

              {/* Zoom hint overlay badge */}
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-page-bg/90 text-text-main text-xs font-mono uppercase tracking-wider border border-border-main opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
                <Maximize2 className="w-3.5 h-3.5" />
                <span>{t("gallery_zoom", "Збільшити")}</span>
              </div>
            </div>

            {/* Thumbnail Strip (Fotorama-style) */}
            {galleryImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 pt-1 scroll-smooth">
                {galleryImages.map((imgUrl, idx) => {
                  const isActive = idx === currentGalleryIdx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      aria-label={`Перейти до фото ${idx + 1}`}
                      onClick={() => setCurrentGalleryIdx(idx)}
                      className={`relative flex-shrink-0 w-20 h-14 md:w-24 md:h-16 border-2 transition-all duration-150 overflow-hidden ${
                        isActive
                          ? "border-accent-yellow ring-2 ring-accent-yellow/50 scale-[1.03] opacity-100"
                          : "border-border-soft opacity-60 hover:opacity-100 hover:border-border-main"
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`Прев'ю ${idx + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Reusable Lightbox Modal */}
      <LightboxModal
        images={galleryImages}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </div>
  );
}
