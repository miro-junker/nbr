import { useGLTF } from '@react-three/drei';
import { forwardRef, useEffect } from 'react';
import * as THREE from 'three';
import { COLOR_PARACHUTE } from '../config/render'

interface Props {
    position: [number, number, number]
}

export const Parachute = forwardRef<THREE.Group, Props>((props: Props, ref) => {
    const gltf = useGLTF("3d/parachute.gltf");

    useEffect(() => {
        gltf.scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                if (Array.isArray(mesh.material)) {
                    mesh.material.forEach((mat) => {
                        if (mat instanceof THREE.MeshStandardMaterial) {
                            mat.color.set(COLOR_PARACHUTE);
                        }
                    });
                } else if (mesh.material instanceof THREE.MeshStandardMaterial) {
                    mesh.material.color.set(COLOR_PARACHUTE);
                }
            }
        });
    }, [gltf]);

    return (
        <group
            ref={ref}
            position={props.position}
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
});
