"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ProfilePage() {
    const { user, updateProfile, logout } = useAuth();
    const router = useRouter();
    const [fullName, setFullName] = useState(user?.full_name || "");
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    // Redirect if not authenticated
    if (!user) {
        router.push("/login");
        return null;
    }

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            await updateProfile(fullName);
            setSuccess("Profile updated successfully!");
            setIsEditing(false);
        } catch (err: any) {
            setError(err.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-2xl"
            >
                <div className="glass-card rounded-3xl p-8 md:p-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                            <span className="text-white font-bold text-4xl">
                                {user.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                            My Profile
                        </h1>
                        <p className="text-slate-400">{user.email}</p>
                    </div>

                    {/* Messages */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}
                    {success && (
                        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/50 rounded-lg">
                            <p className="text-emerald-400 text-sm">{success}</p>
                        </div>
                    )}

                    {/* Profile Information */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Email (Read-only) */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Email Address
                                </label>
                                <div className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-400">
                                    {user.email}
                                </div>
                            </div>

                            {/* Verification Status */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Account Status
                                </label>
                                <div className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg">
                                    {user.is_verified ? (
                                        <span className="text-emerald-400 flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Verified
                                        </span>
                                    ) : (
                                        <span className="text-yellow-400">Not Verified</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Full Name (Editable) */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Full Name
                            </label>
                            {isEditing ? (
                                <form onSubmit={handleUpdateProfile} className="space-y-4">
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                        placeholder="Enter your full name"
                                    />
                                    <div className="flex gap-3">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
                                        >
                                            {loading ? "Saving..." : "Save"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsEditing(false);
                                                setFullName(user.full_name || "");
                                            }}
                                            className="flex-1 py-2 border border-slate-600 hover:border-slate-500 text-slate-300 rounded-lg transition-all"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className="flex items-center justify-between px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg">
                                    <span className="text-white">{user.full_name || "Not set"}</span>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
                                    >
                                        Edit
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Account Created */}
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Member Since
                            </label>
                            <div className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-400">
                                {new Date(user.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
