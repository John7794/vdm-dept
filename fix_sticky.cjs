const fs = require('fs');
let content = fs.readFileSync('src/pages/Programs.tsx', 'utf8');

// Update section headers to sticky top-20 (80px)
content = content.replace(/sticky top-0 lg:top-\[72px\]/g, 'sticky top-[80px]');

// Update section scroll-mt to 80px
content = content.replace(/scroll-mt-\[72px\]/g, 'scroll-mt-[80px]');

// Update Sidebar sticky position to have more breathing room, maybe top-[120px]
content = content.replace(/sticky top-\[80px\] p-8 xl:p-12/g, 'sticky top-[120px] p-8 xl:p-12');

fs.writeFileSync('src/pages/Programs.tsx', content);
