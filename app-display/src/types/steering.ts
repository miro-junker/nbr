export type TSteering = {
    horizontal: number // -1 (left) to 1 (right)
    vertical: number   // -1 (down) to 1 (up)

    // raw sensor data
    a: number          
    b: number
    c: number
}
