import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import { useWebSocket } from './hooks';
import { SteeringVisualizer } from './components';
import { Game } from './components/Game';
import { initialSteering } from './physics/steering';
import type { TSteering } from './types';


export default function App() {
  const refSteering = useRef<TSteering>(initialSteering)
  useWebSocket(refSteering);
  
  return (
    <div className="container mt-5">
      {/*<SteeringVisualizer {...steering} />*/}
      <Canvas style={{ height: '100vh' }} camera={{ position: [0, 4, -20], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={1} />
        <Suspense fallback={null}>
          <Game refSteering={refSteering} />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
}
