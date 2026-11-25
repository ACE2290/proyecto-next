import Link from "next/link";
import JuegoCard from "../components/JuegoCard";
import { listarJuegos } from "../lib/juegos";

// Página 100% dinámica (sesión + base de datos): se permite que bloquee al navegar.
export const instant = false;

export default async function Catalogo({ searchParams }: { searchParams: Promise<{ [k: string]: string | undefined }> }) {
  const { tab, plataforma, q } = await searchParams;
  const juegos = await listarJuegos({ tab, plataforma, q });

  return (
    <main className="mx-auto min-h-screen max-w-[1440px] bg-[#0B0B0E] px-4 md:px-16 py-10 text-white">
      <Link href="/" className="text-sm text-orange-500">← Volver al inicio</Link>
      <h1 className="mt-4 text-3xl font-bold">Catálogo</h1>
      {juegos.length === 0 ? (
        <p className="mt-8 text-white/60">No encontramos juegos con ese filtro.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {juegos.map((g) => <JuegoCard key={g.id} g={g} />)}
        </div>
      )}
    </main>
  );
}
