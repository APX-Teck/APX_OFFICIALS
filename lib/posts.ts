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
      "In 2026, customers search online before they trust any business. A strong online presence is no longer optional — it is essential.",
      "A premium website works like your 24/7 digital office. It builds credibility, shows your services, and helps customers contact you instantly.",
      "With proper SEO, your business can appear on Google when customers search for your services. This brings free organic leads.",
      "A well-designed website improves conversions by building trust and guiding users with clear call-to-actions.",
      "If you want your business to grow consistently, investing in a modern website is the smartest decision.",
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
      "SEO (Search Engine Optimization) helps your business appear on Google when people search for services like yours.",
      "Start by creating and optimizing your Google Business Profile. Add correct address, phone, photos and services.",
      "Use local keywords on your website such as: 'Web Development in Pune' or 'Digital Marketing in Mumbai'.",
      "Collect genuine customer reviews — they improve ranking and trust.",
      "SEO is not a one-time job. Regular content updates and technical improvements are required for consistent results.",
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
      "UI/UX design is not only about making your website look beautiful. It is about guiding users smoothly.",
      "Good UI improves readability, spacing, typography and overall trust in your brand.",
      "A clean UX makes it easier for users to find what they need and contact you quickly.",
      "Conversion-focused design uses proper CTA placement, minimal distractions, and clear messaging.",
      "A premium UI/UX can increase leads, sales and customer confidence significantly.",
    ],
  },
];
