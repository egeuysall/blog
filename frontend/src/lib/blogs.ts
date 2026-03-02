import type { Blog } from '@/types/general';
import { createSupabaseAdminClient } from '@/lib/supabase/server';

const BLOG_COLUMNS = 'id,title,content,slug,tags,created_at,created_by,cover_link';

type BlogRow = {
  id: string;
  title: string;
  content: string;
  slug: string;
  tags: string[] | null;
  created_at: string | null;
  created_by: string;
  cover_link: string | null;
};

export type BlogInsert = Pick<Blog, 'title' | 'content' | 'slug' | 'created_by' | 'cover_link'> & {
  tags: string[];
};

function normalizeBlog(row: BlogRow): Blog {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    slug: row.slug,
    tags: Array.isArray(row.tags) ? row.tags.filter(Boolean) : [],
    created_at: row.created_at ?? '',
    created_by: row.created_by,
    cover_link: row.cover_link ?? '',
  };
}

function normalizeTags(tags: string[]): string[] {
  return Array.from(
    new Set(
      tags
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)
    )
  );
}

function getPageRange(page: number, pageSize: number) {
  if (page === 1) {
    return {
      from: 0,
      to: pageSize,
    };
  }

  const from = 1 + (page - 1) * pageSize;

  return {
    from,
    to: from + pageSize - 1,
  };
}

export async function listBlogsPage(page = 1, pageSize = 9) {
  const { from, to } = getPageRange(page, pageSize);

  const { data, count, error } = await createSupabaseAdminClient()
    .from('blog_posts')
    .select(BLOG_COLUMNS, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    throw error;
  }

  return {
    data: (data ?? []).map((row) => normalizeBlog(row as BlogRow)),
    total: count ?? 0,
  };
}

export async function listAllBlogs() {
  const { data, error } = await createSupabaseAdminClient()
    .from('blog_posts')
    .select(BLOG_COLUMNS)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => normalizeBlog(row as BlogRow));
}

export async function getBlogBySlug(slug: string) {
  const { data, error } = await createSupabaseAdminClient()
    .from('blog_posts')
    .select(BLOG_COLUMNS)
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? normalizeBlog(data as BlogRow) : null;
}

export async function createBlogPost(input: BlogInsert) {
  const payload = {
    title: input.title.trim(),
    content: input.content.trim(),
    slug: input.slug.trim(),
    tags: normalizeTags(input.tags),
    created_by: input.created_by.trim(),
    cover_link: input.cover_link.trim() || null,
  };

  const { error } = await createSupabaseAdminClient().from('blog_posts').insert(payload);

  if (error) {
    throw error;
  }
}
