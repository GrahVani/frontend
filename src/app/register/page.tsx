"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, User, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { authApi } from "@/lib/api";
import PremiumButton from "@/components/GoldenButton";

import Image from "next/image";

export default function RegisterPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    // Animation state
    const [isUnfurled, setIsUnfurled] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsUnfurled(true), 300);
        return () => clearTimeout(timer);
    }, []);

    // Password strength checks
    const passwordChecks = {
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
    };
    const strengthScore = Object.values(passwordChecks).filter(Boolean).length;
    const strengthLabel = strengthScore <= 1 ? "Weak" : strengthScore <= 3 ? "Fair" : strengthScore <= 4 ? "Good" : "Strong";
    const strengthColor = strengthScore <= 1 ? "bg-status-error" : strengthScore <= 3 ? "bg-status-warning" : strengthScore <= 4 ? "bg-gold-primary" : "bg-status-success";

    // Inline validation
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const passwordsMatch = password === confirmPassword;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match. Please try again.");
            setLoading(false);
            return;
        }

        try {
            await authApi.register({ name, email, password });

            // On success, redirect to login
            router.push("/login?registered=true");
        } catch (err: unknown) {            setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
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
            <div className="relative z-10 w-full max-w-[480px] perspective-[1200px] flex flex-col items-center justify-center min-h-[700px]">

                {/* Top Cylinder */}
                <motion.div
                    initial={{ y: 220, opacity: 0 }}
                    animate={{ y: isUnfurled ? 0 : 220, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="relative z-30 w-full h-[48px] bg-header-gradient rounded-[24px] shadow-[0_8px_20px_rgba(61,38,24,0.4)]"
                >
                    <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-[24px] h-[36px] bg-ink-deep rounded-l-lg" />
                    <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-[24px] h-[36px] bg-ink-deep rounded-r-lg" />
                    <div className="absolute inset-x-0 top-1/4 h-[25%] bg-white/30 blur-[2px] rounded-full" />
                </motion.div>

                {/* The Unfurling Paper Body */}
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: isUnfurled ? "auto" : 0, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="relative z-20 w-[94%] bg-softwhite overflow-hidden origin-top bg-[url('/textures/cream-paper.png')] shadow-[0_10px_40px_-10px_rgba(61,38,24,0.3),inset_0_0_40px_rgba(139,90,43,0.1)] border-x border-[rgba(139,90,43,0.1)]"
                >
                    <div className="px-8 py-10 flex flex-col items-center">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isUnfurled ? 1 : 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="w-full"
                        >
                            <div className="flex flex-col items-center mb-8 w-full text-center">
                                {/* Branding */}
                                <div className="relative flex items-center justify-center mb-2">
                                    <Image
                                        src="/Logo.png"
                                        alt="Grahvani Logo"
                                        width={240}
                                        height={120}
                                        className="object-contain contrast-[1.1] brightness-[1.1] select-none"
                                        style={{
                                            height: '100px',
                                            width: 'auto',
                                        }}
                                        priority
                                    />
                                </div>
                                <h1 className="text-4xl font-serif font-bold tracking-[0.15em] text-ink uppercase select-none">
                                    Grahvani
                                </h1>
                                <div className="flex items-center gap-2 mt-3 mb-6 opacity-90">
                                    <div className="h-[1px] w-8 bg-gold-dark/60" />
                                    <span className="text-[11px] font-serif uppercase tracking-[0.2em] text-gold-dark font-bold">Wisdom of Stars</span>
                                    <div className="h-[1px] w-8 bg-gold-dark/60" />
                                </div>

                                <div className="h-[1px] w-full bg-gold-primary/20 mb-8" />

                                <h2 className="text-2xl font-serif font-bold tracking-[0.15em] text-ink uppercase">
                                    Create Account
                                </h2>
                                <div className="flex items-center gap-2 mt-2 opacity-80 px-4">
                                    <div className="h-[1px] flex-1 bg-gold-dark/40" />
                                    <span className="text-[9px] font-serif uppercase tracking-widest text-gold-dark whitespace-nowrap">Professional Astrology Platform</span>
                                    <div className="h-[1px] flex-1 bg-gold-dark/40" />
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4 w-full">
                                <div className="space-y-4">
                                    {/* Name */}
                                    <div className="relative group">
                                        <label className="block text-xs font-bold font-serif text-gold-dark uppercase tracking-widest mb-1">
                                            Full Name
                                        </label>
                                        <div className="relative flex items-center">
                                            <User className="absolute left-0 w-4 h-4 text-gold-primary" />
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full pl-8 pr-2 py-1.5 bg-transparent border-b-2 border-gold-primary/40 text-ink font-serif placeholder-muted focus:outline-none focus:border-gold-dark transition-colors"
                                                placeholder="Your full name"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="relative group">
                                        <label className="block text-xs font-bold font-serif text-gold-dark uppercase tracking-widest mb-1">
                                            Email Address
                                        </label>
                                        <div className="relative flex items-center">
                                            <Mail className="absolute left-0 w-4 h-4 text-gold-primary" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                                                className={`w-full pl-8 pr-2 py-1.5 bg-transparent border-b-2 text-ink font-serif placeholder-muted focus:outline-none transition-colors ${
                                                    touched.email && !emailValid ? "border-status-error/60" : "border-gold-primary/40 focus:border-gold-dark"
                                                }`}
                                                placeholder="you@example.com"
                                                required
                                            />
                                        </div>
                                        {touched.email && email && !emailValid && (
                                            <p className="text-[10px] text-status-error mt-1 font-serif">Please enter a valid email address.</p>
                                        )}
                                    </div>

                                    {/* Password */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="relative group">
                                            <label className="block text-xs font-bold font-serif text-gold-dark uppercase tracking-widest mb-1">
                                                Password
                                            </label>
                                            <div className="relative flex items-center">
                                                <Lock className="absolute left-0 w-4 h-4 text-gold-primary" />
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                                                    className="w-full pl-8 pr-8 py-1.5 bg-transparent border-b-2 border-gold-primary/40 text-ink font-serif placeholder-muted focus:outline-none focus:border-gold-dark transition-colors"
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
                                                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="relative group">
                                            <label className="block text-xs font-bold font-serif text-gold-dark uppercase tracking-widest mb-1">
                                                Confirm Password
                                            </label>
                                            <div className="relative flex items-center">
                                                <ShieldCheck className="absolute left-0 w-4 h-4 text-gold-primary" />
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    onBlur={() => setTouched((t) => ({ ...t, confirmPassword: true }))}
                                                    className={`w-full pl-8 pr-8 py-1.5 bg-transparent border-b-2 text-ink font-serif placeholder-muted focus:outline-none transition-colors ${
                                                        touched.confirmPassword && confirmPassword && !passwordsMatch ? "border-status-error/60" : "border-gold-primary/40 focus:border-gold-dark"
                                                    }`}
                                                    placeholder="••••••••"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-0 p-1 text-gold-primary/60 hover:text-gold-dark transition-colors"
                                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                                    tabIndex={-1}
                                                >
                                                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                                </button>
                                            </div>
                                            {touched.confirmPassword && confirmPassword && !passwordsMatch && (
                                                <p className="text-[10px] text-status-error mt-1 font-serif">Passwords do not match.</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Password Strength Meter */}
                                    {password && (
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 h-1.5 bg-antique/40 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-300 ${strengthColor}`}
                                                        style={{ width: `${(strengthScore / 5) * 100}%` }}
                                                    />
                                                </div>
                                                <span className={`text-[9px] font-serif font-semibold uppercase tracking-wide ${
                                                    strengthScore <= 1 ? "text-status-error" : strengthScore <= 3 ? "text-status-warning" : "text-status-success"
                                                }`}>
                                                    {strengthLabel}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[8px] font-serif text-ink/45">
                                                <span className={passwordChecks.length ? "text-status-success" : ""}>8+ chars</span>
                                                <span className={passwordChecks.upper ? "text-status-success" : ""}>Uppercase</span>
                                                <span className={passwordChecks.lower ? "text-status-success" : ""}>Lowercase</span>
                                                <span className={passwordChecks.number ? "text-status-success" : ""}>Number</span>
                                                <span className={passwordChecks.special ? "text-status-success" : ""}>Special</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: [0, -10, 10, -5, 5, 0] }}
                                        className="text-red-900/80 text-xs font-serif bg-red-50/50 p-2 rounded border border-red-100/50 text-center"
                                    >
                                        {error}
                                    </motion.div>
                                )}

                                <div className="w-full flex justify-center pt-4">
                                    <PremiumButton
                                        topText={loading ? 'Creating' : 'Create'}
                                        bottomText={loading ? 'Account...' : 'Account'}
                                        type="submit"
                                        disabled={loading}
                                    />
                                </div>
                            </form>

                            <div className="mt-8">
                                <p className="text-xs font-serif text-muted italic">
                                    Already have an account? <Link href="/login" className="font-bold text-gold-dark hover:underline">Return to Login</Link>
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Bottom Cylinder */}
                <motion.div
                    initial={{ y: -220, opacity: 0 }}
                    animate={{ y: isUnfurled ? 0 : -220, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="relative z-30 w-full h-[54px] -mt-1 bg-header-gradient rounded-[27px] shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
                >
                    <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-[28px] h-[40px] bg-ink-deep rounded-l-lg" />
                    <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-[28px] h-[40px] bg-ink-deep rounded-r-lg" />
                    <div className="absolute inset-x-0 bottom-1/4 h-[20%] bg-white/20 blur-[3px] rounded-full" />
                </motion.div>

            </div>
        </div>
    );
}
