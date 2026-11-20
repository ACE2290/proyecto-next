import Link from "next/link";

const nav = ["Catalogo", "Video Juegos", "Consolas y Hardware"];

export default function Home() {
  return (
    <>
      <div className="flex justify-end border-b border-black text-[11px]">
        <div className="flex items-center px-4 py-3">
          <span className="border-r border-pink-300 pr-4">Tienda por seleccionar</span>
          <span className="border-r border-pink-300 px-6">Ayuda</span>
          <Link href="#" className="pl-4 pr-6">Iniciar sesion ●</Link>
        </div>
      </div>

      <header className="border-b border-black">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-6">
          {/* shortcut: logo en texto, cambiar por <Image> cuando tengas el archivo del logo */}
          <Link href="/" className="text-2xl font-black italic text-orange-500">
            MUNDO GAMEPLANET
          </Link>
          <nav className="flex gap-8 text-[11px]">
            {nav.map((item) => (
              <Link key={item} href="#">{item}</Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 pt-20">
        <div className="mx-auto h-56 w-full rounded-lg bg-gray-300 md:w-1/2" />
      </main>
      
    </>
  );
}
