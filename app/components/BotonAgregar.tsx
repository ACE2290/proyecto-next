"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { agregarAlCarrito } from "../actions/carrito";

type Props = { juegoId: string; nombre: string; className: string; children: ReactNode; "aria-label"?: string };

export default function BotonAgregar({ juegoId, nombre, children, ...boton }: Props) {
  const [aviso, setAviso] = useState(0); // 0 = oculto; cada valor nuevo reinicia la animación

  return (
    <form action={async () => { if (await agregarAlCarrito(juegoId)) setAviso((n) => n + 1); }}>
      <button {...boton}>{children}</button>
      <span role="status">
        {aviso > 0 && (
          <span key={aviso} onAnimationEnd={() => setAviso(0)} className="aviso fixed bottom-4 right-4 z-50 flex items-center gap-3 max-w-[calc(100vw-2rem)] rounded-lg bg-green-700 px-4 py-3 text-sm font-semibold text-white shadow-lg">
            ✓ {nombre} se agregó al carrito
            <Link href="/carrito" onClick={() => setAviso(0)} className="shrink-0 rounded bg-white px-3 py-1.5 font-bold text-green-800">Ver carrito</Link>
          </span>
        )}
      </span>
    </form>
  );
}
