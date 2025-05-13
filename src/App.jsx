import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Home from './pages/Home';
import Customers from './pages/Customers';
import Transfer from './pages/Transfer';
import AccountDetails from './pages/AccountDetails';
import Branches from './pages/Branches';
import Employees from './pages/Employees';
import CustomerHome from './pages/CustomerHome';
import CustomerAccounts from './pages/CustomerAccounts';
import LoanOptions from "./pages/LoanOptions.jsx";
import Transactions from "./pages/Transactions.jsx"; 
import ApplyLoan from './pages/ApplyLoan';
import LoanStatus from './pages/LoanStatus'; 
import AddCustomer from "./pages/AddCustomer.jsx";
import AddAccount from "./pages/AddAccount.jsx";
import AllTransfers from "./pages/AllTransfers.jsx";
import LoanRequests from "./pages/LoanRequests.jsx";
import Analytics from './pages/Analytics';


function App() {
  return (
    <div>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* Customer routes */}
        <Route path="/customer" element={<CustomerHome />} />
        <Route path="/customer/accounts" element={<CustomerAccounts />} />
        <Route path="/customer/transfer" element={<Transfer />} />
        <Route path="/customer/loans" element={<LoanOptions />} />
        <Route path="/customer/transactions" element={<Transactions />} /> 
        <Route path="/customer/apply-loan" element={<ApplyLoan />} />
        <Route path="/customer/loan-status" element={<LoanStatus />} />

        {/* Employee routes */}
        <Route path="/employees" element={<Employees />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/accounts" element={<AccountDetails />} />
        <Route path="/branches" element={<Branches />} />
        <Route path="/addcustomer" element={<AddCustomer />} />
        <Route path="/addaccount" element={<AddAccount />} />
        <Route path="/transactions" element={<AllTransfers />} />
        <Route path="/loanrequests" element={<LoanRequests />} />
        <Route path="/analytics" element={<Analytics />} />

        {/* Common routes */}
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
