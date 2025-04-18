import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export function useNotifications(userId) {
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null); 

  useEffect(() => {
    if (!userId) return;

    const newSocket = io(API_URL, {
      transports: ['websocket'],
      withCredentials: true,
      auth: {
        token: localStorage.getItem('authToken') 
      }
    });

    newSocket.on('connect', () => {
      console.log('WebSocket connected');
      newSocket.emit('joinRoom', userId);
    });

    newSocket.on('connect_error', (err) => {
      console.error('Connection error:', err);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    const token = localStorage.getItem('authToken');
    axios.get(`${API_URL}/api/notifications/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true
    })
    .then(res => setNotifications(res.data))
    .catch(console.error);
  }, [userId]);

  useEffect(() => {
    if (!socket) return;

    const notificationHandler = (data) => {
      setNotifications(prev => [data, ...prev]);
    };

    socket.on('getNotification', notificationHandler);

    return () => {
      socket.off('getNotification', notificationHandler);
    };
  }, [socket]);

  const sendNotification = (receiverId, type, message) => {
    if (socket) {
      socket.emit('sendNotification', {
        senderId: userId,
        receiverId,
        type,
        message
      });
    }
  };

  return { notifications, sendNotification };
}