import { useEffect, useState } from 'react';
import axios from 'axios';

export default function LoanRequests() {
  const [loanRequests, setLoanRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdate, setStatusUpdate] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLoanRequests();
  }, []);

  const fetchLoanRequests = () => {
    setLoading(true);
    axios.get('http://localhost:3000/loan-requests')
      .then(res => {
        setLoanRequests(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to fetch loan requests');
        setLoading(false);
      });
  };

  const handleStatusChange = (id, status) => {
    const remarks = statusUpdate[id]?.remarks || '';
    axios.patch(`http://localhost:3000/loan-request/${id}/status`, { status, remarks })
      .then(() => fetchLoanRequests())
      .catch(err => {
        console.error(err);
        alert('❌ Failed to update loan status');
      });
  };

  const handleRemarksChange = (id, value) => {
    setStatusUpdate(prev => ({
      ...prev,
      [id]: { ...prev[id], remarks: value }
    }));
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.heading}>📋 Manage Loan Requests</h2>

        {loading && <p style={styles.loading}>⏳ Loading loan requests...</p>}
        {error && <p style={styles.error}>{error}</p>}
        {!loading && loanRequests.length === 0 && <p>No loan requests found.</p>}

        <div style={styles.grid}>
          {loanRequests.map(request => (
            <div key={request.Request_ID} style={styles.card}>
              <h3 style={styles.title}>Request #{request.Request_ID}</h3>
              <p><strong>👤 Customer:</strong> {request.Customer_Name} (ID: {request.Customer_ID})</p>
              <p><strong>💰 Amount:</strong> ${request.Requested_Amount}</p>
              <p><strong>📅 Date:</strong> {new Date(request.Request_Date).toLocaleDateString()}</p>
              <p><strong>📌 Purpose:</strong> {request.Loan_Purpose}</p>
              <p><strong>🏢 Branch:</strong> {request.Preferred_Branch || 'Not specified'}</p>
              <p>
                <strong>Status:</strong>
                <span style={{ ...styles.statusBadge, backgroundColor: getStatusColor(request.Status) }}>
                  {request.Status}
                </span>
              </p>
              {request.Remarks && <p><strong>📝 Remarks:</strong> {request.Remarks}</p>}

              {request.Status === 'Pending' && (
                <>
                  <textarea
                    placeholder="Add optional remarks"
                    rows={2}
                    style={styles.textarea}
                    value={statusUpdate[request.Request_ID]?.remarks || ''}
                    onChange={(e) => handleRemarksChange(request.Request_ID, e.target.value)}
                  />

                  <div style={styles.buttonGroup}>
                    <button
                      style={{ ...styles.button, backgroundColor: '#28a745' }}
                      onClick={() => handleStatusChange(request.Request_ID, 'Approved')}
                    >
                      ✅ Approve
                    </button>
                    <button
                      style={{ ...styles.button, backgroundColor: '#dc3545' }}
                      onClick={() => handleStatusChange(request.Request_ID, 'Rejected')}
                    >
                      ❌ Reject
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getStatusColor(status) {
  switch (status) {
    case 'Approved': return '#2ecc71';
    case 'Rejected': return '#e74c3c';
    case 'Pending': return '#f39c12';
    default: return '#7f8c8d';
  }
}

const styles = {
  page: {
    backgroundColor: '#f4f6f8',
    minHeight: '100vh',
    padding: '40px 20px',
  },
  container: {
    maxWidth: '1000px',
    margin: '0 auto'
  },
  heading: {
    fontSize: '1.8rem',
    marginBottom: '25px',
    color: '#2c3e50',
    textAlign: 'center'
  },
  loading: {
    color: '#555',
    textAlign: 'center'
  },
  error: {
    color: '#e74c3c',
    marginBottom: '15px',
    textAlign: 'center'
  },
  grid: {
    display: 'grid',
    gap: '20px'
  },
  card: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
    lineHeight: '1.6'
  },
  title: {
    marginBottom: '10px',
    fontSize: '1.2rem',
    color: '#34495e'
  },
  statusBadge: {
    marginLeft: '10px',
    color: 'white',
    padding: '3px 8px',
    borderRadius: '5px',
    fontWeight: 'bold',
    fontSize: '0.9rem'
  },
  textarea: {
    width: '100%',
    marginTop: '12px',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '1rem'
  },
  buttonGroup: {
    marginTop: '12px',
    display: 'flex',
    gap: '12px'
  },
  button: {
    padding: '10px 16px',
    borderRadius: '6px',
    color: 'white',
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};
