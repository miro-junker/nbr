import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { Plane, Parachute } from '.'
import * as THREE from 'three'
import { initGameState, COLLISION_DISTANCE } from '@/physics/state'
import type { TSteering, TGameState, TPos, TAppState } from '@/types'
import { getPlaneRotX, getPlaneRotY, getPlanePosX, getPlanePosY } from '@/physics/plane'
import { PLANE_MODEL_TILT_Y_COEF, PLANE_MODEL_TILT_Y_OFFSET, SKY_ROTATION, SKY_HDRI } from '@/config/render'
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
        const newParachuteZ = refGameState.current.parachutePos[2] - delta * 2
        let newParachutePos: TPos = [5, 0, newParachuteZ]
        refParachute.current?.position.set(5, 0, newParachuteZ)

        // Collision detection
        if (refPlane.current && refParachute.current) {
            refPlane.current.getWorldPosition(posPlane)
            refParachute.current.getWorldPosition(posParachute)
            const distance = posPlane.distanceTo(posParachute)
            if (distance < COLLISION_DISTANCE) {
                playSFX('hey')
                setAppState(prev => ({...prev, score: prev.score + 1}))
                // Create new parachutist
                newParachutePos = [ 5, 0, 40 ]
                refParachute.current.position.set(...newParachutePos)
            }
        }

        // Update game state
        refGameState.current = {
            parachutePos: newParachutePos,
            planeRotX: newPlaneRotX,
            planeRotY: newPlaneRotY,
            planePosX: newPlanePosX,
            planePosY: newPlanePosY,
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
                backgroundRotation={[0, SKY_ROTATION*Math.PI, 0]}
                background
            />
        </>
    )
}
