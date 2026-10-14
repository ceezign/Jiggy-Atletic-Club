"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { LayoutDashboard, LogOut, Globe, Dumbbell } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { RESOURCES } from "@/lib/adminConfig";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.replace("/login");
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return <div className="min-h-[70vh] flex items-center justify-center text-muted">Loading...</div>;
  }

  if (user.role !== "ADMIN") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <h1 className="font-display text-3xl text-ivory">Admin access only</h1>
        <p className="text-muted mt-3 max-w-md">This area is for Jiggy Athletic Club staff. You&apos;re logged in as a member.</p>
        <Link href="/dashboard" className="mt-6 px-6 py-3 bg-volt text-charcoal font-semibold rounded-sharp hover:bg-volt-bright transition-colors">
          Go to my dashboard
        </Link>
      </div>
    );
  }

  const nav = [{ href: "/admin", label: "Overview" }, ...RESOURCES.map((r) => ({ href: `/admin/${r.key}`, label: r.title }))];

  return (
    <div className="min-h-screen bg-charcoal lg:flex">
      <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-white/10 min-h-screen sticky top-0 py-6 px-4">
        <Link href="/admin" className="flex items-center gap-2 px-2 mb-1">
          <Dumbbell className="w-5 h-5 text-volt" />
          <span className="font-display text-lg text-ivory">JIGGY ATHLETIC</span>
        </Link>
        <p className="px-2 mb-6 text-xs text-violet">Admin panel</p>
        <nav className="flex flex-col gap-1 overflow-y-auto">
          {nav.map((item, i) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-sharp text-sm font-medium transition-colors ${
                  active ? "bg-volt text-charcoal" : "text-ivory/80 hover:bg-surface"
                }`}
              >
                {i === 0 && <LayoutDashboard className="w-4 h-4" />}
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto pt-6 flex flex-col gap-1">
          <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-sharp text-sm text-muted hover:text-volt hover:bg-surface">
            <Globe className="w-4 h-4" /> View website
          </Link>
          <button
            onClick={() => logout().then(() => router.push("/"))}
            className="flex items-center gap-3 px-3 py-2 rounded-sharp text-sm text-muted hover:text-volt hover:bg-surface text-left"
          >
            <LogOut className="w-4 h-4" /> Log out
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <div className="lg:hidden border-b border-white/10 px-4 py-3 flex items-center justify-between">
          <span className="font-display text-base text-ivory">JIGGY <span className="text-volt">ADMIN</span></span>
          <button onClick={() => logout().then(() => router.push("/"))} className="text-sm text-muted flex items-center gap-1.5">
            <LogOut className="w-4 h-4" /> Log out
          </button>
        </div>
        <div className="lg:hidden flex gap-2 overflow-x-auto scroll-thin px-4 py-3 border-b border-white/10">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-1.5 text-xs font-semibold rounded-sharp whitespace-nowrap ${
                pathname === item.href ? "bg-volt text-charcoal" : "bg-surface text-ivory/80"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="p-5 lg:p-10 max-w-6xl">{children}</div>
      </div>
    </div>
  );
}
