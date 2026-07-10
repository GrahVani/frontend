"use client";

/**
 * DynamicInteractive — renders a single interactive component on demand.
 *
 * This file lives OUTSIDE the `interactive/` directory on purpose.
 * Using `import(`@/components/learning-runtime/interactive/${path}`)` from
 * here gives Turbopack a bounded glob context rooted in the interactive
 * folder.  Because the file itself is in `chrome/sections/`, the import
 * with the `@/` alias + `interactive/` prefix is fully explicit and
 * Turbopack can tree-shake it into per-component chunks without trying
 * to compile everything in this file's own directory.
 */

import {
  lazy,
  Suspense,
  useMemo,
  type ComponentType,
} from "react";

interface DynamicInteractiveProps {
  /** Module path relative to the interactive/ directory (no extension). */
  modulePath: string;
  /** Named export inside the module. `null` → default export. */
  exportName: string | null;
}

/**
 * Cache so that repeated renders (or React re-mounts) don't create a
 * new lazy wrapper each time.  Keyed by "path::exportName".
 */
const lazyCache = new Map<string, ComponentType<any>>();

function getLazy(modulePath: string, exportName: string | null): ComponentType<any> {
  const key = `${modulePath}::${exportName ?? "__default__"}`;
  let cached = lazyCache.get(key);
  if (cached) return cached;

  cached = lazy(async () => {
    // Use the full @/ alias path so the glob context is rooted in
    // `interactive/` — NOT in this file's own directory.
    const mod: Record<string, any> = await import(
      /* webpackMode: "lazy" */
      `@/components/learning-runtime/interactive/${modulePath}`
    );
    const component = exportName ? mod[exportName] : mod.default;
    return { default: component };
  });

  lazyCache.set(key, cached);
  return cached;
}

function LoadingFallback() {
  return (
    <div
      style={{
        minHeight: 320,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          border: "3px solid var(--gl-gold-hairline, #c8a96e33)",
          borderTopColor: "var(--gl-gold-accent, #c8a96e)",
          borderRadius: "50%",
          animation: "spin 800ms linear infinite",
        }}
      />
      <p
        style={{
          fontFamily: "var(--font-cormorant, serif)",
          fontStyle: "italic",
          fontSize: 16,
          color: "var(--gl-ink-muted, #999)",
          margin: 0,
        }}
      >
        Loading interactive…
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export function DynamicInteractive({ modulePath, exportName }: DynamicInteractiveProps) {
  const LazyComponent = useMemo(
    () => getLazy(modulePath, exportName),
    [modulePath, exportName],
  );

  return (
    <Suspense fallback={<LoadingFallback />}>
      <LazyComponent />
    </Suspense>
  );
}
