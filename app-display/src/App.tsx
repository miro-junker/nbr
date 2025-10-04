import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense, useState, useRef } from 'react';
import { useWebSocket } from './hooks';
import { LoginScreen, SteeringVisualizer, Game, Score, Username } from './components';
import { initialAppState } from './state/appState';
import { initialSteering } from './physics/steering';
import type { TSteering } from './types';
import { DEBUG } from './config/main';


export default function App() {
  const [appState, setAppState] = useState(initialAppState)
  const refSteering = useRef<TSteering>(initialSteering)
  const refCamera = useRef(null)
  useWebSocket(refSteering, setAppState);

  if (!DEBUG && appState.loggedIn === false) return <LoginScreen />
  
  return (
    <div className="container mt-5">
      <Score state={appState} />
      <SteeringVisualizer refSteering={refSteering} />
      <Canvas
        ref={refCamera}
        style={{ height: '100vh' }}
        camera={{ position: [0, 4, -20], fov: 50 }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={1} />
        <Suspense fallback={null}>
          <Game refSteering={refSteering} setAppState={setAppState} />
        </Suspense>
        <OrbitControls />
      </Canvas>
      <Username name={appState.username} />
    </div>
  );
}
