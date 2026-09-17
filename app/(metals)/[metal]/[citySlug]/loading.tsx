export default function MetalCityLoading() {
  return (
    <div className="min-h-screen bg-canvas py-6 md:py-8 pb-20 animate-pulse">
      <div className="container mx-auto px-4">
        {/* Breadcrumb Skeleton */}
        <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded mb-4" />

        {/* Hero Banner Skeleton */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 mb-6">
          <div className="h-8 w-72 bg-slate-200 dark:bg-slate-800 rounded mb-3" />
          <div className="h-4 w-96 max-w-full bg-slate-200 dark:bg-slate-800 rounded mb-4" />
          <div className="flex gap-2">
            <div className="h-9 w-28 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-9 w-36 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          </div>
        </div>

        {/* Highlight Strip Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5">
              <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded mb-2" />
              <div className="h-6 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
            </div>
          ))}
        </div>

        {/* Tables Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="h-80 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-6" />
          <div className="h-80 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-6" />
        </div>
      </div>
    </div>
  );
}
