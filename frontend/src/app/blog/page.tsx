import Link from "next/link";
import { api } from "@/lib/api";
import { BlogPost } from "@/types";

export const metadata = { title: "Fitness & Nutrition Blog" };

async function getPosts(): Promise<BlogPost[]> {
  try {
    return await api.get<BlogPost[]>("/api/blog");
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="container-x py-16 lg:py-24">
      <div className="max-w-2xl mb-12">
        <h1 className="font-display text-5xl lg:text-6xl text-ivory">Fitness & Nutrition</h1>
        <p className="mt-4 text-lg text-muted">Practical guidance from our coaching team.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group rounded-soft border border-white/10 bg-surface overflow-hidden hover:border-volt/50 transition-colors"
          >
            <div className="h-44 bg-cover bg-center bg-surface-2" style={{ backgroundImage: `url(${post.coverImageUrl})` }} />
            <div className="p-6">
              <span className="text-xs font-semibold text-violet">{post.category}</span>
              <h3 className="font-display text-xl text-ivory mt-2 mb-2">{post.title}</h3>
              <p className="text-sm text-muted leading-relaxed line-clamp-3">{post.excerpt}</p>
              <p className="text-xs text-muted mt-4">By {post.authorName}</p>
            </div>
          </Link>
        ))}
      </div>

      {posts.length === 0 && <p className="text-muted">No articles published yet.</p>}
    </div>
  );
}
