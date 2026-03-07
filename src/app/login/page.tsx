"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { authApi } from "@/lib/api";
import PremiumButton from "@/components/GoldenButton";

import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const prefersReducedMotion = useReducedMotion();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    // Animation state — skip unfurl delay when reduced motion is preferred
    const [isUnfurled, setIsUnfurled] = useState(!!prefersReducedMotion);

    useEffect(() => {
        if (prefersReducedMotion) { setIsUnfurled(true); return; }
        const timer = setTimeout(() => setIsUnfurled(true), 300);
        return () => clearTimeout(timer);
    }, [prefersReducedMotion]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await login({ email, password });
            // AuthContext handles redirecting to /dashboard on success
        } catch (err: unknown) {            setError(err instanceof Error ? err.message : "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-luxury-radial flex items-center justify-center p-4 relative overflow-hidden">
            {/* Subtle Texture Overlay */}
            <div
                className="absolute inset-0 opacity-15 pointer-events-none bg-[url('/textures/aged-paper.png')] bg-blend-multiply"
            />

            {/* Main Stage */}
            <div className="relative z-10 w-full max-w-[440px] perspective-[1200px] flex flex-col items-center justify-center min-h-[600px]">

                {/* Top Cylinder (The Anchor) - Now Richer Wood/Gold */}
                <motion.div
                    initial={{ y: 220, opacity: 0 }}
                    animate={{ y: isUnfurled ? 0 : 220, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="relative z-30 w-full h-[48px] bg-header-gradient rounded-[24px] shadow-[0_8px_20px_rgba(61,38,24,0.4)]"
                >
                    {/* Ornate End Caps */}
                    <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-[24px] h-[36px] bg-ink-deep rounded-l-lg shadow-md border-r border-brown-dark flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-accent-gold-light" />
                    </div>
                    <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-[24px] h-[36px] bg-ink-deep rounded-r-lg shadow-md border-l border-brown-dark flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-accent-gold-light" />
                    </div>

                    {/* Shine */}
                    <div className="absolute inset-x-0 top-1/4 h-[25%] bg-white/30 blur-[2px] rounded-full" />
                </motion.div>

                {/* The Unfurling Paper Body */}
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: isUnfurled ? "auto" : 0, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }} // Matched timing precisely
                    className="relative z-20 w-[92%] bg-softwhite overflow-hidden origin-top bg-[url('/textures/cream-paper.png')] shadow-[0_10px_40px_-10px_rgba(61,38,24,0.3),inset_0_0_40px_rgba(139,90,43,0.1)] border-x border-[rgba(139,90,43,0.1)]"
                >
                    <div className="px-8 py-10 flex flex-col items-center">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isUnfurled ? 1 : 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="w-full"
                        >
                            {/* Header - Ancient Emblem */}
                            <div className="flex flex-col items-center mb-8">
                                <div className="w-20 h-20 relative mb-4 flex items-center justify-center">
                                    {/* Sun/Moon Emblem Simulation */}
                                    <div className="absolute inset-0 border-2 border-dotted border-bronze rounded-full opacity-30 animate-spin-slow" />
                                    <div className="w-12 h-12 bg-gradient-to-br from-accent-gold-light to-bronze rounded-full flex items-center justify-center shadow-inner">
                                        <div className="w-8 h-8 rounded-full bg-surface-warm relative overflow-hidden">
                                            <div className="absolute -right-2 -top-2 w-6 h-6 bg-accent-gold-light rounded-full" />
                                        </div>
                                    </div>
                                </div>
                                <h1 className="text-3xl font-serif font-bold tracking-[0.15em] text-ink uppercase">
                                    Grahvani
                                </h1>
                                <div className="flex items-center gap-2 mt-2 opacity-80">
                                    <div className="h-[1px] w-6 bg-gold-dark" />
                                    <span className="text-[10px] font-serif uppercase tracking-widest text-gold-dark">Wisdom of Stars</span>
                                    <div className="h-[1px] w-6 bg-gold-dark" />
                                </div>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-6 w-full" aria-busy={loading || undefined}>
                                <div className="space-y-5">
                                    {/* Inputs - Designed to look like lines on a ledger */}
                                    <div className="relative group">
                                        <label htmlFor="login-email" className="block text-xs font-bold font-serif text-gold-dark uppercase tracking-widest mb-1">
                                            Email Address
                                        </label>
                                        <div className="relative flex items-center">
                                            <Mail className="absolute left-0 w-4 h-4 text-gold-primary" />
                                            <input
                                                id="login-email"
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full pl-8 pr-2 py-2 bg-transparent border-b-2 border-gold-primary/40 text-ink font-serif placeholder-muted focus:outline-none focus:border-gold-dark transition-colors"
                                                placeholder="you@example.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="relative group">
                                        <label htmlFor="login-password" className="block text-xs font-bold font-serif text-gold-dark uppercase tracking-widest mb-1">
                                            Password
                                        </label>
                                        <div className="relative flex items-center">
                                            <Lock className="absolute left-0 w-4 h-4 text-gold-primary" />
                                            <input
                                                id="login-password"
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full pl-8 pr-8 py-2 bg-transparent border-b-2 border-gold-primary/40 text-ink font-serif placeholder-muted focus:outline-none focus:border-gold-dark transition-colors"
                                                placeholder="••••••••"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-0 p-1 text-gold-primary/60 hover:text-gold-dark transition-colors"
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                                tabIndex={-1}
                                            >
                                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            className="w-3.5 h-3.5 rounded-sm border-gold-dark accent-gold-primary cursor-pointer focus-visible:ring-2 focus-visible:ring-gold-primary"
                                        />
                                        <span className="text-xs font-serif text-body uppercase tracking-wide">Remember me</span>
                                    </label>
                                    <Link href="/forgot-password" className="text-xs font-serif text-gold-dark font-bold uppercase tracking-wide hover:underline">
                                        Forgot Password?
                                    </Link>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -10 }}
                                        animate={{ opacity: 1, x: prefersReducedMotion ? 0 : [0, -6, 6, -3, 3, 0] }}
                                        transition={{ duration: prefersReducedMotion ? 0.01 : 0.4 }}
                                        role="alert"
                                        className="text-red-900/80 text-xs font-serif bg-red-50/50 p-2 rounded border border-red-100/50 text-center mx-10 backdrop-blur-sm"
                                    >
                                        {(() => {
                                            const lowerError = error.toLowerCase();
                                            if (lowerError.includes('user not found') || lowerError.includes('invalid credentials')) return "Invalid email or password. Please try again.";
                                            if (lowerError.includes('password')) return "Incorrect password. Please try again.";
                                            if (lowerError.includes('verify')) return "Your account is pending verification. Please check your email.";
                                            return error;
                                        })()}
                                    </motion.div>
                                )}

                                {/* Premium Button using GoldenButton Component */}
                                <div className="w-full flex justify-center">
                                    <PremiumButton
                                        topText={loading ? 'Signing' : 'Sign'}
                                        bottomText={loading ? 'In...' : 'In'}
                                        type="submit"
                                        disabled={loading}
                                    />
                                </div>
                            </form>

                            <div className="mt-8">
                                <p className="text-xs font-serif text-muted italic">
                                    New to Grahvani? <Link href="/register" className="font-bold text-gold-dark hover:underline">Create an account</Link>
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Bottom Cylinder (The Moving Roll) */}
                <motion.div
                    initial={{ y: -220, opacity: 0 }}
                    animate={{ y: isUnfurled ? 0 : -220, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="relative z-30 w-full h-[54px] -mt-1 bg-header-gradient rounded-[27px] shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
                >
                    {/* Ornate End Caps */}
                    <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-[28px] h-[40px] bg-ink-deep rounded-l-lg shadow-md border-r border-brown-dark flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-accent-gold-light" />
                    </div>
                    <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-[28px] h-[40px] bg-ink-deep rounded-r-lg shadow-md border-l border-brown-dark flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-accent-gold-light" />
                    </div>

                    {/* Reflection */}
                    <div className="absolute inset-x-0 bottom-1/4 h-[20%] bg-white/20 blur-[3px] rounded-full" />
                </motion.div>

            </div>
        </div>
    );
}
