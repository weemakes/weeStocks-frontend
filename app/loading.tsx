export default function Loading() {
  return <div className="container py-10 space-y-6" role="status" aria-label="Loading page"><div className="skeleton h-8 w-64"/><div className="skeleton h-4 w-80 max-w-full"/><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[0,1,2,3].map(i=><div key={i} className="skeleton h-28"/>)}</div><div className="skeleton h-80"/><span className="sr-only">Loading page</span></div>;
}
