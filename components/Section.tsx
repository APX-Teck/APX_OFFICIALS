import Reveal from "@/components/Reveal";

export default function Section({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="section relative z-[1]">
      <div className="container">
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="section-title">{title}</h2>
          {description && <p className="section-desc">{description}</p>}
        </Reveal>

        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}
