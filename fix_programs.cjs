const fs = require('fs');
let content = fs.readFileSync('src/pages/Programs.tsx', 'utf8');

const updatedLogic = `  const bPrograms = useMemo(() => programs.filter((p: any) => 
    (p.Level_UA || p.Level || p.level) === "Бакалавріат" || (p.Level_UA || p.Level || p.level) === "Бакалавр"
  ).map((p: any) => {
    const title = p.Title_UA || p.title || p.Title || "";
    let disciplines = [];
    if (title.toLowerCase().includes("образотворче мистецтво")) {
      return {
        ...p,
        Title_UA: "Інтер'єр та просторовий дизайн",
        Title_EN: "Interior and Spatial Design",
        Title_DE: "Interieur und räumliches Design",
        Title_PL: "Architektura wnętrz i projektowanie przestrzenne",
        Code: "022 Дизайн",
        disciplines: [
          { name: "Історія мистецтва, архітектури і дизайну, частина 3", semester: 3 },
          { name: "Історія мистецтва, архітектури та дизайну України", semester: 4 }
        ]
      };
    } else {
      return {
        ...p,
        Code: "022 Дизайн",
        disciplines: [
          { name: "Композиція та кольорознавство", semester: 1 },
          { name: "Основи проектної та комп'ютерної графіки", semester: "1, 2" },
          { name: "Основи рисунку та живопису", semester: "1, 2" },
          { name: "Навчальна практика", semester: 2 },
          { name: "Формотворення та макетування", semester: 2 },
          { name: "Історія мистецтва, архітектури і дизайну", semester: 3 },
          { name: "Основи візуального дизайну", semester: 3 },
          { name: "Рисунок і живопис", semester: "3, 4, 5, 6" },
          { name: "Типографіка в дизайні", semester: 3 },
          { name: "Фотографіка в дизайні", semester: 3 },
          { name: "Брендинг і корпоративний дизайн", semester: 4 },
          { name: "Імерсивні медіа", semester: 4 },
          { name: "Історія мистецтва, архітектури та дизайну України", semester: 4 },
          { name: "Традиційні графічні техніки", semester: 4 },
          { name: "Вебдизайн", semester: 5 },
          { name: "Відеографіка", semester: 5 },
          { name: "Графічне та конструктивне формоутворення", semester: 5 },
          { name: "Інформаційний дизайн та візуалізація даних", semester: 5 },
          { name: "Історія дизайну візуальних комунікацій", semester: 5 },
          { name: "Технології моушн-дизайну", semester: 5 },
          { name: "Технології та матеріали у дизайні візуальних комунікацій", semester: 5 },
          { name: "Візуальні комунікації в міському середовищі", semester: 6 },
          { name: "Дизайн персонажу в цифрових медіа", semester: 6 },
          { name: "Експериментально-цифрова типографіка", semester: 6 },
          { name: "Етнодизайн", semester: 6 },
          { name: "Рекламний дизайн і копірайтинг", semester: 6 },
          { name: "Типографіка і верстка текстів", semester: 6 },
          { name: "Авторський мультимедійний проект", semester: 7 },
          { name: "Експериментальний рисунок і живопис", semester: 7 },
          { name: "Ілюстрація в дизайні візуальних комунікацій", semester: 7 },
          { name: "Інтерактивний дизайн міського простору", semester: 7 },
          { name: "Концептуальний дизайн візуальних комунікацій", semester: 7 },
          { name: "Виконання та захист бакалаврської кваліфікаційної роботи", semester: 8 },
          { name: "Інтеграційний дизайн", semester: 8 },
          { name: "Теорії та методики у візуальному дизайні", semester: 8 },
        ]
      }
    }
  }), [programs]);
  
  const mPrograms = useMemo(() => programs.filter((p: any) => 
    (p.Level_UA || p.Level || p.level) === "Магістратура"
  ).map((p: any) => ({
    ...p,
    Code: "022 Дизайн",
    disciplines: [
      { name: "Основні тенденції розвитку сучасного дизайну", semester: 1 },
      { name: "Перспективи розвитку дизайну та інформаційного середовища", semester: 1 },
      { name: "Теорія реклами і фірмовий стиль", semester: 1 },
      { name: "Графічне та конструктивне формоутворення в дизайні", semester: 2 },
      { name: "Мультимедійний дизайн", semester: 2 },
      { name: "Типографіка і дизайн реклами", semester: 2 },
      { name: "Курсовий проект", semester: 3 },
      { name: "Виконання та захист магістерської кваліфікаційної роботи", semester: 3 },
    ]
  })), [programs]);
  
  const phdPrograms = useMemo(() => programs.filter((p: any) => 
    (p.Level_UA || p.Level || p.level) === "Аспірантура"
  ).map((p: any) => ({
    ...p,
    Code: "022 Дизайн",
    disciplines: [
      { name: "Аналітичні методи дослідження та теоретичні моделі в дизайні", semester: 2 },
      { name: "Етнокультурні традиції в сучасному дизайні", semester: 4 },
      { name: "Історичні парадигми та сучасні теорії в архітектурі та дизайні", semester: 4 }
    ]
  })), [programs]);`;

const startStr = "  const bPrograms = useMemo(() => programs.filter((p: any) =>";
const endStr = "  const parseCompetencies = (prog: any) => {";

const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + updatedLogic + "\n" + content.substring(endIndex);
  fs.writeFileSync('src/pages/Programs.tsx', content);
  console.log("Programs mapping updated successfully.");
} else {
  console.log("Could not find blocks");
}
