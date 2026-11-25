import Link from "next/link";
import { prisma } from "../lib/prisma";
import { requerirRol } from "../lib/sesion";

type Item = { nombre: string; precio: number; cantidad: number };

// Página 100% dinámica (sesión + base de datos): se permite que bloquee al navegar.
export const instant = false;

export default async function Pedidos() {
  const s = await requerirRol("CLIENTE");
  const pedidos = await prisma.pedido.findMany({ where: { usuarioId: s.id }, orderBy: { creado: "desc" } });

  return (
    <main className="mx-auto min-h-screen max-w-[1440px] bg-[#0B0B0E] px-4 md:px-16 py-10 text-white">
      <Link href="/" className="text-sm text-orange-500">← Volver al inicio</Link>
      <h1 className="mt-4 text-3xl font-bold">Mis pedidos</h1>
      {pedidos.length === 0 && <p className="mt-8 text-white/60">Aún no has comprado nada.</p>}
      <ul className="mt-6 space-y-3">
        {pedidos.map((p) => (
          <li key={p.id} className="rounded-lg bg-white/5 p-4 text-sm">
            <p className="text-white/50">{p.creado.toLocaleString("es-MX")}</p>
            {(p.items as Item[]).map((i) => <p key={i.nombre}>{i.cantidad} × {i.nombre}</p>)}
            <p className="mt-2 font-bold">Total: ${p.total.toLocaleString("en-US")}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
