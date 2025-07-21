import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BackToLanding from "./components/BackToLanding";
import { RegisterService } from "./AuthServices";

const schema = z.object({
  name: z.string().min(1, "Nombre obligatorio"),
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async ({ name, email, password }) => {
    setMessage("");
    setIsLoading(true);
    try {
      const data = await RegisterService(name, email, password);
      setMessage(data.message || "¡Registro exitoso!");
      setTimeout(() => navigate("/login"), 1500);
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
          Crear una Cuenta
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Nombre"
              {...register("name")}
              className="appearance-none w-full px-3 py-2 border rounded-md text-sm"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
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
              autoComplete="new-password"
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
            {isLoading ? "Cargando..." : "Registrarse"}
          </button>
        </form>
        <p className="text-center text-sm">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-blue-600 hover:text-blue-500">
            Inicia sesión
          </Link>
        </p>
        {message && (
          <p
            className={`text-center ${
              message.includes("exitoso") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
