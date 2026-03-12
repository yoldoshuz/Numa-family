"use client";

import { useEffect, useRef } from "react";

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let renderer: any;
    let scene: any;
    let camera: any;
    let controls: any;

    const init = async () => {
      const THREE = await import("three");
      const { GLTFLoader } = await import(
        "three/examples/jsm/loaders/GLTFLoader.js"
      );
      const { OrbitControls } = await import(
        "three/examples/jsm/controls/OrbitControls.js"
      );

      const canvas = canvasRef.current!;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1000);
      camera.position.set(0, 0, 2);

      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true
      });

      renderer.setSize(width, height);
      renderer.setPixelRatio(window.devicePixelRatio);

      const ambient = new THREE.AmbientLight(0xffffff, 1.5);
      scene.add(ambient);

      const light = new THREE.DirectionalLight(0xffffff, 2);
      light.position.set(3, 3, 3);
      scene.add(light);

      controls = new OrbitControls(camera, renderer.domElement);

      controls.enableZoom = false;
      controls.enablePan = false;
      controls.enableDamping = true;
      controls.rotateSpeed = 0.8;

      const loader = new GLTFLoader();

      loader.load("/models/scene.gltf", (gltf) => {
        const model = gltf.scene;

        model.traverse((obj: any) => {
          if (obj.isMesh) obj.frustumCulled = false;
        });

        scene.add(model);

        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3()).length();
        const center = box.getCenter(new THREE.Vector3());

        model.position.x -= center.x;
        model.position.y -= center.y;
        model.position.z -= center.z;

        camera.near = size / 100;
        camera.far = size * 100;
        camera.updateProjectionMatrix();

        camera.position.set(0, 0, size * 0.8);
        controls.target.set(0, 0, 0);
        controls.update();
      });

      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };

      animate();

      window.addEventListener("resize", () => {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;

        camera.aspect = w / h;
        camera.updateProjectionMatrix();

        renderer.setSize(w, h);
      });
    };

    init();

    return () => {
      if (renderer) renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}