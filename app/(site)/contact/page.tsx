import Section from "@/components/Section";
import Reveal from "@/components/Reveal";

export default function ContactPage() {
  return (
    <div className="page">
      <Section
        eyebrow="Contact"
        title="Let’s build something premium"
        description="Send your requirements and our team will contact you quickly."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="card">
              <h3 className="card-title">Office Address</h3>
              <p className="card-text">APX Teck, India (Dummy Address)</p>

              <div className="mt-5 space-y-2 text-white/75">
                <p>
                  <span className="text-white font-semibold">Email:</span>{" "}
                  apx@example.com
                </p>
                <p>
                  <span className="text-white font-semibold">Phone:</span> +91
                  90000 00000
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <a className="pill" href="#">
                  Facebook
                </a>
                <a className="pill" href="#">
                  Instagram
                </a>
                <a className="pill" href="#">
                  LinkedIn
                </a>
                <a className="pill" href="#">
                  X (Twitter)
                </a>
                <a className="pill" href="#">
                  Pinterest
                </a>
                <a className="pill" href="#">
                  WhatsApp
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="card overflow-hidden">
              <h3 className="card-title">Google Map</h3>
              <div className="mt-4 aspect-video w-full rounded-2xl overflow-hidden border border-white/10">
                <iframe
                  src="https://www.google.com/maps?q=Pune&output=embed"
                  className="w-full h-full"
                  loading="lazy"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    </div>
  );
}
