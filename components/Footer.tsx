import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black relative z-[1]">
      <div className="container py-10 grid gap-8 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-2xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center">
              <img
                src="/apx-logo.png"
                alt="APX Logo"
                className="h-full w-full object-contain p-2"
              />
            </div>

            <div>
              <p className="text-xl font-semibold">APX Teck</p>
              <p className="text-sm text-white/60 mt-1">
                Advance Precision & Excellence
              </p>
            </div>
          </div>

          <p className="text-white/60 mt-4 max-w-sm">
            Premium IT services, modern web & app development, UI/UX, digital
            marketing, SEO & branding.
          </p>
        </div>

        <div>
          <p className="font-semibold">Quick Links</p>
          <div className="mt-3 grid gap-2 text-white/70">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/services">Services</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/enquiry">Get Enquiry</Link>
          </div>
        </div>

        <div className="mt-3 grid gap-2 text-white/70">
  <a
    href="mailto:info@apxteck.com"
    className="hover:text-white transition"
  >
    Email: info@apxteck.com
  </a>

  <a
    href="tel:+919405282582"
    className="hover:text-white transition"
  >
    Phone: +91 94052 82582
  </a>

  <a
    href="https://wa.me/919405282582"
    target="_blank"
    className="hover:text-white transition"
  >
    WhatsApp: +91 94052 82582
  </a>

  <p>Address:Pune, Maharashtra, India. (411041)</p>
</div>

      </div>

      <div className="border-t border-white/10">
        <div className="container py-5 text-sm text-white/60 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} APX Teck. All rights reserved.</p>
          <p>Designed with a premium black theme.</p>
        </div>
      </div>
    </footer>
  );
}
