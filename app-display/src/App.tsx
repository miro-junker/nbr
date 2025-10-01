import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import { useWebSocket } from './hooks';
import { SteeringVisualizer } from './components/index.ts';
import Game from './components/Game.tsx';


export default function App() {
  const { steering } = useWebSocket();
  
  return (
    <div className="container mt-5">
      <SteeringVisualizer {...steering} />
      <Canvas style={{ height: '100vh' }} camera={{ position: [0, 4, -20], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={1} />
        <Suspense fallback={null}>
          <Game steering={steering} />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
}
