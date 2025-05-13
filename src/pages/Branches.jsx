import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Branches() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchName, setSearchName] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:3000/branches')
      .then(res => {
        setBranches(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('❌ Failed to load branches');
        setLoading(false);
      });
  }, []);

  const filteredBranches = searchName
    ? branches.filter(branch =>
        branch.Branch_Name.toLowerCase().includes(searchName.toLowerCase())
      )
    : branches;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>🏢 Branch Directory</h2>
        <input
          type="text"
          placeholder="🔍 Enter Branch Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          style={styles.input}
        />
      </div>

      {loading && <p style={styles.status}>⏳ Loading branches...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {!loading && !error && (
        <div style={styles.grid}>
          {filteredBranches.length === 0 ? (
            <p style={styles.status}>
              😕 No branches found{searchName && ` with name containing "${searchName}"`}
            </p>
          ) : (
            filteredBranches.map(branch => {
              const netWorth = branch.Assets - branch.Liabilities;
              return (
                <div key={branch.Branch_Name} style={styles.card}>
                  <h3 style={styles.branchTitle}>
                    🏙️ {branch.Branch_Name} - {branch.Branch_City}
                  </h3>
                  <div style={styles.infoGrid}>
                    <div>
                      <p>💰 <strong>Assets:</strong> ${branch.Assets.toLocaleString()}</p>
                      <p>💸 <strong>Liabilities:</strong> ${branch.Liabilities.toLocaleString()}</p>
                    </div>
                    <div>
                      <p style={{
                        color: netWorth >= 0 ? '#27ae60' : '#c0392b',
                        fontWeight: 'bold'
                      }}>
                        {netWorth >= 0 ? '📈' : '📉'} <strong>Net Worth:</strong> ${netWorth.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '40px 20px',
    background: 'linear-gradient(to right, #eef2f3, #f9f9f9)',
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
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
  },
  card: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    transition: 'transform 0.2s',
  },
  branchTitle: {
    marginBottom: '10px',
    color: '#34495e',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    fontSize: '0.95rem',
  },
};
