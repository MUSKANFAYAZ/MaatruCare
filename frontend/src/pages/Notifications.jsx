import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBell, FaArrowLeft, FaCalendarCheck, FaInfoCircle, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/notifications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(res.data);
      } catch (err) {
        console.error("Error fetching notifications", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <div className="doctor-notif-page">
      {/* --- FLOATING CARD CONTAINER --- */}
      <div className="notif-floating-card">
        
        {/* RED HEADER (Matches My Profile Image) */}
        <div className="doctor-notif-header">
          <div className="header-left">
            <button className="doctor-back-btn" onClick={() => navigate(-1)}>
              <FaArrowLeft />
            </button>
            <h1 className="header-title">Your Notifications</h1>
          </div>
          
          {/* Optional Right Button (Like 'Edit' in your screenshot) */}
          <button className="header-action-btn">
            <FaTrash /> Clear
          </button>
        </div>

        {/* CONTENT */}
        <div className="doctor-notif-content">
          {loading ? (
            <div className="loading-state">Checking for updates...</div>
          ) : notifications.length === 0 ? (
            
            /* EMPTY STATE */
            <div className="doctor-empty-state">
              <div className="empty-bell-circle">
                 <FaBell />
              </div>
              <h3>No notifications yet</h3>
              <p>We'll notify you when you have new appointments.</p>
            </div>

          ) : (
            
            /* LIST */
           <div className="doctor-notif-list">
  {notifications.map((notif) => {
    // Check if it's an appointment to choose the right style
    const isAppointment = notif.message.toLowerCase().includes('appointment');
    
    return (
      <div 
        key={notif._id} 
        className={`doctor-notif-card ${isAppointment ? 'success' : 'info'}`}
      >
        {/* ICON */}
        <div className="notif-icon-box">
           {isAppointment ? <FaCalendarCheck /> : <FaInfoCircle />}
        </div>

        {/* TEXT CONTENT */}
        <div className="notif-text-content">
          {/* Fake Title based on type */}
          <span className="notif-title">
            {isAppointment ? "New Appointment Request" : "Notification"}
          </span>
          
          <p className="notif-main-msg">{notif.message}</p>
          
          <span className="notif-timestamp">
            <FaClock style={{ fontSize: '10px' }}/> 
            {new Date(notif.createdAt).toLocaleString()}
          </span>
        </div>
      </div>
    );
  })}
</div>
          )}
        </div>
      
      </div>
    </div>
  );
};

export default Notifications;