import { notFound } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { BlogPost } from "@/types";

async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    return await api.get<BlogPost>(`/api/blog/${slug}`);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <article className="container-x py-16 lg:py-24 max-w-2xl">
      <span className="text-xs font-semibold text-violet">{post.category}</span>
      <h1 className="font-display text-4xl lg:text-5xl text-ivory mt-2">{post.title}</h1>
      <p className="text-sm text-muted mt-4">
        By {post.authorName} · {new Date(post.publishedAt).toLocaleDateString()}
      </p>
      <div
        className="h-72 rounded-soft bg-cover bg-center bg-surface border border-white/10 mt-8"
        style={{ backgroundImage: `url(${post.coverImageUrl})` }}
      />
      <div className="mt-8 text-lg text-ivory/85 leading-relaxed whitespace-pre-line">
        {post.content}
      </div>
    </article>
  );
}
