import type { TGameState, TSteering } from '../types';


const PLANE_ROTATION_X_INERTIA = 0.5;
const PLANE_ROTATION_Y_INERTIA = 0.5
const PLANE_HORIZONTAL_SPEED = 10;
const PLANE_VERTICAL_SPEED = 10;
const MAX_OFFSET_X = 17.5;
const MAX_OFFSET_Y = 9.5;


export const getPlaneRotX = (gameState: TGameState, steering: TSteering, delta: number) => {
    const calculated = gameState.planeRotationX + steering.horizontal * (delta * PLANE_ROTATION_X_INERTIA)
    if (calculated >= 1) return 1
    if (calculated <= -1) return -1
    return calculated
}

export const getPlanePosX = (gameState: TGameState, newPlaneRotX: number, delta: number) => {
    const calculated = gameState.planePosX + newPlaneRotX * delta * PLANE_HORIZONTAL_SPEED
    if (calculated >= MAX_OFFSET_X) return MAX_OFFSET_X
    if (calculated <= -MAX_OFFSET_X) return -MAX_OFFSET_X
    return calculated
}

export const getPlaneRotY = (gameState: TGameState, steering: TSteering, delta: number) => {
    const calculated = gameState.planeRotationY + steering.vertical * (delta * PLANE_ROTATION_Y_INERTIA)
    if (calculated >= 1) return 1
    if (calculated <= -1) return -1
    return calculated
}

export const getPlanePosY = (gameState: TGameState, newPlaneRotY: number, delta: number) => {
    const calculated = gameState.planePosY + newPlaneRotY * delta * PLANE_VERTICAL_SPEED
    if (calculated >= MAX_OFFSET_Y) return MAX_OFFSET_Y
    if (calculated <= -MAX_OFFSET_Y) return -MAX_OFFSET_Y
    return calculated
}