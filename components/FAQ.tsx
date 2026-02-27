"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

const faqs = [
  {
    q: "How much time does a website take?",
    a: "A normal business website usually takes 5–10 working days depending on pages and features.",
  },
  {
    q: "Do you provide support after launch?",
    a: "Yes. We provide maintenance and support packages after project delivery.",
  },
  {
    q: "Do you create e-commerce websites?",
    a: "Yes. We build e-commerce websites with payment gateway, product management, and order system.",
  },
  {
    q: "Can you handle SEO and digital marketing?",
    a: "Yes. We provide SEO, Google Ads, Meta Ads, content marketing, and social media marketing.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="grid gap-3 max-w-3xl">
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <Reveal key={f.q}>
            <button onClick={() => setOpen(isOpen ? null : i)} className="faq">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-left">{f.q}</p>
                <ChevronDown
                  size={18}
                  className={cn(
                    "transition-transform",
                    isOpen ? "rotate-180" : "rotate-0",
                  )}
                />
              </div>

              {isOpen && (
                <p className="mt-3 text-black/70 dark:text-white/70">{f.a}</p>
              )}
            </button>
          </Reveal>
        );
      })}
    </div>
  );
}
