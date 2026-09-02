const fs = require('fs');
let content = fs.readFileSync('src/pages/Programs.tsx', 'utf8');

const blocks = [
  '            {bCompetencies.length > 0 && (',
  '            {mCompetencies.length > 0 && (',
  '            {phdCompetencies.length > 0 && ('
];

blocks.forEach(block => {
  const startIndex = content.indexOf(block);
  if (startIndex !== -1) {
    const endStr = '            )}';
    let endIndex = content.indexOf(endStr, startIndex);
    if (endIndex !== -1) {
      endIndex += endStr.length;
      content = content.slice(0, startIndex) + content.slice(endIndex);
    }
  }
});

fs.writeFileSync('src/pages/Programs.tsx', content);
