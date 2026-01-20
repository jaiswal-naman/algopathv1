"use client";

import { useState } from "react";

export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header className="border-b border-slate-700/50 glass-effect sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                            <span className="text-white font-bold text-lg">AP</span>
                        </div>
                        <div>
                            <h1 className="font-bold text-xl text-white">AlgoPath</h1>
                            <p className="text-xs text-slate-400">by NITROUS</p>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        <a
                            href="/"
                            className="text-sm font-bold text-xl gap-4 text-slate-300 hover:text-emerald-400 transition-colors"
                        >
                            Home
                        </a>
                        <a
                            href="/about"
                            className="text-sm font-bold text-xl gap-4 text-slate-300 hover:text-emerald-400 transition-colors"
                        >
                            About
                        </a>
                        <a
                            href="/lfa-builder"
                            className="text-sm font-bold text-xl gap-4 text-slate-300 hover:text-emerald-400 transition-colors"
                        >
                            Design
                        </a>
                        <a
                            href="/contact"
                            className="text-sm font-bold text-xl gap-4 text-slate-300 hover:text-emerald-400 transition-colors"
                        >
                            Contact
                        </a>
                        <button className="px-4 py-2 border font-bold text-xl gap-4 border-slate-600 hover:border-emerald-500 text-slate-300 hover:text-white rounded-lg text-sm font-medium transition-all">
                            Sign Out
                        </button>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMobileMenu}
                        className="md:hidden p-2 text-slate-300 hover:text-emerald-400 transition-colors"
                        aria-label="Toggle mobile menu"
                    >
                        {isMobileMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                    <nav className="md:hidden mt-4 pt-4 border-t border-slate-700/50 animate-fade-in-up">
                        <div className="flex flex-col gap-3">
                            <a
                                href="/"
                                className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors py-2"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Home
                            </a>
                            <a
                                href="/lfa-builder"
                                className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors py-2"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Design
                            </a>
                            <a
                                href="/contact"
                                className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors py-2"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Contact
                            </a>
                            <a
                                href="/about"
                                className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors py-2"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                About
                            </a>
                            <button className="px-4 py-2 border border-slate-600 hover:border-emerald-500 text-slate-300 hover:text-white rounded-lg text-sm font-medium transition-all text-left">
                                Sign Out
                            </button>
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
}
