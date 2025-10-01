import type { TiltPacket } from "../types/ws";


function getSteeringHorizontal(angle: number): number {
    if (angle <= 45) return 1;    // max right
    if (angle >= 135) return -1;  // max left
    return -(angle - 90) / 45;
}


export const getSteeringValues = (message: TiltPacket) => {
    return {
        horizontal: getSteeringHorizontal(message.b),
    }
}
