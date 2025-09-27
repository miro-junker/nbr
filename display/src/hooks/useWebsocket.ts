import { useEffect, useState, useRef } from 'react';

const URL_WS = 'wss://nobrakes.cz/?role=display'

export function useWebSocket() {
  const [lastMessage, setLastMessage] = useState<any>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(URL_WS);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      console.log('Received:', event.data);
      if (event.data instanceof Blob) {
          const reader = new FileReader();
          reader.onload = () => {
              setLastMessage(reader.result);
              console.log("📩 Message: " + reader.result);
            };
            reader.readAsText(event.data); // Convert Blob to text
        } else {
            setLastMessage(event.data);
            console.log("📩 Message: " + event.data);
        }
        
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
    };

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = (msg: string) => {
    wsRef.current?.send(msg);
  };

  return { lastMessage, sendMessage };
}
