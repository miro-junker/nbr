import { useGLTF } from '@react-three/drei';
import { forwardRef } from 'react';
import * as THREE from 'three';


interface Props {
    positionX: number
    positionY: number
    positionZ: number
}


export const Parachute = forwardRef<THREE.Group, Props>((props: Props, ref) =>{
    const gltf = useGLTF("3d/parachute.gltf");

    const { positionX, positionY, positionZ } = props


    return (
        <group
            ref={ref}
            position={[positionX, positionY, positionZ]}
            rotation={[0,0,0]}
            scale={1}
        >
            <primitive
                object={gltf.scene}
                rotation={[1.65, 3.15, 0]}
                position={[0, -1, 0]}
                scale={0.2}
            />
        </group>
    );
})
