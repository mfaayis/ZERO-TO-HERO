# ⚡ Limitless — Self-Development Platform

> The premium self-development platform that turns daily habits into extraordinary life outcomes. Gamified tasks, AI coaching, habit tracking, and a 50,000+ strong community.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/zero-to-hero)

---

## 🌐 Live Sites

| Site | URL |
|---|---|
| Marketing Website | [limitless.vercel.app](https://limitless.vercel.app) |
| App (React) | [app.limitless.vercel.app](https://app-limitless.vercel.app) |

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Vanilla CSS (custom design system) |
| Auth | Firebase Auth (Email, Google, GitHub) |
| Database | Firebase Firestore |
| AI | Google Gemini API |
| Backend | Express.js (API proxy) |
| Deployment | Vercel |
| Marketing Site | Plain HTML/CSS/JS |

---

## 📁 Project Structure

```
zero-to-hero/
├── src/                    # React app source
│   ├── components/         # Auth, UI components
│   ├── App.tsx             # Main app with Firestore sync
│   └── firebase.ts         # Firebase SDK init
├── website/                # Marketing website (static)
│   ├── index.html          # Landing page
│   ├── about.html
│   ├── services.html
│   ├── contact.html
│   ├── style.css
│   └── main.js
├── server.ts               # Express API (Gemini proxy)
├── vercel.json             # Vercel config (React app)
└── .env.example            # Environment variable template
```

---

## ⚙️ Setup & Development

### 1. Clone & install
```bash
git clone https://github.com/YOUR_USERNAME/zero-to-hero.git
cd zero-to-hero
npm install
```

### 2. Configure environment variables
```bash
cp .env.example .env.local
# Fill in your Firebase and Gemini API keys
```

### 3. Run locally
```bash
npm run dev       # Starts Vite dev server + Express API
```

---

## 🔑 Environment Variables

Create `.env.local` with the following:

```env
# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Firebase (from Firebase Console → Project Settings)
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

> ⚠️ **Never commit `.env.local`** — it's in `.gitignore`

---

## 🔥 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable **Authentication** → Sign-in methods:
   - ✅ Email/Password
   - ✅ Google
   - ✅ GitHub (requires GitHub OAuth App)
4. Enable **Firestore Database** (start in test mode)
5. Copy config from Project Settings → Your Apps → Web App

---

## 🚢 Deploy to Vercel

### Marketing Website
```bash
cd website
npx vercel --prod
```

### React App
```bash
npx vercel --prod
# Add environment variables in Vercel Dashboard → Settings → Environment Variables
```

---

## 📄 License

MIT © 2026 Limitless
