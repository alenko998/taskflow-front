import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui";
import { projectsApi } from "../api";
import { isAdmin } from "../utils/roles";
import TopBar from "../components/layout/TopBar";
import { Card, Badge, Button, Modal, Input } from "../components/ui";

const STATUS_COLORS   = { 0: "accent", 1: "warning", 2: "success" };
const STATUS_LABELS   = { 0: "Active", 1: "On Hold", 2: "Completed" };
const PRIORITY_COLORS = { 0: "default", 1: "warning", 2: "danger", 3: "danger" };
const PRIORITY_LABELS = { 0: "Low", 1: "Medium", 2: "High", 3: "Critical" };
const STATUS_FILTERS  = ["All", "Active", "On Hold", "Completed"];

export default function ProjectsPage() {
  const navigate    = useNavigate();
  const { user }    = useAuth();
  const toast       = useToast();

  const [projects, setProjects]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState("All");
  const [search, setSearch]       = useState("");
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating]   = useState(false);
  const [form, setForm]           = useState({ name: "", description: "", priority: "2", deadline: "" });

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const res = await projectsApi.getProjects();
      setProjects(res.data);
    } catch {
      toast("Failed to load projects.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!form.name) { toast("Project name is required.", "error"); return; }
    setCreating(true);
    try {
      await projectsApi.createProject({
        name:        form.name,
        description: form.description,
        priority:    parseInt(form.priority),
        deadline:    form.deadline ? new Date(form.deadline).toISOString() : null,
      });
      toast("Project created!", "success");
      setShowModal(false);
      setForm({ name: "", description: "", priority: "2", deadline: "" });
      fetchProjects();
    } catch (err) {
      toast(err.response?.data?.message || "Failed to create project.", "error");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Delete this project?")) return;
    try {
      await projectsApi.deleteProject(id);
      toast("Project deleted.", "success");
      fetchProjects();
    } catch (err) {
      toast(err.response?.data?.message || "Failed to delete project.", "error");
    }
  };

  const filtered = projects.filter(p => {
    const statusLabel = STATUS_LABELS[p.status];
    const matchFilter = filter === "All" || statusLabel === filter;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <>
      <TopBar
        title="Projects"
        subtitle={`${projects.length} projects total`}
        actions={isAdmin(user) && (
          <Button onClick={() => setShowModal(true)}>+ New Project</Button>
        )}
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
            }}>{f}</button>
          ))}
        </div>
        <div style={{ flex: 1, maxWidth: 280 }}>
          <Input placeholder="Search projects..." value={search}
            onChange={e => setSearch(e.target.value)}
            icon={<span style={{ fontSize: ".85rem" }}>🔍</span>} />
        </div>
      </div>

      {loading && <p style={{ color: "var(--text-3)" }}>Loading projects...</p>}

      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-3)" }}>
          {projects.length === 0 ? "No projects yet. Create your first one!" : "No projects found."}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        {filtered.map(p => {
          const pct = p.taskCount > 0 ? Math.round((p.completedTaskCount / p.taskCount) * 100) : 0;
          return (
            <Card key={p.id} hover padding="22px"
              onClick={() => navigate(`/projects/${p.id}`)}
              style={{ cursor: "pointer", display: "flex", flexDirection: "column", gap: 16 }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                <div>
                  <div style={{ fontSize: ".95rem", fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>{p.name}</div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <Badge variant={STATUS_COLORS[p.status]} size="sm">{STATUS_LABELS[p.status]}</Badge>
                    <Badge variant={PRIORITY_COLORS[p.priority]} size="sm">{PRIORITY_LABELS[p.priority]}</Badge>
                  </div>
                </div>
                {isAdmin(user) && (
                  <button onClick={e => handleDelete(e, p.id)} style={{
                    background: "none", border: "none", color: "var(--text-3)",
                    cursor: "pointer", fontSize: "1.1rem", padding: 4,
                    borderRadius: 4, transition: "color var(--t)",
                  }}
                    onMouseEnter={e => e.currentTarget.style.color = "var(--danger)"}
                    onMouseLeave={e => e.currentTarget.style.color = "var(--text-3)"}
                  >🗑</button>
                )}
              </div>

              {p.description && (
                <p style={{
                  fontSize: ".82rem", color: "var(--text-2)", lineHeight: 1.6,
                  display: "-webkit-box", WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical", overflow: "hidden",
                }}>{p.description}</p>
              )}

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: ".75rem", color: "var(--text-3)" }}>{p.completedTaskCount}/{p.taskCount} tasks</span>
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

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: ".75rem", color: "var(--text-3)" }}>
                  {p.memberCount} member{p.memberCount !== 1 ? "s" : ""}
                </span>
                {p.deadline && (
                  <span style={{ fontSize: ".75rem", color: "var(--text-3)" }}>
                    Due {new Date(p.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* New Project Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Create New Project"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button loading={creating} onClick={handleCreate}>Create Project</Button>
          </>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input label="Project Name" placeholder="e.g. Website Redesign"
            value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: ".75rem", fontWeight: 500, letterSpacing: ".04em", textTransform: "uppercase", color: "var(--text-2)" }}>Description</label>
            <textarea placeholder="What is this project about?" value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              style={{
                background: "var(--surface-2)", border: "1px solid var(--border-2)",
                borderRadius: "var(--radius-sm)", color: "var(--text)",
                fontFamily: "var(--fb)", fontSize: ".9rem", padding: "10px 14px",
                resize: "vertical", minHeight: 80, outline: "none",
              }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: ".75rem", fontWeight: 500, letterSpacing: ".04em", textTransform: "uppercase", color: "var(--text-2)" }}>Priority</label>
              <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))} style={{
                background: "var(--surface-2)", border: "1px solid var(--border-2)",
                borderRadius: "var(--radius-sm)", color: "var(--text)",
                fontFamily: "var(--fb)", fontSize: ".9rem", padding: "10px 14px", outline: "none",
              }}>
                <option value="0">Low</option>
                <option value="1">Medium</option>
                <option value="2">High</option>
                <option value="3">Critical</option>
              </select>
            </div>
            <Input label="Deadline" type="date"
              value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))} />
          </div>
        </div>
      </Modal>
    </>
  );
}
