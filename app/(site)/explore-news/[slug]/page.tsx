import Section from "@/components/Section";
import { posts } from "@/lib/posts";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = posts.find((p) => p.slug === slug);

  if (!post) return notFound();

  return (
    <div className="page">
      <Section
        eyebrow={post.category}
        title={post.title}
        description={post.excerpt}
      >
        <div className="card overflow-hidden p-0">
          {/* Cover */}
          <div className="relative h-64 w-full">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${post.cover})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="absolute inset-0 bg-black/55" />
          </div>

          {/* Content */}
          <div className="p-7">
            <p className="text-white/60 text-sm">{post.date}</p>

            <div className="mt-6 space-y-4 text-white/80 leading-relaxed text-[15px]">
              {post.content.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <div className="mt-8">
              <Link href="/explore-news" className="btn-ghost">
                ← Back to Explore & News
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
