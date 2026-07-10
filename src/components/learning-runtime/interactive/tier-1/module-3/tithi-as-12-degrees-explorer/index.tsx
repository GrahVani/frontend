"use client";

import { TithiAngleVisualizer } from '@/components/learning-runtime/interactive/tithi-angle-visualizer';
import { TithiContextMatcher } from '@/components/learning-runtime/interactive/tithi-context-matcher';

export function TithiAs12DegreesExplorer() {
  return (
    <div className="space-y-10">
      <TithiAngleVisualizer />
      <TithiContextMatcher />
    </div>
  );
}
