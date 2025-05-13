CREATE DATABASE bank;
USE bank;

CREATE TABLE Customer (
    Customer_ID INT PRIMARY KEY CHECK (Customer_ID > 0),
    Name VARCHAR(100) NOT NULL,
    DOB DATE NOT NULL , 
    Phone_Number VARCHAR(15) UNIQUE CHECK (Phone_Number REGEXP '^[0-9]{10,15}$'),
    Street VARCHAR(255) NOT NULL,
    City VARCHAR(100) NOT NULL,
    State VARCHAR(100) NOT NULL,
    Pincode VARCHAR(10) NOT NULL CHECK (Pincode REGEXP '^[0-9]{5,10}$')
);

CREATE TABLE Branch (
    Branch_Name VARCHAR(100) PRIMARY KEY,
    Branch_City VARCHAR(100) NOT NULL,
    Assets DECIMAL(15,2) NOT NULL CHECK (Assets >= 0),
    Liabilities DECIMAL(15,2) NOT NULL CHECK (Liabilities >= 0)
);

CREATE TABLE Loan (
    Loan_Number INT PRIMARY KEY CHECK (Loan_Number > 0),
    Amount DECIMAL(15,2) NOT NULL CHECK (Amount > 0),
    Branch_Name VARCHAR(100),
    FOREIGN KEY (Branch_Name) REFERENCES Branch(Branch_Name) ON DELETE SET NULL
);

CREATE TABLE Account (
    Account_ID INT PRIMARY KEY CHECK (Account_ID > 0),
    Balance DECIMAL(15,2) NOT NULL CHECK (Balance >= 0),
    Type ENUM('Savings', 'Current') NOT NULL
);

CREATE TABLE Savings_Acc (
    Account_ID INT PRIMARY KEY,
    Daily_Withdrawal_Limit DECIMAL(10,2) NOT NULL CHECK (Daily_Withdrawal_Limit > 0),
    Rate_of_Interest DECIMAL(5,2) NOT NULL CHECK (Rate_of_Interest BETWEEN 0 AND 100),
    FOREIGN KEY (Account_ID) REFERENCES Account(Account_ID) ON DELETE CASCADE
);

CREATE TABLE Current_Acc (
    Account_ID INT PRIMARY KEY,
    Transaction_Charges DECIMAL(10,2) NOT NULL CHECK (Transaction_Charges >= 0),
    FOREIGN KEY (Account_ID) REFERENCES Account(Account_ID) ON DELETE CASCADE
);

CREATE TABLE Transaction (
    Transaction_ID INT PRIMARY KEY CHECK (Transaction_ID > 0),
    Transaction_Amount DECIMAL(15,2) NOT NULL CHECK (Transaction_Amount > 0),
    Transaction_Date DATE NOT NULL ,
    Account_ID INT,
    FOREIGN KEY (Account_ID) REFERENCES Account(Account_ID) ON DELETE CASCADE
);

CREATE TABLE Payment (
    Payment_ID INT PRIMARY KEY CHECK (Payment_ID > 0),
    Payment_Amount DECIMAL(15,2) NOT NULL CHECK (Payment_Amount > 0),
    Payment_Date DATE NOT NULL ,
    Loan_Number INT,
    FOREIGN KEY (Loan_Number) REFERENCES Loan(Loan_Number) ON DELETE CASCADE
);

CREATE TABLE Employee (
    Employee_ID INT PRIMARY KEY CHECK (Employee_ID > 0),
    Name VARCHAR(100) NOT NULL,
    Contact_Number VARCHAR(15) UNIQUE CHECK (Contact_Number REGEXP '^[0-9]{10,15}$'),
    Start_Date DATE NOT NULL ,
    Manager_ID INT,
    FOREIGN KEY (Manager_ID) REFERENCES Employee(Employee_ID) ON DELETE SET NULL
);

CREATE TABLE Borrow (
    Customer_ID INT,
    Loan_Number INT,
    PRIMARY KEY (Customer_ID, Loan_Number),
    FOREIGN KEY (Customer_ID) REFERENCES Customer(Customer_ID) ON DELETE CASCADE,
    FOREIGN KEY (Loan_Number) REFERENCES Loan(Loan_Number) ON DELETE CASCADE
);

CREATE TABLE Deposit (
    Customer_ID INT,
    Account_ID INT,
    PRIMARY KEY (Customer_ID, Account_ID),
    FOREIGN KEY (Customer_ID) REFERENCES Customer(Customer_ID) ON DELETE CASCADE,
    FOREIGN KEY (Account_ID) REFERENCES Account(Account_ID) ON DELETE CASCADE
);

CREATE TABLE Transfer_Money (
    From_Account_ID INT,
    To_Account_ID INT,
    FOREIGN KEY (From_Account_ID) REFERENCES Account(Account_ID) ON DELETE CASCADE,
    FOREIGN KEY (To_Account_ID) REFERENCES Account(Account_ID) ON DELETE CASCADE
);

CREATE TABLE Banker (
    Employee_ID INT,
    Customer_ID INT,
    PRIMARY KEY (Employee_ID, Customer_ID),
    FOREIGN KEY (Employee_ID) REFERENCES Employee(Employee_ID) ON DELETE CASCADE,
    FOREIGN KEY (Customer_ID) REFERENCES Customer(Customer_ID) ON DELETE CASCADE
);

CREATE TABLE Loan_Payment (
    Loan_Number INT,
    Payment_ID INT,
    PRIMARY KEY (Loan_Number, Payment_ID),
    FOREIGN KEY (Loan_Number) REFERENCES Loan(Loan_Number) ON DELETE CASCADE,
    FOREIGN KEY (Payment_ID) REFERENCES Payment(Payment_ID) ON DELETE CASCADE
);

CREATE TABLE Originated_By (
    Branch_Name VARCHAR(100),
    Loan_Number INT,
    PRIMARY KEY (Branch_Name, Loan_Number),
    FOREIGN KEY (Branch_Name) REFERENCES Branch(Branch_Name) ON DELETE CASCADE,
    FOREIGN KEY (Loan_Number) REFERENCES Loan(Loan_Number) ON DELETE CASCADE
);