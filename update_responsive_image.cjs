const fs = require('fs');
let content = fs.readFileSync('src/components/ResponsiveImage.tsx', 'utf8');

if (!content.includes('onClick')) {
  content = content.replace(
    'className?: string;',
    'className?: string;\n  onClick?: (e: React.MouseEvent) => void;'
  );
  content = content.replace(
    'alt, className = ""',
    'alt, className = "", onClick'
  );
  content = content.replace(
    '<picture className={`block ${className}`}>',
    '<picture className={`block ${className} ${onClick ? "cursor-pointer" : ""}`} onClick={onClick}>'
  );
}

fs.writeFileSync('src/components/ResponsiveImage.tsx', content);
