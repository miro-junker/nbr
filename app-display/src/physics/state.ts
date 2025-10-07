import type { TGameState } from '@/types'
import { SPEED_MIN } from '@/config/game'


export const initGameState: TGameState = {
    fuel: 1,
    speed: SPEED_MIN,
    planePosX: 0,
    planePosY: 0,
    planeRotX: 0,
    planeRotY: 0,
    parachutePos: [5, 0, 40],

    appStateLastUpdate: 0,
}

export const COLLISION_DISTANCE = 3
