import { NextResponse } from 'next/server';
import RSS from 'rss';

import { listAllBlogs } from '@/lib/blogs';

export const revalidate = 3600;
export const dynamic = 'auto';

export async function GET() {
  try {
    const posts = await listAllBlogs();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.blog.egeuysal.com';

    const feed = new RSS({
      title: 'Ege Uysal Blog',
      description: 'Latest blog posts from Ege Uysal',
      feed_url: `${baseUrl}/rss.xml`,
      site_url: baseUrl,
      language: 'en',
      pubDate: new Date().toUTCString(),
      ttl: 60,
    });

    posts
      .filter((post) => post.slug && post.created_at)
      .forEach((post) => {
        feed.item({
          title: post.title,
          description: `${post.content.slice(0, 200)}...`,
          url: `${baseUrl.replace(/\/$/, '')}/${post.slug}`,
          guid: post.id,
          categories: post.tags || [],
          author: post.created_by,
          date: new Date(post.created_at).toUTCString(),
          enclosure: post.cover_link
            ? {
                url: post.cover_link,
                type: 'image/jpeg',
              }
            : undefined,
        });
      });

    const rss = feed.xml({ indent: true });

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
