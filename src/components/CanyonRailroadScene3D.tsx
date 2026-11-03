'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { FrameTelemetry } from '@/lib/timeline-data';
import { RicksCharacter25D } from './RicksCharacter25D';

interface CanyonRailroadScene3DProps {
  telemetry: FrameTelemetry;
  showWireframe?: boolean;
}

/**
 * Deterministic Camera Controller synced to the exact frame telemetry
 */
const FrameCameraController: React.FC<{ telemetry: FrameTelemetry }> = ({ telemetry }) => {
  const { camera } = useThree();
  const targetVec = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const { position, target, fov, roll } = telemetry.camera;
    camera.position.set(position[0], position[1], position[2]);
    targetVec.set(target[0], target[1], target[2]);
    camera.lookAt(targetVec);
    camera.rotation.z += roll;
    if ('fov' in camera && (camera as THREE.PerspectiveCamera).fov !== fov) {
      (camera as THREE.PerspectiveCamera).fov = fov;
      camera.updateProjectionMatrix();
    }
  });

  return null;
};

/**
 * 3D Steam Locomotive with glowing headlamp, red cowcatcher, #7 plate, and smoke plume
 */
const SteamLocomotive3D: React.FC<{ zPos: number; frame: number }> = ({ zPos, frame }) => {
  const smokePuffs = useMemo(() => [0, 1, 2, 3, 4, 5], []);

  return (
    <group position={[0, 0.14, zPos]}>
      {/* Red Cowcatcher / Pilot at front (+Z) */}
      <mesh position={[0, 0.22, 1.85]} rotation={[0.35, 0, 0]}>
        <coneGeometry args={[0.72, 0.65, 4]} />
        <meshToonMaterial color="#dc2626" />
      </mesh>
      {/* Front Red Bumper Beam */}
      <mesh position={[0, 0.28, 1.55]}>
        <boxGeometry args={[1.38, 0.22, 0.35]} />
        <meshToonMaterial color="#b91c1c" />
      </mesh>

      {/* Cylindrical Black Boiler */}
      <mesh position={[0, 0.88, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.58, 0.58, 2.7, 20]} />
        <meshToonMaterial color="#18181b" />
      </mesh>

      {/* Gold Number "7" Medallion on Front Smokebox */}
      <mesh position={[0, 0.85, 1.46]}>
        <circleGeometry args={[0.16, 18]} />
        <meshBasicMaterial color="#facc15" />
      </mesh>

      {/* Glowing Brass Headlamp */}
      <group position={[0, 1.32, 1.42]}>
        <mesh>
          <boxGeometry args={[0.28, 0.28, 0.26]} />
          <meshStandardMaterial color="#ca8a04" metalness={0.7} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.14]}>
          <circleGeometry args={[0.13, 16]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>
        <pointLight position={[0, 0, 0.4]} intensity={3.5} distance={9} color="#fde047" />
      </group>

      {/* Smokestack */}
      <mesh position={[0, 1.65, 1.05]}>
        <cylinderGeometry args={[0.24, 0.15, 0.65, 14]} />
        <meshToonMaterial color="#27272a" />
      </mesh>

      {/* Engineer Cab */}
      <mesh position={[0, 1.15, -1.35]}>
        <boxGeometry args={[1.36, 1.35, 1.15]} />
        <meshToonMaterial color="#1f2937" />
      </mesh>
      {/* Cab Roof */}
      <mesh position={[0, 1.86, -1.35]}>
        <boxGeometry args={[1.48, 0.1, 1.3]} />
        <meshToonMaterial color="#991b1b" />
      </mesh>

      {/* Volumetric-style Dark Smoke Puffs rising from stack */}
      {smokePuffs.map((idx) => {
        const cycle = ((frame * 0.06 + idx * 0.45) % 2.4);
        const yOff = 2.0 + cycle * 1.45;
        const zOff = 1.05 - cycle * 0.55;
        const radius = 0.28 + cycle * 0.28;
        return (
          <mesh key={idx} position={[Math.sin(idx * 2 + frame * 0.05) * 0.12, yOff, zOff]}>
            <sphereGeometry args={[radius, 10, 10]} />
            <meshBasicMaterial
              color="#18181b"
              transparent
              opacity={Math.max(0.15, 0.85 - cycle * 0.32)}
            />
          </mesh>
        );
      })}
    </group>
  );
};

/**
 * Union Station Banner Texture ("FIRST LINE IN GETS IT ALL!") for Beat 5
 */
function useStationBannerTexture() {
  return useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(0, 0, 1024, 256);
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 18;
      ctx.strokeRect(12, 12, 1000, 232);

      ctx.fillStyle = '#1e3a8a';
      ctx.font = '900 72px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('FIRST LINE IN', 512, 108);

      ctx.fillStyle = '#b91c1c';
      ctx.font = '900 84px sans-serif';
      ctx.fillText('GETS IT ALL!', 512, 206);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }, []);
}

export const CanyonRailroadScene3D: React.FC<CanyonRailroadScene3DProps> = ({
  telemetry,
  showWireframe = false,
}) => {
  const { frame, beat, character, trainZ, sparkIntensity } = telemetry;
  const bannerTexture = useStationBannerTexture();

  // Precompute railroad sleepers/ties from Z = -24 to Z = +12
  const sleepers = useMemo(() => {
    const arr: number[] = [];
    for (let z = -22; z <= 10; z += 0.55) {
      arr.push(Number(z.toFixed(2)));
    }
    return arr;
  }, []);

  // Precompute gravel pebbles near the camera in Beat 1 for close-up detail
  const pebbles = useMemo(() => {
    const list: { pos: [number, number, number]; scale: number; color: string }[] = [];
    const colors = ['#9a7b6c', '#b88b72', '#6b5b53', '#cbd5e1', '#7c5846'];
    for (let i = 0; i < 140; i++) {
      const seed = Math.sin(i * 97.13) * 10000;
      const rx = ((seed - Math.floor(seed)) - 0.5) * 2.1;
      const s2 = Math.cos(i * 43.7) * 10000;
      const rz = -1.5 + (s2 - Math.floor(s2)) * 5.8;
      list.push({
        pos: [rx, 0.04, rz],
        scale: 0.035 + (i % 4) * 0.014,
        color: colors[i % colors.length],
      });
    }
    return list;
  }, []);

  // Determine sky/fog background by active beat
  const skyColor =
    beat.id === 1
      ? '#7c2d12'
      : beat.id === 2
      ? '#38bdf8'
      : beat.id === 3 || beat.id === 4
      ? '#1d4ed8'
      : '#60a5fa';

  return (
    <>
      <color attach="background" args={[skyColor]} />
      <fog attach="fog" args={[skyColor, 14, 48]} />

      <FrameCameraController telemetry={telemetry} />

      {/* Stylized Cel/Toon Lighting Rig */}
      <ambientLight intensity={0.85} color="#fff7ed" />
      <directionalLight
        position={[8, 16, 10]}
        intensity={1.75}
        color="#ffedd5"
      />
      <directionalLight
        position={[-6, 8, -8]}
        intensity={0.55}
        color="#38bdf8"
      />

      {/* =====================================================================
          ZONE A: CANYON TRACKS, SAWING HOOK & 180° ORBIT (BEATS 1 & 2, f0-119)
         ===================================================================== */}
      {frame < 120 && (
        <group>
          {/* Canyon Cliff Drop-off Abyss on Left (-X) */}
          <mesh position={[-14, -8, -5]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[24, 60]} />
            <meshBasicMaterial color="#1e3a8a" />
          </mesh>

          {/* Terracotta Canyon Roadbed Ledge */}
          <mesh position={[1.2, -0.3, -5]}>
            <boxGeometry args={[6.5, 0.6, 48]} />
            <meshToonMaterial color="#d97706" wireframe={showWireframe} />
          </mesh>

          {/* Stratified Red-Orange Canyon Cliff Wall (+X side) */}
          <group position={[3.6, 0, -5]}>
            <mesh position={[0, 1.5, 0]}>
              <boxGeometry args={[1.6, 3.0, 48]} />
              <meshToonMaterial color="#ea580c" wireframe={showWireframe} />
            </mesh>
            <mesh position={[0.1, 4.0, 0]}>
              <boxGeometry args={[1.8, 2.2, 48]} />
              <meshToonMaterial color="#dc2626" wireframe={showWireframe} />
            </mesh>
            <mesh position={[0.2, 6.8, 0]}>
              <boxGeometry args={[2.2, 3.6, 48]} />
              <meshToonMaterial color="#991b1b" wireframe={showWireframe} />
            </mesh>
          </group>

          {/* Tunnel Overhang in Beat 1 (Frames 0-59) */}
          {frame < 62 && (
            <group position={[0, 4.6, -12]}>
              <mesh>
                <boxGeometry args={[9, 2.4, 24]} />
                <meshToonMaterial color="#7f1d1d" />
              </mesh>
              {/* Dark Tunnel Portal Arch */}
              <mesh position={[0, -2.6, -9.5]}>
                <boxGeometry args={[5.5, 4.5, 2]} />
                <meshBasicMaterial color="#090a0f" />
              </mesh>
            </group>
          )}

          {/* Raised Gravel Ballast Bed */}
          <mesh position={[0, 0.02, -5]}>
            <boxGeometry args={[2.3, 0.08, 42]} />
            <meshToonMaterial color="#78716c" wireframe={showWireframe} />
          </mesh>

          {/* Foreground 3D Gravel Pebbles */}
          {pebbles.map((p, idx) => (
            <mesh key={idx} position={p.pos}>
              <dodecahedronGeometry args={[p.scale, 0]} />
              <meshToonMaterial color={p.color} />
            </mesh>
          ))}

          {/* Wooden Sleepers / Railroad Ties */}
          {sleepers.map((zVal) => (
            <mesh key={zVal} position={[0, 0.07, zVal]}>
              <boxGeometry args={[1.75, 0.07, 0.22]} />
              <meshToonMaterial color="#785543" wireframe={showWireframe} />
            </mesh>
          ))}

          {/* Right Steel Rail (continuous) */}
          <mesh position={[0.56, 0.14, -5]}>
            <boxGeometry args={[0.07, 0.09, 36]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
          </mesh>

          {/* Left Steel Rail WITH PHYSICAL SAWED GAP AT Z = 1.2 */}
          {/* Segment 1: behind gap (Z = -22 to Z = 1.15) */}
          <mesh position={[-0.56, 0.14, -10.4]}>
            <boxGeometry args={[0.07, 0.09, 23.1]} />
            <meshStandardMaterial color="#b45309" metalness={0.6} roughness={0.3} />
          </mesh>
          {/* Segment 2: in front of gap (Z = 1.24 to Z = +10) */}
          <mesh position={[-0.56, 0.14, 5.62]}>
            <boxGeometry args={[0.07, 0.09, 8.76]} />
            <meshStandardMaterial color="#b45309" metalness={0.6} roughness={0.3} />
          </mesh>
          {/* Dark Cut Highlight Marker right at Z = 1.2 */}
          <mesh position={[-0.56, 0.145, 1.2]}>
            <boxGeometry args={[0.09, 0.1, 0.07]} />
            <meshBasicMaterial color="#090a0f" />
          </mesh>

          {/* Telegraph Poles along the canyon wall */}
          {[-14, -6, 2, 9].map((pz) => (
            <group key={pz} position={[1.85, 0, pz]}>
              <mesh position={[0, 1.6, 0]}>
                <cylinderGeometry args={[0.06, 0.08, 3.2, 8]} />
                <meshToonMaterial color="#44403c" />
              </mesh>
              <mesh position={[0, 2.8, 0]}>
                <boxGeometry args={[0.85, 0.06, 0.06]} />
                <meshToonMaterial color="#44403c" />
              </mesh>
            </group>
          ))}

          {/* Oncoming 3D Steam Locomotive */}
          <SteamLocomotive3D zPos={trainZ} frame={frame} />

          {/* 2.5D Rigged Cartoon Engineer */}
          <RicksCharacter25D rig={character} sparkIntensity={sparkIntensity} />
        </group>
      )}

      {/* =====================================================================
          ZONE B: CANYON ABYSS, TWO BRIDGES & PLANK VERTIGO (BEATS 3 & 4, f120-249)
         ===================================================================== */}
      {frame >= 120 && frame < 250 && (
        <group>
          {/* Bottomless Cobalt-Blue Canyon Abyss Floor */}
          <mesh position={[0, -24, -10]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[120, 120]} />
            <meshBasicMaterial color="#0c2d9e" />
          </mesh>

          {/* Left Stratified Canyon Wall (-X) */}
          <mesh position={[-16, -4, -12]}>
            <boxGeometry args={[10, 38, 80]} />
            <meshToonMaterial color="#9a3412" wireframe={showWireframe} />
          </mesh>

          {/* Right Stratified Canyon Wall (+X) */}
          <mesh position={[15, -4, -12]}>
            <boxGeometry args={[10, 38, 80]} />
            <meshToonMaterial color="#ea580c" wireframe={showWireframe} />
          </mesh>

          {/* Rival Bridge #1 (Background Steel Arch Bridge, two halves meeting across canyon) */}
          <group position={[0, 5.5, -18]}>
            {/* Left arch span */}
            <mesh position={[-5.5, 0, 0]}>
              <boxGeometry args={[8.5, 0.4, 1.4]} />
              <meshToonMaterial color="#1e293b" wireframe />
            </mesh>
            {/* Right arch span */}
            <mesh position={[5.5, 0, 0]}>
              <boxGeometry args={[8.5, 0.4, 1.4]} />
              <meshToonMaterial color="#1e293b" wireframe />
            </mesh>
          </group>

          {/* Rival Bridge #2 (Foreground Steel Trestle Tower & Wooden Construction Deck) */}
          <group position={[2.2, 0, 6.2]}>
            {/* Tall Steel Trestle Legs */}
            <mesh position={[0, -4.5, 0]}>
              <boxGeometry args={[2.8, 15.0, 2.4]} />
              <meshStandardMaterial color="#334155" wireframe />
            </mesh>

            {/* Wooden Construction Platform */}
            <mesh position={[0.4, 3.1, 0]}>
              <boxGeometry args={[4.2, 0.22, 3.2]} />
              <meshToonMaterial color="#92400e" />
            </mesh>

            {/* Tall Rotating Derrick Crane */}
            <mesh position={[0.8, 5.8, -0.6]} rotation={[0, 0, 0.32]}>
              <cylinderGeometry args={[0.08, 0.11, 5.8, 8]} />
              <meshToonMaterial color="#1f2937" />
            </mesh>

            {/* Precarious Wooden Plank Jutting Out Over the Blue Void */}
            <mesh position={[-1.2, 3.22, 0.3]} rotation={[0, 0.35, 0]}>
              <boxGeometry args={[3.8, 0.1, 0.36]} />
              <meshToonMaterial color="#d97706" />
            </mesh>

            {/* Tiny Coffee Mug on the Plank */}
            <mesh position={[-0.25, 3.34, 0.3]}>
              <cylinderGeometry args={[0.07, 0.07, 0.14, 12]} />
              <meshToonMaterial color="#78350f" />
            </mesh>
          </group>

          {/* 2.5D Cartoon Worker Perched on the Plank Over the Abyss */}
          <RicksCharacter25D rig={character} />
        </group>
      )}

      {/* =====================================================================
          ZONE C: DESERT MESA RUSH & UNION STATION TYCOON PAYOFF (BEAT 5, f250-300)
         ===================================================================== */}
      {frame >= 250 && (
        <group>
          {/* Endless Orange Desert Floor */}
          <mesh position={[0, -0.05, 8]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[90, 90]} />
            <meshToonMaterial color="#f97316" />
          </mesh>

          {/* Red Carpet & Golden Steps at Union Station */}
          <mesh position={[0, 0.01, 2.2]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.6, 8]} />
            <meshBasicMaterial color="#dc2626" />
          </mesh>

          {/* Golden Pyramid Steps Behind Tycoon */}
          {[0, 1, 2, 3].map((step) => (
            <mesh key={step} position={[0, 0.18 + step * 0.28, -1.2 - step * 0.6]}>
              <boxGeometry args={[5.5 - step * 0.6, 0.28, 0.7]} />
              <meshToonMaterial color="#eab308" />
            </mesh>
          ))}

          {/* Grand Station Archway & "FIRST LINE IN GETS IT ALL!" Banner */}
          <group position={[0, 2.35, -0.6]}>
            <mesh>
              <planeGeometry args={[3.8, 0.95]} />
              <meshBasicMaterial map={bannerTexture} />
            </mesh>
          </group>

          {/* 3D Gold Money Bags on Pedestals */}
          {[
            [-0.95, 0.35, 0.3],
            [-1.35, 0.55, -0.4],
            [1.05, 0.35, 0.2],
          ].map((pos, idx) => (
            <group key={idx} position={pos as [number, number, number]}>
              {/* Wooden pedestal */}
              <mesh position={[0, -0.18, 0]}>
                <boxGeometry args={[0.52, 0.36, 0.52]} />
                <meshToonMaterial color="#78350f" />
              </mesh>
              {/* Bulging Money Sack */}
              <mesh position={[0, 0.18, 0]}>
                <sphereGeometry args={[0.28, 14, 14]} />
                <meshToonMaterial color="#ca8a04" />
              </mesh>
              {/* Tied sack top */}
              <mesh position={[0, 0.45, 0]}>
                <coneGeometry args={[0.14, 0.18, 10]} />
                <meshToonMaterial color="#eab308" />
              </mesh>
            </group>
          ))}

          {/* 2.5D Rigged Top-Hat Tycoon */}
          <RicksCharacter25D rig={character} />
        </group>
      )}
    </>
  );
};
