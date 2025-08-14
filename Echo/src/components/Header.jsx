import React, { useRef } from "react";

export default function Header() {
  const brandRef = useRef(null);
  const btnRef = useRef(null);

  return (
    <header className="absolute top-0 w-full z-50 p-4">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4 sm:gap-0 h-auto sm:h-20">
        
        {/* Brand Name */}
        <button
          ref={brandRef}
          className="text-gray-900 text-xl sm:text-2xl md:text-3xl tracking-widest border border-gray-400 px-4 sm:px-5 py-2 rounded-full transition-all duration-300 hover:border-gray-900 hover:shadow-[0_0_10px_rgba(0,0,0,0.15)] hover:scale-105"
        >
          Orbit Vista
        </button>

        {/* Product Button */}
        <button
          ref={btnRef}
          className="text-gray-900 text-base sm:text-lg tracking-wide border border-gray-400 px-4 sm:px-5 py-2 rounded-full transition-all duration-300 hover:border-gray-900 hover:bg-gray-100 hover:scale-105"
        >
          Our Product
        </button>
      </div>
    </header>
  );
}
