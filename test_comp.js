const fs = require('fs');
const content = fs.readFileSync('src/pages/Programs.tsx', 'utf8');
const modified = content.replace(
  'const progDisciplines = disciplines.filter(d => d.Type_Programme === prog.progId);',
  'const progDisciplines = disciplines.filter(d => d.Type_Programme === prog.progId);\n  console.log("PROG ID", prog.progId, "DISCS:", disciplines.length, "PROG DISCS:", progDisciplines.length);'
);
fs.writeFileSync('src/pages/Programs.tsx', modified);
