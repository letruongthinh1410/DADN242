import React, { createContext, useContext, useRef, useState, useCallback } from "react";

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const socketsRef = useRef({});
  const [deviceData, setDeviceData] = useState({});
  const [version, setVersion] = useState(0);

  const initWebSockets = useCallback((deviceKeys) => {
    (Array.isArray(deviceKeys) ? deviceKeys : []).forEach((key) => {
      if (socketsRef.current[key]) return;

      const token = localStorage.getItem("accessToken");
      const query = `key=${key}&token=${token}`;
      const ws = new WebSocket(`ws://localhost:8080/ws?${query}`);

      ws.onopen = () => {
        console.log(`✅ WebSocket connected for ${key}`);
      };

      ws.onerror = (err) => {
        console.error(`❌ WebSocket error for ${key}:`, err);
      };

      ws.onclose = () => {
        console.log(`🛑 WebSocket closed for ${key}`);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const [plantKey, sensorKey] = key.split(".");

          setDeviceData((prev) => ({
            ...prev,
            [plantKey]: {
              ...(prev[plantKey] || {}),
              [sensorKey]: data,
            },
          }));

          setVersion((prev) => prev + 1);
        } catch (err) {
          console.error(`❌ Error parsing message from ${key}:`, err);
        }
      };

      socketsRef.current[key] = ws;
    });
  }, []);

  const checkConnect = useCallback((deviceKey) => {
    const socket = socketsRef.current[deviceKey];
    return socket?.readyState === WebSocket.OPEN;
  }, []);

  const sendToDevice = useCallback((deviceKey, value) => {
    const socket = socketsRef.current[deviceKey];
    if (socket?.readyState === WebSocket.OPEN) {
      const msg = JSON.stringify({ value });
      console.log(`📤 Sending to ${deviceKey}:`, msg);
      socket.send(msg);
    }
  }, []);

  const closeAll = useCallback(() => {
    Object.values(socketsRef.current).forEach((ws) => ws.close());
    socketsRef.current = {};
  }, []);

  return (
    <WebSocketContext.Provider
      value={{
        deviceData,
        initWebSockets,
        sendToDevice,
        closeAll,
        checkConnect,
        version
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
