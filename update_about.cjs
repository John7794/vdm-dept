const fs = require('fs');
let content = fs.readFileSync('src/pages/About.tsx', 'utf8');

// Ensure icons are imported
if (!content.includes('Facebook')) {
  content = content.replace('Mail, ArrowUpRight', 'Mail, ArrowUpRight, Facebook, Instagram, Globe');
}

const socialHtml = `            </ul>
            
            <div className="mt-12">
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

content = content.replace('            </ul>', socialHtml);

fs.writeFileSync('src/pages/About.tsx', content);
