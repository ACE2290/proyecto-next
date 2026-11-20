"use client";

import type { Patient } from "../types";
import PacienteDetalle from "./PacienteDetalle";
import DialogModal from "./DialogModal";
import { useState } from "react";
import { eliminarPaciente } from "../actions/pacientes";
import Link from "next/link";

type PacienteProps = {
    paciente: Patient;
};

const Paciente = ({ paciente }: PacienteProps) => {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleEliminar = async () => {
    await eliminarPaciente(paciente.id);
  };

  return (
    <div className="mx-5 my-10 bg-white shadow-md px-5 py-10 rounded-xl">
      <PacienteDetalle label="ID" data={paciente.id} />
      <PacienteDetalle label="Nombre Mascota" data={paciente.name} />
      <PacienteDetalle label="Propietario" data={paciente.caretaker} />
      <PacienteDetalle label="Email" data={paciente.email} />
      <PacienteDetalle label="Fecha Alta" data={paciente.date} />
      <PacienteDetalle label="Síntomas" data={paciente.symptoms} />

      <div className="flex justify-between flex-wrap gap-2 mt-10">
        <Link
          href={`/?editar=${paciente.id}`}
          className="py-2 px-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase rounded-lg transition-colors"
        >
          Editar
        </Link>

        <button
          type="button"
          onClick={() => setIsOpenModal(true)}
          className="py-2 px-10 bg-red-600 hover:bg-red-700 text-white font-bold uppercase rounded-lg transition-colors"
        >
          Eliminar
        </button>
      </div>

      {/* Modal para Confirmación de Baja */}
      <DialogModal
        title="Confirmar Eliminación"
        isOpened={isOpenModal}
        onProceed={handleEliminar}
        onClose={() => setIsOpenModal(false)}
      >
        <p className="text-gray-600">
          ¿Estás seguro de que deseas dar de baja al paciente <strong>{paciente.name}</strong>? Esta acción no se puede deshacer.
        </p>
      </DialogModal>
    </div>
  );
};

export default Paciente;