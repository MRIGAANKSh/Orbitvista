import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Video() {
  const videoRef = useRef(null);
  const sectionRef = useRef(null);
  const [canPlayVideo, setCanPlayVideo] = useState(true);

  useEffect(() => {
    const video = videoRef.current;

    // Check if autoplay works (mobile browsers often block it)
    const testPlay = video.play();
    if (testPlay !== undefined) {
      testPlay.catch(() => {
        setCanPlayVideo(false);
      });
    }

    if (canPlayVideo) {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top center",
        end: "bottom center",
        onEnter: () => video.play(),
        onLeave: () => video.pause(),
        onEnterBack: () => video.play(),
        onLeaveBack: () => video.pause(),
      });

      // Cinematic scrub effect
      gsap.to(video, {
        currentTime: video.duration || 1,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }
  }, [canPlayVideo]);

  return (
    <section
      ref={sectionRef}
      className="relative w-screen min-h-screen h-[100dvh] overflow-hidden bg-black"
      style={{ margin: 0, padding: 0 }}
    >
      {canPlayVideo ? (
        <video
          ref={videoRef}
          src="/robot-ad.mp4"
          className="absolute top-0 left-0 w-full h-full object-cover"
          preload="auto"
          muted
          playsInline
        />
      ) : (
        <img
          src="/robot-ad-fallback.jpg" // fallback poster image
          alt="Robot Ad"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      )}
    </section>
  );
}
