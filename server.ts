import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini AI client with dynamic key reload
let aiInstance: GoogleGenAI | null = null;
let activeApiKey: string | undefined = undefined;

function getFriendlyGeminiError(error: any): string {
  const errMsg = error.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));
  const apiKey = process.env.GEMINI_API_KEY || "";
  
  if (
    errMsg.includes("UNAUTHENTICATED") || 
    errMsg.includes("401") || 
    errMsg.includes("invalid authentication credentials") || 
    errMsg.includes("ACCESS_TOKEN_TYPE_UNSUPPORTED") ||
    errMsg.includes("API_KEY_INVALID")
  ) {
    if (!apiKey) {
      return "Gemini API Key is missing. Please configure GEMINI_API_KEY in the Settings > Secrets menu.";
    }
    if (!apiKey.startsWith("AIzaSy")) {
      return `Your Gemini API Key format is invalid. A valid Gemini API key must start with 'AIzaSy' (usually 39 characters). The current key in your Secrets starts with '${apiKey.substring(0, 5)}...'. Please generate a correct API key from Google AI Studio and update it in Settings > Secrets.`;
    }
    return "Authentication failed. Please verify that your Gemini API Key in Settings > Secrets is correct, active, and has not been deleted or disabled.";
  }
  return errMsg || "An error occurred with the AI service.";
}

function getGemini(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in the environment. Please configure it in Settings > Secrets.");
  }

  if (!aiInstance || activeApiKey !== apiKey) {
    activeApiKey = apiKey;
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

async function generateContentWithFallback(ai: GoogleGenAI, options: any) {
  const primaryModel = options.model || "gemini-3.5-flash";
  const fallbackModel = "gemini-3.1-flash-lite";

  try {
    return await ai.models.generateContent(options);
  } catch (error: any) {
    const errMsg = error.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));
    const isAuthError = errMsg.includes("UNAUTHENTICATED") || errMsg.includes("401") || errMsg.includes("invalid authentication credentials");
    
    if (!isAuthError && primaryModel !== fallbackModel) {
      console.warn(`Primary model ${primaryModel} failed. Error: ${errMsg}. Retrying with fallback model ${fallbackModel}...`);
      const fallbackOptions = { ...options, model: fallbackModel };
      try {
        return await ai.models.generateContent(fallbackOptions);
      } catch (fallbackError) {
        console.error(`Fallback model ${fallbackModel} also failed:`, fallbackError);
        throw error;
      }
    }
    throw error;
  }
}

// REST APIs
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Authentication Mock Endpoints (Client persists actual session, handles validation gracefully)
app.post("/api/auth/register", (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: "Missing required registration fields" });
  }
  // Standard simulated success, returning secure token structure
  res.json({
    token: `jwt_simulated_token_${Buffer.from(email).toString("base64")}`,
    user: { email, name, attachmentStyle: null, registeredAt: new Date().toISOString() }
  });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }
  res.json({
    token: `jwt_simulated_token_${Buffer.from(email).toString("base64")}`,
    user: { email, name: email.split("@")[0], attachmentStyle: null }
  });
});

// AI Relationship Coach endpoint
app.post("/api/coach/chat", async (req, res) => {
  try {
    const { messages, userProfile } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    const ai = getGemini();

    // Establish system context incorporating attachment style and user patterns
    const attachmentStyle = userProfile?.attachmentStyle || "Not assessed yet";
    const communicationStyle = userProfile?.communicationStyle || "General";
    const conflictStyle = userProfile?.conflictStyle || "General";
    const goals = userProfile?.goals || [];

    const systemInstruction = `You are "Eunoia", a warm, deeply empathetic, supportive, and evidence-informed AI Relationship Coach.
Your tone is elegant, patient, non-judgmental, and encouraging.
You are inspired by attachment theory and act as an educational self-reflection tool, NOT a licensed therapist or clinical psychologist. You must never diagnose mental illness or claim certainty.

Adapt your response naturally to the user's self-reflection profile:
- Attachment Style: ${attachmentStyle}
- Communication Patterns: ${communicationStyle}
- Conflict Style: ${conflictStyle}
- Relationship Goals: ${goals.join(", ") || "General growth"}

Guiding principles:
1. Never shame or judge. Highlight strengths and opportunities for growth.
2. If conversations involve abuse, self-harm, severe domestic violence, or serious mental health emergencies, encourage seeking immediate appropriate professional support, hotline resources, or trusted local support systems.
3. If information is missing, ask gentle, open-ended follow-up questions instead of jumping to rigid conclusions.
4. Format your response beautifully using clean markdown, bullet points, and paragraph breaks to make it elegant and easy to read.`;

    // Map conversation history for Gemini chat
    // The @google/genai SDK chats.create uses a specific format.
    // Let's formulate contents array.
    const contents = messages.map(msg => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    // Generate content using gemini-3.5-flash with fallback to gemini-3.1-flash-lite
    const response = await generateContentWithFallback(ai, {
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.75,
      }
    });

    const reply = response.text || "I'm reflecting on what you said. Could you tell me a bit more?";
    res.json({ content: reply });
  } catch (error: any) {
    console.error("Gemini Coach Chat Error:", error);
    const friendlyError = getFriendlyGeminiError(error);
    res.status(500).json({ error: friendlyError });
  }
});

// Journal Insights Generator
app.post("/api/journal/insights", async (req, res) => {
  try {
    const { text, userProfile } = req.body;
    if (!text || text.trim().length < 5) {
      return res.status(400).json({ error: "Please enter a more descriptive journal entry (at least 5 characters)." });
    }

    const ai = getGemini();

    const attachmentStyle = userProfile?.attachmentStyle || "Unknown";
    const prompt = `Analyze this journal entry. The user's attachment style is: ${attachmentStyle}.
Journal text:
"${text}"

Extract deep relationship insights, emotional dynamics, and constructive communication patterns.
You MUST respond with a valid JSON object matching the requested schema.`;

    const response = await generateContentWithFallback(ai, {
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a professional relationship psychologist consultant. Analyze the journal text to produce structured relationship insights. Avoid diagnoses.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "A warm, 1-2 sentence empathetic summary of the emotional core of this entry."
            },
            emotionalInsights: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2-3 insights detailing the specific emotions highlighted in the entry (e.g., anxiety, fear of intimacy, longing)."
            },
            communicationPatterns: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2-3 insights identifying communication styles present (e.g., conflict avoidance, passive expression, overthinking, healthy clarity)."
            },
            reflectionQuestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2 custom self-reflection questions for their journal moving forward."
            },
            growthSuggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2 action-oriented relationship tips or exercises matching their attachment theory growth needs."
            }
          },
          required: ["summary", "emotionalInsights", "communicationPatterns", "reflectionQuestions", "growthSuggestions"]
        }
      }
    });

    const resultText = response.text?.trim() || "{}";
    const insights = JSON.parse(resultText);
    res.json(insights);
  } catch (error: any) {
    console.error("Journal Analysis Error:", error);
    const friendlyError = getFriendlyGeminiError(error);
    res.status(500).json({ error: friendlyError });
  }
});

// Daily Reflection Generator
app.post("/api/daily/reflection", async (req, res) => {
  try {
    const { userProfile } = req.body;
    const ai = getGemini();

    const attachmentStyle = userProfile?.attachmentStyle || "Secure";
    const prompt = `Generate a personalized daily relationship self-reflection package for a person with an attachment style of: ${attachmentStyle}.
Focus on healthy connection, building emotional intimacy, and self-awareness. Return a beautiful, comforting set of daily exercises.`;

    const response = await generateContentWithFallback(ai, {
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a warm wellness curator. Create rich, encouraging relationship challenges, journal prompts, self-care, and exercises formatted as JSON. Do not make clinical claims.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            prompt: {
              type: Type.STRING,
              description: "An elegant, deep daily reflection question."
            },
            challenge: {
              type: Type.STRING,
              description: "A small, actionable communication challenge for the day."
            },
            reminder: {
              type: Type.STRING,
              description: "A supportive relationship boundary or emotional self-care reminder."
            },
            exercise: {
              type: Type.STRING,
              description: "A short intimacy building or self-connection exercise."
            },
            gratitude: {
              type: Type.STRING,
              description: "A relationship gratitude writing prompt."
            },
            quote: {
              type: Type.STRING,
              description: "A gorgeous, inspiring relationship or self-love quote."
            }
          },
          required: ["prompt", "challenge", "reminder", "exercise", "gratitude", "quote"]
        }
      }
    });

    const resultText = response.text?.trim() || "{}";
    const reflection = JSON.parse(resultText);
    res.json(reflection);
  } catch (error: any) {
    console.error("Daily Reflection Error:", error);
    // Fallback static high-quality reflection
    res.json({
      prompt: "How does your body physically react when you sense minor emotional distance in a relationship, and how can you soothe it?",
      challenge: "Pause for three seconds before responding during any friction point today to check in with your core feelings.",
      reminder: "Your emotional needs are valid, and expressing them clearly is an act of care for both yourself and your relationship.",
      exercise: "Spend 5 minutes in comfortable quiet, focusing on deep diaphragmatic breaths, repeating 'I am secure, whole, and worthy of love.'",
      gratitude: "List three qualities you genuinely appreciate about your communication partner or friend.",
      quote: "To be fully seen by somebody, then, and be loved anyhow - this is a human offering that can border on miraculous. — Elizabeth Gilbert"
    });
  }
});

// Configure Vite or Static File Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Eunoia Full-Stack Server running on port ${PORT}`);
  });
}

startServer();
