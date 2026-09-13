const fs = require('fs');
let content = fs.readFileSync('src/pages/Programs.tsx', 'utf8');

content = content.replace(
  /<div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mt-4 font-mono text-sm tracking-widest uppercase text-text-main">/g,
  '<div className="flex gap-4 sm:gap-8 mt-4 font-mono text-[10px] sm:text-sm tracking-widest uppercase text-text-main">'
);

fs.writeFileSync('src/pages/Programs.tsx', content);
