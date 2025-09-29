import type { WebSocketMessage } from "../types/ws"
import { getControlsValues } from "../utils/sensor"

export const useMessage = (message: WebSocketMessage) => {


    switch (message?.type) {
        case 'tilt':
            getControlsValues(message)
            break
    }


}