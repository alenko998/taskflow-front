export default function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  onClick,
  type = "button",
  fullWidth = false,
  icon,
}) {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontFamily: "var(--fb)",
    fontWeight: 500,
    borderRadius: "var(--radius-sm)",
    border: "none",
    cursor: disabled || loading ? "not-allowed" : "pointer",
    transition: "all var(--t)",
    whiteSpace: "nowrap",
    width: fullWidth ? "100%" : "auto",
    opacity: disabled ? 0.5 : 1,
  };

  const sizes = {
    sm: { fontSize: ".75rem", padding: "6px 12px", letterSpacing: ".02em" },
    md: { fontSize: ".82rem", padding: "9px 18px", letterSpacing: ".02em" },
    lg: { fontSize: ".9rem",  padding: "12px 24px", letterSpacing: ".01em" },
  };

  const variants = {
    primary:  { background: "var(--acc)",     color: "#fff",          border: "1px solid transparent" },
    secondary:{ background: "var(--surface-2)",color: "var(--text)",  border: "1px solid var(--border-2)" },
    ghost:    { background: "transparent",     color: "var(--text-2)", border: "1px solid transparent" },
    danger:   { background: "var(--danger-light)", color: "var(--danger)", border: "1px solid rgba(239,68,68,.2)" },
    success:  { background: "var(--success-light)", color: "var(--success)", border: "1px solid rgba(16,185,129,.2)" },
    outline:  { background: "transparent",     color: "var(--acc)",    border: "1px solid var(--acc)" },
  };

  const hoverMap = {
    primary:   { background: "var(--acc-hover)" },
    secondary: { background: "var(--border)" },
    ghost:     { background: "var(--surface-2)", color: "var(--text)" },
    danger:    { background: "rgba(239,68,68,.2)" },
    success:   { background: "rgba(16,185,129,.2)" },
    outline:   { background: "var(--acc-light)" },
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      style={{ ...base, ...sizes[size], ...variants[variant] }}
      onMouseEnter={e => {
        if (!disabled && !loading) Object.assign(e.currentTarget.style, hoverMap[variant]);
      }}
      onMouseLeave={e => {
        if (!disabled && !loading) Object.assign(e.currentTarget.style, variants[variant]);
      }}
    >
      {loading ? (
        <>
          <span style={{
            width: 14, height: 14, border: "2px solid currentColor",
            borderTopColor: "transparent", borderRadius: "50%",
            animation: "spin .6s linear infinite", display: "inline-block"
          }} />
          {children}
        </>
      ) : (
        <>
          {icon && <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}