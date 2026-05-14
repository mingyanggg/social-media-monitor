// Telegram notification helper
// Uses the Telegram Bot API to send alerts

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export interface TelegramAlert {
  keyword: string;
  tweetText: string;
  author: string;
  engagement: number;
  platform?: string;
}

export async function sendTelegramAlert(alert: TelegramAlert): Promise<boolean> {
  if (!BOT_TOKEN || !CHAT_ID) {
    console.warn('Telegram credentials not configured. Skipping notification.');
    return false;
  }

  const message = `🔔 *New mention detected*

📌 Keyword: ${alert.keyword}
💬 ${alert.tweetText}
👤 @${alert.author}
📊 ${alert.engagement.toLocaleString()} engagements`;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: 'Markdown',
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Telegram API error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to send Telegram notification:', error);
    return false;
  }
}