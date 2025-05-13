import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Analytics() {
    const navigate = useNavigate();
    const [queryData, setQueryData] = useState({});
    const [loadingStates, setLoadingStates] = useState({});
    const [errorStates, setErrorStates] = useState({});
    const [activeQuery, setActiveQuery] = useState(null);

    const queries = [
        {
            id: 1,
            title: "Customers with Loans from a Specific Branch City",
            description: "Retrieves all customers who have taken loans from branches in New York.",
            sql: `SELECT c.Customer_ID, c.Name, l.Loan_Number, l.Amount, br.Branch_City
            FROM Customer c
            JOIN Borrow b ON c.Customer_ID = b.Customer_ID
            JOIN Loan l ON b.Loan_Number = l.Loan_Number
            JOIN Branch br ON l.Branch_Name = br.Branch_Name
            WHERE br.Branch_City = 'New York';`,
            endpoint: '/api/analytics/customers-with-loans?city=New%20York'
        }
        ,
        {
            id: 2,
            title: "Average Transaction Amount on Active Accounts",
            description: "Finds accounts where the average transaction amount is greater than $100.",
            sql: `SELECT t.Account_ID, AVG(t.Transaction_Amount) AS avg_transaction, COUNT(*) AS transaction_count
            FROM Transaction t
            GROUP BY t.Account_ID
            HAVING AVG(t.Transaction_Amount) > 100;`,
            endpoint: '/api/analytics/avg-transaction'
        },
        {
            id: 3,
            title: "Employee Service Load (Number of Customers Served)",
            description: "Identifies employees who serve as bankers and counts the number of customers they manage.",
            sql: `SELECT e.Employee_ID, e.Name, COUNT(b.Customer_ID) AS num_customers
            FROM Employee e
            JOIN Banker b ON e.Employee_ID = b.Employee_ID
            GROUP BY e.Employee_ID, e.Name
            ORDER BY num_customers DESC;`,
            endpoint: '/api/analytics/employee-service'
        },
        {
            id: 4,
            title: "Savings Accounts with Above-Average Interest Rates",
            description: "Finds savings accounts offering an interest rate higher than the average interest rate.",
            sql: `SELECT sa.Account_ID, sa.Rate_of_Interest
            FROM Savings_Acc sa
            WHERE sa.Rate_of_Interest > (SELECT AVG(Rate_of_Interest) FROM Savings_Acc);`,
            endpoint: '/api/analytics/high-interest-savings'
        },
        {
            id: 5,
            title: "Branch Loan and Payment Summary",
            description: "Provides a financial summary for each bank branch showing total loans, payments, and outstanding amounts.",
            sql: `SELECT o.Branch_Name, SUM(l.Amount) AS total_loan, SUM(DISTINCT p.Payment_Amount) AS total_payment,
            (SUM(l.Amount) - SUM(p.Payment_Amount)) AS outstanding_amount
            FROM Originated_By o
            JOIN Loan l ON o.Loan_Number = l.Loan_Number
            JOIN Payment p ON l.Loan_Number = p.Loan_Number
            GROUP BY o.Branch_Name;`,
            endpoint: '/api/analytics/branch-summary'
        }
        
    ];

    const fetchQueryData = async (queryId, endpoint) => {
        console.log(`Starting fetch for query ${queryId}`);
        
        setLoadingStates(prev => ({ ...prev, [queryId]: true }));
        setErrorStates(prev => ({ ...prev, [queryId]: null }));
        setActiveQuery(queryId);
        
        try {
            console.log(`Making request to: ${endpoint}`);
            const response = await axios.get(`http://localhost:3000${endpoint}`);
            console.log('Received response:', response.data);

            setQueryData(prev => ({
                ...prev,
                [queryId]: response.data
            }));

        } catch (err) {
            console.error('Fetch error:', err);
            const errorMessage = err.response?.data?.error || err.message || 'Request failed';
            setErrorStates(prev => ({ ...prev, [queryId]: errorMessage }));
        } finally {
            setLoadingStates(prev => ({ ...prev, [queryId]: false }));
        }
    };

    const renderResults = (data, queryId) => {
        if (loadingStates[queryId]) {
            return (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                    <p>Loading results...</p>
                </div>
            );
        }

        if (errorStates[queryId]) {
            return (
                <div style={{ 
                    backgroundColor: '#ffeeee',
                    padding: '15px',
                    borderRadius: '5px',
                    color: '#cc0000',
                    marginTop: '15px'
                }}>
                    <strong>Error:</strong> {errorStates[queryId]}
                </div>
            );
        }

        if (!data || (Array.isArray(data) && data.length === 0)) {
            return (
                <div style={{ 
                    backgroundColor: '#f8f9fa',
                    padding: '15px',
                    borderRadius: '5px',
                    marginTop: '15px'
                }}>
                    No results found for this query
                </div>
            );
        }

        const results = Array.isArray(data) ? data : [data];
        const headers = results.length > 0 ? Object.keys(results[0]) : [];

        return (
            <div style={{ marginTop: '15px' }}>
                <h4>Results ({results.length} records)</h4>
                <div style={{ 
                    overflowX: 'auto',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    marginTop: '10px'
                }}>
                    <table style={{ 
                        width: '100%',
                        borderCollapse: 'collapse',
                        backgroundColor: 'white'
                    }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f2f2f2' }}>
                                {headers.map(header => (
                                    <th key={header} style={{
                                        padding: '12px',
                                        border: '1px solid #ddd',
                                        textAlign: 'left'
                                    }}>
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((row, index) => (
                                <tr key={index}>
                                    {headers.map(header => (
                                        <td key={`${index}-${header}`} style={{
                                            padding: '12px',
                                            border: '1px solid #ddd'
                                        }}>
                                            {row[header] !== null && row[header] !== undefined 
                                                ? String(row[header]) 
                                                : 'N/A'}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <button 
                onClick={() => navigate('/home')} 
                style={{
                    padding: '10px 15px',
                    borderRadius: '5px',
                    border: 'none',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    cursor: 'pointer',
                    marginBottom: '20px'
                }}
            >
                ← Back to Home
            </button>

            <h2 style={{ color: '#343a40', marginBottom: '10px' }}>Bank Analytics Dashboard</h2>
            <p style={{ color: '#6c757d', marginBottom: '30px' }}>
                Explore various analytical queries about bank operations. Click "Run Query" to execute and view results.
            </p>

            <div style={{ marginTop: '30px' }}>
                {queries.map(query => (
                    <div key={query.id} style={{
                        border: '1px solid #dee2e6',
                        borderRadius: '8px',
                        padding: '20px',
                        marginBottom: '25px',
                        backgroundColor: 'white',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            marginBottom: '15px'
                        }}>
                            <div>
                                <h3 style={{ 
                                    color: '#495057',
                                    marginTop: '0',
                                    marginBottom: '10px'
                                }}>
                                    {query.id}. {query.title}
                                </h3>
                                <p style={{ 
                                    color: '#6c757d',
                                    marginBottom: '15px'
                                }}>
                                    {query.description}
                                </p>
                            </div>
                            <button 
                                onClick={() => fetchQueryData(query.id, query.endpoint)}
                                disabled={loadingStates[query.id]}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: loadingStates[query.id] ? '#6c757d' : '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    minWidth: '100px'
                                }}
                            >
                                {loadingStates[query.id] ? 'Loading...' : 'Run Query'}
                            </button>
                        </div>
                        
                        <div style={{ 
                            backgroundColor: '#f8f9fa',
                            padding: '15px',
                            borderRadius: '5px',
                            marginBottom: '15px',
                            overflowX: 'auto'
                        }}>
                            <pre style={{ margin: '0', whiteSpace: 'pre-wrap' }}>
                                <code>{query.sql}</code>
                            </pre>
                        </div>

                        {activeQuery === query.id && renderResults(queryData[query.id], query.id)}
                    </div>
                ))}
            </div>
        </div>
    );
}