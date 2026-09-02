const fs = require('fs');
let content = fs.readFileSync('src/pages/ProjectDetail.tsx', 'utf8');

const hooksInject = `  const mediaItems = data?.multimedia?.filter((m: any) => 
    m.Category === \`Project_\${id}\` || 
    m.Category === \`ProjectGallery_\${id}\` ||
    m.Category === id || 
    m.ID === id
  ) || [];

  // 1. Collect all valid image URLs for the gallery
  const allImageUrls = [];
  const mainImageDesktop = (projectRaw.Image || projectRaw.image || projectRaw.img || projectRaw.Media || projectRaw.media || "").trim();
  if (mainImageDesktop) {
    allImageUrls.push(formatDriveLink(mainImageDesktop));
  }

  mediaItems.forEach((m) => {
    const urlDesktop = (m.Image || m.image || m.img || m.Media || m.media || m.Url || m.url || "").trim();
    const isVideo = m.Type?.toLowerCase() === "video" || urlDesktop.includes("youtube.com") || urlDesktop.includes("youtu.be");
    if (urlDesktop && !isVideo) {
      allImageUrls.push(formatDriveLink(urlDesktop));
    }
  });

  const [lightboxData, setLightboxData] = useState<{ index: number } | null>(null);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxData(prev => prev ? { index: (prev.index - 1 + allImageUrls.length) % allImageUrls.length } : null);
  };
  
  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxData(prev => prev ? { index: (prev.index + 1) % allImageUrls.length } : null);
  };
`;

content = content.replace(/  const mediaItems = data\?\.multimedia\?\.filter[\s\S]*?\|\| \[\];/m, hooksInject);

// Add onClick to first ResponsiveImage
content = content.replace(
  /className="w-full h-auto border-2 border-border-main object-cover"\s*\/>/m,
  `className="w-full h-auto border-2 border-border-main object-cover"\n              onClick={() => { if (mainImageDesktop) setLightboxData({ index: 0 }) }}\n            />`
);

// Add onClick to mapping ResponsiveImage
content = content.replace(
  /alt=\{\`\$\{title\} media \$\{idx\}\`\}\s*className="w-full h-auto object-cover border-2 border-border-main"\s*\/>/m,
  `alt={\`\${title} media \${idx}\`}\n                     className="w-full h-auto object-cover border-2 border-border-main"\n                     onClick={() => {\n                       const gIdx = allImageUrls.indexOf(formatDriveLink(urlDesktop));\n                       if (gIdx !== -1) setLightboxData({ index: gIdx });\n                     }}\n                   />`
);

// Add lightbox JSX before closing div
const lightboxJsx = `
      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxData && allImageUrls.length > 0 && (
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
            {allImageUrls.length > 1 && (
              <button 
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-paper/40 hover:text-accent-yellow transition-all duration-300 focus-ring outline-none z-[110] opacity-0 group-hover/lightbox:opacity-100 hover:scale-110"
                onClick={handlePrevImage}
                aria-label="Previous image"
              >
                <ChevronLeft className="w-12 h-12 md:w-16 md:h-16" />
              </button>
            )}

            <AnimatePresence mode="wait">
              <motion.img
                key={lightboxData.index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                src={allImageUrls[lightboxData.index]}
                alt="Expanded view"
                className="max-w-full max-h-[90vh] object-contain shadow-2xl cursor-default"
                onClick={(e) => e.stopPropagation()}
              />
            </AnimatePresence>

            {/* Right Nav */}
            {allImageUrls.length > 1 && (
              <button 
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-paper/40 hover:text-accent-yellow transition-all duration-300 focus-ring outline-none z-[110] opacity-0 group-hover/lightbox:opacity-100 hover:scale-110"
                onClick={handleNextImage}
                aria-label="Next image"
              >
                <ChevronRight className="w-12 h-12 md:w-16 md:h-16" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
`;

content = content.replace(/    <\/div>\s*  \);\s*}\s*$/, lightboxJsx);

fs.writeFileSync('src/pages/ProjectDetail.tsx', content);
