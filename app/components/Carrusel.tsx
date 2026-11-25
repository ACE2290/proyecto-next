"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const imagenes = [
  ["gta-6.jpg", "GTA VI"],
  ["resident-evil-veronica.avif", "Resident Evil Veronica"],
  ["gears-of-war-e-day.jpg", "Gears of War: E-Day"],
  ["dragon-ball-xenoverse-3.png", "Dragon Ball Xenoverse 3"],
  ["zelda-ocarina-of-time.jpg", "The Legend of Zelda: Ocarina of Time"],
  ["dragon-ball-sparking-zero.jpg", "Dragon Ball: Sparking! Zero"],
];

const boton = "flex h-8 min-w-8 items-center justify-center rounded-full bg-black/60 px-2 text-sm hover:bg-orange-500";

// Fondo del banner principal: va dentro de un contenedor "relative".
export default function Carrusel() {
  const [actual, setActual] = useState(0);
  const [pausado, setPausado] = useState(false);
  const mover = (paso: number) => setActual((i) => (i + paso + imagenes.length) % imagenes.length);

  // Depende de "actual" para que el tiempo se reinicie al cambiar de imagen a mano.
  useEffect(() => {
    if (pausado) return;
    const t = setTimeout(() => setActual((i) => (i + 1) % imagenes.length), 5000);
    return () => clearTimeout(t);
  }, [actual, pausado]);

  return (
    <div role="region" aria-roledescription="carrusel" aria-label="Juegos destacados">
      {imagenes.map(([archivo, nombre], i) => (
        <Image
          key={archivo}
          src={`/carrusel/${archivo}`}
          alt={nombre}
          fill
          sizes="(max-width: 1440px) 100vw, 1440px"
          loading={i === 0 ? "eager" : "lazy"}
          aria-hidden={i !== actual}
          className={`object-cover transition-opacity duration-700 motion-reduce:transition-none ${i === actual ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      {/* Oscurece el lado izquierdo para que el texto se lea sobre cualquier imagen */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0E] via-[#0B0B0E]/70 to-transparent" />
      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 md:right-16">
        <button type="button" onClick={() => mover(-1)} className={boton} aria-label="Imagen anterior">‹</button>
        {imagenes.map(([archivo, nombre], i) => (
          <button
            key={archivo}
            type="button"
            onClick={() => setActual(i)}
            aria-label={`Ver ${nombre}`}
            aria-current={i === actual}
            className={`h-2.5 w-2.5 rounded-full ${i === actual ? "bg-orange-500" : "bg-white/50"}`}
          />
        ))}
        <button type="button" onClick={() => mover(1)} className={boton} aria-label="Imagen siguiente">›</button>
        <button type="button" onClick={() => setPausado(!pausado)} className={`${boton} text-[10px]`}>{pausado ? "Reanudar" : "Pausar"}</button>
      </div>
    </div>
  );
}
