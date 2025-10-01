import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { Plane, Parachute } from '.';
import type { TSteering } from '../types/steering';


interface IGame {
    steering: TSteering
}

function Game({ steering }: IGame) {
    const gameStateRef = useRef({
        planePositionX: 0,
        planeRotationX: 0,
        parachutePositionX: 10,
        parachutePositionZ: 40
    });

    useFrame((state, delta) => {
      // console.log("frame", state, delta);
      const newParachuteZ = gameStateRef.current.parachutePositionZ - delta * 5;
      console.log("parachuteZ", gameStateRef.current.parachutePositionZ)
      gameStateRef.current.parachutePositionZ = newParachuteZ

    })

    return (
        <>
            <Plane
                turnX={steering.horizontal}
                turnY={0}
                posX={0}
                posY={0}
            />
            <Parachute
                positionX={10}
                positionY={0}
                positionZ={gameStateRef.current.parachutePositionZ}
            />
            <Environment files="3d/hdri_1k.hdr" background />
        </>
    )
}

export default Game