import HeroCarousel from "@/components/HeroCarousel";
import Section from "@/components/Section";
import ServiceCards from "@/components/ServiceCards";
import ClientLogos from "@/components/ClientLogos";
import Testimonials from "@/components/Testimonials";
import ProcessFlow from "@/components/ProcessFlow";
import FAQ from "@/components/FAQ";

export default function HomePage() {
  return (
    <>
      <HeroCarousel />

      <Section
        id="services"
        eyebrow="Services"
        title="Premium digital services for modern businesses"
        description="From web development to digital marketing — APX helps you launch, grow, and scale with confidence."
      >
        <ServiceCards />
      </Section>

      <Section
        eyebrow="Trusted"
        title="Brands that trust APX"
        description=""
      >
        <ClientLogos />
      </Section>

      <Section
        eyebrow="Testimonials"
        title="What clients say about APX"
        description="4 sample testimonials. Replace with real client reviews anytime."
      >
        <Testimonials />
      </Section>

      <Section
        eyebrow="Process"
        title="Our work process"
        description="A clean, reliable workflow designed for speed, quality and long-term support."
      >
        <ProcessFlow />
      </Section>

      <Section
        eyebrow="FAQ"
        title="Frequently asked questions"
        description="Quick answers to common questions about our services."
      >
        <FAQ />
      </Section>
    </>
  );
}
