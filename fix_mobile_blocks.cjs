const fs = require('fs');
let content = fs.readFileSync('src/pages/Programs.tsx', 'utf8');

// 1. Revert header to single row
content = content.replace(
  '<div className="p-4 border-b border-border-soft flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3 bg-surface-mut">',
  '<div className="p-4 border-b border-border-soft flex justify-between items-center gap-2 bg-surface-mut">'
);
content = content.replace(
  '<a href="#" className="font-mono text-xs hover:text-accent-blue transition-colors underline underline-offset-4 decoration-border-main hover:decoration-accent-blue">Завантажити програму (PDF)</a>',
  '<a href="#" className="font-mono text-[10px] sm:text-xs hover:text-accent-blue transition-colors underline underline-offset-4 decoration-border-main hover:decoration-accent-blue text-right leading-tight">Завантажити програму (PDF)</a>'
);


// 2. Make sure Duration and Degree are in one row, and undo the block wrapping for values just to be safe, making them inline but allowing flex wrap if needed.
content = content.replace(
  /<div className="flex gap-4 sm:gap-8 mt-4 font-mono text-\[10px\] sm:text-sm tracking-widest uppercase text-text-main">/g,
  '<div className="flex flex-row justify-between sm:justify-start gap-4 sm:gap-8 mt-4 font-mono text-[10px] sm:text-sm tracking-widest uppercase text-text-main">'
);

content = content.replace(
  /<span className="text-text-main block sm:inline mt-1 sm:mt-0">/g,
  '<span className="text-text-main ml-1 sm:ml-2">'
);

fs.writeFileSync('src/pages/Programs.tsx', content);
