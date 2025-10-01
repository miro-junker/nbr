import { useGLTF } from '@react-three/drei';

interface Props {
    positionX: number
    positionY: number
    positionZ: number
}

export function Parachute(props: Props) {
  const gltf = useGLTF("3d/parachute.gltf");

  const { positionX, positionY, positionZ } = props


  return (
    <group
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
}
