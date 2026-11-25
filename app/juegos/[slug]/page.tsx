import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../lib/prisma";
import BotonAgregar from "../../components/BotonAgregar";
import { urlImagen } from "../../lib/imagen";

// Página 100% dinámica (sesión + base de datos): se permite que bloquee al navegar.
export const instant = false;

export default async function JuegoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = await prisma.juego.findUnique({ where: { slug } });
  if (!g) notFound();
  const img = urlImagen(g);

  return (
    <main className="mx-auto min-h-screen max-w-[1440px] bg-[#0B0B0E] px-4 md:px-16 py-10 text-white">
      <Link href="/catalogo" className="text-sm text-orange-500">← Volver al catálogo</Link>
      <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className={`relative flex h-64 flex-col justify-end overflow-hidden rounded-lg bg-gradient-to-br p-8 md:h-96 ${g.arte}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {img && <img src={img} alt={g.nombre} className="absolute inset-0 h-full w-full object-cover" />}
          <b className="relative text-5xl font-black">{g.titulo}</b>
          <span className="relative text-xs tracking-widest text-orange-300">{g.subtitulo}</span>
        </div>
        <div>
          <p className="text-xs uppercase text-white/50">{g.plataforma}</p>
          <h1 className="mt-2 text-4xl font-bold">{g.nombre}</h1>
          {g.resenas > 0 && <p className="mt-2 text-orange-400">★ {g.rating} <span className="text-white/50">({g.resenas} reseñas)</span></p>}
          <p className="mt-6 text-white/70">{g.descripcion}</p>
          <p className="mt-6 text-3xl font-bold">
            ${g.precio.toLocaleString("en-US")}{" "}
            {g.precioAnterior && <s className="text-base font-normal text-white/40">${g.precioAnterior.toLocaleString("en-US")}</s>}
          </p>
          <BotonAgregar juegoId={g.id} nombre={g.nombre} className="mt-6 rounded bg-orange-500 px-8 py-3 font-bold">{g.preventa ? "Apartar" : "Agregar al carrito"}</BotonAgregar>
        </div>
      </div>
    </main>
  );
}
