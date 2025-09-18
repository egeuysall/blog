// app/blog/[slug]/page.tsx (server component, no 'use client')
import { notFound } from 'next/navigation';
import type { Blog } from '@/types/general';
import ReactMarkdown from 'react-markdown';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default async function DynamicGroups({ params }: { params: { slug: string } }) {
  const res = await fetch(`${apiUrl}/${encodeURIComponent(params.slug)}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    notFound();
  }

  const json = await res.json();
  const data: Blog | undefined = json.data;

  if (!data) {
    notFound();
  }

  return (
    <div className="w-full flex justify-center">
      <main className="w-full flex flex-col gap-2xl max-w-full md:max-w-3/4 lg:max-w-1/2">
        <section className="flex flex-col gap-lg">
          <img
            src={data.cover_link}
            className="w-full h-64 object-cover rounded-md"
            alt="Cover image"
          />
          <div>
            <h2>{data.title}</h2>
            <p className="text-small text-neutral-700 dark:text-neutral-300">
              {data.created_at
                ? `${new Date(data.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })} • By ${data.created_by}`
                : ''}
            </p>
          </div>
        </section>
        <section className="flex flex-col gap-md">
          <ReactMarkdown>{data.content}</ReactMarkdown>
        </section>
      </main>
    </div>
  );
}
