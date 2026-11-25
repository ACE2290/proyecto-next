import AuthForm from "../components/AuthForm";
import { login } from "../actions/auth";

// Página 100% dinámica (sesión + base de datos): se permite que bloquee al navegar.
export const instant = false;

export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <AuthForm titulo="Iniciar sesión" accion={login} error={error} alterno={{ texto: "¿No tienes cuenta? Regístrate", href: "/registro" }} />;
}
