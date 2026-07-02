import { NavLink, useNavigate } from "react-router-dom";
import Avatar from "../ui/Avatar";

const NAV_ITEMS = [
  { path: "/dashboard", icon: "⊞", label: "Dashboard" },
  { path: "/projects",  icon: "◈", label: "Projects" },
  { path: "/my-tasks",  icon: "✓", label: "My Tasks" },
  { path: "/members",   icon: "⊙", label: "Members" },
  { path: "/settings",  icon: "⚙", label: "Settings" },
];

export default function Sidebar() {
  const navigate = useNavigate();

  // placeholder user
  const user = { firstName: "Alen", lastName: "Smrkovic", email: "alen@taskflow.com" };

  return (
    <aside style={{
      width: 240, minHeight: "100vh",
      background: "var(--surface)",
      borderRight: "1px solid var(--border)",
      display: "flex", flexDirection: "column",
      position: "fixed", left: 0, top: 0, bottom: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{
        padding: "20px 24px",
        borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: "var(--acc)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1rem", fontWeight: 700, color: "#fff",
        }}>
          T
        </div>
        <span style={{
          fontFamily: "var(--fd)", fontSize: "1.1rem",
          fontWeight: 600, color: "var(--text)",
        }}>
          TaskFlow
        </span>
      </div>

      {/* Workspace */}
      <div style={{
        padding: "12px 16px",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "8px 10px", borderRadius: "var(--radius-sm)",
          cursor: "pointer", transition: "background var(--t)",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--surface-2)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: "var(--teal-light)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: ".8rem", color: "var(--teal)", fontWeight: 600,
          }}>
            A
          </div>
          <div>
            <div style={{ fontSize: ".82rem", fontWeight: 500, color: "var(--text)" }}>
              Acme Corp
            </div>
            <div style={{ fontSize: ".7rem", color: "var(--text-3)" }}>Free plan</div>
          </div>
          <span style={{ marginLeft: "auto", color: "var(--text-3)", fontSize: ".7rem" }}>⌄</span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV_ITEMS.map(({ path, icon, label }) => (
          <NavLink
            key={path}
            to={path}
            style={({ isActive }) => ({
              display: "flex", alignItems: "center", gap: 10,
              padding: "9px 12px", borderRadius: "var(--radius-sm)",
              fontSize: ".85rem", fontWeight: isActive ? 500 : 400,
              color: isActive ? "var(--acc)" : "var(--text-2)",
              background: isActive ? "var(--acc-light)" : "transparent",
              textDecoration: "none",
              transition: "all var(--t)",
            })}
            onMouseEnter={e => {
              if (!e.currentTarget.classList.contains("active"))
                e.currentTarget.style.background = "var(--surface-2)";
            }}
            onMouseLeave={e => {
              if (!e.currentTarget.classList.contains("active"))
                e.currentTarget.style.background = "transparent";
            }}
          >
            <span style={{ fontSize: "1rem", width: 20, textAlign: "center" }}>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div style={{
        padding: "16px",
        borderTop: "1px solid var(--border)",
        display: "flex", alignItems: "center", gap: 10,
        cursor: "pointer",
      }}
        onMouseEnter={e => e.currentTarget.style.background = "var(--surface-2)"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      >
        <Avatar name={`${user.firstName} ${user.lastName}`} size={32} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: ".82rem", fontWeight: 500, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {user.firstName} {user.lastName}
          </div>
          <div style={{ fontSize: ".72rem", color: "var(--text-3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {user.email}
          </div>
        </div>
        <span style={{ color: "var(--text-3)", fontSize: ".8rem" }}>↩</span>
      </div>
    </aside>
  );
}