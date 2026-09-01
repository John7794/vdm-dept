import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useCms } from "../contexts/CmsContext";
import { formatDriveLink } from "../lib/utils";
import ResponsiveImage from "../components/ResponsiveImage";
import { useState, useEffect, useCallback } from "react";

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
  const date = newsItem[`Date_${lang}`] || newsItem.Date_UA || newsItem.Date || newsItem.date || "";
  const content = newsItem[`Content_${lang}`] || newsItem.Content_UA || newsItem.content || "";
  const quote = newsItem[`Quote_${lang}`] || newsItem.Quote_UA || newsItem.quote || "";
  
  const coverDesktop = newsItem.Image || newsItem.image || newsItem.img || newsItem.Media || newsItem.media || "";
  const coverDesktop2x = newsItem.Image_2x || newsItem.image_2x || newsItem.Media_2x || newsItem.media_2x || "";
  const coverTablet = newsItem.Image_Tablet || newsItem.image_Tablet || newsItem.Media_Tablet || newsItem.media_Tablet || "";
  const coverTablet2x = newsItem.Image_Tablet_2x || newsItem.image_Tablet_2x || newsItem.Media_Tablet_2x || newsItem.media_Tablet_2x || "";
  const coverMobile = newsItem.Image_Mobile || newsItem.image_Mobile || newsItem.Media_Mobile || newsItem.media_Mobile || "";
  const coverMobile2x = newsItem.Image_Mobile_2x || newsItem.image_Mobile_2x || newsItem.Media_Mobile_2x || newsItem.media_Mobile_2x || "";

  // Filter media belonging to this news item. We support passing the ID in Category for backward compatibility
  // Example Category: "News_news_1" or "NewsGallery_news_1"
  const mediaItems = data?.multimedia?.filter((m: any) => 
    m.Category === `News_${id}` || 
    m.Category === `NewsGallery_${id}` ||
    m.Category === id || 
    m.ID === id
  ) || [];

  const videoItems = mediaItems.filter((m: any) => {
    const url = (m.Image || m.image || m.img || m.Media || m.media || m.Url || m.url || m.Media || m.media || "").trim();
    return m.Type?.toLowerCase() === "video" || url.includes("youtube.com") || url.includes("youtu.be");
  });

  const imageItems = mediaItems.filter((m: any) => {
    const url = (m.Image || m.image || m.img || m.Media || m.media || m.Url || m.url || m.Media || m.media || "").trim();
    return !(m.Type?.toLowerCase() === "video" || url.includes("youtube.com") || url.includes("youtu.be")) && url !== "";
  });
  
  const galleryImages = imageItems.map((m: any) => formatDriveLink((m.Image || m.image || m.img || m.Media || m.media || m.Url || m.url || m.Media || m.media || "").trim()));

  const [currentGalleryIdx, setCurrentGalleryIdx] = useState(0);
  const [isGalleryHovered, setIsGalleryHovered] = useState(false);
  const [lightboxData, setLightboxData] = useState<{ images: string[], index: number } | null>(null);

  useEffect(() => {
    if (galleryImages.length === 0 || isGalleryHovered || lightboxData) return;
    const timer = setInterval(() => {
      setCurrentGalleryIdx((prev) => (prev + 1) % galleryImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [galleryImages.length, isGalleryHovered, lightboxData]);

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

  return (
    <div className="flex flex-col w-full bg-page-bg text-text-main min-h-screen">
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

      {/* Optional Hero Image (from News tab columns) */}
      {(coverDesktop || coverTablet || coverMobile || coverDesktop2x || coverTablet2x || coverMobile2x) && (
        <section className="w-full border-b-2 border-border-main bg-ink">
          <ResponsiveImage 
            desktopUrl={coverDesktop}
            desktopUrl2x={coverDesktop2x}
            tabletUrl={coverTablet}
            tabletUrl2x={coverTablet2x}
            mobileUrl={coverMobile}
            mobileUrl2x={coverMobile2x}
            alt={title}
            className="w-full max-h-[70vh] object-cover"
          />
        </section>
      )}

      {/* Article Content */}
      <section className="grid grid-cols-1 lg:grid-cols-12 divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-border-main">
        {/* Main Body */}
        <div className="lg:col-span-8 p-6 md:p-12 lg:p-16 lg:col-start-3">
          <div className="max-w-3xl mx-auto space-y-8 font-light leading-relaxed text-text-main text-lg lg:text-xl">
            {excerpt && (
              <p className="font-medium text-xl lg:text-2xl italic pb-8 border-b border-border-soft text-balance">
                {excerpt}
              </p>
            )}
            
            {content && (
              <div dangerouslySetInnerHTML={{ __html: content }} className="prose prose-invert max-w-none prose-p:text-text-main prose-headings:text-text-main prose-a:text-accent-blue pb-8" />
            )}

            {quote && (
              <blockquote className="border-l-4 border-accent-blue pl-6 py-2 my-8 italic font-medium text-xl lg:text-2xl text-text-main opacity-90">
                {quote}
              </blockquote>
            )}

            {videoItems.length > 0 && (
              <div className="pt-12 grid grid-cols-1 gap-12 border-t border-border-soft mt-12">
                {videoItems.map((m: any, idx: number) => {
                  const urlDesktop = (m.Image || m.image || m.img || m.Media || m.media || m.Url || m.url || m.Media || m.media || "").trim();
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
            
            {!content && mediaItems.length === 0 && !quote && (
              <p className="text-text-dim mt-8">
                Повний текст новини очікує на публікацію. Наша пресслужба працює над підготовкою детальних матеріалів та фотозвіту з цієї події.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Image Gallery Carousel */}
      {galleryImages.length > 0 && (
        <section className="w-full relative border-y-2 border-border-main bg-ink overflow-hidden h-[40vh] md:h-[60vh] flex items-center justify-center cursor-pointer group"
          onMouseEnter={() => setIsGalleryHovered(true)}
          onMouseLeave={() => setIsGalleryHovered(false)}
          onClick={() => setLightboxData({ images: galleryImages, index: currentGalleryIdx })}
        >
          <AnimatePresence mode="popLayout">
            <motion.img 
              key={currentGalleryIdx}
              src={galleryImages[currentGalleryIdx]}
              alt={`Gallery image ${currentGalleryIdx + 1}`}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute inset-0 w-full h-full object-cover grayscale mix-blend-screen opacity-70 transition-all duration-700 group-hover:grayscale-0 group-hover:mix-blend-normal group-hover:opacity-100"
            />
          </AnimatePresence>
        </section>
      )}

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
