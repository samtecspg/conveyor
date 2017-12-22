CREATE DATABASE TestDB
SELECT Name from sys.Databases
go
USE TestDB
CREATE TABLE Inventory (id INT, name NVARCHAR(50), quantity INT)
INSERT INTO Inventory VALUES (1, 'banana', 150); INSERT INTO Inventory VALUES (2, 'orange', 154);
go
SELECT * FROM Inventory;
go
quit
