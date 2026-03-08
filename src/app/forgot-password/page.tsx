"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { authApi } from "@/lib/api";
import PremiumButton from "@/components/GoldenButton";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // TODO: Wire to actual forgot-password API endpoint when backend supports it
            await new Promise((resolve) => setTimeout(resolve, 1200));
            setSent(true);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to send reset link. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-luxury-radial flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 opacity-15 pointer-events-none bg-[url('/textures/aged-paper.png')] bg-blend-multiply" />

            <div className="relative z-10 w-full max-w-[440px]">
                {/* Back to Login */}
                <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 text-[12px] font-serif text-gold-dark/80 hover:text-gold-dark transition-colors mb-6 uppercase tracking-wide"
                >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="prem-card rounded-2xl bg-[url('/textures/cream-paper.png')]"
                >
                    <div className="px-8 py-10">
                        {sent ? (
                            /* Success State */
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-full bg-status-success/10 flex items-center justify-center mb-4">
                                    <CheckCircle className="w-8 h-8 text-status-success" />
                                </div>
                                <h1 className="text-[24px] font-serif font-bold text-ink mb-2">Check Your Email</h1>
                                <p className="text-[14px] font-serif text-ink/45 mb-6 max-w-[300px]">
                                    If an account exists for <span className="font-semibold text-ink">{email}</span>, we&apos;ve sent a password reset link.
                                </p>
                                <p className="text-[12px] font-serif text-ink/45 italic mb-6">
                                    Didn&apos;t receive it? Check your spam folder or try again in a few minutes.
                                </p>
                                <Link
                                    href="/login"
                                    className="inline-flex items-center gap-1.5 px-4 py-2 text-[14px] font-medium text-softwhite bg-gold-dark rounded-lg hover:bg-gold-primary transition-colors font-serif"
                                >
                                    Return to Login
                                </Link>
                            </div>
                        ) : (
                            /* Form State */
                            <>
                                <div className="flex flex-col items-center mb-8">
                                    <div className="w-14 h-14 rounded-full bg-gold-primary/10 flex items-center justify-center mb-4">
                                        <Mail className="w-7 h-7 text-gold-dark" />
                                    </div>
                                    <h1 className="text-[24px] font-serif font-bold tracking-wide text-ink">
                                        Reset Password
                                    </h1>
                                    <div className="flex items-center gap-2 mt-2 opacity-80">
                                        <div className="h-[1px] w-6 bg-gold-dark" />
                                        <span className="text-[9px] font-serif uppercase tracking-widest text-gold-dark">Account Recovery</span>
                                        <div className="h-[1px] w-6 bg-gold-dark" />
                                    </div>
                                </div>

                                <p className="text-[14px] font-serif text-ink/45 text-center mb-6">
                                    Enter the email address associated with your account and we&apos;ll send a link to reset your password.
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="relative group">
                                        <label htmlFor="reset-email" className="block text-[12px] font-bold font-serif text-gold-dark uppercase tracking-widest mb-1">
                                            Email Address
                                        </label>
                                        <div className="relative flex items-center">
                                            <Mail className="absolute left-0 w-4 h-4 text-gold-primary" />
                                            <input
                                                id="reset-email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full pl-8 pr-2 py-2 bg-transparent border-b-2 border-gold-primary/40 text-ink font-serif placeholder-ink/45 focus:outline-none focus:border-gold-dark transition-colors"
                                                placeholder="you@example.com"
                                                required
                                                autoFocus
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-red-900/80 text-[12px] font-serif bg-red-50/50 p-2 rounded border border-red-100/50 text-center"
                                        >
                                            {error}
                                        </motion.div>
                                    )}

                                    <div className="w-full flex justify-center">
                                        <PremiumButton
                                            topText={loading ? "Sending" : "Send Reset"}
                                            bottomText={loading ? "Link..." : "Link"}
                                            type="submit"
                                            disabled={loading}
                                        />
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
