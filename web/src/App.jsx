import { Routes, Route, Navigate, Outlet } from "react-router-dom"; // ✅ Importa Outlet
import LandingPage from "./pages/Public/LandingPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import LoginPage from "./pages/Auth/LoginPage";
import PrivateRoute from "./pages/Routes/PrivateRoute"; // ✅ Importa PrivateRoute
import CreateList from "./pages/CreateList/CreateList";

import ListDetailsPage from "./pages/Dashboard/ListDetailsPage";
import ShoppingListPage from "./pages/ShoppingList/ShoppingListPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* ✅ Forma correcta de anidar rutas protegidas con <Outlet /> */}
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/createList" element={<CreateList />} />{" "}
        <Route path="/list/:listId/purchase" element={<ShoppingListPage />} />
        <Route path="/list/:listId/details" element={<ListDetailsPage />} />
      </Route>

      {/* Puedes añadir una ruta de fallback para páginas no encontradas */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
