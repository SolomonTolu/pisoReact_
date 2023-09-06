import React from 'react';
import './Modal.css';

const Modal = ({ show, onClose, title, children }) => {
    if (!show) return null;

    return (
        <div className="modalOverlay" onClick={onClose}>
            <div className="modalContent" onClick={e => e.stopPropagation()}>
                <button onClick={onClose}>Close</button>

                {title && <h2>{title}</h2>}
                {children}
            </div>
        </div>
    );
};

export default Modal;
