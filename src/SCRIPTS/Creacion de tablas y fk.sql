--CREATE DATABASE DateManager 
--USE DateManager 
----------------------------------------------------------------------
create table Cliente(
id uniqueidentifier NOT NULL,
clientName nvarchar (50),
clientLastName nvarchar (50),
phoneNumber nvarchar (20),
email nvarchar (100),
CONSTRAINT [PK_Cliente] PRIMARY KEY CLUSTERED 
(id ASC)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY])
ON [PRIMARY]

ALTER TABLE Cliente ADD  DEFAULT (newsequentialid()) FOR [id]
----------------------------------------------------------------------
create table BusinessProfile (
id uniqueidentifier NOT NULL,
businessName nvarchar (50)NULL,
slug nvarchar (100)NULL,
timeZone datetime2 (7),
requiresApproval bit,
CONSTRAINT [PK_BusinessProfile] PRIMARY KEY CLUSTERED 
(id ASC)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY])
ON [PRIMARY]

ALTER TABLE BusinessProfile ADD  DEFAULT (newsequentialid()) FOR [id]
----------------------------------------------------------------------
create table [Service](
id uniqueidentifier NOT NULL,
[name] nvarchar (50) NOT NULL,
durationMinutes int,
isActive bit,
CONSTRAINT [PK_Service] PRIMARY KEY CLUSTERED 
(id ASC)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY])
ON [PRIMARY]

ALTER TABLE [Service] ADD  DEFAULT (newsequentialid()) FOR [id]
----------------------------------------------------------------------
create table Appointment(
id uniqueidentifier NOT NULL,
serviceid uniqueidentifier NOT NULL,
clientid uniqueidentifier NOT NULL,
startUTC datetime2 (7),
endUTC datetime2 (7),
[status] int,
CONSTRAINT [PK_Appointment] PRIMARY KEY CLUSTERED 
(id ASC)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY])
ON [PRIMARY]

ALTER TABLE Appointment ADD  DEFAULT (newsequentialid()) FOR [id]
----------------------------------------------------------------------
create table AvailabilityWindow(
id uniqueidentifier NOT NULL,
serviceid uniqueidentifier NOT NULL,
[dayOfWeek] tinyint not null check ([dayOfWeek] between 0 and 6),
startTime time NOT NULL,
endTime time NOT NULL,
CONSTRAINT [PK_AvailabilityWindow] PRIMARY KEY CLUSTERED 
(id ASC)
WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY])
ON [PRIMARY]

ALTER TABLE AvailabilityWindow ADD  DEFAULT (newsequentialid()) FOR [id]
----------------------------------------------------------------------
ALTER TABLE Appointment  WITH CHECK ADD  CONSTRAINT [FK_Appointment_Service] FOREIGN KEY([serviceid])
REFERENCES [Service] ([id])
GO

ALTER TABLE Appointment CHECK CONSTRAINT [FK_Appointment_Service]
GO
----------------------------------------------------------------------
ALTER TABLE Appointment  WITH CHECK ADD  CONSTRAINT [FK_Appointment_Cliente] FOREIGN KEY([clientid])
REFERENCES [Cliente] ([id])
GO

ALTER TABLE Appointment CHECK CONSTRAINT [FK_Appointment_Cliente]
GO
----------------------------------------------------------------------
ALTER TABLE AvailabilityWindow  WITH CHECK ADD  CONSTRAINT [FK_AvailabilityWindow_serviceid] FOREIGN KEY([serviceid])
REFERENCES [Service] ([id])
GO

ALTER TABLE AvailabilityWindow CHECK CONSTRAINT [FK_AvailabilityWindow_serviceid]
GO

