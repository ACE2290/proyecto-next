import { prisma } from "./lib/prisma";
import Formulario from "./components/Formulario";
import ListadoPacientes from "./components/ListadoPacientes";
import type { Patient } from "./types";
import { connection } from "next/server";
import { Suspense } from "react";

async function ContenidoPacientes({
  searchParams,
}: {
  searchParams: Promise<{ editar?: string }>;
}) {
  await connection();
  const { editar } = await searchParams;
  const pacientes = await prisma.paciente.findMany({
    include: { propietario: true },
    orderBy: { fechaAlta: "desc" },
  });

  const patients: Patient[] = pacientes.map((paciente) => ({
    id: paciente.id,
    name: paciente.nombre,
    caretaker: paciente.propietario.nombre,
    email: paciente.propietario.email,
    date: paciente.fechaAlta.toISOString().slice(0, 10),
    symptoms: paciente.sintomas,
  }));

  const seleccionado = editar
    ? patients.find((paciente) => paciente.id === editar) ?? null
    : null;

  return (
    <div className="mt-12 md:flex">
      <Formulario pacienteActivo={seleccionado} />
      <ListadoPacientes patients={patients} />
    </div>
  );
}

export default function Home({
  searchParams,
}: {
  searchParams: Promise<{ editar?: string }>;
}) {
  return (
    <div className="container mx-auto mt-20">
      <h1 className="font-black text-5xl text-center md:w-2/3 md:mx-auto">
        Seguimiento de Pacientes {''}
        <span className="text-indigo-700">Veterinaria</span>
      </h1>
      <Suspense fallback={<p className="mt-12 text-center">Cargando pacientes...</p>}>
        <ContenidoPacientes searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
