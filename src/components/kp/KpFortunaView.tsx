import React from 'react';
import { KpFortunaResponse } from '@/types/kp.types';
import { cn } from '@/lib/utils';
import { Calculator, ArrowRight } from 'lucide-react';

interface KpFortunaViewPropsNew {
    data: KpFortunaResponse;
}

export const KpFortunaView: React.FC<KpFortunaViewPropsNew> = ({ data }) => {
    const { fortunaData } = data;

    if (!fortunaData) return <div className="p-8 text-center text-muted-refined">Fortuna Data Unavailable</div>;

    const { calculation, fortunaHouse } = fortunaData;

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in zoom-in duration-700">

            <div className="bg-white border border-antique rounded-2xl shadow-sm overflow-hidden">
                <div className="bg-parchment/60 p-4 border-b border-antique flex items-center justify-between">
                    <h3 className="font-serif font-bold text-lg text-primary flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-accent-gold" />
                        Mathematical Derivation
                    </h3>
                    <span className="text-xs font-mono text-muted-refined uppercase tracking-wider">Formula: Ascendant + Moon - Sun</span>
                </div>

                <table className="w-full text-sm text-left font-sans text-primary">
                    <thead className="tracking-wide text-xs border-b border-antique bg-white uppercase">
                        <tr>
                            <th className="px-6 py-4 font-serif font-semibold w-1/4">Component</th>
                            <th className="px-6 py-4 font-serif font-semibold w-1/4">Longitude (Deg)</th>
                            <th className="px-6 py-4 font-serif font-semibold w-1/4">Sign</th>
                            <th className="px-6 py-4 font-serif font-semibold w-1/4">House</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-antique/50">
                        {(Array.isArray(calculation) ? calculation : Object.values(calculation || {})).map((row: any, idx) => (
                            <tr key={row.component} className={cn(
                                "transition-colors",
                                row.component === 'Pars Fortuna' ? "bg-gold-soft/10 font-bold text-accent-gold" : "hover:bg-gold-primary/5 bg-white"
                            )}>
                                <td className="px-6 py-4 flex items-center gap-3">
                                    {row.component === 'Pars Fortuna' && <span className="text-xl text-accent-gold/80">⊗</span>}
                                    {row.component === 'Ascendant' && <span className="text-md font-serif text-muted-refined">Asc</span>}
                                    {row.component === 'Sun' && <span className="text-md text-muted-refined">⊙</span>}
                                    {row.component === 'Moon' && <span className="text-md text-muted-refined">☾</span>}

                                    <span className={cn(row.component === 'Pars Fortuna' && "font-serif text-lg text-accent-gold")}>{row.component}</span>
                                </td>
                                <td className="px-6 py-4 font-mono text-muted-refined/90">
                                    {row.dms} <span className="text-[10px] text-muted-refined/50 ml-1">({row.longitude.toFixed(2)}°)</span>
                                </td>
                                <td className="px-6 py-4">
                                    {row.sign}
                                </td>
                                <td className="px-6 py-4">
                                    {row.house}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Analysis Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-emerald-50/50 border border-emerald-200/60 shadow-sm">
                    <h4 className="font-serif font-bold text-emerald-800 mb-2 flex items-center gap-2">
                        <ArrowRight className="w-4 h-4 text-emerald-600" />
                        Fortuna Placement
                    </h4>
                    {fortunaHouse ? (
                        <>
                            <p className="text-sm text-emerald-900/90 leading-relaxed font-sans">
                                Fortuna is located in <strong className="font-semibold px-1 rounded bg-white shadow-sm border border-emerald-100">{fortunaHouse.sign}</strong>
                                in the <strong className="font-semibold px-1 rounded bg-white shadow-sm border border-emerald-100">House {fortunaHouse.houseNumber}</strong>.
                            </p>
                            <p className="text-xs text-emerald-700/70 mt-3 font-mono">
                                Cusp Longitude: {fortunaHouse.cuspLongitude}
                            </p>
                        </>
                    ) : (
                        <p className="text-sm text-muted-refined italic">Placement details unavailable</p>
                    )}
                </div>

                <div className="p-6 rounded-2xl bg-white border border-antique shadow-sm">
                    <h4 className="font-serif font-bold text-primary mb-3">Interpretation Key</h4>
                    <ul className="text-sm text-secondary space-y-2 list-disc pl-5 font-sans">
                        <li><strong className="text-primary">Formula</strong>: Used for Day Birth. (Night Birth reverses Sun/Moon).</li>
                        <li><strong className="text-primary">House</strong>: The area of life where material prosperity is most easily accessible.</li>
                        <li><strong className="text-primary">Sign</strong>: The manner in which you achieve success.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
