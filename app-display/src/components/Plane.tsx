import { useGLTF } from '@react-three/drei'
import { forwardRef } from 'react'
import * as THREE from 'three'


export const Plane = forwardRef<THREE.Object3D>((_, ref) => {
    const gltf = useGLTF("3d/plane.gltf")

    return (
        <primitive
            ref={ref}
            object={gltf.scene}
            scale={1}
            rotation={[0, 0, 0]}
            position={[0, 0, 0]}
        />
    );
})
