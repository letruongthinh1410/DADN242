import React, { createContext, useContext, useRef, useState } from "react";

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const socketsRef = useRef({});
  const [deviceData, setDeviceData] = useState({});
  const [deviceHistory, setDeviceHistory] = useState({});
  const [version, setVersion] = useState(0);

  const initWebSockets = (deviceKeys, token) => {
    (Array.isArray(deviceKeys) ? deviceKeys : []).forEach((key) => {
      if (socketsRef.current[key]) return;

      const query = `key=${key}&token=${token}`;
      const ws = new WebSocket(`ws://localhost:8080/ws?${query}`);

      ws.onopen = () => {
        console.log(`✅ WebSocket connected for ${key}`);
      };

      ws.onerror = (err) => {
        console.error(`WebSocket error for ${key}:`, err);
      };

      ws.onclose = () => {
        console.log(`WebSocket closed for ${key}`);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const [plantKey, sensorKey] = key.split("."); // VD: ["cay-tao", "temp"]
      
          // ✅ Cập nhật deviceData
          setDeviceData((prev) => {
            const newPlantData = {
              ...(prev[plantKey] || {}),
              [sensorKey]: data,
            };
          
            return {
              ...prev,
              [plantKey]: newPlantData, // <- new object reference
            };
          });
          
          // ✅ Cập nhật deviceHistory
          setDeviceHistory((prev) => ({
            ...prev,
            [plantKey]: {
              ...(prev[plantKey] || {}),
              [sensorKey]: [
                ...((prev[plantKey]?.[sensorKey]) || []).slice(-49),
                data,
              ]
            }
          }));

          setVersion((prev) => prev + 1);

        } catch (err) {
          console.error(`❌ Error parsing message from ${key}`, err);
        }
      };
      
      
      socketsRef.current[key] = ws;
    });
  };

  const checkConnect = (deviceKey) => {
    const socket = socketsRef.current[deviceKey];
    if (socket && socket.readyState === WebSocket.OPEN) return true
    return false
  }

  const sendToDevice = (deviceKey, value) => {
    const socket = socketsRef.current[deviceKey];
    if (socket && socket.readyState === WebSocket.OPEN) {
      const msg = JSON.stringify({ value });
      console.log(msg)
      socket.send(msg);
    }
  };

  const closeAll = () => {
    Object.values(socketsRef.current).forEach((ws) => ws.close());
    socketsRef.current = {};
  };

  return (
    <WebSocketContext.Provider value={{ version, deviceData, deviceHistory, initWebSockets, sendToDevice, closeAll, checkConnect }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
