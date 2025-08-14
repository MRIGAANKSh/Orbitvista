import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    title: "Advanced AI Vision",
    description:
      "Next-gen vision systems for precise object recognition and real-time decision-making.",
    direction: -100, // left
  },
  {
    title: "Seamless Human Interaction",
    description:
      "Understands and responds to human gestures, voice, and emotions naturally.",
    direction: 100, // right
  },
  {
    title: "High-Efficiency Power",
    description:
      "Eco-friendly energy systems for longer operational hours and maximum efficiency.",
    direction: -100, // left
  },
  {
    title: "Robotic Adaptability",
    description:
      "Adjusts instantly to dynamic environments with advanced AI adaptability.",
    direction: 100, // right
  },
];

export default function MidPart() {
  const cardsRef = useRef([]);

  useEffect(() => {
    cardsRef.current.forEach((card, index) => {
      gsap.fromTo(
        card,
        {
          opacity: 0,
          x: features[index].direction,
        },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
  }, []);

  return (
    <section className="w-full py-16 sm:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Vertical Gradient Line */}
        <div className="absolute left-1/2 sm:left-1/2 top-30 transform -translate-x-1/2 sm:-translate-x-1/2 h-full w-[2px] bg-gradient-to-b from-black via-gray-700 to-transparent" />

        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-wide text-gray-900">
            Orbit Vista{" "}
            <span className="bg-gradient-to-r from-gray-800 to-gray-500 bg-clip-text text-transparent">
              Robotic Features
            </span>
          </h2>
          <p className="mt-4 sm:mt-6 text-gray-600 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Pioneering the future of robotics with unmatched precision, design,
            and AI innovation.
          </p>
        </div>

        {/* Features */}
        <div className="flex flex-col gap-12 sm:gap-16 relative">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={(el) => (cardsRef.current[index] = el)}
              className={`relative w-full flex ${
                feature.direction < 0
                  ? "sm:justify-start sm:pr-10"
                  : "sm:justify-end sm:pl-10"
              }`}
            >
              <div className="w-full sm:w-1/2 border border-gray-400 rounded-2xl p-6 sm:p-8 bg-white shadow-lg hover:shadow-[0_0_25px_rgba(0,0,0,0.15)] hover:scale-105 transition-all duration-300">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Dot on Center Line */}
              <div className="absolute top-6 sm:top-8 left-1/2 transform -translate-x-1/2 w-4 sm:w-5 h-4 sm:h-5 bg-black rounded-full border-2 sm:border-4 border-white shadow-md" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
