import React, { useState } from 'react';
import { useNotifications } from './useNotifications';

const NotificationDropdown = ({ userId }) => {
  const { notifications } = useNotifications(userId);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)}>
        <i className="fas fa-bell text-white" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded shadow-lg z-50">
          <ul className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <li className="p-2 text-gray-500 text-sm text-center">No notifications</li>
            ) : (
              notifications.map((n, i) => (
                <li key={n._id || i} className="p-2 text-sm text-gray-800 hover:bg-gray-100">
                  {n.message}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
