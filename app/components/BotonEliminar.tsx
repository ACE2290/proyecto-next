"use client";

export default function BotonEliminar({ nombre }: { nombre: string }) {
  return (
    <button
      className="rounded bg-red-600/80 px-3 py-1.5"
      onClick={(e) => {
        if (!confirm(`¿Seguro que quieres eliminar "${nombre}"? Esta acción no se puede deshacer.`)) {
          e.preventDefault();
        }
      }}
    >
      Eliminar
    </button>
  );
}