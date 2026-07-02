import AppLayout from "../components/layout/AppLayout";
import TopBar from "../components/layout/TopBar";

export default function DashboardPage() {
  return (
    <>
      <TopBar title="Dashboard" subtitle="Welcome back, Alen 👋" />
      <p style={{ color: "var(--text-2)" }}>Dashboard content coming soon...</p>
    </>
  );
}