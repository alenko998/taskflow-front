import { useState, useEffect } from "react";
import { useToast } from "../components/ui";
import { tasksApi } from "../api";
import TopBar from "../components/layout/TopBar";
import { Badge, Avatar, Button, Modal, Card } from "../components/ui";

const PRIORITY_COLORS = { 0: "default", 1: "warning", 2: "danger", 3: "danger" };
const PRIORITY_LABELS = { 0: "Low", 1: "Medium", 2: "High", 3: "Critical" };
const STATUS_COLORS   = { 0: "default", 1: "accent", 2: "teal", 3: "success" };
const STATUS_LABELS   = { 0: "Todo", 1: "In Progress", 2: "Review", 3: "Done" };
const STATUS_FILTERS  = ["All", "Todo", "In Progress", "Review", "Done"];

export default function MyTasksPage() {
  const toast = useToast();
  const [tasks, setTasks]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch]         = useState("");
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      const res = await tasksApi.getMyTasks();
      setTasks(res.data);
    } catch {
      toast("Failed to load tasks.", "error");
    } finally {
      setLoading(false);
    }
  };

  const filtered = tasks.filter(t => {
    const statusLabel = STATUS_LABELS[t.status];
    const matchStatus = statusFilter === "All" || statusLabel === statusFilter;
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const stats = {
    total:      tasks.length,
    todo:       tasks.filter(t => t.status === 0).length,
    inProgress: tasks.filter(t => t.status === 1).length,
    done:       tasks.filter(t => t.status === 3).length,
  };

  return (
    <>
      <TopBar
        title="My Tasks"
        subtitle={`${stats.inProgress} in progress · ${stats.todo} to do`}
      />

      {/* Mini stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
        {[
          { label: "Total",       value: stats.total,      color: "var(--text-2)" },
          { label: "To Do",       value: stats.todo,       color: "var(--text-2)" },
          { label: "In Progress", value: stats.inProgress, color: "var(--acc)" },
          { label: "Completed",   value: stats.done,       color: "var(--success)" },
        ].map(s => (
          <Card key={s.label} padding="16px 20px">
            <div style={{ fontSize: "1.6rem", fontWeight: 600, color: s.color, fontFamily: "var(--fd)", marginBottom: 4 }}>
              {s.value}
            </div>
            <div style={{ fontSize: ".78rem", color: "var(--text-3)" }}>{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {STATUS_FILTERS.map(f => (
            <button key={f} onClick={() => setStatusFilter(f)} style={{
              fontFamily: "var(--fb)", fontSize: ".72rem", fontWeight: 500,
              padding: "6px 12px", borderRadius: "var(--radius-sm)",
              border: "1px solid", cursor: "pointer", transition: "all var(--t)",
              background: statusFilter === f ? "var(--acc)" : "transparent",
              color: statusFilter === f ? "#fff" : "var(--text-2)",
              borderColor: statusFilter === f ? "var(--acc)" : "var(--border-2)",
            }}>{f}</button>
          ))}
        </div>
        <input
          placeholder="Search tasks..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            background: "var(--surface)", border: "1px solid var(--border-2)",
            borderRadius: "var(--radius-sm)", color: "var(--text)",
            fontFamily: "var(--fb)", fontSize: ".88rem", padding: "8px 14px",
            outline: "none", width: 240,
          }}
        />
      </div>

      {loading && <p style={{ color: "var(--text-3)" }}>Loading tasks...</p>}

      {!loading && (
        <Card padding="0">
          <div style={{
            display: "grid", gridTemplateColumns: "32px 1fr 100px 100px 80px",
            gap: 12, padding: "10px 20px",
            borderBottom: "1px solid var(--border)",
            fontSize: ".72rem", fontWeight: 500, letterSpacing: ".06em",
            textTransform: "uppercase", color: "var(--text-3)",
          }}>
            <div /><div>Task</div><div>Priority</div><div>Status</div><div>Due</div>
          </div>

          {filtered.length === 0 && (
            <div style={{ padding: "48px", textAlign: "center", color: "var(--text-3)", fontSize: ".88rem" }}>
              {tasks.length === 0 ? "No tasks assigned to you yet." : "No tasks found."}
            </div>
          )}

          {filtered.map((task, i) => (
            <div key={task.id} style={{
              display: "grid", gridTemplateColumns: "32px 1fr 100px 100px 80px",
              gap: 12, padding: "14px 20px",
              borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none",
              alignItems: "center", cursor: "pointer", transition: "background var(--t)",
              opacity: task.status === 3 ? 0.6 : 1,
            }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--surface-2)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              onClick={() => setSelectedTask(task)}
            >
              <div style={{
                width: 18, height: 18, borderRadius: 4,
                border: `1.5px solid ${task.status === 3 ? "var(--success)" : "var(--border-2)"}`,
                background: task.status === 3 ? "var(--success)" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {task.status === 3 && <span style={{ color: "#fff", fontSize: ".65rem" }}>✓</span>}
              </div>
              <div style={{
                fontSize: ".88rem", color: "var(--text)",
                textDecoration: task.status === 3 ? "line-through" : "none",
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>{task.title}</div>
              <div><Badge variant={PRIORITY_COLORS[task.priority]} size="sm">{PRIORITY_LABELS[task.priority]}</Badge></div>
              <div><Badge variant={STATUS_COLORS[task.status]} size="sm">{STATUS_LABELS[task.status]}</Badge></div>
              <div style={{ fontSize: ".78rem", color: "var(--text-3)" }}>
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
              </div>
            </div>
          ))}
        </Card>
      )}

      <Modal
        open={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        title={selectedTask?.title || ""}
        size="md"
        footer={<Button variant="secondary" onClick={() => setSelectedTask(null)}>Close</Button>}
      >
        {selectedTask && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ display: "flex", gap: 10 }}>
              <Badge variant={PRIORITY_COLORS[selectedTask.priority]}>{PRIORITY_LABELS[selectedTask.priority]}</Badge>
              <Badge variant={STATUS_COLORS[selectedTask.status]}>{STATUS_LABELS[selectedTask.status]}</Badge>
            </div>
            {selectedTask.description && (
              <div>
                <label style={{ fontSize: ".72rem", fontWeight: 500, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--text-3)", display: "block", marginBottom: 6 }}>Description</label>
                <p style={{ fontSize: ".9rem", color: "var(--text-2)", lineHeight: 1.7 }}>{selectedTask.description}</p>
              </div>
            )}
            {selectedTask.dueDate && (
              <div>
                <label style={{ fontSize: ".72rem", fontWeight: 500, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--text-3)", display: "block", marginBottom: 6 }}>Due Date</label>
                <span style={{ fontSize: ".9rem", color: "var(--text-2)" }}>
                  {new Date(selectedTask.dueDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                </span>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
