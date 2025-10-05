import React, { useEffect, useRef } from "react";
import type { TSteering } from "@/types/steering";
import './SteeringVisualizer.css'


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
    const refAlpha     = useRef<HTMLDivElement>(null);
    const refBeta      = useRef<HTMLDivElement>(null);
    const refGamma     = useRef<HTMLDivElement>(null);
    const refLeft      = useRef<HTMLDivElement>(null);
    const refRight     = useRef<HTMLDivElement>(null);
    const refUp        = useRef<HTMLDivElement>(null);
    const refDown      = useRef<HTMLDivElement>(null);
    const refAlphaText = useRef<HTMLDivElement>(null);
    const refBetaText  = useRef<HTMLDivElement>(null);
    const refGammaText = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let frameId: number;

        const update = () => {
            const data = refSteering.current;
            if (data) {
                const { a = 0, b = 0, c = 0, horizontal = 0, vertical = 0 } = data;

                // update text values
                if (refAlphaText.current) refAlphaText.current.textContent = `α: ${a.toFixed(1)}°`;
                if (refBetaText.current)  refBetaText.current.textContent  = `β: ${b.toFixed(1)}°`;
                if (refGammaText.current) refGammaText.current.textContent = `γ: ${c.toFixed(1)}°`;

                // update bars
                if (refAlpha.current) refAlpha.current.style.height = `${normalize(a, 0, 360)}%`;
                if (refBeta.current)  refBeta.current.style.height  = `${normalize(b, -180, 180)}%`;
                if (refGamma.current) refGamma.current.style.height = `${normalizeGamma(c)}%`;

                // steering left/right
                if (horizontal < 0) {
                    if (refLeft.current)  refLeft.current.style.width  = `${-horizontal * 100}%`;
                    if (refRight.current) refRight.current.style.width = "0%";
                } else {
                    if (refLeft.current)  refLeft.current.style.width  = "0%";
                    if (refRight.current) refRight.current.style.width = `${horizontal * 100}%`;
                }

                if (vertical < 0) {
                    if (refUp.current)   refUp.current.style.height   = "0%";
                    if (refDown.current) refDown.current.style.height = `${-vertical * 100}%`;
                } else {
                    if (refUp.current)   refUp.current.style.height   = `${vertical * 100}%`;
                    if (refDown.current) refDown.current.style.height = "0%";
                }
            }
            frameId = requestAnimationFrame(update);
        };

        frameId = requestAnimationFrame(update);
        return () => cancelAnimationFrame(frameId);
    }, [refSteering]);

    const smoothStyle = SMOOTH_ENABLED
        ? { transition: `width height ${SMOOTH_MS}ms ease-in-out` }
        : { transition: "none" };

    return (
        <>
            <div className="tilt-container">
                <div ref={refGamma} className="tilt-bar tilt-gamma" style={smoothStyle}>
                    <div ref={refGammaText} />
                </div>
                <div ref={refBeta}    className="tilt-bar tilt-beta"    style={smoothStyle}>
                    <div ref={refBetaText} />
                </div>
                <div ref={refAlpha} className="tilt-bar tilt-alpha" style={smoothStyle}>
                    <div ref={refAlphaText} />
                </div>
            </div>

            <div className="steering-x">
                <div className="steering-x-box steering-x-box--left">
                    <div ref={refLeft} className="steering-x-bar" />
                </div>
                <div className="steering-x-box">
                    <div ref={refRight} className="steering-x-bar" />
                </div>
                <div className="x-center" />
            </div>

            <div className="steering-y">
                <div className="steering-y-box steering-y-box--up">
                    <div ref={refUp} className="steering-y-bar" />
                </div>
                <div className="steering-y-box">
                    <div ref={refDown} className="steering-y-bar" />
                </div>
                <div className="y-center" />
            </div>
        </>
    );
};
