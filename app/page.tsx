import Image from "next/image";
import { redirect } from "next/navigation";
import Link from "next/link";
import Carrusel from "./components/Carrusel";
import JuegoCard from "./components/JuegoCard";
import { listarJuegos, tabs } from "./lib/juegos";
import { getSesion } from "./lib/sesion";
import { prisma } from "./lib/prisma";
import { salir } from "./actions/auth";

const nav = [
  ["Todo el catálogo", "/catalogo"],
  ["PlayStation", "/catalogo?plataforma=playstation"],
  ["Xbox", "/catalogo?plataforma=xbox"],
  ["Nintendo", "/catalogo?plataforma=nintendo"],
  ["PC Gaming", "/catalogo?plataforma=pc"],
  ["Coleccionables", "/catalogo"],
  ["Preventas", "/catalogo?tab=proximamente"],
];

const worlds = [
  { name: "PlayStation", img: "/mundos/playstation.png", href: "/catalogo?plataforma=playstation", color: "text-blue-400" },
  { name: "Xbox", img: "/mundos/xbox.png", href: "/catalogo?plataforma=xbox", color: "text-green-400" },
  { name: "Nintendo", img: "/mundos/nintendo.png", href: "/catalogo?plataforma=nintendo", color: "text-red-400" },
  { name: "PC Gaming", img: "/mundos/pc-gaming.png", href: "/catalogo?plataforma=pc", color: "text-violet-400" },
  { name: "Coleccionables", img: "/mundos/coleccionables.jpg", href: "/catalogo", color: "text-yellow-200" },
];

// Página 100% dinámica (sesión + base de datos): se permite que bloquee al navegar.
export const instant = false;

export default async function Home({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab = "vendidos" } = await searchParams;
  const games = await listarJuegos({ tab });
  const sesion = await getSesion();
  if (!sesion) redirect("/login"); // la tienda arranca en el login
  const enCarrito = sesion?.rol === "CLIENTE"
    ? (await prisma.carritoItem.aggregate({ where: { usuarioId: sesion.id }, _sum: { cantidad: true } }))._sum.cantidad ?? 0
    : 0;

  return (
    // Frame de Figma: 1440 de ancho, fondo #0B0B0E
    <div className="mx-auto flex w-full max-w-[1440px] flex-col items-stretch bg-[#0B0B0E] text-white">
      <div className="bg-orange-500 py-1.5 text-center text-[10px]">
        <b>ENVÍO GRATIS EN COMPRAS DESDE $999</b> &nbsp;/&nbsp; Tu siguiente aventura llega a tu puerta
      </div>

      <header className="border-b border-white/10 px-4 md:px-16">
        <div className="flex flex-wrap items-center gap-4 py-5 md:gap-10">
          <Link href="/" className="text-2xl font-black italic leading-none text-orange-500">
            GAMEPLANET
            <span className="block text-[8px] font-normal not-italic tracking-widest text-white/60">TU UNIVERSO GAMER</span>
          </Link>
          <form action="/catalogo" className="order-last flex w-full md:order-none md:w-auto md:flex-1">
            <input
              name="q"
              placeholder="Busca juegos, consolas y tu próxima aventura"
              className="h-10 flex-1 rounded-lg border border-white/10 bg-white/5 px-4 text-xs placeholder:text-white/50"
            />
          </form>
          <div className="ml-auto flex items-center gap-4 text-[11px] md:gap-6">
            {sesion ? (
              <>
                <span className="text-white/60">Hola, {sesion.usuario}</span>
                {sesion.rol === "ADMIN" ? <Link href="/admin">Panel</Link> : <Link href="/pedidos">Mis pedidos</Link>}
                <form action={salir}><button>Salir</button></form>
              </>
            ) : (
              <>
                <Link href="/login">Iniciar sesión</Link>
                <Link href="/registro">Registrarme</Link>
              </>
            )}
            {sesion?.rol !== "ADMIN" && (
              <Link href="/carrito">🛍 <span className="rounded-full bg-orange-500 px-1.5">{enCarrito}</span></Link>
            )}
          </div>
        </div>
        <nav className="flex gap-6 overflow-x-auto whitespace-nowrap pb-4 text-[11px] md:gap-8">
          {nav.map(([label, href]) => (
            <Link key={label} href={href}>{label}</Link>
          ))}
          <Link href="/catalogo?tab=oferta" className="ml-auto font-bold text-orange-500">HOT DEALS</Link>
        </nav>
      </header>

      <section className="relative flex min-h-[420px] flex-col justify-center px-4 pb-20 pt-10 md:min-h-[560px] md:px-16">
        <Carrusel />
        <div className="relative z-10">
          <span className="mb-4 block w-fit bg-orange-500 px-2 py-0.5 text-[8px] font-bold">NUEVO LANZAMIENTO</span>
          <h1 className="text-4xl font-black md:text-6xl leading-[1.05]">
            NO SOLO JUEGUES.<br />VIVE LA AVENTURA.
          </h1>
          <p className="mt-6 max-w-sm text-xs text-white/80">
            Historias que te atrapan. Mundos que te esperan. Encuentra tu próximo juego favorito en GamePlanet.
          </p>
          <div className="mt-6 flex items-center gap-6 text-xs">
            <Link href="/catalogo?tab=nuevos" className="rounded bg-orange-500 px-6 py-3 font-bold">Explorar novedades →</Link>
            <Link href="/catalogo?tab=proximamente">Ver preventas</Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 items-center gap-4 px-4 py-8 md:flex md:px-16">
        <span className="col-span-2 text-[9px] text-white/50 md:col-span-1">ELIGE TU MUNDO</span>
        {worlds.map((w) => (
          <Link key={w.name} href={w.href} className={`flex flex-1 flex-col items-center gap-2 rounded-lg border border-white/10 bg-white/5 py-4 text-center text-[11px] font-bold ${w.color}`}>
            <Image src={w.img} alt="" width={40} height={40} className="h-10 w-auto rounded object-contain" />
            {w.name}
          </Link>
        ))}
      </section>

      <section className="px-4 md:px-16 py-8">
        <p className="text-[9px] font-bold text-orange-500">LOS IMPERDIBLES</p>
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 className="text-3xl font-bold">Tu próxima obsesión está aquí.</h2>
          <Link href="/catalogo" className="text-[11px]">Ver todos los juegos</Link>
        </div>
        <div className="mt-6 flex flex-wrap gap-2 text-[11px]">
          {tabs.map((t) => (
            <Link key={t.key} href={`/?tab=${t.key}`} className={`rounded-full px-4 py-1.5 ${t.key === tab ? "bg-orange-500 font-bold" : "bg-white/5"}`}>{t.label}</Link>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {games.length === 0 && <p className="col-span-full text-white/60">Pronto habrá más juegos aquí.</p>}
          {games.map((g) => <JuegoCard key={g.id} g={g} />)}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 px-4 pb-8 md:grid-cols-2 md:px-16">
        <div className="flex h-48 flex-col justify-center rounded-lg bg-orange-500 p-8">
          <p className="text-[8px] font-bold">MODO OFERTA ACTIVADO</p>
          <h3 className="mt-2 text-3xl font-black leading-tight">MÁS JUEGO.<br />MENOS GASTO.</h3>
          <p className="mt-2 text-[9px]">Hasta 30% en accesorios seleccionados.</p>
          <Link href="/catalogo?tab=oferta" className="mt-4 w-fit rounded bg-black px-4 py-2 text-[10px] font-bold">Ver ofertas</Link>
        </div>
        <div className="flex h-48 flex-col justify-center rounded-lg bg-gradient-to-r from-white/5 to-orange-900/40 p-8">
          <p className="text-[8px] font-bold text-orange-500">EL HYPE EMPIEZA AQUÍ</p>
          <h3 className="mt-2 text-3xl font-black leading-tight">LOS ESPERAS.<br />LOS TENEMOS.</h3>
          <p className="mt-2 text-[9px] text-white/60">Aparta hoy las aventuras de mañana.</p>
          <Link href="/catalogo?tab=proximamente" className="mt-4 w-fit rounded bg-white px-4 py-2 text-[10px] font-bold text-black">Explorar preventas</Link>
        </div>
      </section>

      <section className="px-4 md:px-16 py-8">
        <p className="text-[9px] font-bold text-orange-500">EL PODER ESTÁ EN TUS MANOS</p>
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 className="text-3xl font-bold">Equipa tu siguiente nivel.</h2>
          <Link href="/catalogo" className="text-[11px]">Explorar todo</Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { t: "Consolas", d: "Tu nueva generación comienza aquí.", art: "from-slate-200 to-slate-400" },
            { t: "Accesorios", d: "Haz que cada partida cuente.", art: "from-zinc-300 to-zinc-500" },
            { t: "Coleccionables", d: "Tus universos favoritos, en tu espacio.", art: "from-amber-200 to-orange-300" },
          ].map((c) => (
            <Link key={c.t} href="/catalogo" className="overflow-hidden rounded-lg bg-white/5">
              <div className={`h-40 bg-gradient-to-br ${c.art}`} />
              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="text-xs font-bold">{c.t}</p>
                  <p className="text-[9px] text-white/50">{c.d}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4 px-4 py-8 text-[9px] md:px-16 lg:grid-cols-4">
        {[
          ["La aventura va por nuestra cuenta", "Envío gratis a partir de $999."],
          ["Compra con confianza", "Pagos protegidos en cada compra."],
          ["Siempre cerca de ti", "Encuentra tu tienda GamePlanet."],
          ["Hablamos tu mismo idioma", "Estamos aquí para ayudarte."],
        ].map(([t, d]) => (
          <div key={t} className="flex items-center gap-3">
            <span className="text-orange-500">●</span>
            <div>
              <p className="font-bold">{t}</p>
              <p className="text-white/50">{d}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="flex flex-col items-start justify-between gap-6 bg-orange-500 px-4 py-12 md:flex-row md:items-center md:px-16">
        <div>
          <p className="text-[8px] font-bold">ESTO NO ES SOLO UNA TIENDA. ES TU COMUNIDAD.</p>
          <h2 className="mt-2 text-3xl font-black leading-tight md:text-4xl">TU PRÓXIMO NIVEL<br />EMPIEZA AQUÍ.</h2>
          <p className="mt-2 text-[10px]">Entérate primero de lanzamientos, ofertas y drops exclusivos.</p>
        </div>
        <form className="flex w-full gap-2 md:w-[480px] rounded bg-white p-2">
          <input type="email" placeholder="Tu correo electrónico" className="flex-1 px-2 text-xs text-black" />
          <button type="submit" className="rounded bg-black px-4 py-2 text-[10px] font-bold">Quiero ser parte</button>
        </form>
      </section>

      <footer className="px-4 md:px-16 py-12">
        <div className="grid grid-cols-2 gap-8 text-[10px] md:grid-cols-4 text-white/60">
          <div>
            <p className="text-2xl font-black italic text-orange-500">GAMEPLANET</p>
            <p className="mt-2">Un universo para cada gamer. Encuentra el tuyo.</p>
          </div>
          {[
            ["Explora", ["Videojuegos", "Consolas", "Accesorios", "Coleccionables", "Preventas"]],
            ["¿Te ayudamos?", ["Mis pedidos", "Envíos y entregas", "Cambios y devoluciones", "Preguntas frecuentes", "Contáctanos"]],
            ["Somos GamePlanet", ["Nuestras tiendas", "Sobre nosotros", "Únete al equipo", "Comunidad GP"]],
          ].map(([title, links]) => (
            <div key={title as string}>
              <p className="mb-3 font-bold text-white">{title}</p>
              <ul className="space-y-2">
                {(links as string[]).map((l) => (
                  <li key={l}><Link href="/catalogo">{l}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-10 border-t border-white/10 pt-4 text-[9px] text-white/40">
          © 2026 GamePlanet · Términos y condiciones · VISA · Mastercard · PayPal
        </p>
      </footer>
    </div>
  );
}
