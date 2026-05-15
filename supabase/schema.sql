-- Social Media Monitor Schema

-- Profiles table: extends NextAuth users
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  email TEXT,
  display_name TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'business')),
  monitors_used INTEGER DEFAULT 0,
  monitors_limit INTEGER DEFAULT 60,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Monitors table: tracks keywords to monitor
CREATE TABLE IF NOT EXISTS monitors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  keyword TEXT NOT NULL,
  platform TEXT DEFAULT 'twitter' CHECK (platform IN ('twitter', 'linkedin', 'instagram')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES profiles(user_id) ON DELETE CASCADE
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_monitors_active ON monitors(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_monitors_user ON monitors(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_detected ON alerts(detected_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_monitor ON alerts(monitor_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
