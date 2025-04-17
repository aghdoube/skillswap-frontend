import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL.replace("http://", "wss://"));

const Socket = () => {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to the backend via WebSocket!");
    });

    socket.on("message", (data) => {
      console.log("Received message:", data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return <div>Socket.io Connection</div>;
};

export default Socket;
