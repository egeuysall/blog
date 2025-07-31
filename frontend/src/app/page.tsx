'use client';

import { Badge } from '@/components/ui/badge';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

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

type Blog = {
  id: string;
  title: string;
  content: string;
  slug: string;
  tags: string[];
  created_at: string;
  created_by: string;
  cover_link: string;
};

const PAGE_SIZE = 9;

const Home: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [latestBlog, setLatestBlog] = useState<Blog | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  // Fetch paginated blogs
  useEffect(() => {
    const getBlogs = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}?page=${page}&limit=${PAGE_SIZE}`);
        if (!res.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        let data = await res.json();
        let blogsData: Blog[] = Array.isArray(data) ? data : data.data || [];
        setBlogs(blogsData);

        // If API returns total count, calculate total pages
        if (data && typeof data.total === 'number') {
          setTotalPages(Math.max(1, Math.ceil(data.total / PAGE_SIZE)));
        } else if (blogsData.length < PAGE_SIZE && page === 1) {
          setTotalPages(1);
        } else if (blogsData.length < PAGE_SIZE) {
          setTotalPages(page);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
        toast('Error getting blogs');
      } finally {
        setLoading(false);
      }
    };

    getBlogs();
  }, [apiUrl, page]);

  // Fetch latest blog for the hero section
  useEffect(() => {
    const getLatestBlog = async () => {
      try {
        const res = await fetch(`${apiUrl}?page=1&limit=1`);
        if (!res.ok) {
          throw new Error('Failed to fetch latest blog post');
        }
        let data = await res.json();
        const latest = Array.isArray(data) ? data[0] : (data.data && data.data[0]) || null;

        if (latest) {
          setLatestBlog({
            ...latest,
            created_at: latest.created_at
              ? new Date(latest.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              : '',
          });
        } else {
          setLatestBlog(null);
        }
      } catch (error) {
        console.error('Error fetching latest blog:', error);
        toast('Error getting latest blog');
      }
    };

    getLatestBlog();
  }, [apiUrl]);

  // Helper to generate pagination items (with ellipsis if needed)
  const renderPaginationItems = () => {
    const items = [];
    const maxPageButtons = 5;
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    if (endPage - startPage < maxPageButtons - 1) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    if (startPage > 1) {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink isActive={page === 1} onClick={() => setPage(1)}>
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        items.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
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
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
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
      {/* Hero section with latest blog */}
      <section className="w-full flex flex-col md:flex-row gap-2xl md:items-center">
        {latestBlog ? (
          <>
            <div>
              <img
                src={latestBlog.cover_link}
                alt="Blog image"
                className="w-128 h-80 rounded-md aspect-video object-cover"
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
                {latestBlog.tags.map((tag) => {
                  return (
                    <Badge className="mr-sm" key={tag}>
                      {tag}
                    </Badge>
                  );
                })}
              </div>
              <p className="hidden md:block">
                {latestBlog.content
                  ? latestBlog.content.split(/\s+/).slice(0, 15).join(' ') +
                    (latestBlog.content.split(/\s+/).length > 15 ? '…' : '')
                  : ''}
              </p>
            </div>
          </>
        ) : (
          <div className="w-full flex justify-center items-center py-16">
            <span>No latest blog found.</span>
          </div>
        )}
      </section>

      {/* Paginated blog list */}
      <section className="w-full flex flex-col gap-lg mt-8">
        <h3 className="text-h4">Editor's Picks</h3>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-8">No blog posts found.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {blogs.map((blog) => (
              <Link href={blog.slug}>
                <section key={blog.id}>
                  <div className="flex flex-col gap-md">
                    <img
                      src={blog.cover_link}
                      className="w-full md:w-96 h-64 rounded-md aspect-video object-cover"
                    />
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
      </section>
    </main>
  );
};

export default Home;
