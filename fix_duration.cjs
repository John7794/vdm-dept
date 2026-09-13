const fs = require('fs');
let content = fs.readFileSync('src/pages/Programs.tsx', 'utf8');

content = content.replace(
  /<span className="text-text-main ml-1 sm:ml-2">/g,
  '<span className="text-text-main block mt-1 sm:mt-0 sm:inline sm:ml-2">'
);

fs.writeFileSync('src/pages/Programs.tsx', content);
