import React from 'react';
import { useNotifications } from '../hooks/useNotifications';

const NotificationDropdown = ({ userId }) => {
  const { notifications } = useNotifications(userId);

  return (
    <div className="dropdown">
      <button>🔔 Notifications ({notifications.length})</button>
      <ul>
        {notifications.length === 0 ? (
          <li>No notifications</li>
        ) : (
          notifications.map((n, i) => (
            <li key={n._id || i}>{n.message}</li>
          ))
        )}
      </ul>
    </div>
  );
};

export default NotificationDropdown;
