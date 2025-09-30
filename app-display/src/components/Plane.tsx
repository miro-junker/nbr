import { useGLTF } from '@react-three/drei';

interface Props {
  turnHorizontal: number
  turnVertical: number
}

export function Plane({ turnHorizontal, turnVertical }: Props) {
  const gltf = useGLTF("3d/plane.gltf");

  return <primitive object={gltf.scene} scale={1} rotation={[turnVertical, 0, turnHorizontal]} />;
}
