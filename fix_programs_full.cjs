const fs = require('fs');
let content = fs.readFileSync('src/pages/Programs.tsx', 'utf8');

// Remove import of local disciplinesData
content = content.replace(/import \{ disciplinesData \} from "\.\.\/data\/disciplines";\n/g, "");
content = content.replace(/import \{ ArrowUpRight, CheckCircle2 \} from "lucide-react";/g, 'import { ArrowUpRight } from "lucide-react";');

// Replace ProgramDisciplines component
const newComp = `function ProgramDisciplines({ prog, disciplines, lang, t }: { prog: any, disciplines: any[], lang: string, t: any }) {
  const progDisciplines = disciplines.filter(d => d.Type_Programme === prog.progId);
  
  if (!progDisciplines || progDisciplines.length === 0) return null;

  function extractCourse(semesterStr: string) {
    if (!semesterStr) return 1;
    const matches = String(semesterStr).match(/\\d+/g);
    if (matches && matches.length > 0) {
      const firstNum = parseInt(matches[0], 10);
      return Math.ceil(firstNum / 2);
    }
    return 1;
  }

  const grouped = progDisciplines.reduce((acc, d) => {
    const course = extractCourse(d.Semester_UA || d.Semester_EN || d.semester || "");
    if (!acc[course]) acc[course] = [];
    acc[course].push(d);
    return acc;
  }, {} as Record<number, any[]>);

  const courses = Object.keys(grouped).map(Number).sort((a, b) => a - b);

  return (
    <div className="mt-8 border border-border-soft bg-page-bg/50">
      <div className="p-4 border-b border-border-soft flex justify-between items-center bg-surface-mut">
        <h4 className="font-bold text-sm tracking-widest uppercase">{t("prog_lbl_disciplines") || "Дисципліни"}</h4>
        <a href="#" className="font-mono text-xs hover:text-accent-blue transition-colors underline underline-offset-4 decoration-border-main hover:decoration-accent-blue">Завантажити програму (PDF)</a>
      </div>
      <div className="p-6 space-y-12">
        {courses.map(course => (
          <div key={course} className="space-y-4">
            <h5 className="font-mono font-bold text-sm text-accent-blue uppercase tracking-widest">{course} {lang === "UA" ? "Курс" : "Course"}</h5>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[600px]">
                <thead className="font-mono text-xs text-text-dim border-b border-border-soft">
                  <tr>
                    <th className="pb-3 font-normal">{lang === "UA" ? "Назва дисципліни" : "Discipline"}</th>
                    <th className="pb-3 font-normal w-24 text-center">{lang === "UA" ? "Семестр" : "Semester"}</th>
                    <th className="pb-3 font-normal w-48">{lang === "UA" ? "Тип контролю" : "Control Type"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-soft/30">
                  {grouped[course].map((d: any, i: number) => (
                    <tr key={i} className="hover:bg-surface-mut transition-colors group">
                      <td className="py-4 pr-4">{d[\`Name_\${lang}\`] || d.Name_UA || d.name || ""}</td>
                      <td className="py-4 px-4 text-center font-mono text-xs whitespace-nowrap">{d[\`Semester_\${lang}\`] || d.Semester_UA || d.semester || ""}</td>
                      <td className="py-4 pl-4 font-mono text-xs text-text-dim leading-tight">{d[\`Control_Type_\${lang}\`] || d.Control_Type_UA || d.control || ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}`;

content = content.replace(/function ProgramDisciplines[\s\S]*?\}\n\nexport default/m, newComp + '\n\nexport default');

// Fix programs hook to include disciplines and mapped ids
const origProgDecl = `  const programs = data?.programs || [];`;
const newProgDecl = `  const programs = data?.programs || [];\n  const disciplines = data?.Disciplines || data?.disciplines || [];`;
content = content.replace(origProgDecl, newProgDecl);

// Update mappings
const bProgUseMemoStart = `const bPrograms = useMemo(() => programs.filter((p: any) =>`;
const mProgUseMemoStart = `const mPrograms = useMemo(() => programs.filter((p: any) =>`;
const phdProgUseMemoStart = `const phdPrograms = useMemo(() => programs.filter((p: any) =>`;

// We will do a manual replace. Let's find the useMemo blocks and replace them.
const bProgRegex = /const bPrograms = useMemo\([\s\S]*?\}\n    \}\n  \}\), \[programs\]\);/g;
content = content.replace(bProgRegex, `const bPrograms = useMemo(() => programs.filter((p: any) => 
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
        matchName: "Інтер'єр та просторовий дизайн",
        progId: "prog_2"
      };
    } else {
      return {
        ...p,
        Code: "B2 Дизайн",
        matchName: "Дизайн (Графічний дизайн)",
        progId: "prog_1"
      }
    }
  }), [programs]);`);

const mProgRegex = /const mPrograms = useMemo\([\s\S]*?\}\)\), \[programs\]\);/g;
content = content.replace(mProgRegex, `const mPrograms = useMemo(() => programs.filter((p: any) => 
    (p.Level_UA || p.Level || p.level) === "Магістратура"
  ).map((p: any) => ({
    ...p,
    matchName: "Візуальна комунікація",
    progId: "prog_3"
  })), [programs]);`);

const phdProgRegex = /const phdPrograms = useMemo\([\s\S]*?\}\)\), \[programs\]\);/g;
content = content.replace(phdProgRegex, `const phdPrograms = useMemo(() => programs.filter((p: any) => 
    (p.Level_UA || p.Level || p.level) === "Аспірантура"
  ).map((p: any) => ({
    ...p,
    matchName: "Дизайн",
    progId: "prog_4"
  })), [programs]);`);

// Remove competencies logic
content = content.replace(/  const parseCompetencies = \([\s\S]*?const phdCompetencies = [^\n]*\n/g, "");

// Remove bCompetencies block
const bCompBlockRegex = /\{bCompetencies\.length > 0 && \([\s\S]*?\}\)\}/g;
content = content.replace(bCompBlockRegex, "");

// Remove mCompetencies block
const mCompBlockRegex = /\{mCompetencies\.length > 0 && \([\s\S]*?\}\)\}/g;
content = content.replace(mCompBlockRegex, "");

// Remove phdCompetencies block
const phdCompBlockRegex = /\{phdCompetencies\.length > 0 && \([\s\S]*?\}\)\}/g;
content = content.replace(phdCompBlockRegex, "");

// Change the way ProgramDisciplines is called
content = content.replace(/<ProgramDisciplines prog=\{prog\} \/>/g, '<ProgramDisciplines prog={prog} disciplines={disciplines} lang={lang} t={t} />');

fs.writeFileSync('src/pages/Programs.tsx', content);
console.log("Updated!");
