import { redirect } from "next/navigation";

export const TIPOS = ["image/png", "image/jpeg", "image/webp"];
export const MAX_BYTES = 2 * 1024 * 1024;

export const urlImagen = (g: { slug: string; imagenVersion: number }) =>
  g.imagenVersion > 0 ? `/api/juegos/${g.slug}/imagen?v=${g.imagenVersion}` : null;

// Devuelve null si no se eligió archivo; redirige con error si el archivo no sirve.
export async function leerImagen(f: FormDataEntryValue | null, volver: string) {
  if (!(f instanceof File) || f.size === 0) return null;
  if (!TIPOS.includes(f.type)) redirect(`${volver}?error=La imagen debe ser PNG, JPG o WebP`);
  if (f.size > MAX_BYTES) redirect(`${volver}?error=La imagen pesa más de 2 MB`);
  return { tipo: f.type, datos: Buffer.from(await f.arrayBuffer()) };
}
