import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { workspaceApi } from "../api";
import { Button, Spinner } from "../components/ui";

export default function AcceptInvitationPage() {
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();
  const { user, updateUser } = useAuth();
  const token          = searchParams.get("token");

  const [status, setStatus]   = useState("idle");
  const [message, setMessage] = useState("");

  const handleAccept = async () => {
    setStatus("loading");
    try {
      await workspaceApi.acceptInvitation(token);

      // Refresh workspaces i switchiraj na novi
      const wsRes = await workspaceApi.getMyWorkspaces();
      if (wsRes.data.length > 0) {
        // Pronađi workspace koji nije trenutni
        const newWs = wsRes.data.find(w => w.id !== user?.workspaceId) || wsRes.data[0];
        if (newWs) {
          const switchRes = await workspaceApi.switchWorkspace(newWs.id);
          const newToken  = switchRes.data;
          const newUser   = {
            ...user,
            token:         newToken,
            workspaceId:   newWs.id,
            workspaceName: newWs.name,
            role:          newWs.role === 0 ? "Owner" : newWs.role === 1 ? "Admin" : "Member",
          };
          localStorage.setItem("tf_token", newToken);
          localStorage.setItem("tf_user", JSON.stringify(newUser));
          updateUser(newUser);
        }
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setMessage(err.response?.data?.message || "Invalid or expired invitation.");
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "var(--bg)", padding: 20,
    }}>
      <div style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)", padding: "48px",
        width: "100%", maxWidth: 440, textAlign: "center",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32, justifyContent: "center" }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, background: "var(--acc)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--fd)", fontSize: "1rem", fontWeight: 700, color: "#fff",
          }}>T</div>
          <span style={{ fontFamily: "var(--fd)", fontSize: "1.1rem", fontWeight: 600, color: "var(--text)" }}>
            TaskFlow
          </span>
        </div>

        {status === "idle" && (
          <>
            <div style={{
              width: 56, height: 56, borderRadius: 12, background: "var(--acc-light)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.5rem", margin: "0 auto 24px",
            }}>✉</div>

            <h1 style={{ fontFamily: "var(--fd)", fontSize: "1.8rem", fontWeight: 600, color: "var(--text)", marginBottom: 12 }}>
              Workspace Invitation
            </h1>
            <p style={{ fontSize: ".88rem", color: "var(--text-3)", lineHeight: 1.7, marginBottom: 32 }}>
              You've been invited to join a workspace on TaskFlow.
            </p>

            {user ? (
              // Ulogovan — može odmah prihvatiti
              <Button fullWidth size="lg" onClick={handleAccept}>
                Accept Invitation
              </Button>
            ) : (
              // Nije ulogovan — mora se ulogovati ili registrovati
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <p style={{ fontSize: ".82rem", color: "var(--text-3)", marginBottom: 8 }}>
                  Sign in or create an account to accept this invitation.
                </p>
                <Button fullWidth size="lg" onClick={() => navigate(`/login?redirect=/accept-invitation?token=${token}`)}>
                  Sign in
                </Button>
                <Button fullWidth variant="secondary" onClick={() => navigate(`/register?redirect=/accept-invitation?token=${token}`)}>
                  Create Account
                </Button>
              </div>
            )}
          </>
        )}

        {status === "loading" && (
          <>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              <Spinner size={32} />
            </div>
            <p style={{ color: "var(--text-3)" }}>Accepting invitation...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "var(--success-light)", border: "1px solid rgba(16,185,129,.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.5rem", margin: "0 auto 20px",
            }}>✓</div>
            <h2 style={{ fontFamily: "var(--fd)", fontSize: "1.5rem", fontWeight: 600, color: "var(--text)", marginBottom: 12 }}>
              Welcome to the team!
            </h2>
            <p style={{ fontSize: ".88rem", color: "var(--text-3)", marginBottom: 24 }}>
              You've successfully joined the workspace.
            </p>
            <Button fullWidth onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
          </>
        )}

        {status === "error" && (
          <>
            <div style={{
              width: 56, height: 56, borderRadius: "50%",
              background: "var(--danger-light)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.5rem", margin: "0 auto 20px",
            }}>✕</div>
            <h2 style={{ fontFamily: "var(--fd)", fontSize: "1.5rem", fontWeight: 600, color: "var(--danger)", marginBottom: 12 }}>
              Invitation Failed
            </h2>
            <p style={{ fontSize: ".88rem", color: "var(--text-3)", marginBottom: 24 }}>{message}</p>
            <Button fullWidth variant="secondary" onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
          </>
        )}
      </div>
    </div>
  );
}