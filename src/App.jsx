import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import AppLayout from "./components/layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import MyTasksPage from "./pages/MyTasksPage";
import MembersPage from "./pages/MembersPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AcceptInvitationPage from "./pages/AcceptInvitationPage";
import CreateWorkspacePage from "./pages/CreateWorkspacePage";


function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login"    element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />

      <Route path="/" element={<ProtectedRoute><Navigate to="/dashboard" /></ProtectedRoute>} />

      <Route path="/dashboard" element={
        <ProtectedRoute><AppLayout><DashboardPage /></AppLayout></ProtectedRoute>
      } />
      <Route path="/projects" element={
        <ProtectedRoute><AppLayout><ProjectsPage /></AppLayout></ProtectedRoute>
      } />
      <Route path="/projects/:id" element={
        <ProtectedRoute><AppLayout><ProjectDetailPage /></AppLayout></ProtectedRoute>
      } />
      <Route path="/my-tasks" element={
        <ProtectedRoute><AppLayout><MyTasksPage /></AppLayout></ProtectedRoute>
      } />
      <Route path="/members" element={
        <ProtectedRoute><AppLayout><MembersPage /></AppLayout></ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute><AppLayout><SettingsPage /></AppLayout></ProtectedRoute>
      } />

      <Route path="/create-workspace" element={<CreateWorkspacePage />} />

      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      <Route path="/accept-invitation" element={<AcceptInvitationPage />} />
    </Routes>
  );
}