const fs = require('fs');
let content = fs.readFileSync('src/pages/Programs.tsx', 'utf8');

const sidebarHtml = `        </div>
        
        {/* Navigation Sidebar */}
        <aside className="hidden lg:block lg:w-[25%] xl:w-[20%] bg-surface-main relative">
          <div className="sticky top-[120px] p-8 xl:p-12">
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

// 1. Remove it from the current wrong location
content = content.replace(sidebarHtml, "");

// 2. Insert it after the PhD Dashboard end
// Finding the end of the PhD section:
// It ends with:
//               )}
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

const correctEnd = `              )}
            </div>
          </div>
        </div>
      </section>`;

const correctReplacement = correctEnd + "\n" + sidebarHtml;

content = content.replace(correctEnd, correctReplacement);

fs.writeFileSync('src/pages/Programs.tsx', content);
