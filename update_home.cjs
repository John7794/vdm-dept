const fs = require('fs');

let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// Update imports
content = content.replace(
  'import { motion } from "motion/react";',
  'import { motion, AnimatePresence } from "motion/react";'
);

const oldStateLogic = `  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const { theme } = useTheme();
  const { data, t } = useCms();

  const defaultSlides = [
    "https://drive.google.com/uc?export=view&id=1n7JNFmicxCNLEm0_AFB_-hg5258z7YmG",
    "https://drive.google.com/uc?export=view&id=11dYw0FRts0F248vo_de-BLW1QTUgPZVP",
    "https://drive.google.com/uc?export=view&id=1i0qE12_3C4i-QTjAfvt7fTTfViiz4I9a"
  ];

  const cmsBanners = (data?.multimedia || [])
    .filter((item: any) => {
      const url = (item.Image || item.image || item.img || item.Media || item.media || item.Media || item.media || item.Url || item.url || "").trim();
      return item.Category === "HeroBanner" && url !== "";
    })
    .map((item: any) => {
      const url = (item.Image || item.image || item.img || item.Media || item.media || item.Media || item.media || item.Url || item.url || "").trim();
      return formatDriveLink(url);
    })
    .filter((url: string) => url !== "");

  const getSectionImage = (id: string) => {
    const item = (data?.multimedia || []).find((m: any) => m.ID === id);
    if (item) {
      const url = (item.Image || item.image || item.img || item.Media || item.media || item.Url || item.url || "").trim();
      if (url) return formatDriveLink(url);
    }
    return "";
  };

  const baseSlides = cmsBanners.length > 0 ? cmsBanners : defaultSlides;

  // Clone the first slide at the end to allow a seamless transition back to start
  const slides = [...baseSlides, baseSlides[0]];

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setCurrentSlide((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // When we reach the cloned slide at the end, wait for the animation to finish,
  // then instantly snap back to the first slide without a transition.
  useEffect(() => {
    if (currentSlide === baseSlides.length) {
      const snapTimer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentSlide(0);
      }, 1200); // 1200ms matches the transition duration
      return () => clearTimeout(snapTimer);
    }
  }, [currentSlide, baseSlides.length]);`;

const newStateLogic = `  const [currentSlide, setCurrentSlide] = useState(0);
  const { theme } = useTheme();
  const { data, t } = useCms();

  const defaultSlides = [
    "https://drive.google.com/uc?export=view&id=1n7JNFmicxCNLEm0_AFB_-hg5258z7YmG",
    "https://drive.google.com/uc?export=view&id=11dYw0FRts0F248vo_de-BLW1QTUgPZVP",
    "https://drive.google.com/uc?export=view&id=1i0qE12_3C4i-QTjAfvt7fTTfViiz4I9a"
  ];

  const cmsBanners = (data?.multimedia || [])
    .filter((item: any) => {
      const url = (item.Image || item.image || item.img || item.Media || item.media || item.Media || item.media || item.Url || item.url || "").trim();
      return item.Category === "HeroBanner" && url !== "";
    })
    .map((item: any) => {
      const url = (item.Image || item.image || item.img || item.Media || item.media || item.Media || item.media || item.Url || item.url || "").trim();
      return formatDriveLink(url);
    })
    .filter((url: string) => url !== "");

  const getSectionImage = (id: string) => {
    const item = (data?.multimedia || []).find((m: any) => m.ID === id);
    if (item) {
      const url = (item.Image || item.image || item.img || item.Media || item.media || item.Url || item.url || "").trim();
      if (url) return formatDriveLink(url);
    }
    return "";
  };

  const baseSlides = cmsBanners.length > 0 ? cmsBanners : defaultSlides;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const slideIndex = currentSlide % baseSlides.length;
  const directionType = currentSlide % 4; // 0, 1, 2, 3

  const variants = {
    enter: (direction: number) => {
      switch(direction) {
        case 0: return { x: '100%', y: 0 }; // Справа-наліво
        case 1: return { x: 0, y: '100%' }; // Знизу-вверх
        case 2: return { x: '-100%', y: 0 }; // Зліва-направо
        case 3: return { x: 0, y: '-100%' }; // Зверху-вниз
        default: return { x: '100%', y: 0 };
      }
    },
    center: { x: 0, y: 0 },
    exit: (direction: number) => {
      switch(direction) {
        case 0: return { x: '-100%', y: 0 }; // Справа-наліво
        case 1: return { x: 0, y: '-100%' }; // Знизу-вверх
        case 2: return { x: '100%', y: 0 }; // Зліва-направо
        case 3: return { x: 0, y: '100%' }; // Зверху-вниз
        default: return { x: '-100%', y: 0 };
      }
    }
  };`;

content = content.replace(oldStateLogic, newStateLogic);

const oldSliderRender = `        <div className="absolute inset-0 z-0">
          <div 
            className={\`flex w-full h-full \${isTransitioning ? "transition-transform duration-[1200ms] ease-[cubic-bezier(0.25,1,0.25,1)]" : ""}\`}
            style={{ transform: \`translateX(-\${currentSlide * 100}%)\` }}
          >
            {slides.map((src, i) => (
              <div 
                key={i} 
                className="w-full h-full flex-shrink-0 bg-cover bg-center"
                style={{ backgroundImage: \`url(\${src})\` }}
              />
            ))}
          </div>`;

const newSliderRender = `        <div className="absolute inset-0 z-0 overflow-hidden">
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
              style={{ backgroundImage: \`url(\${baseSlides[slideIndex]})\` }}
            />
          </AnimatePresence>`;

content = content.replace(oldSliderRender, newSliderRender);

fs.writeFileSync('src/pages/Home.tsx', content);
