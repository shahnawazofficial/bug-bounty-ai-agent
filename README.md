# Bug Bounty AI Agent

A production-ready, full-stack cybersecurity platform for automated security scanning of GitHub repositories.

![Platform Preview](./docs/preview.png)

## 🚀 Features

- **GitHub OAuth** — Sign in with GitHub, sync your repositories
- **Multi-Scanner Engine** — Semgrep, Gitleaks, Trivy (with built-in pattern scanner fallback)
- **Security Scoring** — Visual score per repository (0–100)
- **Vulnerability Dashboard** — Critical, High, Medium, Low severity breakdown
- **Detailed Findings** — File paths, line numbers, scanner source, remediation tips
- **Real-time Scan Tracking** — Monitor scan progress and history

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + TypeScript + Tailwind CSS + Vite |
| Backend | Node.js + Express.js |
| Database | PostgreSQL + Prisma ORM |
| Auth | GitHub OAuth + JWT |
| Scanners | Semgrep, Gitleaks, Trivy, Pattern Scanner |

## 📁 Project Structure

```
bug-bounty-ai-agent/
├── frontend/          # React + Vite frontend
│   └── src/
│       ├── components/    # Layout, shared UI
│       ├── context/       # Auth context
│       ├── pages/         # All pages
│       └── services/      # API client
└── backend/           # Express API
    └── src/
        ├── controllers/   # Route handlers
        ├── middleware/     # JWT auth
        ├── routes/        # Route definitions
        ├── services/      # Scanner service
        └── lib/           # Prisma client
```

## ⚙️ Setup

### Prerequisites
- Node.js 18+
- PostgreSQL
- Git

### 1. Clone & Install

```bash
# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend && npm install
```

### 2. Configure Backend

```bash
cp .env.example .env
# Edit .env with your credentials:
# - DATABASE_URL (PostgreSQL connection string)
# - JWT_SECRET (random secret)
# - GITHUB_CLIENT_ID & GITHUB_CLIENT_SECRET (from GitHub OAuth App)
```

### 3. GitHub OAuth App Setup
1. Go to GitHub → Settings → Developer Settings → OAuth Apps
2. Create new OAuth App
3. Set **Authorization callback URL** to: `http://localhost:3001/api/auth/github/callback`
4. Copy Client ID and Client Secret to `.env`

### 4. Database Setup

```bash
cd backend
npx prisma migrate dev --name init
```

### 5. Run Development Servers

```bash
# Backend (http://localhost:3001)
cd backend && npm run dev

# Frontend (http://localhost:5173)
cd frontend && npm run dev
```

## 🔐 Security Scanners

| Scanner | Purpose | Requires Installation |
|---------|---------|----------------------|
| Semgrep | SAST - Code vulnerabilities | `pip install semgrep` |
| Gitleaks | Secret detection | [gitleaks.io](https://gitleaks.io) |
| Trivy | Dependency CVEs | [trivy.dev](https://trivy.dev) |
| Pattern Scanner | Built-in fallback | ✅ No installation needed |

The platform works out-of-the-box with the built-in Pattern Scanner even if Semgrep/Gitleaks/Trivy aren't installed.

## 🚀 Deployment

- **Frontend**: Deploy to Vercel/Netlify (set `VITE_API_URL` env var)
- **Backend**: Deploy to Railway/Render/Heroku
- **Database**: Railway PostgreSQL / Supabase / Neon

## 📋 Future Features

- [ ] Gemini AI vulnerability explanations
- [ ] AI remediation suggestions  
- [ ] Android app
- [ ] GitHub webhooks for auto-scanning on push
- [ ] Team collaboration & org support
- [ ] CVE intelligence feed

## 📄 License

MIT
