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
		<div className="w-full flex justify-center">
			<main className="w-full flex flex-col gap-2xl max-w-full md:max-w-3/4 lg:max-w-2/3 xl:max-w-1/2">
				<section>
					<Link href="/" className="flex items-center gap-2xs">
						<ArrowLeft size={18} />
						Back to Home
					</Link>
				</section>
				<section className="flex flex-col gap-lg">
					<div className="w-full h-64 relative rounded-md overflow-hidden">
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
						<h2>{data.title}</h2>
						<p className="text-small text-neutral-700 dark:text-neutral-300 mb-md">
							{data.created_at
								? `${new Date(data.created_at).toLocaleDateString('en-US', {
										year: 'numeric',
										month: 'short',
										day: 'numeric',
									})} • By ${data.created_by}`
								: ''}
						</p>
						<Separator />
					</div>
				</section>
				<section className="flex flex-col gap-md">
					<Markdown>{data.content}</Markdown>
				</section>
			</main>
		</div>
	);
}
