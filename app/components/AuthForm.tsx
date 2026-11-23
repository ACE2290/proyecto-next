import Link from "next/link";

export default function AuthForm({ titulo, accion, error, alterno, confirmar }: {
  titulo: string;
  accion: (f: FormData) => Promise<void>;
  error?: string;
  alterno: { texto: string; href: string };
  confirmar?: boolean;
}) {
  return (
    <main className="mx-auto flex min-h-screen max-w-[1440px] items-center justify-center bg-[#0B0B0E] text-white">
      <form action={accion} className="w-full max-w-80 mx-4 space-y-4 rounded-lg bg-white/5 p-8">
        <h1 className="text-2xl font-bold">{titulo}</h1>
        {error && <p className="text-xs text-red-400">{error}</p>}
        <input name="usuario" required placeholder="Usuario" className="h-10 w-full rounded border border-white/10 bg-white/5 px-3 text-sm" />
        <input name="password" type="password" required placeholder="Contraseña" className="h-10 w-full rounded border border-white/10 bg-white/5 px-3 text-sm" />
        {confirmar && <input name="confirmacion" type="password" required placeholder="Confirmar contraseña" className="h-10 w-full rounded border border-white/10 bg-white/5 px-3 text-sm" />}
        <button className="w-full rounded bg-orange-500 py-2 font-bold">{titulo}</button>
        <Link href={alterno.href} className="block text-center text-xs text-orange-500">{alterno.texto}</Link>
        <Link href="/" className="block text-center text-xs text-white/50">← Volver al inicio</Link>
      </form>
    </main>
  );
}
