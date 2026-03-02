import { NextResponse } from 'next/server';

import { createBlogPost, listBlogsPage } from '@/lib/blogs';
import { createSupabaseServerClient } from '@/lib/supabase/server';

const MAX_LIMIT = 100;

type CreateBlogPayload = {
  title?: unknown;
  content?: unknown;
  slug?: unknown;
  tags?: unknown;
  created_by?: unknown;
  cover_link?: unknown;
};

function parsePositiveInt(value: string | null, fallback: number) {
  const parsed = value ? Number.parseInt(value, 10) : fallback;

  if (!Number.isInteger(parsed) || parsed < 1) {
    return null;
  }

  return parsed;
}

function normalizeString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function normalizePayload(payload: CreateBlogPayload) {
  return {
    title: normalizeString(payload.title),
    content: normalizeString(payload.content),
    slug: normalizeString(payload.slug),
    created_by: normalizeString(payload.created_by),
    cover_link: normalizeString(payload.cover_link),
    tags: Array.isArray(payload.tags)
      ? payload.tags.filter((tag): tag is string => typeof tag === 'string')
      : [],
  };
}

function isUniqueViolation(error: unknown) {
  return error instanceof Error && /duplicate key|unique constraint|23505/i.test(error.message);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const page = parsePositiveInt(searchParams.get('page'), 1);
  const limit = parsePositiveInt(searchParams.get('limit'), 9);

  if (!page || !limit || limit > MAX_LIMIT) {
    return NextResponse.json({ error: 'Invalid pagination parameters' }, { status: 400 });
  }

  try {
    const { data, total } = await listBlogsPage(page, limit);
    return NextResponse.json({ data, total });
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let payload: CreateBlogPayload;

  try {
    payload = (await request.json()) as CreateBlogPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 });
  }

  const normalized = normalizePayload(payload);

  if (!normalized.title || !normalized.content || !normalized.slug || !normalized.created_by) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    await createBlogPost(normalized);
    return NextResponse.json({ message: 'Post created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Failed to create blog post:', error);

    if (isUniqueViolation(error)) {
      return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 409 });
    }

    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}
