import Section from "@/components/Section";
import { posts } from "@/lib/posts";
import { notFound } from "next/navigation";

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = posts.find((p) => p.slug === params.slug);

  if (!post) return notFound();

  return (
    <div className="page">
      <Section
        eyebrow={post.category}
        title={post.title}
        description={post.excerpt}
      >
        {/* Cover */}
        <div className="card overflow-hidden p-0">
          <div className="relative h-60 w-full">
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

            <div className="mt-6 space-y-4 text-white/80 leading-relaxed">
              {post.content.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
