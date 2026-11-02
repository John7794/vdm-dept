import { motion } from "motion/react";
import { Mail, Linkedin, Instagram, Globe, Palette, User, BookOpen, GraduationCap, IdCard } from "lucide-react";
import { useMemo } from "react";
import { useCms } from "../contexts/CmsContext";
import ResponsiveImage from "../components/ResponsiveImage";

function formatStaffName(rawName: string): string {
  if (!rawName) return "";
  const parts = rawName.trim().split(/\s+/);
  if (parts.length >= 3) {
    const lastName = parts[0];
    const firstName = parts[1];
    return `${firstName} ${lastName.toUpperCase()}`;
  } else if (parts.length === 2) {
    if (parts[1] === parts[1].toUpperCase() && parts[1].length > 1) {
      return `${parts[0]} ${parts[1]}`;
    }
    return `${parts[1]} ${parts[0].toUpperCase()}`;
  }
  return rawName;
}

export default function Staff() {
  const { data, lang, t } = useCms();
  const rawStaffMembers = data?.staff || [];

  const sortedStaff = useMemo(() => {
    // Filter out empty rows or anyone removed (like Yatsiv)
    const valid = rawStaffMembers.filter((m: any) => {
      const name = m.Name_UA || m.name || "";
      return name.trim() !== "" && !name.includes("Яців");
    });

    const getRank = (roleStr: string) => {
      const r = roleStr.toLowerCase();
      if (r.includes("завідувач") && !r.includes("заступник")) return 1;
      if (r.includes("заступник") && r.includes("завідувач")) return 2;
      if (r.includes("професор")) return 3;
      if (r.includes("доцент")) return 4;
      if (r.includes("старший викладач")) return 5;
      if (r.includes("асистент")) return 6;
      if (r.includes("фахівець") || r.includes("інженер")) return 7;
      return 8;
    };

    return [...valid].sort((a, b) => {
      const roleA = (a.Role_UA || a.role || "").toLowerCase();
      const roleB = (b.Role_UA || b.role || "").toLowerCase();
      const rankA = getRank(roleA);
      const rankB = getRank(roleB);

      if (rankA !== rankB) {
        return rankA - rankB;
      }

      const nameA = (a.Name_UA || a.name || "").toLowerCase();
      const nameB = (b.Name_UA || b.name || "").toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }, [rawStaffMembers]);

  return (
    <div className="flex flex-col w-full bg-page-bg">
      {/* Page Header */}
      <section className="border-b-2 border-border-main bg-surface-main p-6 md:p-12 lg:p-16 relative overflow-hidden">
        <div className="max-w-[1000px] z-10 relative">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-7xl lg:text-[7rem] font-bold leading-[0.9] tracking-[-0.04em] uppercase text-text-main text-balance whitespace-pre-line break-words hyphens-auto"
          >
            {t("staff_page_title", "КОЛЕКТИВ КАФЕДРИ.")}
          </motion.h1>
          <p className="mt-6 text-lg md:text-xl max-w-2xl font-light leading-relaxed text-text-main whitespace-pre-line">
            {t("staff_page_desc", "Колектив дослідників та практиків. Наукометричні профілі та професійна експертиза.")}
          </p>
        </div>
      </section>

      {/* Unified Staff List */}
      <section className="bg-surface-main">
        <div className="grid grid-cols-1 divide-y-2 divide-border-main">
          {sortedStaff.map((member: any, idx: number) => {
            const rawName = member[`Name_${lang}`] || member.Name_UA || member.name || "";
            const displayName = formatStaffName(rawName);
            const role = member[`Role_${lang}`] || member.Role_UA || member.role || "";
            const degree = member[`Degree_${lang}`] || member.Degree_UA || member.degree || "";
            const title = member[`Title_${lang}`] || member.Title_UA || member.title || "";

            // Social & Academic Links
            const email = member.Email || member.email || "";
            const linkedin = member.LinkedIn || member.Linkedin || member.linkedin || "";
            const instagram = member.Instagram || member.instagram || "";
            const behance = member.Behance || member.behance || "";
            const website = member.Website || member.website || member.Link || member.link || "";
            const scopus = member.Scopus || member.scopus || "";
            const orcid = member.Orcid || member.orcid || member.ORCID || "";
            const scholar = member.Scholar || member.scholar || member.GoogleScholar || "";

            const hasCredentials = Boolean(degree || title);

            return (
              <motion.div 
                key={member.ID || idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: Math.min(idx * 0.05, 0.6) }}
                className="group grid grid-cols-1 lg:grid-cols-12 divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-border-soft lg:divide-border-main lg:hover:bg-text-main lg:hover:text-page-bg transition-colors"
              >
                {/* Left Side: Avatar, Formatted Name & Academic Regalia */}
                <div className="lg:col-span-8 p-6 md:p-8 lg:p-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 md:gap-8">
                  {/* Photo / Avatar */}
                  <div className="w-28 h-28 md:w-36 md:h-36 bg-surface-mut rounded-full overflow-hidden flex-shrink-0 border-2 border-border-main lg:group-hover:border-page-bg transition-colors flex items-center justify-center shadow-md">
                    {(member.Image || member.image || member.Image_2x || member.Image_Mobile || member.Image_Tablet) ? (
                      <ResponsiveImage
                        desktopUrl={member.Image || member.image || ""}
                        desktopUrl2x={member.Image_2x || member.image_2x || member.Media_2x || member.media_2x || ""}
                        tabletUrl={member.Image_Tablet || member.image_Tablet || member.Media_Tablet || member.media_Tablet || ""}
                        tabletUrl2x={member.Image_Tablet_2x || member.image_Tablet_2x || member.Media_Tablet_2x || member.media_Tablet_2x || ""}
                        mobileUrl={member.Image_Mobile || member.image_Mobile || member.Media_Mobile || member.media_Mobile || ""}
                        mobileUrl2x={member.Image_Mobile_2x || member.image_Mobile_2x || member.Media_Mobile_2x || member.media_Mobile_2x || ""}
                        alt={displayName}
                        className="w-full h-full object-cover transition-transform duration-500 lg:group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-text-dim bg-surface-mut transition-colors">
                        <User className="w-14 h-14 md:w-16 md:h-16 opacity-60" strokeWidth={1} />
                      </div>
                    )}
                  </div>

                  {/* Name and Credentials */}
                  <div className="flex flex-col justify-center min-w-0">
                    <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-none lg:group-hover:text-accent-yellow transition-colors">
                      {displayName}
                    </h3>

                    {role && (
                      <p className="font-mono text-xs md:text-sm font-bold uppercase tracking-wider text-accent-blue lg:group-hover:text-accent-yellow mt-2">
                        {role}
                      </p>
                    )}

                    {hasCredentials && (
                      <div className="mt-2 text-xs md:text-sm text-text-dim lg:group-hover:text-page-bg/80 leading-relaxed whitespace-pre-line font-medium">
                        {degree && title ? (
                          <>
                            <span className="font-semibold">{degree}</span>, {title}
                          </>
                        ) : (
                          degree || title
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: Social & Academic Profiles */}
                <div className="lg:col-span-4 p-6 md:p-8 lg:p-10 flex flex-col justify-center bg-surface-main/30 lg:bg-transparent">
                  <div className="flex flex-wrap items-center gap-3 md:gap-4">
                    {email && (
                      <a 
                        href={`mailto:${email}`} 
                        className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-bold uppercase border border-border-main rounded-sm hover:bg-accent-yellow hover:text-black transition-colors"
                        title={email}
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Email</span>
                      </a>
                    )}
                    {scholar && (
                      <a 
                        href={scholar} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold uppercase border border-border-main rounded-sm hover:bg-accent-yellow hover:text-black transition-colors" 
                        title="Google Scholar"
                      >
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>Scholar</span>
                      </a>
                    )}
                    {scopus && (
                      <a 
                        href={scopus} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold uppercase border border-border-main rounded-sm hover:bg-accent-yellow hover:text-black transition-colors" 
                        title="Scopus"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Scopus</span>
                      </a>
                    )}
                    {orcid && (
                      <a 
                        href={orcid} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold uppercase border border-border-main rounded-sm hover:bg-accent-yellow hover:text-black transition-colors" 
                        title="ORCID"
                      >
                        <IdCard className="w-3.5 h-3.5" />
                        <span>ORCID</span>
                      </a>
                    )}
                    {linkedin && (
                      <a 
                        href={linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-2 border border-border-main rounded-sm hover:bg-accent-yellow hover:text-black transition-colors" 
                        title="LinkedIn"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {behance && (
                      <a 
                        href={behance} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-2 border border-border-main rounded-sm hover:bg-accent-yellow hover:text-black transition-colors" 
                        title="Behance"
                      >
                        <Palette className="w-4 h-4" />
                      </a>
                    )}
                    {instagram && (
                      <a 
                        href={instagram} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-2 border border-border-main rounded-sm hover:bg-accent-yellow hover:text-black transition-colors" 
                        title="Instagram"
                      >
                        <Instagram className="w-4 h-4" />
                      </a>
                    )}
                    {website && (
                      <a 
                        href={website} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="p-2 border border-border-main rounded-sm hover:bg-accent-yellow hover:text-black transition-colors" 
                        title="Website"
                      >
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
