import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BackToLanding from "./components/BackToLanding";
import { RegisterService } from "./AuthServices";
import { useTranslation } from "react-i18next";
import LanguageSelector from "../Public/components/LanguageSelector";

export default function RegisterPage() {
  const { t } = useTranslation();

  const schema = z
    .object({
      name: z.string().min(1, t("register_name_required")),
      email: z.string().email(t("login_invalid_email")),
      password: z
        .string()
        .min(6, t("register_password_min_length"))
        .regex(/[a-z]/, t("register_password_lowercase"))
        .regex(/[A-Z]/, t("register_password_uppercase"))
        .regex(/[0-9]/, t("register_password_number"))
        .regex(/[^a-zA-Z0-9]/, t("register_password_special")),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("register_passwords_match"),
      path: ["confirmPassword"],
    });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async ({ name, email, password }) => {
    setMessage("");
    setIsLoading(true);
    try {
      const data = await RegisterService(name, email, password);
      setMessage(data.message || t("register_success"));
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage(err.message || t("register_error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg space-y-6 relative">
        {/* Agregamos el selector de idioma y el componente BackToLanding */}
        <div className="absolute top-4 right-4">
          <LanguageSelector />
        </div>
        <BackToLanding />
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          {t("register_title")}
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder={t("register_name_placeholder")}
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
              placeholder={t("login_email_placeholder")}
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
              placeholder={t("login_password_placeholder")}
              {...register("password")}
              className="appearance-none w-full px-3 py-2 border rounded-md text-sm"
              autoComplete="new-password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>
          <label className="text-sm text-gray-600 block mb-1">
            {t("register_password_min_length")}{" "}
            <ul className="list-disc ml-5 text-xs mt-1 text-gray-500">
              <li>{t("register_password_min_length")}</li>
              <li>{t("register_password_uppercase")}</li>
              <li>{t("register_password_lowercase")}</li>
              <li>{t("register_password_number")}</li>
              <li>{t("register_password_special")}</li>
            </ul>
          </label>
          <div>
            <input
              type="password"
              placeholder={t("register_confirm_password_placeholder")}
              {...register("confirmPassword")}
              className="appearance-none w-full px-3 py-2 border rounded-md text-sm"
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !isValid}
            className="w-full py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? t("register_loading") : t("register_button")}
          </button>
        </form>
        <p className="text-center text-sm">
          {t("register_has_account")}{" "}
          <Link to="/login" className="text-blue-600 hover:text-blue-500">
            {t("login_link")}
          </Link>
        </p>
        {message && (
          <p
            className={`text-center ${
              message.includes(t("register_success"))
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
