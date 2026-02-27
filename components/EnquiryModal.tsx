"use client";

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

export default function EnquiryModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    businessType: "",
    businessName: "",
    serviceRequired: "",
    message: "",
  });

  const services = useMemo(
    () => [
      "IT Services",
      "Website Development",
      "Mobile App Development",
      "UI/UX Design",
      "Digital Marketing",
      "SEO & Branding",
    ],
    [],
  );

  // Close on ESC
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onClose();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, loading]);

  // Reset alerts when modal closes
  useEffect(() => {
    if (!open) {
      setLoading(false);
      setSuccess(false);
      setError("");
    }
  }, [open]);

  function updateField(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  }

  function resetForm() {
    setForm({
      fullName: "",
      email: "",
      phone: "",
      businessType: "",
      businessName: "",
      serviceRequired: "",
      message: "",
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");

    // Basic phone validation (India 10 digit)
    const onlyDigits = form.phone.replace(/\D/g, "");
    if (onlyDigits.length < 10) {
      setLoading(false);
      setError("Please enter a valid 10 digit phone number.");
      return;
    }

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          phone: onlyDigits,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit enquiry");

      setSuccess(true);
      resetForm();

      // Auto close after 2 sec
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity",
          loading && "pointer-events-none opacity-80",
        )}
        onClick={() => {
          if (!loading) onClose();
        }}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl rounded-3xl border border-black/10 dark:border-white/10 bg-white/90 dark:bg-black/90 backdrop-blur-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-black/10 dark:border-white/10">
          <div>
            <p className="text-lg font-semibold">Get Enquiry</p>
            <p className="text-sm text-black/60 dark:text-white/60 mt-1">
              Fill the form and our team will contact you shortly.
            </p>
          </div>

          <button
            onClick={() => {
              if (!loading) onClose();
            }}
            className="p-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 modal-scroll">
          {success && (
            <div className="mb-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-emerald-200">
              ✅ Thank you! Your enquiry has been submitted successfully.
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-200">
              ❌ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-4">
            {/* Row 1 */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="label">
                  Full Name <span className="text-red-500/80">*</span>
                </label>
                <input
                  required
                  name="fullName"
                  value={form.fullName}
                  onChange={updateField}
                  placeholder="Enter your full name"
                  className="input"
                  autoComplete="name"
                />
              </div>

              <div>
                <label className="label">
                  Email <span className="text-red-500/80">*</span>
                </label>
                <input
                  required
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={updateField}
                  placeholder="Enter your email"
                  className="input"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="label">
                  Phone Number <span className="text-red-500/80">*</span>
                </label>
                <input
                  required
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={updateField}
                  placeholder="10 digit mobile number"
                  className="input"
                  inputMode="numeric"
                  autoComplete="tel"
                />
              </div>

              <div>
                <label className="label">
                  Business Type <span className="text-red-500/80">*</span>
                </label>
                <input
                  required
                  name="businessType"
                  value={form.businessType}
                  onChange={updateField}
                  placeholder="IT, Retail, Restaurant, etc."
                  className="input"
                />
              </div>
            </div>

            {/* Business Name */}
            <div>
              <label className="label">
                Business / Shop Name <span className="text-red-500/80">*</span>
              </label>
              <input
                required
                name="businessName"
                value={form.businessName}
                onChange={updateField}
                placeholder="Enter business name"
                className="input"
              />
            </div>

            {/* Service */}
            <div>
              <label className="label">
                Service Required <span className="text-red-500/80">*</span>
              </label>
              <select
                required
                name="serviceRequired"
                value={form.serviceRequired}
                onChange={updateField}
                className="input"
              >
                <option value="">Select Service Required</option>
                {services.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="label">
                Message <span className="text-red-500/80">*</span>
              </label>
              <textarea
                required
                name="message"
                value={form.message}
                onChange={updateField}
                placeholder="Tell us what you need..."
                rows={4}
                className="input resize-none"
              />
            </div>

            {/* Submit */}
            <button
              disabled={loading}
              type="submit"
              className={cn(
                "btn-primary w-full",
                loading && "opacity-60 pointer-events-none",
              )}
            >
              {loading ? "Submitting..." : "Submit Enquiry"}
            </button>

            <p className="text-xs text-black/45 dark:text-white/45 text-center">
              By submitting, you agree to be contacted by APX Teck.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
