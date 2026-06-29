"use client";

import { TithiAngleVisualizer } from "../tithi-angle-visualizer";
import { TithiContextMatcher } from "../tithi-context-matcher";

export function TithiAs12DegreesExplorer() {
  return (
    <div className="space-y-10">
      <TithiAngleVisualizer />
      <TithiContextMatcher />
    </div>
  );
}
