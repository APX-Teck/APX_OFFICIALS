import Reveal from "@/components/Reveal";
import {
  Code2,
  LayoutTemplate,
  Smartphone,
  Palette,
  Megaphone,
  Search,
} from "lucide-react";

const cards = [
  {
    title: "IT Services",
    desc: "Reliable development, maintenance, upgrades and technical support.",
    Icon: Code2,
  },
  {
    title: "Web Development",
    desc: "Premium websites, landing pages and e-commerce solutions.",
    Icon: LayoutTemplate,
  },
  {
    title: "Application Development",
    desc: "Scalable web apps and mobile apps with modern UI and performance.",
    Icon: Smartphone,
  },
  {
    title: "UI/UX Design",
    desc: "Wireframes, prototypes and modern conversion-focused UI designs.",
    Icon: Palette,
  },
  {
    title: "Digital Marketing",
    desc: "SEO, social media marketing, ads and lead generation campaigns.",
    Icon: Megaphone,
  },
  {
    title: "SEO & Branding",
    desc: "Rank higher, look premium and build customer trust.",
    Icon: Search,
  },
];

export default function ServiceCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((c) => (
        <Reveal key={c.title}>
          <div className="service-card">
            <div className="service-icon">
              <c.Icon size={22} />
            </div>
            <p className="service-title">{c.title}</p>
            <p className="service-desc">{c.desc}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
