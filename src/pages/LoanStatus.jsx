import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LoanStatus() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLoanStatus = async () => {
      try {
        const customerId = localStorage.getItem('userId');
        
        if (!customerId) {
          setError('Please login to view your loan status');
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:3000/customer/loan-status/${customerId}`
        );

        const processedLoans = response.data.map(loan => ({
          requestId: loan.requestId,
          amount: parseFloat(loan.Requested_Amount) || 0,
          branch: loan.branch || 'N/A',
          status: loan.status || 'Pending',
          requestDate: loan.Request_Date
        }));

        setLoans(processedLoans);
      } catch (err) {
        console.error('Error fetching loan status:', err);
        setError(err.response?.data?.error || err.message || 'Failed to fetch loan status');
      } finally {
        setLoading(false);
      }
    };

    fetchLoanStatus();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusStyle = (status) => {
    const base = {
      padding: '6px 12px',
      borderRadius: '20px',
      fontWeight: '600',
      fontSize: '14px',
      display: 'inline-block',
      minWidth: '90px',
      textAlign: 'center'
    };

    switch (status.toLowerCase()) {
      case 'approved': 
        return { ...base, backgroundColor: '#e6f7ee', color: '#10b981', border: '1px solid #a7f3d0' };
      case 'rejected': 
        return { ...base, backgroundColor: '#fee2e2', color: '#ef4444', border: '1px solid #fecaca' };
      case 'pending':
        return { ...base, backgroundColor: '#fef3c7', color: '#d97706', border: '1px solid #fde68a' };
      default: 
        return { ...base, backgroundColor: '#e0e7ff', color: '#6366f1', border: '1px solid #c7d2fe' };
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p style={styles.loadingText}>Loading your loan information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.contentContainer}>
          <button 
            onClick={() => navigate('/customer')} 
            style={styles.backButton}
          >
            ← Back to Dashboard
          </button>
          <div style={styles.errorContainer}>
            <div style={styles.errorIcon}>⚠️</div>
            <h3 style={styles.errorTitle}>Error Loading Loan Status</h3>
            <p style={styles.errorMessage}>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              style={styles.retryButton}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          <h2 style={styles.title}>Your Loan Applications</h2>
        </div>

        {loans.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIllustration}>📄</div>
            <h3 style={styles.emptyTitle}>No Loan Applications Found</h3>
            <p style={styles.emptyText}>You haven't applied for any loans yet</p>
            <button 
              onClick={() => navigate('/customer/apply-loan')} 
              style={styles.applyButton}
            >
              Apply for a Loan
            </button>
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead style={styles.tableHeader}>
                <tr>
                  <th style={styles.tableHeaderCell}>Request #</th>
                  <th style={styles.tableHeaderCell}>Amount</th>
                  <th style={styles.tableHeaderCell}>Branch</th>
                  <th style={styles.tableHeaderCell}>Status</th>
                  <th style={styles.tableHeaderCell}>Date Applied</th>
                </tr>
              </thead>
              <tbody>
                {loans.map(loan => (
                  <tr key={loan.requestId} style={styles.tableRow}>
                    <td style={styles.tableCell}>{loan.requestId}</td>
                    <td style={{...styles.tableCell, ...styles.amountCell}}>
                      {formatCurrency(loan.amount)}
                    </td>
                    <td style={styles.tableCell}>{loan.branch}</td>
                    <td style={styles.tableCell}>
                      <span style={getStatusStyle(loan.status)}>
                        {loan.status}
                      </span>
                    </td>
                    <td style={styles.tableCell}>
                      {formatDate(loan.requestDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    padding: '20px',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
  },
  contentContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
  },
  header: {
    marginBottom: '30px'
  },
  title: {
    color: '#1e293b',
    fontSize: '28px',
    fontWeight: '600',
    margin: '20px 0'
  },
  backButton: {
    backgroundColor: '#e2e8f0',
    color: '#334155',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    ':hover': {
      backgroundColor: '#cbd5e1',
      transform: 'translateX(-2px)'
    }
  },
  tableWrapper: {
    overflowX: 'auto',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '15px'
  },
  tableHeader: {
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e2e8f0'
  },
  tableHeaderCell: {
    padding: '16px 20px',
    textAlign: 'left',
    fontWeight: '600',
    color: '#475569',
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  tableRow: {
    borderBottom: '1px solid #e2e8f0',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#f8fafc'
    }
  },
  tableCell: {
    padding: '16px 20px',
    color: '#334155',
    verticalAlign: 'middle'
  },
  amountCell: {
    fontWeight: '600',
    color: '#1e40af'
  },
  emptyState: {
    padding: '40px 20px',
    textAlign: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px dashed #cbd5e1',
    margin: '20px 0'
  },
  emptyIllustration: {
    fontSize: '60px',
    marginBottom: '20px',
    opacity: '0.7'
  },
  emptyTitle: {
    color: '#334155',
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '10px'
  },
  emptyText: {
    color: '#64748b',
    fontSize: '16px',
    marginBottom: '20px'
  },
  applyButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#2563eb',
      transform: 'translateY(-1px)'
    }
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '300px',
    gap: '20px'
  },
  loadingSpinner: {
    width: '50px',
    height: '50px',
    border: '5px solid #e2e8f0',
    borderTopColor: '#3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    color: '#64748b',
    fontSize: '16px',
    fontWeight: '500'
  },
  errorContainer: {
    padding: '30px',
    backgroundColor: '#fff1f2',
    borderRadius: '8px',
    border: '1px solid #ffe4e6',
    textAlign: 'center',
    marginTop: '20px'
  },
  errorIcon: {
    fontSize: '40px',
    marginBottom: '15px'
  },
  errorTitle: {
    color: '#dc2626',
    fontSize: '20px',
    fontWeight: '600',
    marginBottom: '10px'
  },
  errorMessage: {
    color: '#b91c1c',
    fontSize: '16px',
    marginBottom: '20px'
  },
  retryButton: {
    backgroundColor: '#dc2626',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#b91c1c',
      transform: 'translateY(-1px)'
    }
  }
};