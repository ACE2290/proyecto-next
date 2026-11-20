"use server";

import { revalidatePath } from "next/cache";
import type { DraftPatient } from "../types";
import { prisma } from "../lib/prisma";

function validarPaciente(data: DraftPatient) {
  if (
    !data.name.trim() ||
    !data.caretaker.trim() ||
    !data.email.trim() ||
    !data.date ||
    !data.symptoms.trim()
  ) {
    throw new Error("Todos los campos del paciente son obligatorios");
  }
}

export async function agregarPaciente(data: DraftPatient) {
  validarPaciente(data);

  const propietario = await prisma.propietario.upsert({
    where: { email: data.email },
    update: { nombre: data.caretaker },
    create: { nombre: data.caretaker, email: data.email },
  });

  await prisma.paciente.create({
    data: {
      nombre: data.name,
      fechaAlta: new Date(`${data.date}T00:00:00.000Z`),
      sintomas: data.symptoms,
      propietarioId: propietario.id,
    },
  });

  revalidatePath("/");
}

export async function actualizarPaciente(id: string, data: DraftPatient) {
  validarPaciente(data);

  const propietario = await prisma.propietario.upsert({
    where: { email: data.email },
    update: { nombre: data.caretaker },
    create: { nombre: data.caretaker, email: data.email },
  });

  await prisma.paciente.update({
    where: { id },
    data: {
      nombre: data.name,
      fechaAlta: new Date(`${data.date}T00:00:00.000Z`),
      sintomas: data.symptoms,
      propietarioId: propietario.id,
    },
  });

  revalidatePath("/");
}

export async function eliminarPaciente(id: string) {
  await prisma.paciente.delete({ where: { id } });
  revalidatePath("/");
}
