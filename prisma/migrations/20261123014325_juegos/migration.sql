-- CreateTable
CREATE TABLE "Juego" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "subtitulo" TEXT NOT NULL,
    "plataforma" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "precio" INTEGER NOT NULL,
    "precioAnterior" INTEGER,
    "etiqueta" TEXT,
    "rating" DOUBLE PRECISION NOT NULL,
    "resenas" INTEGER NOT NULL,
    "preventa" BOOLEAN NOT NULL DEFAULT false,
    "arte" TEXT NOT NULL,

    CONSTRAINT "Juego_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Juego_slug_key" ON "Juego"("slug");

-- CreateIndex
CREATE INDEX "Juego_plataforma_idx" ON "Juego"("plataforma");
