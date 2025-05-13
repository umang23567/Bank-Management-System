import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function LoanOptions() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const customerId = localStorage.getItem('userId');

  useEffect(() => {
    axios.get(`http://localhost:3000/customer/${customerId}/loans`)
      .then(res => {
        setLoans(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [customerId]);

  if (loading) return (
    <div style={styles.loadingContainer}>
      <div style={styles.loadingText}>Loading loans...</div>
    </div>
  );

  return (
    <div style={styles.pageContainer}>
      <div style={styles.contentContainer}>
        <div style={styles.header}>
          <h2 style={styles.title}>Your Loans</h2>
          <button 
            onClick={() => navigate('/customer')} 
            style={styles.backButton}
          >
            ← Back to Dashboard
          </button>
        </div>
        
        {loans.length === 0 ? (
          <div style={styles.noLoansContainer}>
            <p style={styles.noLoansText}>No active loans found</p>
          </div>
        ) : (
          <div style={styles.loansGrid}>
            {loans.map(loan => (
              <div key={loan.Loan_Number} style={styles.loanCard}>
                <h3 style={styles.loanNumber}>Loan #{loan.Loan_Number}</h3>
                <p style={styles.loanDetail}>Amount: <span style={styles.loanAmount}>${loan.Amount.toLocaleString()}</span></p>
                <p style={styles.loanDetail}>Branch: {loan.Branch_Name}</p>
                <p style={styles.loanStatus}>Status: <span style={styles.activeStatus}>Active</span></p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  contentContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    flexWrap: 'wrap',
    gap: '20px'
  },
  title: {
    color: '#2c3e50',
    fontSize: '28px',
    margin: '0',
    fontWeight: '600'
  },
  backButton: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'background-color 0.3s',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    ':hover': {
      backgroundColor: '#2980b9'
    }
  },
  loansGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px'
  },
  loanCard: {
    border: '1px solid #e0e0e0',
    borderRadius: '10px',
    padding: '20px',
    backgroundColor: '#ffffff',
    transition: 'transform 0.3s, box-shadow 0.3s',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)'
    }
  },
  loanNumber: {
    color: '#2c3e50',
    fontSize: '20px',
    marginTop: '0',
    marginBottom: '15px',
    borderBottom: '2px solid #f0f2f5',
    paddingBottom: '10px'
  },
  loanDetail: {
    color: '#34495e',
    fontSize: '16px',
    margin: '8px 0'
  },
  loanAmount: {
    color: '#27ae60',
    fontWeight: '600'
  },
  loanStatus: {
    color: '#34495e',
    fontSize: '16px',
    margin: '8px 0 0',
    fontWeight: '500'
  },
  activeStatus: {
    color: '#27ae60',
    fontWeight: '600'
  },
  noLoansContainer: {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px dashed #ddd'
  },
  noLoansText: {
    color: '#7f8c8d',
    fontSize: '18px',
    margin: '0'
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5'
  },
  loadingText: {
    fontSize: '20px',
    color: '#2c3e50',
    fontWeight: '500'
  }
};