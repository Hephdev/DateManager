
-- 1. Declarar las variables necesarias
DECLARE @clientid uniqueidentifier;
DECLARE @FechaInicio DATETIME2;
DECLARE @FechaFin DATETIME2;


-- 2. Asignar los valores desde la consulta SELECT
SELECT TOP 1 
    @clientid = clientid, 
    @FechaInicio = startUTC,
    @FechaFin = endUTC
FROM Appointment


-- 3. Ejecutar el procedimiento con las variables
EXEC sp_ReporteCitasPorCliente @clientid, @FechaInicio, @FechaFin

----------------------------------------------------------------------

-- 1. Declarar las variables necesarias
DECLARE @serviceid uniqueidentifier;
DECLARE @FechaInicio DATETIME2;
DECLARE @FechaFin DATETIME2;


-- 2. Asignar los valores desde la consulta SELECT
SELECT TOP 1 
    @serviceid = serviceid, 
    @FechaInicio = startUTC,
    @FechaFin = endUTC
FROM [Appointment]


-- 3. Ejecutar el procedimiento con las variables
EXEC [dbo].[sp_ReporteOcupacionPorServicio]  @serviceid, @FechaInicio, @FechaFin

----------------------------------------------------------------------

-- 1. Declarar las variables necesarias
DECLARE @id uniqueidentifier;

SELECT TOP 1 * FROM Cliente

-- 2. Asignar los valores desde la consulta SELECT
SELECT TOP 1 
    @id = [id]
FROM Cliente

-- 3. Ejecutar el procedimiento con las variables
EXEC sp_Cliente_Eliminar @id

SELECT TOP 1 * FROM Cliente

----------------------------------------------------------------------

-- 1. Declarar las variables necesarias
DECLARE @id uniqueidentifier;
DECLARE @name nvarchar(50);
DECLARE @lastname nvarchar(50);
DECLARE @phonenumber nvarchar(20);
DECLARE @email nvarchar(100);

SELECT TOP 1 * FROM Cliente

-- 2. Asignar los valores desde la consulta SELECT
SELECT TOP 1 
    @id = [id], 
    @name = clientName,
    @lastname = clientLastName,
    @email = email
FROM Cliente
SET @phoneNumber = '1234567890'

-- 3. Ejecutar el procedimiento con las variables
EXEC sp_Cliente_Actualizar @id, @name, @lastname, @phonenumber, @email

SELECT TOP 1 * FROM Cliente

----------------------------------------------------------------------

-- 1. Declarar las variables necesarias
DECLARE @name nvarchar(50);
DECLARE @lastname nvarchar(50);
DECLARE @phonenumber nvarchar(20);
DECLARE @email nvarchar(100);



-- 2. Asignar los valores desde la consulta SELECT
SET @name = 'Andres'
SET @lastname = 'Diaz'
SET @email ='andres.diaz@mail.com'
SET @phoneNumber = '1234567890'

SELECT TOP 1 * FROM Cliente WHERE clientName = @name

-- 3. Ejecutar el procedimiento con las variables
EXEC [sp_Cliente_Insertar] @name, @lastname, @phonenumber, @email

SELECT TOP 1 * FROM Cliente WHERE clientName = @name


