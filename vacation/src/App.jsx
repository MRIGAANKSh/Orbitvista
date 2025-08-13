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

    // Create char spans for header (SplitText-like)
    const header1 = header1Ref.current?.querySelector("h1");
    if (header1) {
      const text = header1.textContent.trim();
      header1.innerHTML = "";
      // split by characters but preserve spaces
      [...text].forEach((ch) => {
        const span = document.createElement("span");
        span.className = "char";
        const inner = document.createElement("span");
        inner.textContent = ch;
        span.appendChild(inner);
        header1.appendChild(span);
      });
    }

    // THREE.js setup
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
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;

    // Put the canvas inside the container (this canvas will visually be on top)
    containerRef.current.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(2, 4, 6);
    mainLight.castShadow = true;
    mainLight.shadow.bias = -0.0001;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
    fillLight.position.set(-2, -1, -2);
    scene.add(fillLight);

    // Model setup helper
    function setupModel() {
      const model = modelRef.current;
      const modelSize = modelSizeRef.current;
      if (!model || !modelSize) return;

      const isMobile = window.innerWidth < 1000;
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());

      // Position model and keep a slight front tilt (rotateX)
      model.position.set(
        isMobile ? -center.x : -center.x - modelSize.x * 0.4,
        -center.y * 0.005,
        -center.z
      );

      // Tilt forward slightly so it feels sculpted (in radians)
      model.rotation.x = isMobile ? -0.12 : -0.25; // tilt forward
      model.rotation.z = isMobile ? 0 : THREE.MathUtils.degToRad(-18);

      const cameraDistance = isMobile ? 2.4 : 1.6;
      camera.position.set(
        0,
        Math.max(modelSize.y * 0.1, 0.1),
        Math.max(modelSize.x, modelSize.y, modelSize.z) * cameraDistance
      );
      camera.lookAt(0, 0, 0);
    }

    // Load GLTF
    const loader = new GLTFLoader();
    loader.load(
      "/shaker.glb",
      (gltf) => {
        const model = gltf.scene;
        modelRef.current = model;

        model.traverse((node) => {
          if (node.isMesh && node.material) {
            node.material.metalness = 0.08;
            node.material.roughness = 0.85;
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });

        const box = new THREE.Box3().setFromObject(model);
        modelSizeRef.current = box.getSize(new THREE.Vector3());

        scene.add(model);
        setupModel();

        // small initial "swoosh" entrance for the model
        gsap.fromTo(
          model.rotation,
          { y: model.rotation.y - 0.6 },
          { y: model.rotation.y, duration: 1.2, ease: "power3.out" }
        );
      },
      undefined,
      (err) => {
        console.error("GLTF load error:", err);
      }
    );

    // Render loop
    let rafId;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Resize handling
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      setupModel();
    };
    window.addEventListener("resize", onResize);

    // Anim options
    const animOptions = { duration: 0.9, ease: "power3.out", stagger: 0.02 };

    // Header chars initial transform (hidden downward)
    const chars = header1Ref.current?.querySelectorAll(".char > span");
    if (chars?.length) {
      chars.forEach((el) => (el.style.transform = "translateY(110%)"));
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "75% bottom",
        onEnter: () => gsap.to(chars, { y: "0%", ...animOptions }),
        onLeaveBack: () => gsap.to(chars, { y: "100%", ...animOptions }),
      });
    }

    // ScrollTrigger master timeline (pin)
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: `+=${window.innerHeight * 10}`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: ({ progress }) => {
        // 1) header-1 slides left and goes behind model visually (we keep header z low in CSS)
        const headerProgress = Math.max(0, Math.min(1, (progress - 0.05) / 0.3));
        gsap.to(header1Ref.current, {
          xPercent:
            progress < 0.05 ? 0 : progress > 0.35 ? -100 : -100 * headerProgress,
          ease: "none",
          overwrite: true,
        });

        // 2) circular mask reveal (reveal the model area)
        const maskSize =
          progress < 0.2 ? 0 : progress > 0.3 ? 100 : 100 * ((progress - 0.2) / 0.1);
        gsap.to(".circular-mask", {
          clipPath: `circle(${maskSize}% at 50% 50%)`,
          ease: "none",
          overwrite: true,
        });

        // 3) header-2 sweeping in/out
        const h2Prog = (progress - 0.15) / 0.35;
        const h2Percent =
          progress < 0.15 ? 100 : progress > 0.5 ? -200 : 100 - 300 * h2Prog;
        gsap.to(header2Ref.current, { xPercent: h2Percent, overwrite: true });

        // 4) animate tooltip dividers expanding later
        const scaleX =
          progress < 0.45 ? 0 : progress > 0.65 ? 1 : ((progress - 0.45) / 0.2);
        gsap.to(".tooltip .divider", {
          scaleX,
          transformOrigin: "right center",
          ...animOptions,
          overwrite: true,
        });

        // 5) reveal tooltip content near the end (progress > 0.8)
        const reveal = progress > 0.8;
        const icons = [
          ".tooltip:nth-child(1) .icon ion-icon",
          ".tooltip:nth-child(1) .title",
          ".tooltip:nth-child(1) .description",
          ".tooltip:nth-child(2) .icon ion-icon",
          ".tooltip:nth-child(2) .title",
          ".tooltip:nth-child(2) .description",
        ];
        gsap.to(icons, {
          y: reveal ? "0%" : "125%",
          opacity: reveal ? 1 : 0,
          ...animOptions,
          overwrite: true,
        });

        // 6) model rotation while keeping tilt
        const model = modelRef.current;
        if (model && progress > 0.05) {
          // slower, continuous rotation mapped to a comfortable sweep
          const rotationProgress = Math.max(0, Math.min(1, (progress - 0.05) / 0.8)); // normalized broader range
          const targetRotation = Math.PI * 1.75 * rotationProgress; // less extreme than before
          const rotationDiff = targetRotation - currentRotationRef.current;
          if (Math.abs(rotationDiff) > 0.0005) {
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
      scene.clear(true);
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
              <ion-icon name="flash" />
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
              <ion-icon name="bluetooth" />
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

        {/* canvas container: sits visually on top so text can go behind */}
        <div ref={containerRef} className="model-container" />
      </section>

      <section className="outro">
        <h1>Don't Just Train - GRND</h1>
      </section>
    </div>
  );
}
