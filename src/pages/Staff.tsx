import { motion } from "motion/react";
import { ArrowUpRight, Mail, Linkedin, Instagram, Globe, Palette, User } from "lucide-react";
import { useMemo } from "react";
import { useCms } from "../contexts/CmsContext";
import { formatDriveLink } from "../lib/utils";
import ResponsiveImage from "../components/ResponsiveImage";

const GROUP_ORDER = [
  "Керівництво",
  "Професура",
  "Доценти",
  "Старші викладачі",
  "Асистенти",
  "Адміністративно-господарський персонал"
];

const GROUP_TRANSLATION_KEYS: Record<string, string> = {
  "Керівництво": "group_management",
  "Професура": "group_professors",
  "Доценти": "group_docents",
  "Старші викладачі": "group_senior_lecturers",
  "Асистенти": "group_assistants",
  "Адміністративно-господарський персонал": "group_admin"
};

function getGroupFromRole(role: string): string {
  const r = role.toLowerCase();
  if (r.includes("завідувач") || r.includes("керівник") || r.includes("декан")) return "Керівництво";
  if (r.includes("професор")) return "Професура";
  if (r.includes("доцент")) return "Доценти";
  if (r.includes("старший викладач")) return "Старші викладачі";
  if (r.includes("асистент")) return "Асистенти";
  return "Адміністративно-господарський персонал";
}

export default function Staff() {
  const { data, lang, t } = useCms();
  const staffMembers = data?.staff || [];

  const groupedStaff = useMemo(() => {
    const groups: Record<string, any[]> = {};
    staffMembers.forEach(member => {
      // Fallback to Role_UA if group is missing, then use standard group function
      const roleText = member.Role_UA || member.role || "";
      const groupName = member.group || getGroupFromRole(roleText);
      if (!groups[groupName]) groups[groupName] = [];
      groups[groupName].push(member);
    });

    return Object.entries(groups)
      .map(([name, members]) => ({ name, members }))
      .sort((a, b) => {
        const indexA = GROUP_ORDER.indexOf(a.name);
        const indexB = GROUP_ORDER.indexOf(b.name);
        if (indexA === -1 && indexB === -1) return a.name.localeCompare(b.name);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });
  }, [staffMembers]);

  return (
    <div className="flex flex-col w-full bg-page-bg">
      {/* Page Header */}
      <section className="border-b-2 border-border-main bg-surface-main p-6 md:p-12 lg:p-16 relative overflow-hidden">
        <div className="max-w-[1000px] z-10 relative">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-7xl lg:text-[8rem] font-bold leading-[0.85] tracking-[-0.04em] uppercase text-text-main text-balance whitespace-pre-line"
          >
            {t("staff_page_title")}
          </motion.h1>
          <p className="mt-8 text-xl max-w-2xl font-light leading-relaxed text-text-main whitespace-pre-line">
            {t("staff_page_desc")}
          </p>
        </div>
      </section>

      {/* Staff Grid/Table */}
      <section className="bg-surface-main">
        {groupedStaff.map((group, gIdx) => (
          <div key={gIdx} className="border-b-2 border-border-main last:border-0">
            {/* Group Header */}
            <div className="bg-page-bg px-6 py-8 md:px-12 border-b-2 border-border-main sticky top-0 z-10">
              <h2 className="text-2xl font-bold uppercase tracking-widest text-text-main">
                {GROUP_TRANSLATION_KEYS[group.name] ? t(GROUP_TRANSLATION_KEYS[group.name]) : group.name}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 divide-y-2 divide-border-main">
              {/* Header Row (Desktop) */}
              <div className="hidden lg:grid grid-cols-12 divide-x-2 divide-border-main font-mono text-xs uppercase tracking-widest bg-page-bg/50">
                <div className="col-span-5 p-4 text-text-dim">{t("staff_col_name")}</div>
                <div className="col-span-3 p-4 text-text-dim">{t("staff_col_degree")}</div>
                <div className="col-span-4 p-4 text-text-dim">{t("staff_col_interests")}</div>
              </div>
              
              {/* Staff Rows */}
              {group.members.map((member: any, idx: number) => {
                const name = member[`Name_${lang}`] || member.Name_UA || member.name || "Name missing";
                const role = member[`Role_${lang}`] || member.Role_UA || member.role || "";
                const degree = member[`Degree_${lang}`] || member.Degree_UA || member.degree || "";
                
                // Parse interests if they come as a semicolon or comma-separated string from Google Sheets
                let interests: string[] = [];
                const interestsRaw = member[`Interests_${lang}`] || member.Interests_UA || member.interests;
                if (typeof interestsRaw === 'string' && interestsRaw.trim() !== '') {
                  interests = interestsRaw.split(/[;,]/).map(i => i.trim()).filter(Boolean);
                } else if (Array.isArray(interestsRaw)) {
                  interests = interestsRaw;
                }

                // Parse Social Links
                const email = member.Email || member.email || "";
                const linkedin = member.LinkedIn || member.Linkedin || member.linkedin || "";
                const instagram = member.Instagram || member.instagram || "";
                const behance = member.Behance || member.behance || "";
                const website = member.Website || member.website || member.Link || member.link || "";

                return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group grid grid-cols-1 lg:grid-cols-12 divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-border-soft lg:divide-border-main hover:bg-text-main hover:text-page-bg transition-colors pb-6 lg:pb-0"
                >
                  <div className="col-span-5 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <span className="font-mono text-[10px] text-text-dim lg:hidden mb-2 uppercase w-full">{t("staff_lbl_employee")}</span>
                    {/* Staff Photo */}
                    <div className="w-32 h-32 md:w-48 md:h-48 bg-surface-mut rounded-full overflow-hidden flex-shrink-0 border-2 border-border-main group-hover:border-page-bg transition-colors flex items-center justify-center">
                      {(member.Image || member.image || member.Image_2x || member.Image_Mobile || member.Image_Tablet || member.Image_Tablet_2x || member.Image_Mobile_2x) ? (
                        <ResponsiveImage
                          desktopUrl={member.Image || member.image || ""}
                          desktopUrl2x={member.Image_2x || member.image_2x || member.Media_2x || member.media_2x || ""}
                          tabletUrl={member.Image_Tablet || member.image_Tablet || member.Media_Tablet || member.media_Tablet || ""}
                          tabletUrl2x={member.Image_Tablet_2x || member.image_Tablet_2x || member.Media_Tablet_2x || member.media_Tablet_2x || ""}
                          mobileUrl={member.Image_Mobile || member.image_Mobile || member.Media_Mobile || member.media_Mobile || ""}
                          mobileUrl2x={member.Image_Mobile_2x || member.image_Mobile_2x || member.Media_Mobile_2x || member.media_Mobile_2x || ""}
                          alt={name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-text-dim bg-surface-mut transition-colors">
                          <User className="w-16 h-16 md:w-24 md:h-24" strokeWidth={1} />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-center">
                      <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight leading-none group-hover:text-accent-yellow transition-colors">
                        {name}
                      </h3>
                      <p className="font-mono text-xs mt-2 text-text-dim group-hover:text-page-bg/70 whitespace-pre-line">{role}</p>
                      
                      {/* Social Links */}
                      {(email || linkedin || instagram || behance || website) && (
                        <div className="flex flex-wrap gap-4 mt-6">
                          {email && (
                            <a href={`mailto:${email}`} className="text-text-dim group-hover:text-page-bg/60 hover:!text-accent-yellow transition-colors" title="Email">
                              <Mail className="w-5 h-5" />
                            </a>
                          )}
                          {linkedin && (
                            <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-text-dim group-hover:text-page-bg/60 hover:!text-accent-yellow transition-colors" title="LinkedIn">
                              <Linkedin className="w-5 h-5" />
                            </a>
                          )}
                          {instagram && (
                            <a href={instagram} target="_blank" rel="noopener noreferrer" className="text-text-dim group-hover:text-page-bg/60 hover:!text-accent-yellow transition-colors" title="Instagram">
                              <Instagram className="w-5 h-5" />
                            </a>
                          )}
                          {behance && (
                            <a href={behance} target="_blank" rel="noopener noreferrer" className="text-text-dim group-hover:text-page-bg/60 hover:!text-accent-yellow transition-colors" title="Behance / Portfolio">
                              <Palette className="w-5 h-5" />
                            </a>
                          )}
                          {website && (
                            <a href={website} target="_blank" rel="noopener noreferrer" className="text-text-dim group-hover:text-page-bg/60 hover:!text-accent-yellow transition-colors" title="Website / Profile">
                              <Globe className="w-5 h-5" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="col-span-3 p-6 flex items-center">
                    <span className="font-mono text-[10px] text-text-dim lg:hidden mb-2 block uppercase w-full">{t("staff_lbl_degree")}</span>
                    <p className="font-medium text-sm lg:text-base">{degree}</p>
                  </div>
                  
                  <div className="col-span-4 p-6 flex flex-col justify-center">
                    <span className="font-mono text-[10px] text-text-dim lg:hidden mb-2 uppercase">{t("staff_lbl_interests")}</span>
                    <div className="flex flex-wrap gap-2">
                      {interests.map((interest: string, i: number) => (
                        <span 
                          key={i} 
                          className="inline-block px-2 py-1 text-xs border border-border-soft group-hover:border-page-bg/30 whitespace-nowrap rounded-sm"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
              })}
            </div>
          </div>
        ))}
        {staffMembers.length === 0 && (
          <div className="p-12 text-center text-text-dim font-mono uppercase tracking-widest text-sm">
            {t("staff_no_data")}
          </div>
        )}
      </section>
      
      {/* Footer Info */}
      <section className="p-6 md:p-12 border-t-2 border-border-main bg-surface-mut text-text-main font-mono text-xs uppercase tracking-widest text-center">
        {t("staff_footer_note")}
      </section>
    </div>
  );
}
