# Bharat Pulse AI Newsroom & Multi-Platform Social Media Automation Platform

An enterprise-grade, production-ready **AI-Powered Digital Newsroom & Multi-Platform Publishing System** designed for news organizations, digital publishers, and media agencies.

Built according to the Master Specification ([prompt.txt](file:///c:/xampp/htdocs/social-news-agents/prompt.txt) and [consept.txt](file:///c:/xampp/htdocs/social-news-agents/consept.txt)).

---

## 🌟 Key Capabilities

### 1. Multi-Agent Newsroom Architecture
The platform coordinates 9 specialized autonomous agents:
- **News Research Agent**: Discovers primary facts, collects source URLs, extracts named entities, and builds chronological timelines.
- **Fact Checking Agent**: Cross-examines statements against sources, detects contradictory reports, flags unsupported quotes/statistics, and generates a verification report.
- **News Writer Agent**: Composes rich, structured news stories with SEO titles, breaking headlines, key takeaways, FAQs, and bilingual support (Hindi & English).
- **Headline & SEO Agent**: Generates 5 distinct headline variants (Breaking, SEO, Mobile, Social, WhatsApp), schema markup, and metadata.
- **Social Media Content Agent**: Drafts tailored post copy for **Facebook**, **Instagram Carousel**, **WhatsApp Business Cloud API**, **YouTube Community**, **Twitter/X**, and **Telegram**.
- **Visual Design Agent**: Formulates generative image prompts, thumbnail typography specs, and ensures clear labeling on AI-generated illustrative visuals.
- **Video Producer Agent**: Scripts high-retention 60-second 9:16 vertical videos (YouTube Shorts / Instagram Reels) with second-by-second cues (Hook → Main Fact → Details → Context → CTA) and voiceover text.
- **Publishing & Distribution Agent**: Dispatches content across platform adapters with status tracking and retry capabilities.
- **Audience & Performance Analytics Agent**: Evaluates story reach, engagement, reader traffic, and daily AI cost controls.

---

### 2. Core Operational Workflows
1. **One-Click News Package Studio (`/one-click`)**:
   Enter any topic, press release, or URL. Click **CREATE NEWS PACKAGE** to watch all 7 agents execute in real-time, compile the complete media package, and publish across all connected platforms in one click.
2. **Editorial 3-Column Studio (`/editorial`)**:
   - **Left Column**: Original sources, citations, research brief, entities, and timeline.
   - **Center Column**: Rich interactive news article editor with AI Assist buttons (*Improve Style*, *Shorten*, *Expand*, *To English*, *Headlines*).
   - **Right Column**: AI Fact-Check verification report, score, prominent cautions (`⚠ FACT-CHECK REQUIRED`, `⚠ SOURCE CONFLICT DETECTED`, `⚠ IMAGE IS AI GENERATED`), and version history.
3. **Breaking News Emergency Center (`/breaking-studio`)**:
   Dedicated fast-track mode with dual confirmation to prevent accidental dissemination, 1-line urgency banners, and instant WhatsApp broadcasts.
4. **AI Newsroom Command Center (`Ctrl + K`)**:
   Natural-language newsroom operation prompt box ("Create a news story on...", "Show pending articles", "Find trending stories").
5. **Trending News Radar & RSS Ingestion (`/rss-trends`)**:
   Live wire feed ingestion (PIB, NDTV, Dainik Bhaskar, The Hindu, TechCrunch) with 1-click **Convert to AI Story** capability.
6. **Video Shorts Studio (`/video-studio`)**:
   9:16 vertical phone mockup simulator with TTS voiceover playback and timestamped scene cues.
7. **Public News Website CMS (`/public`)**:
   Reader-facing digital news portal with live Breaking News ticker, hero story, category navigation, and full article reader with FAQs.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, Lucide Icons, React Router |
| **Backend** | Node.js, Express, MySQL2 (`mysql2/promise`), Axios, RSS Parser, JWT |
| **Database** | MySQL / MariaDB (running locally on XAMPP port 3306) with UTF-8 (`utf8mb4`) |
| **AI Providers** | Google Gemini (`gemini-2.5-flash`), OpenAI (`gpt-4o-mini`, `gpt-4o`), Smart Fallback Engine |
| **Deployment** | Docker Compose, Nginx, Linux / Windows |

---

## 🚀 Quick Start Guide

### 1. Database Setup (Local XAMPP)
Ensure MySQL is running on XAMPP (port 3306). The database `social_news_agents` has been created and populated with schema and seed data:
```bash
# Schema & Seeds
server/database/schema.sql
server/database/seed.sql
```

### 2. Start the Backend Server
```bash
cd server
npm install
node index.js
```
The server will start on `http://localhost:5000` and connect to the MySQL database.

### 3. Start the Frontend Development Client
```bash
cd client
npm install
npm run dev
```
The newsroom dashboard will be live at `http://localhost:3000`.

---

## 🔐 Editor Control Room Authentication & Single-Platform Setup

### 1. Editor Control Room Access (`/login`)
The Editor Control Room is securely protected with role-based JWT authentication. Unauthenticated users are automatically redirected to the Access Terminal.
- **Login URL**: `http://localhost:3000/login`
- **Default Accounts**:
  - **Super Admin**: `admin@newsroom.ai` (Password: `password123`)
  - **Senior Editor**: `editor@newsroom.ai` (Password: `password123`)
  - **Fact Checker**: `checker@newsroom.ai` (Password: `password123`)
- **Quick Demo Switcher**: 1-Click fast login buttons on the login terminal for instant development testing.
- **Staff Registration**: New staff members can be registered directly with role assignments.
- **Public News Website**: `http://localhost:3000/public` remains openly accessible to regular news readers without requiring login.

### 2. Unified Single-Screen Platform Setup (`/setup` or `/integrations`)
Upon logging in, editors can configure, verify, and test all digital channels on a **single unified setup screen**:
- **Facebook Page**: Meta Graph API v19.0 (Page ID, Permanent Access Token, App ID)
- **Instagram Professional**: Instagram Graph API (IG Business Account ID, Access Token)
- **WhatsApp Business Cloud API**: Meta Official Cloud API (Phone Number ID, WABA ID, Permanent System User Token)
- **YouTube Studio & Shorts**: Google Cloud Data API v3 (Channel ID, API Key, Video Privacy)
- **Twitter / X**: API v2 Endpoint (API Key, API Secret, Bearer Token, Access Token & Secret)
- **Telegram Broadcast Bot**: Bot API (Bot Token, Channel ID)
- **AI Reasoning Engines**: Google Gemini & OpenAI API Keys
- **Key Features**:
  - **"Auto-Fill Demo Credentials"**: 1-click sandbox credential filler for rapid testing without manual API console logins.
  - **"Test Connection"**: Instant live ping & diagnostic validation for each channel.
  - **"Save All Configurations"**: One-click batch commit to MySQL database.

---


## 📂 Project Architecture

```
social-news-agents/
├── server/
│   ├── config/             # MySQL pool configuration (db.js)
│   ├── database/           # schema.sql, seed.sql, fixUtf8Seed.js
│   ├── agents/             # Multi-agent orchestrator engine
│   ├── providers/          # AIProvider abstraction (Gemini + OpenAI + Fallback)
│   ├── adapters/           # Facebook, Instagram, WhatsApp, YouTube, Twitter adapters
│   ├── routes/             # REST APIs (news, agents, social, rss, trends, settings)
│   ├── .env                # Server environment variables
│   └── index.js            # Express server entry point
├── client/
│   ├── src/
│   │   ├── components/     # Navbar, Sidebar, CommandCenterModal
│   │   ├── pages/          # Dashboard, OneClickStudio, EditorialStudio, etc.
│   │   ├── services/       # api.js API client
│   │   ├── App.jsx         # App routing
│   │   └── main.jsx
│   ├── vite.config.js      # Vite + Tailwind + Proxy
│   └── package.json
├── docker-compose.yml      # Containerized deployment
└── README.md
```
#   n e w s - r o o m - a i  
 