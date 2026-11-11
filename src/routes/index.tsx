import { Navigate, Route, Routes } from 'react-router-dom';
import type { ReactElement } from 'react';
import { useAuth } from '../hooks/useAuth';
import AdminLayout from '../layouts/AdminLayout';
import StorePage from '../pages/StorePage';
import CheckoutPage from '../pages/CheckoutPage';
import TrackingPage from '../pages/TrackingPage';
import Login from '../pages/admin/Login';
import ForgotPassword from '../pages/admin/ForgotPassword';
import Dashboard from '../pages/admin/Dashboard';
import Orders from '../pages/admin/Orders';
import Products from '../pages/admin/Products';
import Categories from '../pages/admin/Categories';
import SettingsPage from '../pages/admin/Settings';
const RequireAuth = ({ children }: { children: ReactElement }) => useAuth().isAuthenticated ? children : <Navigate to="/admin/login" replace />;
export default function AppRoutes() {
  return <Routes>
    <Route path="/" element={<Navigate to="/loja/demo" replace />} />
    <Route path="/loja/:slug" element={<StorePage />} />
    <Route path="/loja/:slug/checkout" element={<CheckoutPage />} />
    <Route path="/loja/:slug/pedido/:id" element={<TrackingPage />} />
    <Route path="/admin/login" element={<Login />} />
    <Route path="/admin/recuperar-senha" element={<ForgotPassword />} />
    <Route path="/admin" element={<RequireAuth><AdminLayout /></RequireAuth>}>
      <Route index element={<Dashboard />} /><Route path="pedidos" element={<Orders />} /><Route path="produtos" element={<Products />} />
      <Route path="categorias" element={<Categories />} /><Route path="configuracoes" element={<SettingsPage />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}
