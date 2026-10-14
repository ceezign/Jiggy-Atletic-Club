import type { Metadata } from "next";
import { Oswald, Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-oswald",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Jiggy Athletic Club — Build Your Strongest Self",
    template: "%s | Jiggy Athletic Club",
  },
  description:
    "Train smarter, get stronger, and become part of a community committed to helping you reach your fitness goals. Book a free session at Jiggy Athletic Club.",
  openGraph: {
    title: "Jiggy Athletic Club",
    description: "Premium strength & conditioning gym. Book your free trial session today.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${oswald.variable} ${inter.variable}`}>
      <body className="font-body antialiased bg-charcoal text-ivory">
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
