"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "../lib/prisma";
import { requerirRol } from "../lib/sesion";
import { leerImagen } from "../lib/imagen";

const artes = ["from-amber-700 to-stone-900", "from-fuchsia-700 to-indigo-950", "from-emerald-500 to-sky-700", "from-orange-500 to-zinc-800", "from-sky-600 to-slate-900"];
const texto = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const precioValido = (n: number) => Number.isInteger(n) && n > 0;

export async function crearJuego(formData: FormData) {
  await requerirRol("ADMIN");
  const nombre = texto(formData, "nombre");
  const precio = Number(formData.get("precio"));
  const plataforma = texto(formData, "plataforma");
  if (!nombre || !precioValido(precio) || !["playstation", "xbox", "nintendo", "pc"].includes(plataforma)) {
    redirect("/admin?error=Revisa nombre, plataforma y precio (entero mayor a 0)");
  }
  const imagen = await leerImagen(formData.get("imagen"), "/admin");
  const slug = nombre.toLowerCase().normalize("NFD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "juego";
  if (await prisma.juego.findUnique({ where: { slug } })) redirect("/admin?error=Ya existe un juego con ese nombre");
  await prisma.juego.create({
    data: {
      slug,
      nombre,
      titulo: nombre.toUpperCase(),
      subtitulo: texto(formData, "subtitulo").toUpperCase(),
      plataforma,
      descripcion: texto(formData, "descripcion"),
      precio,
      rating: 0,
      resenas: 0,
      preventa: formData.get("preventa") === "on",
      etiqueta: formData.get("preventa") === "on" ? "PREVENTA" : "NUEVO",
      arte: artes[Math.floor(Math.random() * artes.length)],
      ...(imagen && { imagenVersion: 1, imagen: { create: imagen } }),
    },
  });
  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function cambiarPrecio(id: string, formData: FormData) {
  await requerirRol("ADMIN");
  const precio = Number(formData.get("precio"));
  if (!precioValido(precio)) redirect("/admin?error=Precio inválido");
  // Un precio nuevo es el precio normal: quita el descuento y su etiqueta "-X%".
  await prisma.$transaction([
    prisma.juego.update({ where: { id }, data: { precio, precioAnterior: null } }),
    prisma.juego.updateMany({ where: { id, etiqueta: { startsWith: "-" } }, data: { etiqueta: null } }),
  ]);
  revalidatePath("/", "layout");
  redirect("/admin");
}

// 0 quita el descuento. Siempre se calcula sobre el precio normal, así no se acumulan.
export async function ponerDescuento(id: string, formData: FormData) {
  await requerirRol("ADMIN");
  const pct = Number(texto(formData, "descuento") || NaN);
  if (!Number.isInteger(pct) || pct < 0 || pct > 90) redirect("/admin?error=El descuento debe ser un entero de 0 a 90");
  const g = await prisma.juego.findUnique({ where: { id } });
  if (!g) redirect("/admin?error=Ese juego ya no existe");
  const normal = g.precioAnterior ?? g.precio;
  const precio = Math.round((normal * (100 - pct)) / 100);
  if (!precioValido(precio) || (pct > 0 && precio >= normal)) redirect("/admin?error=El precio es muy bajo para ese descuento");
  await prisma.juego.update({
    where: { id },
    data: { precio, precioAnterior: pct ? normal : null, ...(g.etiqueta?.startsWith("-") && { etiqueta: null }) },
  });
  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function cambiarImagen(id: string, formData: FormData) {
  await requerirRol("ADMIN");
  const imagen = await leerImagen(formData.get("imagen"), "/admin");
  if (!imagen) redirect("/admin?error=Elige un archivo de imagen");
  await prisma.juegoImagen.upsert({ where: { juegoId: id }, update: imagen, create: { juegoId: id, ...imagen } });
  await prisma.juego.update({ where: { id }, data: { imagenVersion: { increment: 1 } } });
  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function eliminarJuego(id: string) {
  await requerirRol("ADMIN");
  await prisma.juego.delete({ where: { id } });
  revalidatePath("/", "layout");
  redirect("/admin");
}