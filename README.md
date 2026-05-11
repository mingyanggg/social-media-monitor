# Social Media Monitor (SocialPulse)

AI-powered social media monitoring SaaS for solopreneurs and small teams.

**Live Demo**: [socialpulse.ai](https://socialpulse.ai)

## Features

- **Competitor Intelligence** — Track competitors across Twitter/X, LinkedIn, Instagram, YouTube
- **Brand Mention Detection** — Real-time monitoring with sentiment analysis
- **Trend Discovery** — AI-powered trend detection based on velocity signals
- **Smart Alerts** — Telegram, Email, and Slack notifications

## Pricing

| Plan | Price | Includes |
|------|-------|----------|
| Free | $0/mo | 60 monitors/month, 1 competitor |
| Pro | $19/mo | 1,000 monitors, 5 competitors, all platforms |
| Business | $49/mo | Unlimited, API access, white-label reports |

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
OPENAI_API_KEY=your_openai_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Project Status

⚠️ **Early Stage** — Landing page live. Core monitoring features in development.

---

Built with ❤️ for solopreneurs worldwide
