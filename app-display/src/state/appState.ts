import type { TAppState } from '@/types'
import { SPEED_MIN } from '@/config/game'


export const initialAppState: TAppState = {
    loggedIn: false,
    done: false,
    username: '',
    score: 0,
    fuel: 1,
    speed: SPEED_MIN,
};
