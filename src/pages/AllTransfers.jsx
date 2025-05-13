import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AllTransfers() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchId, setSearchId] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/transactions')
      .then(res => {
        setTransactions(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('❌ Failed to load transactions');
        setLoading(false);
      });
  }, []);

  const filteredTransactions = searchId
    ? transactions.filter(tx =>
        tx.Transaction_ID.toString().includes(searchId)
      )
    : transactions;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>💳 Transaction History</h2>
        <input
          type="text"
          placeholder="🔍 Search by Transaction ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          style={styles.input}
        />
      </div>

      {loading && <p style={styles.status}>⏳ Loading transactions...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {!loading && !error && (
        <div style={styles.grid}>
          {filteredTransactions.length === 0 ? (
            <p style={styles.status}>😕 No transactions found{searchId && ` with ID containing "${searchId}"`}</p>
          ) : (
            filteredTransactions.map(tx => (
              <div key={tx.Transaction_ID} style={styles.card}>
                <div style={styles.cardHeader}>
                  <span style={styles.txId}>#{tx.Transaction_ID}</span>
                  <span style={{
                    ...styles.amount,
                    color: tx.Transaction_Amount >= 0 ? '#27ae60' : '#c0392b'
                  }}>
                    {tx.Transaction_Amount >= 0 ? '🟢' : '🔴'} ${tx.Transaction_Amount.toLocaleString()}
                  </span>
                </div>

                <div style={styles.cardContent}>
                  <div>
                    <p><strong>📅 Date:</strong> {new Date(tx.Transaction_Date).toLocaleDateString()}</p>
                    <p><strong>🏦 Account ID:</strong> {tx.Account_ID}</p>
                  </div>
                  <div>
                    <p><strong>👤 Customer:</strong> {tx.Customer_Name}</p>
                    <p><strong>ID:</strong> {tx.Customer_ID}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '40px 20px',
    backgroundColor: '#f4f7f9',
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
    fontSize: '1.1rem',
    marginTop: '20px',
  },
  error: {
    textAlign: 'center',
    color: '#e74c3c',
    fontWeight: 'bold',
    fontSize: '1.1rem',
  },
  grid: {
    display: 'grid',
    gap: '20px',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
  },
  card: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    transition: 'transform 0.2s ease-in-out',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    color: '#34495e',
  },
  cardContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    fontSize: '0.95rem',
    color: '#2d3436',
  },
  txId: {
    fontWeight: 'bold',
    color: '#2980b9',
  },
  amount: {
    fontWeight: 'bold',
  },
};
