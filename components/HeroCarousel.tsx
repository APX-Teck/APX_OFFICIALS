"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { siteData } from "@/lib/siteData";
import { ArrowRight } from "lucide-react";

export default function HeroCarousel() {
  const slides = siteData.hero.slides;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4500);
    return () => clearInterval(t);
  }, [slides.length]);

  const bg = useMemo(() => slides[index], [slides, index]);

  return (
    <section className="hero">
      <div className="hero-bg" style={{ backgroundImage: `url(${bg})` }} />
      <div className="hero-overlay" />

      <div className="container hero-inner">
        <div className="max-w-3xl">
          <p className="hero-kicker">Premium IT Company</p>
          <h1 className="hero-title">{siteData.hero.headline}</h1>

          <div className="mt-5 flex flex-wrap gap-2">
            {siteData.hero.subheadings.map((x) => (
              <span key={x} className="pill">
                {x}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link className="btn-primary" href="/enquiry">
              Get Enquiry <ArrowRight size={18} />
            </Link>
            <Link className="btn-ghost" href="/services">
              View Services
            </Link>
          </div>

          <div className="mt-10 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={i === index ? "dot dot-active" : "dot"}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
