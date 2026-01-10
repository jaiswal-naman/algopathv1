import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
          {/* Header */}
          <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                    <span className="text-white font-bold text-sm">LFA</span>
                  </div>
                  <div>
                    <h1 className="font-semibold text-lg">LFA Builder</h1>
                    <p className="text-xs text-muted-foreground">
                      by Shikshagraha
                    </p>
                  </div>
                </div>
                <nav className="flex items-center gap-4">
                  <a
                    href="https://shikshagraha.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    About
                  </a>
                </nav>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="container mx-auto px-4 py-8">{children}</main>

          {/* Footer */}
          <footer className="border-t bg-white mt-auto">
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                  Built with AI to transform public education in India
                </p>
                <p className="text-sm text-muted-foreground">
                  Shikshagraha Foundation
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
