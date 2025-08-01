import type { Metadata } from 'next';

type Props = {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

// Utility to get the first ~165 chars of a string, ending at a word boundary if possible
function getShortDescription(text: string, maxLength = 165): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  // Try to cut at the last space before maxLength
  const trimmed = text.slice(0, maxLength);
  const lastSpace = trimmed.lastIndexOf(' ');
  return trimmed.slice(0, lastSpace > 0 ? lastSpace : maxLength) + '...';
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  // fetch post information
  const res = await fetch(`${apiUrl}/${slug}`);
  if (!res.ok) {
    return {
      title: 'Post Not Found',
      description: 'The requested post could not be found.',
    };
  }
  let post = await res.json();
  post = post.data;

  const ogImage = post.cover_link
    ? [
        {
          url: post.cover_link,
          width: 1200,
          height: 630,
          alt: post.title || 'Blog post cover image',
        },
      ]
    : undefined;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.blog.egeuysal.com';
  const canonical = `${siteUrl.replace(/\/$/, '')}/${slug}`;

  const publishedTime = post.created_at ? new Date(post.created_at).toISOString() : undefined;
  const author = post.created_by || 'Ege Uysal';

  return {
    title: post.title || 'Untitled Post',
    description: getShortDescription(post.content || ''),
    openGraph: {
      title: post.title || 'Untitled Post',
      description: getShortDescription(post.content || ''),
      url: canonical,
      type: 'article',
      images: ogImage,
      ...(publishedTime && { publishedTime }),
      ...(author && { authors: [author] }),
    },
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      title: post.title || 'Untitled Post',
      description: getShortDescription(post.content || ''),
      images: ogImage ? [post.cover_link] : undefined,
    },
    alternates: {
      canonical,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
