import { useState } from "react";
import TopBar from "../components/layout/TopBar";
import { Badge, Avatar, Button, Modal, Input, Card } from "../components/ui";

const ALL_TASKS = [
  { id: 1,  title: "Design new onboarding flow",    project: "Website Redesign", priority: "High",     status: "In Progress", due: "Jul 5",  assignee: "Alen S", description: "Create wireframes and prototypes for the new user onboarding experience." },
  { id: 2,  title: "Fix authentication bug",         project: "Mobile App",       priority: "Critical", status: "Todo",        due: "Jul 3",  assignee: "Alen S", description: "Users are getting logged out randomly. Investigate and fix the JWT issue." },
  { id: 3,  title: "Write API documentation",        project: "Backend API",      priority: "Medium",   status: "In Progress", due: "Jul 8",  assignee: "Alen S", description: "Document all REST endpoints using Swagger." },
  { id: 4,  title: "Review pull requests",           project: "Mobile App",       priority: "Low",      status: "Todo",        due: "Jul 4",  assignee: "Alen S", description: "Review and merge open PRs from the team." },
  { id: 5,  title: "Update dependencies",            project: "Website Redesign", priority: "Medium",   status: "Review",      due: "Jul 6",  assignee: "Alen S", description: "Update all npm packages to latest stable versions." },
  { id: 6,  title: "Setup CI/CD pipeline",           project: "Backend API",      priority: "High",     status: "Done",        due: "Jun 30", assignee: "Alen S", description: "Configure GitHub Actions for automated testing and deployment." },
  { id: 7,  title: "User testing session",           project: "Website Redesign", priority: "Medium",   status: "Todo",        due: "Jul 10", assignee: "Alen S", description: "Conduct user testing with 5 participants and document findings." },
  { id: 8,  title: "Performance optimization",       project: "Mobile App",       priority: "High",     status: "Todo",        due: "Jul 12", assignee: "Alen S", description: "Optimize app performance and reduce load time by 30%." },
];

const PRIORITY_COLORS = { Low: "default", Medium: "warning", High: "danger", Critical: "danger" };
const STATUS_COLORS   = { Todo: "default", "In Progress": "accent", Review: "teal", Done: "success" };
const STATUS_FILTERS  = ["All", "Todo", "In Progress", "Review", "Done"];
const PRIORITY_FILTERS = ["All", "Low", "Medium", "High", "Critical"];

export default function MyTasksPage() {
  const [statusFilter,   setStatusFilter]   = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [search,         setSearch]         = useState("");
  const [selectedTask,   setSelectedTask]   = useState(null);
  const [tasks,          setTasks]          = useState(ALL_TASKS);

  const filtered = tasks.filter(t => {
    const matchStatus   = statusFilter   === "All" || t.status   === statusFilter;
    const matchPriority = priorityFilter === "All" || t.priority === priorityFilter;
    const matchSearch   = t.title.toLowerCase().includes(search.toLowerCase()) ||
                          t.project.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchPriority && matchSearch;
  });

  const toggleDone = (id) => {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, status: t.status === "Done" ? "Todo" : "Done" } : t
    ));
  };

  const stats = {
    total:      tasks.length,
    todo:       tasks.filter(t => t.status === "Todo").length,
    inProgress: tasks.filter(t => t.status === "In Progress").length,
    done:       tasks.filter(t => t.status === "Done").length,
  };

  return (
    <>
      <TopBar
        title="My Tasks"
        subtitle={`${stats.inProgress} in progress · ${stats.todo} to do`}
        actions={<Button size="sm">+ New Task</Button>}
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
        <div style={{ flex: 1, maxWidth: 280 }}>
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            icon={<span style={{ fontSize: ".85rem" }}>🔍</span>}
          />
        </div>
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
        <div style={{ display: "flex", gap: 6 }}>
          {PRIORITY_FILTERS.map(f => (
            <button key={f} onClick={() => setPriorityFilter(f)} style={{
              fontFamily: "var(--fb)", fontSize: ".72rem", fontWeight: 500,
              padding: "6px 12px", borderRadius: "var(--radius-sm)",
              border: "1px solid", cursor: "pointer", transition: "all var(--t)",
              background: priorityFilter === f ? "var(--surface-2)" : "transparent",
              color: priorityFilter === f ? "var(--text)" : "var(--text-3)",
              borderColor: priorityFilter === f ? "var(--border-2)" : "var(--border)",
            }}>{f}</button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <Card padding="0">
        {/* Header */}
        <div style={{
          display: "grid", gridTemplateColumns: "32px 1fr 140px 100px 100px 80px 36px",
          gap: 12, padding: "10px 20px",
          borderBottom: "1px solid var(--border)",
          fontSize: ".72rem", fontWeight: 500, letterSpacing: ".06em",
          textTransform: "uppercase", color: "var(--text-3)",
        }}>
          <div />
          <div>Task</div>
          <div>Project</div>
          <div>Priority</div>
          <div>Status</div>
          <div>Due</div>
          <div />
        </div>

        {filtered.length === 0 && (
          <div style={{ padding: "48px", textAlign: "center", color: "var(--text-3)", fontSize: ".88rem" }}>
            No tasks found.
          </div>
        )}

        {filtered.map((task, i) => (
          <div key={task.id} style={{
            display: "grid",
            gridTemplateColumns: "32px 1fr 140px 100px 100px 80px 36px",
            gap: 12, padding: "14px 20px",
            borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none",
            alignItems: "center",
            cursor: "pointer", transition: "background var(--t)",
            opacity: task.status === "Done" ? 0.6 : 1,
          }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--surface-2)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            onClick={() => setSelectedTask(task)}
          >
            {/* Checkbox */}
            <div
              onClick={e => { e.stopPropagation(); toggleDone(task.id); }}
              style={{
                width: 18, height: 18, borderRadius: 4, cursor: "pointer",
                border: `1.5px solid ${task.status === "Done" ? "var(--success)" : "var(--border-2)"}`,
                background: task.status === "Done" ? "var(--success)" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all var(--t)", flexShrink: 0,
              }}
            >
              {task.status === "Done" && <span style={{ color: "#fff", fontSize: ".65rem" }}>✓</span>}
            </div>

            {/* Title */}
            <div style={{
              fontSize: ".88rem", color: "var(--text)",
              textDecoration: task.status === "Done" ? "line-through" : "none",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>
              {task.title}
            </div>

            {/* Project */}
            <div style={{ fontSize: ".78rem", color: "var(--text-3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {task.project}
            </div>

            {/* Priority */}
            <div><Badge variant={PRIORITY_COLORS[task.priority]} size="sm">{task.priority}</Badge></div>

            {/* Status */}
            <div><Badge variant={STATUS_COLORS[task.status]} size="sm">{task.status}</Badge></div>

            {/* Due */}
            <div style={{ fontSize: ".78rem", color: "var(--text-3)" }}>{task.due}</div>

            {/* Options */}
            <div style={{ fontSize: "1rem", color: "var(--text-3)", textAlign: "center" }}>⋯</div>
          </div>
        ))}
      </Card>

      {/* Task Detail Modal */}
      <Modal
        open={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        title={selectedTask?.title || ""}
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setSelectedTask(null)}>Close</Button>
            <Button onClick={() => setSelectedTask(null)}>Save</Button>
          </>
        }
      >
        {selectedTask && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ display: "flex", gap: 10 }}>
              <Badge variant={PRIORITY_COLORS[selectedTask.priority]}>{selectedTask.priority}</Badge>
              <Badge variant={STATUS_COLORS[selectedTask.status]}>{selectedTask.status}</Badge>
            </div>
            <div>
              <label style={{ fontSize: ".72rem", fontWeight: 500, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--text-3)", display: "block", marginBottom: 6 }}>Project</label>
              <span style={{ fontSize: ".9rem", color: "var(--text-2)" }}>{selectedTask.project}</span>
            </div>
            <div>
              <label style={{ fontSize: ".72rem", fontWeight: 500, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--text-3)", display: "block", marginBottom: 6 }}>Description</label>
              <p style={{ fontSize: ".9rem", color: "var(--text-2)", lineHeight: 1.7 }}>{selectedTask.description}</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ fontSize: ".72rem", fontWeight: 500, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--text-3)", display: "block", marginBottom: 6 }}>Assignee</label>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Avatar name={selectedTask.assignee} size={26} />
                  <span style={{ fontSize: ".88rem", color: "var(--text)" }}>{selectedTask.assignee}</span>
                </div>
              </div>
              <div>
                <label style={{ fontSize: ".72rem", fontWeight: 500, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--text-3)", display: "block", marginBottom: 6 }}>Due Date</label>
                <span style={{ fontSize: ".88rem", color: "var(--text)" }}>{selectedTask.due}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
