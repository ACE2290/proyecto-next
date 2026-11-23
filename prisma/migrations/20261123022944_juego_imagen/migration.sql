-- AlterTable
ALTER TABLE "Juego" ADD COLUMN     "imagenVersion" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "JuegoImagen" (
    "juegoId" UUID NOT NULL,
    "tipo" TEXT NOT NULL,
    "datos" BYTEA NOT NULL,

    CONSTRAINT "JuegoImagen_pkey" PRIMARY KEY ("juegoId")
);

-- AddForeignKey
ALTER TABLE "JuegoImagen" ADD CONSTRAINT "JuegoImagen_juegoId_fkey" FOREIGN KEY ("juegoId") REFERENCES "Juego"("id") ON DELETE CASCADE ON UPDATE CASCADE;
