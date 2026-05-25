# SocialPulse — Twitter Intelligence for Solopreneurs

Your daily competitor intelligence on Twitter/X. Set up in 3 minutes, get Telegram alerts, forget about it.

**Live Demo**: [socialpulse.ai](https://socialpulse.ai)

## Features

- **Competitor Tracking** — Monitor competitors on Twitter/X. Get Telegram alerts when they post, pivot, or launch.
- **Brand Mention Detection** — Never miss a conversation about your brand. Daily monitoring with sentiment insights.
- **Trend Discovery** — Surface emerging topics before they go viral. AI-powered trend detection based on velocity signals.
- **Smart Alerts** — Telegram notifications when keywords spike or competitors act. No missed signals.

## Pricing

| Plan | Price | Includes |
|------|-------|----------|
| Free | $0/mo | 60 monitors/month, 1 competitor, Telegram alerts, 7-day history |
| Pro | $14/mo | 1,000 monitors, 5 competitors, Twitter monitoring, Telegram alerts, 7-day history, AI trend detection |
| Business | $39/mo | Unlimited monitors, unlimited competitors, Twitter monitoring, priority support, 90-day history, API access, white-label reports |

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase Edge Functions
- **AI**: OpenAI GPT-4o for trend analysis and sentiment
- **Database**: Supabase (PostgreSQL, Auth, Storage)
- **Monitoring**: Plausible Analytics (privacy-first)

## Quick Start

```bash
git clone https://github.com/mingyanggg/social-media-monitor.git
cd social-media-monitor
npm install
npm run dev
```

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=***
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Project Status

⚠️ **Early Stage** — Landing page live. Twitter monitoring and Telegram alerts operational.

---

Built with ❤️ for solopreneurs worldwide