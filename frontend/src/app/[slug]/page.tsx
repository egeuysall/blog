'use client';

import { notFound } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import type { Blog } from '@/types/general';
import ReactMarkdown from 'react-markdown';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const DynamicGroups = ({ params }: { params: Promise<{ slug: string }> }) => {
  const [data, setData] = useState<Blog>();
  const [loading, setLoading] = useState(true);
  const { slug } = use(params);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        console.log('[DynamicGroups] Fetching:', `${apiUrl}/${encodeURIComponent(slug)}`);

        const res = await fetch(`${apiUrl}/${encodeURIComponent(slug)}`, {
          cache: 'no-store',
        });

        console.log('[DynamicGroups] Response status:', res.status, res.statusText);

        if (!res.ok) {
          return notFound();
        }

        const json = await res.json();
        console.log('[DynamicGroups] Received JSON:', json);
        setData(json.data);
      } catch (error) {
        console.error('Error fetching blog post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <main className="w-full flex flex-col gap-lg">
        <div>Loading...</div>
      </main>
    );
  }

  if (!data) {
    return notFound();
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
        <section className="flex flex-col gap-md ">
          <ReactMarkdown>{data.content}</ReactMarkdown>
        </section>
      </main>
    </div>
  );
};

export default DynamicGroups;
