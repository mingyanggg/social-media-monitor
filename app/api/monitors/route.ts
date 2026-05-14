// Monitors API - list and create keyword monitors
import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: 'Supabase not configured', monitors: [] },
      { status: 200 }
    );
  }

  const { data, error } = await supabase!
    .from('monitors')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching monitors:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ monitors: data || [] });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { keyword, platform = 'twitter' } = body;

  if (!keyword || typeof keyword !== 'string') {
    return NextResponse.json(
      { error: 'Keyword is required' },
      { status: 400 }
    );
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: 'Supabase not configured' },
      { status: 500 }
    );
  }

  const { data, error } = await supabase!
    .from('monitors')
    .insert({
      keyword: keyword.trim(),
      platform,
      user_id: 'default-user',
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating monitor:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ monitor: data }, { status: 201 });
}