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
        // Plane updates
        const newPlaneRotX = getPlaneRotX(refGameState.current, refSteering.current, delta)
        const newPlaneRotY = getPlaneRotY(refGameState.current, refSteering.current, delta)
        const newPlanePosX = getPlanePosX(refGameState.current, newPlaneRotX, delta)
        const newPlanePosY = getPlanePosY(refGameState.current, newPlaneRotY, delta)
        setPlaneMesh(newPlaneRotX, newPlaneRotY, newPlanePosX, newPlanePosY)

        // Parachute updates
        const PLANE_SPEED = 2
        const parachutePos = refGameState.current.parachutePos
        const newParachuteZ = parachutePos[2] - (delta * PLANE_SPEED)
        let newParachutePos: TPos = [parachutePos[0], parachutePos[1], newParachuteZ]
        refParachute.current?.position.set(parachutePos[0], parachutePos[1], newParachuteZ)

        const respawnParachute = () => {
            newParachutePos = getNewParachutePosition()
            refParachute.current?.position.set(...newParachutePos)
        }

        // Collision detection
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

        // Missed parachute
        if (newParachuteZ < -16) {
            playSFX('loss')
            respawnParachute()
        }

        // Update game state
        refGameState.current = {
            fuel: 1, // todo
            speed: 1, // todo
            planeRotX: newPlaneRotX,
            planeRotY: newPlaneRotY,
            planePosX: newPlanePosX,
            planePosY: newPlanePosY,
            parachutePos: newParachutePos,
            appStateLastUpdate: refGameState.current.appStateLastUpdate + delta,
        }

        // Update app state every x seconds
        if (refGameState.current.appStateLastUpdate >= REFRESH_RATE_APPSTATE) {
            setAppState(prev => ({
                ...prev,
                fuel: refGameState.current.fuel,
                gaugeSpeed: getGaugeSpeed(refGameState.current.speed),
            }))
            refGameState.current.appStateLastUpdate = 0
        }
    })

    return (
        <>
            <Plane
                ref={refPlane}
                turnX={0}
                turnY={0}
                posX={0}
                posY={0}
            />
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
