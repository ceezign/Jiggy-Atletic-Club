"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Dumbbell } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/activities", label: "Activities" },
  { href: "/coaches", label: "Coaches" },
  { href: "/classes", label: "Classes" },
  { href: "/membership", label: "Membership" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isDashboard = pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin");
  if (isDashboard) return null;

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-charcoal/95 backdrop-blur border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div className="container-x flex h-16 lg:h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Dumbbell className="w-6 h-6 text-volt" strokeWidth={2.5} />
          <span className="font-display text-xl lg:text-2xl tracking-tight text-ivory">
            JIGGY <span className="text-volt">ATHLETIC</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-volt ${
                pathname === link.href ? "text-volt" : "text-ivory/85"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          {!isLoading && user ? (
            <Link
              href={user.role === "ADMIN" ? "/admin" : "/dashboard"}
              className="px-4 py-2 text-sm font-semibold rounded-sharp border border-white/20 text-ivory hover:border-volt hover:text-volt transition-colors"
            >
              {user.role === "ADMIN" ? "Admin Panel" : "My Dashboard"}
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-ivory/85 hover:text-volt transition-colors">
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-semibold rounded-sharp border border-white/20 text-ivory hover:border-volt hover:text-volt transition-colors"
              >
                Join Now
              </Link>
            </>
          )}
          <Link
            href="/free-trial"
            className="px-4 py-2 text-sm font-semibold rounded-sharp bg-volt text-charcoal hover:bg-volt-bright transition-colors"
          >
            Book Free Trial
          </Link>
        </div>

        <button
          className="lg:hidden text-ivory p-2 -mr-2"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden bg-charcoal border-b border-white/10"
          >
            <div className="container-x flex flex-col py-4 gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="py-3 text-base font-medium text-ivory/90 border-b border-white/5 last:border-0"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-4">
                {!isLoading && user ? (
                  <Link
                    href={user.role === "ADMIN" ? "/admin" : "/dashboard"}
                    className="text-center px-4 py-3 text-sm font-semibold rounded-sharp border border-white/20"
                  >
                    {user.role === "ADMIN" ? "Admin Panel" : "My Dashboard"}
                  </Link>
                ) : (
                  <>
                    <Link href="/login" className="text-center px-4 py-3 text-sm font-semibold rounded-sharp border border-white/20">
                      Login
                    </Link>
                    <Link href="/register" className="text-center px-4 py-3 text-sm font-semibold rounded-sharp border border-white/20">
                      Register
                    </Link>
                  </>
                )}
                <Link
                  href="/free-trial"
                  className="text-center px-4 py-3 text-sm font-semibold rounded-sharp bg-volt text-charcoal"
                >
                  Book Free Trial
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
