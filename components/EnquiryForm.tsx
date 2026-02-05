"use client";

import { useState } from "react";

const services = [
  "IT Services",
  "Website Development",
  "Mobile App Development",
  "UI/UX Design",
  "Digital Marketing",
  "SEO & Branding",
];

export default function EnquiryForm({ onSuccess }: { onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setDone(null);
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed");

      setDone("Thank you! We received your enquiry. We will contact you soon.");
      (e.target as HTMLFormElement).reset();
      onSuccess?.();
    } catch {
      setDone("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Full Name</label>
          <input className="input" name="fullName" required />
        </div>
        <div>
          <label className="label">Email</label>
          <input className="input" name="email" type="email" required />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Phone Number</label>
          <input className="input" name="phone" required />
        </div>
        <div>
          <label className="label">Business Type</label>
          <input className="input" name="businessType" required />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label">Business / Shop Name</label>
          <input className="input" name="businessName" required />
        </div>
        <div>
          <label className="label">Service Required</label>
          <select className="input" name="serviceRequired" required>
            <option value="">Select Service</option>
            {services.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="label">Message</label>
        <textarea className="input min-h-[120px]" name="message" required />
      </div>

      <button disabled={loading} className="btn-primary w-full" type="submit">
        {loading ? "Submitting..." : "Submit Enquiry"}
      </button>

      {done && <p className="text-sm text-white/70 text-center mt-1">{done}</p>}
    </form>
  );
}
