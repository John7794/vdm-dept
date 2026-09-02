const fs = require('fs');
let content = fs.readFileSync('src/pages/Programs.tsx', 'utf8');

content = content.replace(
  /<div className="p-6 md:p-12 bg-surface-main">\s*<div className="space-y-12 max-w-3xl">/g,
  '<div className="p-6 md:p-12 flex-grow bg-surface-main">\n            <div className="space-y-12">'
);

fs.writeFileSync('src/pages/Programs.tsx', content);
