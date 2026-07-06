import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  DndContext, DragOverlay, PointerSensor, useSensor, useSensors, closestCorners,
} from "@dnd-kit/core";
import {
  SortableContext, verticalListSortingStrategy, useSortable, arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TopBar from "../components/layout/TopBar";
import { Badge, Avatar, Button, Modal, Input, Card } from "../components/ui";

const COLUMNS = ["Todo", "In Progress", "Review", "Done"];

const INITIAL_TASKS = [
  { id: "1", title: "Design new onboarding flow",    description: "Create wireframes and prototypes for the new user onboarding experience.", column: "In Progress", priority: "High",     assignee: "Alen S",  due: "Jul 5" },
  { id: "2", title: "Fix authentication bug",         description: "Users are getting logged out randomly. Investigate and fix the JWT issue.", column: "Todo",        priority: "Critical", assignee: "Sara M",  due: "Jul 3" },
  { id: "3", title: "Write API documentation",        description: "Document all REST endpoints using Swagger.", column: "In Progress", priority: "Medium",   assignee: "John D",  due: "Jul 8" },
  { id: "4", title: "Review pull requests",           description: "Review and merge open PRs from the team.", column: "Todo",        priority: "Low",      assignee: "Alen S",  due: "Jul 4" },
  { id: "5", title: "Update dependencies",            description: "Update all npm packages to latest stable versions.", column: "Review",      priority: "Medium",   assignee: "Mike R",  due: "Jul 6" },
  { id: "6", title: "Setup CI/CD pipeline",           description: "Configure GitHub Actions for automated testing and deployment.", column: "Done",        priority: "High",     assignee: "Sara M",  due: "Jun 30" },
  { id: "7", title: "Database schema migration",      description: "Migrate from old schema to new normalized structure.", column: "Done",        priority: "High",     assignee: "John D",  due: "Jun 28" },
  { id: "8", title: "User testing session",           description: "Conduct user testing with 5 participants and document findings.", column: "Todo",        priority: "Medium",   assignee: "Amy K",   due: "Jul 10" },
];

const PRIORITY_COLORS = { Low: "default", Medium: "warning", High: "danger", Critical: "danger" };

const COLUMN_COLORS = {
  "Todo":        "var(--text-3)",
  "In Progress": "var(--acc)",
  "Review":      "var(--teal)",
  "Done":        "var(--success)",
};

function TaskCard({ task, onClick, isDragging }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div
        onClick={onClick}
        style={{
          background: "var(--surface-2)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: "14px 16px",
          cursor: "pointer",
          transition: "border-color var(--t), transform var(--t)",
          marginBottom: 8,
          userSelect: "none",
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-2)"}
        onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
      >
        <div style={{ fontSize: ".88rem", color: "var(--text)", marginBottom: 10, lineHeight: 1.4 }}>
          {task.title}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Badge variant={PRIORITY_COLORS[task.priority]} size="sm">{task.priority}</Badge>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: ".72rem", color: "var(--text-3)" }}>{task.due}</span>
            <Avatar name={task.assignee} size={22} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Column({ id, tasks, onTaskClick, onAddTask }) {
  return (
    <div style={{
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
      padding: "16px",
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      gap: 0,
    }}>
      {/* Column Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLUMN_COLORS[id] }} />
          <span style={{ fontSize: ".82rem", fontWeight: 600, color: "var(--text)", letterSpacing: ".02em" }}>{id}</span>
          <span style={{
            fontSize: ".7rem", background: "var(--surface-2)", color: "var(--text-3)",
            padding: "2px 7px", borderRadius: 10, fontWeight: 500,
          }}>
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAddTask(id)}
          style={{
            background: "none", border: "none", color: "var(--text-3)",
            cursor: "pointer", fontSize: "1.1rem", lineHeight: 1,
            padding: 2, borderRadius: 4, transition: "color var(--t)",
          }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--text)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--text-3)"}
        >
          +
        </button>
      </div>

      {/* Tasks */}
      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div style={{ flex: 1, minHeight: 60 }}>
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
          ))}
        </div>
      </SortableContext>

      {tasks.length === 0 && (
        <div style={{
          border: "1.5px dashed var(--border)", borderRadius: "var(--radius)",
          padding: "20px", textAlign: "center",
          fontSize: ".78rem", color: "var(--text-3)",
        }}>
          No tasks
        </div>
      )}
    </div>
  );
}

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [tasks, setTasks]           = useState(INITIAL_TASKS);
  const [activeTask, setActiveTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addToColumn, setAddToColumn]   = useState("Todo");

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const getTasksByColumn = (col) => tasks.filter(t => t.column === col);

  const handleDragStart = ({ active }) => {
    setActiveTask(tasks.find(t => t.id === active.id));
  };

  const handleDragOver = ({ active, over }) => {
    if (!over) return;
    const activeCol = tasks.find(t => t.id === active.id)?.column;
    const overCol   = COLUMNS.includes(over.id) ? over.id : tasks.find(t => t.id === over.id)?.column;
    if (!activeCol || !overCol || activeCol === overCol) return;
    setTasks(prev => prev.map(t => t.id === active.id ? { ...t, column: overCol } : t));
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveTask(null);
    if (!over) return;
    const activeCol = tasks.find(t => t.id === active.id)?.column;
    const overCol   = COLUMNS.includes(over.id) ? over.id : tasks.find(t => t.id === over.id)?.column;
    if (activeCol !== overCol) return;
    const colTasks  = getTasksByColumn(activeCol);
    const oldIdx    = colTasks.findIndex(t => t.id === active.id);
    const newIdx    = colTasks.findIndex(t => t.id === over.id);
    if (oldIdx !== newIdx) {
      const reordered = arrayMove(colTasks, oldIdx, newIdx);
      setTasks(prev => [
        ...prev.filter(t => t.column !== activeCol),
        ...reordered,
      ]);
    }
  };

  const handleAddTask = (column) => { setAddToColumn(column); setShowAddModal(true); };

  return (
    <>
      <TopBar
        title="Website Redesign"
        subtitle="Active · 8/12 tasks completed"
        actions={
          <div style={{ display: "flex", gap: 10 }}>
            <Button variant="secondary" size="sm">⚙ Settings</Button>
            <Button size="sm" onClick={() => handleAddTask("Todo")}>+ Add Task</Button>
          </div>
        }
      />

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, alignItems: "start" }}>
          {COLUMNS.map(col => (
            <Column
              key={col}
              id={col}
              tasks={getTasksByColumn(col)}
              onTaskClick={setSelectedTask}
              onAddTask={handleAddTask}
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
              <Badge variant={PRIORITY_COLORS[activeTask.priority]} size="sm">{activeTask.priority}</Badge>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Task Detail Modal */}
      <Modal
        open={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        title={selectedTask?.title || ""}
        size="lg"
        footer={
          <>
            <Button variant="danger" size="sm">Delete</Button>
            <Button variant="secondary" onClick={() => setSelectedTask(null)}>Close</Button>
            <Button onClick={() => setSelectedTask(null)}>Save Changes</Button>
          </>
        }
      >
        {selectedTask && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", gap: 12 }}>
              <Badge variant={PRIORITY_COLORS[selectedTask.priority]}>{selectedTask.priority}</Badge>
              <Badge variant="accent">{selectedTask.column}</Badge>
            </div>
            <div>
              <label style={{ fontSize: ".75rem", fontWeight: 500, letterSpacing: ".04em", textTransform: "uppercase", color: "var(--text-2)", display: "block", marginBottom: 8 }}>
                Description
              </label>
              <p style={{ fontSize: ".9rem", color: "var(--text-2)", lineHeight: 1.7 }}>
                {selectedTask.description}
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ fontSize: ".75rem", fontWeight: 500, letterSpacing: ".04em", textTransform: "uppercase", color: "var(--text-2)", display: "block", marginBottom: 8 }}>
                  Assignee
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Avatar name={selectedTask.assignee} size={28} />
                  <span style={{ fontSize: ".88rem", color: "var(--text)" }}>{selectedTask.assignee}</span>
                </div>
              </div>
              <div>
                <label style={{ fontSize: ".75rem", fontWeight: 500, letterSpacing: ".04em", textTransform: "uppercase", color: "var(--text-2)", display: "block", marginBottom: 8 }}>
                  Due Date
                </label>
                <span style={{ fontSize: ".88rem", color: "var(--text)" }}>{selectedTask.due}</span>
              </div>
            </div>

            {/* Comments placeholder */}
            <div>
              <label style={{ fontSize: ".75rem", fontWeight: 500, letterSpacing: ".04em", textTransform: "uppercase", color: "var(--text-2)", display: "block", marginBottom: 12 }}>
                Comments
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { author: "Sara M", text: "I'll start working on this today.", time: "2h ago" },
                  { author: "John D", text: "Let me know if you need any help with the design.", time: "1h ago" },
                ].map((c, i) => (
                  <div key={i} style={{ display: "flex", gap: 10 }}>
                    <Avatar name={c.author} size={28} />
                    <div style={{
                      background: "var(--surface-2)", borderRadius: "var(--radius)",
                      padding: "10px 14px", flex: 1,
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontSize: ".8rem", fontWeight: 500, color: "var(--text)" }}>{c.author}</span>
                        <span style={{ fontSize: ".72rem", color: "var(--text-3)" }}>{c.time}</span>
                      </div>
                      <p style={{ fontSize: ".85rem", color: "var(--text-2)" }}>{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                <Avatar name="Alen S" size={28} />
                <Input placeholder="Write a comment..." fullWidth />
              </div>
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
            <Button onClick={() => setShowAddModal(false)}>Add Task</Button>
          </>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input label="Task Title" placeholder="e.g. Fix login bug" />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: ".75rem", fontWeight: 500, letterSpacing: ".04em", textTransform: "uppercase", color: "var(--text-2)" }}>Description</label>
            <textarea placeholder="Describe the task..." style={{
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
                <option>High</option>
                <option>Critical</option>
              </select>
            </div>
            <Input label="Due Date" type="date" />
          </div>
        </div>
      </Modal>
    </>
  );
}