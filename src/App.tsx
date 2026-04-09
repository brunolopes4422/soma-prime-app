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

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-ph-bg">
      <span className="text-gold-light text-lg animate-pulse">Carregando...</span>
    </div>
  );
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

function ManagerRoute({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useAuth();
  if (loading) return null;
  return profile?.role === "manager" ? <>{children}</> : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }>
            <Route index element={<Home />} />

            {/* Guias prontos */}
            <Route path="guias/cs"      element={<GuideCS />} />
            <Route path="guias/fiscal"  element={<GuideFiscal />} />
            <Route path="guias/dp"      element={<GuideDP />} />
            <Route path="guias/omie"    element={<GuideOMIE />} />

            {/* Em breve — novos módulos caem aqui até ficarem prontos */}
            <Route path="guias/*"       element={<ComingSoon />} />

            <Route path="dashboard" element={
              <ManagerRoute>
                <Dashboard />
              </ManagerRoute>
            } />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}