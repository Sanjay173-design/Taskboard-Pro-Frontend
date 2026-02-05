import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import AppShell from "./layout/AppShell";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Workspaces from "./pages/Workspaces";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import Dashboard from "./pages/Dashboard";
import ActivityFeed from "./pages/ActivityFeed";
import { Toaster } from "react-hot-toast";
import ConfirmSignup from "./pages/ConfirmSignup";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/confirm" element={<ConfirmSignup />} />

          {/* Protected App */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppShell />
                <Toaster position="top-right" />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="workspaces" replace />} />
            <Route path="/app/dashboard" element={<Dashboard />} />
            <Route path="workspaces" element={<Workspaces />} />
            <Route path="projects" element={<Projects />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="/app/activity" element={<ActivityFeed />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
