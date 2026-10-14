# Eunoia - AI Relationship Coach

**Eunoia** is a full-stack relationship wellness platform and AI-powered digital coach designed to help users build healthier relationships through mindful communication, emotional awareness, and personal growth.

---

## ✨ Features

* **AI Relationship Coach** – Chat with an evidence-informed AI coach to navigate conflicts, improve communication, and gain relationship insights.
* **Relationship Health Assessment** – Complete a guided assessment covering trust, communication, intimacy, and compatibility, with a detailed visual report.
* **Guided Journaling** – Record thoughts, emotions, and weekly reflections with prompts that encourage self-awareness.
* **Mood Tracker** – Log daily moods, identify emotional triggers, and visualize trends over time.
* **Relationship Goals** – Set personal or shared relationship goals, track progress, and build positive habits.

---

## 🎨 Design

Eunoia follows a calm, minimalist design focused on clarity and emotional safety.

* Warm neutral color palette with sage accents
* Clean typography and generous spacing
* Fully responsive across desktop, tablet, and mobile
* Simple, distraction-free interface designed for self-reflection

---

## 💻 Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons, Recharts, Motion
- **Backend**: Node.js, Express
- **AI**: Google Gemini API via `@google/genai` (secure server-side integration)

---

## 🚀 Deployment Guide

This project can be deployed seamlessly to **Vercel**, **Render**, **Railway**, or via **Docker**.

### Prerequisites
Before deploying, make sure you have:
1. A **Google Gemini API Key** from [Google AI Studio](https://aistudio.google.com/).
2. Your code pushed to your GitHub repository (`eunoia-relationship-coach`).

---

### Option 1: Deploy on Vercel (Recommended)

This project includes unified Vercel configuration:
- **Frontend**: Built with Vite and served statically across Vercel's global CDN.
- **Backend**: Express API routes execute as serverless functions under `/api` via [`api/index.ts`](file:///c:/Users/Hp/Downloads/eunoia%20relationship%20coach/api/index.ts).

#### Step-by-Step Vercel Deployment:
1. **Push your changes to GitHub**:
   ```bash
   git add .
   git commit -m "Configure Vercel serverless deployment"
   git push origin main
   ```
2. Go to **[vercel.com/new](https://vercel.com/new)** and log in with your GitHub account.
3. Import your repository: **`eunoia-relationship-coach`**.
4. Vercel will automatically detect the Vite configuration:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Open the **Environment Variables** section and add:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: *(your Google Gemini API key)*
6. Click **Deploy**.

---

### Option 2: Deploy on Render (Free Web Service)

1. Go to [render.com](https://render.com) and sign in.
2. Click **New +** > **Web Service**.
3. Connect your GitHub repository (`eunoia-relationship-coach`).
4. Configure settings:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/api/health`
5. Under **Environment Variables**, add:
   - `GEMINI_API_KEY`: *(paste your Gemini API key)*
   - `NODE_ENV`: `production`
6. Click **Deploy Web Service**.

---

### Option 3: Deploy on Railway

1. Go to [railway.com](https://railway.com) and sign in.
2. Click **New Project** > **Deploy from GitHub repo**.
3. Select `eunoia-relationship-coach`.
4. In the **Variables** tab, add:
   - `GEMINI_API_KEY`: *(paste your Gemini API key)*
   - `NODE_ENV`: `production`
5. In **Settings** > **Networking**, click **Generate Domain**.

---

### Option 4: Deploy with Docker / Cloud Run / VPS

A production multi-stage [`Dockerfile`](file:///c:/Users/Hp/Downloads/eunoia%20relationship%20coach/Dockerfile) is included:

```bash
# Build container image
docker build -t eunoia-coach .

# Run container
docker run -p 3000:3000 -e GEMINI_API_KEY="your-gemini-key" eunoia-coach
```

---

## 🛠 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env
# Edit .env and set GEMINI_API_KEY

# 3. Start development server (with Vite HMR)
npm run dev

# 4. Production build test
npm run build
npm start
```

---

## 🔑 Environment Variables

| Variable | Description | Required |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Google Gemini API key from AI Studio | **Yes** |
| `PORT` | Web server port (set automatically by cloud providers) | Optional (Default: 3000) |
| `NODE_ENV` | Environment mode (`production` / `development`) | Optional |
