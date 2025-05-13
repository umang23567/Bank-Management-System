import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchId, setSearchId] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:3000/employees')
      .then(res => {
        setEmployees(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load employees');
        setLoading(false);
      });
  }, []);

  const filteredEmployees = searchId
    ? employees.filter(employee =>
        employee.Employee_ID.toString().includes(searchId)
      )
    : employees;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>👥 Employee Directory</h2>
        <input
          type="text"
          placeholder="🔍 Search Employee ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          style={styles.input}
        />
      </div>

      {loading && <p style={styles.status}>⏳ Loading employees...</p>}
      {error && <p style={styles.error}>❌ {error}</p>}

      {!loading && !error && (
        <div style={styles.cardGrid}>
          {filteredEmployees.length === 0 ? (
            <p style={styles.status}>😕 No employees found{searchId && ` with ID "${searchId}"`}</p>
          ) : (
            filteredEmployees.map(employee => (
              <div key={employee.Employee_ID} style={styles.card}>
                <h3 style={styles.cardTitle}>
                  👤 {employee.Name} (ID: {employee.Employee_ID})
                </h3>
                <div style={styles.cardContent}>
                  <div>
                    <p><strong>📞 Contact:</strong> {employee.Contact_Number}</p>
                    <p><strong>📅 Start Date:</strong> {new Date(employee.Start_Date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p><strong>👨‍💼 Manager ID:</strong> {employee.Manager_ID || 'None'}</p>
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
    background: 'linear-gradient(to right, #f5f7fa, #c3cfe2)',
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
  input: {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    minWidth: '200px',
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
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
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
