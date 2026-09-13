import { formatDriveLink, cleanHtml } from "../lib/utils";
import ResponsiveImage from "./ResponsiveImage";

export default function RichContentBlocks({ blocks, lang }: { blocks: any[], lang: string }) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="space-y-12">
      {blocks.map((block: any, idx: number) => {
        const type = (block.Type || block.type || "").toLowerCase().trim();
        const text = block[`Text_${lang}`] || block[lang] || block.Text_UA || block.text || block.Text || "";
        const url = (block.Image || block.image || block.img || block.Media || block.media || block.Url || block.url || "").trim();
        const url2x = (block.Image_2x || block.image_2x || block.Media_2x || block.media_2x || block.Url_2x || block.url_2x || "").trim();
        const urlTablet = (block.Image_Tablet || block.image_Tablet || block.Media_Tablet || block.media_Tablet || block.Url_Tablet || block.url_tablet || "").trim();
        const urlTablet2x = (block.Image_Tablet_2x || block.image_Tablet_2x || block.Media_Tablet_2x || block.media_Tablet_2x || block.Url_Tablet_2x || block.url_tablet_2x || "").trim();
        const urlMobile = (block.Image_Mobile || block.image_Mobile || block.Media_Mobile || block.media_Mobile || block.Url_Mobile || block.url_mobile || "").trim();
        const urlMobile2x = (block.Image_Mobile_2x || block.image_Mobile_2x || block.Media_Mobile_2x || block.media_Mobile_2x || block.Url_Mobile_2x || block.url_mobile_2x || "").trim();

        switch (type) {
          case "text":
          case "paragraph":
            if (!text) return null;
            return (
              <div 
                key={idx} 
                className="prose prose-invert max-w-none prose-p:text-text-main prose-headings:text-text-main prose-a:text-accent-blue font-light leading-relaxed text-lg lg:text-xl text-balance whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: cleanHtml(text) }} 
              />
            );
          
          case "quote":
            if (!text) return null;
            return (
              <blockquote key={idx} className="border-l-4 border-accent-blue pl-6 py-2 my-8 italic font-medium text-xl lg:text-2xl text-text-main opacity-90">
                {text}
              </blockquote>
            );
          
          case "image":
          case "photo":
            if (!url && !urlMobile && !urlTablet && !url2x) return null;
            return (
              <figure key={idx} className="my-12">
                <ResponsiveImage 
                  desktopUrl={url}
                  desktopUrl2x={url2x}
                  tabletUrl={urlTablet}
                  tabletUrl2x={urlTablet2x}
                  mobileUrl={urlMobile}
                  mobileUrl2x={urlMobile2x}
                  alt="Content block"
                  className="w-full h-auto object-cover border-2 border-border-main"
                />
                {text && (
                  <figcaption className="mt-4 font-mono text-xs text-text-dim uppercase tracking-widest text-center">
                    {text}
                  </figcaption>
                )}
              </figure>
            );
            
          case "video":
          case "animation":
            if (!url) return null;
            
            // Handle YouTube
            if (url.includes("youtube.com") || url.includes("youtu.be")) {
              let videoId = "";
              if (url.includes("v=")) {
                videoId = url.split("v=")[1].split("&")[0];
              } else if (url.includes("youtu.be/")) {
                videoId = url.split("youtu.be/")[1].split("?")[0];
              }
              return (
                <div key={idx} className="aspect-video w-full border-2 border-border-main my-12 relative">
                  <iframe 
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${videoId}`} 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
              );
            }
            
            // Handle standard MP4 or Google Drive video (using preview endpoint)
            const videoUrl = url.includes("drive.google.com") ? formatDriveLink(url).replace('/view', '/preview') : url;
            
            return (
              <div key={idx} className="aspect-video w-full border-2 border-border-main my-12 relative bg-ink">
                {url.includes("drive.google.com") ? (
                  <iframe 
                    className="absolute inset-0 w-full h-full"
                    src={videoUrl} 
                    title="Google Drive video player" 
                    allow="autoplay"
                  ></iframe>
                ) : (
                  <video 
                    className="absolute inset-0 w-full h-full object-cover" 
                    src={videoUrl} 
                    controls 
                    muted 
                    loop 
                    playsInline 
                  >
                     {urlMobile && <source src={urlMobile.includes("drive.google.com") ? formatDriveLink(urlMobile).replace('/view', '/preview') : urlMobile} media="(max-width: 768px)" />}
                     {url && <source src={videoUrl} />}
                  </video>
                )}
              </div>
            );

          default:
            // Fallback for simple images if type is empty but URL is provided
            if ((url || urlMobile || urlTablet || url2x) && !text) {
               return (
                  <ResponsiveImage 
                    key={idx}
                    desktopUrl={url}
                    desktopUrl2x={url2x}
                    tabletUrl={urlTablet}
                    tabletUrl2x={urlTablet2x}
                    mobileUrl={urlMobile}
                    mobileUrl2x={urlMobile2x}
                    alt="Content block"
                    className="w-full h-auto object-cover border-2 border-border-main my-8"
                  />
               );
            }
            return null;
        }
      })}
    </div>
  );
}
