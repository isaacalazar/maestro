# Maestro — AI-Powered Internship Tracker

Maestro is an AI-powered internship tracker that automates the tedious side of a job search. After applying to 120+ internships and getting tired of constantly updating Google Sheets and digging through Gmail, I built Maestro to do it for me. The app connects to your Gmail account, automatically detects internship-related emails (applications, rejections, interview invites, offers), and updates your dashboard in real time so you always know where every application stands.

## 🎥 Demo

▶️ **[Watch the demo on Loom](https://www.loom.com/share/a672f0b8a9a04c238850a0e6880c15f8)**

## ✨ What It Does

- **Auto-detects internship emails** — connects to Gmail and uses NLP-based classification to identify which messages are internship-related (rejections, OAs, interviews, offers).
- **Real-time dashboard** — shows the status of every application (applied → interviewing → offer/rejected) without manual entry.
- **Status change tracking** — if you get a follow-up email from the same company, Maestro updates the existing application instead of creating a duplicate.
- **Manual entry support** — for companies that don't email through Gmail (e.g., Workday portals), you can add applications by hand.
- **Insights view** — response rates, time-to-rejection, and conversion funnels across your full pipeline.

## 🛠️ Built With

- **Frontend:** TypeScript, Next.js, React, TailwindCSS
- **Backend:** Python, Gmail API, OAuth 2.0
- **Database & Caching:** PostgreSQL, Redis
- **AI/NLP:** Custom email classification pipeline for detecting application status
- **Deployment:** Vercel — [maestro-rouge.vercel.app](https://maestro-rouge.vercel.app)

## 🏗️ How I Built It

I started by mapping out the data model — what an "application" actually looks like and how status transitions work (applied → OA → interview → offer/rejection). Once the schema was solid in Postgres, I built the Gmail integration using OAuth 2.0 so users authorize access to their inbox without sharing credentials. The NLP layer was the hardest part: I had to classify thousands of email types (auto-replies, ATS confirmations, recruiter outreach, rejections in 50 different phrasings) without false positives polluting the dashboard. I built the frontend in Next.js with a clean, real-time dashboard, then deployed it to Vercel for fast iteration.

## 🐛 Bugs Fixed Along the Way

- **Duplicate applications:** Initially every Gmail thread created a new entry. Fixed by hashing on company name + role + applied date so follow-up emails update the existing record.
- **Latency on dashboard load:** Initial loads were 4+ seconds for users with thousands of emails. Added Redis caching for the rendered dashboard view, dropped it to under 800ms.
- **OAuth scope creep:** Early version asked for full Gmail access; reduced to read-only metadata + label scopes so users feel safer authorizing.
- **Misclassified rejections:** Phrases like "we'd like to move forward" were flagging as rejections. Retrained the classifier on more nuanced training data.

## 📍 Status

Currently in MVP / public beta. Actively iterating on:
- Redis caching expansion to cut model latency further
- Calendar integration so interviews auto-populate from email confirmations
- Resume-tailoring suggestions based on application outcomes

## 📫 Contact

- **Author:** Isaac Alazar
- **Email:** ialaz@uic.edu
- **LinkedIn:** [linkedin.com/in/isaac-alazar](https://www.linkedin.com/in/isaac-alazar)
- **GitHub:** [github.com/isaacalazar](https://github.com/isaacalazar)
