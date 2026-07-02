import { useState } from "react";
import TopBar from "../components/layout/TopBar";
import { Card, Badge, Avatar, Button } from "../components/ui";

const STATS = [
  { label: "Total Projects", value: 12, change: "+2 this month",  color: "var(--acc)",     icon: "◈" },
  { label: "Active Tasks",   value: 34, change: "+8 this week",   color: "var(--teal)",    icon: "✓" },
  { label: "Completed",      value: 89, change: "this month",     color: "var(--success)", icon: "⊙" },
  { label: "Overdue",        value: 3,  change: "needs attention", color: "var(--danger)",  icon: "⚠" },
];

const MY_TASKS = [
  { id: 1, title: "Design new onboarding flow",     project: "Website Redesign", priority: "High",   status: "In Progress", due: "Jul 5" },
  { id: 2, title: "Fix authentication bug",          project: "Mobile App",       priority: "Critical",status: "Todo",        due: "Jul 3" },
  { id: 3, title: "Write API documentation",         project: "Backend API",      priority: "Medium", status: "In Progress", due: "Jul 8" },
  { id: 4, title: "Review pull requests",            project: "Mobile App",       priority: "Low",    status: "Todo",        due: "Jul 4" },
  { id: 5, title: "Update dependencies",             project: "Website Redesign", priority: "Medium", status: "Review",      due: "Jul 6" },
];

const RECENT_PROJECTS = [
  { id: 1, name: "Website Redesign", tasks: 12, completed: 8,  members: ["Alen S", "Sara M", "John D"], status: "Active" },
  { id: 2, name: "Mobile App",       tasks: 24, completed: 10, members: ["Alen S", "Mike R"],            status: "Active" },
  { id: 3, name: "Backend API",      tasks: 8,  completed: 8,  members: ["Sara M", "John D", "Amy K"],   status: "Completed" },
];

const PRIORITY_COLORS = {
  Low:      "default",
  Medium:   "warning",
  High:     "danger",
  Critical: "danger",
};

const STATUS_COLORS = {
  Todo:        "default",
  "In Progress": "accent",
  Review:      "teal",
  Done:        "success",
};

export default function DashboardPage() {
  return (
    <>
      <TopBar
        title="Dashboard"
        subtitle="Welcome back, Alen 👋"
        actions={<Button size="sm">+ New Task</Button>}
      />

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        {STATS.map(s => (
          <Card key={s.label} padding="20px">
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: "1.2rem" }}>{s.icon}</span>
              <span style={{ fontSize: "1.8rem", fontWeight: 600, color: s.color, fontFamily: "var(--fd)" }}>
                {s.value}
              </span>
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
            padding: "18px 24px",
            borderBottom: "1px solid var(--border)",
            display: "flex", alignItems: "center", justifyContent: "space-between"
          }}>
            <h3 style={{ fontFamily: "var(--fd)", fontSize: "1rem", fontWeight: 600, color: "var(--text)" }}>
              My Tasks
            </h3>
            <Button variant="ghost" size="sm">View all</Button>
          </div>
          <div>
            {MY_TASKS.map((task, i) => (
              <div key={task.id} style={{
                padding: "14px 24px",
                borderBottom: i < MY_TASKS.length - 1 ? "1px solid var(--border)" : "none",
                display: "flex", alignItems: "center", gap: 12,
                cursor: "pointer", transition: "background var(--t)",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--surface-2)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <div style={{
                  width: 16, height: 16, border: "1.5px solid var(--border-2)",
                  borderRadius: 4, flexShrink: 0,
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: ".88rem", color: "var(--text)", marginBottom: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {task.title}
                  </div>
                  <div style={{ fontSize: ".75rem", color: "var(--text-3)" }}>{task.project}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  <Badge variant={PRIORITY_COLORS[task.priority]} size="sm">{task.priority}</Badge>
                  <Badge variant={STATUS_COLORS[task.status]} size="sm">{task.status}</Badge>
                  <span style={{ fontSize: ".75rem", color: "var(--text-3)", minWidth: 36 }}>{task.due}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Projects */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h3 style={{ fontFamily: "var(--fd)", fontSize: "1rem", fontWeight: 600, color: "var(--text)" }}>
              Recent Projects
            </h3>
            <Button variant="ghost" size="sm">View all</Button>
          </div>

          {RECENT_PROJECTS.map(p => {
            const pct = Math.round((p.completed / p.tasks) * 100);
            return (
              <Card key={p.id} hover padding="18px" style={{ cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ fontSize: ".9rem", fontWeight: 500, color: "var(--text)" }}>{p.name}</div>
                  <Badge variant={p.status === "Active" ? "accent" : "success"} size="sm">{p.status}</Badge>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: ".75rem", color: "var(--text-3)" }}>{p.completed}/{p.tasks} tasks</span>
                    <span style={{ fontSize: ".75rem", color: "var(--text-2)", fontWeight: 500 }}>{pct}%</span>
                  </div>
                  <div style={{ height: 4, background: "var(--border)", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: "var(--acc)", borderRadius: 2, transition: "width .4s ease" }} />
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: -6 }}>
                  {p.members.map((m, i) => (
                    <div key={m} style={{ marginLeft: i === 0 ? 0 : -8, border: "2px solid var(--surface)" , borderRadius: "50%" }}>
                      <Avatar name={m} size={26} />
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </>
  );
}