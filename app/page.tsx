import Link from 'next/link';

const features = [
  {
    title: 'Twitter Competitor Intelligence',
    description:
      'Track competitors on Twitter/X. Get Telegram alerts when they post, pivot, or launch — daily digest or instant.',
    icon: '🔍',
  },
  {
    title: 'Brand Mention Detection',
    description:
      'Never miss a conversation about your brand. Daily monitoring on Twitter with sentiment insights.',
    icon: '📣',
  },
  {
    title: 'Trend Discovery',
    description:
      'Surface emerging topics before they go viral. AI-powered trend detection based on velocity and engagement signals.',
    icon: '📈',
  },
  {
    title: 'Smart Alerts',
    description:
      'Get notified via Telegram when keywords spike, competitors act, or opportunities emerge. No missed signals.',
    icon: '⚡',
  },
];

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'For solo creators getting started',
    features: ['60 monitors/month', '1 competitor track', 'Telegram alerts', '7-day history'],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Pro',
    price: '$14',
    period: '/month',
    description: 'For solopreneurs ready to stay ahead',
    features: [
      '1,000 monitors/month',
      '5 competitors tracked',
      'Twitter monitoring',
      'Telegram alerts',
      '7-day history',
      'AI trend detection',
    ],
    cta: 'Start Free Trial',
    highlight: true,
  },
  {
    name: 'Business',
    price: '$39',
    period: '/month',
    description: 'For growing agencies and teams',
    features: [
      'Unlimited monitors',
      'Unlimited competitors',
      'Twitter monitoring',
      'Priority support',
      '90-day history',
      'API access',
      'White-label reports',
    ],
    cta: 'Contact Sales',
    highlight: false,
  },
];

const faqs = [
  {
    q: 'Which social platforms do you monitor?',
    a: 'We focus exclusively on Twitter/X — the platform where competitors are most active and responsive.',
  },
  {
    q: 'How accurate is the competitor tracking?',
    a: 'We use the official Twitter API v2 to track keyword mentions and competitor posts. Detection runs on a scheduled basis — posts are typically picked up within hours of publishing, not minutes.',
  },
  {
    q: 'Can I monitor keywords without tracking competitors?',
    a: 'Absolutely. Brand monitoring and keyword alerts work independently. Many users start with brand mentions before expanding to competitor tracking.',
  },
  {
    q: 'What happens when I hit my monitor limit?',
    a: "You'll receive an upgrade prompt. We don't cut off service mid-month — overages are billed at a prorated rate or queued until your next cycle.",
  },
  {
    q: 'Is there a free trial for Pro?',
    a: 'Yes, 14-day free trial with full Pro features. No credit card required to start.',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">SocialPulse</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground">
              Features
            </a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">
              Pricing
            </a>
            <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground">
              FAQ
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/signin"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Log in
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
            >
              Start Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block rounded-full bg-foreground/5 px-3 py-1 text-sm text-foreground/70 mb-6">
            AI-Powered · Twitter-First · For Solopreneurs
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 max-w-3xl mx-auto">
            Know What Your Competitors Do Before They Do It
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Never miss what matters on Twitter/X. SocialPulse tracks your competitors, brand mentions,
            and emerging trends — so you can react faster and stay ahead. No team required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/signup"
              className="rounded-full bg-foreground px-8 py-3 text-base font-medium text-background transition-colors hover:bg-foreground/90"
            >
              Start Free — No Credit Card
            </Link>
            <Link
              href="#features"
              className="rounded-full border border-foreground/20 px-8 py-3 text-base font-medium transition-colors hover:bg-foreground/5"
            >
              See How It Works
            </Link>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            Free plan includes 60 monitors/month · 14-day Pro trial
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-foreground/[0.02]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Stay Ahead
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Built for solopreneurs who can't afford a full marketing team
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border bg-background p-6 shadow-sm"
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Up and Running in 5 Minutes</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '01', title: 'Add Your Competitors', desc: 'Enter your competitors\' usernames or keywords you want to track' },
              { step: '02', title: 'Set Your Alerts', desc: 'Choose platforms, set thresholds, and pick how you want to be notified' },
              { step: '03', title: 'React in Real Time', desc: 'Receive alerts and act faster than your competition' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-5xl font-bold text-foreground/10 mb-2">{item.step}</div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-foreground/[0.02]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-muted-foreground">
              Start free. Upgrade when you need more.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl border p-6 shadow-sm flex flex-col ${
                  plan.highlight
                    ? 'border-foreground bg-foreground text-background'
                    : 'bg-background'
                }`}
              >
                <div className="mb-4">
                  <h3 className={`font-semibold text-lg ${plan.highlight ? 'text-background' : ''}`}>
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className={`text-4xl font-bold ${plan.highlight ? 'text-background' : ''}`}>
                      {plan.price}
                    </span>
                    <span className={`text-sm ${plan.highlight ? 'text-background/70' : 'text-muted-foreground'}`}>
                      {plan.period}
                    </span>
                  </div>
                  <p className={`text-sm mt-2 ${plan.highlight ? 'text-background/70' : 'text-muted-foreground'}`}>
                    {plan.description}
                  </p>
                </div>
                <ul className="space-y-2 flex-1 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="text-sm flex items-start gap-2">
                      <span className={plan.highlight ? 'text-background' : 'text-foreground'}>✓</span>
                      <span className={plan.highlight ? 'text-background/80' : 'text-muted-foreground'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/signup"
                  className={`rounded-full py-2.5 px-6 text-sm font-medium text-center transition-colors ${
                    plan.highlight
                      ? 'bg-background text-foreground hover:bg-background/90'
                      : 'bg-foreground text-background hover:bg-foreground/90'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-xl border p-6">
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-foreground text-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Stop Reacting. Start Predicting.
          </h2>
          <p className="text-background/70 max-w-xl mx-auto mb-8">
            Join thousands of solopreneurs who use SocialPulse to stay ahead of their competition.
          </p>
          <Link
            href="/auth/signup"
            className="inline-block rounded-full bg-background px-8 py-3 text-foreground font-medium transition-colors hover:bg-background/90"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            © 2025 SocialPulse. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
