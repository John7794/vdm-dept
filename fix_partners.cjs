const fs = require('fs');
let content = fs.readFileSync('src/pages/About.tsx', 'utf8');

// Replace partner logic mapping
const partnerLogicOld = `  const partnerImagesRaw = data?.multimedia?.filter((m: any) => m.Category === "Partner") || [];
  const partnerImages = partnerImagesRaw.length > 0
    ? partnerImagesRaw.map((m: any) => formatDriveLink(m.Image || m.image || m.img || m.Media || m.media || m.Url || m.url || m.Media || m.media || "")).filter((u: string) => u !== "")
    : [
        "https://via.placeholder.com/300x150/1A1A1A/FFFFFF?text=Partner+1",
        "https://via.placeholder.com/300x150/1A1A1A/FFFFFF?text=Partner+2",
        "https://via.placeholder.com/300x150/1A1A1A/FFFFFF?text=Partner+3",
        "https://via.placeholder.com/300x150/1A1A1A/FFFFFF?text=Partner+4",
        "https://via.placeholder.com/300x150/1A1A1A/FFFFFF?text=Partner+5",
      ];`;

const partnerLogicNew = `  const partnerImagesRaw = data?.multimedia?.filter((m: any) => m.Category === "Partner") || [];
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
      ];`;

content = content.replace(partnerLogicOld, partnerLogicNew);

// Replace mapping block
const partnerMapOld = `              <div className="flex animate-marquee min-w-max gap-8 md:gap-12 hover:animation-play-state-paused">
                {[...partnerImages, ...partnerImages, ...partnerImages, ...partnerImages].map((imgUrl, idx) => (
                    <div key={idx} className="w-[160px] md:w-[200px] flex-shrink-0 flex items-center justify-center group cursor-default">
                      <img 
                        src={imgUrl} 
                        alt={\`Partner \${idx + 1}\`} 
                        className="max-w-full max-h-[70px] md:max-h-[90px] object-contain transition-all duration-300 partner-logo"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>`;

const partnerMapNew = `              <div className="flex animate-marquee min-w-max gap-8 md:gap-12 hover:animation-play-state-paused">
                {[...partners, ...partners, ...partners, ...partners].map((partner, idx) => {
                  const content = (
                    <img 
                      src={partner.imgUrl} 
                      alt={\`Partner \${idx + 1}\`} 
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
              </div>`;

content = content.replace(partnerMapOld, partnerMapNew);

fs.writeFileSync('src/pages/About.tsx', content);
