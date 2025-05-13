-- Inserting into Customer
INSERT INTO Customer VALUES 
(1, 'Alice Johnson', '1990-05-21', '9876543210', '123 Main St', 'New York', 'NY', '10001'),
(2, 'Bob Smith', '1985-08-15', '9876543211', '456 Elm St', 'Los Angeles', 'CA', '90001'),
(3, 'Charlie Brown', '1992-12-03', '9876543212', '789 Pine St', 'Chicago', 'IL', '60601'),
(4, 'Diana Green', '1995-07-11', '9876543213', '159 Oak St', 'Houston', 'TX', '77001'),
(5, 'Evan Harris', '1988-09-25', '9876543214', '753 Birch St', 'Phoenix', 'AZ', '85001'),
(6, 'Fiona White', '1993-11-30', '9876543215', '951 Maple St', 'San Francisco', 'CA', '94101');

-- Inserting into Branch
INSERT INTO Branch VALUES 
('Downtown', 'New York', 5000000.00, 2000000.00),
('Uptown', 'Los Angeles', 3000000.00, 1000000.00),
('Midtown', 'Chicago', 4000000.00, 1500000.00),
('Westside', 'Houston', 3500000.00, 1200000.00),
('Eastside', 'Phoenix', 2500000.00, 900000.00),
('Central', 'San Francisco', 4500000.00, 1800000.00);

-- Inserting into Loan
INSERT INTO Loan VALUES 
(101, 50000.00, 'Downtown'),
(102, 75000.00, 'Uptown'),
(103, 60000.00, 'Midtown'),
(104, 80000.00, 'Westside'),
(105, 55000.00, 'Eastside'),
(106, 90000.00, 'Central');

-- Inserting into Account
INSERT INTO Account VALUES 
(1001, 1500.00, 'Savings'),
(1002, 2000.00, 'Current'),
(1003, 2500.00, 'Savings'),
(1004, 3000.00, 'Current'),
(1005, 1800.00, 'Savings'),
(1006, 4000.00, 'Current');

-- Inserting into Savings_Acc
INSERT INTO Savings_Acc VALUES 
(1001, 500.00, 2.5),
(1003, 600.00, 2.7),
(1005, 450.00, 2.8);

-- Inserting into Current_Acc
INSERT INTO Current_Acc VALUES 
(1002, 10.00),
(1004, 12.50),
(1006, 15.00);

-- Inserting into Transaction
INSERT INTO Transaction VALUES 
(5001, 200.00, '2024-02-10', 1001),
(5002, 300.00, '2024-02-11', 1002),
(5003, 150.00, '2024-02-12', 1003),
(5004, 500.00, '2024-02-13', 1004),
(5005, 250.00, '2024-02-14', 1005),
(5006, 100.00, '2024-02-15', 1006);

-- Inserting into Payment
INSERT INTO Payment VALUES 
(6001, 1000.00, '2024-02-12', 101),
(6002, 1200.00, '2024-02-13', 102),
(6003, 1300.00, '2024-02-14', 103),
(6004, 1400.00, '2024-02-15', 104),
(6005, 1100.00, '2024-02-16', 105),
(6006, 900.00, '2024-02-17', 106);

-- Inserting into Employee
INSERT INTO Employee VALUES 
(2001, 'David White', '9876543216', '2020-01-15', NULL),
(2002, 'Emma Stone', '9876543217', '2018-06-20', 2001),
(2003, 'Frank Martin', '9876543218', '2019-03-10', 2001),
(2004, 'Grace Hall', '9876543219', '2021-09-05', 2002),
(2005, 'Hank Wilson', '9876543220', '2017-12-11', 2003),
(2006, 'Ivy Adams', '9876543221', '2016-08-25', 2004);

-- Inserting into Borrow
INSERT INTO Borrow VALUES 
(1, 101),
(2, 102),
(3, 103),
(4, 104),
(5, 105),
(6, 106);

-- Inserting into Deposit
INSERT INTO Deposit VALUES 
(1, 1001),
(2, 1002),
(3, 1003),
(4, 1004),
(5, 1005),
(6, 1006);

-- Inserting into Transfer_Money
INSERT INTO Transfer_Money VALUES 
(1001, 1002),
(1003, 1004),
(1005, 1006);

-- Inserting into Banker
INSERT INTO Banker VALUES 
(2001, 1),
(2002, 2),
(2003, 3),
(2004, 4),
(2005, 5),
(2006, 6);

-- Inserting into Loan_Payment
INSERT INTO Loan_Payment VALUES 
(101, 6001),
(102, 6002),
(103, 6003),
(104, 6004),
(105, 6005),
(106, 6006);

-- Inserting into Originated_By
INSERT INTO Originated_By VALUES 
('Downtown', 101),
('Uptown', 102),
('Midtown', 103),
('Westside', 104),
('Eastside', 105),
('Central', 106);Account