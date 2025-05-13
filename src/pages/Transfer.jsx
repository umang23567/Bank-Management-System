import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Transfer() {
  const [formData, setFormData] = useState({
    toAccount: '',
    amount: ''
  });
  const [accounts, setAccounts] = useState([]);
  const [message, setMessage] = useState({ text: '', isError: false });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const customerId = localStorage.getItem('userId');

  useEffect(() => {
    if (!customerId) {
      navigate('/login');
      return;
    }

    const fetchAccounts = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/customer/${customerId}/accounts`);
        setAccounts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch accounts:', err);
        setMessage({ text: 'Failed to load your accounts', isError: true });
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [customerId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (accounts.length === 0) return;
  
    try {
      setProcessing(true);
      setMessage({ text: 'Processing transfer...', isError: false });
      
      const response = await axios.post('http://localhost:3000/transfer', {
        fromAccount: accounts[0].Account_ID,
        toAccount: formData.toAccount,
        amount: formData.amount
      });
  
      if (response.data.success) {
        setMessage({ 
          text: response.data.message || `Successfully transferred $${formData.amount}`, 
          isError: false 
        });
        const updatedAccounts = await axios.get(`http://localhost:3000/customer/${customerId}/accounts`);
        setAccounts(updatedAccounts.data);
        setFormData({ toAccount: '', amount: '' });
      } else {
        setMessage({ text: response.data.error || 'Transfer failed', isError: true });
      }
    } catch (err) {
      setMessage({ 
        text: err.response?.data?.error || 'Transfer failed. Please try again.', 
        isError: true 
      });
      console.error('Transfer error:', err);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return (
    <div style={styles.loadingContainer}>
      <div style={styles.spinner}></div>
      <p style={styles.loadingText}>Loading your accounts...</p>
    </div>
  );

  if (accounts.length === 0) return (
    <div style={styles.errorContainer}>
      <div style={styles.errorContent}>
        <h2 style={styles.errorTitle}>No Accounts Found</h2>
        <p style={styles.errorText}>You cannot make transfers without an active account</p>
        <button 
          onClick={() => navigate('/customer')}
          style={styles.backButton}
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button 
          onClick={() => navigate('/customer')} 
          style={styles.backButton}
        >
          ← Back to Dashboard
        </button>
        <h2 style={styles.title}>Transfer Money</h2>
      </div>

      <div style={styles.accountInfo}>
        <h4 style={styles.accountInfoTitle}>Transferring from:</h4>
        <div style={styles.accountDetails}>
          <p style={styles.accountDetail}><strong>Account #{accounts[0].Account_ID}</strong></p>
          <p style={styles.accountDetail}>
            Balance: <span style={styles.balance}>${accounts[0].Balance.toLocaleString()}</span>
          </p>
          <p style={styles.accountDetail}>Type: {accounts[0].Type}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>To Account Number</label>
          <input
            type="number"
            placeholder="Enter recipient account number"
            value={formData.toAccount}
            onChange={(e) => setFormData({...formData, toAccount: e.target.value})}
            required
            min="1"
            style={styles.input}
          />
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Amount ($)</label>
          <input
            type="number"
            placeholder="Enter amount"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
            required
            min="1"
            max={accounts[0].Balance}
            step="0.01"
            style={styles.input}
          />
          <div style={styles.amountHint}>
            Available: ${accounts[0].Balance.toLocaleString()}
          </div>
        </div>
        
        <button 
          type="submit" 
          style={{
            ...styles.submitButton,
            backgroundColor: processing ? '#6c757d' : '#28a745'
          }}
          disabled={processing}
        >
          {processing ? (
            <>
              <span style={styles.buttonSpinner}></span>
              Processing...
            </>
          ) : (
            'Transfer Money'
          )}
        </button>
      </form>

      {message.text && (
        <div style={{
          ...styles.message,
          backgroundColor: message.isError ? '#f8d7da' : '#d4edda',
          color: message.isError ? '#721c24' : '#155724'
        }}>
          {message.text}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '40px 20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#f8f9fa',
    minHeight: '100vh'
  },
  header: {
    marginBottom: '30px',
    position: 'relative',
    textAlign: 'center'
  },
  title: {
    color: '#2c3e50',
    fontSize: '2rem',
    margin: '20px 0',
    fontWeight: '600'
  },
  backButton: {
    position: 'absolute',
    left: '0',
    padding: '10px 15px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: '#f0f0f0',
      transform: 'translateX(-2px)'
    }
  },
  accountInfo: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '30px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    borderLeft: '4px solid #007bff'
  },
  accountInfoTitle: {
    color: '#495057',
    marginTop: '0',
    marginBottom: '15px',
    fontSize: '1.1rem'
  },
  accountDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  accountDetail: {
    margin: '0',
    color: '#6c757d'
  },
  balance: {
    color: '#28a745',
    fontWeight: '600'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontWeight: '600',
    color: '#495057',
    fontSize: '0.95rem'
  },
  input: {
    padding: '12px 15px',
    border: '1px solid #ced4da',
    borderRadius: '6px',
    fontSize: '1rem',
    transition: 'border 0.2s ease',
    ':focus': {
      outline: 'none',
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,0.25)'
    }
  },
  amountHint: {
    fontSize: '0.85rem',
    color: '#6c757d',
    textAlign: 'right',
    marginTop: '5px'
  },
  submitButton: {
    padding: '12px',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    ':hover:not(:disabled)': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    }
  },
  buttonSpinner: {
    border: '2px solid rgba(255,255,255,0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    width: '16px',
    height: '16px',
    animation: 'spin 1s linear infinite'
  },
  message: {
    padding: '15px',
    borderRadius: '6px',
    marginTop: '20px',
    fontWeight: '500',
    textAlign: 'center'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa'
  },
  spinner: {
    border: '4px solid rgba(0, 0, 0, 0.1)',
    borderLeftColor: '#28a745',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px'
  },
  loadingText: {
    color: '#6c757d',
    fontSize: '1.1rem'
  },
  errorContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa'
  },
  errorContent: {
    textAlign: 'center',
    maxWidth: '400px',
    padding: '20px'
  },
  errorTitle: {
    color: '#dc3545',
    fontSize: '1.5rem',
    marginBottom: '10px'
  },
  errorText: {
    color: '#6c757d',
    fontSize: '1rem',
    marginBottom: '20px'
  }
};