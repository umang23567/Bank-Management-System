import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AddAccount() {
  const [formData, setFormData] = useState({
    Customer_ID: '',
    Balance: '',
    Type: 'Savings',
    Daily_Withdrawal_Limit: '',
    Rate_of_Interest: '',
    Transaction_Charges: ''
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    try {
      const payload = {
        Customer_ID: parseInt(formData.Customer_ID),
        Balance: parseFloat(formData.Balance),
        Type: formData.Type
      };

      if (formData.Type === 'Savings') {
        payload.Daily_Withdrawal_Limit = parseFloat(formData.Daily_Withdrawal_Limit);
        payload.Rate_of_Interest = parseFloat(formData.Rate_of_Interest);
      } else {
        payload.Transaction_Charges = parseFloat(formData.Transaction_Charges);
      }

      const res = await axios.post('http://localhost:3000/addaccount', payload);
      setSuccessMessage(`✅ Account created successfully with ID: ${res.data.Account_ID}`);
      setTimeout(() => navigate('/accounts'), 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || '❌ Failed to create account');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.heading}>🏦 Create New Account</h2>

        {error && <div style={styles.error}>{error}</div>}
        {successMessage && <div style={styles.success}>{successMessage}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            type="number"
            name="Customer_ID"
            placeholder="Customer ID"
            value={formData.Customer_ID}
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            type="number"
            name="Balance"
            placeholder="Initial Balance"
            value={formData.Balance}
            onChange={handleChange}
            required
          />

          <select
            style={styles.input}
            name="Type"
            value={formData.Type}
            onChange={handleChange}
          >
            <option value="Savings">Savings</option>
            <option value="Current">Current</option>
          </select>

          {formData.Type === 'Savings' && (
            <>
              <input
                style={styles.input}
                type="number"
                name="Daily_Withdrawal_Limit"
                placeholder="Daily Withdrawal Limit"
                value={formData.Daily_Withdrawal_Limit}
                onChange={handleChange}
                required
              />
              <input
                style={styles.input}
                type="number"
                step="0.01"
                name="Rate_of_Interest"
                placeholder="Rate of Interest (%)"
                value={formData.Rate_of_Interest}
                onChange={handleChange}
                required
              />
            </>
          )}

          {formData.Type === 'Current' && (
            <input
              style={styles.input}
              type="number"
              step="0.01"
              name="Transaction_Charges"
              placeholder="Transaction Charges"
              value={formData.Transaction_Charges}
              onChange={handleChange}
              required
            />
          )}

          <button type="submit" style={styles.button}>➕ Add Account</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: '40px 20px',
    backgroundColor: '#f2f4f7',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '500px'
  },
  heading: {
    marginBottom: '20px',
    fontSize: '1.7rem',
    color: '#2c3e50',
    textAlign: 'center'
  },
  form: {
    display: 'grid',
    gap: '14px'
  },
  input: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '1rem'
  },
  button: {
    padding: '12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '1rem',
    transition: 'background-color 0.3s ease'
  },
  error: {
    backgroundColor: '#ffe6e6',
    color: '#c0392b',
    padding: '10px',
    borderRadius: '6px',
    marginBottom: '10px',
    textAlign: 'center'
  },
  success: {
    backgroundColor: '#e7f9ed',
    color: '#27ae60',
    padding: '10px',
    borderRadius: '6px',
    marginBottom: '10px',
    textAlign: 'center'
  }
};
