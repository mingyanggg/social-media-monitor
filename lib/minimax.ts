// MiniMax LLM integration for sentiment analysis
// Uses the MiniMax Chat API via their Anthropic-compatible endpoint

const MINIMAX_API_KEY = process.env.MINIMAX_CN_API_KEY;
const MINIMAX_BASE_URL = process.env.MINIMAX_CN_BASE_URL || 'https://api.minimaxi.com/anthropic';

export type Sentiment = 'positive' | 'negative' | 'neutral';

export interface SentimentResult {
  sentiment: Sentiment;
  confidence: number;
  reason: string;
}

export async function analyzeSentiment(text: string): Promise<SentimentResult> {
  if (!MINIMAX_API_KEY) {
    // Fallback: keyword-based heuristics when no API key
    return heuristicSentiment(text);
  }

  try {
    const response = await fetch(`${MINIMAX_BASE_URL}/v1/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MINIMAX_API_KEY}`,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': MINIMAX_API_KEY,
      },
      body: JSON.stringify({
        model: 'MiniMax-M2.7-highspeed',
        max_tokens: 100,
        messages: [
          {
            role: 'user',
            content: `Analyze the sentiment of this social media post. Respond ONLY with JSON in this exact format, no other text:
{"sentiment": "positive|negative|neutral", "confidence": 0.0-1.0, "reason": "brief reason"}

Post: "${text.substring(0, 500)}"`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('MiniMax API error:', response.status, errText);
      return heuristicSentiment(text);
    }

    const data = await response.json();
    const raw = data.content?.[0]?.text ?? '';

    try {
      const parsed = JSON.parse(raw);
      return {
        sentiment: ['positive', 'negative', 'neutral'].includes(parsed.sentiment)
          ? parsed.sentiment
          : 'neutral',
        confidence: Math.min(1, Math.max(0, parseFloat(parsed.confidence) || 0.5)),
        reason: parsed.reason || '',
      };
    } catch {
      return parseSentimentFromText(raw, text);
    }
  } catch (error) {
    console.error('Sentiment analysis failed:', error);
    return heuristicSentiment(text);
  }
}

function parseSentimentFromText(raw: string, original: string): SentimentResult {
  const lower = raw.toLowerCase();
  if (lower.includes('"positive"') || lower.includes('"sentiment": "positive')) {
    return { sentiment: 'positive', confidence: 0.6, reason: raw.substring(0, 80) };
  }
  if (lower.includes('"negative"') || lower.includes('"sentiment": "negative')) {
    return { sentiment: 'negative', confidence: 0.6, reason: raw.substring(0, 80) };
  }
  return heuristicSentiment(original);
}

// Fallback: keyword-based sentiment when no API available
function heuristicSentiment(text: string): SentimentResult {
  const lower = text.toLowerCase();
  const positive = ['great', 'amazing', 'love', 'excellent', 'awesome', 'best', 'fantastic', 'wonderful', 'perfect', 'happy', 'excited', 'good', 'helpful', 'impressive', 'innovative', '感谢', '支持', '太棒', '喜欢', '牛', '好用', '赞'];
  const negative = ['bad', 'terrible', 'hate', 'worst', 'awful', 'horrible', 'poor', 'fail', 'broken', 'bug', 'error', 'slow', 'trash', 'useless', 'disappointed', '讨厌', '垃圾', '烂', '差', '问题', '失败', '坑'];

  let score = 0;
  for (const w of positive) if (lower.includes(w)) score++;
  for (const w of negative) if (lower.includes(w)) score--;

  if (score > 0) return { sentiment: 'positive', confidence: 0.5, reason: 'keyword match' };
  if (score < 0) return { sentiment: 'negative', confidence: 0.5, reason: 'keyword match' };
  return { sentiment: 'neutral', confidence: 0.5, reason: 'no signal' };
}
