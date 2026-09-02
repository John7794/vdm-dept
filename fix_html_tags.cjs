const fs = require('fs');
let content = fs.readFileSync('src/pages/Programs.tsx', 'utf8');

// I will just replace from `</h4>` down to `)}` for those specific 3 blocks that are broken.
// There are exactly three of these broken blocks right after `</div>`
content = content.replace(/<\/h4>[\s\S]*?<\/ul>\s*<\/div>\s*\)\}/g, "");

fs.writeFileSync('src/pages/Programs.tsx', content);
