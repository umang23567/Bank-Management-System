use bank;
-- Query1: List Customers with Loans from a Specific Branch City (New York)
-- Retrieve all customers who have taken loans from branches located in 
-- New York, including their loan numbers, amounts, and branch city.
SELECT c.Customer_ID,
       c.Name,
       l.Loan_Number,
       l.Amount,
       br.Branch_City
FROM Customer c
JOIN Borrow b ON c.Customer_ID = b.Customer_ID
JOIN Loan l ON b.Loan_Number = l.Loan_Number
JOIN Branch br ON l.Branch_Name = br.Branch_Name
WHERE br.Branch_City = 'New York';

-- Query2: Average Transaction Amount on Active Accounts
-- For accounts list each account’s average transaction amount
-- (only include accounts where the average exceeds $100).
SELECT t.Account_ID,
       AVG(t.Transaction_Amount) AS avg_transaction,
       COUNT(*) AS transaction_count
FROM Transaction t
GROUP BY t.Account_ID
HAVING AVG(t.Transaction_Amount) > 100;

-- Query3: List each employee along with the number of customers they serve. 
-- Sorting the results by the number of customers (descending).
SELECT e.Employee_ID,
       e.Name,
       COUNT(b.Customer_ID) AS num_customers
FROM Employee e
JOIN Banker b ON e.Employee_ID = b.Employee_ID
GROUP BY e.Employee_ID, e.Name
ORDER BY num_customers DESC;

-- Query4: Savings Accounts with Above-Average Interest Rates
-- Find all savings accounts that offer a rate of interest higher than the average
-- interest rate among all savings accounts
SELECT sa.Account_ID,
       sa.Rate_of_Interest
FROM Savings_Acc sa
WHERE sa.Rate_of_Interest > (SELECT AVG(Rate_of_Interest) FROM Savings_Acc);

-- Query5: Branch Loan and Payment Summary
-- For each branch, calculate the total amount of loans originated, the total 
-- payments received, and the outstanding amount.
SELECT o.Branch_Name,
       SUM(l.Amount) AS total_loan,
       SUM(distinct p.Payment_Amount) AS total_payment,
       (SUM(l.Amount) - SUM(p.Payment_Amount)) AS outstanding_amount
FROM Originated_By o
JOIN Loan l ON o.Loan_Number = l.Loan_Number
JOIN Payment p ON l.Loan_Number = p.Loan_Number
GROUP BY o.Branch_Name;

-- Query6: Top 3 Customers by Total Account Balance
-- Find the top 3 customers who have the highest total balance across all their accounts.
SELECT d.Customer_ID,
       SUM(a.Balance) AS total_balance
FROM Deposit d
JOIN Account a ON d.Account_ID = a.Account_ID
GROUP BY d.Customer_ID
ORDER BY total_balance DESC
LIMIT 3;

-- Query7: Latest Transaction per Account
-- For each account, display the most recent transaction (date and amount).
SELECT t.Account_ID,
       t.Transaction_Amount,
       t.Transaction_Date
FROM Transaction t
WHERE t.Transaction_Date = (
    SELECT MAX(t2.Transaction_Date)
    FROM Transaction t2
    WHERE t2.Account_ID = t.Account_ID
);

-- Query8: Counting Subordinates under each manager
-- Identify employees who act as managers and list the
-- number of subordinates they manage.
SELECT m.Employee_ID,
       m.Name,
       COUNT(s.Employee_ID) AS subordinate_count
FROM Employee m
JOIN Employee s ON m.Employee_ID = s.Manager_ID
GROUP BY m.Employee_ID, m.Name;

-- Query9: Cross-State Money Transfers
-- Retrieve transfers where the sender’s account belongs to a customer
-- in New York and the receiver’s account belongs to a customer in Los Angeles .
SELECT tm.From_Account_ID,
       tm.To_Account_ID
FROM Transfer_Money tm
JOIN Deposit d1 ON tm.From_Account_ID = d1.Account_ID
JOIN Customer c1 ON d1.Customer_ID = c1.Customer_ID
JOIN Deposit d2 ON tm.To_Account_ID = d2.Account_ID
JOIN Customer c2 ON d2.Customer_ID = c2.Customer_ID
WHERE c1.City = 'New York'
  AND c2.City = 'Los Angeles';
  
-- Query10: Accounts with Transactions in Only a Specific Month
-- List details of accounts that have transactions exclusively in a given month
--  (March, represented by month number 3).
SELECT a.Account_ID,
       a.Balance,
       a.Type
FROM Account a
WHERE a.Account_ID IN (
    SELECT t.Account_ID
    FROM Transaction t
    GROUP BY t.Account_ID
    HAVING MAX(EXTRACT(MONTH FROM t.Transaction_Date)) = 2
);













