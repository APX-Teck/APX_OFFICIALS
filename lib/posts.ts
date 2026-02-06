export type Post = {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  cover: string;
  content: string[];
};

export const posts: Post[] = [
  {
    slug: "why-every-business-needs-a-website",
    title: "Why Every Business Needs a Website in 2026",
    date: "2026-02-05",
    category: "Business Growth",
    excerpt:
      "A professional website builds trust, improves visibility, and helps you generate consistent leads.",
    cover: "/posts/post-1.jpg",
    content: [
      "In 2026, customers search online before they trust any business.",
      "A website works like your 24/7 digital office.",
      "With proper SEO, your business can appear on Google and attract local customers.",
      "A premium website improves conversions and builds strong credibility.",
    ],
  },
  {
    slug: "seo-basics-for-local-business",
    title: "SEO Basics for Local Businesses",
    date: "2026-02-02",
    category: "SEO",
    excerpt:
      "Learn the key SEO points every local business should implement to rank better on Google.",
    cover: "/posts/post-2.jpg",
    content: [
      "SEO helps your business appear when customers search on Google.",
      "Start with correct Google Business Profile setup.",
      "Use location-based keywords on your website.",
      "Publish regular content and collect reviews.",
    ],
  },
  {
    slug: "ui-ux-design-that-converts",
    title: "UI/UX Design That Converts Visitors into Customers",
    date: "2026-01-29",
    category: "UI/UX",
    excerpt:
      "A premium UI is not just about beauty — it directly impacts your conversions and trust.",
    cover: "/posts/post-3.jpg",
    content: [
      "UI/UX is about user journey, clarity and trust.",
      "A clean layout improves readability and user engagement.",
      "Good spacing, typography, and CTA placement increases conversions.",
      "Modern UI helps your brand look premium.",
    ],
  },
  {
  slug: "new-post-title",
  title: "New Post Title",
  date: "2026-02-05",
  category: "IT",
  excerpt: "Short summary...",
  cover: "/posts/post-4.jpg",
  content: [
    "Paragraph 1...",
    "Paragraph 2...",
  ],
},
];
