import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { Plane, Parachute } from '.';
import * as THREE from 'three';
import { initGameState, COLLISION_DISTANCE } from '../physics/state';
import type { TSteering, TGameState, TPos } from '../types';
import { getPlaneRotation, getPlanePositionX } from '../physics/plane';


interface IGame {
    refSteering: React.RefObject<TSteering>
}

export function Game({ refSteering }: IGame) {
    const refPlane = useRef<THREE.Object3D>(null)
    const refParachute = useRef<THREE.Group>(null)
    const refGameState = useRef<TGameState>(initGameState);

    const posPlane = new THREE.Vector3();
    const posParachute = new THREE.Vector3();

    useFrame((state, delta) => {
        // Plane updates
        const newPlaneRotationX = getPlaneRotation(refGameState.current, refSteering.current, delta);
        refPlane.current?.rotation.set(0, 0, newPlaneRotationX)

        const newPlanePosX = getPlanePositionX(refGameState.current, newPlaneRotationX, delta);
        refPlane.current?.position.set(-newPlanePosX, 0, 0)

        // Parachute updates
        const newParachuteZ = refGameState.current.parachutePos[2] - delta * 2;
        let newParachutePos: TPos = [20, 0, newParachuteZ]
        refParachute.current?.position.set(20, 0, newParachuteZ)
       
        // Collision detection
        if (refPlane.current && refParachute.current) {
            refPlane.current.getWorldPosition(posPlane);
            refParachute.current.getWorldPosition(posParachute);
            const distance = posPlane.distanceTo(posParachute);
            if (distance < COLLISION_DISTANCE) {
                console.log("Plane picked up parachute");
                // Create new parachutist
                newParachutePos = [ (Math.random() - 0.5) * 20, 0, 40 ];
                refParachute.current.position.set(...newParachutePos);
            }
        }

        // Save game state
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
            <Environment
                files="3d/hdri_1k.hdr"
                backgroundRotation={[0, 0.5*Math.PI, 0]} // rotate around Y axis
                background />
        </>
    )
}
