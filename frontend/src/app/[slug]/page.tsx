import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Markdown } from '@/components/blocks/markdown';
import { Separator } from '@/components/ui/separator';
import { getBlogBySlug, listAllBlogs } from '@/lib/blogs';

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const posts = await listAllBlogs();

    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Failed to generate static params:', error);
    return [];
  }
}

export default async function BlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getBlogBySlug(slug);

  if (!data) {
    notFound();
  }

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
          {data.cover_link ? (
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
          ) : null}
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
          <Markdown className="prose prose-neutral text-small dark:prose-invert max-w-none! prose-pre:p-0 prose-pre:m-0 prose-pre:bg-transparent prose-code:p-0 prose-code:bg-transparent prose-code:before:content-none prose-code:after:content-none [&_.contains-task-list]:list-none [&_.contains-task-list]:pl-0 [&_.task-list-item]:list-none [&_.task-list-item]:ml-0 [&_.task-list-item::marker]:content-none">
            {data.content}
          </Markdown>
        </section>
      </main>
    </div>
  );
}
