import React from 'react';

const Footer = () => {
    return (
        <footer style={{ background: '#333', color: 'white', padding: '2rem', textAlign: 'center', marginTop: 'auto' }}>
            <div className="footer-content" style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                <div className="footer-section" style={{ margin: '1rem' }}>
                    <h4 style={{ marginBottom: '0.8rem', color: '#007bff' }}>Sosial Media</h4>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li><a href="#" style={{ color: 'white', textDecoration: 'none' }}>Facebook</a></li>
                        <li><a href="#" style={{ color: 'white', textDecoration: 'none' }}>Instagram</a></li>
                        <li><a href="#" style={{ color: 'white', textDecoration: 'none' }}>Twitter</a></li>
                    </ul>
                </div>
                <div className="footer-section" style={{ margin: '1rem' }}>
                    <h4 style={{ marginBottom: '0.8rem', color: '#007bff' }}>Alamat</h4>
                    <p>Jl. Contoh No. 123</p>
                    <p>Kota Contoh, Kode Pos 12345</p>
                </div>
                <div className="footer-section" style={{ margin: '1rem' }}>
                    <h4 style={{ marginBottom: '0.8rem', color: '#007bff' }}>Kontak</h4>
                    <p>No HP: 0812-3456-7890</p>
                    <p>Email: info@kliniksehat.com</p>
                    <p><a href="#" style={{ color: 'white', textDecoration: 'none' }}>Web Resmi</a></p>
                </div>
            </div>
            <div className="footer-bottom" style={{ borderTop: '1px solid #555', paddingTop: '1rem' }}>
                <p>&copy; {new Date().getFullYear()} RS BHINA BAKTI HUSADA. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;