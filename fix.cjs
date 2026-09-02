const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// The first block failed because I probably missed some line. I'll just regex replace the entire section.
content = content.replace(/  const baseSlides = cmsBanners\.length > 0 \? cmsBanners : defaultSlides;[\s\S]*?  return \(/, `  const baseSlides = cmsBanners.length > 0 ? cmsBanners : defaultSlides;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => prev + 1);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slideIndex = currentSlide % baseSlides.length;
  const directionType = currentSlide % 4; // 0, 1, 2, 3

  const variants = {
    enter: (direction) => {
      switch(direction) {
        case 0: return { x: '100%', y: 0 };
        case 1: return { x: 0, y: '100%' };
        case 2: return { x: '-100%', y: 0 };
        case 3: return { x: 0, y: '-100%' };
        default: return { x: '100%', y: 0 };
      }
    },
    center: { x: 0, y: 0, zIndex: 1 },
    exit: (direction) => {
      switch(direction) {
        case 0: return { x: '-100%', y: 0, zIndex: 0 };
        case 1: return { x: 0, y: '-100%', zIndex: 0 };
        case 2: return { x: '100%', y: 0, zIndex: 0 };
        case 3: return { x: 0, y: '100%', zIndex: 0 };
        default: return { x: '-100%', y: 0, zIndex: 0 };
      }
    }
  };

  return (`);

fs.writeFileSync('src/pages/Home.tsx', content);
