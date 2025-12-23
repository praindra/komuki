import React from 'react';
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer style={{
            background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
            color: 'white',
            padding: '4rem 2rem 2rem',
            marginTop: 'auto',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Decorative background elements */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.1,
                backgroundImage: 'radial-gradient(circle at 20% 50%, #00d4ff 0%, transparent 50%), radial-gradient(circle at 80% 80%, #00d4ff 0%, transparent 50%)',
                pointerEvents: 'none'
            }}></div>

            <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Main content sections */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '3rem',
                    marginBottom: '3rem'
                }}>
                    {/* Social Media Section */}
                    <div style={{
                        padding: '2rem',
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 212, 255, 0.1)';
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.5)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    }}>
                        <h4 style={{
                            marginBottom: '1.5rem',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            background: 'linear-gradient(135deg, #00d4ff, #0099ff)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>Media Sosial</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <li>
                                <a href="https://www.facebook.com/rsbhinabhaktihusada" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: 'rgba(0, 212, 255, 0.2)',
                                    color: '#00d4ff',
                                    transition: 'all 0.3s ease',
                                    textDecoration: 'none'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = '#00d4ff';
                                    e.currentTarget.style.color = '#0f2027';
                                    e.currentTarget.style.transform = 'scale(1.1)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = 'rgba(0, 212, 255, 0.2)';
                                    e.currentTarget.style.color = '#00d4ff';
                                    e.currentTarget.style.transform = 'scale(1)';
                                }}>
                                    <Facebook size={20} />
                                </a>
                            </li>
                            <li>
                                <a href="https://www.instagram.com/rsbhinabhaktihusada?igsh=Z2pmMW5seXdqcGww" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: 'rgba(0, 212, 255, 0.2)',
                                    color: '#00d4ff',
                                    transition: 'all 0.3s ease',
                                    textDecoration: 'none'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = '#00d4ff';
                                    e.currentTarget.style.color = '#0f2027';
                                    e.currentTarget.style.transform = 'scale(1.1)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = 'rgba(0, 212, 255, 0.2)';
                                    e.currentTarget.style.color = '#00d4ff';
                                    e.currentTarget.style.transform = 'scale(1)';
                                }}>
                                    <Instagram size={20} />
                                </a>
                            </li>
                            <li>
                                <a href="https://www.facebook.com/rsbhinabhaktihusada" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: 'rgba(0, 212, 255, 0.2)',
                                    color: '#00d4ff',
                                    transition: 'all 0.3s ease',
                                    textDecoration: 'none'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = '#00d4ff';
                                    e.currentTarget.style.color = '#0f2027';
                                    e.currentTarget.style.transform = 'scale(1.1)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = 'rgba(0, 212, 255, 0.2)';
                                    e.currentTarget.style.color = '#00d4ff';
                                    e.currentTarget.style.transform = 'scale(1)';
                                }}>
                                    <Twitter size={20} />
                                </a>
                            </li>
                        </ul>
                        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <p style={{
                                margin: 0,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                fontSize: '0.9rem'
                            }}>
                                <Phone size={16} style={{ color: '#00d4ff', flexShrink: 0 }} />
                                <span>(0295) 6980 777 / 999</span>
                            </p>
                            <p style={{
                                margin: 0,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                fontSize: '0.9rem'
                            }}>
                                <Mail size={16} style={{ color: '#00d4ff', flexShrink: 0 }} />
                                <span>rumahsakit@bhinabhaktihusada.co.id</span>
                            </p>
                        </div>
                    </div>

                    {/* Feedback Section removed - now displayed on Home page */}

                    {/* Location Section */}
                    <div style={{
                        padding: '2rem',
                        borderRadius: '12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 212, 255, 0.1)';
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.borderColor = 'rgba(0, 212, 255, 0.5)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    }}>
                        <h4 style={{
                            marginBottom: '1.5rem',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            background: 'linear-gradient(135deg, #00d4ff, #0099ff)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>Lokasi Kami</h4>
                        <div style={{
                            borderRadius: '8px',
                            overflow: 'hidden',
                            boxShadow: '0 8px 16px rgba(0, 212, 255, 0.2)',
                            marginBottom: '1rem'
                        }}>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3962.2714926920157!2d111.3544619735624!3d-6.7366976658669655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7724f4b7c44e19%3A0x6d4d5269681cc7d1!2sRS.%20Bhina%20Bhakti%20Husada!5e0!3m2!1sid!2sid!4v1764663883147!5m2!1sid!2sid"
                                width="100%"
                                height="150"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Lokasi RS Bhina Bhakti Husada"
                            ></iframe>
                        </div>
                        <p style={{
                            margin: 0,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            fontSize: '0.9rem',
                            lineHeight: '1.5'
                        }}>
                            <MapPin size={18} style={{ color: '#00d4ff', flexShrink: 0 }} />
                            <span>Jl. Raya Rembang-Blora, Km. 4 Rembang, Jawa Tengah</span>
                        </p>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div style={{
                    borderTop: '2px solid rgba(0, 212, 255, 0.3)',
                    paddingTop: '2rem',
                    textAlign: 'center'
                }}>
                    <p style={{
                        fontSize: '0.95rem',
                        fontWeight: '500',
                        margin: '0 0 0.5rem 0',
                        letterSpacing: '0.05em'
                    }}>
                        &copy; {new Date().getFullYear()} <span style={{ color: '#00d4ff' }}>RS BHINA BHAKTI HUSADA</span>. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;