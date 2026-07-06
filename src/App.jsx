import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import MyTasksPage from "./pages/MyTasksPage";
import MembersPage from "./pages/MembersPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

export default function App() {
  // placeholder — later from AuthContext
  const isLoggedIn = true;

  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*"         element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/"                 element={<Navigate to="/dashboard" />} />
      <Route path="/dashboard"        element={<AppLayout><DashboardPage /></AppLayout>} />
      <Route path="/projects"         element={<AppLayout><ProjectsPage /></AppLayout>} />
      <Route path="/projects/:id"     element={<AppLayout><ProjectDetailPage /></AppLayout>} />
      <Route path="/my-tasks"         element={<AppLayout><MyTasksPage /></AppLayout>} />
      <Route path="/members"          element={<AppLayout><MembersPage /></AppLayout>} />
      <Route path="/settings"         element={<AppLayout><SettingsPage /></AppLayout>} />
      <Route path="/login"            element={<LoginPage />} />
      <Route path="/register"         element={<RegisterPage />} />
      <Route path="*"                 element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}