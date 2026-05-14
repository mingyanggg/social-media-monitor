-- Social Media Monitor Schema

-- Monitors table: tracks keywords to monitor
CREATE TABLE IF NOT EXISTS monitors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT DEFAULT 'default-user',
  keyword TEXT NOT NULL,
  platform TEXT DEFAULT 'twitter' CHECK (platform IN ('twitter', 'linkedin', 'instagram')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Alerts table: stores detected tweets/posts
CREATE TABLE IF NOT EXISTS alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  monitor_id UUID REFERENCES monitors(id) ON DELETE CASCADE,
  platform TEXT DEFAULT 'twitter',
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  engagement INTEGER DEFAULT 0,
  sentiment TEXT DEFAULT 'neutral' CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sent_to_telegram BOOLEAN DEFAULT false
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_monitors_active ON monitors(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_alerts_detected ON alerts(detected_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_monitor ON alerts(monitor_id);