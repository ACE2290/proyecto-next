import Link from "next/link";
import { prisma } from "../lib/prisma";
import { requerirRol } from "../lib/sesion";
import { comprar, quitarDelCarrito } from "../actions/carrito";

// Página 100% dinámica (sesión + base de datos): se permite que bloquee al navegar.
export const instant = false;

export default async function CarritoPage() {
  const s = await requerirRol("CLIENTE");
  const items = await prisma.carritoItem.findMany({ where: { usuarioId: s.id }, include: { juego: true }, orderBy: { id: "asc" } });
  const total = items.reduce((t, i) => t + i.juego.precio * i.cantidad, 0);

  return (
    <main className="mx-auto min-h-screen max-w-[1440px] bg-[#0B0B0E] px-4 md:px-16 py-10 text-white">
      <Link href="/catalogo" className="text-sm text-orange-500">← Seguir comprando</Link>
      <h1 className="mt-4 text-3xl font-bold">Tu carrito</h1>
      {items.length === 0 ? (
        <p className="mt-8 text-white/60">Tu carrito está vacío.</p>
      ) : (
        <>
          <ul className="mt-6 space-y-3">
            {items.map(({ id, juego: g, cantidad }) => (
              <li key={id} className="flex flex-wrap items-center gap-4 rounded-lg bg-white/5 p-4">
                <div className={`h-14 w-20 rounded bg-gradient-to-br ${g.arte}`} />
                <Link href={`/juegos/${g.slug}`} className="flex-1 font-semibold">{g.nombre}</Link>
                <span className="text-sm text-white/60">x{cantidad}</span>
                <span className="w-24 text-right font-bold">${(g.precio * cantidad).toLocaleString("en-US")}</span>
                <form action={quitarDelCarrito.bind(null, g.id)}><button className="text-xs text-red-400">Quitar</button></form>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-center justify-end gap-6">
            <p className="text-2xl font-bold">Total: ${total.toLocaleString("en-US")}</p>
            <form action={comprar}><button className="rounded bg-orange-500 px-8 py-3 font-bold">Comprar</button></form>
          </div>
        </>
      )}
    </main>
  );
}
