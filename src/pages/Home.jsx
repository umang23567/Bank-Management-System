import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/login');
    };

    return (
        <div style={styles.container}>
            <button onClick={handleLogout} style={styles.logoutButton}>
                🔒 Logout
            </button>

            <h1 style={styles.heading}>Welcome to Your Dashboard</h1>
            <p style={styles.subheading}>What would you like to do today?</p>

            <div style={styles.grid}>
                {dashboardOptions.map(({ label, icon, route }) => (
                    <div
                        key={label}
                        onClick={() => navigate(route)}
                        style={styles.card}
                    >
                        <div style={styles.icon}>{icon}</div>
                        <h3 style={styles.cardTitle}>{label}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
}

const dashboardOptions = [
    { label: 'View Employees', icon: '👥', route: '/employees' },
    { label: 'View Customers', icon: '🧍‍♂️', route: '/customers' },
    { label: 'View Accounts', icon: '🏦', route: '/accounts' },
    { label: 'View Branches', icon: '🏢', route: '/branches' },
    { label: 'View Transactions', icon: '💰', route: '/transactions' },
    { label: 'Add Customer', icon: '➕', route: '/addcustomer' },
    { label: 'Add Account', icon: '➕', route: '/addaccount' },
    { label: 'Manage Loan Requests', icon: '🛠️', route: '/loanrequests' },
    { label: 'View Analytics', icon: '📊', route: '/analytics' },
];

const styles = {
    container: {
        minHeight: '100vh',
        padding: '40px 20px',
        background: 'linear-gradient(135deg, #eef2f3, #dfe9f3)',
        fontFamily: 'Arial, sans-serif',
        position: 'relative',
    },
    logoutButton: {
        position: 'absolute',
        top: '20px',
        right: '20px',
        padding: '10px 20px',
        borderRadius: '8px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    heading: {
        textAlign: 'center',
        fontSize: '2.5rem',
        color: '#333',
        marginBottom: '10px',
    },
    subheading: {
        textAlign: 'center',
        fontSize: '1.2rem',
        color: '#666',
        marginBottom: '40px',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '25px',
        padding: '0 20px',
    },
    card: {
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '15px',
        boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
        textAlign: 'center',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    },
    icon: {
        fontSize: '2rem',
        marginBottom: '10px',
    },
    cardTitle: {
        fontSize: '1.1rem',
        fontWeight: 'bold',
        color: '#333',
    },
};

