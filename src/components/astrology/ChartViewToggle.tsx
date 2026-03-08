"use client";

import { useState } from "react";
import { Table2, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChartViewToggleProps {
    chartView: React.ReactNode;
    tableView: React.ReactNode;
    className?: string;
}

export default function ChartViewToggle({ chartView, tableView, className }: ChartViewToggleProps) {
    const [showTable, setShowTable] = useState(false);

    return (
        <div className={cn("relative", className)}>
            <button
                onClick={() => setShowTable(!showTable)}
                className="absolute top-2 right-2 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded border border-gold-primary/20 text-ink/45 hover:text-gold-dark hover:border-gold-primary/50 transition-colors"
                aria-label={showTable ? "Switch to chart view" : "Switch to table view"}
                title={showTable ? "View as chart" : "View as table"}
            >
                {showTable ? (
                    <><LayoutGrid className="w-3 h-3" /> Chart</>
                ) : (
                    <><Table2 className="w-3 h-3" /> Table</>
                )}
            </button>
            {showTable ? tableView : chartView}
        </div>
    );
}
