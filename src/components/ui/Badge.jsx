export default function Badge({ children, variant = "default", size = "md" }) {
  const variants = {
    default:  { background: "var(--surface-2)",      color: "var(--text-2)" },
    accent:   { background: "var(--acc-light)",      color: "var(--acc)" },
    success:  { background: "var(--success-light)",  color: "var(--success)" },
    warning:  { background: "var(--warning-light)",  color: "var(--warning)" },
    danger:   { background: "var(--danger-light)",   color: "var(--danger)" },
    teal:     { background: "var(--teal-light)",     color: "var(--teal)" },
  };

  const sizes = {
    sm: { fontSize: ".65rem", padding: "2px 8px" },
    md: { fontSize: ".72rem", padding: "3px 10px" },
  };

  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      borderRadius: "20px", fontWeight: 500,
      letterSpacing: ".04em", textTransform: "uppercase",
      ...variants[variant], ...sizes[size]
    }}>
      {children}
    </span>
  );
}