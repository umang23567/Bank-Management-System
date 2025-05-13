import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AccountDetails() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [accountType, setAccountType] = useState('all');
  const [sortOrder, setSortOrder] = useState('none');

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:3000/accounts')
      .then(res => {
        setAccounts(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load accounts');
        setLoading(false);
      });
  }, []);

  const filteredAccounts = accounts.filter(account => {
    const idMatch = searchId ? account.Account_ID.toString().includes(searchId) : true;
    let typeMatch = true;
    if (accountType === 'savings') typeMatch = account.Type === 'Savings';
    if (accountType === 'current') typeMatch = account.Type === 'Current';
    return idMatch && typeMatch;
  });

  const sortedAccounts = [...filteredAccounts].sort((a, b) => {
    if (sortOrder === 'asc') return a.Balance - b.Balance;
    if (sortOrder === 'desc') return b.Balance - a.Balance;
    return 0;
  });

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>📁 Account Directory</h2>
        <div style={styles.controls}>
          <input
            type="text"
            placeholder="🔍 Search ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            style={styles.input}
          />
          <select
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            style={styles.select}
          >
            <option value="all">All Types</option>
            <option value="savings">Savings</option>
            <option value="current">Current</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            style={styles.select}
          >
            <option value="none">Sort by Balance</option>
            <option value="asc">Low to High</option>
            <option value="desc">High to Low</option>
          </select>
        </div>
      </div>

      {loading && <p style={styles.status}>⏳ Loading accounts...</p>}
      {error && <p style={styles.error}>❌ {error}</p>}

      {!loading && !error && (
        <div style={styles.cardGrid}>
          {sortedAccounts.length === 0 ? (
            <p style={styles.status}>😕 No accounts found{searchId && ` with ID "${searchId}"`}</p>
          ) : (
            sortedAccounts.map(account => (
              <div key={account.Account_ID} style={styles.card}>
                <h3 style={styles.cardTitle}>
                  {account.Type === 'Savings' ? '💵' : '💳'} Account #{account.Account_ID}
                </h3>
                <div style={styles.cardContent}>
                  <div>
                    <p><strong>🏦 Type:</strong> {account.Type}</p>
                    <p><strong>💰 Balance:</strong> ${account.Balance.toLocaleString()}</p>
                  </div>
                  <div>
                    {account.Type === 'Savings' ? (
                      <>
                        <p><strong>📅 Daily Limit:</strong> ${account.Daily_Withdrawal_Limit?.toLocaleString() || 'N/A'}</p>
                        <p><strong>📈 Interest Rate:</strong> {account.Rate_of_Interest}%</p>
                      </>
                    ) : (
                      <p><strong>💸 Transaction Fee:</strong> ${account.Transaction_Charges?.toLocaleString() || 'N/A'}</p>
                    )}
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
    background: 'linear-gradient(to right, #eef2f3, #dfe9f3)',
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
    color: '#333',
    margin: 0,
  },
  controls: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  input: {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    minWidth: '160px',
    fontSize: '1rem',
  },
  select: {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  status: {
    textAlign: 'center',
    color: '#666',
    marginTop: '40px',
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
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
    transition: 'transform 0.2s',
  },
  cardTitle: {
    marginBottom: '15px',
    color: '#333',
  },
  cardContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    fontSize: '0.95rem',
  },
};
