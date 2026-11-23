import Link from "next/link";
import type { Juego } from "../generated/prisma/client";
import { agregarAlCarrito } from "../actions/carrito";
import { urlImagen } from "../lib/imagen";

export default function JuegoCard({ g }: { g: Juego }) {
  const img = urlImagen(g);
  return (
    <article className="overflow-hidden rounded-lg bg-white/5 transition hover:ring-1 hover:ring-orange-500">
      <Link href={`/juegos/${g.slug}`} className="block">
        <div className={`relative flex h-36 flex-col justify-end bg-gradient-to-br p-3 ${g.arte}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {img && <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover" />}
          {img && <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />}
          {g.etiqueta && <span className="absolute left-3 top-3 rounded bg-black/60 px-1.5 py-0.5 text-[8px] font-bold">{g.etiqueta}</span>}
          <b className="relative text-xl font-black">{g.titulo}</b>
          <span className="relative text-[8px] tracking-widest text-orange-400">{g.subtitulo}</span>
        </div>
        <div className="px-4 pt-4">
          <p className="text-[8px] uppercase text-white/50">{g.plataforma}</p>
          <p className="mt-1 text-xs font-semibold">{g.nombre}</p>
          {g.resenas > 0 && <p className="mt-1 text-[9px] text-orange-400">★★★★★ <span className="text-white/50">{g.rating} ({g.resenas})</span></p>}
        </div>
      </Link>
      <div className="flex items-center justify-between px-4 pb-4 pt-3">
        <span className="font-bold">
          ${g.precio.toLocaleString("en-US")}{" "}
          {g.precioAnterior && <s className="text-[9px] font-normal text-white/40">${g.precioAnterior.toLocaleString("en-US")}</s>}
        </span>
        <form action={agregarAlCarrito.bind(null, g.id)}>
          <button className="h-7 w-7 rounded bg-orange-500 font-bold" aria-label={`Añadir ${g.nombre}`}>+</button>
        </form>
      </div>
    </article>
  );
}
