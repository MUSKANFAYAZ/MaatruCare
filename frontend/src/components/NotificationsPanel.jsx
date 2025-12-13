import React, { useState, useEffect } from 'react';

const NotificationsPanel = ({ notifications }) => {
  const [notifList, setNotifList] = useState([]);

  useEffect(() => {
    setNotifList(notifications || []);
  }, [notifications]);

  const removeNotification = (id) => {
    setNotifList(notifList.filter(n => n.id !== id));
  };

  return (
    <div className="notifications-panel">
      {notifList.length === 0 ? (
        <div className="no-notifications">
          <p>📭 No new notifications</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifList.slice(0, 5).map((notif) => (
            <div key={notif.id} className={`notification-item notification-${notif.type}`}>
              <span className="notif-icon">
                {notif.type === 'message' ? '💬' : '📧'}
              </span>
              <div className="notif-content">
                <p className="notif-title">{notif.title}</p>
                <p className="notif-message">{notif.message}</p>
                <p className="notif-time">{notif.time}</p>
              </div>
              <button 
                className="notif-close"
                onClick={() => removeNotification(notif.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPanel;