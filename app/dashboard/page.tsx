'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Search, TrendingUp, TrendingDown, Bell, Users, 
  ExternalLink, AlertTriangle, CheckCircle2, Clock,
  BarChart3, Eye, Zap, Plus
} from 'lucide-react';

const MOCK_ALERTS = [
  {
    id: 1,
    type: 'competitor',
    platform: 'Twitter',
    keyword: '@buffer',
    content: 'Buffer just posted about new AI-powered queue feature',
    sentiment: 'positive',
    time: '12 min ago',
    engagement: 847,
  },
  {
    id: 2,
    type: 'trend',
    platform: 'LinkedIn',
    keyword: '#SocialMediaAI',
    content: 'Trend velocity spike detected: +340% in last 2 hours',
    sentiment: 'neutral',
    time: '34 min ago',
    engagement: 0,
  },
  {
    id: 3,
    type: 'brand',
    platform: 'Twitter',
    keyword: 'SocialPulse',
    content: '@johndoe "Finally switched to @SocialPulse for monitoring — the alerts are instant"',
    sentiment: 'positive',
    time: '1 hr ago',
    engagement: 234,
  },
  {
    id: 4,
    type: 'competitor',
    platform: 'Instagram',
    keyword: '@hootsuite',
    content: 'Hootsuite launched new competitor tracking dashboard',
    sentiment: 'neutral',
    time: '2 hr ago',
    engagement: 1203,
  },
];

const MOCK_TRENDS = [
  { keyword: '#AIinMarketing', velocity: 98, direction: 'up' },
  { keyword: '#SocialMediaTips', velocity: 76, direction: 'up' },
  { keyword: '#ContentCreator', velocity: 65, direction: 'down' },
  { keyword: '#BrandMonitoring', velocity: 43, direction: 'up' },
  { keyword: '#MarketingTools', velocity: 31, direction: 'stable' },
];

const MOCK_COMPETITORS = [
  { name: 'Buffer', handle: '@buffer', followers: '69K', delta: '+2.1%', status: 'active' },
  { name: 'Hootsuite', handle: '@hootsuite', followers: '210K', delta: '+0.8%', status: 'active' },
  { name: 'Sprout Social', handle: '@sproutsocial', followers: '88K', delta: '+1.4%', status: 'active' },
];

const MOCK_STATS = [
  { label: 'Mentions Today', value: '247', delta: '+18%', up: true },
  { label: 'Brand Sentiment', value: '89%', delta: '+3pts', up: true },
  { label: 'Trend Alerts', value: '12', delta: '-2', up: false },
  { label: 'Competitor Posts', value: '34', delta: '+7', up: true },
];

export default function DashboardPage() {
  const [searchInput, setSearchInput] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Eye className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">SocialPulse</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm text-slate-400">
            <Link href="/dashboard" className="text-white">Dashboard</Link>
            <Link href="/#pricing" className="hover:text-white transition">Pricing</Link>
            <a href="https://github.com/mingyanggg/social-media-monitor" target="_blank" rel="noopener" className="hover:text-white transition">GitHub</a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Page header + search */}
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Monitoring Dashboard</h1>
            <p className="text-slate-400 text-sm">Real-time social media intelligence for your brand</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Keyword search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Add keyword..."
                className="pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 w-56"
              />
            </div>
            {/* Platform filter */}
            <select
              value={selectedPlatform}
              onChange={e => setSelectedPlatform(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-sm focus:outline-none focus:border-cyan-500/50 cursor-pointer"
            >
              <option value="all">All Platforms</option>
              <option value="twitter">Twitter/X</option>
              <option value="linkedin">LinkedIn</option>
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
            </select>
            <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium transition">
              <Plus className="w-4 h-4" />
              Add Monitor
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-4">
          {MOCK_STATS.map(stat => (
            <div key={stat.label} className="rounded-xl bg-slate-900/80 border border-slate-800/70 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-500 text-xs">{stat.label}</span>
                {stat.up
                  ? <TrendingUp className="w-4 h-4 text-emerald-400" />
                  : <TrendingDown className="w-4 h-4 text-red-400" />}
              </div>
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
              <p className={`text-xs font-medium ${stat.up ? 'text-emerald-400' : 'text-red-400'}`}>
                {stat.delta} vs yesterday
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Left: Alerts feed */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-semibold flex items-center gap-2">
                <Bell className="w-4 h-4 text-cyan-400" />
                Live Alerts
              </h2>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </span>
            </div>
            <div className="space-y-3">
              {MOCK_ALERTS.map(alert => (
                <div key={alert.id} className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800/60 hover:border-slate-700/80 transition">
                  {/* Platform icon */}
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    alert.platform === 'Twitter' ? 'bg-slate-800 text-white' :
                    alert.platform === 'LinkedIn' ? 'bg-[#0077B5]/20 text-[#0077B5]' :
                    'bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-pink-400'
                  }`}>
                    {alert.platform[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                        alert.type === 'competitor' ? 'bg-amber-500/15 text-amber-400' :
                        alert.type === 'trend' ? 'bg-violet-500/15 text-violet-400' :
                        'bg-cyan-500/15 text-cyan-400'
                      }`}>
                        {alert.type}
                      </span>
                      <span className="text-slate-600 text-xs">#{alert.keyword}</span>
                      <span className="text-slate-600 text-xs ml-auto flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {alert.time}
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm leading-snug mb-2">{alert.content}</p>
                    <div className="flex items-center gap-3">
                      {alert.engagement > 0 && (
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <BarChart3 className="w-3 h-3" />
                          {alert.engagement.toLocaleString()} eng.
                        </span>
                      )}
                      <span className={`text-xs flex items-center gap-1 ${
                        alert.sentiment === 'positive' ? 'text-emerald-400' :
                        alert.sentiment === 'negative' ? 'text-red-400' : 'text-slate-500'
                      }`}>
                        {alert.sentiment === 'positive' ? <CheckCircle2 className="w-3 h-3" /> :
                         alert.sentiment === 'negative' ? <AlertTriangle className="w-3 h-3" /> : null}
                        {alert.sentiment}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Trends + Competitors */}
          <div className="space-y-6">
            {/* Trending */}
            <div className="rounded-xl bg-slate-900/80 border border-slate-800/70 p-5">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Trending Keywords
              </h3>
              <div className="space-y-3">
                {MOCK_TRENDS.map((trend, i) => (
                  <div key={trend.keyword} className="flex items-center gap-3">
                    <span className="text-slate-600 text-xs w-4">{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-slate-300 text-sm font-medium">{trend.keyword}</span>
                        {trend.direction === 'up' && <TrendingUp className="w-3 h-3 text-emerald-400" />}
                        {trend.direction === 'down' && <TrendingDown className="w-3 h-3 text-red-400" />}
                        {trend.direction === 'stable' && <span className="w-3 h-0.5 bg-slate-600 rounded" />}
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1">
                        <div
                          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1 rounded-full transition-all"
                          style={{ width: `${trend.velocity}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-slate-500 text-xs w-10 text-right">{trend.velocity}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Competitors */}
            <div className="rounded-xl bg-slate-900/80 border border-slate-800/70 p-5">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                Competitors
              </h3>
              <div className="space-y-3">
                {MOCK_COMPETITORS.map(comp => (
                  <div key={comp.name} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {comp.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-200 text-sm font-medium">{comp.name}</p>
                      <p className="text-slate-500 text-xs">{comp.handle} · {comp.followers}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 text-xs">{comp.delta}</span>
                      <ExternalLink className="w-3 h-3 text-slate-600" />
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-3 pt-3 border-t border-slate-800 text-cyan-400 text-xs font-medium hover:text-cyan-300 transition flex items-center justify-center gap-1">
                <Plus className="w-3 h-3" />
                Track more competitors
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
