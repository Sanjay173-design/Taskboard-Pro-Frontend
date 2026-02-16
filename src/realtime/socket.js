const WS_URL = import.meta.env.VITE_WS_URL;

let socket = null;
let listeners = [];

export function initRealtime() {
  if (socket && socket.readyState === WebSocket.OPEN) {
    return socket;
  }

  console.log("🌐 Creating WS connection");

  socket = new WebSocket(WS_URL);

  socket.onopen = () => {
    console.log("✅ Realtime connected");
  };

  socket.onmessage = (e) => {
    console.log("🔥 WS RAW MESSAGE ARRIVED", e.data);

    try {
      const data = JSON.parse(e.data);

      // Notify ALL listeners
      listeners.forEach((cb) => cb(data));
    } catch (err) {
      console.warn("Invalid WS message", e.data);
    }
  };

  socket.onclose = () => {
    console.log("❌ WS disconnected");

    setTimeout(() => {
      initRealtime();
    }, 3000);
  };

  return socket;
}

export function subscribeRealtime(callback) {
  listeners.push(callback);

  return () => {
    listeners = listeners.filter((cb) => cb !== callback);
  };
}
