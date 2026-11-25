import Link from "next/link";
import { prisma } from "../lib/prisma";
import { requerirRol } from "../lib/sesion";
import { cambiarImagen, cambiarPrecio, crearJuego, eliminarJuego } from "../actions/admin";
import { salir } from "../actions/auth";
import BotonEliminar from "../components/BotonEliminar";

const campo = "h-9 rounded border border-white/10 bg-white/5 px-3 text-sm";

// Página 100% dinámica (sesión + base de datos): se permite que bloquee al navegar.
export const instant = false;

export default async function Admin({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  await requerirRol("ADMIN");
  const { error } = await searchParams;
  const juegos = await prisma.juego.findMany({ orderBy: { nombre: "asc" } });

  return (
    <main className="mx-auto min-h-screen max-w-[1440px] bg-[#0B0B0E] px-4 md:px-16 py-10 text-white">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-sm text-orange-500">← Ver tienda</Link>
        <form action={salir}><button className="text-sm text-white/60">Cerrar sesión</button></form>
      </div>
      <h1 className="mt-4 text-3xl font-bold">Panel de administrador</h1>
      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <form action={crearJuego} className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3 rounded-lg bg-white/5 p-6">
        <h2 className="md:col-span-3 font-bold">Agregar juego</h2>
        <input name="nombre" required placeholder="Nombre" className={campo} />
        <input name="subtitulo" placeholder="Subtítulo" className={campo} />
        <select name="plataforma" className={campo}>
          <option value="playstation">PlayStation</option>
          <option value="xbox">Xbox</option>
          <option value="nintendo">Nintendo</option>
          <option value="pc">PC</option>
        </select>
        <input name="precio" type="number" min={1} step={1} required placeholder="Precio" className={campo} />
        <input name="descripcion" placeholder="Descripción" className={`${campo} md:col-span-2`} />
        <input name="imagen" type="file" accept="image/png,image/jpeg,image/webp" className="flex h-9 items-center rounded border border-white/10 bg-white/5 px-2 text-xs text-white/60 md:col-span-2" />
        <label className="text-sm"><input name="preventa" type="checkbox" /> Es preventa</label>
        <button className="rounded bg-orange-500 font-bold">Agregar</button>
      </form>

      <ul className="mt-6 space-y-2">
        {juegos.map((g) => (
          <li key={g.id} className="flex flex-wrap items-center gap-4 rounded-lg bg-white/5 p-3 text-sm">
            <span className="flex-1">{g.nombre} <span className="text-white/40">· {g.plataforma}</span></span>
            <form action={cambiarPrecio.bind(null, g.id)} className="flex gap-2">
              <input name="precio" type="number" min={1} step={1} defaultValue={g.precio} className={`${campo} w-28`} />
              <button className="rounded bg-white/10 px-3">Guardar precio</button>
            </form>
            <form action={cambiarImagen.bind(null, g.id)} className="flex gap-2">
              <input name="imagen" type="file" required accept="image/png,image/jpeg,image/webp" className="w-44 text-xs" />
              <button className="rounded bg-white/10 px-3">{g.imagenVersion ? "Cambiar imagen" : "Subir imagen"}</button>
            </form>
            <form action={eliminarJuego.bind(null, g.id)}>
              <BotonEliminar nombre={g.nombre} />
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}