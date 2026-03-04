import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="max-w-lg w-full text-center space-y-6 py-20">
        <div className="text-7xl font-serif text-gold-primary">404</div>
        <h1 className="text-3xl font-serif font-bold text-ink">
          Page Not Found
        </h1>
        <p className="text-secondary text-sm max-w-md mx-auto">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/dashboard"
          className="inline-block px-6 py-3 bg-gold-primary text-ink font-medium rounded-xl hover:bg-gold-soft transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
