import React from "react";

type TiltPacket = {
  type: "tilt";
  a: number;
  b: number;
  c: number;
};

function normalize(value: number, min: number, max: number) {
  return ((value - min) / (max - min)) * 100;
}

// Configurable smooth animation
const SMOOTH_ENABLED = false; // set to false to disable smooth animation
const SMOOTH_MS = 100; // duration in milliseconds

interface TiltVisualizerProps extends TiltPacket {}

export const TiltVisualizer: React.FC<TiltVisualizerProps> = ({
  a,
  b,
  c,
}) => {
  const alphaPercent = normalize(a, 0, 360);
  const betaPercent = normalize(b, -180, 180);
  const gammaPercent = normalize(c, -90, 90);

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
            height: calc(100vh - 2rem);
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
        `}
      </style>

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
    </>
  );
};
