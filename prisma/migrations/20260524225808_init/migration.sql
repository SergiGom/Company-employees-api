BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Compania] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombre] NVARCHAR(1000) NOT NULL,
    [direccion] NVARCHAR(1000) NOT NULL,
    [telefono] NVARCHAR(1000) NOT NULL,
    [fechaCreacion] DATETIME2 NOT NULL CONSTRAINT [Compania_fechaCreacion_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Compania_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Empleado] (
    [id] INT NOT NULL IDENTITY(1,1),
    [nombre] NVARCHAR(1000) NOT NULL,
    [apellido] NVARCHAR(1000) NOT NULL,
    [correo] NVARCHAR(1000) NOT NULL,
    [cargo] NVARCHAR(1000) NOT NULL,
    [salario] DECIMAL(32,16) NOT NULL,
    [companiaId] INT NOT NULL,
    CONSTRAINT [Empleado_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Empleado_correo_key] UNIQUE NONCLUSTERED ([correo])
);

-- AddForeignKey
ALTER TABLE [dbo].[Empleado] ADD CONSTRAINT [Empleado_companiaId_fkey] FOREIGN KEY ([companiaId]) REFERENCES [dbo].[Compania]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
