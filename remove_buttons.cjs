const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// Remove link and btnLabel properties
content = content.replace(/\s*link:\s*"#",\s*btnLabel:\s*t\("home_area_\d+_btn",\s*"Детальніше"\),/g, '');

// Remove the Link div
const linkDivRegex = /\s*<div>\s*<Link[\s\S]*?<\/Link>\s*<\/div>/;
content = content.replace(linkDivRegex, '');

fs.writeFileSync('src/pages/Home.tsx', content);
