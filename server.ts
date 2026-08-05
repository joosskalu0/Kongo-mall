import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  const PORT = 3000;

  function getGeminiClient() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({ apiKey });
  }

  // API Health Endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", app: "Atelier Artisanal" });
  });

  // AI Advisor Endpoint
  app.post("/api/advisor", async (req, res) => {
    try {
      const { message } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          reply: "Bonjour ! Je suis l'artisan-conseiller de l'Atelier. Pour un cadeau élégant, je vous suggère notre Vase Cannelé en Grès Moucheté (68€) ou notre Bague en Argent Martelé (75€).",
          recommendations: ["prod-1", "prod-4"]
        });
      }

      const prompt = `Tu es l'artisan créateur et conseiller bienveillant du site "Atelier Artisanal".
Tu réponds en français avec passion pour l'artisanat d'art fait-main, la beauté des matières nobles et le travail d'atelier.
Garde un ton élégant, chaleureux et concis (3 à 4 phrases maximum).

Produits du catalogue :
1) prod-1 : Vase Cannelé en Grès Moucheté (68€) - Céramique
2) prod-2 : Sac Besace "Le Voyageur" Cuir Végétal (245€) - Maroquinerie
3) prod-3 : Planche de Service Sculptée Noyer Massif (89€) - Ébénisterie
4) prod-4 : Bague Argent 925 Martelé (75€) - Bijoux
5) prod-5 : Plaid Tissé Main Laine Mérinos (160€) - Textile
6) prod-6 : Duo Bougies Artisanales Cire Soja (42€) - Senteurs
7) prod-7 : Tasses Espresso Grès (46€) - Céramique
8) prod-8 : Étui Liseuse Cuir Végétal (92€) - Maroquinerie
9) prod-9 : Pendentif Pierre de Lune & Fil d'Or (115€) - Bijoux
10) prod-10 : Lampe à Poser Bois Chêne Cintré (195€) - Ébénisterie

Si tu t'appuies sur des produits spécifiques, termine IMPÉRATIVEMENT par une ligne contenant exactement :
RECOMMENDATIONS:["prod-X", "prod-Y"]

Demande du client : "${message}"`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const text = response.text || "";
      let reply = text;
      let recommendations: string[] = [];

      const recMatch = text.match(/RECOMMENDATIONS:\s*(\[[^\]]+\])/);
      if (recMatch) {
        try {
          recommendations = JSON.parse(recMatch[1]);
        } catch (e) {
          // ignore parsing error
        }
        reply = text.replace(/RECOMMENDATIONS:\s*(\[[^\]]+\])/, "").trim();
      }

      res.json({ reply, recommendations });
    } catch (error) {
      console.error("AI Advisor error:", error);
      res.json({
        reply: "Ravi de vous conseiller ! Pour une idée cadeau universelle, le duo de tasses à espresso en grès émaillé ou le coffret bougies artisanales sont des valeurs sûres.",
        recommendations: ["prod-7", "prod-6"]
      });
    }
  });

  // Secure Payment & Order Simulation Endpoint
  app.post("/api/checkout", (req, res) => {
    const { items, shippingAddress, paymentDetails } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Votre panier est vide." });
    }

    const orderId = "ART-2026-" + Math.floor(1000 + Math.random() * 9000);
    const trackingNumber = "FR" + Math.floor(100000000 + Math.random() * 900000000) + "AT";

    res.json({
      success: true,
      orderId,
      trackingNumber,
      estimatedDelivery: "Sous 3 à 4 jours ouvrés dans un emballage éco-responsable renforcé.",
      status: "confirmée"
    });
  });

  // Vite Middleware in Dev, Static serve in Production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
