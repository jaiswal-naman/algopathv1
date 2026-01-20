"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { user, logout, isAuthenticated } = useAuth();
    const router = useRouter();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleLogout = () => {
        logout();
        setIsProfileOpen(false);
        router.push("/");
    };

    return (
        <header className="border-b border-slate-700/50 glass-effect sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full overflow-hidden shadow-lg shadow-emerald-500/25 relative">
                            <Image
                                src="/algopath-logo.jpg"
                                alt="AlgoPath Logo"
                                width={40}
                                height={40}
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <h1 className="font-bold text-xl text-white">AlgoPath</h1>
                            <p className="text-xs text-slate-400">by NITROUS</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link
                            href="/"
                            className="text-sm font-bold text-xl gap-4 text-slate-300 hover:text-emerald-400 transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            href="/about"
                            className="text-sm font-bold text-xl gap-4 text-slate-300 hover:text-emerald-400 transition-colors"
                        >
                            About
                        </Link>
                        <button
                            onClick={() => {
                                if (isAuthenticated) {
                                    router.push("/lfa-builder");
                                } else {
                                    router.push("/login");
                                }
                            }}
                            className="text-sm font-bold text-xl gap-4 text-slate-300 hover:text-emerald-400 transition-colors"
                        >
                            Design
                        </button>
                        <Link
                            href="/contact"
                            className="text-sm font-bold text-xl gap-4 text-slate-300 hover:text-emerald-400 transition-colors"
                        >
                            Contact
                        </Link>

                        {/* Auth Buttons */}
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center hover:ring-2 hover:ring-emerald-400 transition-all"
                                >
                                    <span className="text-white font-bold text-sm">
                                        {user?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
                                    </span>
                                </button>

                                {/* Dropdown Menu */}
                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg py-2">
                                        <Link
                                            href="/profile"
                                            className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                                            onClick={() => setIsProfileOpen(false)}
                                        >
                                            Profile
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700 transition-colors"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                href="/signup"
                                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-emerald-500/30 transition-all"
                            >
                                Sign Up
                            </Link>
                        )}
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
                            <Link
                                href="/"
                                className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors py-2"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                href="/about"
                                className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors py-2"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                About
                            </Link>
                            <button
                                onClick={() => {
                                    if (isAuthenticated) {
                                        router.push("/lfa-builder");
                                    } else {
                                        router.push("/login");
                                    }
                                    setIsMobileMenuOpen(false);
                                }}
                                className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors py-2 text-left w-full"
                            >
                                Design
                            </button>
                            <Link
                                href="/contact"
                                className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors py-2"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Contact
                            </Link>

                            {/* Mobile Auth */}
                            {isAuthenticated ? (
                                <>
                                    <Link
                                        href="/profile"
                                        className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors py-2"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Profile
                                    </Link>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="px-4 py-2 border border-red-500 text-red-400 hover:bg-red-500 hover:text-white rounded-lg text-sm font-medium transition-all text-left"
                                    >
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/signup"
                                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg text-sm font-medium text-center"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Sign Up
                                </Link>
                            )}
                        </div>
                    </nav>
                )}
            </div>
        </header >
    );
}
