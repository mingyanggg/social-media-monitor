'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { 
  User, Settings, Bell, Shield, HelpCircle,
  ExternalLink, CheckCircle2, XCircle, AlertTriangle,
  TrendingUp, Eye, MessageCircle, RefreshCw,
  BarChart3, Clock, ToggleLeft, ToggleRight,
  LogOut, ChevronRight, Trash2
} from 'lucide-react';

interface Monitor {
  id: string;
  keyword: string;
  platform: string;
  is_active: boolean;
  created_at: string;
}

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

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const isTelegramConfigured = !!(
    process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN && 
    process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID
  );

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [monitorsRes, alertsRes] = await Promise.all([
        fetch('/api/monitors'),
        fetch('/api/alerts?limit=100'),
      ]);

      const [monitorsData, alertsData] = await Promise.all([
        monitorsRes.json(),
        alertsRes.json(),
      ]);

      if (monitorsRes.ok && monitorsData.monitors) {
        setMonitors(monitorsData.monitors);
      }

      if (alertsRes.ok && alertsData.alerts) {
        setAlerts(alertsData.alerts);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchData();
    }
  }, [status]);

  const handleToggleMonitor = async (monitor: Monitor) => {
    setTogglingId(monitor.id);
    try {
      const res = await fetch('/api/monitors', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: monitor.id, is_active: !monitor.is_active }),
      });

      if (res.ok) {
        setMonitors(prev =>
          prev.map(m =>
            m.id === monitor.id ? { ...m, is_active: !m.is_active } : m
          )
        );
      }
    } catch (err) {
      console.error('Error toggling monitor:', err);
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteMonitor = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/monitors?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMonitors(prev => prev.filter(m => m.id !== id));
        setShowDeleteConfirm(null);
      }
    } catch (err) {
      console.error('Error deleting monitor:', err);
    } finally {
      setDeletingId(null);
    }
  };

  // Calculate stats
  const activeMonitors = monitors.filter(m => m.is_active).length;
  const totalMentions = alerts.length;
  const telegramSent = alerts.filter(a => a.sent_to_telegram).length;
  const recentAlerts = alerts.filter(a => {
    const diff = Date.now() - new Date(a.detected_at).getTime();
    return diff < 3600000; // Last hour
  }).length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Access Denied</h2>
          <p className="text-slate-400 mb-6">Please sign in to view your account</p>
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

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
            <Link href="/dashboard" className="hover:text-white transition">Dashboard</Link>
            <Link href="/account" className="text-white">Account</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Account Settings</h1>
            <p className="text-slate-400 text-sm mt-1">Manage your profile and preferences</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition border border-slate-700"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* Profile Card */}
        <div className="rounded-xl bg-slate-900/80 border border-slate-800/70 p-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center overflow-hidden">
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt={session.user?.name || 'User'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-10 h-10 text-white" />
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-white">
                {session?.user?.name || 'User'}
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                {session?.user?.email || 'Connected via Telegram'}
              </p>
              <div className="flex items-center gap-4 mt-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  Active Account
                </span>
                <span className="text-xs text-slate-500">
                  Member since {formatDate(new Date().toISOString())}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4">
          <div className="rounded-xl bg-slate-900/80 border border-slate-800/70 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-500 text-xs">Active Monitors</span>
              <Settings className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-2xl font-bold text-white">{activeMonitors}</p>
            <p className="text-xs text-slate-500 mt-1">of {monitors.length} total</p>
          </div>

          <div className="rounded-xl bg-slate-900/80 border border-slate-800/70 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-500 text-xs">Total Mentions</span>
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-2xl font-bold text-white">{totalMentions}</p>
            <p className="text-xs text-slate-500 mt-1">all time</p>
          </div>

          <div className="rounded-xl bg-slate-900/80 border border-slate-800/70 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-500 text-xs">Telegram Sent</span>
              <MessageCircle className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-2xl font-bold text-white">{telegramSent}</p>
            <p className="text-xs text-slate-500 mt-1">notifications</p>
          </div>

          <div className="rounded-xl bg-slate-900/80 border border-slate-800/70 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-500 text-xs">Recent Alerts</span>
              <Clock className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-2xl font-bold text-white">{recentAlerts}</p>
            <p className="text-xs text-slate-500 mt-1">last hour</p>
          </div>
        </div>

        {/* Monitors List */}
        <div className="rounded-xl bg-slate-900/80 border border-slate-800/70">
          <div className="p-5 border-b border-slate-800/60">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                Your Monitors
              </h3>
              <Link
                href="/dashboard"
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
              >
                Add New
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {isLoading ? (
            <div className="p-8 flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin" />
            </div>
          ) : monitors.length === 0 ? (
            <div className="p-8 text-center">
              <Eye className="w-8 h-8 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 mb-1">No monitors yet</p>
              <p className="text-sm text-slate-500">Create your first monitor to start tracking</p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium transition"
              >
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/60">
              {monitors.map(monitor => (
                <div
                  key={monitor.id}
                  className="flex items-center justify-between p-4 hover:bg-slate-800/30 transition"
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      monitor.is_active ? 'bg-emerald-400' : 'bg-slate-600'
                    }`} />
                    <div>
                      <p className="text-white font-medium">{monitor.keyword}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-slate-500 capitalize">{monitor.platform}</span>
                        <span className="text-xs text-slate-600">•</span>
                        <span className="text-xs text-slate-500">
                          Created {formatDate(monitor.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleToggleMonitor(monitor)}
                      disabled={togglingId === monitor.id}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                        monitor.is_active
                          ? 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      } disabled:opacity-50`}
                    >
                      {togglingId === monitor.id ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : monitor.is_active ? (
                        <ToggleRight className="w-4 h-4" />
                      ) : (
                        <ToggleLeft className="w-4 h-4" />
                      )}
                      {monitor.is_active ? 'Active' : 'Paused'}
                    </button>
                    {showDeleteConfirm === monitor.id ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDeleteMonitor(monitor.id)}
                          disabled={deletingId === monitor.id}
                          className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 text-sm font-medium transition disabled:opacity-50"
                        >
                          {deletingId === monitor.id ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Confirm'}
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(null)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 text-sm font-medium transition"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowDeleteConfirm(monitor.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition"
                        title="Delete monitor"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Telegram Connection Status */}
        <div className="rounded-xl bg-slate-900/80 border border-slate-800/70 p-5">
          <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
            <MessageCircle className="w-4 h-4 text-cyan-400" />
            Telegram Integration
          </h3>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              isTelegramConfigured 
                ? 'bg-emerald-500/20' 
                : 'bg-amber-500/20'
            }`}>
              {isTelegramConfigured ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-amber-400" />
              )}
            </div>
            <div className="flex-1">
              <p className={`font-medium ${isTelegramConfigured ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isTelegramConfigured ? 'Connected' : 'Not Configured'}
              </p>
              <p className="text-sm text-slate-400 mt-0.5">
                {isTelegramConfigured 
                  ? 'You will receive alerts via Telegram' 
                  : 'Add TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID to receive notifications'
                }
              </p>
            </div>
            {!isTelegramConfigured && (
              <a
                href="https://core.telegram.org/bots#creating-a-new-bot"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium transition"
              >
                Setup Guide
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-3 gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-4 p-5 rounded-xl bg-slate-900/80 border border-slate-800/70 hover:border-slate-700/80 transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium group-hover:text-cyan-400 transition">Dashboard</p>
              <p className="text-xs text-slate-500 mt-0.5">View alerts and analytics</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition" />
          </Link>

          <Link
            href="#"
            className="flex items-center gap-4 p-5 rounded-xl bg-slate-900/80 border border-slate-800/70 hover:border-slate-700/80 transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Settings className="w-5 h-5 text-purple-400" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium group-hover:text-purple-400 transition">Preferences</p>
              <p className="text-xs text-slate-500 mt-0.5">Notification settings</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition" />
          </Link>

          <Link
            href="#"
            className="flex items-center gap-4 p-5 rounded-xl bg-slate-900/80 border border-slate-800/70 hover:border-slate-700/80 transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium group-hover:text-amber-400 transition">Help Center</p>
              <p className="text-xs text-slate-500 mt-0.5">Documentation and support</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition" />
          </Link>
        </div>
      </main>
    </div>
  );
}
