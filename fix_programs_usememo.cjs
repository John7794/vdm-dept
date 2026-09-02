const fs = require('fs');
let content = fs.readFileSync('src/pages/Programs.tsx', 'utf8');

const startStr = "  const bPrograms = useMemo(() => programs.filter((p: any) =>";
const endStr = "  const parseCompetencies = (prog: any) => {";

const updatedLogic = `  const bPrograms = useMemo(() => programs.filter((p: any) => 
    (p.Level_UA || p.Level || p.level) === "Бакалавріат" || (p.Level_UA || p.Level || p.level) === "Бакалавр"
  ).map((p: any) => {
    const title = p.Title_UA || p.title || p.Title || "";
    if (title.toLowerCase().includes("образотворче мистецтво")) {
      return {
        ...p,
        Title_UA: "Інтер'єр та просторовий дизайн",
        Title_EN: "Interior and Spatial Design",
        Title_DE: "Interieur und räumliches Design",
        Title_PL: "Architektura wnętrz i projektowanie przestrzenne",
        Code: "B2 Дизайн",
        matchName: "Інтер'єр та просторовий дизайн"
      };
    } else {
      return {
        ...p,
        Code: "B2 Дизайн",
        matchName: "Дизайн (Графічний дизайн)"
      }
    }
  }), [programs]);
  
  const mPrograms = useMemo(() => programs.filter((p: any) => 
    (p.Level_UA || p.Level || p.level) === "Магістратура"
  ).map((p: any) => ({
    ...p,
    matchName: "Візуальна комунікація"
  })), [programs]);
  
  const phdPrograms = useMemo(() => programs.filter((p: any) => 
    (p.Level_UA || p.Level || p.level) === "Аспірантура"
  ).map((p: any) => ({
    ...p,
    matchName: "Дизайн"
  })), [programs]);`;

const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + updatedLogic + "\n" + content.substring(endIndex);
  fs.writeFileSync('src/pages/Programs.tsx', content);
  console.log("Programs mapping updated successfully.");
} else {
  console.log("Could not find blocks");
}
