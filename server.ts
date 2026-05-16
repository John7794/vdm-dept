import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import fs from "fs";

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
