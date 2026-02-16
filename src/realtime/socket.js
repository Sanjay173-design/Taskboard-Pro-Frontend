export function connectRealtime(onMessage) {
  console.log("CONNECT REALTIME CALLED"); // ⭐ ADD THIS

  const ws = new WebSocket(
    "wss://j4b1byke9c.execute-api.eu-north-1.amazonaws.com/dev",
  );

  ws.onopen = () => {
    console.log("Realtime connected");
  };

  ws.onmessage = (msg) => {
    console.log("Realtime event:", msg.data);
    onMessage?.(msg.data);
  };

  ws.onerror = (e) => {
    console.error("Realtime WS error", e);
  };

  ws.onclose = () => {
    console.log("Realtime disconnected");
  };

  return ws;
}
