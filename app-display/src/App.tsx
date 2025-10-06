import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense, useState, useRef } from 'react'
import { useWebSocket } from '@/hooks'
import { ScreenLogin, SteeringVisualizer, Game, Score, Username, Sound, ScreenIntro, ScreenGameOver, Gauges } from '@/components'
import { initialAppState } from '@/state/appState'
import { initialSteering } from '@/physics/steering'
import type { TSteering } from '@/types'
import soundAirplane from '@/sounds/airplane.mp3'
import './components/ScreenGame.css'


export default function App() {
    const [initialized, setInitialized] = useState(false)
    const [appState, setAppState] = useState(initialAppState)
    const refSteering = useRef<TSteering>(initialSteering)
    const refCamera = useRef(null)
    useWebSocket(refSteering, setAppState)

    if (!initialized) return <ScreenIntro onStart={() => setInitialized(true)} />
    if (appState.done) return <ScreenGameOver appState={appState} setAppState={setAppState} />
    if (appState.loggedIn === false) return <ScreenLogin />
    
    return (
        <div className='screen-game'>
            <div className='screen-game__score'>
                <Score state={appState} />
            </div>
            <Gauges appState={appState} />
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
            <Sound src={soundAirplane} autoplay />
        </div>
    );
}
