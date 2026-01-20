import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { ParticleBackground } from "@/components/3d/ParticleBackground";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

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
      <body className={poppins.className}>
        <div className="min-h-screen bg-gradient-to-br from-slate-700 via-slate-600 to-slate-700 animate-gradient relative overflow-hidden">
          {/* 3D Particle Background */}
          <ParticleBackground />

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

          {/* Footer - Enhanced Design */}
          <footer className=" rounded-xl border-t border-slate-700/50 glass-effect mt-auto relative z-10">
            <div className="container rounded-xl mx-auto px-4 py-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Brand Section */}
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                    AlgoPath
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Transforming public education in India through innovative LFA framework design tools.
                  </p>
                  <div className="flex gap-3">
                    <a href="#" className="p-2 bg-slate-800 hover:bg-emerald-500 rounded-lg transition-all duration-300 group">
                      <svg className="w-5 h-5 text-slate-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                    <a href="#" className="p-2 bg-slate-800 hover:bg-emerald-500 rounded-lg transition-all duration-300 group">
                      <svg className="w-5 h-5 text-slate-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    </a>
                    <a href="#" className="p-2 bg-slate-800 hover:bg-emerald-500 rounded-lg transition-all duration-300 group">
                      <svg className="w-5 h-5 text-slate-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">Quick Links</h4>
                  <ul className="space-y-2">
                    <li>
                      <a href="/" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">Home</a>
                    </li>
                    <li>
                      <a href="/lfa-builder" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">LFA Builder</a>
                    </li>
                    <li>
                      <a href="/about" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">About Us</a>
                    </li>
                    <li>
                      <a href="/contact" className="text-slate-400 hover:text-emerald-400 transition-colors text-sm">Contact</a>
                    </li>
                  </ul>
                </div>

                {/* Contact Info */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">Contact</h4>
                  <div className="space-y-3 text-sm">
                    <p className="text-slate-400 flex items-center gap-2">
                      <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      NIT Rourkela, India
                    </p>
                    <p className="text-slate-400 flex items-center gap-2">
                      <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      kunupayal1@gmail.com
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Bar */}
              <div className="mt-8 pt-6 border-t border-slate-700/50 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-slate-400 text-sm">
                  © 2024 AlgoPath. Built with <span className="text-emerald-400">♥</span> by TEAM NITROUS
                </p>
                <div className="flex gap-4 text-sm">
                  <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">Privacy Policy</a>
                  <span className="text-slate-600">•</span>
                  <a href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">Terms of Service</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
