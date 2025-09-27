import React from "react";

type TiltData = {
  type: "tilt";
  alpha: number;
  beta: number;
  gamma: number;
};

function normalize(value: number, min: number, max: number) {
  return ((value - min) / (max - min)) * 100;
}

interface TiltVisualizerProps extends TiltData {}

export const TiltVisualizer: React.FC<TiltVisualizerProps> = ({
  alpha,
  beta,
  gamma,
}) => {
  const alphaPercent = normalize(alpha, 0, 360);
  const betaPercent = normalize(beta, -180, 180);
  const gammaPercent = normalize(gamma, -90, 90);

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
            width: 60px;   /* fixed bar width */
            height: calc(100vh - 2rem); /* max height for 100% */
            z-index: 200;
          }

          .tilt-bar {
            width: 33%;
            border-radius: 4px;
            transition: height 0.1s ease-in-out;
            background: gray;
          }

          .tilt-alpha {
            background-color: #ef4444; /* red */
          }

          .tilt-beta {
            background-color: #22c55e; /* green */
          }

          .tilt-gamma {
            background-color: #3b82f6; /* blue */
          }
        `}
      </style>

      <div className="tilt-container">
        <div
          className="tilt-bar tilt-alpha"
          style={{ height: `${alphaPercent}%` }}
        />
        <div
          className="tilt-bar tilt-beta"
          style={{ height: `${betaPercent}%` }}
        />
        <div
          className="tilt-bar tilt-gamma"
          style={{ height: `${gammaPercent}%` }}
        />
      </div>
    </>
  );
};
