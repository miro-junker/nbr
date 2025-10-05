export type TPos = [number, number, number]

export type TGameState = {
    fuel: number,
    speed: number,
    planePosX: number,
    planePosY: number,
    planeRotX: number,
    planeRotY: number,
    parachutePos: TPos,
}
