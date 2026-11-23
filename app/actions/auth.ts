"use server";

import { redirect } from "next/navigation";
import { prisma } from "../lib/prisma";
import { hashPassword, verifyPassword } from "../lib/password";
import { cerrarSesion, crearSesion } from "../lib/sesion";

export async function login(formData: FormData) {
  const usuario = String(formData.get("usuario") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const u = await prisma.usuario.findUnique({ where: { usuario } });
  if (!u || !verifyPassword(password, u.passwordHash)) redirect("/login?error=Usuario o contraseña incorrectos");
  await crearSesion({ id: u.id, usuario: u.usuario, rol: u.rol as "ADMIN" | "CLIENTE" });
  redirect(u.rol === "ADMIN" ? "/admin" : "/");
}

// Solo crea clientes: el rol nunca viene del formulario.
export async function registrar(formData: FormData) {
  const usuario = String(formData.get("usuario") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (password !== String(formData.get("confirmacion") ?? "")) redirect("/registro?error=Las contraseñas no coinciden");
  if (usuario.length < 3 || password.length < 5) redirect("/registro?error=Usuario mínimo 3 y contraseña mínimo 5 caracteres");
  if (await prisma.usuario.findUnique({ where: { usuario } })) redirect("/registro?error=Ese usuario ya existe");
  const u = await prisma.usuario.create({ data: { usuario, passwordHash: hashPassword(password), rol: "CLIENTE" } });
  await crearSesion({ id: u.id, usuario: u.usuario, rol: "CLIENTE" });
  redirect("/");
}

export async function salir() {
  await cerrarSesion();
  redirect("/");
}
