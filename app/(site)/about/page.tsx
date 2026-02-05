import Section from "@/components/Section";
import Reveal from "@/components/Reveal";
import { siteData } from "@/lib/siteData";

export default function AboutPage() {
  return (
    <div className="page">
      <Section
        eyebrow="About APX"
        title="A modern IT company built for business growth"
        description="We help startups, small businesses and enterprises build premium digital products with a clean process and reliable support."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="card">
              <h3 className="card-title">Company Introduction</h3>
              <p className="card-text">{siteData.about.intro}</p>
            </div>
          </Reveal>

          <Reveal>
            <div className="card">
              <h3 className="card-title">Why Choose Us</h3>
              <ul className="list-disc pl-5 text-white/80 space-y-2">
                {siteData.about.whyChoose.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal>
            <div className="card">
              <h3 className="card-title">Mission</h3>
              <p className="card-text">{siteData.about.mission}</p>
            </div>
          </Reveal>

          <Reveal>
            <div className="card">
              <h3 className="card-title">Vision</h3>
              <p className="card-text">{siteData.about.vision}</p>
            </div>
          </Reveal>

          <Reveal>
            <div className="card md:col-span-2">
              <h3 className="card-title">Core Values</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {siteData.about.values.map((v) => (
                  <div key={v.title} className="mini-card">
                    <p className="font-semibold">{v.title}</p>
                    <p className="text-white/70 text-sm mt-1">{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="card md:col-span-2">
              <h3 className="card-title">Founder Message</h3>
              <p className="card-text">{siteData.about.founderMessage}</p>
            </div>
          </Reveal>
        </div>
      </Section>
    </div>
  );
}
