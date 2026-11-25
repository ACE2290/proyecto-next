import { prisma } from "../../../../lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const img = await prisma.juegoImagen.findFirst({ where: { juego: { slug } } });
  if (!img) return new Response("No encontrada", { status: 404 });
  // La URL lleva ?v=<versión>, así que es seguro cachear mucho tiempo.
  return new Response(img.datos, {
    headers: { "Content-Type": img.tipo, "Cache-Control": "public, max-age=31536000, immutable" },
  });
}
