import type { Blog } from '@/types/general';
import { BlogHome } from '@/components/blocks/blog-home';

const PAGE_SIZE = 9;

async function getHomeData() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  try {
    const res = await fetch(`${apiUrl}?page=1&limit=${PAGE_SIZE + 1}`, {
      next: { revalidate: 60 },
      cache: 'force-cache',
    });
    if (!res.ok) throw new Error('Failed to fetch blog posts');

    const data = await res.json();
    const allBlogs: Blog[] = Array.isArray(data) ? data : data.data || [];

    let latestBlog: Blog | null = null;
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

    const firstPageBlogs = allBlogs.slice(1);

    let totalPages = 1;
    if (data && typeof data.total === 'number') {
      const adjustedTotal = Math.max(0, data.total - 1);
      totalPages = Math.max(1, Math.ceil(adjustedTotal / PAGE_SIZE));
    } else if (firstPageBlogs.length === PAGE_SIZE) {
      totalPages = 2;
    }

    return {
      initialLatestBlog: latestBlog,
      initialBlogs: firstPageBlogs,
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

const Home = async () => {
  const { initialLatestBlog, initialBlogs, initialTotalPages } = await getHomeData();

  return (
    <BlogHome
      initialLatestBlog={initialLatestBlog}
      initialBlogs={initialBlogs}
      initialTotalPages={initialTotalPages}
    />
  );
};

export default Home;
