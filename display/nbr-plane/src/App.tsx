import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Suspense } from 'react';

function Model({ path }: { path: string }) {
  const gltf = useGLTF(path);
  return <primitive object={gltf.scene} scale={1} />;
}

export default function App() {
  return (
    <div className="container mt-5">
      <h1 className="mb-3">My 3D App</h1>
      <Canvas style={{ height: '500px', background: '#eee' }}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
          <Model path="/3d/plane.gltf" />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
}
