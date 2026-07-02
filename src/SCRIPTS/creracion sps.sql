use DateManager

CREATE PROCEDURE sp_ReporteCitasPorCliente
@clientID UNIQUEIDENTIFIER,
@fechaInicio datetime2 (7),
@fechaFin datetime2 (7)
AS 
BEGIN 

SET NOCOUNT ON;

SELECT
a.id            AS appointmentId,
s.[name]        AS servicio,
a.startUTC,
a.endUTC,
DATEDIFF(MINUTE, a.startUTC, a.endUTC) AS minutosDuracion,
a.[status]
FROM Appointment a
    INNER JOIN [Service] s ON s.id = a.serviceid
WHERE a.clientid = @clientId
      AND a.startUTC BETWEEN @fechaInicio AND @fechaFin
ORDER BY a.startUTC;


SELECT
COUNT(*)                                          AS totalCitas,
SUM(DATEDIFF(MINUTE, a.startUTC, a.endUTC))        AS totalMinutosReservados,
SUM(CASE WHEN a.[status] = 1 THEN 1 ELSE 0 END)    AS citasConfirmadas,
SUM(CASE WHEN a.[status] = 0 THEN 1 ELSE 0 END)    AS citasPendientes
FROM Appointment a
WHERE a.clientid = @clientId
      AND a.startUTC BETWEEN @fechaInicio AND @fechaFin;
END
GO
----------------------------------------------------------------------
CREATE PROCEDURE sp_ReporteOcupacionPorServicio
    @serviceId   uniqueidentifier,
    @fechaInicio datetime2 (7),
    @fechaFin    datetime2 (7)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @minutosOcupados INT;
    DECLARE @minutosDisponibles INT;
    DECLARE @semanas INT = CASE
                              WHEN DATEDIFF(DAY, @fechaInicio, @fechaFin) < 7 THEN 1
                              ELSE CEILING(DATEDIFF(DAY, @fechaInicio, @fechaFin) / 7.0)
                            END;

    SELECT @minutosOcupados = SUM(DATEDIFF(MINUTE, a.startUTC, a.endUTC))
    FROM Appointment a
    WHERE a.serviceid = @serviceId
      AND a.startUTC BETWEEN @fechaInicio AND @fechaFin;

    SELECT @minutosDisponibles = SUM(DATEDIFF(MINUTE, aw.startTime, aw.endTime)) * @semanas
    FROM AvailabilityWindow aw
    WHERE aw.serviceid = @serviceId;

    SET @minutosOcupados = ISNULL(@minutosOcupados, 0);
    SET @minutosDisponibles = ISNULL(@minutosDisponibles, 0);

    SELECT
        @serviceId                          AS serviceId,
        (SELECT [name] FROM [Service] WHERE id = @serviceId) AS servicio,
        COUNT(*)                            AS totalCitas,
        @minutosOcupados                    AS minutosOcupados,
        @minutosDisponibles                 AS minutosDisponibles,
        CASE WHEN @minutosDisponibles = 0 THEN 0
             ELSE ROUND((CAST(@minutosOcupados AS DECIMAL(10,2)) / @minutosDisponibles) * 100, 2)
        END                                  AS porcentajeOcupacion
    FROM Appointment a
    WHERE a.serviceid = @serviceId
      AND a.startUTC BETWEEN @fechaInicio AND @fechaFin;
END
GO
----------------------------------------------------------------------
CREATE PROCEDURE sp_Cliente_Insertar
    @clientName     nvarchar (50),
    @clientLastName nvarchar (50),
    @phoneNumber    nvarchar (20),
    @email          nvarchar (100)

AS
BEGIN
    SET NOCOUNT ON;

    

    INSERT INTO Cliente (id, clientName, clientLastName, phoneNumber, email)
    VALUES (NEWID(), @clientName, @clientLastName, @phoneNumber, @email);
END
GO
----------------------------------------------------------------------
CREATE PROCEDURE sp_Cliente_Actualizar
    @id             uniqueidentifier,
    @clientName     nvarchar (50),
    @clientLastName nvarchar (50),
    @phoneNumber    nvarchar (20),
    @email          nvarchar (100)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM Cliente WHERE id = @id)
    BEGIN
        RAISERROR('El cliente con el id especificado no existe.', 16, 1);
        RETURN;
    END

    UPDATE Cliente
    SET clientName     = @clientName,
        clientLastName = @clientLastName,
        phoneNumber    = @phoneNumber,
        email          = @email
    WHERE id = @id;
END
GO
----------------------------------------------------------------------
CREATE PROCEDURE sp_Cliente_Eliminar
    @id uniqueidentifier
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM Cliente WHERE id = @id)
    BEGIN
        RAISERROR('El cliente con el id especificado no existe.', 16, 1);
        RETURN;
    END
    DELETE FROM Appointment WHERE clientid = @id;
    DELETE FROM Cliente WHERE id = @id;
END
GO
