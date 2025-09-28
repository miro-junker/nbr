import { useGLTF } from '@react-three/drei';

export function Model3D({ path }: { path: string, scale: number })
{
    const gltf = useGLTF(path);
    return <primitive object={gltf.scene} scale={1} />;
}
