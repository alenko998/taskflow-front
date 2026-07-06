import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input, Button } from "../components/ui";

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [form, setForm]       = useState({ email: "", password: "" });

  const handle = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.email || !form.password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    setError("");
    try {
      // TODO: connect to API
      await new Promise(r => setTimeout(r, 800));
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      background: "var(--bg)",
    }}>
      {/* Left panel */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px",
      }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 48 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8, background: "var(--acc)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--fd)", fontSize: "1.1rem", fontWeight: 700, color: "#fff",
            }}>T</div>
            <span style={{ fontFamily: "var(--fd)", fontSize: "1.2rem", fontWeight: 600, color: "var(--text)" }}>
              TaskFlow
            </span>
          </div>

          <h1 style={{
            fontFamily: "var(--fd)", fontSize: "2rem", fontWeight: 600,
            color: "var(--text)", marginBottom: 8,
          }}>
            Welcome back
          </h1>
          <p style={{ fontSize: ".88rem", color: "var(--text-3)", marginBottom: 32 }}>
            Sign in to your account to continue
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Input
              label="Email"
              type="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={handle("email")}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handle("password")}
            />

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Link to="/forgot-password" style={{ fontSize: ".78rem", color: "var(--acc)", textDecoration: "none" }}>
                Forgot password?
              </Link>
            </div>

            {error && (
              <div style={{
                background: "var(--danger-light)", border: "1px solid rgba(239,68,68,.2)",
                borderRadius: "var(--radius-sm)", padding: "10px 14px",
                fontSize: ".82rem", color: "var(--danger)",
              }}>
                {error}
              </div>
            )}

            <Button fullWidth loading={loading} onClick={handleSubmit} size="lg">
              Sign in
            </Button>

            <p style={{ textAlign: "center", fontSize: ".82rem", color: "var(--text-3)" }}>
              Don't have an account?{" "}
              <Link to="/register" style={{ color: "var(--acc)", textDecoration: "none", fontWeight: 500 }}>
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={{
        width: 480, background: "var(--surface)",
        borderLeft: "1px solid var(--border)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: 48,
      }}>
        {/* Feature highlights */}
        <div style={{ width: "100%", maxWidth: 340 }}>
          <h2 style={{
            fontFamily: "var(--fd)", fontSize: "1.6rem", fontWeight: 600,
            color: "var(--text)", marginBottom: 8, lineHeight: 1.2,
          }}>
            Manage projects with your team
          </h2>
          <p style={{ fontSize: ".85rem", color: "var(--text-3)", marginBottom: 40, lineHeight: 1.7 }}>
            TaskFlow helps your team stay organized, ship faster, and collaborate better.
          </p>

          {[
            { icon: "◈", title: "Projects & Tasks",   desc: "Organize work into projects with kanban boards and task lists." },
            { icon: "⊙", title: "Team Collaboration",  desc: "Assign tasks, add comments, and keep everyone in sync." },
            { icon: "⊞", title: "Real-time Dashboard", desc: "Track progress, deadlines, and team performance at a glance." },
          ].map(f => (
            <div key={f.title} style={{ display: "flex", gap: 14, marginBottom: 24 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8, background: "var(--acc-light)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1rem", color: "var(--acc)", flexShrink: 0,
              }}>
                {f.icon}
              </div>
              <div>
                <div style={{ fontSize: ".88rem", fontWeight: 600, color: "var(--text)", marginBottom: 2 }}>{f.title}</div>
                <div style={{ fontSize: ".78rem", color: "var(--text-3)", lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            </div>
          ))}

          {/* Avatars */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 40, paddingTop: 32, borderTop: "1px solid var(--border)" }}>
            <div style={{ display: "flex" }}>
              {["Alen S", "Sara M", "John D", "Amy K"].map((n, i) => (
                <div key={n} style={{
                  marginLeft: i === 0 ? 0 : -8,
                  width: 32, height: 32, borderRadius: "50%",
                  border: "2px solid var(--surface)",
                  background: ["#6C63FF","#00D4AA","#F59E0B","#EF4444"][i],
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: ".65rem", fontWeight: 600, color: "#fff",
                }}>
                  {n[0]}
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: ".78rem", fontWeight: 500, color: "var(--text)" }}>Join 2,400+ teams</div>
              <div style={{ fontSize: ".72rem", color: "var(--text-3)" }}>already using TaskFlow</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
