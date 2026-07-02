----------------------------------------------------------------------
-- Script de inserción de datos de prueba (10 registros por tabla)
-- Generado a partir de "Creacion de tablas y fk.sql"
-- Orden de inserción respeta las FKs:
--   Cliente, BusinessProfile, Service  ->  Appointment, AvailabilityWindow
----------------------------------------------------------------------
use DateManager
----------------------------------------------------------------------
-- Variables para reutilizar los IDs en las tablas con FK
----------------------------------------------------------------------
DECLARE @Cliente1  UNIQUEIDENTIFIER = NEWID();
DECLARE @Cliente2  UNIQUEIDENTIFIER = NEWID();
DECLARE @Cliente3  UNIQUEIDENTIFIER = NEWID();
DECLARE @Cliente4  UNIQUEIDENTIFIER = NEWID();
DECLARE @Cliente5  UNIQUEIDENTIFIER = NEWID();
DECLARE @Cliente6  UNIQUEIDENTIFIER = NEWID();
DECLARE @Cliente7  UNIQUEIDENTIFIER = NEWID();
DECLARE @Cliente8  UNIQUEIDENTIFIER = NEWID();
DECLARE @Cliente9  UNIQUEIDENTIFIER = NEWID();
DECLARE @Cliente10 UNIQUEIDENTIFIER = NEWID();

DECLARE @Service1  UNIQUEIDENTIFIER = NEWID();
DECLARE @Service2  UNIQUEIDENTIFIER = NEWID();
DECLARE @Service3  UNIQUEIDENTIFIER = NEWID();
DECLARE @Service4  UNIQUEIDENTIFIER = NEWID();
DECLARE @Service5  UNIQUEIDENTIFIER = NEWID();
DECLARE @Service6  UNIQUEIDENTIFIER = NEWID();
DECLARE @Service7  UNIQUEIDENTIFIER = NEWID();
DECLARE @Service8  UNIQUEIDENTIFIER = NEWID();
DECLARE @Service9  UNIQUEIDENTIFIER = NEWID();
DECLARE @Service10 UNIQUEIDENTIFIER = NEWID();

----------------------------------------------------------------------
-- Cliente
----------------------------------------------------------------------
INSERT INTO Cliente (id, clientName, clientLastName, phoneNumber, email) VALUES
(@Cliente1,  N'Juan',     N'Perez',      N'3001234567', N'juan.perez@mail.com'),
(@Cliente2,  N'Maria',    N'Gonzalez',   N'3002345678', N'maria.gonzalez@mail.com'),
(@Cliente3,  N'Carlos',   N'Rodriguez',  N'3003456789', N'carlos.rodriguez@mail.com'),
(@Cliente4,  N'Ana',      N'Martinez',   N'3004567890', N'ana.martinez@mail.com'),
(@Cliente5,  N'Luis',     N'Hernandez',  N'3005678901', N'luis.hernandez@mail.com'),
(@Cliente6,  N'Laura',    N'Lopez',      N'3006789012', N'laura.lopez@mail.com'),
(@Cliente7,  N'Andres',   N'Diaz',       N'3007890123', N'andres.diaz@mail.com'),
(@Cliente8,  N'Camila',   N'Torres',     N'3008901234', N'camila.torres@mail.com'),
(@Cliente9,  N'Jorge',    N'Ramirez',    N'3009012345', N'jorge.ramirez@mail.com'),
(@Cliente10, N'Valentina',N'Castro',     N'3000123456', N'valentina.castro@mail.com');

----------------------------------------------------------------------
-- BusinessProfile
----------------------------------------------------------------------
INSERT INTO BusinessProfile (id, businessName, slug, timeZone, requiresApproval) VALUES
(NEWID(), N'Barberia El Corte',        N'barberia-el-corte',        SYSDATETIME(), 1),
(NEWID(), N'Spa Relax Total',          N'spa-relax-total',          SYSDATETIME(), 0),
(NEWID(), N'Clinica Dental Sonrisa',   N'clinica-dental-sonrisa',   SYSDATETIME(), 1),
(NEWID(), N'Salon Bella Vida',         N'salon-bella-vida',         SYSDATETIME(), 0),
(NEWID(), N'Gimnasio PowerFit',        N'gimnasio-powerfit',        SYSDATETIME(), 1),
(NEWID(), N'Estudio de Tatuajes Ink',  N'estudio-tatuajes-ink',     SYSDATETIME(), 1),
(NEWID(), N'Consultorio Dr. Salud',    N'consultorio-dr-salud',     SYSDATETIME(), 0),
(NEWID(), N'Peluqueria Estilo Urbano', N'peluqueria-estilo-urbano', SYSDATETIME(), 0),
(NEWID(), N'Centro de Masajes Zen',    N'centro-masajes-zen',       SYSDATETIME(), 1),
(NEWID(), N'Uñas y Belleza Glam',      N'unas-y-belleza-glam',      SYSDATETIME(), 0);

----------------------------------------------------------------------
-- Service
----------------------------------------------------------------------
INSERT INTO [Service] (id, [name], durationMinutes, isActive) VALUES
(@Service1,  N'Corte de cabello',      30, 1),
(@Service2,  N'Manicure',              45, 1),
(@Service3,  N'Masaje relajante',      60, 1),
(@Service4,  N'Limpieza dental',       40, 1),
(@Service5,  N'Sesion de tatuaje',     90, 1),
(@Service6,  N'Consulta medica',       20, 1),
(@Service7,  N'Entrenamiento personal',60, 0),
(@Service8,  N'Tinte de cabello',      75, 1),
(@Service9,  N'Depilacion',            30, 0),
(@Service10, N'Facial hidratante',     50, 1);

----------------------------------------------------------------------
-- Appointment (FK: serviceid -> Service, clientid -> Cliente)
----------------------------------------------------------------------
INSERT INTO Appointment (id, serviceid, clientid, startUTC, endUTC, [status]) VALUES
(NEWID(), @Service1,  @Cliente1,  '2026-07-05T09:00:00', '2026-07-05T09:30:00', 1),
(NEWID(), @Service2,  @Cliente2,  '2026-07-05T10:00:00', '2026-07-05T10:45:00', 1),
(NEWID(), @Service3,  @Cliente3,  '2026-07-05T11:00:00', '2026-07-05T12:00:00', 0),
(NEWID(), @Service4,  @Cliente4,  '2026-07-06T09:00:00', '2026-07-06T09:40:00', 2),
(NEWID(), @Service5,  @Cliente5,  '2026-07-06T13:00:00', '2026-07-06T14:30:00', 1),
(NEWID(), @Service6,  @Cliente6,  '2026-07-06T15:00:00', '2026-07-06T15:20:00', 0),
(NEWID(), @Service7,  @Cliente7,  '2026-07-07T08:00:00', '2026-07-07T09:00:00', 1),
(NEWID(), @Service8,  @Cliente8,  '2026-07-07T10:00:00', '2026-07-07T11:15:00', 3),
(NEWID(), @Service9,  @Cliente9,  '2026-07-07T14:00:00', '2026-07-07T14:30:00', 1),
(NEWID(), @Service10, @Cliente10, '2026-07-08T16:00:00', '2026-07-08T16:50:00', 2);

----------------------------------------------------------------------
-- AvailabilityWindow (FK: serviceid -> Service)
----------------------------------------------------------------------
INSERT INTO AvailabilityWindow (id, serviceid, [dayOfWeek], startTime, endTime) VALUES
(NEWID(), @Service1,  1, '08:00:00', '17:00:00'),
(NEWID(), @Service2,  2, '09:00:00', '18:00:00'),
(NEWID(), @Service3,  3, '10:00:00', '19:00:00'),
(NEWID(), @Service4,  4, '08:00:00', '16:00:00'),
(NEWID(), @Service5,  5, '11:00:00', '20:00:00'),
(NEWID(), @Service6,  0, '09:00:00', '13:00:00'),
(NEWID(), @Service7,  6, '07:00:00', '12:00:00'),
(NEWID(), @Service8,  1, '09:00:00', '17:00:00'),
(NEWID(), @Service9,  2, '08:00:00', '15:00:00'),
(NEWID(), @Service10, 3, '10:00:00', '18:00:00');
