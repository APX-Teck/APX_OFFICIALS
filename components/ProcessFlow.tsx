import Reveal from "@/components/Reveal";

const steps = [
  { title: "Requirement", desc: "We understand your business, goals, and exact requirements." },
  { title: "Design & Develop", desc: "We design a premium UI and develop a fast, scalable solution." },
  { title: "Test & Launch", desc: "We test thoroughly and launch smoothly with best practices." },
  { title: "Support", desc: "We provide ongoing support, upgrades and improvements." },
];

export default function ProcessFlow() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((s, idx) => (
        <Reveal key={s.title}>
          <div className="process-card">
            <div className="process-step">{idx + 1}</div>
            <p className="font-semibold mt-4">{s.title}</p>
            <p className="text-white/70 text-sm mt-2">{s.desc}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
