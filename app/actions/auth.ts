"use server";

import { redirect } from "next/navigation";
import { prisma } from "../lib/prisma";
import { hashPassword, verifyPassword } from "../lib/password";
import { cerrarSesion, crearSesion } from "../lib/sesion";

// Usuario: solo letras (incluye acentos y ñ), máximo 50. Contraseña: máximo 30.
// Se valida aquí porque las reglas del formulario se pueden saltar desde el navegador.
const USUARIO_VALIDO = /^\p{L}{1,50}$/u;
const MAX_PASSWORD = 30;
const REGLAS = "Usuario: solo letras (máximo 50). Contraseña: máximo 30 caracteres";

export async function login(formData: FormData) {
  const usuario = String(formData.get("usuario") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!USUARIO_VALIDO.test(usuario) || password.length > MAX_PASSWORD) redirect(`/login?error=${REGLAS}`);
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
  if (!USUARIO_VALIDO.test(usuario) || password.length > MAX_PASSWORD) redirect(`/registro?error=${REGLAS}`);
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
