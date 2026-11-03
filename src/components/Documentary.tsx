import React, { useMemo } from "react";
import {
  AE_SILK,
  AE_SNAP,
  clamp,
  impulseRecoil,
  lerp,
  springODE,
} from "../lib/kinematics";
import { evaluateXCamera, TOTAL_DURATION } from "../lib/timeline";
import { ThreePose, ThreeStage } from "./ThreeStage";
import { BeatsAct1To5 } from "./blinkit/BeatsAct1To5";
import { BeatsAct6To10 } from "./blinkit/BeatsAct6To10";
import {
  AmbientMotionField,
  BroadcastTelemetryHUD,
  ContactShadow,
  CornerDepthAccents,
  RadarStencil,
  WhipTransitionOverlay,
} from "./blinkit/Primitives";

const IMPACT_TIMES = [
  13.57, 59.92, 75.33, 87.07, 93.13, 119.9, 125.19, 134.92, 145.38, 152.41,
  168.0, 203.66, 210.28, 214.54,
];

export const Documentary: React.FC<{ t: number }> = ({ t }) => {
  const cam = useMemo(() => evaluateXCamera(t), [t]);

  // Sum impulse recoils on hero impact timestamps
  const globalRecoilY = useMemo(() => {
    let sum = 0;
    for (const imp of IMPACT_TIMES) {
      sum += impulseRecoil(t - imp, 11.5, 11.2, 44.0);
    }
    return sum;
  }, [t]);

  // 3D PBR Hero Choreography (center 960, 515) with dynamic multi-axis orbital sweeps
  const threePose = useMemo<ThreePose | null>(() => {
    const primary = cam.primaryBeat;
    const local = Math.max(0, t - primary.start);
    const dur = Math.max(0.1, primary.end - primary.start);
    const frac = clamp(local / dur, 0, 1);

    const enterSp = springODE(local, 16.5, 0.72).value;
    const rackBlur = 9 * Math.pow(1 - AE_SNAP(clamp(local / 0.45, 0, 1)), 2);
    const hoverY = 515 + Math.sin(t * 2.3) * 10.5;
    const darkTheme = primary.theme === "dark";

    const primaryLayer = cam.activeBeats.find(
      (ab) => ab.beat.id === primary.id
    );
    const layerOpacity = primaryLayer ? primaryLayer.opacity : 1;
    const layerScale = primaryLayer ? primaryLayer.scale : 1;

    switch (primary.id) {
      case "B01_HOOK_TAP":
        return {
          model: "phone",
          t,
          beatProgress: frac,
          pixelX: 960,
          pixelY: hoverY,
          diameterPx: lerp(335, 450, enterSp) * layerScale,
          rotX: 0.12 + Math.cos(t * 1.6) * 0.09,
          rotY: lerp(-0.62, 0.62, frac) + Math.sin(t * 1.1) * 0.09,
          rotZ: -0.05 + Math.sin(t * 1.35) * 0.035,
          darkTheme,
          opacity: layerOpacity,
          blurPx: rackBlur,
          shadowStrength: 0.38,
        };

      case "B05_KIRANA_TO_GROFERS":
        return {
          model: "bag",
          t,
          beatProgress: frac,
          pixelX: 960,
          pixelY: hoverY,
          diameterPx: lerp(320, 425, enterSp) * layerScale,
          rotX: 0.2 + Math.sin(t * 1.5) * 0.07,
          rotY: lerp(-0.74, 0.74, frac),
          rotZ: Math.cos(t * 1.25) * 0.045,
          darkTheme,
          opacity: layerOpacity,
          blurPx: rackBlur,
          shadowStrength: 0.4,
        };

      case "B12_BURN_PER_BAG":
        return {
          model: "bag",
          t,
          beatProgress: frac,
          pixelX: 960,
          pixelY: hoverY,
          diameterPx: lerp(335, 435, enterSp) * layerScale,
          rotX: 0.26 + Math.cos(t * 1.7) * 0.08,
          rotY: lerp(0.68, -0.68, frac),
          rotZ: -0.07 + Math.sin(t * 1.6) * 0.045,
          darkTheme: true,
          opacity: layerOpacity,
          blurPx: rackBlur,
          shadowStrength: 0.48,
        };

      case "B15_DEAL_4447_CRORE":
        return {
          model: "vault_coin",
          t,
          beatProgress: frac,
          pixelX: 960,
          pixelY: hoverY,
          diameterPx: lerp(340, 445, enterSp) * layerScale,
          rotX: 0.16 + Math.sin(t * 1.4) * 0.09,
          rotY: lerp(-0.72, 0.72, frac),
          rotZ: 0.04,
          darkTheme,
          opacity: layerOpacity,
          blurPx: rackBlur,
          shadowStrength: 0.4,
        };

      case "B18_NINETY_SEC_PACK":
        return {
          model: "crate",
          t,
          beatProgress: frac,
          pixelX: 960,
          pixelY: hoverY + 8,
          diameterPx: lerp(335, 435, enterSp) * layerScale,
          rotX: 0.36 + Math.sin(t * 1.55) * 0.06,
          rotY: lerp(-0.62, 0.62, frac),
          rotZ: Math.cos(t * 1.2) * 0.035,
          darkTheme,
          opacity: layerOpacity,
          blurPx: rackBlur,
          shadowStrength: 0.4,
        };

      case "B21_ETERNAL_HUB":
        return {
          model: "empire_monolith",
          t,
          beatProgress: frac,
          pixelX: 960,
          pixelY: hoverY,
          diameterPx: lerp(345, 450, enterSp) * layerScale,
          rotX: 0.22 + Math.cos(t * 1.25) * 0.06,
          rotY: lerp(-0.66, 0.66, frac),
          rotZ: 0.0,
          darkTheme,
          opacity: layerOpacity,
          blurPx: rackBlur,
          shadowStrength: 0.42,
        };

      default:
        return null;
    }
  }, [cam, t]);

  const hasShutterBlur = cam.shutterBlurX > 0.3 || cam.shutterBlurY > 0.3;
  const masterFadeBlack = AE_SILK(
    clamp((t - (TOTAL_DURATION - 1.6)) / 1.55, 0, 1)
  );

  return (
    <div
      data-testid="documentary-stage"
      data-beat={cam.primaryBeat.id}
      className="relative h-[1080px] w-[1920px] overflow-hidden select-none"
      style={{
        backgroundColor: cam.bgCss,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {/* SVG Defs: 180-degree shutter blur + studio dot-grid pattern */}
      <svg className="pointer-events-none absolute h-0 w-0">
        <defs>
          <filter
            id="shutter-blur"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation={`${cam.shutterBlurX.toFixed(2)} ${cam.shutterBlurY.toFixed(2)}`}
            />
          </filter>
          <pattern
            id="studio-dot-grid-light"
            width="36"
            height="36"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="18" cy="18" r="1.35" fill="rgba(24,24,27,0.10)" />
          </pattern>
          <pattern
            id="studio-dot-grid-dark"
            width="36"
            height="36"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="18" cy="18" r="1.35" fill="rgba(255,255,255,0.08)" />
          </pattern>
        </defs>
      </svg>

      {/* Subtle Vignette & Dot Grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            cam.darkMix > 0.5
              ? "radial-gradient(circle at 50% 50%, rgba(24,24,27,0) 45%, rgba(0,0,0,0.68) 100%)"
              : "radial-gradient(circle at 50% 50%, rgba(255,255,255,0) 50%, rgba(24,24,27,0.09) 100%)",
        }}
      />
      <svg className="pointer-events-none absolute inset-0 h-full w-full">
        <rect
          width="1920"
          height="1080"
          fill={
            cam.darkMix > 0.5
              ? "url(#studio-dot-grid-dark)"
              : "url(#studio-dot-grid-light)"
          }
        />
      </svg>

      {/* Master Camera World Container (recoil + 180-deg shutter motion blur) */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translate3d(0, ${globalRecoilY.toFixed(2)}px, 0)`,
          filter: hasShutterBlur ? "url(#shutter-blur)" : undefined,
        }}
      >
        {/* Z4: Ambient Motion Vector Field */}
        <AmbientMotionField t={t} darkMix={cam.darkMix} />

        {/* Z5: Per-beat Background SVG (RadarStencil, ContactShadow, Reticle) */}
        <svg
          viewBox="0 0 1920 1080"
          className="pointer-events-none absolute inset-0 h-full w-full"
          style={{ zIndex: 5 }}
        >
          <circle
            cx={960}
            cy={540}
            r={380}
            fill="none"
            stroke={cam.darkMix > 0.5 ? "#FFFFFF" : "#18181B"}
            strokeOpacity={0.055}
            strokeWidth={1.5}
            strokeDasharray="10 14"
            transform={`rotate(${(t * 3.5) % 360} 960 540)`}
          />

          {threePose && (
            <>
              <RadarStencil
                t={t}
                enterAt={cam.primaryBeat.start + 0.08}
                cx={960}
                cy={515}
                baseRadius={272}
                accentColor={
                  cam.primaryBeat.id === "B12_BURN_PER_BAG"
                    ? "#E23744"
                    : "#F8CB46"
                }
                darkTheme={cam.darkMix > 0.5}
              />
              <ContactShadow
                cx={960}
                cy={742}
                rx={210}
                ry={32}
                strength={threePose.shadowStrength ?? 0.36}
                darkTheme={cam.darkMix > 0.5}
              />
            </>
          )}
        </svg>

        {/* Z15: Real WebGL 3D Dark Obsidian PBR Stage */}
        <ThreeStage pose={threePose} />

        {/* Z25 / Z27: Active Beat Foreground Layers */}
        {cam.activeBeats.map((layer) => {
          const isIris = layer.clipIrisRadiusPct !== null;
          return (
            <div
              key={layer.beat.id}
              className="absolute inset-0 overflow-hidden"
              style={{
                zIndex: isIris ? 27 : 25,
                backgroundColor: isIris ? layer.bgCss : undefined,
                opacity: layer.opacity,
                transform: `translate3d(${layer.offsetX.toFixed(
                  1
                )}px, ${layer.offsetY.toFixed(1)}px, 0) scale(${layer.scale.toFixed(
                  4
                )})`,
                filter:
                  layer.blurPx > 0.25
                    ? `blur(${layer.blurPx.toFixed(2)}px)`
                    : undefined,
                clipPath: isIris
                  ? `circle(${layer.clipIrisRadiusPct!.toFixed(2)}% at 50% 50%)`
                  : undefined,
              }}
            >
              {layer.beat.chapter <= 5 ? (
                <BeatsAct1To5
                  beatId={layer.beat.id}
                  t={t}
                  localTime={layer.localTime}
                />
              ) : (
                <BeatsAct6To10
                  beatId={layer.beat.id}
                  t={t}
                  localTime={layer.localTime}
                />
              )}
            </div>
          );
        })}

        {/* Z30: Corner Depth Accents */}
        <CornerDepthAccents t={t} darkMix={cam.darkMix} />

        {/* Z42: Directional Whip-Pan & Cut Speed-Lines Overlay */}
        <WhipTransitionOverlay
          t={t}
          transitionType={cam.primaryBeat.transition}
          beatStart={cam.primaryBeat.start}
        />
      </div>

      {/* Z50: Master Silk Fade to Black (last 1.55s) */}
      {masterFadeBlack > 0.002 && (
        <div
          className="pointer-events-none absolute inset-0 bg-black"
          style={{ zIndex: 50, opacity: masterFadeBlack }}
        />
      )}
    </div>
  );
};
