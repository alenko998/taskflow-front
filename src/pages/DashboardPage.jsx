import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui";
import { projectsApi, tasksApi } from "../api";
import TopBar from "../components/layout/TopBar";
import { Card, Badge, Avatar, Button } from "../components/ui";

const PRIORITY_COLORS = { 0: "default", 1: "warning", 2: "danger", 3: "danger" };
const PRIORITY_LABELS = { 0: "Low", 1: "Medium", 2: "High", 3: "Critical" };
const STATUS_COLORS   = { 0: "default", 1: "accent", 2: "teal", 3: "success" };
const STATUS_LABELS   = { 0: "Todo", 1: "In Progress", 2: "Review", 3: "Done" };
const STATUS_PROJ     = { 0: "accent", 1: "warning", 2: "success" };
const STATUS_PROJ_L   = { 0: "Active", 1: "On Hold", 2: "Completed" };

export default function DashboardPage() {
  const navigate    = useNavigate();
  const { user }    = useAuth();
  const toast       = useToast();

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks]       = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [pRes, tRes] = await Promise.all([
          projectsApi.getProjects(),
          tasksApi.getMyTasks(),
        ]);
        setProjects(pRes.data);
        setTasks(tRes.data);
      } catch {
        toast("Failed to load dashboard.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const totalTasks     = projects.reduce((a, p) => a + p.taskCount, 0);
  const completedTasks = projects.reduce((a, p) => a + p.completedTaskCount, 0);
  const activeTasks    = tasks.filter(t => t.status !== 3).length;

  const STATS = [
    { label: "Total Projects", value: projects.length, change: "in your workspace",  color: "var(--acc)",     icon: "◈" },
    { label: "My Active Tasks", value: activeTasks,    change: "assigned to you",     color: "var(--teal)",    icon: "✓" },
    { label: "Completed Tasks", value: completedTasks, change: "across all projects", color: "var(--success)", icon: "⊙" },
    { label: "Total Tasks",     value: totalTasks,     change: "across all projects", color: "var(--text-2)",  icon: "⊞" },
  ];

  return (
    <>
      <TopBar
        title="Dashboard"
        subtitle={`Welcome back, ${user?.firstName} 👋`}
        actions={<Button size="sm" onClick={() => navigate("/projects")}>+ New Project</Button>}
      />

      {loading ? (
        <p style={{ color: "var(--text-3)" }}>Loading...</p>
      ) : (
        <>
          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
            {STATS.map(s => (
              <Card key={s.label} padding="20px">
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontSize: "1.2rem" }}>{s.icon}</span>
                  <span style={{ fontSize: "1.8rem", fontWeight: 600, color: s.color, fontFamily: "var(--fd)" }}>{s.value}</span>
                </div>
                <div style={{ fontSize: ".85rem", fontWeight: 500, color: "var(--text)", marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: ".75rem", color: "var(--text-3)" }}>{s.change}</div>
              </Card>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24 }}>
            {/* My Tasks */}
            <Card padding="0">
              <div style={{
                padding: "18px 24px", borderBottom: "1px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "space-between"
              }}>
                <h3 style={{ fontFamily: "var(--fd)", fontSize: "1rem", fontWeight: 600, color: "var(--text)" }}>My Tasks</h3>
                <Button variant="ghost" size="sm" onClick={() => navigate("/my-tasks")}>View all</Button>
              </div>
              {tasks.length === 0 ? (
                <div style={{ padding: "40px", textAlign: "center", color: "var(--text-3)", fontSize: ".88rem" }}>
                  No tasks assigned to you yet.
                </div>
              ) : (
                tasks.slice(0, 6).map((task, i) => (
                  <div key={task.id} style={{
                    padding: "14px 24px",
                    borderBottom: i < Math.min(tasks.length, 6) - 1 ? "1px solid var(--border)" : "none",
                    display: "flex", alignItems: "center", gap: 12,
                    cursor: "pointer", transition: "background var(--t)",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--surface-2)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    onClick={() => navigate("/my-tasks")}
                  >
                    <div style={{
                      width: 16, height: 16, border: "1.5px solid var(--border-2)",
                      borderRadius: 4, flexShrink: 0,
                    }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: ".88rem", color: "var(--text)", marginBottom: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {task.title}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                      <Badge variant={PRIORITY_COLORS[task.priority]} size="sm">{PRIORITY_LABELS[task.priority]}</Badge>
                      <Badge variant={STATUS_COLORS[task.status]} size="sm">{STATUS_LABELS[task.status]}</Badge>
                    </div>
                  </div>
                ))
              )}
            </Card>

            {/* Recent Projects */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h3 style={{ fontFamily: "var(--fd)", fontSize: "1rem", fontWeight: 600, color: "var(--text)" }}>Recent Projects</h3>
                <Button variant="ghost" size="sm" onClick={() => navigate("/projects")}>View all</Button>
              </div>

              {projects.length === 0 ? (
                <Card padding="20px">
                  <p style={{ fontSize: ".85rem", color: "var(--text-3)", textAlign: "center" }}>No projects yet.</p>
                </Card>
              ) : (
                projects.slice(0, 3).map(p => {
                  const pct = p.taskCount > 0 ? Math.round((p.completedTaskCount / p.taskCount) * 100) : 0;
                  return (
                    <Card key={p.id} hover padding="18px" onClick={() => navigate(`/projects/${p.id}`)}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                        <div style={{ fontSize: ".9rem", fontWeight: 500, color: "var(--text)" }}>{p.name}</div>
                        <Badge variant={STATUS_PROJ[p.status]} size="sm">{STATUS_PROJ_L[p.status]}</Badge>
                      </div>
                      <div style={{ marginBottom: 8 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                          <span style={{ fontSize: ".75rem", color: "var(--text-3)" }}>{p.completedTaskCount}/{p.taskCount} tasks</span>
                          <span style={{ fontSize: ".75rem", color: "var(--text-2)", fontWeight: 500 }}>{pct}%</span>
                        </div>
                        <div style={{ height: 4, background: "var(--border)", borderRadius: 2, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: "var(--acc)", borderRadius: 2, transition: "width .4s ease" }} />
                        </div>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
