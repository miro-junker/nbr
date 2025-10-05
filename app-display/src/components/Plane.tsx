import { useGLTF } from '@react-three/drei'
import { forwardRef } from 'react'
import * as THREE from 'three'


interface Props {
    posX: number
    posY: number
    turnX: number
    turnY: number
}


export const Plane = forwardRef<THREE.Object3D, Props>((props: Props, ref) => {
    const gltf = useGLTF("3d/plane.gltf")

    const { posX, posY, turnX, turnY } = props

    return (
        <primitive
            ref={ref}
            object={gltf.scene}
            scale={1}
            rotation={[turnY, 0, turnX]}
            position={[-posX, posY, 0]}
        />
    );
})
