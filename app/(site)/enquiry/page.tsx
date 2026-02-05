import Section from "@/components/Section";
import EnquiryForm from "@/components/EnquiryForm";

export default function EnquiryPage() {
  return (
    <div className="page">
      <Section
        eyebrow="Get Enquiry"
        title="Tell us about your project"
        description="Fill the form and our team will contact you within 24 hours."
      >
        <div className="card max-w-3xl">
          <EnquiryForm />
        </div>
      </Section>
    </div>
  );
}
