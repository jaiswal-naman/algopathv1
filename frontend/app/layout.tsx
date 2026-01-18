import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LFA Builder - Shikshagraha",
  description: "Create Logical Framework Approach documents with AI assistance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-[#2c3e50] via-[#34495e] to-[#2c3e50] animate-gradient relative overflow-hidden">
          {/* Hexagonal pattern overlay */}
          <div className="absolute inset-0 hexagon-pattern opacity-40"></div>

          {/* Floating geometric shapes with neon colors */}
          <div className="absolute top-20 right-10 w-16 h-16 border-2 rotate-45 animate-float-slow animate-neon-border"></div>
          <div className="absolute top-40 left-20 w-12 h-12 border-2 rounded-full animate-float animate-neon-border"></div>
          <div className="absolute bottom-32 right-32 w-20 h-20 border-2 animate-float-reverse animate-neon-border" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
          <div className="absolute top-1/2 left-10 w-14 h-14 border-2 rotate-12 animate-float-slow animate-neon-border"></div>
          <div className="absolute bottom-20 left-1/4 w-10 h-10 border-2 rounded-full animate-pulse-glow animate-neon-border"></div>

          {/* Animated Pencil Icons with neon glow */}
          <div className="absolute top-20 right-32 opacity-20 animate-float animate-slow-rotate animate-neon-change">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <div className="absolute top-1/3 left-16 opacity-15 animate-float-slow rotate-45 animate-neon-change">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <div className="absolute bottom-1/4 right-20 opacity-20 animate-float-reverse -rotate-12 animate-neon-change">
            <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>

          {/* Animated Book Icons with neon glow */}
          <div className="absolute top-32 left-1/4 opacity-15 animate-float animate-neon-change">
            <svg width="65" height="65" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div className="absolute top-2/3 right-1/4 opacity-20 animate-float-slow animate-neon-change">
            <svg width="75" height="75" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div className="absolute bottom-1/3 left-1/3 opacity-15 animate-float-reverse animate-neon-change">
            <svg width="55" height="55" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div className="absolute top-1/2 right-1/3 opacity-20 animate-float rotate-12 animate-neon-change">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>

          {/* Decorative eraser icon with neon glow */}
          <div className="absolute bottom-40 left-20 opacity-20 animate-float-reverse animate-neon-change">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <rect x="3" y="3" width="18" height="18" rx="2" />
            </svg>
          </div>

          {/* Header - Now using Navbar component */}
          <Navbar />

          {/* Main Content */}
          <main className="container mx-auto px-4 py-8 relative z-10">{children}</main>

          {/* Footer */}
          <footer className="border-t border-slate-700/50 glass-effect mt-auto relative z-10">
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-base text-slate-400">
                  Built with TEAM NITROUS to transform public education in India
                </p>
                <p className="text-base text-slate-400">
                  NIT Rourkela
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
