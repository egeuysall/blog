'use client';

import { Badge } from '@/components/ui/badge';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';

import type { Blog } from '@/types/general';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import Link from 'next/link';

const PAGE_SIZE = 9;

interface BlogHomeProps {
  initialLatestBlog: Blog | null;
  initialBlogs: Blog[];
  initialTotalPages: number;
}

export const BlogHome: React.FC<BlogHomeProps> = ({
  initialLatestBlog,
  initialBlogs,
  initialTotalPages,
}) => {
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs);
  const [latestBlog] = useState<Blog | null>(initialLatestBlog); // Static, never re-fetch
  const [page, setPage] = useState<number>(1);
  const [totalPages] = useState<number>(initialTotalPages);
  const [loading, setLoading] = useState<boolean>(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  // Only fetch when page > 1 (client-side pagination)
  useEffect(() => {
    if (page === 1) {
      // Use pre-rendered data for page 1
      setBlogs(initialBlogs);
      return;
    }

    const getBlogs = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}?page=${page}&limit=${PAGE_SIZE + 1}`, {
          cache: 'force-cache',
        });
        if (!res.ok) throw new Error('Failed to fetch blog posts');

        const data = await res.json();
        let blogsData: Blog[] = Array.isArray(data) ? data : data.data || [];

        // For page > 1, slice out the latest blog to maintain consistency
        if (blogsData.length > 0) blogsData = blogsData.slice(1);

        setBlogs(blogsData);
      } catch (error) {
        console.error(error);
        toast('Error fetching blogs');
      } finally {
        setLoading(false);
      }
    };

    getBlogs();
  }, [apiUrl, page, initialBlogs]);

  // Pagination helper
  const renderPaginationItems = () => {
    const items = [];
    const maxPageButtons = 5;
    let startPage = Math.max(1, page - 2);
    const endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    if (endPage - startPage < maxPageButtons - 1)
      startPage = Math.max(1, endPage - maxPageButtons + 1);

    if (startPage > 1) {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink isActive={page === 1} onClick={() => setPage(1)}>
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2)
        items.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink isActive={page === i} onClick={() => setPage(i)}>
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1)
        items.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink isActive={page === totalPages} onClick={() => setPage(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <main className="w-full flex flex-col gap-lg">
      <h2>By Ege</h2>

      {/* Hero - Uses pre-rendered latest blog only */}
      <section>
        {latestBlog ? (
          <Link
            href={`/${latestBlog.slug}`}
            className="no-underline text-neutral-900 dark:text-neutral-100 w-full flex flex-col md:flex-row gap-2xl md:items-center"
          >
            <div className="h-80 relative rounded-md aspect-video overflow-hidden w-full lg:max-w-160">
              <Image
                src={latestBlog.cover_link}
                alt="Cover image"
                fill
                style={{ objectFit: 'cover' }}
                quality={75}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
              />
            </div>
            <div>
              <p className="text-small text-neutral-700 dark:text-neutral-300">
                Article &bull; {latestBlog.created_at}
              </p>
              <h4>{latestBlog.title}</h4>
              <p className="mb-md text-small text-neutral-700 dark:text-neutral-300">
                By {latestBlog.created_by}
              </p>
              <div className="mb-md hidden md:block">
                {latestBlog.tags.map((tag) => (
                  <Badge key={tag} className="mr-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
              <p className="hidden md:block">
                {latestBlog.content
                  ? latestBlog.content.split(/\s+/).slice(0, 25).join(' ') +
                    (latestBlog.content.split(/\s+/).length > 25 ? '…' : '')
                  : ''}
              </p>
            </div>
          </Link>
        ) : (
          <div className="w-full flex justify-center items-center py-16">
            <span>No latest blog found.</span>
          </div>
        )}
      </section>

      {/* Paginated blogs */}
      <section className="w-full flex flex-col gap-lg mt-8">
        <h3 className="text-h4">Editor&apos;s Picks</h3>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-8">No blog posts found.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {blogs.map((blog) => (
              <Link
                href={blog.slug}
                key={blog.id}
                className="no-underline text-neutral-900 dark:text-neutral-100"
              >
                <section>
                  <div className="flex flex-col gap-md">
                    <div
                      className="w-full relative rounded-md aspect-video overflow-hidden"
                      style={{ maxWidth: '100%' }}
                    >
                      <Image
                        src={blog.cover_link}
                        alt="Cover image"
                        fill
                        style={{ objectFit: 'cover' }}
                        quality={75}
                        className="!w-full !h-full"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
                      />
                    </div>
                    <span className="text-small text-neutral-700 dark:text-neutral-300">
                      Article &bull;{' '}
                      {new Date(blog.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <p className="font-semibold">{blog.title}</p>
                  <p className="text-small text-neutral-700 dark:text-neutral-300 mb-sm">
                    By {blog.created_by}
                  </p>
                  <div>
                    {blog.tags.map((tag) => (
                      <Badge key={tag} className="mr-sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </section>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-md mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={page > 1 && !loading ? () => setPage(page - 1) : undefined}
                    aria-disabled={page === 1 || loading}
                    tabIndex={page === 1 || loading ? -1 : 0}
                    style={{ pointerEvents: page === 1 || loading ? 'none' : undefined }}
                  />
                </PaginationItem>
                {renderPaginationItems()}
                <PaginationItem>
                  <PaginationNext
                    onClick={page < totalPages && !loading ? () => setPage(page + 1) : undefined}
                    aria-disabled={page === totalPages || loading}
                    tabIndex={page === totalPages || loading ? -1 : 0}
                    style={{ pointerEvents: page === totalPages || loading ? 'none' : undefined }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </section>
    </main>
  );
};
