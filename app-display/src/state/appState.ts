import type { TAppState } from '@/types'


export const initialAppState: TAppState = {
    loggedIn: false,
    done: false,
    username: '',
    score: 0,
    fuel: 1,
    gaugeSpeed: 0,
};
