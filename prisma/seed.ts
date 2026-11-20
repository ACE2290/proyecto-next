import { PrismaPg } from "@prisma/adapter-pg";
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

  console.log("Seed completado: 2 propietarios y 3 pacientes.");
}

main()
  .catch((error: unknown) => {
    console.error("Error al ejecutar el seed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
