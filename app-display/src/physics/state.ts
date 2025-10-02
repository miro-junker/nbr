import type { TGameState } from '../types';


export const initGameState: TGameState = {
    planePosX: 0,
    planeRotationX: 0,
    parachutePos: [5, 0, 40]
}

export const COLLISION_DISTANCE = 3;