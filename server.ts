import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import {
  SYSTEM_PROMPT_STRICT,
  NOT_FOUND_EXACT_PHRASE,
  ENCYCLOPEDIA_DOCUMENTATION,
} from "./server/knowledgeBase.ts";

dotenv.config();

const app = express();

// Parse port from CLI flags (--port 3000) or DEFAULT_APP_PORT, defaulting to 3000
const args = process.argv.slice(2);
const portArgIndex = args.indexOf("--port");
const argPort =
  portArgIndex !== -1 && args[portArgIndex + 1]
    ? parseInt(args[portArgIndex + 1], 10)
    : null;
const PORT =
  argPort ||
  (process.env.DEFAULT_APP_PORT
    ? parseInt(process.env.DEFAULT_APP_PORT, 10)
    : 3000);

app.use(express.json({ limit: "10mb" }));

// Fast healthcheck endpoint
app.get("/health", (_req, res) => {
  res.status(200).send("OK");
});

// Lazy getter for Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

// Health and state endpoint
app.get("/api/status", (_req, res) => {
  res.json({
    status: "ok",
    databaseReady: true,
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    model: "gemini-3.8-flash",
  });
});

// Chat endpoint adhering strictly to the documentation
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      res.status(400).json({ error: "El mensaje es requerido." });
      return;
    }

    const trimmedMsg = message.trim();
    const ai = getGeminiClient();

    if (ai) {
      // Build conversation contents
      const contents = [];

      if (Array.isArray(history) && history.length > 0) {
        // Keep last 10 turns for context continuity while keeping system prompt strict
        const recentHistory = history.slice(-10);
        for (const item of recentHistory) {
          if (item.role === "user") {
            contents.push({ role: "user", parts: [{ text: item.content }] });
          } else if (item.role === "assistant") {
            contents.push({ role: "model", parts: [{ text: item.content }] });
          }
        }
      }

      contents.push({ role: "user", parts: [{ text: trimmedMsg }] });

      let response;
      let lastError: unknown = null;
      const modelsToTry = ["gemini-3.1-flash-lite", "gemini-3.8-flash"];

      modelLoop: for (const modelName of modelsToTry) {
        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            response = await ai.models.generateContent({
              model: modelName,
              contents,
              config: {
                systemInstruction: SYSTEM_PROMPT_STRICT,
                temperature: 0.2,
                maxOutputTokens: 3000,
              },
            });
            if (response && response.text) {
              break modelLoop;
            }
          } catch (err) {
            lastError = err;
            await new Promise((resolve) => setTimeout(resolve, attempt * 500));
          }
        }
      }

      if (response && response.text) {
        let reply = response.text.trim();
        // Normalize quotes if wrapped
        if (
          reply === `"${NOT_FOUND_EXACT_PHRASE}"` ||
          reply === `'${NOT_FOUND_EXACT_PHRASE}'`
        ) {
          reply = NOT_FOUND_EXACT_PHRASE;
        }
        res.json({ reply });
        return;
      }

      if (lastError) {
        console.warn("Gemini retries exhausted:", lastError);
      }
    }

    // Secondary fallback: search for artist mentions in the documentation
    const lowerQuery = trimmedMsg.toLowerCase();
    const docLines = ENCYCLOPEDIA_DOCUMENTATION.split("\n");
    const matchedSections: string[] = [];

    // Check if query contains any artist name or musical token
    const words = lowerQuery.replace(/[¿?¡!.,;:()]/g, "").split(/\s+/).filter(w => w.length > 3);
    const hasArtistReference = words.some(word =>
      ENCYCLOPEDIA_DOCUMENTATION.toLowerCase().includes(word)
    );

    if (hasArtistReference) {
      // Find matching paragraph/section
      let currentSection: string[] = [];
      let sectionMatches = false;

      for (const line of docLines) {
        if (line.startsWith("===") || line.startsWith("---") || /^\d+\.\s+[A-Z]/.test(line)) {
          if (currentSection.length > 0 && sectionMatches) {
            matchedSections.push(currentSection.join("\n").trim());
          }
          currentSection = [line];
          sectionMatches = words.some(w => line.toLowerCase().includes(w));
        } else {
          currentSection.push(line);
          if (!sectionMatches && words.some(w => line.toLowerCase().includes(w))) {
            sectionMatches = true;
          }
        }
      }
      if (currentSection.length > 0 && sectionMatches) {
        matchedSections.push(currentSection.join("\n").trim());
      }
    }

    if (matchedSections.length > 0) {
      res.json({
        reply: matchedSections.slice(0, 3).join("\n\n---\n\n"),
      });
    } else {
      res.json({
        reply: NOT_FOUND_EXACT_PHRASE,
      });
    }
  } catch (error) {
    console.error("Error processing chat request:", error);
    res.status(500).json({
      reply: NOT_FOUND_EXACT_PHRASE,
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });

  server.on("error", (err: NodeJS.ErrnoException) => {
    if (err.code === "EADDRINUSE") {
      console.error(`Port ${PORT} is already in use. Retrying or waiting...`);
    } else {
      console.error("Server listener error:", err);
    }
  });

  // Graceful shutdown handling
  const shutdown = () => {
    server.close(() => {
      process.exit(0);
    });
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

startServer();
