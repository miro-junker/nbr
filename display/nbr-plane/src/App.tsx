import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import { Suspense } from 'react';

function Model({ path }: { path: string }) {
  const gltf = useGLTF(path);
  return <primitive object={gltf.scene} scale={1} />;
}

export default function App() {
  return (
    <div className="container mt-5">
      <Canvas style={{ height: '100vh', background: '#eee' }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={1} />
        <Suspense fallback={null}>
          <Model path="/3d/plane.gltf" />
          <Environment preset="dawn" background /> {/* realistic environment: dawn/park,  */}
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
}
