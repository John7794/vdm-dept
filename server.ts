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

  const sheets = ["Static", "News", "Staff", "Programs", "Projects", "Disciplines"];
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

  // Helper to split text into safe chunks for Google TTS
  function splitTextForTts(text: string, maxLen = 90): string[] {
    const words = text.split(/\s+/);
    const chunks: string[] = [];
    let current = "";
    for (const w of words) {
      if (!w) continue;
      if ((current + " " + w).trim().length <= maxLen) {
        current = (current + " " + w).trim();
      } else {
        if (current) chunks.push(current);
        current = w;
      }
    }
    if (current) chunks.push(current);
    return chunks.slice(0, 15); // Cap to 15 chunks (~1350 characters)
  }

  // TTS (Text-to-Speech) Endpoint for Accessibility
  app.get("/api/tts", async (req, res) => {
    try {
      const text = (req.query.text as string || "").trim();
      const lang = ((req.query.lang as string) || "uk").toLowerCase().slice(0, 5);

      if (!text) {
        return res.status(400).send("Text is required");
      }

      const chunks = splitTextForTts(text, 90);
      if (chunks.length === 0) {
        return res.status(400).send("Empty text");
      }

      const audioBuffers = await Promise.all(
        chunks.map(async (chunk) => {
          const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
            chunk
          )}&tl=${encodeURIComponent(lang)}&client=tw-ob`;
          const resp = await fetch(url, {
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            },
          });
          if (!resp.ok) {
            throw new Error(`TTS chunk failed with status ${resp.status}`);
          }
          const ab = await resp.arrayBuffer();
          return Buffer.from(ab);
        })
      );

      const combinedBuffer = Buffer.concat(audioBuffers);

      res.setHeader("Content-Type", "audio/mpeg");
      res.setHeader("Cache-Control", "public, max-age=86400");
      res.send(combinedBuffer);
    } catch (err: any) {
      console.error("[TTS Error]:", err?.message || err);
      res.status(500).send("TTS generation failed");
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
