import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const customerId = localStorage.getItem('userId');

  useEffect(() => {
    if (!customerId) {
      navigate('/login');
      return;
    }

    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/customer/${customerId}/transactions`);
        setTransactions(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load transactions');
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [customerId, navigate]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading transactions...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <button 
        onClick={() => navigate('/customer')}
        style={{ marginBottom: '20px', padding: '8px 16px' }}
      >
        ← Back to Dashboard
      </button>

      <h2>Recent Transactions</h2>
      
      {transactions.length === 0 ? (
        <p>No transactions found</p>
      ) : (
        <div style={{ marginTop: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Date</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Account</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Type</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Related Account</th>
                <th style={{ padding: '12px', textAlign: 'right', borderBottom: '1px solid #ddd' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.Transaction_ID} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '12px' }}>{formatDate(tx.Transaction_Date)}</td>
                  <td style={{ padding: '12px' }}>Account #{tx.Account_ID}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      backgroundColor: tx.type === 'Credit' ? '#d4edda' : '#f8d7da',
                      color: tx.type === 'Credit' ? '#155724' : '#721c24',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontWeight: 'bold'
                    }}>
                      {tx.type}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    {tx.related_account ? `Account #${tx.related_account}` : 'N/A'}
                  </td>
                  <td style={{ 
                    padding: '12px', 
                    textAlign: 'right',
                    color: tx.type === 'Credit' ? 'green' : 'red',
                    fontWeight: 'bold'
                  }}>
                    {tx.type === 'Credit' ? '+' : '-'}
                    ${Math.abs(tx.Transaction_Amount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}