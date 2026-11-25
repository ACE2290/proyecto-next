import AuthForm from "../components/AuthForm";
import { registrar } from "../actions/auth";

// Página 100% dinámica (sesión + base de datos): se permite que bloquee al navegar.
export const instant = false;

export default async function Registro({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <AuthForm titulo="Crear cuenta" accion={registrar} error={error} confirmar alterno={{ texto: "¿Ya tienes cuenta? Inicia sesión", href: "/login" }} />;
}
