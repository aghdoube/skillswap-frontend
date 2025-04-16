import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const socket = io(API_URL, {
  transports: ['websocket'], 
  withCredentials: true,
});

export function useNotifications(userId) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!userId) return;
    axios.get(`${API_URL}/api/notifications/${userId}`)
      .then(res => setNotifications(res.data))
      .catch(err => console.error(err));
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    socket.emit('joinRoom', userId);

    socket.on('getNotification', (data) => {
      setNotifications(prev => [data, ...prev]);
    });

    return () => {
      socket.off('getNotification');
      socket.disconnect();
    };
  }, [userId]);

  const sendNotification = (receiverId, type, message) => {
    socket.emit('sendNotification', {
      senderId: userId,
      receiverId,
      type,
      message,
    });
  };

  return { notifications, sendNotification };
}
