const fs = require('fs');
let content = fs.readFileSync('src/components/layout/Navbar.tsx', 'utf8');

// 1. Add useRef and useEffect imports if they don't exist
if (!content.includes('useRef')) {
  content = content.replace('useState }', 'useState, useRef, useEffect }');
}

// 2. Add ref definition and useEffect logic
const hookInject = `  const [isLangOpen, setIsLangOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);`;

content = content.replace('  const [isLangOpen, setIsLangOpen] = useState(false);', hookInject);

// 3. Add ref to the wrapper div
content = content.replace(
  /<div className="relative flex items-center">/,
  '<div className="relative flex items-center" ref={langDropdownRef}>'
);

fs.writeFileSync('src/components/layout/Navbar.tsx', content);
