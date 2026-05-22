import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Layout from "./components/layout/Layout";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/dashboard/Dashboard";
import GuideCS from "./pages/guides/GuideCS";
import GuideFiscal from "./pages/guides/GuideFiscal";
import GuideDP from "./pages/guides/GuideDP";
import GuideOMIE from "./pages/guides/GuideOMIE";
import ComingSoon from "./pages/ComingSoon";
import Trilhas from "./pages/trilhas/Trilhas";
import TrilhaDetail from "./pages/trilhas/TrilhaDetail";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCompanies from "./pages/admin/AdminCompanies";
import AdminSectors from "./pages/admin/AdminSectors";
import SetPassword from "./pages/SetPassword";
import Profile from "./pages/Profile";
import AdminGuides from "./pages/admin/AdminGuides";
import AdminTrilhas from "./pages/admin/AdminTrilhas";
import AdminImport from "./pages/admin/AdminImport";
import GuideContabil from "./pages/guides/GuideContabil";
import GuideInformatica from "./pages/guides/GuideInformatica";


function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--soma-bg)" }}>
      <span className="animate-pulse" style={{ color: "#f5a623" }}>Carregando...</span>
    </div>
  );
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

function ManagerRoute({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useAuth();
  if (loading) return null;
  return profile?.role === "manager" || profile?.role === "admin"
    ? <>{children}</>
    : <Navigate to="/" replace />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--soma-bg)" }}>
      <span className="animate-pulse" style={{ color: "#f5a623" }}>Carregando...</span>
    </div>
  );
  return profile?.role === "manager" || profile?.role === "admin"
    ? <>{children}</>
    : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Pública */}
          <Route path="/login"        element={<Login />} />
          <Route path="/set-password" element={<SetPassword />} />

          {/* Portal — com sidebar */}
          <Route path="/" element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }>
            <Route index element={<Home />} />
            <Route path="guias/cs"      element={<GuideCS />} />
            <Route path="guias/fiscal"  element={<GuideFiscal />} />
            <Route path="guias/dp"      element={<GuideDP />} />
            <Route path="guias/contabil" element={<GuideContabil />} />
            <Route path="guias/omie"    element={<GuideOMIE />} />
            <Route path="guias/informatica" element={<GuideInformatica />} />
            <Route path="guias/*"       element={<ComingSoon />} />
            <Route path="trilhas"       element={<Trilhas />} />
            <Route path="trilhas/:id"   element={<TrilhaDetail />} />
            <Route path="perfil"        element={<Profile />} />
            <Route path="dashboard"     element={
              <ManagerRoute><Dashboard /></ManagerRoute>
            } />
          </Route>

          {/* Admin — layout próprio */}
          <Route path="/admin" element={
            <PrivateRoute>
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            </PrivateRoute>
          }>
            <Route index element={<Navigate to="/admin/usuarios" replace />} />
            <Route path="usuarios"  element={<AdminUsers />} />
            <Route path="empresas"  element={<AdminCompanies />} />
            <Route path="setores"   element={<AdminSectors />} />
            <Route path="guias"     element={<AdminGuides />} />
            <Route path="trilhas"   element={<AdminTrilhas />} />
            <Route path="import"    element={<AdminImport />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}