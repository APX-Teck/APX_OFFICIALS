"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { siteData } from "@/lib/siteData";
import EnquiryModal from "@/components/EnquiryModal";
import { ThemeToggle } from "@/components/ThemeToggle";
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

  // Close menu on route click
  function closeMenu() {
    setOpen(false);
  }

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all",
          scrolled
            ? "bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-black/10 dark:border-white/10"
            : "bg-transparent",
        )}
      >
        <div className="container flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 flex items-center justify-center">
              <img
                src="/apx-logo.png"
                alt="APX Logo"
                className="h-full w-full object-contain p-1"
              />
            </div>

            <div>
              <p className="font-semibold leading-none">
                {siteData.brand.name}
              </p>
              <p className="text-xs text-black/60 dark:text-white/60 leading-none mt-1">
                {siteData.brand.tagline}
              </p>
            </div>
          </Link>

          {/* Desktop Menu */}
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
            <Link className="nav-link" href="/explore-news">
              Explore & News
            </Link>
            <Link className="nav-link" href="/contact">
              Contact Us
            </Link>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setEnquiryOpen(true)}
              className="btn-primary text-sm px-4 py-2"
            >
              Get Enquiry
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5"
            onClick={() => setOpen((s) => !s)}
            aria-label="Open menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden border-t border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-xl">
            <div className="container py-4 flex flex-col gap-2">
              <Link className="nav-link" href="/" onClick={closeMenu}>
                Home
              </Link>

              <Link className="nav-link" href="/about" onClick={closeMenu}>
                About Us
              </Link>

              <Link className="nav-link" href="/services" onClick={closeMenu}>
                Services
              </Link>

              {/* ✅ ADDED Explore & News in Mobile */}
              <Link
                className="nav-link"
                href="/explore-news"
                onClick={closeMenu}
              >
                Explore & News
              </Link>

              <Link className="nav-link" href="/contact" onClick={closeMenu}>
                Contact Us
              </Link>

              <div className="flex items-center gap-3 mt-2">
                <ThemeToggle />
                <button
                  onClick={() => {
                    setEnquiryOpen(true);
                    setOpen(false);
                  }}
                  className="btn-primary flex-1 text-sm py-2"
                >
                  Get Enquiry
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <EnquiryModal open={enquiryOpen} onClose={() => setEnquiryOpen(false)} />
    </>
  );
}
