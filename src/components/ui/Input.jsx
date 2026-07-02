import { useState } from "react";

export default function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  hint,
  disabled = false,
  icon,
  rightIcon,
  fullWidth = true,
  id,
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, width: fullWidth ? "100%" : "auto" }}>
      {label && (
        <label htmlFor={id} style={{
          fontSize: ".75rem", fontWeight: 500, letterSpacing: ".04em",
          textTransform: "uppercase", color: "var(--text-2)"
        }}>
          {label}
        </label>
      )}
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        {icon && (
          <span style={{
            position: "absolute", left: 12, color: "var(--text-3)",
            display: "flex", alignItems: "center", pointerEvents: "none"
          }}>
            {icon}
          </span>
        )}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            background: "var(--surface)",
            border: `1px solid ${error ? "var(--danger)" : focused ? "var(--acc)" : "var(--border-2)"}`,
            borderRadius: "var(--radius-sm)",
            color: "var(--text)",
            fontFamily: "var(--fb)",
            fontSize: ".9rem",
            fontWeight: 300,
            padding: `10px ${rightIcon ? "40px" : "14px"} 10px ${icon ? "40px" : "14px"}`,
            outline: "none",
            transition: "border-color var(--t)",
            opacity: disabled ? 0.5 : 1,
            cursor: disabled ? "not-allowed" : "text",
          }}
        />
        {rightIcon && (
          <span style={{
            position: "absolute", right: 12, color: "var(--text-3)",
            display: "flex", alignItems: "center", cursor: "pointer"
          }}>
            {rightIcon}
          </span>
        )}
      </div>
      {error && <p style={{ fontSize: ".78rem", color: "var(--danger)" }}>{error}</p>}
      {hint && !error && <p style={{ fontSize: ".78rem", color: "var(--text-3)" }}>{hint}</p>}
    </div>
  );
}