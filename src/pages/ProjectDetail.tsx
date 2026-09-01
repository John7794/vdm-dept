import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useCms } from "../contexts/CmsContext";
import { formatDriveLink } from "../lib/utils";
import ResponsiveImage from "../components/ResponsiveImage";

export default function ProjectDetail() {
  const { id } = useParams();
  const { data, lang, t } = useCms();

  const projectRaw = data?.projects?.find((p: any) => (p.ID || p.id) === id);

  if (!projectRaw) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center bg-page-bg text-text-main p-12">
        <h1 className="text-4xl font-bold uppercase mb-4">{t("proj_not_found", "Проєкт не знайдено")}</h1>
        <Link to="/projects" className="border-2 border-border-main px-6 py-3 font-mono text-sm uppercase tracking-widest hover:bg-text-main hover:text-page-bg transition-colors">
          {t("proj_back", "Повернутися до архіву")}
        </Link>
      </div>
    );
  }

  const title = projectRaw[`Title_${lang}`] || projectRaw.Title_UA || projectRaw.title || "";
  const type = projectRaw[`Type_${lang}`] || projectRaw.Type_UA || projectRaw.type || projectRaw.Type || "";
  const student = projectRaw[`Student_${lang}`] || projectRaw.Student_UA || projectRaw.student || "";
  const year = projectRaw.Year || projectRaw.year || "";
  const description = projectRaw[`Desc_${lang}`] || projectRaw.Desc_UA || projectRaw.description || "";
  const course = projectRaw[`Course_${lang}`] || projectRaw.Course_UA || projectRaw.course || "";
  const curator = projectRaw[`Curator_${lang}`] || projectRaw.Curator_UA || projectRaw.curator || "";
  const quote = projectRaw[`Quote_${lang}`] || projectRaw.Quote_UA || projectRaw.quote || "";

  // Support both legacy gallery structure and new unified media lookup
  const mediaItems = data?.multimedia?.filter((m: any) => 
    m.Category === `Project_${id}` || 
    m.Category === `ProjectGallery_${id}` ||
    m.Category === id || 
    m.ID === id
  ) || [];

  return (
    <div className="flex flex-col w-full bg-page-bg text-text-main min-h-screen">
      {/* Top Banner / Breadcrumb */}
      <section className="border-b-2 border-border-main bg-surface-main p-6 lg:px-12 flex items-center">
        <Link to="/projects" className="font-mono text-xs uppercase tracking-widest flex items-center gap-2 hover:underline underline-offset-4 opacity-70 hover:opacity-100 transition-opacity">
          <ArrowLeft className="w-4 h-4" /> {t("proj_back", "Архів проєктів")}
        </Link>
      </section>

      {/* Project Header */}
      <section className="p-6 md:p-12 lg:p-16 border-b-2 border-border-main">
        <div className="max-w-4xl">
          <div className="flex gap-4 mb-6">
            <span className="font-mono text-[10px] sm:text-xs text-text-dim border border-border-soft px-3 py-1 uppercase">{type}</span>
            <span className="font-mono text-[10px] sm:text-xs text-text-main uppercase font-bold border border-border-main px-3 py-1">{year}</span>
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl lg:text-[6rem] font-bold leading-[0.85] tracking-[-0.04em] uppercase text-balance mb-12"
          >
            {title}
          </motion.h1>
          
          <div className="flex flex-col sm:flex-row gap-8 font-mono text-sm uppercase tracking-widest border-t-2 border-border-main pt-8">
            <div>
              <span className="text-text-dim block mb-1">{t("proj_detail_student", "Студент(ка)")}</span>
              <span className="font-bold">{student}</span>
            </div>
            {course && (
              <div>
                <span className="text-text-dim block mb-1">{t("proj_detail_course", "Дисципліна")}</span>
                <span className="font-bold">{course}</span>
              </div>
            )}
            {curator && (
              <div>
                <span className="text-text-dim block mb-1">{t("proj_detail_curator", "Куратор")}</span>
                <span className="font-bold">{curator}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Project content */}
      <section className="grid grid-cols-1 lg:grid-cols-12 divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-border-main">
        {/* Main images */}
        <div className="lg:col-span-8 p-6 md:p-12 space-y-12 bg-ink">
          {(projectRaw.Image || projectRaw.image || projectRaw.img || projectRaw.Media || projectRaw.media || projectRaw.Image_2x || projectRaw.Image_Mobile || projectRaw.Image_Mobile_2x || projectRaw.Image_Tablet || projectRaw.Image_Tablet_2x) ? (
            <ResponsiveImage 
              desktopUrl={projectRaw.Image || projectRaw.image || projectRaw.img || projectRaw.Media || projectRaw.media || ""}
              desktopUrl2x={projectRaw.Image_2x || projectRaw.image_2x || projectRaw.Media_2x || projectRaw.media_2x || ""}
              tabletUrl={projectRaw.Image_Tablet || projectRaw.image_Tablet || projectRaw.Media_Tablet || projectRaw.media_Tablet || ""}
              tabletUrl2x={projectRaw.Image_Tablet_2x || projectRaw.image_Tablet_2x || projectRaw.Media_Tablet_2x || projectRaw.media_Tablet_2x || ""}
              mobileUrl={projectRaw.Image_Mobile || projectRaw.image_Mobile || projectRaw.Media_Mobile || projectRaw.media_Mobile || ""}
              mobileUrl2x={projectRaw.Image_Mobile_2x || projectRaw.image_Mobile_2x || projectRaw.Media_Mobile_2x || projectRaw.media_Mobile_2x || ""}
              alt={title}
              className="w-full h-auto border-2 border-border-main object-cover"
            />
          ) : (
            <div className="aspect-video w-full border-2 border-border-main flex items-center justify-center bg-surface-main">
              <span className="font-mono text-xs uppercase tracking-widest text-text-dim">{t("proj_no_image", "Зображення відсутнє")}</span>
            </div>
          )}

          {quote && (
            <blockquote className="border-l-4 border-accent-blue pl-6 py-2 my-8 italic font-medium text-xl lg:text-2xl text-page-bg opacity-90">
              {quote}
            </blockquote>
          )}

          {/* Render responsive media */}
          {mediaItems.length > 0 && (
            <div className="pt-8 grid gap-12">
              {mediaItems.map((m: any, idx: number) => {
                 const urlDesktop = (m.Image || m.image || m.img || m.Media || m.media || m.Url || m.url || m.Media || m.media || "").trim();
                 const urlDesktop2x = (m.Image_2x || m.image_2x || m.Media_2x || m.media_2x || m.Url_2x || m.url_2x || "").trim();
                 const urlMobile = (m.Image_Mobile || m.image_Mobile || m.Media_Mobile || m.media_Mobile || m.Url_Mobile || m.url_mobile || "").trim();
                 const urlMobile2x = (m.Image_Mobile_2x || m.image_Mobile_2x || m.Media_Mobile_2x || m.media_Mobile_2x || m.Url_Mobile_2x || m.url_mobile_2x || "").trim();
                 const urlTablet = (m.Image_Tablet || m.image_Tablet || m.Media_Tablet || m.media_Tablet || m.Url_Tablet || m.url_tablet || "").trim();
                 const urlTablet2x = (m.Image_Tablet_2x || m.image_Tablet_2x || m.Media_Tablet_2x || m.media_Tablet_2x || m.Url_Tablet_2x || m.url_tablet_2x || "").trim();

                 if (!urlDesktop && !urlMobile && !urlTablet && !urlDesktop2x) return null;
                 
                 const isVideo = m.Type?.toLowerCase() === "video" || urlDesktop.includes("youtube.com") || urlDesktop.includes("youtu.be");
                 
                 if (isVideo) {
                    const isYt = urlDesktop.includes("youtube.com") || urlDesktop.includes("youtu.be");
                    if (isYt) {
                       let videoId = urlDesktop.includes("v=") ? urlDesktop.split("v=")[1].split("&")[0] : urlDesktop.split("youtu.be/")[1].split("?")[0];
                       return (
                          <div key={idx} className="aspect-video w-full border-2 border-border-main">
                            <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${videoId}`} title="YouTube Video" frameBorder="0" allowFullScreen></iframe>
                          </div>
                       );
                    }
                    return (
                      <div key={idx} className="w-full border-2 border-border-main aspect-video bg-ink relative">
                        <video controls playsInline className="w-full h-full object-cover">
                          {urlMobile && <source src={urlMobile.includes("drive.google.com") ? formatDriveLink(urlMobile).replace('/view', '/preview') : urlMobile} media="(max-width: 768px)" />}
                          {urlDesktop && <source src={urlDesktop.includes("drive.google.com") ? formatDriveLink(urlDesktop).replace('/view', '/preview') : urlDesktop} />}
                        </video>
                      </div>
                    );
                 }

                 return (
                   <ResponsiveImage 
                     key={idx}
                     desktopUrl={urlDesktop}
                     desktopUrl2x={urlDesktop2x}
                     tabletUrl={urlTablet}
                     tabletUrl2x={urlTablet2x}
                     mobileUrl={urlMobile}
                     mobileUrl2x={urlMobile2x}
                     alt={`${title} media ${idx}`}
                     className="w-full h-auto object-cover border-2 border-border-main"
                   />
                 );
               })}
            </div>
          )}
        </div>
        
        {/* Project info sidebar */}
        <div className="lg:col-span-4 p-6 md:p-12 bg-surface-main">
          <div className="sticky top-20">
            <span className="font-mono text-xs text-text-dim block mb-6 uppercase tracking-widest">{t("proj_about_lbl", "Про проєкт")}</span>
            <div className="prose prose-invert max-w-none font-light leading-relaxed text-text-main opacity-90 text-sm md:text-base">
              {description ? (
                <p className="whitespace-pre-line">{description}</p>
              ) : (
                <p>{t("proj_no_desc", "Детальний опис проєкту ще не оновлено в базі даних.")}</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
