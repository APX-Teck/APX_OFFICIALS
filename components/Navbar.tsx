"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { siteData } from "@/lib/siteData";
import EnquiryModal from "@/components/EnquiryModal";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all",
          scrolled
            ? "bg-black/70 backdrop-blur-xl border-b border-white/10"
            : "bg-transparent"
        )}
      >
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center">
              <img
                src="/apx-logo.png"
                alt="APX Logo"
                className="h-full w-full object-contain p-1"
              />
            </div>

            <div>
              <p className="font-semibold leading-none">{siteData.brand.name}</p>
              <p className="text-xs text-white/60 leading-none mt-1">
                {siteData.brand.tagline}
              </p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            <Link className="nav-link" href="/">
              Home
            </Link>
            <Link className="nav-link" href="/about">
              About Us
            </Link>
            <Link className="nav-link" href="/services">
              Services
            </Link>
            <Link className="nav-link" href="/contact">
              Contact Us
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => setEnquiryOpen(true)} className="btn-primary">
              Get Enquiry
            </button>
          </div>

          <button
            className="md:hidden p-2 rounded-xl border border-white/10 bg-white/5"
            onClick={() => setOpen((s) => !s)}
            aria-label="Open menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t border-white/10 bg-black/80 backdrop-blur-xl">
            <div className="container py-4 flex flex-col gap-2">
              <Link className="nav-link" href="/" onClick={() => setOpen(false)}>
                Home
              </Link>
              <Link
                className="nav-link"
                href="/about"
                onClick={() => setOpen(false)}
              >
                About Us
              </Link>
              <Link
                className="nav-link"
                href="/services"
                onClick={() => setOpen(false)}
              >
                Services
              </Link>
              <Link
                className="nav-link"
                href="/contact"
                onClick={() => setOpen(false)}
              >
                Contact Us
              </Link>

              <button
                onClick={() => {
                  setEnquiryOpen(true);
                  setOpen(false);
                }}
                className="btn-primary w-full mt-2"
              >
                Get Enquiry
              </button>
            </div>
          </div>
        )}
      </header>

      <EnquiryModal open={enquiryOpen} onClose={() => setEnquiryOpen(false)} />
    </>
  );
}
