import type { Metadata } from 'next';
import React from 'react';

import '@/styles/blog.css';
import { getBlogBySlug } from '@/lib/blogs';
import { stripMarkdown } from '@/lib/utils';

function getShortDescription(text: string, maxLength = 165): string {
  if (!text) {
    return '';
  }

  const cleaned = stripMarkdown(text);

  if (cleaned.length <= maxLength) {
    return cleaned;
  }

  const trimmed = cleaned.slice(0, maxLength);
  const lastSpace = trimmed.lastIndexOf(' ');
  return trimmed.slice(0, lastSpace > 0 ? lastSpace : maxLength) + '...';
}

export const revalidate = 3600;
export const dynamic = 'auto';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  let post;

  try {
    post = await getBlogBySlug(slug);
  } catch (error) {
    console.error('Error fetching post metadata:', error);
    post = null;
  }

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested post could not be found.',
      openGraph: { type: 'article' },
      twitter: { card: 'summary' },
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.blog.egeuysal.com';
  const canonical = `${siteUrl.replace(/\/$/, '')}/${slug}`;
  const shortDesc = getShortDescription(post.content || '');
  const ogImageUrl = post.cover_link || '/site.png';

  return {
    title: post.title,
    description: shortDesc,
    openGraph: {
      title: post.title,
      description: shortDesc,
      url: canonical,
      type: 'article',
      images: ogImageUrl
        ? [
            {
              url: ogImageUrl,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : undefined,
    },
    other: {
      'article:author': post.created_by || 'Ege Uysal',
      ...(post.created_at && {
        'article:published_time': new Date(post.created_at).toISOString(),
      }),
      ...(post.tags.length > 0 && { 'article:tag': post.tags.join(', ') }),
    },
    twitter: {
      card: ogImageUrl ? 'summary_large_image' : 'summary',
      title: post.title,
      description: shortDesc,
      images: ogImageUrl ? [ogImageUrl] : undefined,
    },
    alternates: { canonical },
  };
}

export default function SlugLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
