"use client";

import React, { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import {
  ZomatoDocumentary,
  ZOMATO_TOTAL_DURATION,
} from "@/components/ZomatoDocumentary";

export default function RenderDocumentaryPage() {
  const [docTime, setDocTime] = useState(0);
  const [modelsReady, setModelsReady] = useState(false);

  const handleReady = React.useCallback(() => {
    setModelsReady(true);
  }, []);

  useEffect(() => {
    // Expose deterministic frame stepper to Playwright worker
    (window as unknown as { __setDocTime: (t: number) => Promise<void> }).__setDocTime = (
      t: number
    ) => {
      return new Promise<void>((resolve) => {
        flushSync(() => {
          setDocTime(Math.min(t, ZOMATO_TOTAL_DURATION));
        });
        requestAnimationFrame(() => {
          resolve();
        });
      });
    };

    // Signal readiness when fonts and 3D models finish loading
    Promise.all([
      document.fonts.ready,
      new Promise<void>((resolve) => {
        const check = () => {
          if (
            (window as unknown as { __zomatoModelsReady?: boolean })
              .__zomatoModelsReady
          ) {
            resolve();
          } else {
            setTimeout(check, 100);
          }
        };
        check();
      }),
    ]).then(() => {
      setModelsReady(true);
      (window as unknown as { __docReady: boolean }).__docReady = true;
    });
  }, []);

  return (
    <main className="relative w-[1920px] h-[1080px] overflow-hidden bg-[#F3F3F5]">
      <ZomatoDocumentary
        currentTime={docTime}
        onReady={handleReady}
      />
    </main>
  );
}
