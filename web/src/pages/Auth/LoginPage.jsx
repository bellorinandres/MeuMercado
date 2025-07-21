import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import BackToLanding from "./components/BackToLanding";
import { LoginServices } from "./AuthServices";

const schema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login: contextLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = async ({ email, password }) => {
    setMessage("");
    setIsLoading(true);
    try {
      const data = await LoginServices(email, password);
      contextLogin({ id: data.id_user, name: data.name, token: data.token });
      navigate("/dashboard");
    } catch (err) {
      setMessage(err.message || "Ocurrió un error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg space-y-6">
        <BackToLanding />
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          Iniciar Sesión
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Correo electrónico"
              {...register("email")}
              className="appearance-none w-full px-3 py-2 border rounded-md text-sm"
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
          <div>
            <input
              type="password"
              placeholder="Contraseña"
              {...register("password")}
              className="appearance-none w-full px-3 py-2 border rounded-md text-sm"
              autoComplete="current-password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Cargando..." : "Iniciar sesión"}
          </button>
        </form>
        <p className="text-center text-sm">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="text-blue-600 hover:text-blue-500">
            Regístrate
          </Link>
        </p>
        {message && <p className="text-center text-red-600">{message}</p>}
      </div>
    </div>
  );
}
