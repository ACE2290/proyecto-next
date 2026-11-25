import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "../app/lib/password";
import { PrismaClient } from "../app/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL debe estar configurada para ejecutar el seed.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  const propietarios = [
    {
      id: "10000000-0000-4000-8000-000000000001",
      nombre: "Ana Rivera",
      email: "ana.rivera@example.com",
    },
    {
      id: "10000000-0000-4000-8000-000000000002",
      nombre: "Diego Torres",
      email: "diego.torres@example.com",
    },
  ];

  for (const propietario of propietarios) {
    await prisma.propietario.upsert({
      where: { email: propietario.email },
      update: { nombre: propietario.nombre },
      create: propietario,
    });
  }

  const pacientes = [
    {
      id: "20000000-0000-4000-8000-000000000001",
      nombre: "Luna",
      fechaAlta: new Date("2025-01-15T00:00:00.000Z"),
      sintomas: "Vacunación y revisión general.",
      propietarioEmail: "ana.rivera@example.com",
    },
    {
      id: "20000000-0000-4000-8000-000000000002",
      nombre: "Max",
      fechaAlta: new Date("2025-02-03T00:00:00.000Z"),
      sintomas: "Comezón persistente en las orejas.",
      propietarioEmail: "ana.rivera@example.com",
    },
    {
      id: "20000000-0000-4000-8000-000000000003",
      nombre: "Milo",
      fechaAlta: new Date("2025-03-20T00:00:00.000Z"),
      sintomas: "Disminución del apetito.",
      propietarioEmail: "diego.torres@example.com",
    },
  ];

  for (const paciente of pacientes) {
    const { propietarioEmail, ...datosPaciente } = paciente;

    await prisma.paciente.upsert({
      where: { id: paciente.id },
      update: {
        ...datosPaciente,
        propietario: { connect: { email: propietarioEmail } },
      },
      create: {
        ...datosPaciente,
        propietario: { connect: { email: propietarioEmail } },
      },
    });
  }

  const juegos = [
    { slug: "eclipse", titulo: "ECLIPSE", subtitulo: "EL ÚLTIMO GUARDIÁN", plataforma: "playstation", nombre: "Eclipse: El último guardián", descripcion: "Un caballero solitario cruza un mundo en ruinas bajo un sol que se apaga.", precio: 1399, precioAnterior: 1599, etiqueta: "-13%", rating: 4.9, resenas: 128, preventa: false, arte: "from-amber-700 to-stone-900" },
    { slug: "neon-rush", titulo: "NEON RUSH", subtitulo: "OVERDRIVE", plataforma: "xbox", nombre: "Neon Rush: Overdrive", descripcion: "Carreras callejeras a toda velocidad en una ciudad de neón.", precio: 1199, precioAnterior: 1499, etiqueta: "-20%", rating: 4.8, resenas: 96, preventa: false, arte: "from-fuchsia-700 to-indigo-950" },
    { slug: "wild-kingdom", titulo: "WILD KINGDOM", subtitulo: "ORIGINS", plataforma: "nintendo", nombre: "Wild Kingdom: Origins", descripcion: "Explora islas flotantes junto a un zorro aventurero.", precio: 1299, precioAnterior: null, etiqueta: "EXCLUSIVO", rating: 4.9, resenas: 204, preventa: false, arte: "from-emerald-500 to-sky-700" },
    { slug: "circuit-legends-26", titulo: "CIRCUIT", subtitulo: "LEGENDS 26", plataforma: "playstation", nombre: "Circuit Legends 26", descripcion: "El simulador de carreras más realista de la temporada.", precio: 1499, precioAnterior: null, etiqueta: "NUEVO", rating: 4.7, resenas: 83, preventa: false, arte: "from-orange-500 to-zinc-800" },
    { slug: "starfall", titulo: "STARFALL", subtitulo: "HORIZONTES", plataforma: "pc", nombre: "Starfall: Horizontes", descripcion: "Epopeya espacial de exploración. Aparta tu copia hoy.", precio: 1699, precioAnterior: null, etiqueta: "PREVENTA", rating: 0, resenas: 0, preventa: true, arte: "from-sky-600 to-slate-900" },
  ];

  for (const juego of juegos) {
    await prisma.juego.upsert({ where: { slug: juego.slug }, update: juego, create: juego });
  }

  // Administrador por defecto pedido por el dueño del proyecto.
  // shortcut: contraseña débil de demo ("12345"); cambiarla antes de publicar el sitio.
  await prisma.usuario.upsert({
    where: { usuario: "admin" },
    update: { rol: "ADMIN" },
    create: { usuario: "admin", passwordHash: hashPassword("12345"), rol: "ADMIN" },
  });

  console.log("Seed completado: 2 propietarios, 3 pacientes y 5 juegos.");
}

main()
  .catch((error: unknown) => {
    console.error("Error al ejecutar el seed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
