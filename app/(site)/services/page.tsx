import Section from "@/components/Section";
import ServiceCard from "@/components/ServiceCard";
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
            <ServiceCard key={s.slug} service={s} />
          ))}
        </div>
      </Section>
    </div>
  );
}
