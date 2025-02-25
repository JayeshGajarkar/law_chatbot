# law_chatbot
 RAG based chatbot application


-- Create the tables
CREATE TABLE Customers_J3 (
    CustomerID INT PRIMARY KEY,
    CustomerName VARCHAR(100),
    Email VARCHAR(100),
    PhoneNumber VARCHAR(15)
);

CREATE TABLE Accounts_J3 (
    AccountID INT PRIMARY KEY CLUSTERED,
    CustomerID INT,
    AccountNumber VARCHAR(20) UNIQUE,
    Balance DECIMAL(10, 2),
    AccountType VARCHAR(50),
    FOREIGN KEY (CustomerID) REFERENCES Customers_J3(CustomerID)
);

CREATE TABLE Transactions_J3 (
    TransactionID INT PRIMARY KEY IDENTITY(1,1),
    AccountID INT,
    TransactionType VARCHAR(10),
    Amount DECIMAL(10, 2),
    TransactionDate DATETIME,
    FOREIGN KEY (AccountID) REFERENCES Accounts_J3(AccountID)
);

CREATE TABLE Audit_Transactions_J3 (
    AuditID INT PRIMARY KEY IDENTITY(1,1),
    AccountID INT,
    Amount DECIMAL(10, 2),
    TransactionDate DATETIME,
    Action VARCHAR(10)
);

-- Insert sample data
INSERT INTO Customers_J3 (CustomerID, CustomerName, Email, PhoneNumber)
VALUES (1, 'John Doe', 'john.doe@example.com', '1234567890'),
       (2, 'Jane Smith', 'jane.smith@example.com', '0987654321'),
       (3, 'Alice Johnson', 'alice.johnson@example.com', '1122334455'),
       (4, 'Bob Brown', 'bob.brown@example.com', '2233445566'),
       (5, 'Charlie Davis', 'charlie.davis@example.com', '3344556677');

INSERT INTO Accounts_J3 (AccountID, CustomerID, AccountNumber, Balance, AccountType)
VALUES (1, 1, 'ACC123', 5000.00, 'Savings'),
       (2, 2, 'ACC456', 3000.00, 'Checking'),
       (3, 3, 'ACC789', 7000.00, 'Savings'),
       (4, 4, 'ACC012', 2000.00, 'Checking'),
       (5, 5, 'ACC345', 10000.00, 'Savings');

INSERT INTO Transactions_J3 (AccountID, TransactionType, Amount, TransactionDate)
VALUES (1, 'Credit', 1000.00, GETDATE()),
       (2, 'Debit', 500.00, GETDATE()),
       (3, 'Credit', 2000.00, GETDATE()),
       (4, 'Debit', 1500.00, GETDATE()),
       (5, 'Credit', 3000.00, GETDATE()),
       (1, 'Debit', 200.00, GETDATE()),
       (2, 'Credit', 800.00, GETDATE()),
       (3, 'Debit', 1000.00, GETDATE()),
       (4, 'Credit', 500.00, GETDATE()),
       (5, 'Debit', 700.00, GETDATE());



-- Task 1: Implement Indexing for Performance Optimization
CREATE NONCLUSTERED INDEX idx_CustomerName_J3 ON Customers_J3(CustomerName);
CREATE NONCLUSTERED INDEX idx_TransactionDate_Amount_J3 ON Transactions_J3(TransactionDate, Amount);
CREATE UNIQUE INDEX idx_AccountNumber_J3 ON Accounts_J3(AccountNumber);

-- Task 2: Create a Scalar Function for Interest Calculation
GO 
CREATE FUNCTION calculateInterest_J1(@AccountID INT)
RETURNS DECIMAL(10,2)
AS
BEGIN
	DECLARE @INTEREST DECIMAL(10,2)
	DECLARE @BALANCE DECIMAL(10,2)
	SELECT @BALANCE=Balance FROM Accounts_J3 WHERE AccountID=@AccountID;
	SET @INTEREST=@BALANCE*0.05;
	RETURN @INTEREST;
END
GO

SELECT AccountID,dbo.calculateInterest_J1(AccountID) FROM Accounts_J3;

-- Task 3: Create a Stored Procedure for Transactions
GO 
CREATE PROCEDURE transferMoney_J3 
	@FromAccountID INT,
	@ToAccountID INT,
	@Amount DECIMAL(10,2)
AS
BEGIN
	DECLARE @FromBalance DECIMAL(10,2);
	SELECT @FromBalance=Balance FROM Accounts_J3 WHERE AccountID=@FromAccountID;
	IF @FromBalance<@Amount
	BEGIN
		PRINT 'Insufficient funds in the Account';
		RETURN
	END
	UPDATE Accounts_J3 SET Balance=Balance-@Amount WHERE AccountID=@FromAccountID;
	UPDATE Accounts_J3 SET Balance=Balance+@Amount WHERE AccountID=@ToAccountID;
	INSERT INTO Transactions_J3 (AccountID, TransactionType, Amount, TransactionDate)
	VALUES (@FromAccountID,'Deposit',@Amount,GETDATE()),
	(@ToAccountID,'Credit',@Amount,GETDATE());
END
GO



-- Task 4: Implement a Trigger for Preventing Overdrafts
GO
CREATE TRIGGER PreventOverdraft_J2
ON Accounts_J3
INSTEAD OF INSERT
AS
BEGIN
    DECLARE @NewBalance DECIMAL(10, 2);
    DECLARE @AccountID INT;
    SELECT @NewBalance = i.Balance, @AccountID = i.AccountID FROM inserted i;
    IF @NewBalance < 0
    BEGIN
        PRINT 'Insufficient funds! Transaction aborted.';
        ROLLBACK;
    END
    ELSE
    BEGIN
        UPDATE Accounts_J3 SET Balance = i.Balance FROM inserted i WHERE Accounts_J3.AccountID = i.AccountID;
    END
END;
GO

-- Task 5: Implement an Audit Trigger for Transactions
GO
CREATE TRIGGER AuditTransactions_J2
ON Transactions_J3
AFTER INSERT
AS
BEGIN
    INSERT INTO Audit_Transactions_J3 (AccountID, Amount, TransactionDate, Action)
    SELECT AccountID, Amount, TransactionDate, 'INSERT' FROM inserted;
END;
GO



EXEC transferMoney_J3 @FromAccountID = 2, @ToAccountID = 1, @Amount = 500.00;

SELECT * FROM Audit_Transactions_J3;
SELECT * FROM Transactions_J3;


