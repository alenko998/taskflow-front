import { useState } from "react";
import TopBar from "../components/layout/TopBar";
import { Card, Badge, Avatar, Button, Modal, Input } from "../components/ui";

const PROJECTS = [
  {
    id: 1, name: "Website Redesign", description: "Complete overhaul of the company website with new branding and improved UX.",
    status: "Active", priority: "High", tasks: 12, completed: 8,
    members: ["Alen S", "Sara M", "John D", "Amy K"],
    deadline: "Jul 30, 2026", createdAt: "Jun 1, 2026",
  },
  {
    id: 2, name: "Mobile App", description: "Cross-platform mobile application for iOS and Android using React Native.",
    status: "Active", priority: "Critical", tasks: 24, completed: 10,
    members: ["Alen S", "Mike R"],
    deadline: "Aug 15, 2026", createdAt: "May 15, 2026",
  },
  {
    id: 3, name: "Backend API", description: "RESTful API with .NET 10, Clean Architecture and PostgreSQL.",
    status: "Completed", priority: "High", tasks: 8, completed: 8,
    members: ["Sara M", "John D"],
    deadline: "Jun 30, 2026", createdAt: "Apr 1, 2026",
  },
  {
    id: 4, name: "Design System", description: "Component library and design tokens for all products.",
    status: "On Hold", priority: "Medium", tasks: 16, completed: 4,
    members: ["Amy K", "Alen S"],
    deadline: "Sep 1, 2026", createdAt: "Jun 10, 2026",
  },
  {
    id: 5, name: "Analytics Dashboard", description: "Real-time analytics and reporting dashboard for business intelligence.",
    status: "Active", priority: "Medium", tasks: 20, completed: 6,
    members: ["Mike R", "John D", "Sara M"],
    deadline: "Aug 30, 2026", createdAt: "Jun 20, 2026",
  },
  {
    id: 6, name: "CI/CD Pipeline", description: "Automated deployment pipeline with GitHub Actions and Docker.",
    status: "Active", priority: "Low", tasks: 6, completed: 2,
    members: ["Alen S"],
    deadline: "Jul 15, 2026", createdAt: "Jun 25, 2026",
  },
];

const STATUS_COLORS  = { Active: "accent", Completed: "success", "On Hold": "warning" };
const PRIORITY_COLORS = { Low: "default", Medium: "warning", High: "danger", Critical: "danger" };
const STATUS_FILTERS = ["All", "Active", "Completed", "On Hold"];

export default function ProjectsPage() {
  const [filter, setFilter]       = useState("All");
  const [search, setSearch]       = useState("");
  const [showModal, setShowModal] = useState(false);

  const filtered = PROJECTS.filter(p => {
    const matchFilter = filter === "All" || p.status === filter;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <>
      <TopBar
        title="Projects"
        subtitle={`${PROJECTS.length} projects total`}
        actions={<Button onClick={() => setShowModal(true)}>+ New Project</Button>}
      />

      {/* Filters + Search */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {STATUS_FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              fontFamily: "var(--fb)", fontSize: ".75rem", fontWeight: 500,
              letterSpacing: ".04em", padding: "7px 14px", borderRadius: "var(--radius-sm)",
              border: "1px solid", cursor: "pointer", transition: "all var(--t)",
              background: filter === f ? "var(--acc)" : "transparent",
              color: filter === f ? "#fff" : "var(--text-2)",
              borderColor: filter === f ? "var(--acc)" : "var(--border-2)",
            }}>
              {f}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, maxWidth: 280 }}>
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            icon={<span style={{ fontSize: ".85rem" }}>🔍</span>}
          />
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        {filtered.map(p => {
          const pct = Math.round((p.completed / p.tasks) * 100);
          return (
            <Card key={p.id} hover padding="22px" style={{ cursor: "pointer", display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Header */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                <div>
                  <div style={{ fontSize: ".95rem", fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>{p.name}</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Badge variant={STATUS_COLORS[p.status]} size="sm">{p.status}</Badge>
                    <Badge variant={PRIORITY_COLORS[p.priority]} size="sm">{p.priority}</Badge>
                  </div>
                </div>
                <button style={{
                  background: "none", border: "none", color: "var(--text-3)",
                  cursor: "pointer", fontSize: "1.1rem", padding: 4,
                }}>⋯</button>
              </div>

              {/* Description */}
              <p style={{
                fontSize: ".82rem", color: "var(--text-2)", lineHeight: 1.6,
                display: "-webkit-box", WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical", overflow: "hidden",
              }}>
                {p.description}
              </p>

              {/* Progress */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: ".75rem", color: "var(--text-3)" }}>{p.completed}/{p.tasks} tasks</span>
                  <span style={{ fontSize: ".75rem", color: "var(--text-2)", fontWeight: 500 }}>{pct}%</span>
                </div>
                <div style={{ height: 4, background: "var(--border)", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: `${pct}%`, borderRadius: 2,
                    background: pct === 100 ? "var(--success)" : "var(--acc)",
                    transition: "width .4s ease"
                  }} />
                </div>
              </div>

              {/* Footer */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex" }}>
                  {p.members.slice(0, 4).map((m, i) => (
                    <div key={m} style={{ marginLeft: i === 0 ? 0 : -8, border: "2px solid var(--surface)", borderRadius: "50%" }}>
                      <Avatar name={m} size={28} />
                    </div>
                  ))}
                  {p.members.length > 4 && (
                    <div style={{
                      marginLeft: -8, width: 28, height: 28, borderRadius: "50%",
                      background: "var(--surface-2)", border: "2px solid var(--surface)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: ".65rem", color: "var(--text-3)",
                    }}>
                      +{p.members.length - 4}
                    </div>
                  )}
                </div>
                <span style={{ fontSize: ".75rem", color: "var(--text-3)" }}>Due {p.deadline}</span>
              </div>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-3)" }}>
          No projects found.
        </div>
      )}

      {/* New Project Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Create New Project"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button onClick={() => setShowModal(false)}>Create Project</Button>
          </>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input label="Project Name" placeholder="e.g. Website Redesign" />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: ".75rem", fontWeight: 500, letterSpacing: ".04em", textTransform: "uppercase", color: "var(--text-2)" }}>
              Description
            </label>
            <textarea placeholder="What is this project about?" style={{
              background: "var(--surface-2)", border: "1px solid var(--border-2)",
              borderRadius: "var(--radius-sm)", color: "var(--text)",
              fontFamily: "var(--fb)", fontSize: ".9rem", padding: "10px 14px",
              resize: "vertical", minHeight: 80, outline: "none",
            }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: ".75rem", fontWeight: 500, letterSpacing: ".04em", textTransform: "uppercase", color: "var(--text-2)" }}>Priority</label>
              <select style={{
                background: "var(--surface-2)", border: "1px solid var(--border-2)",
                borderRadius: "var(--radius-sm)", color: "var(--text)",
                fontFamily: "var(--fb)", fontSize: ".9rem", padding: "10px 14px", outline: "none",
              }}>
                <option>Low</option>
                <option>Medium</option>
                <option selected>High</option>
                <option>Critical</option>
              </select>
            </div>
            <Input label="Deadline" type="date" />
          </div>
        </div>
      </Modal>
    </>
  );
}