# MS SQL truncate reload flow

Given that you need to have MS SQL Server in order to test this flow, this directory contains extra bits to build a temp instance of a MS SQL Server for you to test from.

## Manually setting up MS SQL Server test env

The file `docker-compose.override.yml` in this directory contains the extra clauses needed to startup a test MS SQL Server bound into the same network as the all-in-one docker for Conveyor.  To use the clause run the following:

### Step 1
From the `conveyor/channel-sources/ms-sql-truncate-reload` diretory run:

```docker-compose -f ../../docker-compose.yml -f docker-compose.override.yml up```

### Step 2
After the database is started up, data needs to be loaded.  Start out by initallizing the table with the following:

```cat init.sql | docker exec -i conveyor_mssql_1 '/opt/mssql-tools/bin/sqlcmd' '-S' 'localhost' '-U' 'SA' '-P' 'YourStrong!Passw0rd'```

### Step 3
Once those steps are complete (assuming no errors) then you can go into conveyer and setup the sql server channel.  For server use `mssql`, username `SA`, pass `YourStrong!Passw0rd`, database `TestDB`.   Reasonable sample query would be `SELECT * FROM Inventory WHERE quantity > 152;`

### (Optional) Step 4
Then more data can be added in by using:

- ```cat add-some1.sql | docker exec -i conveyor_mssql_1 '/opt/mssql-tools/bin/sqlcmd' '-S' 'localhost' '-U' 'SA' '-P' 'YourStrong!Passw0rd'```
- ```cat add-some2.sql | docker exec -i conveyor_mssql_1 '/opt/mssql-tools/bin/sqlcmd' '-S' 'localhost' '-U' 'SA' '-P' 'YourStrong!Passw0rd'```
- ```cat add-some3.sql | docker exec -i conveyor_mssql_1 '/opt/mssql-tools/bin/sqlcmd' '-S' 'localhost' '-U' 'SA' '-P' 'YourStrong!Passw0rd'```

(Use each script only once)

### Shutdown

To shutdown use the same arguments on the `docker-compose` (or the SQL Server stuff won't get cleaned up):

```docker-compose -f ../../docker-compose.yml -f docker-compose.override.yml down```
