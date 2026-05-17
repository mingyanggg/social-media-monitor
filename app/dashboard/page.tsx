'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Search, TrendingUp, TrendingDown, Bell, Users, 
  ExternalLink, AlertTriangle, CheckCircle2, Clock,
  BarChart3, Eye, Zap, Plus, RefreshCw, Settings
} from 'lucide-react';
import AddMonitorModal from './components/AddMonitorModal';

const AUTO_POLL_INTERVAL = 5 * 60 * 1000; // 5 minutes

interface Alert {
  id: string;
  platform: string;
  content: string;
  author: string;
  engagement: number;
  sentiment: string;
  detected_at: string;
  monitors?: { keyword: string };
  sent_to_telegram?: boolean;
}

interface Monitor {
  id: string;
  keyword: string;
  platform: string;
  is_active: boolean;
  created_at: string;
}

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
  { label: 'Mentions Today', value: '—', delta: 'No data', up: true },
  { label: 'Active Monitors', value: '—', delta: 'No data', up: true },
  { label: 'Trend Alerts', value: '—', delta: 'No data', up: false },
  { label: 'New Alerts', value: '—', delta: 'No data', up: true },
];

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hr ago`;
  return `${Math.floor(diffHours / 24)} days ago`;
}

export default function DashboardPage() {
  const [searchInput, setSearchInput] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isAutoPolling, setIsAutoPolling] = useState(false);
  const [nextPollIn, setNextPollIn] = useState(AUTO_POLL_INTERVAL / 1000);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Check if APIs are configured
      const hasTwitterToken = process.env.NEXT_PUBLIC_TWITTER_BEARER_TOKEN || false;
      const hasSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;
      
      if (!hasSupabase) {
        setIsDemoMode(true);
        setIsLoading(false);
        return;
      }

      // Fetch alerts
      const alertsRes = await fetch('/api/alerts?limit=50');
      const alertsData = await alertsRes.json();
      
      if (alertsRes.ok && alertsData.alerts) {
        setAlerts(alertsData.alerts);
      }

      // Fetch monitors
      const monitorsRes = await fetch('/api/monitors');
      const monitorsData = await monitorsRes.json();
      
      if (monitorsRes.ok && monitorsData.monitors) {
        setMonitors(monitorsData.monitors);
      }

      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Auto-poll monitoring: run checks every 5 minutes when in live mode
  useEffect(() => {
    if (isDemoMode || monitors.length === 0) {
      setIsAutoPolling(false);
      return;
    }

    const startAutoPoll = () => {
      setIsAutoPolling(true);
      setNextPollIn(AUTO_POLL_INTERVAL / 1000);

      // Countdown timer (update every second)
      countdownRef.current = setInterval(() => {
        setNextPollIn(prev => {
          if (prev <= 1) return AUTO_POLL_INTERVAL / 1000;
          return prev - 1;
        });
      }, 1000);

      // Auto-run monitor check every 5 minutes
      pollIntervalRef.current = setInterval(async () => {
        setNextPollIn(AUTO_POLL_INTERVAL / 1000);
        await handleRunMonitor();
      }, AUTO_POLL_INTERVAL);
    };

    startAutoPoll();

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [isDemoMode, monitors.length]);

  const handleRunMonitor = async () => {
    try {
      const res = await fetch('/api/monitor', { method: 'POST' });
      const data = await res.json();
      
      if (res.ok) {
        // Refresh alerts after running monitor
        await fetchData();
      }
    } catch (err) {
      console.error('Error running monitor:', err);
    }
  };

  // Calculate stats from real data
  const stats = [
    { 
      label: 'Mentions Today', 
      value: alerts.length.toString(), 
      delta: lastUpdated ? `Updated ${formatTimeAgo(lastUpdated.toISOString())}` : 'No data', 
      up: true 
    },
    { 
      label: 'Active Monitors', 
      value: monitors.filter(m => m.is_active).length.toString(), 
      delta: `${monitors.length} total`, 
      up: true 
    },
    { 
      label: 'Telegram Sent', 
      value: alerts.filter(a => a.sent_to_telegram).length.toString(), 
      delta: 'notifications', 
      up: true 
    },
    { 
      label: 'New Alerts', 
      value: alerts.filter(a => {
        const diff = Date.now() - new Date(a.detected_at).getTime();
        return diff < 3600000; // Last hour
      }).length.toString(), 
      delta: 'last hour', 
      up: true 
    },
  ];

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
        {/* Demo Mode Banner */}
        {isDemoMode && (
          <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-400 mb-1">Demo Mode Active</h3>
                <p className="text-sm text-amber-300/80 mb-3">
                  API keys are not configured. To enable real monitoring:
                </p>
                <div className="text-sm text-slate-300 space-y-1 font-mono bg-black/20 rounded-lg p-3">
                  <div><span className="text-amber-400">TWITTER_BEARER_TOKEN</span>=your_twitter_token</div>
                  <div><span className="text-amber-400">NEXT_PUBLIC_SUPABASE_URL</span>=your_supabase_url</div>
                  <div><span className="text-amber-400">SUPABASE_SERVICE_ROLE_KEY</span>=your_service_key</div>
                  <div><span className="text-amber-400">TELEGRAM_BOT_TOKEN</span>=your_bot_token (optional)</div>
                  <div><span className="text-amber-400">TELEGRAM_CHAT_ID</span>=your_chat_id (optional)</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-red-400">{error}</span>
          </div>
        )}

        {/* Page header + search */}
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-white">Monitoring Dashboard</h1>
              {isDemoMode && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium">
                  Demo Mode
                </span>
              )}
            </div>
            <p className="text-slate-400 text-sm">
              {isDemoMode 
                ? 'Configure API keys to enable real monitoring' 
                : 'Real-time social media intelligence for your brand'}
            </p>
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
            </select>
            <button 
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium transition"
            >
              <Plus className="w-4 h-4" />
              Add Monitor
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-4">
          {stats.map(stat => (
            <div key={stat.label} className="rounded-xl bg-slate-900/80 border border-slate-800/70 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-500 text-xs">{stat.label}</span>
                {stat.up
                  ? <TrendingUp className="w-4 h-4 text-emerald-400" />
                  : <TrendingDown className="w-4 h-4 text-red-400" />}
              </div>
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.delta}</p>
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
              <div className="flex items-center gap-2">
                {lastUpdated && (
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTimeAgo(lastUpdated.toISOString())}
                  </span>
                )}
                {isAutoPolling && (
                  <span className="text-xs text-cyan-400 flex items-center gap-1" title={`Next check in ${nextPollIn}s`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    Auto {nextPollIn}s
                  </span>
                )}
                <button 
                  onClick={handleRunMonitor}
                  disabled={isDemoMode || isLoading}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition disabled:opacity-50"
                  title="Run monitoring check"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
            
            {isLoading ? (
              <div className="rounded-xl bg-slate-900/80 border border-slate-800/60 p-8 flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin" />
              </div>
            ) : alerts.length === 0 ? (
              <div className="rounded-xl bg-slate-900/80 border border-slate-800/60 p-8 text-center">
                <Bell className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 mb-1">No alerts yet</p>
                <p className="text-sm text-slate-500">
                  {isDemoMode 
                    ? 'Add your API keys to start monitoring'
                    : 'Create a monitor and run a check to detect mentions'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.map(alert => (
                  <div key={alert.id} className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800/60 hover:border-slate-700/80 transition">
                    {/* Platform icon */}
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      alert.platform === 'twitter' ? 'bg-slate-800 text-white' :
                      'bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-pink-400'
                    }`}>
                      {alert.platform === 'twitter' ? 'X' : alert.platform[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs px-1.5 py-0.5 rounded font-medium bg-cyan-500/15 text-cyan-400">
                          {alert.monitors?.keyword || alert.platform}
                        </span>
                        <span className="text-slate-600 text-xs ml-auto flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTimeAgo(alert.detected_at)}
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
                        <span className="text-xs text-slate-500">@{alert.author}</span>
                        <span className={`text-xs flex items-center gap-1 ${
                          alert.sentiment === 'positive' ? 'text-emerald-400' :
                          alert.sentiment === 'negative' ? 'text-red-400' : 'text-slate-500'
                        }`}>
                          {alert.sentiment === 'positive' ? <CheckCircle2 className="w-3 h-3" /> :
                           alert.sentiment === 'negative' ? <AlertTriangle className="w-3 h-3" /> : null}
                          {alert.sentiment}
                        </span>
                        {alert.sent_to_telegram && (
                          <span className="text-xs text-cyan-400">✓ Telegram</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Trends + Competitors */}
          <div className="space-y-6">
            {/* Active Monitors */}
            <div className="rounded-xl bg-slate-900/80 border border-slate-800/70 p-5">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Settings className="w-4 h-4 text-cyan-400" />
                Active Monitors
              </h3>
              {monitors.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">
                  No monitors yet. Click "Add Monitor" to create one.
                </p>
              ) : (
                <div className="space-y-2">
                  {monitors.slice(0, 5).map(monitor => (
                    <div key={monitor.id} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${monitor.is_active ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                        <span className="text-slate-300 text-sm">{monitor.keyword}</span>
                      </div>
                      <span className="text-xs text-slate-500">{monitor.platform}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

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

      <AddMonitorModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        onSuccess={fetchData}
      />
    </div>
  );
}