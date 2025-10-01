import { useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { Plane, Parachute } from '.';
import type { TSteering } from '../types/steering';


interface IGame {
    steering: TSteering
}

function Game({ steering }: IGame) {

    useFrame((state, delta) => {
      // console.log("frame", state, delta);
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
                positionZ={40}
            />
            <Environment files="3d/hdri_1k.hdr" background />
        </>
    )
}

export default Game