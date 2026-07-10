import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyEmail } from "../api/auth";
import { Button, Spinner } from "../components/ui";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();
  const userId         = searchParams.get("userId");
  const token          = searchParams.get("token");

  const [status, setStatus]   = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      if (!userId || !token) {
        setStatus("error");
        setMessage("Invalid verification link.");
        return;
      }
      try {
        await verifyEmail(userId, token);
        setStatus("success");
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.message || "Invalid or expired verification link.");
      }
    };
    verify();
  }, []);

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

        {status === "loading" && (
          <>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              <Spinner size={36} />
            </div>
            <p style={{ color: "var(--text-3)", fontSize: ".9rem" }}>Verifying your email...</p>
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
            <h2 style={{ fontFamily: "var(--fd)", fontSize: "1.5rem", fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>
              Email Verified!
            </h2>
            <p style={{ fontSize: ".88rem", color: "var(--text-3)", lineHeight: 1.7, marginBottom: 24 }}>
              Your email has been verified. You can now sign in.
            </p>
            <Button fullWidth onClick={() => navigate("/login")}>Sign in</Button>
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
            <h2 style={{ fontFamily: "var(--fd)", fontSize: "1.5rem", fontWeight: 600, color: "var(--danger)", marginBottom: 8 }}>
              Verification Failed
            </h2>
            <p style={{ fontSize: ".88rem", color: "var(--text-3)", lineHeight: 1.7, marginBottom: 24 }}>
              {message}
            </p>
            <Button fullWidth variant="secondary" onClick={() => navigate("/login")}>Go to Sign in</Button>
          </>
        )}
      </div>
    </div>
  );
}