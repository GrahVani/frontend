"use client";

import React from 'react';
import { Plus, X, Pencil } from 'lucide-react';
import { cn } from "@/lib/utils";
import type { CustomizePage } from '@/hooks/useCustomizePages';

interface PageTabsProps {
    pages: CustomizePage[];
    activePageId: string | null;
    onSelectPage: (pageId: string) => void;
    onAddPage: () => void;
    onDeletePage: (pageId: string) => void;
    onRenamePage: (pageId: string, newName: string) => void;
    canCreateMore: boolean;
    canDelete: boolean;
}

export default function PageTabs({
    pages,
    activePageId,
    onSelectPage,
    onAddPage,
    onDeletePage,
    onRenamePage,
    canCreateMore,
    canDelete,
}: PageTabsProps) {
    const [editingId, setEditingId] = React.useState<string | null>(null);
    const [tempName, setTempName] = React.useState("");
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleStartEdit = (page: CustomizePage) => {
        setEditingId(page.id);
        setTempName(page.name);
    };

    const handleSave = () => {
        if (editingId && tempName.trim()) {
            onRenamePage(editingId, tempName.trim());
        }
        setEditingId(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSave();
        if (e.key === 'Escape') setEditingId(null);
    };

    React.useEffect(() => {
        if (editingId && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [editingId]);

    return (
        <div className="flex items-center gap-1">
            {/* Page Tabs */}
            <div className="flex items-center gap-1">
                {pages.map((page, index) => {
                    const isActive = page.id === activePageId;
                    const isEditing = page.id === editingId;

                    return (
                        <div
                            key={page.id}
                            className={cn(
                                "group relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all cursor-pointer select-none",
                                isActive
                                    ? "bg-primary text-white shadow-md"
                                    : "bg-white/50 text-ink/70 hover:bg-white hover:text-ink border border-transparent hover:border-gold-primary/20",
                                isEditing && "ring-2 ring-primary bg-white text-ink"
                            )}
                            onClick={() => !isEditing && onSelectPage(page.id)}
                            onDoubleClick={() => !isEditing && handleStartEdit(page)}
                        >
                            {/* Page Number/Icon */}
                            {!isEditing && (
                                <span className={cn(
                                    "w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold",
                                    isActive ? "bg-white/20" : "bg-gold-primary/10 text-gold-dark"
                                )}>
                                    {index + 1}
                                </span>
                            )}

                            {/* Page Name */}
                            {isEditing ? (
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={tempName}
                                    onChange={(e) => setTempName(e.target.value)}
                                    onBlur={handleSave}
                                    onKeyDown={handleKeyDown}
                                    className="bg-transparent border-none outline-none font-medium w-full max-w-[120px] text-ink p-0 placeholder:text-ink/30"
                                    autoFocus
                                />
                            ) : (
                                <span 
                                    className="max-w-[100px] truncate"
                                    title="Double click to rename"
                                >
                                    {page.name}
                                </span>
                            )}

                            {/* Action Buttons */}
                            {!isEditing && (
                                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all ml-1">
                                    {/* Edit Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleStartEdit(page);
                                        }}
                                        className={cn(
                                            "p-0.5 rounded transition-all",
                                            isActive 
                                                ? "hover:bg-white/20 text-white/70 hover:text-white" 
                                                : "hover:bg-gold-primary/10 text-ink/40 hover:text-primary"
                                        )}
                                        title="Rename page"
                                    >
                                        <Pencil className="w-2.5 h-2.5" />
                                    </button>

                                    {/* Delete Button */}
                                    {canDelete && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDeletePage(page.id);
                                            }}
                                            className={cn(
                                                "p-0.5 rounded transition-all",
                                                isActive 
                                                    ? "hover:bg-white/20 text-white/70 hover:text-white" 
                                                    : "hover:bg-gold-primary/10 text-ink/40 hover:text-red-600"
                                            )}
                                            title="Delete page"
                                        >
                                            <X className="w-2.5 h-2.5" />
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Active Indicator */}
                            {isActive && !isEditing && (
                                <div className="absolute -bottom-0.5 left-2 right-2 h-0.5 bg-white rounded-full" />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Add Page Button */}
            <button
                onClick={() => onAddPage()}
                disabled={!canCreateMore}
                className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-lg transition-all",
                    canCreateMore
                        ? "bg-gold-primary/10 text-gold-dark hover:bg-gold-primary hover:text-white"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                )}
                title={canCreateMore ? "Add new page" : `Maximum ${pages.length} pages reached`}
            >
                <Plus className="w-4 h-4" />
            </button>
        </div>
    );
}
