import type { TGameState, TSteering } from '../types';


const PLANE_ROTATION_INERTIA = 0.25;


export const getPlaneRotation = (gameState: TGameState, steering: TSteering, delta: number) => {
    const calculated = gameState.planeRotationX + steering.horizontal * (delta * PLANE_ROTATION_INERTIA)
    if (calculated >= 1) return 1
    if (calculated <= -1) return -1
    return calculated
}
