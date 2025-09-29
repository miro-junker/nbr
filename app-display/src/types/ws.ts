export type TiltPacket = {
  type: "tilt";
  a: number;
  b: number;
  c: number;
};

export type WebSocketPacket =
  | TiltPacket
;