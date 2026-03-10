"use client";

import { cn } from "@/lib/utils";
import type { ChaldeanRawResponse } from "@/types/numerology.types";
import { Calculator, Clock } from "lucide-react";

interface RawCalculatorResultProps {
    response: ChaldeanRawResponse;
    className?: string;
}

export default function RawCalculatorResult({ response, className }: RawCalculatorResultProps) {
    const { calculator, method, data } = response;

    return (
        <div className={cn("prem-card p-5 space-y-4 animate-in fade-in duration-300", className)}>
            {/* Header */}
            <div className="flex items-center gap-3">
                <Calculator className="w-4 h-4 text-amber-600" />
                <div>
                    <p className="text-[14px] font-semibold text-primary">{calculator}</p>
                    <p className="text-[11px] text-amber-800/50">{method}</p>
                </div>
            </div>

            {/* Data table */}
            <div className="rounded-lg border border-gold-primary/20 overflow-hidden">
                <table className="w-full text-[13px]">
                    <tbody className="divide-y divide-gold-primary/10">
                        {Object.entries(data).map(([key, value]) => (
                            <tr key={key} className="hover:bg-gold-primary/5 transition-colors">
                                <td className="px-4 py-2 font-semibold text-amber-700 capitalize whitespace-nowrap w-1/3">
                                    {key.replace(/_/g, ' ')}
                                </td>
                                <td className="px-4 py-2 text-primary">
                                    {typeof value === 'object' ? (
                                        <pre className="text-[12px] bg-amber-50/50 p-2 rounded overflow-x-auto max-h-40 font-mono">
                                            {JSON.stringify(value, null, 2)}
                                        </pre>
                                    ) : (
                                        String(value)
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
