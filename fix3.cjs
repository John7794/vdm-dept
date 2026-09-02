const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const badStart = `  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => prev + 1);
    }, 5000);
    return (
    <div className="flex flex-col w-full bg-page-bg">`;

const goodStart = `  useEffect(() => {
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

  return (
    <div className="flex flex-col w-full bg-page-bg">`;

content = content.replace(badStart, goodStart);
fs.writeFileSync('src/pages/Home.tsx', content);
