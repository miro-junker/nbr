import React, { useEffect, useRef } from "react";
import type { TSteering } from "../types/steering";
import { DEBUG } from "../config/main";

function normalize(value: number, min: number, max: number) {
  return ((value - min) / (max - min)) * 100;
}

function normalizeGamma(value: number) {
  const clamped = Math.max(-90, Math.min(90, value));
  return ((clamped + 90) / 180) * 100;
}

const SMOOTH_ENABLED = true;
const SMOOTH_MS = 100;

export const SteeringVisualizer: React.FC<{
  refSteering: React.RefObject<TSteering>;
}> = ({ refSteering }) => {
  // refs for DOM elements
  const alphaRef = useRef<HTMLDivElement>(null);
  const betaRef = useRef<HTMLDivElement>(null);
  const gammaRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  const debugAlphaRef = useRef<HTMLDivElement>(null);
  const debugBetaRef = useRef<HTMLDivElement>(null);
  const debugGammaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frameId: number;

    const update = () => {
      const s = refSteering.current;
      if (s) {
        const { a = 0, b = 0, c = 0, horizontal = 0 } = s;

        // update debug values
        if (DEBUG) {
          if (debugAlphaRef.current) debugAlphaRef.current.textContent = `α: ${a.toFixed(1)}°`;
          if (debugBetaRef.current) debugBetaRef.current.textContent = `β: ${b.toFixed(1)}°`;
          if (debugGammaRef.current) debugGammaRef.current.textContent = `γ: ${c.toFixed(1)}°`;
        }

        // update bars
        if (alphaRef.current)
          alphaRef.current.style.height = `${normalize(a, 0, 360)}%`;
        if (betaRef.current)
          betaRef.current.style.height = `${normalize(b, -180, 180)}%`;
        if (gammaRef.current)
          gammaRef.current.style.height = `${normalizeGamma(c)}%`;

        // steering left/right
        if (horizontal < 0) {
          if (leftRef.current) leftRef.current.style.width = `${-horizontal * 100}%`;
          if (rightRef.current) rightRef.current.style.width = "0%";
        } else {
          if (leftRef.current) leftRef.current.style.width = "0%";
          if (rightRef.current) rightRef.current.style.width = `${horizontal * 100}%`;
        }
      }
      frameId = requestAnimationFrame(update);
    };

    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [refSteering]);

  const smoothStyle = SMOOTH_ENABLED
    ? { transition: `height ${SMOOTH_MS}ms ease-in-out` }
    : { transition: "none" };

  return (
    <>
      <style>
        {`
          .tilt-container {
            position: fixed;
            bottom: 1rem;
            right: 1rem;
            display: flex;
            flex-direction: row;
            gap: 6px;
            width: 60px;   
            height: calc(100vh - 6rem);
            z-index: 200;
            align-items: flex-end;
          }

          .tilt-bar {
            width: 33%;
            border-radius: 4px;
            background: gray;
            bottom: 0;
          }

          .tilt-alpha { background-color: #ef4444; }
          .tilt-beta { background-color: #22c55e; }
          .tilt-gamma { background-color: #3b82f6; }

          .steering-x {
            height: 10px;
            display: flex;
            position: fixed;
            bottom: 2rem;
            left: 25vw;
            z-index: 200;
            width: calc(50vw);
          }

          .steering-x-box {
            flex: 1;
            height: 100%;
            position: relative;
            background: gray;
            border-radius: 4px;
            overflow: hidden;
          }

          .steering-x-bar {
            height: 100%;
            background: #ef4444; 
          }

          .steering-x-box--left .steering-x-bar {
            right: 0;
            position: absolute;
          }

          .x-center {
            background: yellow;
            width: 20px;
            height: 20px;
            position: absolute;
            left: calc(50% - 10px);
            border-radius: 10px;
            top: -5px;
          }
        `}
      </style>

      {DEBUG && (
        <div className="tilt-container">
          <div ref={alphaRef} className="tilt-bar tilt-alpha" style={smoothStyle} />
          <div ref={betaRef} className="tilt-bar tilt-beta" style={smoothStyle} />
          <div ref={gammaRef} className="tilt-bar tilt-gamma" style={smoothStyle} />
        </div>
      )}

      {DEBUG && (
        <div style={{ position: "fixed", top: 10, left: 10, fontSize: 24, zIndex: 200 }}>
          <div ref={debugAlphaRef} style={{ color: 'red' }} />
          <div ref={debugBetaRef} style={{ color: 'green' }} />
          <div ref={debugGammaRef} style={{ color: 'blue' }} />
        </div>
      )}

      <div className="steering-x">
        <div className="steering-x-box steering-x-box--left">
          <div ref={leftRef} className="steering-x-bar" />
        </div>
        <div className="steering-x-box">
          <div ref={rightRef} className="steering-x-bar" />
        </div>
        <div className="x-center" />
      </div>
    </>
  );
};
