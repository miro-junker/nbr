import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { Plane, Parachute } from '.';
import * as THREE from 'three';
import { initGameState } from '../physics/state';
import type { TSteering, TGameState, TPos } from '../types';
import { getPlaneRotation, getPlanePositionX } from '../physics/plane';


interface IGame {
    steering: TSteering
}

export function Game({ steering }: IGame) {
    const refPlane = useRef<THREE.Object3D>(null)
    const refParachute = useRef<THREE.Group>(null)
    const refGameState = useRef<TGameState>(initGameState);

    useFrame((state, delta) => {
        const newPlaneRotationX = getPlaneRotation(refGameState.current, steering, delta);
        refPlane.current?.rotation.set(0, 0, newPlaneRotationX)

        const newPlanePosX = getPlanePositionX(refGameState.current, newPlaneRotationX, delta);
        refPlane.current?.position.set(-newPlanePosX, 0, 0)

        const newParachuteZ = refGameState.current.parachutePos[2] - delta * 2;
        const newParachutePos: TPos = [20, 0, newParachuteZ]
        refParachute.current?.position.set(20, 0, newParachuteZ)
        
        refGameState.current = {
            parachutePos: newParachutePos,
            planeRotationX: newPlaneRotationX,
            planePosX: newPlanePosX,
        }
        
    })

    return (
        <>
            <Plane
                ref={refPlane}
                turnX={0}
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
