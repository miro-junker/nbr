import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { Plane, Parachute } from '.';
import type { TSteering } from '../types/steering';
import * as THREE from 'three';
import { initGameState, type TGameState, type TPos } from '../physics/state';


interface IGame {
    steering: TSteering
}

export function Game({ steering }: IGame) {
    const refPlane = useRef<THREE.Object3D>(null)
    const refParachute = useRef<THREE.Group>(null)
    const refGameState = useRef<TGameState>(initGameState);

    useFrame((state, delta) => {
        // console.log("frame", state, delta);
        const newParachuteZ = refGameState.current.parachutePos[2] - delta * 2;
        const newParachutePos: TPos = [20, 0, newParachuteZ]
        refGameState.current.parachutePos = newParachutePos
        refParachute.current?.position.set(20, 0, newParachuteZ)
    })

    return (
        <>
            <Plane
                ref={refPlane}
                turnX={steering.horizontal}
                turnY={0}
                posX={0}
                posY={0}
            />
            <Parachute
                ref={refParachute}
                position={initGameState.parachutePos}
            />
            <Environment files="3d/hdri_1k.hdr" background />
        </>
    )
}
