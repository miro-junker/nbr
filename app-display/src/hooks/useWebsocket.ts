import { useEffect, useState, useRef } from 'react';
import { getSteeringValues } from '../utils/sensor';
import type { TSteering } from '../types/steering';
import { WS_URL, WS_RECONNECT_DELAY } from '../config/server';

export function useWebSocket() {
  const [steering, setSteering] = useState<TSteering>({ horizontal: 0 });
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);

  const connect = () => {
    // Avoid opening multiple connections
    if (wsRef.current) return;

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    const processMessage = (message: string) => {
      try {
        const parsed = JSON.parse(message);
        if (parsed.type === 'tilt') {
          setSteering({
            ...getSteeringValues(parsed),
            ...parsed
          });
        }
      } catch (err) {
        console.warn('Received non-JSON message:', message);
      }
    };

    ws.onmessage = async (event) => {
      if (event.data instanceof Blob) {
        const text = await event.data.text();
        processMessage(text);
      } else {
        processMessage(event.data);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected, scheduling reconnect...');
      wsRef.current = null;
      scheduleReconnect();
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
      ws.close(); // triggers onclose and reconnect
    };
  };

  const scheduleReconnect = (delay = WS_RECONNECT_DELAY) => {
    if (reconnectTimeoutRef.current) return;
    reconnectTimeoutRef.current = setTimeout(() => {
      reconnectTimeoutRef.current = null;
      connect();
    }, delay);
  };

  useEffect(() => {
    connect();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !wsRef.current) {
        console.log('Page visible, reconnecting WebSocket immediately...');
        connect();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const sendMessage = (msg: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(msg);
    } else {
      console.warn('WebSocket is not open. Cannot send message.');
    }
  };

  return { steering, sendMessage };
}
