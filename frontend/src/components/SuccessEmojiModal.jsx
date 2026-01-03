import React from 'react';
import ReactDOM from 'react-dom'; // <--- Import this
import { FaCheckCircle } from 'react-icons/fa';
import './SuccessEmojiModal.css';

const SuccessModal = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;

  // We use createPortal to force this modal to render directly in the document body
  // This prevents it from getting "trapped" inside other components
  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="success-modal-card">
        <div className="success-icon-wrapper">
          <FaCheckCircle />
        </div>
        
        <h2 className="success-title">{title}</h2>
        
        <p className="success-desc">
          {message}
        </p>

        <button className="success-ok-btn" onClick={onClose}>
          OK
        </button>
      </div>
    </div>,
    document.body // <--- Render directly to the <body> tag
  );
};

export default SuccessModal;