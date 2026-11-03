'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CharacterRigState } from '@/lib/timeline-data';

interface RicksCharacter25DProps {
  rig: CharacterRigState;
  sparkIntensity?: number;
}

/**
 * Generates a crisp 2D cartoon face + hat canvas texture dynamically
 * matching the @RicksClips3000 thick-ink-outline 2D-in-3D aesthetic.
 */
function drawHeadCanvas(
  ctx: CanvasRenderingContext2D,
  rig: CharacterRigState
) {
  const W = 512;
  const H = 512;
  ctx.clearRect(0, 0, W, H);

  const cx = W / 2;
  const cy = 285;
  const rx = 138;
  const ry = 126;

  // 1. White circular/oval head base with cel-shaded shadow crescent
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#fdfdfd';
  ctx.fill();

  // Cel-shading shadow rim along bottom-left
  ctx.save();
  ctx.clip();
  ctx.beginPath();
  ctx.ellipse(cx + 22, cy - 18, rx, ry, 0, 0, Math.PI * 2);
  ctx.rect(0, 0, W, H);
  ctx.fillStyle = '#d9dfe6';
  ctx.fill('evenodd');

  // Hair tuft for engineer / worker
  if (rig.characterId === 'engineer') {
    ctx.fillStyle = '#5c4028';
    ctx.beginPath();
    ctx.ellipse(cx - 95, cy - 55, 62, 58, -0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 10;
    ctx.strokeStyle = '#231f20';
    ctx.stroke();
  }
  ctx.restore();

  // Thick dark ink outline around head (#231f20)
  ctx.lineWidth = 14;
  ctx.strokeStyle = '#231f20';
  ctx.stroke();
  ctx.restore();

  // 2. Facial features offset by headPitch
  const faceOffsetY = rig.headPitch * 55;
  const eyeY = cy - 8 + faceOffsetY;
  const leftEyeX = cx - 36;
  const rightEyeX = cx + 38;

  // Eyebrows
  ctx.save();
  ctx.strokeStyle = '#231f20';
  ctx.lineWidth = 13;
  ctx.lineCap = 'round';

  // Left brow
  ctx.beginPath();
  ctx.moveTo(leftEyeX - 26, eyeY - 32 - rig.browAngle * 18);
  ctx.lineTo(leftEyeX + 22, eyeY - 30 + rig.browAngle * 22);
  ctx.stroke();

  // Right brow
  ctx.beginPath();
  ctx.moveTo(rightEyeX - 22, eyeY - 30 + rig.browAngle * 22);
  ctx.lineTo(rightEyeX + 26, eyeY - 32 - rig.browAngle * 18);
  ctx.stroke();
  ctx.restore();

  // Eyes
  ctx.save();
  ctx.fillStyle = '#231f20';
  ctx.strokeStyle = '#231f20';
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';

  if (rig.eyeState === 'squint') {
    // >< squinting eyes when train roars past
    ctx.beginPath();
    ctx.moveTo(leftEyeX - 18, eyeY - 12);
    ctx.lineTo(leftEyeX + 8, eyeY);
    ctx.lineTo(leftEyeX - 18, eyeY + 12);
    ctx.moveTo(rightEyeX + 18, eyeY - 12);
    ctx.lineTo(rightEyeX - 8, eyeY);
    ctx.lineTo(rightEyeX + 18, eyeY + 12);
    ctx.stroke();
  } else if (rig.eyeState === 'wink') {
    // Left eye normal, right eye wink arc
    ctx.beginPath();
    ctx.ellipse(leftEyeX, eyeY, 12, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(rightEyeX, eyeY + 4, 16, Math.PI * 1.1, Math.PI * 1.9);
    ctx.stroke();
  } else if (rig.eyeState === 'wide_down') {
    // Wide eyes looking down over the canyon plank
    [leftEyeX, rightEyeX].forEach((ex) => {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(ex, eyeY + 4, 20, 22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 7;
      ctx.stroke();
      ctx.fillStyle = '#231f20';
      ctx.beginPath();
      ctx.arc(ex, eyeY + 12, 8, 0, Math.PI * 2);
      ctx.fill();
    });
  } else {
    // 'smug' or 'normal'
    [leftEyeX, rightEyeX].forEach((ex) => {
      ctx.beginPath();
      ctx.ellipse(ex, eyeY, 13, rig.eyeState === 'smug' ? 11 : 15, 0, 0, Math.PI * 2);
      ctx.fill();
      if (rig.eyeState === 'smug') {
        // Half-lidded flat top line
        ctx.beginPath();
        ctx.moveTo(ex - 20, eyeY - 8);
        ctx.lineTo(ex + 20, eyeY - 8);
        ctx.lineWidth = 9;
        ctx.stroke();
      }
    });
  }
  ctx.restore();

  // Mouth / Viseme
  const mouthY = cy + 42 + faceOffsetY;
  ctx.save();
  ctx.strokeStyle = '#231f20';
  ctx.fillStyle = '#231f20';
  ctx.lineWidth = 9;
  ctx.lineCap = 'round';

  if (rig.mouthState === 'closed_smirk') {
    ctx.beginPath();
    ctx.moveTo(cx - 22, mouthY + 2);
    ctx.quadraticCurveTo(cx + 4, mouthY + 10, cx + 26, mouthY - 8);
    ctx.stroke();
  } else if (rig.mouthState === 'talk_open') {
    ctx.beginPath();
    ctx.ellipse(cx + 4, mouthY + 2, 26, 15, -0.08, 0, Math.PI * 2);
    ctx.fill();
    // Teeth bar
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cx - 16, mouthY - 10, 40, 9);
    ctx.strokeRect(cx - 16, mouthY - 10, 40, 9);
  } else if (rig.mouthState === 'talk_wide' || rig.mouthState === 'grin') {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx, mouthY - 4, 34, 0, Math.PI, false);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (rig.mouthState === 'o_gasp') {
    ctx.beginPath();
    ctx.ellipse(cx, mouthY + 6, 14, 18, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // 3. Hat Layer
  ctx.save();
  if (rig.characterId === 'engineer') {
    // Striped Railroad Engineer Cap
    const hatY = cy - 115;
    ctx.beginPath();
    ctx.ellipse(cx + 8, hatY, 128, 52, 0.08, Math.PI, Math.PI * 2);
    ctx.lineTo(cx + 132, hatY + 18);
    ctx.ellipse(cx + 8, hatY + 18, 128, 26, 0.08, 0, Math.PI);
    ctx.closePath();
    ctx.fillStyle = '#1e3a5f';
    ctx.fill();

    // Vertical white stripes clipped inside hat crown
    ctx.save();
    ctx.clip();
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 10;
    for (let sx = cx - 120; sx <= cx + 140; sx += 24) {
      ctx.beginPath();
      ctx.moveTo(sx, hatY - 60);
      ctx.lineTo(sx - 8, hatY + 50);
      ctx.stroke();
    }
    ctx.restore();

    ctx.lineWidth = 12;
    ctx.strokeStyle = '#231f20';
    ctx.stroke();

    // Dark visor brim
    ctx.beginPath();
    ctx.ellipse(cx + 18, hatY + 24, 134, 24, 0.08, -0.2, Math.PI + 0.2);
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    ctx.stroke();
  } else if (rig.characterId === 'plank_worker') {
    // Rounded Vintage Hard Hat / Cap
    const hatY = cy - 110;
    ctx.beginPath();
    ctx.arc(cx, hatY + 15, 118, Math.PI, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = '#e2d5b5';
    ctx.fill();
    ctx.lineWidth = 12;
    ctx.strokeStyle = '#231f20';
    ctx.stroke();

    ctx.fillStyle = '#5c4028';
    ctx.fillRect(cx - 118, hatY + 2, 236, 22);
    ctx.strokeRect(cx - 118, hatY + 2, 236, 22);
  } else if (rig.characterId === 'tycoon') {
    // Tall Black Silk Top Hat with Gold Band
    const hatBottom = cy - 98;
    ctx.fillStyle = '#18181b';
    ctx.strokeStyle = '#231f20';
    ctx.lineWidth = 12;

    // Crown
    ctx.beginPath();
    ctx.roundRect(cx - 92, hatBottom - 135, 184, 140, 12);
    ctx.fill();
    ctx.stroke();

    // Gold ribbon band
    ctx.fillStyle = '#eab308';
    ctx.fillRect(cx - 92, hatBottom - 26, 184, 22);
    ctx.strokeRect(cx - 92, hatBottom - 26, 184, 22);

    // Wide brim
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.ellipse(cx, hatBottom, 148, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * Generates a crisp 2D cartoon torso texture with thick outlines and outfit details
 */
function drawTorsoCanvas(
  ctx: CanvasRenderingContext2D,
  characterId: CharacterRigState['characterId']
) {
  const W = 256;
  const H = 320;
  ctx.clearRect(0, 0, W, H);

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(36, 18, 184, 276, 78);

  if (characterId === 'engineer') {
    ctx.fillStyle = '#14b8a6'; // Teal engineer vest
  } else if (characterId === 'plank_worker') {
    ctx.fillStyle = '#b45309'; // Rust work shirt
  } else {
    ctx.fillStyle = '#1e1b4b'; // Tycoon dark coat
  }
  ctx.fill();

  ctx.save();
  ctx.clip();

  if (characterId === 'engineer') {
    // Red bandana triangle at neck
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.moveTo(75, 18);
    ctx.lineTo(181, 18);
    ctx.lineTo(128, 96);
    ctx.closePath();
    ctx.fill();
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#231f20';
    ctx.stroke();

    // Suspenders
    ctx.fillStyle = '#0f766e';
    ctx.fillRect(66, 20, 26, 270);
    ctx.fillRect(164, 20, 26, 270);
    ctx.strokeRect(66, 20, 26, 270);
    ctx.strokeRect(164, 20, 26, 270);
  } else if (characterId === 'tycoon') {
    // Yellow/gold waistcoat center & gold pocket watch chain
    ctx.fillStyle = '#eab308';
    ctx.fillRect(82, 55, 92, 230);
    ctx.strokeStyle = '#231f20';
    ctx.lineWidth = 8;
    ctx.strokeRect(82, 55, 92, 230);

    // White shirt + bow tie
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(92, 18);
    ctx.lineTo(164, 18);
    ctx.lineTo(128, 78);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else {
    // Worker plaid stripes
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 12;
    for (let y = 50; y < 280; y += 45) {
      ctx.beginPath();
      ctx.moveTo(30, y);
      ctx.lineTo(230, y);
      ctx.stroke();
    }
  }

  // Cel highlight strip on right edge
  ctx.fillStyle = 'rgba(255,255,255,0.22)';
  ctx.fillRect(182, 24, 22, 250);
  ctx.restore();

  // Thick outer ink stroke
  ctx.lineWidth = 14;
  ctx.strokeStyle = '#231f20';
  ctx.stroke();
  ctx.restore();
}

export const RicksCharacter25D: React.FC<RicksCharacter25DProps> = ({
  rig,
  sparkIntensity = 0,
}) => {
  const rootRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  // Create offscreen canvases for Head and Torso textures
  const { headCanvas, headTexture, torsoTexture } = useMemo(() => {
    const hCanvas = document.createElement('canvas');
    hCanvas.width = 512;
    hCanvas.height = 512;
    const hTex = new THREE.CanvasTexture(hCanvas);
    hTex.colorSpace = THREE.SRGBColorSpace;
    hTex.needsUpdate = true;

    const tCanvas = document.createElement('canvas');
    tCanvas.width = 256;
    tCanvas.height = 320;
    const tCtx = tCanvas.getContext('2d');
    if (tCtx) {
      drawTorsoCanvas(tCtx, rig.characterId);
    }
    const tTex = new THREE.CanvasTexture(tCanvas);
    tTex.colorSpace = THREE.SRGBColorSpace;
    tTex.needsUpdate = true;

    return { headCanvas: hCanvas, headTexture: hTex, torsoTexture: tTex };
  }, [rig.characterId]);

  // Redraw head canvas whenever expression/rig state changes
  useMemo(() => {
    const ctx = headCanvas.getContext('2d');
    if (ctx) {
      drawHeadCanvas(ctx, rig);
      headTexture.needsUpdate = true;
    }
  }, [
    headCanvas,
    headTexture,
    rig.characterId,
    rig.headPitch,
    rig.browAngle,
    rig.eyeState,
    rig.mouthState,
  ]);

  // Billboard character toward the active camera horizontally (2.5D look)
  useFrame(() => {
    if (!rootRef.current) return;
    const dx = camera.position.x - rootRef.current.position.x;
    const dz = camera.position.z - rootRef.current.position.z;
    const angleToCam = Math.atan2(dx, dz);
    rootRef.current.rotation.y = angleToCam;
  });

  const walkSwing = Math.sin(rig.walkCyclePhase) * 0.22;
  const sawShift = rig.sawStrokePhase * 0.16;

  return (
    <group ref={rootRef} position={rig.position}>
      {/* Ground Contact Blob Shadow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[0.38, 24]} />
        <meshBasicMaterial color="#090a0f" transparent opacity={0.42} />
      </mesh>

      {/* Rubber-Hose Left Leg */}
      <group position={[-0.11, 0.42, 0]} rotation={[walkSwing, 0, 0]}>
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.024, 0.024, 0.42, 10]} />
          <meshBasicMaterial color="#231f20" />
        </mesh>
        {/* Foot */}
        <mesh position={[-0.04, -0.4, 0.05]}>
          <boxGeometry args={[0.11, 0.04, 0.14]} />
          <meshBasicMaterial color="#231f20" />
        </mesh>
      </group>

      {/* Rubber-Hose Right Leg */}
      <group position={[0.11, 0.42, 0]} rotation={[-walkSwing, 0, 0]}>
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.024, 0.024, 0.42, 10]} />
          <meshBasicMaterial color="#231f20" />
        </mesh>
        {/* Foot */}
        <mesh position={[0.04, -0.4, 0.05]}>
          <boxGeometry args={[0.11, 0.04, 0.14]} />
          <meshBasicMaterial color="#231f20" />
        </mesh>
      </group>

      {/* Upper Body Group (leans forward during sawing or looking down over plank) */}
      <group position={[0, 0.42, 0]} rotation={[rig.bodyLean * 0.35, 0, -rig.bodyLean * 0.45]}>
        {/* 2.5D Pill Torso Plane */}
        <mesh position={[0, 0.34, 0]}>
          <planeGeometry args={[0.52, 0.65]} />
          <meshBasicMaterial
            map={torsoTexture}
            transparent
            alphaTest={0.05}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* 2.5D Circular Cartoon Head Plane */}
        <mesh
          position={[sawShift * 0.25, 0.94, 0.03]}
          rotation={[0, 0, rig.headTilt]}
        >
          <planeGeometry args={[0.92, 0.92]} />
          <meshBasicMaterial
            map={headTexture}
            transparent
            alphaTest={0.05}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Prop & Rubber-Hose Arms */}
        {rig.propType === 'hacksaw' && (
          <group position={[0.26 + sawShift, 0.12, 0.12]}>
            {/* Left & Right Rubber-Hose Arms reaching to saw handle */}
            <mesh position={[-0.18, 0.16, -0.04]} rotation={[0, 0, -0.85]}>
              <cylinderGeometry args={[0.022, 0.022, 0.44, 10]} />
              <meshBasicMaterial color="#231f20" />
            </mesh>
            <mesh position={[-0.12, 0.12, 0.04]} rotation={[0, 0, -0.65]}>
              <cylinderGeometry args={[0.022, 0.022, 0.38, 10]} />
              <meshBasicMaterial color="#231f20" />
            </mesh>

            {/* C-Frame Steel Hacksaw */}
            <group position={[0.18, -0.22, 0]} rotation={[0, 0, -0.18]}>
              {/* Top bow bar */}
              <mesh position={[0, 0.12, 0]}>
                <boxGeometry args={[0.58, 0.035, 0.035]} />
                <meshStandardMaterial color="#1f2937" roughness={0.4} />
              </mesh>
              {/* Left handle post */}
              <mesh position={[-0.27, 0.02, 0]}>
                <boxGeometry args={[0.04, 0.22, 0.04]} />
                <meshStandardMaterial color="#ea580c" roughness={0.5} />
              </mesh>
              {/* Right end post */}
              <mesh position={[0.27, 0.02, 0]}>
                <boxGeometry args={[0.035, 0.2, 0.035]} />
                <meshStandardMaterial color="#1f2937" roughness={0.4} />
              </mesh>
              {/* Orange/Steel Saw Blade right in the rail gap */}
              <mesh position={[0, -0.07, 0]}>
                <boxGeometry args={[0.54, 0.022, 0.012]} />
                <meshBasicMaterial color="#fb923c" />
              </mesh>

              {/* Spark Burst when sawing */}
              {sparkIntensity > 0.05 && (
                <mesh position={[0.05, -0.09, 0.03]}>
                  <sphereGeometry args={[0.06 * sparkIntensity, 8, 8]} />
                  <meshBasicMaterial color="#fef08a" />
                </mesh>
              )}
            </group>
          </group>
        )}

        {rig.propType === 'cane_money' && (
          <group>
            {/* Right arm holding gold-topped cane */}
            <mesh position={[0.28, 0.32, 0.04]} rotation={[0, 0, -0.5]}>
              <cylinderGeometry args={[0.022, 0.022, 0.38, 10]} />
              <meshBasicMaterial color="#231f20" />
            </mesh>
            <mesh position={[0.42, -0.02, 0.06]} rotation={[0, 0, 0.08]}>
              <cylinderGeometry args={[0.016, 0.012, 0.78, 8]} />
              <meshStandardMaterial color="#eab308" metalness={0.6} roughness={0.3} />
            </mesh>
          </group>
        )}
      </group>
    </group>
  );
};
