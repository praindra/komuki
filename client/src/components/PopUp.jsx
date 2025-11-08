import React from 'react';

const PopUp = ({ message, type, onClose }) => {
    const bgColor = type === 'success' ? '#d4edda' : '#f8d7da';
    const textColor = type === 'success' ? '#155724' : '#721c24';
    const borderColor = type === 'success' ? '#c3e6cb' : '#f5c6cb';

    return (
        <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: bgColor,
            color: textColor,
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            zIndex: 1000,
            border: `1px solid ${borderColor}`,
            minWidth: '250px',
            textAlign: 'center'
        }}>
            <p style={{ margin: '0 0 15px 0', fontSize: '1.1rem' }}>{message}</p>
            <button
                onClick={onClose}
                style={{
                    background: 'none',
                    border: `1px solid ${textColor}`,
                    color: textColor,
                    padding: '8px 15px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    transition: 'background-color 0.3s ease, color 0.3s ease'
                }}
                onMouseOver={(e) => { e.target.style.backgroundColor = textColor; e.target.style.color = bgColor; }}
                onMouseOut={(e) => { e.target.style.backgroundColor = 'none'; e.target.style.color = textColor; }}
            >
                Tutup
            </button>
        </div>
    );
};

export default PopUp;