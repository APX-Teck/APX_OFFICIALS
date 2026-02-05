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
          <div className="card">
            <p className="text-white/80">“{t.text}”</p>
            <div className="mt-5">
              <p className="font-semibold">{t.name}</p>
              <p className="text-sm text-white/60">{t.role}</p>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
