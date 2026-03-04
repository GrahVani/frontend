"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import { TYPOGRAPHY } from '@/design-tokens/typography';

interface TemporalRelationEntry {
    planet: string;
    relations?: Record<string, string>;
    friends?: string[];
    Friends?: string[];
    enemies?: string[];
    Enemies?: string[];
}

interface TemporalRelationshipData {
    tatkalik_maitri_chakra?: TemporalRelationEntry[];
    [key: string]: unknown;
}

interface TemporalRelationshipTableProps {
    data: TemporalRelationshipData | TemporalRelationEntry[];
    className?: string;
}

const PLANETS = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

export default function TemporalRelationshipTable({ data, className }: TemporalRelationshipTableProps) {
    if (!data) return null;

    // Handle both cases: data is the array, or data is an object containing the array
    const entries: TemporalRelationEntry[] = Array.isArray(data) ? data : ((data as TemporalRelationshipData).tatkalik_maitri_chakra || []);

    return (
        <div className={cn("w-full bg-surface-warm border border-border-warm rounded-xl overflow-hidden shadow-sm", className)}>
            <div className="bg-border-warm px-4 py-2 border-b border-border-warm">
                <h3 className={cn(TYPOGRAPHY.sectionTitle, "text-center")}>
                    Tatkalik Maitri Chakra <span className="text-sm font-normal text-secondary">(Temporal Relationship)</span>
                </h3>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-parchment/30">
                            <th className="border border-border-warm/50 p-2 bg-parchment/50"></th>
                            {PLANETS.map(planet => (
                                <th key={planet} className={cn(TYPOGRAPHY.tableHeader, "border border-border-warm/50 p-2 text-center")}>
                                    {planet}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {/* Friends Row */}
                        <tr>
                            <td className={cn(TYPOGRAPHY.label, "border border-border-warm/50 p-3 bg-parchment/50 mb-0")}>
                                Friends
                            </td>
                            {PLANETS.map(planetName => {
                                // Find entry for this planet
                                const entry = entries.find((e: TemporalRelationEntry) => e.planet === planetName);
                                let friends: string[] = [];

                                if (entry?.relations) {
                                    // Map from "relations" object format: { "Sun": "Self", "Ketu": "Friend", ... }
                                    friends = Object.entries(entry.relations)
                                        .filter(([p, rel]) => rel === "Friend" && p !== planetName)
                                        .map(([p]) => p);
                                } else if (entry) {
                                    // Fallback for old format
                                    friends = entry.friends || entry.Friends || [];
                                }

                                return (
                                    <td key={planetName} className={cn(TYPOGRAPHY.value, "border border-border-warm/50 p-2 text-center align-top min-w-[80px] font-normal")}>
                                        <div className="flex flex-col gap-1">
                                            {friends.map((friend: string) => (
                                                <span key={friend}>{friend}</span>
                                            ))}
                                            {friends.length === 0 && <span className="text-secondary/50">â€”</span>}
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                        {/* Enemies Row */}
                        <tr className="bg-antique/5">
                            <td className={cn(TYPOGRAPHY.label, "border border-border-warm/50 p-3 bg-parchment/50 mb-0")}>
                                Enemies
                            </td>
                            {PLANETS.map(planetName => {
                                // Find entry for this planet
                                const entry = entries.find((e: TemporalRelationEntry) => e.planet === planetName);
                                let enemies: string[] = [];

                                if (entry?.relations) {
                                    enemies = Object.entries(entry.relations)
                                        .filter(([p, rel]) => rel === "Enemy" && p !== planetName)
                                        .map(([p]) => p);
                                } else if (entry) {
                                    enemies = entry.enemies || entry.Enemies || [];
                                }

                                return (
                                    <td key={planetName} className={cn(TYPOGRAPHY.value, "border border-border-warm/50 p-2 text-center align-top min-w-[80px] font-normal")}>
                                        <div className="flex flex-col gap-1">
                                            {enemies.map((enemy: string) => (
                                                <span key={enemy}>{enemy}</span>
                                            ))}
                                            {enemies.length === 0 && <span className="text-secondary/50">â€”</span>}
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

