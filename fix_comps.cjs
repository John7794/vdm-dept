const fs = require('fs');
let content = fs.readFileSync('src/pages/Programs.tsx', 'utf8');

// I will just rip out anything from {bCompetencies.length > 0 && ( down to )} 
// Let's use a simpler replace
content = content.replace(/\{bCompetencies\.length > 0 && \([\s\S]*?\)\}/, "");
content = content.replace(/\{mCompetencies\.length > 0 && \([\s\S]*?\)\}/, "");
content = content.replace(/\{phdCompetencies\.length > 0 && \([\s\S]*?\)\}/, "");

fs.writeFileSync('src/pages/Programs.tsx', content);
