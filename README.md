BoanLINKS Website

Official website for BoanLINKS — an AI-powered integrated cybersecurity service platform.


🏗️ Tech Stack
LayerTechnologyFrontendVanilla HTML / CSS / JavaScript (Single Page Application)HostingGitHub PagesDatabaseSupabase (PostgreSQL)Backend APISupabase Edge Functions (Deno)Email DeliveryResend APIAutomationGitHub Actions

📁 Project Structure
boanlinks-testpage2/
├── index.html                  # Main SPA file (all pages included)
├── package.json                # type: module config
├── scripts/
│   └── crawl.js                # Auto-crawler for Jinnhyun Security news
└── .github/
    └── workflows/
        └── crawl.yml           # GitHub Actions scheduler (daily at 9AM KST)

⚙️ Features
Press Center — Auto Sync

GitHub Actions crawls Jinnhyun Security daily at 9AM
New articles are saved to the Supabase press table (duplicates skipped automatically)
The frontend fetches articles dynamically via the Supabase REST API

Contact Form — DB + Email

Form submissions are saved to the Supabase contacts table
A Supabase Edge Function triggers Resend API to send an email notification to the team

AI Chatbot

Accessible via the chat button in the top-right corner
Provides instant answers about BoanLINKS solutions and services


🔐 Environment Variables
GitHub Secrets (for the crawler)
KeyDescriptionSUPABASE_URLSupabase project URLSUPABASE_KEYSupabase secret key
Supabase Edge Function Secrets
KeyDescriptionRESEND_KEYResend API key
Public constants in index.html
javascriptconst SUPABASE_URL = 'https://xxxxxxxx.supabase.co';
const SUPABASE_KEY = 'sb_publishable_...';  // Publishable key (read-only)

🗄️ Database Schema
press — Press Center articles
sqlid          bigint (PK, auto)
cat         text              -- e.g. News / Press Release / Award
title       text
date        text
source      text
summary     text
img         text
content     text
origin_url  text (unique)     -- prevents duplicates
created_at  timestamptz
contacts — Inquiry submissions
sqlid          bigint (PK, auto)
company     text
dept        text
scale       text
biz         text
name        text
pos         text
phone       text
email       text
msg         text
created_at  timestamptz

🚀 Deployment

Pushing to the main branch automatically updates GitHub Pages
The crawler runs on a daily schedule and can also be triggered manually from the Actions tab


📝 Notes

Resend free plan only sends to the registered email until a domain is verified
→ Before going live, verify boanlinks.com under Domains in the Resend dashboard
Supabase free tier: 500MB DB / 500K API requests per month
GitHub Actions free tier: unlimited for public repositories
