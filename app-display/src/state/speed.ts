import { TOP_SPEED_COEF } from '@/physics/state'


export const getGaugeSpeed = (speedCoef: number) => {
    return (speedCoef - 1) * TOP_SPEED_COEF;
}
