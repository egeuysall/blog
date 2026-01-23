'use client';

import { Badge } from '@/components/ui/badge';
import React, { useEffect, useState, useTransition, useCallback } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';
import { stripMarkdown } from '@/lib/utils';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

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
  initialPage: number;
}

export const BlogHome: React.FC<BlogHomeProps> = ({
  initialLatestBlog,
  initialBlogs,
  initialTotalPages,
  initialPage,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs);
  const [page, setPage] = useState<number>(initialPage);
  const [totalPages, setTotalPages] = useState<number>(initialTotalPages);
  const [loading, setLoading] = useState<boolean>(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  // Helper to create lightweight blog (with only first 25 words of content)
  const createLightweightBlog = (blog: Blog): Blog => {
    let contentPreview = '';
    if (blog.content) {
      const cleaned = stripMarkdown(blog.content);
      const words = cleaned.split(/\s+/);
      contentPreview = words.slice(0, 25).join(' ') + (words.length > 25 ? '...' : '');
    }

    return {
      id: blog.id,
      slug: blog.slug,
      title: blog.title,
      cover_link: blog.cover_link,
      created_at: blog.created_at,
      created_by: blog.created_by,
      tags: blog.tags,
      content: contentPreview, // Only first 25 words for preview
    };
  };

  // Persist and retrieve latest blog from localStorage
  const [latestBlog, setLatestBlog] = useState<Blog | null>(() => {
    if (initialLatestBlog) {
      return initialLatestBlog;
    }
    // Try to get from localStorage if not provided (page > 1)
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('latestBlog');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return null;
        }
      }
    }
    return null;
  });

  // Save latest blog to localStorage when we have it (detect new blogs by ID)
  useEffect(() => {
    if (initialLatestBlog) {
      // Always use full initialLatestBlog for display on page 1
      setLatestBlog(initialLatestBlog);

      // Check if this is a new blog (different ID from stored)
      const stored = localStorage.getItem('latestBlog');
      let shouldUpdate = true;

      if (stored) {
        try {
          const storedBlog = JSON.parse(stored);
          // Only update if it's a different blog
          shouldUpdate = storedBlog.id !== initialLatestBlog.id;
        } catch {
          shouldUpdate = true;
        }
      }

      if (shouldUpdate) {
        // Save lightweight version to localStorage
        const lightweightBlog = createLightweightBlog(initialLatestBlog);
        localStorage.setItem('latestBlog', JSON.stringify(lightweightBlog));
      }
    }
  }, [initialLatestBlog]);

  // URL update function
  const updatePageInUrl = useCallback((newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());

    if (newPage === 1) {
      params.delete('page'); // Clean URLs for page 1
    } else {
      params.set('page', String(newPage));
    }

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

    startTransition(() => {
      router.push(newUrl, { scroll: false });
    });
  }, [pathname, router, searchParams]);

  // Page change handler
  const handlePageChange = useCallback((newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage); // Optimistic update
    updatePageInUrl(newPage);
  }, [totalPages, updatePageInUrl]);

  // URL sync effect (for browser back/forward)
  useEffect(() => {
    const urlPage = searchParams.get('page');
    const pageFromUrl = urlPage ? parseInt(urlPage, 10) : 1;
    const validPageFromUrl = !isNaN(pageFromUrl) && pageFromUrl >= 1
      ? pageFromUrl
      : 1;

    if (validPageFromUrl !== page) {
      setPage(validPageFromUrl);
    }
  }, [searchParams]);

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
        const res = await fetch(`${apiUrl}?page=${page}&limit=${PAGE_SIZE}`, {
          cache: 'force-cache',
        });
        if (!res.ok) throw new Error('Failed to fetch blog posts');

        const data = await res.json();
        const blogsData: Blog[] = Array.isArray(data) ? data : data.data || [];

        setBlogs(blogsData);

        if (blogsData.length === PAGE_SIZE && page >= totalPages) {
          setTotalPages(page + 1);
        }
      } catch (error) {
        console.error(error);
        toast('Error fetching blogs');
      } finally {
        setLoading(false);
      }
    };

    getBlogs();
  }, [apiUrl, page, initialBlogs, totalPages]);

  // Loading state combines client fetching and URL navigation
  const isLoading = loading || isPending;

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
          <PaginationLink isActive={page === 1} onClick={() => handlePageChange(1)}>
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
          <PaginationLink isActive={page === i} onClick={() => handlePageChange(i)}>
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
          <PaginationLink isActive={page === totalPages} onClick={() => handlePageChange(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <main className="gap-lg flex w-full flex-col">
      <h2>By Ege</h2>

      {/* Hero - Uses pre-rendered latest blog only */}
      <section>
        {latestBlog ? (
          <Link
            href={`/${latestBlog.slug}`}
            className="gap-2xl flex w-full flex-col text-neutral-900 no-underline md:flex-row md:items-center dark:text-neutral-100"
          >
            <div className="relative aspect-video h-80 w-full overflow-hidden rounded-md lg:max-w-160">
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
                Article &middot; {latestBlog.created_at}
              </p>
              <h4>{latestBlog.title}</h4>
              <p className="mb-md text-small text-neutral-700 dark:text-neutral-300">
                By {latestBlog.created_by}
              </p>
              <div className="mb-md hidden md:block">
                {latestBlog.tags.map(tag => (
                  <Badge key={tag} className="mr-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
              <p className="hidden md:block">
                {latestBlog.content
                  ? (() => {
                      const cleaned = stripMarkdown(latestBlog.content);
                      const words = cleaned.split(/\s+/);
                      return words.slice(0, 25).join(' ') + (words.length > 25 ? '...' : '');
                    })()
                  : ''}
              </p>
            </div>
          </Link>
        ) : (
          <div className="flex w-full items-center justify-center py-16">
            <span>No latest blog found.</span>
          </div>
        )}
      </section>

      {/* Paginated blogs */}
      <section className="gap-lg mt-8 flex w-full flex-col">
        <h3 className="text-h4">Editor&apos;s Picks</h3>
        {isLoading ? (
          <div className="py-8 text-center">Loading...</div>
        ) : blogs.length === 0 ? (
          <div className="py-8 text-center">No blog posts found.</div>
        ) : (
          <div className="gap-lg grid md:grid-cols-2 lg:grid-cols-3">
            {blogs.map(blog => (
              <Link
                href={blog.slug}
                key={blog.id}
                className="text-neutral-900 no-underline dark:text-neutral-100"
              >
                <section>
                  <div className="gap-md flex flex-col">
                    <div
                      className="relative aspect-video w-full overflow-hidden rounded-md"
                      style={{ maxWidth: '100%' }}
                    >
                      <Image
                        src={blog.cover_link}
                        alt="Cover image"
                        fill
                        style={{ objectFit: 'cover' }}
                        quality={75}
                        className="!h-full !w-full"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
                      />
                    </div>
                    <span className="text-small text-neutral-700 dark:text-neutral-300">
                      Article &middot;{' '}
                      {new Date(blog.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <p className="font-semibold">{blog.title}</p>
                  <p className="text-small mb-sm text-neutral-700 dark:text-neutral-300">
                    By {blog.created_by}
                  </p>
                  <div>
                    {blog.tags.map(tag => (
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
          <div className="gap-md mt-4 flex items-center justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={page > 1 && !isLoading ? () => handlePageChange(page - 1) : undefined}
                    aria-disabled={page === 1 || isLoading}
                    tabIndex={page === 1 || isLoading ? -1 : 0}
                    style={{ pointerEvents: page === 1 || isLoading ? 'none' : undefined }}
                  />
                </PaginationItem>
                {renderPaginationItems()}
                <PaginationItem>
                  <PaginationNext
                    onClick={page < totalPages && !isLoading ? () => handlePageChange(page + 1) : undefined}
                    aria-disabled={page === totalPages || isLoading}
                    tabIndex={page === totalPages || isLoading ? -1 : 0}
                    style={{ pointerEvents: page === totalPages || isLoading ? 'none' : undefined }}
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
