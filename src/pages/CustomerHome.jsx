// src/pages/CustomerHome.jsx
import { useNavigate } from 'react-router-dom';

export default function CustomerHome() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any session/auth data if needed here
    navigate('/login'); // redirect to login page
  };

  return (
      <div style={{ 
        padding: '40px', 
        position: 'relative',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}>
        <button
            onClick={handleLogout}
            style={{
              position: 'absolute',
              top: '30px',
              right: '30px',
              padding: '12px 20px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#dc3545',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '16px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease',
              ':hover': {
                backgroundColor: '#c82333',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
              }
            }}
        >
          🔒 Logout
        </button>

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '40px 20px'
        }}>
          <h2 style={{
            color: '#2c3e50',
            fontSize: '2.5rem',
            marginBottom: '10px',
            textAlign: 'center',
            fontWeight: '600',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
          }}>
            Welcome to Your Dashboard
          </h2>
          <p style={{
            color: '#7f8c8d',
            textAlign: 'center',
            fontSize: '1.1rem',
            marginBottom: '40px'
          }}>
            What would you like to do today?
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '25px',
            marginTop: '30px'
          }}>
            <button onClick={() => navigate('/customer/accounts')} style={cardStyle}>
              <span style={{ fontSize: '28px', marginBottom: '10px' }}>🏦</span>
              <h3 style={{ margin: '10px 0', color: '#2c3e50' }}>View Accounts</h3>
              <p style={{ color: '#7f8c8d', fontSize: '14px' }}>Check your account balances and details</p>
            </button>
            <button onClick={() => navigate('/customer/transfer')} style={cardStyle}>
              <span style={{ fontSize: '28px', marginBottom: '10px' }}>💸</span>
              <h3 style={{ margin: '10px 0', color: '#2c3e50' }}>Transfer Money</h3>
              <p style={{ color: '#7f8c8d', fontSize: '14px' }}>Send money to other accounts</p>
            </button>
            <button onClick={() => navigate('/customer/transactions')} style={cardStyle}>
              <span style={{ fontSize: '28px', marginBottom: '10px' }}>📊</span>
              <h3 style={{ margin: '10px 0', color: '#2c3e50' }}>View Transactions</h3>
              <p style={{ color: '#7f8c8d', fontSize: '14px' }}>See your transaction history</p>
            </button>
            <button onClick={() => navigate('/customer/loans')} style={cardStyle}>
              <span style={{ fontSize: '28px', marginBottom: '10px' }}>🏦</span>
              <h3 style={{ margin: '10px 0', color: '#2c3e50' }}>Loan Options</h3>
              <p style={{ color: '#7f8c8d', fontSize: '14px' }}>Explore available loan products</p>
            </button>
            <button onClick={() => navigate('/customer/apply-loan')} style={cardStyle}>
              <span style={{ fontSize: '28px', marginBottom: '10px' }}>📝</span>
              <h3 style={{ margin: '10px 0', color: '#2c3e50' }}>Apply for Loan</h3>
              <p style={{ color: '#7f8c8d', fontSize: '14px' }}>Submit a new loan application</p>
            </button>
            <button onClick={() => navigate('/customer/loan-status')} style={cardStyle}>
              <span style={{ fontSize: '28px', marginBottom: '10px' }}>🔍</span>
              <h3 style={{ margin: '10px 0', color: '#2c3e50' }}>View Loan Status</h3>
              <p style={{ color: '#7f8c8d', fontSize: '14px' }}>Check your existing loan applications</p>
            </button>
          </div>
        </div>
      </div>
  );
}

const cardStyle = {
  padding: '25px',
  borderRadius: '12px',
  border: 'none',
  backgroundColor: 'white',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  ':hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
    backgroundColor: '#f8f9fa'
  }
};