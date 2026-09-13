const fs = require('fs');
let content = fs.readFileSync('src/pages/News.tsx', 'utf8');

// Remove sidebar
content = content.replace(/\{\/\* Sidebar \*\/\}\s*<div className="md:col-span-4 lg:col-span-3 border-t-2 md:border-t-0 border-border-main relative">[\s\S]*?<\/aside>\s*<\/div>/, '');

// Fix layout for main news list
content = content.replace(/<div className="md:col-span-8 lg:col-span-9 divide-y-2 lg:border-r-2 border-border-main divide-border-main">/, '<div className="md:col-span-12 divide-y-2 border-border-main divide-border-main">');

fs.writeFileSync('src/pages/News.tsx', content);
