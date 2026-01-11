import { notFound } from 'next/navigation';
import type { Blog } from '@/types/general';
import { Markdown } from '@/components/blocks/markdown';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Regenerate page every 1 hour
export const revalidate = 3600;

export async function generateStaticParams() {
  const res = await fetch(apiUrl, { cache: 'force-cache' });
  const json = await res.json();
  const posts: Blog[] = json.data || [];

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const res = await fetch(`${apiUrl}/${encodeURIComponent(slug)}`, {
    cache: 'force-cache',
  });

  if (!res.ok) notFound();

  const json = await res.json();
  const data: Blog | undefined = json.data;

  if (!data) notFound();

  return (
    <div className="flex w-full justify-center">
      <main className="gap-lg flex w-full max-w-none flex-col md:max-w-3/4 lg:max-w-2/3 xl:max-w-1/3">
        <section>
          <Link href="/" className="gap-2xs flex items-center text-small">
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </section>
        <section className="gap-lg flex flex-col">
          <div className="relative h-64 w-full overflow-hidden rounded-md">
            <Image
              src={data.cover_link}
              alt={data.title}
              fill
              style={{ objectFit: 'cover' }}
              quality={75}
              priority={true}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
            />
          </div>
          <div>
            <h4>{data.title}</h4>
            <p className="text-small! mb-md text-neutral-700 dark:text-neutral-300">
              {data.created_at
                ? `${new Date(data.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })} · By ${data.created_by}`
                : ''}
            </p>
            <Separator />
          </div>
        </section>
        <section className="gap-md flex flex-col">
          <Markdown className="prose prose-neutral text-small dark:prose-invert max-w-none!">
            {data.content}
          </Markdown>
        </section>
      </main>
    </div>
  );
}
