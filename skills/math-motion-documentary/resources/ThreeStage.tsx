"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export type ZomatoModelKey = "phone" | "menu" | "bag" | "crate" | "gong";

export interface ZomatoModelPose {
  model: ZomatoModelKey;
  pixelX: number;
  pixelY: number;
  diameterPx: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  darkTheme: boolean;
  opacity?: number;
  blurPx?: number;
  shadowStrength?: number;
}

interface ZomatoThreeStageProps {
  pose: ZomatoModelPose | null;
  onModelsReady?: () => void;
}

const ZOMATO_MODEL_PATHS: Record<ZomatoModelKey, string> = {
  phone: "/models/zomato_phone_delivery_notification.glb",
  menu: "/models/vintage_restaurant_paper_menu.glb",
  bag: "/models/zomato_delivery_bag_hotcase.glb",
  crate: "/models/blinkit_quick_commerce_crate.glb",
  gong: "/models/bse_nse_stock_exchange_gong.glb",
};

const CAM_Z = 7.5;
const CAM_FOV_DEG = 32.0;
const ASPECT = 1920 / 1080;
const HALF_H = CAM_Z * Math.tan((CAM_FOV_DEG * 0.5 * Math.PI) / 180.0);
const HALF_W = HALF_H * ASPECT;

export const ZomatoThreeStage: React.FC<ZomatoThreeStageProps> = ({
  pose,
  onModelsReady,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const onReadyRef = useRef(onModelsReady);
  useEffect(() => {
    onReadyRef.current = onModelsReady;
  });

  const poseRef = useRef(pose);
  useEffect(() => {
    poseRef.current = pose;
  });

  const engineRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    keyLight: THREE.DirectionalLight;
    fillLight: THREE.DirectionalLight;
    rimLightLeft: THREE.DirectionalLight;
    rimLightRight: THREE.DirectionalLight;
    pivots: Partial<Record<ZomatoModelKey, THREE.Group>>;
  } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(1920, 1080, false);
    renderer.setPixelRatio(1.0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;

    const scene = new THREE.Scene();

    // Studio Environment for PBR metallic specular reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;

    const camera = new THREE.PerspectiveCamera(CAM_FOV_DEG, ASPECT, 0.1, 100);
    camera.position.set(0, 0, CAM_Z);
    camera.lookAt(0, 0, 0);

    // 5600K Studio Key/Fill/Rim Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.4);
    keyLight.position.set(-5.5, 8.0, 7.5); // Top-left key light
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xf4f4f6, 1.6);
    fillLight.position.set(6.5, 2.0, 6.0);
    scene.add(fillLight);

    const rimLightLeft = new THREE.DirectionalLight(0xffffff, 2.5);
    rimLightLeft.position.set(-7.0, 3.5, -5.5);
    scene.add(rimLightLeft);

    const rimLightRight = new THREE.DirectionalLight(0xe4e4e7, 2.3);
    rimLightRight.position.set(7.0, -3.5, -5.5);
    scene.add(rimLightRight);

    const pivots: Partial<Record<ZomatoModelKey, THREE.Group>> = {};
    const loader = new GLTFLoader();
    let loaded = 0;
    const keys = Object.keys(ZOMATO_MODEL_PATHS) as ZomatoModelKey[];

    keys.forEach((key) => {
      loader.load(
        ZOMATO_MODEL_PATHS[key],
        (gltf) => {
          const rawModel = gltf.scene;

          // Preserve authentic brand colors (Crimson red bag, bright yellow crate, brass gong, phone screen)
          rawModel.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.frustumCulled = false;
              mesh.castShadow = true;
              mesh.receiveShadow = true;
              const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
              mats.forEach((m) => {
                const std = m as THREE.MeshStandardMaterial;
                if (std && "envMapIntensity" in std) {
                  std.envMapIntensity = 2.1;
                  // Increase vibrancy on red and yellow materials slightly for video pop
                  if (key === "bag" && std.color) {
                    std.color.r = Math.min(1.0, std.color.r * 1.15);
                  }
                  if (key === "crate" && std.color) {
                    std.color.r = Math.min(1.0, std.color.r * 1.1);
                    std.color.g = Math.min(1.0, std.color.g * 1.1);
                  }
                  std.needsUpdate = true;
                }
              });
            }
          });

          // Geometric Centroid & Unit-Sphere Normalization inside nested groups
          rawModel.updateMatrixWorld(true);
          const box = new THREE.Box3().setFromObject(rawModel);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z, 0.001);

          const centeringGroup = new THREE.Group();
          rawModel.position.set(-center.x, -center.y, -center.z);
          centeringGroup.add(rawModel);
          centeringGroup.scale.setScalar(1.0 / maxDim);

          const pivotGroup = new THREE.Group();
          pivotGroup.add(centeringGroup);
          pivotGroup.visible = false;
          scene.add(pivotGroup);

          pivots[key] = pivotGroup;
          loaded += 1;

          if (loaded === keys.length) {
            setIsReady(true);
            (window as unknown as { __zomatoModelsReady?: boolean }).__zomatoModelsReady = true;
            onReadyRef.current?.();
          }
        },
        undefined,
        (err) => {
          console.error(`Failed loading GLB ${key}:`, err);
          loaded += 1;
          if (loaded === keys.length) {
            setIsReady(true);
            (window as unknown as { __zomatoModelsReady?: boolean }).__zomatoModelsReady = true;
            onReadyRef.current?.();
          }
        }
      );
    });

    engineRef.current = {
      renderer,
      scene,
      camera,
      keyLight,
      fillLight,
      rimLightLeft,
      rimLightRight,
      pivots,
    };

    return () => {
      pmremGenerator.dispose();
      envTexture.dispose();
      renderer.dispose();
      engineRef.current = null;
    };
  }, []);

  // Deterministically render exact 3D frame whenever pose updates
  useEffect(() => {
    const eng = engineRef.current;
    if (!eng) return;

    const { renderer, scene, camera, pivots, keyLight, rimLightLeft, rimLightRight } = eng;

    (Object.keys(pivots) as ZomatoModelKey[]).forEach((k) => {
      const grp = pivots[k];
      if (grp) grp.visible = false;
    });

    if (!pose || (pose.opacity !== undefined && pose.opacity <= 0.005)) {
      renderer.clear();
      return;
    }

    const activePivot = pivots[pose.model];
    if (activePivot) {
      activePivot.visible = true;

      // Projective Frustum Mapping: (pixelX, pixelY) on 1920x1080 -> (worldX, worldY, 0)
      const worldX = (pose.pixelX / 960.0 - 1.0) * HALF_W;
      const worldY = (1.0 - pose.pixelY / 540.0) * HALF_H;
      const worldScale = (pose.diameterPx / 1080.0) * (2.0 * HALF_H);

      activePivot.position.set(worldX, worldY, 0);
      activePivot.scale.setScalar(worldScale);
      activePivot.rotation.set(pose.rotX, pose.rotY, pose.rotZ);

      (window as unknown as { __zomatoLastRender?: unknown }).__zomatoLastRender = {
        model: pose.model,
        hasPivot: !!activePivot,
        worldX,
        worldY,
        worldScale,
        visible: activePivot ? activePivot.visible : false,
        sceneChildren: scene.children.length,
        time: Date.now()
      };

      if (pose.darkTheme) {
        renderer.toneMappingExposure = 1.45;
        keyLight.intensity = 3.8;
        rimLightLeft.intensity = 4.2;
        rimLightRight.intensity = 3.9;
      } else {
        renderer.toneMappingExposure = 1.32;
        keyLight.intensity = 3.3;
        rimLightLeft.intensity = 2.4;
        rimLightRight.intensity = 2.2;
      }
    }

    renderer.render(scene, camera);
  }, [pose, isReady]);

  const opacity = pose?.opacity ?? 1;
  const blur = pose?.blurPx ?? 0;
  const shadow = pose?.shadowStrength ?? (pose?.darkTheme ? 0.6 : 0.28);
  const isDark = pose?.darkTheme ?? false;

  const filterParts: string[] = [];
  if (blur > 0.1) {
    filterParts.push(`blur(${blur.toFixed(2)}px)`);
  }
  if (!isDark && shadow > 0.01) {
    filterParts.push(
      `drop-shadow(22px 36px 26px rgba(10, 10, 14, ${shadow.toFixed(3)})) drop-shadow(6px 12px 10px rgba(10, 10, 14, ${(shadow * 0.55).toFixed(3)}))`
    );
  } else if (isDark && shadow > 0.01) {
    filterParts.push(`drop-shadow(0px 24px 38px rgba(0, 0, 0, 0.78))`);
  }

  return (
    <canvas
      ref={canvasRef}
      width={1920}
      height={1080}
      className="absolute inset-0 w-[1920px] height-[1080px] pointer-events-none"
      style={{
        width: "1920px",
        height: "1080px",
        opacity,
        filter: filterParts.length > 0 ? filterParts.join(" ") : "none",
      }}
    />
  );
};
