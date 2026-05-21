// Twitter API v2 utility functions

const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;
const TWITTER_API_URL = 'https://api.twitter.com/2/tweets/search/recent';

export interface TweetResult {
  id: string;
  text: string;
  author: string;
  authorUsername: string;
  engagement: number;
  createdAt: string;
}

export interface TwitterSearchResponse {
  tweets: TweetResult[];
  meta: {
    resultCount: number;
    newestId?: string;
    oldestId?: string;
  };
  error?: string;
}

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 3
): Promise<Response> {
  const response = await fetch(url, options);

  if (response.status === 429 && retries > 0) {
    const retryAfter = response.headers.get('Retry-After') || '5';
    await new Promise(resolve => setTimeout(resolve, parseInt(retryAfter) * 1000));
    return fetchWithRetry(url, options, retries - 1);
  }

  return response;
}

export async function searchRecentTweets(
  query: string,
  maxResults = 10
): Promise<TwitterSearchResponse> {
  if (!TWITTER_BEARER_TOKEN) {
    return {
      tweets: [],
      meta: { resultCount: 0 },
      error: 'TWITTER_BEARER_TOKEN not configured',
    };
  }

  try {
    const params = new URLSearchParams({
      query: query,
      max_results: Math.min(maxResults, 10).toString(),
      'tweet.fields': 'created_at,public_metrics,author_id',
      'user.fields': 'username',
      'expansions': 'author_id',
    });

    const response = await fetchWithRetry(
      `${TWITTER_API_URL}?${params.toString()}`,
      {
        headers: {
          'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Twitter API error:', response.status, errorText);
      return {
        tweets: [],
        meta: { resultCount: 0 },
        error: `Twitter API error: ${response.status}`,
      };
    }

    const data = await response.json();

    const usersMap = new Map<string, string>();
    if (data.includes?.users) {
      data.includes.users.forEach((user: { id: string; username: string }) => {
        usersMap.set(user.id, user.username);
      });
    }

    const tweets: TweetResult[] = (data.data || []).map((tweet: {
      id: string;
      text: string;
      author_id: string;
      created_at: string;
      public_metrics: { like_count: number; retweet_count: number; reply_count: number };
    }) => ({
      id: tweet.id,
      text: tweet.text,
      author: tweet.author_id,
      authorUsername: usersMap.get(tweet.author_id) || 'unknown',
      engagement: (tweet.public_metrics?.like_count || 0) +
                  (tweet.public_metrics?.retweet_count || 0) +
                  (tweet.public_metrics?.reply_count || 0),
      createdAt: tweet.created_at,
    }));

    return {
      tweets,
      meta: {
        resultCount: data.meta?.result_count || 0,
        newestId: data.meta?.newest_id,
        oldestId: data.meta?.oldest_id,
      },
    };
  } catch (error) {
    console.error('Twitter search failed:', error);
    return {
      tweets: [],
      meta: { resultCount: 0 },
      error: 'Failed to search Twitter',
    };
  }
}
