import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { workspaceApi } from "../api";
import { Button, Input } from "../components/ui";

export default function CreateWorkspacePage() {
  const navigate    = useNavigate();
  const { user, updateUser } = useAuth();
  const [name, setName]     = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  const handleCreate = async () => {
    if (!name.trim()) { setError("Workspace name is required."); return; }
    setLoading(true);
    setError("");
    try {
      await workspaceApi.createWorkspace(name);

      // Switch na novi workspace
      const wsRes = await workspaceApi.getMyWorkspaces();
      const newWs = wsRes.data.find(w => w.name === name) || wsRes.data[0];

      if (newWs) {
        const switchRes = await workspaceApi.switchWorkspace(newWs.id);
        const token     = switchRes.data;
        const newUser   = {
          ...user,
          token,
          workspaceId:   newWs.id,
          workspaceName: newWs.name,
          role:          "Owner",
        };
        localStorage.setItem("tf_token", token);
        localStorage.setItem("tf_user", JSON.stringify(newUser));
        updateUser(newUser);
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create workspace.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "var(--bg)", padding: 20,
    }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 48, justifyContent: "center" }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8, background: "var(--acc)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--fd)", fontSize: "1.1rem", fontWeight: 700, color: "#fff",
          }}>T</div>
          <span style={{ fontFamily: "var(--fd)", fontSize: "1.2rem", fontWeight: 600, color: "var(--text)" }}>
            TaskFlow
          </span>
        </div>

        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)", padding: "40px",
        }}>
          {/* Icon */}
          <div style={{
            width: 56, height: 56, borderRadius: 12,
            background: "var(--acc-light)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.6rem", margin: "0 auto 24px",
          }}>⊞</div>

          <h1 style={{
            fontFamily: "var(--fd)", fontSize: "1.8rem", fontWeight: 600,
            color: "var(--text)", marginBottom: 8, textAlign: "center",
          }}>
            Create your workspace
          </h1>
          <p style={{
            fontSize: ".85rem", color: "var(--text-3)", lineHeight: 1.7,
            marginBottom: 32, textAlign: "center",
          }}>
            A workspace is where you and your team collaborate on projects and tasks.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Input
              label="Workspace Name"
              placeholder="e.g. Acme Corp, My Team, Personal"
              value={name}
              onChange={e => setName(e.target.value)}
              hint="You can always change this later in Settings."
            />

            {error && (
              <div style={{
                background: "var(--danger-light)", border: "1px solid rgba(239,68,68,.2)",
                borderRadius: "var(--radius-sm)", padding: "10px 14px",
                fontSize: ".82rem", color: "var(--danger)",
              }}>
                {error}
              </div>
            )}

            <Button fullWidth size="lg" loading={loading} onClick={handleCreate}>
              Create Workspace
            </Button>

            <p style={{ textAlign: "center", fontSize: ".8rem", color: "var(--text-3)" }}>
              Hi, {user?.firstName}! You'll be the Owner of this workspace.
            </p>
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: ".8rem", color: "var(--text-3)", marginTop: 20 }}>
          Already have an invite?{" "}
          <span
            style={{ color: "var(--acc)", cursor: "pointer", textDecoration: "underline" }}
            onClick={() => navigate("/dashboard")}
          >
            Go to dashboard
          </span>
        </p>
      </div>
    </div>
  );
}