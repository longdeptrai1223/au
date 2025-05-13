import { useEffect, useState } from 'react';

const LoadingOverlay = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Simulate minimum loading time for better UX
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-[#121212] z-50 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 mb-4">
          <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-bounce">
            <rect width="96" height="96" rx="48" fill="#FF3B30"/>
            <circle cx="48" cy="48" r="36" stroke="#FFD700" strokeWidth="2"/>
            <path d="M36.893 61H32.145L44.041 35H49.008L60.904 61H56.156L46.664 39.748L36.893 61ZM38.236 50.352L55.092 50.352L55.092 54.438L38.236 54.438L38.236 50.352Z" fill="#FFD700"/>
          </svg>
        </div>
        <p className="text-xl font-semibold text-white">Đang tải AuMiner...</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
