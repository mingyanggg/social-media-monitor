// Twitter API v2 integration for searching recent tweets
// Re-exports from lib/twitter.ts

import { NextRequest, NextResponse } from 'next/server';
import { searchRecentTweets } from '@/lib/twitter';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q') || searchParams.get('query');

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter "q" or "query" is required' },
      { status: 400 }
    );
  }

  const result = await searchRecentTweets(query);

  if (result.error && !result.tweets.length) {
    return NextResponse.json(
      { error: result.error },
      { status: 500 }
    );
  }

  return NextResponse.json(result);
}