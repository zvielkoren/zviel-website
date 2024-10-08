  'use client';

  import Link from 'next/link';

  export default function NotFound() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#17212b]-100">
        <h1 className="text-6xl font-bold text-gray-500 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-600 mb-8">Page Not Found</h2>
        <p className="text-gray-500 mb-8">The page you are looking for doesn't exist or has been moved.</p>
              <Link href="/" className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                Go back to Home
              </Link> 
      </div>
    );
  }
