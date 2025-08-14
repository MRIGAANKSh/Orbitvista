import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    title: "Advanced AI Vision",
    description:
      "Next-gen vision systems for precise object recognition and real-time decision-making.",
    direction: -100,
  },
  {
    title: "Seamless Human Interaction",
    description:
      "Understands and responds to human gestures, voice, and emotions naturally.",
    direction: 100,
  },
  {
    title: "High-Efficiency Power",
    description:
      "Eco-friendly energy systems for longer operational hours and maximum efficiency.",
    direction: -100,
  },
  {
    title: "Robotic Adaptability",
    description:
      "Adjusts instantly to dynamic environments with advanced AI adaptability.",
    direction: 100,
  },
];

export default function MidPart() {
  const cardsRef = useRef([]);

  useEffect(() => {
    cardsRef.current.forEach((card, index) => {
      gsap.fromTo(
        card,
        { opacity: 0, x: features[index].direction },
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
    <section className="w-full py-12 sm:py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Center Line */}
        <div className="absolute left-1/2 top-0 transform -translate-x-1/2 h-full w-[2px] bg-gradient-to-b from-black via-gray-700 to-transparent hidden sm:block" />

        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-wide text-gray-900">
            Orbit Vista{" "}
            <span className="bg-gradient-to-r from-gray-800 to-gray-500 bg-clip-text text-transparent">
              Robotic Features
            </span>
          </h2>
          <p className="mt-4 text-gray-600 text-sm sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Pioneering the future of robotics with unmatched precision, design,
            and AI innovation.
          </p>
        </div>

        {/* Features */}
        <div className="flex flex-col gap-10 sm:gap-16 relative">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={(el) => (cardsRef.current[index] = el)}
              className={`relative flex flex-col sm:flex-row ${
                feature.direction < 0
                  ? "sm:justify-start sm:pr-10"
                  : "sm:justify-end sm:pl-10"
              }`}
            >
              <div className="w-full sm:w-1/2 border border-gray-300 rounded-2xl p-5 sm:p-8 bg-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                <h3 className="text-lg sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-2 sm:mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Dot (hidden on mobile) */}
              <div className="hidden sm:block absolute top-6 sm:top-8 left-1/2 transform -translate-x-1/2 w-4 sm:w-5 h-4 sm:h-5 bg-black rounded-full border-2 sm:border-4 border-white shadow-md" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
