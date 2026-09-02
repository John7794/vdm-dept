const fs = require('fs');
let content = fs.readFileSync('src/pages/Programs.tsx', 'utf8');

// 1. Fix the t() calls for prog_lbl_disciplines
content = content.replace(/t\("prog_lbl_disciplines"\) \|\| "Дисципліни"/g, 't("prog_lbl_disciplines", "Дисципліни")');

// 2. Fix the progDisciplines filtering logic
const oldFilter = 'const progDisciplines = disciplines.filter(d => String(d.Type_Programme).trim() === String(prog.progId).trim());';
const newFilter = `let progDisciplines = [];
  const level = prog.Level_UA || prog.Level || prog.level || prog.Degree_UA || "";
  
  if (level.includes("Бакалавр")) {
    progDisciplines = disciplines.filter(d => String(d.Degree_UA).includes("Бакалаврат") || String(d.Degree_UA).includes("Бакалавр"));
  } else if (level.includes("Магістр")) {
    progDisciplines = disciplines.filter(d => String(d.Degree_UA).includes("Магістратура") || String(d.Degree_UA).includes("Магістр"));
  } else if (level.includes("Аспірант") || level.includes("PhD")) {
    progDisciplines = disciplines.filter(d => String(d.Degree_UA).includes("Аспірантура") || String(d.Degree_UA).includes("Аспірант"));
  }`;

content = content.replace(oldFilter, newFilter);

fs.writeFileSync('src/pages/Programs.tsx', content);
