import React, { useEffect, useState } from "react";
import Spline from "@splinetool/react-spline";

export default function HeroSection() {
  const [isWebGL2Available, setIsWebGL2Available] = useState(true);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2");
    if (!gl) {
      setIsWebGL2Available(false);
    }
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black flex flex-col">
      {/* Overlay Text */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 pointer-events-none">
        <h1 className="text-white text-3xl sm:text-5xl md:text-6xl lg:text-8xl font-light tracking-wide drop-shadow-lg leading-snug sm:leading-tight">
          AI ROBOT <span className="font-extrabold">For FUTURE</span>
        </h1>
        <p className="mt-3 sm:mt-4 text-gray-300 text-sm sm:text-base md:text-lg lg:text-xl max-w-md sm:max-w-2xl">
          Shaping tomorrow with cutting-edge artificial intelligence and robotics.
        </p>
      </div>

      {/* 3D Model */}
      <div className="flex-1 w-full h-full">
        {isWebGL2Available ? (
          <Spline scene="https://prod.spline.design/8ZOs6lAjjfOTlvx1/scene.splinecode" />
        ) : (
          <div className="w-full h-full bg-red-600 flex items-center justify-center">
            <p className="text-white text-lg sm:text-xl font-bold px-4 text-center">
              3D scene not supported on this device.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
