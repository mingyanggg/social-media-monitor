// Monitoring worker - checks all active monitors and creates alerts
// Can be called by cron job or manually
import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { searchRecentTweets } from '@/lib/twitter';
import { sendTelegramAlert } from '@/lib/telegram';
import { analyzeSentiment } from '@/lib/minimax';

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: 'Supabase not configured', processed: 0, newAlerts: 0 },
      { status: 200 }
    );
  }

  // Fetch all active monitors
  const { data: monitors, error: monitorsError } = await supabase!
    .from('monitors')
    .select('*')
    .eq('is_active', true);

  if (monitorsError) {
    console.error('Error fetching monitors:', monitorsError);
    return NextResponse.json({ error: monitorsError.message }, { status: 500 });
  }

  if (!monitors || monitors.length === 0) {
    return NextResponse.json({ 
      message: 'No active monitors',
      processed: 0, 
      newAlerts: 0 
    });
  }

  const results = {
    processed: monitors.length,
    newAlerts: 0,
    errors: [] as string[],
  };

  // Process each monitor
  for (const monitor of monitors) {
    try {
      // Search Twitter for this keyword
      const searchResult = await searchRecentTweets(monitor.keyword, 10);

      if (searchResult.error || !searchResult.tweets.length) {
        continue;
      }

      // Check for tweets we haven't already alerted on (basic deduplication)
      const existingAlerts = await supabase!
        .from('alerts')
        .select('content, detected_at')
        .eq('monitor_id', monitor.id)
        .gte('detected_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .then(({ data }) => data || []);

      const existingTexts = new Set(existingAlerts.map(a => a.content.substring(0, 100)));

      // Create alerts for new tweets
      for (const tweet of searchResult.tweets) {
        // Skip if we already have a similar alert
        if (existingTexts.has(tweet.text.substring(0, 100))) {
          continue;
        }

        // Analyze sentiment with MiniMax LLM
        const sentimentResult = await analyzeSentiment(tweet.text);
        const sentiment = sentimentResult.sentiment;

        const { data: alert, error: alertError } = await supabase!
          .from('alerts')
          .insert({
            monitor_id: monitor.id,
            platform: 'twitter',
            content: tweet.text,
            author: tweet.authorUsername,
            engagement: tweet.engagement,
            sentiment,
            detected_at: new Date(tweet.createdAt).toISOString(),
            sent_to_telegram: false,
          })
          .select()
          .single();

        if (alertError) {
          console.error('Error creating alert:', alertError);
          results.errors.push(`Monitor ${monitor.keyword}: ${alertError.message}`);
          continue;
        }

        results.newAlerts++;

        // Send Telegram notification
        const tweetUrl = `https://twitter.com/${tweet.authorUsername}/status/${tweet.id}`;
        const sent = await sendTelegramAlert({
          keyword: monitor.keyword,
          tweetText: tweet.text.substring(0, 200),
          author: tweet.authorUsername,
          engagement: tweet.engagement,
          tweetUrl,
        });

        // Update alert with telegram status
        if (sent) {
          await supabase!
            .from('alerts')
            .update({ sent_to_telegram: true })
            .eq('id', alert.id);
        }
      }
    } catch (error) {
      console.error(`Error processing monitor ${monitor.keyword}:`, error);
      results.errors.push(`Monitor ${monitor.keyword}: ${error}`);
    }
  }

  return NextResponse.json(results);
}