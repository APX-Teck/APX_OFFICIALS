"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { cn } from "@/lib/cn";
import { siteData } from "@/lib/siteData";
import EnquiryModal from "@/components/EnquiryModal";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, LayoutDashboard, LogIn } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Check if user is logged in
    const token = Cookies.get("token");
    setIsLoggedIn(!!token);
  }, [pathname]);

  // Close menu on route click
  function closeMenu() {
    setOpen(false);
  }

  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/login");
  };
  const redirectToRoleDashboard = () => {
    const token = localStorage.getItem("token") || Cookies.get("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      const role = decoded?.role;

      switch (role) {
        case "SUPER_ADMIN":
          router.push("/superadmin");
          break;
        case "ADMIN":
          router.push("/admin");
          break;
        case "EDITOR":
          router.push("/editor");
          break;
        case "ADS_MANAGER":
          router.push("/adsmanager");
          break;
        case "SALES":
          router.push("/sales");
          break;
        case "CLIENT":
          router.push("/");
          break;
        default:
          router.push("/dashboard");
      }
    } catch (error) {
      console.error("Token decoding failed:", error);
      router.push("/login");
    }
  };

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

            {isLoggedIn ? (
              <div className="flex items-center gap-2 ml-2 pl-2 border-l border-black/10 dark:border-white/10">
                <Button
                  onClick={redirectToRoleDashboard}
                  className="flex items-center gap-2 text-sm font-medium px-4 py-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-black dark:text-white rounded-xl transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Button>
                <button
                  onClick={handleLogout}
                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                  aria-label="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center ml-2 pl-2 border-l border-black/10 dark:border-white/10">
                <Link
                  href="/login"
                  className="flex items-center gap-2 text-sm font-medium px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
              </div>
            )}
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

              <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-black/10 dark:border-white/10">
                <div className="flex items-center gap-3">
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

                {isLoggedIn ? (
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/dashboard"
                      onClick={closeMenu}
                      className="flex items-center justify-center gap-2 w-full text-sm font-medium px-4 py-2 bg-black/5 dark:bg-white/5 rounded-xl transition-all"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        closeMenu();
                      }}
                      className="flex items-center justify-center gap-2 w-full text-sm font-medium px-4 py-2 text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="flex items-center justify-center gap-2 w-full text-sm font-medium px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all"
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <EnquiryModal open={enquiryOpen} onClose={() => setEnquiryOpen(false)} />
    </>
  );
}
