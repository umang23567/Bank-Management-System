import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{ padding: '10px', background: '#ddd' }}>
      <Link to="/">Home</Link> |{" "}
      <Link to="/customers">Customers</Link> |{" "}
      <Link to="/accounts">AccountDetails</Link> |{" "}
      <Link to="/branches">Branches</Link> |{" "}
      <Link to="/employees">Employees</Link> |{" "}
      <Link to="/transfer">Transfer</Link>
    </nav>
  );
}
