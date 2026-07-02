import TopBar from "../components/layout/TopBar";

export default function MyTasksPage() {
  return (
    <>
      <TopBar title="My Tasks" subtitle="Tasks assigned to you" />
      <p style={{ color: "var(--text-2)" }}>My tasks coming soon...</p>
    </>
  );
}