import type { TPacketTilt, TSteering } from "@/types";


function getSteeringHorizontal(angle: number): number {
    if (angle <= -45) return -1;  // max right
    if (angle >= 45) return 1;    // max left
    return angle / 45;
}

function getSteeringVertical(angle: number): number {
    if (angle >= 45) return 1    // max up
    if (angle <= -45) return -1  // max down
    return angle / 45
}


export const getSteeringValues = (packet: TPacketTilt): TSteering => {
    return {
        horizontal: getSteeringHorizontal(packet.c),
        vertical: getSteeringVertical(packet.b),
        ...packet,
    }
}
