"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, Instagram, Facebook, Twitter, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin")) return null;

  return (
    <footer className="bg-surface border-t border-white/10 mt-24">
      <div className="container-x py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Dumbbell className="w-5 h-5 text-volt" />
            <span className="font-display text-lg text-ivory">JIGGY ATHLETIC</span>
          </div>
          <p className="text-sm text-muted leading-relaxed max-w-xs">
            A premium strength & conditioning gym built around real coaching and a community that
            keeps you accountable.
          </p>
          <div className="flex gap-4 mt-5">
            <a href="#" aria-label="Instagram" className="text-muted hover:text-volt"><Instagram className="w-5 h-5" /></a>
            <a href="#" aria-label="Facebook" className="text-muted hover:text-volt"><Facebook className="w-5 h-5" /></a>
            <a href="#" aria-label="Twitter" className="text-muted hover:text-volt"><Twitter className="w-5 h-5" /></a>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-ivory mb-4">Explore</h3>
          <ul className="space-y-2.5 text-sm text-muted">
            <li><Link href="/about" className="hover:text-volt">About</Link></li>
            <li><Link href="/activities" className="hover:text-volt">Activities</Link></li>
            <li><Link href="/coaches" className="hover:text-volt">Coaches</Link></li>
            <li><Link href="/classes" className="hover:text-volt">Class Schedule</Link></li>
            <li><Link href="/membership" className="hover:text-volt">Membership</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-ivory mb-4">Get Started</h3>
          <ul className="space-y-2.5 text-sm text-muted">
            <li><Link href="/free-trial" className="hover:text-volt">Book a Free Trial</Link></li>
            <li><Link href="/register" className="hover:text-volt">Create an Account</Link></li>
            <li><Link href="/login" className="hover:text-volt">Member Login</Link></li>
            <li><Link href="/blog" className="hover:text-volt">Fitness & Nutrition Tips</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-ivory mb-4">Visit Us</h3>
          <ul className="space-y-3 text-sm text-muted">
            <li className="flex gap-2"><MapPin className="w-4 h-4 mt-0.5 shrink-0 text-violet" /> 128 Ironworks Ave, Lagos</li>
            <li className="flex gap-2"><Phone className="w-4 h-4 mt-0.5 shrink-0 text-violet" /> +234 800 123 4567</li>
            <li className="flex gap-2"><Mail className="w-4 h-4 mt-0.5 shrink-0 text-violet" /> hello@jiggyathletic.club</li>
            <li className="pt-1">Mon–Fri: 5:00 AM – 11:00 PM<br />Sat–Sun: 7:00 AM – 9:00 PM</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} Jiggy Athletic Club. All rights reserved.
      </div>
    </footer>
  );
}
