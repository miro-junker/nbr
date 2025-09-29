export type TiltMessage = {
  type: "tilt";
  a: number;
  b: number;
  c: number;
};

export type WebSocketMessage =
  | TiltMessage
;