import Section from "@/components/Section";
import Reveal from "@/components/Reveal";
import { siteData } from "@/lib/siteData";

export default function ServicesPage() {
  return (
    <div className="page">
      <Section
        eyebrow="Services"
        title="Everything you need to build & grow digitally"
        description="We provide end-to-end IT and marketing services — from design to development to scaling."
      >
        <div className="grid gap-6">
          {siteData.services.map((s) => (
            <Reveal key={s.slug}>
              <div className="card">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold">{s.title}</h3>
                    <p className="text-white/70 mt-2 max-w-2xl">
                      {s.overview}
                    </p>
                  </div>

                  <div className="pill">{s.tag}</div>
                </div>

                <div className="grid gap-5 mt-6 md:grid-cols-3">
                  <div>
                    <p className="text-sm font-semibold">Key Benefits</p>
                    <ul className="mt-3 space-y-2 text-white/75 list-disc pl-5">
                      {s.benefits.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-sm font-semibold">Process</p>
                    <ol className="mt-3 space-y-2 text-white/75 list-decimal pl-5">
                      {s.process.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ol>
                  </div>

                  <div>
                    <p className="text-sm font-semibold">Ideal For</p>
                    <ul className="mt-3 space-y-2 text-white/75 list-disc pl-5">
                      {s.idealFor.map((i) => (
                        <li key={i}>{i}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </div>
  );
}
