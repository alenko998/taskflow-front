import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Input, Button } from "../components/ui";

export default function RegisterPage() {
  const navigate         = useNavigate();
  const { register }     = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [step, setStep]       = useState(1);
  const [success, setSuccess] = useState(false);
  const [form, setForm]       = useState({
    firstName: "", lastName: "", email: "",
    password: "", confirmPassword: "",
  });

  const handle = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleStep1 = () => {
    if (!form.firstName || !form.lastName || !form.email) { setError("Please fill in all fields."); return; }
    if (!form.email.includes("@")) { setError("Please enter a valid email."); return; }
    setError("");
    setStep(2);
  };

  const handleStep2 = async () => {
    if (!form.password || !form.confirmPassword) { setError("Please fill in all fields."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (form.password !== form.confirmPassword) { setError("Passwords do not match."); return; }
    setLoading(true);
    setError("");
    try {
      await register(form);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
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

        {!success && (
          <>
            {/* Step indicator */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: 36 }}>
              {[1, 2].map((s, i) => (
                <div key={s} style={{ display: "flex", alignItems: "center", flex: i < 1 ? 1 : "auto" }}>
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
                  {i < 1 && (
                    <div style={{
                      flex: 1, height: 1.5,
                      background: step > s ? "var(--acc)" : "var(--border)",
                      transition: "background var(--t)",
                    }} />
                  )}
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 32 }}>
              {["Your info", "Password"].map((label, i) => (
                <span key={label} style={{
                  fontSize: ".72rem", fontWeight: step === i + 1 ? 600 : 400,
                  color: step === i + 1 ? "var(--text)" : "var(--text-3)",
                }}>
                  {label}
                </span>
              ))}
            </div>
          </>
        )}

        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)", padding: "32px",
        }}>
          {step === 1 && !success && (
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
                  <Input label="Last Name"  placeholder="Smrkovic" value={form.lastName} onChange={handle("lastName")} />
                </div>
                <Input label="Email" type="email" placeholder="you@company.com" value={form.email} onChange={handle("email")} />
                {error && <p style={{ fontSize: ".78rem", color: "var(--danger)" }}>{error}</p>}
                <Button fullWidth size="lg" onClick={handleStep1}>Continue →</Button>
              </div>
            </>
          )}

          {step === 2 && !success && (
            <>
              <h2 style={{ fontFamily: "var(--fd)", fontSize: "1.5rem", fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>
                Set your password
              </h2>
              <p style={{ fontSize: ".82rem", color: "var(--text-3)", marginBottom: 24 }}>
                Choose a strong password for your account.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <Input label="Password" type="password" placeholder="••••••••"
                  value={form.password} onChange={handle("password")} hint="At least 6 characters" />
                <Input label="Confirm Password" type="password" placeholder="••••••••"
                  value={form.confirmPassword} onChange={handle("confirmPassword")} />
                {error && <p style={{ fontSize: ".78rem", color: "var(--danger)" }}>{error}</p>}
                <div style={{ display: "flex", gap: 10 }}>
                  <Button variant="secondary" fullWidth onClick={() => { setStep(1); setError(""); }}>← Back</Button>
                  <Button fullWidth size="lg" loading={loading} onClick={handleStep2}>Create Account</Button>
                </div>
              </div>
            </>
          )}

          {success && (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "var(--success-light)", border: "1px solid rgba(16,185,129,.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.5rem", margin: "0 auto 20px",
              }}>✓</div>
              <h2 style={{ fontFamily: "var(--fd)", fontSize: "1.5rem", fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>
                Check your email!
              </h2>
              <p style={{ fontSize: ".85rem", color: "var(--text-3)", lineHeight: 1.7, marginBottom: 24 }}>
                We sent a verification link to <strong style={{ color: "var(--text)" }}>{form.email}</strong>.
                Click the link to activate your account, then sign in.
              </p>
              <Button fullWidth onClick={() => navigate("/login")}>Go to Sign in</Button>
            </div>
          )}
        </div>

        {!success && (
          <p style={{ textAlign: "center", fontSize: ".82rem", color: "var(--text-3)", marginTop: 20 }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--acc)", textDecoration: "none", fontWeight: 500 }}>
              Sign in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}