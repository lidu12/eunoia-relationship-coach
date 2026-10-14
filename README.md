# Eunoia - AI Relationship Coach

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://eunoia-relationship-coach.vercel.app)
[![React 19](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Gemini](https://img.shields.io/badge/Google%20Gemini-Flash-orange?style=for-the-badge&logo=google)](https://aistudio.google.com/)

**Eunoia** is a full-stack relationship wellness platform and AI-powered digital coach designed to help users build healthier relationships through mindful communication, emotional awareness, and attachment-theory-informed growth.

🔗 **Live Application**: [https://eunoia-relationship-coach.vercel.app](https://eunoia-relationship-coach.vercel.app)

---

## ✨ Features

* **🤖 AI Relationship Coach** – Engage in deep, empathetic, multi-turn dialogues with an AI coach informed by attachment theory to navigate friction, communicate needs, and build intimacy.
* **📋 Relationship Health Assessment** – Guided self-assessment evaluating attachment style, trust, communication patterns, and conflict tendencies with comprehensive visualization.
* **📖 Guided Relationship Journal** – Log daily reflections and let Eunoia extract structured psychological insights, emotional patterns, and actionable growth exercises.
* **📊 Mood Tracker & Emotional Analytics** – Track your emotional baseline with daily mood scoring, weekly trend curves, and trigger analysis powered by Recharts.
* **🎯 Relationship Goals** – Define and track personal or shared relationship milestones with automated target timelines and habit reinforcement.
* **🔒 Privacy-First Architecture** – Your personal logs, assessments, and chat history persist securely in your local browser storage.

---

## 💻 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts, Motion |
| **Backend API** | Node.js, Express, Vercel Serverless Functions |
| **AI Integration** | Google Gemini API (`@google/genai`) with high-availability multi-model fallback (`gemini-3.5-flash-lite`, `gemini-3.8-flash`, `gemini-flash-latest`) |
| **Deployment** | Vercel (Global CDN + Serverless Functions) |

---

## 🚀 Live Deployment (Vercel)

The project is pre-configured with unified serverless routing:
- **Frontend**: Pre-rendered Vite SPA served globally with caching.
- **Backend**: Express API endpoints executed serverless under `/api` via [`api/index.ts`](file:///c:/Users/Hp/Downloads/eunoia%20relationship%20coach/api/index.ts).

### Setting up on Vercel:

1. Import your GitHub repository into [Vercel](https://vercel.com/new).
2. Configure your build settings (detected automatically):
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Under **Settings → Environment Variables**, add:
   - `GEMINI_API_KEY`: *(Your Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey))*
4. Under **Settings → Deployment Protection**, ensure **Vercel Authentication** is **Disabled** so that your site is publicly accessible to all users.

---

## 🛠️ Local Development

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/lidu12/eunoia-relationship-coach.git
cd eunoia-relationship-coach
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY="your-google-gemini-api-key"
PORT=3000
```
> *(Get your free Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey). Keys start with `AIzaSy...`)*

### 3. Run the Development Server
```bash
# Starts Express server with Vite HMR on http://localhost:3000
npm run dev
```

### 4. Build for Production Test
```bash
npm run build
npm start
```

---

## 📁 Project Structure

```text
├── api/
│   └── index.ts          # Serverless Express entry point for Vercel
├── src/
│   ├── components/       # UI views (CoachChat, Assessment, Journal, MoodTracker, Dashboard)
│   ├── types.ts          # TypeScript domain interfaces (User, ChatSession, Goals, etc.)
│   ├── App.tsx           # Primary application container & navigation
│   └── main.tsx          # React application root
├── server.ts             # Express & Vite local dev runner / Docker server
├── vercel.json           # Vercel SPA rewrites & serverless routing
├── package.json          # Dependencies & build scripts
└── tsconfig.json         # TypeScript configuration
```

---

## 🔑 Environment Variables

| Variable | Description | Required | Default |
| :--- | :--- | :---: | :--- |
| `GEMINI_API_KEY` | Google Gemini API key from AI Studio | **Yes** | — |
| `PORT` | Local web server port | Optional | `3000` |
| `NODE_ENV` | Environment mode (`production` / `development`) | Optional | `development` |

---

## 📄 License

MIT License. Designed with care for healthy human connections.
