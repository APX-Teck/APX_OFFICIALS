import Reveal from "@/components/Reveal";

const data = [
  {
    name: "Amit Sharma",
    role: "Business Owner",
    text: "APX built our website with a premium look and fast speed. Great support and communication.",
  },
  {
    name: "Sneha Patil",
    role: "Startup Founder",
    text: "We got a clean UI/UX and smooth development process. Highly recommended for startups.",
  },
  {
    name: "Rahul Mehta",
    role: "Marketing Manager",
    text: "Their digital marketing and SEO work improved our leads within a few weeks. Strong results.",
  },
  {
    name: "Neha Desai",
    role: "E-commerce Owner",
    text: "Professional team, premium design, and excellent after-launch support.",
  },
];

export default function Testimonials() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {data.map((t) => (
        <Reveal key={t.name}>
          <div className="card h-full flex flex-col">
            {/* Text */}
            <p className="text-black/80 dark:text-white/80 leading-relaxed line-clamp-5">
              “{t.text}”
            </p>

            {/* Spacer pushes name to bottom */}
            <div className="flex-1" />

            {/* Name */}
            <div className="mt-6">
              <p className="font-semibold">{t.name}</p>
              <p className="text-sm text-black/60 dark:text-white/60">
                {t.role}
              </p>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
