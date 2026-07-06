import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input, Button } from "../components/ui";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [step, setStep]       = useState(1);
  const [form, setForm]       = useState({
    firstName: "", lastName: "", email: "",
    password: "", confirmPassword: "", workspaceName: "",
  });

  const handle = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleStep1 = () => {
    if (!form.firstName || !form.lastName || !form.email) { setError("Please fill in all fields."); return; }
    if (!form.email.includes("@")) { setError("Please enter a valid email."); return; }
    setError("");
    setStep(2);
  };

  const handleStep2 = () => {
    if (!form.password || !form.confirmPassword) { setError("Please fill in all fields."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (form.password !== form.confirmPassword) { setError("Passwords do not match."); return; }
    setError("");
    setStep(3);
  };

  const handleStep3 = async () => {
    if (!form.workspaceName) { setError("Please enter a workspace name."); return; }
    setLoading(true);
    setError("");
    try {
      // TODO: connect to API
      await new Promise(r => setTimeout(r, 900));
      navigate("/dashboard");
    } catch {
      setError("Registration failed. Please try again.");
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
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40, justifyContent: "center" }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8, background: "var(--acc)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--fd)", fontSize: "1.1rem", fontWeight: 700, color: "#fff",
          }}>T</div>
          <span style={{ fontFamily: "var(--fd)", fontSize: "1.2rem", fontWeight: 600, color: "var(--text)" }}>
            TaskFlow
          </span>
        </div>

        {/* Step indicator */}
        <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 36 }}>
          {[1, 2, 3].map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", flex: i < 2 ? 1 : "auto" }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: ".75rem", fontWeight: 600,
                background: step >= s ? "var(--acc)" : "var(--surface-2)",
                color: step >= s ? "#fff" : "var(--text-3)",
                border: `1.5px solid ${step >= s ? "var(--acc)" : "var(--border-2)"}`,
                transition: "all var(--t)",
              }}>
                {step > s ? "✓" : s}
              </div>
              {i < 2 && (
                <div style={{
                  flex: 1, height: 1.5, marginLeft: 0,
                  background: step > s ? "var(--acc)" : "var(--border)",
                  transition: "background var(--t)",
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Step labels */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 32 }}>
          {["Your info", "Password", "Workspace"].map((label, i) => (
            <span key={label} style={{
              fontSize: ".72rem", fontWeight: step === i + 1 ? 600 : 400,
              color: step === i + 1 ? "var(--text)" : "var(--text-3)",
              transition: "color var(--t)",
            }}>
              {label}
            </span>
          ))}
        </div>

        {/* Card */}
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)", padding: "32px",
        }}>
          {step === 1 && (
            <>
              <h2 style={{ fontFamily: "var(--fd)", fontSize: "1.5rem", fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>
                Create your account
              </h2>
              <p style={{ fontSize: ".82rem", color: "var(--text-3)", marginBottom: 24 }}>
                Start managing your projects in minutes.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <Input label="First Name" placeholder="Alen" value={form.firstName} onChange={handle("firstName")} />
                  <Input label="Last Name"  placeholder="Smrkovic" value={form.lastName}  onChange={handle("lastName")} />
                </div>
                <Input label="Email" type="email" placeholder="you@company.com" value={form.email} onChange={handle("email")} />
                {error && <p style={{ fontSize: ".78rem", color: "var(--danger)" }}>{error}</p>}
                <Button fullWidth size="lg" onClick={handleStep1}>Continue →</Button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 style={{ fontFamily: "var(--fd)", fontSize: "1.5rem", fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>
                Set your password
              </h2>
              <p style={{ fontSize: ".82rem", color: "var(--text-3)", marginBottom: 24 }}>
                Choose a strong password for your account.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Input label="Password" type="password" placeholder="••••••••" value={form.password} onChange={handle("password")}
                  hint="At least 6 characters" />
                <Input label="Confirm Password" type="password" placeholder="••••••••" value={form.confirmPassword} onChange={handle("confirmPassword")} />
                {error && <p style={{ fontSize: ".78rem", color: "var(--danger)" }}>{error}</p>}
                <div style={{ display: "flex", gap: 10 }}>
                  <Button variant="secondary" fullWidth onClick={() => { setStep(1); setError(""); }}>← Back</Button>
                  <Button fullWidth size="lg" onClick={handleStep2}>Continue →</Button>
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 style={{ fontFamily: "var(--fd)", fontSize: "1.5rem", fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>
                Create your workspace
              </h2>
              <p style={{ fontSize: ".82rem", color: "var(--text-3)", marginBottom: 24 }}>
                A workspace is where you and your team collaborate.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Input
                  label="Workspace Name"
                  placeholder="Acme Corp"
                  value={form.workspaceName}
                  onChange={handle("workspaceName")}
                  hint="This will be the name of your team's workspace."
                />
                {error && <p style={{ fontSize: ".78rem", color: "var(--danger)" }}>{error}</p>}
                <div style={{ display: "flex", gap: 10 }}>
                  <Button variant="secondary" fullWidth onClick={() => { setStep(2); setError(""); }}>← Back</Button>
                  <Button fullWidth size="lg" loading={loading} onClick={handleStep3}>Create Account</Button>
                </div>
              </div>
            </>
          )}
        </div>

        <p style={{ textAlign: "center", fontSize: ".82rem", color: "var(--text-3)", marginTop: 20 }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--acc)", textDecoration: "none", fontWeight: 500 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
