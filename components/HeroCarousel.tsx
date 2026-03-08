"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { siteData } from "@/lib/siteData";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function HeroCarousel() {
  const slides = siteData.hero.slides;

  const [index, setIndex] = useState(0);

  // auto slide
  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5200);

    return () => clearInterval(t);
  }, [slides.length]);

  function next() {
    setIndex((i) => (i + 1) % slides.length);
  }

  function prev() {
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  }

  return (
    <section className="hero">
      {/* Background Slides (Real Animation) */}
      <div className="absolute inset-0 z-[1] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{
              opacity: 0,
              scale: 1.18,
              filter: "blur(18px)",
              x: 40,
            }}
            animate={{
              opacity: 1,
              scale: 1.08,
              filter: "blur(0px)",
              x: 0,
            }}
            exit={{
              opacity: 0,
              scale: 1.02,
              filter: "blur(16px)",
              x: -40,
            }}
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1], // ultra smooth
            }}
            style={{
              backgroundImage: `url(${slides[index]})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </AnimatePresence>
      </div>

      {/* Overlay */}
      <div className="hero-overlay opacity-0" />

      {/* Content */}
      <div className="container hero-inner">
        <div className="max-w-3xl">
          <motion.p
            className="hero-kicker"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Premium IT Company
          </motion.p>

          <motion.h1
            className="hero-title"
            key={"title-" + index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.05 }}
          >
            {siteData.hero.headline}
          </motion.h1>

          <motion.div
            className="mt-5 flex flex-wrap gap-2"
            key={"sub-" + index}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
          >
            {siteData.hero.subheadings.map((x) => (
              <span key={x} className="pill">
                {x}
              </span>
            ))}
          </motion.div>

          <motion.div
            className="mt-8 flex flex-col sm:flex-row gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
          >
            <Link className="btn-primary" href="/enquiry">
              Get Enquiry <ArrowRight size={18} />
            </Link>

            <Link className="btn-ghost" href="/services">
              View Services
            </Link>
          </motion.div>

          {/* Controls */}
          <div className="mt-10 flex items-center gap-4">
            <button
              onClick={prev}
              className="p-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition"
              aria-label="Previous slide"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={i === index ? "dot dot-active" : "dot"}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="p-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition"
              aria-label="Next slide"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
