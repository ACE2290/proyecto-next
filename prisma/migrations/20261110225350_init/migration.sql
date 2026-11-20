-- CreateTable
CREATE TABLE "Propietario" (
    "id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Propietario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paciente" (
    "id" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "fechaAlta" DATE NOT NULL,
    "sintomas" TEXT NOT NULL,
    "propietarioId" UUID NOT NULL,

    CONSTRAINT "Paciente_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Propietario_email_key" ON "Propietario"("email");

-- CreateIndex
CREATE INDEX "Paciente_propietarioId_idx" ON "Paciente"("propietarioId");

-- AddForeignKey
ALTER TABLE "Paciente" ADD CONSTRAINT "Paciente_propietarioId_fkey" FOREIGN KEY ("propietarioId") REFERENCES "Propietario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
