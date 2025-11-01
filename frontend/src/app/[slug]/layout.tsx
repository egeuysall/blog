import type { Metadata } from 'next';
import React from 'react';
import '@/styles/blog.css';

function getShortDescription(text: string, maxLength = 165): string {
  if (!text) return '';

  let cleaned = text
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // bold
    .replace(/(\*|_)(.*?)\1/g, '$2') // italic
    .replace(/#{1,6}\s/g, '') // headings
    .replace(/!\[.*?\]\(.*?\)/g, '') // images
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // links
    .replace(/`{1,3}[^`\n]+`{1,3}/g, '') // inline code
    .replace(/^>\s/gm, '') // blockquotes
    .replace(/^[-*+]\s/gm, '') // unordered lists
    .replace(/^\d+\.\s/gm, '') // ordered lists
    .replace(/~~(.*?)~~/g, '$1') // strikethrough
    .replace(/\n+/g, ' ') // newlines to spaces
    .trim();

  if (cleaned.length <= maxLength) return cleaned;
  const trimmed = cleaned.slice(0, maxLength);
  const lastSpace = trimmed.lastIndexOf(' ');
  return trimmed.slice(0, lastSpace > 0 ? lastSpace : maxLength) + '...';
}

export const revalidate = 3600;
export const dynamic = 'auto';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = params;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  let res;
  try {
    res = await fetch(`${apiUrl}/${slug}`);
  } catch (error) {
    console.error('Error fetching post metadata:', error);
    return {
      title: 'Post Not Found',
      description: 'The requested post could not be found.',
      openGraph: { type: 'article' },
      twitter: { card: 'summary' },
    };
  }

  if (!res.ok) {
    return {
      title: 'Post Not Found',
      description: 'The requested post could not be found.',
      openGraph: { type: 'article' },
      twitter: { card: 'summary' },
    };
  }

  let post;
  try {
    const json = await res.json();
    post = json.data;
    if (!post) {
      throw new Error('Post data is missing');
    }
  } catch (error) {
    console.error('Error parsing post data:', error);
    return {
      title: 'Post Not Found',
      description: 'The requested post could not be found.',
      openGraph: { type: 'article' },
      twitter: { card: 'summary' },
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.blog.egeuysal.com';
  const canonical = `${siteUrl.replace(/\/$/, '')}/blog/${slug}`;
  const shortDesc = getShortDescription(post?.content || '');

  const ogImageUrl = post?.cover_link ? post.cover_link : '/site.png';

  const metadata: Metadata = {
    title: post?.title,
    description: shortDesc,
    openGraph: {
      title: post?.title,
      description: shortDesc,
      url: canonical,
      type: 'article',
      images: ogImageUrl
        ? [
            {
              url: ogImageUrl,
              width: 1200,
              height: 630,
              alt: post?.title,
            },
          ]
        : undefined,
    },
    other: {
      'article:author': post?.created_by || 'Ege Uysal',
      ...(post?.created_at && {
        'article:published_time': new Date(post.created_at).toISOString(),
      }),
      ...(post?.tags?.length && { 'article:tag': post.tags.join(', ') }),
    },
    twitter: {
      card: ogImageUrl ? 'summary_large_image' : 'summary',
      title: post?.title,
      description: shortDesc,
      images: ogImageUrl ? [ogImageUrl] : undefined,
    },
    alternates: { canonical },
  };

  return metadata;
}

// Default export for the layout as a React component
export default function SlugLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
