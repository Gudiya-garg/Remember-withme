# 🌸 Personal Memory Companion
> **“Games That Adapt to the Person, Not the Patient.”**  
> *An AI-based cognitive gaming and memory assistance platform for elderly individuals with Mild Cognitive Impairment (MCI) and early dementia.*

---

## 🏆 Hackathon Quick Start (Under 2 Minutes)

To experience the complete product flow in under 2 minutes:
1. **Start the Backend:** `cd backend && npm run dev` (Runs on `http://localhost:5000`)
2. **Start the Frontend:** `cd frontend && npm run dev` (Runs on `http://localhost:3000`)
3. Open `http://localhost:3000` in your browser.
4. Click **"Try Demo (Shanti Devi)"** on the landing page or navbar.
5. Play through **Today's Memory Journey**:
   - Notice the large, high-contrast, accessible touch interface designed specifically for elderly users.
   - Answer the familiar face question (daughter **Meena**) and request a gentle clue with audio read-aloud.
   - Observe the **real-time adaptive intelligence** banner explaining why the next activity adjusts.
   - Complete the session to see the compassionate **Memory Journey Summary**.
6. Switch to **Caregiver Dashboard** to inspect:
   - Today's engagement metrics.
   - Frequently recalled people vs. memories needing gentle repetition.
   - The signature **Memory Thread™** connecting Entity ➔ Memory ➔ Generated Game ➔ Adaptive Signal.
   - The non-diagnostic caregiver support insights.

---

## 💡 The Problem

Most existing brain-training applications for older adults rely on abstract geometric puzzles, clinical countdown timers, and demoralizing percentage scores (e.g., *"Brain Score: 42% - Failing"*).

For elderly individuals experiencing Mild Cognitive Impairment (MCI) or dementia, these generic games:
- Induce anxiety, frustration, and clinical intimidation.
- Disconnect from the person's real identity, history, and family.
- Trigger patient resistance and abandonment.

---

## 🌟 The Solution & Core USP: Personalization Through Familiar Memories

Instead of generic puzzles, **Personal Memory Companion** invites family caregivers to provide familiar life memories:
- **Family Photos & Relationships** (e.g., Daughter Meena visiting on Sundays with warm carrot halwa).
- **Cherished Places** (e.g., The sunlit courtyard veranda with the sacred Tulsi plant, or the ancient Shiva temple).
- **Beloved Melodies** (e.g., *Kabhi Kabhie Mere Dil Mein* on vintage radio).
- **Daily Rhythms & Routines** (e.g., Morning ginger tea at 7:00 AM, afternoon rest, evening brass bell prayer).
- **Milestone Events** (e.g., Daughter's wedding in Jaipur, grandson's college graduation).

### The Core Contrast:
| Generic Brain Training App | Personal Memory Companion |
| :--- | :--- |
| *"Match the identical polygons within 30 seconds."* | *"Who is this smiling on the veranda?"* |
| Shows abstract shapes or random stock objects. | Shows daughter Meena holding homemade halwa. |
| Demoralizing score: *"Your accuracy: 40%"* | Supportive voice: *"Wonderful! That gentle clue helped bring back that warm memory."* |
| High stress, clinical feel. | Calm, dignified, digital family album feel. |

---

## 🎨 Dual-Experience Product Design

The platform strictly separates the experience into two tailored modes:

### 1. Elderly User Mode ("Memory Companion")
- **Large touch targets** (min 60px height).
- **Large, high-legibility typography** (24px–32px headers, 18px body).
- **Warm, calming palette** (creamy linen `#FAF8F5`, deep charcoal text `#1E293B`, soft sage green `#2D6A4F`, warm amber `#D97706`).
- **Minimal distractions**: 1 clear question and 2–3 generous choice cards per screen.
- **Supportive Audio**: One-click **Web Speech API** read-aloud in English or Hindi.
- **Affectionate Clues**: "I need a little help" reveals gentle stories rather than penalizing the user.
- **No stressful timers or failure scores.**

### 2. Caregiver Dashboard & Memory Album
- **Not an admin table**: Designed like a serene wellness center combined with a digital family album.
- **Engagement analytics**: Completed activities, calm focus time, hints requested.
- **Memory Insights**: Tracks frequently recalled people and suggests gentle conversation topics for struggling memories.
- **Visual Adaptation Timeline**: Transparent explanation of why difficulty changed.
- **Memory Richness Meter**: Guides caregivers to balance photos, routines, and favorite tunes.
- **Ethical Medical Disclaimer**: Non-diagnostic reassurance.

---

## 🧩 The 7 Personalized Game Engines

1. **Who Is This?** — Displays familiar portrait, asks for name/relationship, offers affectionate clues.
2. **Memory Match** — Matches related cards from life events and family members.
3. **Complete the Memory** — Partial family story prompts with gentle multiple-choice completions.
4. **Sequence My Day** — Orders familiar morning, afternoon, and evening routines chronologically.
5. **Place & Memory** — Identifies peaceful hometown sanctuaries or memorable vacation spots.
6. **Music Memory** — Connects beloved vintage melodies (e.g., Mukesh & Lata classics) with personal nostalgia and audio humming cues.
7. **Story Recall** — Short, comforting narrative followed by a simple recall question.

---

## 🧵 Signature UI Element: The Memory Thread™

The **Memory Thread™** is the visual identity of the platform. It maps the end-to-end journey of an elderly person's memory:

$$\text{Stored Entity} \longrightarrow \text{Cherished Memory} \longrightarrow \text{Personalized Game} \longrightarrow \text{Adaptive Intelligence}$$

**Example:**
- **Entity**: 👩 Meena (Daughter)
- **Memory**: *"Sunday visits with warm carrot halwa on the veranda"*
- **Game**: *Who Is This?*
- **Adaptive Signal**: Instant recall in 3.4 seconds without hints ➔ Stepped up to Level 2 with subtle neighbor distractors to maintain curiosity.

---

## 🧠 AI / Agentic Architecture

The backend is built around a modular multi-agent system:

1. **Memory Agent (`memoryAgent.ts`)**:
   - Organizes caregiver-provided memories into structured entities.
   - Evaluates profile richness across 5 dimensions (People, Places, Favorites, Events, Routines).
   - Generates actionable tips to expand memory variety.

2. **Game Generation Agent (`gameGenerationAgent.ts`)**:
   - Transforms memory records into the 7 game types.
   - Employs deterministic generative templates with localized strings (`en` and `hi`).
   - Caches journey sets to minimize computational overhead.

3. **Adaptation Agent (`adaptationAgent.ts`)**:
   - Evaluates performance signals: correct/incorrect, response time, hints requested, skipped interactions.
   - Adjusts difficulty level (1 to 3) in real-time.
   - Manages the `gentleRepetitionQueue` to reintroduce forgotten memories with supportive clues.

4. **Caregiver Insight Agent (`caregiverInsightAgent.ts`)**:
   - Computes recall success rates per family member.
   - Synthesizes caregiver recommendations (e.g., *"Look through old Agra photo albums during Sunday tea"*).
   - Constructs the adaptation timeline and trend metrics.

5. **Safety & Support Layer (`safetySupportLayer.ts`)**:
   - Sanitizes text to prevent anxiety-inducing clinical vocabulary (*dementia test*, *failed*, *brain score*).
   - Injects comforting affirmations (*"You are doing beautifully"*, *"Take all the time you need"*).
   - Enforces the medical disclaimer.

---

## ⚡ Token / Cost Optimization Strategy

Sending large system prompts to an LLM on every game turn is expensive, slow, and prone to hallucinations. Our architecture enforces a cost-efficient hybrid model:

1. **Structured Memory JSON**: Memories are stored as lean, typed JSON schemas.
2. **Local Deterministic Game Generators**: Standard game layouts use local template engines that run with **0 LLM token cost** and sub-millisecond latency.
3. **Pluggable LLM Interface**: An external LLM (OpenAI / Gemini) is only invoked when novel story synthesis is requested.
4. **Cached Journeys**: Today's memory journey is generated once per session and cached.
5. **Rule-Based Adaptive Engine**: Difficulty adjustments run locally on the server without consuming API credits.

---

## 🌐 Bilingual Support (English & Hindi)

- Instant language switcher in the navbar (`English` / `हिंदी`).
- Full bilingual dictionary covering all titles, prompts, buttons, hints, and feedback.
- Web Speech API configured with voice synthesis for `en-IN` and `hi-IN`.

---

## 🛠️ Tech Stack

- **Frontend**:
  - React 19 + TypeScript
  - Vite 8
  - Tailwind CSS v4 (with `@tailwindcss/vite`)
  - Lucide React (Accessible healthcare icons)
  - Canvas Confetti (Gentle positive affirmations)
  - Web Speech API (Voice read-aloud)
- **Backend**:
  - Node.js (v20+) + Express.js
  - TypeScript (via `tsx`)
  - RESTful API Architecture
  - Modular In-Memory Repository with automatic local JSON persistence (`data/store.json`)
  - Ready for MongoDB / Firebase integration

---

## 📂 Project Structure

```
├── backend/
│   ├── data/
│   │   └── store.json              # Local persistent JSON data store
│   ├── src/
│   │   ├── agents/
│   │   │   ├── memoryAgent.ts       # Richness & memory organization
│   │   │   ├── gameGenerationAgent.ts # 7 game generators
│   │   │   ├── adaptationAgent.ts   # Adaptive difficulty & repetition
│   │   │   ├── caregiverInsightAgent.ts # Caregiver metrics & threads
│   │   │   └── safetySupportLayer.ts # Non-diagnostic language & affirmations
│   │   ├── controllers/            # Profile, Memory, Game, Caregiver controllers
│   │   ├── db/
│   │   │   ├── database.ts         # Modular database abstraction
│   │   │   └── seedData.ts         # Realistic demo data (Shanti Devi)
│   │   ├── routes/
│   │   │   └── api.ts              # REST API routing
│   │   ├── types/
│   │   │   └── index.ts            # TypeScript domain types
│   │   └── server.ts               # Express server entry point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── games/              # 7 interactive game components
│   │   │   │   ├── WhoIsThisGame.tsx
│   │   │   │   ├── MemoryMatchGame.tsx
│   │   │   │   ├── CompleteMemoryGame.tsx
│   │   │   │   ├── SequenceDayGame.tsx
│   │   │   │   ├── PlaceMemoryGame.tsx
│   │   │   │   ├── MusicMemoryGame.tsx
│   │   │   │   └── StoryRecallGame.tsx
│   │   │   ├── MemoryThread.tsx    # Signature UI component
│   │   │   ├── Navbar.tsx          # Dual-mode switcher & language toggle
│   │   │   ├── RichnessIndicator.tsx # Profile richness progress
│   │   │   └── SessionSummaryModal.tsx # Post-session supportive summary
│   │   ├── context/
│   │   │   └── LanguageContext.tsx  # Bilingual context + speech synthesis
│   │   ├── i18n/
│   │   │   └── translations.ts     # Complete English & Hindi dictionaries
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx     # Hero & 2-minute demo launcher
│   │   │   ├── MemoryProfilePage.tsx # Page 1: Profile builder
│   │   │   ├── ElderlyGamePage.tsx # Page 2: Personalized game engine
│   │   │   ├── CaregiverDashboardPage.tsx # Page 3: Caregiver insights
│   │   │   └── MemoryLibraryPage.tsx # Page 4: Digital family album
│   │   ├── services/
│   │   │   └── api.ts              # Frontend API client
│   │   ├── types/
│   │   │   └── index.ts            # Frontend domain types
│   │   ├── App.tsx                 # Main application & routing
│   │   └── index.css               # Warm wellness styling & elderly buttons
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── .env.example
└── README.md
```

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Step 1: Install & Start Backend
```bash
cd backend
npm install
npm run dev
```
*The backend server will run at `http://localhost:5000`.*  
*Health check: `http://localhost:5000/api/health`*

### Step 2: Install & Start Frontend
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```
*The frontend Vite dev server will run at `http://localhost:3000` (or `http://localhost:5173`).*

---

## 📡 REST API Endpoints

### Memory Profiles
- `GET  /api/profile/:id` — Retrieve memory profile and richness score.
- `PUT  /api/profile/:id` — Update profile details, language preference, and notes.

### Memories
- `GET    /api/memories?profileId=...&category=...` — Retrieve stored memories.
- `POST   /api/memories` — Add new memory item (auto-enriches tags and updates richness).
- `PUT    /api/memories/:id` — Update memory item.
- `DELETE /api/memories/:id` — Delete memory item.

### Cognitive Games
- `GET  /api/games/today?profileId=...` — Generate personalized daily memory journey.
- `POST /api/games/generate` — On-demand game generation with custom difficulty.
- `POST /api/games/:id/attempt` — Submit user attempt (triggers real-time adaptation engine).

### Caregiver & Adaptation
- `GET  /api/caregiver/dashboard/:profileId` — Get caregiver analytics, insights, and memory threads.
- `GET  /api/adaptation/:profileId` — Inspect current difficulty and repetition queue.

### Sessions & Demo
- `POST /api/session/start` — Start a cognitive session.
- `POST /api/session/:id/end` — End session and return warm summary.
- `POST /api/demo/reset` — 1-click reset to Shanti Devi baseline demo data.

---

## ⚖️ Ethical & Medical Disclaimer

> **Important:** *Personal Memory Companion is a supportive wellness and cognitive assistance prototype designed to stimulate positive emotional memories and provide comfort. It is NOT a medical device and does NOT diagnose, evaluate, or treat Alzheimer's disease, MCI, or any other medical condition. All activity insights are provided strictly for caregiver support.*
