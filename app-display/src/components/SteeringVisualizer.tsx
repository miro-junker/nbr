import React from "react";
import type { TiltPacket, TSteering } from "../types/ws";


function normalize(value: number, min: number, max: number) {
  return ((value - min) / (max - min)) * 100;
}

function normalizeGamma(value: number) {
  // Clamp the value to stay within -90…90
  const clamped = Math.max(-90, Math.min(90, value));
  return ((clamped + 90) / 180) * 100;
}


// Configurable smooth animation
const SMOOTH_ENABLED = true; // set to false to disable smooth animation
const SMOOTH_MS = 100; // duration in milliseconds
const DEBUG = false;


export const SteeringVisualizer: React.FC<any> = ({
  a,
  b,
  c,
  horizontal,
}) => {
  if (typeof horizontal !== "number") return null;

  const alphaPercent = normalize(a, 0, 360);
  const betaPercent = normalize(b, -180, 180);
  const gammaPercent = normalizeGamma(c);

  const smoothStyle = SMOOTH_ENABLED
    ? { transition: `height ${SMOOTH_MS}ms ease-in-out` }
    : { transition: "none" };

    let left = 0;
    let right = 0;
    if (horizontal < 0) {
      left = horizontal * -100;
      right = 0;
    } else {
      left = 0;
      right = horizontal * 100;
    }

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

          .tilt-alpha {
            background-color: #ef4444; 
          }

          .tilt-beta {
            background-color: #22c55e; 
          }

          .tilt-gamma {
            background-color: #3b82f6; 
          }

          .steering-x {
            height: 20px;
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
            width: 40px;
            height: 40px;
            position: absolute;
            left: calc(50% - 20px);
            border-radius: 20px;
            top: -10px;
          }
        `}
      </style>

      {DEBUG && (
        <div className="tilt-container">
          <div
            className="tilt-bar tilt-alpha"
            style={{ height: `${alphaPercent}%`, ...smoothStyle }}
          />
          <div
            className="tilt-bar tilt-beta"
            style={{ height: `${betaPercent}%`, ...smoothStyle }}
          />
          <div
            className="tilt-bar tilt-gamma"
            style={{ height: `${gammaPercent}%`, ...smoothStyle }}
          />
        </div>
      )}

      {DEBUG && (
        <div style={{ position: "fixed", top: 10, left: 10, fontSize: 24, zIndex: 200 }}>
          <div style={{ color: 'red' }}>α: {a?.toFixed(1)}°</div>
          <div style={{ color: 'green' }}>β: {b?.toFixed(1)}°</div>
          <div style={{ color: 'blue' }}>γ: {c?.toFixed(1)}°</div>
        </div>
      )}

      <div className='steering-x'>
        <div className='steering-x-box steering-x-box--left'><div className='steering-x-bar' style={{ width: `${left}%`}} /></div>
        <div className='steering-x-box'><div className='steering-x-bar' style={{ width: `${right}%`}} /></div>
        <div className='x-center' />
      </div>
    </>
  );
};
