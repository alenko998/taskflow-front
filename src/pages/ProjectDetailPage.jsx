import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  DndContext, DragOverlay, PointerSensor, useSensor, useSensors,
  closestCorners, useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext, verticalListSortingStrategy, useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui";
import { tasksApi } from "../api";
import TopBar from "../components/layout/TopBar";
import { Badge, Avatar, Button, Modal, Input } from "../components/ui";

const COLUMNS     = ["Todo", "In Progress", "Review", "Done"];
const STATUS_MAP  = { "Todo": 0, "In Progress": 1, "Review": 2, "Done": 3 };
const STATUS_RMAP = { 0: "Todo", 1: "In Progress", 2: "Review", 3: "Done" };

const PRIORITY_COLORS = { 0: "default", 1: "warning", 2: "danger", 3: "danger" };
const PRIORITY_LABELS = { 0: "Low", 1: "Medium", 2: "High", 3: "Critical" };

const COLUMN_COLORS = {
  "Todo":        "var(--text-3)",
  "In Progress": "var(--acc)",
  "Review":      "var(--teal)",
  "Done":        "var(--success)",
};

function TaskCard({ task, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });

  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} {...attributes} {...listeners}>
      <div onClick={onClick} style={{
        background: "var(--surface-2)", border: "1px solid var(--border)",
        borderRadius: "var(--radius)", padding: "14px 16px",
        cursor: "pointer", transition: "border-color var(--t)", marginBottom: 8,
        userSelect: "none",
      }}
        onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-2)"}
        onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
      >
        <div style={{ fontSize: ".88rem", color: "var(--text)", marginBottom: 10, lineHeight: 1.4 }}>
          {task.title}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Badge variant={PRIORITY_COLORS[task.priority]} size="sm">{PRIORITY_LABELS[task.priority]}</Badge>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {task.dueDate && (
              <span style={{ fontSize: ".72rem", color: "var(--text-3)" }}>
                {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            )}
            {task.assigneeName && <Avatar name={task.assigneeName} size={22} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function Column({ id, tasks, onTaskClick, onAddTask }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)", padding: "16px",
      minWidth: 0, display: "flex", flexDirection: "column",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLUMN_COLORS[id] }} />
          <span style={{ fontSize: ".82rem", fontWeight: 600, color: "var(--text)" }}>{id}</span>
          <span style={{
            fontSize: ".7rem", background: "var(--surface-2)", color: "var(--text-3)",
            padding: "2px 7px", borderRadius: 10, fontWeight: 500,
          }}>{tasks.length}</span>
        </div>
        <button onClick={() => onAddTask(id)} style={{
          background: "none", border: "none", color: "var(--text-3)",
          cursor: "pointer", fontSize: "1.1rem", lineHeight: 1, padding: 2,
          borderRadius: 4, transition: "color var(--t)",
        }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--text)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--text-3)"}
        >+</button>
      </div>

      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} style={{ flex: 1, minHeight: 80 }}>
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
          ))}
          {tasks.length === 0 && (
            <div style={{
              border: "1.5px dashed var(--border)", borderRadius: "var(--radius)",
              padding: "20px", textAlign: "center", fontSize: ".78rem", color: "var(--text-3)",
            }}>No tasks</div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

export default function ProjectDetailPage() {
  const { id }    = useParams();
  const { user }  = useAuth();
  const toast     = useToast();

  const [tasks, setTasks]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [activeTask, setActiveTask]     = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [creating, setCreating]         = useState(false);
  const [form, setForm]                 = useState({ title: "", description: "", priority: "2", dueDate: "" });

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  useEffect(() => { fetchTasks(); }, [id]);

  const fetchTasks = async () => {
    try {
      const res = await tasksApi.getTasks(id);
      setTasks(res.data);
    } catch {
      toast("Failed to load tasks.", "error");
    } finally {
      setLoading(false);
    }
  };

  const getTasksByColumn = (col) => tasks.filter(t => STATUS_RMAP[t.status] === col);

  const handleDragStart = ({ active }) => {
    setActiveTask(tasks.find(t => t.id === active.id));
  };

  const handleDragEnd = async ({ active, over }) => {
    setActiveTask(null);
    if (!over) return;

    const overCol = COLUMNS.includes(over.id)
      ? over.id
      : STATUS_RMAP[tasks.find(t => t.id === over.id)?.status];

    if (!overCol) return;

    const newStatus = STATUS_MAP[overCol];

    // Optimistički update
    setTasks(prev => prev.map(t =>
      t.id === active.id ? { ...t, status: newStatus } : t
    ));

    try {
      await tasksApi.updateStatus(active.id, newStatus);
      toast("Status updated!", "success");
    } catch {
      toast("Failed to update status.", "error");
      fetchTasks();
    }
  };

  const handleCreate = async () => {
    if (!form.title) { toast("Task title is required.", "error"); return; }
    setCreating(true);
    try {
      await tasksApi.createTask(id, {
        title:       form.title,
        description: form.description,
        priority:    parseInt(form.priority),
        dueDate:     form.dueDate ? new Date(form.dueDate).toISOString() : null,
        projectId:   id,
      });
      toast("Task created!", "success");
      setShowAddModal(false);
      setForm({ title: "", description: "", priority: "2", dueDate: "" });
      fetchTasks();
    } catch (err) {
      toast(err.response?.data?.message || "Failed to create task.", "error");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await tasksApi.deleteTask(taskId);
      toast("Task deleted.", "success");
      setSelectedTask(null);
      fetchTasks();
    } catch (err) {
      toast(err.response?.data?.message || "Failed to delete task.", "error");
    }
  };

  return (
    <>
      <TopBar
        title="Project"
        subtitle={`${tasks.length} tasks total`}
        actions={<Button size="sm" onClick={() => setShowAddModal(true)}>+ Add Task</Button>}
      />

      {loading && <p style={{ color: "var(--text-3)" }}>Loading tasks...</p>}

      {!loading && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, alignItems: "start" }}>
            {COLUMNS.map(col => (
              <Column
                key={col} id={col}
                tasks={getTasksByColumn(col)}
                onTaskClick={setSelectedTask}
                onAddTask={() => setShowAddModal(true)}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTask && (
              <div style={{
                background: "var(--surface-2)", border: "1px solid var(--acc)",
                borderRadius: "var(--radius)", padding: "14px 16px",
                boxShadow: "0 8px 32px rgba(0,0,0,.4)", opacity: .95,
              }}>
                <div style={{ fontSize: ".88rem", color: "var(--text)", marginBottom: 10 }}>{activeTask.title}</div>
                <Badge variant={PRIORITY_COLORS[activeTask.priority]} size="sm">{PRIORITY_LABELS[activeTask.priority]}</Badge>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      )}

      {/* Task Detail Modal */}
      <Modal
        open={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        title={selectedTask?.title || ""}
        size="lg"
        footer={
          <div style={{ display: "flex", gap: 10, width: "100%", justifyContent: "space-between" }}>
            <div>
              {selectedTask?.createdById === user?.userId && (
                <Button variant="danger" size="sm" onClick={() => handleDeleteTask(selectedTask.id)}>
                  Delete
                </Button>
              )}
            </div>
            <Button variant="secondary" onClick={() => setSelectedTask(null)}>Close</Button>
          </div>
        }
      >
        {selectedTask && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", gap: 12 }}>
              <Badge variant={PRIORITY_COLORS[selectedTask.priority]}>{PRIORITY_LABELS[selectedTask.priority]}</Badge>
              <Badge variant="accent">{STATUS_RMAP[selectedTask.status]}</Badge>
            </div>
            {selectedTask.description && (
              <div>
                <label style={{ fontSize: ".75rem", fontWeight: 500, letterSpacing: ".04em", textTransform: "uppercase", color: "var(--text-2)", display: "block", marginBottom: 8 }}>Description</label>
                <p style={{ fontSize: ".9rem", color: "var(--text-2)", lineHeight: 1.7 }}>{selectedTask.description}</p>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ fontSize: ".75rem", fontWeight: 500, letterSpacing: ".04em", textTransform: "uppercase", color: "var(--text-2)", display: "block", marginBottom: 8 }}>Created by</label>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Avatar name={selectedTask.createdByName} size={28} />
                  <span style={{ fontSize: ".88rem", color: "var(--text)" }}>{selectedTask.createdByName}</span>
                </div>
              </div>
              {selectedTask.dueDate && (
                <div>
                  <label style={{ fontSize: ".75rem", fontWeight: 500, letterSpacing: ".04em", textTransform: "uppercase", color: "var(--text-2)", display: "block", marginBottom: 8 }}>Due Date</label>
                  <span style={{ fontSize: ".88rem", color: "var(--text)" }}>
                    {new Date(selectedTask.dueDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Add Task Modal */}
      <Modal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Task"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button loading={creating} onClick={handleCreate}>Add Task</Button>
          </>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input label="Task Title" placeholder="e.g. Fix login bug"
            value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: ".75rem", fontWeight: 500, letterSpacing: ".04em", textTransform: "uppercase", color: "var(--text-2)" }}>Description</label>
            <textarea placeholder="Describe the task..." value={form.description}
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
            <Input label="Due Date" type="date"
              value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} />
          </div>
        </div>
      </Modal>
    </>
  );
}