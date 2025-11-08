import React from 'react';

const Card = ({ title, value, description, className = '' }) => {
    return (
        <div className={`card ${className}`} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', backgroundColor: '#fff', flex: 1, minWidth: '200px' }}>
            {title && <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#333' }}>{title}</h3>}
            {value !== undefined && <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#007bff', margin: '0' }}>{value}</p>}
            {description && <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>{description}</p>}
        </div>
    );
};

export default Card;