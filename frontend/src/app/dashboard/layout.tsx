"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  LayoutDashboard, User, CreditCard, CalendarCheck, Sparkles, Dumbbell as DumbbellIcon,
  ClipboardCheck, TrendingUp, LogOut, Dumbbell,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/membership", label: "Membership", icon: CreditCard },
  { href: "/dashboard/classes", label: "My Classes", icon: CalendarCheck },
  { href: "/dashboard/free-trial", label: "Free Trial", icon: Sparkles },
  { href: "/dashboard/workouts", label: "Workout History", icon: DumbbellIcon },
  { href: "/dashboard/attendance", label: "Attendance", icon: ClipboardCheck },
  { href: "/dashboard/progress", label: "Progress", icon: TrendingUp },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-muted">
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal">
      <div className="flex">
        <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-white/10 min-h-screen sticky top-0 py-6 px-4">
          <Link href="/" className="flex items-center gap-2 px-2 mb-8">
            <Dumbbell className="w-5 h-5 text-volt" />
            <span className="font-display text-lg text-ivory">JIGGY ATHLETIC</span>
          </Link>
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-sharp text-sm font-medium transition-colors ${
                    active ? "bg-volt text-charcoal" : "text-ivory/80 hover:bg-surface"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <button
            onClick={() => logout().then(() => router.push("/"))}
            className="mt-auto flex items-center gap-3 px-3 py-2.5 rounded-sharp text-sm font-medium text-muted hover:text-volt hover:bg-surface transition-colors"
          >
            <LogOut className="w-4 h-4" /> Log out
          </button>
        </aside>

        <div className="flex-1 min-w-0">
          {/* Mobile top nav */}
          <div className="lg:hidden flex items-center justify-between px-4 py-4 border-b border-white/10">
            <Link href="/" className="flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-volt" />
              <span className="font-display text-base text-ivory">JIGGY</span>
            </Link>
            <button onClick={() => logout().then(() => router.push("/"))} className="text-sm text-muted flex items-center gap-1.5">
              <LogOut className="w-4 h-4" /> Log out
            </button>
          </div>
          <div className="lg:hidden flex gap-2 overflow-x-auto scroll-thin px-4 py-3 border-b border-white/10">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-sharp whitespace-nowrap ${
                    active ? "bg-volt text-charcoal" : "bg-surface text-ivory/80"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <main className="p-5 lg:p-10 max-w-5xl">{children}</main>
        </div>
      </div>
    </div>
  );
}
