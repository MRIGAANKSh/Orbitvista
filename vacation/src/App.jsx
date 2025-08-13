import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const containerRef = useRef(null);
  const sectionRef = useRef(null);
  const header1Ref = useRef(null);
  const header2Ref = useRef(null);
  const tooltipsRef = useRef(null);

  // Three.js refs
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

    // Build character spans (replacement for SplitText chars)
    const header1 = header1Ref.current?.querySelector("h1");
    if (header1) {
      const text = header1.textContent;
      header1.innerHTML = ""; // clear
      [...text].forEach((ch) => {
        const span = document.createElement("span");
        span.className = "char";
        const inner = document.createElement("span");
        inner.textContent = ch;
        span.appendChild(inner);
        header1.appendChild(span);
      });
    }

    // Three.js init
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
    renderer.shadowMap.enabled = true;
    // modern property:
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;

    containerRef.current.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.0);
    mainLight.position.set(1, 2, 3);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
    fillLight.position.set(-2, 0, -2);
    scene.add(fillLight);

    function setupModel() {
      const model = modelRef.current;
      const modelSize = modelSizeRef.current;
      if (!model || !modelSize) return;

      const isMobile = window.innerWidth < 1000;
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());

      model.position.set(
        isMobile ? -center.x : -center.x - modelSize.x * 0.4,
        -center.y * 0.005,
        -center.z
      );
      model.rotation.z = isMobile ? 0 : THREE.MathUtils.degToRad(-25);

      const cameraDistance = isMobile ? 2 : 1.5;
      camera.position.set(
        0,
        0,
        Math.max(modelSize.x, modelSize.y, modelSize.z) * cameraDistance
      );
      camera.lookAt(0, 0, 0);
    }

    // Load model from public/shaker.glb
    const loader = new GLTFLoader();
    loader.load("/shaker.glb", (gltf) => {
      const model = gltf.scene;
      modelRef.current = model;
      model.traverse((node) => {
        if (node.isMesh && node.material) {
          node.material.metalness = 0.05;
          node.material.roughness = 0.9;
        }
      });

      const box = new THREE.Box3().setFromObject(model);
      modelSizeRef.current = box.getSize(new THREE.Vector3());

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

    // Resize
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      setupModel();
    };
    window.addEventListener("resize", onResize);

    // GSAP ScrollTrigger scene
    const productSection = sectionRef.current;
    const animOptions = { duration: 1, ease: "power3.out", stagger: 0.025 };

    // Intro text characters slide-up on enter
    const chars = header1Ref.current?.querySelectorAll(".char > span");
    if (chars?.length) {
      chars.forEach((el) => (el.style.transform = "translateY(100%)"));
      ScrollTrigger.create({
        trigger: productSection,
        start: "75% bottom",
        onEnter: () => {
          gsap.to(chars, { y: "0%", ...animOptions });
        },
        onLeaveBack: () => {
          gsap.to(chars, { y: "100%", ...animOptions });
        },
      });
    }

    // Pin + master progress timeline
    const st = ScrollTrigger.create({
      trigger: productSection,
      start: "top top",
      end: `+=${window.innerHeight * 10}`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: ({ progress }) => {
        // header-1 slide left (0.05 -> 0.35)
        const headerProgress = Math.max(0, Math.min(1, (progress - 0.05) / 0.3));
        gsap.to(header1Ref.current, {
          xPercent:
            progress < 0.05 ? 0 : progress > 0.35 ? -100 : -100 * headerProgress,
          overwrite: true,
        });

        // circular mask reveal (0.2 -> 0.3)
        const maskSize =
          progress < 0.2 ? 0 : progress > 0.3 ? 100 : 100 * ((progress - 0.2) / 0.1);
        gsap.to(".circular-mask", {
          clipPath: `circle(${maskSize}% at 50% 50%)`,
          overwrite: true,
        });

        // header-2 sweeping (0.15 -> 0.5)
        const h2Prog = (progress - 0.15) / 0.35;
        const h2Percent =
          progress < 0.15 ? 100 : progress > 0.5 ? -200 : 100 - 300 * h2Prog;
        gsap.to(header2Ref.current, { xPercent: h2Percent, overwrite: true });

        // tooltip divider expand (0.45 -> 0.65)
        const scaleX =
          progress < 0.45 ? 0 : progress > 0.65 ? 100 : 100 * ((progress - 0.45) / 0.2);
        gsap.to(".tooltip .divider", {
          scaleX: scaleX / 100,
          transformOrigin: "right center",
          ...animOptions,
          overwrite: true,
        });

        // tooltip items reveal
        const tooltipTriggers = [
          {
            trigger: 0.5,
            elements: [
              ".tooltip:nth-child(1) .icon ion-icon",
              ".tooltip:nth-child(1) .title",
              ".tooltip:nth-child(1) .description",
            ],
          },
          {
            trigger: 0.6,
            elements: [
              ".tooltip:nth-child(2) .icon ion-icon",
              ".tooltip:nth-child(2) .title",
              ".tooltip:nth-child(2) .description",
            ],
          },
        ];

        tooltipTriggers.forEach(({ trigger, elements }) => {
          gsap.to(elements, {
            y: progress > trigger ? "0%" : "125%",
            ...animOptions,
            overwrite: true,
          });
        });

        // model rotation (after 0.05)
        const model = modelRef.current;
        if (model && progress > 0.05) {
          const rotationProgress = (progress - 0.05) / 0.05;
          const targetRotation = Math.PI * 3 * 4 * rotationProgress;
          const rotationDiff = targetRotation - currentRotationRef.current;
          if (Math.abs(rotationDiff) > 0.001) {
            model.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotationDiff);
            currentRotationRef.current = targetRotation;
          }
        }
      },
    });

    return () => {
      st?.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafId);
      renderer.dispose();
      scene.clear();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
      lenis.destroy();
    };
  }, []);

  return (
    <div>
      <section className="intro">
        <h1>GRND doesn't shake. It performs</h1>
      </section>

      <section className="product-overview" ref={sectionRef}>
        <div className="header-1" ref={header1Ref}>
          <h1>Every Rep Starts With</h1>
        </div>

        <div className="header-2" ref={header2Ref}>
          <h1>GRND Shaker</h1>
        </div>

        <div className="circular-mask" />

        <div className="tooltips" ref={tooltipsRef}>
          <div className="tooltip">
            <div className="icon">
              <ion-icon name="flash"></ion-icon>
            </div>
            <div className="divider" />
            <div className="title">
              <h1>Built to last</h1>
              <div className="description">
                <p>
                  Designed to match your pace, GRND runs all week on a single charge. No
                  interruptions, no slowing down.
                </p>
              </div>
            </div>
          </div>

          <div className="tooltip">
            <div className="icon">
              <ion-icon name="bluetooth"></ion-icon>
            </div>
            <div className="divider" />
            <div className="title">
              <h1>Stay Synced</h1>
              <div className="description">
                <p>
                  With app integration GRND helps you stay consistent. Monitor intake, set
                  goals, and make every sip count.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div ref={containerRef} className="model-container" />
      </section>

      <section className="outro">
        <h1>Don't Just Train - GRND</h1>
      </section>
    </div>
  );
}
