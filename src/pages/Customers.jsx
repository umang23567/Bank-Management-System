import { useEffect, useState } from 'react';
import axios from 'axios';

function CustomerCard({ customer }) {
  return (
    <div style={styles.card}>
      <h3 style={styles.cardTitle}>
        👤 Customer #{customer.Customer_ID}: {customer.Name}
      </h3>
      <p style={styles.address}>
        📍 {customer.Street}, {customer.City}, {customer.State} {customer.Pincode}
      </p>
      <div style={styles.cardDetails}>
        <p>📞 {customer.Phone_Number}</p>
        <p>🎂 {new Date(customer.DOB).toLocaleDateString()}</p>
      </div>
    </div>
  );
}

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchId, setSearchId] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:3000/customers')
      .then(res => {
        setCustomers(res.data);
        setFilteredCustomers(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('❌ Failed to load customers. Please try again later.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = searchId
      ? customers.filter(customer =>
          customer.Customer_ID.toString().includes(searchId)
        )
      : customers;
    setFilteredCustomers(filtered);
  }, [searchId, customers]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>📋 Customer Directory</h2>
        <input
          type="text"
          placeholder="🔍 Search by Customer ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          style={styles.input}
        />
      </div>

      {loading && <p style={styles.status}>⏳ Loading customers...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {!loading && !error && (
        <>
          {filteredCustomers.length === 0 ? (
            <p style={styles.status}>
              😕 {searchId ? 'No customers found with that ID.' : 'No customers found.'}
            </p>
          ) : (
            <div style={styles.cardGrid}>
              {filteredCustomers.map(customer => (
                <CustomerCard key={customer.Customer_ID} customer={customer} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '40px 20px',
    background: 'linear-gradient(to right, #fdfbfb, #ebedee)',
    minHeight: '100vh',
    fontFamily: 'Segoe UI, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
    gap: '20px',
    marginBottom: '30px',
  },
  title: {
    fontSize: '2rem',
    color: '#2c3e50',
    margin: 0,
  },
  input: {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    minWidth: '220px',
  },
  status: {
    textAlign: 'center',
    color: '#7f8c8d',
    marginTop: '30px',
    fontSize: '1.1rem',
  },
  error: {
    textAlign: 'center',
    color: 'red',
    fontWeight: 'bold',
  },
  cardGrid: {
    display: 'grid',
    gap: '20px',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
  },
  card: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    transition: 'transform 0.2s',
  },
  cardTitle: {
    marginBottom: '10px',
    color: '#2c3e50',
  },
  address: {
    color: '#555',
    marginBottom: '10px',
  },
  cardDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.95rem',
    color: '#333',
  },
};
