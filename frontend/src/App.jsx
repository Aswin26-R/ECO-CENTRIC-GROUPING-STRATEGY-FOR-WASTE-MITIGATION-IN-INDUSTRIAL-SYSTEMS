import { useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import About from "./pages/About.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Details from "./pages/Details.jsx";
import History from "./pages/History.jsx";
import Login from "./pages/Login.jsx";
import Prediction from "./pages/Prediction.jsx";
import Result from "./pages/Result.jsx";

const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/prediction": "New Prediction",
  "/result": "Analysis Result",
  "/history": "Prediction History",
  "/about": "About Project",
};

function ProtectedLayout({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const title =
    PAGE_TITLES[location.pathname] ||
    (location.pathname.startsWith("/history/") ? "Prediction Details" : "EcoGrouping");

  return (
    <div className="flex min-h-screen bg-charcoal-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar onMenuClick={() => setSidebarOpen(true)} title={title} />
        <main className="flex-1 px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}

export default function App() {
  const { loading } = useAuth();

  if (loading) return null;

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedLayout>
            <Dashboard />
          </ProtectedLayout>
        }
      />
      <Route
        path="/prediction"
        element={
          <ProtectedLayout>
            <Prediction />
          </ProtectedLayout>
        }
      />
      <Route
        path="/result"
        element={
          <ProtectedLayout>
            <Result />
          </ProtectedLayout>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedLayout>
            <History />
          </ProtectedLayout>
        }
      />
      <Route
        path="/history/:id"
        element={
          <ProtectedLayout>
            <Details />
          </ProtectedLayout>
        }
      />
      <Route
        path="/about"
        element={
          <ProtectedLayout>
            <About />
          </ProtectedLayout>
        }
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
