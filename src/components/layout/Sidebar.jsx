import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { workspaceApi } from "../../api";
import Avatar from "../ui/Avatar";

const NAV_ITEMS = [
  { path: "/dashboard", icon: "⊞", label: "Dashboard" },
  { path: "/projects",  icon: "◈", label: "Projects" },
  { path: "/my-tasks",  icon: "✓", label: "My Tasks" },
  { path: "/members",   icon: "⊙", label: "Members" },
  { path: "/settings",  icon: "⚙", label: "Settings" },
];

export default function Sidebar() {
  const { user, logout, updateUser } = useAuth();
  const navigate                     = useNavigate();

  const [workspaces, setWorkspaces]       = useState([]);
  const [showWsDropdown, setShowWsDropdown] = useState(false);
  const [switching, setSwitching]         = useState(false);
  const dropdownRef                       = useRef(null);

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowWsDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const res = await workspaceApi.getMyWorkspaces();
      setWorkspaces(res.data);
    } catch {}
  };

  const handleSwitch = async (workspaceId) => {
    if (workspaceId === user?.workspaceId) { setShowWsDropdown(false); return; }
    setSwitching(true);
    try {
      const res   = await workspaceApi.switchWorkspace(workspaceId);
      const token = res.data;
      const ws    = workspaces.find(w => w.id === workspaceId);
      const newUser = {
        ...user,
        token,
        workspaceId,
        workspaceName: ws?.name || "",
        role: ws?.role === 0 ? "Owner" : ws?.role === 1 ? "Admin" : "Member",
      };
      localStorage.setItem("tf_token", token);
      localStorage.setItem("tf_user", JSON.stringify(newUser));
      updateUser(newUser);
      setShowWsDropdown(false);
      navigate("/dashboard");
    } catch {
    } finally {
      setSwitching(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const ROLE_LABELS = { 0: "Owner", 1: "Admin", 2: "Member" };

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
        padding: "20px 24px", borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, background: "var(--acc)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--fd)", fontSize: "1rem", fontWeight: 700, color: "#fff",
        }}>T</div>
        <span style={{ fontFamily: "var(--fd)", fontSize: "1.1rem", fontWeight: 600, color: "var(--text)" }}>
          TaskFlow
        </span>
      </div>

      {/* Workspace Switcher */}
      <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", position: "relative" }} ref={dropdownRef}>
        <div
          onClick={() => setShowWsDropdown(!showWsDropdown)}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "8px 10px", borderRadius: "var(--radius-sm)",
            cursor: "pointer", transition: "background var(--t)",
            background: showWsDropdown ? "var(--surface-2)" : "transparent",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--surface-2)"}
          onMouseLeave={e => { if (!showWsDropdown) e.currentTarget.style.background = "transparent"; }}
        >
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: "var(--teal-light)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: ".8rem", color: "var(--teal)", fontWeight: 600,
          }}>
            {user?.workspaceName?.[0] || "W"}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: ".82rem", fontWeight: 500, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user?.workspaceName || "My Workspace"}
            </div>
            <div style={{ fontSize: ".7rem", color: "var(--text-3)" }}>{user?.role}</div>
          </div>
          <span style={{ color: "var(--text-3)", fontSize: ".7rem", transition: "transform var(--t)", transform: showWsDropdown ? "rotate(180deg)" : "none" }}>⌄</span>
        </div>

        {/* Dropdown */}
        {showWsDropdown && (
          <div style={{
            position: "absolute", left: 12, right: 12, top: "100%",
            background: "var(--surface-2)", border: "1px solid var(--border-2)",
            borderRadius: "var(--radius)", zIndex: 200, overflow: "hidden",
            boxShadow: "0 8px 24px rgba(0,0,0,.3)",
          }}>
            <div style={{ padding: "8px 0" }}>
              <div style={{ padding: "6px 14px", fontSize: ".68rem", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--text-3)" }}>
                Your Workspaces
              </div>
              {workspaces.map(ws => (
                <div key={ws.id}
                  onClick={() => handleSwitch(ws.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "8px 14px", cursor: "pointer",
                    background: ws.id === user?.workspaceId ? "var(--acc-light)" : "transparent",
                    transition: "background var(--t)",
                  }}
                  onMouseEnter={e => { if (ws.id !== user?.workspaceId) e.currentTarget.style.background = "var(--border)"; }}
                  onMouseLeave={e => { if (ws.id !== user?.workspaceId) e.currentTarget.style.background = "transparent"; }}
                >
                  <div style={{
                    width: 24, height: 24, borderRadius: 4,
                    background: ws.id === user?.workspaceId ? "var(--acc)" : "var(--surface)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: ".72rem", color: ws.id === user?.workspaceId ? "#fff" : "var(--text-2)", fontWeight: 600,
                    flexShrink: 0,
                  }}>
                    {ws.name[0]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: ".82rem", color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ws.name}</div>
                    <div style={{ fontSize: ".68rem", color: "var(--text-3)" }}>{ROLE_LABELS[ws.role]}</div>
                  </div>
                  {ws.id === user?.workspaceId && (
                    <span style={{ color: "var(--acc)", fontSize: ".8rem" }}>✓</span>
                  )}
                </div>
              ))}
            </div>
            <div style={{ borderTop: "1px solid var(--border)", padding: "8px 0" }}>
              <div
                onClick={() => { setShowWsDropdown(false); navigate("/settings"); }}
                style={{
                  padding: "8px 14px", fontSize: ".8rem", color: "var(--text-2)",
                  cursor: "pointer", transition: "background var(--t)",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--border)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                + Create Workspace
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px", display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV_ITEMS.map(({ path, icon, label }) => (
          <NavLink key={path} to={path} style={({ isActive }) => ({
            display: "flex", alignItems: "center", gap: 10,
            padding: "9px 12px", borderRadius: "var(--radius-sm)",
            fontSize: ".85rem", fontWeight: isActive ? 500 : 400,
            color: isActive ? "var(--acc)" : "var(--text-2)",
            background: isActive ? "var(--acc-light)" : "transparent",
            textDecoration: "none", transition: "all var(--t)",
          })}
            onMouseEnter={e => {
              if (!e.currentTarget.getAttribute("aria-current"))
                e.currentTarget.style.background = "var(--surface-2)";
            }}
            onMouseLeave={e => {
              if (!e.currentTarget.getAttribute("aria-current"))
                e.currentTarget.style.background = "transparent";
            }}
          >
            <span style={{ fontSize: "1rem", width: 20, textAlign: "center" }}>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "8px 10px", borderRadius: "var(--radius-sm)",
        }}>
          <Avatar name={`${user?.firstName} ${user?.lastName}`} size={32} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: ".82rem", fontWeight: 500, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user?.firstName} {user?.lastName}
            </div>
            <div style={{ fontSize: ".72rem", color: "var(--text-3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user?.email}
            </div>
          </div>
          <button onClick={handleLogout} title="Sign out" style={{
            background: "none", border: "none", cursor: "pointer",
            color: "var(--text-3)", fontSize: ".9rem", padding: 4,
            borderRadius: "var(--radius-sm)", transition: "color var(--t)", flexShrink: 0,
          }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--danger)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--text-3)"}
          >↩</button>
        </div>
      </div>
    </aside>
  );
}