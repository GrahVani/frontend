"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Terminal } from "lucide-react";

interface FormulaBlockProps {
  formula: string;
  label?: string;
  language?: "formula" | "logic" | "sanskrit";
  className?: string;
}

export default function FormulaBlock({
  formula,
  label = "Algorithm",
  language = "formula",
  className = "",
}: FormulaBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(formula);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple syntax highlighting for formulas
  const highlightFormula = (text: string): React.ReactNode => {
    // Split by keywords and wrap in colored spans
    const tokens = text.split(/(IF|THEN|ELSE|AND|OR|NOT|MOD|\=\=|\=|\+|\-|\*|\/|\(|\)|\{|\}|\[|\]|\>|\<|\>\=|\<\=)/g);
    
    return tokens.map((token, i) => {
      if (["IF", "THEN", "ELSE", "AND", "OR", "NOT"].includes(token)) {
        return (
          <span key={i} className="text-pink-400 font-bold">
            {token}
          </span>
        );
      }
      if (token === "MOD") {
        return (
          <span key={i} className="text-cyan-400 font-bold">
            {token}
          </span>
        );
      }
      if (["==", "=", ">", "<", ">=", "<="].includes(token)) {
        return (
          <span key={i} className="text-amber-400">
            {token}
          </span>
        );
      }
      if (["+", "-", "*", "/", "(", ")", "{", "}", "[", "]"].includes(token)) {
        return (
          <span key={i} className="text-slate-400">
            {token}
          </span>
        );
      }
      // Numbers
      if (/^\d+$/.test(token)) {
        return (
          <span key={i} className="text-emerald-400">
            {token}
          </span>
        );
      }
      // Sanskrit/Jyotish terms (capitalize or specific patterns)
      if (/^[A-Z][a-zA-Z]+$/.test(token) && token.length > 2) {
        return (
          <span key={i} className="text-indigo-300">
            {token}
          </span>
        );
      }
      return <span key={i}>{token}</span>;
    });
  };

  const bgColors = {
    formula: "bg-slate-900",
    logic: "bg-slate-900",
    sanskrit: "bg-amber-950",
  };

  const borderColors = {
    formula: "border-slate-700",
    logic: "border-indigo-800",
    sanskrit: "border-amber-800",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`rounded-xl border ${borderColors[language]} ${bgColors[language]} overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {label}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-300 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <div className="px-4 py-3 font-mono text-sm leading-relaxed text-slate-300 overflow-x-auto">
        <pre className="whitespace-pre-wrap break-all">
          {highlightFormula(formula)}
        </pre>
      </div>
    </motion.div>
  );
}
