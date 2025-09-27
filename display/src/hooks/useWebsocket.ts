import { useEffect, useState, useRef } from 'react';

const URL_WS = 'wss://nobrakes.cz/?role=display';

export function useWebSocket() {
  const [lastMessage, setLastMessage] = useState<any>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const connectedRef = useRef(false); // track if connection was established

  useEffect(() => {
    // If already connected, skip creating a new WebSocket
    if (connectedRef.current) return;

    const ws = new WebSocket(URL_WS);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
      connectedRef.current = true;
    };

    const processMessage = (message: string) => {
      try {
        const parsed = JSON.parse(message);
        if (parsed.type === 'tilt') {
          setLastMessage(parsed);
        }
      } catch (err) {
        console.warn('⚠️ Received non-JSON message:', message);
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
      console.log('WebSocket disconnected');
      wsRef.current = null;
      connectedRef.current = false;
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
    };

    // Cleanup: close only if this was the active connection
    return () => {
      if (wsRef.current === ws) {
        ws.close();
        wsRef.current = null;
        connectedRef.current = false;
      }
    };
  }, []);

  const sendMessage = (msg: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(msg);
    } else {
      console.warn('WebSocket is not open. Cannot send message.');
    }
  };

  return { lastMessage, sendMessage };
}
