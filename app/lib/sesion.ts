import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type Sesion = { id: string; usuario: string; rol: "ADMIN" | "CLIENTE" };

const secret = process.env.SESSION_SECRET;
if (!secret) throw new Error("SESSION_SECRET debe estar configurada.");

const firmar = (v: string) => createHmac("sha256", secret).update(v).digest("hex");

// Cookie firmada "base64(json).firma": el rol no se puede alterar sin la clave del servidor.
export async function crearSesion(s: Sesion) {
  const v = Buffer.from(JSON.stringify(s)).toString("base64url");
  (await cookies()).set("sesion", `${v}.${firmar(v)}`, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
}

export async function cerrarSesion() {
  (await cookies()).delete("sesion");
}

export async function getSesion(): Promise<Sesion | null> {
  const raw = (await cookies()).get("sesion")?.value;
  const [v, firma] = raw?.split(".") ?? [];
  if (!v || !firma) return null;
  const esperada = firmar(v);
  if (firma.length !== esperada.length || !timingSafeEqual(Buffer.from(firma), Buffer.from(esperada))) return null;
  try {
    return JSON.parse(Buffer.from(v, "base64url").toString());
  } catch {
    return null;
  }
}

export async function requerirRol(rol: Sesion["rol"]) {
  const s = await getSesion();
  if (!s) redirect("/login");
  if (s.rol !== rol) redirect("/");
  return s;
}
