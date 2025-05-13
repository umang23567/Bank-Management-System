import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CustomerAccounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const customerId = localStorage.getItem('userId');

  useEffect(() => {
    if (!customerId) {
      setError('No customer ID found - please login again');
      setLoading(false);
      navigate('/login');
      return;
    }

    const fetchAccounts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/customer/${customerId}/accounts`
        );
        
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Invalid data format received');
        }

        setAccounts(response.data);
      } catch (err) {
        console.error('Account fetch failed:', err);
        setError(err.response?.data?.error || 'Failed to load accounts');
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [customerId, navigate]);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen error={error} navigate={navigate} />;

  return (
    <div style={styles.pageContainer}>
      <div style={styles.contentContainer}>
        <div style={styles.header}>
          <button 
            onClick={() => navigate('/customer')} 
            style={styles.backButton}
          >
            ← Back to Dashboard
          </button>
          <h2 style={styles.title}>Your Accounts</h2>
        </div>
        
        <div style={styles.accountsContainer}>
          {accounts.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIllustration}>🏦</div>
              <h3 style={styles.emptyTitle}>No Accounts Found</h3>
              <p style={styles.emptyText}>You don't have any active accounts with us</p>
            </div>
          ) : (
            <div style={styles.accountsGrid}>
              {accounts.map(account => (
                <AccountCard key={account.Account_ID} account={account} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const AccountCard = ({ account }) => {
  const isSavings = account.Type === 'Savings';
  const accentColor = isSavings ? '#10B981' : '#3B82F6';
  const bgColor = isSavings ? '#ECFDF5' : '#EFF6FF';

  return (
    <div style={{
      ...styles.accountCard,
      borderLeft: `4px solid ${accentColor}`,
      backgroundColor: bgColor
    }}>
      <div style={styles.accountHeader}>
        <div>
          <p style={styles.accountSubtitle}>{isSavings ? 'Savings Account' : 'Current Account'}</p>
          <h3 style={styles.accountNumber}>•••• {account.Account_ID.toString().slice(-4)}</h3>
        </div>
        <div style={{
          ...styles.accountTypeBadge,
          backgroundColor: isSavings ? '#D1FAE5' : '#DBEAFE',
          color: isSavings ? '#065F46' : '#1E40AF'
        }}>
          {account.Type}
        </div>
      </div>

      <div style={styles.accountBalance}>
        ${parseFloat(account.Balance).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}
      </div>

      <div style={styles.accountDetails}>
        {isSavings ? (
          <>
            <DetailItem label="Interest Rate" value={`${account.Rate_of_Interest}%`} />
            <DetailItem 
              label="Withdrawal Limit" 
              value={`$${account.Daily_Withdrawal_Limit}/day`} 
            />
          </>
        ) : (
          <DetailItem 
            label="Transaction Fee" 
            value={`$${account.Transaction_Charges}`} 
          />
        )}
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div style={styles.detailItem}>
    <span style={styles.detailLabel}>{label}</span>
    <span style={styles.detailValue}>{value}</span>
  </div>
);

const LoadingScreen = () => (
  <div style={styles.loadingContainer}>
    <div style={styles.loadingContent}>
      <div style={styles.spinner}></div>
      <h2 style={styles.loadingTitle}>Loading Your Accounts</h2>
      <p style={styles.loadingText}>We're retrieving your account information</p>
    </div>
  </div>
);

const ErrorScreen = ({ error, navigate }) => (
  <div style={styles.errorContainer}>
    <div style={styles.errorContent}>
      <div style={styles.errorIcon}>⚠️</div>
      <h2 style={styles.errorTitle}>Unable to Load Accounts</h2>
      <p style={styles.errorText}>{error}</p>
      <button 
        onClick={() => navigate('/customer')}
        style={styles.retryButton}
      >
        ← Return to Dashboard
      </button>
    </div>
  </div>
);

const styles = {
  pageContainer: {
    minHeight: '100vh',
    backgroundColor: '#F9FAFB',
    padding: '20px',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
  },
  contentContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
  },
  header: {
    marginBottom: '30px',
    position: 'relative',
    textAlign: 'center'
  },
  title: {
    color: '#111827',
    fontSize: '28px',
    fontWeight: '600',
    margin: '10px 0'
  },
  backButton: {
    position: 'absolute',
    left: '0',
    top: '0',
    padding: '10px 16px',
    borderRadius: '8px',
    backgroundColor: '#F3F4F6',
    color: '#374151',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '14px',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    ':hover': {
      backgroundColor: '#E5E7EB',
      transform: 'translateX(-2px)'
    }
  },
  accountsContainer: {
    marginTop: '20px'
  },
  accountsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '20px'
  },
  accountCard: {
    borderRadius: '10px',
    padding: '24px',
    transition: 'all 0.3s ease',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    ':hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)'
    }
  },
  accountHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px'
  },
  accountSubtitle: {
    color: '#6B7280',
    fontSize: '14px',
    margin: '0 0 4px 0'
  },
  accountNumber: {
    color: '#111827',
    fontSize: '18px',
    fontWeight: '600',
    margin: '0'
  },
  accountTypeBadge: {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  accountBalance: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#111827',
    margin: '20px 0',
    textAlign: 'center'
  },
  accountDetails: {
    borderTop: '1px solid #E5E7EB',
    paddingTop: '16px',
    marginTop: '16px'
  },
  detailItem: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px'
  },
  detailLabel: {
    color: '#6B7280',
    fontSize: '14px'
  },
  detailValue: {
    color: '#111827',
    fontSize: '14px',
    fontWeight: '500'
  },
  emptyState: {
    padding: '40px 20px',
    textAlign: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: '8px',
    border: '1px dashed #D1D5DB'
  },
  emptyIllustration: {
    fontSize: '48px',
    marginBottom: '16px',
    opacity: '0.8'
  },
  emptyTitle: {
    color: '#111827',
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '8px'
  },
  emptyText: {
    color: '#6B7280',
    fontSize: '14px',
    marginBottom: '0'
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#F9FAFB'
  },
  loadingContent: {
    textAlign: 'center',
    maxWidth: '300px'
  },
  spinner: {
    border: '4px solid rgba(59, 130, 246, 0.1)',
    borderTop: '4px solid #3B82F6',
    borderRadius: '50%',
    width: '48px',
    height: '48px',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 20px'
  },
  loadingTitle: {
    color: '#111827',
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '8px'
  },
  loadingText: {
    color: '#6B7280',
    fontSize: '14px'
  },
  errorContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#F9FAFB'
  },
  errorContent: {
    textAlign: 'center',
    maxWidth: '400px',
    padding: '20px'
  },
  errorIcon: {
    fontSize: '48px',
    marginBottom: '16px',
    color: '#EF4444'
  },
  errorTitle: {
    color: '#111827',
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '8px'
  },
  errorText: {
    color: '#6B7280',
    fontSize: '14px',
    marginBottom: '20px'
  },
  retryButton: {
    padding: '10px 20px',
    backgroundColor: '#EF4444',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '14px',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#DC2626',
      transform: 'translateY(-1px)'
    }
  }
};