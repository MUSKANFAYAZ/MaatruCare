import React, { useState } from 'react';
import axios from 'axios';
import { FaWhatsapp, FaCalendarAlt, FaClock, FaTimes } from 'react-icons/fa';
import './BookAppointmentModal.css';

const BookAppointmentModal = ({ isOpen, onClose, doctor }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !doctor) return null;

  const handleConfirm = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      // --- 1. SAVE TO DATABASE & CREATE NOTIFICATION ---
      if (token) {
        try {
          // A. Save the Appointment
          await axios.post('http://localhost:5000/api/appointments/book', {
            // FIX: Use _id (MongoDB standard) or fallback to id
            doctorId: doctor._id || doctor.id, 
            date,
            time
          }, { headers: { Authorization: `Bearer ${token}` } });

          console.log("Notification saved successfully!");

        } catch (err) {
          console.warn("Backend save failed (API might be down), but opening WhatsApp anyway.", err);
        }
      }

      // --- 2. OPEN WHATSAPP ---
      const rawPhone = doctor.phone ? doctor.phone.replace(/\D/g, '') : "9199999999"; 
      const message = `Hello ${doctor.name}, I would like to book an appointment on ${date} at ${time}. - via MaatruCare`;
      const whatsappUrl = `https://wa.me/${rawPhone}?text=${encodeURIComponent(message)}`;
      
      window.open(whatsappUrl, '_blank');
      
      // --- 3. CLOSE MODAL ---
      setLoading(false);
      onClose();

    } catch (err) {
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="appt-modal-overlay">
      <div className="appt-modal-content">
        <button className="appt-close-btn" onClick={onClose}><FaTimes /></button>
        
        <div className="appt-header">
            <div className="appt-icon-circle">
                <FaWhatsapp />
            </div>
            <h2>Book Appointment</h2>
            <p>with <strong>{doctor.name}</strong></p>
        </div>

        <form onSubmit={handleConfirm}>
            <div className="appt-input-group">
                <label><FaCalendarAlt /> Select Date</label>
                <input 
                    type="date" 
                    required 
                    min={new Date().toISOString().split('T')[0]} 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </div>

            <div className="appt-input-group">
                <label><FaClock /> Select Time</label>
                <input 
                    type="time" 
                    required 
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                />
            </div>

            <button type="submit" className="appt-confirm-btn" disabled={loading}>
                {loading ? 'Processing...' : 'Confirm & Open WhatsApp'}
            </button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointmentModal;