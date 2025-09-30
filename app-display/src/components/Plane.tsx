import { useGLTF } from '@react-three/drei';

interface Props {
  posX: number
  posY: number
  turnX: number
  turnY: number
}

export function Plane(props: Props) {
  const gltf = useGLTF("3d/plane.gltf");

  const { posX, posY, turnX, turnY } = props

  return (
    <primitive
      object={gltf.scene}
      scale={1}
      rotation={[turnY, 0, turnX]}
      position={[-posX, posY, 0]}
    />
  );
}
