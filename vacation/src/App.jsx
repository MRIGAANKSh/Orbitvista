import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

gsap.registerPlugin(ScrollTrigger);

export default function ProductShowcase() {
  const containerRef = useRef(null);
  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);

  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const modelRef = useRef(null);
  const modelSizeRef = useRef(null);
  const currentRotationRef = useRef(0);

  useEffect(() => {
    // Smooth scroll
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Three.js setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;
    containerRef.current.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(2, 2, 5);
    scene.add(dirLight);

    // Setup Model Position
    function setupModel() {
      const model = modelRef.current;
      if (!model) return;
      const isMobile = window.innerWidth < 768;
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      model.position.set(-center.x, -center.y, -center.z);
      model.rotation.set(
        THREE.MathUtils.degToRad(-10),
        THREE.MathUtils.degToRad(25),
        0
      );
      const distance = Math.max(size.x, size.y, size.z) * (isMobile ? 2.2 : 1.6);
      camera.position.set(0, 0, distance);
      camera.lookAt(0, 0, 0);
      modelSizeRef.current = size;
    }

    // Load Model
    const loader = new GLTFLoader();
    loader.load("/shaker.glb", (gltf) => {
      const model = gltf.scene;
      modelRef.current = model;
      model.traverse((node) => {
        if (node.isMesh) {
          node.material.metalness = 0.05;
          node.material.roughness = 0.85;
        }
      });
      scene.add(model);
      setupModel();
    });

    // Animate loop
    let rafId;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Responsive resize
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      setupModel();
    };
    window.addEventListener("resize", onResize);

    /** Scroll Animations **/
    ScrollTrigger.create({
      trigger: section1Ref.current,
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: ({ progress }) => {
        if (modelRef.current) {
          const targetRotation = progress * Math.PI * 1.2; // slow rotation
          const diff = targetRotation - currentRotationRef.current;
          modelRef.current.rotateOnAxis(new THREE.Vector3(0, 1, 0), diff);
          currentRotationRef.current = targetRotation;
        }
      },
    });

    // Fade in model & text behind
    gsap.fromTo(
      ".intro-title",
      { opacity: 0, y: 80 },
      {
        opacity: 1,
        y: 0,
        scrollTrigger: {
          trigger: section1Ref.current,
          start: "20% center",
          end: "60% center",
          scrub: true,
        },
      }
    );
    gsap.fromTo(
      containerRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        scrollTrigger: {
          trigger: section1Ref.current,
          start: "top center",
          end: "center center",
          scrub: true,
        },
      }
    );

    // Section 2 circle mask & background text
    gsap.fromTo(
      ".circular-mask",
      { clipPath: "circle(0% at 50% 50%)" },
      {
        clipPath: "circle(100% at 50% 50%)",
        scrollTrigger: {
          trigger: section2Ref.current,
          start: "top center",
          end: "bottom center",
          scrub: true,
        },
      }
    );

    // Section 3 features appear only at end
    gsap.fromTo(
      ".features",
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        scrollTrigger: {
          trigger: section3Ref.current,
          start: "top center",
          toggleActions: "play none none reverse",
        },
      }
    );

    return () => {
      cancelAnimationFrame(rafId);
      renderer.dispose();
      scene.clear();
      lenis.destroy();
      window.removeEventListener("resize", onResize);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-black text-white overflow-x-hidden">
      {/* Section 1 */}
      <section
        ref={section1Ref}
        className="w-full h-screen flex flex-col items-center justify-center relative"
      >
        <h1 className="intro-title text-5xl md:text-7xl font-extrabold tracking-tight text-center font-serif">
          GRND doesn’t shake. It performs.
        </h1>
        <div
          ref={containerRef}
          className="absolute inset-0 pointer-events-none"
        />
      </section>

      {/* Section 2 */}
      <section
        ref={section2Ref}
        className="w-full h-screen flex items-center justify-center relative"
      >
        <div className="circular-mask absolute inset-0 bg-black flex items-center justify-center z-10">
          <h1 className="text-6xl md:text-8xl font-extrabold uppercase opacity-20">
            GRND Shaker
          </h1>
        </div>
      </section>

      {/* Section 3 */}
      <section
        ref={section3Ref}
        className="w-full min-h-screen flex flex-col items-center justify-center px-4 text-center"
      >
        <div className="features max-w-2xl space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">Built to Last</h2>
            <p className="text-gray-300">
              Designed to match your pace, GRND runs all week on a single charge.
            </p>
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">Stay Synced</h2>
            <p className="text-gray-300">
              With app integration, monitor intake, set goals, and make every sip count.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
