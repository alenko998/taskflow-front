import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { workspaceApi } from "../api";
import { Button, Spinner } from "../components/ui";

export default function AcceptInvitationPage() {
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();
  const { user }       = useAuth();
  const token          = searchParams.get("token");

  const [status, setStatus]   = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  const handleAccept = async () => {
    if (!user) { navigate(`/login?redirect=/accept-invitation?token=${token}`); return; }
    setStatus("loading");
    try {
      await workspaceApi.acceptInvitation(token);
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
        <div style={{
          width: 56, height: 56, borderRadius: 12, background: "var(--acc-light)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.5rem", margin: "0 auto 24px",
        }}>⊙</div>

        {status === "idle" && (
          <>
            <h1 style={{ fontFamily: "var(--fd)", fontSize: "1.8rem", fontWeight: 600, color: "var(--text)", marginBottom: 12 }}>
              Workspace Invitation
            </h1>
            <p style={{ fontSize: ".88rem", color: "var(--text-3)", lineHeight: 1.7, marginBottom: 32 }}>
              You've been invited to join a workspace on TaskFlow.
              {!user && " Please sign in first to accept."}
            </p>
            {user ? (
              <Button fullWidth onClick={handleAccept}>Accept Invitation</Button>
            ) : (
              <Button fullWidth onClick={() => navigate(`/login`)}>Sign in to Accept</Button>
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