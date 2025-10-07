import type { TPos } from '@/types'


const DISTANCE = 40
const MAX_OFFSET_X = 5
const MAX_OFFSET_UP = 4
const MAX_OFFSET_DOWN = 2


export const getNewParachutePosition = (): TPos => {
    const x = Math.random() * 2 * MAX_OFFSET_X - MAX_OFFSET_X

    // Y should be between -MAX_OFFSET_DOWN and +MAX_OFFSET_UP
    const y = Math.random() * (MAX_OFFSET_UP + MAX_OFFSET_DOWN) - MAX_OFFSET_DOWN

    return [x, y, DISTANCE]
}
