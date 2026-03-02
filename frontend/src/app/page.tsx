import type { Blog } from '@/types/general';
import { BlogHome } from '@/components/blocks/blog-home';
import { listBlogsPage } from '@/lib/blogs';

const PAGE_SIZE = 9;

async function getHomeData(page: number = 1) {
  try {
    const { data: allBlogs, total } = await listBlogsPage(page, PAGE_SIZE);

    let latestBlog: Blog | null = null;
    let pageBlogs: Blog[] = allBlogs;

    if (page === 1) {
      if (allBlogs.length > 0 && allBlogs[0]) {
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

    const adjustedTotal = Math.max(0, total - 1);
    const totalPages = Math.max(1, Math.ceil(adjustedTotal / PAGE_SIZE));

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
  const pageNumber = pageParam ? Number.parseInt(pageParam, 10) : 1;
  const validPage = !Number.isNaN(pageNumber) && pageNumber >= 1 ? pageNumber : 1;

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
