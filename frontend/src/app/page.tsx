import type { Blog } from '@/types/general';
import { BlogHome } from '@/components/blocks/blog-home';

const PAGE_SIZE = 9;

async function getHomeData(page: number = 1) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  try {
    // For page 1: fetch PAGE_SIZE + 1 (extra for hero)
    // For page > 1: fetch exactly PAGE_SIZE
    const limit = page === 1 ? PAGE_SIZE + 1 : PAGE_SIZE;

    const res = await fetch(`${apiUrl}?page=${page}&limit=${limit}`, {
      next: { revalidate: 60 },
      cache: 'force-cache',
    });
    if (!res.ok) throw new Error('Failed to fetch blog posts');

    const data = await res.json();
    const allBlogs: Blog[] = Array.isArray(data) ? data : data.data || [];

    // Only extract "latest blog" when page === 1
    let latestBlog: Blog | null = null;
    let pageBlogs: Blog[] = allBlogs;

    if (page === 1) {
      if (allBlogs && allBlogs.length > 0 && allBlogs[0]) {
        latestBlog = {
          ...allBlogs[0],
          created_at: allBlogs[0].created_at
            ? new Date(allBlogs[0].created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })
            : '',
        };
      }
      pageBlogs = allBlogs.slice(1);
    }

    let totalPages = 1;
    if (data && typeof data.total === 'number') {
      if (page === 1) {
        // For page 1, subtract 1 for the hero blog
        const adjustedTotal = Math.max(0, data.total - 1);
        totalPages = Math.max(1, Math.ceil(adjustedTotal / PAGE_SIZE));
      } else {
        // For other pages, use total directly
        totalPages = Math.max(1, Math.ceil(data.total / PAGE_SIZE));
      }
    } else {
      if (allBlogs.length >= PAGE_SIZE + 1) {
        totalPages = 3;
      }
    }

    return {
      initialLatestBlog: latestBlog,
      initialBlogs: pageBlogs,
      initialTotalPages: totalPages,
    };
  } catch (error) {
    console.error('Error fetching home data:', error);
    return {
      initialLatestBlog: null,
      initialBlogs: [],
      initialTotalPages: 1,
    };
  }
}

interface HomeProps {
  searchParams: Promise<{ page?: string }>;
}

const Home = async ({ searchParams }: HomeProps) => {
  const params = await searchParams;
  const pageParam = params.page;
  const pageNumber = pageParam ? parseInt(pageParam, 10) : 1;
  const validPage = !isNaN(pageNumber) && pageNumber >= 1 ? pageNumber : 1;

  const { initialLatestBlog, initialBlogs, initialTotalPages } = await getHomeData(validPage);

  return (
    <BlogHome
      initialLatestBlog={initialLatestBlog}
      initialBlogs={initialBlogs}
      initialTotalPages={initialTotalPages}
      initialPage={validPage}
    />
  );
};

export default Home;
