"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "../lib/prisma";
import { getSesion, requerirRol } from "../lib/sesion";

export async function agregarAlCarrito(juegoId: string) {
  const s = await getSesion();
  if (!s) redirect("/login");
  if (s.rol !== "CLIENTE") return; // el admin no compra
  await prisma.carritoItem.upsert({
    where: { usuarioId_juegoId: { usuarioId: s.id, juegoId } },
    update: { cantidad: { increment: 1 } },
    create: { usuarioId: s.id, juegoId, cantidad: 1 },
  });
  revalidatePath("/", "layout");
}

export async function quitarDelCarrito(juegoId: string) {
  const s = await requerirRol("CLIENTE");
  await prisma.carritoItem.deleteMany({ where: { usuarioId: s.id, juegoId } });
  revalidatePath("/", "layout");
}

export async function comprar() {
  const s = await requerirRol("CLIENTE");
  const items = await prisma.carritoItem.findMany({ where: { usuarioId: s.id }, include: { juego: true } });
  if (items.length === 0) redirect("/carrito");
  const total = items.reduce((t, i) => t + i.juego.precio * i.cantidad, 0);
  await prisma.$transaction([
    prisma.pedido.create({
      data: {
        usuarioId: s.id,
        total,
        items: items.map((i) => ({ nombre: i.juego.nombre, precio: i.juego.precio, cantidad: i.cantidad })),
      },
    }),
    prisma.carritoItem.deleteMany({ where: { usuarioId: s.id } }),
  ]);
  revalidatePath("/", "layout");
  redirect("/pedidos");
}
