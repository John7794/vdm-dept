import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import fs from "fs";
import Papa from "papaparse";

const SHEET_ID = "1cs6LoN5rdsXjIRWziDAWVyHWNDXKE6UIuzgP7znhjWY";
let cmsCache = {
  data: null as any,
  lastFetch: 0
};
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes

async function fetchCmsData() {
  if (cmsCache.data && (Date.now() - cmsCache.lastFetch < CACHE_DURATION_MS)) {
    return cmsCache.data;
  }

  const sheets = ["Static", "News", "Staff", "Programs", "Projects"];
  const data: any = {};

  for (const sheet of sheets) {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${sheet}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Failed to fetch sheet ${sheet}`);
      continue; // Skip failed sheets instead of throwing to prevent crashing the whole site
    }
    const csv = await res.text();
    
    const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true });
    
    if (sheet === "Static") {
      data.static = {};
      for (const row of parsed.data as any[]) {
        if (row.Key) {
          data.static[row.Key] = {
            UA: row.UA || "",
            EN: row.EN || "",
            DE: row.DE || "",
            PL: row.PL || ""
          };
        }
      }
    } else {
      data[sheet.toLowerCase()] = parsed.data;
    }
  }

  cmsCache.data = data;
  cmsCache.lastFetch = Date.now();
  console.log(`[CMS] Cache updated from Google Sheets at ${new Date().toISOString()}`);
  return data;
}

// Initialize Firebase for Backend using web config
const configPath = path.resolve(process.cwd(), "firebase-applet-config.json");

let db: any = null;
if (fs.existsSync(configPath)) {
  const firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // === АРХІТЕКТУРА БАЗИ ДАНИХ (Бекенд) ===
  // Helper to get time in Kyiv
  const getKyivTime = () => {
    return new Intl.DateTimeFormat('uk-UA', {
      timeZone: 'Europe/Kyiv',
      dateStyle: 'full',
      timeStyle: 'long',
    }).format(new Date());
  };

  // Endpoint отримання форми зворотного зв'язку
  app.post("/api/contact", async (req, res) => {
    try {
      const payload = req.body;
      const timestamp = getKyivTime();
      
      const docData = {
        name: payload.name || "",
        email: payload.email || "",
        message: payload.message || "",
        timestamp,
      };

      if (db) {
        await addDoc(collection(db, "feedbacks"), docData);
      }
      
      // Імітація обробки та логування київського часу в термінал
      console.log(`\n--- [СИНХРОНІЗАЦІЯ ЗАПИТУ] ---`);
      console.log(`Час (Київ): ${timestamp}`);
      console.log(`Дані: ${JSON.stringify(docData, null, 2)}`);
      console.log(`------------------------------\n`);
      
      res.status(200).json({ success: true, message: "OK" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: String(error) });
    }
  });

  // CMS Endpoint
  app.get("/api/cms", async (req, res) => {
    try {
      const data = await fetchCmsData();
      res.json(data);
    } catch (err) {
      console.error("CMS API error", err);
      res.status(500).json({ error: "Failed to load CMS data" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server initialized on port ${PORT}`);
    console.log(`Global timezone context set to: ${getKyivTime()}`);
  });
}

startServer();
