import { prisma } from "./prisma";

export const tabs = [
  { key: "vendidos", label: "Más vendidos" },
  { key: "nuevos", label: "Nuevos lanzamientos" },
  { key: "oferta", label: "En oferta" },
  { key: "proximamente", label: "Próximamente" },
] as const;

type Filtros = { tab?: string; plataforma?: string; q?: string };

export function listarJuegos({ tab, plataforma, q }: Filtros) {
  return prisma.juego.findMany({
    where: {
      ...(plataforma && { plataforma }),
      ...(q && { nombre: { contains: q, mode: "insensitive" } }),
      ...(tab === "nuevos" && { etiqueta: "NUEVO" }),
      ...(tab === "oferta" && { precioAnterior: { not: null } }),
      ...(tab === "proximamente" ? { preventa: true } : { preventa: false }),
    },
    orderBy: { resenas: "desc" },
  });
}
