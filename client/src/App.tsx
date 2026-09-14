import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";

export default function App() {
  return (
    <AuthProvider>
      <div className="relative min-h-screen bg-[#0a0a0f]">
        {/* Global ISOI Chapter Logo Watermark */}
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden select-none opacity-[0.04] filter invert">
          <img src="/isoi-logo.png" alt="" className="w-[85vw] max-w-[850px] h-auto object-contain" />
        </div>

        <div className="relative z-10">
          <BrowserRouter>
            <Routes>
              {/* Public Landing Page */}
              <Route path="/" element={<LandingPage />} />

              {/* Authentication Pages */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected Team Participant Dashboard */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Protected Admin Only Dashboard */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </div>
      </div>
    </AuthProvider>
  );
}
