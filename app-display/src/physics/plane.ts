import type { TGameState, TSteering } from '../types';


const PLANE_ROTATION_INERTIA = 0.5;
const PLANE_HORIZONTAL_SPEED = 10;
const MAX_OFFSET_X = 17.5;


export const getPlaneRotation = (gameState: TGameState, steering: TSteering, delta: number) => {
    const calculated = gameState.planeRotationX + steering.horizontal * (delta * PLANE_ROTATION_INERTIA)
    if (calculated >= 1) return 1
    if (calculated <= -1) return -1
    return calculated
}

export const getPlanePositionX = (gameState: TGameState, newPlaneRotationX: number, delta: number) => {
    const calculated = gameState.planePosX + newPlaneRotationX * delta * PLANE_HORIZONTAL_SPEED
    if (calculated >= MAX_OFFSET_X) return MAX_OFFSET_X
    if (calculated <= -MAX_OFFSET_X) return -MAX_OFFSET_X
    return calculated
}
