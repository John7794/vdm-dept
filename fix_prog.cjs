const fs = require('fs');
let content = fs.readFileSync('src/pages/Programs.tsx', 'utf8');

content = content.replace(
  '<section className="grid grid-cols-1 lg:grid-cols-2 divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-border-main border-b-2 border-border-main">',
  '<section className="grid grid-cols-1 divide-y-2 divide-border-main border-b-2 border-border-main">'
);

fs.writeFileSync('src/pages/Programs.tsx', content);
