const fs = require('fs');
let content = fs.readFileSync('src/pages/Programs.tsx', 'utf8');

// 1. Wrap the sections in a grid layout
content = content.replace(
  /\{\/\* Bachelor Dashboard \*\/\}/,
  `<div className="flex flex-col lg:flex-row w-full items-stretch">
        <div className="flex-grow lg:w-[75%] xl:w-[80%] flex flex-col border-r-0 lg:border-r-2 border-border-main">
          {/* Bachelor Dashboard */}`
);

// 2. Add the aside after PhD section and close the div
const phdEnd = `          </div>
        </div>
      </section>`;
const asideHtml = `        </div>
        
        {/* Navigation Sidebar */}
        <aside className="hidden lg:block lg:w-[25%] xl:w-[20%] bg-surface-main relative">
          <div className="sticky top-[80px] p-8 xl:p-12">
             <nav className="flex flex-col space-y-8">
                <h4 className="font-mono text-sm tracking-widest text-text-dim uppercase">{t("prog_lbl_navigation", "Навігація")}</h4>
                <ul className="space-y-6">
                  <li><a href="#bachelor" className="text-lg xl:text-xl font-bold uppercase text-text-dim hover:text-accent-blue transition-colors block">{t("prog_bachelor")}</a></li>
                  <li><a href="#master" className="text-lg xl:text-xl font-bold uppercase text-text-dim hover:text-accent-blue transition-colors block">{t("prog_master")}</a></li>
                  <li><a href="#phd" className="text-lg xl:text-xl font-bold uppercase text-text-dim hover:text-accent-blue transition-colors block">{t("prog_phd")}</a></li>
                </ul>
             </nav>
          </div>
        </aside>
      </div>`;

content = content.replace(phdEnd, phdEnd + "\n" + asideHtml);

// 3. Update the sections to add IDs and adjust styles
content = content.replace(
  /<section className="grid grid-cols-1 border-b-2 border-border-main">/g,
  '<section className="grid grid-cols-1 border-b-2 border-border-main scroll-mt-[72px]">'
);

// We need to target each section individually to add IDs.
content = content.replace(
  /\{\/\* Bachelor Dashboard \*\/\}\n\s*<section className="grid grid-cols-1 border-b-2 border-border-main scroll-mt-\[72px\]">/,
  `{/* Bachelor Dashboard */}\n      <section id="bachelor" className="grid grid-cols-1 border-b-2 border-border-main scroll-mt-[72px]">`
);

content = content.replace(
  /\{\/\* Master Dashboard \*\/\}\n\s*<section className="grid grid-cols-1 border-b-2 border-border-main scroll-mt-\[72px\]">/,
  `{/* Master Dashboard */}\n      <section id="master" className="grid grid-cols-1 border-b-2 border-border-main scroll-mt-[72px]">`
);

content = content.replace(
  /\{\/\* PhD Dashboard \*\/\}\n\s*<section className="grid grid-cols-1 border-b-2 border-border-main scroll-mt-\[72px\]">/,
  `{/* PhD Dashboard */}\n      <section id="phd" className="grid grid-cols-1 border-b-2 border-border-main scroll-mt-[72px]">`
);

// 4. Make headers sticky
content = content.replace(
  /<div className="bg-surface-mut text-text-main p-6 flex justify-between items-center border-b-2 border-border-main">/g,
  '<div className="sticky top-0 lg:top-[72px] z-20 bg-surface-mut/95 backdrop-blur-md text-text-main p-6 flex justify-between items-center border-b-2 border-border-main">'
);

fs.writeFileSync('src/pages/Programs.tsx', content);
