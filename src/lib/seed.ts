import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from './firebase';

const NEWS_ITEMS = [
  { id: "1", date: "12 ЖОВ 2026", type: "Подія", title: "Відкритя виставки студентських плакатів «Текст як образ»", excerpt: "В головному корпусі НУЛП відкривається щорічна виставка робіт студентів-графіків, присвячена дослідженню виразності типографіки.", content: "" },
  { id: "2", date: "05 ЖОВ 2026", type: "Анонс", title: "Лекція: Swiss Design Systems in Web Architecture", excerpt: "Запрошений спікер, арт-директор іноземного агентства, поділиться досвідом імплементації жорстких сіток у сучасні вебінтерфейси.", content: "" },
  { id: "3", date: "28 ВЕР 2026", type: "Досягнення", title: "Перемога команди VDM на хакатоні DesignJam 2026", excerpt: "Проєкт застосунку для інклюзивної міської навігації здобув перше місце у номінації 'Кращий UX'.", content: "" },
  { id: "4", date: "15 ВЕР 2026", type: "Навчання", title: "Оновлення ліцензійного ПЗ у лабораторіях кафедри", excerpt: "Робочі місця укромплектовано новими графічними планшетами та оновлено ПЗ для студентських проєктів.", content: "" },
];

const STAFF_MEMBERS = [
  { id: "1", name: "Скляренко Галина Яківна", role: "Завідувачка кафедри", degree: "Доктор мистецтвознавства, професор", interests: ["Історія мистецтва", "Візуальна культура"] },
  { id: "2", name: "Шимчук Євген Олександрович", role: "Професор", degree: "Доктор архітектури", interests: ["Брендинг територій", "Урбаністика"] },
  { id: "3", name: "Мельник Оксана Василівна", role: "Доцент", degree: "Кандидат мистецтвознавства", interests: ["Типографіка", "Графічний дизайн"] },
  { id: "4", name: "Ковальчук Ігор Петрович", role: "Старший викладач", degree: "Магістр мистецтва", interests: ["UX/UI Дизайн", "Інтерактивні медіа"] },
  { id: "5", name: "Бойко Наталія Іванівна", role: "Асистент", degree: "Магістр дизайну", interests: ["Ілюстрація", "Анімація"] },
  { id: "6", name: "Савченко Андрій Миколайович", role: "Доцент", degree: "Кандидат архітектури", interests: ["3D моделювання", "Просторовий дизайн"] },
];

const PROJECTS = [
  { id: "1", student: "Анна Мельник", year: "4 курс", title: "Ребрендинг Музею Арсенал", type: "Ідентика", img: "https://storage.googleapis.com/aistudio-v2-dev-usercontent-us-central1/06d203b9b4d84fde9bb8924b1ac8a4ba_f0775d5f-fcda-4a57-ab22-d02f7415497d_bg-01.jpg" },
  { id: "2", student: "Олег Коваль", year: "6 курс", title: "Система навігації для кампусу НУЛП", type: "UX/UI, Environmental", img: "https://storage.googleapis.com/aistudio-v2-dev-usercontent-us-central1/06d203b9b4d84fde9bb8924b1ac8a4ba_f0775d5f-fcda-4a57-ab22-d02f7415497d_bg-01.jpg" },
  { id: "3", student: "Софія Ткачук", year: "3 курс", title: "Плакат 'Літери міста'", type: "Типографіка", img: "https://storage.googleapis.com/aistudio-v2-dev-usercontent-us-central1/06d203b9b4d84fde9bb8924b1ac8a4ba_f0775d5f-fcda-4a57-ab22-d02f7415497d_bg-01.jpg" },
  { id: "4", student: "Іван Марченко", year: "5 курс", title: "Інтерфейс медичної системи 'Pulse'", type: "UX/UI", img: "https://storage.googleapis.com/aistudio-v2-dev-usercontent-us-central1/06d203b9b4d84fde9bb8924b1ac8a4ba_f0775d5f-fcda-4a57-ab22-d02f7415497d_bg-01.jpg" },
  { id: "5", student: "Юлія Савченко", year: "2 курс", title: "Серія паковань 'Lviv Coffee'", type: "Брендинг, Пакування", img: "https://storage.googleapis.com/aistudio-v2-dev-usercontent-us-central1/06d203b9b4d84fde9bb8924b1ac8a4ba_f0775d5f-fcda-4a57-ab22-d02f7415497d_bg-01.jpg" },
  { id: "6", student: "Максим Пономаренко", year: "4 курс", title: "Шрифт 'NeoKyiv'", type: "Шрифтовий дизайн", img: "https://storage.googleapis.com/aistudio-v2-dev-usercontent-us-central1/06d203b9b4d84fde9bb8924b1ac8a4ba_f0775d5f-fcda-4a57-ab22-d02f7415497d_bg-01.jpg" },
];

export async function seedDatabaseIfEmpty() {
  try {
    const newsSnap = await getDocs(collection(db, 'news'));
    if (newsSnap.empty) {
      for (const item of NEWS_ITEMS) {
        await setDoc(doc(db, 'news', item.id), item);
      }
    }

    const staffSnap = await getDocs(collection(db, 'staff'));
    if (staffSnap.empty) {
      for (const item of STAFF_MEMBERS) {
        await setDoc(doc(db, 'staff', item.id), item);
      }
    }

    const projectsSnap = await getDocs(collection(db, 'projects'));
    if (projectsSnap.empty) {
      for (const item of PROJECTS) {
        await setDoc(doc(db, 'projects', item.id), item);
      }
    }
  } catch (err) {
    console.error("Failed to seed db:", err);
  }
}
