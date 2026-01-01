import React from 'react';
import { FaStar, FaMapMarkerAlt, FaGraduationCap, FaLanguage, FaClock } from 'react-icons/fa';
import './DoctorProfile.css'; 

const DoctorProfile = () => {
  // Mock Data
  const doctor = {
    name: "Dr. Kalpit Adiga",
    specialty: "Senior Gynecologist",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 4.8,
    reviews: 124,
    experience: "14 Years",
    languages: ["English", "Hindi", "Kannada"],
    about: "Dr. Adiga is a compassionate specialist dedicated to high-risk pregnancies and holistic maternal care. He emphasizes natural birthing techniques and mental well-being.",
    fee: "₹600",
    location: "Apollo BGS Hospitals, Mysuru"
  };

  return (
    <div className="doc-profile-page">
      
      {/* 1. HEADER CARD */}
      <div className="profile-header-card">
        <img src={doctor.image} alt={doctor.name} className="profile-hero-img" />
        <div className="profile-identity">
          <h1>{doctor.name} <span className="verified-tick">✔</span></h1>
          <p className="specialty-text">{doctor.specialty}</p>
          <div className="rating-badge">
            <FaStar className="star-icon" /> {doctor.rating} ({doctor.reviews} Reviews)
          </div>
        </div>
      </div>

      {/* 2. KEY STATS STRIP */}
      <div className="stats-strip">
        <div className="stat-item">
          <span className="stat-label">Experience</span>
          <span className="stat-value">{doctor.experience}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Patients</span>
          <span className="stat-value">5000+</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Fee</span>
          <span className="stat-value">{doctor.fee}</span>
        </div>
      </div>

      {/* 3. ABOUT SECTION */}
      <div className="content-section">
        <h3>About Doctor</h3>
        <p>{doctor.about}</p>
        
        <div className="info-row">
          <FaLanguage className="info-icon" />
          <span><strong>Spoken:</strong> {doctor.languages.join(", ")}</span>
        </div>
        <div className="info-row">
          <FaGraduationCap className="info-icon" />
          <span><strong>Education:</strong> MBBS, MS (OBG) - JSS Medical College</span>
        </div>
      </div>

      {/* 4. LOCATION CARD */}
      <div className="content-section">
        <h3>Clinic Location</h3>
        <div className="location-box">
          <FaMapMarkerAlt className="loc-icon" />
          <div>
            <h4>Maatrucare Clinic</h4>
            <p>{doctor.location}</p>
            <p className="timings"><FaClock /> Mon - Sat: 10:00 AM - 07:00 PM</p>
          </div>
        </div>
      </div>

      {/* 5. BOTTOM ACTION BAR (Sticky) */}
      <div className="booking-footer">
        <button className="book-btn-secondary">Message</button>
        <button className="book-btn-primary">Book Appointment</button>
      </div>

    </div>
  );
};

export default DoctorProfile;