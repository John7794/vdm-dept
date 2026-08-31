import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { Lock, FileSpreadsheet, Loader2, CheckCircle } from "lucide-react";
import { motion } from "motion/react";

export default function Admin() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [sheetUrl, setSheetUrl] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState("");

  const generateData = async (accessToken: string) => {
    setStatus("loading");
    try {
      // 1. Create a new spreadsheet
      const createRes = await fetch("https://sheets.googleapis.com/v4/spreadsheets", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          properties: {
            title: "Кафедра візуального дизайну - CMS (Мультимовна)"
          },
          sheets: [
            { properties: { title: "Static" } },
            { properties: { title: "News" } },
            { properties: { title: "Staff" } },
            { properties: { title: "Programs" } },
            { properties: { title: "Projects" } }
          ]
        })
      });

      if (!createRes.ok) {
        const errData = await createRes.json();
        console.error("Google API Error:", errData);
        throw new Error(errData.error?.message || "Помилка створення таблиці");
      }
      const sheetData = await createRes.json();
      const spreadsheetId = sheetData.spreadsheetId;

      // 2. Populate data
      const dataToUpdate = [
        {
          range: "Static!A1:E",
          values: [
            ["Key", "UA", "EN", "DE", "PL"],
            ["nav_home", "Головна", "Home", "Startseite", "Główna"],
            ["nav_applicants", "Вступнику", "Applicants", "Bewerber", "Kandydaci"],
            ["nav_programs", "Програми", "Programs", "Programme", "Programy"],
            ["nav_projects", "Портфоліо", "Portfolio", "Portfolio", "Portfolio"],
            ["nav_news", "Новини", "News", "Nachrichten", "Aktualności"],
            ["nav_staff", "Команда", "Staff", "Team", "Zespół"],
            ["nav_contacts", "Контакти", "Contacts", "Kontakte", "Kontakty"],
            ["home_hero_title", "Візуальний Дизайн і Мистецтво.", "Visual Design and Art.", "Visuelles Design und Kunst.", "Projektowanie Wizualne i Sztuka."],
            ["home_marquee", "ВІДКРИТО НАБІР НА МАГІСТРАТУРУ 2026", "OPEN ENROLLMENT FOR MASTERS 2026", "OFFENE EINSCHREIBUNG FÜR MASTER 2026", "OTWARTA REKRUTACJA NA MAGISTERKĘ 2026"],
            ["home_btn_apply", "Вступна кампанія", "Admission Campaign", "Zulassungskampagne", "Kampania rekrutacyjna"],
            ["home_f1_label", "01. ПІДХІД", "01. APPROACH", "01. ANSATZ", "01. PODEJŚCIE"],
            ["home_f1_title", "Синтез Традицій", "Synthesis of Traditions", "Synthese von Traditionen", "Synteza Tradycji"],
            ["home_f1_desc", "Академічна база поєднується з цифровою добою. Ми формуємо фахівців, здатних проєктувати складні інформаційні системи та естетичні простори.", "Academic base combined with the digital age. We shape professionals capable of designing complex information systems and aesthetic spaces.", "Akademische Basis kombiniert mit dem digitalen Zeitalter...", "Baza akademicka w połączeniu z erą cyfrową..."],
            ["home_f2_label", "02. ПРАКТИКА", "02. PRACTICE", "02. PRAXIS", "02. PRAKTYKA"],
            ["home_f2_title", "Проєктно-Базоване Навчання", "Project-Based Learning", "Projektbasiertes Lernen", "Nauczanie Oparte na Projektach"],
            ["home_f2_desc", "Жодної теорії заради теорії. Студенти розв'язують реальні комунікаційні проблеми замовників ще під час навчання.", "No theory for the sake of theory. Students solve real communication problems of clients during their studies.", "Keine Theorie um der Theorie willen...", "Żadnej teorii dla samej teorii..."],
            ["home_f3_label", "03. ДИСЦИПЛІНИ", "03. DISCIPLINES", "03. DISZIPLINEN", "03. DYSCYPLINY"],
            ["footer_desc", "Кафедра візуального дизайну і мистецтва Інститут архітектури та дизайну Національний університет \"Львівська політехніка\"", "Department of Visual Design and Art Institute of Architecture and Design Lviv Polytechnic National University", "Institut für Architektur und Design...", "Instytut Architektury i Designu..."],
            ["footer_address", "ВУЛ. СТЕПАНА БАНДЕРИ, 12, ЛЬВІВ", "12 STEPAN BANDERA STR., LVIV", "STEPAN BANDERA STR. 12, LVIV", "UL. STEPANA BANDERY 12, LWÓW"],
            ["footer_email", "vd.dept@lpnu.ua", "vd.dept@lpnu.ua", "vd.dept@lpnu.ua", "vd.dept@lpnu.ua"]
          ]
        },
        {
          range: "News!A1:G",
          values: [
            ["ID", "Date", "Image", "Title_UA", "Title_EN", "Desc_UA", "Desc_EN"],
            ["news_1", "12 Жовтня, 2025", "https://picsum.photos/800/600", "Виставка студентських робіт", "Student Works Exhibition", "Запрошуємо на щорічну виставку робіт.", "Welcome to the annual exhibition."],
            ["news_2", "15 Вересня, 2025", "https://picsum.photos/800/601", "Нова програма обміну", "New Exchange Program", "Студенти можуть взяти участь в обміні.", "Students can participate in the exchange."]
          ]
        },
        {
          range: "Staff!A1:I",
          values: [
            ["ID", "Image", "Name_UA", "Name_EN", "Name_DE", "Name_PL", "Role_UA", "Role_EN", "Role_DE"],
            ["staff_1", "https://picsum.photos/400/400", "Олена Петрівна", "Olena Petrivna", "Olena Petrivna", "Olena Petriwna", "Завідувачка", "Head of Department", "Abteilungsleiterin"],
            ["staff_2", "https://picsum.photos/400/401", "Іван Франко", "Ivan Franko", "Ivan Franko", "Iwan Franko", "Викладач", "Lecturer", "Dozent"]
          ]
        },
        {
          range: "Programs!A1:F",
          values: [
            ["ID", "Title_UA", "Title_EN", "Desc_UA", "Desc_EN", "Link"],
            ["prog_1", "Бакалавр Дизайну", "Bachelor of Design", "Основи графічного дизайну...", "Basics of graphic design...", "#"],
            ["prog_2", "Магістр Дизайну", "Master of Design", "Просунуті концепції та арт-дирекшн...", "Advanced concepts and art direction...", "#"]
          ]
        },
        {
          range: "Projects!A1:H",
          values: [
            ["ID", "Image", "Title_UA", "Title_EN", "Category_UA", "Category_EN", "Author_UA", "Author_EN"],
            ["proj_1", "https://picsum.photos/800/602", "Айдентика Музею", "Museum Identity", "Брендинг", "Branding", "Анна Коваленко", "Anna Kovalenko"],
            ["proj_2", "https://picsum.photos/800/603", "Додаток для міста", "City App", "UX/UI", "UX/UI", "Максим Ткач", "Maksym Tkach"]
          ]
        }
      ];

      const batchUpdateRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          valueInputOption: "RAW",
          data: dataToUpdate
        })
      });

      if (!batchUpdateRes.ok) throw new Error("Помилка заповнення даними");

      setSheetUrl(`https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`);
      setStatus("success");
    } catch (e: any) {
      console.error(e);
      setErrorMsg(e.message);
      setStatus("error");
    }
  };

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => generateData(tokenResponse.access_token),
    scope: "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file",
    onError: () => {
      setStatus("error");
      setErrorMsg("Помилка авторизації Google");
    }
  });

  return (
    <div className="min-h-screen bg-page-bg p-8 pt-24 text-text-main flex items-center justify-center">
      <div className="max-w-xl w-full bg-surface-main border-2 border-border-main p-8 space-y-8 text-center">
        <div className="inline-block p-4 border-2 border-border-main mb-2">
          <FileSpreadsheet className="w-8 h-8 text-accent-blue" />
        </div>
        <h1 className="text-3xl font-bold uppercase tracking-tight">Генерація CMS</h1>
        <p className="text-sm font-mono uppercase text-text-dim">
          Створення бази даних (Google Sheets) на основі структури сайту.
        </p>

        {status === "idle" && (
          <button
            onClick={() => login()}
            className="w-full bg-text-main text-page-bg py-4 font-bold uppercase tracking-widest hover:bg-accent-blue transition-colors mt-8"
          >
            Увійти через Google та створити таблицю
          </button>
        )}

        {status === "loading" && (
          <div className="py-8 flex flex-col items-center justify-center gap-4 text-accent-blue">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="font-mono text-xs uppercase tracking-widest text-text-main">Створення таблиці...</p>
          </div>
        )}

        {status === "success" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="text-green-500 flex justify-center">
              <CheckCircle className="w-12 h-12" />
            </div>
            <p className="font-bold text-lg">ТАБЛИЦЮ УСПІШНО СТВОРЕНО!</p>
            <p className="text-sm text-text-dim">
              Тепер ви можете перемістити її в потрібну папку та надати доступ.
            </p>
            <a 
              href={sheetUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block w-full bg-accent-blue text-white py-4 font-bold uppercase tracking-widest hover:bg-blue-600 transition-colors"
            >
              Відкрити Google Sheets
            </a>
          </motion.div>
        )}

        {status === "error" && (
          <div className="py-8 space-y-4">
            <p className="text-red-500 font-bold uppercase">Сталася помилка</p>
            <p className="text-sm font-mono text-text-dim">{errorMsg}</p>
            <button
              onClick={() => setStatus("idle")}
              className="w-full bg-surface-mut border-2 border-border-main py-4 font-bold uppercase tracking-widest hover:bg-text-main hover:text-page-bg transition-colors"
            >
              Спробувати ще раз
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
