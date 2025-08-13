import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "@studio-freight/lenis";
import "./App.css";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default function App() {
  const containerRef = useRef();
  const modelRef = useRef(null);
  const modelSizeRef = useRef(null);
  const currentRotationRef = useRef(0);

  useEffect(() => {
    // Lenis smooth scrolling
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // THREE.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.outputEncoding = THREE.LinearEncoding;
    containerRef.current.appendChild(renderer.domElement);

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
        isMobile
          ? center.x * -1
          : -center.x - modelSize.x * 0.4,
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

    new GLTFLoader().load("/shaker.glb", (gltf) => {
      modelRef.current = gltf.scene;

      modelRef.current.traverse((node) => {
        if (node.isMesh && node.material) {
          Object.assign(node.material, {
            metalness: 0.05,
            roughness: 0.9,
          });
        }
      });

      const box = new THREE.Box3().setFromObject(modelRef.current);
      modelSizeRef.current = box.getSize(new THREE.Vector3());

      scene.add(modelRef.current);
      setupModel();
    });

    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      setupModel();
    });

    // GSAP animations (simplified version — you can expand like your original)
    ScrollTrigger.create({
      trigger: ".product-overview",
      start: "top top",
      end: `+=${window.innerHeight * 10}`,
      pin: true,
      scrub: 1,
      onUpdate: ({ progress }) => {
        if (modelRef.current && progress > 0.05) {
          const rotationProgress = (progress - 0.05) / 0.05;
          const targetRotation = Math.PI * 3 * 4 * rotationProgress;
          const rotationDiff =
            targetRotation - currentRotationRef.current;

          if (Math.abs(rotationDiff) > 0.001) {
            modelRef.current.rotateOnAxis(
              new THREE.Vector3(0, 1, 0),
              rotationDiff
            );
            currentRotationRef.current = targetRotation;
          }
        }
      },
    });

    return () => {
      window.removeEventListener("resize", setupModel);
    };
  }, []);

  return (
    <div>
      <section className="intro">
        <h1>GRND doesn't shake. It performs</h1>
      </section>

      <section className="product-overview">
        <div className="header-1">
          <h1>Every Rep Starts With</h1>
        </div>
        <div className="header-2">
          <h1>GRND Shaker</h1>
        </div>

        <div className="circular-mask"></div>

        <div className="tooltips">
          <div className="tooltip">
            <div className="icon">⚡</div>
            <div className="divider"></div>
            <div className="title">
              <h1>Built to last</h1>
              <div className="description">
                <p>
                  Designed to match your pace, GRND runs all week on a single
                  charge. No interruptions, no slowing down.
                </p>
              </div>
            </div>
          </div>

          <div className="tooltip">
            <div className="icon">📶</div>
            <div className="divider"></div>
            <div className="title">
              <h1>Stay Synced</h1>
              <div className="description">
                <p>
                  With app integration GRND helps you stay consistent. Monitor
                  intake, set goals, and make every sip count.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div ref={containerRef} className="model-container"></div>
      </section>

      <section className="outro">
        <h1>Don't Just Train - GRND</h1>
      </section>
    </div>
  );
}
