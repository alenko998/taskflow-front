export default function TopBar({ title, subtitle, actions }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      marginBottom: 32,
    }}>
      <div>
        <h1 style={{
          fontFamily: "var(--fd)", fontSize: "1.6rem",
          fontWeight: 600, color: "var(--text)", marginBottom: 4,
        }}>
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: ".85rem", color: "var(--text-2)" }}>{subtitle}</p>
        )}
      </div>
      {actions && (
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {actions}
        </div>
      )}
    </div>
  );
}