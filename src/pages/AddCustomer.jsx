import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AddCustomer() {
  const [formData, setFormData] = useState({
    Name: '',
    DOB: '',
    Phone_Number: '',
    Street: '',
    City: '',
    State: '',
    Pincode: ''
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
      const res = await axios.post('http://localhost:3000/addcustomer', formData);
      setSuccessMessage(`✅ Customer added with ID: ${res.data.Customer_ID}`);
      localStorage.setItem('userId', res.data.Customer_ID);
      setTimeout(() => navigate('/customers'), 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || '❌ Failed to add customer');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.heading}>🧍 Add New Customer</h2>

        {error && <div style={styles.error}>{error}</div>}
        {successMessage && <div style={styles.success}>{successMessage}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input style={styles.input} type="text" name="Name" placeholder="Full Name" value={formData.Name} onChange={handleChange} required />
          <input style={styles.input} type="date" name="DOB" value={formData.DOB} onChange={handleChange} required />
          <input style={styles.input} type="tel" name="Phone_Number" placeholder="Phone Number" value={formData.Phone_Number} onChange={handleChange} required />
          <input style={styles.input} type="text" name="Street" placeholder="Street Address" value={formData.Street} onChange={handleChange} required />
          <input style={styles.input} type="text" name="City" placeholder="City" value={formData.City} onChange={handleChange} required />
          <input style={styles.input} type="text" name="State" placeholder="State" value={formData.State} onChange={handleChange} required />
          <input style={styles.input} type="text" name="Pincode" placeholder="Pincode" value={formData.Pincode} onChange={handleChange} required />

          <button type="submit" style={styles.button}>➕ Add Customer</button>
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
    backgroundColor: '#28a745',
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
