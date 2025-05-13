import { Link } from 'react-router-dom';

export default function LandingPage() {
    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(to right, #e1f5fe, #e8f5e9)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '60px 40px',
                borderRadius: '16px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
                maxWidth: '500px',
                width: '100%'
            }}>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>🏦</div>
                <h1 style={{ fontSize: '36px', color: '#2e7d32', marginBottom: '10px' }}>Welcome to PUV Bank</h1>
                <p style={{ fontSize: '18px', color: '#555' }}>Your trusted banking partner</p>

                <div style={{ marginTop: '40px' }}>
                    <Link to="/login" style={{
                        display: 'inline-block',
                        margin: '12px',
                        padding: '12px 28px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        transition: '0.3s ease',
                        boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
                    }}
                        onMouseOver={e => e.target.style.backgroundColor = '#45a049'}
                        onMouseOut={e => e.target.style.backgroundColor = '#4CAF50'}
                    >
                        Login
                    </Link>

                </div>
            </div>
        </div>
    );
}
