import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Suspense } from 'react';
import { useWebSocket } from './hooks';
import { Plane, SteeringVisualizer, Parachute } from './components/index.ts';


export default function App() {
  const { steering } = useWebSocket();
  
  return (
    <div className="container mt-5">
      <SteeringVisualizer {...steering} />
      <Canvas style={{ height: '100vh' }} camera={{ position: [0, 4, -20], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={1} />
        <Suspense fallback={null}>
          <Plane
            turnX={steering.horizontal}
            turnY={0}
            posX={0}
            posY={0}
          />
          <Parachute
            positionX={10}
            positionY={0}
            positionZ={40}
          />
          <Environment files="3d/hdri_1k.hdr" background />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
}
