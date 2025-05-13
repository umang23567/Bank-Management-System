import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ApplyLoan() {
  const [formData, setFormData] = useState({
    amount: '',
    branch: '',
    purpose: ''
  });
  const [branches, setBranches] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [branchLoading, setBranchLoading] = useState(true);
  const navigate = useNavigate();
  const customerId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get('http://localhost:3000/branches');
        setBranches(response.data);
      } catch (err) {
        setMessage('Failed to load branches. Please try again.');
      } finally {
        setBranchLoading(false);
      }
    };

    fetchBranches();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.branch) {
      setMessage('Please select a branch');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/customer/apply-loan', {
        customerId,
        amount: formData.amount,
        branchName: formData.branch,
        purpose: formData.purpose
      });

      if (response.data.success) {
        setMessage('Loan application submitted successfully!');
        setTimeout(() => navigate('/customer/loan-status'), 2000);
      } else {
        setMessage(response.data.error || 'Failed to submit loan application');
      }
    } catch (err) {
      setMessage(err.response?.data?.error || 'An error occurred. Please try again.');
      console.error('Loan application error:', err);
    } finally {
      setLoading(false);
    }
  };

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
          <h2 style={styles.title}>📝 Apply for Loan</h2>
        </div>

        <form onSubmit={handleSubmit} style={styles.formContainer}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Loan Amount ($)</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
              min="1000"
              style={styles.input}
              placeholder="Enter loan amount"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Branch Name</label>
            {branchLoading ? (
              <div style={styles.loadingText}>Loading branches...</div>
            ) : (
              <select
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                required
                style={styles.select}
              >
                <option value="">Select a branch</option>
                {branches.map((branch) => (
                  <option key={branch.Branch_Name} value={branch.Branch_Name}>
                    {branch.Branch_Name} - {branch.Branch_City}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Purpose</label>
            <textarea
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              required
              style={styles.textarea}
              placeholder="Describe the purpose of your loan"
            />
          </div>

          <button
            type="submit"
            disabled={loading || branchLoading}
            style={loading ? styles.submitButtonDisabled : styles.submitButton}
          >
            {loading ? (
              <span style={styles.buttonContent}>
                <span style={styles.spinner}></span> Submitting...
              </span>
            ) : (
              'Submit Application'
            )}
          </button>
        </form>

        {message && (
          <div style={message.includes('success') ? styles.successMessage : styles.errorMessage}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    minHeight: '100vh',
    backgroundColor: '#f5f7fa',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  contentContainer: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
  },
  header: {
    marginBottom: '25px',
    textAlign: 'center'
  },
  title: {
    color: '#2c3e50',
    fontSize: '28px',
    margin: '15px 0',
    fontWeight: '600'
  },
  backButton: {
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    ':hover': {
      backgroundColor: '#5a6268',
      transform: 'translateX(-3px)'
    }
  },
  formContainer: {
    display: 'grid',
    gap: '20px',
    padding: '25px',
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    border: '1px solid #e9ecef'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontWeight: '600',
    color: '#495057',
    fontSize: '15px'
  },
  input: {
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #ced4da',
    fontSize: '15px',
    transition: 'border 0.3s',
    ':focus': {
      outline: 'none',
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0, 123, 255, 0.25)'
    }
  },
  select: {
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #ced4da',
    fontSize: '15px',
    backgroundColor: 'white',
    transition: 'border 0.3s',
    ':focus': {
      outline: 'none',
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0, 123, 255, 0.25)'
    }
  },
  textarea: {
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #ced4da',
    minHeight: '120px',
    fontSize: '15px',
    resize: 'vertical',
    transition: 'border 0.3s',
    ':focus': {
      outline: 'none',
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0, 123, 255, 0.25)'
    }
  },
  submitButton: {
    padding: '14px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.3s',
    ':hover': {
      backgroundColor: '#218838',
      transform: 'translateY(-2px)'
    }
  },
  submitButtonDisabled: {
    padding: '14px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'not-allowed',
    fontSize: '16px',
    fontWeight: '600',
    opacity: '0.7'
  },
  buttonContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderRadius: '50%',
    borderTopColor: 'white',
    animation: 'spin 1s linear infinite'
  },
  successMessage: {
    marginTop: '20px',
    padding: '15px',
    borderRadius: '6px',
    backgroundColor: '#d4edda',
    color: '#155724',
    border: '1px solid #c3e6cb',
    textAlign: 'center',
    fontSize: '15px'
  },
  errorMessage: {
    marginTop: '20px',
    padding: '15px',
    borderRadius: '6px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    border: '1px solid #f5c6cb',
    textAlign: 'center',
    fontSize: '15px'
  },
  loadingText: {
    padding: '12px',
    textAlign: 'center',
    color: '#6c757d',
    backgroundColor: '#f8f9fa',
    borderRadius: '6px',
    border: '1px dashed #adb5bd'
  }
};