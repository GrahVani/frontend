export default function RootLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-warm-light" aria-busy="true">
      <div className="text-center space-y-4" role="status" aria-label="Loading content">
        <div className="w-10 h-10 border-3 border-amber-300 border-t-amber-700 rounded-full animate-spin mx-auto" />
        <p className="text-amber-800/70 text-[14px] font-medium">Loading...</p>
      </div>
    </div>
  );
}
