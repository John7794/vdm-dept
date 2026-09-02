const fs = require('fs');
let content = fs.readFileSync('src/pages/Programs.tsx', 'utf8');

// I'll just remove anything between the end of the div containing the disciplines and the end of the flex-grow div.
// Or we can just find where bCompetencies is and remove its surrounding code.
const regex1 = /\{bCompetencies\S*\.map[\s\S]*?\}/g;
const regex2 = /\{mCompetencies\S*\.map[\s\S]*?\}/g;
const regex3 = /\{phdCompetencies\S*\.map[\s\S]*?\}/g;

content = content.replace(regex1, "");
content = content.replace(regex2, "");
content = content.replace(regex3, "");

fs.writeFileSync('src/pages/Programs.tsx', content);
