import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { Plane, Parachute } from '.'
import * as THREE from 'three'
import { initGameState, COLLISION_DISTANCE } from '@/physics/state'
import type { TSteering, TGameState, TPos, TAppState } from '@/types'
import { getPlaneRotX, getPlaneRotY, getPlanePosX, getPlanePosY } from '@/physics/plane'
import { getNewParachutePosition } from '@/physics/parachute'
import { PLANE_MODEL_TILT_Y_COEF, PLANE_MODEL_TILT_Y_OFFSET, SKY_ROTATION, SKY_HDRI, REFRESH_RATE_APPSTATE } from '@/config/render'
import { getGaugeSpeed } from '@/state/speed'
import { DURATION_FUEL } from '@/config/game'
import { useSFX } from '@/hooks'


interface IGame {
    refSteering: React.RefObject<TSteering>
    setAppState: React.Dispatch<React.SetStateAction<TAppState>>
}


export function Game({ refSteering, setAppState }: IGame) {
    const refPlane = useRef<THREE.Object3D>(null)
    const refParachute = useRef<THREE.Group>(null)
    const refGameState = useRef<TGameState>(initGameState)

    const playSFX = useSFX()

    const posPlane = new THREE.Vector3()
    const posParachute = new THREE.Vector3()

    const setPlaneMesh = (rotX: number, rotY: number, posX: number, posY: number) => {
        refPlane.current?.rotation.set((-rotY * PLANE_MODEL_TILT_Y_COEF) + PLANE_MODEL_TILT_Y_OFFSET, 0, rotX)
        refPlane.current?.position.set(-posX, posY, 0)
    }

    useFrame((_, delta) => {
        const gs = refGameState.current

        // --- Plane updates ---
        const newPlaneRotX = getPlaneRotX(gs, refSteering.current, delta)
        const newPlaneRotY = getPlaneRotY(gs, refSteering.current, delta)
        const newPlanePosX = getPlanePosX(gs, newPlaneRotX, delta)
        const newPlanePosY = getPlanePosY(gs, newPlaneRotY, delta)
        setPlaneMesh(newPlaneRotX, newPlaneRotY, newPlanePosX, newPlanePosY)

        // --- Increase speed over time ---
        const SPEED_INCREMENT_PER_SECOND = 0.5 // adjust as needed
        const newSpeed = gs.speed + (SPEED_INCREMENT_PER_SECOND * delta)

        // --- Parachute updates ---
        const newParachuteZ = gs.parachutePos[2] - (delta * newSpeed)
        let newParachutePos: TPos = [gs.parachutePos[0], gs.parachutePos[1], newParachuteZ]
        refParachute.current?.position.set(...newParachutePos)

        const respawnParachute = () => {
            newParachutePos = getNewParachutePosition()
            refParachute.current?.position.set(...newParachutePos)
        }

        // --- Collision detection ---
        if (refPlane.current && refParachute.current) {
            refPlane.current.getWorldPosition(posPlane)
            refParachute.current.getWorldPosition(posParachute)
            const distance = posPlane.distanceTo(posParachute)
            if (distance < COLLISION_DISTANCE) {
                playSFX('hey')
                setAppState(prev => ({ ...prev, score: prev.score + 1 }))
                respawnParachute()
            }
        }

        // --- Missed parachute ---
        if (newParachuteZ < -16) {
            playSFX('loss')
            respawnParachute()
        }

        // --- Fuel consumption ---
        const fuelDecrementPerSecond = 1 / DURATION_FUEL
        const newFuel = Math.max(gs.fuel - (fuelDecrementPerSecond * delta), 0)

        // --- Update game state ---
        refGameState.current = {
            fuel: newFuel,
            speed: newSpeed,
            planeRotX: newPlaneRotX,
            planeRotY: newPlaneRotY,
            planePosX: newPlanePosX,
            planePosY: newPlanePosY,
            parachutePos: newParachutePos,
            appStateLastUpdate: gs.appStateLastUpdate + delta,
        }

        // --- Update app state every x seconds ---
        if (gs.appStateLastUpdate >= REFRESH_RATE_APPSTATE) {
            setAppState(prev => ({
                ...prev,
                fuel: gs.fuel,
                done: gs.fuel <= 0,
                gaugeSpeed: getGaugeSpeed(gs.speed),
            }))
            gs.appStateLastUpdate = 0
        }
    })

    return (
        <>
            <Plane ref={refPlane} />
            <Parachute
                ref={refParachute}
                position={initGameState.parachutePos}
            />
            <Environment
                files={SKY_HDRI}
                backgroundRotation={[0, SKY_ROTATION, 0]}
                background
            />
        </>
    )
}
