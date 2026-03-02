import { NextResponse } from 'next/server';

import { listAllBlogs } from '@/lib/blogs';

export const revalidate = 3600;
export const dynamic = 'auto';

export async function GET() {
  try {
    const posts = await listAllBlogs();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.blog.egeuysal.com';

    const urls = posts
      .filter((post) => post.slug && post.created_at)
      .map(
        (post) => `
      <url>
        <loc>${baseUrl.replace(/\/$/, '')}/${encodeURIComponent(post.slug)}</loc>
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
