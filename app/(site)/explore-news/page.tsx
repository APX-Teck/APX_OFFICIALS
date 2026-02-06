import Section from "@/components/Section";
import Reveal from "@/components/Reveal";
import Link from "next/link";
import { posts } from "@/lib/posts";

export default function ExploreNewsPage() {
  return (
    <div className="page">
      <Section
        eyebrow="Explore & News"
        title="Latest updates, insights & articles"
        description="Here we post helpful content related to IT, websites, UI/UX, SEO, branding and business growth."
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Reveal key={p.slug}>
              <Link
                href={`/explore-news/${p.slug}`}
                className="card overflow-hidden p-0 hover:scale-[1.01] transition"
              >
                {/* Cover */}
                <div className="relative h-44 w-full">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${p.cover})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div className="absolute inset-0 bg-black/55" />
                  <div className="absolute bottom-4 left-5 right-5">
                    <p className="pill inline-flex">{p.category}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-lg font-semibold leading-snug">
                    {p.title}
                  </p>

                  <p className="text-white/60 text-sm mt-2">{p.date}</p>

                  <p className="text-white/70 mt-3 leading-relaxed">
                    {p.excerpt}
                  </p>

                  <p className="text-white mt-4 font-semibold">Read More →</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>
    </div>
  );
}
