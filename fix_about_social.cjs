const fs = require('fs');
let content = fs.readFileSync('src/pages/About.tsx', 'utf8');

// 1. Remove the old social block
const oldSocialHtml = `            <div className="mt-12">
              <h3 className="font-mono text-sm tracking-widest uppercase mb-6 text-paper/70">
                {t("about_social_label", "Ми в мережі")}
              </h3>
              <div className="flex gap-4">
                <a href="https://lpnu.ua/vdm" target="_blank" rel="noopener noreferrer" className="p-3 bg-paper/5 rounded-full hover:bg-accent-yellow hover:text-ink transition-colors focus-ring outline-none" aria-label="Сайт Львівської політехніки">
                  <Globe className="w-6 h-6" />
                </a>
                <a href="https://www.facebook.com/visualdesignandart" target="_blank" rel="noopener noreferrer" className="p-3 bg-paper/5 rounded-full hover:bg-accent-yellow hover:text-ink transition-colors focus-ring outline-none" aria-label="Facebook">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="https://www.instagram.com/vdm_lpnu/" target="_blank" rel="noopener noreferrer" className="p-3 bg-paper/5 rounded-full hover:bg-accent-yellow hover:text-ink transition-colors focus-ring outline-none" aria-label="Instagram">
                  <Instagram className="w-6 h-6" />
                </a>
              </div>
            </div>`;

if (content.includes(oldSocialHtml)) {
  content = content.replace(oldSocialHtml, '');
} else {
  console.log("Could not find old social block!");
}

// 2. Add the new social block under Partners
const partnersEnd = `                </div>
              </div>
          </div>`;

const newSocialHtml = `                </div>
              </div>
          </div>

          <hr className="border-border-main border-t-2" />

          {/* Social Links Section */}
          <div className="py-8 md:py-12 lg:py-16 w-full">
            <div className="px-6 md:px-12 lg:px-16 max-w-4xl">
              <span className="font-mono text-xs text-text-dim block mb-8 uppercase tracking-widest">
                {t("about_social_label", "Ми в мережі")}
              </span>
              
              <div className="flex gap-6">
                <a href="https://lpnu.ua/vdm" target="_blank" rel="noopener noreferrer" className="p-4 bg-surface-mut rounded-full text-text-main hover:bg-accent-yellow hover:text-ink transition-colors focus-ring outline-none" aria-label="Сайт Львівської політехніки">
                  <Globe className="w-8 h-8" />
                </a>
                <a href="https://www.facebook.com/visualdesignandart" target="_blank" rel="noopener noreferrer" className="p-4 bg-surface-mut rounded-full text-text-main hover:bg-accent-yellow hover:text-ink transition-colors focus-ring outline-none" aria-label="Facebook">
                  <Facebook className="w-8 h-8" />
                </a>
                <a href="https://www.instagram.com/vdm_lpnu/" target="_blank" rel="noopener noreferrer" className="p-4 bg-surface-mut rounded-full text-text-main hover:bg-accent-yellow hover:text-ink transition-colors focus-ring outline-none" aria-label="Instagram">
                  <Instagram className="w-8 h-8" />
                </a>
              </div>
            </div>
          </div>`;

content = content.replace(partnersEnd, newSocialHtml);

fs.writeFileSync('src/pages/About.tsx', content);
