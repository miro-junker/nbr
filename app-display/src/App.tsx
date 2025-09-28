import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Suspense } from 'react';
import { useWebSocket } from './hooks/useWebsocket';
import { Plane, TiltVisualizer } from './components/index.ts';
import { useCameraAngle } from './hooks/index.ts';


export default function App() {
  const { lastMessage } = useWebSocket();
  useCameraAngle(lastMessage);

  
  return (
    <div className="container mt-5">
      <TiltVisualizer {...lastMessage} />
      <Canvas style={{ height: '100vh' }} camera={{ position: [0, 4, -20], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={1} />
        <Suspense fallback={null}>
          <Plane />
          <Environment files="3d/hdri_1k.hdr" background />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
}
