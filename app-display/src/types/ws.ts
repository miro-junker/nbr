export type TPacketTilt = {
    type: "tilt"
    a: number
    b: number
    c: number
};

export type TPacketLogin = {
    username: string
}

export type WebSocketPacket =
    | TPacketTilt
    | TPacketLogin
