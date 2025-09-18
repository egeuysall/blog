import { NextResponse } from 'next/server';
import type { Blog } from '@/types/general';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

async function fetchAllPosts(): Promise<Blog[]> {
  try {
    const res = await fetch(`${apiUrl}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('Failed to fetch posts', res.status, res.statusText);
      return [];
    }

    const json = await res.json();
    if (!json || !Array.isArray(json.data)) {
      console.error('Unexpected response structure:', json);
      return [];
    }
    return json.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const posts = await fetchAllPosts();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.blog.egeuysal.com';

    if (!Array.isArray(posts)) {
      console.error('Posts is not an array:', posts);
      return new NextResponse('Internal Server Error', { status: 500 });
    }

    const urls = posts
      .filter((post) => post && post.slug && post.created_at)
      .map(
        (post) => `
      <url>
        <loc>${baseUrl.replace(/\/$/, '')}/blog/${encodeURIComponent(post.slug)}</loc>
        <lastmod>${new Date(post.created_at).toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
      </url>`
      )
      .join('');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls}
    </urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
