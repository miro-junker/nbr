export type TPos = [number, number, number]

export type TGameState = {
    planePosX: 0,
    planeRotationX: 0,
    parachutePos: TPos
}

export const initGameState: TGameState = {
    planePosX: 0,
    planeRotationX: 0,
    parachutePos: [20, 0, 40]
}
