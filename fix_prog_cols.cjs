const fs = require('fs');
let content = fs.readFileSync('src/pages/Programs.tsx', 'utf8');

const targetStr = `{grouped[course].map((d: any, i: number) => (
                    <tr key={i} className="hover:bg-surface-mut transition-colors group">
                      <td className="p-4">{d[\`Name_\${lang}\`] || d.Name_UA || d.name || ""}</td>
                      <td className="p-4 text-center font-mono text-xs whitespace-nowrap">{d[\`Semester_\${lang}\`] || d.Semester_UA || d.semester || ""}</td>
                      <td className="p-4 font-mono text-xs text-text-dim leading-tight">{d[\`Control_Type_\${lang}\`] || d.Control_Type_UA || d.control || ""}</td>
                    </tr>
                  ))}`;

const newBlock = `{grouped[course].map((d: any, i: number) => {
                    const nameUA = d.Name_UA || d.Name_EN || Object.values(d)[0] || "";
                    const nameStr = lang === "UA" ? nameUA : (d[\`Name_\${lang}\`] || d[\`Name_\${lang}_1\`] || nameUA);
                    
                    const semUA = d.Semester_UA || d.Semester_EN || d.semester || "";
                    const semStr = lang === "UA" ? semUA : (d[\`Semester_\${lang}\`] || semUA);
                    
                    const ctrlUA = d.Control_Type_UA || d.Control_Type_EN || d.control || "";
                    const ctrlStr = lang === "UA" ? ctrlUA : (d[\`Control_Type_\${lang}\`] || ctrlUA);

                    return (
                      <tr key={i} className="hover:bg-surface-mut transition-colors group">
                        <td className="p-4">{nameStr}</td>
                        <td className="p-4 text-center font-mono text-xs whitespace-nowrap">{semStr}</td>
                        <td className="p-4 font-mono text-xs text-text-dim leading-tight">{ctrlStr}</td>
                      </tr>
                    );
                  })}`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, newBlock);
  fs.writeFileSync('src/pages/Programs.tsx', content);
  console.log("Replaced successfully");
} else {
  console.log("Could not find exact match!");
}
